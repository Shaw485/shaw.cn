'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { analyze, buildMeta, digest, syncFile, withBom, withoutBom } = require('../tools/sync-brain-egg-changelog.js');

const root = path.resolve(__dirname, '..');
const publicFile = path.join(root, 'brain-egg-changelog.txt');
const metaFile = path.join(root, 'brain-egg-changelog.meta.json');
const mainScript = fs.readFileSync(path.join(root, 'js/main.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const readerScript = fs.readFileSync(path.join(root, 'js/project-doc.js'), 'utf8');
const workspaceSource = path.resolve(root, '../../../trae_projects/game/改动记事本.md');

test('公开网站不再硬编码33条，并使用完整同步入口和新缓存版本', () => {
  assert.doesNotMatch(mainScript, /在线阅读\s*33\s*个版本记录/);
  assert.match(mainScript, /在线阅读全部改动记录/);
  assert.doesNotMatch(mainScript, /\['v31–v33'/);
  assert.match(index, /js\/main\.js\?v=20260902-brain-egg-v191/);
  assert.match(readerScript, /brain-egg-changelog\.txt\?v=20260902-brain-egg-v191/);
});

test('公开记录、UTF-8 BOM、元数据和当前游戏记事本内容一致', () => {
  const publicBuffer = fs.readFileSync(publicFile);
  const sourceContent = withoutBom(publicBuffer);
  const publicAnalysis = analyze(sourceContent.toString('utf8'));
  const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
  assert.deepStrictEqual([...publicBuffer.subarray(0, 3)], [0xef, 0xbb, 0xbf]);
  assert.deepStrictEqual(meta, buildMeta(sourceContent, publicBuffer, publicAnalysis));
  assert.strictEqual(meta.targetSha256, digest(publicBuffer));
  assert.ok(meta.topLevelGroups >= 89, '公开记录不能退回旧的33组快照');
  assert.ok(meta.nestedSubrecords >= 4, '四条自动子记录也必须保留');
  assert.strictEqual(meta.totalRecords, meta.topLevelGroups + meta.nestedSubrecords);
  assert.strictEqual(meta.latestTitle, sourceContent.toString('utf8').match(/^##\s+(.+)$/m)[1].trim());
  assert.match(sourceContent.toString('utf8'), /^## Web \/ 微信小游戏 v191/m);
  if (fs.existsSync(workspaceSource)) {
    assert.ok(sourceContent.equals(withoutBom(fs.readFileSync(workspaceSource))), '公开记录去除编码标记后必须与游戏《改动记事本》逐字一致');
  }
});

test('同步脚本可幂等检查，源缺失或过期时不覆盖既有公开文件', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'brain-egg-changelog-sync-'));
  const source = path.join(directory, 'source.md');
  const target = path.join(directory, 'target.txt');
  const meta = path.join(directory, 'meta.json');
  const logs = [];
  const writer = line => logs.push(JSON.parse(line));
  const first = '# 记录\n\n## v2\n\n- 新\n\n## v1\n\n### v1.1 自动记录\n\n- 旧\n';
  fs.writeFileSync(source, first);
  const initial = syncFile({ source, target, meta, writer });
  assert.equal(initial.ok, true);
  assert.equal(initial.changed, true);
  assert.ok(fs.readFileSync(target).equals(withBom(Buffer.from(first))));
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(meta, 'utf8')), initial.meta);
  assert.equal(initial.meta.topLevelGroups, 2);
  assert.equal(initial.meta.nestedSubrecords, 1);
  assert.equal(initial.meta.totalRecords, 3);

  const current = syncFile({ source, target, meta, check:true, writer });
  assert.equal(current.ok, true);
  assert.equal(current.changed, false);
  const oldTarget = fs.readFileSync(target);
  fs.writeFileSync(source, first + '\n## v3\n\n- 尚未同步\n');
  const stale = syncFile({ source, target, meta, check:true, writer });
  assert.equal(stale.ok, false);
  assert.ok(fs.readFileSync(target).equals(oldTarget), '只检查模式不能修改公开文件');
  assert.throws(() => syncFile({ source:path.join(directory, 'missing.md'), target, meta, writer }), /ENOENT/);
  assert.ok(fs.readFileSync(target).equals(oldTarget), '源文件缺失时不能覆盖已有公开记录');
  assert.ok(logs.every(entry => entry.module === 'brain-egg-changelog-sync'));
  assert.ok(logs.some(entry => entry.event === 'sync-check-passed'));
  assert.ok(logs.some(entry => entry.event === 'sync-stale' && entry.level === 'error'));
});
