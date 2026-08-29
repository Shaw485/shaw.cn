(function () {
    'use strict';

    const agentRegistry = Object.freeze([
        Object.freeze({
            id: 'prd-agent',
            name: 'PRD Agent',
            mark: 'PRD',
            status: '待接入',
            capabilities: Object.freeze(['知识检索', '证据引用', '版本判断']),
            summary: '计划接入企业知识检索、证据引用和版本判断；现有 PRD Agent 尚未接入本 Harness。',
            endpoint: null,
            contractVersion: null
        }),
        Object.freeze({
            id: 'search-agent',
            name: '搜索 Agent',
            mark: 'SEA',
            status: '待接入',
            capabilities: Object.freeze(['Bad Case 诊断', '候选策略', '离线 Harness 对比']),
            summary: '计划接入搜索 Bad Case、候选策略和离线评测证据；现有搜索 Agent 尚未接入本 Harness。',
            endpoint: null,
            contractVersion: null
        })
    ]);

    const diagnostics = createDiagnostics();

    function createDiagnostics() {
        const allowedModules = new Set([
            'registry-ui',
            'run-ui',
            'evaluation-ui',
            'approval-ui',
            'trace-ui',
            'navigation'
        ]);
        const sensitiveFieldPattern = /(authorization|password|passwd|secret|token|prompt|query|document|content|cookie)/i;
        const sensitiveValuePattern = /\b(?:bearer|basic)\s+[a-z0-9+/=._-]+|\b(?:password|passwd|secret|token)\s*[:=]\s*\S+/gi;
        const history = [];
        const maxEntries = 200;
        let enabled = false;
        let errorLoggingEnabled = true;
        let enabledModules = new Set();

        try {
            enabled = localStorage.getItem('shaw.debug.agent-harness') === '1';
            errorLoggingEnabled = localStorage.getItem('shaw.debug.agent-harness.errors') !== '0';
            enabledModules = new Set(
                (localStorage.getItem('shaw.debug.agent-harness.modules') || '')
                    .split(',')
                    .map(item => item.trim())
                    .filter(item => allowedModules.has(item))
            );
        } catch (_) {
            enabled = false;
        }

        function sanitize(value, depth = 0) {
            if (depth > 3) return '[depth-limited]';
            if (value === null || value === undefined) return value;
            if (Array.isArray(value)) return value.slice(0, 20).map(item => sanitize(item, depth + 1));
            if (typeof value === 'string') return value.replace(sensitiveValuePattern, '[redacted]').slice(0, 160);
            if (typeof value !== 'object') return value;
            return Object.fromEntries(
                Object.entries(value).map(([key, child]) => [
                    key,
                    sensitiveFieldPattern.test(key) ? '[redacted]' : sanitize(child, depth + 1)
                ])
            );
        }

        function shouldWrite(module, level) {
            if (!allowedModules.has(module)) return false;
            if (enabledModules.size > 0 && !enabledModules.has(module)) return false;
            if (level === 'warn' || level === 'error') return errorLoggingEnabled;
            return enabled;
        }

        function log(module, level, event, context = {}) {
            if (!shouldWrite(module, level)) return;
            const entry = {
                timestamp: new Date().toISOString(),
                module,
                level,
                event,
                context: sanitize(context)
            };
            history.push(entry);
            if (history.length > maxEntries) history.splice(0, history.length - maxEntries);
            const writer = typeof console[level] === 'function' ? console[level] : console.log;
            writer.call(console, `[agent-harness:${module}] ${event}`, entry);
        }

        function exportLogs() {
            return JSON.stringify({
                exportedAt: new Date().toISOString(),
                debugEnabled: enabled,
                errorLoggingEnabled,
                enabledModules: [...enabledModules],
                entries: history.slice()
            }, null, 2);
        }

        return Object.freeze({
            log,
            exportLogs,
            isEnabled: () => enabled,
            enabledModules: () => [...enabledModules]
        });
    }

    function createAgentCard(agent, showAction) {
        const capabilityList = agent.capabilities.map(item => `<li>${item}</li>`).join('');
        return `
            <article class="agent-slot-card" data-agent-id="${agent.id}">
                <header>
                    <div class="agent-slot-identity">
                        <span class="agent-slot-mark" aria-hidden="true">${agent.mark}</span>
                        <div><h4>${agent.name}</h4><p>Adapter 尚未配置</p></div>
                    </div>
                    <span class="agent-slot-status">${agent.status}</span>
                </header>
                <p class="agent-slot-summary">${agent.summary}</p>
                <ul class="agent-capabilities" aria-label="${agent.name} 计划能力">${capabilityList}</ul>
                <div class="agent-slot-meta">
                    <span>Contract <code>—</code></span>
                    <span>Endpoint <code>—</code></span>
                </div>
                ${showAction ? '<button type="button" disabled title="Adapter 尚未接入">等待接入</button>' : ''}
            </article>`;
    }

    function renderRegistry() {
        const preview = document.getElementById('agentRegistryPreview');
        const full = document.getElementById('agentRegistryFull');
        if (!preview || !full) {
            diagnostics.log('registry-ui', 'error', 'registry-container-missing', {
                previewFound: Boolean(preview),
                fullFound: Boolean(full)
            });
            return;
        }
        preview.innerHTML = agentRegistry.map(agent => createAgentCard(agent, false)).join('');
        full.innerHTML = agentRegistry.map(agent => createAgentCard(agent, true)).join('');
        diagnostics.log('registry-ui', 'debug', 'registry-rendered', {
            agentCount: agentRegistry.length,
            connectedCount: agentRegistry.filter(agent => Boolean(agent.endpoint)).length
        });
    }

    function setupTabs() {
        const tabButtons = [...document.querySelectorAll('[data-harness-tab]')];
        const panels = [...document.querySelectorAll('[data-harness-panel]')];

        if (!tabButtons.length || !panels.length) {
            diagnostics.log('navigation', 'error', 'tab-structure-missing', {
                buttonCount: tabButtons.length,
                panelCount: panels.length
            });
            return;
        }

        function activateTab(tabId, options = {}) {
            const targetPanel = panels.find(panel => panel.dataset.harnessPanel === tabId);
            if (!targetPanel) {
                diagnostics.log('navigation', 'warn', 'unknown-tab-requested', { requestedTabKnown: false });
                return;
            }
            tabButtons.forEach(button => {
                const isActive = button.dataset.harnessTab === tabId;
                button.classList.toggle('is-active', isActive);
                button.setAttribute('aria-selected', String(isActive));
                button.tabIndex = isActive ? 0 : -1;
            });
            panels.forEach(panel => {
                const isActive = panel === targetPanel;
                panel.classList.toggle('is-active', isActive);
                panel.hidden = !isActive;
            });
            if (options.updateHash !== false) history.replaceState(null, '', `#${tabId}`);
            if (options.focus) targetPanel.querySelector('h2')?.focus({ preventScroll: true });
            diagnostics.log('navigation', 'debug', 'tab-opened', { tabId, source: options.source || 'unknown' });
            const panelModules = {
                registry: 'registry-ui',
                runs: 'run-ui',
                evaluation: 'evaluation-ui',
                approvals: 'approval-ui',
                traces: 'trace-ui'
            };
            if (panelModules[tabId]) {
                diagnostics.log(panelModules[tabId], 'debug', 'panel-state-rendered', {
                    tabId,
                    runtimeConnected: false,
                    itemCount: tabId === 'registry' ? agentRegistry.length : 0
                });
            }
        }

        tabButtons.forEach(button => {
            button.addEventListener('click', () => activateTab(button.dataset.harnessTab, {
                source: 'sidebar',
                updateHash: true
            }));
            button.addEventListener('keydown', event => {
                const currentIndex = tabButtons.indexOf(button);
                let nextIndex = null;
                if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % tabButtons.length;
                if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
                if (event.key === 'Home') nextIndex = 0;
                if (event.key === 'End') nextIndex = tabButtons.length - 1;
                if (nextIndex === null) return;
                event.preventDefault();
                const nextButton = tabButtons[nextIndex];
                activateTab(nextButton.dataset.harnessTab, { source: 'keyboard', updateHash: true });
                nextButton.focus();
            });
        });

        document.querySelectorAll('[data-open-tab]').forEach(button => {
            button.addEventListener('click', () => activateTab(button.dataset.openTab, {
                source: 'inline-action',
                updateHash: true,
                focus: true
            }));
        });

        const requestedTab = window.location.hash.replace('#', '');
        if (panels.some(panel => panel.dataset.harnessPanel === requestedTab)) {
            activateTab(requestedTab, { source: 'initial-hash', updateHash: false });
        } else {
            activateTab('overview', { source: 'initial-load', updateHash: false });
            if (requestedTab === 'integration') {
                requestAnimationFrame(() => document.getElementById('integration')?.scrollIntoView({ block: 'start' }));
            }
        }
    }

    function setupMobileNavigation() {
        const toggle = document.querySelector('.nav-toggle');
        const links = document.querySelector('.nav-links');
        if (!toggle || !links) return;

        function setOpen(open) {
            links.classList.toggle('mobile-open', open);
            toggle.setAttribute('aria-expanded', String(open));
            diagnostics.log('navigation', 'debug', 'mobile-menu-changed', { open });
        }

        toggle.addEventListener('click', () => setOpen(!links.classList.contains('mobile-open')));
        links.addEventListener('click', event => {
            if (event.target.closest('a')) setOpen(false);
        });
    }

    function markLogMode() {
        const indicator = document.getElementById('harnessLogMode');
        if (!indicator) return;
        if (!diagnostics.isEnabled()) {
            indicator.textContent = '生产调试：关闭';
            return;
        }
        const modules = diagnostics.enabledModules();
        indicator.textContent = modules.length ? `调试：${modules.join('、')}` : '调试：全部模块';
    }

    window.ShawHarnessDiagnostics = Object.freeze({
        exportLogs: diagnostics.exportLogs,
        getRegistrySnapshot: () => agentRegistry.map(agent => ({
            id: agent.id,
            name: agent.name,
            status: agent.status,
            connected: Boolean(agent.endpoint),
            contractVersion: agent.contractVersion
        }))
    });

    renderRegistry();
    setupTabs();
    setupMobileNavigation();
    markLogMode();
    diagnostics.log('navigation', 'debug', 'page-ready', {
        page: 'agent-harness',
        registryCount: agentRegistry.length,
        runtimeConnected: false
    });
})();
