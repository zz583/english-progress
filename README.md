# English progress — private learning record

This repository is the user's own progress store for practical English learning.
It is private. Only the user and their Muse may read/write it.

## File
- `progress.json` — source of truth for mastered cards.
  - Chapter 1: 打招呼与自我介绍, 9 cards, ids `c1-*`
  - Chapter 2: 数字和时间, 13 cards, ids `c2-*`
  - Total: 22 sentences.
  - Fields: `total_mastered`, per-chapter `mastered` + `mastered_ids`, `updated_at`.

## How sync works
1. The lesson page (private, not shared) saves progress in the phone browser.
2. The user taps 导出进度, downloads `english-progress.json`, and sends it to Muse.
3. Muse commits that file here as `progress.json`.
4. On later chats or scheduled checks, Muse reads `progress.json` here to see
   which chapter is complete and what to teach next.

No token, password, or credential is stored in this repository.
The lesson page itself never writes directly to GitHub.
