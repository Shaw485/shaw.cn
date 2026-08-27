(function initSearchConsoleStore(global) {
    'use strict';

    const STORAGE_KEY = 'shawspace_search_experience_logs_v1';
    const MAX_LOGS = 100;
    const DEBUG_KEY = 'shaw.debug.search-console';
    const DEBUG_MODULES_KEY = 'shaw.debug.search-console.modules';

    const storage = global.localStorage;

    const createId = () => {
        if (global.crypto?.randomUUID) return global.crypto.randomUUID();
        return `search-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    };

    const enabledModules = () => new Set(
        (storage.getItem(DEBUG_MODULES_KEY) || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
    );

    const debug = (module, message, context = {}) => {
        if (storage.getItem(DEBUG_KEY) !== '1') return;
        const modules = enabledModules();
        if (modules.size && !modules.has(module)) return;
        console.debug(`[search-console:${module}] ${message}`, {
            timestamp: new Date().toISOString(),
            ...context
        });
    };

    const read = () => {
        try {
            const parsed = JSON.parse(storage.getItem(STORAGE_KEY) || '[]');
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.warn('[search-console:storage]', {
                timestamp: new Date().toISOString(),
                event: 'local_log_read_failed',
                errorType: error instanceof Error ? error.name : 'UnknownError'
            });
            return [];
        }
    };

    const write = (logs) => {
        try {
            storage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(0, MAX_LOGS)));
            return true;
        } catch (error) {
            console.warn('[search-console:storage]', {
                timestamp: new Date().toISOString(),
                event: 'local_log_write_failed',
                count: logs.length,
                errorType: error instanceof Error ? error.name : 'UnknownError'
            });
            return false;
        }
    };

    const update = (id, updater) => {
        const logs = read();
        const index = logs.findIndex((item) => item.id === id);
        if (index === -1) return null;
        logs[index] = updater(logs[index]);
        write(logs);
        global.dispatchEvent?.(new CustomEvent('shaw:search-log-updated', { detail: { id } }));
        return logs[index];
    };

    const start = ({ query, backend = 'local', topK = 10, source = 'search-eval' }) => {
        const id = createId();
        const now = new Date().toISOString();
        const log = {
            id,
            query: String(query || '').trim(),
            backend,
            topK,
            source,
            status: 'running',
            startedAt: now,
            completedAt: null,
            durationMs: null,
            requestId: null,
            resultCount: null,
            topProductIds: [],
            errorCode: null,
            events: [{ at: now, stage: 'query', event: 'received', status: 'success', detail: '收到搜索请求' }]
        };
        write([log, ...read()]);
        debug('log-store', 'Search log started', { logId: id, backend, topK });
        return id;
    };

    const event = (id, { stage, event: eventName, status = 'success', detail = '' }) => update(id, (log) => ({
        ...log,
        events: [...log.events, {
            at: new Date().toISOString(),
            stage,
            event: eventName,
            status,
            detail
        }]
    }));

    const complete = (id, fields = {}) => update(id, (log) => {
        const completedAt = new Date().toISOString();
        const next = {
            ...log,
            status: fields.status || 'success',
            completedAt,
            durationMs: fields.durationMs ?? log.durationMs,
            requestId: fields.requestId ?? log.requestId,
            resultCount: fields.resultCount ?? log.resultCount,
            topProductIds: fields.topProductIds ?? log.topProductIds,
            errorCode: fields.errorCode ?? null
        };
        debug('log-store', 'Search log completed', {
            logId: id,
            status: next.status,
            durationMs: next.durationMs,
            resultCount: next.resultCount,
            requestId: next.requestId
        });
        return next;
    });

    global.SearchConsoleStore = {
        start,
        event,
        complete,
        getLogs: read,
        clear: () => write([]),
        constants: { STORAGE_KEY, MAX_LOGS, DEBUG_KEY, DEBUG_MODULES_KEY }
    };
})(window);
