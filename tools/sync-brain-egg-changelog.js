#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const DEFAULT_SOURCE = path.resolve(REPO_ROOT, '../../../trae_projects/game/改动记事本.md');
const DEFAULT_TARGET = path.join(REPO_ROOT, 'brain-egg-changelog.txt');
const DEFAULT_META = path.join(REPO_ROOT, 'brain-egg-changelog.meta.json');
const UTF8_BOM = Buffer.from([0xef, 0xbb, 0xbf]);

function withoutBom(buffer) {
  return buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf
    ? buffer.subarray(3) : buffer;
}

function withBom(buffer) {
  return Buffer.concat([UTF8_BOM, withoutBom(buffer)]);
}

function digest(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function analyze(markdown) {
  const text = String(markdown || '').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const topLevelGroups = (text.match(/^##\s+.+$/gm) || []).length;
  const nestedSubrecords = (text.match(/^###\s+.+$/gm) || []).length;
  const firstGroup = text.match(/^##\s+(.+)$/m);
  if (!/^#\s+.+$/m.test(text)) throw new Error('源文件缺少一级标题');
  if (!topLevelGroups) throw new Error('源文件没有识别到二级改动记录');
  return {
    topLevelGroups,
    nestedSubrecords,
    totalRecords:topLevelGroups + nestedSubrecords,
    latestTitle:firstGroup ? firstGroup[1].trim() : ''
  };
}

function buildMeta(sourceBuffer, targetBuffer, analysis) {
  return {
    schemaVersion:1,
    sourceFile:'改动记事本.md',
    targetFile:'brain-egg-changelog.txt',
    utf8Bom:true,
    sourceBytes:withoutBom(sourceBuffer).length,
    targetBytes:targetBuffer.length,
    sourceSha256:digest(withoutBom(sourceBuffer)),
    targetSha256:digest(targetBuffer),
    topLevelGroups:analysis.topLevelGroups,
    nestedSubrecords:analysis.nestedSubrecords,
    totalRecords:analysis.totalRecords,
    latestTitle:analysis.latestTitle
  };
}

function logEvent(level, event, context, writer) {
  const entry = {
    at:new Date().toISOString(),
    module:'brain-egg-changelog-sync',
    level,
    event,
    context:context || {}
  };
  (writer || console.log)(JSON.stringify(entry));
  return entry;
}

function writeAtomic(filename, buffer) {
  fs.mkdirSync(path.dirname(filename), { recursive:true });
  const temporary = filename + '.tmp-' + process.pid;
  try {
    fs.writeFileSync(temporary, buffer);
    fs.renameSync(temporary, filename);
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
}

function syncFile(options) {
  const settings = options || {};
  const source = path.resolve(settings.source || process.env.SMART_EGG_CHANGELOG_SOURCE || DEFAULT_SOURCE);
  const target = path.resolve(settings.target || DEFAULT_TARGET);
  const metaFile = path.resolve(settings.meta || DEFAULT_META);
  const sourceBuffer = fs.readFileSync(source);
  const targetBuffer = withBom(sourceBuffer);
  const analysis = analyze(withoutBom(sourceBuffer).toString('utf8'));
  const meta = buildMeta(sourceBuffer, targetBuffer, analysis);
  const expectedMeta = Buffer.from(JSON.stringify(meta, null, 2) + '\n');
  const targetCurrent = fs.existsSync(target) && fs.readFileSync(target).equals(targetBuffer);
  const metaCurrent = fs.existsSync(metaFile) && fs.readFileSync(metaFile).equals(expectedMeta);
  const context = {
    source:path.basename(source),
    target:path.basename(target),
    sourceBytes:meta.sourceBytes,
    targetBytes:meta.targetBytes,
    sourceSha256:meta.sourceSha256,
    targetSha256:meta.targetSha256,
    topLevelGroups:meta.topLevelGroups,
    nestedSubrecords:meta.nestedSubrecords,
    totalRecords:meta.totalRecords,
    latestTitle:meta.latestTitle
  };

  if (settings.check) {
    if (!targetCurrent || !metaCurrent) {
      logEvent('error', 'sync-stale', Object.assign({}, context, { targetCurrent, metaCurrent }), settings.writer);
      return { ok:false, changed:false, meta, targetCurrent, metaCurrent };
    }
    logEvent('info', 'sync-check-passed', context, settings.writer);
    return { ok:true, changed:false, meta, targetCurrent:true, metaCurrent:true };
  }

  if (!targetCurrent) writeAtomic(target, targetBuffer);
  if (!metaCurrent) writeAtomic(metaFile, expectedMeta);
  const changed = !targetCurrent || !metaCurrent;
  logEvent('info', changed ? 'sync-updated' : 'sync-already-current', context, settings.writer);
  return { ok:true, changed, meta, targetCurrent:true, metaCurrent:true };
}

function parseArguments(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--check') options.check = true;
    else if (argument === '--source') options.source = argv[++index];
    else if (argument === '--target') options.target = argv[++index];
    else if (argument === '--meta') options.meta = argv[++index];
    else if (argument === '--help') options.help = true;
    else throw new Error('未知参数：' + argument);
  }
  return options;
}

function printHelp() {
  console.log([
    '同步《改动记事本》到 shaw.cn 公开版本记录。',
    '',
    '用法：node tools/sync-brain-egg-changelog.js [--check] [--source FILE] [--target FILE] [--meta FILE]',
    '',
    '也可用 SMART_EGG_CHANGELOG_SOURCE 指定源文件。公开 TXT 自动加入一个 UTF-8 BOM。',
    '运行日志以 JSON 行输出到终端，可按 module/event/level 筛选；只记录摘要与计数，不记录正文。'
  ].join('\n'));
}

if (require.main === module) {
  try {
    const options = parseArguments(process.argv.slice(2));
    if (options.help) printHelp();
    else {
      const result = syncFile(options);
      if (!result.ok) process.exitCode = 2;
    }
  } catch (error) {
    logEvent('error', 'sync-failed', { message:String(error && error.message || error) });
    process.exitCode = 1;
  }
}

module.exports = { analyze, buildMeta, digest, parseArguments, syncFile, withBom, withoutBom };
