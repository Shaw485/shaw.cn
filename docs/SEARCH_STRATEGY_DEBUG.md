# 搜索策略平台：日志与独立调试

## 线上行为

- 搜索体验的 Query 日志只保存在访问者当前浏览器的 `localStorage`，不会作为公开日志上传。
- 存储键：`shawspace_search_experience_logs_v1`。
- 最多保留最近 100 条，超过后自动淘汰旧记录。
- 每条日志记录 Query、开始/结束时间、耗时、结果数、请求 ID、状态及链路事件。
- 浏览器控制台日志不输出原始 Query，避免调试信息泄露用户输入。

## 按模块开启调试

生产环境默认关闭详细调试。在浏览器控制台执行：

```js
localStorage.setItem('shaw.debug.search-console', '1');
localStorage.setItem('shaw.debug.search-console.modules', 'search-ui,log-store,strategy-ui,agent-ui');
location.reload();
```

模块可单独选择：

- `search-ui`：搜索请求、响应与渲染流程。
- `log-store`：本地日志写入与状态完成。
- `strategy-ui`：策略平台日志筛选和展示。
- `agent-ui`：Agent 工作台审批按钮的前端展示状态。

关闭调试：

```js
localStorage.removeItem('shaw.debug.search-console');
localStorage.removeItem('shaw.debug.search-console.modules');
```

## 查看、筛选和清理

- 查看：打开 `/search-strategy.html` 的“查询日志”。
- 筛选：支持 Query、日志 ID、请求 ID 和状态过滤。
- 导出：浏览器控制台执行 `JSON.stringify(SearchConsoleStore.getLogs(), null, 2)`。
- 清理：浏览器控制台执行 `SearchConsoleStore.clear()`。

## 独立排查

1. UI：开启 `search-ui`，检查请求开始、HTTP 状态和渲染完成事件。
2. 存储：开启 `log-store`，检查日志 ID、状态与数量；写入失败会输出不含敏感字段的 warning。
3. 服务端：使用响应头 `X-Request-ID` 查询服务端 journald 日志；服务端不记录原始 Query。
4. 失败复现：在查询日志中找到请求 ID、时间、耗时与链路事件，再到服务端按相同 ID 关联排查。
