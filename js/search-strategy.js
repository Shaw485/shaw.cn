document.addEventListener('DOMContentLoaded', () => {
    const isLocal = ['127.0.0.1', 'localhost'].includes(window.location.hostname);
    const apiRoot = isLocal ? 'http://127.0.0.1:8000' : '/search-eval-api';
    const store = window.SearchConsoleStore;
    const releaseApi = window.SearchReleaseContract;
    const releaseDiagnostics = window.SearchUiDiagnostics;
    const logList = document.getElementById('logList');
    const logSearch = document.getElementById('logSearch');
    const logStatus = document.getElementById('logStatus');
    const tabCount = document.getElementById('tabLogCount');
    const visibleCount = document.getElementById('visibleLogCount');
    const approvedStrategyCount = document.getElementById('approvedStrategyCount');
    const historyStrategyCount = document.getElementById('historyStrategyCount');
    const historyActivityCount = document.getElementById('historyActivityCount');
    const historyReleaseCount = document.getElementById('historyReleaseCount');
    const historyApprovedNotActiveCount = document.getElementById('historyApprovedNotActiveCount');
    const historyRolledBackCount = document.getElementById('historyRolledBackCount');
    const historySearch = document.getElementById('historySearch');
    const strategyCatalogState = document.getElementById('strategyCatalogState');
    const approvedStrategyList = document.getElementById('approvedStrategyList');
    const strategyActivityList = document.getElementById('strategyActivityList');
    const retrievalReleaseList = document.getElementById('retrievalReleaseList');
    const activeServingState = document.getElementById('activeServingState');
    const activeServingStrategy = document.getElementById('activeServingStrategy');
    const activeServingRevision = document.getElementById('activeServingRevision');
    const activeServingIndex = document.getElementById('activeServingIndex');
    const activeServingHealth = document.getElementById('activeServingHealth');
    const activeServingRollout = document.getElementById('activeServingRollout');
    const activeServingNote = document.getElementById('activeServingNote');
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
    const getReleases = () => Array.isArray(catalogPayload?.retrieval_releases) ? catalogPayload.retrieval_releases : [];
    const getActiveRelease = () => (
        catalogPayload?.active_retrieval_release && typeof catalogPayload.active_retrieval_release === 'object'
            ? catalogPayload.active_retrieval_release
            : null
    );
    const matchesHistorySearch = (item) => {
        const keyword = historySearch?.value.trim().toLowerCase() || '';
        if (!keyword) return true;
        return [item.name, item.strategy_name, item.strategy_id, item.strategy_revision, item.proposal_id, item.proposal_revision, item.decision_id, item.comparison_id, item.stage, item.lifecycle, item.index_id]
            .filter(Boolean).join(' ').toLowerCase().includes(keyword);
    };

    const releaseRevision = (item) => item?.strategy_revision
        || item?.active_strategy_revision
        || item?.config_sha256
        || item?.config_sha
        || item?.revision
        || null;
    const isCurrentRelease = (item) => {
        const active = getActiveRelease();
        if (!active || item?.lifecycle !== 'active') return false;
        const itemRevision = releaseRevision(item);
        const activeRevision = releaseRevision(active);
        if (itemRevision && activeRevision) return itemRevision === activeRevision;
        return Boolean(item?.proposal_id && item.proposal_id === active.proposal_id);
    };
    const approvedNotActiveStates = new Set(['approved_for_validation', 'validating', 'staged', 'canary']);
    const releaseStatus = (item) => {
        if (isCurrentRelease(item)) return { label: '当前生效', className: 'is-active' };
        if (item?.lifecycle === 'rolled_back') return { label: '已回滚', className: 'is-rolled-back' };
        if (approvedNotActiveStates.has(item?.lifecycle)) return { label: '已批准未上线', className: 'is-approved' };
        if (['rejected', 'rejected_by_gate', 'validation_failed'].includes(item?.lifecycle)) return { label: releaseApi?.lifecycleLabel(item.lifecycle) || item.lifecycle, className: 'is-rejected' };
        return { label: releaseApi?.lifecycleLabel(item?.lifecycle) || '等待状态', className: '' };
    };

    const renderActiveServing = () => {
        const active = getActiveRelease();
        activeServingState.classList.remove('is-active', 'is-error');
        if (!active) {
            activeServingState.classList.add('is-error');
            activeServingState.textContent = '尚无 active release';
            activeServingStrategy.textContent = 'Baseline only';
            activeServingRevision.textContent = '—';
            activeServingIndex.textContent = '—';
            activeServingHealth.textContent = 'not_ready';
            activeServingRollout.textContent = '—';
            activeServingNote.textContent = '当前仅提供 baseline。已批准但尚未 active 的候选不会被搜索对照页调用。';
            return;
        }
        const state = active.lifecycle || 'active';
        const healthValue = typeof active.health === 'object'
            ? active.health?.status || active.health?.state || null
            : active.health;
        const ready = state === 'active' && (
            active.ready === true
            || ['ready', 'healthy', 'ok'].includes(String(healthValue || '').toLowerCase())
        );
        activeServingState.classList.add(ready ? 'is-active' : 'is-error');
        activeServingState.textContent = ready ? 'Active serving ready' : 'Active serving 未就绪';
        activeServingStrategy.textContent = active.strategy_name || active.strategy_id || '—';
        activeServingRevision.textContent = releaseRevision(active) || '—';
        activeServingIndex.textContent = active.index_id || '—';
        activeServingHealth.textContent = formatValue(active.health || (ready ? 'ready' : 'not_ready'));
        activeServingRollout.textContent = formatValue(active.rollout);
        activeServingNote.textContent = ready
            ? 'active pointer、策略 revision 与索引已对齐；搜索对照页可请求 active endpoint。'
            : 'active release 的健康或兼容性证据不完整，搜索对照页会保持优化后搜索禁用。';
    };

    const rollbackHref = (item) => {
        const strategyRevision = releaseRevision(item);
        const targetRevision = item?.previous_revision;
        if (!isCurrentRelease(item)
            || !releaseApi?.PROPOSAL_ID.test(item?.proposal_id || '')
            || !releaseApi?.REVISION.test(item?.proposal_revision || '')
            || !releaseApi?.REVISION.test(strategyRevision || '')
            || !releaseApi?.REVISION.test(targetRevision || '')) return null;
        return `search-owner.html?${new URLSearchParams({
            action: 'rollback',
            proposal_id: item.proposal_id,
            proposal_revision: item.proposal_revision,
            expected_active_revision: strategyRevision,
            target_revision: targetRevision
        }).toString()}`;
    };

    const renderReleaseHistory = () => {
        const releases = getReleases();
        const filtered = releases.filter(matchesHistorySearch);
        historyReleaseCount.textContent = String(releases.length);
        historyApprovedNotActiveCount.textContent = String(releases.filter((item) => approvedNotActiveStates.has(item?.lifecycle) && !isCurrentRelease(item)).length);
        historyRolledBackCount.textContent = String(releases.filter((item) => item?.lifecycle === 'rolled_back').length);
        if (!filtered.length) {
            retrievalReleaseList.innerHTML = `<div class="history-empty"><strong>${releases.length ? '没有符合条件的发布记录' : '还没有 retrieval release'}</strong><p>${releases.length ? '清空筛选词后查看全部 lifecycle。' : '候选通过门禁后会先进入 pending_owner_review；批准并不等于已上线。'}</p></div>`;
            return;
        }
        retrievalReleaseList.innerHTML = filtered.map((item) => {
            const status = releaseStatus(item);
            const rollback = rollbackHref(item);
            const rollout = formatValue(item.rollout);
            return `<article class="release-status-card">
                <header>
                    <div><h3>${escapeHtml(item.strategy_name || item.strategy_id || item.proposal_id || 'Retrieval release')}</h3><p>${escapeHtml(releaseApi?.lifecycleLabel(item.lifecycle) || item.lifecycle || '状态未记录')} · ${escapeHtml(formatTime(item.updated_at || item.occurred_at || item.created_at))}</p></div>
                    <span class="release-badge ${escapeHtml(status.className)}">${escapeHtml(status.label)}</span>
                </header>
                <div class="release-status-body">
                    <dl class="release-state-grid">
                        <div><dt>Proposal</dt><dd><code>${escapeHtml(item.proposal_id || '—')}</code></dd></div>
                        <div><dt>Strategy revision</dt><dd><code>${escapeHtml(releaseRevision(item) || '—')}</code></dd></div>
                        <div><dt>Index</dt><dd><code>${escapeHtml(item.index_id || '—')}</code></dd></div>
                        <div><dt>Health / Rollout</dt><dd>${escapeHtml(item.health || '—')} · ${escapeHtml(rollout)}</dd></div>
                    </dl>
                    <div class="release-card-actions"><p>${isCurrentRelease(item) ? '这是 active pointer 当前指向的版本。' : approvedNotActiveStates.has(item.lifecycle) ? '已获批准，但尚未成为当前 active serving。' : item.lifecycle === 'rolled_back' ? '该版本已退出 active serving，可从活动日志复核回滚事件。' : '状态由服务器 release catalog 返回。'}</p>${rollback ? `<a class="release-rollback-button" role="button" href="${escapeHtml(rollback)}">Owner 一键回滚</a>` : ''}</div>
                </div>
            </article>`;
        }).join('');
    };

    const renderStrategyHistory = () => {
        const history = getHistory();
        const filtered = history.filter(matchesHistorySearch);
        const activeRelease = getActiveRelease();
        const activeStrategyId = activeRelease?.strategy_id || catalogPayload?.active_strategy_id || null;
        const activeStrategyRevision = releaseRevision(activeRelease);
        if (approvedStrategyCount) approvedStrategyCount.textContent = String(history.length);
        if (historyStrategyCount) historyStrategyCount.textContent = String(history.length);
        if (!filtered.length) {
            approvedStrategyList.innerHTML = `<div class="history-empty"><strong>${history.length ? '没有符合条件的策略版本' : '还没有已采用策略'}</strong><p>${history.length ? '清空筛选词后查看全部记录。' : 'Agent 只生成候选提案；站长批准后，版本快照会出现在这里。'}</p></div>`;
            return;
        }
        approvedStrategyList.innerHTML = filtered.map((strategy) => {
            const strategyRevision = releaseRevision(strategy);
            const active = strategy.strategy_id === activeStrategyId
                && (!activeStrategyRevision || !strategyRevision || strategyRevision === activeStrategyRevision)
                && history.findIndex((item) => item.strategy_id === activeStrategyId && (!activeStrategyRevision || !releaseRevision(item) || releaseRevision(item) === activeStrategyRevision)) === history.indexOf(strategy);
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
                        <span>Revision：<code>${escapeHtml(strategyRevision || '—')}</code></span>
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
        strategyActivityList.innerHTML = filtered.map((event) => {
            const state = event.lifecycle || event.to_lifecycle || event.event_type || 'activity_recorded';
            const stateLabel = releaseApi?.LIFECYCLE_STATES.includes(state)
                ? releaseApi.lifecycleLabel(state)
                : (event.stage || '状态已记录');
            return `<article class="activity-item">
                <time>${escapeHtml(formatTime(event.occurred_at))}</time>
                <div><strong>${escapeHtml(event.strategy_name || event.strategy_id || '策略版本')}</strong><p>${escapeHtml(event.message || `发布状态更新为 ${stateLabel}。`)}</p></div>
                <span>${escapeHtml(stateLabel)}</span>
                <dl><div><dt>策略 ID</dt><dd>${escapeHtml(event.strategy_id || '—')}</dd></div><div><dt>Strategy revision</dt><dd>${escapeHtml(releaseRevision(event) || '—')}</dd></div><div><dt>Proposal</dt><dd>${escapeHtml(event.proposal_id || '—')}</dd></div></dl>
            </article>`;
        }).join('');
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
        const releaseCount = getReleases().length;
        strategyCatalogState.classList.remove('error');
        strategyCatalogState.textContent = releaseCount
            ? `已读取 ${releaseCount} 条 retrieval release 与 ${historyCount} 个策略快照；批准、上线和回滚状态分别展示。`
            : '暂无 retrieval release。Agent 可公开生成候选；采用与生效必须由站长在服务器后台批准，并通过 Owner 受保护页面操作。';
        renderActiveServing();
        renderReleaseHistory();
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
                releaseCount: getReleases().length,
                activeStrategyPresent: Boolean(getActiveRelease())
            });
            releaseDiagnostics?.log('release-lifecycle-ui', 'debug', 'release_catalog_rendered', {
                releaseCount: getReleases().length,
                approvedNotActiveCount: getReleases().filter((item) => approvedNotActiveStates.has(item?.lifecycle) && !isCurrentRelease(item)).length,
                rolledBackCount: getReleases().filter((item) => item?.lifecycle === 'rolled_back').length,
                activePresent: Boolean(getActiveRelease())
            });
        } catch (error) {
            catalogPayload = {};
            approvedStrategyCount.textContent = '0';
            historyStrategyCount.textContent = '0';
            historyActivityCount.textContent = '0';
            historyReleaseCount.textContent = '0';
            historyApprovedNotActiveCount.textContent = '0';
            historyRolledBackCount.textContent = '0';
            strategyCatalogState.classList.add('error');
            strategyCatalogState.textContent = '策略历史暂时不可用，请稍后重试。';
            renderActiveServing();
            renderReleaseHistory();
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
        renderReleaseHistory();
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
