document.addEventListener('DOMContentLoaded', () => {
    const isLocal = ['127.0.0.1', 'localhost'].includes(window.location.hostname);
    const apiRoot = isLocal ? 'http://127.0.0.1:8010' : '/search-eval-api';
    const form = document.getElementById('baselineSearchForm');
    const input = document.getElementById('baselineQuery');
    const optimizedInput = document.getElementById('optimizedQuery');
    const meta = document.getElementById('baselineMeta');
    const state = document.getElementById('baselineState');
    const results = document.getElementById('baselineResults');
    let activeRequest = null;

    const visuals = {
        p001: ['🖱️', '#e9f2f7'], p002: ['🖱️', '#f2eee8'], p003: ['🖱️', '#e8edf2'],
        p004: ['⌨️', '#eef0ea'], p005: ['▰', '#ece9f4'], p006: ['🔋', '#f5eddc'],
        p007: ['🖱️', '#edf0f4'], p008: ['🔌', '#edf4f2'], p009: ['▣', '#f5eeee'],
        p010: ['👟', '#edf3ed']
    };

    const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char]));

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
        activeRequest?.abort();
        activeRequest = new AbortController();
        input.value = query;
        optimizedInput.value = query;
        setLoading();
        const started = performance.now();
        try {
            const response = await fetch(`${apiRoot}/smoke?query=${encodeURIComponent(query)}&top_k=10&backend=local`, {
                headers: { Accept: 'application/json' },
                signal: activeRequest.signal
            });
            if (!response.ok) {
                const body = await response.json().catch(() => ({}));
                throw new Error(body.detail || `HTTP ${response.status}`);
            }
            const payload = await response.json();
            const hits = payload.bm25 || [];
            const elapsed = Math.round(performance.now() - started);
            meta.textContent = `${hits.length} 个结果 · ${elapsed} ms`;
            renderProducts(hits);
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') return;
            setError(error instanceof Error ? error.message : 'Unknown API error');
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
