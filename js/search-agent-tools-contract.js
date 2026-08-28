(function initSearchAgentToolsContract(root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.SearchAgentToolsContract = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
    'use strict';

    const EVIDENCE_ID = /^agent-eval-[0-9a-f]{12}$/;
    const EXECUTION_ID = /^agent-eval-execution-[0-9a-f]{32}$/;
    const QUERY_SET_ID = /^query-set-[0-9a-f]{12}$/;
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
    const identifier = (value, pattern, code) => (
        typeof value === 'string' && pattern.test(value) ? value : fail(code)
    );
    const count = (value, code, { positive = false } = {}) => {
        if (!Number.isSafeInteger(value) || value < (positive ? 1 : 0)) fail(code);
        return value;
    };
    const rate = (value, code) => {
        if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) fail(code);
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
        if (queryCount !== originalCount + syntheticCount) fail(code);

        const constructions = exactObject(summary.construction_counts, CONSTRUCTION_KEYS, code);
        CONSTRUCTION_KEYS.forEach((key) => count(constructions[key], code));
        if (constructions.identity !== originalCount
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

    return {
        ToolSummaryContractError,
        ToolSummaryHttpError,
        fetchAgentEval,
        fetchQueryConstructor,
        validateAgentEvalSummary,
        validateQueryConstructorSummary
    };
}));
