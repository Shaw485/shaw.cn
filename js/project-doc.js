document.addEventListener('DOMContentLoaded', () => {
    const documents = Object.freeze({
        'math-alarm-readme': ['数学题闹钟 · README', '/project-docs/math-alarm-readme.txt?v=20260831-utf8-bom-v1', '数学题闹钟-README.txt'],
        'brain-egg-overview': ['脑洞皮蛋 · 玩法与功能说明', '/brain-egg-overview.txt?v=20260831-utf8-bom-v1', '脑洞皮蛋-玩法说明.txt'],
        'brain-egg-changelog': ['脑洞皮蛋 · 版本记录', '/brain-egg-changelog.txt?v=20260831-utf8-bom-v1', '脑洞皮蛋-版本记录.txt'],
        'gpt-roadmap': ['手撕 GPT · Roadmap', '/project-docs/gpt-roadmap.txt?v=20260831-utf8-bom-v1', '手撕GPT-Roadmap.txt'],
        'gpt-record': ['手撕 GPT · 学习记录', '/project-docs/gpt-record.txt?v=20260831-utf8-bom-v1', '手撕GPT-学习记录.txt'],
        'search-readme': ['搜索引擎评测 Agent · README', '/project-docs/search-readme.txt?v=20260831-utf8-bom-v1', '搜索评测Agent-README.txt'],
        'search-roadmap': ['搜索引擎评测 Agent · Roadmap', '/project-docs/search-roadmap.txt?v=20260831-utf8-bom-v1', '搜索评测Agent-Roadmap.txt'],
        'search-stage0-report': ['搜索引擎评测 Agent · Stage 0 Report', '/project-docs/search-stage0-report.txt?v=20260831-utf8-bom-v1', '搜索评测Agent-Stage0报告.txt'],
        'pick-memory-readme': ['Pick Memory · README', '/project-docs/pick-memory-readme.txt?v=20260831-utf8-bom-v1', 'Pick-Memory-README.txt'],
        'pick-memory-changelog': ['Pick Memory · Changelog', '/project-docs/pick-memory-changelog.txt?v=20260831-utf8-bom-v1', 'Pick-Memory-Changelog.txt'],
        'agent-harness-debug': ['Agent Harness · 诊断说明', '/project-docs/agent-harness-debug.txt?v=20260831-utf8-bom-v1', 'Agent-Harness-诊断说明.txt']
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

    const [docTitle, fileUrl, filename] = selected;
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
            status.textContent = 'UTF-8 文本 · 可在线阅读或下载';
            log('debug', 'load-success', { docId, byteLength: buffer.byteLength });
        } catch (error) {
            status.textContent = '文档读取失败，请使用右上角下载按钮或稍后重试。';
            status.classList.add('is-error');
            log('error', 'load-failed', { docId, reason: error?.message || error?.name || 'unknown' });
        }
    }

    loadDocument();
});
