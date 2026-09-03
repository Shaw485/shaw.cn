document.addEventListener('DOMContentLoaded', function() {
    const appsData = [
        {
            id: 0,
            title: '数学题闹钟',
            shortName: '数学闹钟',
            category: 'Android App · 工具',
            date: '2026',
            rating: 'v62.1 · 已上线',
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
                url: 'https://github.com/Shaw485/shaw.cn/raw/main/math-alarm-v62.apk',
                label: '下载安卓版',
                meta: 'v62.1 · 12 MB'
            },
            resources: {
                first: {
                    heading: '01 · 产品需求文档',
                    title: '在线阅读完整 PRD',
                    href: 'project-doc.html?doc=math-alarm-prd',
                    intro: '在站内阅读完整 PRD，查看产品目标、数学题解锁规则、核心流程与 Android 系统权限方案。'
                },
                second: {
                    heading: '02 · 版本记录',
                    title: '在线阅读完整版本记录',
                    href: 'project-doc.html?doc=math-alarm-changelog',
                    intro: '在站内按版本查看功能实现、Android 系统适配、交互调整与稳定性修复。'
                },
                codeHeading: '03 · 源码与说明',
                code: [
                    {
                        title: 'GitHub 仓库',
                        href: 'https://github.com/Shaw485/math_alarm',
                        intro: '查看公开 Android 项目源码；公开仓库目前同步至 v60.0，站内版本记录与 APK 已更新到 v62.1。'
                    },
                    {
                        title: 'README',
                        href: 'project-doc.html?doc=math-alarm-readme',
                        intro: '在站内以 UTF-8 文本了解主要功能、运行方式与开发说明。'
                    }
                ]
            }
        },
        {
            id: 1,
            title: '怪奇之原',
            shortName: '怪奇之原',
            category: '浏览器游戏 · 平台跳跃',
            date: '2026',
            rating: 'v191 真机预览 · 待上线',
            gradient: 'linear-gradient(135deg, #dff3f6 0%, #c5e4ea 55%, #accfd7 100%)',
            iconStroke: '#111111',
            iconSVG: '<path d="M12 3c4 0 7 4.2 7 9.2 0 4.8-3.1 8.8-7 8.8s-7-4-7-8.8C5 7.2 8 3 12 3z"></path><circle cx="9.5" cy="11" r="0.8" fill="#111111"></circle><circle cx="14.5" cy="11" r="0.8" fill="#111111"></circle><path d="M9.5 15c1.4 1.2 3.6 1.2 5 0"></path>',
            iconImage: 'assets/odd-origin/icon.png',
            desc: '一款手绘风平台跳跃闯关游戏。当前版本为 Web / 微信小游戏 v191（2026-09-02）：玩家操控披风旅人穿过山野、石门、木箱与断崖，在 20 个旅途篇章中寻找出口；支持选关、移动、跳跃、提示、暂停、重来和返回营地，并完成手机外放背景音乐与可导出运行日志的真机调试。',
            features: [
                '🧭 旅途章节：从选关界面进入 20 个不同主题的关卡',
                '🎮 平台跳跃：通过左右移动与跳跃穿越平台、木箱和断崖',
                '🚪 双门解谜：观察场景线索，在入口与出口之间找到通路',
                '💡 关卡提示：支持提示、重来、暂停和返回章节选择',
                '🎨 手绘世界：低饱和山野背景、粗线条道具与披风旅人',
                '📱 触控操作：面向浏览器与小程序场景设计大尺寸控制按钮'
            ],
            tags: ['JavaScript', 'HTML5 Canvas', 'Platformer', 'Web Game', 'Hand-drawn'],
            screenshotLayout: 'landscape',
            screenshots: [
                'assets/odd-origin/title-screen.png',
                'assets/odd-origin/chapter-select.png',
                'assets/odd-origin/level-02.png',
                'assets/odd-origin/level-06.png',
                'assets/odd-origin/level-13.png'
            ],
            screenshotAlts: [
                '怪奇之原标题页与踏上旅途按钮',
                '怪奇之原旅途篇章选择页',
                '怪奇之原第 2 关云阶试炼',
                '怪奇之原第 6 关花之暗号',
                '怪奇之原第 13 关进退之间'
            ],
            resources: {
                first: {
                    heading: '01 · 作品介绍',
                    title: '在线阅读玩法与功能说明',
                    href: 'project-doc.html?doc=brain-egg-overview',
                    intro: '直接阅读游戏定位、操作方式、关卡结构、视觉风格与当前开发状态。'
                },
                second: {
                    heading: '02 · 版本记录',
                    title: '在线阅读全部改动记录',
                    href: 'project-doc.html?doc=brain-egg-changelog',
                    intro: '当前已同步到 Web / 微信小游戏 v191（2026-09-02），覆盖从首个可玩版本到 UI、20 关、微信小游戏、音频、宽屏适配、胶囊安全日志与稳定性调试的全部过程。'
                },
                codeHeading: '03 · 公开资料',
                code: [
                    {
                        title: '下载版本记录 TXT',
                        href: 'brain-egg-changelog.txt?v=20260902-brain-egg-v191',
                        intro: '下载带 UTF-8 BOM 的完整版本记录，避免浏览器或文本编辑器误判编码。',
                        download: '怪奇之原-版本记录.txt'
                    },
                    {
                        title: '公开展示页源码',
                        href: 'https://github.com/Shaw485/shaw.cn/blob/main/js/main.js',
                        intro: '查看作品集中的公开介绍与资源入口；游戏工程仍在整理中。'
                    }
                ]
            }
        },
        {
            id: 2,
            title: '0.015B 自研模型',
            shortName: '0.015B 自研模型',
            category: 'AI 学习项目 · LLM',
            date: '2026',
            rating: 'M036 · M037 已上线',
            gradient: 'linear-gradient(135deg, #111827 0%, #1d4ed8 58%, #60a5fa 100%)',
            iconStroke: '#FFFFFF',
            iconSVG: '<circle cx="12" cy="5" r="2"></circle><circle cx="5" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle><circle cx="12" cy="19" r="2"></circle><path d="M10.6 6.4 6.4 10.6M13.4 6.4l4.2 4.2M6.4 13.4l4.2 4.2M17.6 13.4l-4.2 4.2"></path>',
            desc: '一个从零训练中文 Decoder-only Transformer 的学习型项目。正式模型是 14,880,745 参数的纯预训练 Step5750 续写版；另提供 M023 R7 Step4000 问答实验版，仅覆盖 96 条已审核小说事实。',
            cardFlow: ['语料', 'BPE', '预训练', '后训练', '续写', '问答'],
            architecture: {
                eyebrow: 'TRAINING & DUAL RUNTIME',
                title: '从语料训练到续写与问答',
                summary: '先治理授权小说语料并冻结数据切分，再只用训练集学习 BPE，随后训练模型预测下一个 Token。正式续写版仍是纯预训练 Step5750；问答版是独立的 M023 R7 检索增强实验，并未替换正式基座。',
                state: '14.88M · 双入口',
                tabs: [
                    {
                        id: 'training',
                        label: '训练过程',
                        intro: '训练不是把整本小说一次塞给模型，而是把训练集不断切成 512 Token 窗口，让模型在每个位置预测紧随其后的 Token，并用误差反向更新参数。',
                        stages: [
                            {
                                id: 'corpus-governance',
                                title: '语料治理',
                                caption: '授权文本 → 章节段',
                                status: '数据',
                                input: '已获授权的单本小说原始文本与章节结构。',
                                action: '清洗排版噪声、合并重复版本，并按完整章节或版本组整理，避免同一内容跨集合泄漏。',
                                output: '1,775 个可追踪章节段，共 6,120,275 个字符。',
                                failure: '正文、可还原 Token 张量与受限训练产物不随网站公开。'
                            },
                            {
                                id: 'frozen-splits',
                                title: '冻结数据切分',
                                caption: 'Train / Val / Test',
                                status: '边界',
                                input: '清洗后的完整章节段，随机种子 42。',
                                action: '按章节与版本组切成 1,599 / 92 / 84 段；训练集学习，验证集选模型，测试集只做最终检查。',
                                output: '相互隔离、可复算的数据边界。',
                                failure: '测试集不参与调参或 checkpoint 选择，防止把考试题练进模型。'
                            },
                            {
                                id: 'train-bpe',
                                title: '训练 BPE',
                                caption: '文字 → Token',
                                status: 'Tokenizer',
                                input: '仅训练集中的 1,499,904 个学习字符。',
                                action: '从字符词表出发学习 3,000 次高频合并，并在每个章节末尾插入 EOS。',
                                output: '7,465 个 Token 的词表；平均约 1.709 字符 / Token。',
                                failure: 'BPE 不读取验证集和测试集，三份数据都必须通过编码—解码还原检查。'
                            },
                            {
                                id: 'build-next-token-batch',
                                title: '构造训练批次',
                                caption: '窗口右移一位',
                                status: '采样',
                                input: '训练集 Token 序列与 512 Token 上下文窗口。',
                                action: '每次取 2 个窗口；目标序列相对输入右移一位，梯度累积 4 次后再更新。',
                                output: '每个 optimizer step 共学习 4,096 个下一 Token 目标。',
                                failure: '输入和目标必须等长且严格错开一位，否则模型学不到续写关系。'
                            },
                            {
                                id: 'forward-pass',
                                title: '模型前向计算',
                                caption: '上下文 → Logits',
                                status: '计算',
                                input: '批次 Token 与位置编号。',
                                action: '经过 Embedding、10 个因果 Transformer Block、Final LayerNorm 与共享 LM Head。',
                                output: '每个位置对 7,465 个候选 Token 的原始分数 Logits。',
                                failure: '因果遮罩禁止当前位置看到未来 Token。'
                            },
                            {
                                id: 'loss-backprop',
                                title: 'Loss 与反向传播',
                                caption: '错多少 → 怎么改',
                                status: '学习',
                                input: 'Logits 与真实的下一 Token ID。',
                                action: 'Cross Entropy 衡量预测误差；反向传播计算所有参数的梯度并裁剪到 1.0。',
                                output: '告诉 Embedding、Attention、FFN 等参数各自应该向哪个方向调整。',
                                failure: '只看训练 Loss 会掩盖过拟合，因此必须同步看验证集与固定样本。'
                            },
                            {
                                id: 'adamw-update',
                                title: 'AdamW 更新',
                                caption: '累计梯度 → 新参数',
                                status: '优化',
                                input: '4 个 micro batch 累积后的梯度。',
                                action: 'AdamW 用 3e-4 峰值学习率，warmup 100 步后 cosine 降到 3e-5，并施加 0.1 weight decay。',
                                output: '完成一次参数更新；总计运行 6,000 optimizer steps。',
                                failure: '学习率、梯度范数或 Loss 异常时保留日志与 checkpoint，不盲目续跑。'
                            },
                            {
                                id: 'checkpoint-selection',
                                title: '选择 Step 5750',
                                caption: '不是最后一步自动获胜',
                                status: '验收',
                                input: '每 250 步保存的 checkpoint、验证 BPC、Harness 与固定续写样本。',
                                action: '比较质量、退化与稳定性：Step6000 的 BPC 只改善约 0.0081，低于 0.01 有效改善门槛，且 Harness 变差。',
                                output: '冻结 Step5750 为正式纯预训练模型。',
                                failure: '后续 SFT / Replay / 长上下文实验未通过替换门，因此不冒充正式模型。'
                            }
                        ],
                        observers: [
                            {
                                id: 'post-training-experiments',
                                label: '后训练实验支路',
                                state: '已完成 · 无正式候选',
                                origin: '从纯预训练 Step5750 复制候选权重开始',
                                steps: ['SFT 与 Replay 对照', '纯续写 SFT', '长上下文 A/B 与固定集回归'],
                                note: 'M020–M035 的候选没有同时通过目标能力、预训练保持与稳定性门禁，因此没有覆盖正式基座。M023 R7 仅作为标明失败边界的独立问答实验开放，不是正式候选。'
                            }
                        ]
                    },
                    {
                        id: 'runtime',
                        label: '工作架构',
                        intro: '这里展示正式续写版的工作架构。用户给出短语或半句话后，服务器上的 Step5750 逐 Token 续写，并在自然句界或安全上限处停止。',
                        stages: [
                            {
                                id: 'prompt-entry',
                                title: '短提示入口',
                                caption: '短语或半句话',
                                status: '输入',
                                input: '最多 80 个字符的中文小说开头。',
                                action: '服务检查请求来源、CSRF、长度和访问频率，生成请求按服务器能力串行处理。',
                                output: '通过边界检查的续写提示。',
                                failure: '空输入、超长输入、越权来源或超频请求会直接拒绝。'
                            },
                            {
                                id: 'runtime-tokenize',
                                title: 'BPE 编码与截窗',
                                caption: '文字 → Token ID',
                                status: '编码',
                                input: '通过检查的提示文字与冻结 Tokenizer。',
                                action: '编码成 BPE Token；超过上下文时只保留最近的 512 Token。',
                                output: '模型可读取的 Token 序列。',
                                failure: 'Tokenizer 与训练版本不一致会导致 ID 和权重错位。'
                            },
                            {
                                id: 'embedding',
                                title: 'Token + Position Embedding',
                                caption: 'ID → 320 维向量',
                                status: '表示',
                                input: 'Token ID 与序列中的位置。',
                                action: '查表得到 Token 含义向量和可学习位置向量，再把两者相加。',
                                output: '形状为序列长度 × 320 的上下文表示。',
                                failure: '模型只能使用 512 个已训练位置，不能无限扩大上下文。'
                            },
                            {
                                id: 'transformer-blocks',
                                title: '10 个 Transformer Block',
                                caption: 'Attention + FFN',
                                status: '推理',
                                input: '320 维上下文表示。',
                                action: '每层先 Pre-LayerNorm，再用 8 头 Q/K/V 因果注意力汇总前文，经过残差连接与 1,280 维 GELU FFN。',
                                output: '包含前文关系的逐位置表示。',
                                failure: '模型规模与单本小说数据决定了它只具备有限的局部连贯能力。'
                            },
                            {
                                id: 'lm-head',
                                title: 'Final Norm + LM Head',
                                caption: '向量 → 7,465 个分数',
                                status: '预测',
                                input: '最后一个位置的 320 维表示。',
                                action: 'Final LayerNorm 后，用与 Token Embedding 共享的输出权重投影为词表 Logits。',
                                output: '下一个 Token 的候选分布。',
                                failure: 'Logits 是分数，不是事实判断，也不代表模型理解了真实世界。'
                            },
                            {
                                id: 'top-k-sampling',
                                title: 'Top-K 采样',
                                caption: '从候选中选一个',
                                status: '生成',
                                input: '下一个 Token 的 Logits。',
                                action: '温度 0.7 调整分布，只保留 Top 20 候选后按概率采样一个 Token。',
                                output: '本轮新生成的一个 Token。',
                                failure: '随机采样让每次结果可能不同；模型不会查询外部知识库。'
                            },
                            {
                                id: 'kv-cache-loop',
                                title: 'KV Cache 循环',
                                caption: '复用前文计算',
                                status: '加速',
                                input: '新 Token 与各层已经算过的 Key / Value。',
                                action: '只计算新位置并复用缓存，然后继续预测下一个 Token；缓存满 512 时重建窗口。',
                                output: '在服务器 CPU 上持续逐 Token 续写。',
                                failure: '单请求锁和限流优先保证小服务器稳定，而不是追求高并发。'
                            },
                            {
                                id: 'natural-stop',
                                title: '自然停止并返回',
                                caption: '一两句话',
                                status: '输出',
                                input: '逐步生成的 Token、EOS 与句子边界。',
                                action: '遇到 EOS、自然句界、分句界或最多 60 个生成字符时停止，再解码成文字。',
                                output: '一段短中文小说续写。',
                                failure: '运行日志只记数量、耗时和停止原因，不记录提示、正文或 Token ID。'
                            }
                        ]
                    },
                    {
                        id: 'qa-runtime',
                        label: '问答实验架构',
                        intro: '问答实验版不是闭卷问答。它先把问题路由到 96 条已审核事实之一，再把已核验答案作为上下文交给 M023 R7 Step4000 组织语言；输出偏离事实时会回退。',
                        stages: [
                            {
                                id: 'qa-question-entry',
                                title: '小说问题入口',
                                caption: '最多 80 个字符',
                                status: '输入',
                                input: '一个具体、单行的小说事实问题。',
                                action: '检查 Host、Origin、CSRF、请求大小和保留标记；问题正文不写入日志。',
                                output: '通过安全边界的短问题。',
                                failure: '空输入、超长、控制字符或保留提示标记会直接拒绝。'
                            },
                            {
                                id: 'qa-fact-router',
                                title: '审核事实路由',
                                caption: '问题 → 96 条事实',
                                status: '检索',
                                input: '用户问题与服务器私有的 96 条审核事实。',
                                action: '先匹配规范问题，再要求模糊匹配得分至少 300、第一二名差距至少 100。',
                                output: '唯一高置信事实，或“未命中 / 有歧义”。',
                                failure: '未命中或有歧义时不调用模型，只提示把问题问得更具体。'
                            },
                            {
                                id: 'qa-answer-slot',
                                title: '构造答案槽上下文',
                                caption: '审核答案 → Prompt',
                                status: 'Grounding',
                                input: '匹配到的规范问题与已核验答案。',
                                action: '按 R7 训练格式把答案放入“已核验答案”字段，要求模型保留人物、关系、数量和限定语。',
                                output: '不超过 512 Token 的检索增强提示。',
                                failure: '不读取或对外发送小说原文证据窗口。'
                            },
                            {
                                id: 'qa-r7-reader',
                                title: 'R7 问答实验权重',
                                caption: 'Step4000 · Greedy',
                                status: '生成',
                                input: 'BOS / USER / 检索增强提示 / ASSISTANT Token。',
                                action: '14.88M 参数模型以 Top-1 贪心解码，最多生成 128 Token，遇到 EOS 停止。',
                                output: '模型组织的短答案。',
                                failure: '即使已提供事实，原始 R7 仍有 19/96 个规范问题发生错误复述。'
                            },
                            {
                                id: 'qa-fact-validator',
                                title: '事实约束校验',
                                caption: '关系 / 方向 / 必要槽位',
                                status: '校验',
                                input: '模型答案与审核事实的结构化规则。',
                                action: '检查必要人物与对象、关系方向、禁止断言、冲突和拒答；只移除机械的证据状态前缀。',
                                output: '通过的模型原回答，或审核答案回退。',
                                failure: '回退会在界面明确标记，不能假装成模型独立答对。'
                            },
                            {
                                id: 'qa-response',
                                title: '返回带来源状态的答案',
                                caption: '模型生成 / 审核回退',
                                status: '输出',
                                input: '校验结果与自然化后的短答案。',
                                action: '返回答案、是否调用模型以及是否发生回退；日志只记录布尔值、计数和耗时。',
                                output: '一个可体验、但边界清楚的小说事实问答结果。',
                                failure: '它不是通用聊天、外部知识检索或闭卷事实问答。'
                            }
                        ]
                    }
                ],
                guardrails: ['授权与公开边界', '章节级防泄漏切分', 'BPE 只读 Train', 'Test 不用于选模', 'SFT 必须过替换门', '问答高置信路由与事实回退'],
                telemetry: ['Train / Val Loss', '验证 BPC', '固定续写 Harness', '问答路由状态与回退率', 'Checkpoint 哈希', '推理耗时与停止原因'],
                boundary: '能力边界：正式模型是教学型中文小说续写模型；问答入口是只覆盖 96 条审核事实的检索增强实验，原始 R7 真人验收仅 41/64。二者都不具备通用聊天或外部世界知识。页面不展示小说正文、可还原 Token、私有评测答案或隐藏思维链。'
            },
            modelSpecs: {
                heading: '模型参数与双入口口径',
                note: '续写版使用正式 M036 Step5750；问答版使用独立 M023 R7 Step4000 实验权重。训练语料正文、可还原 Token 张量、事实包、评测问答、训练日志和优化器状态不公开。',
                groups: [
                    {
                        title: '续写正式版',
                        items: [
                            ['正式参数量', '14,880,745（14.88M，约 0.01488B）'],
                            ['模型类型', '中文 Decoder-only Causal Transformer'],
                            ['正式基座', 'M016 · 纯预训练 Step 5750'],
                            ['上下文窗口', '512 BPE Token'],
                            ['当前状态', 'M036 · Step5750 续写版在线试用'],
                            ['使用边界', '教学型小说续写模型，不是通用聊天模型']
                        ]
                    },
                    {
                        title: '续写版工作方式',
                        items: [
                            ['任务', '短中文小说续写；不是聊天或事实问答'],
                            ['算力来源', 'ShawSpace 服务器 CPU'],
                            ['输入方式', '输入一个短语或半句话'],
                            ['输出长度', '最多续写一两句话'],
                            ['上下文限制', '输入最多 80 个字符'],
                            ['访问限制', '按 IP 限流，生成请求串行处理'],
                            ['隐私', '服务日志不记录输入或输出正文']
                        ]
                    },
                    {
                        title: '问答实验版',
                        items: [
                            ['定位', 'M023 R7 Step4000 检索增强问答实验'],
                            ['覆盖范围', '96 条已审核小说事实'],
                            ['工作方式', '高置信事实路由 → 已核验答案槽 → 小模型组织语言'],
                            ['解码', 'Top-1 贪心；最多 128 Token；EOS 停止'],
                            ['生成校验', '检查必要人物、对象、关系方向与禁止断言'],
                            ['错误处理', '模型偏离事实时明确回退到审核答案'],
                            ['原始人审', '41 / 64 通过，未达到正式候选门槛'],
                            ['能力边界', '不是通用聊天、闭卷问答或外部知识检索'],
                            ['与正式版关系', '独立实验权重，不替换 Step5750']
                        ]
                    },
                    {
                        title: '网络结构',
                        items: [
                            ['Transformer 层数', '10 层'],
                            ['Embedding / hidden', '320 维'],
                            ['Attention heads', '8 个'],
                            ['Head dimension', '40 维（320 ÷ 8）'],
                            ['QKV 投影', '320 → 960，fused QKV，无 bias'],
                            ['Attention 输出', '320 → 320'],
                            ['FFN', '320 → 1,280 → 320，GELU'],
                            ['Norm / residual', 'Pre-LayerNorm + 残差连接'],
                            ['LayerNorm epsilon', '1e-5'],
                            ['Dropout', '0.1'],
                            ['注意力', 'PyTorch SDPA + causal mask'],
                            ['推理缓存', '支持逐层 KV Cache']
                        ]
                    },
                    {
                        title: 'Embedding 与参数拆解',
                        items: [
                            ['Token embedding', '7,465 × 320 = 2,388,800'],
                            ['Position embedding', '512 × 320 = 163,840（可学习绝对位置）'],
                            ['Transformer blocks', '1,232,000 / 层 × 10 = 12,320,000'],
                            ['Final LayerNorm', '640'],
                            ['LM head bias', '7,465'],
                            ['输出权重', '与 Token embedding 权重共享，不重复计数'],
                            ['初始化标准差', '0.02'],
                            ['合计', '14,880,745 参数']
                        ]
                    },
                    {
                        title: 'Tokenizer 与词表',
                        items: [
                            ['Tokenizer', 'Character-seeded BPE'],
                            ['Base vocabulary', '4,459'],
                            ['BPE 学习样本', '1,499,904 个训练集字符'],
                            ['BPE merges', '3,000'],
                            ['最终词表', '7,465'],
                            ['Special tokens', '6 个：UNK / BOS / USER / ASSISTANT / EOS / PAD'],
                            ['Special token IDs', '7,459–7,464'],
                            ['平均压缩率', '约 1.709 字符 / Token'],
                            ['边界处理', '每个章节 section 末追加 EOS'],
                            ['防泄漏', 'BPE merge 仅由 train split 学习']
                        ]
                    },
                    {
                        title: '预训练数据',
                        items: [
                            ['语料来源', '已获授权的《斗破苍穹》单本小说文本'],
                            ['清洗后总量', '6,120,275 字符 / 3,581,471 Token'],
                            ['Train', '1,599 章节段；5,508,660 字符；3,223,207 Token'],
                            ['Validation', '92 章节段；314,610 字符；184,003 Token'],
                            ['Test', '84 章节段；297,005 字符；174,261 Token'],
                            ['拆分方法', '完整章节 / 版本组拆分，随机种子 42'],
                            ['UTF-8 语料体积', '17,179,036 bytes'],
                            ['隐私与版权', '正文、清洗全文与可还原 Token 张量不随代码发布']
                        ]
                    },
                    {
                        title: '正式预训练配置',
                        items: [
                            ['训练步数', '6,000 optimizer steps；选定 Step 5750'],
                            ['Micro batch', '2'],
                            ['梯度累积', '4'],
                            ['每步 Token', '4,096'],
                            ['优化器', 'AdamW'],
                            ['学习率', '3e-4；warmup 100 后 cosine 降至 3e-5'],
                            ['Weight decay', '0.1'],
                            ['Adam betas', '0.9 / 0.95'],
                            ['Gradient clip', '1.0'],
                            ['精度 / 设备', 'float32 / Apple MPS'],
                            ['评估与保存', '每 250 步；评估 60 batches'],
                            ['生成参数', 'max_new_tokens 256；temperature 0.7；top_k 20']
                        ]
                    },
                    {
                        title: '预训练结果',
                        items: [
                            ['训练 Token 暴露', '24,576,000（约 7.62 遍 train）'],
                            ['Token / 参数', '约 1.652'],
                            ['训练耗时', '5,513 秒（约 91.9 分钟）'],
                            ['Step 5750 Val loss', '4.4576'],
                            ['Step 5750 Val BPC', '3.7612'],
                            ['固定窗口 Top-1', '24.17%'],
                            ['选择原则', 'Test 未加载、未参与 checkpoint 选择'],
                            ['能力边界', '固定续写可运行，但流畅度与局部连贯仅边缘通过']
                        ]
                    },
                    {
                        title: 'SFT 与最新诊断',
                        items: [
                            ['SFT v7 数据', '10,000 条：8,000 train / 800 val / 600 public / 600 sealed'],
                            ['SFT Token', 'train 524,886；val 52,760；public 39,338'],
                            ['M020 配置', '基于 Step 5750；batch 4；2,000 steps；LR 2e-5'],
                            ['M020 优化器', 'AdamW；weight decay 0.05；betas 0.9 / 0.95；clip 1.0'],
                            ['M020 设备 / 耗时', 'Apple MPS；1,978.1 秒'],
                            ['M020 结果', 'Val loss 5.8975 → 3.3562，但行为门失败'],
                            ['M021 Canary', '64 train + 16 unseen；400 steps；SFT batch 8'],
                            ['M021 学习率', 'peak 1e-5 / min 1e-6；warmup 20'],
                            ['M021 Replay', 'weight 0.25；batch 4 × block 128'],
                            ['回放目标 Token', '204,800'],
                            ['严格答案', 'Train 87.5% / Dev 68.75%'],
                            ['非盲复核', 'Train 95.31% / Dev 87.5%'],
                            ['预训练保持', 'BPC 退化 2.33%'],
                            ['M021 耗时', '386.47 秒'],
                            ['失败样本', '小说续写 16 条中 1 条空输出'],
                            ['后续实验结论', 'M033–M035 未产生优于正式基座的 SFT / 长上下文候选'],
                            ['当前结论', 'SFT 未产生正式候选；在线试用采用纯预训练 Step5750']
                        ]
                    }
                ]
            },
            features: [
                '🧱 从零搭建：按模块实现 14.88M 参数语言模型，而不是直接调用完整模型',
                '🧠 注意力机制：手写 Q/K/V、因果遮罩与多头注意力',
                '🔁 Transformer Block：组合残差、LayerNorm 与 FFN',
                '📐 Shape 验证：逐步检查张量维度、参数量和注意力概率',
                '📉 受控实验：完成预训练、多轮 SFT / replay 与长上下文对照，正式模型保持 Step5750',
                '🖥️ 双入口试用：可分别体验正式小说续写与 96 条审核事实上的问答实验',
                '📝 可复核记录：保留模型配置、训练结果、能力边界与失败实验'
            ],
            tags: ['Python', 'PyTorch', 'Transformer', 'Self-Attention', 'LLM'],
            screenshots: [],
            primaryAction: {
                url: 'https://shawspace.cn/handmade-gpt/?v=20260903-m037-dual-trials-v1',
                label: '续写版-试用',
                download: false
            },
            secondaryAction: {
                url: 'https://shawspace.cn/handmade-gpt-qa/?v=20260903-m037-dual-trials-v1',
                label: '问答版-试用',
                download: false
            },
            resourceCopy: {
                prd: '学习路线与实现范围持续整理中，记录每个 GPT 模块为什么存在、如何实现以及怎样验收。',
                changelog: '按 Tokenizer、Attention、Transformer Block、训练与生成阶段记录实现和验证结果。',
                github: '查看公开源码与冻结证据；main 分支同步至 M021，站内记录已更新到 M035.1。',
                readme: '快速了解项目目标、已完成模块、运行方式与下一步计划。'
            },
            resources: {
                first: {
                    heading: '01 · 学习路线',
                    title: '在线阅读 Roadmap',
                    href: 'project-doc.html?doc=gpt-roadmap',
                    intro: '在站内以 UTF-8 文本查看从数据、Tokenizer、预训练到 SFT 的阶段规划、产物与验收门槛。'
                },
                second: {
                    heading: '02 · 实现记录',
                    title: '在线阅读完整学习记录',
                    href: 'project-doc.html?doc=gpt-record',
                    intro: '在站内以 UTF-8 文本按阶段查看实现过程、实验结果、问题诊断与下一步计划。'
                },
                codeHeading: '03 · 代码与证据',
                code: [
                    {
                        title: 'GitHub 仓库',
                        href: 'https://github.com/Shaw485/create-gpt-step-by-step',
                        intro: '查看公开源码、数据处理脚本与测试；main 分支同步至 M021，站内 Roadmap 与学习记录已更新到 M035.1。'
                    },
                    {
                        title: '正式预训练配置',
                        href: 'https://github.com/Shaw485/create-gpt-step-by-step/blob/212daf8d5010e600ecb93116bff4867d428eb303/configs/formal_pretrain_14m_bpe3000.json',
                        intro: '核对层数、Embedding、Attention head、FFN、优化器、学习率与 Batch 配置。'
                    },
                    {
                        title: '数据与 Token Manifest',
                        href: 'https://github.com/Shaw485/create-gpt-step-by-step/tree/212daf8d5010e600ecb93116bff4867d428eb303/reports/milestones/016_formal_pretrain_14m',
                        intro: '核对字符量、Token 数、词表、BPE merges、拆分与训练报告。'
                    },
                    {
                        title: 'M021 后训练诊断',
                        href: 'https://github.com/Shaw485/create-gpt-step-by-step/blob/212daf8d5010e600ecb93116bff4867d428eb303/reports/milestones/021_sft_v7_1_canary/README.md',
                        intro: '查看 replay 实验、严格答案、预训练保持、失败样本与发布门禁。'
                    }
                ]
            }
        },
        {
            id: 3,
            title: 'PRD Agent',
            shortName: 'PRD Agent',
            category: 'AI Agent · 企业知识 RAG',
            date: '2026',
            rating: '已上线',
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
                '🧪 公开演示：三张界面图仅使用虚构的商品、规则、问答与引用，不包含内部数据'
            ],
            tags: ['RAG', 'Agent', 'Hybrid Search', 'Rerank', 'Evaluation', 'Trace'],
            screenshotLayout: 'landscape',
            screenshots: [
                'assets/prd-agent/01-multi-source-grounding-synthetic.png',
                'assets/prd-agent/02-versioned-evidence-synthetic.png',
                'assets/prd-agent/03-multi-item-decision-synthetic-v2.png'
            ],
            screenshotAlts: [
                'PRD Agent 用虚构套装商品数据回答分项售后问题，并展示四条合成引用',
                'PRD Agent 用虚构版本化规则回答自行寄回的适用条件',
                'PRD Agent 用虚构多 SKU 数据回答同一订单分别审批的规则'
            ],
            screenshotCaptions: [
                '多源证据回答：使用虚构套装商品与四份演示文档，展示分项售后、优惠回算和引用链路。全部内容为合成演示数据。',
                '版本化规则判断：使用虚构的「自行寄回适用条件 v0.2」回答资格问题。全部内容为合成演示数据。',
                '多对象规则问答：用虚构的蓝牙键盘与保护套展示两个 SKU 分别审批的结论与证据。全部内容为合成演示数据。'
            ],
            cardFlow: ['问题', '召回', '重排', '回答', '引用', '评测'],
            architecture: {
                eyebrow: 'CURRENT SYSTEM · PRODUCTION + SHADOW',
                title: '从问题到可引用答案',
                summary: '当前生产版是一条证据优先、失败关闭的 RAG 主链。系统先在权限范围内检索与重排原始证据，再经过证据门控、答案生成和引用校验；证据不足时会澄清或拒答。',
                state: 'Evidence-first RAG',
                tabs: [
                    {
                        id: 'runtime',
                        label: '在线问答主链',
                        intro: '蓝绿色实线代表当前线上主链。每个阶段都只处理显式输入与可审计产出，不展示隐藏思维链。',
                        stages: [
                            {
                                id: 'secure-entry',
                                title: '安全入口',
                                caption: '身份与范围',
                                status: '已上线',
                                input: '登录态与当前请求。',
                                action: '由服务端验证身份，生成权限范围与请求标识，不接受浏览器自报身份。',
                                output: '本次请求可访问的知识范围。',
                                failure: '身份、权限或配置异常时默认拒绝。'
                            },
                            {
                                id: 'query-resolution',
                                title: 'Query 解析',
                                caption: '追问可检索化',
                                status: '已上线',
                                input: '当前问题与有限的显式对话历史。',
                                action: '把短追问整理为可独立检索的问题，并保留用户原始意图。',
                                output: '显式检索 Query。',
                                failure: '语义仍不明确时请求用户澄清。'
                            },
                            {
                                id: 'candidate-retrieval',
                                title: '候选证据召回',
                                caption: '原始 Chunk',
                                status: '已上线',
                                input: '检索 Query 与允许访问的知识范围。',
                                action: '从原始 Chunk 与权威规则层并行寻找候选证据，再合并候选。',
                                output: '带来源的候选原文片段。',
                                failure: '没有可用候选时不进入自由生成。'
                            },
                            {
                                id: 'permission-filter',
                                title: '权限过滤',
                                caption: '资源边界',
                                status: '已上线',
                                input: '候选证据与服务端冻结的知识范围。',
                                action: '按知识库范围和资源类型过滤候选，避免越权证据进入答案。',
                                output: '允许进入排序的证据集合。',
                                failure: '过滤失败时默认拒绝，不降级为无权限检索。'
                            },
                            {
                                id: 'candidate-rerank',
                                title: '候选重排',
                                caption: '相关性排序',
                                status: '已上线',
                                input: '权限过滤后的候选 Chunk。',
                                action: '结合语义相似度、关键词覆盖与业务短语信号重新排序。',
                                output: '按相关性排序的候选证据。',
                                failure: '低相关候选降权，不能靠扩大 Top-K 掩盖问题。'
                            },
                            {
                                id: 'evidence-gate',
                                title: '证据选择与门控',
                                caption: '覆盖检查',
                                status: '已上线',
                                input: '重排结果与问题需要覆盖的要点。',
                                action: '选择可引用证据，检查相关性、覆盖度和是否需要附件下钻。',
                                output: '可用于回答的 Evidence 与引用关系。',
                                failure: '证据不足时只做部分回答、澄清或拒答。'
                            },
                            {
                                id: 'grounded-generation',
                                title: '基于证据生成',
                                caption: '受约束回答',
                                status: '已上线',
                                input: '当前问题、有限历史和已选 Evidence。',
                                action: '模型只依据已选证据组织结构化答案，不用常识补齐缺失事实。',
                                output: '答案草稿与逐条引用关系。',
                                failure: '没有足够证据时不输出看似确定的结论。'
                            },
                            {
                                id: 'citation-validation',
                                title: '引用校验与回答',
                                caption: '最终出口',
                                status: '已上线',
                                input: '答案草稿、引用关系与本次已选 Evidence。',
                                action: '校验每个引用都能回到本次证据，并选择回答、部分回答、澄清或拒答。',
                                output: '可追溯答案与来源，或清晰的证据不足说明。',
                                failure: '引用校验失败时不返回看似完整的答案。'
                            }
                        ],
                        observers: [
                            {
                                id: 'document-card-shadow',
                                label: '文档卡 Hybrid Shadow',
                                state: '已实现 · 生产默认关闭',
                                origin: '从 Query 解析分支出去',
                                steps: ['文档标题与范围导航', '关键词 + 多向量 Hybrid', '候选文档内定向 Chunk 搜索'],
                                note: '只写入诊断 Trace，不增删 Evidence、不改变 Gate，也不改写线上答案。'
                            },
                            {
                                id: 'limited-retrieval-loop',
                                label: '有限检索 Loop',
                                state: '离线研究 · 不参与线上答案',
                                origin: '面向跨文档、多步骤或证据不足的复杂题',
                                steps: ['识别证据缺口', '拆成 2–4 个子查询', '最多两轮补检与覆盖检查'],
                                note: '尾延迟与稳定性尚未通过门禁，生产 Runtime 不包含 Planner。'
                            }
                        ]
                    },
                    {
                        id: 'quality',
                        label: '质量优化闭环',
                        intro: '优化以固定评测集和错误切片为中心，不对单道题逐题打补丁；每次实验都必须说明假设、收益和可能回退。',
                        centerMessage: '固定评测集，而不是逐题打补丁',
                        stages: [
                            {
                                id: 'real-failure',
                                title: '真实失败',
                                caption: '从用户问题出发',
                                status: '输入',
                                input: '真实提问、追问和失败反馈。',
                                action: '保留可复现的失败现象与上下文边界。',
                                output: '可定位的 Bad Case。',
                                failure: '只看成功案例会掩盖系统性问题。'
                            },
                            {
                                id: 'reusable-eval',
                                title: '可复用评测样本',
                                caption: '不绑定 Chunk ID',
                                status: '数据',
                                input: 'Bad Case 与可核验标准答案或来源。',
                                action: '把问题、期望事实、必需来源和评分说明固化。',
                                output: 'Chunk 重切后仍可回归的评测样本。',
                                failure: '把答案绑死到旧 Chunk 会失去复用性。'
                            },
                            {
                                id: 'layered-diagnosis',
                                title: '分层归因',
                                caption: '找真正瓶颈',
                                status: '诊断',
                                input: '检索 Trace、证据、答案和交互结果。',
                                action: '分别判断文档选择、Chunk、重排、答案、引用、权限或体验问题。',
                                output: '错误切片与根因假设。',
                                failure: '只说“Chunk 不准”无法指导下一步。'
                            },
                            {
                                id: 'hypothesis-experiment',
                                title: '假设驱动实验',
                                caption: '最多 3 个方案',
                                status: '实验',
                                input: '根因假设与预期改善切片。',
                                action: '比较不超过三个可解释方案，并记录延迟、Token 与成本。',
                                output: '可复核的版本对比证据。',
                                failure: '同时改太多变量会失去归因能力。'
                            },
                            {
                                id: 'full-regression',
                                title: '全集回归',
                                caption: '不仅测命中题',
                                status: '验证',
                                input: '候选版本与固定评测集。',
                                action: '回归全部切片，并用全新 Holdout 检查过拟合。',
                                output: '质量、延迟、成本和回退风险。',
                                failure: '只重测修过的题会产生虚假提升。'
                            },
                            {
                                id: 'product-decision',
                                title: 'Go / Iterate / Stop',
                                caption: '产品决策',
                                status: '决策',
                                input: '完整回归结果与已知限制。',
                                action: '决定上线、继续迭代或停止，并给出下一轮数据与产品策略。',
                                output: '带取舍、门禁和回滚条件的决策。',
                                failure: '指标提升不等于值得上线。'
                            }
                        ]
                    }
                ],
                guardrails: ['权限范围', '版本与权威来源', 'Evidence 引用', '失败关闭', '脱敏日志'],
                telemetry: ['文档来源召回', 'Chunk / Evidence 覆盖', '引用校验', '分阶段耗时', 'P50 / P95', 'Token 与估算成本'],
                boundary: '公开边界：这里只展示可审计的系统事件与显式检索步骤，不展示隐藏思维链、系统 Prompt、原始模型输出、内部文档、真实 Query、账号、密钥或私有评测答案。'
            },
            primaryAction: {
                url: 'https://7ff79fde7564.aime-app.bytedance.net/',
                label: '打开 PRD Agent',
                status: '前端已上线 · 需授权登录'
            },
            resourceCopy: {
                prd: '产品目标、知识边界、检索链路和评测方案正在脱敏整理，暂不公开内部业务材料。',
                changelog: '记录从单路向量检索到分层召回、重排、证据校验与离线评测的迭代过程。',
                github: '项目涉及企业内部知识与数据，源码仓库暂不公开。',
                readme: '后续将提供不包含内部信息的架构说明、评测方法与公开 Demo。'
            },
            resources: {
                first: {
                    heading: '01 · 作品介绍',
                    title: '在线阅读项目与架构说明',
                    href: 'prd-agent-overview.html',
                    intro: '直接阅读产品目标、核心检索链路、回答边界、评测方法与公开范围。'
                },
                second: {
                    heading: '02 · 建设路线',
                    title: '在线阅读脱敏 Roadmap',
                    href: 'prd-agent-roadmap.html',
                    intro: '查看评测集、知识治理、分层 Hybrid RAG、证据控制与运行监控的实施顺序。'
                },
                codeHeading: '03 · 公开阅读入口',
                code: [
                    {
                        title: '产品说明',
                        href: 'prd-agent-overview.html',
                        intro: '阅读不包含企业内部文档、业务数据和账号信息的公开项目说明。'
                    },
                    {
                        title: '公开 Roadmap',
                        href: 'prd-agent-roadmap.html',
                        intro: '阅读可公开的阶段目标、交付物与验收方法；私有源码暂不对外展示。'
                    },
                    {
                        title: 'PRD Agent 前端',
                        href: 'https://7ff79fde7564.aime-app.bytedance.net/',
                        intro: '打开已上线的 PRD Agent 对话前端；知识与回答能力仅向获得授权的用户开放。'
                    }
                ]
            }
        },
        {
            id: 4,
            title: '搜索引擎评测 Agent',
            shortName: '搜索评测 Agent',
            category: 'AI Agent · Search Evaluation',
            date: '2026',
            rating: '全量基线已上线',
            gradient: 'linear-gradient(135deg, #101820 0%, #182f43 58%, #ff9900 100%)',
            iconStroke: '#FFFFFF',
            iconSVG: '<circle cx="10.5" cy="10.5" r="6.5"></circle><path d="m15.5 15.5 5 5"></path><path d="M7.5 11.5 10 9l2 2 2.5-3"></path>',
            desc: '一个证据驱动的电商搜索质量评测与优化 Agent。公开搜索页已接入全量 ESCI 商品 BM25 基线；Agent 工作台可直接查看 Bad Case、候选策略和 Harness 对比证据，策略变更仍由站长在服务器后台审批。',
            features: [
                '🔎 实时基线：输入英文 Query，在线搜索 1,814,924 个 ESCI 商品',
                '↔️ 双栏对照：优化前可用，优化后保持明确的未开放状态',
                '🧪 评测边界：明确区分体验原型、正式评测与 ESCI 标签范围',
                '🧭 Agent 工作台：独立公开页面，生成 Bad Case、候选策略与 Harness 比较证据',
                '🧾 证据链：路线图、ADR、验收报告与 GitHub 均可追溯',
                '🛡️ Harness：规划 Trace、Replay、超时、重试、预算与人工审批边界'
            ],
            tags: ['BM25', 'Vector Search', 'Amazon ESCI', 'Evaluation', 'FastAPI', 'Agent Harness'],
            screenshots: ['search-eval-preview.svg'],
            primaryAction: {
                url: 'search-eval.html',
                label: '开始搜索'
            },
            secondaryAction: {
                url: 'search-strategy.html',
                label: '策略平台'
            },
            tertiaryAction: {
                url: 'search-agent.html',
                label: 'Agent 工作台'
            },
            resources: {
                first: {
                    heading: '01 · 建设路线图',
                    title: 'Roadmap',
                    href: 'project-doc.html?doc=search-roadmap',
                    intro: '在站内以 UTF-8 文本查看八阶段建设顺序、每个阶段的交付物、验收门槛和明确不做的范围。'
                },
                second: {
                    heading: '02 · 当前生产基线',
                    title: 'Full-catalog Baseline Report',
                    href: 'project-doc.html?doc=search-full-catalog-baseline',
                    intro: '查看 1,814,924 个 ESCI 商品索引、生产 API 验收、语言样例、性能与明确未覆盖范围。'
                },
                codeHeading: '03 · 评测与源码',
                code: [
                    {
                        title: 'Agent Evaluation Report',
                        href: 'project-doc.html?doc=search-agent-evaluation',
                        intro: '查看本地 12-task Agent 行为评测；它验证工具、分支、证据、预算与 Trace，不代表搜索相关性评测，也尚未部署到生产。'
                    },
                    {
                        title: 'Stage 0 Report',
                        href: 'project-doc.html?doc=search-stage0-report',
                        intro: '查看早期本地技术闸门、43 条测试、环境约束与当时的 OpenSearch 待验证项，作为历史基线证据。'
                    },
                    {
                        title: 'GitHub 仓库',
                        href: 'https://github.com/Shaw485/search-engine-eva-agent',
                        intro: '查看搜索后端、样例数据、测试、Compose 与最新提交。'
                    },
                    {
                        title: 'README',
                        href: 'project-doc.html?doc=search-readme',
                        intro: '在站内以 UTF-8 文本快速了解项目定位、运行方式、评测边界和下一步计划。'
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
            rating: '本地记录 v0.3.4 · Release v0.3.1',
            gradient: 'linear-gradient(135deg, #18231d 0%, #2f7255 58%, #9bc3ae 100%)',
            iconStroke: '#FFFFFF',
            iconSVG: '<path d="M5 4.5h10a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z"></path><path d="M8 4.5V20M11 9h4M11 13h4"></path><path d="m18.5 3 .7 1.5L21 5.2l-1.8.7-.7 1.6-.7-1.6-1.8-.7 1.8-.7z"></path>',
            desc: 'Pick Memory 是一款本地优先的桌面间隔复习工具，把“随手收藏—按时复习—反馈掌握程度—管理知识库”连成一个轻量闭环。本地源码记录已更新至 v0.3.4（待推送），公开 GitHub 与安装包仍为 v0.3.1；最新迭代补齐多标签页并发写入、iframe 划词、来源地址脱敏，以及 macOS 只读选区与禁止键盘注入的安全回归。',
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
            platformStatus: '本地记录 v0.3.4（待推送）· Release v0.3.1 已上线',
            resources: {
                first: {
                    heading: '01 · 产品与安装',
                    title: '在线阅读 README（UTF-8）',
                    href: 'project-doc.html?doc=pick-memory-readme',
                    intro: '在站内打开产品能力、macOS / Windows 安装方法、数据说明与快捷键，不再依赖 GitHub 文本编码。'
                },
                second: {
                    heading: '02 · 版本更新',
                    title: '在线阅读 Changelog（UTF-8）',
                    href: 'project-doc.html?doc=pick-memory-changelog',
                    intro: '在站内查看本地源码更新至 v0.3.4 的完整记录；这部分尚待推送，公开 GitHub 与安装包仍为 v0.3.1。'
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
        },
        {
            id: 6,
            title: 'Agent Harness',
            shortName: 'Agent Harness',
            category: 'AI Platform · Agent Runtime',
            date: '2026',
            rating: '前端框架搭建中',
            gradient: 'linear-gradient(135deg, #151a22 0%, #27374b 58%, #4f6f8f 100%)',
            iconStroke: '#FFFFFF',
            iconSVG: '<rect x="4" y="4" width="16" height="16" rx="3"></rect><path d="M8 9h8M8 13h5M8 17h3"></path><circle cx="17" cy="13" r="1.4" fill="#FFFFFF" stroke="none"></circle>',
            desc: '一个面向多个 Agent 的统一运行与治理前端，用来承载 Agent 目录、Run、Step / Tool Call、评测证据、人工审批以及 Trace 与日志。当前只完成前端框架，PRD Agent 与搜索 Agent 均尚未接入，不会产生真实运行数据。',
            features: [
                '🗂️ Agent 目录：统一管理 Agent、版本、能力与接入状态',
                '▶️ 运行记录：按 Run 展示状态、耗时、模型和工具调用边界',
                '🧪 评测证据：关联基线、候选版本、失败样本和验收结论',
                '✅ 人工审批：对写入、发布和策略变更保留人工确认',
                '🔍 Trace 与日志：追踪步骤、工具调用、重试和可操作错误',
                '🔌 Adapter 预留：后续接入 PRD Agent 与搜索 Agent'
            ],
            tags: ['Agent Harness', 'Runtime', 'Evaluation', 'Observability', 'Human-in-the-loop'],
            screenshots: [],
            primaryAction: {
                url: 'agent-harness.html',
                label: '查看 Harness'
            },
            platformStatus: '前端框架 · 运行时待接入',
            resources: {
                first: {
                    heading: '01 · 前端框架',
                    title: '打开 Agent Harness',
                    href: 'agent-harness.html',
                    intro: '查看 Agent 目录、运行记录、评测证据、人工审批与 Trace 日志的统一前端框架。'
                },
                second: {
                    heading: '02 · 接入说明',
                    title: '查看接入清单',
                    href: 'agent-harness.html#integration',
                    intro: '查看统一数据协议、PRD Agent Adapter、搜索 Agent Adapter、权限审批和可观测性的待办。'
                },
                codeHeading: '03 · 源码与诊断',
                code: [
                    {
                        title: '前端源码',
                        href: 'https://github.com/Shaw485/shaw.cn/blob/main/agent-harness.html',
                        intro: '查看 Harness 页面结构、Agent Registry 占位与无数据状态的实现。'
                    },
                    {
                        title: '诊断说明',
                        href: 'project-doc.html?doc=agent-harness-debug',
                        intro: '在站内以 UTF-8 文本查看模块化日志的启用、过滤、导出与故障排查方法。'
                    }
                ]
            }
        }
    ];

    const projectDocs = [
      { prd:[['问题','普通闹钟容易被顺手关闭，用户并没有真正清醒。'],['方案','响铃后生成 a×b+c×d 数学题，答对才能结束。'],['体验','单闹钟、滚轮选时、三种铃声、锁屏提醒与开机恢复。'],['技术','Kotlin、Jetpack Compose、AlarmManager、DataStore。']],
        process:[['定义闭环','先跑通设置—触发—答题—关闭。'],['系统适配','验证精确闹钟、全屏通知、前台服务和开机恢复。'],['交互打磨','统一黑橙视觉与三行滚轮选时。'],['可靠性','处理跨日、重启和超时兜底。']],
        changelog:[['需求成型','确定单闹钟与数学题解锁机制。'],['原生实现','完成 Compose 界面、铃声与状态管理。'],['系统适配','补齐 Android 13/14 权限。'],['稳定性','增加开机恢复、跨日计算与异常回流。']],
        links:[['GitHub','https://github.com/Shaw485/math_alarm'],['README','project-doc.html?doc=math-alarm-readme'],['PRD','project-doc.html?doc=math-alarm-prd'],['完整改动记录','project-doc.html?doc=math-alarm-changelog']]},
      { prd:[['定位','手绘风的平台跳跃闯关游戏。'],['玩法','移动、跳跃、穿越平台并找到出口。'],['视觉','低饱和山野、粗线条道具和披风旅人。'],['架构','Godot 4.x + JSON 数据驱动关卡，并维护网页预览。']],
        process:[['可玩原型','完成移动、跳跃、碰撞与出口。'],['关卡系统','加入主菜单、选关和 JSON 加载。'],['视觉统一','重做角色、平台、门、小草与 HUD。'],['动作反馈','增加待机、行走、跳跃姿态。'],['持续修错','回归缓存、按钮、出生点和平台高度。']],
        changelog:[['当前版本','Web / 微信小游戏 v191（2026-09-02）。'],['完整源记录','公开文件与游戏项目《改动记事本》逐字同步，保留 93 个顶层记录与 4 个自动子记录，共 97 条。'],['持续迭代','覆盖原型、UI、20 关、编辑器、微信小游戏、音频、宽屏适配和稳定性调试。']],links:[['完整改动记录 TXT','project-doc.html?doc=brain-egg-changelog']]}
      ,{ links:[['GitHub','https://github.com/Shaw485/create-gpt-step-by-step'],['README','project-doc.html?doc=gpt-roadmap']]}
      ,{ links:[] }
      ,{ links:[['GitHub','https://github.com/Shaw485/search-engine-eva-agent'],['README','project-doc.html?doc=search-readme']] }
      ,{ links:[['GitHub','https://github.com/Shaw485/pick-memory'],['README','project-doc.html?doc=pick-memory-readme']] }
      ,{ links:[['GitHub','https://github.com/Shaw485/shaw.cn/blob/main/agent-harness.html'],['README','project-doc.html?doc=agent-harness-debug']] }
    ];
    appsData.forEach((app,i)=>Object.assign(app,projectDocs[i]));

    const worksCount = document.querySelector('.works-count');
    if (worksCount) worksCount.textContent = `(${appsData.length})`;

    const appCardFields = [
        { projectType: 'APP', status: '已上线', statusType: 'online', publishDate: '2026/8/29', displayOrder: 2, shortDesc: 'v62.1：必须答对 a×b+c×d 格式数学题才能关闹钟，支持三款铃声、Android 14 精确闹钟、重启恢复与 10 分钟超时兜底。', likes: 2 },
        { projectType: '小程序', status: '待上线', statusType: 'pending', publishDate: '2026/9/1', displayOrder: 5, shortDesc: 'Web / 微信小游戏 v191：手绘风平台跳跃闯关游戏，已完成 20 关、手机外放背景音乐、宽屏适配与可导出真机日志，暂未公开试玩。', likes: 0 },
        { projectType: 'GPT', status: '已上线', statusType: 'online', publishDate: '2026/9/1', displayOrder: 3, shortDesc: '14,880,745 参数的中文小说语言模型，可体验小说续写与 96 条审核事实范围内的问答。', likes: 0 },
        { projectType: 'Agent', status: '已上线', statusType: 'online', publishDate: '2026/9/1', displayOrder: 4, shortDesc: '企业 PRD 知识检索 Agent，公开详情已补三张合成数据问答界面图；围绕分层召回、Rerank、版本过滤、证据校验与离线评测持续优化。', likes: 0 },
        { projectType: 'Agent', status: '开发中', statusType: 'wip', publishDate: '2026/8/30', displayOrder: 6, shortDesc: '公开搜索页已接入 1,814,924 个 ESCI 商品的 BM25 基线，并提供 Bad Case、候选策略与 Harness 对比证据。', likes: 0 },
        { projectType: '插件', status: '已上线', statusType: 'online', publishDate: '2026/8/28', displayOrder: 1, shortDesc: '本地源码记录 v0.3.4（待推送）、公开安装包 v0.3.1；支持间隔复习、iframe 划词、来源脱敏与 macOS 只读选区。', likes: 0 },
        { projectType: 'Agent', status: '开发中', statusType: 'wip', publishDate: '2026/8/29', displayOrder: 7, shortDesc: '统一承载 Agent 的运行、评测、审批与追踪。当前仅完成前端框架，PRD Agent 与搜索 Agent 尚未接入。', likes: 0 }
    ];
    appsData.forEach((app, i) => Object.assign(app, appCardFields[i]));

    const portfolioLogConfig = (() => {
        try {
            const enabled = localStorage.getItem('shaw.debug.portfolio') === '1';
            const modules = (localStorage.getItem('shaw.debug.portfolio.modules') || '')
                .split(',')
                .map(item => item.trim())
                .filter(Boolean);
            return { enabled, modules: new Set(modules) };
        } catch (_) {
            return { enabled: false, modules: new Set() };
        }
    })();

    function portfolioLog(module, level, event, context = {}) {
        const shouldDebug = portfolioLogConfig.enabled && (!portfolioLogConfig.modules.size || portfolioLogConfig.modules.has(module));
        if (!shouldDebug && level !== 'warn' && level !== 'error') return;
        const writer = console[level] || console.log;
        writer(`[portfolio:${module}] ${event}`, { timestamp: new Date().toISOString(), ...context });
    }

    const likeApiBase = 'https://countapi.mileshilliard.com/api/v1';
    const likeStorageKey = 'shawspace_portfolio_likes_v1';
    const portfolioState = { sort: 'featured', status: 'all' };
    const pendingLikeIds = new Set();
    const likedAppIds = (() => {
        try {
            const saved = JSON.parse(localStorage.getItem(likeStorageKey) || '[]');
            return new Set(Array.isArray(saved) ? saved.map(Number).filter(Number.isInteger) : []);
        } catch (error) {
            portfolioLog('likes', 'warn', 'liked-state-read-failed', { reason: error?.name || 'unknown' });
            return new Set();
        }
    })();

    function likeCounterKey(appId) {
        return `shawspace_cn_portfolio_${appId}_likes_v1`;
    }

    function requestWithTimeout(url, timeoutMs = 5000) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);
        return fetch(url, { cache: 'no-store', signal: controller.signal })
            .finally(() => clearTimeout(timeout));
    }

    function publishTime(value) {
        const [year, month, day] = value.split('/').map(Number);
        return Date.UTC(year, month - 1, day);
    }

    function getVisibleApps() {
        const filtered = portfolioState.status === 'all'
            ? [...appsData]
            : appsData.filter(app => app.statusType === portfolioState.status);
        return filtered.sort((a, b) => {
            const featuredDelta = a.displayOrder - b.displayOrder;
            const dateDelta = publishTime(b.publishDate) - publishTime(a.publishDate);
            if (portfolioState.sort === 'featured') return featuredDelta;
            if (portfolioState.sort === 'popular') return b.likes - a.likes || featuredDelta;
            return dateDelta || featuredDelta;
        });
    }

    function renderWorks() {
        const grid = document.getElementById('worksGrid');
        if (!grid) return;
        const visibleApps = getVisibleApps();
        if (worksCount) worksCount.textContent = `(${visibleApps.length})`;
        if (!visibleApps.length) {
            grid.innerHTML = '<div class="works-empty">当前筛选条件下暂无作品</div>';
            return;
        }
        grid.innerHTML = visibleApps.map(app => {
            const liked = likedAppIds.has(app.id);
            const pending = pendingLikeIds.has(app.id);
            const compactFlowClass = app.cardFlow?.length > 4 ? ' work-card-flow-compact' : '';
            const cardFlow = app.cardFlow?.length
                ? `<ol class="work-card-flow${compactFlowClass}" aria-label="${app.shortName} 架构预览">${app.cardFlow.map(step => `<li>${step}</li>`).join('')}</ol>`
                : '';
            return `
            <div class="work-card${app.cardFlow?.length ? ' has-flow' : ''}" data-app="${app.id}">
                <div class="work-card-top">
                    <div class="work-card-labels">
                        <span class="project-type-tag">${app.projectType}</span>
                        <span class="status-tag status-${app.statusType}">${app.status}</span>
                    </div>
                    <span class="work-date">${app.publishDate}</span>
                </div>
                <h3 class="work-title">「${app.shortName}」</h3>
                <p class="work-desc">${app.shortDesc}</p>
                ${cardFlow}
                <div class="work-card-bottom">
                    <div class="work-stats">
                        <button class="stat-item-mini like-button${liked ? ' liked' : ''}" type="button" data-like-app="${app.id}" aria-pressed="${liked}" aria-label="${liked ? `已喜欢${app.shortName}` : `喜欢${app.shortName}`}"${pending ? ' disabled' : ''}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="${liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            <span>${app.likes}</span>
                        </button>
                    </div>
                    <button class="btn-view-work" type="button">${app.architecture ? '查看架构' : '查看详情'}</button>
                </div>
            </div>`;
        }).join('');
        portfolioLog('cards', 'debug', 'cards-rendered', {
            sort: portfolioState.sort,
            status: portfolioState.status,
            projectIds: visibleApps.map(app => app.id)
        });
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
    const modalModelSpecs = document.getElementById('modalModelSpecs');
    const modalModelSpecsTitle = document.getElementById('modalModelSpecsTitle');
    const modalModelSpecsNote = document.getElementById('modalModelSpecsNote');
    const modalModelSpecGroups = document.getElementById('modalModelSpecGroups');
    const modalFeatureDetails = document.getElementById('modalFeatureDetails');
    const modalArchitecture = document.getElementById('modalArchitecture');
    const prdArchitectureEyebrow = document.getElementById('prdArchitectureEyebrow');
    const prdArchitectureTitle = document.getElementById('prdArchitectureTitle');
    const prdArchitectureSummary = document.getElementById('prdArchitectureSummary');
    const prdArchitectureState = document.getElementById('prdArchitectureState');
    const prdArchitectureTabs = document.getElementById('prdArchitectureTabs');
    const prdArchitecturePanels = document.getElementById('prdArchitecturePanels');
    const prdArchitectureGuardrails = document.getElementById('prdArchitectureGuardrails');
    const prdArchitectureTelemetry = document.getElementById('prdArchitectureTelemetry');
    const prdArchitectureBoundary = document.getElementById('prdArchitectureBoundary');
    const modalScreenshots = document.getElementById('modalScreenshots');
    const modalScreenshotsSection = modalScreenshots?.closest('.app-modal-screenshots');
    const modalApkDownload = document.getElementById('modalApkDownload');
    const modalApkLabel = document.getElementById('modalApkLabel');
    const modalSecondaryDownload = document.getElementById('modalSecondaryDownload');
    const modalSecondaryLabel = document.getElementById('modalSecondaryLabel');
    const modalTertiaryAction = document.getElementById('modalTertiaryAction');
    const modalTertiaryLabel = document.getElementById('modalTertiaryLabel');
    const modalPlatformActions = document.getElementById('modalPlatformActions');
    const modalDownloadStats = document.getElementById('modalDownloadStats');
    const modalDownloadCount = document.getElementById('modalDownloadCount');
    const imageLightbox = document.getElementById('imageLightbox');
    const imageLightboxImage = document.getElementById('imageLightboxImage');
    const imageLightboxClose = document.getElementById('imageLightboxClose');

    const modalPrdResource=document.getElementById('modalPrdResource'), modalChangelogResource=document.getElementById('modalChangelogResource'), modalCodeResources=document.getElementById('modalCodeResources');
    const modalPrdHeading=document.getElementById('modalPrdHeading'), modalChangelogHeading=document.getElementById('modalChangelogHeading'), modalCodeHeading=document.getElementById('modalCodeHeading');

    const worksGrid = document.getElementById('worksGrid');
    const worksFilters = document.querySelector('.works-filters');
    const workStatusFilter = document.getElementById('workStatusFilter');
    const worksFeedback = document.getElementById('worksFeedback');
    let modalReturnFocus = null;

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
        const appId = Number(appModal?.dataset.appId);
        portfolioLog('actions', 'debug', 'action-opened', { appId, action: 'primary' });
        if (modalApkDownload.dataset.countDownload !== 'true') return;
        fetch(downloadCounterHitUrl, { cache: 'no-store', keepalive: true })
            .then(response => response.ok ? response.json() : Promise.reject())
            .then(setDownloadCount)
            .catch(() => {});
    });

    modalSecondaryDownload?.addEventListener('click', () => {
        const appId = Number(appModal?.dataset.appId);
        portfolioLog('actions', 'debug', 'action-opened', { appId, action: 'secondary' });
    });

    modalTertiaryAction?.addEventListener('click', () => {
        const appId = Number(appModal?.dataset.appId);
        portfolioLog('actions', 'debug', 'action-opened', { appId, action: 'tertiary' });
    });

    function renderPrdArchitecture(app) {
        const architecture = app.architecture;
        appModal?.classList.toggle('has-architecture', Boolean(architecture));
        if (!modalArchitecture || !prdArchitectureEyebrow || !prdArchitectureTitle || !prdArchitectureSummary || !prdArchitectureState || !prdArchitectureTabs || !prdArchitecturePanels || !prdArchitectureGuardrails || !prdArchitectureTelemetry || !prdArchitectureBoundary) return;

        modalArchitecture.hidden = !architecture;
        prdArchitectureTabs.replaceChildren();
        prdArchitecturePanels.replaceChildren();
        prdArchitectureGuardrails.replaceChildren();
        prdArchitectureTelemetry.replaceChildren();
        if (!architecture) return;

        prdArchitectureEyebrow.textContent = architecture.eyebrow;
        prdArchitectureTitle.textContent = architecture.title;
        prdArchitectureSummary.textContent = architecture.summary;
        prdArchitectureState.textContent = architecture.state;
        prdArchitectureBoundary.textContent = architecture.boundary;
        prdArchitectureTabs.setAttribute('aria-label', `${app.title} 架构视图`);

        const appendChips = (container, values) => {
            values.forEach(value => {
                const item = document.createElement('li');
                item.textContent = value;
                container.appendChild(item);
            });
        };
        appendChips(prdArchitectureGuardrails, architecture.guardrails);
        appendChips(prdArchitectureTelemetry, architecture.telemetry);

        const tabs = [];
        const panels = [];

        architecture.tabs.forEach((tab, tabIndex) => {
            const tabButton = document.createElement('button');
            const tabId = `prd-architecture-tab-${tab.id}`;
            const panelId = `prd-architecture-panel-${tab.id}`;
            tabButton.type = 'button';
            tabButton.id = tabId;
            tabButton.setAttribute('role', 'tab');
            tabButton.setAttribute('aria-controls', panelId);
            tabButton.setAttribute('aria-selected', String(tabIndex === 0));
            tabButton.tabIndex = tabIndex === 0 ? 0 : -1;
            tabButton.textContent = tab.label;
            prdArchitectureTabs.appendChild(tabButton);
            tabs.push(tabButton);

            const panel = document.createElement('section');
            panel.id = panelId;
            panel.className = `prd-architecture-panel${tab.id === 'quality' ? ' is-quality' : ''}`;
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('aria-labelledby', tabId);
            panel.hidden = tabIndex !== 0;

            const intro = document.createElement('p');
            intro.className = 'prd-architecture-intro';
            intro.textContent = tab.intro;
            panel.appendChild(intro);

            const flow = document.createElement('ol');
            flow.className = 'prd-architecture-flow';
            flow.setAttribute('aria-label', `${tab.label}的${tab.stages.length}个阶段`);

            const stageButtons = [];
            tab.stages.forEach((stage, stageIndex) => {
                const item = document.createElement('li');
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'prd-architecture-node';
                button.dataset.architectureStage = stage.id;
                button.setAttribute('aria-pressed', String(stageIndex === 0));

                const number = document.createElement('span');
                number.className = 'prd-architecture-node-number';
                number.textContent = String(stageIndex + 1).padStart(2, '0');
                const status = document.createElement('span');
                status.className = 'prd-architecture-node-status';
                status.textContent = stage.status;
                const title = document.createElement('strong');
                title.textContent = stage.title;
                const caption = document.createElement('small');
                caption.textContent = stage.caption;
                button.append(number, status, title, caption);
                item.appendChild(button);
                flow.appendChild(item);
                stageButtons.push(button);
            });
            panel.appendChild(flow);

            if (tab.centerMessage) {
                const centerMessage = document.createElement('p');
                centerMessage.className = 'prd-quality-message';
                centerMessage.textContent = tab.centerMessage;
                panel.appendChild(centerMessage);
            }

            const inspector = document.createElement('section');
            inspector.className = 'prd-step-inspector';
            inspector.setAttribute('aria-live', 'polite');
            const inspectorKicker = document.createElement('p');
            inspectorKicker.className = 'prd-step-inspector-kicker';
            inspectorKicker.textContent = 'SELECTED STEP';
            const inspectorTitle = document.createElement('h4');
            const details = document.createElement('dl');
            const inspectorFields = {};
            [['input', '输入'], ['action', '处理'], ['output', '产出'], ['failure', '失败时']].forEach(([key, label]) => {
                const row = document.createElement('div');
                const term = document.createElement('dt');
                const description = document.createElement('dd');
                term.textContent = label;
                row.append(term, description);
                details.appendChild(row);
                inspectorFields[key] = description;
            });
            inspector.append(inspectorKicker, inspectorTitle, details);
            panel.appendChild(inspector);

            const selectStage = (stageIndex, shouldFocus = false) => {
                const stage = tab.stages[stageIndex];
                stageButtons.forEach((button, index) => button.setAttribute('aria-pressed', String(index === stageIndex)));
                inspectorTitle.textContent = stage.title;
                Object.entries(inspectorFields).forEach(([key, field]) => {
                    field.textContent = stage[key];
                });
                if (shouldFocus) stageButtons[stageIndex].focus();
                portfolioLog('architecture', 'debug', 'stage-selected', { appId: app.id, panel: tab.id, stage: stage.id });
            };
            stageButtons.forEach((button, stageIndex) => {
                button.addEventListener('click', () => selectStage(stageIndex));
            });
            selectStage(0);

            if (tab.observers?.length) {
                const observerSection = document.createElement('section');
                observerSection.className = 'prd-observer-lanes';
                const observerHeader = document.createElement('div');
                observerHeader.className = 'prd-observer-heading';
                const observerTitle = document.createElement('h4');
                observerTitle.textContent = 'Shadow / 离线支路';
                const observerNote = document.createElement('p');
                observerNote.textContent = '这些能力只进入观察与评测，不回流到当前线上答案。';
                observerHeader.append(observerTitle, observerNote);
                observerSection.appendChild(observerHeader);

                tab.observers.forEach(observer => {
                    const detailsElement = document.createElement('details');
                    detailsElement.className = 'prd-observer-lane';
                    const summary = document.createElement('summary');
                    const label = document.createElement('strong');
                    label.textContent = observer.label;
                    const state = document.createElement('span');
                    state.textContent = observer.state;
                    summary.append(label, state);
                    const origin = document.createElement('p');
                    origin.className = 'prd-observer-origin';
                    origin.textContent = observer.origin;
                    const steps = document.createElement('ol');
                    observer.steps.forEach(step => {
                        const item = document.createElement('li');
                        item.textContent = step;
                        steps.appendChild(item);
                    });
                    const note = document.createElement('p');
                    note.className = 'prd-observer-note';
                    note.textContent = observer.note;
                    detailsElement.append(summary, origin, steps, note);
                    detailsElement.addEventListener('toggle', () => {
                        portfolioLog('architecture', 'debug', 'observer-toggled', { appId: app.id, panel: tab.id, lane: observer.id, open: detailsElement.open });
                    });
                    observerSection.appendChild(detailsElement);
                });
                panel.appendChild(observerSection);
            }

            prdArchitecturePanels.appendChild(panel);
            panels.push(panel);
        });

        const activateTab = (tabIndex, shouldFocus = false) => {
            tabs.forEach((tabButton, index) => {
                const active = index === tabIndex;
                tabButton.setAttribute('aria-selected', String(active));
                tabButton.tabIndex = active ? 0 : -1;
                panels[index].hidden = !active;
            });
            if (shouldFocus) tabs[tabIndex].focus();
            portfolioLog('architecture', 'debug', 'panel-selected', { appId: app.id, panel: architecture.tabs[tabIndex].id });
        };

        tabs.forEach((tabButton, tabIndex) => {
            tabButton.addEventListener('click', () => activateTab(tabIndex));
            tabButton.addEventListener('keydown', event => {
                let nextIndex = tabIndex;
                if (event.key === 'ArrowRight') nextIndex = (tabIndex + 1) % tabs.length;
                else if (event.key === 'ArrowLeft') nextIndex = (tabIndex - 1 + tabs.length) % tabs.length;
                else if (event.key === 'Home') nextIndex = 0;
                else if (event.key === 'End') nextIndex = tabs.length - 1;
                else return;
                event.preventDefault();
                activateTab(nextIndex, true);
            });
        });

        portfolioLog('architecture', 'debug', 'architecture-rendered', {
            appId: app.id,
            panelCount: architecture.tabs.length,
            stageCount: architecture.tabs.reduce((total, tab) => total + tab.stages.length, 0),
            observerLaneCount: architecture.tabs.reduce((total, tab) => total + (tab.observers?.length || 0), 0)
        });
    }

    function openAppModal(appId, returnFocus = document.activeElement) {
        const app = appsData.find(a => a.id === appId);
        if (!app || !appModal || !modalIcon || !modalTitle || !modalCategory || !modalDate || !modalDesc || !modalModelSpecs || !modalModelSpecsTitle || !modalModelSpecsNote || !modalModelSpecGroups || !modalFeatureDetails || !modalScreenshots || !modalScreenshotsSection || !modalApkDownload || !modalApkLabel || !modalSecondaryDownload || !modalSecondaryLabel || !modalTertiaryAction || !modalTertiaryLabel || !modalPlatformActions || !modalDownloadStats || !modalPrdResource || !modalChangelogResource || !modalCodeResources || !modalPrdHeading || !modalChangelogHeading || !modalCodeHeading) return;

        appModal.dataset.appId = String(app.id);
        modalReturnFocus = returnFocus instanceof HTMLElement ? returnFocus : null;

        modalIcon.style.background = app.gradient;
        modalIcon.classList.toggle('has-image', Boolean(app.iconImage));
        modalIcon.innerHTML = app.iconImage
            ? `<img src="${app.iconImage}" alt="${app.title} 头像">`
            : `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="${app.iconStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${app.iconSVG}</svg>`;
        modalTitle.textContent = app.title;
        modalCategory.textContent = app.category;
        modalDate.textContent = app.date;

        modalDesc.textContent = app.desc;
        renderPrdArchitecture(app);
        modalModelSpecGroups.replaceChildren();
        if (app.modelSpecs?.groups?.length) {
            modalModelSpecsTitle.textContent = app.modelSpecs.heading || '模型参数与训练口径';
            modalModelSpecsNote.textContent = app.modelSpecs.note || '';
            app.modelSpecs.groups.forEach(group => {
                const groupElement = document.createElement('section');
                groupElement.className = 'model-spec-group';

                const heading = document.createElement('h4');
                heading.textContent = group.title;
                groupElement.appendChild(heading);

                const list = document.createElement('dl');
                group.items.forEach(([label, value]) => {
                    const row = document.createElement('div');
                    row.className = 'model-spec-row';
                    const term = document.createElement('dt');
                    term.textContent = label;
                    const description = document.createElement('dd');
                    description.textContent = value;
                    row.append(term, description);
                    list.appendChild(row);
                });
                groupElement.appendChild(list);
                modalModelSpecGroups.appendChild(groupElement);
            });
            modalModelSpecs.hidden = false;
            portfolioLog('model-specs', 'debug', 'specs-rendered', {
                appId: app.id,
                groupCount: app.modelSpecs.groups.length,
                rowCount: app.modelSpecs.groups.reduce((total, group) => total + group.items.length, 0)
            });
        } else {
            modalModelSpecsTitle.textContent = '模型参数与训练口径';
            modalModelSpecsNote.textContent = '';
            modalModelSpecs.hidden = true;
        }
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

        const screenshotUrls = Array.isArray(app.screenshots) ? app.screenshots : [];
        modalScreenshots.classList.toggle('is-landscape', app.screenshotLayout === 'landscape');
        modalScreenshotsSection.hidden = screenshotUrls.length === 0;
        modalScreenshots.replaceChildren();
        screenshotUrls.forEach((url, index) => {
            const alt = app.screenshotAlts?.[index] || `${app.title} 截图 ${index + 1}`;
            const figure = document.createElement('figure');
            figure.className = 'screenshot-item';
            const zoomButton = document.createElement('button');
            zoomButton.type = 'button';
            zoomButton.className = 'screenshot-zoom';
            zoomButton.setAttribute('aria-label', `放大查看：${alt}`);
            const image = document.createElement('img');
            image.src = url;
            image.alt = alt;
            image.decoding = 'async';
            zoomButton.appendChild(image);
            figure.appendChild(zoomButton);
            if (app.screenshotCaptions?.[index]) {
                const caption = document.createElement('figcaption');
                caption.textContent = app.screenshotCaptions[index];
                figure.appendChild(caption);
            }
            modalScreenshots.appendChild(figure);
        });
        modalIcon.querySelector('img')?.addEventListener('error', () => {
            portfolioLog('media', 'warn', 'image-load-failed', { appId: app.id, kind: 'avatar' });
        }, { once: true });
        modalScreenshots.querySelectorAll('img').forEach((image, index) => {
            image.addEventListener('error', () => {
                portfolioLog('media', 'warn', 'image-load-failed', { appId: app.id, kind: 'screenshot', index });
            }, { once: true });
        });
        portfolioLog('media', 'debug', 'media-rendered', {
            appId: app.id,
            iconType: app.iconImage ? 'image' : 'svg',
            screenshotCount: screenshotUrls.length
        });
        const primaryAction = app.apk || app.primaryAction || app.downloads?.[0];
        const secondaryAction = app.secondaryAction || app.downloads?.[1];
        const tertiaryAction = app.tertiaryAction;
        const platformStatus = modalPlatformActions.querySelector('.app-modal-platform-status');
        if (primaryAction) {
            const primaryIsDownload = Boolean(app.apk || app.downloads?.length || primaryAction.download);
            modalApkDownload.href = primaryAction.url;
            modalApkLabel.textContent = primaryAction.label;
            modalApkDownload.dataset.countDownload = app.apk ? 'true' : 'false';
            modalApkDownload.classList.toggle('is-navigation', !primaryIsDownload);
            if (primaryIsDownload) {
                modalApkDownload.setAttribute('download', '');
            } else {
                modalApkDownload.removeAttribute('download');
            }
            if (secondaryAction) {
                const secondaryIsDownload = Boolean(app.downloads?.length || secondaryAction.download);
                modalSecondaryDownload.href = secondaryAction.url;
                modalSecondaryLabel.textContent = secondaryAction.label;
                modalSecondaryDownload.classList.toggle('is-navigation', !secondaryIsDownload);
                if (secondaryIsDownload) modalSecondaryDownload.setAttribute('download', '');
                else modalSecondaryDownload.removeAttribute('download');
                modalSecondaryDownload.hidden = false;
                modalSecondaryDownload.style.removeProperty('display');
            } else {
                modalSecondaryDownload.classList.remove('is-navigation');
                modalSecondaryDownload.hidden = true;
                modalSecondaryDownload.style.display = 'none';
            }
            if (tertiaryAction) {
                modalTertiaryAction.href = tertiaryAction.url;
                modalTertiaryLabel.textContent = tertiaryAction.label;
                modalTertiaryAction.hidden = false;
                modalTertiaryAction.style.removeProperty('display');
            } else {
                modalTertiaryAction.hidden = true;
                modalTertiaryAction.style.display = 'none';
            }
            if (platformStatus) {
                const statusText = app.platformStatus || (app.apk ? '苹果版开发中' : primaryAction.status);
                platformStatus.textContent = statusText || '';
                platformStatus.hidden = !statusText;
                platformStatus.style.display = statusText ? '' : 'none';
            }

            modalPlatformActions.hidden = false;
            modalPlatformActions.style.removeProperty('display');
            modalApkDownload.hidden = false;
            modalApkDownload.style.removeProperty('display');
            modalDownloadStats.hidden = !app.apk;
            modalDownloadStats.style.display = app.apk ? '' : 'none';
            if (app.apk) refreshDownloadCount();
        } else {
            modalApkDownload.classList.remove('is-navigation');
            modalSecondaryDownload.classList.remove('is-navigation');
            modalTertiaryAction.hidden = true;
            modalTertiaryAction.style.display = 'none';
            modalPlatformActions.hidden = true;
            modalPlatformActions.style.display = 'none';
            modalApkDownload.hidden = true;
            modalApkDownload.style.display = 'none';
            modalSecondaryDownload.hidden = true;
            modalSecondaryDownload.style.display = 'none';
            modalDownloadStats.hidden = true;
            modalDownloadStats.style.display = 'none';
            if (platformStatus) {
                platformStatus.hidden = true;
                platformStatus.style.display = 'none';
            }
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
        const resourceCard = (title, href, intro, directDownload = false) => {
            if (!href) return '';
            const downloadName = typeof directDownload === 'string' ? `="${directDownload}"` : '';
            const linkAttrs = directDownload ? ` download${downloadName}` : ' target="_blank" rel="noopener"';
            return `<a class="doc-card doc-card-link" href="${href}" data-project-resource="${title}"${linkAttrs}><strong>${title}<span aria-hidden="true">${directDownload ? ' ↓' : ' ↗'}</span></strong><p>${intro}</p></a>`;
        };
        if (app.resources) {
            modalPrdHeading.textContent = app.resources.first.heading;
            modalChangelogHeading.textContent = app.resources.second.heading;
            modalCodeHeading.textContent = app.resources.codeHeading;
            modalPrdResource.innerHTML = resourceCard(app.resources.first.title, app.resources.first.href, app.resources.first.intro, app.resources.first.download);
            modalChangelogResource.innerHTML = resourceCard(app.resources.second.title, app.resources.second.href, app.resources.second.intro, app.resources.second.download);
            modalCodeResources.innerHTML = app.resources.code.map(item => resourceCard(item.title, item.href, item.intro, item.download)).join('');
        } else {
            const resourceCopy = { ...defaultResourceCopy, ...(app.resourceCopy || {}) };
            modalPrdHeading.textContent = '01 · PRD';
            modalChangelogHeading.textContent = '02 · 改动记录';
            modalCodeHeading.textContent = '03 · GitHub 与 README';
            modalPrdResource.innerHTML=resourceCard('在线阅读完整 PRD',linkMap['PRD'],resourceCopy.prd);
            modalChangelogResource.innerHTML=resourceCard('在线阅读完整版本记录',linkMap['完整改动记录'],resourceCopy.changelog);
            modalCodeResources.innerHTML=[
                resourceCard('GitHub 仓库',linkMap['GitHub'],resourceCopy.github),
                resourceCard('README',linkMap['README'],resourceCopy.readme)
            ].join('');
        }

        appModal.classList.add('open');
        appModal.setAttribute('aria-hidden', 'false');
        const modalContent = appModal.querySelector('.app-modal-content');
        if (modalContent) modalContent.scrollTop = 0;
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => appModal.querySelector('.app-modal-close')?.focus());
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
        const image = event.target.closest('.screenshot-zoom')?.querySelector('img');
        if (image) openImageLightbox(image);
    });

    imageLightboxClose?.addEventListener('click', closeImageLightbox);
    imageLightbox?.addEventListener('click', (event) => {
        if (event.target === imageLightbox) closeImageLightbox();
    });

    appModal?.addEventListener('click', (event) => {
        const resourceLink = event.target.closest('[data-project-resource]');
        if (!resourceLink) return;
        portfolioLog('resources', 'debug', 'resource-open', {
            appId: Number(appModal.dataset.appId),
            resource: resourceLink.dataset.projectResource,
            delivery: resourceLink.hasAttribute('download') ? 'download' : 'read'
        });
    });

    function closeAppModal() {
        if (!appModal) return;
        appModal.classList.remove('open');
        appModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        const returnTarget = modalReturnFocus;
        modalReturnFocus = null;
        if (returnTarget?.isConnected) requestAnimationFrame(() => returnTarget.focus());
    }

    function trapModalFocus(event) {
        if (event.key !== 'Tab' || !appModal?.classList.contains('open') || imageLightbox?.classList.contains('open')) return;
        const focusable = [...appModal.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')]
            .filter(element => !element.hidden && element.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    function setWorksFeedback(message) {
        if (!worksFeedback) return;
        worksFeedback.textContent = message;
        clearTimeout(setWorksFeedback.timeout);
        setWorksFeedback.timeout = setTimeout(() => {
            if (worksFeedback.textContent === message) worksFeedback.textContent = '';
        }, 3200);
    }

    function saveLikedApps() {
        try {
            localStorage.setItem(likeStorageKey, JSON.stringify([...likedAppIds]));
        } catch (error) {
            portfolioLog('likes', 'warn', 'liked-state-write-failed', { reason: error?.name || 'unknown' });
        }
    }

    async function loadLikeCounts() {
        portfolioLog('likes', 'debug', 'counts-load-start', { projectCount: appsData.length });
        const failures = [];
        await Promise.all(appsData.map(async app => {
            try {
                const response = await requestWithTimeout(`${likeApiBase}/get/${likeCounterKey(app.id)}`);
                if (!response.ok) throw new Error(`http-${response.status}`);
                const data = await response.json();
                const value = Number(data?.value ?? data?.count);
                if (Number.isFinite(value) && value >= 0) app.likes = value;
            } catch (error) {
                failures.push({ appId: app.id, reason: error?.message || error?.name || 'unknown' });
            }
        }));
        renderWorks();
        if (failures.length) portfolioLog('likes', 'warn', 'counts-load-partial', { failures });
        portfolioLog('likes', 'debug', 'counts-load-complete');
    }

    async function likeApp(appId) {
        const app = appsData.find(item => item.id === appId);
        if (!app || pendingLikeIds.has(appId)) return;
        if (likedAppIds.has(appId)) {
            setWorksFeedback(`你已经喜欢过「${app.shortName}」了`);
            return;
        }
        pendingLikeIds.add(appId);
        renderWorks();
        portfolioLog('likes', 'debug', 'like-submit-start', { appId });
        try {
            const response = await requestWithTimeout(`${likeApiBase}/hit/${likeCounterKey(appId)}`);
            if (!response.ok) throw new Error(`http-${response.status}`);
            const data = await response.json();
            const value = Number(data?.value ?? data?.count);
            if (!Number.isFinite(value)) throw new Error('invalid-count');
            app.likes = value;
            likedAppIds.add(appId);
            saveLikedApps();
            setWorksFeedback(`谢谢喜欢「${app.shortName}」`);
            portfolioLog('likes', 'debug', 'like-submit-success', { appId, value });
        } catch (error) {
            setWorksFeedback('点赞暂时没有记录成功，请稍后再试');
            portfolioLog('likes', 'error', 'like-submit-failed', { appId, reason: error?.message || error?.name || 'unknown' });
        } finally {
            pendingLikeIds.delete(appId);
            renderWorks();
        }
    }

    worksFilters?.addEventListener('click', event => {
        const button = event.target.closest('[data-work-sort]');
        if (!button) return;
        portfolioState.sort = button.dataset.workSort;
        worksFilters.querySelectorAll('[data-work-sort]').forEach(item => {
            const active = item === button;
            item.classList.toggle('active', active);
            item.setAttribute('aria-pressed', String(active));
        });
        renderWorks();
        portfolioLog('filters', 'debug', 'sort-changed', { sort: portfolioState.sort });
    });

    workStatusFilter?.addEventListener('change', event => {
        portfolioState.status = event.target.value;
        renderWorks();
        portfolioLog('filters', 'debug', 'status-changed', { status: portfolioState.status, visibleCount: getVisibleApps().length });
    });

    worksGrid?.addEventListener('click', (e) => {
        const likeButton = e.target.closest('[data-like-app]');
        if (likeButton) {
            e.stopPropagation();
            likeApp(Number(likeButton.dataset.likeApp));
            return;
        }
        const wrapper = e.target.closest('.work-card');
        if (!wrapper) return;
        const appId = parseInt(wrapper.dataset.app);
        openAppModal(appId, wrapper.querySelector('.btn-view-work'));
    });

    loadLikeCounts();

    appModal?.querySelectorAll('[data-close-modal]').forEach(el => {
        el.addEventListener('click', closeAppModal);
    });

    document.addEventListener('keydown', (e) => {
        trapModalFocus(e);
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
            project: '0.015B 自研模型',
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
            title: '0.015B 自研模型',
            text: '用 PyTorch 实现 Tokenizer、Causal Self-Attention、多头注意力、残差、LayerNorm 与 FFN，并以 14.88M 参数冻结版本建立模型边界的直观理解。',
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
            business: ['整理主案例：PRD Agent 2.0；辅助案例：数学题闹钟与 0.015B 自研模型', '录制中文 10 分钟演示与英文 3 分钟项目介绍', '邀请产品或技术同学按统一标准进行模拟面试'],
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
