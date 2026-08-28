const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('Agent workbench is a dedicated page with the required dynamic nodes', () => {
    const page = read('search-agent.html');
    for (const id of [
        'agentStartAnalysis',
        'agentDecisionState',
        'agentStrategyName',
        'agentProposalGrid',
        'agentEvidenceStrip',
        'queryComparisonCount',
        'queryComparisonList'
    ]) {
        assert.match(page, new RegExp(`id="${id}"`));
    }
    assert.match(page, /js\/search-agent\.js/);
    assert.match(page, /search-eval\.html/);
    assert.match(page, /search-strategy\.html/);
});

test('public search page no longer embeds the Agent workbench', () => {
    const page = read('search-eval.html');
    const script = read('js/search-eval.js');
    assert.doesNotMatch(page, /agentWorkbench|agentStartAnalysis/);
    assert.doesNotMatch(script, /strategy\/propose|agent-ui/);
    assert.match(page, /href="search-agent\.html"/);
});

test('Agent script can request proposals but cannot approve decisions', () => {
    const script = read('js/search-agent.js');
    assert.match(script, /agent\/strategy\/propose/);
    assert.match(script, /credentials:\s*'same-origin'/);
    assert.doesNotMatch(script, /agent\/strategy\/decision|approve|reject/);
});

test('Agent workbench renders ten side-by-side query result comparisons', () => {
    const page = read('search-agent.html');
    const script = read('js/search-agent.js');
    const styles = read('css/search-agent.css');
    assert.match(page, /10 Query Comparisons/);
    assert.match(page, /候选重排，不代表全量商品召回效果/);
    assert.match(script, /query_comparisons/);
    assert.match(script, /comparisons\.slice\(0, 10\)/);
    assert.match(script, /results\.slice\(0, 10\)/);
    assert.match(styles, /grid-template-columns:\s*repeat\(2,minmax\(0,1fr\)\)/);
});

test('comparison diagnostics log counts but not query or result content', () => {
    const script = read('js/search-agent.js');
    assert.match(script, /query_comparisons_rendered/);
    assert.match(script, /comparisonCount:\s*rows\.length/);
    assert.match(script, /outcomeCounts/);
    assert.doesNotMatch(script, /debug\('query_comparisons_rendered',[\s\S]{0,180}query_text/);
});

test('portfolio points to the dedicated Agent page without frontend credentials', () => {
    const files = [
        'search-agent.html',
        'js/search-agent.js',
        'search-eval.html',
        'js/main.js'
    ];
    const combined = files.map(read).join('\n');
    assert.match(read('js/main.js'), /url:\s*'search-agent\.html'/);
    assert.doesNotMatch(read('js/main.js'), /search-eval\.html#agentWorkbench/);
    assert.doesNotMatch(combined, /Authorization|Basic\s+[A-Za-z0-9+/=]+/);
});
