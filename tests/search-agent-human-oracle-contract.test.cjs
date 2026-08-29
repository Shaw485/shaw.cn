const assert = require('node:assert/strict');
const test = require('node:test');

const {
    ToolSummaryContractError,
    behaviorReasonForIntent,
    fetchHumanOracleBatch,
    fetchHumanOracleBehaviorView,
    fetchHumanOracleIntentView,
    fetchHumanOracleStatus,
    intentReasonForConstruction,
    sealHumanOracleBatch,
    submitHumanOracleBehavior,
    submitHumanOracleIntent,
    validateHumanOracleBatch,
    validateHumanOracleBehaviorView,
    validateHumanOracleIntentView,
    validateHumanOracleReviewState,
    validateHumanOracleSeal
} = require('../js/search-agent-tools-contract.js');

const hex = (value) => value.toString(16).padStart(12, '0');
const unitId = (value) => `oracle-unit-${hex(value)}`;
const caseId = (value) => `query-case-${hex(value)}`;
const intentId = (value) => `oracle-intent-${hex(value)}`;
const behaviorId = (value) => `oracle-behavior-${hex(value)}`;
const batchId = 'oracle-batch-aaaaaaaaaaaa';
const diagnosticId = 'bad-case-bbbbbbbbbbbb';
const querySetId = 'query-set-cccccccccccc';
const sha = (character) => character.repeat(64);
const clientActionId = '12345678-1234-4234-8234-123456789abc';

const units = () => Array.from({ length: 20 }, (_, index) => ({
    unit_id: unitId(index + 1),
    source_case_id: caseId(index * 3 + 1),
    stratum: index < 10 ? 'source_zero_cluster' : 'source_nonzero_variant_zero',
    candidate_count: index < 10 ? 3 : 1
}));

const validBatch = () => ({
    schema_version: 'human-oracle-batch-api-summary-v1',
    oracle_batch_id: batchId,
    diagnostic_id: diagnosticId,
    query_set_id: querySetId,
    selected_cluster_count: 20,
    selected_candidate_count: 40,
    synthetic_intent_candidate_count: 30,
    units: units(),
    formal_evaluation_allowed: false,
    quality_conclusion_allowed: false,
    strategy_write_count: 0
});

const baseCases = () => {
    const cases = [];
    for (let index = 0; index < 10; index += 1) {
        const id = index * 3 + 1;
        cases.push(
            { unit: index + 1, id, construction: 'identity' },
            { unit: index + 1, id: id + 1, construction: 'adjacent_transposition' },
            { unit: index + 1, id: id + 2, construction: 'token_order_reversal' }
        );
    }
    for (let index = 10; index < 20; index += 1) {
        cases.push({ unit: index + 1, id: index + 21, construction: 'adjacent_transposition' });
    }
    return cases;
};

const validReview = ({ intents = 0, behaviors = 0, status = 'open' } = {}) => {
    let intentIndex = 0;
    let behaviorIndex = 0;
    const cases = baseCases().map((item) => {
        const hasIntent = item.construction !== 'identity' && intentIndex++ < intents;
        const hasBehavior = behaviorIndex++ < behaviors;
        const activeIntentId = hasIntent ? intentId(item.id) : null;
        const activeBehaviorId = hasBehavior ? behaviorId(item.id) : null;
        return {
            unit_id: unitId(item.unit),
            case_id: caseId(item.id),
            construction: item.construction,
            active_intent_annotation_id: activeIntentId,
            active_intent_judgment: activeIntentId ? 'equivalent' : null,
            expected_previous_intent_annotation_id: activeIntentId,
            expected_previous_behavior_annotation_id: activeBehaviorId,
            active_behavior_annotation_id: activeBehaviorId,
            active_behavior_judgment: activeBehaviorId ? 'confirmed_issue' : null,
            behavior_invalidated_by_intent_change: false
        };
    });
    return {
        schema_version: 'human-oracle-review-state-v1',
        oracle_batch_id: batchId,
        projection: {
            oracle_batch_id: batchId,
            status,
            active_intent_annotation_count: intents,
            active_behavior_annotation_count: behaviors,
            invalidated_behavior_annotation_count: 0,
            sealed_oracle_id: status === 'sealed' ? 'human-oracle-dddddddddddd' : null
        },
        cases
    };
};

