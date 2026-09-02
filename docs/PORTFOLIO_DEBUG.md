# 作品集筛选与点赞调试

作品集交互按模块输出结构化浏览器日志，生产环境默认关闭详细日志。

## 开启全部调试日志

在浏览器开发者工具 Console 执行：

```js
localStorage.setItem('shaw.debug.portfolio', '1');
location.reload();
```

## 仅调试一个模块

可用模块为 `cards`、`likes`、`filters`、`resources`、`media`、`model-specs`、`architecture` 和 `actions`：

```js
localStorage.setItem('shaw.debug.portfolio', '1');
localStorage.setItem('shaw.debug.portfolio.modules', 'likes');
location.reload();
```

卡片排序与状态筛选后的渲染结果可单独用 `cards` 模块排查。它只记录排序方式、状态筛选值和项目数字 ID 顺序，不记录项目正文、链接、访客信息或任何敏感内容：

```js
localStorage.setItem('shaw.debug.portfolio', '1');
localStorage.setItem('shaw.debug.portfolio.modules', 'cards');
location.reload();
```

资源入口可单独用 `resources` 模块排查。它只记录项目 ID、资源名称以及“阅读/下载”交付方式，不记录 URL、访问内容或访客信息：

```js
localStorage.setItem('shaw.debug.portfolio', '1');
localStorage.setItem('shaw.debug.portfolio.modules', 'resources');
location.reload();
```

头像与截图可单独用 `media` 模块排查。它只记录项目 ID、头像类型和截图数量，不记录图片 URL、访问者信息或页面内容：

```js
localStorage.setItem('shaw.debug.portfolio', '1');
localStorage.setItem('shaw.debug.portfolio.modules', 'media');
location.reload();
```

模型参数表可单独用 `model-specs` 模块排查。它只记录项目 ID、参数分组数与参数行数，不记录语料正文、参数内容、资源 URL 或访客信息：

```js
localStorage.setItem('shaw.debug.portfolio', '1');
localStorage.setItem('shaw.debug.portfolio.modules', 'model-specs');
location.reload();
```

项目流程图可单独用 `architecture` 模块排查。它记录项目 ID、当前面板、阶段 ID、阶段数量和观察支路开关状态，不记录语料、用户输入、模型输出、Token ID、资源 URL 或访客信息：

```js
localStorage.setItem('shaw.debug.portfolio', '1');
localStorage.setItem('shaw.debug.portfolio.modules', 'architecture');
location.reload();
```

模型下载与项目外链可单独用 `actions` 模块排查。它只记录项目 ID 和主要、次要或第三入口类型，不记录目标 URL、下载文件、访客信息或页面内容：

```js
localStorage.setItem('shaw.debug.portfolio', '1');
localStorage.setItem('shaw.debug.portfolio.modules', 'actions');
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
