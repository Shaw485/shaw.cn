document.addEventListener('DOMContentLoaded', () => {
    const isLocal = ['127.0.0.1', 'localhost'].includes(window.location.hostname);
    const apiRoot = isLocal ? 'http://127.0.0.1:8010' : '/search-eval-api';
    const form = document.getElementById('searchForm');
    const input = document.getElementById('searchQuery');
    const queryEcho = document.getElementById('queryEcho');
    const resultMeta = document.getElementById('resultMeta');
    const state = document.getElementById('searchState');
    const results = document.getElementById('productResults');
    const notice = document.getElementById('strategyNotice');
    const rankDiff = document.getElementById('rankDiff');
    const categoryList = document.getElementById('categoryList');
    const strategyButtons = [...document.querySelectorAll('[data-strategy]')];
    const queryButtons = [...document.querySelectorAll('[data-query]')];
    let payload = null;
    let activeStrategy = 'bm25';

    const visuals = {
        p001: ['🖱️', '#e9f2f7'], p002: ['🖱️', '#f2eee8'], p003: ['🖱️', '#e8edf2'],
        p004: ['⌨️', '#eef0ea'], p005: ['▰', '#ece9f4'], p006: ['🔋', '#f5eddc'],
        p007: ['🖱️', '#edf0f4'], p008: ['🔌', '#edf4f2'], p009: ['▣', '#f5eeee'],
        p010: ['👟', '#edf3ed']
    };

    const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char]));

    const setLoading = (message = '正在运行 Stage 0 搜索…') => {
        state.hidden = false;
        state.className = 'search-state';
        state.innerHTML = `<span class="state-spinner"></span><p>${escapeHtml(message)}</p>`;
        results.innerHTML = '';
    };

    const setError = (message) => {
        state.hidden = false;
        state.className = 'search-state error';
        state.innerHTML = `<strong>搜索服务暂时不可用</strong><p>${escapeHtml(message)}</p><button type="button" id="retrySearch">重试连接</button>`;
        results.innerHTML = '';
        resultMeta.textContent = 'API unavailable · 没有使用静态结果兜底';
        document.getElementById('retrySearch')?.addEventListener('click', () => runSearch(input.value));
    };

    const rankMap = (strategy) => new Map((payload?.[strategy] || []).map((hit) => [hit.product.product_id, hit.rank]));

    const renderCategories = () => {
        const products = [...(payload?.bm25 || []), ...(payload?.vector || [])].map((hit) => hit.product);
        const unique = new Map(products.map((product) => [product.product_id, product]));
        const counts = {};
        unique.forEach((product) => { counts[product.category] = (counts[product.category] || 0) + 1; });
        categoryList.innerHTML = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([name, count]) =>
            `<div class="category-item"><span>${escapeHtml(name)}</span><em>${count}</em></div>`
        ).join('') || '<p class="category-item">BM25 无命中时，切换 Hash Vector 可查看全量候选。</p>';
    };

    const renderProducts = () => {
        if (!payload) return;
        const hits = payload[activeStrategy] || [];
        const otherStrategy = activeStrategy === 'bm25' ? 'vector' : 'bm25';
        const otherRanks = rankMap(otherStrategy);
        strategyButtons.forEach((button) => {
            const active = button.dataset.strategy === activeStrategy;
            button.classList.toggle('active', active);
            button.setAttribute('aria-pressed', String(active));
        });
        notice.classList.toggle('warning', activeStrategy === 'vector');
        notice.innerHTML = activeStrategy === 'bm25'
            ? '<strong>BM25</strong> 根据 Query 与商品文本的词项匹配排序；当前没有调字段权重、同义词或业务规则。'
            : '<strong>Hash Vector 仅用于链路诊断。</strong> 它把词项哈希到 64 维向量，不理解语义；排名看起来“意外”是预期现象，不能作为语义搜索质量结论。';

        if (!hits.length) {
            state.hidden = true;
            results.innerHTML = '<div class="empty-results"><strong>BM25 没有词项命中</strong><p>这正是未优化基线的一个 Bad Case：它没有同义词扩展、拼写纠错或语义召回。你可以切换 Hash Vector 观察链路返回，但不要把它当成质量更好的结果。</p></div>';
            return;
        }
        state.hidden = true;
        results.innerHTML = hits.map((hit) => {
            const product = hit.product;
            const [emoji, bg] = visuals[product.product_id] || ['📦', '#eef1f4'];
            const otherRank = otherRanks.get(product.product_id);
            const otherLabel = otherStrategy === 'bm25' ? 'BM25' : 'Hash Vector';
            return `<article class="product-card">
                <div class="product-rank">#${hit.rank}</div>
                <div class="product-visual" style="--product-bg:${bg}" aria-hidden="true">${emoji}</div>
                <div class="product-copy">
                    <p class="product-category">${escapeHtml(product.category)}</p>
                    <h3>${escapeHtml(product.title)}</h3>
                    <p class="product-brand">Brand: <strong>${escapeHtml(product.brand)}</strong></p>
                    <p class="product-description">${escapeHtml(product.description)}</p>
                    <code class="product-id">${escapeHtml(product.product_id)} · SAMPLE FIXTURE · NO LIVE PRICE</code>
                </div>
                <div class="product-score">
                    <span>${activeStrategy === 'bm25' ? 'BM25 SCORE' : 'COSINE SCORE'}</span>
                    <strong>${Number(hit.score).toFixed(4)}</strong>
                    <p>${otherLabel} 排名<br><b>${otherRank ? `#${otherRank}` : '无词项命中'}</b></p>
                </div>
            </article>`;
        }).join('');
    };

    const renderRankDiff = () => {
        if (!payload) return;
        const bm25 = rankMap('bm25');
        const vector = rankMap('vector');
        const products = new Map((payload.vector || []).map((hit) => [hit.product.product_id, hit.product]));
        (payload.bm25 || []).forEach((hit) => products.set(hit.product.product_id, hit.product));
        const sorted = [...products.values()].sort((a, b) => {
            const rankA = Math.min(bm25.get(a.product_id) || 99, vector.get(a.product_id) || 99);
            const rankB = Math.min(bm25.get(b.product_id) || 99, vector.get(b.product_id) || 99);
            return rankA - rankB;
        }).slice(0, 5);
        const widthFor = (rank) => rank ? Math.max(18, 110 - rank * 9) : 0;
        rankDiff.innerHTML = sorted.map((product) => {
            const bRank = bm25.get(product.product_id);
            const vRank = vector.get(product.product_id);
            const delta = bRank && vRank ? Math.abs(bRank - vRank) : null;
            return `<article class="rank-diff-card">
                <p class="rank-name">${escapeHtml(product.title)}</p>
                <div class="rank-bars">
                    <div class="rank-row"><span>BM25</span><div class="rank-track"><i style="width:${widthFor(bRank)}%"></i></div><b>${bRank || '—'}</b></div>
                    <div class="rank-row vector"><span>HASH</span><div class="rank-track"><i style="width:${widthFor(vRank)}%"></i></div><b>${vRank || '—'}</b></div>
                </div>
                <p class="rank-delta">${delta === null ? '一侧无词项命中' : `排名相差 ${delta} 位`}</p>
            </article>`;
        }).join('');
    };

    const renderAll = () => {
        renderCategories();
        renderProducts();
        renderRankDiff();
    };

    const runSearch = async (rawQuery) => {
        const query = rawQuery.trim();
        if (!query) return;
        input.value = query;
        queryEcho.textContent = query;
        queryButtons.forEach((button) => button.classList.toggle('active', button.dataset.query === query));
        setLoading();
        resultMeta.textContent = '正在连接真实 Stage 0 API…';
        const started = performance.now();
        try {
            const response = await fetch(`${apiRoot}/smoke?query=${encodeURIComponent(query)}&top_k=10&backend=local`, {
                headers: { Accept: 'application/json' }
            });
            if (!response.ok) {
                const body = await response.json().catch(() => ({}));
                throw new Error(body.detail || `HTTP ${response.status}`);
            }
            payload = await response.json();
            const elapsed = Math.round(performance.now() - started);
            resultMeta.textContent = `${payload.backend} backend · ${payload.product_count} products · ${elapsed} ms client round-trip · deterministic: ${payload.deterministic ? 'yes' : 'no'}`;
            renderAll();
        } catch (error) {
            payload = null;
            rankDiff.innerHTML = '<p>连接 API 后显示实时排名差异。</p>';
            categoryList.innerHTML = '';
            setError(error instanceof Error ? error.message : 'Unknown API error');
        }
    };

    form.addEventListener('submit', (event) => { event.preventDefault(); runSearch(input.value); });
    queryButtons.forEach((button) => button.addEventListener('click', () => runSearch(button.dataset.query)));
    strategyButtons.forEach((button) => button.addEventListener('click', () => {
        activeStrategy = button.dataset.strategy;
        renderProducts();
    }));

    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    navToggle?.addEventListener('click', () => {
        const open = navLinks.classList.toggle('active');
        navToggle.classList.toggle('active', open);
        navToggle.setAttribute('aria-expanded', String(open));
    });
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => backToTop?.classList.toggle('visible', window.scrollY > 500), { passive: true });
    backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    runSearch(input.value);
});
