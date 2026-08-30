const assert = require('node:assert/strict');
const test = require('node:test');

const contract = require('../js/search-release-contract.js');

const proposal = Object.freeze({
    proposal_id: 'retrieval-proposal-abcdef123456',
    proposal_revision: 'a'.repeat(64)
});
const actionId = '12345678-1234-4abc-8def-1234567890ab';
const response = (status, payload) => ({
    status,
    ok: status >= 200 && status < 300,
    json: async () => payload
});

test('exports the complete release lifecycle and stable API paths', () => {
    assert.deepEqual(contract.LIFECYCLE_STATES, [
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
    assert.equal(contract.API_PATHS.releaseSession, '/agent/retrieval/release/session');
    assert.equal(contract.API_PATHS.releaseDecision, '/agent/retrieval/release/decision');
    assert.equal(contract.API_PATHS.releaseRollback, '/agent/retrieval/release/rollback');
    assert.equal(contract.API_PATHS.activeSearch, '/catalog/search/active');
});

test('creates a revision-bound release session without putting a token in the request', async () => {
    const calls = [];
    const payload = {
        csrf_token: 'test-only-csrf',
        expires_at: '2026-08-30T12:00:00Z',
        ...proposal
    };
    const result = await contract.createReleaseSession(async (url, init) => {
        calls.push({ url, init });
        return response(200, payload);
    }, '/search-eval-api', proposal);
    assert.equal(result.csrf_token, 'test-only-csrf');
    assert.equal(calls[0].url, '/search-eval-api/agent/retrieval/release/session');
    assert.deepEqual(JSON.parse(calls[0].init.body), proposal);
    assert.doesNotMatch(calls[0].init.body, /csrf|token|password|authorization/i);
});

test('approve decision binds revision, UUID and approval token header', async () => {
    const calls = [];
    const payload = {
        ...proposal,
        lifecycle: 'active',
        release: { ...proposal, lifecycle: 'active', strategy_revision: 'b'.repeat(64) },
        active_retrieval_release: {
            strategy_id: 'retrieval-active-v1',
            strategy_revision: 'b'.repeat(64),
            index_id: 'catalog-index-20260830',
            health: 'ready',
            rollout: '100%'
        }
    };
    const projection = await contract.submitReleaseDecision(async (url, init) => {
        calls.push({ url, init });
        return response(200, payload);
    }, '/search-eval-api', proposal, 'approve', actionId, 'test-only-csrf');
    assert.equal(projection.lifecycle, 'active');
    assert.equal(projection.active.index_id, 'catalog-index-20260830');
    assert.equal(calls[0].url, '/search-eval-api/agent/retrieval/release/decision');
    assert.equal(calls[0].init.headers['X-Search-Approval-Token'], 'test-only-csrf');
    assert.deepEqual(JSON.parse(calls[0].init.body), { ...proposal, decision: 'approve', client_action_id: actionId });
    assert.doesNotMatch(calls[0].init.body, /csrf|approval.token|authorization/i);
});

test('reject and rollback accept only their matching terminal lifecycle', async () => {
    const rejected = await contract.submitReleaseDecision(
        async () => response(200, { ...proposal, lifecycle: 'rejected' }),
        '/search-eval-api', proposal, 'reject', actionId, 'test-only-csrf'
    );
    assert.equal(rejected.lifecycle, 'rejected');

    const calls = [];
    const rolledBack = await contract.submitRollback(async (url, init) => {
        calls.push({ url, init });
        return response(200, { ...proposal, lifecycle: 'rolled_back', active: { strategy_revision: 'c'.repeat(64) } });
    }, '/search-eval-api', proposal, 'b'.repeat(64), 'c'.repeat(64), actionId, 'test-only-csrf');
    assert.equal(rolledBack.lifecycle, 'rolled_back');
    assert.deepEqual(JSON.parse(calls[0].init.body), {
        expected_active_revision: 'b'.repeat(64),
        target_revision: 'c'.repeat(64),
        client_action_id: actionId
    });

    await assert.rejects(
        contract.submitReleaseDecision(
            async () => response(200, { ...proposal, lifecycle: 'active' }),
            '/search-eval-api', proposal, 'reject', actionId, 'test-only-csrf'
        ),
        (error) => error.code === 'invalid_reject_lifecycle'
    );
});

test('rollback session explicitly binds the rollback action', async () => {
    let body;
    await contract.createReleaseSession(async (url, init) => {
        body = JSON.parse(init.body);
        return response(200, {
            ...proposal,
            csrf_token: 'test-only-csrf',
            expires_at: '2026-08-30T12:00:00Z'
        });
    }, '/search-eval-api', proposal, 'rollback');
    assert.deepEqual(body, { ...proposal, action: 'rollback' });
});

test('active readiness fails closed without a valid revision', () => {
    const ready = contract.normalizeReadiness({
        active_serving: {
            mode: 'active',
            ready: true,
            strategy_id: 'retrieval-active-v1',
            strategy_revision: 'd'.repeat(64),
            index_id: 'catalog-index-1',
            health: 'ready',
            rollout: { percent: 100 },
            error_code: null
        }
    });
    assert.equal(ready.ready, true);
    assert.equal(ready.strategy_revision, 'd'.repeat(64));
    assert.throws(
        () => contract.normalizeReadiness({ active_serving: { ready: true, strategy_revision: null } }),
        (error) => error.code === 'invalid_active_readiness'
    );
});

test('normalizes execution evidence for baseline and active search responses', () => {
    const active = contract.normalizeSearchResponse({
        product_count: 10,
        hits: [],
        execution: {
            lane: 'active',
            strategy_id: 'retrieval-active-v1',
            strategy_revision: 'e'.repeat(64),
            index_id: 'catalog-index-1',
            channels: { title_bm25: 10 }
        }
    }, 'active');
    assert.equal(active.execution.strategy_revision, 'e'.repeat(64));

    const baseline = contract.normalizeSearchResponse({
        product_count: 10,
        hits: [],
        strategy_id: 'catalog-baseline-v1',
        strategy_revision: null,
        index_id: 'catalog-index-1',
        channel_counts: { title_bm25: 10 }
    }, 'baseline');
    assert.equal(baseline.execution.lane, 'baseline');
    assert.equal(baseline.execution.strategy_revision, null);
});
