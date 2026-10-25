# 英语课本升级版 · 使用说明

这是手机英语课本「升级版」的页面源码（`index.html`，单个文件，样式和脚本都在里面），2026-10-25 保存。
旧版课本页没有改动，仍可照常打开；这一版是新建的页面。

## 内容

- 第 1 章 打招呼与自我介绍：9 句（Hello / Hi / Good morning / Good afternoon / Good evening / How are you? / I'm fine, thank you. And you? / Nice to meet you. / My name is Xunmeng. I am from China.）
- 第 2 章 数字和时间：13 句（One 至 Ten、What time is it?、It's three o'clock.、It's half past seven.）
- 每句带音标、中文、场景说明和一段发音音频（Kokoro af_bella 女声）。
- 每章末尾有小对话、练习说明和现实小任务。

## 音频文件

页面本身不含音频，运行时从同目录 `assets/` 读取 22 个 mp3，文件名固定：

- 第 1 章：`hello.mp3`、`hi.mp3`、`good-morning.mp3`、`good-afternoon.mp3`、`good-evening.mp3`、`how-are-you.mp3`、`im-fine.mp3`、`nice-to-meet-you.mp3`、`my-name-is.mp3`
- 第 2 章：`lesson2-01-one.mp3`、`lesson2-02-two.mp3`、`lesson2-03-three.mp3`、`lesson2-04-four.mp3`、`lesson2-05-five.mp3`、`lesson2-06-six.mp3`、`lesson2-07-seven.mp3`、`lesson2-08-eight.mp3`、`lesson2-09-nine.mp3`、`lesson2-10-ten.mp3`、`lesson2-11-whattime.mp3`、`lesson2-12-threeoclock.mp3`、`lesson2-13-halfpastseven.mp3`

单独把 `index.html` 拿出来用时，要把这 22 个音频按上面名字放进同级的 `assets/` 文件夹，播放和连播才能出声。

## 怎么学（页面功能）

- **三档反馈**：每张卡下面有「不会 / 需要提示 / 能独立说出」，点完立刻保存到手机浏览器本地，并显示「已保存」。
- **复习排期**（按下一次复习时间算）：
  - 不会 → 明天（+1 天）
  - 需要提示 → +2 天
  - 能独立说出 → +4 天；连续点「能独立说出」会延长：4 天 → 8 天 → 16 天（封顶 16 天）
- **页眉三项**：「继续学习」回到上次的章节和卡片；「今日复习」显示今天到期的句数，点开先练到期句；「今日完成」是今天评过分的句数。关掉页面再打开，位置和评分都会恢复。
- **开关**：中文提示开/关、0.8× 慢速 / 正常语速、自测模式（遮住英文，只看中文，点卡片显示英文和音标）、关动画（状态会保存）。页面不会自动播放声音。
- **复习模式**：每章有「复习本章」，加上页眉的「今日复习」；复习里同样用三档按钮评分。
- **连播本章**：按顺序自动播放本章全部音频并滚动跟随，再点一次停止。
- 章节切换：左右滑动，或用底部「上一章 / 下一章」按钮。

## 进度导入 / 导出

- 进度自动存在打开页面的那个浏览器里（localStorage，键名 `english-book-v2`），不联网、不上传。
- **导出**：页面底部「导出进度」会下载 `english-progress.json`（新版格式），同时把内容显示在文本框里，可以复制发给 Muse 同步到本仓库的 `progress.json`。
- **导入**：底部「导入文件」选文件，或「粘贴导入」把进度文字粘进文本框。
  - 兼容旧版导出的 `english-progress.json`（带 `knownIds` 的格式）：旧版「我会了」的句子会转成「能独立说出」，上次练习日期取旧文件导出日期，下次复习排 +4 天。
  - 导入后章节和总数会按逐句记录重新计算（第 1 章 /9、第 2 章 /13、合计 /22）。

## 新版进度格式（schema_version: 2）

导出文件顶层字段：`schema_version: 2`、`exportedAt`、`summary`、`chapters`、`total`、`position`（上次位置）、`cards`。
`cards` 是 22 句的数组，每句包含：

| 字段 | 说明 |
| --- | --- |
| `id` | 句子编号，第 1 章 `c1-0`…`c1-8`，第 2 章 `c2-0`…`c2-12` |
| `en` / `zh` | 英文 / 中文 |
| `status` | `new`（还没学）/ `unknown`（不会）/ `hint`（需要提示）/ `independent`（能独立说出） |
| `status_zh` | 状态的中文写法 |
| `last_review` | 上次练习日期 `YYYY-MM-DD`，没学过为 `null` |
| `next_review` | 下次复习日期 `YYYY-MM-DD`，没学过为 `null` |

仓库根目录的 `progress.json` 就是这个格式，是当前进度的备份副本。

## 维护方法

- 改句子或加新章节：编辑 `index.html` 里脚本开头的 `CHAPTERS` 数据（每句含 id、英文、音标、场景、中文、音频文件名），新句子要配一段同名 mp3 放进 `assets/`。章节数目前写死为 2 章，加章节时要同步改滑动轨道和翻页逻辑。
- 改排期规则：看脚本里的 `rateCard` 函数（间隔 1 / 2 / 4 / 8 / 16 天在那里）。
- 改完后把新的 `index.html` 覆盖本文件即可；页面逻辑全在这一个文件里，没有服务器和数据库。
