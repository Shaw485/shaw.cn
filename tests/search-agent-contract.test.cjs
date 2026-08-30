const assert = require('node:assert/strict');
const test = require('node:test');

const {
    AnalysisContractError,
    AnalysisHttpError,
    fetchAnalysis,
    validateAnalysis
} = require('../js/search-agent-contract.js');

const delta = (baseline, candidate) => ({
    baseline,
    candidate,
    delta: candidate - baseline
});

const result = (rank, productId, title, label) => ({
    rank,
    locale: 'us',
    product_id: productId,
    product_title: title,
    label
});

const WEIGHTED = {
    'exact-title-recall-v1': 1,
    'multi-field-bm25-recall-v1': 0.1,
    'title-bm25-recall-v1': 1
};

const AGGRESSIVE = {
    'exact-title-recall-v1': 0.5,
    'multi-field-bm25-recall-v1': 0.25,
    'title-bm25-recall-v1': 1
};

const validAnalysis = () => {
    const baselineRunId = 'retrieval-aaaaaaaaaaaa';
    const candidateRunId = 'retrieval-bbbbbbbbbbbb';
    const comparisonId = 'retrieval-comparison-cccccccccccc';
    const diagnosisId = 'stage-diagnosis-dddddddddddd';
    const candidateDiagnosisId = 'stage-diagnosis-eeeeeeeeeeee';
    return {
        schema_version: 'retrieval-stage-analysis-response-v1',
        profile: 'smoke',
        retrieval_run_id: baselineRunId,
        candidate_run_id: candidateRunId,
        comparison_id: comparisonId,
        diagnosis_id: diagnosisId,
        candidate_diagnosis_id: candidateDiagnosisId,
        changed_query_examples: [
            {
                query_id: 1,
                locale: 'us',
                query_text: 'wireless mouse',
                'coarse_ndcg@10_delta': 0.01,
                'fusion_ndcg@10_delta': 0.005,
                union_coverage_delta: 0.1,
                baseline_top_results: [
                    result(1, 'B000BASELINE', 'Baseline Wireless Mouse', 'E')
                ],
                candidate_top_results: [
                    result(1, 'B000CANDIDATE', 'Candidate Wireless Mouse', 'E')
                ],
                recovered_relevant: [],
                candidate_run_id: candidateRunId,
                comparison_id: comparisonId,
                gate_passed: true,
                is_selected_comparison: true,
                outcome: 'improvement',
                pipeline_variant: 'title-exact-multifield-weighted-v1'
            },
            {
                query_id: 2,
                locale: 'us',
                query_text: 'gaming keyboard',
                'coarse_ndcg@10_delta': -0.02,
                'fusion_ndcg@10_delta': -0.01,
                union_coverage_delta: 0,
                baseline_top_results: [
                    result(1, 'B000KEYBASE', 'Baseline Gaming Keyboard', 'E')
                ],
                candidate_top_results: [
                    result(1, 'B000KEYCAND', 'Candidate Gaming Keyboard', 'S')
                ],
                recovered_relevant: [],
                candidate_run_id: 'retrieval-ffffffffffff',
                comparison_id: 'retrieval-comparison-111111111111',
                gate_passed: false,
                is_selected_comparison: false,
                outcome: 'regression',
                pipeline_variant: 'title-exact-multifield-v1'
            }
        ],
        diagnosis: {
            diagnosis_id: diagnosisId,
            findings: [{
                subtype: 'recall_gap',
                stage_dropped_relevant_count: 2,
                impact: 0.1,
                impact_aggregation: 'relevant_item_micro_rate'
            }]
        },
        candidate_diagnosis: {
            diagnosis_id: candidateDiagnosisId,
            findings: []
        },
        comparison: {
            schema_version: 'query-scoped-retrieval-comparison-v1',
            baseline_run_id: baselineRunId,
            candidate_run_id: candidateRunId,
            comparison_id: comparisonId,
            aggregate_deltas: {
                recall_union: {
                    judged_relevant_coverage: delta(0.8, 0.85)
                },
                fusion: {
                    'judged_recall@5': delta(0.4, 0.42),
                    'judged_recall@10': delta(0.5, 0.53),
                    'mrr@10': delta(0.8, 0.8),
                    'ndcg@10': delta(0.67, 0.68)
                },
                coarse_rank: {
                    'judged_recall@5': delta(0.41, 0.43),
                    'judged_recall@10': delta(0.52, 0.53),
                    'mrr@10': delta(0.84, 0.85),
                    'ndcg@10': delta(0.68, 0.69)
                }
            },
            candidate_strategy: {
                unique_relevant_contribution: 14,
                pipeline_variant: 'title-exact-multifield-weighted-v1',
                fusion_weights: WEIGHTED
            },
            candidate_stage_transitions: {
                'judged_recall@10': {
                    fusion: 0.53,
                    coarse_rank: 0.53,
                    delta: 0
                },
                'mrr@10': {
                    fusion: 0.8,
                    coarse_rank: 0.85,
                    delta: 0.05
                },
                'ndcg@10': {
                    fusion: 0.68,
                    coarse_rank: 0.69,
                    delta: 0.01
                }
            },
            gate_result: {
                passed: true,
                checks: [
                    ['unique_relevant_contribution', '>', 14, 0],
                    ['union_coverage_improvement', '>', 0.05, 0],
                    ['fusion_recall_at_10_floor', '>=', 0.03, 0],
                    ['fusion_ndcg_at_10_floor', '>=', 0.01, 0],
                    ['fusion_mrr_at_10_floor', '>=', 0, 0],
                    ['coarse_recall_at_10_floor', '>=', 0.01, 0],
                    ['coarse_ndcg_at_10_floor', '>=', 0.01, 0],
                    ['coarse_mrr_at_10_floor', '>=', 0.01, 0],
                    ['worst_query_coarse_ndcg_delta_floor', '>=', 0.01, -0.02],
                    ['regressed_query_rate_ceiling', '<=', 0, 0.1],
                    ['worst_query_fusion_ndcg_delta_floor', '>=', 0.005, -0.02],
                    ['fusion_regressed_query_rate_ceiling', '<=', 0, 0.1]
                ].map(([name, comparator, observed, threshold]) => ({
                    name, passed: true, comparator, observed, threshold
                }))
            },
            per_query: [{
                query_id: 1,
                locale: 'us',
                query_text: 'wireless mouse',
                'coarse_ndcg@10_delta': 0.01,
                'fusion_ndcg@10_delta': 0.005,
                union_coverage_delta: 0.1,
                baseline_top_results: [
                    result(1, 'B000BASELINE', 'Baseline Wireless Mouse', 'E')
                ],
                candidate_top_results: [
                    result(1, 'B000CANDIDATE', 'Candidate Wireless Mouse', 'E')
                ],
                recovered_relevant: [{
                    locale: 'us',
                    product_id: 'B000RECOVERED',
                    product_title: 'Recovered Wireless Mouse',
                    label: 'E',
                    candidate_first_loss_stage: 'coarse_rank',
                    candidate_multi_field_rank: 3
                }]
            }]
        },
        experiments: [
            {
                candidate_run_id: candidateRunId,
                comparison_id: comparisonId,
                pipeline_variant: 'title-exact-multifield-weighted-v1',
                gate_passed: true,
                failed_gates: [],
                fusion_mrr_at_10_delta: 0,
                fusion_ndcg_at_10_delta: 0.01,
                worst_fusion_query_ndcg_at_10_delta: 0.005,
                fusion_weights: WEIGHTED
            },
            {
                candidate_run_id: 'retrieval-ffffffffffff',
                comparison_id: 'retrieval-comparison-111111111111',
                pipeline_variant: 'title-exact-multifield-v1',
                gate_passed: false,
                failed_gates: ['fusion_mrr_at_10_floor'],
                fusion_mrr_at_10_delta: -0.02,
                fusion_ndcg_at_10_delta: 0.02,
                worst_fusion_query_ndcg_at_10_delta: -0.04,
                fusion_weights: 'uniform'
            },
            {
                candidate_run_id: 'retrieval-222222222222',
                comparison_id: 'retrieval-comparison-333333333333',
                pipeline_variant: 'title-exact-multifield-weighted-aggressive-v1',
                gate_passed: false,
                failed_gates: ['fusion_regressed_query_rate_ceiling'],
                fusion_mrr_at_10_delta: -0.01,
                fusion_ndcg_at_10_delta: 0.02,
                worst_fusion_query_ndcg_at_10_delta: -0.01,
                fusion_weights: AGGRESSIVE
            }
        ],
        agent_run: {
            schema_version: 'retrieval-agent-run-summary-v1',
            trace_id: '0123456789abcdef0123456789abcdef',
            runtime_id: 'search-agent-runtime-v1',
            planner_id: 'stage-aware-retrieval-planner-v1',
            state: 'completed',
            outcome: 'proposal_ready',
            reason_code: 'conservative_candidate_selected',
            steps_used: 5,
            tool_calls_used: 4,
            replay_supported: true,
            actions: [
                {
                    sequence: 1,
                    tool_name: 'diagnose_baseline_retrieval',
                    reason_code: 'diagnose_retrieval_baseline',
                    status: 'succeeded',
                    evidence_ref: `run:${baselineRunId}`,
                    pipeline_variant: null,
                    gate_passed: null,
                    failed_gates: [],
                    retryable: false
                },
                {
                    sequence: 2,
                    tool_name: 'run_retrieval_candidate',
                    reason_code: 'test_uniform_multifield_fusion',
                    status: 'succeeded',
                    evidence_ref: 'comparison:retrieval-comparison-111111111111',
                    pipeline_variant: 'title-exact-multifield-v1',
                    gate_passed: false,
                    failed_gates: ['fusion_mrr_at_10_floor'],
                    retryable: false
                },
                {
                    sequence: 3,
                    tool_name: 'run_retrieval_candidate',
                    reason_code: 'test_conservative_multifield_fusion',
                    status: 'succeeded',
                    evidence_ref: `comparison:${comparisonId}`,
                    pipeline_variant: 'title-exact-multifield-weighted-v1',
                    gate_passed: true,
                    failed_gates: [],
                    retryable: false
                },
                {
                    sequence: 4,
                    tool_name: 'run_retrieval_candidate',
                    reason_code: 'probe_aggressive_multifield_fusion',
                    status: 'succeeded',
                    evidence_ref: 'comparison:retrieval-comparison-333333333333',
                    pipeline_variant: 'title-exact-multifield-weighted-aggressive-v1',
                    gate_passed: false,
                    failed_gates: ['fusion_regressed_query_rate_ceiling'],
                    retryable: false
                }
            ]
        },
        status: 'proposal_ready',
        proposal: {
            proposal_id: 'retrieval-proposal-444444444444',
            proposal_revision: 'a'.repeat(64),
            lifecycle: 'pending_owner_review',
            approval_eligible: true,
            decision: 'request_owner_review',
            candidate_strategy_id: 'candidate-title-exact-multifield-weighted-v1',
            next_action: 'owner_review',
            reason: 'The conservative candidate passed every smoke gate.'
        }
    };
};

