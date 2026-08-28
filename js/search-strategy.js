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
    const historyStrategyCount = document.getElementById('historyStrategyCount');
    const historyActivityCount = document.getElementById('historyActivityCount');
    const historySearch = document.getElementById('historySearch');
    const strategyCatalogState = document.getElementById('strategyCatalogState');
    const approvedStrategyList = document.getElementById('approvedStrategyList');
    const strategyActivityList = document.getElementById('strategyActivityList');
    let catalogPayload = null;

    const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char]));
    const statusLabel = { success: '成功', error: '失败', aborted: '已取消', running: '进行中' };
    const configLabels = {
        analyzer_id: '分词器', b: 'BM25 长度归一化 b', coverage_boost: '查询词覆盖加权', field: '检索字段',
        idf_scope: 'IDF 计算范围', k1: 'BM25 词频饱和 k1', numeric_boost: '型号与数字词加权',
        phrase_boost: '完整短语加权', query_terms: '查询词处理', ranker_id: '排序器版本',
        score: '评分函数', tie_break: '同分处理'
    };
    const metricLabels = { 'success@5': 'Success@5', 'mrr@10': 'MRR@10', 'ndcg@10': 'nDCG@10' };
    const enabledDebugModules = () => new Set(
        (localStorage.getItem('shaw.debug.search-console.modules') || '').split(',').map((item) => item.trim()).filter(Boolean)
    );
    const strategyDebug = (event, context = {}) => {
        if (localStorage.getItem('shaw.debug.search-console') !== '1') return;
        const modules = enabledDebugModules();
        if (modules.size && !modules.has('strategy-ui')) return;
        console.debug('[search-console:strategy-ui]', { timestamp: new Date().toISOString(), event, ...context });
    };
    const formatTime = (iso) => {
        const value = new Date(iso);
        return Number.isNaN(value.getTime()) ? '时间未记录' : value.toLocaleString('zh-CN', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false });
    };
    const formatEventTime = (iso) => {
        const value = new Date(iso);
        return Number.isNaN(value.getTime()) ? '—' : value.toLocaleTimeString('zh-CN', { hour12:false });
    };
    const formatValue = (value) => {
        if (typeof value === 'boolean') return value ? '是' : '否';
        if (value == null || value === '') return '—';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    };
    const formatMetric = (value) => Number.isFinite(Number(value)) ? Number(value).toFixed(4) : '—';
    const renderMetricTriplet = (metrics = {}) => Object.keys(metricLabels).map((metricId) => {
        const metric = metrics?.[metricId] || {};
        const delta = Number(metric.delta);
        const deltaClass = Number.isFinite(delta) ? (delta > 0 ? 'positive' : delta < 0 ? 'negative' : 'neutral') : 'neutral';
        const deltaText = Number.isFinite(delta) ? `${delta >= 0 ? '+' : ''}${delta.toFixed(4)}` : '—';
        return `<div class="history-metric"><span>${metricLabels[metricId]}</span><strong>${escapeHtml(formatMetric(metric.candidate))}</strong><small>基线 ${escapeHtml(formatMetric(metric.baseline))}</small><em class="${deltaClass}">${escapeHtml(deltaText)}</em></div>`;
    }).join('');

    const getHistory = () => {
        const history = Array.isArray(catalogPayload?.strategy_history) ? catalogPayload.strategy_history : [];
        if (history.length) return history;
        return (Array.isArray(catalogPayload?.strategies) ? catalogPayload.strategies : []).map((item) => ({ ...item, adopted_at: null }));
    };
    const getActivities = () => Array.isArray(catalogPayload?.strategy_activity_logs) ? catalogPayload.strategy_activity_logs : [];
    const matchesHistorySearch = (item) => {
        const keyword = historySearch?.value.trim().toLowerCase() || '';
        if (!keyword) return true;
        return [item.name, item.strategy_name, item.strategy_id, item.proposal_id, item.decision_id, item.comparison_id, item.stage]
            .filter(Boolean).join(' ').toLowerCase().includes(keyword);
    };

    const renderStrategyHistory = () => {
        const history = getHistory();
        const filtered = history.filter(matchesHistorySearch);
        const activeStrategyId = catalogPayload?.active_strategy_id || null;
        if (approvedStrategyCount) approvedStrategyCount.textContent = String(history.length);
        if (historyStrategyCount) historyStrategyCount.textContent = String(history.length);
        if (!filtered.length) {
            approvedStrategyList.innerHTML = `<div class="history-empty"><strong>${history.length ? '没有符合条件的策略版本' : '还没有已采用策略'}</strong><p>${history.length ? '清空筛选词后查看全部记录。' : 'Agent 只生成候选提案；站长批准后，版本快照会出现在这里。'}</p></div>`;
            return;
        }
        approvedStrategyList.innerHTML = filtered.map((strategy) => {
            const active = strategy.strategy_id === activeStrategyId && history.findIndex((item) => item.strategy_id === activeStrategyId) === history.indexOf(strategy);
            const explanation = strategy.explanation && typeof strategy.explanation === 'object' ? strategy.explanation : {};
            const config = strategy.config && typeof strategy.config === 'object' ? strategy.config : {};
            const configRows = Object.entries(config).map(([key, value]) => `<div><span>${escapeHtml(configLabels[key] || key)}</span><code>${escapeHtml(formatValue(value))}</code></div>`).join('');
            const detailRows = [
                ['适用问题', explanation.target_problem], ['策略机制', explanation.mechanism], ['评分公式', explanation.scoring_formula],
                ['预期收益', explanation.expected_benefit], ['主要风险', explanation.risk]
            ].filter(([, value]) => value).map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`).join('');
            return `<details class="approved-strategy-card">
                <summary>
                    <div class="history-version">V${String(history.length - history.indexOf(strategy)).padStart(2, '0')}</div>
                    <div class="history-title"><h3>${escapeHtml(strategy.name || strategy.strategy_id || '未命名策略')}</h3><p>${escapeHtml(strategy.description || '暂无策略描述。')}</p></div>
                    <div class="history-time"><strong class="${active ? 'active' : ''}">${active ? '当前生效' : '历史版本'}</strong><time>${escapeHtml(formatTime(strategy.adopted_at))}</time></div>
                    <span class="log-chevron">›</span>
                </summary>
                <div class="history-detail">
                    <div class="history-metrics">${renderMetricTriplet(strategy.metrics)}</div>
                    ${detailRows ? `<dl class="strategy-explanation">${detailRows}</dl>` : ''}
                    <div class="strategy-config"><h4>配置参数</h4>${configRows || '<p>旧版本没有保存参数快照。</p>'}</div>
                    <div class="approved-strategy-meta">
                        <span>策略 ID：<code>${escapeHtml(strategy.strategy_id || '—')}</code></span>
                        <span>Proposal：<code>${escapeHtml(strategy.proposal_id || '—')}</code></span>
                        <span>Decision：<code>${escapeHtml(strategy.decision_id || '—')}</code></span>
                        <span>Comparison：<code>${escapeHtml(strategy.comparison_id || '—')}</code></span>
                    </div>
                </div>
            </details>`;
        }).join('');
    };

    const renderStrategyActivities = () => {
        const activities = getActivities();
        const filtered = activities.filter(matchesHistorySearch);
        if (historyActivityCount) historyActivityCount.textContent = String(activities.length);
        if (!filtered.length) {
            strategyActivityList.innerHTML = `<div class="history-empty"><strong>${activities.length ? '没有符合条件的变更日志' : '还没有策略变更日志'}</strong><p>策略被站长批准并写入运行目录后，会自动生成不可覆盖的变更记录。</p></div>`;
            return;
        }
        strategyActivityList.innerHTML = filtered.map((event) => `<article class="activity-item">
            <time>${escapeHtml(formatTime(event.occurred_at))}</time>
            <div><strong>${escapeHtml(event.strategy_name || event.strategy_id || '策略版本')}</strong><p>${escapeHtml(event.message || '策略已批准并生效。')}</p></div>
            <span>已批准并生效</span>
            <dl><div><dt>策略 ID</dt><dd>${escapeHtml(event.strategy_id || '—')}</dd></div><div><dt>Proposal</dt><dd>${escapeHtml(event.proposal_id || '—')}</dd></div><div><dt>Decision</dt><dd>${escapeHtml(event.decision_id || '—')}</dd></div></dl>
        </article>`).join('');
    };

    const renderQueryLogs = () => {
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

    const renderCatalog = (payload) => {
        catalogPayload = payload;
        const historyCount = getHistory().length;
        strategyCatalogState.classList.remove('error');
        strategyCatalogState.textContent = historyCount ? `已读取 ${historyCount} 个已采用策略版本；策略详情和对应变更记录已关联。` : '暂无已采用策略。Agent 可生成候选提案，采用与生效必须由站长在服务器后台批准。';
        renderStrategyHistory();
        renderStrategyActivities();
    };

    const loadStrategyCatalog = async () => {
        try {
            strategyDebug('strategy_catalog_requested');
            const response = await fetch(`${apiRoot}/agent/strategy/catalog`, { method: 'GET', headers: { Accept: 'application/json' } });
            if (!response.ok) throw new Error(`http_${response.status}`);
            const payload = await response.json();
            renderCatalog(payload);
            strategyDebug('strategy_history_loaded', {
                strategyCount: getHistory().length,
                activityCount: getActivities().length,
                activeStrategyPresent: Boolean(payload?.active_strategy_id)
            });
        } catch (error) {
            catalogPayload = {};
            approvedStrategyCount.textContent = '0';
            historyStrategyCount.textContent = '0';
            historyActivityCount.textContent = '0';
            strategyCatalogState.classList.add('error');
            strategyCatalogState.textContent = '策略历史暂时不可用，请稍后重试。';
            renderStrategyHistory();
            renderStrategyActivities();
            console.warn('[search-console:strategy-ui]', { timestamp: new Date().toISOString(), event: 'strategy_catalog_failed', errorCode: error.message || 'network_error' });
        }
    };

    document.querySelectorAll('[data-history-view]').forEach((button) => button.addEventListener('click', () => {
        const view = button.dataset.historyView;
        document.querySelectorAll('[data-history-view]').forEach((item) => {
            const active = item === button;
            item.classList.toggle('active', active);
            item.setAttribute('aria-selected', String(active));
        });
        document.querySelectorAll('[data-history-panel]').forEach((panel) => panel.classList.toggle('active', panel.dataset.historyPanel === view));
        const searchControl = historySearch?.closest('.history-search');
        if (searchControl) searchControl.hidden = view === 'queries';
        strategyDebug('history_view_changed', { view });
    }));
    historySearch?.addEventListener('input', () => {
        renderStrategyHistory();
        renderStrategyActivities();
        strategyDebug('history_filter_applied', { hasKeyword: Boolean(historySearch.value.trim()) });
    });
    logSearch.addEventListener('input', renderQueryLogs);
    logStatus.addEventListener('change', renderQueryLogs);
    window.addEventListener('storage', renderQueryLogs);
    window.addEventListener('shaw:search-log-updated', renderQueryLogs);

    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    navToggle?.addEventListener('click', () => {
        const open = navLinks.classList.toggle('active');
        navToggle.classList.toggle('active', open);
        navToggle.setAttribute('aria-expanded', String(open));
    });

    renderQueryLogs();
    loadStrategyCatalog();
});
