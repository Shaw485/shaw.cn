# 《怪奇之原》改动记录同步

作品站的 `/brain-egg-changelog.txt` 是游戏项目《改动记事本.md》的公开镜像，不再维护独立手抄版本。

同步：

```bash
node tools/sync-brain-egg-changelog.js --source /path/to/改动记事本.md
```

只检查是否一致：

```bash
node tools/sync-brain-egg-changelog.js --check --source /path/to/改动记事本.md
```

也可以用 `SMART_EGG_CHANGELOG_SOURCE` 指定源文件。脚本按 `##` 统计顶层记录组，完整保留每组中的 `###` 自动子记录和全部正文，不按版本号过滤、拆分或去重。公开 TXT 自动加入单个 UTF-8 BOM，以兼容浏览器下载和文本编辑器；去除 BOM 后的正文与源文件逐字一致。

同步会同时生成 `brain-egg-changelog.meta.json`，记录源文件和公开文件的字节数、SHA-256、顶层组数、子记录数与最新标题。

诊断日志以单行 JSON 输出到当前终端，模块名为 `brain-egg-changelog-sync`，可按 `level`、`event` 或 `module` 筛选。它只记录摘要、计数和错误原因，不记录正文或敏感信息；脚本每次执行后退出，不保留长期日志。源文件缺失、格式无效或 `--check` 发现不一致时返回非零退出码，且不会覆盖现有公开文件。
