const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');

const modulePath = path.resolve(__dirname, '../js/search-agent-auth.js');
delete globalThis.SearchAgentAuth;
delete require.cache[modulePath];
require(modulePath);

const { OwnerAuthError, createSession, encodeBasicAuthorization } = globalThis.SearchAgentAuth;
const baseUrl = 'https://portfolio.example/search-agent.html';
const validationUrl = '/search-agent-auth-check.json';
const protectedUrl = 'https://portfolio.example/search-eval-api/agent/eval/run';
const encodeBase64 = (value) => Buffer.from(value, 'latin1').toString('base64');
const validationPayload = {
    schema_version: 'search-agent-auth-check-v1',
    authenticated: true
};

const response = (status, payload = validationPayload) => ({
    status,
    ok: status >= 200 && status < 300,
    json: async () => payload
});

const sessionOptions = (fetchImpl, onEvent = () => {}) => ({
    fetchImpl,
    validationUrl,
    baseUrl,
    allowedRequestPaths: [protectedUrl],
    encodeBase64,
    onEvent
});

test('credentials are validated in memory and attached only to an allowlisted Owner route', async () => {
    const calls = [];
    const fetchImpl = async (url, init) => {
        calls.push({ url: String(url), init });
        return response(200);
    };
    const session = createSession(sessionOptions(fetchImpl));

    await session.authenticate('owner', 'test-only-secret');
    assert.equal(session.isAuthenticated(), true);
    await session.fetch(protectedUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}'
    });

    assert.equal(calls.length, 2);
    assert.equal(calls[0].url, 'https://portfolio.example/search-agent-auth-check.json');
    assert.equal(calls[0].init.credentials, 'omit');
    assert.equal(calls[0].init.cache, 'no-store');
    assert.equal(calls[1].init.credentials, 'omit');
    assert.equal(calls[1].init.cache, 'no-store');
    assert.equal(calls[1].init.headers.get('Content-Type'), 'application/json');
    assert.equal(
        calls[1].init.headers.get('Authorization'),
        encodeBasicAuthorization('owner', 'test-only-secret', encodeBase64)
    );
    assert.equal(Object.hasOwn(session, 'authorization'), false);
});

test('cross-origin, unlisted and query-bearing destinations fail closed before fetch', async () => {
    let callCount = 0;
    const fetchImpl = async () => {
        callCount += 1;
        return response(200);
    };
    const session = createSession(sessionOptions(fetchImpl));
    await session.authenticate('owner', 'test-only-secret');

    for (const url of [
        'https://attacker.example/search-eval-api/agent/eval/run',
        'https://portfolio.example/search-eval-api/catalog/search',
        `${protectedUrl}?redirect=https://attacker.example`
    ]) {
        await assert.rejects(
            session.fetch(url, { method: 'POST' }),
            (error) => error instanceof OwnerAuthError
                && error.code === 'cross_origin_auth_blocked'
        );
    }
    assert.equal(callCount, 1);
});

test('session construction rejects cross-origin allowlists and non-local cleartext origins', () => {
    assert.throws(
        () => createSession({
            ...sessionOptions(async () => response(200)),
            allowedRequestPaths: ['https://api.example/agent/eval/run']
        }),
        (error) => error.code === 'invalid_auth_allowlist'
    );
    assert.throws(
        () => createSession({
            ...sessionOptions(async () => response(200)),
            baseUrl: 'http://portfolio.example/search-agent.html'
        }),
        (error) => error.code === 'insecure_auth_origin'
    );
});

test('rejected validation never authenticates and records only safe error metadata', async () => {
    const events = [];
    const session = createSession(sessionOptions(
        async () => response(403),
        (event, context) => events.push({ event, context })
    ));

    await assert.rejects(
        session.authenticate('owner', 'test-only-secret'),
        (error) => error.code === 'credentials_rejected' && error.status === 403
    );
    assert.equal(session.isAuthenticated(), false);
    assert.doesNotMatch(JSON.stringify(events), /owner|test-only-secret|authorization/i);
    assert.match(JSON.stringify(events), /credentials_rejected/);
});

test('an Owner API rejection clears the session before another request can run', async () => {
    let callCount = 0;
    const session = createSession(sessionOptions(async () => {
        callCount += 1;
        return callCount === 1 ? response(200) : response(403);
    }));

    await session.authenticate('owner', 'test-only-secret');
    const rejected = await session.fetch(protectedUrl, { method: 'POST' });
    assert.equal(rejected.status, 403);
    assert.equal(session.isAuthenticated(), false);
    await assert.rejects(
        session.fetch(protectedUrl, { method: 'POST' }),
        (error) => error.code === 'authentication_required'
    );
    assert.equal(callCount, 2);
});

test('malformed validation evidence and unsupported credentials are rejected', async () => {
    const invalidResponseSession = createSession(sessionOptions(
        async () => response(200, { authenticated: true })
    ));
    await assert.rejects(
        invalidResponseSession.authenticate('owner', 'test-only-secret'),
        (error) => error.code === 'invalid_validation_response'
    );
    assert.throws(
        () => encodeBasicAuthorization('owner:name', 'secret', encodeBase64),
        (error) => error.code === 'unsupported_credentials'
    );
    assert.throws(
        () => encodeBasicAuthorization('owner', '密码', encodeBase64),
        (error) => error.code === 'unsupported_credentials'
    );
});

test('validation aborts fail closed with a stable timeout code', async () => {
    const timeout = new Error('aborted');
    timeout.name = 'AbortError';
    const session = createSession(sessionOptions(async () => {
        throw timeout;
    }));
    await assert.rejects(
        session.authenticate('owner', 'test-only-secret'),
        (error) => error.code === 'auth_timeout'
    );
    assert.equal(session.isAuthenticated(), false);
});
