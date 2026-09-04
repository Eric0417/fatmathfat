---
title: 集合好好學改善計畫
type: note
status: active
tags: [memory, improvement-plan, math-website]
created: 2026-09-03
updated: 2026-09-04
---

# 集合好好學改善計畫

## 摘要

本專案已有可用的全棧學校版：七個學習單元、集合探索器、Venn 圖、基礎練習、12 題綜合測驗、FastAPI + PostgreSQL 後端、Email OTP 登入、管理員學習數據與 DeepSeek AI 老師。網站需連線；後續改善聚焦內容與學習體驗，不再以 `localStorage` 作為主要資料來源。

## 現有技術架構

| 項目 | 現況 |
|------|------|
| 框架 | React 19 |
| 語言 | TypeScript |
| 建置 | Vite 8 |
| 樣式 | 單一 `src/styles.css`，無 Tailwind 或 CSS Modules |
| 路由 | 原生 hash routing，集中在 `src/App.tsx` |
| 集合運算 | `src/lib/setMath.ts` |
| 後端 | FastAPI + SQLAlchemy + Alembic |
| 儲存 | PostgreSQL（Render），本機測試用 SQLite |
| 認證 | Email OTP + JWT，學生／教師角色 |
| AI | DeepSeek `deepseek-v4-flash` |
| 資料 | `src/data/curriculum.ts`、`src/data/questions.ts` |
| 離線 | `vite-plugin-pwa` + Workbox generateSW |
| 測試 | Vitest、`scripts/browser-verify.mjs` |

## 現有功能

- 七個課程單元：集合、元素關係、表示法、空集合、子集合、運算、補集。
- 集合探索器：選擇元素、加入 A/B、切換五種運算、顯示文字與 Venn 圖。
- 集合運算：交集、聯集、差集、反向差集、補集；輸出會去重與排序。
- 基礎練習與綜合測驗：目前共用 14 筆題目，綜合測驗取 12 題。
- 測驗結果：依概念分類、錯題類型，並寫入 PostgreSQL。
- 課程完成狀態：手動標記完成，保存於後端。
- 登入與教師管理：學校郵箱 OTP、管理員白名單、學生學習數據。
- AI 老師：全站浮動面板、依弱點生成練習、測驗中停用。
- PWA：manifest、service worker、離線回到登入頁。

## 發現的問題

### 學習流程

- AI 生成題目目前不進入永久題庫，無法由教師審核或重複使用。
- 尚未提供作業派發、即時在線狀態與 AI 對話審查。
- 尚未建立正式論域（domain）資料模型，描述法仍需人工轉換。
- 管理員後台仍以現有學習數據為主，尚未提供 CSV 匯出與學生詳細頁。

### 探索器

- 缺少復原上一步、清空 A/B/U、重新開始等獨立控制。
- 只能把選中的元素同時移出 A/B，不能只從 A 或只從 B 移除。
- 補集在 U 為空時沒有「請先指定全集」的專門提示。
- 操作成功後的狀態回饋不明確。

### 測驗與學習紀錄

- 測驗結束後已有錯題重做、最近位置、最高分、最近分數與單元完成狀態。
- 清除紀錄已改為刪除後端資料，但尚未提供資料匯出至教師端。

### 介面與可訪問性

- 手機版主要導覽會把文字隱藏，但連結缺少 `aria-label`。
- 頁尾沒有 `developed by Eric Wong`。
- PWA 沒有離線模式提示。
- Venn 圖固定使用同一個 viewBox；元素多時文字可能過長。

## 建議修改方案

1. 擴充題目資料模型：加入題型、難度、提示、Venn 狀態與單元標籤。
2. 新增單元練習路由，每個單元提供至少 5 題；保留綜合練習與總測驗。
3. 在課程頁加入「試一題」入口與常見錯誤提醒。
4. 強化探索器：獨立移除、清空、復原、重新開始、狀態回饋與補集提示。
5. 在同一套集合運算邏輯上加入更完整的單元測試。
6. 增加 AI 生成題目審查／入庫選項、管理員詳細頁與匯出。
7. 補齊頁尾署名、首頁入口、導覽 `aria-label`、離線提示與響應式細節。

## 修改優先級

| 優先級 | 項目 | 原因 |
|--------|------|------|
| 高 | 單元練習與題庫擴充 | 直接影響學習深度 |
| 高 | 錯題重做、學習紀錄與清除流程 | 直接影響學習回饋 |
| 高 | 探索器控制與補集提示 | 直接影響操作正確性 |
| 中 | 首頁與頁尾、無障礙 | 影響體驗與規範 |
| 中 | 離線提示與 PWA 方向 | 補齊離線使用體驗 |
| 低 | Venn 圖文字與版面細節 | 在核心流程完成後驗證 |

## 預估影響範圍

- `src/types.ts`：擴充題目與課程型別。
- `src/data/questions.ts`：擴充題庫與查詢函式。
- `src/data/curriculum.ts`：增加常見錯誤與單元練習對應。
- `src/lib/setMath.ts`：補強補集空全集訊息；不改核心運算結果。
- `src/pages/ExplorerPage.tsx`：增加控制與回饋。
- `src/pages/PracticePage.tsx`、`src/pages/ResultsPage.tsx`、`src/pages/QuizPage.tsx`：增加練習與紀錄流程。
- `src/components/AppShell.tsx`：新增頁尾署名與離線提示。
- `src/components/QuestionRunner.tsx`、`src/components/VennDiagram.tsx`：支援題型展示與返回。
- `src/styles.css`：新增必要樣式與響應式規則。
- `docs/`、`README.md`：更新文件與測試報告。

## 可能風險

- 題庫擴充可能增加資料維護成本，因此統一放在資料檔，不在 UI 內寫題目。
- 新增單元練習路由會改變練習頁行為；保留 `/practice` 仍可直接開始綜合練習。
- `localStorage` 紀錄仍會因清瀏覽器資料或換裝置而遺失，這是產品既有邊界。
- 離線快取無法保證所有網路環境都能更新；因此保留自動更新與離線提示。

## 執行順序

1. 擴充型別與題庫資料。
2. 擴充集合運算與儲存測試。
3. 新增單元練習與課程練習入口。
4. 補強探索器操作。
5. 補強測驗結果、學習結果與錯題重做。
6. 補齊頁尾、首頁、無障礙與離線提示。
7. 執行型別檢查、單元測試、建置、瀏覽器與離線驗證。
8. 更新測試報告、狀態文件與 README。
