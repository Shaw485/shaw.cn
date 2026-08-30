(function initSearchReleaseContract(root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.SearchReleaseContract = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
    'use strict';

    const API_PATHS = Object.freeze({
        catalog: '/agent/strategy/catalog',
        health: '/health',
        activeSearch: '/catalog/search/active',
        baselineSearch: '/catalog/search',
        releaseSession: '/agent/retrieval/release/session',
        releaseDecision: '/agent/retrieval/release/decision',
        releaseRollback: '/agent/retrieval/release/rollback'
    });
    const LIFECYCLE_STATES = Object.freeze([
        'rejected_by_gate',
        'pending_owner_review',
        'rejected',
        'approved_for_validation',
        'validating',
        'validation_failed',
        'staged',
        'canary',
        'active',
        'rolled_back'
    ]);
    const LIFECYCLE_LABELS = Object.freeze({
        rejected_by_gate: '门禁拒绝',
        pending_owner_review: '等待 Owner 审批',
        rejected: 'Owner 已拒绝',
        approved_for_validation: '已批准，等待验证',
        validating: '正在验证',
        validation_failed: '验证失败',
        staged: '已暂存',
        canary: '灰度中',
        active: '当前生效',
        rolled_back: '已回滚'
    });
    const PROPOSAL_ID = /^retrieval-proposal-[0-9a-f]{12}$/;
    const REVISION = /^[0-9a-f]{64}$/;
    const CLIENT_ACTION_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

    class ReleaseContractError extends Error {
        constructor(code = 'invalid_release_response', status = 0) {
            super(code);
            this.name = 'ReleaseContractError';
            this.code = code;
            this.status = status;
        }
    }

    const fail = (code) => { throw new ReleaseContractError(code); };
    const object = (value, code = 'invalid_release_response') => (
        value && typeof value === 'object' && !Array.isArray(value) ? value : fail(code)
    );
    const text = (value, code = 'invalid_release_response') => (
        typeof value === 'string' && value.trim() ? value : fail(code)
    );
    const proposalId = (value) => PROPOSAL_ID.test(text(value)) ? value : fail('invalid_proposal_id');
    const revision = (value) => REVISION.test(text(value)) ? value : fail('invalid_proposal_revision');
    const lifecycle = (value) => LIFECYCLE_STATES.includes(value) ? value : fail('invalid_lifecycle');
    const optionalRevision = (value) => value === null || value === undefined ? null : revision(value);
    const apiUrl = (apiRoot, path) => `${String(apiRoot || '').replace(/\/$/, '')}${path}`;

    const validateProposalRef = (value) => {
        const item = object(value, 'invalid_proposal_ref');
        return Object.freeze({
            proposal_id: proposalId(item.proposal_id),
            proposal_revision: revision(item.proposal_revision)
        });
    };

    const validateReleaseSession = (value, expected) => {
        const item = object(value, 'invalid_release_session');
        const ref = validateProposalRef(item);
        const wanted = validateProposalRef(expected);
        if (ref.proposal_id !== wanted.proposal_id || ref.proposal_revision !== wanted.proposal_revision) {
            fail('release_session_ref_mismatch');
        }
        const csrfToken = text(item.csrf_token, 'invalid_release_session');
        const expiresAt = text(item.expires_at, 'invalid_release_session');
        if (Number.isNaN(new Date(expiresAt).getTime())) fail('invalid_release_session');
        return Object.freeze({ ...ref, csrf_token: csrfToken, expires_at: expiresAt });
    };

    const releaseProjection = (value, expected, action) => {
        const item = object(value);
        const release = item.release && typeof item.release === 'object' && !Array.isArray(item.release)
            ? item.release
            : {};
        const ref = validateProposalRef({
            proposal_id: item.proposal_id || release.proposal_id,
            proposal_revision: item.proposal_revision || release.proposal_revision
        });
        const wanted = validateProposalRef(expected);
        if (ref.proposal_id !== wanted.proposal_id || ref.proposal_revision !== wanted.proposal_revision) {
            fail('release_decision_ref_mismatch');
        }
        const state = lifecycle(item.lifecycle || release.lifecycle);
        if (action === 'reject' && state !== 'rejected') fail('invalid_reject_lifecycle');
        if (action === 'approve' && ['rejected', 'rejected_by_gate', 'pending_owner_review'].includes(state)) {
            fail('invalid_approve_lifecycle');
        }
        if (action === 'rollback' && state !== 'rolled_back') fail('invalid_rollback_lifecycle');
        const active = item.active_retrieval_release || item.active || null;
        return Object.freeze({
            ...ref,
            lifecycle: state,
            release: Object.keys(release).length ? release : null,
            active: active && typeof active === 'object' && !Array.isArray(active) ? active : null,
            raw: item
        });
    };

    const requestJson = async (fetchImpl, url, init, errorPrefix) => {
        const response = await fetchImpl(url, init);
        if (!response.ok) throw new ReleaseContractError(`${errorPrefix}_http_${response.status}`, response.status);
        try {
            return await response.json();
        } catch (_) {
            throw new ReleaseContractError(`${errorPrefix}_invalid_json`, response.status);
        }
    };

    const createReleaseSession = async (fetchImpl, apiRoot, expected, action = 'decision') => {
        const ref = validateProposalRef(expected);
        const body = action === 'rollback' ? { ...ref, action: 'rollback' } : ref;
        const payload = await requestJson(fetchImpl, apiUrl(apiRoot, API_PATHS.releaseSession), {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }, 'release_session');
        return validateReleaseSession(payload, ref);
    };

    const submitReleaseDecision = async (fetchImpl, apiRoot, expected, decision, clientActionId, csrfToken) => {
        const ref = validateProposalRef(expected);
        if (!['approve', 'reject'].includes(decision)) fail('invalid_release_decision');
        if (!CLIENT_ACTION_ID.test(text(clientActionId, 'invalid_client_action_id'))) fail('invalid_client_action_id');
        text(csrfToken, 'invalid_approval_token');
        const payload = await requestJson(fetchImpl, apiUrl(apiRoot, API_PATHS.releaseDecision), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Search-Approval-Token': csrfToken
            },
            body: JSON.stringify({ ...ref, decision, client_action_id: clientActionId })
        }, 'release_decision');
        return releaseProjection(payload, ref, decision);
    };

    const submitRollback = async (fetchImpl, apiRoot, expected, expectedActiveRevision, targetRevision, clientActionId, csrfToken) => {
        const ref = validateProposalRef(expected);
        const expectedRevision = revision(expectedActiveRevision);
        const rollbackTarget = revision(targetRevision);
        if (expectedRevision === rollbackTarget) fail('invalid_rollback_target');
        if (!CLIENT_ACTION_ID.test(text(clientActionId, 'invalid_client_action_id'))) fail('invalid_client_action_id');
        text(csrfToken, 'invalid_approval_token');
        const payload = await requestJson(fetchImpl, apiUrl(apiRoot, API_PATHS.releaseRollback), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Search-Approval-Token': csrfToken
            },
            body: JSON.stringify({
                expected_active_revision: expectedRevision,
                target_revision: rollbackTarget,
                client_action_id: clientActionId
            })
        }, 'release_rollback');
        return releaseProjection(payload, ref, 'rollback');
    };

    const normalizeReadiness = (value) => {
        const rootValue = object(value, 'invalid_health_response');
        const item = rootValue.active_serving
            || rootValue.active_retrieval_serving
            || rootValue.retrieval_active_serving
            || rootValue.serving?.active
            || {};
        const ready = item.ready === true;
        const strategyRevision = optionalRevision(item.strategy_revision || item.revision || null);
        if (ready && !strategyRevision) fail('invalid_active_readiness');
        return Object.freeze({
            ready,
            mode: typeof item.mode === 'string' && item.mode ? item.mode : (ready ? 'active' : 'baseline_only'),
            strategy_id: typeof item.strategy_id === 'string' && item.strategy_id ? item.strategy_id : null,
            strategy_revision: strategyRevision,
            index_id: typeof item.index_id === 'string' && item.index_id ? item.index_id : null,
            health: typeof item.health === 'string' && item.health ? item.health : (ready ? 'ready' : 'not_ready'),
            rollout: item.rollout ?? null,
            error_code: typeof item.error_code === 'string' && item.error_code ? item.error_code : null
        });
    };

    const normalizeSearchResponse = (value, expectedLane) => {
        const payload = object(value, 'invalid_search_response');
        if (!Array.isArray(payload.hits)) fail('invalid_search_response');
        const executionValue = payload.execution && typeof payload.execution === 'object'
            ? payload.execution
            : {
                lane: expectedLane,
                strategy_id: payload.strategy_id,
                strategy_revision: payload.strategy_revision,
                index_id: payload.index_id,
                channels: payload.channel_counts
            };
        const lane = text(executionValue.lane || expectedLane, 'invalid_search_execution');
        if (lane !== expectedLane) fail('search_lane_mismatch');
        const strategyRevision = optionalRevision(executionValue.strategy_revision);
        if (expectedLane === 'active' && !strategyRevision) fail('invalid_active_search_execution');
        return Object.freeze({
            payload,
            hits: payload.hits,
            product_count: Number(payload.product_count) || 0,
            execution: Object.freeze({
                lane,
                strategy_id: text(executionValue.strategy_id, 'invalid_search_execution'),
                strategy_revision: strategyRevision,
                index_id: text(executionValue.index_id, 'invalid_search_execution'),
                channels: executionValue.channels && typeof executionValue.channels === 'object'
                    ? executionValue.channels
                    : {}
            })
        });
    };

    return Object.freeze({
        API_PATHS,
        CLIENT_ACTION_ID,
        LIFECYCLE_LABELS,
        LIFECYCLE_STATES,
        PROPOSAL_ID,
        REVISION,
        ReleaseContractError,
        createReleaseSession,
        lifecycleLabel: (state) => LIFECYCLE_LABELS[state] || state,
        normalizeReadiness,
        normalizeSearchResponse,
        releaseProjection,
        submitReleaseDecision,
        submitRollback,
        validateProposalRef,
        validateReleaseSession
    });
}));