const jsonResponse = (status, body, onJson = () => {}) => ({
    status,
    ok: status >= 200 && status < 300,
    json: async () => {
        onJson();
        return body;
    }
});

const expectContractFailure = async (analysis) => {
    const fetchImpl = async () => jsonResponse(200, analysis);
    await assert.rejects(
        fetchAnalysis(fetchImpl, '/search-eval-api'),
        (error) => error instanceof AnalysisContractError
            && error.code === 'invalid_analysis_response'
            && error.message === 'invalid_analysis_response'
    );
};

test('accepts a complete stage-analysis response and preserves the validated object', async () => {
    const analysis = validAnalysis();
    assert.equal(validateAnalysis(analysis), analysis);

    const calls = [];
    const fetchImpl = async (url, options) => {
        calls.push({ url, options });
        return jsonResponse(200, analysis);
    };
    const response = await fetchAnalysis(fetchImpl, '/search-eval-api');

    assert.deepEqual(response, { kind: 'stage', analysis });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, '/search-eval-api/agent/retrieval/analyze');
    assert.equal(calls[0].options.method, 'POST');
    assert.equal(calls[0].options.credentials, 'same-origin');
    assert.deepEqual(JSON.parse(calls[0].options.body), { profile: 'smoke' });
});

test('rejects 200 responses with missing, NaN, or arithmetically inconsistent evidence', async (t) => {
    await t.test('proposal lifecycle is immutable and approval eligible only after gates pass', async () => {
        const analysis = validAnalysis();
        analysis.proposal.lifecycle = 'active';
        await expectContractFailure(analysis);
    });

    await t.test('proposal revision is a lowercase sha256', async () => {
        const analysis = validAnalysis();
        analysis.proposal.proposal_revision = 'A'.repeat(64);
        await expectContractFailure(analysis);
    });

    await t.test('missing required runtime trace', async () => {
        const analysis = validAnalysis();
        delete analysis.agent_run;
        await expectContractFailure(analysis);
    });

    await t.test('missing required metric', async () => {
        const analysis = validAnalysis();
        delete analysis.comparison.aggregate_deltas.fusion['mrr@10'];
        await expectContractFailure(analysis);
    });

    await t.test('NaN metric', async () => {
        const analysis = validAnalysis();
        analysis.comparison.per_query[0]['fusion_ndcg@10_delta'] = Number.NaN;
        await expectContractFailure(analysis);
    });

    await t.test('delta does not equal candidate minus baseline', async () => {
        const analysis = validAnalysis();
        analysis.comparison.aggregate_deltas.fusion['ndcg@10'].delta = 0.5;
        await expectContractFailure(analysis);
    });

    await t.test('gate policy threshold is altered', async () => {
        const analysis = validAnalysis();
        analysis.comparison.gate_result.checks[0].threshold = -1;
        await expectContractFailure(analysis);
    });

    await t.test('overall gate result conflicts with its checks', async () => {
        const analysis = validAnalysis();
        analysis.comparison.gate_result.passed = false;
        await expectContractFailure(analysis);
    });
});

