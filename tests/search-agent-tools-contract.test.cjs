const assert = require('node:assert/strict');
const test = require('node:test');

const {
    ToolSummaryContractError,
    ToolSummaryHttpError,
    fetchAgentEval,
    fetchQueryConstructor,
    validateAgentEvalSummary,
    validateQueryConstructorSummary
} = require('../js/search-agent-tools-contract.js');

const limitations = [
    'scripted_failures_do_not_prove_worker_deadline_enforcement',
    'contract_fixtures_test_runtime_behavior_not_search_quality',
    'grounded_claim_rate_v1_is_terminal_grounding_proxy'
];

const validEvalSummary = () => ({
    schema_version: 'agent-eval-api-summary-v1',
    suite_id: 'stage5-retrieval-v1',
    evidence_id: 'agent-eval-aaaaaaaaaaaa',
    execution_id: 'agent-eval-execution-0123456789abcdef0123456789abcdef',
    formal_passed: true,
    task_count: 12,
    metrics: {
        task_success_rate: 1,
        grounded_claim_rate: 1,
        tool_selection_accuracy: 1,
        recovery_rate: 1,
        budget_compliance_rate: 1,
        replay_fidelity_rate: 1,
        tamper_rejection_rate: 1,
        unauthorized_effect_count: 0,
        protected_profile_read_count: 0,
        strategy_write_count: 0,
        total_agent_steps: 35,
        total_agent_tool_calls: 27,
        comparable_workflow_success_rate: 1,
        comparable_workflow_tool_calls: 12
    },
    subject_summaries: [
        { subject_kind: 'production_planner', task_count: 8, passed_count: 8 },
        { subject_kind: 'harness_stimulus', task_count: 4, passed_count: 4 }
    ],
    limitations: [...limitations]
});

const validQuerySummary = () => ({
    schema_version: 'query-constructor-api-summary-v1',
    source: 'smoke',
    query_set_id: 'query-set-bbbbbbbbbbbb',
    query_count: 59,
    original_count: 20,
    synthetic_count: 39,
    deduplicated_count: 1,
    construction_counts: {
        identity: 20,
        adjacent_transposition: 19,
        token_order_reversal: 20
    },
    formal_evaluation_allowed: false,
    locked_profiles_not_read: ['dev', 'test'],
    cross_split_collision_status: 'not_checked_without_reading_locked_splits'
});

const jsonResponse = (status, body, onJson = () => {}) => ({
    status,
    ok: status >= 200 && status < 300,
    json: async () => {
        onJson();
        return body;
    }
});

test('validates and fetches the exact Agent Eval summary', async () => {
    const summary = validEvalSummary();
    assert.equal(validateAgentEvalSummary(summary), summary);
    const calls = [];
    const fetchImpl = async (url, options) => {
        calls.push({ url, options });
        return jsonResponse(200, summary);
    };

    assert.equal(await fetchAgentEval(fetchImpl, '/search-eval-api'), summary);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, '/search-eval-api/agent/eval/run');
    assert.equal(calls[0].options.method, 'POST');
    assert.equal(calls[0].options.credentials, 'same-origin');
    assert.deepEqual(JSON.parse(calls[0].options.body), { suite: 'stage5-retrieval-v1' });
});

