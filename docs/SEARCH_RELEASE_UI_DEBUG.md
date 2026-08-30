# Search Release UI：日志与独立调试

发布控制 UI 使用独立的 `js/search-ui-debug.js`。Verbose 日志在生产环境默认关闭；warn/error 可单独关闭。日志只保存在当前页面内存，最多 200 条，刷新即清理。

## 模块

| 模块 | 范围 | 可独立复现的问题 |
| --- | --- | --- |
| `agent-release-ui` | 公开 Agent 候选 lifecycle | Proposal 引用或初始状态没有显示 |
| `owner-auth-ui` | Owner 身份验证和短期会话 | Basic Auth 拒绝、超时、会话引用不一致 |
| `owner-decision-ui` | 同意并自动发布 / 拒绝 | revision 冲突、审批失败、响应 lifecycle 不合法 |
| `owner-rollback-ui` | active release 回滚 | active CAS 冲突、target revision 不合法 |
| `release-lifecycle-ui` | 策略平台发布目录 | approved 未上线、active、rolled back 分类错误 |
| `serving-readiness-ui` | `/health` active readiness | 策略、pointer、index 或 health 未就绪 |
| `search-comparison-ui` | Baseline / Active 同 Query 对照 | 单 lane 请求、契约或渲染失败 |

## 开启、过滤与关闭

只开启某两个模块：

```js
localStorage.setItem('shaw.debug.search-release', '1');
localStorage.setItem('shaw.debug.search-release.modules', 'owner-decision-ui,release-lifecycle-ui');
location.reload();
```

模块列表留空表示开启全部 verbose：

```js
localStorage.setItem('shaw.debug.search-release.modules', '');
```

关闭 verbose：

```js
localStorage.removeItem('shaw.debug.search-release');
localStorage.removeItem('shaw.debug.search-release.modules');
```

warn/error 默认启用。临时静默并恢复：

```js
localStorage.setItem('shaw.debug.search-release.errors', '0');
localStorage.removeItem('shaw.debug.search-release.errors');
```

Console 前缀为 `[search-release:<module>]`。导出本次页面的安全日志：

```js
copy(SearchUiDiagnostics.exportLogs());
```

## 安全边界

- 不记录 Query、商品内容、密码、Authorization、Cookie、CSRF/审批 token 或完整 HTTP 响应。
- `search-ui-debug.js` 会按字段名和常见凭据值二次脱敏，并限制对象深度、字符串长度和内存条数。
- Proposal ID、revision、strategy ID、index ID、稳定错误码、HTTP 状态与数量可以用于关联问题。
- Owner 密码和 Basic Authorization 只保存在 `search-agent-auth.js` 的闭包内存；审批 token 只保存在 `search-owner.js` 的页面会话内存，不进入 URL、DOM、localStorage 或日志。
- 每次 decision/rollback 都生成新的 UUIDv4 `client_action_id`，但 UI 日志不记录该 ID。

## 独立复现

### 公开候选状态

1. 只开启 `agent-release-ui`。
2. 打开 `search-agent.html` 并运行分析。
3. 通过门禁时应显示 `pending_owner_review`、Proposal ID/revision 和 Owner 页面链接；门禁失败显示 `rejected_by_gate`。
4. Network 中公共页面只能出现分析请求，不应出现 release session、decision 或 rollback 请求。

### Owner 审批

1. 从候选链接进入 `search-owner.html`，开启 `owner-auth-ui,owner-decision-ui`。
2. 验证成功后检查 `approval_session_ready`；日志中不得出现账号、密码或 token。
3. “同意并自动发布”与“拒绝”只能各提交一次短期会话动作；`409` 时返回策略平台刷新 revision。
4. 响应必须按服务器 lifecycle 显示；`approved_for_validation`、`validating`、`staged`、`canary` 不能显示成 `active`。

### Active serving 与同 Query 对照

1. 开启 `serving-readiness-ui,search-comparison-ui` 后打开 `search-eval.html`。
2. `/health` 未 ready 时 optimized lane 必须禁用，Baseline 仍可搜索。
3. ready 时两个输入保持同步，一次提交并行请求 `/catalog/search` 和 `/catalog/search/active`。
4. 检查两栏的 Strategy、revision 与 index；active 响应 revision 必须是 64 位小写 SHA-256。

### 回滚

1. 策略平台只在当前 active release 同时有 `previous_revision` 时显示“Owner 一键回滚”。
2. 登录后 session 请求绑定 proposal ID/revision 和 `action: rollback`。
3. rollback 请求绑定 `expected_active_revision` 与 `target_revision`；active 已变化时必须失败关闭。
4. 成功响应显示 `rolled_back`，随后刷新策略平台和 `/health` 核对新 active revision。
