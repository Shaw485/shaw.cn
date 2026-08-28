document.addEventListener('DOMContentLoaded', () => {
    const isLocal = ['127.0.0.1', 'localhost'].includes(window.location.hostname);
    const apiRoot = isLocal ? 'http://127.0.0.1:8000' : '/search-eval-api';
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

    const renderQueryComparisons = (comparisons) => {
        const rows = Array.isArray(comparisons) ? comparisons.slice(0, 10) : [];
        queryComparisonCount.textContent = `${rows.length} / 10`;
        if (!rows.length) {
            queryComparisonList.innerHTML = '<div class="query-comparison-empty">本轮未返回可对比的 Query 结果。</div>';
            debug('query_comparisons_rendered', { comparisonCount: 0, outcomeCounts: {} });
            return;
        }

        const outcomeCounts = rows.reduce((counts, item) => {
            const outcome = ['improvement', 'regression', 'unchanged'].includes(item.outcome) ? item.outcome : 'unknown';
            counts[outcome] = (counts[outcome] || 0) + 1;
            return counts;
        }, {});
        queryComparisonList.innerHTML = rows.map((item, index) => {
            const outcome = ['improvement', 'regression', 'unchanged'].includes(item.outcome) ? item.outcome : 'unknown';
            const outcomeLabel = {
                improvement: '改善', regression: '退化', unchanged: '持平', unknown: '未判定'
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
        debug('query_comparisons_rendered', { comparisonCount: rows.length, outcomeCounts });
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

    const renderLoading = () => {
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
    };

    const renderError = (message) => {
        strategyName.textContent = 'Agent 分析失败';
        setState('分析失败', 'is-error');
        proposalGrid.innerHTML = `<div class="proposal-full"><span>错误</span><strong>${escapeHtml(message)}</strong><p>本轮没有产生可审阅的 proposal，请按提示重试。</p></div>`;
        diagnosisSummary.innerHTML = '<p class="reasoning-empty is-error">诊断流程未完成。</p>';
        experimentTable.innerHTML = '<p class="reasoning-empty is-error">候选实验未完成。</p>';
        gateChecks.innerHTML = '<p class="reasoning-empty is-error">没有可验证的门禁结果。</p>';
        modelMode.textContent = '不可用';
        queryComparisonCount.textContent = '0 / 10';
        queryComparisonList.innerHTML = '<div class="query-comparison-empty is-error">对比结果加载失败，请重新分析。</div>';
    };

    const requestProposal = async () => {
        renderLoading();
        startButton.disabled = true;
        startButton.textContent = '分析中…';
        debug('strategy_proposal_requested');
        let errorCode = null;
        try {
            const response = await fetch(`${apiRoot}/agent/strategy/propose`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ profile: 'smoke' })
            });
            if (!response.ok) {
                errorCode = `http_${response.status}`;
                if (response.status === 401) {
                    renderError('登录状态已失效，请刷新页面并重新输入凭据');
                    return;
                }
                throw new Error(errorCode);
            }
            renderProposal(await response.json());
        } catch (error) {
            errorCode = errorCode || error.message || 'network_error';
            console.warn('[search-console:agent-ui]', {
                timestamp: new Date().toISOString(),
                event: 'strategy_proposal_failed',
                errorCode
            });
            renderError('策略分析服务暂时不可用，请稍后重试');
        } finally {
            startButton.disabled = false;
            startButton.textContent = '重新分析';
        }
    };

    startButton?.addEventListener('click', requestProposal);

    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    navToggle?.addEventListener('click', () => {
        const open = navLinks.classList.toggle('active');
        navToggle.classList.toggle('active', open);
        navToggle.setAttribute('aria-expanded', String(open));
    });
});
