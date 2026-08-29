const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('Agent workbench is a dedicated page with the required dynamic nodes', () => {
    const page = read('search-agent.html');
    for (const id of [
        'agentStartAnalysis',
        'agentDecisionState',
        'agentStrategyName',
        'agentProposalGrid',
        'agentEvidenceStrip',
        'agentDiagnosisSummary',
        'agentExperimentTable',
        'agentGateChecks',
        'agentModelMode',
        'queryComparisonCount',
        'queryComparisonList'
    ]) {
        assert.match(page, new RegExp(`id="${id}"`));
    }
    assert.match(page, /js\/search-agent-contract\.js/);
    assert.match(page, /js\/search-agent\.js/);
    assert.match(page, /js\/search-agent-contract\.js\?v=20260829-public-workbench-v1/);
    assert.match(page, /search-eval\.html/);
    assert.match(page, /search-strategy\.html/);
});

test('Agent workbench opens directly without login, password or auth-check interaction', () => {
    const page = read('search-agent.html');
    const script = read('js/search-agent.js');
    const contract = read('js/search-agent-contract.js');

    assert.match(page, /<main class="agent-page" id="agentWorkbenchPage">/);
    assert.doesNotMatch(page, /agentOwner|owner-login|type="password"|\u767b\u5f55\u5de5\u4f5c\u53f0|\u9000\u51fa\u767b\u5f55/);
    assert.doesNotMatch(page, /js\/search-agent-auth\.js|search-agent-auth-check\.json/);
    assert.doesNotMatch(script, /SearchAgentAuth|ownerAuth|ownerLogin|ownerPassword|authenticatedFetch|search-agent-auth-check/);
    assert.match(script, /const publicAnalysisFetch = window\.fetch\.bind\(window\)/);
    assert.match(script, /agentContract\.fetchAnalysis\(publicAnalysisFetch, apiRoot\)/);
    assert.equal((script.match(/window\.fetch\.bind\(window\)/g) || []).length, 1);
    assert.match(contract, /`\$\{apiRoot\}\/agent\/retrieval\/analyze`/);
    assert.doesNotMatch(contract, /agent\/strategy\/propose/);
});

test('Agent workbench exposes diagnosis, candidate search and release gates', () => {
    const page = read('search-agent.html');
    const script = read('js/search-agent.js');
    const styles = read('css/search-agent.css');
    assert.match(page, /Analysis → Experiments → Gate/);
    assert.match(page, /工程默认值，尚不代表生产发布政策/);
    assert.match(script, /root_cause_counts/);
    assert.match(script, /experiment\.evaluations/);
    assert.match(script, /release_gate/);
    assert.match(script, /mrr@10_floor/);
    assert.match(script, /success@5_floor/);
    assert.match(script, /optimizer_reasoning_rendered/);
    assert.match(styles, /\.agent-reasoning-grid/);
    assert.match(styles, /\.experiment-row\.is-selected/);
    assert.match(styles, /\.gate-list/);
});

test('Agent button runs stage diagnosis before choosing a strategy experiment', () => {
    const page = read('search-agent.html');
    const script = read('js/search-agent.js');
    const contract = read('js/search-agent-contract.js');
    const styles = read('css/search-agent.css');
    for (const id of [
        'pipelineDiagnosisState',
        'pipelineStageGrid',
        'pipelineDecisionSummary',
        'pipelineEvidenceStrip'
    ]) {
        assert.match(page, new RegExp(`id="${id}"`));
    }
    assert.match(contract, /\/agent\/retrieval\/analyze/);
    assert.match(contract, /validateAnalysis/);
    assert.match(contract, /invalid_analysis_response/);
    assert.match(script, /renderRetrievalAnalysis/);
    assert.match(script, /unique_relevant_contribution/);
    assert.match(script, /fusion_ndcg_at_10_floor/);
    assert.match(script, /coarse_mrr_at_10_floor/);
    assert.match(contract, /proposal\.next_action/);
    assert.match(script, /保守 RRF 通过 12 项 smoke 工程门禁/);
    assert.match(script, /本轮没有生成证据/);
    assert.match(script, /本轮无 Retrieval Run/);
    assert.match(styles, /\.pipeline-stage-grid/);
    assert.doesNotMatch(contract, /agent\/strategy\/propose/);
    assert.doesNotMatch(script, /retrieval_stage_analysis_fallback|renderLegacyProposal/);
    assert.doesNotMatch(script, /\/agent\/strategy\/decision/);
});

