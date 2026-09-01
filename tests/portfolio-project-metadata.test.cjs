const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'js/main.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'css/styles.css'), 'utf8');

test('Pick Memory is presented as launched while retaining its open-source resources', () => {
    assert.match(script, /title: 'Pick Memory · 拾忆卡',[\s\S]*?rating: 'v0\.3\.1 已上线'/);
    assert.match(script, /platformStatus: 'v0\.3\.1 · 已上线'/);
    assert.match(script, /\{ projectType: '插件', status: '已上线', statusType: 'online', publishDate: '2026\/8\/27'/);
    assert.match(script, /https:\/\/github\.com\/Shaw485\/pick-memory/);
    assert.doesNotMatch(index, /<option value="opensource">/);
});

test('0.15B self-developed model status and copy reflect the post-training stage', () => {
    assert.match(script, /title: '0\.15B自研模型',[\s\S]*?rating: '后训练中'/);
    assert.match(script, /后训练实验：已完成受控预训练，正在推进 SFT 与固定评测/);
    assert.match(script, /\{ projectType: 'GPT', status: '后训练中', statusType: 'wip', publishDate: '2026\/8\/22'/);
    assert.match(script, /受控预训练已经跑通，正在推进 SFT、固定评测与失败样本复盘/);
    assert.doesNotMatch(script, /手撕 GPT|手搓 GPT/);
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

test('Math Alarm PRD, changelog and README open in the same-origin HTML reader', () => {
    const changelog = fs.readFileSync(path.join(root, '改动记录.txt'));
    const prd = fs.readFileSync(path.join(root, 'project-docs/math-alarm-prd.txt'));
    const mathAlarmBlock = script.match(/title: '数学题闹钟',[\s\S]*?\n\s*\},\n\s*\{\n\s*id: 1,/);
    assert.ok(mathAlarmBlock, 'Math Alarm project block should exist');
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
});

test('Odd Origin uses the supplied avatar and five landscape screenshots', () => {
    const block = script.match(/title: '怪奇之原',[\s\S]*?\n\s*\},\n\s*\{\n\s*id: 2,/);
    assert.ok(block, 'Odd Origin project block should exist');
    assert.match(block[0], /iconImage: '\/assets\/odd-origin\/icon\.png'/);
    assert.match(block[0], /screenshotLayout: 'landscape'/);

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
    assert.doesNotMatch(fs.readFileSync(path.join(root, 'brain-egg-changelog.txt'), 'utf8'), /脑洞皮蛋|大聪明脑洞蛋/);
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
    assert.match(index, /styles\.css\?v=20260901-project-media-v1/);
    assert.match(index, /main\.js\?v=20260901-project-media-v1/);
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
    assert.match(readerScript, /'gpt-roadmap': \['0\.15B自研模型 · Roadmap'/);
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
