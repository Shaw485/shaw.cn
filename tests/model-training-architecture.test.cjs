'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'js/main.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const debugGuide = fs.readFileSync(path.join(root, 'docs/PORTFOLIO_DEBUG.md'), 'utf8');
const modelMatch = script.match(/title: '0\.015B 自研模型',[\s\S]*?\n\s*\},\n\s*\{\n\s*id: 3,/);

assert.ok(modelMatch, 'self-developed model block should exist');
const model = modelMatch[0];

function assertInOrder(source, values, label) {
    let cursor = -1;
    values.forEach(value => {
        const next = source.indexOf(value, cursor + 1);
        assert.ok(next > cursor, `${label} should contain ${value} in order`);
        cursor = next;
    });
}

test('model reuses the interactive architecture with training and runtime views', () => {
    assert.match(model, /cardFlow: \['语料', 'BPE', '预训练', '续写'\]/);
    assertInOrder(model, [
        "id: 'training'",
        "label: '训练过程'",
        "id: 'runtime'",
        "label: '工作架构'"
    ], 'model architecture tabs');

    assertInOrder(model, [
        "id: 'corpus-governance'",
        "id: 'frozen-splits'",
        "id: 'train-bpe'",
        "id: 'build-next-token-batch'",
        "id: 'forward-pass'",
        "id: 'loss-backprop'",
        "id: 'adamw-update'",
        "id: 'checkpoint-selection'"
    ], 'training stages');

    assertInOrder(model, [
        "id: 'prompt-entry'",
        "id: 'runtime-tokenize'",
        "id: 'embedding'",
        "id: 'transformer-blocks'",
        "id: 'lm-head'",
        "id: 'top-k-sampling'",
        "id: 'kv-cache-loop'",
        "id: 'natural-stop'"
    ], 'runtime stages');
});

test('training architecture preserves frozen facts and release boundaries', () => {
    [
        '6,120,275 个字符',
        '1,599 / 92 / 84',
        '1,499,904 个学习字符',
        '3,000 次高频合并',
        '7,465 个 Token',
        '512 Token',
        '4,096 个下一 Token',
        '6,000 optimizer steps',
        '0.0081',
        '冻结 Step5750',
        '8 头 Q/K/V',
        '1,280 维 GELU FFN',
        '温度 0.7',
        'Top 20',
        '最多 60 个生成字符',
        '不具备通用聊天、事实检索或外部世界知识'
    ].forEach(value => assert.ok(model.includes(value), `missing architecture fact: ${value}`));
    assert.match(model, /后训练实验支路[\s\S]*?已完成 · 无上线候选/);
    assert.match(model, /M020–M035[\s\S]*?线上仍是纯预训练 Step5750/);
    assert.doesNotMatch(model, /platformStatus:/);
});

test('shared architecture is accessible and independently debuggable', () => {
    assert.match(index, /id="prdArchitectureTabs"[^>]+aria-label="项目架构视图"/);
    assert.match(script, /prdArchitectureTabs\.setAttribute\('aria-label', `\$\{app\.title\} 架构视图`\)/);
    assert.match(script, /portfolioLog\('architecture', 'debug', 'stage-selected', \{ appId: app\.id/);
    assert.match(script, /portfolioLog\('architecture', 'debug', 'panel-selected', \{ appId: app\.id/);
    assert.match(script, /portfolioLog\('architecture', 'debug', 'architecture-rendered', \{\s*appId: app\.id/);
    assert.match(debugGuide, /`architecture` 模块/);
    assert.match(debugGuide, /不记录语料、用户输入、模型输出、Token ID/);
    assert.match(index, /js\/main\.js\?v=20260902-brain-egg-v191/);
});
