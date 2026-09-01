# 0.015B 在线试写

`/handmade-gpt/` 是 M036 Step 5750 的同源在线体验入口。它只提供短中文小说续写：输入一个短语或半句话，服务端最多生成一两句；它不是聊天、问答或通用事实查询服务。

## 运行边界

- 推理由 ShawSpace 服务器 CPU 完成；模型、Tokenizer、配置和日志均不位于公开静态目录。
- 服务只监听回环地址，由 Nginx 将同源的 `/handmade-gpt/` 请求转发到本机服务。
- 请求限制为 80 个输入字符、60 个输出字符；单次仅处理一个生成请求，并由 Nginx 进行按 IP 限速与 16 KiB 请求体限制。
- 页面和服务端不会记录输入正文、输出正文或 Token ID。服务日志只保留时间、请求 ID、长度、延迟、停止原因和稳定错误码。

## 运维与诊断

- 服务状态：`systemctl status shaw-gpt-demo`
- 本机健康检查：`curl -fsS http://127.0.0.1:8772/api/status`
- 分模块日志：`/opt/shaw-gpt-demo/runtime/logs/`，模块为 `server`、`model`、`inference`、`security`、`orchestrator`。
- 默认日志级别为 `INFO`，可用 `GPT_DEMO_LOG_LEVEL_<MODULE>` 独立设置为 `DEBUG`、`WARNING`、`ERROR` 或 `OFF`；排障后应恢复默认级别。

线上使用前应验证 Nginx 配置、服务健康接口、一次实际生成和服务重启恢复。公开页面应始终保留模型任务边界与非商用许可证说明。
