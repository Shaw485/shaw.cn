(function initSearchUiDiagnostics(root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.SearchUiDiagnostics = api.defaultDiagnostics;
    if (root) root.createSearchUiDiagnostics = api.createDiagnostics;
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
    'use strict';

    const ALLOWED_MODULES = Object.freeze([
        'agent-release-ui',
        'owner-auth-ui',
        'owner-decision-ui',
        'owner-rollback-ui',
        'release-lifecycle-ui',
        'serving-readiness-ui',
        'search-comparison-ui'
    ]);
    const SENSITIVE_FIELD = /(authorization|cookie|csrf|password|passwd|secret|token|query|content|document|credential|header)/i;
    const SENSITIVE_VALUE = /\b(?:basic|bearer)\s+[a-z0-9+/=._-]+|\b(?:csrf|password|passwd|secret|token)\s*[:=]\s*\S+/gi;

    const memoryStorage = () => ({ getItem: () => null });

    const createDiagnostics = ({
        storage = (typeof localStorage !== 'undefined' ? localStorage : memoryStorage()),
        consoleImpl = (typeof console !== 'undefined' ? console : {}),
        now = () => new Date().toISOString(),
        maxEntries = 200
    } = {}) => {
        const allowed = new Set(ALLOWED_MODULES);
        const entries = [];

        const read = (key) => {
            try {
                return storage?.getItem?.(key) ?? null;
            } catch (_) {
                return null;
            }
        };

        const selectedModules = () => new Set(
            String(read('shaw.debug.search-release.modules') || '')
                .split(',')
                .map((item) => item.trim())
                .filter((item) => allowed.has(item))
        );

        const sanitize = (value, depth = 0) => {
            if (depth > 3) return '[depth-limited]';
            if (value === null || value === undefined) return value;
            if (typeof value === 'string') return value.replace(SENSITIVE_VALUE, '[redacted]').slice(0, 180);
            if (typeof value !== 'object') return value;
            if (Array.isArray(value)) return value.slice(0, 20).map((item) => sanitize(item, depth + 1));
            return Object.fromEntries(Object.entries(value).map(([key, child]) => [
                key,
                SENSITIVE_FIELD.test(key) ? '[redacted]' : sanitize(child, depth + 1)
            ]));
        };

        const shouldWrite = (module, level) => {
            if (!allowed.has(module)) return false;
            const modules = selectedModules();
            if (modules.size && !modules.has(module)) return false;
            if (level === 'warn' || level === 'error') {
                return read('shaw.debug.search-release.errors') !== '0';
            }
            return read('shaw.debug.search-release') === '1';
        };

        const log = (module, level, event, context = {}) => {
            if (!shouldWrite(module, level)) return;
            const entry = Object.freeze({
                timestamp: now(),
                module,
                level,
                event: String(event || 'unknown_event').slice(0, 100),
                context: sanitize(context)
            });
            entries.push(entry);
            if (entries.length > maxEntries) entries.splice(0, entries.length - maxEntries);
            const writer = typeof consoleImpl[level] === 'function'
                ? consoleImpl[level]
                : consoleImpl.log;
            writer?.call(consoleImpl, `[search-release:${module}] ${entry.event}`, entry);
        };

        const exportLogs = () => JSON.stringify({
            exported_at: now(),
            verbose_enabled: read('shaw.debug.search-release') === '1',
            enabled_modules: [...selectedModules()],
            entries: entries.slice()
        }, null, 2);

        return Object.freeze({
            allowedModules: ALLOWED_MODULES,
            exportLogs,
            getEntries: () => entries.slice(),
            log
        });
    };

    return {
        ALLOWED_MODULES,
        createDiagnostics,
        defaultDiagnostics: createDiagnostics()
    };
}));
