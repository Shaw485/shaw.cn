const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'js/main.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('Pick Memory is presented as launched while retaining its open-source resources', () => {
    assert.match(script, /title: 'Pick Memory · 拾忆卡',[\s\S]*?rating: 'v0\.3\.1 已上线'/);
    assert.match(script, /platformStatus: 'v0\.3\.1 · 已上线'/);
    assert.match(script, /\{ status: '已上线', statusType: 'online', publishDate: '2026\/8\/27'/);
    assert.match(script, /https:\/\/github\.com\/Shaw485\/pick-memory/);
    assert.doesNotMatch(index, /<option value="opensource">/);
});

test('hand-built GPT status and copy reflect the post-training stage', () => {
    assert.match(script, /title: '手撕 GPT',[\s\S]*?rating: '后训练中'/);
    assert.match(script, /后训练实验：已完成受控预训练，正在推进 SFT 与固定评测/);
    assert.match(script, /\{ status: '后训练中', statusType: 'wip', publishDate: '2026\/8\/22'/);
    assert.match(script, /受控预训练已经跑通，正在推进 SFT、固定评测与失败样本复盘/);
});

test('PRD Agent work exposes the deployed frontend as an authorization-gated link', () => {
    const prdBlock = script.match(/title: 'PRD Agent',[\s\S]*?\n\s*\},\n\s*\{\n\s*id: 4,/);
    assert.ok(prdBlock, 'PRD Agent project block should exist');
    assert.match(prdBlock[0], /primaryAction: \{[\s\S]*?url: 'https:\/\/7ff79fde7564\.aime-app\.bytedance\.net\/'/);
    assert.match(prdBlock[0], /label: '打开 PRD Agent'/);
    assert.match(prdBlock[0], /status: '前端已上线 · 需授权登录'/);
    assert.match(prdBlock[0], /title: 'PRD Agent 前端'/);
    assert.match(prdBlock[0], /仅向获得授权的用户开放/);
    assert.doesNotMatch(prdBlock[0], /password|token|authorization/i);
});
