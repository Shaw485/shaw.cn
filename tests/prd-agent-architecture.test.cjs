const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'js/main.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'css/styles.css'), 'utf8');

function prdAgentBlock() {
    const start = script.indexOf("id: 3,\n            title: 'PRD Agent'");
    const end = script.indexOf("id: 4,\n            title: '搜索引擎评测 Agent'", start);
    assert.notEqual(start, -1, 'PRD Agent project data should exist');
    assert.notEqual(end, -1, 'PRD Agent project boundary should exist');
    return script.slice(start, end);
}

test('PRD Agent square card previews the architecture and opens the full view', () => {
    const block = prdAgentBlock();
    assert.match(block, /cardFlow: \['问题', '权限', '证据', '回答'\]/);
    assert.match(script, /class="work-card-flow"[^>]+架构预览/);
    assert.match(script, /\$\{app\.architecture \? '查看架构' : '查看详情'\}/);
    assert.match(styles, /\.work-card-flow\s*\{[\s\S]*?grid-template-columns:\s*repeat\(4/);
});

test('production workflow is the truthful eight-stage evidence-first RAG path', () => {
    const block = prdAgentBlock();
    const architectureStart = block.indexOf('architecture: {');
    const architectureEnd = block.indexOf('primaryAction:', architectureStart);
    const architecture = block.slice(architectureStart, architectureEnd);
    const stages = [
        '安全入口',
        'Query 解析',
        '候选证据召回',
        '权限过滤',
        '候选重排',
        '证据选择与门控',
        '基于证据生成',
        '引用校验与回答'
    ];

    let previousIndex = -1;
    stages.forEach(stage => {
        const stageIndex = architecture.indexOf(`title: '${stage}'`);
        assert.ok(stageIndex > previousIndex, `${stage} should appear once in production order`);
        previousIndex = stageIndex;
    });
    assert.match(architecture, /证据优先、失败关闭的 RAG 主链/);
    assert.match(architecture, /证据不足时会澄清或拒答/);
    assert.match(architecture, /每个引用都能回到本次证据/);
});

test('Shadow and offline retrieval experiments cannot be mistaken for the online answer path', () => {
    const block = prdAgentBlock();
    assert.match(block, /label: '文档卡 Hybrid Shadow',[\s\S]*?state: '已实现 · 生产默认关闭'/);
    assert.match(block, /只写入诊断 Trace，不增删 Evidence、不改变 Gate，也不改写线上答案/);
    assert.match(block, /label: '有限检索 Loop',[\s\S]*?state: '离线研究 · 不参与线上答案'/);
    assert.match(block, /生产 Runtime 不包含 Planner/);
    assert.match(block, /固定评测集，而不是逐题打补丁/);
});

test('architecture renderer uses semantic controls, safe text rendering and module diagnostics', () => {
    const rendererStart = script.indexOf('function renderPrdArchitecture(app)');
    const rendererEnd = script.indexOf('function openAppModal(', rendererStart);
    const renderer = script.slice(rendererStart, rendererEnd);

    assert.match(index, /id="appModal"[^>]+role="dialog"[^>]+aria-modal="true"[^>]+aria-labelledby="modalTitle"[^>]+aria-hidden="true"/);
    assert.match(index, /id="modalArchitecture"[^>]+aria-labelledby="prdArchitectureTitle"[^>]+hidden/);
    const headerPosition = index.indexOf('class="app-modal-header"');
    const architecturePosition = index.indexOf('id="modalArchitecture"');
    const screenshotsPosition = index.indexOf('class="app-modal-screenshots"');
    const bodyPosition = index.indexOf('class="app-modal-body"');
    assert.ok(
        headerPosition > -1 &&
        headerPosition < architecturePosition &&
        architecturePosition < screenshotsPosition &&
        screenshotsPosition < bodyPosition,
        'modal order must be header, PRD Agent architecture, screenshots, then project body'
    );
    assert.match(index, /id="prdArchitectureTabs"[^>]+role="tablist"/);
    assert.match(renderer, /setAttribute\('role', 'tab'\)/);
    assert.match(renderer, /setAttribute\('role', 'tabpanel'\)/);
    assert.match(renderer, /ArrowRight/);
    assert.match(renderer, /ArrowLeft/);
    assert.match(renderer, /\.textContent =/);
    assert.doesNotMatch(renderer, /innerHTML/);
    assert.match(renderer, /portfolioLog\('architecture', 'debug', 'architecture-rendered'/);
    assert.match(renderer, /portfolioLog\('architecture', 'debug', 'stage-selected'/);
    assert.match(script, /function trapModalFocus\(event\)/);
    assert.match(script, /appModal\.setAttribute\('aria-hidden', 'false'\)/);
    assert.match(script, /appModal\.setAttribute\('aria-hidden', 'true'\)/);
});

test('architecture is responsive, keyboard-visible and reduced-motion safe', () => {
    assert.match(styles, /\.app-modal\.has-architecture \.app-modal-content\s*\{[\s\S]*?max-width:\s*1080px/);
    assert.match(styles, /\.prd-architecture-tabs button:focus-visible/);
    assert.match(styles, /\.prd-architecture-node:focus-visible/);
    assert.match(styles, /@media \(max-width: 900px\)[\s\S]*?grid-template-columns:\s*repeat\(2/);
    assert.match(styles, /@media \(max-width: 640px\)[\s\S]*?\.prd-architecture-flow::before/);
    assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?transition:\s*none/);
});

test('public architecture copy contains no private identifiers or operational secrets', () => {
    const block = prdAgentBlock();
    const architectureStart = block.indexOf('architecture: {');
    const architectureEnd = block.indexOf('primaryAction:', architectureStart);
    const architecture = block.slice(architectureStart, architectureEnd);
    assert.match(architecture, /不展示隐藏思维链、系统 Prompt、原始模型输出/);
    assert.doesNotMatch(architecture, /st147zp0|aime-app|bytedance\.net|Right ID|4pl_fbt|Pending SLA|x-jwt-token|BEGIN PUBLIC KEY|MIGf/);
});
