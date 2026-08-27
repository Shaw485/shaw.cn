document.addEventListener('DOMContentLoaded', function() {
    const appsData = [
        {
            id: 0,
            title: '数学题闹钟',
            shortName: '数学闹钟',
            category: 'Android App · 工具',
            date: '2026',
            rating: '4.9 (2,300 评价)',
            gradient: 'linear-gradient(135deg, #1c1c1e 0%, #000000 50%, #2c2c2e 100%)',
            iconStroke: '#FF9500',
            iconSVG: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
            desc: '一款必须答对数学题才能停止响铃的闹钟 App，专治各种起床困难症。每次响铃随机生成「a × b + c × d」格式的题目，确保需要真正清醒计算才能答出。内置「清晨 / 风来 / 钢琴」三款高品质铃声；严格适配 Android 14 精确闹钟与全屏通知权限，开机重启后自动恢复闹钟；响铃超时（10 分钟）自动兜底结束。',
            features: [
                '🔢 数学题解锁：a×b+c×d 形式题目，a/b/c/d 严格 3–9 整数',
                '🎨 极简深色：纯黑 #000000 背景 + 橙色 #FF9500 主色',
                '🎡 滚轮选时：LazyColumn 3 行显示，无限滚动+自动吸附',
                '🎵 三档铃声：清晨、风来、钢琴精选官方 MP3',
                '🛡️ 全版本适配：精确闹钟 + 全屏通知 + 开机自启 + 锁屏显示',
                '⏱️ 超时兜底：响铃最长 10 分钟，答对题目或超时自动回流未设置'
            ],
            tags: ['Kotlin', 'Jetpack Compose', 'AlarmManager', 'DataStore', 'Android 14', 'Foreground Service'],
            screenshots: [
                'alarm-home.jpg',
                'alarm-question.jpg',
                'alarm-answer.jpg'
            ],
            apk: {
                url: 'https://github.com/Shaw485/shaw.cn/raw/main/math-alarm-v60.apk',
                label: '下载安卓版',
                meta: 'v60.0 · 12 MB'
            }
        },
        {
            id: 1,
            title: '脑洞皮蛋',
            shortName: '脑洞皮蛋',
            category: '浏览器游戏 · 平台跳跃',
            date: '2026',
            rating: '持续开发中',
            gradient: 'linear-gradient(135deg, #ffffff 0%, #f2f2f2 55%, #d8d8d8 100%)',
            iconStroke: '#111111',
            iconSVG: '<path d="M12 3c4 0 7 4.2 7 9.2 0 4.8-3.1 8.8-7 8.8s-7-4-7-8.8C5 7.2 8 3 12 3z"></path><circle cx="9.5" cy="11" r="0.8" fill="#111111"></circle><circle cx="14.5" cy="11" r="0.8" fill="#111111"></circle><path d="M9.5 15c1.4 1.2 3.6 1.2 5 0"></path>',
            desc: '一款黑白手绘风的平台跳跃游戏。操控圆润可爱的皮蛋角色穿越草地与台阶，寻找关卡出口；支持选关、移动、跳跃、暂停、重来和返回选关，角色在待机、行走与跳跃时拥有不同的动态表现。',
            features: [
                '🥚 手绘主角：圆润皮蛋造型，待机、行走和跳跃动作各不相同',
                '🎮 平台跳跃：通过移动与跳跃跨越草地、台阶和关卡障碍',
                '🗺️ 关卡选择：可从选关界面进入不同挑战',
                '⏸️ 完整控制：支持暂停、继续、重来和返回选关',
                '🌱 黑白世界：粗线条平台、空心小草与极简手绘视觉',
                '📱 网页试玩：使用浏览器即可运行，兼顾触控操作'
            ],
            tags: ['JavaScript', 'HTML5 Canvas', 'Platformer', 'Web Game', 'Hand-drawn'],
            screenshots: []
        },
        {
            id: 2,
            title: '手撕 GPT',
            shortName: '手撕 GPT',
            category: 'AI 学习项目 · LLM',
            date: '2026',
            rating: '持续开发中',
            gradient: 'linear-gradient(135deg, #111827 0%, #1d4ed8 58%, #60a5fa 100%)',
            iconStroke: '#FFFFFF',
            iconSVG: '<circle cx="12" cy="5" r="2"></circle><circle cx="5" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle><circle cx="12" cy="19" r="2"></circle><path d="M10.6 6.4 6.4 10.6M13.4 6.4l4.2 4.2M6.4 13.4l4.2 4.2M17.6 13.4l-4.2 4.2"></path>',
            desc: '一个从零实现 GPT 的学习型项目。用 PyTorch 从字符 Tokenizer、Embedding 与 Bigram 基线开始，逐步手写 Causal Self-Attention、多头注意力、残差连接、LayerNorm、FFN 与 Transformer Block，最终跑通训练和自回归文本生成。',
            features: [
                '🧱 从零搭建：按模块实现 GPT，而不是直接调用完整模型',
                '🧠 注意力机制：手写 Q/K/V、因果遮罩与多头注意力',
                '🔁 Transformer Block：组合残差、LayerNorm 与 FFN',
                '📐 Shape 验证：逐步检查张量维度、参数量和注意力概率',
                '📉 训练闭环：计划补齐 Loss、反向传播与文本生成',
                '📝 学习记录：代码与原理说明同步沉淀到 GitHub'
            ],
            tags: ['Python', 'PyTorch', 'Transformer', 'Self-Attention', 'LLM'],
            screenshots: [],
            resourceCopy: {
                prd: '学习路线与实现范围持续整理中，记录每个 GPT 模块为什么存在、如何实现以及怎样验收。',
                changelog: '按 Tokenizer、Attention、Transformer Block、训练与生成阶段记录实现和验证结果。',
                github: '查看从零实现 GPT 的源码、Notebook 与最新学习进度。',
                readme: '快速了解项目目标、已完成模块、运行方式与下一步计划。'
            }
        },
        {
            id: 3,
            title: 'PRD Agent',
            shortName: 'PRD Agent',
            category: 'AI Agent · 企业知识 RAG',
            date: '2026',
            rating: '持续开发中',
            gradient: 'linear-gradient(135deg, #062f2a 0%, #0f766e 58%, #5eead4 100%)',
            iconStroke: '#FFFFFF',
            iconSVG: '<path d="M6 3h9l3 3v15H6z"></path><path d="M14 3v4h4M9 11h6M9 15h4"></path><circle cx="17.5" cy="16.5" r="2.5"></circle><path d="m19.3 18.3 1.7 1.7"></path>',
            desc: '面向企业产品文档的知识检索与问答 Agent。围绕 Parsing、Chunking、混合检索、文档级与 Chunk 级分层召回、Rerank、版本过滤、证据校验和 Trace 持续迭代，用真实 Bad Case 与离线评测提升回答完整性和可信度。',
            features: [
                '📚 企业知识检索：面向 PRD 与产品规则构建可追溯问答',
                '🔎 分层召回：结合文档级、Chunk 级检索与章节扩展',
                '⚖️ 混合排序：融合向量、关键词检索与 Rerank',
                '🧾 证据边界：区分可回答、部分证据与证据不足',
                '🧪 离线评测：用真实 Bad Case 验证召回、重排和答案质量',
                '🔐 脱敏展示：公开页面不暴露公司内部文档与业务数据'
            ],
            tags: ['RAG', 'Agent', 'Hybrid Search', 'Rerank', 'Evaluation', 'Trace'],
            screenshots: [],
            resourceCopy: {
                prd: '产品目标、知识边界、检索链路和评测方案正在脱敏整理，暂不公开内部业务材料。',
                changelog: '记录从单路向量检索到分层召回、重排、证据校验与离线评测的迭代过程。',
                github: '项目涉及企业内部知识与数据，源码仓库暂不公开。',
                readme: '后续将提供不包含内部信息的架构说明、评测方法与公开 Demo。'
            }
        },
        {
            id: 4,
            title: '搜索引擎评测 Agent',
            shortName: '搜索评测 Agent',
            category: 'AI Agent · Search Evaluation',
            date: '2026',
            rating: 'Stage 0 已上线',
            gradient: 'linear-gradient(135deg, #101820 0%, #182f43 58%, #ff9900 100%)',
            iconStroke: '#FFFFFF',
            iconSVG: '<circle cx="10.5" cy="10.5" r="6.5"></circle><path d="m15.5 15.5 5 5"></path><path d="M7.5 11.5 10 9l2 2 2.5-3"></path>',
            desc: '一个证据驱动的电商搜索质量评测与诊断项目。当前体验页采用“优化前 / 优化后”双栏：优化前已接入 Stage 0 BM25，可实时搜索 10 条自建商品样例；优化后暂未支持，后续将在完整评测集与指标可信后逐步开放。',
            features: [
                '🔎 实时基线：输入英文 Query，在线运行 BM25 并返回商品',
                '↔️ 双栏对照：优化前可用，优化后保持明确的未开放状态',
                '🧪 评测边界：明确区分体验原型、正式评测与完整 ESCI',
                '📦 当前数据：10 条 Stage 0 商品样例，字段与限制透明披露',
                '🧾 证据链：路线图、ADR、验收报告与 GitHub 均可追溯',
                '🛡️ 后续 Harness：规划 Trace、Replay、超时、重试与预算控制'
            ],
            tags: ['BM25', 'Vector Search', 'Amazon ESCI', 'Evaluation', 'FastAPI', 'Agent Harness'],
            screenshots: ['search-eval-preview.svg'],
            primaryAction: {
                url: 'search-eval.html',
                label: '体验搜索差异',
                status: 'Stage 0 · Baseline'
            },
            resources: {
                first: {
                    heading: '01 · 建设路线图',
                    title: 'Roadmap',
                    href: 'https://github.com/Shaw485/search-engine-eva-agent/blob/main/ROADMAP.md',
                    intro: '查看八阶段建设顺序、每个阶段的交付物、验收门槛和明确不做的范围。'
                },
                second: {
                    heading: '02 · 当前验收证据',
                    title: 'Stage 0 Report',
                    href: 'https://github.com/Shaw485/search-engine-eva-agent/blob/main/docs/STAGE_0_REPORT.md',
                    intro: '查看本地技术闸门、43 条测试、环境约束、OpenSearch 待验证项与证据边界。'
                },
                codeHeading: '03 · 代码与说明',
                code: [
                    {
                        title: 'GitHub 仓库',
                        href: 'https://github.com/Shaw485/search-engine-eva-agent',
                        intro: '查看搜索后端、样例数据、测试、Compose 与最新提交。'
                    },
                    {
                        title: 'README',
                        href: 'https://github.com/Shaw485/search-engine-eva-agent/blob/main/README.md',
                        intro: '快速了解项目定位、运行方式、评测边界和下一步计划。'
                    }
                ]
            }
        },
        {
            id: 5,
            title: 'Pick Memory · 拾忆卡',
            shortName: 'Pick Memory',
            category: '桌面工具 · 间隔复习',
            date: '2026',
            rating: 'v0.3.1 已开源',
            gradient: 'linear-gradient(135deg, #18231d 0%, #2f7255 58%, #9bc3ae 100%)',
            iconStroke: '#FFFFFF',
            iconSVG: '<path d="M5 4.5h10a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z"></path><path d="M8 4.5V20M11 9h4M11 13h4"></path><path d="m18.5 3 .7 1.5L21 5.2l-1.8.7-.7 1.6-.7-1.6-1.8-.7 1.8-.7z"></path>',
            desc: 'Pick Memory 是一款本地优先的桌面间隔复习工具，把“随手收藏—按时复习—反馈掌握程度—管理知识库”连成一个轻量闭环。它既支持网页划词与手动添加，也通过 macOS 伴侣程序覆盖 Codex、备忘录、飞书等应用；知识卡以紧凑形式停留在网页左下角，不要求切换到专门的学习应用。',
            featureDetails: [
                { title: '快速采集', detail: '网页选中文字后，可通过右键菜单加入知识库；也可点击扩展图标手动输入或粘贴内容，并使用 Command / Ctrl + Shift + K 快速打开添加窗口。macOS 版还支持 Codex、备忘录、飞书等应用中的跨应用划词。' },
                { title: '间隔调度', detail: '新知识当天进入复习，之后按照 1、2、4、7、15、30、60、120、240 天逐步拉开间隔。系统优先显示已经到期的内容；当天没有到期卡片时，会选择较久未出现的知识作为“今日巩固”。' },
                { title: '掌握反馈', detail: '“记得”会进入下一阶段并切换到下一张；“模糊”保留当前阶段，但缩短下次出现的间隔；“忘了”会回到第一阶段，并在次日重新出现，让复习节奏跟随真实掌握程度调整。' },
                { title: '知识库管理', detail: '知识库展示知识总数、今日待复习和今日已复习，并支持按标题、正文或标签搜索。用户可以筛选学习状态，编辑、归档或删除知识，同时查看当前阶段、下次复习日期和累计复习次数。' },
                { title: '卡片与轮换', detail: '复习卡提供小、中、大三种尺寸，可设置每张知识卡曝光 1～20 次后自动轮换。卡片始终保留“设置”和“删除”入口，既方便持续复习，也能及时清理不再需要的内容。' },
                { title: '本地数据与平台', detail: '无需注册账号或后端服务，知识和复习记录保存在浏览器本地。Windows 版支持浏览器划词与复习；macOS 版额外提供跨应用收藏。当前卸载扩展会清除本地数据，导入导出和浏览器同步仍在后续计划中。' }
            ],
            features: [
                '🖱️ 随手收藏：网页与 macOS 跨应用划词后，一键加入知识库',
                '🧠 间隔复习：基于渐进间隔安排知识再次出现的时间',
                '🪶 紧凑卡片：小、中、大三种尺寸，不打断当前工作',
                '🔁 自动轮换：可设置每条知识曝光 1～20 次后进入下一张',
                '🔒 本地优先：知识与学习记录保存在本机，无需注册账号',
                '📚 搜索基础卡：内置 NDCG、BM25、向量召回与精排原理'
            ],
            tags: ['Chrome Extension', 'macOS', 'Spaced Repetition', 'Local First', 'Open Source'],
            screenshotLayout: 'landscape',
            screenshots: [
                'pick-memory-library.png',
                'pick-memory-live-demo.png',
                'pick-memory-google-review.png',
                'pick-memory-selection.png',
                'pick-memory-review-card.png'
            ],
            downloads: [
                {
                    url: 'https://github.com/Shaw485/pick-memory/releases/download/v0.3.1/Pick-Memory-macOS-v0.3.1.zip',
                    label: '下载 macOS'
                },
                {
                    url: 'https://github.com/Shaw485/pick-memory/releases/download/v0.3.1/Pick-Memory-Windows-v0.3.1.zip',
                    label: '下载 Windows'
                }
            ],
            platformStatus: 'v0.3.1 · GitHub 开源',
            resources: {
                first: {
                    heading: '01 · 产品与安装',
                    title: 'README',
                    href: 'https://github.com/Shaw485/pick-memory#readme',
                    intro: '查看产品能力、macOS / Windows 安装方法、数据说明与快捷键。'
                },
                second: {
                    heading: '02 · 版本更新',
                    title: 'Changelog',
                    href: 'https://github.com/Shaw485/pick-memory/blob/main/CHANGELOG.md',
                    intro: '查看卡片、划词学习、间隔策略、跨应用能力与安装包的迭代记录。'
                },
                codeHeading: '03 · 代码与发布',
                code: [
                    {
                        title: 'GitHub 仓库',
                        href: 'https://github.com/Shaw485/pick-memory',
                        intro: '查看完整源码、测试、macOS 伴侣程序与打包脚本。'
                    },
                    {
                        title: 'Release v0.3.1',
                        href: 'https://github.com/Shaw485/pick-memory/releases/tag/v0.3.1',
                        intro: '下载经过校验的 macOS 与 Windows 安装包。'
                    }
                ]
            }
        }
    ];

    const projectDocs = [
      { prd:[['问题','普通闹钟容易被顺手关闭，用户并没有真正清醒。'],['方案','响铃后生成 a×b+c×d 数学题，答对才能结束。'],['体验','单闹钟、滚轮选时、三种铃声、锁屏提醒与开机恢复。'],['技术','Kotlin、Jetpack Compose、AlarmManager、DataStore。']],
        process:[['定义闭环','先跑通设置—触发—答题—关闭。'],['系统适配','验证精确闹钟、全屏通知、前台服务和开机恢复。'],['交互打磨','统一黑橙视觉与三行滚轮选时。'],['可靠性','处理跨日、重启和超时兜底。']],
        changelog:[['需求成型','确定单闹钟与数学题解锁机制。'],['原生实现','完成 Compose 界面、铃声与状态管理。'],['系统适配','补齐 Android 13/14 权限。'],['稳定性','增加开机恢复、跨日计算与异常回流。']],
        links:[['GitHub','https://github.com/Shaw485/math_alarm'],['README','https://github.com/Shaw485/math_alarm/blob/main/README.md'],['PRD PDF','/%E6%9E%81%E7%AE%80%E6%95%B0%E5%AD%A6%E9%A2%98%E9%97%B9%E9%92%9F%20App%20PRD.pdf'],['完整改动记录 TXT','https://github.com/Shaw485/shaw.cn/blob/main/%E6%94%B9%E5%8A%A8%E8%AE%B0%E5%BD%95.txt']]},
      { prd:[['定位','黑白手绘风的平台跳跃小游戏。'],['玩法','移动、跳跃、穿越平台并找到出口。'],['视觉','粗线条、空心小草和圆润皮蛋角色。'],['架构','Godot 4.x + JSON 数据驱动关卡，并维护网页预览。']],
        process:[['可玩原型','完成移动、跳跃、碰撞与出口。'],['关卡系统','加入主菜单、选关和 JSON 加载。'],['视觉统一','重做角色、平台、门、小草与 HUD。'],['动作反馈','增加待机、行走、跳跃姿态。'],['持续修错','回归缓存、按钮、出生点和平台高度。']],
        changelog:[['v1–v4','首个可玩版本，并修复下一关循环和 JSON 缓存。'],['v5–v20','补齐完成页、加载流程、调试能力与跳跃修复。'],['v21–v25','重做 HUD、角色、平台和出口视觉。'],['v26–v30','加入跳跃摆臂、暂停菜单并调整手感。'],['v31–v33','增加待机/行走/跳跃动画与草地。']],links:[['完整改动记录 TXT','https://github.com/Shaw485/shaw.cn/blob/main/brain-egg-changelog.txt']]}
      ,{ links:[['GitHub','https://github.com/Shaw485/create-gpt-step-by-step'],['README','https://github.com/Shaw485/create-gpt-step-by-step/blob/main/README.md']]}
      ,{ links:[] }
      ,{ links:[['GitHub','https://github.com/Shaw485/search-engine-eva-agent'],['README','https://github.com/Shaw485/search-engine-eva-agent/blob/main/README.md']] }
      ,{ links:[['GitHub','https://github.com/Shaw485/pick-memory'],['README','https://github.com/Shaw485/pick-memory#readme']] }
    ];
    appsData.forEach((app,i)=>Object.assign(app,projectDocs[i]));

    const worksCount = document.querySelector('.works-count');
    if (worksCount) worksCount.textContent = `(${appsData.length})`;

    const appCardFields = [
        { status: '已上线', statusType: 'online', publishDate: '2026/3/14', shortDesc: '必须答对 a×b+c×d 格式数学题才能关闹钟，a/b/c/d 严格限定在 3–9；纯黑 + 橙色极简风，清晨/风来/钢琴三铃声，支持 Android 14+ 精确闹钟。', likes: 2, wants: 8, comments: 0 },
        { status: '开发中', statusType: 'wip', publishDate: '2026/8/15', shortDesc: '黑白手绘风平台跳跃游戏。操控可爱的皮蛋角色穿越草地与台阶，支持选关、移动、跳跃、暂停和重来。', likes: 0, wants: 0, comments: 0 },
        { status: '开发中', statusType: 'wip', publishDate: '2026/8/22', shortDesc: '用 PyTorch 从 Tokenizer、Self-Attention 开始手写 GPT，正在组装完整 Transformer Block，并继续推进训练与文本生成。', likes: 0, wants: 0, comments: 0 },
        { status: '开发中', statusType: 'wip', publishDate: '2026/8/13', shortDesc: '企业 PRD 知识检索 Agent，围绕分层召回、Rerank、版本过滤、证据校验和离线 Bad Case 评测持续优化。', likes: 0, wants: 0, comments: 0 },
        { status: '可体验', statusType: 'online', publishDate: '2026/8/25', shortDesc: '在双栏搜索页体验当前未优化的 BM25 商品结果；优化后面板暂未开放，后续每次优化都将在同一位置直接对照。', likes: 0, wants: 0, comments: 0 },
        { status: '已开源', statusType: 'online', publishDate: '2026/8/27', shortDesc: '随手划词加入知识库，用紧凑悬浮卡按艾宾浩斯节奏滚动复习；支持卡片大小、曝光轮换和 macOS 跨应用收藏。', likes: 0, wants: 0, comments: 0 }
    ];
    appsData.forEach((app, i) => Object.assign(app, appCardFields[i]));

    function renderWorks() {
        const grid = document.getElementById('worksGrid');
        if (!grid) return;
        grid.innerHTML = appsData.map(app => {
            const statusClass = app.statusType === 'online' ? 'status-online' : 'status-wip';
            return `
            <div class="work-card" data-app="${app.id}">
                <div class="work-card-top">
                    <span class="status-tag ${statusClass}">${app.status}</span>
                    <span class="work-date">${app.publishDate}</span>
                </div>
                <h3 class="work-title">「${app.shortName}」</h3>
                <p class="work-desc">${app.shortDesc}</p>
                <div class="work-card-bottom">
                    <div class="work-stats">
                        <span class="stat-item-mini" title="赞">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            ${app.likes}
                        </span>
                        <span class="stat-item-mini" title="想要">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            ${app.wants}
                        </span>
                        <span class="stat-item-mini" title="评论">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            ${app.comments}
                        </span>
                    </div>
                    <button class="btn-view-work" type="button">查看作品</button>
                </div>
            </div>`;
        }).join('');
    }
    renderWorks();

    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const backToTop = document.getElementById('backToTop');
    const revealElements = document.querySelectorAll('.reveal');
    const statNumbers = document.querySelectorAll('.stat-number');
    const typewriterElement = document.querySelector('.typewriter');
    const appModal = document.getElementById('appModal');
    const modalIcon = document.getElementById('modalIcon');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const modalDate = document.getElementById('modalDate');

    const modalDesc = document.getElementById('modalDesc');
    const modalFeatureDetails = document.getElementById('modalFeatureDetails');
    const modalScreenshots = document.getElementById('modalScreenshots');
    const modalApkDownload = document.getElementById('modalApkDownload');
    const modalApkLabel = document.getElementById('modalApkLabel');
    const modalSecondaryDownload = document.getElementById('modalSecondaryDownload');
    const modalSecondaryLabel = document.getElementById('modalSecondaryLabel');
    const modalPlatformActions = document.getElementById('modalPlatformActions');
    const modalDownloadStats = document.getElementById('modalDownloadStats');
    const modalDownloadCount = document.getElementById('modalDownloadCount');
    const imageLightbox = document.getElementById('imageLightbox');
    const imageLightboxImage = document.getElementById('imageLightboxImage');
    const imageLightboxClose = document.getElementById('imageLightboxClose');

    const modalPrdResource=document.getElementById('modalPrdResource'), modalChangelogResource=document.getElementById('modalChangelogResource'), modalCodeResources=document.getElementById('modalCodeResources');
    const modalPrdHeading=document.getElementById('modalPrdHeading'), modalChangelogHeading=document.getElementById('modalChangelogHeading'), modalCodeHeading=document.getElementById('modalCodeHeading');

    const worksGrid = document.getElementById('worksGrid');

    const roles = [
        '全栈开发者',
        'Android 工程师',
        'UI/UX 设计爱好者',
        '独立开发者',
        '产品创造者'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typewriterTimeout;

    function typeWriter() {
        if (!typewriterElement) return;
        const currentRole = roles[roleIndex];
        if (!isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentRole.length) {
                isDeleting = true;
                typewriterTimeout = setTimeout(typeWriter, 2000);
                return;
            }
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
        }
        typewriterTimeout = setTimeout(typeWriter, isDeleting ? 50 : 100);
    }

    function handleNavbarScroll() {
        if (window.scrollY > 20) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
        if (window.scrollY > 500) {
            backToTop?.classList.add('visible');
        } else {
            backToTop?.classList.remove('visible');
        }
        updateActiveNavLink();
    }

    function updateActiveNavLink() {
        if (!document.body.classList.contains('page-portfolio')) return;
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href') || '';
                    if ((sectionId === 'apps' && href === 'index.html') || href.endsWith('#' + sectionId)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    function revealOnScroll() {
        const triggerBottom = window.innerHeight * 0.88;
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                element.classList.add('visible');
            }
        });
    }

    function animateStats() {
        const heroSection = document.querySelector('.apps-hero-stats');
        if (!heroSection) return;
        const rect = heroSection.getBoundingClientRect();
        if (rect.top > window.innerHeight) return;
        statNumbers.forEach(stat => {
            if (stat.dataset.animated) return;
            const target = parseInt(stat.dataset.target);
            const duration = 1500;
            const startTime = performance.now();
            stat.dataset.animated = 'true';
            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(easeOutQuart * target);
                if (target >= 1000) {
                    stat.textContent = current.toLocaleString();
                } else {
                    stat.textContent = current;
                }
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    stat.textContent = target >= 1000 ? target.toLocaleString() : target;
                }
            }
            requestAnimationFrame(update);
        });
    }

    const downloadCounterGetUrl = 'https://countapi.mileshilliard.com/api/v1/get/shawspace_cn_math_alarm_v57_downloads';
    const downloadCounterHitUrl = 'https://countapi.mileshilliard.com/api/v1/hit/shawspace_cn_math_alarm_v57_downloads';

    function setDownloadCount(data) {
        const value = Number(data && (data.count ?? data.value));
        if (Number.isFinite(value) && modalDownloadCount) modalDownloadCount.textContent = value.toLocaleString('zh-CN');
    }

    async function refreshDownloadCount() {
        if (!modalDownloadCount) return;
        try {
            const response = await fetch(downloadCounterGetUrl, { cache: 'no-store' });
            if (!response.ok) throw new Error('counter unavailable');
            setDownloadCount(await response.json());
        } catch (error) {
            modalDownloadCount.textContent = '—';
        }
    }

    modalApkDownload?.addEventListener('click', () => {
        if (modalApkDownload.dataset.countDownload !== 'true') return;
        fetch(downloadCounterHitUrl, { cache: 'no-store', keepalive: true })
            .then(response => response.ok ? response.json() : Promise.reject())
            .then(setDownloadCount)
            .catch(() => {});
    });

    function openAppModal(appId) {
        const app = appsData.find(a => a.id === appId);
        if (!app || !appModal || !modalIcon || !modalTitle || !modalCategory || !modalDate || !modalDesc || !modalFeatureDetails || !modalScreenshots || !modalApkDownload || !modalApkLabel || !modalSecondaryDownload || !modalSecondaryLabel || !modalPlatformActions || !modalDownloadStats || !modalPrdResource || !modalChangelogResource || !modalCodeResources || !modalPrdHeading || !modalChangelogHeading || !modalCodeHeading) return;

        modalIcon.style.background = app.gradient;
        modalIcon.innerHTML = `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="${app.iconStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${app.iconSVG}</svg>`;
        modalTitle.textContent = app.title;
        modalCategory.textContent = app.category;
        modalDate.textContent = app.date;

        modalDesc.textContent = app.desc;
        if (app.featureDetails?.length) {
            modalFeatureDetails.innerHTML = app.featureDetails.map(item => `
                <article class="app-feature-detail">
                    <h4>${item.title}</h4>
                    <p>${item.detail}</p>
                </article>
            `).join('');
            modalFeatureDetails.hidden = false;
        } else {
            modalFeatureDetails.innerHTML = '';
            modalFeatureDetails.hidden = true;
        }

        modalScreenshots.classList.toggle('is-landscape', app.screenshotLayout === 'landscape');
        modalScreenshots.innerHTML=app.screenshots.length?app.screenshots.map((url,i)=>`<img src="${url}" alt="截图${i+1}">`).join(''):'<div class="empty-shot">开发记录持续补充中</div>';
        const primaryAction = app.apk || app.primaryAction || app.downloads?.[0];
        const secondaryAction = app.downloads?.[1];
        const platformStatus = modalPlatformActions.querySelector('.app-modal-platform-status');
        if (primaryAction) {
            modalApkDownload.href = primaryAction.url;
            modalApkLabel.textContent = primaryAction.label;
            modalApkDownload.dataset.countDownload = app.apk ? 'true' : 'false';
            if (app.apk || app.downloads) {
                modalApkDownload.setAttribute('download', '');
            } else {
                modalApkDownload.removeAttribute('download');
            }
            if (secondaryAction) {
                modalSecondaryDownload.href = secondaryAction.url;
                modalSecondaryLabel.textContent = secondaryAction.label;
                modalSecondaryDownload.hidden = false;
                modalSecondaryDownload.style.removeProperty('display');
            } else {
                modalSecondaryDownload.hidden = true;
                modalSecondaryDownload.style.display = 'none';
            }
            if (platformStatus) platformStatus.textContent = app.platformStatus || (app.apk ? '苹果版开发中' : primaryAction.status);

            modalPlatformActions.hidden = false;
            modalPlatformActions.style.removeProperty('display');
            modalApkDownload.hidden = false;
            modalApkDownload.style.removeProperty('display');
            modalDownloadStats.hidden = !app.apk;
            modalDownloadStats.style.display = app.apk ? '' : 'none';
            if (app.apk) refreshDownloadCount();
        } else {
            modalPlatformActions.hidden = true;
            modalPlatformActions.style.display = 'none';
            modalApkDownload.hidden = true;
            modalApkDownload.style.display = 'none';
            modalSecondaryDownload.hidden = true;
            modalSecondaryDownload.style.display = 'none';
            modalDownloadStats.hidden = true;
            modalDownloadStats.style.display = 'none';
        }
        const linkMap=Object.fromEntries(app.links.map(x=>[x[0],x[1]]));
        const defaultResourceCopy = app.id === 0 ? {
            prd: '记录产品目标、核心使用流程、数学题解锁规则与系统权限方案，适合快速了解产品为什么这样设计。',
            changelog: '按开发阶段记录功能实现、Android 系统适配和稳定性修复，能看到产品从需求到可用版本的演进过程。',
            github: '查看 Android 项目源码、目录结构与最新提交。',
            readme: '快速了解项目定位、主要功能、运行方式与开发说明。'
        } : {
            prd: 'PRD 正在整理中，完成后会在这里公开产品目标、玩法规则与关卡设计。',
            changelog: '记录从首个可玩原型到角色动画、关卡系统和视觉重做的完整迭代过程。',
            github: '源码仓库正在整理中，公开后会在这里提供完整项目。',
            readme: 'README 正在整理中，将补充玩法说明、运行方式和开发记录。'
        };
        const resourceCard=(title,href,intro,directDownload=false)=>`<div class="doc-card"><strong>${href?`<a href="${href}"${directDownload?' download':''}${directDownload?'':' target="_blank" rel="noopener"'}>${title}${directDownload?' ↓':' ↗'}</a>`:title}</strong><p>${intro}</p></div>`;
        if (app.resources) {
            modalPrdHeading.textContent = app.resources.first.heading;
            modalChangelogHeading.textContent = app.resources.second.heading;
            modalCodeHeading.textContent = app.resources.codeHeading;
            modalPrdResource.innerHTML = resourceCard(app.resources.first.title, app.resources.first.href, app.resources.first.intro);
            modalChangelogResource.innerHTML = resourceCard(app.resources.second.title, app.resources.second.href, app.resources.second.intro);
            modalCodeResources.innerHTML = app.resources.code.map(item => resourceCard(item.title, item.href, item.intro)).join('');
        } else {
            const resourceCopy = { ...defaultResourceCopy, ...(app.resourceCopy || {}) };
            modalPrdHeading.textContent = '01 · PRD';
            modalChangelogHeading.textContent = '02 · 改动记录';
            modalCodeHeading.textContent = '03 · GitHub 与 README';
            modalPrdResource.innerHTML=resourceCard('PRD PDF',linkMap['PRD PDF'],resourceCopy.prd,app.id===0);
            modalChangelogResource.innerHTML=resourceCard('完整改动记录 TXT',linkMap['完整改动记录 TXT'],resourceCopy.changelog);
            modalCodeResources.innerHTML=[
                resourceCard('GitHub 仓库',linkMap['GitHub'],resourceCopy.github),
                resourceCard('README',linkMap['README'],resourceCopy.readme)
            ].join('');
        }

        appModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }


    function openImageLightbox(image) {
        if (!imageLightbox || !imageLightboxImage) return;
        imageLightboxImage.src = image.currentSrc || image.src;
        imageLightboxImage.alt = image.alt || '作品截图';
        imageLightbox.classList.add('open');
        imageLightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeImageLightbox() {
        if (!imageLightbox || !imageLightboxImage) return;
        imageLightbox.classList.remove('open');
        imageLightbox.setAttribute('aria-hidden', 'true');
        imageLightboxImage.src = '';
        imageLightboxImage.alt = '';
        document.body.style.overflow = appModal?.classList.contains('open') ? 'hidden' : '';
    }

    modalScreenshots?.addEventListener('click', (event) => {
        const image = event.target.closest('img');
        if (image) openImageLightbox(image);
    });

    imageLightboxClose?.addEventListener('click', closeImageLightbox);
    imageLightbox?.addEventListener('click', (event) => {
        if (event.target === imageLightbox) closeImageLightbox();
    });

    function closeAppModal() {
        if (!appModal) return;
        appModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    worksGrid?.addEventListener('click', (e) => {
        const wrapper = e.target.closest('.work-card');
        if (!wrapper) return;
        const appId = parseInt(wrapper.dataset.app);
        openAppModal(appId);
    });

    appModal?.querySelectorAll('[data-close-modal]').forEach(el => {
        el.addEventListener('click', closeAppModal);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && imageLightbox?.classList.contains('open')) {
            closeImageLightbox();
        } else if (e.key === 'Escape' && appModal?.classList.contains('open')) {
            closeAppModal();
        }
    });

    navToggle?.addEventListener('click', () => {
        navLinksContainer.classList.toggle('mobile-open');
        const spans = navToggle.querySelectorAll('span');
        if (navLinksContainer.classList.contains('mobile-open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('mobile-open');
            const spans = navToggle?.querySelectorAll('span');
            if (spans) {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
    });

    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* AI Growth Journey -------------------------------------------------- */
    const aiAbilities = [
        {
            name: '场景与产品策略', short: '场景策略', current: 70, target: 82,
            focus: '把电商经验转成有取舍、有指标的 AI 场景判断。',
            recentDate: '08.25',
            recentWork: '对目标岗位做能力交集分析，收敛到评测驱动的检索 / Agent 产品方向。',
            acceptance: '能用用户价值、数据可得性、模型适配度、ROI、风险和可验证性评估至少 5 个场景，选出 1 个主场景并说明其余场景为什么暂不做。'
        },
        {
            name: '用户洞察与 AI 体验', short: '用户体验', current: 60, target: 76,
            focus: '补齐澄清、证据、纠错、失败恢复与反馈闭环。',
            recentDate: '08.16–08.25',
            recentWork: '通过数学题闹钟、作品站与 AI 学习页的真实迭代，持续练习从问题到交付的产品闭环。',
            acceptance: '完成至少 5 名目标用户的任务测试；3 个核心任务完成率达到 80%，并根据证据修复优先级最高的 5 个体验问题。'
        },
        {
            name: 'LLM 与检索理解', short: 'LLM / 检索', current: 43, target: 66,
            focus: '重点理解查询、召回、重排、引用和模型边界。',
            recentDate: '08.21–08.25',
            recentWork: '学习 Chunking、Embedding、BM25、混合检索、证据边界与 Agentic Search，并开始推进离线对比。',
            acceptance: '能讲清端到端检索链路；建立不少于 60 条检索题，Recall@5 达到 80% 或较基线提升 15 个百分点，引用准确率达到 90%。'
        },
        {
            name: 'Agent 与平台方案', short: 'Agent / 平台', current: 38, target: 64,
            focus: '从单点 Demo 进阶到可追踪、可治理的多工具能力。',
            recentDate: '08.13–08.25',
            recentWork: '已跑通知识切分、检索、上下文组装与回答链路；下一步补齐 Tool、状态、权限、版本和监控。',
            acceptance: '接入至少 3 个工具并完成 30 条多步骤任务，端到端成功率达到 80%；所有调用可追踪，高风险动作 100% 需要人工确认。'
        },
        {
            name: '评测与数据分析', short: '评测数据', current: 35, target: 70,
            focus: '从看几个答案，升级为可复现、可比较的决策系统。',
            recentDate: '08.18–08.25',
            recentWork: '建立 Outcome、Trajectory、Trace 与错误归因的初步认知，并开始用 Bad Case 定位检索问题。',
            acceptance: '建立 100 条以上分层评测集；LLM Judge 与人工抽检一致率达到 80%；比较至少 3 组方案，并基于质量、延迟和成本给出产品决策。'
        },
        {
            name: '协同交付与表达', short: '协同表达', current: 68, target: 80,
            focus: '把判断、取舍和结果沉淀成可评审、可投递的证据。',
            recentDate: '08.16–08.25',
            recentWork: '完成 Android 构建、代码合并、云服务器部署与个人站多轮上线验证。',
            acceptance: '沉淀公开案例、PRD、架构图、评测报告和 Demo；完成至少 3 次模拟面试，中文 10 分钟与英文 3 分钟均能用数据讲清关键取舍。'
        }
    ];

    const aiRecentActivities = [
        {
            date: '08.13', datetime: '2026-08-13', title: '跑通 RAG 基础链路',
            text: '完成知识切分、检索、上下文组装和模型回答；确认下一步重点在评测、召回与排序。',
            project: 'PRD Agent',
            abilities: ['LLM / 检索', '评测数据']
        },
        {
            date: '08.16', datetime: '2026-08-16', title: '完成产品迭代与上线',
            text: '推进数学题闹钟真机修复、APK 构建、代码合并与个人站部署，用真实交付检查产品闭环。',
            project: '数学题闹钟',
            abilities: ['用户体验', '协同交付']
        },
        {
            date: '08.18', datetime: '2026-08-18', title: '开始建立 Agent Eval 认知',
            text: '梳理 Outcome、Trajectory、Trace 与错误归因，明确评测要从产品目标和真实任务出发。',
            project: 'PRD Agent',
            abilities: ['评测数据']
        },
        {
            date: '08.21', datetime: '2026-08-21', title: '补齐搜索与 RAG 基础',
            text: '学习 Chunking、Embedding、BM25、混合检索、证据边界与 Agentic Search。',
            project: 'PRD Agent',
            abilities: ['LLM / 检索', 'Agent / 平台']
        },
        {
            date: '08.22—08.24', datetime: '2026-08-24', title: '手写 Transformer 模块',
            text: '实现 Self-Attention、Multi-Head、Residual、LayerNorm 与 FFN，并梳理到 Logits 的链路。',
            project: '手撕 GPT',
            abilities: ['LLM / 检索']
        },
        {
            date: '08.25', datetime: '2026-08-25', title: '按目标 JD 重做两个月计划',
            text: '旧路线作废；新的 8 周计划聚焦场景与体验、信息检索、评测数据、Agent 平台和可验证的交付证据。',
            project: '学习路线',
            abilities: ['场景策略', '评测数据']
        }
    ];

    const aiEvidence = [
        {
            title: 'TikTok Shop 产品实践',
            text: '具备真实跨境电商业务、商家需求和跨团队产品经验，是转向 AI 产品岗位最重要的场景与落地基础。',
            tags: ['E-COMMERCE', 'PRODUCT', 'BUSINESS']
        },
        {
            title: '企业知识 RAG',
            text: '已经跑通知识切分、检索、上下文组装与回答链路，正用脱敏 Bad Case 推进召回、重排与证据校验。',
            tags: ['RAG', 'EVALUATION', 'PRIVATE / REDACTED']
        },
        {
            title: '从零手搓 GPT',
            text: '用 PyTorch 实现 Tokenizer、Causal Self-Attention、多头注意力、残差、LayerNorm 与 FFN，建立模型边界的直观理解。',
            tags: ['PYTORCH', 'TRANSFORMER', 'BUILD']
        },
        {
            title: '持续交付与上线',
            text: '覆盖 AI 学习、RAG、Android App、浏览器游戏与个人站，具备从定义、调试、迭代到 GitHub 和云服务器上线的闭环。',
            tags: ['PRODUCT', 'APP', 'DEPLOY']
        }
    ];

    const aiPhases = [
        { id: 'baseline', code: 'P1', title: '问题定义与检索基线', label: 'P1 · 问题定义与检索基线', fromWeek: 1, toWeek: 2 },
        { id: 'evaluation', code: 'P2', title: '评测驱动与用户体验', label: 'P2 · 评测驱动与用户体验', fromWeek: 3, toWeek: 4 },
        { id: 'platform', code: 'P3', title: 'Agent 与开放平台', label: 'P3 · Agent 与开放平台', fromWeek: 5, toWeek: 6 },
        { id: 'evidence', code: 'P4', title: '数据决策与求职案例', label: 'P4 · 数据决策与求职案例', fromWeek: 7, toWeek: 8 }
    ];

    const aiRoadmap = [
        {
            week: 1, phase: 'baseline', start: '2026-08-25', end: '2026-08-31', review: '08/28 21:00', title: '岗位画像、场景选择与指标基线',
            learn: ['梳理目标 JD 的共同能力、岗位证据与个人差距', '用用户价值、数据、模型、ROI、风险、可验证性筛选 AI 场景', '建立业务、体验、模型与护栏四层指标树'],
            business: ['从跨境电商工作流列出至少 5 个知识检索场景', '完成至少 3 次目标用户访谈，整理 JTBD 与当前旅程', '选定 PRD Agent 2.0 主场景并建立 20 条基线问题'],
            output: 'JD 能力矩阵 + 场景机会地图 + 产品一页纸 + 用户旅程 + 指标树 + 基线问题集。',
            acceptance: '覆盖 7 个独立目标 JD；用 6 个维度评分至少 5 个场景并说明取舍；完成 ≥3 次访谈、≥20 条基线题；定义 1 个北极星、3 个过程指标和 2 个护栏指标。',
            jd: ['场景与策略', '用户洞察', '效果定义', '项目推动']
        },
        {
            week: 2, phase: 'baseline', start: '2026-09-01', end: '2026-09-07', review: '09/04 21:00', title: '信息检索与 RAG 可复现基线',
            learn: ['Query 理解、改写与意图识别', 'Chunk、Embedding、BM25、混合召回、Rerank、版本过滤与引用', 'Recall@K、MRR、nDCG、引用准确率、延迟与成本'],
            business: ['用公开、脱敏或合成资料搭建查询理解 → 召回 → 重排 → 引用链路', '整理不少于 50 份文档与 60 条检索题，其中至少 20% 为英文或中英混合', '建立检索 Bad Case 分类并完成第一轮优化'],
            output: '检索与数据链路图 + 数据规范 + 可运行 Demo + 基线报告 + Bad Case 清单。',
            acceptance: '所有回答可追溯到来源与版本；Recall@5 ≥80% 或较基线提升 ≥15 个百分点；引用准确率 ≥90%；分析 ≥10 个 Bad Case，并完成其中 3 类问题的迭代。',
            jd: ['信息检索', 'RAG 策略', '海外体验', '数据链路', '模型边界']
        },
        {
            week: 3, phase: 'evaluation', start: '2026-09-08', end: '2026-09-14', review: '09/11 21:00', title: 'LLM 评测体系与版本结论',
            learn: ['离线评测与线上评测的边界，拆分检索、生成和端到端指标', 'Golden Set、Rubric、Human Eval、规则评测与 LLM-as-Judge', '任务分层、标注规范、Judge 校准与错误归因'],
            business: ['把 W2 题集扩展为 100 条以上、覆盖至少 6 类任务的评测集', '搭建可一键复跑的自动评测流程，对基线版与新版本做统一比较', '从结果中提炼优先级最高的 3 个问题与改进建议'],
            output: '评测方案 + Golden Set v1 + 自动评测流程 + 版本对比面板 + 结论报告。',
            acceptance: '题集 ≥100 条，含 ≥20 条困难、歧义或失败样本；抽取 20 条由至少 2 人复核；Judge 与人工一致率 ≥80%；能说明各指标的升降、根因和是否值得继续上线。',
            jd: ['评测体系', '结果分析', '数据生产', '模型迭代']
        },
        {
            week: 4, phase: 'evaluation', start: '2026-09-15', end: '2026-09-21', review: '09/18 21:00', title: 'C 端搜索体验与反馈闭环',
            learn: ['搜索与对话的信息架构，以及澄清、证据、置信表达与无答案设计', 'Human-in-the-loop、纠错、撤销、失败恢复与可信交互', '埋点、漏斗、A/B 实验、护栏指标与停止条件'],
            business: ['实现查询、结果、引用、澄清、纠错和反馈 6 个关键环节', '邀请至少 5 名目标用户完成 3 个核心任务', '按用户证据修复优先级最高的体验问题并复测'],
            output: '高保真原型或网页 Demo + 埋点字典 + 用户测试记录 + A/B 方案 + 迭代报告。',
            acceptance: '5 名用户、3 个核心任务完成率 ≥80%；收集 ≥8 个体验问题并修复前 5 个；定义 ≥15 个关键埋点；A/B 方案含主指标、2 个护栏指标和明确停止条件。',
            jd: ['C 端体验', '用户研究', '产品设计', '数据闭环']
        },
        {
            week: 5, phase: 'platform', start: '2026-09-22', end: '2026-09-28', review: '09/25 21:00', title: 'Agent、Tool 与任务编排',
            learn: ['Workflow 与自主 Agent 的适用边界', 'Tool Schema、结构化输出、Context、Memory 与状态管理', '超时、重试、幂等、异常、降级、Trace 与人工确认'],
            business: ['为主项目接入知识检索、版本对比、冲突检查等至少 3 个工具', '实现一个连续调用多个工具的任务流程', '建立多步骤任务集，观察参数、结果、耗时和失败原因'],
            output: 'Agent 架构图 + 状态机 + Tool Schema + 正常/异常/降级路径 + 可追踪 Demo。',
            acceptance: '接入 ≥3 个工具并建立 ≥30 条多步骤任务；端到端成功率 ≥80%；覆盖参数错误、无结果、超时、重复调用、权限不足 5 类异常；高风险写入 100% 需要确认。',
            jd: ['Agent', 'Tool / MCP', '任务编排', '工程协同', '模型约束']
        },
        {
            week: 6, phase: 'platform', start: '2026-09-29', end: '2026-10-05', review: '10/02 21:00', title: '开放平台、Skill 与治理机制',
            learn: ['能力抽象、模块解耦、统一接口与开发者体验', 'Skill 注册、上架、调用、下架与版本兼容', '权限、配额、日志、监控、质量认证、错误码与 SLA'],
            business: ['把 W5 工具包装成可注册、可调用的 Skill', '设计轻量 Skill Center、接入规范和权限矩阵', '验证一次 v1 → v2 兼容升级与异常处理'],
            output: '开放平台 PRD + Skill 接入规范 + 发布审核流程 + 权限矩阵 + 监控指标 + 交互原型。',
            acceptance: '至少 3 个 Skill 通过统一 Schema 校验；完成 1 次兼容升级；覆盖管理员、开发者、普通用户 3 类角色与 ≥10 个权限/服务异常；新开发者按文档 30 分钟内完成首次调用。',
            jd: ['开放平台', '能力模块化', '版本权限', '监控治理', 'Skill 生态']
        },
        {
            week: 7, phase: 'evidence', start: '2026-10-06', end: '2026-10-12', review: '10/09 21:00', title: '数据复盘、第二轮迭代与上线决策',
            learn: ['从评测切片和 Trace 定位模型、数据、策略、交互或工程根因', '质量、任务成功、延迟、成本与风险的联合决策', '线上实验、ROI 敏感性、灰度、回滚与 Go / Iterate / Stop'],
            business: ['对 W2–W6 的关键版本做统一回归，关闭优先级最高的 3 类 Bad Case', '比较至少 3 组配置并完成第二轮迭代', '设计线上实验与轻量增长 / 商业假设，不让单一模型分数替代产品结果'],
            output: '前后对比仪表盘 + Bad Case 归因与闭环 + 实验方案 + ROI 测算 + 产品决策 Memo。',
            acceptance: 'Top 3 Bad Case 均有根因、责任层与验证结果；至少 1 个核心指标提升，或用证据做出停止/回滚决策；质量、延迟、成本同时可比较；结论明确为 Go、Iterate 或 Stop。',
            jd: ['数据分析', '评测结论', '策略迭代', '项目运营', 'ROI']
        },
        {
            week: 8, phase: 'evidence', start: '2026-10-13', end: '2026-10-19', review: '10/16 21:00', title: '端到端案例与面试验证',
            learn: ['用问题、洞察、决策、实现、评测、结果和复盘讲 AI 产品案例', '准备产品策略、LLM 评测、检索与 Agent 系统设计高频问题', '表达模型边界、失败实验、跨团队协作和关键取舍'],
            business: ['整理主案例：PRD Agent 2.0；辅助案例：数学题闹钟与手撕 GPT', '录制中文 10 分钟演示与英文 3 分钟项目介绍', '邀请产品或技术同学按统一标准进行模拟面试'],
            output: '公开案例页 + 在线 Demo + PRD + 架构图 + 评测报告 + 演示视频 + 英文 One-pager + 简历描述。',
            acceptance: '新环境 15 分钟内可运行，核心链路无阻断；完成 ≥3 次模拟面试；产品判断、评测分析、技术理解、数据表达、项目推动 5 项平均 ≥4/5；准备 ≥20 道问题且至少 10 道能用项目数据回答。',
            jd: ['端到端交付', '项目管理', '沟通协作', '英文表达', '作品案例']
        }
    ];

    function aiDateLabel(iso) {
        const date = new Date(`${iso}T12:00:00`);
        return `${date.getMonth() + 1}月${date.getDate()}日`;
    }

    function renderAiRadar() {
        const svg = document.getElementById('aiRadarChart');
        if (!svg) return;
        const ns = 'http://www.w3.org/2000/svg';
        const cx = 260;
        const cy = 212;
        const radius = 145;
        const labelRadius = 190;
        const pointAt = (index, value, totalRadius = radius) => {
            const angle = (-90 + index * 60) * Math.PI / 180;
            const scaled = totalRadius * value / 100;
            return [cx + Math.cos(angle) * scaled, cy + Math.sin(angle) * scaled];
        };
        const polygonPoints = (value) => aiAbilities.map((_, index) => pointAt(index, value).join(',')).join(' ');
        [20, 40, 60, 80, 100].forEach(level => {
            const polygon = document.createElementNS(ns, 'polygon');
            polygon.setAttribute('points', polygonPoints(level));
            polygon.setAttribute('class', 'ai-radar-grid');
            svg.appendChild(polygon);
        });
        aiAbilities.forEach((ability, index) => {
            const [x, y] = pointAt(index, 100);
            const axis = document.createElementNS(ns, 'line');
            axis.setAttribute('x1', cx); axis.setAttribute('y1', cy);
            axis.setAttribute('x2', x); axis.setAttribute('y2', y);
            axis.setAttribute('class', 'ai-radar-axis');
            svg.appendChild(axis);

            const [labelX, labelY] = pointAt(index, 100, labelRadius);
            const label = document.createElementNS(ns, 'text');
            label.setAttribute('x', labelX); label.setAttribute('y', labelY - 4);
            label.setAttribute('class', 'ai-radar-label');
            label.textContent = ability.short;
            svg.appendChild(label);

            const score = document.createElementNS(ns, 'text');
            score.setAttribute('x', labelX); score.setAttribute('y', labelY + 13);
            score.setAttribute('class', 'ai-radar-score');
            score.textContent = `${ability.current} → ${ability.target}`;
            svg.appendChild(score);
        });
        const target = document.createElementNS(ns, 'polygon');
        target.setAttribute('points', aiAbilities.map((ability, index) => pointAt(index, ability.target).join(',')).join(' '));
        target.setAttribute('class', 'ai-radar-target');
        svg.appendChild(target);
        const current = document.createElementNS(ns, 'polygon');
        current.setAttribute('points', aiAbilities.map((ability, index) => pointAt(index, ability.current).join(',')).join(' '));
        current.setAttribute('class', 'ai-radar-current');
        svg.appendChild(current);
        aiAbilities.forEach((ability, index) => {
            const [x, y] = pointAt(index, ability.current);
            const dot = document.createElementNS(ns, 'circle');
            dot.setAttribute('cx', x); dot.setAttribute('cy', y); dot.setAttribute('r', 5);
            dot.setAttribute('class', 'ai-radar-dot');
            svg.appendChild(dot);
        });
    }

    function renderAiRecentTimeline() {
        const timeline = document.getElementById('aiRecentTimeline');
        const summary = document.getElementById('recentTimelineSummary');
        if (!timeline || !summary) return;
        summary.textContent = `${aiRecentActivities.length} 条`;
        timeline.innerHTML = `
            <div class="ai-recent-range"><span>08.13</span><strong>时间进度</strong><span>08.25</span></div>
            <ol role="progressbar" aria-label="8 月 13 日至 25 日学习时间进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100">
                ${aiRecentActivities.map((item, index) => `
                    <li class="${index === aiRecentActivities.length - 1 ? 'current' : 'completed'}">
                        <span class="ai-recent-node" aria-hidden="true"></span>
                        <time datetime="${item.datetime}">${item.date}</time>
                        <article>
                            <div class="ai-recent-labels">
                                <span class="ai-recent-project">对应项目 · ${item.project}</span>
                                <div class="ai-recent-tags">${item.abilities.map(ability => `<span>${ability}</span>`).join('')}</div>
                            </div>
                            <h4>${item.title}</h4>
                            <p>${item.text}</p>
                        </article>
                    </li>`).join('')}
            </ol>`;
    }

    function renderCapabilityStandards() {
        const standards = document.getElementById('aiCapabilityStandards');
        if (!standards) return;
        standards.innerHTML = aiAbilities.map(item => `
            <article>
                <div><strong>${item.name}</strong><span>${item.current} → ${item.target}</span></div>
                <p><b>当前重点：</b>${item.focus}</p>
                <p><b>目标验收：</b>${item.acceptance}</p>
            </article>`).join('');
    }

    function renderAiEvidence() {
        const grid = document.getElementById('aiEvidenceGrid');
        if (!grid) return;
        grid.innerHTML = aiEvidence.map((item, index) => `
            <article class="ai-evidence-card">
                <span class="ai-evidence-index">EVIDENCE ${String(index + 1).padStart(2, '0')}</span>
                <h4>${item.title}</h4><p>${item.text}</p>
                <div class="ai-evidence-tags">${item.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
            </article>`).join('');
    }

    function getCurrentAiWeek(now = new Date()) {
        return aiRoadmap.find(item => now >= new Date(`${item.start}T00:00:00`) && now <= new Date(`${item.end}T23:59:59`))?.week || null;
    }

    function renderAiCurrentWeek() {
        const label = document.getElementById('currentWeekLabel');
        const title = document.getElementById('currentWeekTitle');
        const summary = document.getElementById('currentWeekSummary');
        if (!label || !title || !summary) return;

        const now = new Date();
        const currentWeekNumber = getCurrentAiWeek(now);
        const currentWeek = aiRoadmap.find(item => item.week === currentWeekNumber);
        const planStart = new Date(`${aiRoadmap[0].start}T00:00:00`);
        const planEnd = new Date(`${aiRoadmap[aiRoadmap.length - 1].end}T23:59:59`);

        if (currentWeek) {
            label.textContent = `WEEK ${String(currentWeek.week).padStart(2, '0')} · 本周主线`;
            title.textContent = currentWeek.title;
            summary.textContent = `本周要完成：${currentWeek.business.slice(0, 2).join('；')}。`;
        } else if (now < planStart) {
            label.textContent = '计划尚未开始';
            title.textContent = '先准备项目资料与用户名单';
            summary.textContent = `8 周计划将于 ${aiDateLabel(aiRoadmap[0].start)}开始。`;
        } else if (now > planEnd) {
            label.textContent = '8 周计划已结束';
            title.textContent = '整理成果与下一阶段复盘';
            summary.textContent = '回看每周验收、最终案例与模拟面试反馈，决定下一轮唯一重点。';
        }
    }

    function renderAiLearningPhases() {
        const list = document.getElementById('aiLearningPhases');
        const progress = document.getElementById('aiLearningTimeProgress');
        const fill = document.getElementById('aiLearningTimeFill');
        const text = document.getElementById('aiLearningTimeText');
        if (!list || !progress || !fill || !text) return;

        const start = new Date(`${aiRoadmap[0].start}T00:00:00`);
        const end = new Date(`${aiRoadmap[aiRoadmap.length - 1].end}T23:59:59`);
        const now = new Date();
        const dayMs = 24 * 60 * 60 * 1000;
        const totalDays = Math.floor((end - start) / dayMs) + 1;
        const elapsedDays = now < start ? 0 : now > end ? totalDays : Math.floor((now - start) / dayMs) + 1;
        const percent = Math.max(0, Math.min(100, elapsedDays / totalDays * 100));
        const currentPhase = aiPhases.find(phase => {
            const firstWeek = aiRoadmap.find(item => item.week === phase.fromWeek);
            const lastWeek = aiRoadmap.find(item => item.week === phase.toWeek);
            return now >= new Date(`${firstWeek.start}T00:00:00`) && now <= new Date(`${lastWeek.end}T23:59:59`);
        });

        progress.style.setProperty('--learning-progress', `${percent}%`);
        progress.setAttribute('aria-valuenow', String(Math.round(percent)));
        list.style.setProperty('--roadmap-week-count', aiRoadmap.length);
        text.textContent = currentPhase
            ? `第 ${elapsedDays} / ${totalDays} 天 · 当前 ${currentPhase.code}`
            : now < start ? '计划尚未开始' : '计划周期已结束';

        list.innerHTML = aiPhases.map(phase => {
            const firstWeek = aiRoadmap.find(item => item.week === phase.fromWeek);
            const lastWeek = aiRoadmap.find(item => item.week === phase.toWeek);
            const phaseStart = new Date(`${firstWeek.start}T00:00:00`);
            const phaseEnd = new Date(`${lastWeek.end}T23:59:59`);
            const status = now > phaseEnd ? 'completed' : now >= phaseStart ? 'active' : 'upcoming';
            return `<li class="${status}" style="grid-column:span ${phase.toWeek - phase.fromWeek + 1}"${status === 'active' ? ' aria-current="step"' : ''}>
                <span class="ai-learning-stage-node" aria-hidden="true"></span>
                <span class="ai-learning-stage-code">${phase.code}</span>
                <strong>${phase.title}</strong>
                <small>W${String(phase.fromWeek).padStart(2, '0')}—W${String(phase.toWeek).padStart(2, '0')} · ${aiDateLabel(firstWeek.start)}—${aiDateLabel(lastWeek.end)}</small>
            </li>`;
        }).join('');
    }

    function renderAiRoadmap() {
        const filters = document.getElementById('aiPhaseFilters');
        const list = document.getElementById('aiRoadmapList');
        if (!filters || !list) return;
        const currentWeek = getCurrentAiWeek();
        filters.innerHTML = [{ id: 'all', label: `全部 ${aiRoadmap.length} 周` }, ...aiPhases].map((phase, index) => `<button type="button" class="ai-phase-filter${index === 0 ? ' active' : ''}" data-phase="${phase.id}" aria-pressed="${index === 0}">${phase.label}</button>`).join('');
        list.innerHTML = aiRoadmap.map(item => {
            const phase = aiPhases.find(candidate => candidate.id === item.phase);
            const isCurrent = currentWeek === item.week;
            return `<details class="ai-week-card${isCurrent ? ' current' : ''}" data-week="${item.week}" data-phase="${item.phase}"${isCurrent ? ' open' : ''}>
                <summary>
                    <span class="ai-week-number">WEEK ${String(item.week).padStart(2, '0')}</span>
                    <span class="ai-week-title-wrap"><span class="ai-week-phase">${phase.label}</span><span class="ai-week-title">${item.title}</span></span>
                    <span class="ai-week-date">${aiDateLabel(item.start)}—${aiDateLabel(item.end)}<br>验收 ${item.review}</span>
                    <svg class="ai-week-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5v14M5 12h14"/></svg>
                </summary>
                <div class="ai-week-body">
                    <div class="ai-week-column"><h5>本周学习</h5><ul>${item.learn.map(value => `<li>${value}</li>`).join('')}</ul></div>
                    <div class="ai-week-column"><h5>业务实战</h5><ul>${item.business.map(value => `<li>${value}</li>`).join('')}</ul></div>
                    <div class="ai-week-jd"><span>JD 对齐</span><div>${item.jd.map(value => `<em>${value}</em>`).join('')}</div></div>
                    <div class="ai-week-deliverable"><div><span>可交付物</span><strong>${item.output}</strong></div></div>
                    <div class="ai-week-acceptance"><div><span>周五 21:00 · 验收标准</span><strong>${item.acceptance}</strong></div><label class="ai-week-check"><input type="checkbox" data-week-complete="${item.week}"> 本周达标</label></div>
                </div>
            </details>`;
        }).join('');

        filters.addEventListener('click', event => {
            const button = event.target.closest('.ai-phase-filter');
            if (!button) return;
            filters.querySelectorAll('.ai-phase-filter').forEach(item => {
                const active = item === button;
                item.classList.toggle('active', active);
                item.setAttribute('aria-pressed', String(active));
            });
            list.querySelectorAll('.ai-week-card').forEach(card => { card.hidden = button.dataset.phase !== 'all' && card.dataset.phase !== button.dataset.phase; });
        });

        const storageKey = 'shaw-ai-roadmap-progress-v2';
        let completed = [];
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
            completed = Array.isArray(saved)
                ? saved.map(Number).filter(week => Number.isInteger(week) && week >= 1 && week <= aiRoadmap.length)
                : [];
        } catch (error) { completed = []; }
        const updateProgress = () => {
            const checkboxes = [...list.querySelectorAll('[data-week-complete]')];
            const done = checkboxes.filter(box => box.checked).map(box => Number(box.dataset.weekComplete));
            document.getElementById('roadmapProgressText').textContent = `${done.length} / ${aiRoadmap.length} 周完成`;
            document.getElementById('roadmapProgressBar').style.width = `${done.length / aiRoadmap.length * 100}%`;
            list.querySelectorAll('.ai-week-card').forEach(card => card.classList.toggle('completed', done.includes(Number(card.dataset.week))));
            localStorage.setItem(storageKey, JSON.stringify(done));
        };
        list.querySelectorAll('[data-week-complete]').forEach(box => {
            box.checked = completed.includes(Number(box.dataset.weekComplete));
            box.addEventListener('change', updateProgress);
        });
        updateProgress();
    }

    function renderNextCheckin() {
        const title = document.getElementById('nextCheckinTitle');
        const node = document.getElementById('nextCheckinText');
        if (!title || !node) return;
        const now = new Date();
        const planEnd = new Date(`${aiRoadmap[aiRoadmap.length - 1].end}T23:59:59`);
        if (now > planEnd) {
            title.textContent = '本期已收官';
            node.textContent = '8 周计划已结束 · 查看最终案例、数据与模拟面试复盘。';
            return;
        }
        title.textContent = '周五 21:00';
        const next = new Date(now);
        let days = (5 - next.getDay() + 7) % 7;
        if (days === 0 && next.getHours() >= 21) days = 7;
        next.setDate(next.getDate() + days);
        next.setHours(21, 0, 0, 0);
        node.textContent = next <= planEnd
            ? `${next.getMonth() + 1}月${next.getDate()}日 周五 21:00 · 产出链接、指标、Bad Case 与下周唯一目标。`
            : `${aiDateLabel(aiRoadmap[aiRoadmap.length - 1].end)} · 完成八周总复盘与成果归档。`;
    }

    renderAiCurrentWeek();
    renderAiRadar();
    renderAiRecentTimeline();
    renderCapabilityStandards();
    renderAiLearningPhases();
    renderAiEvidence();
    renderAiRoadmap();
    renderNextCheckin();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => observer.observe(el));

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    window.addEventListener('scroll', animateStats, { passive: true });

    handleNavbarScroll();
    revealOnScroll();
    animateStats();
    setTimeout(typeWriter, 800);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 60;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });
});