test('Agent workbench renders a read-only, accessible runtime trace', () => {
    const page = read('search-agent.html');
    const script = read('js/search-agent.js');
    const contract = read('js/search-agent-contract.js');
    const styles = read('css/search-agent.css');
    const docs = read('docs/SEARCH_STRATEGY_DEBUG.md');
    for (const id of [
        'agentRuntimeTitle',
        'agentRuntimeState',
        'agentRuntimeTraceId',
        'agentRuntimeIdentity',
        'agentRuntimeCounts',
        'agentRuntimeReplay',
        'agentRuntimeTimeline'
    ]) {
        assert.match(page, new RegExp(`id="${id}"`));
    }
    assert.match(page, /这里是只读轨迹，不执行策略审批/);
    assert.match(page, /class="agent-runtime-timeline"[^>]*aria-label="Agent 按执行顺序排列的动作"/);
    assert.match(page, /id="agentRuntimeState" aria-live="polite"/);
    assert.match(contract, /retrieval-agent-run-summary-v1/);
    assert.match(contract, /run:\$\{analysis\.retrieval_run_id\}/);
    assert.match(contract, /comparison:\$\{experiment\.comparison_id\}/);
    assert.match(contract, /agentRun\.steps_used !== actions\.length \+ 1/);
    assert.match(script, /renderAgentRuntimeTrace/);
    assert.match(script, /runtime_trace_rendered/);
    assert.match(script, /上一轮轨迹已清除/);
    assert.doesNotMatch(script, /retrieval_stage_analysis_fallback|renderLegacyProposal/);
    assert.match(styles, /\.agent-runtime-timeline/);
    assert.match(styles, /\.agent-replay-badge\.is-ready/);
    assert.match(docs, /agent-runtime-ui/);
    assert.doesNotMatch(page, /批准提案|拒绝提案/);
    assert.doesNotMatch(script, /\/agent\/strategy\/decision/);
});

