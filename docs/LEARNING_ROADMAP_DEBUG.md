# Learning Roadmap 调试说明

`ai-growth.html` 的 8 周列表使用独立的 `learning-roadmap` 前端诊断分类。诊断只覆盖列表渲染和展开交互，不读取或记录任务正文、联系方式、查询内容或其他个人信息。

## 模块

- `render`：记录列表是否成功渲染以及渲染行数。
- `interaction`：记录某个周次的展开或收起动作。

每条日志包含 ISO 时间、页面会话 ID、模块、级别、事件和经过白名单过滤的上下文。允许的上下文字段仅为 `week`、`action`、`rowCount`、`result` 和 `errorType`。

## 开启、筛选和关闭

生产环境默认关闭普通调试日志，仅保留低噪声的渲染失败日志。打开浏览器开发者工具后可以执行：

```js
shawLearningRoadmapDebug.enable(['render', 'interaction']);
location.reload();
```

只调试展开交互：

```js
shawLearningRoadmapDebug.enable(['interaction']);
```

关闭普通调试日志：

```js
shawLearningRoadmapDebug.disable();
```

如需临时关闭失败日志：

```js
shawLearningRoadmapDebug.setErrorLogging(false);
```

恢复失败日志：

```js
shawLearningRoadmapDebug.setErrorLogging(true);
```

## 查看、导出和清理

日志同时输出到浏览器 Console，前缀为 `[learning-roadmap]`。可用模块名或事件名筛选。当前页面会话最多保留 100 条内存日志，超过后自动丢弃最早记录；刷新或关闭页面也会清理。

```js
shawLearningRoadmapDebug.exportLogs();
shawLearningRoadmapDebug.clear();
```

导出结果只包含白名单字段，不包含密码、Token、任务正文或个人信息。排查完成后应关闭调试开关，避免生产 Console 出现无关噪声。

## 独立复现

1. 渲染问题：只开启 `render`，刷新 `ai-growth.html`，检查 `roadmap-rendered` 的 `rowCount` 和 `result`。
2. 展开问题：只开启 `interaction`，依次展开和收起 W1、W2，检查 `week-toggled` 的 `week` 与 `action`。
3. 可访问性问题：用键盘 Tab 聚焦周次按钮，按 Enter 或 Space 展开；用上下方向键、Home、End 在周次间移动焦点。

