document.addEventListener('DOMContentLoaded', () => {
    const isLocal = ['127.0.0.1', 'localhost'].includes(window.location.hostname);
    const apiRoot = isLocal ? 'http://127.0.0.1:8010' : '/search-eval-api';
    const form = document.getElementById('baselineSearchForm');
    const input = document.getElementById('baselineQuery');
    const optimizedInput = document.getElementById('optimizedQuery');
    const meta = document.getElementById('baselineMeta');
    const state = document.getElementById('baselineState');
    const results = document.getElementById('baselineResults');
    const logStore = window.SearchConsoleStore;
    let activeRequest = null;
    let activeLogId = null;

    const visuals = {
        p001: ['🖱️', '#e9f2f7'], p002: ['🖱️', '#f2eee8'], p003: ['🖱️', '#e8edf2'],
        p004: ['⌨️', '#eef0ea'], p005: ['▰', '#ece9f4'], p006: ['🔋', '#f5eddc'],
        p007: ['🖱️', '#edf0f4'], p008: ['🔌', '#edf4f2'], p009: ['▣', '#f5eeee'],
        p010: ['👟', '#edf3ed']
    };

    const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char]));

    const debug = (message, context = {}) => {
        if (localStorage.getItem('shaw.debug.search-console') !== '1') return;
        const modules = new Set((localStorage.getItem('shaw.debug.search-console.modules') || '').split(',').map((item) => item.trim()).filter(Boolean));
        if (modules.size && !modules.has('search-ui')) return;
        console.debug(`[search-console:search-ui] ${message}`, { timestamp: new Date().toISOString(), ...context });
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
            results.innerHTML = '<div class="empty-results"><strong>没有匹配商品</strong><p>请换一个英文商品名再试。</p></div>';
            return;
        }
        results.innerHTML = hits.map((hit) => {
            const product = hit.product;
            const [emoji, bg] = visuals[product.product_id] || ['📦', '#edf0f2'];
            return `<article class="result-card">
                <div class="result-rank">#${hit.rank}</div>
                <div class="result-visual" style="--product-bg:${bg}" aria-hidden="true">${emoji}</div>
                <div class="result-copy">
                    <p class="result-category">${escapeHtml(product.category)}</p>
                    <h3>${escapeHtml(product.title)}</h3>
                    <p class="result-brand">${escapeHtml(product.brand)}</p>
                    <p class="result-description">${escapeHtml(product.description)}</p>
                </div>
                <div class="result-score"><span>SCORE</span><strong>${Number(hit.score).toFixed(4)}</strong></div>
            </article>`;
        }).join('');
    };

    const runSearch = async (rawQuery) => {
        const query = rawQuery.trim();
        if (!query) return;
        if (activeRequest) {
            activeRequest.abort();
            if (activeLogId) {
                logStore?.event(activeLogId, { stage: 'request', event: 'aborted', status: 'aborted', detail: '被新的搜索请求替代' });
                logStore?.complete(activeLogId, { status: 'aborted', errorCode: 'superseded' });
            }
        }
        const requestController = new AbortController();
        activeRequest = requestController;
        input.value = query;
        optimizedInput.value = query;
        setLoading();
        const logId = logStore?.start({ query, backend: 'local', topK: 10, source: 'search-eval' });
        activeLogId = logId || null;
        logStore?.event(logId, { stage: 'query', event: 'normalized', detail: '完成首尾空白清理，保留原始语义' });
        const started = performance.now();
        debug('Search request started', { logId, backend: 'local', topK: 10 });
        try {
            logStore?.event(logId, { stage: 'retrieval', event: 'request_sent', detail: '向 Stage 0 BM25 发送检索请求' });
            const response = await fetch(`${apiRoot}/smoke`, {
                method: 'POST',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, top_k: 10, backend: 'local' }),
                signal: requestController.signal
            });
            const requestId = response.headers.get('X-Request-ID');
            if (!response.ok) {
                const body = await response.json().catch(() => ({}));
                const errorMessage = typeof body.detail === 'string' ? body.detail : body.detail?.message;
                const requestError = new Error(errorMessage || `HTTP ${response.status}`);
                requestError.status = response.status;
                requestError.requestId = requestId;
                throw requestError;
            }
            const payload = await response.json();
            const hits = payload.bm25 || [];
            const elapsed = Math.round(performance.now() - started);
            meta.textContent = `${hits.length} 个结果 · ${elapsed} ms`;
            logStore?.event(logId, { stage: 'retrieval', event: 'response_received', detail: `BM25 返回 ${hits.length} 个候选结果` });
            renderProducts(hits);
            logStore?.event(logId, { stage: 'presentation', event: 'results_rendered', detail: `页面完成 ${hits.length} 个结果渲染` });
            logStore?.complete(logId, {
                status: 'success',
                requestId,
                durationMs: elapsed,
                resultCount: hits.length,
                topProductIds: hits.slice(0, 10).map((hit) => hit.product?.product_id).filter(Boolean)
            });
            debug('Search request completed', { logId, requestId, durationMs: elapsed, resultCount: hits.length });
        } catch (error) {
            if (error.name === 'AbortError') return;
            const elapsed = Math.round(performance.now() - started);
            logStore?.event(logId, { stage: 'request', event: 'failed', status: 'error', detail: error instanceof Error ? error.message : 'Unknown API error' });
            logStore?.complete(logId, { status: 'error', requestId: error.requestId || null, durationMs: elapsed, errorCode: error.status ? `http_${error.status}` : 'network_error' });
            console.warn('[search-console:search-ui] Search request failed', { timestamp: new Date().toISOString(), logId, requestId: error.requestId || null, durationMs: elapsed, error: error instanceof Error ? error.message : String(error) });
            setError(error instanceof Error ? error.message : 'Unknown API error');
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

    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    navToggle?.addEventListener('click', () => {
        const open = navLinks.classList.toggle('active');
        navToggle.classList.toggle('active', open);
        navToggle.setAttribute('aria-expanded', String(open));
    });

    runSearch(input.value);
});
