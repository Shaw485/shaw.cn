# 作品集筛选与点赞调试

作品集交互按模块输出结构化浏览器日志，生产环境默认关闭详细日志。

## 开启全部调试日志

在浏览器开发者工具 Console 执行：

```js
localStorage.setItem('shaw.debug.portfolio', '1');
location.reload();
```

## 仅调试一个模块

可用模块为 `likes` 和 `filters`：

```js
localStorage.setItem('shaw.debug.portfolio', '1');
localStorage.setItem('shaw.debug.portfolio.modules', 'likes');
location.reload();
```

## 关闭日志

```js
localStorage.removeItem('shaw.debug.portfolio');
localStorage.removeItem('shaw.debug.portfolio.modules');
location.reload();
```

点赞读取或提交失败会始终输出 `warn` / `error`，包含时间、作品 ID 和非敏感失败原因。日志不记录访客身份、网络地址、联系方式或浏览历史，也不会持久保存到服务器。
