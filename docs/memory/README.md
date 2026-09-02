---
title: 長期記憶庫索引
type: index
status: active
tags: [memory, index, math_website]
created: 2026-09-02
updated: 2026-09-02
---

# 長期記憶庫索引

本目錄是本專案的 **長期記憶庫**（long-term memory library）。它保存跨 session 有意義的專案語意記憶，讓任何未來的 agent 或工程師不需要重新翻原始碼就能接上上下文。

## 兩層記憶模型

```text
docs/memory/*.md   →  語意記憶（專案狀態、決策、架構、任務、交接、慣例）
codebase-memory-mcp → 結構記憶（程式碼結構、呼叫關係、定義、相依性）
```

兩者互補、不互相取代。程式結構問題走 graph，語意/決策問題走 `docs/memory/`。

## 檔案地圖

| 檔案 | 用途 |
|------|------|
| [CONVENTIONS.md](CONVENTIONS.md) | **寫 `.md` 檔案前必讀**。定義本專案 Markdown 的格式、frontmatter、命名、連結與更新規則。 |
| [HANDOFF.md](HANDOFF.md) | 目前狀態與交接。session 開始先讀這裡。 |
| [ARCHITECTURE.md](ARCHITECTURE.md) | 架構、目錄結構、技術選型、模組邊界。 |
| [DECISIONS.md](DECISIONS.md) | 專案決策紀錄（decision log），含理由與替代方案。 |
| [TASKS.md](TASKS.md) | 任務清單與進度追蹤。 |

## 讀取順序

1. `CONVENTIONS.md`（知道怎麼寫 `.md`）
2. `HANDOFF.md`（了解現在到哪了）
3. `ARCHITECTURE.md`（了解系統邊界）
4. `DECISIONS.md`（了解為什麼這樣做）
5. `TASKS.md`（了解接下來做什麼）

## 寫入規則摘要

每次變更都必須在相應檔案留下紀錄，並遵守 [CONVENTIONS.md](CONVENTIONS.md)。重大決策同步寫入 [DECISIONS.md](DECISIONS.md)。完成一個工作段落後更新 [HANDOFF.md](HANDOFF.md)。