const validIntentView = () => ({
    schema_version: 'human-oracle-intent-view-v1',
    oracle_batch_id: batchId,
    unit_id: unitId(1),
    source_case_id: caseId(1),
    source_query_text: 'wireless mouse',
    candidates: [
        {
            case_id: caseId(1), construction: 'identity', query_text: 'wireless mouse',
            requires_intent_annotation: false, intent_context_sha256: null
        },
        {
            case_id: caseId(2), construction: 'adjacent_transposition', query_text: 'wirelsss mouse',
            requires_intent_annotation: true, intent_context_sha256: sha('a')
        },
        {
            case_id: caseId(3), construction: 'token_order_reversal', query_text: 'mouse wireless',
            requires_intent_annotation: true, intent_context_sha256: sha('b')
        }
    ],
    result_evidence_included: false,
    source_product_labels_included: false,
    cache_allowed: false
});

const emptyHitCandidate = (id, construction, intentAnnotationId) => ({
    case_id: caseId(id),
    construction,
    query_text: construction === 'identity' ? 'wireless mouse' : 'wirelsss mouse',
    source_query_text: 'wireless mouse',
    categories: ['zero_result'],
    reason_code: construction === 'identity' ? 'identity_zero_result' : 'variant_zero_result',
    source_returned_at_k: 0,
    variant_returned_at_k: 0,
    overlap_at_k: 0,
    source_top_hits: [],
    variant_top_hits: [],
    behavior_context_sha256: sha('c'),
    intent_annotation_id: intentAnnotationId
});

const validBehaviorView = () => ({
    schema_version: 'human-oracle-behavior-view-v1',
    oracle_batch_id: batchId,
    diagnostic_id: diagnosticId,
    unit_id: unitId(1),
    source_case_id: caseId(1),
    candidates: [
        emptyHitCandidate(1, 'identity', null),
        emptyHitCandidate(2, 'adjacent_transposition', intentId(2)),
        emptyHitCandidate(3, 'token_order_reversal', intentId(3))
    ],
    source_reference_scope: 'identity_only_not_variant_label',
    synthetic_product_relevance_labels_included: false,
    cache_allowed: false
});

const validSeal = () => ({
    schema_version: 'human-oracle-seal-api-summary-v1',
    oracle_id: 'human-oracle-dddddddddddd',
    oracle_batch_id: batchId,
    diagnostic_id: diagnosticId,
    synthetic_intent_annotation_count: 30,
    behavior_annotation_count: 40,
    product_relevance_labels_created: 0,
    formal_evaluation_allowed: false,
    quality_conclusion_allowed: false,
    root_cause_claimed: false,
    strategy_write_count: 0,
    limitations: [
        'single_owner_no_inter_annotator_agreement',
        'selection_conditioned_development_set',
        'synthetic_product_relevance_remains_unjudged',
        'prior_exposure_not_controlled',
        'diagnostic_judgment_is_not_root_cause'
    ]
});

const jsonResponse = (status, body) => ({ ok: status >= 200 && status < 300, status, json: async () => body });

test('creates the exact 40-case / 20-cluster Oracle census and fetches status', async () => {
    const batch = validBatch();
    const review = validReview();
    assert.equal(validateHumanOracleBatch(batch, diagnosticId, querySetId), batch);
    assert.equal(validateHumanOracleReviewState(review, batchId), review);
    const calls = [];
    const fetchImpl = async (url, options) => {
        calls.push({ url, options });
        return jsonResponse(200, calls.length === 1 ? batch : review);
    };
    await fetchHumanOracleBatch(fetchImpl, '/search-eval-api', diagnosticId, querySetId);
    await fetchHumanOracleStatus(fetchImpl, '/search-eval-api', batchId);
    assert.deepEqual(calls.map((item) => item.url), [
        '/search-eval-api/agent/human-oracle/batches/create',
        '/search-eval-api/agent/human-oracle/batches/status'
    ]);
    assert.deepEqual(JSON.parse(calls[0].options.body), { diagnostic_id: diagnosticId, query_set_id: querySetId });
    assert.deepEqual(JSON.parse(calls[1].options.body), { oracle_batch_id: batchId });
});

test('Oracle batch and projected CAS state reject extras and inconsistent counts', () => {
    const batch = validBatch();
    batch.raw_query_text = 'forbidden';
    assert.throws(() => validateHumanOracleBatch(batch, diagnosticId, querySetId), ToolSummaryContractError);
    const review = validReview();
    review.projection.active_intent_annotation_count = 1;
    assert.throws(() => validateHumanOracleReviewState(review, batchId), ToolSummaryContractError);
    const stale = validReview({ intents: 1 });
    stale.cases.find((item) => item.active_intent_annotation_id).expected_previous_intent_annotation_id = null;
    assert.throws(() => validateHumanOracleReviewState(stale, batchId), ToolSummaryContractError);
});

