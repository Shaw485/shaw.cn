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
    const BAD_CASE_SUPERVISOR_RECEIPT_ID = /^bad-case-supervisor-execution-[0-9a-f]{12}$/;
    const EXPERIMENT_PLAN_ID = /^diagnostic-experiment-plan-[0-9a-f]{12}$/;
    const STRATEGY_SPEC_ID = /^strategy-spec-[0-9a-f]{12}$/;
    const ORACLE_BATCH_ID = /^oracle-batch-[0-9a-f]{12}$/;
    const ORACLE_UNIT_ID = /^oracle-unit-[0-9a-f]{12}$/;
    const ORACLE_INTENT_ID = /^oracle-intent-[0-9a-f]{12}$/;
    const ORACLE_BEHAVIOR_ID = /^oracle-behavior-[0-9a-f]{12}$/;
    const HUMAN_ORACLE_ID = /^human-oracle-[0-9a-f]{12}$/;
    const SHA256 = /^[0-9a-f]{64}$/;
    const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
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
        'completion_observation',
        'construction_counts',
        'diagnostic_candidate_count',
        'diagnostic_id',
        'execution_id',
        'formal_evaluation_allowed',
        'index_id',
        'kill_grace_ms',
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
        'supervisor_receipt_id',
        'synthetic_count',
        'term_grace_ms',
        'top_k',
        'worker_deadline_ms',
        'worker_hard_deadline_enforced',
        'worker_policy_id'
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
        'worker_deadline_enforcement_is_execution_scope'
    ];
    const BAD_CASE_COMPLETION_OBSERVATIONS = [
        'worker_result',
        'deadline_boundary_recovery',
        'protocol_recovery'
    ];
    const EXPERIMENT_PLAN_KEYS = [
        'activation_eligible',
        'behavioral_lane',
        'diagnostic_id',
        'experiment_plan_id',
        'falsifiers',
        'hypothesis',
        'index_id',
        'quality_conclusion_allowed',
        'quality_lane',
        'query_set_id',
        'reason_code',
        'recommended_next_action',
        'router_id',
        'schema_version',
        'status',
        'strategy',
        'strategy_write_count',
        'target_case_ids'
    ];
    const BEHAVIOR_LANE_KEYS = [
        'lane_id',
        'observables',
        'quality_metrics_allowed',
        'query_count',
        'relevance_labels_used',
        'schema_version'
    ];
    const QUALITY_LANE_KEYS = [
        'evidence_status',
        'label_source_ref',
        'labels_may_be_used_by_harness',
        'quality_conclusion_allowed',
        'query_scope',
        'reason_code',
        'schema_version',
        'synthetic_labels_may_be_inherited'
    ];
    const STRATEGY_SPEC_KEYS = [
        'fallback_operator',
        'fallback_trigger',
        'family',
        'fusion',
        'max_fallback_routes',
        'primary_operator',
        'protected_token_policy',
        'schema_version',
        'strategy_id',
        'strategy_spec_id',
        'top_k'
    ];
    const PLAN_STATUSES = [
        'experiment_planned',
        'requires_oracle',
        'requires_engineering',
        'no_supported_experiment'
    ];
    const PLAN_FALSIFIERS = [
        'no_zero_result_recovery',
        'no_independently_judged_relevant_gain',
        'quality_or_safety_gate_regression',
        'nonzero_baseline_results_changed',
        'execution_budget_exceeded'
    ];
    const ORACLE_CONSTRUCTIONS = ['identity', 'adjacent_transposition', 'token_order_reversal'];
    const ORACLE_INTENT_JUDGMENTS = ['equivalent', 'not_equivalent', 'uncertain'];
    const ORACLE_BEHAVIOR_JUDGMENTS = ['confirmed_issue', 'acceptable', 'uncertain'];
    const ORACLE_INTENT_REASON_BY_CONSTRUCTION = {
        adjacent_transposition: {
            equivalent: 'obvious_typo_same_intent',
            not_equivalent: 'query_became_uninterpretable',
            uncertain: 'insufficient_context'
        },
        token_order_reversal: {
            equivalent: 'same_product_intent',
            not_equivalent: 'meaning_changed',
            uncertain: 'ambiguous_intent'
        }
    };
    const ORACLE_BEHAVIOR_REASONS = [
        'behavior_is_expected',
        'catalog_coverage_unknown',
        'equivalent_intent_should_preserve_behavior',
        'insufficient_domain_knowledge',
        'insufficient_result_evidence',
        'intent_not_equivalent',
        'owner_catalog_expectation'
    ];
    const ORACLE_BATCH_KEYS = [
        'diagnostic_id',
        'formal_evaluation_allowed',
        'oracle_batch_id',
        'quality_conclusion_allowed',
        'query_set_id',
        'schema_version',
        'selected_candidate_count',
        'selected_cluster_count',
        'strategy_write_count',
        'synthetic_intent_candidate_count',
        'units'
    ];
    const ORACLE_UNIT_KEYS = ['candidate_count', 'source_case_id', 'stratum', 'unit_id'];
    const ORACLE_REVIEW_KEYS = ['cases', 'oracle_batch_id', 'projection', 'schema_version'];
    const ORACLE_PROJECTION_KEYS = [
        'active_behavior_annotation_count',
        'active_intent_annotation_count',
        'invalidated_behavior_annotation_count',
        'oracle_batch_id',
        'sealed_oracle_id',
        'status'
    ];
    const ORACLE_CASE_STATE_KEYS = [
        'active_behavior_annotation_id',
        'active_behavior_judgment',
        'active_intent_annotation_id',
        'active_intent_judgment',
        'behavior_invalidated_by_intent_change',
        'case_id',
        'construction',
        'expected_previous_behavior_annotation_id',
        'expected_previous_intent_annotation_id',
        'unit_id'
    ];
    const ORACLE_INTENT_VIEW_KEYS = [
        'cache_allowed',
        'candidates',
        'oracle_batch_id',
        'result_evidence_included',
        'schema_version',
        'source_case_id',
        'source_product_labels_included',
        'source_query_text',
        'unit_id'
    ];
    const ORACLE_INTENT_CANDIDATE_KEYS = [
        'case_id',
        'construction',
        'intent_context_sha256',
        'query_text',
        'requires_intent_annotation'
    ];
    const ORACLE_BEHAVIOR_VIEW_KEYS = [
        'cache_allowed',
        'candidates',
        'diagnostic_id',
        'oracle_batch_id',
        'schema_version',
        'source_case_id',
        'source_reference_scope',
        'synthetic_product_relevance_labels_included',
        'unit_id'
    ];
    const ORACLE_BEHAVIOR_CANDIDATE_KEYS = [
        'behavior_context_sha256',
        'case_id',
        'categories',
        'construction',
        'intent_annotation_id',
        'overlap_at_k',
        'query_text',
        'reason_code',
        'source_query_text',
        'source_returned_at_k',
        'source_top_hits',
        'variant_returned_at_k',
        'variant_top_hits'
    ];
    const ORACLE_INTENT_SUBMIT_KEYS = [
        'case_id',
        'intent_annotation_id',
        'judgment',
        'oracle_batch_id',
        'product_relevance_labels_created',
        'reason_code',
        'result_evidence_was_withheld',
        'schema_version',
        'supersedes_annotation_id',
        'unit_id'
    ];
    const ORACLE_INTENT_REQUEST_KEYS = [
        'case_id',
        'client_action_id',
        'expected_previous_annotation_id',
        'judgment',
        'oracle_batch_id',
        'presentation_context_sha256',
        'reason_code',
        'unit_id'
    ];
    const ORACLE_BEHAVIOR_SUBMIT_KEYS = [
        'behavior_annotation_id',
        'case_id',
        'intent_annotation_id',
        'judgment',
        'oracle_batch_id',
        'product_relevance_labels_created',
        'reason_code',
        'root_cause_claimed',
        'schema_version',
        'supersedes_annotation_id',
        'unit_id'
    ];
    const ORACLE_BEHAVIOR_REQUEST_KEYS = [
        'case_id',
        'client_action_id',
        'expected_previous_annotation_id',
        'intent_annotation_id',
        'judgment',
        'oracle_batch_id',
        'presentation_context_sha256',
        'reason_code',
        'unit_id'
    ];
    const ORACLE_SEAL_KEYS = [
        'behavior_annotation_count',
        'diagnostic_id',
        'formal_evaluation_allowed',
        'limitations',
        'oracle_batch_id',
        'oracle_id',
        'product_relevance_labels_created',
        'quality_conclusion_allowed',
        'root_cause_claimed',
        'schema_version',
        'strategy_write_count',
        'synthetic_intent_annotation_count'
    ];
    const ORACLE_SEAL_LIMITATIONS = [
        'single_owner_no_inter_annotator_agreement',
        'selection_conditioned_development_set',
        'synthetic_product_relevance_remains_unjudged',
        'prior_exposure_not_controlled',
        'diagnostic_judgment_is_not_root_cause'
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
        if (summary.schema_version !== 'bad-case-api-summary-v2') fail(code);
        identifier(summary.diagnostic_id, BAD_CASE_ID, code);
        identifier(summary.execution_id, BAD_CASE_EXECUTION_ID, code);
        identifier(summary.supervisor_receipt_id, BAD_CASE_SUPERVISOR_RECEIPT_ID, code);
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
        if (summary.worker_policy_id !== 'posix-process-group-deadline-v1'
            || summary.worker_deadline_ms !== 125000
            || summary.worker_hard_deadline_enforced !== true
            || !BAD_CASE_COMPLETION_OBSERVATIONS.includes(summary.completion_observation)) fail(code);
        count(summary.term_grace_ms, code, { positive: true });
        count(summary.kill_grace_ms, code, { positive: true });
        if (summary.term_grace_ms > 30000 || summary.kill_grace_ms > 30000) fail(code);
        if (!Array.isArray(summary.locked_profiles_not_read)
            || summary.locked_profiles_not_read.length !== 2
            || summary.locked_profiles_not_read[0] !== 'dev'
            || summary.locked_profiles_not_read[1] !== 'test') fail(code);
        if (!Array.isArray(summary.limitations)
            || summary.limitations.length !== BAD_CASE_LIMITATIONS.length
            || summary.limitations.some((item, index) => item !== BAD_CASE_LIMITATIONS[index])) fail(code);
        return summary;
    };

    const validateDiagnosticExperimentPlan = (value) => {
        const code = 'invalid_diagnostic_experiment_plan';
        const plan = exactObject(value, EXPERIMENT_PLAN_KEYS, code);
        if (plan.schema_version !== 'diagnostic-experiment-plan-v1'
            || plan.router_id !== 'diagnostic-evidence-router-v1'
            || !PLAN_STATUSES.includes(plan.status)) fail(code);
        identifier(plan.experiment_plan_id, EXPERIMENT_PLAN_ID, code);
        identifier(plan.diagnostic_id, BAD_CASE_ID, code);
        identifier(plan.query_set_id, QUERY_SET_ID, code);
        identifier(plan.index_id, INDEX_ID, code);
        boundedString(plan.hypothesis, 1, 1000, code);
        if (!Array.isArray(plan.target_case_ids) || plan.target_case_ids.length > 59) fail(code);
        let previousCaseId = '';
        plan.target_case_ids.forEach((caseId) => {
            identifier(caseId, QUERY_CASE_ID, code);
            if (caseId <= previousCaseId) fail(code);
            previousCaseId = caseId;
        });
        if (plan.quality_conclusion_allowed !== false
            || plan.activation_eligible !== false
            || plan.strategy_write_count !== 0) fail(code);

        const behavior = exactObject(plan.behavioral_lane, BEHAVIOR_LANE_KEYS, code);
        if (behavior.schema_version !== 'behavioral-experiment-lane-v1'
            || behavior.lane_id !== 'full-catalog-59-case-behavioral-v1'
            || behavior.query_count !== 59
            || behavior.relevance_labels_used !== false
            || behavior.quality_metrics_allowed !== false
            || !Array.isArray(behavior.observables)
            || behavior.observables.join('|') !== [
                'zero_result_recovery_count',
                'ordered_top_k_change_count',
                'operational_failure_count',
                'nonzero_baseline_preservation_count'
            ].join('|')) fail(code);

        const quality = exactObject(plan.quality_lane, QUALITY_LANE_KEYS, code);
        if (quality.schema_version !== 'quality-experiment-lane-v1'
            || quality.evidence_status !== 'behavior_only'
            || quality.query_scope !== 'not_scheduled'
            || quality.label_source_ref !== null
            || quality.labels_may_be_used_by_harness !== false
            || quality.synthetic_labels_may_be_inherited !== false
            || quality.quality_conclusion_allowed !== false
            || quality.reason_code !== 'no_eligible_quality_labels_resolved') fail(code);

        if (plan.status === 'experiment_planned') {
            const strategy = exactObject(plan.strategy, STRATEGY_SPEC_KEYS, code);
            identifier(strategy.strategy_spec_id, STRATEGY_SPEC_ID, code);
            if (strategy.schema_version !== 'diagnostic-strategy-spec-v1'
                || strategy.strategy_id !== 'zero-result-drop-one-token-backoff-v1'
                || strategy.family !== 'zero_result_backoff'
                || strategy.primary_operator !== 'strict_and'
                || strategy.fallback_trigger !== 'primary_zero_result'
                || strategy.fallback_operator !== 'drop_one_non_protected_token'
                || strategy.protected_token_policy !== 'numeric_model_and_explicit_product_id_required'
                || strategy.fusion !== 'rrf'
                || strategy.top_k !== 10
                || strategy.max_fallback_routes !== 16
                || plan.target_case_ids.length < 1
                || !Array.isArray(plan.falsifiers)
                || plan.falsifiers.join('|') !== PLAN_FALSIFIERS.join('|')) fail(code);
        } else if (plan.strategy !== null
            || !Array.isArray(plan.falsifiers)
            || plan.falsifiers.length !== 0) fail(code);
        return plan;
    };

    const nullableIdentifier = (value, pattern, code) => value === null
        ? null
        : identifier(value, pattern, code);

    const validateHumanOracleBatch = (value, diagnosticId, querySetId) => {
        const code = 'invalid_human_oracle_batch';
        const batch = exactObject(value, ORACLE_BATCH_KEYS, code);
        if (batch.schema_version !== 'human-oracle-batch-api-summary-v1'
            || batch.diagnostic_id !== diagnosticId
            || batch.query_set_id !== querySetId
            || batch.selected_cluster_count !== 20
            || batch.selected_candidate_count !== 40
            || batch.synthetic_intent_candidate_count !== 30
            || batch.formal_evaluation_allowed !== false
            || batch.quality_conclusion_allowed !== false
            || batch.strategy_write_count !== 0) fail(code);
        identifier(batch.oracle_batch_id, ORACLE_BATCH_ID, code);
        if (!Array.isArray(batch.units) || batch.units.length !== 20) fail(code);
        const unitIds = new Set();
        let candidateTotal = 0;
        const strata = { source_zero_cluster: 0, source_nonzero_variant_zero: 0 };
        batch.units.forEach((rawUnit) => {
            const unit = exactObject(rawUnit, ORACLE_UNIT_KEYS, code);
            identifier(unit.unit_id, ORACLE_UNIT_ID, code);
            identifier(unit.source_case_id, QUERY_CASE_ID, code);
            if (unitIds.has(unit.unit_id)
                || !Object.hasOwn(strata, unit.stratum)
                || ![1, 3].includes(unit.candidate_count)) fail(code);
            if ((unit.stratum === 'source_zero_cluster' && unit.candidate_count !== 3)
                || (unit.stratum === 'source_nonzero_variant_zero' && unit.candidate_count !== 1)) fail(code);
            unitIds.add(unit.unit_id);
            strata[unit.stratum] += 1;
            candidateTotal += unit.candidate_count;
        });
        if (candidateTotal !== 40
            || strata.source_zero_cluster !== 10
            || strata.source_nonzero_variant_zero !== 10) fail(code);
        return batch;
    };

    const validateHumanOracleReviewState = (value, expectedBatchId = null) => {
        const code = 'invalid_human_oracle_review_state';
        const state = exactObject(value, ORACLE_REVIEW_KEYS, code);
        if (state.schema_version !== 'human-oracle-review-state-v1') fail(code);
        identifier(state.oracle_batch_id, ORACLE_BATCH_ID, code);
        if (expectedBatchId !== null && state.oracle_batch_id !== expectedBatchId) fail(code);
        const projection = exactObject(state.projection, ORACLE_PROJECTION_KEYS, code);
        if (projection.oracle_batch_id !== state.oracle_batch_id
            || !['open', 'in_progress', 'ready_to_seal', 'sealed'].includes(projection.status)) fail(code);
        count(projection.active_intent_annotation_count, code);
        count(projection.active_behavior_annotation_count, code);
        count(projection.invalidated_behavior_annotation_count, code);
        if (projection.active_intent_annotation_count > 30
            || projection.active_behavior_annotation_count > 40) fail(code);
        nullableIdentifier(projection.sealed_oracle_id, HUMAN_ORACLE_ID, code);
        if ((projection.status === 'sealed') !== (projection.sealed_oracle_id !== null)) fail(code);
        if (['ready_to_seal', 'sealed'].includes(projection.status)
            && (projection.active_intent_annotation_count !== 30
                || projection.active_behavior_annotation_count !== 40
                || projection.invalidated_behavior_annotation_count !== 0)) fail(code);
        if (!Array.isArray(state.cases) || state.cases.length !== 40) fail(code);
        const caseIds = new Set();
        let activeIntentCount = 0;
        let activeBehaviorCount = 0;
        let invalidatedBehaviorCount = 0;
        const constructionCounts = { identity: 0, adjacent_transposition: 0, token_order_reversal: 0 };
        state.cases.forEach((rawCase) => {
            const caseState = exactObject(rawCase, ORACLE_CASE_STATE_KEYS, code);
            identifier(caseState.unit_id, ORACLE_UNIT_ID, code);
            identifier(caseState.case_id, QUERY_CASE_ID, code);
            if (caseIds.has(caseState.case_id) || !ORACLE_CONSTRUCTIONS.includes(caseState.construction)) fail(code);
            caseIds.add(caseState.case_id);
            constructionCounts[caseState.construction] += 1;
            nullableIdentifier(caseState.active_intent_annotation_id, ORACLE_INTENT_ID, code);
            nullableIdentifier(caseState.expected_previous_intent_annotation_id, ORACLE_INTENT_ID, code);
            nullableIdentifier(caseState.active_behavior_annotation_id, ORACLE_BEHAVIOR_ID, code);
            nullableIdentifier(caseState.expected_previous_behavior_annotation_id, ORACLE_BEHAVIOR_ID, code);
            if ((caseState.active_intent_annotation_id === null)
                    !== (caseState.active_intent_judgment === null)
                || (caseState.active_intent_judgment !== null
                    && !ORACLE_INTENT_JUDGMENTS.includes(caseState.active_intent_judgment))
                || caseState.expected_previous_intent_annotation_id !== caseState.active_intent_annotation_id
                || (caseState.active_behavior_annotation_id === null)
                    !== (caseState.active_behavior_judgment === null)
                || (caseState.active_behavior_judgment !== null
                    && !ORACLE_BEHAVIOR_JUDGMENTS.includes(caseState.active_behavior_judgment))
                || typeof caseState.behavior_invalidated_by_intent_change !== 'boolean') fail(code);
            if (caseState.construction === 'identity' && caseState.active_intent_annotation_id !== null) fail(code);
            if (caseState.construction !== 'identity'
                && caseState.active_behavior_annotation_id !== null
                && caseState.active_intent_annotation_id === null) fail(code);
            if (caseState.behavior_invalidated_by_intent_change) {
                if (caseState.expected_previous_behavior_annotation_id === null
                    || caseState.active_behavior_annotation_id !== null) fail(code);
            } else if (caseState.expected_previous_behavior_annotation_id !== caseState.active_behavior_annotation_id) fail(code);
            if (caseState.active_intent_annotation_id !== null) activeIntentCount += 1;
            if (caseState.active_behavior_annotation_id !== null) activeBehaviorCount += 1;
            if (caseState.behavior_invalidated_by_intent_change) invalidatedBehaviorCount += 1;
        });
        if (constructionCounts.identity !== 10
            || constructionCounts.adjacent_transposition !== 20
            || constructionCounts.token_order_reversal !== 10
            || activeIntentCount !== projection.active_intent_annotation_count
            || activeBehaviorCount !== projection.active_behavior_annotation_count
            || invalidatedBehaviorCount !== projection.invalidated_behavior_annotation_count) fail(code);
        return state;
    };

    const validateHumanOracleIntentView = (value, expectedBatchId, expectedUnitId) => {
        const code = 'invalid_human_oracle_intent_view';
        const view = exactObject(value, ORACLE_INTENT_VIEW_KEYS, code);
        if (view.schema_version !== 'human-oracle-intent-view-v1'
            || view.oracle_batch_id !== expectedBatchId
            || view.unit_id !== expectedUnitId
            || view.result_evidence_included !== false
            || view.source_product_labels_included !== false
            || view.cache_allowed !== false) fail(code);
        identifier(view.oracle_batch_id, ORACLE_BATCH_ID, code);
        identifier(view.unit_id, ORACLE_UNIT_ID, code);
        identifier(view.source_case_id, QUERY_CASE_ID, code);
        boundedString(view.source_query_text, 1, 256, code);
        if (!Array.isArray(view.candidates) || ![1, 3].includes(view.candidates.length)) fail(code);
        const ids = new Set();
        view.candidates.forEach((rawCandidate, index) => {
            const candidate = exactObject(rawCandidate, ORACLE_INTENT_CANDIDATE_KEYS, code);
            identifier(candidate.case_id, QUERY_CASE_ID, code);
            boundedString(candidate.query_text, 1, 256, code);
            if (ids.has(candidate.case_id) || !ORACLE_CONSTRUCTIONS.includes(candidate.construction)) fail(code);
            ids.add(candidate.case_id);
            const identity = candidate.construction === 'identity';
            if (candidate.requires_intent_annotation !== !identity
                || (candidate.intent_context_sha256 === null) !== identity) fail(code);
            if (identity) {
                if (candidate.case_id !== view.source_case_id
                    || candidate.query_text !== view.source_query_text
                    || index !== 0) fail(code);
            } else identifier(candidate.intent_context_sha256, SHA256, code);
        });
        const constructions = view.candidates.map((item) => item.construction).join('|');
        if ((view.candidates.length === 1 && constructions !== 'adjacent_transposition')
            || (view.candidates.length === 3
                && constructions !== 'identity|adjacent_transposition|token_order_reversal')) fail(code);
        return view;
    };

    const validateOracleHits = (value, returnedCount, code) => {
        if (!Array.isArray(value) || value.length !== Math.min(3, returnedCount)) fail(code);
        const ids = new Set();
        value.forEach((rawHit, index) => {
            const hit = exactObject(rawHit, BAD_CASE_HIT_KEYS, code);
            identifier(hit.product_id, PRODUCT_ID, code);
            identifier(hit.locale, LOCALE_ID, code);
            boundedString(hit.title, 1, 256, code);
            if (hit.rank !== index + 1 || ids.has(`${hit.locale}\u0000${hit.product_id}`)) fail(code);
            ids.add(`${hit.locale}\u0000${hit.product_id}`);
        });
    };

    const validateHumanOracleBehaviorView = (value, expectedBatchId, expectedUnitId) => {
        const code = 'invalid_human_oracle_behavior_view';
        const view = exactObject(value, ORACLE_BEHAVIOR_VIEW_KEYS, code);
        if (view.schema_version !== 'human-oracle-behavior-view-v1'
            || view.oracle_batch_id !== expectedBatchId
            || view.unit_id !== expectedUnitId
            || view.source_reference_scope !== 'identity_only_not_variant_label'
            || view.synthetic_product_relevance_labels_included !== false
            || view.cache_allowed !== false) fail(code);
        identifier(view.oracle_batch_id, ORACLE_BATCH_ID, code);
        identifier(view.diagnostic_id, BAD_CASE_ID, code);
        identifier(view.unit_id, ORACLE_UNIT_ID, code);
        identifier(view.source_case_id, QUERY_CASE_ID, code);
        if (!Array.isArray(view.candidates) || ![1, 3].includes(view.candidates.length)) fail(code);
        const ids = new Set();
        view.candidates.forEach((rawCandidate) => {
            const candidate = exactObject(rawCandidate, ORACLE_BEHAVIOR_CANDIDATE_KEYS, code);
            identifier(candidate.case_id, QUERY_CASE_ID, code);
            if (ids.has(candidate.case_id) || !ORACLE_CONSTRUCTIONS.includes(candidate.construction)) fail(code);
            ids.add(candidate.case_id);
            boundedString(candidate.query_text, 1, 256, code);
            boundedString(candidate.source_query_text, 1, 256, code);
            identifier(candidate.behavior_context_sha256, SHA256, code);
            nullableIdentifier(candidate.intent_annotation_id, ORACLE_INTENT_ID, code);
            if ((candidate.construction === 'identity') !== (candidate.intent_annotation_id === null)) fail(code);
            if (!Array.isArray(candidate.categories) || candidate.categories.length < 1) fail(code);
            let prior = -1;
            candidate.categories.forEach((category) => {
                const index = BAD_CASE_CATEGORY_ORDER.indexOf(category);
                if (index <= prior) fail(code);
                prior = index;
            });
            if (!BAD_CASE_REASONS.includes(candidate.reason_code)) fail(code);
            const sourceCount = count(candidate.source_returned_at_k, code);
            const variantCount = count(candidate.variant_returned_at_k, code);
            const overlap = count(candidate.overlap_at_k, code);
            if (sourceCount > 10 || variantCount > 10 || overlap > Math.min(sourceCount, variantCount)) fail(code);
            validateOracleHits(candidate.source_top_hits, sourceCount, code);
            validateOracleHits(candidate.variant_top_hits, variantCount, code);
        });
        return view;
    };

    const intentReasonForConstruction = (construction, judgment) => {
        const reason = ORACLE_INTENT_REASON_BY_CONSTRUCTION[construction]?.[judgment];
        return reason || fail('invalid_human_oracle_intent_choice');
    };

    const behaviorReasonForIntent = (construction, intentJudgment, judgment) => {
        if (!ORACLE_CONSTRUCTIONS.includes(construction)
            || !ORACLE_BEHAVIOR_JUDGMENTS.includes(judgment)
            || (construction === 'identity' ? intentJudgment !== null : !ORACLE_INTENT_JUDGMENTS.includes(intentJudgment))) {
            fail('invalid_human_oracle_behavior_choice');
        }
        if ((intentJudgment === 'not_equivalent' && judgment === 'confirmed_issue')
            || (intentJudgment === 'uncertain' && judgment !== 'uncertain')) {
            fail('invalid_human_oracle_behavior_choice');
        }
        if (judgment === 'confirmed_issue') {
            return intentJudgment === 'equivalent'
                ? 'equivalent_intent_should_preserve_behavior'
                : 'owner_catalog_expectation';
        }
        if (judgment === 'acceptable') {
            return intentJudgment === 'not_equivalent'
                ? 'intent_not_equivalent'
                : 'behavior_is_expected';
        }
        if (construction === 'identity') return 'catalog_coverage_unknown';
        return intentJudgment === 'uncertain'
            ? 'insufficient_domain_knowledge'
            : 'insufficient_result_evidence';
    };

    const validateHumanOracleIntentSubmit = (value, request) => {
        const code = 'invalid_human_oracle_intent_submission';
        const response = exactObject(value, ORACLE_INTENT_SUBMIT_KEYS, code);
        if (response.schema_version !== 'human-oracle-intent-api-summary-v1'
            || response.oracle_batch_id !== request.oracle_batch_id
            || response.unit_id !== request.unit_id
            || response.case_id !== request.case_id
            || response.judgment !== request.judgment
            || response.reason_code !== request.reason_code
            || response.supersedes_annotation_id !== request.expected_previous_annotation_id
            || response.result_evidence_was_withheld !== true
            || response.product_relevance_labels_created !== 0) fail(code);
        identifier(response.intent_annotation_id, ORACLE_INTENT_ID, code);
        return response;
    };

    const validateHumanOracleBehaviorSubmit = (value, request) => {
        const code = 'invalid_human_oracle_behavior_submission';
        const response = exactObject(value, ORACLE_BEHAVIOR_SUBMIT_KEYS, code);
        if (response.schema_version !== 'human-oracle-behavior-api-summary-v1'
            || response.oracle_batch_id !== request.oracle_batch_id
            || response.unit_id !== request.unit_id
            || response.case_id !== request.case_id
            || response.judgment !== request.judgment
            || response.reason_code !== request.reason_code
            || response.intent_annotation_id !== request.intent_annotation_id
            || response.supersedes_annotation_id !== request.expected_previous_annotation_id
            || response.product_relevance_labels_created !== 0
            || response.root_cause_claimed !== false) fail(code);
        identifier(response.behavior_annotation_id, ORACLE_BEHAVIOR_ID, code);
        return response;
    };

    const validateHumanOracleSeal = (value, expectedBatchId) => {
        const code = 'invalid_human_oracle_seal';
        const seal = exactObject(value, ORACLE_SEAL_KEYS, code);
        if (seal.schema_version !== 'human-oracle-seal-api-summary-v1'
            || seal.oracle_batch_id !== expectedBatchId
            || seal.synthetic_intent_annotation_count !== 30
            || seal.behavior_annotation_count !== 40
            || seal.product_relevance_labels_created !== 0
            || seal.formal_evaluation_allowed !== false
            || seal.quality_conclusion_allowed !== false
            || seal.root_cause_claimed !== false
            || seal.strategy_write_count !== 0
            || !Array.isArray(seal.limitations)
            || seal.limitations.join('|') !== ORACLE_SEAL_LIMITATIONS.join('|')) fail(code);
        identifier(seal.oracle_id, HUMAN_ORACLE_ID, code);
        identifier(seal.diagnostic_id, BAD_CASE_ID, code);
        return seal;
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

    const fetchDiagnosticExperimentPlan = async (
        fetchImpl,
        apiRoot,
        diagnosticId,
        querySetId
    ) => {
        identifier(diagnosticId, BAD_CASE_ID, 'invalid_diagnostic_experiment_request');
        identifier(querySetId, QUERY_SET_ID, 'invalid_diagnostic_experiment_request');
        const response = await postJson(
            fetchImpl,
            `${apiRoot}/agent/diagnostic-experiments/plan`,
            { diagnostic_id: diagnosticId, query_set_id: querySetId }
        );
        if (!response.ok) throw new ToolSummaryHttpError(response.status);
        return validateDiagnosticExperimentPlan(await response.json());
    };

    const fetchHumanOracleBatch = async (fetchImpl, apiRoot, diagnosticId, querySetId) => {
        identifier(diagnosticId, BAD_CASE_ID, 'invalid_human_oracle_batch_request');
        identifier(querySetId, QUERY_SET_ID, 'invalid_human_oracle_batch_request');
        const response = await postJson(
            fetchImpl,
            `${apiRoot}/agent/human-oracle/batches/create`,
            { diagnostic_id: diagnosticId, query_set_id: querySetId }
        );
        if (!response.ok) throw new ToolSummaryHttpError(response.status);
        return validateHumanOracleBatch(await response.json(), diagnosticId, querySetId);
    };

    const fetchHumanOracleStatus = async (fetchImpl, apiRoot, oracleBatchId) => {
        identifier(oracleBatchId, ORACLE_BATCH_ID, 'invalid_human_oracle_status_request');
        const response = await postJson(
            fetchImpl,
            `${apiRoot}/agent/human-oracle/batches/status`,
            { oracle_batch_id: oracleBatchId }
        );
        if (!response.ok) throw new ToolSummaryHttpError(response.status);
        return validateHumanOracleReviewState(await response.json(), oracleBatchId);
    };

    const fetchHumanOracleIntentView = async (fetchImpl, apiRoot, oracleBatchId, unitId) => {
        identifier(oracleBatchId, ORACLE_BATCH_ID, 'invalid_human_oracle_intent_view_request');
        identifier(unitId, ORACLE_UNIT_ID, 'invalid_human_oracle_intent_view_request');
        const response = await postJson(
            fetchImpl,
            `${apiRoot}/agent/human-oracle/intents/view`,
            { oracle_batch_id: oracleBatchId, unit_id: unitId }
        );
        if (!response.ok) throw new ToolSummaryHttpError(response.status);
        return validateHumanOracleIntentView(await response.json(), oracleBatchId, unitId);
    };

    const submitHumanOracleIntent = async (
        fetchImpl,
        apiRoot,
        submission,
        construction
    ) => {
        const code = 'invalid_human_oracle_intent_request';
        const request = exactObject(submission, ORACLE_INTENT_REQUEST_KEYS, code);
        identifier(request.oracle_batch_id, ORACLE_BATCH_ID, code);
        identifier(request.unit_id, ORACLE_UNIT_ID, code);
        identifier(request.case_id, QUERY_CASE_ID, code);
        identifier(request.presentation_context_sha256, SHA256, code);
        identifier(request.client_action_id, UUID_V4, code);
        nullableIdentifier(request.expected_previous_annotation_id, ORACLE_INTENT_ID, code);
        if (!ORACLE_INTENT_JUDGMENTS.includes(request.judgment)
            || request.reason_code !== intentReasonForConstruction(construction, request.judgment)) fail(code);
        const response = await postJson(
            fetchImpl,
            `${apiRoot}/agent/human-oracle/intents/submit`,
            request
        );
        if (!response.ok) throw new ToolSummaryHttpError(response.status);
        return validateHumanOracleIntentSubmit(await response.json(), request);
    };

    const fetchHumanOracleBehaviorView = async (fetchImpl, apiRoot, oracleBatchId, unitId) => {
        identifier(oracleBatchId, ORACLE_BATCH_ID, 'invalid_human_oracle_behavior_view_request');
        identifier(unitId, ORACLE_UNIT_ID, 'invalid_human_oracle_behavior_view_request');
        const response = await postJson(
            fetchImpl,
            `${apiRoot}/agent/human-oracle/behaviors/view`,
            { oracle_batch_id: oracleBatchId, unit_id: unitId }
        );
        if (!response.ok) throw new ToolSummaryHttpError(response.status);
        return validateHumanOracleBehaviorView(await response.json(), oracleBatchId, unitId);
    };

    const submitHumanOracleBehavior = async (
        fetchImpl,
        apiRoot,
        submission,
        construction,
        activeIntentJudgment
    ) => {
        const code = 'invalid_human_oracle_behavior_request';
        const request = exactObject(submission, ORACLE_BEHAVIOR_REQUEST_KEYS, code);
        identifier(request.oracle_batch_id, ORACLE_BATCH_ID, code);
        identifier(request.unit_id, ORACLE_UNIT_ID, code);
        identifier(request.case_id, QUERY_CASE_ID, code);
        identifier(request.presentation_context_sha256, SHA256, code);
        identifier(request.client_action_id, UUID_V4, code);
        nullableIdentifier(request.intent_annotation_id, ORACLE_INTENT_ID, code);
        nullableIdentifier(request.expected_previous_annotation_id, ORACLE_BEHAVIOR_ID, code);
        if (!ORACLE_BEHAVIOR_JUDGMENTS.includes(request.judgment)
            || request.reason_code !== behaviorReasonForIntent(
                construction,
                activeIntentJudgment,
                request.judgment
            )
            || (construction === 'identity') !== (request.intent_annotation_id === null)) fail(code);
        const response = await postJson(
            fetchImpl,
            `${apiRoot}/agent/human-oracle/behaviors/submit`,
            request
        );
        if (!response.ok) throw new ToolSummaryHttpError(response.status);
        return validateHumanOracleBehaviorSubmit(await response.json(), request);
    };

    const sealHumanOracleBatch = async (fetchImpl, apiRoot, oracleBatchId, clientActionId) => {
        identifier(oracleBatchId, ORACLE_BATCH_ID, 'invalid_human_oracle_seal_request');
        identifier(clientActionId, UUID_V4, 'invalid_human_oracle_seal_request');
        const response = await postJson(
            fetchImpl,
            `${apiRoot}/agent/human-oracle/batches/seal`,
            { oracle_batch_id: oracleBatchId, client_action_id: clientActionId }
        );
        if (!response.ok) throw new ToolSummaryHttpError(response.status);
        return validateHumanOracleSeal(await response.json(), oracleBatchId);
    };

    return {
        ToolSummaryContractError,
        ToolSummaryHttpError,
        fetchAgentEval,
        fetchBadCaseDiagnostics,
        fetchDiagnosticExperimentPlan,
        fetchHumanOracleBatch,
        fetchHumanOracleBehaviorView,
        fetchHumanOracleIntentView,
        fetchHumanOracleStatus,
        fetchQueryConstructor,
        behaviorReasonForIntent,
        intentReasonForConstruction,
        sealHumanOracleBatch,
        submitHumanOracleBehavior,
        submitHumanOracleIntent,
        validateAgentEvalSummary,
        validateBadCaseSummary,
        validateDiagnosticExperimentPlan,
        validateHumanOracleBatch,
        validateHumanOracleBehaviorView,
        validateHumanOracleIntentView,
        validateHumanOracleReviewState,
        validateHumanOracleSeal,
        validateQueryConstructorSummary
    };
}));
