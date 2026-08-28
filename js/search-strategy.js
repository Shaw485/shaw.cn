document.addEventListener('DOMContentLoaded', () => {
    const isLocal = ['127.0.0.1', 'localhost'].includes(window.location.hostname);
    const apiRoot = isLocal ? 'http://127.0.0.1:8000' : '/search-eval-api';
    const store = window.SearchConsoleStore;
    const logList = document.getElementById('logList');
    const logSearch = document.getElementById('logSearch');
    const logStatus = document.getElementById('logStatus');
    const tabCount = document.getElementById('tabLogCount');
    const visibleCount = document.getElementById('visibleLogCount');
    const approvedStrategyCount = document.getElementById('approvedStrategyCount');
    const strategyCatalogState = document.getElementById('strategyCatalogState');
    const approvedStrategyList = document.getElementById('approvedStrategyList');

    const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char]));

    const statusLabel = { success: '成功', error: '失败', aborted: '已取消', running: '进行中' };
    const enabledDebugModules = () => new Set(
        (localStorage.getItem('shaw.debug.search-console.modules') || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
    );
    const strategyDebug = (event, context = {}) => {
        if (localStorage.getItem('shaw.debug.search-console') !== '1') return;
        const modules = enabledDebugModules();
        if (modules.size && !modules.has('strategy-ui')) return;
        console.debug('[search-console:strategy-ui]', {
            timestamp: new Date().toISOString(),
            event,
            ...context
        });
    };
    const formatTime = (iso) => {
        const value = new Date(iso);
        return Number.isNaN(value.getTime()) ? '—' : value.toLocaleString('zh-CN', { month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false });
    };
    const formatEventTime = (iso) => {
        const value = new Date(iso);
        return Number.isNaN(value.getTime()) ? '—' : value.toLocaleTimeString('zh-CN', { hour12:false });
    };

    const render = () => {
        const logs = store?.getLogs() || [];
        const keyword = logSearch.value.trim().toLowerCase();
        const status = logStatus.value;
        const filtered = logs.filter((log) => {
            const matchesStatus = status === 'all' || log.status === status;
            const haystack = `${log.query} ${log.id} ${log.requestId || ''}`.toLowerCase();
            return matchesStatus && (!keyword || haystack.includes(keyword));
        });
        tabCount.textContent = String(logs.length);
        visibleCount.textContent = `${filtered.length} 条记录`;

        if (!filtered.length) {
            logList.innerHTML = `<div class="log-empty"><strong>${logs.length ? '没有符合条件的日志' : '还没有查询日志'}</strong><p>${logs.length ? '换一个筛选条件试试。' : '在搜索体验页执行一次搜索后，这里会自动生成链路记录。'}</p>${logs.length ? '' : '<a href="search-eval.html">开始搜索</a>'}</div>`;
            return;
        }

        logList.innerHTML = filtered.map((log) => {
            const events = (log.events || []).map((item) => `<div class="event-row"><span>${escapeHtml(formatEventTime(item.at))}</span><strong>${escapeHtml(item.stage)}</strong><span>${escapeHtml(item.event)}</span><span>${escapeHtml(item.detail || '—')}</span></div>`).join('');
            return `<details class="log-item"><summary class="log-summary"><time class="log-time">${escapeHtml(formatTime(log.startedAt))}</time><span class="log-query" title="${escapeHtml(log.query)}">${escapeHtml(log.query || '（空 Query）')}</span><span class="log-metric">${log.resultCount ?? '—'} 个结果</span><span class="log-metric">${log.durationMs == null ? '—' : `${log.durationMs} ms`}</span><span class="log-status ${escapeHtml(log.status)}">${escapeHtml(statusLabel[log.status] || log.status)}</span><span class="log-chevron">›</span></summary><div class="log-detail"><div class="log-identifiers"><strong>日志 ID</strong><br>${escapeHtml(log.id)}<br><br><strong>请求 ID</strong><br>${escapeHtml(log.requestId || '—')}<br><br><strong>后端</strong><br>${escapeHtml(log.backend || '—')}</div><div class="event-list">${events || '<div class="event-row"><span>—</span><strong>暂无链路事件</strong></div>'}</div></div></details>`;
        }).join('');
    };

    const renderStrategyCatalog = (payload) => {
        const strategies = Array.isArray(payload?.strategies) ? payload.strategies : [];
        if (approvedStrategyCount) approvedStrategyCount.textContent = String(strategies.length);
        if (!strategies.length) {
            if (strategyCatalogState) {
                strategyCatalogState.classList.remove('error');
                strategyCatalogState.textContent = '暂无已批准策略。可在搜索体验页运行 Agent 查看候选提案；批准由站长在服务器后台完成。';
            }
            if (approvedStrategyList) approvedStrategyList.innerHTML = '';
            return;
        }
        if (strategyCatalogState) {
            strategyCatalogState.classList.remove('error');
            strategyCatalogState.textContent = `已读取 ${strategies.length} 个后台记录的已批准策略。`;
        }
        if (approvedStrategyList) {
            approvedStrategyList.innerHTML = strategies.map((strategy) => `
                <article class="approved-strategy-card">
                    <header>
                        <div>
                            <h3>${escapeHtml(strategy.name || strategy.strategy_id || '未命名策略')}</h3>
                            <p>${escapeHtml(strategy.description || '暂无策略描述。')}</p>
                        </div>
                        <small>${escapeHtml(strategy.stage || 'strategy')}</small>
                    </header>
                    <div class="approved-strategy-meta">
                        <span title="${escapeHtml(strategy.strategy_id || '')}">策略 ID：<code>${escapeHtml(strategy.strategy_id || '—')}</code></span>
                        <span title="${escapeHtml(strategy.proposal_id || '')}">Proposal：${escapeHtml(strategy.proposal_id || '—')}</span>
                        <span title="${escapeHtml(strategy.comparison_id || '')}">Comparison：${escapeHtml(strategy.comparison_id || '—')}</span>
                    </div>
                </article>`).join('');
        }
    };

    const loadStrategyCatalog = async () => {
        if (!strategyCatalogState || !approvedStrategyList) return;
        try {
            strategyDebug('strategy_catalog_requested');
            const response = await fetch(`${apiRoot}/agent/strategy/catalog`, {
                method: 'GET',
                headers: { Accept: 'application/json' }
            });
            if (!response.ok) throw new Error(`http_${response.status}`);
            const payload = await response.json();
            renderStrategyCatalog(payload);
            strategyDebug('strategy_catalog_loaded', {
                strategyCount: Array.isArray(payload?.strategies) ? payload.strategies.length : 0,
                activeStrategyId: payload?.active_strategy_id || null
            });
        } catch (error) {
            if (approvedStrategyCount) approvedStrategyCount.textContent = '0';
            strategyCatalogState.classList.add('error');
            strategyCatalogState.textContent = '策略目录暂时不可用：后端可能还没有部署新的 Agent 接口。';
            approvedStrategyList.innerHTML = '';
            console.warn('[search-console:strategy-ui]', {
                timestamp: new Date().toISOString(),
                event: 'strategy_catalog_failed',
                errorCode: error.message || 'network_error'
            });
        }
    };

    logSearch.addEventListener('input', render);
    logStatus.addEventListener('change', render);
    window.addEventListener('storage', render);
    window.addEventListener('shaw:search-log-updated', render);

    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    navToggle?.addEventListener('click', () => {
        const open = navLinks.classList.toggle('active');
        navToggle.classList.toggle('active', open);
        navToggle.setAttribute('aria-expanded', String(open));
    });

    render();
    loadStrategyCatalog();
});