test('accepts an explicitly empty Top 10 result set', () => {
    const analysis = validAnalysis();
    analysis.comparison.per_query[0].baseline_top_results = [];
    analysis.comparison.per_query[0].candidate_top_results = [];
    assert.equal(validateAnalysis(analysis), analysis);
});

test('rejects changed Query examples with tied outcomes or mismatched provenance', async (t) => {
    await t.test('tied outcome', async () => {
        const analysis = validAnalysis();
        analysis.changed_query_examples[0]['coarse_ndcg@10_delta'] = 0;
        await expectContractFailure(analysis);
    });

    await t.test('mismatched experiment source', async () => {
        const analysis = validAnalysis();
        analysis.changed_query_examples[1].candidate_run_id = analysis.candidate_run_id;
        await expectContractFailure(analysis);
    });
});

test('a 404 stage endpoint fails closed without calling another Agent route', async () => {
    const calls = [];
    const fetchImpl = async (url, options) => {
        calls.push({ url, options });
        return jsonResponse(404, { error: 'not_found' });
    };

    await assert.rejects(
        fetchAnalysis(fetchImpl, '/search-eval-api'),
        (error) => error instanceof AnalysisHttpError
            && error.status === 404
            && error.code === 'http_404'
    );
    assert.deepEqual(calls.map(({ url }) => url), [
        '/search-eval-api/agent/retrieval/analyze'
    ]);
    assert.equal(calls[0].options.method, 'POST');
    assert.equal(calls[0].options.credentials, 'same-origin');
});

