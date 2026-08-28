document.addEventListener('DOMContentLoaded', () => {
    const isLocal = ['127.0.0.1', 'localhost'].includes(window.location.hostname);
    const apiRoot = isLocal ? 'http://127.0.0.1:8000' : '/search-eval-api';
    const form = document.getElementById('baselineSearchForm');
    const input = document.getElementById('baselineQuery');
    const optimizedInput = document.getElementById('optimizedQuery');
    const meta = document.getElementById('baselineMeta');
    const state = document.getElementById('baselineState');
    const results = document.getElementById('baselineResults');
    const logStore = window.SearchConsoleStore;
    const agentDecisionState = document.getElementById('agentDecisionState');
    const agentApproveStrategy = document.getElementById('agentApproveStrategy');
    const agentRejectStrategy = document.getElementById('agentRejectStrategy');
    let activeRequest = null;
    let activeLogId = null;

    const productVisuals = [
        ['📦', '#edf0f2'], ['⌨️', '#eef0ea'], ['🎧', '#ece9f4'],
        ['🔌', '#edf4f2'], ['▣', '#f5eeee'], ['🖱️', '#e9f2f7'],
        ['🔋', '#f5eddc'], ['⌚', '#e8edf2'], ['🏠', '#edf3ed']
    ];

    const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char]));

    const enabledDebugModules = () => new Set(
        (localStorage.getItem('shaw.debug.search-console.modules') || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
    );

    const debug = (event, context = {}) => {
        if (localStorage.getItem('shaw.debug.search-console') !== '1') return;
        const modules = enabledDebugModules();
        if (modules.size && !modules.has('search-ui')) return;
        console.debug('[search-console:search-ui]', {
            timestamp: new Date().toISOString(),
            event,
            ...context
        });
    };

    const agentDebug = (event, context = {}) => {
        if (localStorage.getItem('shaw.debug.search-console') !== '1') return;
        const modules = enabledDebugModules();
        if (modules.size && !modules.has('agent-ui')) return;
        console.debug('[search-console:agent-ui]', {
            timestamp: new Date().toISOString(),
            event,
            ...context
        });
    };

    const visualFor = (productId) => {
        const hash = Array.from(String(productId || '')).reduce(
            (value, character) => ((value * 31) + character.charCodeAt(0)) >>> 0,
            0
        );
        return productVisuals[hash % productVisuals.length];
    };

    const setLoading = () => {
        state.hidden = false;
        state.className = 'result-state';
        state.innerHTML = '<span class="state-spinner"></span><p>正在搜索商品…</p>';
        results.innerHTML = '';
        meta.textContent = '正在搜索…';
    };

    const setError = (message) => {
        state.hidden = false;
        state.className = 'result-state error';
        state.innerHTML = `<strong>搜索失败</strong><p>${escapeHtml(message)}</p><button type="button" id="retryBaseline">重试</button>`;
        results.innerHTML = '';
        meta.textContent = '服务暂时不可用';
        document.getElementById('retryBaseline')?.addEventListener('click', () => runSearch(input.value));
    };

    const renderProducts = (hits) => {
        state.hidden = true;
        if (!hits.length) {
            results.innerHTML = '<div class="empty-results"><strong>没有匹配商品</strong><p>请换一个商品名或商品 ID 再试。</p></div>';
            return;
        }
        results.innerHTML = hits.map((hit) => {
            const product = hit.product || {};
            const [emoji, bg] = visualFor(product.product_id);
            const locale = String(product.locale || '').toUpperCase();
            const identity = [locale ? `Amazon ${locale}` : 'Amazon', product.product_id]
                .filter(Boolean)
                .join(' · ');
            return `<article class="result-card">
                <div class="result-rank">#${Number(hit.rank) || '—'}</div>
                <div class="result-visual" style="--product-bg:${bg}" aria-hidden="true">${emoji}</div>
                <div class="result-copy">
                    <p class="result-category">${escapeHtml(identity)}</p>
                    <h3>${escapeHtml(product.title || '未命名商品')}</h3>
                    <p class="result-brand">${escapeHtml(product.brand || '品牌未标注')}</p>
                    <p class="result-description">${escapeHtml(product.color ? `颜色：${product.color}` : `商品 ID：${product.product_id || '—'}`)}</p>
                </div>
                <div class="result-score"><span>BM25</span><strong>${Number(hit.score || 0).toFixed(4)}</strong></div>
            </article>`;
        }).join('');
    };

    const completeAbortedLog = () => {
        if (!activeLogId) return;
        logStore?.event(activeLogId, {
            stage: 'request',
            event: 'aborted',
            status: 'aborted',
            detail: '被新的搜索请求替代'
        });
        logStore?.complete(activeLogId, { status: 'aborted', errorCode: 'superseded' });
    };

    const runSearch = async (rawQuery) => {
        const query = rawQuery.trim();
        if (!query) return;
        if (activeRequest) {
            activeRequest.abort();
            completeAbortedLog();
        }

        const requestController = new AbortController();
        activeRequest = requestController;
        input.value = query;
        optimizedInput.value = query;
        setLoading();
        const logId = logStore?.start({
            query,
            backend: 'sqlite-fts5',
            topK: 10,
            source: 'search-eval'
        });
        activeLogId = logId || null;
        logStore?.event(logId, {
            stage: 'query',
            event: 'normalized',
            detail: '完成首尾空白清理，保留原始语义'
        });
        const started = performance.now();
        debug('catalog_search_started', { logId, backend: 'sqlite-fts5', topK: 10 });

        try {
            logStore?.event(logId, {
                stage: 'retrieval',
                event: 'request_sent',
                detail: '向全量商品 BM25 基线发送检索请求'
            });
            const response = await fetch(`${apiRoot}/catalog/search`, {
                method: 'POST',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, top_k: 10 }),
                signal: requestController.signal
            });
            const requestId = response.headers.get('X-Request-ID');
            if (!response.ok) {
                const requestError = new Error(
                    response.status === 400 ? '请输入有效的商品关键词' : '搜索服务暂时不可用'
                );
                requestError.status = response.status;
                requestError.requestId = requestId;
                throw requestError;
            }

            const payload = await response.json();
            const hits = Array.isArray(payload.hits) ? payload.hits : [];
            const productCount = Number(payload.product_count) || 0;
            const elapsed = Math.round(performance.now() - started);
            meta.textContent = `${hits.length} 个结果 · ${productCount.toLocaleString('zh-CN')} 件商品 · ${elapsed} ms`;
            logStore?.event(logId, {
                stage: 'retrieval',
                event: 'response_received',
                detail: `BM25 返回 ${hits.length} 个候选结果`
            });
            renderProducts(hits);
            logStore?.event(logId, {
                stage: 'presentation',
                event: 'results_rendered',
                detail: `页面完成 ${hits.length} 个结果渲染`
            });
            logStore?.complete(logId, {
                status: 'success',
                requestId,
                durationMs: elapsed,
                resultCount: hits.length,
                topProductIds: hits
                    .slice(0, 10)
                    .map((hit) => hit.product?.product_id)
                    .filter(Boolean)
            });
            debug('catalog_search_completed', {
                logId,
                requestId,
                durationMs: elapsed,
                resultCount: hits.length
            });
        } catch (error) {
            if (error.name === 'AbortError') return;
            const elapsed = Math.round(performance.now() - started);
            const status = Number(error.status) || null;
            const requestId = error.requestId || null;
            const errorCode = status ? `http_${status}` : 'network_error';
            logStore?.event(logId, {
                stage: 'request',
                event: 'failed',
                status: 'error',
                detail: errorCode
            });
            logStore?.complete(logId, {
                status: 'error',
                requestId,
                durationMs: elapsed,
                errorCode
            });
            console.warn('[search-console:search-ui]', {
                timestamp: new Date().toISOString(),
                event: 'catalog_search_failed',
                logId,
                requestId,
                durationMs: elapsed,
                errorCode
            });
            setError(status === 400 ? '请输入有效的商品关键词' : '搜索服务暂时不可用，请稍后重试。');
        } finally {
            if (activeRequest === requestController) {
                activeRequest = null;
                activeLogId = null;
            }
        }
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        runSearch(input.value);
    });

    const setAgentDecision = (decision) => {
        if (!agentDecisionState) return;
        agentDecisionState.classList.remove('is-approved', 'is-rejected');
        if (decision === 'approved') {
            agentDecisionState.textContent = 'Approved demo';
            agentDecisionState.classList.add('is-approved');
        } else {
            agentDecisionState.textContent = 'Rejected demo';
            agentDecisionState.classList.add('is-rejected');
        }
        agentDebug('strategy_decision_previewed', { decision });
    };

    agentApproveStrategy?.addEventListener('click', () => setAgentDecision('approved'));
    agentRejectStrategy?.addEventListener('click', () => setAgentDecision('rejected'));

    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    navToggle?.addEventListener('click', () => {
        const open = navLinks.classList.toggle('active');
        navToggle.classList.toggle('active', open);
        navToggle.setAttribute('aria-expanded', String(open));
    });

    runSearch(input.value);
});
