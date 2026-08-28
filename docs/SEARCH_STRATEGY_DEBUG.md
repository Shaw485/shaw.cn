# 搜索策略平台：日志与独立调试

## 线上行为

- 搜索体验的 Query 日志只保存在访问者当前浏览器的 `localStorage`，不会作为公开日志上传。
- 存储键：`shawspace_search_experience_logs_v1`。
- 最多保留最近 100 条，超过后自动淘汰旧记录。
- 每条日志记录 Query、开始/结束时间、耗时、结果数、请求 ID、状态及链路事件。
- 浏览器控制台日志不输出原始 Query，避免调试信息泄露用户输入。
- “策略历史与日志”中心同时读取后端已采用策略版本和对应审批生效日志；公开数据只有配置、说明、聚合指标和证据 ID，不含逐 Query/商品结果。

## 按模块开启调试

生产环境默认关闭详细调试。在浏览器控制台执行：

```js
localStorage.setItem('shaw.debug.search-console', '1');
localStorage.setItem('shaw.debug.search-console.modules', 'search-ui,log-store,strategy-ui,agent-ui,agent-runtime-ui');
location.reload();
```

模块可单独选择：

- `search-ui`：搜索请求、响应与渲染流程。
- `log-store`：本地日志写入与状态完成。
- `strategy-ui`：策略版本、变更日志、本机查询日志的筛选、后端目录读取与展示。调试事件只记录数量、视图和是否存在筛选词。
- `agent-ui`：受保护的 Agent 工作台阶段诊断、retrieval candidate、根因/候选/门禁展示和 10 组 Query 对比渲染状态。页面不发送审批请求。
- `agent-runtime-ui`：只读 Agent Runtime Trace 渲染状态。只记录 Trace/Runtime/Planner ID、动作数、工具调用数和失败动作数；不记录 Query、商品、完整响应、凭据或 Authorization。

关闭调试：

```js
localStorage.removeItem('shaw.debug.search-console');
localStorage.removeItem('shaw.debug.search-console.modules');
```

## 查看、筛选和清理

- 查看：打开 `/search-strategy.html` 的“策略历史与日志”，在“策略版本 / 变更日志 / 本机查询日志”三个视图切换。
- 策略筛选：支持策略名、策略/Proposal/Decision/Comparison ID；本机日志支持 Query、日志 ID、请求 ID 和状态过滤。
- 导出：浏览器控制台执行 `JSON.stringify(SearchConsoleStore.getLogs(), null, 2)`。
- 清理：浏览器控制台执行 `SearchConsoleStore.clear()`。

## 独立排查

1. 搜索 UI：开启 `search-ui`，检查请求开始、HTTP 状态和渲染完成事件。
2. 存储：开启 `log-store`，检查日志 ID、状态与数量；写入失败会输出不含敏感字段的 warning。
3. Agent 工作台：访问 `/search-agent.html` 并完成服务器鉴权，再开启 `agent-ui` 检查 `/agent/retrieval/analyze` 请求、`retrieval_stage_analysis_rendered`、`optimizer_reasoning_rendered` 与 Query 对比渲染。阶段事件只记录 Run/Diagnosis/Comparison ID、失败门禁数和独有相关商品计数；控制台不记录 Query、商品标题、结果列表、凭据、Authorization 或完整响应。若新阶段接口尚未部署并返回 `404`，页面会记录 `retrieval_stage_analysis_fallback` 并回退到旧 proposal 接口；遇到 `401` 时刷新页面重新登录。策略审批仅在服务器后台执行。
4. Runtime Trace：单独开启 `agent-runtime-ui`，重新运行分析并检查 `runtime_trace_rendered`。日志里的 `actionCount` 必须等于轨迹动作数，`toolCallCount` 必须等于后端工具调用数；如果工具出现一次可恢复错误，时间线会先显示“工具失败 · 已按预算重试”，下一步必须是同一工具和同一候选的成功重试，失败动作不会伪造 evidence ID。页面加载、HTTP/契约错误和旧接口回退都会先清掉上一轮 Trace，避免把旧证据误认成当前运行。Replay 徽标只表示后端声明可按相同固定输入与工具动作确定性重放，不代表页面会触发重放或审批。
5. 策略平台：开启 `strategy-ui`，检查 `/agent/strategy/catalog` 的 `strategy_history` 与 `strategy_activity_logs` 数量；控制台不会打印配置正文、Query 或完整响应。
6. 服务端：使用响应头 `X-Request-ID` 查询服务端 journald 日志；服务端不记录原始 Query。
7. 失败复现：在查询日志中找到请求 ID、时间、耗时与链路事件，再到服务端按相同 ID 关联排查。