test('a 401 is a safe HTTP error and never falls back or reads the error body', async () => {
    let calls = 0;
    let jsonReads = 0;
    const fetchImpl = async () => {
        calls += 1;
        return jsonResponse(401, { secret: 'must-not-surface' }, () => { jsonReads += 1; });
    };

    await assert.rejects(
        fetchAnalysis(fetchImpl, '/search-eval-api'),
        (error) => error instanceof AnalysisHttpError
            && error.status === 401
            && error.code === 'http_401'
            && error.message === 'http_401'
            && !String(error).includes('must-not-surface')
    );
    assert.equal(calls, 1);
    assert.equal(jsonReads, 0);
});

test('a 5xx stage response never falls back to the legacy endpoint', async () => {
    const calls = [];
    const fetchImpl = async (url) => {
        calls.push(url);
        return jsonResponse(503, { error: 'temporarily_unavailable' });
    };

    await assert.rejects(
        fetchAnalysis(fetchImpl, '/search-eval-api'),
        (error) => error instanceof AnalysisHttpError
            && error.status === 503
            && error.code === 'http_503'
    );
    assert.deepEqual(calls, ['/search-eval-api/agent/retrieval/analyze']);
});

test('validates every experiment, including an unselected candidate', async () => {
    const analysis = validAnalysis();
    assert.equal(analysis.experiments[0].candidate_run_id, analysis.candidate_run_id);
    analysis.experiments[1].fusion_ndcg_at_10_delta = Number.NaN;

    await expectContractFailure(analysis);
});

