const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('public Agent analysis shows immutable candidate lifecycle without loading Owner auth or write APIs', () => {
    const page = read('search-agent.html');
    const script = read('js/search-agent.js');
    const analysisContract = read('js/search-agent-contract.js');
    for (const id of [
        'agentReleaseLifecycleState', 'agentReleaseLifecycleTrack', 'agentReleaseProposalId',
        'agentReleaseProposalRevision', 'releaseReviewLink'
    ]) assert.match(page, new RegExp(`id="${id}"`));
    for (const state of [
        'rejected_by_gate', 'pending_owner_review', 'rejected', 'approved_for_validation',
        'validating', 'validation_failed', 'staged', 'canary', 'active', 'rolled_back'
    ]) assert.match(page, new RegExp(`data-lifecycle="${state}"`));
    assert.doesNotMatch(page, /js\/search-agent-auth\.js|js\/search-release-contract\.js/);
    assert.doesNotMatch(page, /id="ownerApproveButton"|id="ownerRejectButton"/);
    assert.match(script, /renderReleaseLifecycle\(analysis\.proposal\)/);
    assert.match(script, /search-owner\.html\?\$\{new URLSearchParams/);
    assert.doesNotMatch(script, /release\/decision|release\/rollback|X-Search-Approval-Token/);
    assert.match(analysisContract, /proposal\.lifecycle !== 'pending_owner_review'/);
    assert.match(analysisContract, /proposal\.lifecycle !== 'rejected_by_gate'/);
});

test('Owner page uses in-memory auth, short-lived session, decision and rollback contracts', () => {
    const page = read('search-owner.html');
    const script = read('js/search-owner.js');
    const contract = read('js/search-release-contract.js');
    assert.match(page, /同意并自动发布/);
    assert.match(page, /id="ownerRejectButton"[^>]*>拒绝</);
    assert.match(page, /确认一键回滚/);
    assert.match(page, /js\/search-agent-auth\.js/);
    assert.match(page, /js\/search-release-contract\.js/);
    assert.match(script, /authApi\.createSession/);
    assert.match(script, /approvalSession\.csrf_token/);
    assert.match(script, /window\.crypto\?\.randomUUID/);
    assert.match(contract, /X-Search-Approval-Token/);
    assert.match(contract, /releaseSession: '\/agent\/retrieval\/release\/session'/);
    assert.match(contract, /releaseDecision: '\/agent\/retrieval\/release\/decision'/);
    assert.match(contract, /releaseRollback: '\/agent\/retrieval\/release\/rollback'/);
    assert.doesNotMatch(script, /localStorage\.(?:setItem|getItem)/);
    assert.doesNotMatch(`${page}\n${script}`, /Basic\s+[A-Za-z0-9+/=]{12,}/);
});

test('strategy platform separates approved-not-active, current active and rolled-back releases', () => {
    const page = read('search-strategy.html');
    const script = read('js/search-strategy.js');
    for (const id of [
        'activeServingState', 'activeServingStrategy', 'activeServingRevision', 'activeServingIndex',
        'activeServingHealth', 'activeServingRollout', 'historyReleaseCount',
        'historyApprovedNotActiveCount', 'historyRolledBackCount', 'retrievalReleaseList'
    ]) assert.match(page, new RegExp(`id="${id}"`));
    assert.match(script, /retrieval_releases/);
    assert.match(script, /active_retrieval_release/);
    assert.match(script, /已批准未上线/);
    assert.match(script, /当前生效/);
    assert.match(script, /已回滚/);
    assert.match(script, /previous_revision/);
    assert.match(script, /Owner 一键回滚/);
    assert.match(script, /strategy_revision/);
    assert.match(script, /index_id/);
    assert.match(script, /health/);
    assert.match(script, /rollout/);
});

test('search comparison enables active lane only after health readiness and submits one Query to both lanes', () => {
    const page = read('search-eval.html');
    const script = read('js/search-eval.js');
    const contract = read('js/search-release-contract.js');
    for (const id of [
        'comparisonReadiness', 'activeSearchForm', 'activeSearchButton', 'activeServingBadge',
        'baselineExecution', 'activeExecution', 'activeMeta', 'activeState', 'activeResults'
    ]) assert.match(page, new RegExp(`id="${id}"`));
    assert.match(page, /id="optimizedQuery"[^>]*disabled/);
    assert.match(script, /await loadReadiness\(\)/);
    assert.match(script, /readiness\.ready/);
    assert.match(script, /Promise\.all\(\[baselinePromise, activePromise\]\)/);
    assert.match(script, /activeInput\.value = baselineInput\.value/);
    assert.match(script, /baselineInput\.value = activeInput\.value/);
    assert.match(contract, /activeSearch: '\/catalog\/search\/active'/);
    assert.match(script, /strategy_revision/);
    assert.match(script, /normalizeSearchResponse/);
});

test('independent UI diagnostics are documented and exclude secret-bearing fields', () => {
    const diagnostics = read('js/search-ui-debug.js');
    const docs = read('docs/SEARCH_RELEASE_UI_DEBUG.md');
    assert.match(diagnostics, /maxEntries = 200/);
    assert.match(diagnostics, /SENSITIVE_FIELD/);
    assert.match(diagnostics, /\[redacted\]/);
    assert.match(docs, /owner-auth-ui/);
    assert.match(docs, /search-comparison-ui/);
    assert.match(docs, /不记录 Query、商品内容、密码、Authorization/);
    assert.match(docs, /生产环境默认关闭/);
});
