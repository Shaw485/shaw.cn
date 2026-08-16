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
        }
    ];

    const projectDocs = [
      { prd:[['问题','普通闹钟容易被顺手关闭，用户并没有真正清醒。'],['方案','响铃后生成 a×b+c×d 数学题，答对才能结束。'],['体验','单闹钟、滚轮选时、三种铃声、锁屏提醒与开机恢复。'],['技术','Kotlin、Jetpack Compose、AlarmManager、DataStore。']],
        process:[['定义闭环','先跑通设置—触发—答题—关闭。'],['系统适配','验证精确闹钟、全屏通知、前台服务和开机恢复。'],['交互打磨','统一黑橙视觉与三行滚轮选时。'],['可靠性','处理跨日、重启和超时兜底。']],
        changelog:[['需求成型','确定单闹钟与数学题解锁机制。'],['原生实现','完成 Compose 界面、铃声与状态管理。'],['系统适配','补齐 Android 13/14 权限。'],['稳定性','增加开机恢复、跨日计算与异常回流。']],
        links:[['GitHub','https://github.com/Shaw485/math_alarm'],['README','https://github.com/Shaw485/math_alarm/blob/main/README.md'],['PRD PDF','https://github.com/Shaw485/shaw.cn/blob/main/%E6%9E%81%E7%AE%80%E6%95%B0%E5%AD%A6%E9%A2%98%E9%97%B9%E9%92%9F%20App%20PRD.pdf'],['完整改动记录 TXT','https://github.com/Shaw485/shaw.cn/blob/main/%E6%94%B9%E5%8A%A8%E8%AE%B0%E5%BD%95.txt']]},
      { prd:[['定位','黑白手绘风的平台跳跃小游戏。'],['玩法','移动、跳跃、穿越平台并找到出口。'],['视觉','粗线条、空心小草和圆润皮蛋角色。'],['架构','Godot 4.x + JSON 数据驱动关卡，并维护网页预览。']],
        process:[['可玩原型','完成移动、跳跃、碰撞与出口。'],['关卡系统','加入主菜单、选关和 JSON 加载。'],['视觉统一','重做角色、平台、门、小草与 HUD。'],['动作反馈','增加待机、行走、跳跃姿态。'],['持续修错','回归缓存、按钮、出生点和平台高度。']],
        changelog:[['v1–v4','首个可玩版本，并修复下一关循环和 JSON 缓存。'],['v5–v20','补齐完成页、加载流程、调试能力与跳跃修复。'],['v21–v25','重做 HUD、角色、平台和出口视觉。'],['v26–v30','加入跳跃摆臂、暂停菜单并调整手感。'],['v31–v33','增加待机/行走/跳跃动画与草地。']],links:[['完整改动记录 TXT','https://github.com/Shaw485/shaw.cn/blob/main/brain-egg-changelog.txt']]}
    ];
    appsData.forEach((app,i)=>Object.assign(app,projectDocs[i]));

    const worksCount = document.querySelector('.works-count');
    if (worksCount) worksCount.textContent = `(${appsData.length})`;

    const appCardFields = [
        { status: '已上线', statusType: 'online', publishDate: '2026/3/14', shortDesc: '必须答对 a×b+c×d 格式数学题才能关闹钟，a/b/c/d 严格限定在 3–9；纯黑 + 橙色极简风，清晨/风来/钢琴三铃声，支持 Android 14+ 精确闹钟。', likes: 2, wants: 8, comments: 0 },
        { status: '开发中', statusType: 'wip', publishDate: '2026/8/15', shortDesc: '黑白手绘风平台跳跃游戏。操控可爱的皮蛋角色穿越草地与台阶，支持选关、移动、跳跃、暂停和重来。', likes: 0, wants: 0, comments: 0 }
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
                <h3 class="work-title">「${app.shortName}」${app.title.replace(app.shortName, '').trim()}</h3>
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
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

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
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        updateActiveNavLink();
    }

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
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
        if (Number.isFinite(value)) modalDownloadCount.textContent = value.toLocaleString('zh-CN');
    }

    async function refreshDownloadCount() {
        try {
            const response = await fetch(downloadCounterGetUrl, { cache: 'no-store' });
            if (!response.ok) throw new Error('counter unavailable');
            setDownloadCount(await response.json());
        } catch (error) {
            modalDownloadCount.textContent = '—';
        }
    }

    modalApkDownload.addEventListener('click', () => {
        fetch(downloadCounterHitUrl, { cache: 'no-store', keepalive: true })
            .then(response => response.ok ? response.json() : Promise.reject())
            .then(setDownloadCount)
            .catch(() => {});
    });

    function openAppModal(appId) {
        const app = appsData.find(a => a.id === appId);
        if (!app) return;

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
            modalDownloadStats.hidden = false;
            refreshDownloadCount();
        } else {
            modalApkDownload.hidden = true;
            modalDownloadStats.hidden = true;
        }
        const linkMap=Object.fromEntries(app.links.map(x=>[x[0],x[1]]));
        const resourceCard=(title,href,intro)=>`<div class="doc-card"><strong>${href?`<a href="${href}" target="_blank" rel="noopener">${title} ↗</a>`:title}</strong><p>${intro}</p></div>`;
        modalPrdResource.innerHTML=resourceCard('PRD PDF',linkMap['PRD PDF'],app.id===0?'记录产品目标、核心使用流程、数学题解锁规则与系统权限方案，适合快速了解产品为什么这样设计。':'PRD 正在整理中，完成后会在这里公开产品目标、玩法规则与关卡设计。');
        modalChangelogResource.innerHTML=resourceCard('完整改动记录 TXT',linkMap['完整改动记录 TXT'],app.id===0?'按开发阶段记录功能实现、Android 系统适配和稳定性修复，能看到产品从需求到可用版本的演进过程。':'记录从首个可玩原型到角色动画、关卡系统和视觉重做的完整迭代过程。');
        modalCodeResources.innerHTML=[
            resourceCard('GitHub 仓库',linkMap['GitHub'],app.id===0?'查看 Android 项目源码、目录结构与最新提交。':'源码仓库正在整理中，公开后会在这里提供完整项目。'),
            resourceCard('README',linkMap['README'],app.id===0?'快速了解项目定位、主要功能、运行方式与开发说明。':'README 正在整理中，将补充玩法说明、运行方式和开发记录。')
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
        } else if (e.key === 'Escape' && appModal.classList.contains('open')) {
            closeAppModal();
        }
    });

    function toggleChat(open) {
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
        const appsList = appsData.map(a => `📱 ${a.title}`).join('\n');

        if (msg.includes('app') || msg.includes('作品') || msg.includes('哪些') || msg.includes('有什么')) {
            return `目前已发布 ${appsData.length} 款 App：\n${appsList}\n\n你可以点击页面上的图标查看每款的详情哦～`;
        }
        if (msg.includes('技术') || msg.includes('会什么') || msg.includes('技能') || msg.includes('栈')) {
            return '我主要精通以下技术方向：\n📱 Android：Kotlin、Jetpack Compose、原生开发\n🎨 UI/UX：Figma、交互动效设计\n🧠 架构：MVVM、Clean Architecture、模块化\n☁️ 后端：Firebase、REST API\n🎯 还有产品思维，从设计到发布全流程独立完成';
        }
        if (msg.includes('合作') || msg.includes('接单') || msg.includes('联系') || msg.includes('联系方式')) {
            return '欢迎合作！可以通过以下方式联系我：\n📧 邮箱：hello@example.com\n💬 也可以在页面底部的「联系我」表单留言\n\n合作类型包括：\n• 定制 Android App 开发\n• 技术咨询和架构设计\n• UI/UX 设计服务\n期待与你合作！✨';
        }
        if (msg.includes('价格') || msg.includes('报价') || msg.includes('多少钱')) {
            return '项目报价根据需求复杂度和周期而定，一般范围参考：\n💰 小型工具 App：2 - 5 万\n💰 中等功能 App：5 - 15 万\n💰 大型平台类 App：15 万起\n\n欢迎把你的需求发给我，我会给出详细的方案和报价～';
        }
        if (msg.includes('你好') || msg.includes('hi') || msg.includes('hello') || msg.includes('嗨')) {
            return '你好呀！👋 我是 Shaw 的 AI 助手，个人官网即将上线 shaw.cn。有什么想了解的吗？\n\n比如：\n• 他有哪些 App 作品？\n• 技术能力怎么样？\n• 可以合作吗？\n直接点击下方的快捷回复也可以哦～';
        }
        if (msg.includes('闹钟') || msg.includes('数学')) {
            const app = appsData[0];
            return `关于「${app.title}」：\n${app.desc}\n\n主要特点：\n${app.features.slice(0, 4).map(f => f).join('\n')}\n技术栈：${app.tags.join('、')}`;
        }
        if (msg.includes('是谁') || msg.includes('Shaw') || msg.includes('shaw.cn') || msg.includes('介绍')) {
            return 'Shaw 是一名有 5 年经验的独立 Android 开发者 🧑‍💻\n\n• 累计发布 8 款 App，总用户超 10 万\n• 主打简洁优雅的设计风格，注重细节\n• 从产品设计→开发→发布→运营全流程独立完成\n• 信奉「好产品自己会说话」\n\n个人官网：shaw.cn（即将上线）\n想进一步了解，可以浏览上面的 App 作品集～';
        }

        return '好的，我已记下你的问题～ 📝\n\n建议你可以：\n1️⃣ 浏览上方的 App 图标，查看作品详情\n2️⃣ 使用快捷回复提问更精准的问题\n3️⃣ 或在页面底部的联系表单留言\n\n如果你想和开发者本人直接沟通，欢迎发邮件到 shaw@shaw.cn 📧';
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

    contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="loading-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
            </svg>
            发送中...
        `;
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            formSuccess.classList.add('show');
            contactForm.reset();
            setTimeout(() => formSuccess.classList.remove('show'), 4000);
        }, 1500);
    });

    const style = document.createElement('style');
    style.textContent = `
        .loading-spinner { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);

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