test('strictly validates and cross-links the Agent runtime trace', async (t) => {
    await t.test('trace identifiers are lowercase fixed-width hex', async () => {
        const analysis = validAnalysis();
        analysis.agent_run.trace_id = 'ABCDEF0123456789ABCDEF0123456789';
        await expectContractFailure(analysis);
    });

    await t.test('runtime object rejects undeclared fields', async () => {
        const analysis = validAnalysis();
        analysis.agent_run.secret_debug_payload = 'must not be accepted';
        await expectContractFailure(analysis);
    });

    await t.test('action object rejects undeclared fields', async () => {
        const analysis = validAnalysis();
        analysis.agent_run.actions[0].query_text = 'must not be accepted';
        await expectContractFailure(analysis);
    });

    await t.test('steps and tool-call counts match the action list', async () => {
        const analysis = validAnalysis();
        analysis.agent_run.steps_used = analysis.agent_run.tool_calls_used;
        await expectContractFailure(analysis);
    });

    await t.test('action sequences are positive and contiguous', async () => {
        const analysis = validAnalysis();
        analysis.agent_run.actions[2].sequence = 4;
        await expectContractFailure(analysis);
    });

    await t.test('baseline diagnosis evidence points to the baseline Run', async () => {
        const analysis = validAnalysis();
        analysis.agent_run.actions[0].evidence_ref = `run:${analysis.candidate_run_id}`;
        await expectContractFailure(analysis);
    });

    await t.test('candidate evidence points to its exact Comparison', async () => {
        const analysis = validAnalysis();
        analysis.agent_run.actions[1].evidence_ref = `comparison:${analysis.comparison_id}`;
        await expectContractFailure(analysis);
    });

    await t.test('candidate gate decision matches its experiment', async () => {
        const analysis = validAnalysis();
        analysis.agent_run.actions[1].gate_passed = true;
        await expectContractFailure(analysis);
    });

    await t.test('candidate failed gates match their experiment in order', async () => {
        const analysis = validAnalysis();
        analysis.agent_run.actions[1].failed_gates = ['fusion_ndcg_at_10_floor'];
        await expectContractFailure(analysis);
    });

    await t.test('every experiment has exactly one candidate action', async () => {
        const analysis = validAnalysis();
        analysis.agent_run.actions[3].pipeline_variant = 'title-exact-multifield-v1';
        await expectContractFailure(analysis);
    });

    await t.test('a successful 200 analysis has a completed matching terminal outcome', async () => {
        const analysis = validAnalysis();
        analysis.agent_run.outcome = 'inconclusive';
        analysis.agent_run.state = 'failed';
        await expectContractFailure(analysis);
    });

    await t.test('a completed trace may expose one retryable failure followed by the exact retry', async () => {
        const analysis = validAnalysis();
        const failedAttempt = {
            ...analysis.agent_run.actions[1],
            status: 'failed',
            evidence_ref: null,
            gate_passed: null,
            failed_gates: [],
            retryable: true
        };
        analysis.agent_run.actions.splice(1, 0, failedAttempt);
        analysis.agent_run.actions.forEach((action, index) => { action.sequence = index + 1; });
        analysis.agent_run.tool_calls_used = 5;
        analysis.agent_run.steps_used = 6;

        assert.equal(validateAnalysis(analysis), analysis);
    });

    await t.test('a failed action must be immediately followed by the same successful retry', async () => {
        const analysis = validAnalysis();
        analysis.agent_run.actions[1].status = 'failed';
        analysis.agent_run.actions[1].evidence_ref = null;
        analysis.agent_run.actions[1].gate_passed = null;
        analysis.agent_run.actions[1].failed_gates = [];
        analysis.agent_run.actions[1].retryable = true;
        await expectContractFailure(analysis);
    });
});
