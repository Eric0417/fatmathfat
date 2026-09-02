---
title: 架構
type: note
status: active
tags: [memory, architecture]
created: 2026-09-02
updated: 2026-09-02
---

# 架構

## 摘要

本目錄是獨立部署 workspace。應用本身是免登入、離線優先的靜態前端應用，資料、題目與學習紀錄都在瀏覽器端處理，沒有後端服務。

## 技術選型

| 層 | 選項 | 原因 |
|------|------|------|
| 建置 | Vite + TypeScript | 啟動快、離線產物簡單、型別檢查方便 |
| UI | React 19 + CSS | 以資料驅動同步圖形與文字，不需過度框架 |
| 圖形 | SVG/CSS Venn 圖 | 小、容易離線、可靜態高亮 |
| 儲存 | `localStorage` | 紀錄量小、免登入、平板操作直覺 |
| 離線 | PWA + Workbox | 支援首屏快取、manifest 與離線重載 |
| 測試 | Vitest + Playwright Core | 覆蓋集合運算、儲存與真實瀏覽器流程 |

## 目錄

- `src/lib/`：集合運算與儲存邏輯。
- `src/data/`：課程與題目資料。
- `src/components/`：共用 shell、Venn 圖、題目流程。
- `src/pages/`：首頁、課程、工具、練習、測驗、結果。
- `public/`：PWA icon、favicon、manifest 資源。
- `render.yaml`：Render static site 的建置、發布路徑與路由設定。

## 目前範圍

- 元素限定為有限整數。
- 主要處理 `∈`、`∉`、`⊆`、`⊊`、`=`、`∩`、`∪`、差集、補集。
- 不包含帳號、排行、教師後台、多人連線、複雜動畫。
- 補集、差集、反例與描述法轉換屬於課程內容；完整教材擴充尚未納入。

## 已知邊界

- 本機紀錄會因清除瀏覽器資料或換裝置而遺失。
- 描述法的條件目前以文字與例子呈現，尚未建立正式的論域（domain）資料結構。
- 台灣教材常見 `A⊂B`、`A′`、`A^c`、`Ā` 等記號，目前以說明與同義標註處理，主要保留使用者指定的 `⊆`/`⊊`、`Aᶜ`。
- Venn 工具使用 pointer capture 與透明 drop zones 支援桌面與平板拖放。
