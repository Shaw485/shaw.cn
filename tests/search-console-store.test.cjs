const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const memory = new Map();
const localStorage = {
    getItem: (key) => memory.has(key) ? memory.get(key) : null,
    setItem: (key, value) => memory.set(key, String(value)),
    removeItem: (key) => memory.delete(key)
};
let sequence = 0;
const sandbox = {
    window: {
        localStorage,
        crypto: { randomUUID: () => `test-${++sequence}` },
        dispatchEvent() {}
    },
    CustomEvent: class CustomEvent { constructor(name, init) { this.name = name; this.detail = init?.detail; } },
    console,
    Date,
    Math,
    JSON,
    String,
    Error,
    Array,
    Set
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('js/search-console-store.js', 'utf8'), sandbox);

const store = sandbox.window.SearchConsoleStore;
const id = store.start({ query: 'wireless mouse', topK: 10 });
store.event(id, { stage: 'retrieval', event: 'response', detail: '收到 10 个候选结果' });
store.complete(id, { status: 'success', durationMs: 42, resultCount: 10, requestId: 'req-1' });

const first = store.getLogs()[0];
assert.equal(first.query, 'wireless mouse');
assert.equal(first.status, 'success');
assert.equal(first.resultCount, 10);
assert.equal(first.requestId, 'req-1');
assert.equal(first.events.length, 2);

for (let index = 0; index < 105; index += 1) store.start({ query: `query-${index}` });
assert.equal(store.getLogs().length, 100);
assert.equal(store.getLogs()[0].query, 'query-104');

console.log('search-console-store tests passed');
