document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const apiRoot = '/search-eval-api';
    const authApi = window.SearchAgentAuth;
    const releaseApi = window.SearchReleaseContract;
    const diagnostics = window.SearchUiDiagnostics;
    const form = document.getElementById('ownerLoginForm');
    const proposalInput = document.getElementById('ownerProposalInput');
    const revisionInput = document.getElementById('ownerRevisionInput');
    const usernameInput = document.getElementById('ownerUsername');
    const passwordInput = document.getElementById('ownerPassword');
    const loginButton = document.getElementById('ownerLoginButton');
    const loginStatus = document.getElementById('ownerLoginStatus');
    const decisionPanel = document.getElementById('ownerDecisionPanel');
    const decisionActions = document.getElementById('ownerDecisionActions');
    const rollbackActions = document.getElementById('ownerRollbackActions');
    const rollbackFields = document.getElementById('ownerRollbackFields');
    const expectedActiveInput = document.getElementById('ownerExpectedActiveRevision');
    const targetRevisionInput = document.getElementById('ownerTargetRevision');
    const approveButton = document.getElementById('ownerApproveButton');
    const rejectButton = document.getElementById('ownerRejectButton');
    const rollbackButton = document.getElementById('ownerRollbackButton');
    const operationResult = document.getElementById('ownerOperationResult');
    const lifecycleTrack = document.getElementById('ownerLifecycle');
    const query = new URLSearchParams(window.location.search);
    const actionMode = query.get('action') === 'rollback' ? 'rollback' : 'decision';
    let authSession = null;
    let approvalSession = null;
    let proposalRef = null;

    const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[character]));

    const errorMessage = (error) => ({
        invalid_proposal_id: 'Proposal ID 格式不正确。',
        invalid_proposal_revision: 'Proposal revision 必须是 64 位小写 SHA-256。',
        credentials_rejected: 'Owner 账号或密码不正确。',
        auth_timeout: '身份验证超时，请重试。',
        auth_network_error: '身份验证服务暂时不可用。',
        invalid_validation_response: '身份验证证据不完整，本次会话已拒绝。',
        release_session_ref_mismatch: '服务器返回的候选引用与当前页面不一致。',
        release_decision_ref_mismatch: '服务器返回的决策引用与当前候选不一致。',
        invalid_rollback_target: '回滚目标不能与当前 active revision 相同。'
    }[error?.code] || (Number(error?.status) === 409
        ? '候选或 active revision 已变化，请返回策略平台刷新后重试。'
        : Number(error?.status) === 401 || Number(error?.status) === 403
            ? 'Owner 会话已失效或权限不足，请重新验证。'
            : '操作失败且未改变发布状态，请稍后重试。'));

    const setLoginStatus = (text, type = '') => {
        loginStatus.textContent = text;
        loginStatus.className = `owner-inline-status${type ? ` is-${type}` : ''}`;
    };

    const renderLifecycle = (state) => {
        lifecycleTrack.querySelectorAll('[data-lifecycle]').forEach((item) => {
            const current = item.dataset.lifecycle === state;
            item.classList.toggle('is-current', current);
            if (current) item.setAttribute('aria-current', 'step');
            else item.removeAttribute('aria-current');
        });
    };

    const setActionDisabled = (disabled) => {
        approveButton.disabled = disabled;
        rejectButton.disabled = disabled;
        rollbackButton.disabled = disabled;
    };

    const operationMetadata = (projection) => {
        const release = projection?.release || {};
        const active = projection?.active || {};
        const values = [
            ['Lifecycle', releaseApi.lifecycleLabel(projection?.lifecycle || '—')],
            ['Strategy revision', active.strategy_revision || release.strategy_revision || '—'],
            ['Index', active.index_id || release.index_id || '—'],
            ['Health', active.health || release.health || '—'],
            ['Rollout', active.rollout ?? release.rollout ?? '—']
        ];
        return `<div class="owner-result-meta">${values.map(([label, value]) => `<span><b>${escapeHtml(label)}</b><br>${escapeHtml(typeof value === 'object' ? JSON.stringify(value) : value)}</span>`).join('')}</div>`;
    };

    const renderResult = (projection) => {
        renderLifecycle(projection.lifecycle);
        operationResult.className = 'owner-operation-result is-success';
        operationResult.innerHTML = `<strong>${escapeHtml(releaseApi.lifecycleLabel(projection.lifecycle))}</strong><p>服务器已受理并返回真实发布状态。只有 lifecycle 为“当前生效”时，搜索对照页才会启用 active lane。</p>${operationMetadata(projection)}`;
    };

    const failOperation = (error, module, event) => {
        operationResult.className = 'owner-operation-result is-error';
        operationResult.innerHTML = `<strong>操作未执行</strong><p>${escapeHtml(errorMessage(error))}</p>`;
        setActionDisabled(false);
        diagnostics?.log(module, 'warn', event, {
            errorCode: error?.code || 'operation_failed',
            statusCode: Number(error?.status) || 0,
            proposalId: proposalRef?.proposal_id || null,
            proposalRevision: proposalRef?.proposal_revision || null
        });
    };

    const safeActionId = () => {
        const value = window.crypto?.randomUUID?.();
        if (!value || !releaseApi.CLIENT_ACTION_ID.test(value)) {
            throw new releaseApi.ReleaseContractError('client_action_id_unavailable');
        }
        return value;
    };

    const readProposalRef = () => releaseApi.validateProposalRef({
        proposal_id: proposalInput.value.trim(),
        proposal_revision: revisionInput.value.trim()
    });

    const setupFromUrl = () => {
        proposalInput.value = query.get('proposal_id') || '';
        revisionInput.value = query.get('proposal_revision') || '';
        if (actionMode === 'rollback') {
            rollbackFields.hidden = false;
            expectedActiveInput.required = true;
            targetRevisionInput.required = true;
            expectedActiveInput.value = query.get('expected_active_revision') || '';
            targetRevisionInput.value = query.get('target_revision') || '';
            loginButton.textContent = '验证身份并加载回滚会话';
        }
    };

    const buildAuthSession = () => authApi.createSession({
        fetchImpl: window.fetch.bind(window),
        validationUrl: '/search-agent-auth-check.json',
        baseUrl: window.location.href,
        allowedRequestPaths: [
            `${apiRoot}${releaseApi.API_PATHS.releaseSession}`,
            `${apiRoot}${releaseApi.API_PATHS.releaseDecision}`,
            `${apiRoot}${releaseApi.API_PATHS.releaseRollback}`
        ],
        onEvent: (event, context) => diagnostics?.log('owner-auth-ui', event.includes('failed') ? 'warn' : 'debug', event, context)
    });

    const openApprovalSession = async (event) => {
        event.preventDefault();
        loginButton.disabled = true;
        setLoginStatus('正在验证身份…');
        try {
            proposalRef = readProposalRef();
            if (actionMode === 'rollback') {
                if (!releaseApi.REVISION.test(expectedActiveInput.value.trim())
                    || !releaseApi.REVISION.test(targetRevisionInput.value.trim())) {
                    throw new releaseApi.ReleaseContractError('invalid_proposal_revision');
                }
            }
            authSession = buildAuthSession();
            await authSession.authenticate(usernameInput.value, passwordInput.value);
            usernameInput.value = '';
            passwordInput.value = '';
            approvalSession = await releaseApi.createReleaseSession(
                authSession.fetch,
                apiRoot,
                proposalRef,
                actionMode
            );
            setLoginStatus('身份已验证，短期会话已创建。', 'success');
            document.getElementById('ownerActionMode').textContent = actionMode === 'rollback' ? '一键回滚' : '候选审批';
            document.getElementById('ownerProposalId').textContent = proposalRef.proposal_id;
            document.getElementById('ownerProposalRevision').textContent = proposalRef.proposal_revision;
            document.getElementById('ownerSessionExpiry').textContent = new Date(approvalSession.expires_at).toLocaleString('zh-CN', { hour12: false });
            decisionActions.hidden = actionMode === 'rollback';
            rollbackActions.hidden = actionMode !== 'rollback';
            decisionPanel.hidden = false;
            renderLifecycle(actionMode === 'rollback' ? 'active' : 'pending_owner_review');
            diagnostics?.log(actionMode === 'rollback' ? 'owner-rollback-ui' : 'owner-decision-ui', 'debug', 'approval_session_ready', {
                proposalId: proposalRef.proposal_id,
                proposalRevision: proposalRef.proposal_revision,
                actionMode,
                expiresAt: approvalSession.expires_at
            });
            decisionPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (error) {
            usernameInput.value = '';
            passwordInput.value = '';
            authSession?.clear('session_setup_failed');
            authSession = null;
            approvalSession = null;
            setLoginStatus(errorMessage(error), 'error');
            diagnostics?.log('owner-auth-ui', 'warn', 'approval_session_failed', {
                errorCode: error?.code || 'session_setup_failed',
                statusCode: Number(error?.status) || 0,
                actionMode
            });
        } finally {
            loginButton.disabled = false;
        }
    };

    const decide = async (decision) => {
        if (!authSession || !approvalSession || !proposalRef) return;
        setActionDisabled(true);
        operationResult.className = 'owner-operation-result';
        operationResult.innerHTML = `<strong>${decision === 'approve' ? '正在验证并自动发布…' : '正在提交拒绝…'}</strong><p>请勿重复点击；服务器会校验 revision、短期 token 与幂等 action ID。</p>`;
        diagnostics?.log('owner-decision-ui', 'debug', 'release_decision_requested', {
            proposalId: proposalRef.proposal_id,
            proposalRevision: proposalRef.proposal_revision,
            decision
        });
        try {
            const projection = await releaseApi.submitReleaseDecision(
                authSession.fetch,
                apiRoot,
                proposalRef,
                decision,
                safeActionId(),
                approvalSession.csrf_token
            );
            renderResult(projection);
            diagnostics?.log('owner-decision-ui', 'debug', 'release_decision_succeeded', {
                proposalId: proposalRef.proposal_id,
                proposalRevision: proposalRef.proposal_revision,
                decision,
                lifecycle: projection.lifecycle,
                activePresent: Boolean(projection.active)
            });
            approvalSession = null;
            authSession.clear('decision_complete');
            authSession = null;
        } catch (error) {
            failOperation(error, 'owner-decision-ui', 'release_decision_failed');
        }
    };

    const rollback = async () => {
        if (!authSession || !approvalSession || !proposalRef) return;
        setActionDisabled(true);
        operationResult.className = 'owner-operation-result';
        operationResult.innerHTML = '<strong>正在执行原子回滚…</strong><p>服务器会拒绝任何 active revision 已变化的请求。</p>';
        diagnostics?.log('owner-rollback-ui', 'debug', 'release_rollback_requested', {
            proposalId: proposalRef.proposal_id,
            proposalRevision: proposalRef.proposal_revision,
            expectedActiveRevision: expectedActiveInput.value.trim(),
            targetRevision: targetRevisionInput.value.trim()
        });
        try {
            const projection = await releaseApi.submitRollback(
                authSession.fetch,
                apiRoot,
                proposalRef,
                expectedActiveInput.value.trim(),
                targetRevisionInput.value.trim(),
                safeActionId(),
                approvalSession.csrf_token
            );
            renderResult(projection);
            diagnostics?.log('owner-rollback-ui', 'debug', 'release_rollback_succeeded', {
                proposalId: proposalRef.proposal_id,
                proposalRevision: proposalRef.proposal_revision,
                lifecycle: projection.lifecycle
            });
            approvalSession = null;
            authSession.clear('rollback_complete');
            authSession = null;
        } catch (error) {
            failOperation(error, 'owner-rollback-ui', 'release_rollback_failed');
        }
    };

    form.addEventListener('submit', openApprovalSession);
    approveButton.addEventListener('click', () => decide('approve'));
    rejectButton.addEventListener('click', () => decide('reject'));
    rollbackButton.addEventListener('click', rollback);
    document.querySelector('.nav-toggle')?.addEventListener('click', (event) => {
        const links = document.querySelector('.nav-links');
        const open = links.classList.toggle('active');
        event.currentTarget.classList.toggle('active', open);
        event.currentTarget.setAttribute('aria-expanded', String(open));
    });

    setupFromUrl();
});
