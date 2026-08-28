(function initSearchAgentContract(root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.SearchAgentContract = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
    'use strict';

    const RUN_ID = /^retrieval-[0-9a-f]{12}$/;
    const COMPARISON_ID = /^retrieval-comparison-[0-9a-f]{12}$/;
    const DIAGNOSIS_ID = /^stage-diagnosis-[0-9a-f]{12}$/;
    const REQUIRED_GATES = new Set([
        'unique_relevant_contribution',
        'union_coverage_improvement',
        'fusion_recall_at_10_floor',
        'fusion_ndcg_at_10_floor',
        'fusion_mrr_at_10_floor',
        'coarse_recall_at_10_floor',
        'coarse_ndcg_at_10_floor',
        'coarse_mrr_at_10_floor',
        'worst_query_coarse_ndcg_delta_floor',
        'regressed_query_rate_ceiling',
        'worst_query_fusion_ndcg_delta_floor',
        'fusion_regressed_query_rate_ceiling'
    ]);
    const GATE_POLICIES = {
        unique_relevant_contribution: ['>', 0],
        union_coverage_improvement: ['>', 0],
        fusion_recall_at_10_floor: ['>=', 0],
        fusion_ndcg_at_10_floor: ['>=', 0],
        fusion_mrr_at_10_floor: ['>=', 0],
        coarse_recall_at_10_floor: ['>=', 0],
        coarse_ndcg_at_10_floor: ['>=', 0],
        coarse_mrr_at_10_floor: ['>=', 0],
        worst_query_coarse_ndcg_delta_floor: ['>=', -0.02],
        regressed_query_rate_ceiling: ['<=', 0.1],
        worst_query_fusion_ndcg_delta_floor: ['>=', -0.02],
        fusion_regressed_query_rate_ceiling: ['<=', 0.1]
    };
    const EXPECTED_VARIANTS = new Map([
        ['title-exact-multifield-v1', 'uniform'],
        ['title-exact-multifield-weighted-v1', {
            'exact-title-recall-v1': 1,
            'multi-field-bm25-recall-v1': 0.1,
            'title-bm25-recall-v1': 1
        }],
        ['title-exact-multifield-weighted-aggressive-v1', {
            'exact-title-recall-v1': 0.5,
            'multi-field-bm25-recall-v1': 0.25,
            'title-bm25-recall-v1': 1
        }]
    ]);

    class AnalysisContractError extends Error {
        constructor(message = 'invalid_analysis_response') {
            super(message);
            this.name = 'AnalysisContractError';
            this.code = 'invalid_analysis_response';
        }
    }

    class AnalysisHttpError extends Error {
        constructor(status) {
            super(`http_${status}`);
            this.name = 'AnalysisHttpError';
            this.code = `http_${status}`;
            this.status = status;
        }
    }

    const fail = () => { throw new AnalysisContractError(); };
    const object = (value) => value && typeof value === 'object' && !Array.isArray(value) ? value : fail();
    const array = (value) => Array.isArray(value) ? value : fail();
    const text = (value) => typeof value === 'string' && value.trim() ? value : fail();
    const finite = (value) => typeof value === 'number' && Number.isFinite(value) ? value : fail();
    const unit = (value) => {
        const number = finite(value);
        if (number < 0 || number > 1) fail();
        return number;
    };
    const identifier = (value, pattern) => pattern.test(text(value)) ? value : fail();

    const validateDelta = (value) => {
        const item = object(value);
        const baseline = unit(item.baseline);
        const candidate = unit(item.candidate);
        const delta = finite(item.delta);
        if (Math.abs((candidate - baseline) - delta) > 1e-10) fail();
        return item;
    };

    const validateResult = (value) => {
        const item = object(value);
        if (!Number.isInteger(item.rank) || item.rank < 1) fail();
        text(item.locale);
        text(item.product_id);
        text(item.product_title);
        if (!['E', 'S', 'C', 'I'].includes(item.label)) fail();
        return item;
    };

    const validateResults = (value) => {
        const results = array(value);
        if (results.length > 5) fail();
        const keys = new Set();
        results.forEach((resultValue, index) => {
            const result = validateResult(resultValue);
            if (result.rank !== index + 1) fail();
            const key = `${result.locale}\u0000${result.product_id}`;
            if (keys.has(key)) fail();
            keys.add(key);
        });
        return results;
    };

    const validateWeights = (value, variant) => {
        const expected = EXPECTED_VARIANTS.get(variant);
        if (!expected) fail();
        if (expected === 'uniform') {
            if (value !== 'uniform') fail();
            return value;
        }
        const weights = object(value);
        const keys = Object.keys(weights).sort();
        const expectedKeys = Object.keys(expected).sort();
        if (keys.length !== expectedKeys.length || keys.some((key, index) => key !== expectedKeys[index])) fail();
        for (const [key, expectedWeight] of Object.entries(expected)) {
            if (Math.abs(finite(weights[key]) - expectedWeight) > 1e-12) fail();
        }
        return weights;
    };

    const validateDiagnosis = (value, expectedId) => {
        const diagnosis = object(value);
        if (identifier(diagnosis.diagnosis_id, DIAGNOSIS_ID) !== expectedId) fail();
        for (const findingValue of array(diagnosis.findings)) {
            const finding = object(findingValue);
            text(finding.subtype);
            if (!Number.isInteger(finding.stage_dropped_relevant_count) || finding.stage_dropped_relevant_count < 0) fail();
            unit(finding.impact);
            if (!['relevant_item_micro_rate', 'mean_query_metric_delta'].includes(finding.impact_aggregation)) fail();
        }
        return diagnosis;
    };

    const validateAnalysis = (value) => {
        const analysis = object(value);
        if (analysis.schema_version !== 'retrieval-stage-analysis-response-v1') fail();
        if (analysis.profile !== 'smoke') fail();
        const baselineRunId = identifier(analysis.retrieval_run_id, RUN_ID);
        const candidateRunId = identifier(analysis.candidate_run_id, RUN_ID);
        const comparisonId = identifier(analysis.comparison_id, COMPARISON_ID);
        const diagnosisId = identifier(analysis.diagnosis_id, DIAGNOSIS_ID);
        const candidateDiagnosisId = identifier(analysis.candidate_diagnosis_id, DIAGNOSIS_ID);
        validateDiagnosis(analysis.diagnosis, diagnosisId);
        validateDiagnosis(analysis.candidate_diagnosis, candidateDiagnosisId);

        const comparison = object(analysis.comparison);
        if (comparison.schema_version !== 'query-scoped-retrieval-comparison-v1') fail();
        if (comparison.baseline_run_id !== baselineRunId || comparison.candidate_run_id !== candidateRunId || comparison.comparison_id !== comparisonId) fail();
        const aggregate = object(comparison.aggregate_deltas);
        validateDelta(object(aggregate.recall_union).judged_relevant_coverage);
        for (const stageName of ['fusion', 'coarse_rank']) {
            const stage = object(aggregate[stageName]);
            for (const metric of ['judged_recall@5', 'judged_recall@10', 'mrr@10', 'ndcg@10']) validateDelta(stage[metric]);
        }

        const candidateStrategy = object(comparison.candidate_strategy);
        if (!Number.isInteger(candidateStrategy.unique_relevant_contribution) || candidateStrategy.unique_relevant_contribution < 0) fail();
        const selectedVariant = text(candidateStrategy.pipeline_variant);
        validateWeights(candidateStrategy.fusion_weights, selectedVariant);

        const transitions = object(comparison.candidate_stage_transitions);
        for (const metric of ['judged_recall@10', 'mrr@10', 'ndcg@10']) {
            const transition = object(transitions[metric]);
            const fusion = unit(transition.fusion);
            const coarse = unit(transition.coarse_rank);
            if (Math.abs((coarse - fusion) - finite(transition.delta)) > 1e-10) fail();
        }

        const gateResult = object(comparison.gate_result);
        if (typeof gateResult.passed !== 'boolean') fail();
        const checks = array(gateResult.checks);
        const gateNames = new Set();
        const checkByName = new Map();
        for (const checkValue of checks) {
            const check = object(checkValue);
            const name = text(check.name);
            if (gateNames.has(name) || !REQUIRED_GATES.has(name)) fail();
            gateNames.add(name);
            if (typeof check.passed !== 'boolean') fail();
            if (!['>', '>=', '<='].includes(check.comparator)) fail();
            const observed = finite(check.observed);
            const threshold = finite(check.threshold);
            const [expectedComparator, expectedThreshold] = GATE_POLICIES[name];
            if (check.comparator !== expectedComparator || Math.abs(threshold - expectedThreshold) > 1e-12) fail();
            const calculated = check.comparator === '>'
                ? observed > threshold
                : check.comparator === '>='
                    ? observed >= threshold
                    : observed <= threshold;
            if (check.passed !== calculated) fail();
            checkByName.set(name, check);
        }
        if (gateNames.size !== REQUIRED_GATES.size) fail();
        if (gateResult.passed !== checks.every((check) => check.passed)) fail();

        const queries = array(comparison.per_query);
        if (!queries.length) fail();
        const queryKeys = new Set();
        for (const queryValue of queries) {
            const query = object(queryValue);
            if (!Number.isInteger(query.query_id) || query.query_id < 1) fail();
            const locale = text(query.locale);
            const queryKey = `${locale}\u0000${query.query_id}`;
            if (queryKeys.has(queryKey)) fail();
            queryKeys.add(queryKey);
            text(query.query_text);
            finite(query['coarse_ndcg@10_delta']);
            finite(query['fusion_ndcg@10_delta']);
            finite(query.union_coverage_delta);
            validateResults(query.baseline_top_results);
            validateResults(query.candidate_top_results);
            for (const recoveredValue of array(query.recovered_relevant)) {
                const recovered = object(recoveredValue);
                text(recovered.product_id);
                text(recovered.product_title);
                text(recovered.locale);
                if (!['E', 'S', 'C'].includes(recovered.label)) fail();
                if (!['fusion', 'coarse_rank', 'retained'].includes(recovered.candidate_first_loss_stage)) fail();
                if (recovered.candidate_multi_field_rank !== null && (!Number.isInteger(recovered.candidate_multi_field_rank) || recovered.candidate_multi_field_rank < 1)) fail();
            }
        }
        const gateObservations = {
            unique_relevant_contribution: candidateStrategy.unique_relevant_contribution,
            union_coverage_improvement: aggregate.recall_union.judged_relevant_coverage.delta,
            fusion_recall_at_10_floor: aggregate.fusion['judged_recall@10'].delta,
            fusion_ndcg_at_10_floor: aggregate.fusion['ndcg@10'].delta,
            fusion_mrr_at_10_floor: aggregate.fusion['mrr@10'].delta,
            coarse_recall_at_10_floor: aggregate.coarse_rank['judged_recall@10'].delta,
            coarse_ndcg_at_10_floor: aggregate.coarse_rank['ndcg@10'].delta,
            coarse_mrr_at_10_floor: aggregate.coarse_rank['mrr@10'].delta,
            worst_query_coarse_ndcg_delta_floor: Math.min(...queries.map((query) => query['coarse_ndcg@10_delta'])),
            regressed_query_rate_ceiling: queries.filter((query) => query['coarse_ndcg@10_delta'] < -1e-12).length / queries.length,
            worst_query_fusion_ndcg_delta_floor: Math.min(...queries.map((query) => query['fusion_ndcg@10_delta'])),
            fusion_regressed_query_rate_ceiling: queries.filter((query) => query['fusion_ndcg@10_delta'] < -1e-12).length / queries.length
        };
        for (const [name, expectedObserved] of Object.entries(gateObservations)) {
            if (Math.abs(checkByName.get(name).observed - expectedObserved) > 1e-10) fail();
        }

        const experiments = array(analysis.experiments);
        if (experiments.length !== EXPECTED_VARIANTS.size) fail();
        let selectedExperiment = null;
        const experimentRunIds = new Set();
        const experimentComparisonIds = new Set();
        const experimentVariants = new Set();
        for (const experimentValue of experiments) {
            const experiment = object(experimentValue);
            const experimentRunId = identifier(experiment.candidate_run_id, RUN_ID);
            const experimentComparisonId = identifier(experiment.comparison_id, COMPARISON_ID);
            const experimentVariant = text(experiment.pipeline_variant);
            if (experimentRunIds.has(experimentRunId) || experimentComparisonIds.has(experimentComparisonId) || experimentVariants.has(experimentVariant)) fail();
            experimentRunIds.add(experimentRunId);
            experimentComparisonIds.add(experimentComparisonId);
            experimentVariants.add(experimentVariant);
            if (typeof experiment.gate_passed !== 'boolean') fail();
            const failedGates = array(experiment.failed_gates);
            const failedNames = new Set();
            failedGates.forEach((nameValue) => {
                const name = text(nameValue);
                if (!REQUIRED_GATES.has(name) || failedNames.has(name)) fail();
                failedNames.add(name);
            });
            if (experiment.gate_passed !== (failedGates.length === 0)) fail();
            finite(experiment.fusion_mrr_at_10_delta);
            finite(experiment.fusion_ndcg_at_10_delta);
            finite(experiment.worst_fusion_query_ndcg_at_10_delta);
            validateWeights(experiment.fusion_weights, experimentVariant);
            if (experimentRunId === candidateRunId) selectedExperiment = experiment;
        }
        if (experimentVariants.size !== EXPECTED_VARIANTS.size || [...EXPECTED_VARIANTS.keys()].some((variant) => !experimentVariants.has(variant))) fail();
        if (!selectedExperiment || selectedExperiment.gate_passed !== gateResult.passed) fail();
        if (selectedExperiment.comparison_id !== comparisonId || selectedExperiment.pipeline_variant !== selectedVariant) fail();
        if (Math.abs(selectedExperiment.fusion_mrr_at_10_delta - aggregate.fusion['mrr@10'].delta) > 1e-10) fail();
        if (Math.abs(selectedExperiment.fusion_ndcg_at_10_delta - aggregate.fusion['ndcg@10'].delta) > 1e-10) fail();
        const worstFusion = Math.min(...queries.map((query) => query['fusion_ndcg@10_delta']));
        if (Math.abs(selectedExperiment.worst_fusion_query_ndcg_at_10_delta - worstFusion) > 1e-10) fail();
        const expectedStatus = gateResult.passed ? 'proposal_ready' : 'no_safe_improvement';
        if (analysis.status !== expectedStatus) fail();
        const proposal = object(analysis.proposal);
        if (proposal.decision !== (gateResult.passed ? 'request_owner_review' : 'reject_candidate')) fail();
        text(proposal.candidate_strategy_id);
        text(proposal.next_action);
        text(proposal.reason);
        return analysis;
    };

    const postJson = (fetchImpl, url) => fetchImpl(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: 'smoke' })
    });

    const fetchAnalysis = async (fetchImpl, apiRoot) => {
        const response = await postJson(fetchImpl, `${apiRoot}/agent/retrieval/analyze`);
        if (response.status === 404) {
            const fallback = await postJson(fetchImpl, `${apiRoot}/agent/strategy/propose`);
            if (!fallback.ok) throw new AnalysisHttpError(fallback.status);
            return { kind: 'legacy', proposal: await fallback.json() };
        }
        if (!response.ok) throw new AnalysisHttpError(response.status);
        return { kind: 'stage', analysis: validateAnalysis(await response.json()) };
    };

    return { AnalysisContractError, AnalysisHttpError, fetchAnalysis, validateAnalysis };
}));