test('Intent view withholds results and submit binds construction, reason, context and CAS', async () => {
    const view = validIntentView();
    assert.equal(validateHumanOracleIntentView(view, batchId, unitId(1)), view);
    assert.equal(intentReasonForConstruction('adjacent_transposition', 'equivalent'), 'obvious_typo_same_intent');
    assert.equal(intentReasonForConstruction('token_order_reversal', 'not_equivalent'), 'meaning_changed');
    const submission = {
        oracle_batch_id: batchId,
        unit_id: unitId(1),
        case_id: caseId(2),
        presentation_context_sha256: sha('a'),
        judgment: 'equivalent',
        reason_code: 'obvious_typo_same_intent',
        client_action_id: clientActionId,
        expected_previous_annotation_id: null
    };
    const response = {
        schema_version: 'human-oracle-intent-api-summary-v1',
        intent_annotation_id: intentId(2),
        oracle_batch_id: batchId,
        unit_id: unitId(1),
        case_id: caseId(2),
        judgment: 'equivalent',
        reason_code: 'obvious_typo_same_intent',
        supersedes_annotation_id: null,
        result_evidence_was_withheld: true,
        product_relevance_labels_created: 0
    };
    const calls = [];
    const fetchImpl = async (url, options) => {
        calls.push({ url, options });
        return jsonResponse(200, calls.length === 1 ? view : response);
    };
    await fetchHumanOracleIntentView(fetchImpl, '/search-eval-api', batchId, unitId(1));
    await submitHumanOracleIntent(fetchImpl, '/search-eval-api', submission, 'adjacent_transposition');
    assert.equal(calls[0].url, '/search-eval-api/agent/human-oracle/intents/view');
    assert.equal(calls[1].url, '/search-eval-api/agent/human-oracle/intents/submit');
    assert.deepEqual(JSON.parse(calls[1].options.body), submission);
    assert.doesNotMatch(calls[1].options.body, /actor|query_text|product/);
});

test('Intent contract rejects result leakage and reason/construction drift', async () => {
    const leaked = validIntentView();
    leaked.candidates[1].results = [];
    assert.throws(() => validateHumanOracleIntentView(leaked, batchId, unitId(1)), ToolSummaryContractError);
    const submission = {
        oracle_batch_id: batchId,
        unit_id: unitId(1),
        case_id: caseId(2),
        presentation_context_sha256: sha('a'),
        judgment: 'equivalent',
        reason_code: 'same_product_intent',
        client_action_id: clientActionId,
        expected_previous_annotation_id: null
    };
    await assert.rejects(
        submitHumanOracleIntent(async () => jsonResponse(500, {}), '/search-eval-api', submission, 'adjacent_transposition'),
        (error) => error instanceof ToolSummaryContractError
    );
});

test('Behavior view verifies bounded Top3 shape and behavior reasons follow active intent', async () => {
    const view = validBehaviorView();
    assert.equal(validateHumanOracleBehaviorView(view, batchId, unitId(1)), view);
    assert.equal(
        behaviorReasonForIntent('adjacent_transposition', 'equivalent', 'confirmed_issue'),
        'equivalent_intent_should_preserve_behavior'
    );
    assert.equal(
        behaviorReasonForIntent('adjacent_transposition', 'not_equivalent', 'acceptable'),
        'intent_not_equivalent'
    );
    assert.equal(behaviorReasonForIntent('identity', null, 'uncertain'), 'catalog_coverage_unknown');
    assert.throws(
        () => behaviorReasonForIntent('adjacent_transposition', 'not_equivalent', 'confirmed_issue'),
        ToolSummaryContractError
    );
    assert.throws(
        () => behaviorReasonForIntent('token_order_reversal', 'uncertain', 'acceptable'),
        ToolSummaryContractError
    );
    assert.equal(
        behaviorReasonForIntent('token_order_reversal', 'uncertain', 'uncertain'),
        'insufficient_domain_knowledge'
    );
    const submission = {
        oracle_batch_id: batchId,
        unit_id: unitId(1),
        case_id: caseId(2),
        presentation_context_sha256: sha('c'),
        judgment: 'confirmed_issue',
        reason_code: 'equivalent_intent_should_preserve_behavior',
        intent_annotation_id: intentId(2),
        client_action_id: clientActionId,
        expected_previous_annotation_id: null
    };
    const response = {
        schema_version: 'human-oracle-behavior-api-summary-v1',
        behavior_annotation_id: behaviorId(2),
        oracle_batch_id: batchId,
        unit_id: unitId(1),
        case_id: caseId(2),
        judgment: 'confirmed_issue',
        reason_code: 'equivalent_intent_should_preserve_behavior',
        intent_annotation_id: intentId(2),
        supersedes_annotation_id: null,
        product_relevance_labels_created: 0,
        root_cause_claimed: false
    };
    const calls = [];
    const fetchImpl = async (url, options) => {
        calls.push({ url, options });
        return jsonResponse(200, calls.length === 1 ? view : response);
    };
    await fetchHumanOracleBehaviorView(fetchImpl, '/search-eval-api', batchId, unitId(1));
    await submitHumanOracleBehavior(
        fetchImpl, '/search-eval-api', submission, 'adjacent_transposition', 'equivalent'
    );
    assert.equal(calls[0].url, '/search-eval-api/agent/human-oracle/behaviors/view');
    assert.equal(calls[1].url, '/search-eval-api/agent/human-oracle/behaviors/submit');
    assert.deepEqual(JSON.parse(calls[1].options.body), submission);
    assert.doesNotMatch(calls[1].options.body, /actor|query_text|source_top_hits|variant_top_hits/);
});

