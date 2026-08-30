const assert = require('node:assert/strict');
const test = require('node:test');

const { ALLOWED_MODULES, createDiagnostics } = require('../js/search-ui-debug.js');

const storage = (values) => ({ getItem: (key) => values[key] ?? null });

test('release diagnostics are module-filtered, bounded and redact secrets', () => {
    const writes = [];
    const diagnostics = createDiagnostics({
        storage: storage({
            'shaw.debug.search-release': '1',
            'shaw.debug.search-release.modules': 'owner-decision-ui'
        }),
        consoleImpl: { debug: (...args) => writes.push(args), warn: (...args) => writes.push(args) },
        now: () => '2026-08-30T00:00:00.000Z',
        maxEntries: 2
    });
    diagnostics.log('serving-readiness-ui', 'debug', 'filtered', { ready: true });
    diagnostics.log('owner-decision-ui', 'debug', 'one', {
        proposalId: 'retrieval-proposal-abcdef123456',
        password: 'must-not-appear',
        nested: { Authorization: 'Basic dGVzdDpzZWNyZXQ=', note: 'token=must-not-appear' }
    });
    assert.doesNotMatch(JSON.stringify(writes[0]), /must-not-appear|dGVzdDpzZWNyZXQ=/);
    assert.match(JSON.stringify(writes[0]), /\[redacted\]/);
    diagnostics.log('owner-decision-ui', 'debug', 'two', { lifecycle: 'active' });
    diagnostics.log('owner-decision-ui', 'debug', 'three', { lifecycle: 'rolled_back' });
    assert.equal(writes.length, 3);
    assert.equal(diagnostics.getEntries().length, 2);
    const exported = diagnostics.exportLogs();
    assert.doesNotMatch(exported, /must-not-appear|dGVzdDpzZWNyZXQ=/);
    assert.match(exported, /rolled_back/);
});

test('verbose is disabled by default while safe warnings remain independently configurable', () => {
    const writes = [];
    const diagnostics = createDiagnostics({
        storage: storage({}),
        consoleImpl: { debug: (...args) => writes.push(args), warn: (...args) => writes.push(args) }
    });
    diagnostics.log('owner-auth-ui', 'debug', 'hidden');
    diagnostics.log('owner-auth-ui', 'warn', 'shown', { errorCode: 'credentials_rejected' });
    assert.equal(writes.length, 1);
    assert.ok(ALLOWED_MODULES.includes('search-comparison-ui'));

    const muted = [];
    const mutedDiagnostics = createDiagnostics({
        storage: storage({ 'shaw.debug.search-release.errors': '0' }),
        consoleImpl: { warn: (...args) => muted.push(args) }
    });
    mutedDiagnostics.log('owner-auth-ui', 'warn', 'hidden');
    assert.equal(muted.length, 0);
});
