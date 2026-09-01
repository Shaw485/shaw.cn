# Pick Memory（拾忆卡）

一款开源的桌面间隔复习工具。把平时划词收藏的知识，按艾宾浩斯节奏重新放回视线。数据保存在本地，不需要登录或后端服务。

## 当前功能

- 在任意网页选中文字，右键选择“标记为知识点”
- 点击工具栏图标，输入或粘贴知识
- 在网页左下角展示当天的复习卡
- 直接展示正文，按“忘了 / 模糊 / 记得”反馈掌握程度
- 点击“记得”后保存复习结果并直接进入下一张
- 在卡片内设置小、中、大三种尺寸，以及每张卡曝光多少次后自动轮换
- 在知识库中搜索、编辑、归档和删除内容
- 使用 1、2、4、7、15、30、60、120、240 天的渐进复习间隔

## 安装

### 下载包

- macOS：包含 Chrome/Edge 扩展与跨应用划词伴侣，可在 Codex、备忘录、飞书等应用中划词学习。
- Windows：包含 Chrome/Edge 扩展，支持网页划词、复习卡和本地知识库。

下载 Release 中对应系统的压缩包，按包内说明安装。

### 从源码加载

1. 打开 Chrome 的 `chrome://extensions`，或 Edge 的 `edge://extensions`。
2. 开启右上角“开发者模式”。
3. 点击“加载已解压的扩展程序”。
4. 选择本目录 `memory-card-extension`。
5. 打开或刷新一个普通网页。第一次至少添加一条知识后，左下角会出现卡片。

Chrome/Edge 自带页面（例如新标签页、`chrome://extensions`、应用商店）禁止扩展注入，因此不会显示卡片或划词按钮；这是浏览器的安全限制。普通 HTTP(S) 网页以及其中的 iframe 均受支持。

## 使用方式

最快的记录方式是在网页中选中文字并右键标记。也可以按 `Command+Shift+K`（Windows 为 `Ctrl+Shift+K`）打开快速添加窗口。

新知识当天进入复习。点击“记得”会前进一个阶段并直接显示下一张；“模糊”保留当前阶段但缩短间隔；“忘了”回到第一阶段并在次日再出现。到期知识优先展示；当天没有到期知识时，会选择一条很久没见的内容作为“今日巩固”，保证每天都有不同卡片。

卡片左下角的“设置”可以调整卡片大小，并设置每张卡曝光 1～20 次后轮换。一次曝光指卡片在一个新打开或刷新的网页中显示一次；达到次数后，下次显示时会自动切换到下一张。

## 诊断日志

诊断日志只输出到扩展 Service Worker 的开发者控制台，不持久化保存，生产环境默认全部关闭。日志按模块独立开关：`rotation`（卡片轮换）、`native`（macOS 伴侣通信）、`runtime`（消息处理）、`storage`（本地存储）和 `ui`（页面卡片）。日志会自动隐藏 token、正文、URL 等敏感字段。

1. 打开 `chrome://extensions`，找到拾忆卡并点击“Service Worker”。
2. 在控制台按需执行：

```js
chrome.storage.local.set({ diagnostics: { rotation: true } })
```

3. 使用控制台筛选器搜索 `[PickMemory:rotation]`。关闭该模块时执行：

```js
chrome.storage.local.set({ diagnostics: { rotation: false } })
```

复现卡片消失问题时，只需开启 `rotation`；伴侣程序同步失败时只开启 `native`，避免无关日志干扰。浏览器关闭 Service Worker 控制台后，未导出的日志会随控制台生命周期清理。

网页划词“学习”悬浮窗的显示、内部点击、外部关闭和保存结果记录在 `ui` 模块中。开启方式：

```js
chrome.storage.local.set({ diagnostics: { ui: true } })
```

macOS 伴侣程序按模块写入最多 256 KB 的 JSON Lines 日志，超限后只保留一个 `.1` 轮转文件。默认关闭，不记录选中文字、URL 或剪贴板内容。按需创建配置：

```bash
mkdir -p "$HOME/Library/Application Support/ShiyiCard"
printf '{"ui":true,"storage":true}\n' > "$HOME/Library/Application Support/ShiyiCard/diagnostics.json"
tail -f "$HOME/Library/Application Support/ShiyiCard/logs/ui.log"
```

排查悬浮窗时只开启 `ui`；排查加入知识库失败时只开启 `storage`。完成后删除 `diagnostics.json` 即可关闭，日志文件也可以直接删除。

## 数据说明

数据保存在 `chrome.storage.local`，卸载扩展会清除数据。正式发布前建议增加 JSON 导入/导出与浏览器同步。

## 开发与发布

```bash
node tests/scheduler.test.js
node tests/background.test.js
node tests/diagnostics.test.js
node tests/manifest.test.js
node tests/selection-behavior.test.js
node tests/source-url.test.js
python3 native-macos/tests/test_native_host.py
python3 native-macos/tests/test_no_input_injection.py
python3 native-macos/tests/test_popup_behavior.py
python3 native-macos/tests/test_universal_binary.py
node packaging/build-release.mjs
```

发布脚本会在 `dist/` 生成 macOS 与 Windows 下载包及 SHA-256 校验文件。macOS 应用是兼容 Apple 芯片和 Intel 的 Universal 2 二进制。
