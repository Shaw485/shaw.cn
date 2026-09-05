const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('Agent Harness is a dedicated portfolio page with a truthful runtime status', () => {
    const page = read('agent-harness.html');

    assert.match(page, /<title>Agent Harness · Shaw's Space<\/title>/);
    assert.match(page, /<h1>Agent Harness<\/h1>/);
    assert.match(page, /前端框架 · 运行时待接入/);
    assert.match(page, /尚未接入 Agent 运行时，也没有生成任何运行数据/);
    assert.match(page, /href="index\.html">返回作品集<\/a>/);
    assert.doesNotMatch(page, /成功率\s*\d|Token\s*\d|今日运行<\/dt><dd>\d/);
});

test('Harness information architecture covers registry, runs, evidence, approvals and traces', () => {
    const page = read('agent-harness.html');
    const expectedTabs = ['overview', 'registry', 'runs', 'evaluation', 'approvals', 'traces'];

    for (const tab of expectedTabs) {
        assert.match(page, new RegExp(`data-harness-tab="${tab}"`));
        assert.match(page, new RegExp(`data-harness-panel="${tab}"`));
    }

    assert.match(page, /Agent →|Agent<\/strong>/);
    assert.match(page, /Version<\/strong>/);
    assert.match(page, /Run<\/strong>/);
    assert.match(page, /Step \/ Tool Call/);
    assert.match(page, /Artifact \/ Eval/);
    assert.match(page, /Decision<\/strong>/);
    assert.match(page, /暂无运行记录/);
    assert.match(page, /暂无评测结果/);
    assert.match(page, /暂无待审批项/);
    assert.match(page, /暂无 Trace/);
});

test('PRD Agent and Search Agent are explicit unconnected registry slots', () => {
    const script = read('js/agent-harness.js');
    const page = read('agent-harness.html');

    assert.match(script, /id: 'prd-agent'/);
    assert.match(script, /name: 'PRD Agent'/);
    assert.match(script, /id: 'search-agent'/);
    assert.match(script, /name: '搜索 Agent'/);
    assert.equal((script.match(/status: '待接入'/g) || []).length, 2);
    assert.equal((script.match(/endpoint: null/g) || []).length, 2);
    assert.equal((script.match(/contractVersion: null/g) || []).length, 2);
    assert.match(script, /<button type="button" disabled title="Adapter 尚未接入">等待接入<\/button>/);
    assert.match(page, /统一数据协议/);
    assert.match(page, /PRD Agent Adapter/);
    assert.match(page, /搜索 Agent Adapter/);
});

test('Harness has accessible tab navigation and responsive focus states', () => {
    const page = read('agent-harness.html');
    const script = read('js/agent-harness.js');
    const styles = read('css/agent-harness.css');

    assert.match(page, /class="harness-skip-link"/);
    assert.match(page, /aria-label="Agent Harness 功能" role="tablist"/);
    assert.match(page, /role="tab" data-harness-tab="overview"/);
    assert.match(page, /role="tabpanel" data-harness-panel="overview"/);
    assert.match(page, /id="registryTitle" tabindex="-1"/);
    assert.match(page, /aria-selected="true"/);
    assert.match(page, /aria-live="polite"/);
    assert.match(page, /class="nav-toggle" type="button" aria-label="打开菜单" aria-expanded="false"/);
    assert.match(script, /setAttribute\('aria-selected', String\(isActive\)\)/);
    assert.match(script, /event\.key === 'ArrowRight'/);
    assert.match(script, /button\.tabIndex = isActive \? 0 : -1/);
    assert.match(script, /source: 'inline-action',[\s\S]*?focus: true/);
    assert.match(script, /setAttribute\('aria-expanded', String\(open\)\)/);
    assert.match(styles, /:focus-visible/);
    assert.match(styles, /@media \(max-width: 820px\)/);
    assert.match(styles, /min-height: 44px/);
});

test('Harness diagnostics are module-filtered, bounded and redact sensitive fields', () => {
    const script = read('js/agent-harness.js');
    const docs = read('docs/AGENT_HARNESS_DEBUG.md');

    for (const moduleName of [
        'registry-ui',
        'run-ui',
        'evaluation-ui',
        'approval-ui',
        'trace-ui',
        'navigation'
    ]) {
        assert.match(script, new RegExp(`'${moduleName}'`));
        assert.match(docs, new RegExp('`' + moduleName + '`'));
    }

    assert.match(script, /shaw\.debug\.agent-harness/);
    assert.match(script, /shaw\.debug\.agent-harness\.modules/);
    assert.match(script, /shaw\.debug\.agent-harness\.errors/);
    assert.match(script, /const maxEntries = 200/);
    assert.match(script, /\[redacted\]/);
    assert.match(script, /authorization\|password\|passwd\|secret\|token\|prompt\|query\|document\|content\|cookie/i);
    assert.match(script, /sensitiveValuePattern/);
    assert.match(script, /registry-rendered/);
    assert.match(script, /registry-container-missing/);
    assert.match(script, /panel-state-rendered/);
    assert.match(script, /requestedTabKnown: false/);
    assert.doesNotMatch(script, /unknown-tab-requested', \{ tabId \}/);
    assert.match(docs, /生产环境不默认开启 verbose 日志/);
    assert.match(docs, /关闭或刷新页面后，内存日志自动清理/);
    assert.doesNotMatch(`${pageSafe(read('agent-harness.html'))}\n${script}`, /Basic\s+[A-Za-z0-9+/=]{12,}/);
});

test('Agent Harness stays reachable directly but is not a portfolio project card', () => {
    const page = read('index.html');
    const script = read('js/main.js');
    const styles = read('css/styles.css');

    assert.match(page, /<span class="works-count">\(6\)<\/span>/);
    assert.doesNotMatch(script, /title: 'Agent Harness'/);
    assert.doesNotMatch(script, /url: 'agent-harness\.html'/);
    assert.doesNotMatch(script, /href: 'agent-harness\.html#integration'/);
    assert.match(read('agent-harness.html'), /<h1>Agent Harness<\/h1>/);
    assert.match(styles, /\.work-card \{[\s\S]*?aspect-ratio: 1 \/ 1/);
});

function pageSafe(value) {
    return value.replace(/<script[^>]*src=[^>]+><\/script>/g, '');
}
