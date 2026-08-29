(function initSearchAgentAuth(globalScope) {
    'use strict';

    class OwnerAuthError extends Error {
        constructor(code, status = 0) {
            super(code);
            this.name = 'OwnerAuthError';
            this.code = code;
            this.status = status;
        }
    }

    const isLatin1 = (value) => Array.from(value).every(
        (character) => character.codePointAt(0) <= 255
    );

    const encodeBasicAuthorization = (username, password, encodeBase64) => {
        if (typeof username !== 'string' || typeof password !== 'string') {
            throw new OwnerAuthError('invalid_credentials');
        }
        if (!username || !password || username.length > 128 || password.length > 512) {
            throw new OwnerAuthError('invalid_credentials');
        }
        if (username.includes(':') || !isLatin1(username) || !isLatin1(password)) {
            throw new OwnerAuthError('unsupported_credentials');
        }
        return `Basic ${encodeBase64(`${username}:${password}`)}`;
    };

    const createSession = ({
        fetchImpl,
        validationUrl,
        baseUrl,
        allowedRequestPaths,
        validationTimeoutMs = 8000,
        encodeBase64 = globalScope.btoa?.bind(globalScope),
        onEvent = () => {}
    }) => {
        if (typeof fetchImpl !== 'function' || typeof encodeBase64 !== 'function') {
            throw new OwnerAuthError('auth_runtime_unavailable');
        }
        if (!Number.isInteger(validationTimeoutMs)
            || validationTimeoutMs < 1000
            || validationTimeoutMs > 30000) {
            throw new OwnerAuthError('invalid_auth_timeout');
        }

        const resolvedBaseUrl = new URL(baseUrl);
        const allowedOrigin = resolvedBaseUrl.origin;
        const isLoopback = ['127.0.0.1', 'localhost', '::1'].includes(
            resolvedBaseUrl.hostname
        );
        if (resolvedBaseUrl.protocol !== 'https:'
            && !(resolvedBaseUrl.protocol === 'http:' && isLoopback)) {
            throw new OwnerAuthError('insecure_auth_origin');
        }
        const resolvedValidationUrl = new URL(validationUrl, baseUrl);
        if (!Array.isArray(allowedRequestPaths) || allowedRequestPaths.length === 0) {
            throw new OwnerAuthError('auth_allowlist_unavailable');
        }
        const allowedRequests = new Set(allowedRequestPaths.map((path) => {
            const url = new URL(path, baseUrl);
            if (url.origin !== allowedOrigin || url.search || url.hash) {
                throw new OwnerAuthError('invalid_auth_allowlist');
            }
            return `${url.origin}${url.pathname}`;
        }));
        if (resolvedValidationUrl.origin !== allowedOrigin) {
            throw new OwnerAuthError('cross_origin_auth_blocked');
        }

        let authorization = null;

        const emit = (event, context = {}) => {
            onEvent(event, { ...context });
        };

        const clear = (reason = 'manual') => {
            authorization = null;
            emit('session_cleared', { reason });
        };

        const authenticate = async (username, password) => {
            let candidate = encodeBasicAuthorization(username, password, encodeBase64);
            emit('validation_requested');
            let response;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), validationTimeoutMs);
            try {
                response = await fetchImpl(resolvedValidationUrl.href, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        Authorization: candidate
                    },
                    cache: 'no-store',
                    credentials: 'omit',
                    redirect: 'error',
                    signal: controller.signal
                });
            } catch (error) {
                candidate = null;
                const errorCode = error?.name === 'AbortError' ? 'auth_timeout' : 'network_error';
                emit('validation_failed', { errorCode, statusCode: 0 });
                throw new OwnerAuthError(
                    errorCode === 'auth_timeout' ? 'auth_timeout' : 'auth_network_error'
                );
            } finally {
                clearTimeout(timeoutId);
            }

            if (response.status === 401 || response.status === 403) {
                candidate = null;
                clear('rejected');
                emit('validation_failed', {
                    errorCode: 'credentials_rejected',
                    statusCode: response.status
                });
                throw new OwnerAuthError('credentials_rejected', response.status);
            }
            if (!response.ok) {
                candidate = null;
                emit('validation_failed', {
                    errorCode: 'validation_unavailable',
                    statusCode: response.status
                });
                throw new OwnerAuthError('validation_unavailable', response.status);
            }

            let payload;
            try {
                payload = await response.json();
            } catch (error) {
                candidate = null;
                emit('validation_failed', {
                    errorCode: 'invalid_validation_response',
                    statusCode: response.status
                });
                throw new OwnerAuthError('invalid_validation_response', response.status);
            }
            if (payload?.schema_version !== 'search-agent-auth-check-v1'
                || payload?.authenticated !== true) {
                candidate = null;
                emit('validation_failed', {
                    errorCode: 'invalid_validation_response',
                    statusCode: response.status
                });
                throw new OwnerAuthError('invalid_validation_response', response.status);
            }

            authorization = candidate;
            candidate = null;
            emit('validation_succeeded', { statusCode: response.status });
            return { authenticated: true };
        };

        const fetchAuthenticated = async (input, init = {}) => {
            if (!authorization) throw new OwnerAuthError('authentication_required', 401);
            const requestUrl = new URL(
                typeof input === 'string' || input instanceof URL ? String(input) : input.url,
                baseUrl
            );
            if (requestUrl.search || requestUrl.hash
                || !allowedRequests.has(`${requestUrl.origin}${requestUrl.pathname}`)) {
                emit('request_blocked', { errorCode: 'cross_origin_auth_blocked' });
                throw new OwnerAuthError('cross_origin_auth_blocked');
            }

            const headers = new Headers(init.headers || {});
            headers.set('Authorization', authorization);
            const response = await fetchImpl(input, {
                ...init,
                headers,
                cache: 'no-store',
                credentials: 'omit',
                redirect: 'error'
            });
            if (response.status === 401 || response.status === 403) {
                clear('expired');
                emit('session_expired', { statusCode: response.status });
            }
            return response;
        };

        return {
            authenticate,
            clear,
            fetch: fetchAuthenticated,
            isAuthenticated: () => authorization !== null
        };
    };

    globalScope.SearchAgentAuth = {
        OwnerAuthError,
        createSession,
        encodeBasicAuthorization
    };
}(typeof window !== 'undefined' ? window : globalThis));
