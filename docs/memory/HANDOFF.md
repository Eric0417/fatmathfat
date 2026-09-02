---
title: 交接與目前狀態
type: handoff
status: active
tags: [memory, handoff]
created: 2026-09-02
updated: 2026-09-02
---

# 交接與目前狀態

## 摘要

本目錄 `math_website_render` 是從原專案複製出的**獨立部署 workspace**。它以 Vite + React + TypeScript 建立免登入、本機儲存、可離線使用的「集合概念視覺化與基礎解題工具」，Venn 圖現在支援元素拖放。

## 已完成

- 建立 `docs/memory/` 長期記憶庫結構。
- 完成 `CONVENTIONS.md`，定義本專案 `.md` 檔案的寫法標準。
- 建立專案根 `AGENTS.md`，導引 agent 讀取記憶庫並使用 graph。
- 以 `codebase-memory-mcp` 索引本專案並記錄 ADR。
- 實作靜態前端首版：`Vite + React 19 + TypeScript`、無後端。
- 完成七個學習單元、互動 Venn 圖、元素指派、五種集合運算。
- 完成 10 題練習、12 題綜合測驗、錯題分類與 `localStorage` 本機紀錄。
- 完成 PWA manifest、service worker 與離線重載驗證。
- 通過 `npm run typecheck`、`npm test`、`npm run build`、Playwright 桌面/手機瀏覽器驗證。
- 已將台灣教材用語稽核結果整合到說明文字；CBM 已重新索引至 249 nodes / 530 edges。
- 新增獨立 Git workspace、`render.yaml` 與 pointer-based 元素拖放。

## 進行中

- 準備建立獨立 GitHub repo 並部署到 Render。

## 待辦

- 若要支援描述法轉列舉法，需另存論域（如 `ℤ`、`ℕ`）並建立對應題型。
- 若要支援教師自訂題目，需把測驗題型與錯誤識別碼正式化為資料契約。
- 其餘首版功能已完成；下一版建議先做內容擴充與多裝置同步方案評估。

## 給下一個 agent 的提示

- 先讀 `CONVENTIONS.md`，再讀本檔。
- 任何結構性變更都要重新索引 graph；目前 index 已反映新程式碼（249 nodes / 530 edges），且已寫入 ADR。
- 首版刻意不加入帳號、排行、教師後台、多人連線與複雜動畫。
- 主要入口在 `src/`：路由、資料、集合運算、儲存與頁面各自分離。
- 重大決策已記進 `DECISIONS.md`，也要同步 CBM ADR。
- 部署使用 `render.yaml` 的 static site 設定：`npm install && npm run build`，發布目錄為 `./dist`。
