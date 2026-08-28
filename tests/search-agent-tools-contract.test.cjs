const assert = require('node:assert/strict');
const test = require('node:test');

const {
    ToolSummaryContractError,
    ToolSummaryHttpError,
    fetchAgentEval,
    fetchBadCaseDiagnostics,
    fetchQueryConstructor,
    validateAgentEvalSummary,
    validateBadCaseSummary,
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
        adjacent_transposition: 20,
        token_order_reversal: 19
    },
    formal_evaluation_allowed: false,
    locked_profiles_not_read: ['dev', 'test'],
    cross_split_collision_status: 'not_checked_without_reading_locked_splits'
});

const validBadCaseSummary = () => ({
    schema_version: 'bad-case-api-summary-v1',
    execution_id: 'bad-case-execution-0123456789abcdef0123456789abcdef',
    diagnostic_id: 'bad-case-aaaaaaaaaaaa',
    query_set_id: 'query-set-bbbbbbbbbbbb',
    index_id: 'catalog-baseline-v1-cccccccccccc',
    completed: true,
    query_count: 59,
    original_count: 20,
    synthetic_count: 39,
    construction_counts: {
        identity: 20,
        adjacent_transposition: 20,
        token_order_reversal: 19
    },
    top_k: 10,
    search_strategy_id: 'sqlite-fts5-bm25',
    search_call_count: 59,
    operational_failure_count: 0,
    diagnostic_candidate_count: 2,
    category_counts: {
        zero_result: 1,
        spelling_sensitive: 1,
        order_sensitive: 0,
        ranking_instability_needs_judgment: 1
    },
    samples: [
        {
            case_id: 'query-case-111111111111',
            source_case_id: 'query-case-111111111111',
            construction: 'identity',
            categories: ['zero_result'],
            reason_code: 'identity_zero_result',
            query_text: 'unmatched item',
            source_query_text: 'unmatched item',
            source_returned_at_k: 0,
            variant_returned_at_k: 0,
            overlap_at_k: 0,
            source_top_hits: [],
            variant_top_hits: []
        },
        {
            case_id: 'query-case-222222222222',
            source_case_id: 'query-case-333333333333',
            construction: 'adjacent_transposition',
            categories: ['spelling_sensitive', 'ranking_instability_needs_judgment'],
            reason_code: 'variant_result_set_changed',
            query_text: 'wirelss mouse',
            source_query_text: 'wireless mouse',
            source_returned_at_k: 10,
            variant_returned_at_k: 10,
            overlap_at_k: 7,
            source_top_hits: [
                { locale: 'us', product_id: 'B000000001', title: 'Wireless Mouse', rank: 1 },
                { locale: 'us', product_id: 'B000000002', title: 'Bluetooth Mouse', rank: 2 }
            ],
            variant_top_hits: [
                { locale: 'us', product_id: 'catalog:item-3', title: 'Compact Mouse', rank: 1 }
            ]
        }
    ],
    relevance_labels_used: false,
    relevance_metrics_computed: false,
    quality_metrics_computed: false,
    formal_evaluation_allowed: false,
    stage_drop_diagnostics_computed: false,
    locked_profiles_not_read: ['dev', 'test'],
    protected_profile_dispatch_count: 0,
    strategy_write_count: 0,
    limitations: [
        'synthetic_queries_are_unjudged',
        'diagnostics_do_not_claim_relevance_improvement',
        'development_smoke_is_not_final_evaluation',
        'single_stage_catalog_cannot_diagnose_stage_drop',
        'no_hard_worker_deadline_enforcement'
    ]
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
        summary.construction_counts.token_order_reversal = 20;
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

test('validates and fetches the exact Bad Case diagnostic summary', async () => {
    const summary = validBadCaseSummary();
    assert.equal(validateBadCaseSummary(summary), summary);
    const calls = [];
    const fetchImpl = async (url, options) => {
        calls.push({ url, options });
        return jsonResponse(200, summary);
    };

    assert.equal(await fetchBadCaseDiagnostics(fetchImpl, '/search-eval-api'), summary);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, '/search-eval-api/agent/bad-cases/run');
    assert.equal(calls[0].options.method, 'POST');
    assert.equal(calls[0].options.credentials, 'same-origin');
    assert.deepEqual(JSON.parse(calls[0].options.body), { source: 'smoke' });
});

test('Bad Case summary enforces diagnostic, privacy and arithmetic boundaries', async (t) => {
    await t.test('overlapping categories do not need to sum to candidate count', () => {
        const summary = validBadCaseSummary();
        assert.equal(summary.diagnostic_candidate_count, 2);
        assert.equal(Object.values(summary.category_counts).reduce((sum, value) => sum + value, 0), 3);
        assert.equal(validateBadCaseSummary(summary), summary);
    });

    await t.test('a completed run may have no diagnostic candidates', () => {
        const summary = validBadCaseSummary();
        summary.diagnostic_candidate_count = 0;
        summary.category_counts = {
            zero_result: 0,
            spelling_sensitive: 0,
            order_sensitive: 0,
            ranking_instability_needs_judgment: 0
        };
        summary.samples = [];
        assert.equal(validateBadCaseSummary(summary), summary);
    });

    await t.test('undeclared trace or top-level Query content is rejected', () => {
        const summary = validBadCaseSummary();
        summary.trace = { query_text: 'must not be accepted' };
        assert.throws(() => validateBadCaseSummary(summary), ToolSummaryContractError);
    });

    await t.test('a partial execution cannot be rendered as completed evidence', () => {
        const summary = validBadCaseSummary();
        summary.completed = false;
        assert.throws(() => validateBadCaseSummary(summary), ToolSummaryContractError);
    });

    await t.test('formal evaluation, labels, metrics, protected dispatches and writes stay disabled', () => {
        for (const [key, unsafeValue] of [
            ['formal_evaluation_allowed', true],
            ['relevance_labels_used', true],
            ['quality_metrics_computed', true],
            ['relevance_metrics_computed', true],
            ['stage_drop_diagnostics_computed', true],
            ['protected_profile_dispatch_count', 1],
            ['strategy_write_count', 1]
        ]) {
            const summary = validBadCaseSummary();
            summary[key] = unsafeValue;
            assert.throws(() => validateBadCaseSummary(summary), ToolSummaryContractError);
        }
    });

    await t.test('fixed 59-call SQLite BM25 execution has no partial failures', () => {
        for (const [key, invalidValue] of [
            ['search_strategy_id', 'another-strategy'],
            ['search_call_count', 58],
            ['operational_failure_count', 1]
        ]) {
            const summary = validBadCaseSummary();
            summary[key] = invalidValue;
            assert.throws(() => validateBadCaseSummary(summary), ToolSummaryContractError);
        }
        const wrongConstruction = validBadCaseSummary();
        wrongConstruction.construction_counts.adjacent_transposition = 19;
        assert.throws(() => validateBadCaseSummary(wrongConstruction), ToolSummaryContractError);
    });

    await t.test('sample categories must be unique and use the fixed order', () => {
        const summary = validBadCaseSummary();
        summary.samples[1].categories.reverse();
        assert.throws(() => validateBadCaseSummary(summary), ToolSummaryContractError);
    });

    await t.test('text limits count Unicode code points like the backend', () => {
        const summary = validBadCaseSummary();
        summary.samples[1].query_text = '🖱'.repeat(200);
        assert.equal(validateBadCaseSummary(summary), summary);

        const tooLong = validBadCaseSummary();
        tooLong.samples[1].query_text = '鼠'.repeat(201);
        assert.throws(() => validateBadCaseSummary(tooLong), ToolSummaryContractError);
    });

    await t.test('synthetic samples must point to a distinct identity source', () => {
        const summary = validBadCaseSummary();
        summary.samples[1].source_case_id = summary.samples[1].case_id;
        assert.throws(() => validateBadCaseSummary(summary), ToolSummaryContractError);
    });

    await t.test('zero-result and construction category semantics cannot conflict', () => {
        const summary = validBadCaseSummary();
        summary.samples[0].variant_returned_at_k = 1;
        assert.throws(() => validateBadCaseSummary(summary), ToolSummaryContractError);

        const wrongConstruction = validBadCaseSummary();
        wrongConstruction.samples[1].construction = 'token_order_reversal';
        assert.throws(() => validateBadCaseSummary(wrongConstruction), ToolSummaryContractError);
    });

    await t.test('display hits are capped, contiguous, ordered and unique', () => {
        const summary = validBadCaseSummary();
        summary.samples[1].source_top_hits[1].rank = 3;
        assert.throws(() => validateBadCaseSummary(summary), ToolSummaryContractError);

        const duplicate = validBadCaseSummary();
        duplicate.samples[1].source_top_hits[1].product_id = duplicate.samples[1].source_top_hits[0].product_id;
        assert.throws(() => validateBadCaseSummary(duplicate), ToolSummaryContractError);

        const invalidLocale = validBadCaseSummary();
        invalidLocale.samples[1].source_top_hits[0].locale = '../us';
        assert.throws(() => validateBadCaseSummary(invalidLocale), ToolSummaryContractError);

        const newlineLocale = validBadCaseSummary();
        newlineLocale.samples[1].source_top_hits[0].locale = 'us\n';
        assert.throws(() => validateBadCaseSummary(newlineLocale), ToolSummaryContractError);

        const sameIdDifferentLocale = validBadCaseSummary();
        sameIdDifferentLocale.samples[1].source_top_hits[1].product_id = sameIdDifferentLocale.samples[1].source_top_hits[0].product_id;
        sameIdDifferentLocale.samples[1].source_top_hits[1].locale = 'es';
        assert.equal(validateBadCaseSummary(sameIdDifferentLocale), sameIdDifferentLocale);
    });

    await t.test('category counts are bounded but are not inferred from truncated samples', () => {
        const summary = validBadCaseSummary();
        summary.category_counts.spelling_sensitive = 2;
        assert.equal(validateBadCaseSummary(summary), summary);

        const undercount = validBadCaseSummary();
        undercount.category_counts.spelling_sensitive = 0;
        assert.throws(() => validateBadCaseSummary(undercount), ToolSummaryContractError);
    });

    await t.test('fixed limitations include the single-stage and deadline boundaries', () => {
        const summary = validBadCaseSummary();
        summary.limitations.pop();
        assert.throws(() => validateBadCaseSummary(summary), ToolSummaryContractError);
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
    await assert.rejects(
        fetchBadCaseDiagnostics(fetchImpl, '/search-eval-api'),
        (error) => error instanceof ToolSummaryHttpError
            && error.status === 401
            && error.code === 'http_401'
            && !String(error).includes('must-not-surface')
    );
    assert.equal(jsonReads, 0);
});
