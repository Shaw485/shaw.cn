const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'js/main.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'css/styles.css'), 'utf8');

test('Pick Memory distinguishes the unpublished local record from the public release', () => {
    assert.match(script, /title: 'Pick Memory · 拾忆卡',[\s\S]*?rating: '本地记录 v0\.3\.4 · Release v0\.3\.1'/);
    assert.match(script, /platformStatus: '本地记录 v0\.3\.4（待推送）· Release v0\.3\.1 已上线'/);
    assert.match(script, /公开 GitHub 与安装包仍为 v0\.3\.1/);
    assert.match(script, /\{ projectType: '插件', status: '已上线', statusType: 'online', publishDate: '2026\/8\/28'/);
    assert.match(script, /https:\/\/github\.com\/Shaw485\/pick-memory/);
    assert.match(fs.readFileSync(path.join(root, 'project-docs/pick-memory-changelog.txt'), 'utf8'), /## 0\.3\.4 — 2026-08-28/);
    assert.match(fs.readFileSync(path.join(root, 'project-docs/pick-memory-changelog.txt'), 'utf8'), /禁止全局键盘注入和剪贴板访问/);
    assert.match(fs.readFileSync(path.join(root, 'js/project-doc.js'), 'utf8'), /pick-memory-changelog\.txt\?v=20260901-latest-records-v2/);
    assert.doesNotMatch(index, /<option value="opensource">/);
});

test('self-developed model exposes the public noncommercial M036 local release', () => {
    assert.match(script, /title: '0\.015B 自研模型',[\s\S]*?rating: 'M036 已上线'/);
    assert.match(script, /正式模型为 14,880,745 参数（约 0\.015B）的纯预训练 Step5750/);
    assert.match(script, /primaryAction: \{[\s\S]*?shoucao-gpt-local-step5750-v1\.0\.0\.zip'[\s\S]*?label: '下载 M036 本地包'[\s\S]*?download: true/);
    assert.match(script, /secondaryAction: \{[\s\S]*?shaw485-local-gpt-card\.hexiaoyu-07\.chatgpt\.site\/[\s\S]*?label: '查看运行说明'[\s\S]*?download: false/);
    assert.match(script, /tertiaryAction: \{[\s\S]*?releases\/tag\/v1\.0\.0-local-step5750[\s\S]*?label: 'GitHub Release'/);
    assert.match(script, /platformStatus: 'M036 · 已公开 · 仅限非商用'/);
    assert.match(script, /\{ projectType: 'GPT', status: '已上线', statusType: 'online', publishDate: '2026\/9\/1'/);
    assert.match(script, /进入详情可下载，在自己的 CPU、NVIDIA GPU 或 Mac MPS 上运行/);
    assert.doesNotMatch(script, /暂无可发布模型|后训练诊断仍未产生发布候选/);
    assert.doesNotMatch(script, /0\.15B|150,000,000/);
    assert.doesNotMatch(script, /手撕 GPT|手搓 GPT/);
});

test('model detail exposes verified architecture, data, tokenizer, training and post-training parameters', () => {
    const modelBlock = script.match(/title: '0\.015B 自研模型',[\s\S]*?\n\s*\},\n\s*\{\n\s*id: 3,/);
    assert.ok(modelBlock, 'self-developed model block should exist');
    [
        '14,880,745（14.88M，约 0.01488B）',
        '10 层',
        'Embedding / hidden',
        '8 个',
        '40 维（320 ÷ 8）',
        '320 → 1,280 → 320，GELU',
        '7,465 × 320 = 2,388,800',
        '512 × 320 = 163,840',
        'Character-seeded BPE',
        '4,459',
        '3,000',
        '7,465',
        '6,120,275 字符 / 3,581,471 Token',
        '3,223,207 Token',
        '24,576,000',
        'Micro batch',
        'AdamW',
        'MPS',
        '10,000 条：8,000 train / 800 val / 600 public / 600 sealed',
        'SFT 权重不发布；M036 发布纯预训练 Step5750 推理包',
        '55,379,341 bytes（约 55.4 MB）',
        '6d62905fb7b3338817ffac3136c82d8b3af5d59ea2851215da8308d0acb8bc94',
        'CC BY-NC 4.0',
        'PolyForm Noncommercial 1.0.0'
    ].forEach(value => assert.ok(modelBlock[0].includes(value), `missing model spec: ${value}`));
    assert.match(modelBlock[0], /M036 公开包包含推理权重、模型配置、Tokenizer 与本地运行代码/);
    assert.match(modelBlock[0], /训练语料正文、可还原 Token 张量、SFT 数据、评测问答、训练日志和优化器状态不公开/);
    assert.doesNotMatch(modelBlock[0], /模型权重不公开/);

    assert.match(index, /id="modalModelSpecs"[^>]+aria-labelledby="modalModelSpecsTitle"[^>]+hidden/);
    assert.match(index, /id="modalModelSpecGroups"/);
    assert.match(script, /modalModelSpecGroups\.replaceChildren\(\)/);
    assert.match(script, /heading\.textContent = group\.title/);
    assert.match(script, /description\.textContent = value/);
    assert.match(script, /portfolioLog\('model-specs', 'debug', 'specs-rendered'/);
    assert.match(script, /portfolioLog\('actions', 'debug', 'action-opened', \{ appId, action: 'primary' \}\)/);
    assert.match(script, /const primaryIsDownload = Boolean\(app\.apk \|\| app\.downloads\?\.length \|\| primaryAction\.download\)/);
    assert.match(script, /const secondaryIsDownload = Boolean\(app\.downloads\?\.length \|\| secondaryAction\.download\)/);
    assert.match(script, /if \(primaryIsDownload\) \{[\s\S]*?modalApkDownload\.setAttribute\('download', ''\);[\s\S]*?modalApkDownload\.removeAttribute\('download'\)/);
    assert.match(script, /if \(secondaryIsDownload\) modalSecondaryDownload\.setAttribute\('download', ''\);[\s\S]*?else modalSecondaryDownload\.removeAttribute\('download'\)/);
    assert.match(script, /modalDownloadStats\.hidden = !app\.apk/);
    assert.match(script, /modalApkDownload\.dataset\.countDownload = app\.apk \? 'true' : 'false'/);
    assert.match(styles, /\.model-spec-groups\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
    assert.match(styles, /@media \(max-width: 640px\)[\s\S]*?\.model-spec-groups\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
    assert.match(script, /modalScreenshotsSection\.hidden = screenshotUrls\.length === 0/);
    assert.match(styles, /\.app-modal-screenshots\[hidden\]\s*\{\s*display:\s*none/);
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

test('PRD Agent card uses three privacy-safe screenshots with captions and keyboard zoom', () => {
    const prdBlock = script.match(/title: 'PRD Agent',[\s\S]*?\n\s*\},\n\s*\{\n\s*id: 4,/);
    assert.ok(prdBlock, 'PRD Agent project block should exist');
    assert.match(prdBlock[0], /screenshotLayout: 'landscape'/);
    const files = [
        '01-multi-source-grounding-synthetic.png',
        '02-versioned-evidence-synthetic.png',
        '03-multi-item-decision-synthetic-v2.png'
    ];
    files.forEach(file => {
        assert.match(prdBlock[0], new RegExp(`/assets/prd-agent/${file.replace('.', '\\.')}\\b`));
        const image = fs.readFileSync(path.join(root, 'assets/prd-agent', file));
        assert.deepEqual([...image.subarray(0, 8)], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], `${file} should be PNG`);
    });
    assert.ok((prdBlock[0].match(/合成演示数据/g) || []).length >= 3);
    assert.doesNotMatch(prdBlock[0], /sanitized\.png|马赛克|脱敏演示内容/);
    assert.doesNotMatch(prdBlock[0], /codex-clipboard|hexiaoyu\.07|virtual bundle|self arrange/i);
    assert.match(script, /figure\.className = 'screenshot-item'/);
    assert.match(script, /zoomButton\.type = 'button'/);
    assert.match(script, /zoomButton\.setAttribute\('aria-label', `放大查看：\$\{alt\}`\)/);
    assert.match(script, /caption\.textContent = app\.screenshotCaptions\[index\]/);
    assert.match(script, /event\.target\.closest\('\.screenshot-zoom'\)/);
    assert.match(styles, /\.screenshot-zoom:focus-visible\s*\{/);
});

test('PRD Agent synthetic screenshots use a dedicated cache version', () => {
    assert.match(index, /js\/main\.js\?v=20260901-m036-release-v2/);
});

test('Math Alarm PRD, changelog and README open in the same-origin HTML reader', () => {
    const changelog = fs.readFileSync(path.join(root, '改动记录.txt'));
    const prd = fs.readFileSync(path.join(root, 'project-docs/math-alarm-prd.txt'));
    const readme = fs.readFileSync(path.join(root, 'project-docs/math-alarm-readme.txt'));
    const mathAlarmBlock = script.match(/title: '数学题闹钟',[\s\S]*?\n\s*\},\n\s*\{\n\s*id: 1,/);
    assert.ok(mathAlarmBlock, 'Math Alarm project block should exist');
    assert.match(mathAlarmBlock[0], /rating: 'v62\.1 · 已上线'/);
    assert.doesNotMatch(mathAlarmBlock[0], /4\.9 \(2,300 评价\)/);
    assert.match(mathAlarmBlock[0], /title: '在线阅读完整 PRD',[\s\S]*?href: '\/project-doc\.html\?doc=math-alarm-prd'/);
    assert.match(mathAlarmBlock[0], /title: '在线阅读完整版本记录',[\s\S]*?href: '\/project-doc\.html\?doc=math-alarm-changelog'/);
    assert.match(mathAlarmBlock[0], /title: 'README',[\s\S]*?href: '\/project-doc\.html\?doc=math-alarm-readme'/);
    assert.doesNotMatch(mathAlarmBlock[0], /download:/);
    assert.doesNotMatch(mathAlarmBlock[0], /PRD\.pdf|极简数学题闹钟%20App%20PRD/);
    assert.deepEqual([...changelog.subarray(0, 3)], [0xef, 0xbb, 0xbf]);
    assert.deepEqual([...prd.subarray(0, 3)], [0xef, 0xbb, 0xbf]);
    assert.match(changelog.toString('utf8'), /62\.1 静态检查收尾/);
    assert.match(prd.toString('utf8'), /来源于项目原始 PRD（共 25 页）/);
    assert.match(prd.toString('utf8'), /===== 第 25 页 \/ 共 25 页 =====/);
    assert.doesNotMatch(prd.toString('utf8'), /�|[⻅⻆⻓⻔⻚⻛⻬]/);
    assert.match(readme.toString('utf8'), /清晨 \/ 风来 \/ 钢琴/);
    assert.doesNotMatch(readme.toString('utf8'), /清晨 \/ 曙光 \/ 山岚|占位用的正弦波/);
    assert.match(fs.readFileSync(path.join(root, 'js/project-doc.js'), 'utf8'), /math-alarm-readme\.txt\?v=20260901-latest-records-v2/);
});

test('Odd Origin uses the supplied avatar and five landscape screenshots', () => {
    const block = script.match(/title: '怪奇之原',[\s\S]*?\n\s*\},\n\s*\{\n\s*id: 2,/);
    assert.ok(block, 'Odd Origin project block should exist');
    assert.match(block[0], /iconImage: '\/assets\/odd-origin\/icon\.png'/);
    assert.match(block[0], /screenshotLayout: 'landscape'/);
    assert.match(block[0], /rating: 'v188 真机预览 · 待上线'/);
    assert.match(block[0], /Web \/ 微信小游戏 v188（2026-09-01）/);

    const files = ['icon.png', 'title-screen.png', 'chapter-select.png', 'level-02.png', 'level-06.png', 'level-13.png'];
    files.forEach(file => {
        const image = fs.readFileSync(path.join(root, 'assets/odd-origin', file));
        assert.deepEqual([...image.subarray(0, 8)], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], `${file} should be PNG`);
    });
    assert.equal((block[0].match(/'\/assets\/odd-origin\/(?:title-screen|chapter-select|level-02|level-06|level-13)\.png'/g) || []).length, 5);
    assert.match(script, /modalIcon\.classList\.toggle\('has-image', Boolean\(app\.iconImage\)\)/);
    assert.match(script, /<img src="\$\{app\.iconImage\}" alt="\$\{app\.title\} 头像">/);
    assert.match(styles, /\.app-modal-icon > img\s*\{[\s\S]*?object-fit:\s*cover/);
    assert.match(script, /portfolioLog\('media', 'debug', 'media-rendered'/);
    assert.match(script, /portfolioLog\('media', 'warn', 'image-load-failed'/);
    assert.doesNotMatch(script, /脑洞皮蛋|大聪明脑洞蛋/);
    assert.doesNotMatch(fs.readFileSync(path.join(root, 'brain-egg-overview.txt'), 'utf8'), /脑洞皮蛋|大聪明脑洞蛋/);
    const historicalChangelog = fs.readFileSync(path.join(root, 'brain-egg-changelog.txt'), 'utf8');
    assert.match(historicalChangelog, /主页游戏名暂保持“大聪明脑洞蛋”，等待正式命名/,
        '完整历史记录应保留正式命名前的原始变更说明');
    assert.match(historicalChangelog, /Web \/ 微信小游戏 v188 完整窗口宽地图/);
    assert.match(script, /89 个顶层记录与 4 个自动子记录，共 93 条/);
    assert.match(fs.readFileSync(path.join(root, 'js/project-doc.js'), 'utf8'), /brain-egg-overview\.txt\?v=20260901-latest-records-v2/);
});

test('portfolio uses a project list, detail actions and the agreed project type labels', () => {
    assert.match(index, /<span>项目列表<\/span>/);
    assert.doesNotMatch(index, /App 作品|APP作品集/);
    assert.match(script, /<span class="project-type-tag">\$\{app\.projectType\}<\/span>/);
    assert.match(script, /<button class="btn-view-work" type="button">查看详情<\/button>/);
    assert.doesNotMatch(script, />查看作品<\/button>/);

    const types = [...script.matchAll(/projectType: '(APP|小程序|GPT|Agent|插件)'/g)].map(match => match[1]);
    assert.deepEqual(types, ['APP', '小程序', 'GPT', 'Agent', 'Agent', '插件', 'Agent']);
    assert.match(styles, /\.work-card-labels\s*\{[\s\S]*?display:\s*flex/);
    assert.match(styles, /\.project-type-tag\s*\{[\s\S]*?white-space:\s*nowrap/);
    assert.match(index, /styles\.css\?v=20260901-latest-records-v2/);
    assert.match(index, /main\.js\?v=20260901-m036-release-v2/);
});

test('all human-readable project resources use same-origin UTF-8 BOM delivery', () => {
    const textResources = [
        ['project-docs/math-alarm-prd.txt', 'math-alarm-prd'],
        ['改动记录.txt', 'math-alarm-changelog'],
        ['brain-egg-overview.txt', 'brain-egg-overview'],
        ['brain-egg-changelog.txt', 'brain-egg-changelog'],
        ['project-docs/math-alarm-readme.txt', 'math-alarm-readme'],
        ['project-docs/gpt-roadmap.txt', 'gpt-roadmap'],
        ['project-docs/gpt-record.txt', 'gpt-record'],
        ['project-docs/search-readme.txt', 'search-readme'],
        ['project-docs/search-roadmap.txt', 'search-roadmap'],
        ['project-docs/search-stage0-report.txt', 'search-stage0-report'],
        ['project-docs/search-full-catalog-baseline.txt', 'search-full-catalog-baseline'],
        ['project-docs/search-agent-evaluation.txt', 'search-agent-evaluation'],
        ['project-docs/pick-memory-readme.txt', 'pick-memory-readme'],
        ['project-docs/pick-memory-changelog.txt', 'pick-memory-changelog'],
        ['project-docs/agent-harness-debug.txt', 'agent-harness-debug']
    ];
    textResources.forEach(([file, docId]) => {
        const content = fs.readFileSync(path.join(root, file));
        assert.deepEqual([...content.subarray(0, 3)], [0xef, 0xbb, 0xbf], `${file} should start with UTF-8 BOM`);
        assert.ok(script.includes(`/project-doc.html?doc=${docId}`), `${file} should use the same-origin reader`);
    });
    assert.doesNotMatch(script, /raw\.githubusercontent\.com/);
    assert.doesNotMatch(script, /github\.com\/Shaw485\/pick-memory#readme/);
    assert.doesNotMatch(script, /github\.com\/Shaw485\/pick-memory\/blob\/main\/CHANGELOG\.md/);
    assert.match(script, /data-project-resource="\$\{title\}"/);
    assert.match(script, /portfolioLog\('resources', 'debug', 'resource-open'/);
});

test('project document reader strictly decodes an allowlisted file and offers download', () => {
    const readerPage = fs.readFileSync(path.join(root, 'project-doc.html'), 'utf8');
    const readerScript = fs.readFileSync(path.join(root, 'js/project-doc.js'), 'utf8');
    const readerStyles = fs.readFileSync(path.join(root, 'css/project-doc.css'), 'utf8');
    assert.match(readerPage, /<meta charset="UTF-8">/);
    assert.doesNotMatch(readerPage, /AI 学习记录/);
    assert.match(readerPage, /id="docDownload"[^>]+download/);
    assert.match(readerScript, /Object\.freeze\(\{/);
    assert.match(readerScript, /'math-alarm-prd': \['数学题闹钟 · 完整 PRD'/);
    assert.match(readerScript, /'math-alarm-changelog': \['数学题闹钟 · 版本记录'/);
    assert.match(readerScript, /'brain-egg-overview': \['怪奇之原 · 玩法与功能说明'/);
    assert.match(readerScript, /'gpt-roadmap': \['0\.015B 自研模型 · Roadmap'/);
    assert.match(readerScript, /gpt-roadmap\.txt\?v=20260901-latest-records-v2/);
    assert.match(fs.readFileSync(path.join(root, 'project-docs/gpt-roadmap.txt'), 'utf8'), /M035继续预训练上下文A\/B（评测中）/);
    assert.match(fs.readFileSync(path.join(root, 'project-docs/gpt-record.txt'), 'utf8'), /完成M035两臂1000步正式训练/);
    assert.match(readerScript, /'search-full-catalog-baseline': \['搜索引擎评测 Agent · 全量基线报告'/);
    assert.match(readerScript, /'search-agent-evaluation': \['搜索引擎评测 Agent · Agent 行为评测'/);
    assert.match(fs.readFileSync(path.join(root, 'project-docs/search-full-catalog-baseline.txt'), 'utf8'), /1,814,924/);
    assert.match(fs.readFileSync(path.join(root, 'project-docs/search-agent-evaluation.txt'), 'utf8'), /production deployment not\s+performed/);
    assert.match(readerScript, /new TextDecoder\('utf-8', \{ fatal: true \}\)/);
    assert.match(readerScript, /content\.textContent = decoded/);
    assert.doesNotMatch(readerScript, /innerHTML\s*=\s*decoded/);
    assert.match(readerScript, /document-id-rejected/);
    assert.match(readerStyles, /white-space:\s*pre-wrap/);
    assert.match(readerStyles, /@media \(max-width: 640px\)/);
});

test('AI learning record is removed from the site navigation', () => {
    const navPages = [
        'index.html',
        'blog.html',
        'contact.html',
        'agent-harness.html',
        'search-agent.html',
        'search-eval.html',
        'search-strategy.html',
        'ai-growth.html'
    ];
    navPages.forEach(file => {
        const html = fs.readFileSync(path.join(root, file), 'utf8');
        assert.doesNotMatch(html, /<a[^>]+href="ai-growth\.html"[^>]*>AI 学习记录<\/a>/, `${file} should not expose the AI learning navigation item`);
    });
});
