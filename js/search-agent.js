document.addEventListener('DOMContentLoaded', () => {
    const isLocal = ['127.0.0.1', 'localhost'].includes(window.location.hostname);
    const apiRoot = isLocal
        ? `${window.location.protocol}//${window.location.hostname}:8000`
        : '/search-eval-api';
    const protectedToolApiRoot = isLocal ? apiRoot : '/search-eval-api';
    const ownerLogin = document.getElementById('agentOwnerLogin');
    const ownerLoginForm = document.getElementById('agentOwnerLoginForm');
    const ownerUsername = document.getElementById('agentOwnerUsername');
    const ownerPassword = document.getElementById('agentOwnerPassword');
    const ownerLoginButton = document.getElementById('agentOwnerLoginButton');
    const ownerLoginStatus = document.getElementById('agentOwnerLoginStatus');
    const ownerLogoutButton = document.getElementById('agentOwnerLogoutButton');
    const protectedWorkbench = document.getElementById('agentProtectedWorkbench');
    const startButton = document.getElementById('agentStartAnalysis');
    const decisionState = document.getElementById('agentDecisionState');
    const strategyName = document.getElementById('agentStrategyName');
    const proposalGrid = document.getElementById('agentProposalGrid');
    const evidenceStrip = document.getElementById('agentEvidenceStrip');
    const diagnosisSummary = document.getElementById('agentDiagnosisSummary');
    const experimentTable = document.getElementById('agentExperimentTable');
    const gateChecks = document.getElementById('agentGateChecks');
    const modelMode = document.getElementById('agentModelMode');
    const queryComparisonList = document.getElementById('queryComparisonList');
    const queryComparisonCount = document.getElementById('queryComparisonCount');
    const pipelineDiagnosisState = document.getElementById('pipelineDiagnosisState');
    const pipelineStageGrid = document.getElementById('pipelineStageGrid');
    const pipelineDecisionSummary = document.getElementById('pipelineDecisionSummary');
    const pipelineEvidenceStrip = document.getElementById('pipelineEvidenceStrip');
    const agentRuntimeState = document.getElementById('agentRuntimeState');
    const agentRuntimeTraceId = document.getElementById('agentRuntimeTraceId');
    const agentRuntimeIdentity = document.getElementById('agentRuntimeIdentity');
    const agentRuntimeCounts = document.getElementById('agentRuntimeCounts');
    const agentRuntimeReplay = document.getElementById('agentRuntimeReplay');
    const agentRuntimeTimeline = document.getElementById('agentRuntimeTimeline');
    const agentEvalRunButton = document.getElementById('agentEvalRunButton');
    const agentEvalStatus = document.getElementById('agentEvalStatus');
    const agentEvalResult = document.getElementById('agentEvalResult');
    const queryConstructorBuildButton = document.getElementById('queryConstructorBuildButton');
    const queryConstructorStatus = document.getElementById('queryConstructorStatus');
    const queryConstructorResult = document.getElementById('queryConstructorResult');
    const badCaseRunButton = document.getElementById('badCaseRunButton');
    const badCaseStatus = document.getElementById('badCaseStatus');
    const badCaseResult = document.getElementById('badCaseResult');
    const diagnosticPlanButton = document.getElementById('diagnosticPlanButton');
    const diagnosticPlanStatus = document.getElementById('diagnosticPlanStatus');
    const diagnosticPlanResult = document.getElementById('diagnosticPlanResult');
    const humanOracleStartButton = document.getElementById('humanOracleStartButton');
    const humanOracleStatus = document.getElementById('humanOracleStatus');
    const humanOracleResult = document.getElementById('humanOracleResult');
    const humanOracleIntentProgress = document.getElementById('humanOracleIntentProgress');
    const humanOracleBehaviorProgress = document.getElementById('humanOracleBehaviorProgress');
    const humanOracleClusterProgress = document.getElementById('humanOracleClusterProgress');
    const agentContract = window.SearchAgentContract;
    const agentToolsContract = window.SearchAgentToolsContract;
    const ownerAuthModule = window.SearchAgentAuth;
    let latestBadCaseSummary = null;
    let humanOracleState = null;
    let humanOracleView = null;
    let ownerAuthSession = null;

    const authenticatedFetch = (...args) => {
        if (!ownerAuthSession) {
            return Promise.reject(new Error('owner_auth_session_unavailable'));
        }
        return ownerAuthSession.fetch(...args);
    };

    const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[character]));

    const enabledDebugModules = () => new Set(
        (localStorage.getItem('shaw.debug.search-console.modules') || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
    );

    const debug = (event, context = {}) => {
        if (localStorage.getItem('shaw.debug.search-console') !== '1') return;
        const modules = enabledDebugModules();
        if (modules.size && !modules.has('agent-ui')) return;
        console.debug('[search-console:agent-ui]', {
            timestamp: new Date().toISOString(),
            event,
            ...context
        });
    };

    const runtimeDebug = (event, context = {}) => {
        if (localStorage.getItem('shaw.debug.search-console') !== '1') return;
        const modules = enabledDebugModules();
        if (modules.size && !modules.has('agent-runtime-ui')) return;
        console.debug('[search-console:agent-runtime-ui]', {
            timestamp: new Date().toISOString(),
            event,
            ...context
        });
    };

    const toolUiLog = (module, event, context = {}, level = 'debug') => {
        if (![
            'agent-eval-ui',
            'query-constructor-ui',
            'bad-case-ui',
            'diagnostic-experiment-ui',
            'human-oracle-ui'
        ].includes(module)) return;
        if (localStorage.getItem('shaw.debug.search-console') !== '1') return;
        const modules = enabledDebugModules();
        if (modules.size && !modules.has(module)) return;
        const writer = level === 'warn' ? console.warn : console.debug;
        writer(`[search-console:${module}]`, {
            timestamp: new Date().toISOString(),
            event,
            ...context
        });
    };

    const ownerAuthUiLog = (event, context = {}, level = 'debug') => {
        if (localStorage.getItem('shaw.debug.search-console') !== '1') return;
        const modules = enabledDebugModules();
        if (modules.size && !modules.has('owner-auth-ui')) return;
        const writer = level === 'warn' ? console.warn : console.debug;
        writer('[search-console:owner-auth-ui]', {
            timestamp: new Date().toISOString(),
            event,
            ...context
        });
    };

    const setOwnerLoginStatus = (message, className = '') => {
        if (!ownerLoginStatus) return;
        ownerLoginStatus.classList.remove('is-error', 'is-success');
        ownerLoginStatus.textContent = message;
        if (className) ownerLoginStatus.classList.add(className);
    };

    const lockOwnerWorkbench = (message, focusLogin = false) => {
        protectedWorkbench.hidden = true;
        ownerLogin.hidden = false;
        ownerPassword.value = '';
        setOwnerLoginStatus(message, message.includes('失效') ? 'is-error' : '');
        if (focusLogin) ownerUsername.focus();
    };

    const unlockOwnerWorkbench = () => {
        ownerLogin.hidden = true;
        protectedWorkbench.hidden = false;
        setOwnerLoginStatus('登录成功。', 'is-success');
        startButton.focus();
    };

    const initializeOwnerAuth = () => {
        if (!ownerAuthModule?.createSession) {
            setOwnerLoginStatus('登录组件未能加载，请刷新页面。', 'is-error');
            ownerLoginButton.disabled = true;
            ownerAuthUiLog('initialization_failed', {
                errorCode: 'auth_module_unavailable'
            }, 'warn');
            return;
        }
        try {
            const ownerRouteSuffixes = [
                'strategy/propose',
                'retrieval/analyze',
                'eval/run',
                'query-constructor/build',
                'bad-cases/run',
                'diagnostic-experiments/plan',
                'human-oracle/batches/create',
                'human-oracle/batches/status',
                'human-oracle/intents/view',
                'human-oracle/intents/submit',
                'human-oracle/behaviors/view',
                'human-oracle/behaviors/submit',
                'human-oracle/batches/seal'
            ];
            const allowedRequestPaths = ownerRouteSuffixes.map(
                (suffix) => `/search-eval-api/agent/${suffix}`
            );
            ownerAuthSession = ownerAuthModule.createSession({
                fetchImpl: window.fetch.bind(window),
                validationUrl: '/search-agent-auth-check.json',
                baseUrl: window.location.href,
                allowedRequestPaths,
                onEvent: (event, context) => {
                    ownerAuthUiLog(event, context, event.includes('failed') ? 'warn' : 'debug');
                    if (event === 'session_expired') {
                        lockOwnerWorkbench('登录状态已失效，请重新登录。', true);
                    }
                }
            });
            ownerAuthUiLog('initialized');
        } catch (error) {
            setOwnerLoginStatus('登录组件初始化失败，请刷新页面。', 'is-error');
            ownerLoginButton.disabled = true;
            ownerAuthUiLog('initialization_failed', {
                errorCode: error.code || 'auth_runtime_unavailable'
            }, 'warn');
        }
    };

    const submitOwnerLogin = async (event) => {
        event.preventDefault();
        if (!ownerAuthSession || ownerLoginButton.disabled) return;
        const username = ownerUsername.value;
        let password = ownerPassword.value;
        ownerPassword.value = '';
        ownerLoginButton.disabled = true;
        ownerLoginButton.textContent = '验证中…';
        setOwnerLoginStatus('正在验证站长身份…');
        try {
            await ownerAuthSession.authenticate(username, password);
            password = '';
            ownerLoginForm.reset();
            unlockOwnerWorkbench();
        } catch (error) {
            password = '';
            const rejected = error.code === 'credentials_rejected';
            setOwnerLoginStatus(
                rejected ? '账号或密码不正确，请重新输入。' : '登录服务暂时不可用，请稍后重试。',
                'is-error'
            );
            ownerAuthUiLog('login_failed', {
                errorCode: error.code || 'auth_unknown_error',
                statusCode: Number(error.status) || 0
            }, 'warn');
            (rejected ? ownerPassword : ownerUsername).focus();
        } finally {
            password = '';
            ownerLoginButton.disabled = false;
            ownerLoginButton.textContent = '登录工作台';
        }
    };

    const logoutOwner = () => {
        ownerAuthSession?.clear('logout');
        ownerAuthUiLog('logged_out');
        window.location.reload();
    };

    const setState = (label, className = '') => {
        if (!decisionState) return;
        decisionState.classList.remove('is-running', 'is-error', 'is-pending');
        decisionState.textContent = label;
        if (className) decisionState.classList.add(className);
    };

    const formatDelta = (value) => {
        const number = Number(value);
        if (!Number.isFinite(number)) return '—';
        return `${number > 0 ? '+' : ''}${number.toFixed(4)}`;
    };

    const formatMetric = (value) => {
        const number = Number(value);
        return Number.isFinite(number) ? number.toFixed(4) : '—';
    };

    const formatPercent = (value) => {
        const number = Number(value);
        return Number.isFinite(number) ? `${(number * 100).toFixed(2)}%` : '—';
    };

    const formatPointDelta = (value) => {
        const number = Number(value);
        if (!Number.isFinite(number)) return '—';
        return `${number > 0 ? '+' : ''}${(number * 100).toFixed(2)} 个百分点`;
    };

    const rootCauseLabels = {
        numeric_token: '型号 / 数字词缺失',
        coverage_gap: 'Query 词覆盖不足',
        exact_phrase_displaced: '完整短语被压后',
        missing_title_signal: '标题没有词法信号'
    };

    const candidateLabels = {
        'candidate-title-bm25-exact-boost-v1': '标题 BM25 精确匹配加权',
        'exact-conservative-v1': '保守精确匹配加权',
        'exact-numeric-v1': '型号与数字词强化',
        'exact-coverage-v1': '查询词覆盖强化',
        'exact-phrase-v1': '完整短语强化'
    };

    const candidateFallbacks = {
        'candidate-title-bm25-exact-boost-v1': {
            target_problem: '标题词法信号不足，完整 Query、型号数字词或整体覆盖没有在排序中得到足够体现。',
            mechanism: '在标题 BM25 基础分上叠加查询词覆盖率、型号数字词命中率和完整短语命中三项确定性加分，再对同一候选集重排。',
            expected_benefit: '让标题更完整命中 Query 的商品更靠前，同时保持规则透明、可复现。',
            risk: '配件标题或堆叠关键词的标题可能被误提权，必须检查局部 Query 退化。'
        },
        'exact-conservative-v1': {
            target_problem: '根因信号较弱或样本较少，先验证精确匹配方向是否有效。',
            mechanism: '在标题 BM25 分数上小幅叠加查询词覆盖、型号数字词和完整短语三类加分，只调整现有候选的顺序。',
            expected_benefit: '以较小改动验证精确匹配方向，优先控制大幅退化风险。',
            risk: '加权较小，可能不足以改变当前错误排序。'
        },
        'exact-numeric-v1': {
            target_problem: 'Query 中含型号、版本、尺寸或数量，但当前结果没有完整保留这些强约束。',
            mechanism: '提高标题中型号与数字词的匹配权重，同时保留查询词覆盖和完整短语加分，优先保护强约束商品。',
            expected_benefit: '保护型号、版本、尺寸等强约束意图，避免泛匹配商品挤压精确结果。',
            risk: '配件或兼容商品也可能包含相同型号，存在误提权风险。'
        },
        'exact-coverage-v1': {
            target_problem: '高位商品只命中少量泛词，标题覆盖 Query 的程度不足。',
            mechanism: '按标题命中的去重 Query 词比例加分；覆盖越完整，加分越高，再与 BM25 基础分合并排序。',
            expected_benefit: '上移标题覆盖更多 Query 词的商品，压低只命中少量泛词的结果。',
            risk: '堆叠关键词的标题可能因词面覆盖率高而被过度提权。'
        },
        'exact-phrase-v1': {
            target_problem: '完整长尾短语已经出现在商品标题中，但仍被拆词命中的泛结果压后。',
            mechanism: '标题连续包含标准化后的完整 Query 时追加固定短语分，再叠加较小的覆盖和型号数字词加分。',
            expected_benefit: '标题连续包含完整 Query 时追加较强加分，保护长尾精确意图。',
            risk: '完整短语命中不一定等于商品完全相关，配件仍可能误升。'
        }
    };

    const coreMetrics = [
        { key: 'success@5', label: 'Success@5', description: '前 5 个结果是否至少有 1 个相关商品' },
        { key: 'mrr@10', label: 'MRR@10', description: '第一个相关商品在 Top 10 中是否足够靠前' },
        { key: 'ndcg@10', label: 'nDCG@10', description: 'Top 10 整体相关性与排序位置是否合理' }
    ];

    const gateLabels = {
        'ndcg@10_minimum': '整体 nDCG@10 至少提升',
        'ndcg@5_floor': 'Top 5 质量下降不超限',
        'mrr@10_floor': '首个相关结果位置不得变差',
        'success@1_floor': '首位命中率不得下降',
        'success@5_floor': 'Top 5 命中率不得下降',
        'ndcg@10_regression_rate_ceiling': '退化 Query 比例不超限',
        'worst_ndcg@10_regression_ceiling': '单 Query 最差退化不超限'
    };

    const parameterLabels = {
        coverage_boost: ['查询词覆盖加权', '按标题命中的去重 Query 词占比加分'],
        numeric_boost: ['型号与数字词加权', '按标题命中的数字或型号词占比加分'],
        phrase_boost: ['完整短语加权', '标题连续包含完整 Query 时追加固定分']
    };

    const metricClass = (value) => {
        const number = Number(value);
        if (!Number.isFinite(number)) return '';
        if (number > 1e-12) return 'metric-up';
        if (number < -1e-12) return 'metric-risk';
        return 'metric-neutral';
    };

    const metricPayload = (metrics, key) => metrics?.[key] || {};

    const renderMetricTriplet = (metrics, { compact = false, descriptions = false } = {}) => `
        <div class="metric-triplet ${compact ? 'is-compact' : ''}">${coreMetrics.map((definition) => {
            const values = metricPayload(metrics, definition.key);
            return `<div class="metric-item">
                <span>${escapeHtml(definition.label)}</span>
                <strong class="${metricClass(values.delta)}">${escapeHtml(formatDelta(values.delta))}</strong>
                <small>${escapeHtml(formatMetric(values.baseline))} → ${escapeHtml(formatMetric(values.candidate))}</small>
                ${descriptions ? `<p>${escapeHtml(definition.description)}</p>` : ''}
            </div>`;
        }).join('')}</div>`;

    const renderMetricSnapshot = (metrics, side) => `
        <div class="query-column-metrics">${coreMetrics.map((definition) => {
            const values = metricPayload(metrics, definition.key);
            return `<span><b>${escapeHtml(definition.label)}</b>${escapeHtml(formatMetric(values[side]))}</span>`;
        }).join('')}</div>`;

    const candidatePresentation = ({ candidate = {}, catalogEntry = {}, explanation = {} } = {}) => {
        const candidateId = candidate.candidate_id || candidate.strategy_id || '';
        const fallback = candidateFallbacks[candidateId] || {};
        const rawParameters = candidate.parameters || candidate.config || {};
        const parameters = Array.isArray(explanation.parameters) && explanation.parameters.length
            ? explanation.parameters
            : Object.entries(parameterLabels).map(([key, [label, meaning]]) => ({
                key, label, meaning, value: rawParameters[key]
            }));
        return {
            name: candidateLabels[candidateId] || catalogEntry.name || '候选策略',
            stage: explanation.stage || catalogEntry.stage || '候选集词法排序',
            targetProblem: explanation.target_problem || fallback.target_problem || '基于本轮失败样本选择的词法排序问题',
            mechanism: explanation.mechanism || fallback.mechanism || '在标题 BM25 基础分上追加可解释分项，并只重排既有候选集。',
            formula: explanation.scoring_formula || '最终得分 = 标题 BM25 基础分 + 查询词覆盖加分 + 型号数字词加分 + 完整短语加分',
            expectedBenefit: explanation.expected_benefit || fallback.expected_benefit || catalogEntry.description || '等待 Agent 返回预期收益。',
            risk: explanation.risk || fallback.risk || '需通过同集评测与发布门禁确认风险。',
            supportCount: Number(explanation.support_count ?? candidate.support_count) || 0,
            parameters
        };
    };

    const renderParameterList = (parameters) => `
        <div class="strategy-parameter-list">${(Array.isArray(parameters) ? parameters : []).map((parameter) => {
            const fallback = parameterLabels[parameter.key] || [parameter.label || '策略参数', parameter.meaning || ''];
            return `<div>
                <span>${escapeHtml(parameter.label || fallback[0])}</span>
                <strong>${escapeHtml(formatMetric(parameter.value))}</strong>
                <small>${escapeHtml(parameter.meaning || fallback[1])}</small>
            </div>`;
        }).join('')}</div>`;

    const renderReasoning = (proposal) => {
        const analysis = proposal?.analysis || {};
        const counts = analysis.root_cause_counts || {};
        const causeRows = Object.entries(rootCauseLabels)
            .map(([key, label]) => ({ key, label, count: Number(counts[key]) || 0 }))
            .filter((item) => item.count > 0);
        diagnosisSummary.innerHTML = `
            <div class="diagnosis-total"><strong>${escapeHtml(analysis.diagnosis_count || 0)}</strong><span>个 Query 已扫描</span></div>
            <ul class="diagnosis-list">${causeRows.length ? causeRows.map((item) => `
                <li><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.count)}</strong></li>`).join('') : '<li><span>未发现已实现策略可处理的根因</span><strong>0</strong></li>'}</ul>`;

        const experiment = proposal?.experiment || {};
        const evaluations = Array.isArray(experiment.evaluations) ? experiment.evaluations : [];
        const selectedId = experiment.selected_evaluation_id;
        experimentTable.innerHTML = evaluations.length ? `
            <div class="experiment-list">${evaluations.map((evaluation) => {
                const candidate = evaluation.candidate || {};
                const checks = evaluation.gates?.checks || [];
                const failures = checks.filter((check) => !check.passed);
                const selected = evaluation.evaluation_id === selectedId;
                const presentation = candidatePresentation({
                    candidate,
                    catalogEntry: evaluation.catalog_entry || {},
                    explanation: evaluation.explanation || {}
                });
                const evaluationMetrics = evaluation.metrics || {
                    'success@5': { delta: evaluation.success_at_5_delta },
                    'mrr@10': { delta: evaluation.mrr_at_10_delta },
                    'ndcg@10': { delta: evaluation.ndcg_at_10_delta }
                };
                const statusLabel = selected
                    ? evaluation.eligible ? '最终候选' : '本轮最佳候选（未通过门禁）'
                    : evaluation.eligible ? '通过门禁' : '门禁淘汰';
                return `<article class="experiment-row ${selected ? 'is-selected' : ''}">
                    <div class="experiment-name">
                        <span>${escapeHtml(statusLabel)}</span>
                        <strong>${escapeHtml(presentation.name)}</strong>
                        <div class="experiment-description">
                            <p><b>适用问题：</b>${escapeHtml(presentation.targetProblem)}</p>
                            <p><b>策略机制：</b>${escapeHtml(presentation.mechanism)}</p>
                            <p><b>评分公式：</b>${escapeHtml(presentation.formula)}</p>
                            <p><b>预期收益：</b>${escapeHtml(presentation.expectedBenefit)}</p>
                            <p><b>主要风险：</b>${escapeHtml(presentation.risk)}</p>
                        </div>
                        ${renderParameterList(presentation.parameters)}
                    </div>
                    <div class="experiment-metric"><span>三项核心指标</span>${renderMetricTriplet(evaluationMetrics, { compact: true })}</div>
                    <div class="experiment-gate"><span>发布门禁</span><strong class="${evaluation.eligible ? 'metric-up' : 'metric-risk'}">${evaluation.eligible ? '通过' : `未通过 ${failures.length} 项`}</strong><small>${escapeHtml(failures.map((item) => gateLabels[item.name] || item.name).join('；') || '全部门禁通过')}</small></div>
                </article>`;
            }).join('')}</div>` : '<p class="reasoning-empty">本轮没有返回候选实验。</p>';

        const releaseGate = proposal?.release_gate || {};
        const checks = Array.isArray(releaseGate.checks) ? releaseGate.checks : [];
        gateChecks.innerHTML = checks.length ? `<ul class="gate-list">${checks.map((check) => `
            <li class="${check.passed ? 'is-pass' : 'is-fail'}">
                <span>${escapeHtml(gateLabels[check.name] || check.name || '门禁')}</span>
                <strong>${check.passed ? '通过' : '未通过'}</strong>
                <small>${escapeHtml(formatDelta(check.observed))} ${escapeHtml(check.comparator || '')} ${escapeHtml(formatDelta(check.threshold))}</small>
            </li>`).join('')}</ul>` : '<p class="reasoning-empty">本轮没有返回发布门禁。</p>';

        const usage = proposal?.model_usage || {};
        modelMode.textContent = usage.mode === 'deterministic'
            ? '确定性规则 · 0 次模型调用'
            : `${usage.provider_id || '模型'} · ${Number(usage.calls) || 0} 次调用`;
        debug('optimizer_reasoning_rendered', {
            diagnosisCount: Number(analysis.diagnosis_count) || 0,
            candidateCount: evaluations.length,
            gatePassed: releaseGate.passed === true,
            selectedEvaluationId: selectedId || null
        });
    };

    const summarizeTopProducts = (products) => {
        const rows = Array.isArray(products) ? products.slice(0, 3) : [];
        if (!rows.length) return '暂无 Top 商品证据。';
        return rows
            .map((item) => `#${item.rank || '—'} ${item.product_id || '—'} / ${item.label || '—'}`)
            .join('；');
    };

    const resultLabel = (value) => ({
        E: 'Exact',
        S: 'Substitute',
        C: 'Complement',
        I: 'Irrelevant'
    }[String(value || '').toUpperCase()] || 'Unknown');

    const resultLabelClass = (value) => {
        const label = String(value || '').toUpperCase();
        return ['E', 'S', 'C', 'I'].includes(label) ? `label-${label.toLowerCase()}` : 'label-unknown';
    };

    const renderResultList = (results) => {
        const rows = Array.isArray(results) ? results.slice(0, 10) : [];
        if (!rows.length) return '<p class="result-list-empty">暂无排序结果</p>';
        return `<ol class="result-list">${rows.map((item, index) => `
            <li>
                <span class="result-rank">${escapeHtml(item.rank || index + 1)}</span>
                <div class="result-copy">
                    <strong>${escapeHtml(item.title || item.product_id || '未命名商品')}</strong>
                    <p><span>${escapeHtml(item.product_id || '—')}</span><span class="result-label ${resultLabelClass(item.label)}">${escapeHtml(resultLabel(item.label))}</span></p>
                </div>
                <span class="result-score">${escapeHtml(formatMetric(item.score))}</span>
            </li>`).join('')}</ol>`;
    };

    const renderQueryComparisons = (comparisonPayload) => {
        const sourceComparisonCount = Array.isArray(comparisonPayload) ? comparisonPayload.length : 0;
        const comparisonOrder = (left, right) => (
            Math.abs(Number(right['ndcg@10_delta']) || 0) - Math.abs(Number(left['ndcg@10_delta']) || 0)
            || (Number(left['baseline_ndcg@10']) || 0) - (Number(right['baseline_ndcg@10']) || 0)
            || (Number(left.query_id) || 0) - (Number(right.query_id) || 0)
        );
        const comparisons = (Array.isArray(comparisonPayload) ? comparisonPayload : [])
            .filter((item) => ['improvement', 'regression'].includes(item.outcome))
            .sort(comparisonOrder);
        const availableOutcomes = new Set(comparisons.map((item) => item.outcome));
        const initiallySelected = comparisons.slice(0, 10);
        const selectedOutcomes = new Set(initiallySelected.map((item) => item.outcome));
        if (initiallySelected.length && initiallySelected.length >= 2) {
            for (const requiredOutcome of ['improvement', 'regression']) {
                if (availableOutcomes.has(requiredOutcome) && !selectedOutcomes.has(requiredOutcome)) {
                    initiallySelected[initiallySelected.length - 1] = comparisons.find((item) => item.outcome === requiredOutcome);
                    selectedOutcomes.add(requiredOutcome);
                }
            }
        }
        const comparisonsForDisplay = initiallySelected.sort(comparisonOrder);
        const rows = comparisonsForDisplay.slice(0, 10);
        const outcomeCounts = rows.reduce((counts, item) => {
            counts[item.outcome] = (counts[item.outcome] || 0) + 1;
            return counts;
        }, {});
        queryComparisonCount.textContent = `${rows.length} 个变化样本 · 改善 ${outcomeCounts.improvement || 0} / 退化 ${outcomeCounts.regression || 0}`;
        if (!rows.length) {
            queryComparisonList.innerHTML = '<div class="query-comparison-empty">本轮没有排序发生变化的 Query；持平样本已省略。</div>';
            debug('query_comparisons_rendered', { sourceComparisonCount, comparisonCount: 0, outcomeCounts: {} });
            return;
        }

        queryComparisonList.innerHTML = rows.map((item, index) => {
            const outcome = ['improvement', 'regression'].includes(item.outcome) ? item.outcome : 'unknown';
            const outcomeLabel = {
                improvement: '改善', regression: '退化', unknown: '未判定'
            }[outcome];
            const itemMetrics = item.metrics || {
                'ndcg@10': {
                    baseline: item['baseline_ndcg@10'],
                    candidate: item['candidate_ndcg@10'],
                    delta: item['ndcg@10_delta']
                }
            };
            return `
                <article class="query-comparison-card">
                    <header class="query-card-header">
                        <div>
                            <span>Query ${String(index + 1).padStart(2, '0')} · ${escapeHtml(item.locale || '—')} · ${escapeHtml(item.candidate_count || 0)} 个候选商品</span>
                            <h3>${escapeHtml(item.query_text || '未返回 Query')}</h3>
                        </div>
                        <strong class="query-outcome is-${outcome}">${escapeHtml(outcomeLabel)} · nDCG ${escapeHtml(formatDelta(item['ndcg@10_delta']))}</strong>
                    </header>
                    <div class="query-columns-shell">
                        <div class="query-columns">
                            <section class="query-column is-before" aria-label="优化前 Top 10">
                                <header><div><span>优化前</span><strong>Top 10</strong></div>${renderMetricSnapshot(itemMetrics, 'baseline')}</header>
                                ${renderResultList(item.top_baseline)}
                            </section>
                            <section class="query-column is-after" aria-label="优化后 Top 10">
                                <header><div><span>优化后</span><strong>Top 10</strong></div>${renderMetricSnapshot(itemMetrics, 'candidate')}</header>
                                ${renderResultList(item.top_candidate)}
                            </section>
                        </div>
                    </div>
                </article>`;
        }).join('');
        debug('query_comparisons_rendered', { sourceComparisonCount, comparisonCount: rows.length, outcomeCounts });
    };

    const renderProposal = (proposal) => {
        const metrics = proposal?.evidence?.aggregate_metrics || {};
        const outcome = proposal?.evidence?.outcome_counts?.['ndcg@10'] || {};
        const badCase = proposal?.evidence?.bad_cases?.[0] || null;
        const regression = proposal?.evidence?.regressions?.[0] || null;
        const regressionCount = Number(outcome.regressed) || 0;
        const strategy = proposal?.strategy || {};
        const presentation = candidatePresentation({
            candidate: { strategy_id: strategy.strategy_id, config: strategy.config || {} },
            catalogEntry: strategy.catalog_entry || {},
            explanation: strategy.explanation || {}
        });
        const recommendation = proposal?.agent_summary?.recommendation || 'continue_experiment';
        const recommendationLabel = {
            update_strategy: '建议进入人工审批',
            reject_strategy: '建议拒绝该策略',
            continue_experiment: '建议继续实验',
            requires_engineering: '当前策略族不适用，需要实现新的算法候选'
        }[recommendation] || '建议继续实验';
        const terminalStatus = proposal?.terminal_status || null;
        const releaseGateKnown = typeof proposal?.release_gate?.passed === 'boolean';
        const gatePassed = releaseGateKnown && proposal.release_gate.passed === true;
        const gateLabel = releaseGateKnown ? gatePassed ? '通过' : '未通过' : '待人工复核';

        strategyName.textContent = presentation.name;
        setState(terminalStatus ? '需要工程实现' : releaseGateKnown ? gatePassed ? '门禁通过' : '继续实验' : '待人工复核', 'is-pending');
        proposalGrid.innerHTML = `
            <div class="proposal-full strategy-detail-card">
                <span>候选策略说明</span>
                <strong>${escapeHtml(presentation.name)}</strong>
                <p class="strategy-detail-meta">应用环节：${escapeHtml(presentation.stage)} · 支持诊断：${escapeHtml(presentation.supportCount)} 个</p>
                <p><b>解决问题：</b>${escapeHtml(presentation.targetProblem)}</p>
                <p><b>策略机制：</b>${escapeHtml(presentation.mechanism)}</p>
                <div class="strategy-formula">${escapeHtml(presentation.formula)}</div>
                ${renderParameterList(presentation.parameters)}
                <div class="strategy-notes">
                    <p><b>预期收益：</b>${escapeHtml(presentation.expectedBenefit)}</p>
                    <p><b>主要风险：</b>${escapeHtml(presentation.risk)}</p>
                </div>
            </div>
            <div class="proposal-full proposal-metrics-card">
                <span>三项核心指标</span>
                ${renderMetricTriplet(metrics, { descriptions: true })}
                <p class="metric-recommendation">${escapeHtml(recommendationLabel)}；数值均来自同一批 Query、同一候选集的 Harness 对比。</p>
            </div>
            <div>
                <span>Bad Case 样本</span>
                <strong>${escapeHtml(badCase?.query_text || '未返回样本')}</strong>
                <p>优化前：${escapeHtml(summarizeTopProducts(badCase?.top_baseline))}<br>候选后：${escapeHtml(summarizeTopProducts(badCase?.top_candidate))}</p>
            </div>
            <div>
                <span>退化与风险</span>
                <strong class="${regressionCount ? 'metric-risk' : 'metric-up'}">${regressionCount} 个 Query 退化</strong>
                <p>${escapeHtml(terminalStatus ? '当前受控策略空间无法处理主要根因，停止参数搜索并转入新算法实现。' : regression ? `最大退化样本：${regression.query_text}，Δ ${formatDelta(regression['ndcg@10_delta'])}；发布门禁：${gateLabel}` : releaseGateKnown ? `本轮没有明显退化；发布门禁：${gateLabel}` : '旧版提案未返回门禁结果，需要人工复核。')}</p>
            </div>`;
        evidenceStrip.innerHTML = `
            <span>${escapeHtml(proposal?.baseline_run_id || 'Baseline Run')}</span>
            <span>${escapeHtml(proposal?.candidate_run_id || 'Candidate Run')}</span>
            <span>${escapeHtml(proposal?.comparison_id || 'Comparison')}</span>
            <span>${escapeHtml(proposal?.proposal_id || 'Proposal')}</span>`;
        renderReasoning(proposal);
        renderQueryComparisons(proposal?.evidence?.query_comparisons);
        debug('strategy_proposal_rendered', {
            proposalId: proposal?.proposal_id || null,
            recommendation,
            regressionCount,
            gatePassed
        });
    };

    const retrievalGateLabels = {
        unique_relevant_contribution: '新通道必须带来独有相关商品',
        union_coverage_improvement: '召回并集覆盖率必须提升',
        fusion_recall_at_10_floor: '融合 Recall@10 不得下降',
        fusion_ndcg_at_10_floor: '融合 nDCG@10 不得下降',
        fusion_mrr_at_10_floor: '融合 MRR@10 不得下降',
        coarse_recall_at_10_floor: '粗排 Recall@10 不得下降',
        coarse_ndcg_at_10_floor: '粗排 nDCG@10 不得下降',
        coarse_mrr_at_10_floor: '粗排 MRR@10 不得下降',
        worst_query_coarse_ndcg_delta_floor: '单 Query 粗排 nDCG 最差下降不超 0.02',
        regressed_query_rate_ceiling: '粗排退化 Query 比例不超 10%',
        worst_query_fusion_ndcg_delta_floor: '单 Query 融合 nDCG 最差下降不超 0.02',
        fusion_regressed_query_rate_ceiling: '融合退化 Query 比例不超 10%'
    };

    const findingBySubtype = (diagnosis, subtype) => (
        (diagnosis?.findings || []).find((item) => item.subtype === subtype) || null
    );

    const recoveredStageLabels = {
        fusion: '进入召回并集后未进入融合 Top 20',
        coarse_rank: '进入融合后未进入最终 Top 10',
        retained: '已保留到最终 Top 10'
    };

    const retrievalVariantLabels = {
        'title-exact-multifield-v1': '均匀 RRF · 1 / 1 / 1',
        'title-exact-multifield-weighted-v1': '保守 RRF · 1 / 1 / 0.1',
        'title-exact-multifield-weighted-aggressive-v1': '激进 RRF · 1 / 0.5 / 0.25'
    };

    const renderRetrievalResults = (items) => {
        const results = Array.isArray(items) ? items.slice(0, 10) : [];
        if (!results.length) return '<li class="result-list-empty">Top 10 无结果</li>';
        return results.map((result) => `<li>
            <span class="result-rank">#${escapeHtml(result.rank)}</span>
            <div class="result-copy"><strong>${escapeHtml(result.product_title)}</strong><p><span class="result-label label-${escapeHtml(String(result.label).toLowerCase())}">${escapeHtml(result.label)}</span>${escapeHtml(result.product_id)}</p></div>
        </li>`).join('');
    };

    const renderRetrievalQueryComparisons = (items) => {
        const sourceCount = Array.isArray(items) ? items.length : 0;
        const comparisonOrder = (left, right) => (
            Math.abs(Number(right['coarse_ndcg@10_delta']) || 0) - Math.abs(Number(left['coarse_ndcg@10_delta']) || 0)
            || String(left.locale || '').localeCompare(String(right.locale || ''))
            || (Number(left.query_id) || 0) - (Number(right.query_id) || 0)
            || String(left.pipeline_variant || '').localeCompare(String(right.pipeline_variant || ''))
        );
        const changed = (Array.isArray(items) ? items : [])
            .filter((item) => Math.abs(Number(item['coarse_ndcg@10_delta']) || 0) > 1e-12)
            .sort(comparisonOrder);
        const rows = changed.slice(0, 10);
        const availableOutcomes = new Set(changed.map((item) => Number(item['coarse_ndcg@10_delta']) > 0 ? 'improvement' : 'regression'));
        const selectedOutcomes = new Set(rows.map((item) => Number(item['coarse_ndcg@10_delta']) > 0 ? 'improvement' : 'regression'));
        if (rows.length >= 2) {
            for (const requiredOutcome of ['improvement', 'regression']) {
                if (availableOutcomes.has(requiredOutcome) && !selectedOutcomes.has(requiredOutcome)) {
                    rows[rows.length - 1] = changed.find((item) => (
                        requiredOutcome === 'improvement'
                            ? Number(item['coarse_ndcg@10_delta']) > 1e-12
                            : Number(item['coarse_ndcg@10_delta']) < -1e-12
                    ));
                    selectedOutcomes.add(requiredOutcome);
                }
            }
            rows.sort(comparisonOrder);
        }
        const outcomeCounts = rows.reduce((counts, item) => {
            const outcome = Number(item['coarse_ndcg@10_delta']) > 0 ? 'improvement' : 'regression';
            counts[outcome] = (counts[outcome] || 0) + 1;
            return counts;
        }, {});
        queryComparisonCount.textContent = `${rows.length} 个变化样本 · 改善 ${outcomeCounts.improvement || 0} / 退化 ${outcomeCounts.regression || 0}`;
        if (!rows.length) {
            queryComparisonList.innerHTML = '<div class="query-comparison-empty">本轮没有排序发生变化的 Query；持平样本已省略。</div>';
            debug('retrieval_query_comparisons_rendered', { sourceCount, comparisonCount: 0, outcomeCounts: {} });
            return;
        }
        queryComparisonList.innerHTML = rows.map((item, index) => {
            const ndcgDelta = Number(item['coarse_ndcg@10_delta']);
            const recovered = Array.isArray(item.recovered_relevant) ? item.recovered_relevant : [];
            const outcome = ndcgDelta > 1e-12 ? 'improvement' : ndcgDelta < -1e-12 ? 'regression' : 'unchanged';
            const outcomeLabel = { improvement: '改善', regression: '退化', unchanged: '持平' }[outcome];
            const candidateLabel = retrievalVariantLabels[item.pipeline_variant] || '当前候选策略';
            const sourceLabel = item.is_selected_comparison === true
                ? item.gate_passed === true
                    ? 'Agent 最终候选'
                    : '本轮最佳候选（未通过门禁）'
                : item.gate_passed === false
                    ? '已被门禁淘汰'
                    : '通过门禁的消融候选';
            return `<article class="query-comparison-card">
                <header class="query-card-header">
                    <div><span>Query ${String(index + 1).padStart(2, '0')} · ${escapeHtml(item.locale || '—')}</span><h3>${escapeHtml(item.query_text || '未返回 Query')}</h3></div>
                    <strong class="query-outcome is-${outcome}">${escapeHtml(outcomeLabel)} · 粗排 nDCG ${escapeHtml(formatDelta(ndcgDelta))}</strong>
                </header>
                <div class="query-columns-shell"><div class="query-columns">
                    <section class="query-column"><header><div><span>优化前</span><strong>标题 BM25 基线</strong></div></header><ol class="result-list">${renderRetrievalResults(item.baseline_top_results)}</ol></section>
                    <section class="query-column is-after"><header><div><span>候选后 · ${escapeHtml(sourceLabel)}</span><strong>${escapeHtml(candidateLabel)}</strong></div></header><ol class="result-list">${renderRetrievalResults(item.candidate_top_results)}</ol></section>
                </div></div>
                ${recovered.length ? `<div class="recovered-results"><strong>新增召回的相关 Query-商品项</strong><ul>${recovered.slice(0, 4).map((result) => `<li><span class="result-label label-${escapeHtml(String(result.label).toLowerCase())}">${escapeHtml(result.label)}</span><b>${escapeHtml(result.product_title)}</b><small>${escapeHtml(result.product_id)} · ${escapeHtml(result.candidate_multi_field_rank === null ? '多字段通道名次未知' : `多字段通道 #${result.candidate_multi_field_rank}`)} · ${escapeHtml(recoveredStageLabels[result.candidate_first_loss_stage])}</small></li>`).join('')}</ul></div>` : ''}
                <div class="query-stage-summary">召回覆盖变化：<b>${escapeHtml(formatPointDelta(item.union_coverage_delta))}</b>；融合 nDCG：<b>${escapeHtml(formatDelta(item['fusion_ndcg@10_delta']))}</b>；粗排 nDCG：<b>${escapeHtml(formatDelta(ndcgDelta))}</b>。证据来源：${escapeHtml(sourceLabel)}。</div>
            </article>`;
        }).join('');
        debug('retrieval_query_comparisons_rendered', { sourceCount, comparisonCount: rows.length, outcomeCounts });
    };

    const runtimeReasonLabels = {
        establish_baseline_evidence: '先运行基线并定位相关商品第一次被丢失的阶段，为后续实验建立可复现证据。',
        baseline_retrieval_diagnosis: '先检查基线召回、融合和粗排 lineage，确认问题发生在哪一层。',
        diagnose_retrieval_baseline: '先检查基线召回、融合和粗排 lineage，确认问题发生在哪一层。',
        test_uniform_fusion: '基线暴露召回覆盖缺口，先用均匀权重测试新增通道是否能直接带来安全提升。',
        test_uniform_candidate: '基线暴露召回覆盖缺口，先用均匀权重测试新增通道是否能直接带来安全提升。',
        test_uniform_multifield_fusion: '基线暴露召回覆盖缺口，先用均匀权重测试新增通道是否能直接带来安全提升。',
        reduce_noisy_channel_weight: '前一候选出现排序退化，因此降低多字段通道权重，保留新增覆盖并控制噪声。',
        test_conservative_candidate: '均匀融合未守住质量门禁，因此降低新通道权重并运行保守消融。',
        test_conservative_multifield_fusion: '均匀融合未守住质量门禁，因此降低新通道权重并运行保守消融。',
        probe_aggressive_fusion: '为验证安全权重边界，再提高新通道影响，检查局部 Query 是否退化。',
        test_aggressive_candidate: '为验证安全权重边界，再提高新通道影响，检查局部 Query 是否退化。',
        probe_aggressive_multifield_fusion: '为验证安全权重边界，再提高新通道影响，检查局部 Query 是否退化。'
    };

    const explainRuntimeAction = (action) => {
        if (runtimeReasonLabels[action.reason_code]) return runtimeReasonLabels[action.reason_code];
        if (action.tool_name === 'diagnose_baseline_retrieval') {
            return `先建立基线阶段证据，再决定是否值得运行候选实验（${action.reason_code.replaceAll('_', ' ')}）。`;
        }
        if (action.pipeline_variant === 'title-exact-multifield-v1') {
            return `基于上一轮阶段证据，测试新召回通道的均匀融合效果（${action.reason_code.replaceAll('_', ' ')}）。`;
        }
        if (action.pipeline_variant === 'title-exact-multifield-weighted-v1') {
            return `根据前一候选的门禁结果，测试更保守的新通道权重（${action.reason_code.replaceAll('_', ' ')}）。`;
        }
        return `继续探测融合权重边界并检查局部退化风险（${action.reason_code.replaceAll('_', ' ')}）。`;
    };

    const setRuntimeState = (label, className = '') => {
        agentRuntimeState.classList.remove('is-running', 'is-pass', 'is-fail');
        agentRuntimeState.textContent = label;
        if (className) agentRuntimeState.classList.add(className);
    };

    const clearRuntimeTrace = ({ label, className = '', counts = '— 个步骤 · — 次工具调用', message }) => {
        setRuntimeState(label, className);
        agentRuntimeTraceId.textContent = '—';
        agentRuntimeIdentity.textContent = 'search-agent-runtime-v1';
        agentRuntimeCounts.textContent = counts;
        agentRuntimeReplay.classList.remove('is-ready');
        agentRuntimeReplay.textContent = '无可回放轨迹';
        agentRuntimeTimeline.innerHTML = `<li class="is-empty"><p>${escapeHtml(message)}</p></li>`;
    };

    const renderRuntimeLoading = () => {
        clearRuntimeTrace({
            label: '运行中',
            className: 'is-running',
            counts: '计算中 · 等待工具调用',
            message: '正在等待第一条可验证的 Agent 动作；上一轮轨迹已清除。'
        });
        agentRuntimeReplay.textContent = '等待轨迹';
    };

    const renderAgentRuntimeTrace = (agentRun) => {
        const outcomeLabel = agentRun.outcome === 'proposal_ready' ? '已完成 · 生成提案' : '已完成 · 无安全改进';
        setRuntimeState(outcomeLabel, 'is-pass');
        agentRuntimeTraceId.textContent = agentRun.trace_id;
        agentRuntimeIdentity.textContent = `${agentRun.runtime_id} · ${agentRun.planner_id}`;
        agentRuntimeCounts.textContent = `${agentRun.steps_used} 个步骤 · ${agentRun.tool_calls_used} 次工具调用`;
        agentRuntimeReplay.classList.add('is-ready');
        agentRuntimeReplay.textContent = '可确定性回放';
        agentRuntimeTimeline.innerHTML = agentRun.actions.map((action) => {
            const isBaseline = action.tool_name === 'diagnose_baseline_retrieval';
            const toolFailed = action.status === 'failed';
            const passed = action.gate_passed === true;
            const gateLabel = toolFailed
                ? '工具失败 · 已按预算重试'
                : isBaseline
                ? '阶段证据已生成'
                : passed
                    ? '12 项门禁通过'
                    : `${action.failed_gates.length} 项门禁拦截`;
            const actionTitle = isBaseline
                ? '诊断基线召回链路'
                : retrievalVariantLabels[action.pipeline_variant];
            const actionType = isBaseline ? 'Baseline diagnosis' : 'Candidate experiment';
            return `<li class="${action.status === 'succeeded' ? 'is-pass' : 'is-fail'}">
                <span class="agent-runtime-index" aria-hidden="true">${String(action.sequence).padStart(2, '0')}</span>
                <article class="agent-runtime-action">
                    <header><div><small>${escapeHtml(actionType)} · ${escapeHtml(action.reason_code)}</small><strong>${escapeHtml(actionTitle)}</strong></div><span class="agent-runtime-status">${action.status === 'succeeded' ? '执行成功' : '执行失败'}</span></header>
                    <p><b>为什么运行：</b>${escapeHtml(explainRuntimeAction(action))}</p>
                    <footer><code>${escapeHtml(action.evidence_ref || '无证据 · 工具未完成')}</code><span class="agent-runtime-gate ${toolFailed || (!isBaseline && !passed) ? 'is-fail' : ''}">${escapeHtml(gateLabel)}</span></footer>
                </article>
            </li>`;
        }).join('');
        runtimeDebug('runtime_trace_rendered', {
            traceId: agentRun.trace_id,
            runtimeId: agentRun.runtime_id,
            plannerId: agentRun.planner_id,
            actionCount: agentRun.actions.length,
            toolCallCount: agentRun.tool_calls_used,
            failedActionCount: agentRun.actions.filter((action) => action.status === 'failed').length
        });
    };

    const setToolStatus = (node, label, className = '') => {
        node.classList.remove('is-running', 'is-pass', 'is-fail', 'is-complete');
        node.textContent = label;
        if (className) node.classList.add(className);
    };

    const renderToolLoading = (statusNode, resultNode, message) => {
        setToolStatus(statusNode, '运行中', 'is-running');
        resultNode.setAttribute('aria-busy', 'true');
        resultNode.innerHTML = `<p class="agent-tool-empty">${escapeHtml(message)}</p>`;
    };

    const renderToolError = (statusNode, resultNode, message) => {
        setToolStatus(statusNode, '运行失败', 'is-fail');
        resultNode.removeAttribute('aria-busy');
        resultNode.innerHTML = `<p class="agent-tool-empty is-error">${escapeHtml(message)}</p>`;
    };

    const renderAgentEvalSummary = (summary) => {
        agentEvalResult.removeAttribute('aria-busy');
        const metrics = summary.metrics;
        const production = summary.subject_summaries.find((item) => item.subject_kind === 'production_planner');
        const containment = summary.subject_summaries.find((item) => item.subject_kind === 'harness_stimulus');
        const formalLabel = summary.formal_passed ? '正式自检通过' : '正式自检未通过';
        setToolStatus(agentEvalStatus, formalLabel, summary.formal_passed ? 'is-pass' : 'is-fail');
        const items = [
            ['任务数', summary.task_count, ''],
            ['生产 Planner', `${production.passed_count}/${production.task_count}`, production.passed_count === production.task_count ? 'is-pass' : 'is-fail'],
            ['Runtime 对抗围栏', `${containment.passed_count}/${containment.task_count}`, containment.passed_count === containment.task_count ? 'is-pass' : 'is-fail'],
            ['任务成功率', formatPercent(metrics.task_success_rate), metrics.task_success_rate === 1 ? 'is-pass' : 'is-fail'],
            ['证据绑定率', formatPercent(metrics.grounded_claim_rate), metrics.grounded_claim_rate === 1 ? 'is-pass' : 'is-fail'],
            ['工具选择准确率', formatPercent(metrics.tool_selection_accuracy), metrics.tool_selection_accuracy === 1 ? 'is-pass' : 'is-fail'],
            ['恢复率', formatPercent(metrics.recovery_rate), metrics.recovery_rate === 1 ? 'is-pass' : 'is-fail'],
            ['预算合规率', formatPercent(metrics.budget_compliance_rate), metrics.budget_compliance_rate === 1 ? 'is-pass' : 'is-fail'],
            ['Replay 一致率', formatPercent(metrics.replay_fidelity_rate), metrics.replay_fidelity_rate === 1 ? 'is-pass' : 'is-fail'],
            ['篡改拒绝率', formatPercent(metrics.tamper_rejection_rate), metrics.tamper_rejection_rate === 1 ? 'is-pass' : 'is-fail'],
            ['受保护数据读取', metrics.protected_profile_read_count, metrics.protected_profile_read_count === 0 ? 'is-pass' : 'is-fail'],
            ['策略权威写入', metrics.strategy_write_count, metrics.strategy_write_count === 0 ? 'is-pass' : 'is-fail'],
            ['Agent 工具调用', metrics.total_agent_tool_calls, ''],
            ['对照流程成功率', formatPercent(metrics.comparable_workflow_success_rate), ''],
            ['对照流程工具调用', metrics.comparable_workflow_tool_calls, '']
        ];
        agentEvalResult.innerHTML = `
            <div class="agent-tool-result-heading">
                <div><span>Formal result</span><strong class="${summary.formal_passed ? 'metric-up' : 'metric-risk'}">${escapeHtml(formalLabel)}</strong></div>
                <code>${escapeHtml(summary.evidence_id)}</code>
            </div>
            <div class="agent-tool-metrics">${items.map(([label, value, className]) => `
                <div><span>${escapeHtml(label)}</span><strong class="${className}">${escapeHtml(value)}</strong></div>`).join('')}
            </div>
            <p class="agent-tool-boundary"><b>边界：</b>这份成绩只验证固定 Stage 5 smoke 任务中的 Agent Runtime 行为。脚本化故障不证明真实 worker 能强制中止超时，也不衡量搜索结果质量。</p>`;
    };

    const renderQueryConstructorSummary = (summary) => {
        queryConstructorResult.removeAttribute('aria-busy');
        setToolStatus(queryConstructorStatus, '构造完成', 'is-pass');
        const items = [
            ['Query 总数', summary.query_count],
            ['原始 smoke Query', summary.original_count],
            ['合成 Query', summary.synthetic_count],
            ['去重数量', summary.deduplicated_count],
            ['允许正式评测', summary.formal_evaluation_allowed ? '是' : '否']
        ];
        queryConstructorResult.innerHTML = `
            <div class="agent-tool-result-heading">
                <div><span>Constructed set</span><strong>只读探索集</strong></div>
                <code>${escapeHtml(summary.query_set_id)}</code>
            </div>
            <div class="agent-tool-metrics">${items.map(([label, value]) => `
                <div><span>${escapeHtml(label)}</span><strong class="${label === '允许正式评测' ? 'is-fail' : ''}">${escapeHtml(value)}</strong></div>`).join('')}
            </div>
            <p class="agent-tool-boundary"><b>边界：</b>来源固定为已提交的 20-Query smoke 视图；合成 Query 没有 ESCI 标签，只能用于发现 Bad Case，不能进入正式 nDCG / MRR。构造过程没有读取 500-Query dev 或 frozen test。</p>`;
    };

    const badCaseCategoryLabels = {
        zero_result: '零结果候选',
        spelling_sensitive: '拼写敏感',
        order_sensitive: '词序敏感',
        ranking_instability_needs_judgment: '排序稳定性待判断'
    };

    const badCaseReasonLabels = {
        identity_zero_result: '原始 Query 没有返回结果',
        variant_zero_result: '变体 Query 没有返回结果',
        variant_result_set_changed: 'Top 10 结果集合发生变化',
        variant_ranking_changed: 'Top 10 商品顺序发生变化',
        token_order_result_changed: '词序反转后结果发生变化，合理性需人工或标签判断'
    };

    const badCaseConstructionLabels = {
        identity: '原始 Query',
        adjacent_transposition: '相邻字母交换',
        token_order_reversal: '词序反转'
    };

    const renderBadCaseHits = (hits) => hits.length
        ? `<ol class="bad-case-hit-list">${hits.map((hit) => `<li>
            <b>#${hit.rank}</b>
            <div><strong dir="auto">${escapeHtml(hit.title)}</strong><code>${escapeHtml(hit.locale)} · ${escapeHtml(hit.product_id)}</code></div>
        </li>`).join('')}</ol>`
        : '<p class="bad-case-hit-empty">没有可展示的 Top 结果</p>';

    const renderBadCaseSample = (sample) => `
        <li>
            <article class="bad-case-sample">
                <header>
                    <h5><span class="sr-only">诊断样本 </span><code>${escapeHtml(sample.case_id)}</code></h5>
                    <div class="bad-case-tags">${sample.categories.map((category) =>
                        `<span class="bad-case-tag">${escapeHtml(badCaseCategoryLabels[category])}</span>`
                    ).join('')}</div>
                </header>
                <div class="bad-case-query-pair">
                    <div><span>来源 Query</span><strong dir="auto">${escapeHtml(sample.source_query_text)}</strong></div>
                    <div><span>${escapeHtml(badCaseConstructionLabels[sample.construction])}</span><strong dir="auto">${escapeHtml(sample.query_text)}</strong></div>
                </div>
                <div class="bad-case-hit-comparison">
                    <section class="bad-case-hit-column" aria-label="来源 Query 的 Top 结果">
                        <header><span>来源结果</span><strong>Top 10 返回 ${sample.source_returned_at_k}</strong></header>
                        ${renderBadCaseHits(sample.source_top_hits)}
                    </section>
                    <section class="bad-case-hit-column" aria-label="当前 Query 的 Top 结果">
                        <header><span>当前结果</span><strong>Top 10 返回 ${sample.variant_returned_at_k}</strong></header>
                        ${renderBadCaseHits(sample.variant_top_hits)}
                    </section>
                </div>
                <p class="bad-case-sample-note"><b>观察：</b>${escapeHtml(badCaseReasonLabels[sample.reason_code])}；两侧 Top 10 有 ${sample.overlap_at_k} 个商品重合。这里只标记需要判断的变化，不判断哪一侧更相关。</p>
            </article>
        </li>`;

    const renderBadCaseSummary = (summary) => {
        badCaseResult.removeAttribute('aria-busy');
        setToolStatus(badCaseStatus, '诊断完成', 'is-complete');
        const categories = [
            ['zero_result', '零结果候选'],
            ['spelling_sensitive', '拼写敏感'],
            ['order_sensitive', '词序敏感'],
            ['ranking_instability_needs_judgment', '排序稳定性待判断']
        ];
        const samples = summary.samples;
        badCaseResult.innerHTML = `
            <div class="bad-case-summary">
                <div class="agent-tool-result-heading">
                    <div><span>Development diagnostics</span><strong>${summary.diagnostic_candidate_count} 个候选需要判断</strong></div>
                    <div class="bad-case-run-ids"><code>${escapeHtml(summary.execution_id)}</code><code>${escapeHtml(summary.supervisor_receipt_id)}</code><code>${escapeHtml(summary.diagnostic_id)}</code><code>${escapeHtml(summary.query_set_id)}</code><code>${escapeHtml(summary.index_id)}</code></div>
                </div>
                <div class="agent-tool-metrics">
                    <div><span>运行 Query</span><strong>${summary.query_count}</strong></div>
                    <div><span>搜索调用 / 失败</span><strong>${summary.search_call_count} / ${summary.operational_failure_count}</strong></div>
                    <div><span>基线策略</span><strong>${escapeHtml(summary.search_strategy_id)}</strong></div>
                    <div><span>原始 / 合成</span><strong>${summary.original_count} / ${summary.synthetic_count}</strong></div>
                    <div><span>字母交换 / 词序反转</span><strong>${summary.construction_counts.adjacent_transposition} / ${summary.construction_counts.token_order_reversal}</strong></div>
                    <div><span>诊断候选</span><strong>${summary.diagnostic_candidate_count}</strong></div>
                    <div><span>结果窗口</span><strong>Top ${summary.top_k}</strong></div>
                    <div><span>相关性标签</span><strong class="is-boundary">未使用</strong></div>
                    <div><span>相关性指标</span><strong class="is-boundary">未计算</strong></div>
                    <div><span>阶段丢失归因</span><strong class="is-boundary">未计算</strong></div>
                    <div><span>Worker 硬截止</span><strong class="is-pass">${summary.worker_deadline_ms / 1000} 秒</strong></div>
                    <div><span>进程组强制终止</span><strong class="is-pass">已启用</strong></div>
                    <div><span>Worker Policy</span><strong>${escapeHtml(summary.worker_policy_id)}</strong></div>
                    <div><span>TERM / KILL 宽限</span><strong>${summary.term_grace_ms} / ${summary.kill_grace_ms} ms</strong></div>
                    <div><span>完成观测</span><strong>${escapeHtml(summary.completion_observation)}</strong></div>
                    <div><span>受保护评测档案调度</span><strong class="is-pass">${summary.protected_profile_dispatch_count}</strong></div>
                    <div><span>策略写入</span><strong class="is-pass">${summary.strategy_write_count}</strong></div>
                </div>
                <div class="bad-case-category-grid" aria-label="可重叠的诊断分类计数">${categories.map(([key, label]) => `
                    <div><span>${escapeHtml(label)}</span><strong>${summary.category_counts[key]}</strong></div>`).join('')}
                </div>
                <div class="bad-case-samples-heading">
                    <div><h4>代表样本</h4><p>展示 ${samples.length} / ${summary.diagnostic_candidate_count} 个诊断候选</p></div>
                    <p>分类可能重叠，因此四类数量不能直接相加。</p>
                </div>
                ${samples.length
                    ? `<ol class="bad-case-sample-list">${samples.map(renderBadCaseSample).join('')}</ol>`
                    : `<p class="agent-tool-empty">${summary.diagnostic_candidate_count === 0
                        ? '本轮没有发现符合固定规则的诊断候选。'
                        : `本轮发现 ${summary.diagnostic_candidate_count} 个诊断候选，但没有返回可展示的代表样本。`}</p>`}
                <p class="agent-tool-boundary"><b>边界：</b>这些是无标签开发诊断候选，不是已经确认的搜索 Bad Case，也不证明相关性提升。当前只观察单阶段全量商品 BM25 的零结果和稳定性，不能据此判断多路召回、融合、粗排或精排在哪一层丢失；正式结论仍需独立标签与 Search Harness。125 秒硬截止由父进程 supervisor 执行，不改变诊断证据本身的内容 ID。</p>
            </div>`;
    };

    const experimentFalsifierLabels = {
        no_zero_result_recovery: '没有恢复任何原始零结果 Query',
        no_independently_judged_relevant_gain: '独立标注后没有新增相关商品',
        quality_or_safety_gate_regression: '质量或保护门禁出现退化',
        nonzero_baseline_results_changed: '原本非零的 Query 结果被改变',
        execution_budget_exceeded: '查询路数、延迟或执行预算超限'
    };

    const renderDiagnosticExperimentPlan = (plan) => {
        diagnosticPlanResult.removeAttribute('aria-busy');
        setToolStatus(diagnosticPlanStatus, '实验计划已生成', 'is-complete');
        const strategy = plan.strategy;
        const strategyName = strategy
            ? '零结果保护式 AND 回退'
            : '当前没有可直接运行的策略';
        const nextStep = plan.status === 'experiment_planned'
            ? '先运行行为实验并补独立 Oracle；证据齐全前不能更新策略。'
            : '先补独立 Oracle 或工程能力，再重新规划。';
        diagnosticPlanResult.innerHTML = `
            <div class="diagnostic-plan-summary">
                <div class="agent-tool-result-heading">
                    <div><span>Evidence-driven plan</span><strong>${escapeHtml(strategyName)}</strong></div>
                    <div class="bad-case-run-ids"><code>${escapeHtml(plan.experiment_plan_id)}</code>${strategy
                        ? `<code>${escapeHtml(strategy.strategy_spec_id)}</code>`
                        : ''}</div>
                </div>
                <div class="agent-tool-metrics">
                    <div><span>目标候选</span><strong>${plan.target_case_ids.length}</strong></div>
                    <div><span>主路</span><strong>${strategy ? '全部词严格 AND' : '—'}</strong></div>
                    <div><span>回退触发</span><strong>${strategy ? '仅主路 0 结果' : '—'}</strong></div>
                    <div><span>最多回退路数</span><strong>${strategy?.max_fallback_routes ?? '—'}</strong></div>
                    <div><span>数字 / 型号词</span><strong class="is-pass">不可删除</strong></div>
                    <div><span>融合</span><strong>${strategy ? 'RRF' : '—'}</strong></div>
                    <div><span>行为实验</span><strong class="is-pass">可运行</strong></div>
                    <div><span>质量结论</span><strong class="is-boundary">已锁定</strong></div>
                    <div><span>策略更新</span><strong class="is-boundary">不可执行</strong></div>
                </div>
                <section class="diagnostic-plan-copy">
                    <h4>Agent 的判断</h4>
                    <p>当前严格 AND 对 ${plan.target_case_ids.length} 个原始 Query 返回零结果。Agent 优先验证保守回退：每次只省略一个非数字、非型号词；原本已有结果的 Query 保持不变。</p>
                    <h4>什么情况下这个方案算失败</h4>
                    <ul>${plan.falsifiers.map((item) => `<li>${escapeHtml(experimentFalsifierLabels[item])}</li>`).join('')}</ul>
                </section>
                <div class="diagnostic-evidence-lanes" aria-label="实验的两条证据轨">
                    <article><span>Behavior lane</span><strong>全量商品 · 59 Query</strong><p>只记录零结果恢复、Top 10 变化、失败和预算；不计算相关性指标。</p></article>
                    <article><span>Quality lane</span><strong>等待独立 Oracle</strong><p>新增商品经过独立标注后，才允许 Harness 计算 nDCG / MRR 并形成质量结论。</p></article>
                </div>
                <p class="agent-tool-boundary"><b>下一步：</b>${escapeHtml(nextStep)} 当前计划的策略写入次数为 ${plan.strategy_write_count}。</p>
            </div>`;
    };

    const toolErrorMessage = (error, invalidCode, noun) => {
        if (error.status === 401) return '登录状态已失效，请刷新页面并重新输入凭据。';
        if (error.status === 403) return '当前登录身份没有运行该只读工具的权限。';
        if (error.status === 409) return `已有一轮${noun}正在运行，请稍后重试。`;
        if (error.code === invalidCode) return `${noun}摘要字段不完整或不一致，本轮结果已拒绝展示。`;
        return `${noun}服务暂时不可用，请稍后重试。`;
    };

    const runAgentEval = async () => {
        renderToolLoading(agentEvalStatus, agentEvalResult, '正在运行固定 12 项 Agent Eval；上一轮成绩已清除。');
        agentEvalRunButton.disabled = true;
        agentEvalRunButton.textContent = '自检运行中…';
        toolUiLog('agent-eval-ui', 'agent_eval_requested');
        try {
            if (!agentToolsContract?.fetchAgentEval) throw new Error('agent_tools_contract_unavailable');
            const summary = await agentToolsContract.fetchAgentEval(
                authenticatedFetch,
                protectedToolApiRoot
            );
            renderAgentEvalSummary(summary);
            toolUiLog('agent-eval-ui', 'agent_eval_summary_rendered', {
                evidenceId: summary.evidence_id,
                executionId: summary.execution_id,
                taskCount: summary.task_count,
                agentToolCallCount: summary.metrics.total_agent_tool_calls,
                workflowToolCallCount: summary.metrics.comparable_workflow_tool_calls
            });
        } catch (error) {
            const errorCode = error.code || 'network_error';
            renderToolError(
                agentEvalStatus,
                agentEvalResult,
                toolErrorMessage(error, 'invalid_agent_eval_summary', 'Agent Eval')
            );
            toolUiLog('agent-eval-ui', 'agent_eval_failed', {
                errorCode,
                statusCode: Number(error.status) || 0
            }, 'warn');
        } finally {
            agentEvalRunButton.disabled = false;
            agentEvalRunButton.textContent = '重新运行自检';
        }
    };

    const buildQuerySet = async () => {
        renderToolLoading(queryConstructorStatus, queryConstructorResult, '正在从固定 smoke 来源构造并去重；上一轮摘要已清除。');
        queryConstructorBuildButton.disabled = true;
        queryConstructorBuildButton.textContent = '构造中…';
        toolUiLog('query-constructor-ui', 'query_constructor_requested');
        try {
            if (!agentToolsContract?.fetchQueryConstructor) throw new Error('agent_tools_contract_unavailable');
            const summary = await agentToolsContract.fetchQueryConstructor(
                authenticatedFetch,
                protectedToolApiRoot
            );
            renderQueryConstructorSummary(summary);
            toolUiLog('query-constructor-ui', 'query_constructor_summary_rendered', {
                querySetId: summary.query_set_id,
                queryCount: summary.query_count,
                originalCount: summary.original_count,
                syntheticCount: summary.synthetic_count,
                deduplicatedCount: summary.deduplicated_count
            });
        } catch (error) {
            const errorCode = error.code || 'network_error';
            renderToolError(
                queryConstructorStatus,
                queryConstructorResult,
                toolErrorMessage(error, 'invalid_query_constructor_summary', 'Query 构造器')
            );
            toolUiLog('query-constructor-ui', 'query_constructor_failed', {
                errorCode,
                statusCode: Number(error.status) || 0
            }, 'warn');
        } finally {
            queryConstructorBuildButton.disabled = false;
            queryConstructorBuildButton.textContent = '重新构造 Query 集';
        }
    };

    const runBadCaseDiagnostics = async () => {
        renderToolLoading(badCaseStatus, badCaseResult, '正在全量商品基线中运行固定 59 条开发 Query；上一轮诊断摘要已清除。');
        latestBadCaseSummary = null;
        humanOracleState = null;
        humanOracleView = null;
        humanOracleStartButton.disabled = true;
        humanOracleStartButton.textContent = '等待 Bad Case 证据';
        setToolStatus(humanOracleStatus, '等待诊断证据');
        humanOracleIntentProgress.textContent = '0 / 30';
        humanOracleBehaviorProgress.textContent = '0 / 40';
        humanOracleClusterProgress.textContent = '0 / 20';
        humanOracleResult.innerHTML = '<p class="agent-tool-empty">本轮诊断完成后才能开始新的人工诊断批次。</p>';
        diagnosticPlanButton.disabled = true;
        diagnosticPlanButton.textContent = '等待 Bad Case 证据';
        setToolStatus(diagnosticPlanStatus, '等待诊断证据');
        diagnosticPlanResult.innerHTML = '<p class="agent-tool-empty">本轮诊断完成后，Agent 会自动生成新的实验计划。</p>';
        badCaseRunButton.disabled = true;
        badCaseRunButton.textContent = '59 条诊断运行中…';
        toolUiLog('bad-case-ui', 'bad_case_diagnostics_requested');
        try {
            if (!agentToolsContract?.fetchBadCaseDiagnostics) throw new Error('agent_tools_contract_unavailable');
            const summary = await agentToolsContract.fetchBadCaseDiagnostics(
                authenticatedFetch,
                protectedToolApiRoot
            );
            renderBadCaseSummary(summary);
            latestBadCaseSummary = summary;
            diagnosticPlanButton.disabled = false;
            diagnosticPlanButton.textContent = '重新生成实验计划';
            humanOracleStartButton.disabled = false;
            humanOracleStartButton.textContent = '开始人工诊断';
            toolUiLog('bad-case-ui', 'bad_case_diagnostics_summary_rendered', {
                diagnosticId: summary.diagnostic_id,
                executionId: summary.execution_id,
                supervisorReceiptId: summary.supervisor_receipt_id,
                querySetId: summary.query_set_id,
                indexId: summary.index_id,
                queryCount: summary.query_count,
                searchCallCount: summary.search_call_count,
                operationalFailureCount: summary.operational_failure_count,
                diagnosticCandidateCount: summary.diagnostic_candidate_count,
                displayedSampleCount: summary.samples.length,
                zeroResultCount: summary.category_counts.zero_result,
                spellingSensitiveCount: summary.category_counts.spelling_sensitive,
                orderSensitiveCount: summary.category_counts.order_sensitive,
                rankingInstabilityCount: summary.category_counts.ranking_instability_needs_judgment
            });
            await runDiagnosticExperimentPlan();
        } catch (error) {
            const errorCode = error.code || 'network_error';
            renderToolError(
                badCaseStatus,
                badCaseResult,
                toolErrorMessage(error, 'invalid_bad_case_summary', 'Bad Case 诊断')
            );
            toolUiLog('bad-case-ui', 'bad_case_diagnostics_failed', {
                errorCode,
                statusCode: Number(error.status) || 0
            }, 'warn');
        } finally {
            badCaseRunButton.disabled = false;
            badCaseRunButton.textContent = '重新运行 59 条诊断 Query';
        }
    };

    const runDiagnosticExperimentPlan = async () => {
        if (!latestBadCaseSummary) return;
        renderToolLoading(
            diagnosticPlanStatus,
            diagnosticPlanResult,
            'Agent 正在校验完整诊断证据并选择第一条可证伪实验；不会写入搜索策略。'
        );
        diagnosticPlanButton.disabled = true;
        diagnosticPlanButton.textContent = '规划中…';
        toolUiLog('diagnostic-experiment-ui', 'diagnostic_experiment_plan_requested', {
            diagnosticId: latestBadCaseSummary.diagnostic_id,
            querySetId: latestBadCaseSummary.query_set_id
        });
        try {
            if (!agentToolsContract?.fetchDiagnosticExperimentPlan) {
                throw new Error('agent_tools_contract_unavailable');
            }
            const plan = await agentToolsContract.fetchDiagnosticExperimentPlan(
                authenticatedFetch,
                protectedToolApiRoot,
                latestBadCaseSummary.diagnostic_id,
                latestBadCaseSummary.query_set_id
            );
            renderDiagnosticExperimentPlan(plan);
            toolUiLog('diagnostic-experiment-ui', 'diagnostic_experiment_plan_rendered', {
                diagnosticId: plan.diagnostic_id,
                experimentPlanId: plan.experiment_plan_id,
                status: plan.status,
                strategySpecId: plan.strategy?.strategy_spec_id || null,
                targetCaseCount: plan.target_case_ids.length,
                qualityConclusionAllowed: plan.quality_conclusion_allowed,
                activationEligible: plan.activation_eligible,
                strategyWriteCount: plan.strategy_write_count
            });
        } catch (error) {
            const errorCode = error.code || 'network_error';
            renderToolError(
                diagnosticPlanStatus,
                diagnosticPlanResult,
                toolErrorMessage(
                    error,
                    'invalid_diagnostic_experiment_plan',
                    '实验规划'
                )
            );
            toolUiLog('diagnostic-experiment-ui', 'diagnostic_experiment_plan_failed', {
                errorCode,
                statusCode: Number(error.status) || 0
            }, 'warn');
        } finally {
            diagnosticPlanButton.disabled = false;
            diagnosticPlanButton.textContent = '重新生成实验计划';
        }
    };

    const oracleConstructionLabels = {
        identity: '原始 Query',
        adjacent_transposition: '相邻字母交换',
        token_order_reversal: '词序反转'
    };

    const oracleIntentLabels = {
        equivalent: '同意图',
        not_equivalent: '不同意图',
        uncertain: '不确定'
    };

    const oracleBehaviorLabels = {
        confirmed_issue: '确认问题',
        acceptable: '可接受',
        uncertain: '不确定'
    };

    const oracleReasonLabels = {
        same_product_intent: '词序变化后仍表达同一商品意图',
        obvious_typo_same_intent: '明显拼写错误，意图不变',
        meaning_changed: '词序变化改变了含义',
        query_became_uninterpretable: '拼写变化后已无法理解',
        ambiguous_intent: '意图含义存在歧义',
        insufficient_context: '上下文不足，不能确认意图',
        owner_catalog_expectation: '按站长对商品库的理解，这是问题',
        equivalent_intent_should_preserve_behavior: '同意图 Query 应保持可接受的搜索行为',
        intent_not_equivalent: '不同意图，因此行为差异可接受',
        behavior_is_expected: '当前搜索行为符合预期',
        catalog_coverage_unknown: '不确定商品库是否覆盖该意图',
        insufficient_result_evidence: '当前 Top 3 证据不足',
        insufficient_domain_knowledge: '领域知识不足，无法确认'
    };

    const humanOracleFailure = (code) => {
        const error = new Error(code);
        error.code = code;
        throw error;
    };

    const safeClientActionId = () => {
        if (!window.crypto || typeof window.crypto.randomUUID !== 'function') {
            return humanOracleFailure('secure_client_action_id_unavailable');
        }
        return window.crypto.randomUUID();
    };

    const setHumanOracleProgress = (review) => {
        const projection = review?.projection || {};
        const intents = Number(projection.active_intent_annotation_count) || 0;
        const behaviors = Number(projection.active_behavior_annotation_count) || 0;
        humanOracleIntentProgress.textContent = `${intents} / 30`;
        humanOracleBehaviorProgress.textContent = `${behaviors} / 40`;
        const units = humanOracleState?.batch?.units || [];
        const states = review?.cases || [];
        const completedClusters = units.filter((unit) => {
            const unitCases = states.filter((item) => item.unit_id === unit.unit_id);
            return unitCases.length === unit.candidate_count
                && unitCases.every((item) => item.active_behavior_annotation_id !== null);
        }).length;
        humanOracleClusterProgress.textContent = `${completedClusters} / 20`;
    };

    const validateOracleUiAssociation = (batch, review) => {
        if (batch.oracle_batch_id !== review.oracle_batch_id) humanOracleFailure('oracle_batch_state_mismatch');
        const unitCounts = new Map(batch.units.map((unit) => [unit.unit_id, unit.candidate_count]));
        const observed = new Map();
        review.cases.forEach((item) => {
            if (!unitCounts.has(item.unit_id)) humanOracleFailure('oracle_unknown_unit');
            observed.set(item.unit_id, (observed.get(item.unit_id) || 0) + 1);
        });
        batch.units.forEach((unit) => {
            if (observed.get(unit.unit_id) !== unit.candidate_count) humanOracleFailure('oracle_unit_count_mismatch');
        });
    };

    const focusHumanOracle = () => window.requestAnimationFrame(() => humanOracleResult.focus());

    const renderHumanOracleHits = (hits) => hits.length
        ? `<ol class="human-oracle-result-list">${hits.map((hit) => `<li>
            <b>#${hit.rank}</b>
            <div><strong dir="auto">${escapeHtml(hit.title)}</strong><code>${escapeHtml(hit.locale)} · ${escapeHtml(hit.product_id)}</code></div>
        </li>`).join('')}</ol>`
        : '<p class="human-oracle-result-empty">Top 3 没有结果</p>';

    const bindOracleChoiceReason = (form, reasonForJudgment) => {
        const output = form.querySelector('[data-oracle-reason]');
        form.querySelectorAll('input[name="oracleJudgment"]').forEach((input) => {
            input.addEventListener('change', () => {
                const reason = reasonForJudgment(input.value);
                output.textContent = `提交依据：${oracleReasonLabels[reason]}`;
            });
        });
    };

    const renderHumanOracleIntent = (view, candidate, caseState) => {
        humanOracleView = { phase: 'intent', view, candidate, caseState };
        const step = humanOracleState.review.projection.active_intent_annotation_count + 1;
        humanOracleResult.removeAttribute('aria-busy');
        setToolStatus(humanOracleStatus, `Intent ${step} / 30`, 'is-complete');
        humanOracleResult.innerHTML = `<div class="human-oracle-work">
            <div class="human-oracle-heading">
                <div><span>阶段 1 · Intent-only</span><strong>这两个 Query 是不是同一个意图？</strong></div>
                <code>${escapeHtml(view.unit_id)} · ${escapeHtml(candidate.case_id)}</code>
            </div>
            <p class="human-oracle-instruction">这里只显示 Query，不显示任何搜索结果，避免结果反过来影响你的意图判断。每次只提交一项。</p>
            <div class="human-oracle-query-pair">
                <div class="human-oracle-query"><span>来源 Query</span><strong dir="auto">${escapeHtml(view.source_query_text)}</strong></div>
                <div class="human-oracle-query"><span>${escapeHtml(oracleConstructionLabels[candidate.construction])}</span><strong dir="auto">${escapeHtml(candidate.query_text)}</strong></div>
            </div>
            <form class="human-oracle-form" id="humanOracleDecisionForm">
                <fieldset><legend>你的判断</legend><div class="human-oracle-choice-grid">
                    ${Object.entries(oracleIntentLabels).map(([value, label]) => `<label><input type="radio" name="oracleJudgment" value="${value}" required><span>${label}</span></label>`).join('')}
                </div></fieldset>
                <output data-oracle-reason>选择判断后会显示对应的结构化依据。</output>
                <div class="human-oracle-form-actions"><button type="submit">提交并看下一项</button></div>
            </form>
        </div>`;
        const form = document.getElementById('humanOracleDecisionForm');
        bindOracleChoiceReason(form, (judgment) => agentToolsContract.intentReasonForConstruction(
            candidate.construction,
            judgment
        ));
        form.addEventListener('submit', submitHumanOracleIntentDecision);
        focusHumanOracle();
        toolUiLog('human-oracle-ui', 'human_oracle_intent_view_rendered', {
            oracleBatchId: view.oracle_batch_id,
            unitId: view.unit_id,
            caseId: candidate.case_id,
            completedIntentCount: step - 1
        });
    };

    const renderHumanOracleBehavior = (view, candidate, caseState) => {
        humanOracleView = { phase: 'behavior', view, candidate, caseState };
        const step = humanOracleState.review.projection.active_behavior_annotation_count + 1;
        const intentLabel = caseState.active_intent_judgment === null
            ? '原始 Query · 无 Intent 标注'
            : `Intent：${oracleIntentLabels[caseState.active_intent_judgment]}`;
        const allowedBehaviorJudgments = Object.entries(oracleBehaviorLabels).filter(([value]) => {
            if (caseState.active_intent_judgment === 'uncertain') return value === 'uncertain';
            if (caseState.active_intent_judgment === 'not_equivalent') return value !== 'confirmed_issue';
            return true;
        });
        humanOracleResult.removeAttribute('aria-busy');
        setToolStatus(humanOracleStatus, `Behavior ${step} / 40`, 'is-complete');
        humanOracleResult.innerHTML = `<div class="human-oracle-work">
            <div class="human-oracle-heading">
                <div><span>阶段 2 · Verified Top 3</span><strong>这组搜索行为是否构成问题？</strong></div>
                <code>${escapeHtml(view.unit_id)} · ${escapeHtml(candidate.case_id)}</code>
            </div>
            <div class="human-oracle-case-meta"><span>${escapeHtml(intentLabel)}</span><span>${escapeHtml(oracleConstructionLabels[candidate.construction])}</span></div>
            <div class="human-oracle-query-pair">
                <div class="human-oracle-query"><span>来源 Query</span><strong dir="auto">${escapeHtml(candidate.source_query_text)}</strong></div>
                <div class="human-oracle-query"><span>当前 Query</span><strong dir="auto">${escapeHtml(candidate.query_text)}</strong></div>
            </div>
            <div class="human-oracle-results">
                <section class="human-oracle-result-column"><span>来源结果</span><strong>Top 10 返回 ${candidate.source_returned_at_k}</strong>${renderHumanOracleHits(candidate.source_top_hits)}</section>
                <section class="human-oracle-result-column"><span>当前结果</span><strong>Top 10 返回 ${candidate.variant_returned_at_k}</strong>${renderHumanOracleHits(candidate.variant_top_hits)}</section>
            </div>
            <form class="human-oracle-form" id="humanOracleDecisionForm">
                <fieldset><legend>你的判断</legend><div class="human-oracle-choice-grid">
                    ${allowedBehaviorJudgments.map(([value, label]) => `<label><input type="radio" name="oracleJudgment" value="${value}" required><span>${label}</span></label>`).join('')}
                </div></fieldset>
                <output data-oracle-reason>选择判断后会显示对应的结构化依据。</output>
                <div class="human-oracle-form-actions"><button type="submit">提交并看下一项</button></div>
            </form>
        </div>`;
        const form = document.getElementById('humanOracleDecisionForm');
        bindOracleChoiceReason(form, (judgment) => agentToolsContract.behaviorReasonForIntent(
            candidate.construction,
            caseState.active_intent_judgment,
            judgment
        ));
        form.addEventListener('submit', submitHumanOracleBehaviorDecision);
        focusHumanOracle();
        toolUiLog('human-oracle-ui', 'human_oracle_behavior_view_rendered', {
            oracleBatchId: view.oracle_batch_id,
            unitId: view.unit_id,
            caseId: candidate.case_id,
            completedBehaviorCount: step - 1
        });
    };

    const renderHumanOracleReadyToSeal = () => {
        humanOracleView = { phase: 'seal' };
        humanOracleResult.removeAttribute('aria-busy');
        setToolStatus(humanOracleStatus, '70 / 70 · 可封印', 'is-pass');
        humanOracleResult.innerHTML = `<div class="human-oracle-work">
            <div class="human-oracle-heading"><div><span>Ready to seal</span><strong>70 项人工判断已经完整</strong></div><code>${escapeHtml(humanOracleState.batch.oracle_batch_id)}</code></div>
            <p class="human-oracle-instruction">封印会把当前 30 项 Intent 与 40 项 Behavior 判断冻结成不可变诊断证据，但不会创建 ESCI 标签、质量结论、策略写入或激活。</p>
            <form class="human-oracle-form" id="humanOracleSealForm"><div class="human-oracle-form-actions"><button type="submit">封印 70 项诊断判断</button></div></form>
        </div>`;
        document.getElementById('humanOracleSealForm').addEventListener('submit', sealHumanOracleDecisions);
        focusHumanOracle();
    };

    const renderHumanOracleSealed = (seal) => {
        humanOracleView = null;
        humanOracleResult.removeAttribute('aria-busy');
        setToolStatus(humanOracleStatus, '已封印', 'is-pass');
        humanOracleStartButton.disabled = true;
        humanOracleStartButton.textContent = '诊断 Oracle 已封印';
        humanOracleResult.innerHTML = `<div class="human-oracle-sealed"><strong>Human Diagnostic Oracle 已封印</strong><code>${escapeHtml(seal.oracle_id)}</code><p>30 项 Intent + 40 项 Behavior 已冻结。它仍不是 ESCI 商品标签或正式质量结论，也没有更新策略。</p></div>`;
        focusHumanOracle();
    };

    const refreshHumanOracleStatus = async () => {
        const review = await agentToolsContract.fetchHumanOracleStatus(
            authenticatedFetch,
            protectedToolApiRoot,
            humanOracleState.batch.oracle_batch_id
        );
        validateOracleUiAssociation(humanOracleState.batch, review);
        humanOracleState.review = review;
        setHumanOracleProgress(review);
        toolUiLog('human-oracle-ui', 'human_oracle_status_rendered', {
            oracleBatchId: review.oracle_batch_id,
            status: review.projection.status,
            intentCount: review.projection.active_intent_annotation_count,
            behaviorCount: review.projection.active_behavior_annotation_count,
            invalidatedBehaviorCount: review.projection.invalidated_behavior_annotation_count,
            sealedOracleId: review.projection.sealed_oracle_id
        });
        return review;
    };

    const advanceHumanOracle = async () => {
        const { batch, review } = humanOracleState;
        const projection = review.projection;
        if (projection.status === 'sealed') {
            return renderHumanOracleSealed({ oracle_id: projection.sealed_oracle_id });
        }
        if (projection.active_intent_annotation_count < 30) {
            if (projection.active_behavior_annotation_count !== 0) humanOracleFailure('behavior_started_before_intent_complete');
            const nextCase = review.cases.find((item) => item.construction !== 'identity'
                && item.active_intent_annotation_id === null);
            if (!nextCase) return humanOracleFailure('intent_progress_has_no_next_case');
            const view = await agentToolsContract.fetchHumanOracleIntentView(
                authenticatedFetch, protectedToolApiRoot, batch.oracle_batch_id, nextCase.unit_id
            );
            const unit = batch.units.find((item) => item.unit_id === nextCase.unit_id);
            const unitCaseIds = review.cases.filter((item) => item.unit_id === nextCase.unit_id).map((item) => item.case_id).sort();
            const viewCaseIds = view.candidates.map((item) => item.case_id).sort();
            if (!unit
                || view.source_case_id !== unit.source_case_id
                || unitCaseIds.join('|') !== viewCaseIds.join('|')) humanOracleFailure('oracle_intent_view_unit_mismatch');
            const candidate = view.candidates.find((item) => item.case_id === nextCase.case_id);
            if (!candidate
                || candidate.construction !== nextCase.construction
                || !candidate.requires_intent_annotation) humanOracleFailure('oracle_intent_candidate_mismatch');
            return renderHumanOracleIntent(view, candidate, nextCase);
        }
        if (projection.active_behavior_annotation_count < 40
            || projection.invalidated_behavior_annotation_count > 0) {
            const nextCase = review.cases.find((item) => item.active_behavior_annotation_id === null);
            if (!nextCase) return humanOracleFailure('behavior_progress_has_no_next_case');
            const view = await agentToolsContract.fetchHumanOracleBehaviorView(
                authenticatedFetch, protectedToolApiRoot, batch.oracle_batch_id, nextCase.unit_id
            );
            const unit = batch.units.find((item) => item.unit_id === nextCase.unit_id);
            const unitCaseIds = review.cases.filter((item) => item.unit_id === nextCase.unit_id).map((item) => item.case_id).sort();
            const viewCaseIds = view.candidates.map((item) => item.case_id).sort();
            const candidate = view.candidates.find((item) => item.case_id === nextCase.case_id);
            if (!unit
                || view.diagnostic_id !== latestBadCaseSummary.diagnostic_id
                || view.source_case_id !== unit.source_case_id
                || unitCaseIds.join('|') !== viewCaseIds.join('|')
                || !candidate
                || candidate.construction !== nextCase.construction
                || candidate.intent_annotation_id !== nextCase.active_intent_annotation_id) humanOracleFailure('oracle_behavior_candidate_mismatch');
            return renderHumanOracleBehavior(view, candidate, nextCase);
        }
        if (projection.active_intent_annotation_count === 30
            && projection.active_behavior_annotation_count === 40
            && projection.invalidated_behavior_annotation_count === 0
            && projection.status === 'ready_to_seal') return renderHumanOracleReadyToSeal();
        return humanOracleFailure('oracle_progress_state_invalid');
    };

    const humanOracleErrorMessage = (error) => {
        if (error.status === 401) return '登录状态已失效，请刷新页面并重新输入凭据。';
        if (error.status === 403) return '当前登录身份不是这个 Oracle 批次的站长。';
        if (error.status === 409) return '证据或判断版本已变化，请点击“继续人工诊断”获取最新状态。';
        if (error.status === 422 || String(error.code || '').startsWith('invalid_human_oracle')) return 'Oracle 契约或关联校验失败，本轮内容已拒绝展示。';
        if (error.code === 'secure_client_action_id_unavailable') return '浏览器无法生成安全操作 ID，不能提交判断。';
        return 'Human Diagnostic Oracle 暂时不可用，请稍后继续。';
    };

    const failHumanOracleUi = (error, operation) => {
        const errorCode = error.code || 'network_error';
        humanOracleResult.removeAttribute('aria-busy');
        setToolStatus(humanOracleStatus, '执行失败', 'is-fail');
        humanOracleResult.innerHTML = `<p class="agent-tool-empty is-error">${escapeHtml(humanOracleErrorMessage(error))}</p>`;
        humanOracleStartButton.disabled = latestBadCaseSummary === null;
        humanOracleStartButton.textContent = humanOracleState ? '继续人工诊断' : '重新开始人工诊断';
        focusHumanOracle();
        toolUiLog('human-oracle-ui', 'human_oracle_operation_failed', {
            operation: operation,
            oracleBatchId: humanOracleState?.batch?.oracle_batch_id || null,
            errorCode: errorCode,
            statusCode: Number(error.status) || 0
        }, 'warn');
    };

    const startHumanOracle = async () => {
        if (!latestBadCaseSummary || !agentToolsContract?.fetchHumanOracleBatch) return;
        renderToolLoading(humanOracleStatus, humanOracleResult, '正在创建固定 40-case / 20-cluster 诊断批次；不会自动填充任何判断。');
        humanOracleStartButton.disabled = true;
        humanOracleStartButton.textContent = '创建诊断批次中…';
        toolUiLog('human-oracle-ui', 'human_oracle_batch_requested', {
            diagnosticId: latestBadCaseSummary.diagnostic_id,
            querySetId: latestBadCaseSummary.query_set_id
        });
        try {
            if (!humanOracleState) {
                const batch = await agentToolsContract.fetchHumanOracleBatch(
                    authenticatedFetch,
                    protectedToolApiRoot,
                    latestBadCaseSummary.diagnostic_id,
                    latestBadCaseSummary.query_set_id
                );
                humanOracleState = { batch, review: null };
                toolUiLog('human-oracle-ui', 'human_oracle_batch_created', {
                    oracleBatchId: batch.oracle_batch_id,
                    diagnosticId: batch.diagnostic_id,
                    clusterCount: batch.selected_cluster_count,
                    candidateCount: batch.selected_candidate_count,
                    intentCount: batch.synthetic_intent_candidate_count
                });
            }
            await refreshHumanOracleStatus();
            await advanceHumanOracle();
            const sealed = humanOracleState.review.projection.status === 'sealed';
            humanOracleStartButton.disabled = sealed;
            humanOracleStartButton.textContent = sealed ? '诊断 Oracle 已封印' : '继续当前人工诊断';
        } catch (error) {
            failHumanOracleUi(error, 'batch_or_status');
        }
    };

    async function submitHumanOracleIntentDecision(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const selected = form.querySelector('input[name="oracleJudgment"]:checked')?.value || '';
        if (!selected || humanOracleView?.phase !== 'intent') return;
        const { view, candidate, caseState } = humanOracleView;
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = '提交中…';
        humanOracleResult.setAttribute('aria-busy', 'true');
        const reason = agentToolsContract.intentReasonForConstruction(candidate.construction, selected);
        try {
            const annotation = await agentToolsContract.submitHumanOracleIntent(
                authenticatedFetch,
                protectedToolApiRoot,
                {
                    oracle_batch_id: view.oracle_batch_id,
                    unit_id: view.unit_id,
                    case_id: candidate.case_id,
                    presentation_context_sha256: candidate.intent_context_sha256,
                    judgment: selected,
                    reason_code: reason,
                    client_action_id: safeClientActionId(),
                    expected_previous_annotation_id: caseState.expected_previous_intent_annotation_id
                },
                candidate.construction
            );
            humanOracleView = null;
            toolUiLog('human-oracle-ui', 'human_oracle_intent_submitted', {
                oracleBatchId: annotation.oracle_batch_id,
                unitId: annotation.unit_id,
                caseId: annotation.case_id,
                intentAnnotationId: annotation.intent_annotation_id
            });
            await refreshHumanOracleStatus();
            await advanceHumanOracle();
        } catch (error) {
            failHumanOracleUi(error, 'intent_submit');
        }
    }

    async function submitHumanOracleBehaviorDecision(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const selected = form.querySelector('input[name="oracleJudgment"]:checked')?.value || '';
        if (!selected || humanOracleView?.phase !== 'behavior') return;
        const { view, candidate, caseState } = humanOracleView;
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = '提交中…';
        humanOracleResult.setAttribute('aria-busy', 'true');
        const reason = agentToolsContract.behaviorReasonForIntent(
            candidate.construction,
            caseState.active_intent_judgment,
            selected
        );
        try {
            const annotation = await agentToolsContract.submitHumanOracleBehavior(
                authenticatedFetch,
                protectedToolApiRoot,
                {
                    oracle_batch_id: view.oracle_batch_id,
                    unit_id: view.unit_id,
                    case_id: candidate.case_id,
                    presentation_context_sha256: candidate.behavior_context_sha256,
                    judgment: selected,
                    reason_code: reason,
                    intent_annotation_id: caseState.active_intent_annotation_id,
                    client_action_id: safeClientActionId(),
                    expected_previous_annotation_id: caseState.expected_previous_behavior_annotation_id
                },
                candidate.construction,
                caseState.active_intent_judgment
            );
            humanOracleView = null;
            toolUiLog('human-oracle-ui', 'human_oracle_behavior_submitted', {
                oracleBatchId: annotation.oracle_batch_id,
                unitId: annotation.unit_id,
                caseId: annotation.case_id,
                behaviorAnnotationId: annotation.behavior_annotation_id,
                intentAnnotationId: annotation.intent_annotation_id
            });
            await refreshHumanOracleStatus();
            await advanceHumanOracle();
        } catch (error) {
            failHumanOracleUi(error, 'behavior_submit');
        }
    }

    async function sealHumanOracleDecisions(event) {
        event.preventDefault();
        const projection = humanOracleState?.review?.projection;
        if (!projection
            || projection.status !== 'ready_to_seal'
            || projection.active_intent_annotation_count !== 30
            || projection.active_behavior_annotation_count !== 40
            || projection.invalidated_behavior_annotation_count !== 0) return humanOracleFailure('oracle_seal_gate_closed');
        const submitButton = event.currentTarget.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = '封印中…';
        humanOracleResult.setAttribute('aria-busy', 'true');
        try {
            const seal = await agentToolsContract.sealHumanOracleBatch(
                authenticatedFetch,
                protectedToolApiRoot,
                humanOracleState.batch.oracle_batch_id,
                safeClientActionId()
            );
            setHumanOracleProgress({ projection: {
                active_intent_annotation_count: 30,
                active_behavior_annotation_count: 40
            }, cases: humanOracleState.review.cases });
            renderHumanOracleSealed(seal);
            toolUiLog('human-oracle-ui', 'human_oracle_batch_sealed', {
                oracleBatchId: seal.oracle_batch_id,
                oracleId: seal.oracle_id,
                intentCount: seal.synthetic_intent_annotation_count,
                behaviorCount: seal.behavior_annotation_count,
                strategyWriteCount: seal.strategy_write_count
            });
        } catch (error) {
            failHumanOracleUi(error, 'seal');
        }
    }

    const renderRetrievalAnalysis = (analysis) => {
        const comparison = analysis?.comparison || {};
        const aggregate = comparison.aggregate_deltas || {};
        const union = aggregate.recall_union?.judged_relevant_coverage || {};
        const fusion = aggregate.fusion || {};
        const coarse = aggregate.coarse_rank || {};
        const gateResult = comparison.gate_result || {};
        const checks = Array.isArray(gateResult.checks) ? gateResult.checks : [];
        const failedChecks = checks.filter((item) => item.passed !== true);
        const uniqueRelevant = Number(comparison.candidate_strategy?.unique_relevant_contribution) || 0;
        const baselineRecallLoss = Number(findingBySubtype(analysis.diagnosis, 'known_relevant_missing_from_all_channels')?.stage_dropped_relevant_count) || 0;
        const candidateRecallLoss = Number(findingBySubtype(analysis.candidate_diagnosis, 'known_relevant_missing_from_all_channels')?.stage_dropped_relevant_count) || 0;
        const transitions = comparison.candidate_stage_transitions || {};
        const selectedWeights = comparison.candidate_strategy?.fusion_weights || {};
        const experiments = Array.isArray(analysis.experiments) ? analysis.experiments : [];
        const passed = gateResult.passed === true;

        renderAgentRuntimeTrace(analysis.agent_run);

        pipelineDiagnosisState.classList.remove('is-pass', 'is-fail');
        pipelineDiagnosisState.classList.add(passed ? 'is-pass' : 'is-fail');
        pipelineDiagnosisState.textContent = passed ? '候选通过' : '候选已拦截';
        pipelineStageGrid.innerHTML = `
            <article class="is-pass"><span>01 · Recall</span><strong>召回覆盖提升</strong><p>多字段通道新增 <b>${uniqueRelevant}</b> 个仅由该通道找回的相关 Query-商品项；宏平均覆盖率 ${escapeHtml(formatPercent(union.baseline))} → ${escapeHtml(formatPercent(union.candidate))}（${escapeHtml(formatPointDelta(union.delta))}）。微平均第一丢失数从 ${baselineRecallLoss} 降至 ${candidateRecallLoss}。</p></article>
            <article class="${Number(fusion['ndcg@10']?.delta) < 0 || Number(fusion['mrr@10']?.delta) < 0 ? 'is-fail' : 'is-pass'}"><span>02 · Fusion</span><strong>${Number(fusion['ndcg@10']?.delta) < 0 || Number(fusion['mrr@10']?.delta) < 0 ? '融合候选被淘汰' : '保守融合通过'}</strong><p>均匀 RRF 先失败，Agent 再把多字段通道权重降为 <b>${escapeHtml(formatMetric(selectedWeights['multi-field-bm25-recall-v1']))}</b>。最终融合 Recall@10 ${escapeHtml(formatDelta(fusion['judged_recall@10']?.delta))}、nDCG@10 ${escapeHtml(formatDelta(fusion['ndcg@10']?.delta))}、MRR@10 ${escapeHtml(formatDelta(fusion['mrr@10']?.delta))}。</p></article>
            <article class="${Number(coarse['ndcg@10']?.delta) < 0 || Number(coarse['mrr@10']?.delta) < 0 ? 'is-fail' : 'is-pass'}"><span>03 · Coarse rank</span><strong>${Number(coarse['ndcg@10']?.delta) < 0 || Number(coarse['mrr@10']?.delta) < 0 ? '最终质量未守住' : '最终质量守住'}</strong><p>相对候选融合，标题粗排的 nDCG@10 ${escapeHtml(formatDelta(transitions['ndcg@10']?.delta))}、MRR@10 ${escapeHtml(formatDelta(transitions['mrr@10']?.delta))}；相对基线最终 nDCG ${escapeHtml(formatDelta(coarse['ndcg@10']?.delta))}、MRR ${escapeHtml(formatDelta(coarse['mrr@10']?.delta))}。这不能证明粗排已利用多字段，只证明本轮没有被它拖坏。</p></article>
            <article class="is-warn"><span>04 · Fine rank</span><strong>证据不足</strong><p>精排和最终业务重排尚未实现；Agent 不会根据最终结果虚构这一层的根因。</p></article>`;
        pipelineDecisionSummary.classList.remove('is-pass', 'is-fail');
        pipelineDecisionSummary.classList.add(passed ? 'is-pass' : 'is-fail');
        pipelineDecisionSummary.innerHTML = passed
            ? '<b>结论：</b>均匀融合和激进权重都被淘汰；保守 RRF 通过 12 项 smoke 工程门禁，可以进入站长审批。它尚未写入策略平台，也没有改变线上搜索。'
            : '<b>结论：</b>多字段召回找回了相关项，但全部受控融合候选均未通过门禁，本轮不生成可更新策略。';
        pipelineEvidenceStrip.innerHTML = `
            <span>${escapeHtml(analysis.retrieval_run_id || 'Retrieval Run')}</span>
            <span>${escapeHtml(analysis.candidate_run_id || 'Candidate Run')}</span>
            <span>${escapeHtml(analysis.comparison_id || 'Retrieval Comparison')}</span>
            <span>${escapeHtml(analysis.diagnosis_id || 'Stage Diagnosis')}</span>`;

        strategyName.textContent = '多字段 BM25 + 保守 RRF 候选';
        setState(passed ? '等待站长审批' : '门禁拒绝', 'is-pending');
        proposalGrid.innerHTML = `
            <div class="proposal-full strategy-detail-card">
                <span>Agent 选择的候选</span><strong>品牌 + 标题 + 卖点 + 描述召回，RRF 权重 1 / 1 / 0.1</strong>
                <p><b>为什么尝试：</b>标题词法召回有 ${baselineRecallLoss} 个相关项在召回层首先丢失；“精确词通道无独有覆盖”只是疑点，不能直接当作冗余结论。</p>
                <p><b>做了什么：</b>新增 label-blind BM25F 风格通道；均匀融合失败后，继续跑保守和激进权重消融，由 12 项门禁选择保守方案。</p>
                <p><b>本轮结论：</b>${escapeHtml(passed ? '通过 smoke 工程门禁，只请求审批；未更新 active 策略。' : '没有安全候选，本轮不更新策略。')}</p>
            </div>
            <div class="proposal-full proposal-metrics-card"><span>阶段指标变化</span>
                <div class="metric-triplet">
                    <div class="metric-item"><span>召回并集覆盖率</span><strong class="metric-up">${escapeHtml(formatPointDelta(union.delta))}</strong><small>${escapeHtml(formatPercent(union.baseline))} → ${escapeHtml(formatPercent(union.candidate))}</small></div>
                    <div class="metric-item"><span>融合 nDCG@10</span><strong class="${metricClass(fusion['ndcg@10']?.delta)}">${escapeHtml(formatDelta(fusion['ndcg@10']?.delta))}</strong><small>${escapeHtml(formatMetric(fusion['ndcg@10']?.baseline))} → ${escapeHtml(formatMetric(fusion['ndcg@10']?.candidate))}</small></div>
                    <div class="metric-item"><span>粗排 MRR@10</span><strong class="${metricClass(coarse['mrr@10']?.delta)}">${escapeHtml(formatDelta(coarse['mrr@10']?.delta))}</strong><small>${escapeHtml(formatMetric(coarse['mrr@10']?.baseline))} → ${escapeHtml(formatMetric(coarse['mrr@10']?.candidate))}</small></div>
                </div>
            </div>
            <div><span>新增召回</span><strong class="metric-up">+${uniqueRelevant} 个独有相关 Query-商品项</strong><p>说明新通道扩大了封闭池覆盖；不代表 Amazon 全库 Recall。</p></div>
            <div><span>门禁结果</span><strong class="${passed ? 'metric-up' : 'metric-risk'}">${passed ? '全部通过' : `${failedChecks.length} 项未通过`}</strong><p>${escapeHtml(failedChecks.map((item) => retrievalGateLabels[item.name] || item.name).join('；') || '等待审批')}</p></div>`;
        evidenceStrip.innerHTML = pipelineEvidenceStrip.innerHTML;

        const findings = analysis?.diagnosis?.findings || [];
        diagnosisSummary.innerHTML = `<div class="diagnosis-total"><strong>${escapeHtml(findings.length)}</strong><span>项阶段证据</span></div><ul class="diagnosis-list">${findings.map((item) => `<li><span>${escapeHtml({ known_relevant_missing_from_all_channels: '所有现有召回通道都遗漏相关项', no_unique_relevant_coverage: '精确词通道无独有覆盖，需做消融', fusion_quality_regression: 'RRF 低于最佳单通道' }[item.subtype] || item.subtype)}</span><strong>${escapeHtml(item.stage_dropped_relevant_count)}</strong></li>`).join('')}</ul><p class="diagnosis-basis">右侧数字是该阶段首先丢失的相关项数；指标影响另按 20 个 Query 宏平均计算，两者不能互相当作补数。</p>`;
        const experimentLabels = {
            'title-exact-multifield-v1': '均匀 RRF · 1 / 1 / 1',
            'title-exact-multifield-weighted-v1': '保守 RRF · 1 / 1 / 0.1',
            'title-exact-multifield-weighted-aggressive-v1': '激进 RRF · 1 / 0.5 / 0.25'
        };
        experimentTable.innerHTML = `<div class="experiment-list">${experiments.map((experiment) => {
            const selected = experiment.candidate_run_id === analysis.candidate_run_id;
            const failed = experiment.failed_gates || [];
            return `<article class="experiment-row ${selected ? 'is-selected' : ''}"><div class="experiment-name"><span>${selected ? 'Agent 最终候选' : '受控候选'}</span><strong>${escapeHtml(experimentLabels[experiment.pipeline_variant] || experiment.pipeline_variant)}</strong><small>${escapeHtml(experiment.candidate_run_id)}</small></div><div class="experiment-metric"><span>融合变化</span><strong class="${metricClass(experiment.fusion_ndcg_at_10_delta)}">nDCG ${escapeHtml(formatDelta(experiment.fusion_ndcg_at_10_delta))}</strong><small>MRR ${escapeHtml(formatDelta(experiment.fusion_mrr_at_10_delta))} · 最差 Query ${escapeHtml(formatDelta(experiment.worst_fusion_query_ndcg_at_10_delta))}</small></div><div class="experiment-gate"><span>门禁判定</span><strong class="${experiment.gate_passed ? 'metric-up' : 'metric-risk'}">${experiment.gate_passed ? '通过' : '淘汰'}</strong><small>${escapeHtml(failed.length ? failed.map((name) => retrievalGateLabels[name] || name).join('；') : '12 项全部通过')}</small></div></article>`;
        }).join('')}</div>`;
        gateChecks.innerHTML = `<ul class="gate-list">${checks.map((check) => `<li class="${check.passed ? 'is-pass' : 'is-fail'}"><span>${escapeHtml(retrievalGateLabels[check.name] || check.name)}</span><strong>${check.passed ? '通过' : '未通过'}</strong><small>${escapeHtml(formatDelta(check.observed))} ${escapeHtml(check.comparator || '')} ${escapeHtml(formatDelta(check.threshold))}</small></li>`).join('')}</ul>`;
        modelMode.textContent = '确定性阶段诊断 · 0 次模型调用';
        const changedQueryExamples = Array.isArray(analysis.changed_query_examples)
            ? analysis.changed_query_examples
            : comparison.per_query.map((item) => ({
                ...item,
                pipeline_variant: comparison.candidate_strategy.pipeline_variant,
                gate_passed: passed,
                is_selected_comparison: true
            }));
        renderRetrievalQueryComparisons(changedQueryExamples);
        debug('retrieval_stage_analysis_rendered', {
            candidateRunId: analysis.candidate_run_id || null,
            comparisonId: analysis.comparison_id || null,
            diagnosisId: analysis.diagnosis_id || null,
            failedGateCount: failedChecks.length,
            uniqueRelevantCount: uniqueRelevant
        });
    };

    const renderLoading = () => {
        renderRuntimeLoading();
        strategyName.textContent = 'Agent 正在找 Bad Case';
        setState('分析中', 'is-running');
        proposalGrid.innerHTML = `
            <div><span>Bad Case 样本</span><strong>分析中…</strong><p>正在跑 baseline 与候选策略。</p></div>
            <div><span>候选策略</span><strong>分析中…</strong><p>正在从受控策略空间生成并运行多个可解释候选。</p></div>
            <div><span>指标变化</span><strong>计算中…</strong><p>Harness 正在比较同一批 Query 的两个 Run。</p></div>
            <div><span>局部风险</span><strong>扫描中…</strong><p>正在检查退化 Query，避免只看平均分。</p></div>`;
        diagnosisSummary.innerHTML = '<p class="reasoning-empty">正在扫描 Query 并提取可证伪的失败信号…</p>';
        experimentTable.innerHTML = '<p class="reasoning-empty">正在运行受控候选参数，并逐一生成 Comparison…</p>';
        gateChecks.innerHTML = '<p class="reasoning-empty">等待所有候选实验完成后执行发布门禁…</p>';
        modelMode.textContent = '确定性规则 · 运行中';
        queryComparisonCount.textContent = '— / 10';
        queryComparisonList.innerHTML = '<div class="query-comparison-empty">正在生成 10 组排序对比…</div>';
        pipelineDiagnosisState.classList.remove('is-pass', 'is-fail');
        pipelineDiagnosisState.textContent = '分析中';
        pipelineStageGrid.innerHTML = '<article><span>01 · Recall</span><strong>扫描中…</strong><p>检查相关商品是否进入召回并集。</p></article><article><span>02 · Fusion</span><strong>等待中…</strong><p>等待召回结果后运行 RRF。</p></article><article><span>03 · Coarse rank</span><strong>等待中…</strong><p>等待融合候选进入粗排。</p></article><article><span>04 · Fine rank</span><strong>未实现</strong><p>本轮不会虚构这一层的证据。</p></article>';
        pipelineDecisionSummary.classList.remove('is-pass', 'is-fail');
        pipelineDecisionSummary.textContent = 'Agent 正在用阶段 lineage 定位第一处相关商品丢失。';
        pipelineEvidenceStrip.innerHTML = '<span>Retrieval Run</span><span>Candidate Run</span><span>Retrieval Comparison</span><span>Stage Diagnosis</span>';
        evidenceStrip.innerHTML = '<span>等待本轮证据</span>';
    };

    const renderError = (message) => {
        clearRuntimeTrace({
            label: '轨迹不可用',
            className: 'is-fail',
            message: '分析没有完成，本轮未保留任何可展示或回放的运行轨迹。'
        });
        strategyName.textContent = 'Agent 分析失败';
        setState('分析失败', 'is-error');
        proposalGrid.innerHTML = `<div class="proposal-full"><span>错误</span><strong>${escapeHtml(message)}</strong><p>本轮没有产生可审阅的 proposal，请按提示重试。</p></div>`;
        diagnosisSummary.innerHTML = '<p class="reasoning-empty is-error">诊断流程未完成。</p>';
        experimentTable.innerHTML = '<p class="reasoning-empty is-error">候选实验未完成。</p>';
        gateChecks.innerHTML = '<p class="reasoning-empty is-error">没有可验证的门禁结果。</p>';
        modelMode.textContent = '不可用';
        queryComparisonCount.textContent = '0 / 10';
        queryComparisonList.innerHTML = '<div class="query-comparison-empty is-error">对比结果加载失败，请重新分析。</div>';
        pipelineDiagnosisState.classList.remove('is-pass');
        pipelineDiagnosisState.classList.add('is-fail');
        pipelineDiagnosisState.textContent = '诊断失败';
        pipelineStageGrid.innerHTML = '<article class="is-warn"><span>01 · Recall</span><strong>未完成</strong><p>没有生成可验证的召回证据。</p></article><article class="is-warn"><span>02 · Fusion</span><strong>未完成</strong><p>没有生成可验证的融合证据。</p></article><article class="is-warn"><span>03 · Coarse rank</span><strong>未完成</strong><p>没有生成可验证的粗排证据。</p></article><article class="is-warn"><span>04 · Fine rank</span><strong>未实现</strong><p>本轮不会虚构这一层的证据。</p></article>';
        pipelineDecisionSummary.classList.add('is-fail');
        pipelineDecisionSummary.textContent = '阶段诊断没有完成，本轮不会产生或更新策略。';
        pipelineEvidenceStrip.innerHTML = '<span>本轮无 Retrieval Run</span><span>本轮无 Candidate Run</span><span>本轮无 Comparison</span><span>本轮无 Diagnosis</span>';
        evidenceStrip.innerHTML = '<span>本轮没有生成证据</span>';
    };

    const renderLegacyProposal = (proposal) => {
        renderProposal(proposal);
        clearRuntimeTrace({
            label: '旧接口未提供',
            message: '兼容接口没有 Agent Runtime Trace；页面不会用推测步骤替代真实轨迹。'
        });
        pipelineDiagnosisState.classList.remove('is-pass', 'is-fail');
        pipelineDiagnosisState.textContent = '兼容模式';
        pipelineStageGrid.innerHTML = '<article class="is-warn"><span>01 · Recall</span><strong>旧后端未提供</strong><p>本轮只显示旧版候选集排序分析。</p></article><article class="is-warn"><span>02 · Fusion</span><strong>旧后端未提供</strong><p>没有阶段融合证据。</p></article><article class="is-warn"><span>03 · Coarse rank</span><strong>旧后端未提供</strong><p>没有独立粗排证据。</p></article><article class="is-warn"><span>04 · Fine rank</span><strong>未实现</strong><p>没有证据时不会归因到这一层。</p></article>';
        pipelineDecisionSummary.classList.remove('is-pass', 'is-fail');
        pipelineDecisionSummary.textContent = '服务器尚未提供阶段诊断接口；当前展示的是旧版候选集排序分析，不能据此判断多路召回或粗排问题。';
        pipelineEvidenceStrip.innerHTML = '<span>Legacy proposal evidence only</span>';
    };

    const requestProposal = async () => {
        renderLoading();
        startButton.disabled = true;
        startButton.textContent = '分析中…';
        debug('retrieval_stage_analysis_requested');
        let errorCode = null;
        try {
            if (!agentContract?.fetchAnalysis) throw new Error('analysis_contract_unavailable');
            const outcome = await agentContract.fetchAnalysis(authenticatedFetch, apiRoot);
            if (outcome.kind === 'legacy') {
                debug('retrieval_stage_analysis_fallback');
                renderLegacyProposal(outcome.proposal);
            } else {
                renderRetrievalAnalysis(outcome.analysis);
            }
        } catch (error) {
            errorCode = errorCode || error.code || error.message || 'network_error';
            console.warn('[search-console:agent-ui]', {
                timestamp: new Date().toISOString(),
                event: 'retrieval_stage_analysis_failed',
                errorCode
            });
            renderError(error.status === 401
                ? '登录状态已失效，请刷新页面并重新输入凭据'
                : errorCode === 'invalid_analysis_response'
                    ? '分析证据不完整或不一致，本轮已拒绝展示和更新'
                    : '策略分析服务暂时不可用，请稍后重试');
        } finally {
            startButton.disabled = false;
            startButton.textContent = '重新分析';
        }
    };

    initializeOwnerAuth();
    ownerLoginForm?.addEventListener('submit', submitOwnerLogin);
    ownerLogoutButton?.addEventListener('click', logoutOwner);
    window.addEventListener('pagehide', () => ownerAuthSession?.clear('pagehide'));

    startButton?.addEventListener('click', requestProposal);
    agentEvalRunButton?.addEventListener('click', runAgentEval);
    queryConstructorBuildButton?.addEventListener('click', buildQuerySet);
    badCaseRunButton?.addEventListener('click', runBadCaseDiagnostics);
    diagnosticPlanButton?.addEventListener('click', runDiagnosticExperimentPlan);
    humanOracleStartButton?.addEventListener('click', startHumanOracle);

    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    navToggle?.addEventListener('click', () => {
        const open = navLinks.classList.toggle('active');
        navToggle.classList.toggle('active', open);
        navToggle.setAttribute('aria-expanded', String(open));
    });
});
