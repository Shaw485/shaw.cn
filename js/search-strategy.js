document.addEventListener('DOMContentLoaded', () => {
    const store = window.SearchConsoleStore;
    const logList = document.getElementById('logList');
    const logSearch = document.getElementById('logSearch');
    const logStatus = document.getElementById('logStatus');
    const tabCount = document.getElementById('tabLogCount');
    const visibleCount = document.getElementById('visibleLogCount');

    const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char]));

    const statusLabel = { success: '成功', error: '失败', aborted: '已取消', running: '进行中' };
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
});
