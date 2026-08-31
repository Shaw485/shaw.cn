# 项目文档阅读器调试

项目详情中的 README、Roadmap、报告和更新记录统一通过 `project-doc.html` 阅读。所有可读文档都在白名单内，并由阅读器使用严格 UTF-8 解码；每份 TXT 同时带 UTF-8 BOM 和下载文件名。

生产环境默认不输出调试日志。需要排查文档加载时，在浏览器 Console 执行：

```js
localStorage.setItem('shaw.debug.project-doc', '1');
location.reload();
```

关闭：

```js
localStorage.removeItem('shaw.debug.project-doc');
location.reload();
```

`viewer` 日志只记录文档白名单 ID、加载结果、字节数和非敏感错误原因，不记录文档正文、访客信息或访问来源。无效 ID、HTTP 失败和 UTF-8 解码失败会输出可操作的 `warn` / `error`。
