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
                label: '下载应用',
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
    ];
    appsData.forEach((app,i)=>Object.assign(app,projectDocs[i]));

    const worksCount = document.querySelector('.works-count');
    if (worksCount) worksCount.textContent = `(${appsData.length})`;

    const appCardFields = [
        { status: '已上线', statusType: 'online', publishDate: '2026/3/14', shortDesc: '必须答对 a×b+c×d 格式数学题才能关闹钟，a/b/c/d 严格限定在 3–9；纯黑 + 橙色极简风，清晨/风来/钢琴三铃声，支持 Android 14+ 精确闹钟。', likes: 2, wants: 8, comments: 0 },
        { status: '开发中', statusType: 'wip', publishDate: '2026/8/15', shortDesc: '黑白手绘风平台跳跃游戏。操控可爱的皮蛋角色穿越草地与台阶，支持选关、移动、跳跃、暂停和重来。', likes: 0, wants: 0, comments: 0 },
        { status: '开发中', statusType: 'wip', publishDate: '2026/8/22', shortDesc: '用 PyTorch 从 Tokenizer、Self-Attention 开始手写 GPT，正在组装完整 Transformer Block，并继续推进训练与文本生成。', likes: 0, wants: 0, comments: 0 },
        { status: '开发中', statusType: 'wip', publishDate: '2026/8/13', shortDesc: '企业 PRD 知识检索 Agent，围绕分层召回、Rerank、版本过滤、证据校验和离线 Bad Case 评测持续优化。', likes: 0, wants: 0, comments: 0 }
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
    const modalScreenshots = document.getElementById('modalScreenshots');
    const modalApkDownload = document.getElementById('modalApkDownload');
    const modalApkLabel = document.getElementById('modalApkLabel');
    const modalDownloadStats = document.getElementById('modalDownloadStats');
    const modalDownloadCount = document.getElementById('modalDownloadCount');
    const imageLightbox = document.getElementById('imageLightbox');
    const imageLightboxImage = document.getElementById('imageLightboxImage');
    const imageLightboxClose = document.getElementById('imageLightboxClose');

    const modalPrdResource=document.getElementById('modalPrdResource'), modalChangelogResource=document.getElementById('modalChangelogResource'), modalCodeResources=document.getElementById('modalCodeResources');

    const worksGrid = document.getElementById('worksGrid');

    const chatWidget = document.getElementById('chatWidget');
    const chatToggle = document.getElementById('chatToggle');
    const chatPanelClose = document.getElementById('chatPanelClose');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    if (window.matchMedia('(max-width: 1099px)').matches) {
        chatWidget?.classList.remove('open');
    }

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
        fetch(downloadCounterHitUrl, { cache: 'no-store', keepalive: true })
            .then(response => response.ok ? response.json() : Promise.reject())
            .then(setDownloadCount)
            .catch(() => {});
    });

    function openAppModal(appId) {
        const app = appsData.find(a => a.id === appId);
        if (!app || !appModal || !modalIcon || !modalTitle || !modalCategory || !modalDate || !modalDesc || !modalScreenshots || !modalApkDownload || !modalApkLabel || !modalDownloadStats || !modalPrdResource || !modalChangelogResource || !modalCodeResources) return;

        modalIcon.style.background = app.gradient;
        modalIcon.innerHTML = `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="${app.iconStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${app.iconSVG}</svg>`;
        modalTitle.textContent = app.title;
        modalCategory.textContent = app.category;
        modalDate.textContent = app.date;

        modalDesc.textContent = app.desc;

        modalScreenshots.innerHTML=app.screenshots.length?app.screenshots.map((url,i)=>`<img src="${url}" alt="截图${i+1}">`).join(''):'<div class="empty-shot">开发记录持续补充中</div>';
        if (app.apk) {
            modalApkDownload.href = app.apk.url;
            modalApkLabel.textContent = app.apk.label;

            modalApkDownload.hidden = false;
            modalApkDownload.style.removeProperty('display');
            modalDownloadStats.hidden = false;
            modalDownloadStats.style.removeProperty('display');
            refreshDownloadCount();
        } else {
            modalApkDownload.hidden = true;
            modalApkDownload.style.display = 'none';
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
        const resourceCopy = { ...defaultResourceCopy, ...(app.resourceCopy || {}) };
        const resourceCard=(title,href,intro,directDownload=false)=>`<div class="doc-card"><strong>${href?`<a href="${href}"${directDownload?' download':''}${directDownload?'':' target="_blank" rel="noopener"'}>${title}${directDownload?' ↓':' ↗'}</a>`:title}</strong><p>${intro}</p></div>`;
        modalPrdResource.innerHTML=resourceCard('PRD PDF',linkMap['PRD PDF'],resourceCopy.prd,app.id===0);
        modalChangelogResource.innerHTML=resourceCard('完整改动记录 TXT',linkMap['完整改动记录 TXT'],resourceCopy.changelog);
        modalCodeResources.innerHTML=[
            resourceCard('GitHub 仓库',linkMap['GitHub'],resourceCopy.github),
            resourceCard('README',linkMap['README'],resourceCopy.readme)
        ].join('');

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

    function toggleChat(open) {
        if (!chatWidget) return;
        const shouldOpen = typeof open === 'boolean' ? open : !chatWidget.classList.contains('open');
        chatWidget.classList.toggle('open', shouldOpen);
        if (shouldOpen) {
            setTimeout(() => chatInput?.focus(), 300);
        }
    }

    chatToggle?.addEventListener('click', () => toggleChat());
    chatPanelClose?.addEventListener('click', () => toggleChat(false));

    function addChatMessage(content, isUser = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${isUser ? 'user-message' : 'agent-message'}`;

        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';

        if (typeof content === 'string') {
            bubble.innerHTML = content.split('\n').map(line => `<p>${line}</p>`).join('');
        } else {
            bubble.appendChild(content);
        }

        msgDiv.appendChild(bubble);
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return msgDiv;
    }

    function addTypingIndicator() {
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        bubble.appendChild(indicator);

        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message agent-message';
        msgDiv.appendChild(bubble);
        msgDiv.id = 'typingIndicator';
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const el = document.getElementById('typingIndicator');
        if (el) el.remove();
    }

    function getAgentReply(userMsg) {
        const msg = userMsg.toLowerCase();
        const appsList = appsData.map(a => `${a.statusType === 'online' ? '✅' : '🛠️'} ${a.title} · ${a.status}`).join('\n');

        if (msg.includes('app') || msg.includes('作品') || msg.includes('哪些') || msg.includes('有什么')) {
            return `目前作品集共有 ${appsData.length} 个项目：\n${appsList}\n\n你可以点击项目卡片查看详情与当前进度。`;
        }
        if (msg.includes('技术') || msg.includes('会什么') || msg.includes('技能') || msg.includes('栈')) {
            return '我主要精通以下技术方向：\n📱 Android：Kotlin、Jetpack Compose、原生开发\n🎨 UI/UX：Figma、交互动效设计\n🧠 架构：MVVM、Clean Architecture、模块化\n☁️ 后端：Firebase、REST API\n🎯 还有产品思维，从设计到发布全流程独立完成';
        }
        if (msg.includes('合作') || msg.includes('接单') || msg.includes('联系') || msg.includes('联系方式')) {
            return '可以通过以下方式联系 Shaw：\n👤 何霄宇\n📧 767271878@qq.com\n📱 18725966519\n\n也可以打开导航中的「联系我」页面查看。';
        }
        if (msg.includes('价格') || msg.includes('报价') || msg.includes('多少钱')) {
            return '项目报价根据需求复杂度和周期而定，一般范围参考：\n💰 小型工具 App：2 - 5 万\n💰 中等功能 App：5 - 15 万\n💰 大型平台类 App：15 万起\n\n欢迎把你的需求发给我，我会给出详细的方案和报价～';
        }
        if (msg.includes('你好') || msg.includes('hi') || msg.includes('hello') || msg.includes('嗨')) {
            return '你好呀！👋 我是 Shaw 的 AI 助手。有什么想了解的吗？\n\n比如：\n• 他有哪些 App 作品？\n• 最近在学什么？\n• 可以合作吗？\n直接点击下方的快捷回复也可以。';
        }
        if (msg.includes('闹钟') || msg.includes('数学')) {
            const app = appsData[0];
            return `关于「${app.title}」：\n${app.desc}\n\n主要特点：\n${app.features.slice(0, 4).map(f => f).join('\n')}\n技术栈：${app.tags.join('、')}`;
        }
        if (msg.includes('gpt') || msg.includes('transformer') || msg.includes('手撕')) {
            const app = appsData[2];
            return `关于「${app.title}」：\n${app.desc}\n\n当前重点：\n${app.features.slice(0, 4).join('\n')}\n技术栈：${app.tags.join('、')}`;
        }
        if (msg.includes('prd') || msg.includes('rag') || msg.includes('知识库')) {
            const app = appsData[3];
            return `关于「${app.title}」：\n${app.desc}\n\n当前重点：\n${app.features.slice(0, 4).join('\n')}\n技术栈：${app.tags.join('、')}`;
        }
        if (msg.includes('最近') || msg.includes('进展') || msg.includes('学了什么')) {
            return '最近两周主要推进了四件事：\n• 完成数学闹钟迭代与云端部署\n• 系统学习 RAG、混合检索与 Agent Eval\n• 手写 Transformer 的 Attention、Residual、LayerNorm 与 FFN\n• 用脱敏案例推进分层召回、重排和离线评测\n\n详细日期和验收标准都在「AI 学习记录」页面。';
        }
        if (msg.includes('是谁') || msg.includes('Shaw') || msg.includes('shaw.cn') || msg.includes('介绍')) {
            return 'Shaw 是一名 TikTok Shop 电商产品经理，目前在系统学习 AI 产品。\n\n• 有真实电商业务与产品实践\n• 正在学习 LLM、RAG、评测、Agent 与多模态\n• 通过 Android App、AI 原型和个人站练习从定义到上线的完整过程\n\n想进一步了解，可以浏览作品集和「AI 学习记录」。';
        }

        return '好的，我已记下你的问题。\n\n建议你可以：\n1️⃣ 浏览作品集，查看项目详情\n2️⃣ 打开「AI 学习记录」查看最近进展\n3️⃣ 打开「联系我」页面获取公开联系方式\n\n邮箱：767271878@qq.com';
    }

    chatForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;

        addChatMessage(text, true);
        chatInput.value = '';

        addTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            const reply = getAgentReply(text);
            addChatMessage(reply, false);
        }, 700 + Math.random() * 600);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.classList.contains('quick-reply')) return;
        const text = e.target.textContent;
        addChatMessage(text, true);
        addTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            addChatMessage(getAgentReply(text), false);
        }, 700 + Math.random() * 600);
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
            name: '业务与场景判断', short: '业务场景', current: 72, target: 92,
            focus: '把电商经验转成可量化的 AI 机会地图。',
            recentDate: '08.25',
            recentWork: '把电商产品经验整理成 AI PM 能力地图与四个月学习主线，明确以真实业务结果作为学习终点。',
            acceptance: '能从用户痛点、数据可得性、模型边界、ROI 与风险五方面筛选场景，并给出“不做什么”的理由。'
        },
        {
            name: 'AI 产品设计', short: 'AI产品设计', current: 64, target: 90,
            focus: '补齐 Human-in-the-loop、可信交互与失败路径设计。',
            recentDate: '08.16–08.25',
            recentWork: '完成数学闹钟迭代、作品站与 AI 成长页上线，持续用真实交付检验产品闭环。',
            acceptance: '能独立交付 AI PRD、交互原型、反馈闭环、护栏指标及灰度/回滚方案，并完成真实用户验证。'
        },
        {
            name: '模型与数据理解', short: '模型与数据', current: 40, target: 80,
            focus: '已到 Transformer Block；下一步打通训练、SFT 与多模态。',
            recentDate: '08.22–08.24',
            recentWork: '手写 Self-Attention、Multi-Head、残差、LayerNorm 与 FFN，并梳理从 Transformer 到 Logits 的链路。',
            acceptance: '能讲清模型训练到推理全链路，并在 Prompt、RAG、微调和多模态方案之间做有依据的选择。'
        },
        {
            name: 'RAG / Agent 方案设计', short: 'RAG / Agent', current: 46, target: 88,
            focus: 'RAG 已有工程原型；Agent 的工具循环、状态和评测待落地。',
            recentDate: '08.13–08.25',
            recentWork: '先跑通知识切分、检索、上下文组装与回答链路，再学习混合检索、证据边界，并用脱敏案例推进分层召回与重排。',
            acceptance: '能设计并搭建带检索、工具、记忆、审批、回退与 Trace 的 Agent，复杂任务成功率达到 85%。'
        },
        {
            name: '评测与实验', short: '评测实验', current: 40, target: 86,
            focus: '已开始用 Bad Case 与离线指标优化检索，下一步扩充正式评测集。',
            recentDate: '08.18–08.25',
            recentWork: '建立 Outcome、Trajectory、Trace 的基础认知，开始用离线评测定位召回与重排问题。',
            acceptance: '能建立覆盖质量、忠实度、任务成功、延迟、成本与安全的评测体系，并用实验驱动迭代。'
        },
        {
            name: '工程落地与治理', short: '工程治理', current: 50, target: 84,
            focus: '已有 App 与网站上线能力；需补齐 CI、Secret、权限和跨仓治理。',
            recentDate: '08.16–08.25',
            recentWork: '完成 Android 构建、代码合并、云服务器部署与个人站多轮上线验证。',
            acceptance: '能与算法/工程团队共同完成架构评审、SLA、权限边界、成本预算、监控告警和上线复盘。'
        }
    ];

    const aiRecentActivities = [
        {
            date: '08.13', datetime: '2026-08-13', title: '跑通 RAG 基础链路',
            text: '完成知识切分、检索、上下文组装和模型回答；确认下一步重点在评测、召回与排序。',
            abilities: ['RAG / Agent', '评测']
        },
        {
            date: '08.16', datetime: '2026-08-16', title: '完成产品迭代与上线',
            text: '推进数学闹钟真机修复、APK 构建、代码合并与个人站部署，用真实交付检查产品闭环。',
            abilities: ['AI 产品设计', '工程落地']
        },
        {
            date: '08.18', datetime: '2026-08-18', title: '开始建立 Agent Eval 认知',
            text: '梳理 Outcome、Trajectory、Trace 与错误归因，明确评测要从产品目标和真实任务出发。',
            abilities: ['评测与实验']
        },
        {
            date: '08.21', datetime: '2026-08-21', title: '补齐搜索与 RAG 基础',
            text: '学习 Chunking、Embedding、BM25、混合检索、证据边界与 Agentic Search。',
            abilities: ['模型与数据', 'RAG / Agent']
        },
        {
            date: '08.22—08.24', datetime: '2026-08-24', title: '手写 Transformer 模块',
            text: '实现 Self-Attention、Multi-Head、Residual、LayerNorm 与 FFN，并梳理到 Logits 的链路。',
            abilities: ['模型与数据']
        },
        {
            date: '08.25', datetime: '2026-08-25', title: '校准评测与学习计划',
            text: '用脱敏样例推进分层召回、重排和离线评测，并按 AI 产品要求重新校准 18 周计划。',
            abilities: ['业务场景', '评测与实验']
        }
    ];

    const aiEvidence = [
        {
            title: 'TikTok Shop 产品实践',
            text: '具备真实电商业务、商家需求和跨团队产品经验，这是转型 AI PM 最重要的场景与落地优势。',
            tags: ['E-COMMERCE', 'PRODUCT', 'BUSINESS']
        },
        {
            title: '从零手搓 GPT',
            text: '用 PyTorch 实现字符 Tokenizer、Bigram、Causal Self-Attention、多头注意力、残差、LayerNorm 与 FFN，正在组装完整 Block。',
            tags: ['PYTORCH', 'TRANSFORMER', 'BUILD']
        },
        {
            title: '企业知识 RAG',
            text: '搭建带分层检索、证据门、引用校验、Trace 与配置治理的知识助手，并用离线 Bad Case 持续优化召回与重排。',
            tags: ['RAG', 'EVALUATION', 'PRIVATE / REDACTED']
        },
        {
            title: '5 个仓库 · 持续交付',
            text: '覆盖 AI 学习、RAG、Android App、浏览器游戏与个人站；具备从产品定义、调试迭代到 GitHub、云服务器上线的闭环。',
            tags: ['5 REPOS', 'APP', 'DEPLOY']
        }
    ];

    const aiPhases = [
        { id: 'foundation', code: 'P1', title: '模型与 AI 应用基础', label: 'P1 · 模型与 AI 应用基础', fromWeek: 1, toWeek: 3 },
        { id: 'rag', code: 'P2', title: '数据、RAG 与持续评测', label: 'P2 · 数据、RAG 与持续评测', fromWeek: 4, toWeek: 8 },
        { id: 'adaptation', code: 'P3', title: '模型适配与多模态', label: 'P3 · 模型适配与多模态', fromWeek: 9, toWeek: 11 },
        { id: 'agent', code: 'P4', title: 'Agent 可靠性与安全', label: 'P4 · Agent 可靠性与安全', fromWeek: 12, toWeek: 14 },
        { id: 'product', code: 'P5', title: '产品化、试点与作品', label: 'P5 · 产品化、试点与作品', fromWeek: 15, toWeek: 18 }
    ];

    const aiRoadmap = [
        {
            week: 1, phase: 'foundation', start: '2026-08-25', end: '2026-08-31', review: '08/28 21:00', title: 'Transformer Block 与能力基线',
            learn: ['Multi-Head Attention、Residual、LayerNorm 与 FFN 的组合', 'Block 堆叠、反向传播、Loss 与参数更新', 'AI 场景从用户任务、数据、价值、风险到评测的完整链路'],
            business: ['用价值、可行动性、数据/技术可行性、ROI 与风险给商家 Copilot 场景打分', '记录现有工作流基线，并明确至少一个“不该用 AI”的场景'],
            output: '双 Transformer Block 代码 + 20 道脱敏基准题 + 场景评分卡、现状基线与风险台账。',
            acceptance: '代码前向/反向通过并能讲清每层职责；20 道题可重复运行；能用证据选出 1 个场景、放弃 1 个场景，并定义价值与护栏指标。'
        },
        {
            week: 2, phase: 'foundation', start: '2026-09-01', end: '2026-09-07', review: '09/04 21:00', title: 'Mini GPT 限时实验：理解训练与生成',
            learn: ['Tokenizer、Embedding、位置编码与完整 Decoder Stack', 'LM Head、Cross Entropy、训练循环与采样', 'Checkpoint、过拟合、验证集与 Loss 曲线'],
            business: ['解释领域语料、词表、上下文和采样如何影响模型行为', '形成训练成本、推理成本、质量与失败边界的产品判断'],
            output: '可训练、保存和生成文本的 Mini GPT + Loss 曲线 + 模型行为与成本说明。',
            acceptance: '限定一周内完成；Loss 与验证结果可解释、Checkpoint 可恢复；用 3 组样例说明能力边界，并讲清为何真实产品通常不从零训练模型。'
        },
        {
            week: 3, phase: 'foundation', start: '2026-09-08', end: '2026-09-14', review: '09/11 21:00', title: 'Prompt、结构化输出与工具调用',
            learn: ['System Prompt、上下文工程与能力边界', 'JSON Schema、Function Calling、错误恢复与 Prompt Injection 基础', '模型路由、缓存、重试和成本控制'],
            business: ['为商品文案、问题归类、运营建议三条流程写 AI PRD', '设计不确定性提示、编辑/撤销、人工确认、反馈入口与失败回退'],
            output: '电商 Copilot v0 + AI PRD + 三条流程的 Trace 与失败路径清单。',
            acceptance: '三条流程端到端可运行；结构化输出成功率 ≥90%；至少测试 10 条失败/注入路径；每次请求记录质量、延迟和估算成本。'
        },
        {
            week: 4, phase: 'rag', start: '2026-09-15', end: '2026-09-21', review: '09/18 21:00', title: 'RAG 正式基线、数据规范与错误分类',
            learn: ['文档级与 Chunk 级分层检索', '版本、Metadata、Top-k、证据组合与数据规格', '检索、生成、引用、拒答和错误归因'],
            business: ['以脱敏政策/帮助文档验证知识助手价值', '记录数据来源、权限、隐私/版权、更新责任人与保留策略'],
            output: '≥50 题黄金集 + 标注规范与数据说明 + 系统基线报告 + 失败样本分类。',
            acceptance: '黄金集有答案、证据、场景切片和双人抽样复核；记录质量、延迟和成本基线；形成继续、调整或停止的阶段结论。'
        },
        {
            week: 5, phase: 'rag', start: '2026-09-22', end: '2026-09-28', review: '09/25 21:00', title: '混合检索与 Rerank',
            learn: ['Dense + BM25 混合检索', 'Query Rewrite 与 Metadata Filter', 'Cross-encoder Rerank 与消融实验'],
            business: ['跨站点、国家和类目政策的精确命中', '分析查准率与查全率的业务取舍'],
            output: 'Baseline / Hybrid / Rerank 三组配置对比报告。',
            acceptance: '先根据 W4 基线预注册目标；用消融实验说明各模块增益，并给出质量、延迟、成本三者的配置决策。'
        },
        {
            week: 6, phase: 'rag', start: '2026-09-29', end: '2026-10-05', review: '10/02 21:00', title: 'RAG 评测、幻觉与可信回答',
            learn: ['Context Precision / Recall、Faithfulness、Relevance', '引用校验、置信度与拒答策略', '人工评审、LLM Judge 校准、Trace 与回归测试'],
            business: ['政策问答中的过期、冲突、无依据和敏感问题处理', '把错误分为数据、检索、生成、交互四层'],
            output: '≥50 题自动评测集 + 评测脚本 + 失败样本看板。',
            acceptance: '自动 grader 与人工抽样的一致性可解释；引用和拒答按场景切片评估；每次修改可一键回归并输出质量、延迟、成本对比。'
        },
        {
            week: 7, phase: 'rag', start: '2026-10-06', end: '2026-10-12', review: '10/09 21:00', title: '知识工程与数据管线',
            learn: ['PDF、OCR、表格与版面解析', '版本、去重、增量索引和数据血缘', '权限、PII、版权、保留/删除与知识治理'],
            business: ['多站点政策频繁变化时保证最新与权限隔离', '定义数据 Owner、更新 SLA 与异常更新 Runbook'],
            output: '支持新增、更新、下线和版本追溯的增量索引管线 + 数据治理清单。',
            acceptance: '新增文档可在目标 SLA 内检索；重复内容可去重、旧版本可追溯、越权查询被阻断；完成一次数据异常处置演练。'
        },
        {
            week: 8, phase: 'rag', start: '2026-10-13', end: '2026-10-19', review: '10/16 21:00', title: 'RAG 产品化里程碑',
            learn: ['流式 UX、追问、引用和反馈闭环', '缓存、降级、监控与成本预算', '离线评测、线上行为与业务指标'],
            business: ['自助解决政策问题，复杂问题无缝转人工', '定义满意度、解决率、转人工率和节省时长'],
            output: 'TikTok Shop 政策 Copilot Demo + PRD + 评测报告。',
            acceptance: '完成 5 位目标用户测试，报告任务完成率、信任度、转人工体验、采用意愿和单位成本；结合质量与延迟基线做 Go / Iterate / Stop 决策。'
        },
        {
            week: 9, phase: 'adaptation', start: '2026-10-20', end: '2026-10-26', review: '10/23 21:00', title: '预训练认知、SFT 与 LoRA',
            learn: ['预训练、继续预训练和 SFT 的目标差异', 'Instruction Data 设计、清洗与划分', 'PEFT、LoRA / QLoRA 及何时不该微调'],
            business: ['统一商家客服语气、意图分类和回复格式', '先建立 Prompt / RAG / 微调选择决策树，再决定是否训练'],
            output: '模型选择决策 Memo + 50–100 条高质量指令样本；有必要时再做小模型 LoRA 实验。',
            acceptance: '用证据说明是否需要微调；若训练则过程可复现并与基线盲评 ≥50 条；若不训练，也要给出替代方案和成本判断。'
        },
        {
            week: 10, phase: 'adaptation', start: '2026-10-27', end: '2026-11-02', review: '10/30 21:00', title: '后训练、DPO 与模型评测',
            learn: ['RLHF / RLAIF、Reward Model、DPO 的原理与边界', 'Pairwise Preference Data', '能力、安全、偏差与稳定性评测'],
            business: ['让运营建议更有帮助、合规且不过度承诺', '定义偏好标注规则、受影响人群与冲突处理'],
            output: '偏好数据规范 + 盲评实验 + 模型/系统卡与风险台账；DPO 实现作为可选项。',
            acceptance: '能解释 RLHF / DPO 的适用边界；完成 20 条红队用例；模型/系统卡记录适用范围、限制、责任人和残余风险。'
        },
        {
            week: 11, phase: 'adaptation', start: '2026-11-03', end: '2026-11-09', review: '11/06 21:00', title: '多模态与 Multimodal RAG',
            learn: ['Vision Encoder、CLIP 与 VLM 基础', 'OCR、版面理解与图文 Embedding', '多模态检索、Grounding 与评测'],
            business: ['商品主图违规识别、信息缺失检查和卖点生成', '将图片证据与政策文本联合检索'],
            output: '商品图合规检查 + 卖点生成 Demo，支持证据定位。',
            acceptance: '≥50 张公开或合成图片测试集；按图片质量、语言和类目切片；输出证据区域与失败解释，并评估隐私、可访问性、延迟和误判处置。'
        },
        {
            week: 12, phase: 'agent', start: '2026-11-10', end: '2026-11-16', review: '11/13 21:00', title: 'Agent 基础：循环、状态、记忆与工具',
            learn: ['Observe → Plan → Act → Reflect', 'Workflow 与 Agent 的边界', '短期状态、长期记忆、工具契约与 MCP'],
            business: ['输入店铺问题，自动查政策、分析指标并给动作建议', '先判断固定 Workflow 是否足够，并对工具动作分级、设置人工控制点'],
            output: '商家运营 Agent v1：检索、计算、数据查询、报告四类工具。',
            acceptance: '10 个脚本任务多次运行并报告一致性；每一步有 Trace；停止条件、参数校验、超时、重试、失败回退和高风险确认有效。'
        },
        {
            week: 13, phase: 'agent', start: '2026-11-17', end: '2026-11-23', review: '11/20 21:00', title: '高级 Agent：规划、协作与人工审批',
            learn: ['Task Decomposition、Planning 与 Replanning', '单 Agent 基线与多 Agent 的收益/代价', '权限、审批、持久记忆和中断恢复'],
            business: ['选品研究与活动报名：搜集、分析、审核、执行', '先做单 Agent 基线；只有质量或维护性证明确有收益才拆分角色'],
            output: '带审批和断点恢复的单 Agent 链路；多 Agent 作为有证据时的扩展。',
            acceptance: '10 个复杂任务多次运行；高风险动作未经确认 0 次执行；中断后可继续；若使用多 Agent，必须证明相对基线的净收益。'
        },
        {
            week: 14, phase: 'agent', start: '2026-11-24', end: '2026-11-30', review: '11/27 21:00', title: 'Agent 评测、可观测性与安全',
            learn: ['Task Success、Trajectory Eval 与错误归因', 'Prompt Injection、数据泄露和最小权限', '延迟、成本、并发、缓存与降级'],
            business: ['确保运营 Agent 可控、可解释、可运营', '为线上故障定义告警、止损和人工接管'],
            output: 'Agent 评测台 + Trace 看板 + 威胁模型、安全攻击集、事故响应与预算控制。',
            acceptance: '≥30 个代表性任务并多次运行，报告 pass@1、一致性和错误分层；高风险写操作 100% 人工审批且无未授权执行；展示 p95 与单任务成本。'
        },
        {
            week: 15, phase: 'product', start: '2026-12-01', end: '2026-12-07', review: '12/04 21:00', title: '生产就绪评审与 Agent 架构',
            learn: ['模型网关、工具注册、身份与权限', 'Build / Buy、模型供应商、容量与单位成本', '版本、可观测性、SLO、灰度与灾备'],
            business: ['从单点 Demo 走向可运营的业务能力', '明确自建、采购、混合与可迁移方案边界'],
            output: '生产架构与 Build / Buy 决策 + API / 工具契约 + 上线及事故 Runbook。',
            acceptance: '完成生产就绪评审；关键组件有 SLO 与 Owner；完成一次灰度、降级或回滚演练，并给出成本上限和供应商迁移方案。'
        },
        {
            week: 16, phase: 'product', start: '2026-12-08', end: '2026-12-14', review: '12/11 21:00', title: 'AI 产品策略、实验与 ROI',
            learn: ['汇总用户证据并重构任务，而不是从本周才开始用户发现', 'Human-AI UX、信任、可控性、反馈与采用', '北极星指标、A/B、ROI 敏感性与发布策略'],
            business: ['从点状工具升级为商家经营决策助手', '用现状基线量化节省时长、解决率、GMV 机会、风险成本与净价值'],
            output: '商家经营 Copilot PRD + 指标树 + 实验、ROI 敏感性、发布与采用计划。',
            acceptance: '汇总前期访谈/测试证据；定义北极星和护栏指标；量化收益/成本与停止条件；明确灰度、回滚和组织采用方案。'
        },
        {
            week: 17, phase: 'product', start: '2026-12-15', end: '2026-12-20', review: '12/18 21:00', title: '毕业作品：端到端交付',
            learn: ['系统取舍、指标复盘与失败修正', '产品、模型、评测、工程材料的统一叙事', '面向管理者与技术团队的双版本表达'],
            business: ['证明自己能定义场景、选技术、搭系统、做评测并推动落地', '邀请目标用户、算法和产品同行评审'],
            output: '聚焦一个高价值任务的在线 Demo、源码、架构图、PRD、评测报告与案例页。',
            acceptance: '完成真实目标用户试点并保留脱敏运行日志；核心指标与原基线对比；邀请 3 位用户/同行评审；每个问题都有结论或后续计划。'
        },
        {
            week: 18, phase: 'product', start: '2026-12-21', end: '2026-12-25', review: '12/25 21:00', title: '发布、路演与下一程',
            learn: ['AI PM Portfolio 与面试叙事', '10 分钟路演：Why / What / How / Impact', '建立下一季度学习飞轮'],
            business: ['把四个月成果转成可公开验证的职业转型证据', '制定入岗 30 / 60 / 90 天计划'],
            output: '公开作品集、Demo 视频、10 分钟路演、失败实验复盘与下一季度 OKR。',
            acceptance: '公开前完成脱敏与安全检查；能讲清假设、关键取舍、失败证据、业务影响和遗留风险；完成模拟面试与 30 / 60 / 90 天计划。'
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
                            <div class="ai-recent-tags">${item.abilities.map(ability => `<span>${ability}</span>`).join('')}</div>
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

    function getCurrentAiWeek() {
        const now = new Date();
        return aiRoadmap.find(item => now >= new Date(`${item.start}T00:00:00`) && now <= new Date(`${item.end}T23:59:59`))?.week || null;
    }

    function renderAiLearningPhases() {
        const list = document.getElementById('aiLearningPhases');
        const progress = document.getElementById('aiLearningTimeProgress');
        const fill = document.getElementById('aiLearningTimeFill');
        const text = document.getElementById('aiLearningTimeText');
        if (!list || !progress || !fill || !text) return;

        const currentWeek = getCurrentAiWeek();
        const start = new Date(`${aiRoadmap[0].start}T00:00:00`);
        const end = new Date(`${aiRoadmap[aiRoadmap.length - 1].end}T23:59:59`);
        const now = new Date();
        const dayMs = 24 * 60 * 60 * 1000;
        const totalDays = Math.floor((end - start) / dayMs) + 1;
        const elapsedDays = now < start ? 0 : now > end ? totalDays : Math.floor((now - start) / dayMs) + 1;
        const percent = Math.max(0, Math.min(100, elapsedDays / totalDays * 100));
        const currentPhase = aiPhases.find(phase => currentWeek && currentWeek >= phase.fromWeek && currentWeek <= phase.toWeek);

        progress.style.setProperty('--learning-progress', `${percent}%`);
        progress.setAttribute('aria-valuenow', String(Math.round(percent)));
        text.textContent = currentPhase
            ? `第 ${elapsedDays} / ${totalDays} 天 · 当前 ${currentPhase.code}`
            : now < start ? '计划尚未开始' : '计划周期已结束';

        list.innerHTML = aiPhases.map(phase => {
            const firstWeek = aiRoadmap.find(item => item.week === phase.fromWeek);
            const lastWeek = aiRoadmap.find(item => item.week === phase.toWeek);
            const status = currentWeek && currentWeek >= phase.fromWeek && currentWeek <= phase.toWeek
                ? 'active'
                : currentWeek && currentWeek > phase.toWeek ? 'completed' : 'upcoming';
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
        filters.innerHTML = [{ id: 'all', label: '全部 18 周' }, ...aiPhases].map((phase, index) => `<button type="button" class="ai-phase-filter${index === 0 ? ' active' : ''}" data-phase="${phase.id}">${phase.label}</button>`).join('');
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
                    <div class="ai-week-deliverable"><div><span>可交付物</span><strong>${item.output}</strong></div></div>
                    <div class="ai-week-acceptance"><div><span>周五 21:00 · 验收标准</span><strong>${item.acceptance}</strong></div><label class="ai-week-check"><input type="checkbox" data-week-complete="${item.week}"> 本周达标</label></div>
                </div>
            </details>`;
        }).join('');

        filters.addEventListener('click', event => {
            const button = event.target.closest('.ai-phase-filter');
            if (!button) return;
            filters.querySelectorAll('.ai-phase-filter').forEach(item => item.classList.toggle('active', item === button));
            list.querySelectorAll('.ai-week-card').forEach(card => { card.hidden = button.dataset.phase !== 'all' && card.dataset.phase !== button.dataset.phase; });
        });

        const storageKey = 'shaw-ai-roadmap-progress-v1';
        let completed = [];
        try { completed = JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch (error) { completed = []; }
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
        const node = document.getElementById('nextCheckinText');
        if (!node) return;
        const now = new Date();
        const next = new Date(now);
        let days = (5 - next.getDay() + 7) % 7;
        if (days === 0 && next.getHours() >= 21) days = 7;
        next.setDate(next.getDate() + days);
        next.setHours(21, 0, 0, 0);
        node.textContent = `${next.getMonth() + 1}月${next.getDate()}日 周五 21:00 · Demo、数据、失败样本与下周唯一目标。`;
    }

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