test('Agent Eval contract rejects unsafe or inconsistent summaries', async (t) => {
    await t.test('raw task detail is forbidden', () => {
        const summary = validEvalSummary();
        summary.tasks = [{ query_text: 'must not reach the page' }];
        assert.throws(() => validateAgentEvalSummary(summary), ToolSummaryContractError);
    });

    await t.test('metrics reject extra fields', () => {
        const summary = validEvalSummary();
        summary.metrics.duration_ms = 20;
        assert.throws(() => validateAgentEvalSummary(summary), ToolSummaryContractError);
    });

    await t.test('rates must be finite unit values', () => {
        const summary = validEvalSummary();
        summary.metrics.recovery_rate = Number.NaN;
        assert.throws(() => validateAgentEvalSummary(summary), ToolSummaryContractError);
    });

    await t.test('formal pass must agree with all formal metrics', () => {
        const summary = validEvalSummary();
        summary.metrics.tamper_rejection_rate = 0;
        assert.throws(() => validateAgentEvalSummary(summary), ToolSummaryContractError);
    });

    await t.test('Planner and Harness-stimulus results cannot be conflated', () => {
        const summary = validEvalSummary();
        summary.subject_summaries[0].task_count = 12;
        summary.subject_summaries[1].task_count = 0;
        assert.throws(() => validateAgentEvalSummary(summary), ToolSummaryContractError);
    });

    await t.test('Suite v1 keeps eight Planner and four Harness tasks', () => {
        const summary = validEvalSummary();
        summary.subject_summaries[0].task_count = 7;
        summary.subject_summaries[0].passed_count = 7;
        summary.subject_summaries[1].task_count = 5;
        summary.subject_summaries[1].passed_count = 5;
        assert.throws(() => validateAgentEvalSummary(summary), ToolSummaryContractError);
    });

    await t.test('formal pass rejects protected reads or strategy writes', () => {
        const summary = validEvalSummary();
        summary.metrics.protected_profile_read_count = 1;
        assert.throws(() => validateAgentEvalSummary(summary), ToolSummaryContractError);
    });

    await t.test('limitations are the fixed privacy-safe boundary', () => {
        const summary = validEvalSummary();
        summary.limitations.reverse();
        assert.throws(() => validateAgentEvalSummary(summary), ToolSummaryContractError);
    });

    await t.test('task count is fixed at twelve', () => {
        const summary = validEvalSummary();
        summary.task_count = 11;
        assert.throws(() => validateAgentEvalSummary(summary), ToolSummaryContractError);
    });

    await t.test('logical costs must be safe integers', () => {
        const summary = validEvalSummary();
        summary.metrics.total_agent_steps = Number.MAX_VALUE;
        assert.throws(() => validateAgentEvalSummary(summary), ToolSummaryContractError);
    });

    await t.test('a non-passing scorecard is accepted only when formal_passed is false', () => {
        const summary = validEvalSummary();
        summary.metrics.task_success_rate = 11 / 12;
        summary.subject_summaries[0].passed_count = 7;
        summary.formal_passed = false;
        assert.equal(validateAgentEvalSummary(summary), summary);
    });
});

test('validates and fetches the exact Query constructor summary', async () => {
    const summary = validQuerySummary();
    assert.equal(validateQueryConstructorSummary(summary), summary);
    const calls = [];
    const fetchImpl = async (url, options) => {
        calls.push({ url, options });
        return jsonResponse(200, summary);
    };

    assert.equal(await fetchQueryConstructor(fetchImpl, '/search-eval-api'), summary);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, '/search-eval-api/agent/query-constructor/build');
    assert.equal(calls[0].options.method, 'POST');
    assert.equal(calls[0].options.credentials, 'same-origin');
    assert.deepEqual(JSON.parse(calls[0].options.body), { source: 'smoke' });
});

test('Query constructor contract rejects raw content and boundary drift', async (t) => {
    await t.test('raw Query arrays are forbidden', () => {
        const summary = validQuerySummary();
        summary.queries = ['must not reach the page'];
        assert.throws(() => validateQueryConstructorSummary(summary), ToolSummaryContractError);
    });

    await t.test('count arithmetic must be consistent', () => {
        const summary = validQuerySummary();
        summary.synthetic_count = 38;
        assert.throws(() => validateQueryConstructorSummary(summary), ToolSummaryContractError);
    });

    await t.test('construction counts must explain the whole set', () => {
        const summary = validQuerySummary();
        summary.construction_counts.token_order_reversal = 19;
        assert.throws(() => validateQueryConstructorSummary(summary), ToolSummaryContractError);
    });

    await t.test('formal evaluation is always forbidden', () => {
        const summary = validQuerySummary();
        summary.formal_evaluation_allowed = true;
        assert.throws(() => validateQueryConstructorSummary(summary), ToolSummaryContractError);
    });

    await t.test('locked profiles remain exact and ordered', () => {
        const summary = validQuerySummary();
        summary.locked_profiles_not_read = ['test', 'dev'];
        assert.throws(() => validateQueryConstructorSummary(summary), ToolSummaryContractError);
    });
});

test('tool HTTP failures never read or expose error response bodies', async () => {
    let jsonReads = 0;
    const fetchImpl = async () => jsonResponse(
        401,
        { query_text: 'must-not-surface', authorization: 'must-not-surface' },
        () => { jsonReads += 1; }
    );

    await assert.rejects(
        fetchAgentEval(fetchImpl, '/search-eval-api'),
        (error) => error instanceof ToolSummaryHttpError
            && error.status === 401
            && error.code === 'http_401'
            && !String(error).includes('must-not-surface')
    );
    assert.equal(jsonReads, 0);
});
