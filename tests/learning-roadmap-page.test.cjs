const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('AI learning page is a minimal eight-row roadmap instead of a dashboard', () => {
    const page = read('ai-growth.html');

    assert.match(page, /<h1 id="learningRoadmapTitle">AI 岗位 8 周学习计划<\/h1>/);
    assert.match(page, /<ol id="learningRoadmapList" class="learning-roadmap-list"/);
    assert.match(page, /id="learningRoadmapStatus"[^>]*aria-live="polite"/);
    assert.doesNotMatch(page, /js\/main\.js/);
    assert.match(page, /js\/learning-roadmap\.js/);
    for (const removedId of [
        'aiRadarChart',
        'aiLearningPhases',
        'aiLearningTimeProgress',
        'aiPhaseFilters',
        'roadmapProgressText',
        'roadmapProgressBar',
        'aiRecentTimeline',
        'aiEvidenceGrid'
    ]) {
        assert.doesNotMatch(page, new RegExp(`id="${removedId}"`));
    }
    assert.doesNotMatch(page, /0\s*\/\s*8|百分|雷达图|四阶段/);
});

test('roadmap contains exactly the agreed weeks in order and evidence-based states', () => {
    const script = read('js/learning-roadmap.js');
    const expected = [
        [1, '评测与统计基础', '正在验证'],
        [2, '搜索评测 Agent', '正在验证'],
        [3, 'PRD Agent 分层评测', '正在验证'],
        [4, '对话安全评测 Lab', '待开始'],
        [5, '手搓 GPT 受控训练', '已验证'],
        [6, '用户研究与产品验证', '待开始'],
        [7, 'ShawSpace 求职作品集', '正在验证'],
        [8, '面试验证与定向投递', '待开始']
    ];

    assert.equal((script.match(/\n\s*week: \d,/g) || []).length, 8);
    let previousIndex = -1;
    for (const [week, title, status] of expected) {
        const pattern = new RegExp(`week: ${week},[\\s\\S]*?title: '${title}',[\\s\\S]*?status: '${status}'`);
        const match = script.match(pattern);
        assert.ok(match, `W${week} should have its agreed title and state`);
        const index = script.indexOf(match[0]);
        assert.ok(index > previousIndex, `W${week} should follow the previous week`);
        previousIndex = index;
    }
    assert.match(script, /严格候选为空、未过发布门禁的权重不公开/);
    assert.match(script, /当前不提前展示项目或结果/);
});

test('each roadmap row is an accessible single-open accordion item', () => {
    const script = read('js/learning-roadmap.js');

    assert.match(script, /<li class="learning-week" data-learning-week="\$\{week\}">/);
    assert.match(script, /<button class="learning-week-toggle"[^>]*type="button"[^>]*aria-expanded="false"[^>]*aria-controls="\$\{panelId\}"/);
    assert.match(script, /role="region" aria-labelledby="\$\{buttonId\}" hidden/);
    assert.equal((script.match(/data-roadmap-detail="(?:action|deliverable|acceptance)"/g) || []).length, 3);
    assert.match(script, /setExpandedWeek\(willOpen \? week : null\)/);
    assert.match(script, /querySelectorAll\('\.learning-week-toggle'\)\.forEach/);
    assert.match(script, /panel\.hidden = !shouldOpen/);
    assert.match(script, /event\.key === 'Enter' \|\| event\.key === ' '/);
    assert.match(script, /event\.preventDefault\(\);[\s\S]*?toggleWeek\(button\)/);
    assert.match(script, /\['ArrowDown', 'ArrowUp', 'Home', 'End'\]/);
});

test('roadmap remains single-column and keyboard-visible on mobile', () => {
    const styles = read('css/learning-roadmap.css');
    const page = read('ai-growth.html');

    assert.match(styles, /\.learning-roadmap-list\s*\{[\s\S]*?list-style:\s*none/);
    assert.match(styles, /\.learning-week-toggle:focus-visible/);
    assert.match(styles, /min-height:\s*78px/);
    assert.match(styles, /@media \(max-width: 640px\)/);
    assert.match(styles, /\.learning-week-detail\s*\{[\s\S]*?display:\s*block/);
    assert.doesNotMatch(styles, /\.learning-roadmap-list\s*\{[^}]*grid-template-columns/);
    assert.match(page, /class="nav-toggle" type="button" aria-label="打开菜单" aria-expanded="false" aria-controls="primaryNavigation"/);
    assert.match(read('js/learning-roadmap.js'), /setAttribute\('aria-expanded', String\(open\)\)/);
});

test('learning roadmap diagnostics are bounded, filterable and content-safe', () => {
    const script = read('js/learning-roadmap.js');
    const docs = read('docs/LEARNING_ROADMAP_DEBUG.md');

    assert.match(script, /shaw\.debug\.learning-roadmap/);
    assert.match(script, /shaw\.debug\.learning-roadmap\.modules/);
    assert.match(script, /shaw\.debug\.learning-roadmap\.errors/);
    assert.match(script, /const LOG_LIMIT = 100/);
    assert.match(script, /new Set\(\['week', 'action', 'rowCount', 'result', 'errorType'\]\)/);
    assert.match(script, /new Set\(\['render', 'interaction'\]\)/);
    assert.match(script, /localStorage\.getItem\(DEBUG_KEY\) === '1'/);
    assert.match(script, /logs\.splice\(0, logs\.length - LOG_LIMIT\)/);
    assert.match(docs, /生产环境默认关闭普通调试日志/);
    assert.match(docs, /最多保留 100 条/);
    assert.match(docs, /不包含密码、Token、任务正文或个人信息/);
});
