document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const isLocal = ['127.0.0.1', 'localhost'].includes(window.location.hostname);
    const apiRoot = isLocal ? 'http://127.0.0.1:8000' : '/search-eval-api';
    const baselineForm = document.getElementById('baselineSearchForm');
    const activeForm = document.getElementById('activeSearchForm');
    const baselineInput = document.getElementById('baselineQuery');
    const activeInput = document.getElementById('optimizedQuery');
    const activeButton = document.getElementById('activeSearchButton');
    const comparisonReadiness = document.getElementById('comparisonReadiness');
    const activeBadge = document.getElementById('activeServingBadge');
    const logStore = window.SearchConsoleStore;
    const releaseApi = window.SearchReleaseContract;
    const diagnostics = window.SearchUiDiagnostics;
    const lanes = Object.freeze({
        baseline: Object.freeze({
            state: document.getElementById('baselineState'),
            results: document.getElementById('baselineResults'),
            meta: document.getElementById('baselineMeta'),
            execution: document.getElementById('baselineExecution'),
            endpoint: releaseApi.API_PATHS.baselineSearch,
            scoreLabel: 'BASELINE'
        }),
        active: Object.freeze({
            state: document.getElementById('activeState'),
            results: document.getElementById('activeResults'),
            meta: document.getElementById('activeMeta'),
            execution: document.getElementById('activeExecution'),
            endpoint: releaseApi.API_PATHS.activeSearch,
            scoreLabel: 'ACTIVE'
        })
    });
    let readiness = Object.freeze({ ready: false, mode: 'checking', strategy_revision: null });
    let activeRequest = null;
    let activeLogId = null;

    const productVisuals = [
        ['📦', '#edf0f2'], ['⌨️', '#eef0ea'], ['🎧', '#ece9f4'],
        ['🔌', '#edf4f2'], ['▣', '#f5eeee'], ['🖱️', '#e9f2f7'],
        ['🔋', '#f5eddc'], ['⌚', '#e8edf2'], ['🏠', '#edf3ed']
    ];
    const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[character]));
    const enabledDebugModules = () => new Set(
        (localStorage.getItem('shaw.debug.search-console.modules') || '')
            .split(',').map((item) => item.trim()).filter(Boolean)
    );
    const debug = (event, context = {}) => {
        if (localStorage.getItem('shaw.debug.search-console') !== '1') return;
        const modules = enabledDebugModules();
        if (modules.size && !modules.has('search-ui')) return;
        console.debug('[search-console:search-ui]', { timestamp: new Date().toISOString(), event, ...context });
    };

    const visualFor = (productId) => {
        const hash = Array.from(String(productId || '')).reduce(
            (value, character) => ((value * 31) + character.charCodeAt(0)) >>> 0,
            0
        );
        return productVisuals[hash % productVisuals.length];
    };

    const renderProducts = (laneName, hits) => {
        const lane = lanes[laneName];
        lane.state.hidden = true;
        if (!hits.length) {
            lane.results.innerHTML = '<div class="empty-results"><strong>没有匹配商品</strong><p>请换一个商品名或商品 ID 再试。</p></div>';
            return;
        }
        lane.results.innerHTML = hits.map((hit) => {
            const product = hit.product || {};
            const [emoji, bg] = visualFor(product.product_id);
            const locale = String(product.locale || '').toUpperCase();
            const identity = [locale ? `Amazon ${locale}` : 'Amazon', product.product_id].filter(Boolean).join(' · ');
            return `<article class="result-card">
                <div class="result-rank">#${Number(hit.rank) || '—'}</div>
                <div class="result-visual" style="--product-bg:${bg}" aria-hidden="true">${emoji}</div>
                <div class="result-copy">
                    <p class="result-category">${escapeHtml(identity)}</p>
                    <h3>${escapeHtml(product.title || '未命名商品')}</h3>
                    <p class="result-brand">${escapeHtml(product.brand || '品牌未标注')}</p>
                    <p class="result-description">${escapeHtml(product.color ? `颜色：${product.color}` : `商品 ID：${product.product_id || '—'}`)}</p>
                </div>
                <div class="result-score"><span>${escapeHtml(lane.scoreLabel)}</span><strong>${Number(hit.score || 0).toFixed(4)}</strong></div>
            </article>`;
        }).join('');
    };

    const setLaneLoading = (laneName) => {
        const lane = lanes[laneName];
        lane.state.hidden = false;
        lane.state.className = `result-state${laneName === 'active' ? ' active-result-state' : ''}`;
        lane.state.innerHTML = '<span class="state-spinner"></span><p>正在搜索商品…</p>';
        lane.results.innerHTML = '';
        lane.meta.textContent = '正在搜索…';
    };

    const setLaneError = (laneName, message) => {
        const lane = lanes[laneName];
        lane.state.hidden = false;
        lane.state.className = `result-state error${laneName === 'active' ? ' active-result-state' : ''}`;
        lane.state.innerHTML = `<strong>${laneName === 'active' ? 'Active 搜索失败' : 'Baseline 搜索失败'}</strong><p>${escapeHtml(message)}</p><button type="button" data-retry-comparison>重试同 Query 对照</button>`;
        lane.results.innerHTML = '';
        lane.meta.textContent = '服务暂时不可用';
        lane.state.querySelector('[data-retry-comparison]')?.addEventListener('click', () => runComparison(baselineInput.value));
    };

    const executionText = (execution) => {
        const revision = execution.strategy_revision || 'baseline';
        return `Strategy <code>${escapeHtml(execution.strategy_id)}</code> · Revision <code>${escapeHtml(revision)}</code> · Index <code>${escapeHtml(execution.index_id)}</code>`;
    };

    const setActiveAvailability = () => {
        const ready = readiness.ready === true;
        activeInput.disabled = !ready;
        activeButton.disabled = !ready;
        activeForm.classList.toggle('lane-search-disabled', !ready);
        document.querySelector('.optimized-lane')?.classList.toggle('is-ready', ready);
        activeBadge.className = `lane-status ${ready ? 'lane-status-live' : 'lane-status-pending'}`;
        activeBadge.innerHTML = ready ? '<i></i> Active ready' : 'Active 未就绪';
        comparisonReadiness.textContent = ready
            ? `同 Query 对照 · Active revision ${readiness.strategy_revision}`
            : `同 Query 对照 · 当前仅 Baseline（${readiness.error_code || readiness.mode || 'not_ready'}）`;
        if (ready) {
            lanes.active.execution.innerHTML = executionText({
                strategy_id: readiness.strategy_id || 'active',
                strategy_revision: readiness.strategy_revision,
                index_id: readiness.index_id || 'not_reported'
            });
            return;
        }
        lanes.active.meta.textContent = '等待 active serving';
        lanes.active.execution.innerHTML = 'Strategy <code>—</code> · Revision <code>—</code> · Index <code>—</code>';
        lanes.active.results.innerHTML = '';
        lanes.active.state.hidden = false;
        lanes.active.state.className = 'result-state active-result-state';
        lanes.active.state.innerHTML = '<div class="pending-icon" aria-hidden="true">⌁</div><strong>Active serving 未就绪</strong><p>已批准但尚未 active、索引不兼容或健康检查失败时，本 lane 会保持禁用。</p>';
    };

    const completeAbortedLog = () => {
        if (!activeLogId) return;
        logStore?.event(activeLogId, { stage: 'request', event: 'aborted', status: 'aborted', detail: '被新的搜索请求替代' });
        logStore?.complete(activeLogId, { status: 'aborted', errorCode: 'superseded' });
    };

    const responseForContract = (payload, laneName) => {
        if (payload?.execution || payload?.strategy_id) return payload;
        if (laneName !== 'baseline') return payload;
        return {
            ...payload,
            execution: {
                lane: 'baseline',
                strategy_id: 'catalog-baseline-v1',
                strategy_revision: null,
                index_id: payload?.index_id || 'not_reported',
                channels: payload?.channel_counts || {}
            }
        };
    };

    const fetchLane = async (laneName, query, controller, logId) => {
        const lane = lanes[laneName];
        const started = performance.now();
        logStore?.event(logId, {
            stage: 'retrieval',
            event: `${laneName}_request_sent`,
            detail: laneName === 'active' ? '向当前 active strategy 发送检索请求' : '向 catalog baseline 发送检索请求'
        });
        const response = await fetch(`${apiRoot}${lane.endpoint}`, {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, top_k: 10 }),
            signal: controller.signal
        });
        const requestId = response.headers.get('X-Request-ID');
        if (!response.ok) {
            const error = new Error(response.status === 400 ? 'invalid_query' : `http_${response.status}`);
            error.status = response.status;
            error.requestId = requestId;
            throw error;
        }
        const normalized = releaseApi.normalizeSearchResponse(responseForContract(await response.json(), laneName), laneName);
        const elapsed = Math.round(performance.now() - started);
        lane.meta.textContent = `${normalized.hits.length} 个结果 · ${normalized.product_count.toLocaleString('zh-CN')} 件商品 · ${elapsed} ms`;
        lane.execution.innerHTML = executionText(normalized.execution);
        renderProducts(laneName, normalized.hits);
        logStore?.event(logId, {
            stage: 'retrieval',
            event: `${laneName}_response_received`,
            detail: `${laneName} 返回 ${normalized.hits.length} 个候选结果`
        });
        diagnostics?.log('search-comparison-ui', 'debug', 'search_lane_rendered', {
            lane: laneName,
            logId,
            requestId,
            durationMs: elapsed,
            resultCount: normalized.hits.length,
            strategyId: normalized.execution.strategy_id,
            strategyRevision: normalized.execution.strategy_revision,
            indexId: normalized.execution.index_id
        });
        return { ...normalized, elapsed, requestId };
    };

    const settleLane = async (laneName, query, controller, logId) => {
        try {
            return { status: 'fulfilled', value: await fetchLane(laneName, query, controller, logId) };
        } catch (error) {
            if (error.name === 'AbortError') throw error;
            const status = Number(error.status) || 0;
            const errorCode = error.code || error.message || 'network_error';
            setLaneError(laneName, status === 400 ? '请输入有效的商品关键词。' : '搜索服务暂时不可用，请稍后重试。');
            logStore?.event(logId, { stage: 'retrieval', event: `${laneName}_failed`, status: 'error', detail: errorCode });
            diagnostics?.log('search-comparison-ui', 'warn', 'search_lane_failed', {
                lane: laneName,
                logId,
                requestId: error.requestId || null,
                statusCode: status,
                errorCode
            });
            return { status: 'rejected', reason: error };
        }
    };

    const runComparison = async (rawQuery) => {
        const query = rawQuery.trim();
        if (!query) return;
        if (activeRequest) {
            activeRequest.abort();
            completeAbortedLog();
        }
        const controller = new AbortController();
        activeRequest = controller;
        baselineInput.value = query;
        activeInput.value = query;
        setLaneLoading('baseline');
        if (readiness.ready) setLaneLoading('active');
        else setActiveAvailability();

        const logId = logStore?.start({
            query,
            backend: readiness.ready ? 'baseline+active' : 'baseline-only',
            topK: 10,
            source: 'search-eval'
        });
        activeLogId = logId || null;
        logStore?.event(logId, { stage: 'query', event: 'normalized', detail: '两条 lane 使用同一个首尾空白清理后的 Query' });
        debug('catalog_search_started', { logId, backend: readiness.ready ? 'baseline+active' : 'baseline-only', topK: 10 });
        diagnostics?.log('search-comparison-ui', 'debug', 'comparison_started', {
            logId,
            activeReady: readiness.ready,
            laneCount: readiness.ready ? 2 : 1
        });

        try {
            const baselinePromise = settleLane('baseline', query, controller, logId);
            const activePromise = readiness.ready
                ? settleLane('active', query, controller, logId)
                : Promise.resolve({ status: 'skipped' });
            const [baselineOutcome, activeOutcome] = await Promise.all([baselinePromise, activePromise]);
            const failed = baselineOutcome.status === 'rejected' || activeOutcome.status === 'rejected';
            const baselineValue = baselineOutcome.value;
            const durationMs = Math.max(baselineValue?.elapsed || 0, activeOutcome.value?.elapsed || 0);
            logStore?.complete(logId, {
                status: failed ? 'error' : 'success',
                requestId: baselineValue?.requestId || activeOutcome.value?.requestId || null,
                durationMs,
                resultCount: baselineValue?.hits.length || 0,
                errorCode: failed ? 'lane_failed' : null,
                topProductIds: (baselineValue?.hits || []).slice(0, 10).map((hit) => hit.product?.product_id).filter(Boolean)
            });
            debug('catalog_search_completed', {
                logId,
                durationMs,
                resultCount: baselineValue?.hits.length || 0,
                activeReady: readiness.ready,
                failedLaneCount: [baselineOutcome, activeOutcome].filter((item) => item.status === 'rejected').length
            });
            diagnostics?.log('search-comparison-ui', failed ? 'warn' : 'debug', 'comparison_completed', {
                logId,
                durationMs,
                activeReady: readiness.ready,
                baselineResultCount: baselineValue?.hits.length || 0,
                activeResultCount: activeOutcome.value?.hits.length || 0,
                failedLaneCount: [baselineOutcome, activeOutcome].filter((item) => item.status === 'rejected').length
            });
        } catch (error) {
            if (error.name !== 'AbortError') {
                logStore?.complete(logId, { status: 'error', errorCode: 'comparison_failed' });
            }
        } finally {
            if (activeRequest === controller) {
                activeRequest = null;
                activeLogId = null;
            }
        }
    };

    const loadReadiness = async () => {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 6000);
        diagnostics?.log('serving-readiness-ui', 'debug', 'active_readiness_requested');
        try {
            const response = await fetch(`${apiRoot}${releaseApi.API_PATHS.health}`, {
                method: 'GET',
                headers: { Accept: 'application/json' },
                cache: 'no-store',
                signal: controller.signal
            });
            if (!response.ok) {
                const error = new Error(`http_${response.status}`);
                error.status = response.status;
                throw error;
            }
            readiness = releaseApi.normalizeReadiness(await response.json());
            diagnostics?.log('serving-readiness-ui', 'debug', 'active_readiness_rendered', {
                ready: readiness.ready,
                mode: readiness.mode,
                strategyId: readiness.strategy_id,
                strategyRevision: readiness.strategy_revision,
                indexId: readiness.index_id,
                health: readiness.health,
                errorCode: readiness.error_code
            });
        } catch (error) {
            readiness = Object.freeze({
                ready: false,
                mode: 'health_unavailable',
                strategy_id: null,
                strategy_revision: null,
                index_id: null,
                health: 'not_ready',
                rollout: null,
                error_code: error.name === 'AbortError' ? 'health_timeout' : (error.message || 'health_unavailable')
            });
            diagnostics?.log('serving-readiness-ui', 'warn', 'active_readiness_failed', {
                errorCode: readiness.error_code,
                statusCode: Number(error.status) || 0
            });
        } finally {
            window.clearTimeout(timeout);
            setActiveAvailability();
        }
    };

    baselineForm.addEventListener('submit', (event) => {
        event.preventDefault();
        runComparison(baselineInput.value);
    });
    activeForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (readiness.ready) runComparison(activeInput.value);
    });
    baselineInput.addEventListener('input', () => { activeInput.value = baselineInput.value; });
    activeInput.addEventListener('input', () => { baselineInput.value = activeInput.value; });

    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    navToggle?.addEventListener('click', () => {
        const open = navLinks.classList.toggle('active');
        navToggle.classList.toggle('active', open);
        navToggle.setAttribute('aria-expanded', String(open));
    });

    (async () => {
        await loadReadiness();
        await runComparison(baselineInput.value);
    })();
});