test('Owner tools stay in one hidden inert section and cannot trigger from the public page', () => {
    const page = read('search-agent.html');
    const script = read('js/search-agent.js');
    const contract = read('js/search-agent-tools-contract.js');
    const styles = read('css/search-agent.css');
    const docs = read('docs/SEARCH_STRATEGY_DEBUG.md');
    for (const id of [
        'agentToolsTitle',
        'agentEvalRunButton',
        'agentEvalStatus',
        'agentEvalResult',
        'queryConstructorBuildButton',
        'queryConstructorStatus',
        'queryConstructorResult',
        'badCaseRunButton',
        'badCaseStatus',
        'badCaseResult',
        'diagnosticPlanButton',
        'diagnosticPlanStatus',
        'diagnosticPlanResult',
        'humanOracleStartButton',
        'humanOracleStatus',
        'humanOracleProgress',
        'humanOracleIntentProgress',
        'humanOracleBehaviorProgress',
        'humanOracleClusterProgress',
        'humanOracleResult'
    ]) {
        assert.match(page, new RegExp(`id="${id}"`));
    }
    assert.match(page, /<section class="agent-tools-section" aria-labelledby="agentToolsTitle" hidden inert>/);
    assert.match(page, /保持受保护且不在公共工作台触发/);
    assert.match(page, /5 个受控工具/);
    assert.match(page, /id="agentEvalStatus" aria-live="polite"/);
    assert.match(page, /id="queryConstructorStatus" aria-live="polite"/);
    assert.match(page, /id="badCaseStatus" aria-live="polite"/);
    assert.match(page, /id="diagnosticPlanStatus" aria-live="polite"/);
    assert.match(page, /id="humanOracleStatus" aria-live="polite"/);
    assert.match(page, /id="agentEvalRunButton" aria-controls="agentEvalResult"/);
    assert.match(page, /id="queryConstructorBuildButton" aria-controls="queryConstructorResult"/);
    assert.match(page, /id="badCaseRunButton" aria-controls="badCaseResult"/);
    assert.match(page, /id="diagnosticPlanButton" aria-controls="diagnosticPlanResult" disabled/);
    assert.match(page, /id="humanOracleStartButton" aria-controls="humanOracleResult" disabled/);
    assert.doesNotMatch(page, /id="(?:agentEvalResult|queryConstructorResult|badCaseResult|diagnosticPlanResult|humanOracleResult)"[^>]*aria-live=/);
    assert.match(page, /js\/search-agent-tools-contract\.js/);
    assert.match(contract, /agent-eval-api-summary-v1/);
    assert.match(contract, /query-constructor-api-summary-v1/);
    assert.match(contract, /bad-case-api-summary-v2/);
    assert.match(contract, /diagnostic-experiment-plan-v1/);
    assert.match(contract, /human-oracle-batch-api-summary-v1/);
    assert.match(contract, /\/agent\/eval\/run/);
    assert.match(contract, /\/agent\/query-constructor\/build/);
    assert.match(contract, /\/agent\/bad-cases\/run/);
    assert.match(contract, /\/agent\/diagnostic-experiments\/plan/);
    assert.match(contract, /\/agent\/human-oracle\/batches\/create/);
    assert.match(contract, /credentials:\s*'same-origin'/);
    assert.match(script, /protectedToolApiRoot = isLocal \? apiRoot : '\/search-eval-api'/);
    assert.match(script, /renderAgentEvalSummary/);
    assert.match(script, /生产 Planner/);
    assert.match(script, /Runtime 对抗围栏/);
    assert.match(script, /受保护数据读取/);
    assert.match(contract, /harness_stimulus/);
    assert.match(script, /renderQueryConstructorSummary/);
    assert.match(script, /renderBadCaseSummary/);
    assert.match(script, /renderDiagnosticExperimentPlan/);
    assert.match(script, /startHumanOracle/);
    assert.match(script, /上一轮成绩已清除/);
    assert.match(script, /上一轮摘要已清除/);
    assert.match(script, /上一轮诊断摘要已清除/);
    assert.match(script, /resultNode\.setAttribute\('aria-busy', 'true'\)/);
    assert.match(script, /resultNode\.removeAttribute\('aria-busy'\)/);
    assert.match(styles, /\.agent-tools-grid/);
    assert.match(styles, /\.agent-tool-action button:focus-visible/);
    assert.match(styles, /\.bad-case-hit-comparison/);
    assert.match(docs, /agent-eval-ui/);
    assert.match(docs, /query-constructor-ui/);
    assert.match(docs, /bad-case-ui/);
    assert.match(script, /diagnostic-experiment-ui/);
    assert.match(script, /human-oracle-ui/);
    assert.match(script, /const ownerOnlyFetch = \(\) => Promise\.reject/);
    for (const handler of [
        'runAgentEval',
        'buildQuerySet',
        'runBadCaseDiagnostics',
        'runDiagnosticExperimentPlan',
        'startHumanOracle'
    ]) {
        assert.doesNotMatch(script, new RegExp(`addEventListener\\('click', ${handler}\\)`));
    }
    assert.doesNotMatch(script, /agentToolsContract\.[A-Za-z]+\(\s*publicAnalysisFetch/);
    assert.doesNotMatch(`${script}\n${contract}`, /\/agent\/strategy\/(?:decision|activate)/);
});

test('strategy scope and approval authority are described accurately', () => {
    const agentPage = read('search-agent.html');
    const strategyPage = read('search-strategy.html');
    const strategyScript = read('js/search-strategy.js');
    assert.match(agentPage, /增加多字段召回/);
    assert.match(agentPage, /均匀、保守和激进三组 RRF/);
    assert.match(agentPage, /页面不会修改线上策略/);
    assert.match(strategyPage, /策略历史与日志/);
    assert.doesNotMatch(strategyPage, /Agent 批准策略/);
    assert.match(strategyScript, /采用与生效必须由站长在服务器后台批准/);
    assert.doesNotMatch(strategyScript, /后端批准策略/);
});

test('Human Diagnostic Oracle is a two-stage manual workbench with locked evidence boundaries', () => {
    const page = read('search-agent.html');
    const script = read('js/search-agent.js');
    const contract = read('js/search-agent-tools-contract.js');
    const styles = read('css/search-agent.css');
    const docs = read('docs/SEARCH_STRATEGY_DEBUG.md');
    assert.match(page, /40 个诊断候选按 20 个来源簇逐项/);
    assert.match(page, /先完成 30 项 Query 意图判断，再查看结果完成 40 项行为判断/);
    assert.match(page, /不是 ESCI 商品相关性标签，也不是正式搜索质量结论/);
    assert.match(page, /封印只冻结 70 项人工判断，不会更新或激活策略/);
    assert.match(script, /if \(projection\.active_intent_annotation_count < 30\)/);
    assert.match(script, /fetchHumanOracleIntentView/);
    assert.match(script, /fetchHumanOracleBehaviorView/);
    assert.ok(script.indexOf('if (projection.active_intent_annotation_count < 30)')
        < script.indexOf('fetchHumanOracleBehaviorView'));
    assert.match(script, /projection\.active_intent_annotation_count === 30/);
    assert.match(script, /projection\.active_behavior_annotation_count === 40/);
    assert.match(script, /projection\.invalidated_behavior_annotation_count === 0/);
    assert.match(script, /window\.crypto\.randomUUID/);
    assert.match(script, /expected_previous_intent_annotation_id/);
    assert.match(script, /expected_previous_behavior_annotation_id/);
    assert.match(script, /intentReasonForConstruction/);
    assert.match(script, /behaviorReasonForIntent/);
    assert.match(script, /active_intent_judgment === 'uncertain'\) return value === 'uncertain'/);
    assert.match(script, /active_intent_judgment === 'not_equivalent'\) return value !== 'confirmed_issue'/);
    assert.match(script, /escapeHtml\(view\.source_query_text\)/);
    assert.match(script, /escapeHtml\(hit\.title\)/);
    assert.match(script, /human-oracle-ui/);
    assert.doesNotMatch(script, /localStorage\.setItem\([^)]*oracle/i);
    assert.doesNotMatch(`${script}\n${contract}`, /\/agent\/strategy\/(?:decision|activate)/);
    assert.match(styles, /\.human-oracle-choice-grid label \{ min-height: 48px/);
    assert.match(styles, /\.human-oracle-choice-grid label \{[^}]*border: 1px solid #87939c/);
    assert.match(styles, /\.human-oracle-reason \{[^}]*border: 1px solid #87939c/);
    assert.match(styles, /\.human-oracle-form-actions button \{ min-height: 44px/);
    assert.match(page, /id="humanOracleResult" tabindex="-1"/);
    assert.match(docs, /human-oracle-ui/);
});

test('Human Oracle diagnostics are independently filtered and never log raw evidence or decisions', () => {
    const script = read('js/search-agent.js');
    assert.match(script, /modules\.has\(module\)/);
    const logs = [...script.matchAll(/toolUiLog\('human-oracle-ui', '[^']+', \{([\s\S]*?)\n\s*\}(?:, 'warn')?\);/g)];
    assert.ok(logs.length >= 8);
    const contexts = logs.map((match) => match[1]).join('\n');
    for (const key of [
        'oracleBatchId',
        'unitId',
        'caseId',
        'intentAnnotationId',
        'behaviorAnnotationId',
        'intentCount',
        'behaviorCount',
        'errorCode',
        'statusCode'
    ]) assert.match(contexts, new RegExp(`${key}:`));
    assert.doesNotMatch(
        contexts,
        /queryText|sourceQuery|variantQuery|productId|title|topHits|judgment|reasonCode|clientAction|presentationContext|response|payload|credential|authorization|principal/i
    );
    assert.doesNotMatch(script, /localStorage\.setItem\([^)]*human[_-]?oracle/i);
});

test('strategy history center joins adopted versions, lifecycle logs and local query logs', () => {
    const page = read('search-strategy.html');
    const script = read('js/search-strategy.js');
    const styles = read('css/search-strategy.css');
    for (const id of [
        'historyStrategyCount',
        'historyActivityCount',
        'historySearch',
        'approvedStrategyList',
        'strategyActivityList',
        'logList'
    ]) {
        assert.match(page, new RegExp(`id="${id}"`));
    }
    assert.match(script, /strategy_history/);
    assert.match(script, /strategy_activity_logs/);
    assert.match(script, /Success@5/);
    assert.match(script, /MRR@10/);
    assert.match(script, /nDCG@10/);
    assert.match(script, /配置参数/);
    assert.match(script, /history_filter_applied/);
    assert.doesNotMatch(script, /strategyDebug\([^)]*(?:query|config|description)/i);
    assert.match(styles, /\.history-view-tabs/);
    assert.match(styles, /\.activity-list/);
});

test('Agent workbench explains candidate strategies in Chinese', () => {
    const page = read('search-agent.html');
    const script = read('js/search-agent.js');
    assert.match(page, /候选策略说明/);
    for (const label of [
        '保守精确匹配加权',
        '型号与数字词强化',
        '查询词覆盖强化',
        '完整短语强化',
        '标题 BM25 精确匹配加权',
        '适用问题',
        '策略机制',
        '评分公式',
        '预期收益',
        '主要风险',
        '查询词覆盖加权',
        '型号与数字词加权',
        '完整短语加权'
    ]) {
        assert.match(script, new RegExp(label));
    }
    assert.doesNotMatch(script, />Guardrail</);
    assert.doesNotMatch(script, />PASS</);
    assert.doesNotMatch(script, />FAIL/);
});

test('candidate explanation separates mechanism, benefit and risk and handles legacy proposals', () => {
    const script = read('js/search-agent.js');
    assert.match(script, /<b>策略机制：<\/b>\$\{escapeHtml\(presentation\.mechanism\)\}/);
    assert.match(script, /<b>评分公式：<\/b>\$\{escapeHtml\(presentation\.formula\)\}/);
    assert.match(script, /<b>预期收益：<\/b>\$\{escapeHtml\(presentation\.expectedBenefit\)\}/);
    assert.match(script, /<b>主要风险：<\/b>\$\{escapeHtml\(presentation\.risk\)\}/);
    assert.match(script, /candidate-title-bm25-exact-boost-v1/);
    assert.match(script, /待人工复核/);
});

test('large dynamic panels are not duplicated as live announcements', () => {
    const page = read('search-agent.html');
    for (const id of [
        'agentProposalGrid',
        'agentDiagnosisSummary',
        'agentExperimentTable',
        'agentGateChecks',
        'agentRuntimeTimeline',
        'badCaseResult',
        'humanOracleResult',
        'queryComparisonList'
    ]) {
        assert.doesNotMatch(page, new RegExp(`id="${id}"[^>]*aria-live=`));
    }
    assert.match(page, /id="agentDecisionState" aria-live="polite"/);
});

test('three core metrics are rendered for proposals, experiments and Queries', () => {
    const page = read('search-agent.html');
    const script = read('js/search-agent.js');
    const styles = read('css/search-agent.css');
    for (const metric of ['success@5', 'mrr@10', 'ndcg@10']) {
        assert.match(script, new RegExp(metric.replace('@', '@')));
    }
    assert.match(page, /Success@5 · MRR@10 · nDCG@10/);
    assert.match(script, /renderMetricTriplet\(evaluationMetrics/);
    assert.match(script, /renderMetricTriplet\(metrics/);
    assert.match(script, /renderMetricSnapshot\(itemMetrics, 'baseline'\)/);
    assert.match(script, /renderMetricSnapshot\(itemMetrics, 'candidate'\)/);
    assert.match(styles, /\.metric-triplet/);
    assert.match(styles, /\.query-column-metrics/);
});

test('public search page no longer embeds the Agent workbench', () => {
    const page = read('search-eval.html');
    const script = read('js/search-eval.js');
    assert.doesNotMatch(page, /agentWorkbench|agentStartAnalysis/);
    assert.doesNotMatch(script, /strategy\/propose|agent-ui/);
    assert.match(page, /href="search-agent\.html"/);
});

test('public Agent script requests only retrieval analysis and cannot approve decisions', () => {
    const script = read('js/search-agent.js');
    const contract = read('js/search-agent-contract.js');
    assert.match(contract, /agent\/retrieval\/analyze/);
    assert.doesNotMatch(contract, /agent\/strategy\/propose/);
    assert.match(contract, /credentials:\s*'same-origin'/);
    assert.doesNotMatch(`${script}\n${contract}`, /agent\/strategy\/decision/);
    assert.doesNotMatch(script, /decision:\s*['"](?:approve|reject)['"]/);
});

test('local Agent QA keeps the page hostname when selecting the API origin', () => {
    const script = read('js/search-agent.js');
    assert.match(script, /window\.location\.hostname}:8000/);
    assert.match(script, /protectedToolApiRoot = isLocal \? apiRoot/);
    assert.doesNotMatch(script, /isLocal \? 'http:\/\/127\.0\.0\.1:8000'/);
});

test('Agent workbench renders changed query comparisons and keeps both outcome directions', () => {
    const page = read('search-agent.html');
    const script = read('js/search-agent.js');
    const styles = read('css/search-agent.css');
    assert.match(page, /Changed Query Comparisons/);
    assert.match(page, /有变化的搜索结果对比/);
    assert.match(page, /同时保留改善与退化/);
    assert.match(page, /优化前后 Top 10/);
    assert.match(page, /已淘汰策略的退化不代表最终候选发生退化/);
    assert.match(page, /不代表全量商品召回效果/);
    assert.match(script, /query_comparisons/);
    assert.match(script, /renderRetrievalQueryComparisons/);
    assert.match(script, /baseline_top_results/);
    assert.match(script, /candidate_top_results/);
    assert.match(script, /recovered_relevant/);
    assert.match(script, /\['improvement', 'regression'\]\.includes\(item\.outcome\)/);
    assert.match(script, /availableOutcomes/);
    assert.match(script, /requiredOutcome/);
    assert.match(script, /analysis\.changed_query_examples/);
    assert.match(script, /本轮最佳候选（未通过门禁）/);
    assert.match(script, /已被门禁淘汰/);
    assert.match(script, /候选后 ·/);
    assert.match(script, /comparisons\.slice\(0, 10\)/);
    assert.match(script, /results\.slice\(0, 10\)/);
    assert.match(script, /个变化样本 · 改善/);
    assert.match(styles, /grid-template-columns:\s*repeat\(2,minmax\(0,1fr\)\)/);
});

test('comparison diagnostics log counts but not query or result content', () => {
    const script = read('js/search-agent.js');
    assert.match(script, /query_comparisons_rendered/);
    assert.match(script, /retrieval_query_comparisons_rendered/);
    assert.match(script, /comparisonCount:\s*rows\.length/);
    assert.match(script, /outcomeCounts/);
    assert.doesNotMatch(script, /debug\('query_comparisons_rendered',[\s\S]{0,180}query_text/);
    assert.doesNotMatch(script, /debug\('retrieval_query_comparisons_rendered',[\s\S]{0,220}(?:query_text|product_id|product_title)/);
});

test('runtime diagnostics are independently filtered and log IDs and counts only', () => {
    const script = read('js/search-agent.js');
    assert.match(script, /modules\.has\('agent-runtime-ui'\)/);
    assert.match(script, /\[search-console:agent-runtime-ui\]/);
    const runtimeLog = script.match(/runtimeDebug\('runtime_trace_rendered', \{([\s\S]*?)\n\s*\}\);/);
    assert.ok(runtimeLog);
    for (const key of ['traceId', 'runtimeId', 'plannerId', 'actionCount', 'toolCallCount', 'failedActionCount']) {
        assert.match(runtimeLog[1], new RegExp(`${key}:`));
    }
    assert.doesNotMatch(runtimeLog[1], /query|product|response|credential|authorization|evidence|reason/i);
});

test('self-check tool diagnostics are independently filtered and contain no raw content', () => {
    const script = read('js/search-agent.js');
    assert.match(script, /modules\.has\(module\)/);
    for (const module of ['agent-eval-ui', 'query-constructor-ui']) {
        assert.match(script, new RegExp(`toolUiLog\\('${module}'`));
    }
    const evalLog = script.match(/toolUiLog\('agent-eval-ui', 'agent_eval_summary_rendered', \{([\s\S]*?)\n\s*\}\);/);
    const queryLog = script.match(/toolUiLog\('query-constructor-ui', 'query_constructor_summary_rendered', \{([\s\S]*?)\n\s*\}\);/);
    assert.ok(evalLog);
    assert.ok(queryLog);
    assert.match(evalLog[1], /evidenceId:/);
    assert.match(evalLog[1], /executionId:/);
    assert.match(evalLog[1], /taskCount:/);
    assert.match(queryLog[1], /querySetId:/);
    assert.match(queryLog[1], /queryCount:/);
    assert.doesNotMatch(`${evalLog[1]}\n${queryLog[1]}`, /query_text|product|response|credential|authorization|payload|tasks|limitations/i);
});

test('Bad Case diagnostics render understandable samples but log only IDs and counts', () => {
    const page = read('search-agent.html');
    const script = read('js/search-agent.js');
    const contract = read('js/search-agent-tools-contract.js');
    const docs = read('docs/SEARCH_STRATEGY_DEBUG.md');
    assert.match(page, /运行 59 条诊断 Query/);
    assert.match(page, /开发诊断不等于正式搜索质量评测/);
    assert.match(script, /来源 Query/);
    assert.match(script, /当前结果/);
    assert.match(script, /只标记需要判断的变化，不判断哪一侧更相关/);
    assert.match(script, /词序反转后结果发生变化，合理性需人工或标签判断/);
    assert.doesNotMatch(`${script}\n${contract}`, /order_invariance_violation|不应发生的结果变化/);
    assert.match(script, /不能据此判断多路召回、融合、粗排或精排在哪一层丢失/);
    assert.match(script, /escapeHtml\(sample\.query_text\)/);
    assert.match(script, /escapeHtml\(sample\.source_query_text\)/);
    assert.match(script, /escapeHtml\(hit\.title\)/);
    assert.match(script, /escapeHtml\(hit\.product_id\)/);
    assert.match(script, /escapeHtml\(hit\.locale\)/);
    assert.match(contract, /diagnostic_candidate_count/);
    assert.match(contract, /relevance_labels_used/);
    assert.match(contract, /quality_metrics_computed/);
    assert.match(contract, /search_strategy_id/);
    assert.match(contract, /search_call_count/);
    assert.match(contract, /operational_failure_count/);
    assert.match(contract, /stage_drop_diagnostics_computed/);
    assert.match(contract, /protected_profile_dispatch_count/);
    assert.match(contract, /single_stage_catalog_cannot_diagnose_stage_drop/);
    assert.match(contract, /worker_hard_deadline_enforced/);
    assert.match(contract, /worker_deadline_enforcement_is_execution_scope/);
    assert.match(docs, /四类诊断信号可重叠，不能相加/);
    assert.match(docs, /不会把样本写入 URL 或 `localStorage`/);

    const runner = script.match(/const runBadCaseDiagnostics = async \(\) => \{([\s\S]*?)\n\s*\};\n\n\s*const runDiagnosticExperimentPlan/);
    assert.ok(runner);
    assert.doesNotMatch(runner[1], /localStorage|URLSearchParams|location\./);

    const successLog = script.match(/toolUiLog\('bad-case-ui', 'bad_case_diagnostics_summary_rendered', \{([\s\S]*?)\n\s*\}\);/);
    assert.ok(successLog);
    for (const key of [
        'diagnosticId',
        'executionId',
        'supervisorReceiptId',
        'querySetId',
        'indexId',
        'queryCount',
        'searchCallCount',
        'operationalFailureCount',
        'diagnosticCandidateCount',
        'displayedSampleCount',
        'zeroResultCount',
        'spellingSensitiveCount',
        'orderSensitiveCount',
        'rankingInstabilityCount'
    ]) assert.match(successLog[1], new RegExp(`${key}:`));
    assert.doesNotMatch(
        successLog[1],
        /query_text|queryText|source_query|product|title|hit|response|credential|authorization|payload|sample:/i
    );
    assert.doesNotMatch(`${script}\n${contract}`, /\/agent\/strategy\/(?:decision|activate)/);
});

test('risk card uses regression evidence and supports engineering terminal state', () => {
    const script = read('js/search-agent.js');
    assert.match(script, /evidence\?\.regressions\?\.\[0\]/);
    assert.match(script, /最大退化样本/);
    assert.doesNotMatch(script, /退化与风险[\s\S]{0,500}最大改善样本/);
    assert.match(script, /requires_engineering/);
    assert.match(script, /需要工程实现/);
});

test('portfolio points to the dedicated Agent page without frontend credentials', () => {
    const files = [
        'search-agent.html',
        'js/search-agent-auth.js',
        'js/search-agent-contract.js',
        'js/search-agent.js',
        'search-eval.html',
        'js/main.js'
    ];
    const combined = files.map(read).join('\n');
    assert.match(read('js/main.js'), /url:\s*'search-agent\.html'/);
    assert.doesNotMatch(read('js/main.js'), /search-eval\.html#agentWorkbench/);
    assert.doesNotMatch(combined, /Basic\s+[A-Za-z0-9+/=]{12,}/);
    assert.doesNotMatch(
        combined,
        /encodeBasicAuthorization\(\s*['"][^'"]+['"]\s*,\s*['"][^'"]+['"]/
    );
});
