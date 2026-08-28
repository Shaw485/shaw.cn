document.addEventListener('DOMContentLoaded', () => {
    const isLocal = ['127.0.0.1', 'localhost'].includes(window.location.hostname);
    const apiRoot = isLocal ? 'http://127.0.0.1:8000' : '/search-eval-api';
    const startButton = document.getElementById('agentStartAnalysis');
    const decisionState = document.getElementById('agentDecisionState');
    const strategyName = document.getElementById('agentStrategyName');
    const proposalGrid = document.getElementById('agentProposalGrid');
    const evidenceStrip = document.getElementById('agentEvidenceStrip');

    const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[character]));

    const enabledDebugModules = () => new Set(
        (localStorage.getItem('shaw.debug.search-console.modules') || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
    );

    const debug = (event, context = {}) => {
        if (localStorage.getItem('shaw.debug.search-console') !== '1') return;
        const modules = enabledDebugModules();
        if (modules.size && !modules.has('agent-ui')) return;
        console.debug('[search-console:agent-ui]', {
            timestamp: new Date().toISOString(),
            event,
            ...context
        });
    };

    const setState = (label, className = '') => {
        if (!decisionState) return;
        decisionState.classList.remove('is-running', 'is-error', 'is-pending');
        decisionState.textContent = label;
        if (className) decisionState.classList.add(className);
    };

    const formatDelta = (value) => {
        const number = Number(value);
        if (!Number.isFinite(number)) return '—';
        return `${number > 0 ? '+' : ''}${number.toFixed(4)}`;
    };

    const formatMetric = (value) => {
        const number = Number(value);
        return Number.isFinite(number) ? number.toFixed(4) : '—';
    };

    const summarizeTopProducts = (products) => {
        const rows = Array.isArray(products) ? products.slice(0, 3) : [];
        if (!rows.length) return '暂无 Top 商品证据。';
        return rows
            .map((item) => `#${item.rank || '—'} ${item.product_id || '—'} / ${item.label || '—'}`)
            .join('；');
    };

    const renderProposal = (proposal) => {
        const metrics = proposal?.evidence?.aggregate_metrics || {};
        const ndcg = metrics['ndcg@10'] || {};
        const outcome = proposal?.evidence?.outcome_counts?.['ndcg@10'] || {};
        const badCase = proposal?.evidence?.bad_cases?.[0] || null;
        const improvement = proposal?.evidence?.improvements?.[0] || null;
        const regressionCount = Number(outcome.regressed) || 0;
        const proposedStrategy = proposal?.strategy?.catalog_entry || {};
        const proposedStrategyName = proposedStrategy.name || '候选策略';
        const recommendation = proposal?.agent_summary?.recommendation || 'continue_experiment';

        strategyName.textContent = proposedStrategyName;
        setState('Pending', 'is-pending');
        proposalGrid.innerHTML = `
            <div>
                <span>Bad Case 样本</span>
                <strong>${escapeHtml(badCase?.query_text || '未返回样本')}</strong>
                <p>优化前：${escapeHtml(summarizeTopProducts(badCase?.top_baseline))}<br>候选后：${escapeHtml(summarizeTopProducts(badCase?.top_candidate))}</p>
            </div>
            <div>
                <span>候选策略</span>
                <strong>${escapeHtml(proposedStrategyName)}</strong>
                <p>${escapeHtml(proposedStrategy.description || '等待 Agent 返回策略说明。')}</p>
            </div>
            <div>
                <span>指标变化</span>
                <strong class="${Number(ndcg.delta) >= 0 ? 'metric-up' : 'metric-risk'}">nDCG@10 ${escapeHtml(formatDelta(ndcg.delta))}</strong>
                <p>Baseline ${escapeHtml(formatMetric(ndcg.baseline))} → Candidate ${escapeHtml(formatMetric(ndcg.candidate))}；建议：${escapeHtml(recommendation)}</p>
            </div>
            <div>
                <span>退化与风险</span>
                <strong class="${regressionCount ? 'metric-risk' : 'metric-up'}">${regressionCount} 个 Query 退化</strong>
                <p>${escapeHtml(improvement ? `最大改善样本：${improvement.query_text}，Δ ${formatDelta(improvement['ndcg@10_delta'])}` : '本轮没有明显改善样本，建议拒绝或继续实验。')}</p>
            </div>`;
        evidenceStrip.innerHTML = `
            <span>${escapeHtml(proposal?.baseline_run_id || 'Baseline Run')}</span>
            <span>${escapeHtml(proposal?.candidate_run_id || 'Candidate Run')}</span>
            <span>${escapeHtml(proposal?.comparison_id || 'Comparison')}</span>
            <span>${escapeHtml(proposal?.proposal_id || 'Proposal')}</span>`;
        debug('strategy_proposal_rendered', {
            proposalId: proposal?.proposal_id || null,
            recommendation,
            regressionCount
        });
    };

    const renderLoading = () => {
        strategyName.textContent = 'Agent 正在找 Bad Case';
        setState('Running', 'is-running');
        proposalGrid.innerHTML = `
            <div><span>Bad Case 样本</span><strong>分析中…</strong><p>正在跑 baseline 与候选策略。</p></div>
            <div><span>候选策略</span><strong>分析中…</strong><p>正在从受控策略空间生成一个可解释候选。</p></div>
            <div><span>指标变化</span><strong>计算中…</strong><p>Harness 正在比较同一批 Query 的两个 Run。</p></div>
            <div><span>局部风险</span><strong>扫描中…</strong><p>正在检查退化 Query，避免只看平均分。</p></div>`;
    };

    const renderError = (message) => {
        strategyName.textContent = 'Agent 分析失败';
        setState('Error', 'is-error');
        proposalGrid.innerHTML = `<div class="proposal-full"><span>错误</span><strong>${escapeHtml(message)}</strong><p>本轮没有产生可审阅的 proposal，请按提示重试。</p></div>`;
    };

    const requestProposal = async () => {
        renderLoading();
        startButton.disabled = true;
        startButton.textContent = '分析中…';
        debug('strategy_proposal_requested');
        let errorCode = null;
        try {
            const response = await fetch(`${apiRoot}/agent/strategy/propose`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ profile: 'smoke' })
            });
            if (!response.ok) {
                errorCode = `http_${response.status}`;
                if (response.status === 401) {
                    renderError('登录状态已失效，请刷新页面并重新输入凭据');
                    return;
                }
                throw new Error(errorCode);
            }
            renderProposal(await response.json());
        } catch (error) {
            errorCode = errorCode || error.message || 'network_error';
            console.warn('[search-console:agent-ui]', {
                timestamp: new Date().toISOString(),
                event: 'strategy_proposal_failed',
                errorCode
            });
            renderError('策略分析服务暂时不可用，请稍后重试');
        } finally {
            startButton.disabled = false;
            startButton.textContent = '重新分析';
        }
    };

    startButton?.addEventListener('click', requestProposal);

    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    navToggle?.addEventListener('click', () => {
        const open = navLinks.classList.toggle('active');
        navToggle.classList.toggle('active', open);
        navToggle.setAttribute('aria-expanded', String(open));
    });
});
