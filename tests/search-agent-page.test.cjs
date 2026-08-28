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
    assert.match(page, /search-eval\.html/);
    assert.match(page, /search-strategy\.html/);
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
    assert.match(script, /服务器尚未提供阶段诊断接口/);
    assert.match(script, /本轮没有生成证据/);
    assert.match(script, /本轮无 Retrieval Run/);
    assert.match(styles, /\.pipeline-stage-grid/);
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
    assert.match(script, /兼容接口没有 Agent Runtime Trace/);
    assert.match(styles, /\.agent-runtime-timeline/);
    assert.match(styles, /\.agent-replay-badge\.is-ready/);
    assert.match(docs, /agent-runtime-ui/);
    assert.doesNotMatch(page, /批准提案|拒绝提案/);
    assert.doesNotMatch(script, /\/agent\/strategy\/decision/);
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

test('Agent script can request proposals but cannot approve decisions', () => {
    const script = read('js/search-agent.js');
    const contract = read('js/search-agent-contract.js');
    assert.match(contract, /agent\/strategy\/propose/);
    assert.match(contract, /credentials:\s*'same-origin'/);
    assert.doesNotMatch(`${script}\n${contract}`, /agent\/strategy\/decision/);
    assert.doesNotMatch(script, /decision:\s*['"](?:approve|reject)['"]/);
});

test('local Agent QA keeps the page hostname when selecting the API origin', () => {
    const script = read('js/search-agent.js');
    assert.match(script, /window\.location\.hostname}:8000/);
    assert.doesNotMatch(script, /isLocal \? 'http:\/\/127\.0\.0\.1:8000'/);
});

test('Agent workbench renders ten side-by-side query result comparisons', () => {
    const page = read('search-agent.html');
    const script = read('js/search-agent.js');
    const styles = read('css/search-agent.css');
    assert.match(page, /10 Query Comparisons/);
    assert.match(page, /优化前后 Top 5 与新增召回商品/);
    assert.match(page, /候选重排，不代表全量商品召回效果/);
    assert.match(script, /query_comparisons/);
    assert.match(script, /renderRetrievalQueryComparisons/);
    assert.match(script, /baseline_top_results/);
    assert.match(script, /candidate_top_results/);
    assert.match(script, /recovered_relevant/);
    assert.match(script, /comparisons\.slice\(0, 10\)/);
    assert.match(script, /results\.slice\(0, 10\)/);
    assert.match(styles, /grid-template-columns:\s*repeat\(2,minmax\(0,1fr\)\)/);
});

test('comparison diagnostics log counts but not query or result content', () => {
    const script = read('js/search-agent.js');
    assert.match(script, /query_comparisons_rendered/);
    assert.match(script, /comparisonCount:\s*rows\.length/);
    assert.match(script, /outcomeCounts/);
    assert.doesNotMatch(script, /debug\('query_comparisons_rendered',[\s\S]{0,180}query_text/);
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
        'js/search-agent-contract.js',
        'js/search-agent.js',
        'search-eval.html',
        'js/main.js'
    ];
    const combined = files.map(read).join('\n');
    assert.match(read('js/main.js'), /url:\s*'search-agent\.html'/);
    assert.doesNotMatch(read('js/main.js'), /search-eval\.html#agentWorkbench/);
    assert.doesNotMatch(combined, /Authorization|Basic\s+[A-Za-z0-9+/=]+/);
});
