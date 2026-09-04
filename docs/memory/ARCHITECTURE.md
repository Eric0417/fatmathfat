---
title: 架構
type: note
status: active
tags: [memory, architecture]
created: 2026-09-02
updated: 2026-09-05
---

# 架構

## 摘要

本專案是一個學校專用的全棧應用。前端為 Vite + React + TypeScript，後端為 FastAPI + PostgreSQL；學生以學校郵箱 OTP 登入，教師／管理員可查看學習數據。網站需要連線，AI 老師由 DeepSeek 提供。

## 技術選型

| 層 | 選項 | 原因 |
|------|------|------|
| 建置 | Vite + TypeScript | 啟動快、離線產物簡單、型別檢查方便 |
| UI | React 19 + CSS | 以資料驅動同步圖形與文字，不需過度框架 |
| 圖形 | SVG/CSS Venn 圖 | 小、容易離線、可靜態高亮 |
| 後端 | FastAPI + SQLAlchemy + Alembic | 提供認證、學習數據與 AI proxy |
| 儲存 | PostgreSQL | 保存帳號、進度、測驗與管理員白名單 |
| 認證 | Email OTP + JWT | 學生格式限定，管理員使用白名單；Gmail SMTP 465 為基礎，Resend API 與 Gmail API 可選 |
| AI | DeepSeek `deepseek-v4-flash` | 答題引導與依弱點生成練習 |
| 測試 | Vitest + pytest + Playwright Core | 覆蓋邏輯、API、登入與瀏覽器流程 |

## 目錄

- `src/lib/`：集合運算與 API client。
- `src/data/`：課程與題目資料。
- `src/components/`：共用 shell、Venn 圖、題目流程。
- `src/pages/`：首頁、課程、工具、練習、測驗、結果。
- `backend/app/`：後端模型、routers、驗證碼、Email、DeepSeek 與題目驗證。
- `backend/alembic/`：資料庫 migration。
- `public/`：PWA icon、favicon、manifest 資源。

路由分為 `#/lessons/:id`、`#/explorer`、`#/practice/:topic`、`#/quiz` 與 `#/results`。題目資料集中於 `src/data/questions.ts`，每個單元至少 5 題，題型與難度以資料欄位描述，避免把大量題目寫入 UI 元件。

## 視覺與互動設計

- 目前使用 Academic Blue：淺灰白頁面、白色卡片、深藏青左側導覽、學院藍主色與低飽和陶土色強調。
- 桌面使用左側導覽，平板與手機切換為頂部導覽；卡片使用輕度陰影、細邊框與 10px 至 14px 圓角。
- Venn 圖使用低飽和 A/B/交集色，保留 SVG 高亮與拖放區。
- 樣式集中在 `src/styles.css`；`backend/`、`render.yaml` 與 API 契約不變。

## 目前範圍

- 元素限定為有限整數。
- 主要處理 `∈`、`∉`、`⊆`、`⊊`、`=`、`∩`、`∪`、差集、補集。
- 已包含學校網域登入、學生／管理員角色、學習數據同步與 AI 老師。
- 不包含作業派發、排行、多人連線與複雜動畫；AI 對話與生成題目不持久化。
- 補集、差集、反例與描述法轉換屬於課程內容；已有基礎教材與題型。
- 測驗、課程完成度、練習摘要與最後活動以後端為準；舊版 `localStorage` 資料保留但不遷移。
- PWA 由 `vite-plugin-pwa` 生成 Workbox service worker；受保護內容需連線，離線時回到登入頁。

## 已知邊界

- 若 Render 資料庫或服務停機，網站無法登入或同步；出現此情況時會顯示錯誤。
- 描述法的條件目前以文字與有限整數例子呈現，尚未建立正式的論域（domain）資料結構。
- 台灣教材常見 `A⊂B`、`A′`、`A^c`、`Ā` 等記號，目前以說明與同義標註處理，主要保留使用者指定的 `⊆`/`⊊`、`Aᶜ`。
