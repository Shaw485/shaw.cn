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
localStorage.setItem('shaw.debug.search-console.modules', 'search-ui,log-store,strategy-ui,owner-auth-ui,agent-ui,agent-runtime-ui,agent-eval-ui,query-constructor-ui,bad-case-ui,diagnostic-experiment-ui,human-oracle-ui');
location.reload();
```

模块可单独选择：

- `search-ui`：搜索请求、响应与渲染流程。
- `log-store`：本地日志写入与状态完成。
- `strategy-ui`：策略版本、变更日志、本机查询日志的筛选、后端目录读取与展示。调试事件只记录数量、视图和是否存在筛选词。
- `owner-auth-ui`：Agent 网页登录壳的初始化、验证成功/失败、会话失效和退出。只记录事件、稳定错误码与 HTTP 状态；禁止记录账号、密码、Basic 值、Authorization、请求对象或响应正文。凭据只存在当前页面内存，刷新、关闭或退出即清除。
- `agent-ui`：受保护的 Agent 工作台阶段诊断、retrieval candidate、根因/候选/门禁展示，以及最多 10 个非持平 Query 样本的渲染状态。样本会区分改善/退化，并标明来自最终候选还是已淘汰候选；调试事件只记录来源数、展示数和方向计数，不记录 Query 或结果内容。页面不发送审批请求。
- `agent-runtime-ui`：只读 Agent Runtime Trace 渲染状态。只记录 Trace/Runtime/Planner ID、动作数、工具调用数和失败动作数；不记录 Query、商品、完整响应、凭据或 Authorization。
- `agent-eval-ui`：Agent Eval 只读成绩单请求与渲染。页面把生产 Planner 任务和 Harness stimulus 围栏任务分开展示，并显示受保护数据读取/策略写入计数；成功日志只记录 Evidence/Execution ID、任务数和工具调用数，失败日志只记录稳定错误码与 HTTP 状态。
- `query-constructor-ui`：Query 构造器只读摘要请求与渲染。成功事件只记录 Query Set ID 和数量；不记录或渲染任何原始 Query。
- `bad-case-ui`：59-Query 开发诊断请求与渲染。Owner 页面会展示后端严格限量的 Query 与 Top 商品样本，但不会把样本写入 URL 或 `localStorage`；控制台只记录 Supervisor Receipt/Diagnostic/Execution/Query Set/Index ID、聚合数量和稳定错误码，绝不记录 Query、商品 ID/标题、完整响应、凭据或 Authorization。
- `diagnostic-experiment-ui`：从不可变诊断证据生成受控实验计划。控制台只记录 Diagnostic/Experiment Plan/Query Set/Strategy ID 和目标数量，不记录 Query、商品、计划正文或完整响应。
- `human-oracle-ui`：Human Diagnostic Oracle 两阶段人工工作台。日志只记录 Batch/Unit/Case/Intent/Behavior/Seal ID、阶段计数、稳定错误码和 HTTP 状态；不记录原始 Query、商品 ID/标题、Top 3、判断正文、凭据、Principal 或完整响应。页面不会把原始 Query、商品和 annotation 写入 `localStorage`、URL 或其他客户端持久化位置。

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
3. Owner 登录：访问 `/search-agent.html` 应直接看到网页内登录表单，不应出现浏览器原生 Basic Auth 错误。单独开启 `owner-auth-ui`，错误凭据只应出现 `credentials_rejected` 与 `403`，正确凭据出现 `validation_succeeded`；任何日志、URL、`localStorage` 或 `sessionStorage` 都不得出现账号、密码或 Authorization。刷新页面后必须重新登录。
4. Agent 工作台：完成网页内登录，再开启 `agent-ui` 检查 `/agent/retrieval/analyze` 请求、`retrieval_stage_analysis_rendered`、`optimizer_reasoning_rendered` 与 Query 对比渲染。阶段事件只记录 Run/Diagnosis/Comparison ID、失败门禁数和独有相关商品计数；控制台不记录 Query、商品标题、结果列表、凭据、Authorization 或完整响应。若新阶段接口尚未部署并返回 `404`，页面会记录 `retrieval_stage_analysis_fallback` 并回退到旧 proposal 接口；Owner API 返回 `401/403` 时内存会话会清除并重新显示登录表单。策略审批仅在服务器后台执行。
5. Runtime Trace：单独开启 `agent-runtime-ui`，重新运行分析并检查 `runtime_trace_rendered`。日志里的 `actionCount` 必须等于轨迹动作数，`toolCallCount` 必须等于后端工具调用数；如果工具出现一次可恢复错误，时间线会先显示“工具失败 · 已按预算重试”，下一步必须是同一工具和同一候选的成功重试，失败动作不会伪造 evidence ID。页面加载、HTTP/契约错误和旧接口回退都会先清掉上一轮 Trace，避免把旧证据误认成当前运行。Replay 徽标只表示后端声明可按相同固定输入与工具动作确定性重放，不代表页面会触发重放或审批。
6. Agent Eval：单独开启 `agent-eval-ui` 并点击“运行 Agent 自检”，检查 `agent_eval_requested` 和 `agent_eval_summary_rendered`。接口或契约失败时检查 `agent_eval_failed` 的稳定错误码；不要把 Stage 5 Runtime 成绩解释成搜索质量成绩。
7. Query 构造器：单独开启 `query-constructor-ui` 并点击“构造 Query 集”，检查 `query_constructor_requested` 和 `query_constructor_summary_rendered`。页面只显示 ID、原始/合成/去重计数和正式评测禁用状态；合成 Query 没有 ESCI 标签，不能进入 nDCG/MRR。
8. Bad Case 诊断：单独开启 `bad-case-ui` 并点击“运行 59 条诊断 Query”，检查 `bad_case_diagnostics_requested` 和 `bad_case_diagnostics_summary_rendered`。成功日志中的 Supervisor Receipt ID 和聚合数量应与页面一致，但不得出现 Query、商品 ID/标题或样本数组；页面还会显示 TERM/KILL 宽限与完成观测。失败只查看 `bad_case_diagnostics_failed` 的稳定错误码与 HTTP 状态。四类诊断信号可重叠，不能相加；无标签结果不能解释为相关性好坏，也不能推断多路召回、融合、粗排或精排的阶段丢失。
9. 诊断实验规划：单独开启 `diagnostic-experiment-ui`，完成 Bad Case 诊断后检查自动生成的 `diagnostic_experiment_plan_requested` 与 `diagnostic_experiment_plan_rendered`。确认行为恢复轨与质量判定轨被分开，策略写入、激活和质量结论都保持锁定；日志不得包含 Query、商品或计划正文。
10. Human Diagnostic Oracle：单独开启 `human-oracle-ui`，成功运行 Bad Case 后点击“开始人工诊断”。确认批次固定为 40 case / 20 cluster；阶段 1 只显示来源/变体 Query，完成 30 项 Intent 前不得请求 Behavior view；阶段 2 才并排显示服务器重新验证的 Top 3。Behavior 选项受前序 Intent 约束：`not_equivalent` 只能选“可接受/不确定”，`uncertain` 只能选“不确定”，页面不展示后端必定拒绝的组合。每次提交都应出现新的 UUIDv4 Client Action ID（不会打印）并携带状态接口返回的 CAS head。40 项 Behavior 完成且无失效项后才可封印。封印只生成诊断 Oracle，不创建 ESCI 标签、正式质量结论、根因结论或策略写入。
   当前 Tool 05 按缺失项顺序推进，尚无返回修改历史判断的 UI；核心 API 已支持 CAS/supersession。若误提交，先停止封印并通过 owner-only API 修正，不要继续把错误判断固化。
11. Oracle 失败复现：`401/403` 先检查登录与站长身份；`409` 重新点击“继续人工诊断”拉取最新 CAS 状态；契约错误只查看 `human_oracle_operation_failed` 的 `operation`、稳定 `errorCode`、HTTP 状态与安全 ID。不要在控制台粘贴或导出页面上的 Query、Top 3 或人工判断。
12. 策略平台：开启 `strategy-ui`，检查 `/agent/strategy/catalog` 的 `strategy_history` 与 `strategy_activity_logs` 数量；控制台不会打印配置正文、Query 或完整响应。
13. 服务端：使用响应头 `X-Request-ID` 查询服务端 journald 日志；服务端不记录原始 Query。
14. 失败复现：在查询日志中找到请求 ID、时间、耗时与链路事件，再到服务端按相同 ID 关联排查。
