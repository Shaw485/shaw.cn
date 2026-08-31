# 作品集筛选与点赞调试

作品集交互按模块输出结构化浏览器日志，生产环境默认关闭详细日志。

## 开启全部调试日志

在浏览器开发者工具 Console 执行：

```js
localStorage.setItem('shaw.debug.portfolio', '1');
location.reload();
```

## 仅调试一个模块

可用模块为 `likes`、`filters` 和 `resources`：

```js
localStorage.setItem('shaw.debug.portfolio', '1');
localStorage.setItem('shaw.debug.portfolio.modules', 'likes');
location.reload();
```

资源入口可单独用 `resources` 模块排查。它只记录项目 ID、资源名称以及“阅读/下载”交付方式，不记录 URL、访问内容或访客信息：

```js
localStorage.setItem('shaw.debug.portfolio', '1');
localStorage.setItem('shaw.debug.portfolio.modules', 'resources');
location.reload();
```

## 关闭日志

```js
localStorage.removeItem('shaw.debug.portfolio');
localStorage.removeItem('shaw.debug.portfolio.modules');
location.reload();
```

点赞读取或提交失败会始终输出 `warn` / `error`，包含时间、作品 ID 和非敏感失败原因。日志不记录访客身份、网络地址、联系方式或浏览历史，也不会持久保存到服务器。

## 全量商品搜索页

搜索页的浏览器调试生产环境默认关闭。开启 `search-ui` 模块：

```js
localStorage.setItem('shaw.debug.search-console', '1');
localStorage.setItem('shaw.debug.search-console.modules', 'search-ui');
location.reload();
```

控制台会记录请求开始、请求 ID、状态、耗时与结果数，不输出 Query、商品标题或响应正文。网络和 HTTP 失败会始终输出一条结构化 `warn`，可用响应的请求 ID 与服务端日志关联。关闭并清理调试设置：

Agent 工作台可单独开启 `agent-ui` 模块：

```js
localStorage.setItem('shaw.debug.search-console', '1');
localStorage.setItem('shaw.debug.search-console.modules', 'agent-ui');
location.reload();
```

控制台会记录 proposal 请求状态、诊断/候选数量、门禁状态、proposal ID 与安全错误码，不输出 Query、商品标题或后端证据正文。网页不发送审批请求；批准动作仅能在受控服务器后台执行，策略平台的读取流程可单独开启 `strategy-ui` 模块排查。

59-Query 开发诊断可独立开启 `bad-case-ui` 模块。Owner 页面会展示后端严格限量的 Query 与 Top 商品样本，调试日志只记录执行/数据集/索引 ID、分类聚合数量和错误码，不记录任何 Query、商品 ID/标题、样本数组或响应正文。详细步骤见 `SEARCH_STRATEGY_DEBUG.md`。

```js
localStorage.removeItem('shaw.debug.search-console');
localStorage.removeItem('shaw.debug.search-console.modules');
```

详细搜索链路只保存在当前浏览器，最多 100 条；查看、导出和清理方式见 `SEARCH_STRATEGY_DEBUG.md`。
