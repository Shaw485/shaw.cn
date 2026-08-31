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

test('Math Alarm changelog downloads as an explicitly encoded TXT file', () => {
    const changelog = fs.readFileSync(path.join(root, '改动记录.txt'));
    const mathAlarmBlock = script.match(/title: '数学题闹钟',[\s\S]*?\n\s*\},\n\s*\{\n\s*id: 1,/);
    assert.ok(mathAlarmBlock, 'Math Alarm project block should exist');
    assert.match(mathAlarmBlock[0], /title: '下载完整改动记录 TXT'/);
    assert.match(mathAlarmBlock[0], /href: '\/%E6%94%B9%E5%8A%A8%E8%AE%B0%E5%BD%95\.txt\?v=20260831-utf8-bom-v1'/);
    assert.match(mathAlarmBlock[0], /download: '数学题闹钟-版本记录\.txt'/);
    assert.deepEqual([...changelog.subarray(0, 3)], [0xef, 0xbb, 0xbf]);
    assert.match(changelog.toString('utf8'), /62\.1 静态检查收尾/);
    assert.match(index, /main\.js\?v=20260831-math-alarm-changelog-txt-v1/);
});
