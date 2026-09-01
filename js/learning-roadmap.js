(function () {
    'use strict';

    const DEBUG_KEY = 'shaw.debug.learning-roadmap';
    const MODULES_KEY = 'shaw.debug.learning-roadmap.modules';
    const ERRORS_KEY = 'shaw.debug.learning-roadmap.errors';
    const LOG_LIMIT = 100;
    const SAFE_CONTEXT_KEYS = new Set(['week', 'action', 'rowCount', 'result', 'errorType']);
    const AVAILABLE_MODULES = new Set(['render', 'interaction']);
    const logs = [];
    const sessionId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID().slice(0, 8)
        : `lr-${Date.now().toString(36)}`;

    const roadmap = [
        {
            week: 1,
            title: '评测与统计基础',
            status: '正在验证',
            action: '建立指标字典并复算现有评测结果，重点区分相关性质量、系统行为与运行成功，补齐样本、标签、平均方式和不确定性边界。',
            deliverable: '指标字典、可复算示例、评测边界说明与一份失败样本复盘。',
            acceptance: '能从固定输入复算指标并解释适用边界；不会把 Smoke、结果数量变化或 Agent 行为分数写成正式质量提升。'
        },
        {
            week: 2,
            title: '搜索评测 Agent',
            status: '正在验证',
            action: '用公开 ESCI 数据冻结 Query、相关性标签、索引和策略版本，复跑 BM25 基线与受控候选，并分析变好、变差及不变的 Query。',
            deliverable: '数据卡、基线与候选对比报告、指标定义、Bad Case 清单和可复核运行记录。',
            acceptance: '基线与候选使用同一固定标注集；结论包含版本、样本边界和证据链接，并能据此作出 Go、Iterate 或 Stop 决策。'
        },
        {
            week: 3,
            title: 'PRD Agent 分层评测',
            status: '正在验证',
            action: '只使用公开、合成或充分脱敏资料，分别评测文档召回、证据覆盖、回答生成、版本与权限边界，避免只看最终回答。',
            deliverable: '分层评测方案、评测集数据卡、可追踪 Trace、版本对比与错误归因报告。',
            acceptance: '每个结论都能追溯到来源和版本；失败能归因到数据、召回、重排、生成或权限层，并明确下一步产品取舍。'
        },
        {
            week: 4,
            title: '对话安全评测 Lab',
            status: '待开始',
            action: '项目建立后再定义安全风险分类、测试边界、红队样本和人工复核规则；当前不提前展示项目或结果。',
            deliverable: '经确认可公开的数据卡、风险 Rubric、基线报告、Bad Case 与限制说明。',
            acceptance: '只有真实项目、合法数据、固定版本和可复核结果同时存在后才进入“正在验证”；否则持续保持待开始。'
        },
        {
            week: 5,
            title: '0.015B 自研模型受控训练',
            status: '已验证',
            action: '在固定语料、随机种子、配置和评测协议下完成预训练与 SFT 对照，复核数据清单、训练曲线、Checkpoint 和能力保持性。',
            deliverable: '语料与 Token 清单、冻结配置、训练报告、Checkpoint 对比、固定探针评测、校验和及最终决策。',
            acceptance: '受控实验可以复现并已形成 Stop / Iterate 结论；严格候选为空、未过发布门禁的权重不公开，也不把流程完成写成模型质量达标。'
        },
        {
            week: 6,
            title: '用户研究与产品验证',
            status: '待开始',
            action: '围绕招聘者和 AI 产品从业者设计访谈与任务测试，验证定位、案例证据、个人贡献和联系入口是否能被快速理解。',
            deliverable: '研究计划、脱敏记录、关键洞察、问题优先级、修改方案与复测结论。',
            acceptance: '产品改动由真实观察支持而非主观偏好；每个高优问题都有对应修改和复测证据。'
        },
        {
            week: 7,
            title: 'ShawSpace 求职作品集',
            status: '正在验证',
            action: '把首页重构为招聘者 90 秒路径，优先展示真实旗舰案例、个人贡献、AI 协作边界、证据入口和明确求职 CTA。',
            deliverable: '上线后的招聘首页、统一案例页、能力证据矩阵，以及真实存在后再发布的简历、One-pager 与演示入口。',
            acceptance: '每项能力和数字均可追溯；桌面与移动端关键链路可用，自动测试、链接检查、模块日志和可回滚部署全部通过。'
        },
        {
            week: 8,
            title: '面试验证与定向投递',
            status: '待开始',
            action: '围绕目标 JD 进行案例讲解和模拟面试，记录追问、表达断点与证据缺口，再据反馈迭代材料并开始定向投递。',
            deliverable: '案例讲稿、问题库、模拟面试反馈、JD 对齐表、定制简历版本和投递复盘。',
            acceptance: '能用证据讲清问题、角色、实验、取舍、失败与限制；根据真实面试反馈关闭主要缺口后，再扩大投递。'
        }
    ];

    function readModuleFilter() {
        try {
            const raw = localStorage.getItem(MODULES_KEY);
            if (!raw) return null;
            const selected = raw.split(',').map(value => value.trim()).filter(value => AVAILABLE_MODULES.has(value));
            return selected.length ? new Set(selected) : null;
        } catch (error) {
            return null;
        }
    }

    function debugEnabled() {
        try { return localStorage.getItem(DEBUG_KEY) === '1'; } catch (error) { return false; }
    }

    function errorLoggingEnabled() {
        try { return localStorage.getItem(ERRORS_KEY) !== '0'; } catch (error) { return true; }
    }

    function safeContext(context) {
        const safe = {};
        Object.entries(context || {}).forEach(([key, value]) => {
            if (!SAFE_CONTEXT_KEYS.has(key)) return;
            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') safe[key] = value;
        });
        return safe;
    }

    function learningLog(module, level, event, context) {
        if (!AVAILABLE_MODULES.has(module)) return;
        const selectedModules = readModuleFilter();
        if (selectedModules && !selectedModules.has(module)) return;
        const isFailure = level === 'warn' || level === 'error';
        if (isFailure ? !errorLoggingEnabled() : !debugEnabled()) return;

        const entry = {
            timestamp: new Date().toISOString(),
            sessionId,
            module,
            level,
            event,
            context: safeContext(context)
        };
        logs.push(entry);
        if (logs.length > LOG_LIMIT) logs.splice(0, logs.length - LOG_LIMIT);
        const writer = level === 'error' ? console.error : level === 'warn' ? console.warn : console.debug;
        writer('[learning-roadmap]', entry);
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }

    function renderRoadmap() {
        const list = document.getElementById('learningRoadmapList');
        if (!list) {
            learningLog('render', 'warn', 'roadmap-rendered', { rowCount: 0, result: 'container-missing' });
            return;
        }

        list.innerHTML = roadmap.map(item => {
            const week = String(item.week);
            const buttonId = `learning-week-toggle-${week}`;
            const panelId = `learning-week-panel-${week}`;
            return `<li class="learning-week" data-learning-week="${week}">
                <button class="learning-week-toggle" id="${buttonId}" type="button" data-week="${week}" aria-expanded="false" aria-controls="${panelId}">
                    <span class="learning-week-code">W${week}</span>
                    <span class="learning-week-title">${escapeHtml(item.title)}</span>
                    <span class="learning-week-status" data-status="${escapeHtml(item.status)}">${escapeHtml(item.status)}</span>
                    <svg class="learning-week-chevron" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M10 4v12M4 10h12"/></svg>
                </button>
                <div class="learning-week-panel" id="${panelId}" role="region" aria-labelledby="${buttonId}" hidden>
                    <dl>
                        <div class="learning-week-detail" data-roadmap-detail="action"><dt>本周行动</dt><dd>${escapeHtml(item.action)}</dd></div>
                        <div class="learning-week-detail" data-roadmap-detail="deliverable"><dt>可交付物</dt><dd>${escapeHtml(item.deliverable)}</dd></div>
                        <div class="learning-week-detail" data-roadmap-detail="acceptance"><dt>通过标准</dt><dd>${escapeHtml(item.acceptance)}</dd></div>
                    </dl>
                </div>
            </li>`;
        }).join('');
        learningLog('render', 'debug', 'roadmap-rendered', { rowCount: roadmap.length, result: 'success' });
    }

    function setExpandedWeek(targetWeek) {
        const list = document.getElementById('learningRoadmapList');
        const status = document.getElementById('learningRoadmapStatus');
        if (!list) return;
        list.querySelectorAll('.learning-week-toggle').forEach(button => {
            const shouldOpen = Number(button.dataset.week) === targetWeek;
            const panel = document.getElementById(button.getAttribute('aria-controls'));
            button.setAttribute('aria-expanded', String(shouldOpen));
            if (panel) panel.hidden = !shouldOpen;
            button.closest('.learning-week')?.classList.toggle('is-open', shouldOpen);
        });
        if (status) status.textContent = targetWeek ? `W${targetWeek} 已展开` : '所有周次已收起';
    }

    function bindRoadmap() {
        const list = document.getElementById('learningRoadmapList');
        if (!list) return;
        const toggleWeek = button => {
            const week = Number(button.dataset.week);
            const willOpen = button.getAttribute('aria-expanded') !== 'true';
            setExpandedWeek(willOpen ? week : null);
            learningLog('interaction', 'debug', 'week-toggled', { week, action: willOpen ? 'expand' : 'collapse' });
        };
        list.addEventListener('click', event => {
            const button = event.target.closest('.learning-week-toggle');
            if (!button) return;
            toggleWeek(button);
        });
        list.addEventListener('keydown', event => {
            const button = event.target.closest('.learning-week-toggle');
            if (!button) return;
            if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
                event.preventDefault();
                toggleWeek(button);
                return;
            }
            if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
            const buttons = [...list.querySelectorAll('.learning-week-toggle')];
            const currentIndex = buttons.indexOf(document.activeElement);
            if (currentIndex < 0) return;
            event.preventDefault();
            let nextIndex = currentIndex;
            if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % buttons.length;
            if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
            if (event.key === 'Home') nextIndex = 0;
            if (event.key === 'End') nextIndex = buttons.length - 1;
            buttons[nextIndex].focus();
        });
    }

    function bindPageChrome() {
        const navbar = document.querySelector('.navbar');
        const navToggle = document.querySelector('.nav-toggle');
        const navLinksContainer = document.querySelector('.nav-links');
        const navLinks = document.querySelectorAll('.nav-link');
        const backToTop = document.getElementById('backToTop');

        const setMenuOpen = open => {
            navLinksContainer?.classList.toggle('mobile-open', open);
            navToggle?.setAttribute('aria-expanded', String(open));
            navToggle?.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
            const spans = navToggle?.querySelectorAll('span');
            if (!spans?.length) return;
            spans[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
            spans[1].style.opacity = open ? '0' : '';
            spans[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
        };

        navToggle?.addEventListener('click', () => {
            setMenuOpen(navToggle.getAttribute('aria-expanded') !== 'true');
        });
        navLinks.forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
        backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        const updateScrollChrome = () => {
            navbar?.classList.toggle('scrolled', window.scrollY > 20);
            backToTop?.classList.toggle('visible', window.scrollY > 500);
        };
        window.addEventListener('scroll', updateScrollChrome, { passive: true });
        updateScrollChrome();
    }

    window.shawLearningRoadmapDebug = Object.freeze({
        enable(modules = ['render', 'interaction']) {
            localStorage.setItem(DEBUG_KEY, '1');
            localStorage.setItem(MODULES_KEY, modules.filter(module => AVAILABLE_MODULES.has(module)).join(','));
        },
        disable() { localStorage.removeItem(DEBUG_KEY); },
        setErrorLogging(enabled) { localStorage.setItem(ERRORS_KEY, enabled ? '1' : '0'); },
        clear() { logs.length = 0; },
        exportLogs() { return logs.map(entry => ({ ...entry, context: { ...entry.context } })); }
    });

    try {
        renderRoadmap();
        bindRoadmap();
        bindPageChrome();
    } catch (error) {
        learningLog('render', 'error', 'roadmap-rendered', { rowCount: 0, result: 'failed', errorType: error?.name || 'Error' });
        throw error;
    }
})();
