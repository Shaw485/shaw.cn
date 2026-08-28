(function initSearchAgentToolsContract(root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.SearchAgentToolsContract = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
    'use strict';

    const EVIDENCE_ID = /^agent-eval-[0-9a-f]{12}$/;
    const EXECUTION_ID = /^agent-eval-execution-[0-9a-f]{32}$/;
    const QUERY_SET_ID = /^query-set-[0-9a-f]{12}$/;
    const BAD_CASE_ID = /^bad-case-[0-9a-f]{12}$/;
    const BAD_CASE_EXECUTION_ID = /^bad-case-execution-[0-9a-f]{32}$/;
    const INDEX_ID = /^catalog-baseline-v1-[0-9a-f]{12}$/;
    const QUERY_CASE_ID = /^query-case-[0-9a-f]{12}$/;
    const PRODUCT_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
    const LOCALE_ID = /^[a-z][a-z0-9-]{1,15}$/;
    const EVAL_KEYS = [
        'evidence_id',
        'execution_id',
        'formal_passed',
        'limitations',
        'metrics',
        'schema_version',
        'subject_summaries',
        'suite_id',
        'task_count'
    ];
    const EVAL_METRIC_KEYS = [
        'budget_compliance_rate',
        'comparable_workflow_success_rate',
        'comparable_workflow_tool_calls',
        'grounded_claim_rate',
        'protected_profile_read_count',
        'recovery_rate',
        'replay_fidelity_rate',
        'strategy_write_count',
        'tamper_rejection_rate',
        'task_success_rate',
        'tool_selection_accuracy',
        'total_agent_steps',
        'total_agent_tool_calls',
        'unauthorized_effect_count'
    ];
    const EVAL_RATE_KEYS = [
        'task_success_rate',
        'grounded_claim_rate',
        'tool_selection_accuracy',
        'recovery_rate',
        'budget_compliance_rate',
        'replay_fidelity_rate',
        'tamper_rejection_rate',
        'comparable_workflow_success_rate'
    ];
    const EVAL_LIMITATIONS = [
        'scripted_failures_do_not_prove_worker_deadline_enforcement',
        'contract_fixtures_test_runtime_behavior_not_search_quality',
        'grounded_claim_rate_v1_is_terminal_grounding_proxy'
    ];
    const EVAL_SUBJECT_KEYS = ['passed_count', 'subject_kind', 'task_count'];
    const QUERY_KEYS = [
        'construction_counts',
        'cross_split_collision_status',
        'deduplicated_count',
        'formal_evaluation_allowed',
        'locked_profiles_not_read',
        'original_count',
        'query_count',
        'query_set_id',
        'schema_version',
        'source',
        'synthetic_count'
    ];
    const CONSTRUCTION_KEYS = [
        'adjacent_transposition',
        'identity',
        'token_order_reversal'
    ];
    const BAD_CASE_KEYS = [
        'category_counts',
        'completed',
        'construction_counts',
        'diagnostic_candidate_count',
        'diagnostic_id',
        'execution_id',
        'formal_evaluation_allowed',
        'index_id',
        'limitations',
        'locked_profiles_not_read',
        'operational_failure_count',
        'original_count',
        'protected_profile_dispatch_count',
        'quality_metrics_computed',
        'query_count',
        'query_set_id',
        'relevance_labels_used',
        'relevance_metrics_computed',
        'samples',
        'schema_version',
        'search_call_count',
        'search_strategy_id',
        'stage_drop_diagnostics_computed',
        'strategy_write_count',
        'synthetic_count',
        'top_k'
    ];
    const BAD_CASE_CATEGORY_KEYS = [
        'order_sensitive',
        'ranking_instability_needs_judgment',
        'spelling_sensitive',
        'zero_result'
    ];
    const BAD_CASE_CATEGORY_ORDER = [
        'zero_result',
        'spelling_sensitive',
        'order_sensitive',
        'ranking_instability_needs_judgment'
    ];
    const BAD_CASE_SAMPLE_KEYS = [
        'case_id',
        'categories',
        'construction',
        'overlap_at_k',
        'query_text',
        'reason_code',
        'source_case_id',
        'source_query_text',
        'source_returned_at_k',
        'source_top_hits',
        'variant_returned_at_k',
        'variant_top_hits'
    ];
    const BAD_CASE_HIT_KEYS = ['locale', 'product_id', 'rank', 'title'];
    const BAD_CASE_CONSTRUCTIONS = [
        'identity',
        'adjacent_transposition',
        'token_order_reversal'
    ];
    const BAD_CASE_REASONS = [
        'identity_zero_result',
        'variant_zero_result',
        'variant_result_set_changed',
        'variant_ranking_changed',
        'token_order_result_changed'
    ];
    const BAD_CASE_LIMITATIONS = [
        'synthetic_queries_are_unjudged',
        'diagnostics_do_not_claim_relevance_improvement',
        'development_smoke_is_not_final_evaluation',
        'single_stage_catalog_cannot_diagnose_stage_drop',
        'no_hard_worker_deadline_enforcement'
    ];

    class ToolSummaryContractError extends Error {
        constructor(code) {
            super(code);
            this.name = 'ToolSummaryContractError';
            this.code = code;
        }
    }

    class ToolSummaryHttpError extends Error {
        constructor(status) {
            super(`http_${status}`);
            this.name = 'ToolSummaryHttpError';
            this.code = `http_${status}`;
            this.status = status;
        }
    }

    const fail = (code) => { throw new ToolSummaryContractError(code); };
    const object = (value, code) => value && typeof value === 'object' && !Array.isArray(value)
        ? value
        : fail(code);
    const exactObject = (value, expectedKeys, code) => {
        const item = object(value, code);
        const keys = Object.keys(item).sort();
        if (keys.length !== expectedKeys.length || keys.some((key, index) => key !== expectedKeys[index])) fail(code);
        return item;
    };
    const identifier = (value, pattern, code) => {
        const match = typeof value === 'string' ? value.match(pattern) : null;
        return match && match[0] === value ? value : fail(code);
    };
    const count = (value, code, { positive = false } = {}) => {
        if (!Number.isSafeInteger(value) || value < (positive ? 1 : 0)) fail(code);
        return value;
    };
    const rate = (value, code) => {
        if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) fail(code);
        return value;
    };
    const boundedString = (value, minLength, maxLength, code) => {
        if (typeof value !== 'string') fail(code);
        const codePointLength = [...value].length;
        if (codePointLength < minLength || codePointLength > maxLength) fail(code);
        return value;
    };

    const validateAgentEvalSummary = (value) => {
        const code = 'invalid_agent_eval_summary';
        const summary = exactObject(value, EVAL_KEYS, code);
        if (summary.schema_version !== 'agent-eval-api-summary-v1') fail(code);
        if (summary.suite_id !== 'stage5-retrieval-v1') fail(code);
        identifier(summary.evidence_id, EVIDENCE_ID, code);
        identifier(summary.execution_id, EXECUTION_ID, code);
        if (typeof summary.formal_passed !== 'boolean') fail(code);
        if (summary.task_count !== 12) fail(code);

        const metrics = exactObject(summary.metrics, EVAL_METRIC_KEYS, code);
        EVAL_RATE_KEYS.forEach((key) => rate(metrics[key], code));
        for (const key of [
            'unauthorized_effect_count',
            'protected_profile_read_count',
            'strategy_write_count',
            'total_agent_steps',
            'total_agent_tool_calls',
            'comparable_workflow_tool_calls'
        ]) count(metrics[key], code);
        if (metrics.total_agent_steps < metrics.total_agent_tool_calls) fail(code);

        if (!Array.isArray(summary.subject_summaries)
            || summary.subject_summaries.length !== 2) fail(code);
        const expectedKinds = ['production_planner', 'harness_stimulus'];
        const subjects = summary.subject_summaries.map((value, index) => {
            const subject = exactObject(value, EVAL_SUBJECT_KEYS, code);
            if (subject.subject_kind !== expectedKinds[index]) fail(code);
            count(subject.task_count, code, { positive: true });
            count(subject.passed_count, code);
            if (subject.passed_count > subject.task_count) fail(code);
            return subject;
        });
        if (subjects[0].task_count !== 8 || subjects[1].task_count !== 4) fail(code);
        if (subjects.reduce((total, item) => total + item.task_count, 0) !== summary.task_count) fail(code);
        const passedTasks = subjects.reduce((total, item) => total + item.passed_count, 0);
        if (Math.abs(metrics.task_success_rate - (passedTasks / summary.task_count)) > 1e-12) fail(code);

        if (!Array.isArray(summary.limitations)
            || summary.limitations.length !== EVAL_LIMITATIONS.length
            || summary.limitations.some((item, index) => item !== EVAL_LIMITATIONS[index])) fail(code);

        const expectedFormalPass = EVAL_RATE_KEYS
            .filter((key) => key !== 'comparable_workflow_success_rate')
            .every((key) => metrics[key] === 1)
            && metrics.unauthorized_effect_count === 0
            && metrics.protected_profile_read_count === 0
            && metrics.strategy_write_count === 0
            && subjects.every((item) => item.passed_count === item.task_count);
        if (summary.formal_passed !== expectedFormalPass) fail(code);
        return summary;
    };

    const validateQueryConstructorSummary = (value) => {
        const code = 'invalid_query_constructor_summary';
        const summary = exactObject(value, QUERY_KEYS, code);
        if (summary.schema_version !== 'query-constructor-api-summary-v1') fail(code);
        if (summary.source !== 'smoke') fail(code);
        identifier(summary.query_set_id, QUERY_SET_ID, code);
        const queryCount = count(summary.query_count, code, { positive: true });
        const originalCount = count(summary.original_count, code, { positive: true });
        const syntheticCount = count(summary.synthetic_count, code);
        count(summary.deduplicated_count, code);
        if (queryCount !== 59 || originalCount !== 20 || syntheticCount !== 39
            || queryCount !== originalCount + syntheticCount) fail(code);

        const constructions = exactObject(summary.construction_counts, CONSTRUCTION_KEYS, code);
        CONSTRUCTION_KEYS.forEach((key) => count(constructions[key], code));
        if (constructions.identity !== originalCount
            || constructions.identity !== 20
            || constructions.adjacent_transposition !== 20
            || constructions.token_order_reversal !== 19
            || constructions.adjacent_transposition + constructions.token_order_reversal !== syntheticCount
            || Object.values(constructions).reduce((total, value) => total + value, 0) !== queryCount) fail(code);

        if (summary.formal_evaluation_allowed !== false) fail(code);
        if (!Array.isArray(summary.locked_profiles_not_read)
            || summary.locked_profiles_not_read.length !== 2
            || summary.locked_profiles_not_read[0] !== 'dev'
            || summary.locked_profiles_not_read[1] !== 'test') fail(code);
        if (summary.cross_split_collision_status !== 'not_checked_without_reading_locked_splits') fail(code);
        return summary;
    };

    const validateBadCaseHits = (value, resultCount, code) => {
        if (!Array.isArray(value) || value.length > 3 || value.length > resultCount) fail(code);
        const productKeys = new Set();
        value.forEach((rawHit, index) => {
            const hit = exactObject(rawHit, BAD_CASE_HIT_KEYS, code);
            identifier(hit.product_id, PRODUCT_ID, code);
            identifier(hit.locale, LOCALE_ID, code);
            boundedString(hit.title, 1, 256, code);
            count(hit.rank, code, { positive: true });
            const productKey = `${hit.locale}\u0000${hit.product_id}`;
            if (hit.rank !== index + 1 || productKeys.has(productKey)) fail(code);
            productKeys.add(productKey);
        });
        return value;
    };

    const validateBadCaseSummary = (value) => {
        const code = 'invalid_bad_case_summary';
        const summary = exactObject(value, BAD_CASE_KEYS, code);
        if (summary.schema_version !== 'bad-case-api-summary-v1') fail(code);
        identifier(summary.diagnostic_id, BAD_CASE_ID, code);
        identifier(summary.execution_id, BAD_CASE_EXECUTION_ID, code);
        identifier(summary.query_set_id, QUERY_SET_ID, code);
        identifier(summary.index_id, INDEX_ID, code);
        if (summary.query_count !== 59 || summary.original_count !== 20 || summary.synthetic_count !== 39) fail(code);
        if (summary.query_count !== summary.original_count + summary.synthetic_count || summary.top_k !== 10) fail(code);
        if (summary.search_strategy_id !== 'sqlite-fts5-bm25'
            || summary.search_call_count !== 59
            || summary.operational_failure_count !== 0) fail(code);
        const constructionCounts = exactObject(summary.construction_counts, CONSTRUCTION_KEYS, code);
        if (constructionCounts.identity !== 20
            || constructionCounts.adjacent_transposition !== 20
            || constructionCounts.token_order_reversal !== 19) fail(code);
        const candidateCount = count(summary.diagnostic_candidate_count, code);
        if (candidateCount > summary.query_count) fail(code);

        const categoryCounts = exactObject(summary.category_counts, BAD_CASE_CATEGORY_KEYS, code);
        const categoryCaps = {
            zero_result: 59,
            spelling_sensitive: 20,
            order_sensitive: 19,
            ranking_instability_needs_judgment: 39
        };
        BAD_CASE_CATEGORY_KEYS.forEach((key) => {
            count(categoryCounts[key], code);
            if (categoryCounts[key] > categoryCaps[key] || categoryCounts[key] > candidateCount) fail(code);
        });
        const categoryTotal = Object.values(categoryCounts).reduce((total, item) => total + item, 0);
        if (categoryTotal < candidateCount || categoryTotal > candidateCount * 4) fail(code);

        if (!Array.isArray(summary.samples)
            || summary.samples.length > 12
            || summary.samples.length > candidateCount) fail(code);
        const sampleIds = new Set();
        summary.samples.forEach((rawSample) => {
            const sample = exactObject(rawSample, BAD_CASE_SAMPLE_KEYS, code);
            identifier(sample.case_id, QUERY_CASE_ID, code);
            identifier(sample.source_case_id, QUERY_CASE_ID, code);
            if (sampleIds.has(sample.case_id)) fail(code);
            sampleIds.add(sample.case_id);
            boundedString(sample.query_text, 1, 200, code);
            boundedString(sample.source_query_text, 1, 200, code);
            if (!BAD_CASE_CONSTRUCTIONS.includes(sample.construction)
                || !BAD_CASE_REASONS.includes(sample.reason_code)) fail(code);
            if (!Array.isArray(sample.categories)
                || sample.categories.length < 1
                || sample.categories.length > BAD_CASE_CATEGORY_ORDER.length) fail(code);
            let previousCategoryIndex = -1;
            sample.categories.forEach((category) => {
                const categoryIndex = BAD_CASE_CATEGORY_ORDER.indexOf(category);
                if (categoryIndex <= previousCategoryIndex) fail(code);
                previousCategoryIndex = categoryIndex;
            });
            if (sample.construction === 'identity') {
                if (sample.case_id !== sample.source_case_id
                    || sample.query_text !== sample.source_query_text
                    || sample.reason_code !== 'identity_zero_result') fail(code);
            } else if (sample.case_id === sample.source_case_id
                || sample.reason_code === 'identity_zero_result') fail(code);
            if (sample.categories.includes('spelling_sensitive')
                && sample.construction !== 'adjacent_transposition') fail(code);
            if (sample.categories.includes('order_sensitive')
                && sample.construction !== 'token_order_reversal') fail(code);
            if (sample.reason_code === 'token_order_result_changed'
                && sample.construction !== 'token_order_reversal') fail(code);
            const sourceResultCount = count(sample.source_returned_at_k, code);
            const variantResultCount = count(sample.variant_returned_at_k, code);
            const overlapCount = count(sample.overlap_at_k, code);
            if (sourceResultCount > 10
                || variantResultCount > 10
                || overlapCount > 10
                || overlapCount > sourceResultCount
                || overlapCount > variantResultCount) fail(code);
            if (sample.categories.includes('zero_result') !== (variantResultCount === 0)) fail(code);
            if (sample.categories.includes('ranking_instability_needs_judgment')
                && (sourceResultCount === 0 || variantResultCount === 0)) fail(code);
            validateBadCaseHits(sample.source_top_hits, sourceResultCount, code);
            validateBadCaseHits(sample.variant_top_hits, variantResultCount, code);
        });
        BAD_CASE_CATEGORY_ORDER.forEach((category) => {
            const displayedCount = summary.samples.filter((sample) => sample.categories.includes(category)).length;
            if (displayedCount > categoryCounts[category]) fail(code);
        });

        if (summary.completed !== true
            || summary.formal_evaluation_allowed !== false
            || summary.relevance_labels_used !== false
            || summary.quality_metrics_computed !== false
            || summary.relevance_metrics_computed !== false
            || summary.stage_drop_diagnostics_computed !== false
            || summary.protected_profile_dispatch_count !== 0
            || summary.strategy_write_count !== 0) fail(code);
        if (!Array.isArray(summary.locked_profiles_not_read)
            || summary.locked_profiles_not_read.length !== 2
            || summary.locked_profiles_not_read[0] !== 'dev'
            || summary.locked_profiles_not_read[1] !== 'test') fail(code);
        if (!Array.isArray(summary.limitations)
            || summary.limitations.length !== BAD_CASE_LIMITATIONS.length
            || summary.limitations.some((item, index) => item !== BAD_CASE_LIMITATIONS[index])) fail(code);
        return summary;
    };

    const postJson = (fetchImpl, url, body) => fetchImpl(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const fetchAgentEval = async (fetchImpl, apiRoot) => {
        const response = await postJson(fetchImpl, `${apiRoot}/agent/eval/run`, {
            suite: 'stage5-retrieval-v1'
        });
        if (!response.ok) throw new ToolSummaryHttpError(response.status);
        return validateAgentEvalSummary(await response.json());
    };

    const fetchQueryConstructor = async (fetchImpl, apiRoot) => {
        const response = await postJson(fetchImpl, `${apiRoot}/agent/query-constructor/build`, {
            source: 'smoke'
        });
        if (!response.ok) throw new ToolSummaryHttpError(response.status);
        return validateQueryConstructorSummary(await response.json());
    };

    const fetchBadCaseDiagnostics = async (fetchImpl, apiRoot) => {
        const response = await postJson(fetchImpl, `${apiRoot}/agent/bad-cases/run`, {
            source: 'smoke'
        });
        if (!response.ok) throw new ToolSummaryHttpError(response.status);
        return validateBadCaseSummary(await response.json());
    };

    return {
        ToolSummaryContractError,
        ToolSummaryHttpError,
        fetchAgentEval,
        fetchBadCaseDiagnostics,
        fetchQueryConstructor,
        validateAgentEvalSummary,
        validateBadCaseSummary,
        validateQueryConstructorSummary
    };
}));
