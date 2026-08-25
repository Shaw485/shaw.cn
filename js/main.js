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
        links:[['GitHub','https://github.com/Shaw485/math_alarm'],['README','https://github.com/Shaw485/math_alarm/blob/main/README.md'],['PRD PDF','/%E6%9E%81%E7%AE%80%E6%95%B0%E5%AD%A6%E9%A2%98%E9%97%B9%E9%92%9F%20App%20PRD.pdf'],['完整改动记录 TXT','https://github.com/Shaw485/shaw.cn/blob/main/%E6%94%B9%E5%8A%A8%E8%AE%B0%E5%BD%95.txt']]},
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
        const resourceCard=(title,href,intro,directDownload=false)=>`<div class="doc-card"><strong>${href?`<a href="${href}"${directDownload?' download':''}${directDownload?'':' target="_blank" rel="noopener"'}>${title}${directDownload?' ↓':' ↗'}</a>`:title}</strong><p>${intro}</p></div>`;
        modalPrdResource.innerHTML=resourceCard('PRD PDF',linkMap['PRD PDF'],app.id===0?'记录产品目标、核心使用流程、数学题解锁规则与系统权限方案，适合快速了解产品为什么这样设计。':'PRD 正在整理中，完成后会在这里公开产品目标、玩法规则与关卡设计。',app.id===0);
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

    /* AI Growth Journey -------------------------------------------------- */
    const aiAbilities = [
        {
            name: '业务与场景判断', short: '业务场景', current: 84, target: 92,
            focus: '把电商经验转成可量化的 AI 机会地图。',
            acceptance: '能从用户痛点、数据可得性、模型边界、ROI 与风险五方面筛选场景，并给出“不做什么”的理由。'
        },
        {
            name: 'AI 产品设计', short: 'AI产品设计', current: 78, target: 90,
            focus: '补齐 Human-in-the-loop、可信交互与失败路径设计。',
            acceptance: '能独立交付 AI PRD、交互原型、反馈闭环、护栏指标及灰度/回滚方案，并完成真实用户验证。'
        },
        {
            name: '模型与数据理解', short: '模型与数据', current: 61, target: 80,
            focus: '已到 Transformer Block；下一步打通训练、SFT 与多模态。',
            acceptance: '能讲清模型训练到推理全链路，并在 Prompt、RAG、微调和多模态方案之间做有依据的选择。'
        },
        {
            name: 'RAG / Agent 方案设计', short: 'RAG / Agent', current: 58, target: 88,
            focus: 'RAG 已有工程原型；Agent 的工具循环、状态和评测待落地。',
            acceptance: '能设计并搭建带检索、工具、记忆、审批、回退与 Trace 的 Agent，复杂任务成功率达到 85%。'
        },
        {
            name: '评测与实验', short: '评测实验', current: 59, target: 86,
            focus: '已开始用 Bad Case 与离线指标优化检索，下一步扩充正式评测集。',
            acceptance: '能建立覆盖质量、忠实度、任务成功、延迟、成本与安全的评测体系，并用实验驱动迭代。'
        },
        {
            name: '工程落地与治理', short: '工程治理', current: 64, target: 84,
            focus: '已有 App 与网站上线能力；需补齐 CI、Secret、权限和跨仓治理。',
            acceptance: '能与算法/工程团队共同完成架构评审、SLA、权限边界、成本预算、监控告警和上线复盘。'
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
        { id: 'foundation', label: 'P1 · 模型与应用底座' },
        { id: 'rag', label: 'P2 · 生产级 RAG' },
        { id: 'adaptation', label: 'P3 · 模型适配与多模态' },
        { id: 'agent', label: 'P4 · Agent 系统' },
        { id: 'product', label: 'P5 · AI 产品化与毕业项目' }
    ];

    const aiRoadmap = [
        {
            week: 1, phase: 'foundation', start: '2026-08-25', end: '2026-08-31', review: '08/28 21:00', title: 'Transformer Block 与能力基线',
            learn: ['Multi-Head Attention、Residual、LayerNorm 与 FFN 的组合', 'Block 堆叠、反向传播、Loss 与参数更新', 'AI 产品从场景、数据、模型到评测的完整链路'],
            business: ['绘制 TikTok Shop 商家 Copilot 机会地图', '把已有 RAG Bad Case 整理成首批可重复评测题'],
            output: '双 Transformer Block 可运行代码 + 20 道脱敏电商/RAG 基准题 + 能力基线。',
            acceptance: '双 Block 前向与反向传播通过；能讲清张量 Shape 和每层职责；20 道题可重复运行并记录首轮结果。'
        },
        {
            week: 2, phase: 'foundation', start: '2026-09-01', end: '2026-09-07', review: '09/04 21:00', title: '完整 Mini GPT：训练与生成',
            learn: ['Tokenizer、Embedding、位置编码与完整 Decoder Stack', 'LM Head、Cross Entropy、训练循环与采样', 'Checkpoint、过拟合、验证集与 Loss 曲线'],
            business: ['解释领域语料、词表和上下文如何影响生成质量', '识别训练成本、推理成本与效果之间的关系'],
            output: '可训练、保存、加载并生成文本的 Mini GPT + Loss 曲线 + 学习记录。',
            acceptance: '训练 Loss 明显下降且验证集指标可解释；Checkpoint 可恢复；展示 3 组生成样例并分析失败原因。'
        },
        {
            week: 3, phase: 'foundation', start: '2026-09-08', end: '2026-09-14', review: '09/11 21:00', title: 'Prompt、结构化输出与工具调用',
            learn: ['System Prompt 与上下文工程', 'JSON Schema、Function Calling 与错误恢复', '模型路由、缓存、重试和成本控制'],
            business: ['商品文案、问题归类、运营建议三条 Copilot 流程', '定义每条流程的输入、输出与失败路径'],
            output: '电商 Copilot v0：三条流程均可演示并记录 Trace。',
            acceptance: '三条流程端到端可运行；结构化输出成功率 ≥90%；每次请求记录延迟与估算成本。'
        },
        {
            week: 4, phase: 'foundation', start: '2026-09-15', end: '2026-09-21', review: '09/18 21:00', title: 'RAG 正式基线与错误分类',
            learn: ['文档级与 Chunk 级分层检索', '版本、Metadata、Top-k 与证据组合', '检索、生成、引用、拒答和错误归因'],
            business: ['以脱敏政策/帮助文档验证知识助手价值', '定义过期、冲突、部分证据和无答案场景'],
            output: '≥50 题正式黄金集 + 当前系统基线报告 + 失败样本分类。',
            acceptance: '黄金集有标准答案和证据；记录 Recall@k、Evidence Coverage、正确率与延迟；失败可归因到数据/召回/排序/生成。'
        },
        {
            week: 5, phase: 'rag', start: '2026-09-22', end: '2026-09-28', review: '09/25 21:00', title: '混合检索与 Rerank',
            learn: ['Dense + BM25 混合检索', 'Query Rewrite 与 Metadata Filter', 'Cross-encoder Rerank 与消融实验'],
            business: ['跨站点、国家和类目政策的精确命中', '分析查准率与查全率的业务取舍'],
            output: 'Baseline / Hybrid / Rerank 三组配置对比报告。',
            acceptance: '黄金集 Recall@5 相对基线提升 ≥15 个百分点；能解释质量、延迟、成本三者的取舍。'
        },
        {
            week: 6, phase: 'rag', start: '2026-09-29', end: '2026-10-05', review: '10/02 21:00', title: 'RAG 评测、幻觉与可信回答',
            learn: ['Context Precision / Recall、Faithfulness、Relevance', '引用校验、置信度与拒答策略', 'Trace、回归测试与错误分类'],
            business: ['政策问答中的过期、冲突、无依据和敏感问题处理', '把错误分为数据、检索、生成、交互四层'],
            output: '≥50 题自动评测集 + 评测脚本 + 失败样本看板。',
            acceptance: '引用覆盖率 ≥90%；无依据问题拒答率 ≥85%；每次修改可一键回归并输出对比。'
        },
        {
            week: 7, phase: 'rag', start: '2026-10-06', end: '2026-10-12', review: '10/09 21:00', title: '知识工程与数据管线',
            learn: ['PDF、OCR、表格与版面解析', '版本、去重、增量索引和数据血缘', '权限、时效性与知识治理'],
            business: ['多站点政策频繁变化时保证最新与权限隔离', '定义知识更新 SLA 与责任人'],
            output: '支持新增、更新、下线和版本追溯的增量索引管线。',
            acceptance: '新增文档 5 分钟内可检索；重复内容可去重；旧版本可追溯；越权查询被阻断。'
        },
        {
            week: 8, phase: 'rag', start: '2026-10-13', end: '2026-10-19', review: '10/16 21:00', title: 'RAG 产品化里程碑',
            learn: ['流式 UX、追问、引用和反馈闭环', '缓存、降级、监控与成本预算', '离线评测、线上行为与业务指标'],
            business: ['自助解决政策问题，复杂问题无缝转人工', '定义满意度、解决率、转人工率和节省时长'],
            output: 'TikTok Shop 政策 Copilot Demo + PRD + 评测报告。',
            acceptance: '核心题正确率 ≥80%；引用覆盖 ≥90%；p95 ≤4 秒；完成 5 位目标用户可用性测试。'
        },
        {
            week: 9, phase: 'adaptation', start: '2026-10-20', end: '2026-10-26', review: '10/23 21:00', title: '预训练认知、SFT 与 LoRA',
            learn: ['预训练、继续预训练和 SFT 的目标差异', 'Instruction Data 设计、清洗与划分', 'PEFT、LoRA / QLoRA 及何时不该微调'],
            business: ['统一商家客服语气、意图分类和回复格式', '建立 Prompt / RAG / 微调选择决策树'],
            output: '300–500 条电商指令数据 + 小模型 LoRA 适配实验。',
            acceptance: '训练过程可复现；与基线盲评 ≥50 条；清楚说明为何此任务适合或不适合微调。'
        },
        {
            week: 10, phase: 'adaptation', start: '2026-10-27', end: '2026-11-02', review: '10/30 21:00', title: '后训练、DPO 与模型评测',
            learn: ['RLHF / RLAIF、Reward Model、DPO 的原理与边界', 'Pairwise Preference Data', '能力、安全、偏差与稳定性评测'],
            business: ['让运营建议更有帮助、合规且不过度承诺', '定义偏好标注规则和冲突处理'],
            output: '≥100 对偏好数据 + 轻量 DPO / 偏好排序实验 + 模型卡。',
            acceptance: '盲评胜率较基线提升；完成 20 条红队用例；模型卡记录适用范围、限制与残余风险。'
        },
        {
            week: 11, phase: 'adaptation', start: '2026-11-03', end: '2026-11-09', review: '11/06 21:00', title: '多模态与 Multimodal RAG',
            learn: ['Vision Encoder、CLIP 与 VLM 基础', 'OCR、版面理解与图文 Embedding', '多模态检索、Grounding 与评测'],
            business: ['商品主图违规识别、信息缺失检查和卖点生成', '将图片证据与政策文本联合检索'],
            output: '商品图合规检查 + 卖点生成 Demo，支持证据定位。',
            acceptance: '≥50 张图片测试集；关键违规召回率 ≥80%；输出带证据区域/理由；失败样本完成分类。'
        },
        {
            week: 12, phase: 'agent', start: '2026-11-10', end: '2026-11-16', review: '11/13 21:00', title: 'Agent 基础：循环、状态、记忆与工具',
            learn: ['Observe → Plan → Act → Reflect', 'Workflow 与 Agent 的边界', '短期状态、长期记忆、工具契约与 MCP'],
            business: ['输入店铺问题，自动查政策、分析指标并给动作建议', '识别哪些步骤必须由规则或人控制'],
            output: '商家运营 Agent v1：检索、计算、数据查询、报告四类工具。',
            acceptance: '10 个脚本任务成功率 ≥80%；每一步有 Trace；参数校验、超时、重试和失败回退有效。'
        },
        {
            week: 13, phase: 'agent', start: '2026-11-17', end: '2026-11-23', review: '11/20 21:00', title: '高级 Agent：规划、协作与人工审批',
            learn: ['Task Decomposition、Planning 与 Replanning', '多 Agent 角色、通信与上下文共享', '权限、审批、持久记忆和中断恢复'],
            business: ['选品研究与活动报名：搜集、分析、审核、执行', '设计高风险动作的人机协同界面'],
            output: '研究员 → 分析师 → 审核员协作链路。',
            acceptance: '10 个复杂任务成功率 ≥80%；未经确认不能执行高风险动作；中断后可从检查点继续。'
        },
        {
            week: 14, phase: 'agent', start: '2026-11-24', end: '2026-11-30', review: '11/27 21:00', title: 'Agent 评测、可观测性与安全',
            learn: ['Task Success、Trajectory Eval 与错误归因', 'Prompt Injection、数据泄露和最小权限', '延迟、成本、并发、缓存与降级'],
            business: ['确保运营 Agent 可控、可解释、可运营', '为线上故障定义告警、止损和人工接管'],
            output: 'Agent 评测台 + Trace 看板 + 安全攻击集 + 预算控制。',
            acceptance: '≥30 个端到端任务；成功率 ≥85%；高风险攻击阻断率 ≥90%；展示 p95 和单任务成本。'
        },
        {
            week: 15, phase: 'agent', start: '2026-12-01', end: '2026-12-07', review: '12/04 21:00', title: '生产架构与 Agent 平台化',
            learn: ['模型网关、工具注册、身份与权限', 'Memory / RAG / Workflow 分层架构', '版本、可观测性、SLA 与灾备'],
            business: ['从单点 Demo 走向可被多个业务复用的平台能力', '明确自建、采购和混合方案边界'],
            output: '电商 Agent 生产架构图 + API / 工具契约 + 运维 Runbook。',
            acceptance: '能完成架构评审；关键组件有 SLA 与 Owner；提供限流、降级、回滚、数据隔离方案。'
        },
        {
            week: 16, phase: 'product', start: '2026-12-08', end: '2026-12-14', review: '12/11 21:00', title: 'AI 产品策略、实验与 ROI',
            learn: ['AI-native 场景筛选和任务重构', 'Human-AI UX、信任、可控性与反馈', '北极星指标、A/B、单位经济与发布策略'],
            business: ['从点状工具升级为商家经营决策助手', '量化节省时长、解决率、GMV 机会与风险成本'],
            output: '商家经营 Copilot PRD + 指标树 + 实验方案 + ROI + 风险清单。',
            acceptance: '≥3 次用户访谈；1 个北极星指标及护栏指标；收益/成本量化；有灰度和回滚方案。'
        },
        {
            week: 17, phase: 'product', start: '2026-12-15', end: '2026-12-20', review: '12/18 21:00', title: '毕业作品：端到端交付',
            learn: ['系统取舍、指标复盘与失败修正', '产品、模型、评测、工程材料的统一叙事', '面向管理者与技术团队的双版本表达'],
            business: ['证明自己能定义场景、选技术、搭系统、做评测并推动落地', '邀请目标用户、算法和产品同行评审'],
            output: '在线 Demo、源码、架构图、PRD、评测报告与 3 个案例页。',
            acceptance: '端到端 Demo 稳定；核心指标达标；邀请 3 位同行评审；问题清单均有结论或后续计划。'
        },
        {
            week: 18, phase: 'product', start: '2026-12-21', end: '2026-12-25', review: '12/25 21:00', title: '发布、路演与下一程',
            learn: ['AI PM Portfolio 与面试叙事', '10 分钟路演：Why / What / How / Impact', '建立下一季度学习飞轮'],
            business: ['把四个月成果转成可公开验证的职业转型证据', '制定入岗 30 / 60 / 90 天计划'],
            output: '公开作品集、Demo 视频、10 分钟路演与下一季度 OKR。',
            acceptance: '作品公开可访问；10 分钟独立讲清全案；完成一次模拟面试；形成量化复盘和下一阶段路线。'
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

    function renderAiAbilities() {
        const list = document.getElementById('aiAbilityList');
        const average = document.getElementById('abilityAverage');
        if (!list || !average) return;
        const score = Math.round(aiAbilities.reduce((sum, item) => sum + item.current, 0) / aiAbilities.length);
        average.textContent = `${score}%`;
        list.innerHTML = aiAbilities.map(item => `
            <article class="ai-ability-item">
                <div class="ai-ability-meta"><span class="ai-ability-name">${item.name}</span><span class="ai-ability-score">${item.current} / ${item.target}</span></div>
                <div class="ai-ability-track"><i class="ai-ability-target" style="width:${item.target}%"></i><i class="ai-ability-current" style="width:${item.current}%"></i></div>
                <p class="ai-ability-focus">当前重点：${item.focus}</p>
                <p class="ai-ability-acceptance"><strong>目标验收：</strong>${item.acceptance}</p>
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
    renderAiAbilities();
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
