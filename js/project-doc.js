document.addEventListener('DOMContentLoaded', () => {
    const documents = Object.freeze({
        'math-alarm-prd': ['数学题闹钟 · 完整 PRD', 'project-docs/math-alarm-prd.txt?v=20260901-project-media-v1', '数学题闹钟-完整PRD.txt'],
        'math-alarm-changelog': ['数学题闹钟 · 版本记录', '%E6%94%B9%E5%8A%A8%E8%AE%B0%E5%BD%95.txt?v=20260901-project-media-v1', '数学题闹钟-版本记录.txt'],
        'math-alarm-readme': ['数学题闹钟 · README', 'project-docs/math-alarm-readme.txt?v=20260901-latest-records-v2', '数学题闹钟-README.txt'],
        'brain-egg-overview': ['怪奇之原 · 玩法与功能说明', 'brain-egg-overview.txt?v=20260901-latest-records-v2', '怪奇之原-玩法说明.txt'],
        'brain-egg-changelog': ['怪奇之原 · 版本记录', 'brain-egg-changelog.txt?v=20260901-brain-egg-complete-changelog-v1', '怪奇之原-版本记录.txt'],
        'gpt-roadmap': ['0.015B 自研模型 · Roadmap', 'project-docs/gpt-roadmap.txt?v=20260901-latest-records-v2', '0.015B自研模型-Roadmap.txt'],
        'gpt-record': ['0.015B 自研模型 · 学习记录', 'project-docs/gpt-record.txt?v=20260901-latest-records-v2', '0.015B自研模型-学习记录.txt'],
        'search-readme': ['搜索引擎评测 Agent · README', 'project-docs/search-readme.txt?v=20260831-utf8-bom-v1', '搜索评测Agent-README.txt'],
        'search-roadmap': ['搜索引擎评测 Agent · Roadmap', 'project-docs/search-roadmap.txt?v=20260831-utf8-bom-v1', '搜索评测Agent-Roadmap.txt'],
        'search-stage0-report': ['搜索引擎评测 Agent · Stage 0 Report', 'project-docs/search-stage0-report.txt?v=20260831-utf8-bom-v1', '搜索评测Agent-Stage0报告.txt'],
        'search-full-catalog-baseline': ['搜索引擎评测 Agent · 全量基线报告', 'project-docs/search-full-catalog-baseline.txt?v=20260901-latest-records-v2', '搜索评测Agent-全量基线报告.txt'],
        'search-agent-evaluation': ['搜索引擎评测 Agent · Agent 行为评测', 'project-docs/search-agent-evaluation.txt?v=20260901-latest-records-v2', '搜索评测Agent-Agent行为评测.txt'],
        'pick-memory-readme': ['Pick Memory · README', 'project-docs/pick-memory-readme.txt?v=20260901-latest-records-v2', 'Pick-Memory-README.txt'],
        'pick-memory-changelog': ['Pick Memory · Changelog', 'project-docs/pick-memory-changelog.txt?v=20260901-latest-records-v2', 'Pick-Memory-Changelog.txt'],
        'agent-harness-debug': ['Agent Harness · 诊断说明', 'project-docs/agent-harness-debug.txt?v=20260831-utf8-bom-v1', 'Agent-Harness-诊断说明.txt']
    });

    const title = document.getElementById('docTitle');
    const status = document.getElementById('docStatus');
    const content = document.getElementById('docContent');
    const download = document.getElementById('docDownload');
    const docId = new URLSearchParams(window.location.search).get('doc') || '';
    const selected = documents[docId];

    const debugEnabled = (() => {
        try { return localStorage.getItem('shaw.debug.project-doc') === '1'; }
        catch (_) { return false; }
    })();
    const log = (level, event, context = {}) => {
        if (!debugEnabled && level === 'debug') return;
        (console[level] || console.log)(`[project-doc:viewer] ${event}`, {
            timestamp: new Date().toISOString(),
            ...context
        });
    };

    if (!selected) {
        document.title = "文档不存在 · Shaw's Space";
        title.textContent = '没有找到这份文档';
        status.textContent = '链接无效或文档尚未公开，请返回项目列表。';
        status.classList.add('is-error');
        log('warn', 'document-id-rejected', { reason: 'not-allowlisted' });
        return;
    }

    const [docTitle, filePath, filename] = selected;
    const fileUrl = new URL(filePath, new URL('.', window.location.href)).href;
    document.title = `${docTitle} · Shaw's Space`;
    title.textContent = docTitle;
    download.href = fileUrl;
    download.download = filename;
    download.hidden = false;

    async function loadDocument() {
        log('debug', 'load-start', { docId });
        try {
            const response = await fetch(fileUrl, { cache: 'no-store' });
            if (!response.ok) throw new Error(`http-${response.status}`);
            const buffer = await response.arrayBuffer();
            const decoded = new TextDecoder('utf-8', { fatal: true }).decode(buffer).replace(/^\uFEFF/, '');
            content.textContent = decoded;
            content.hidden = false;
            status.textContent = '站内 HTML 阅读页 · 可选下载 TXT';
            log('debug', 'load-success', { docId, byteLength: buffer.byteLength });
        } catch (error) {
            status.textContent = '文档读取失败，请使用右上角下载按钮或稍后重试。';
            status.classList.add('is-error');
            log('error', 'load-failed', { docId, reason: error?.message || error?.name || 'unknown' });
        }
    }

    loadDocument();
});