test('Behavior contract rejects product/result uploads and invalid intent linkage', async () => {
    const view = validBehaviorView();
    view.candidates[1].source_top_hits = [
        { locale: 'us', product_id: 'B0001', rank: 2, title: 'Mouse' }
    ];
    view.candidates[1].source_returned_at_k = 1;
    assert.throws(() => validateHumanOracleBehaviorView(view, batchId, unitId(1)), ToolSummaryContractError);

    const truncatedTwo = validBehaviorView();
    truncatedTwo.candidates[1].source_returned_at_k = 2;
    truncatedTwo.candidates[1].source_top_hits = [
        { locale: 'us', product_id: 'B0001', rank: 1, title: 'Mouse one' }
    ];
    assert.throws(
        () => validateHumanOracleBehaviorView(truncatedTwo, batchId, unitId(1)),
        ToolSummaryContractError
    );

    const truncatedTopThree = validBehaviorView();
    truncatedTopThree.candidates[1].variant_returned_at_k = 10;
    truncatedTopThree.candidates[1].variant_top_hits = [
        { locale: 'us', product_id: 'B0002', rank: 1, title: 'Mouse two' },
        { locale: 'us', product_id: 'B0003', rank: 2, title: 'Mouse three' }
    ];
    assert.throws(
        () => validateHumanOracleBehaviorView(truncatedTopThree, batchId, unitId(1)),
        ToolSummaryContractError
    );

    const submission = {
        oracle_batch_id: batchId,
        unit_id: unitId(1),
        case_id: caseId(1),
        presentation_context_sha256: sha('c'),
        judgment: 'acceptable',
        reason_code: 'behavior_is_expected',
        intent_annotation_id: intentId(1),
        client_action_id: clientActionId,
        expected_previous_annotation_id: null,
        source_top_hits: []
    };
    await assert.rejects(
        submitHumanOracleBehavior(async () => jsonResponse(500, {}), '/search-eval-api', submission, 'identity', null),
        (error) => error instanceof ToolSummaryContractError
    );
});

test('seal accepts only a complete locked diagnostic artifact', async () => {
    const seal = validSeal();
    assert.equal(validateHumanOracleSeal(seal, batchId), seal);
    const calls = [];
    const fetchImpl = async (url, options) => {
        calls.push({ url, options });
        return jsonResponse(200, seal);
    };
    await sealHumanOracleBatch(fetchImpl, '/search-eval-api', batchId, clientActionId);
    assert.equal(calls[0].url, '/search-eval-api/agent/human-oracle/batches/seal');
    assert.deepEqual(JSON.parse(calls[0].options.body), {
        oracle_batch_id: batchId,
        client_action_id: clientActionId
    });
    const unsafe = validSeal();
    unsafe.strategy_write_count = 1;
    assert.throws(() => validateHumanOracleSeal(unsafe, batchId), ToolSummaryContractError);
});

test('all Human Oracle POSTs use same-origin JSON and never read failed response bodies', async () => {
    let jsonReads = 0;
    const fetchImpl = async (_url, options) => {
        assert.equal(options.credentials, 'same-origin');
        assert.equal(options.headers['Content-Type'], 'application/json');
        return {
            ok: false,
            status: 401,
            json: async () => { jsonReads += 1; return { query_text: 'forbidden' }; }
        };
    };
    await assert.rejects(fetchHumanOracleBatch(fetchImpl, '/search-eval-api', diagnosticId, querySetId));
    assert.equal(jsonReads, 0);
});
