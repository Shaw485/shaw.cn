const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

test('M036 online demo deployment stays loopback-only, rate-limited and body-free in logs', () => {
    const service = read('deploy/handmade-gpt/shaw-gpt-demo.service');
    const nginx = read('deploy/handmade-gpt/nginx-handmade-gpt.conf');
    const rateLimit = read('deploy/handmade-gpt/nginx-handmade-gpt-rate-limit.conf');
    const docs = read('docs/handmade-gpt-online-demo.md');

    assert.match(service, /--port 8772 --device cpu/);
    assert.match(service, /--allowed-origin https:\/\/shawspace\.cn/);
    assert.match(service, /--no-console-log --no-open-browser/);
    assert.match(service, /MemoryMax=950M/);
    assert.match(service, /ReadWritePaths=.*\/logs/);
    assert.match(nginx, /location = \/handmade-gpt\/api\/generate/);
    assert.match(nginx, /limit_req zone=shaw_gpt_demo_per_ip/);
    assert.match(nginx, /client_max_body_size 16k/);
    assert.match(nginx, /proxy_set_header Host 127\.0\.0\.1:8772/);
    assert.match(nginx, /proxy_pass http:\/\/127\.0\.0\.1:8772\/api\/generate/);
    assert.match(rateLimit, /rate=10r\/m/);
    assert.match(docs, /不会记录输入正文、输出正文或 Token ID/);
    assert.match(docs, /server.*model.*inference.*security.*orchestrator/);
    assert.doesNotMatch(service + nginx + docs, /斗破苍穹|Authorization:|api[_-]?key/i);
});
