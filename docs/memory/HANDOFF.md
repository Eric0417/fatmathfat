---
title: 交接與目前狀態
type: handoff
status: active
tags: [memory, handoff]
created: 2026-09-02
updated: 2026-09-05
---

# 交接與目前狀態

## 摘要

本專案已進入**全棧學校版**：Vite + React + TypeScript 前端，FastAPI + PostgreSQL 後端，Email OTP 登入、學生／管理員角色、學習數據同步與 DeepSeek AI 老師。目前有七個學習單元、八個練習主題、互動 Venn 工具、錯題重做與跨裝置學習紀錄。

## 已完成

- 建立 `docs/memory/` 長期記憶庫結構。
- 完成 `CONVENTIONS.md`，定義本專案 `.md` 檔案的寫法標準。
- 建立專案根 `AGENTS.md`，導引 agent 讀取記憶庫並使用 graph。
- 以 `codebase-memory-mcp` 索引本專案並記錄 ADR。
- 實作靜態前端首版：`Vite + React 19 + TypeScript`、無後端。
- 完成七個學習單元、互動 Venn 圖、元素指派、五種集合運算。
- 完成 10 題練習、12 題綜合測驗、錯題分類與 `localStorage` 本機紀錄。
- 完成單元練習路由與 8 個主題題庫，每個主題至少 5 題。
- 完成題型、難度、提示與 Venn 圖題型資料欄位。
- 完成課程頁「初學者版本／正式定義／常見錯誤／開始練習」流程。
- 完成集合探索器復原、清空、獨立移除與補集提示。
- 從 GitHub `main` 的指針拖拽版本合回拖拽功能，保留復原、清空、題庫與單元練習。
- 完成測驗結果與學習結果頁的錯題重做、最高分、最近分數、單元完成狀態與最近位置。
- 完成全站頁尾 `developed by Eric Wong`、離線提示、手機導覽 `aria-label` 與響應式細節。
- 完成 PWA manifest、service worker 與離線重載驗證。
- 通過 `npm run typecheck`、`npm test`、`npm run build`、Playwright 桌面/手機瀏覽器驗證。
- 新增 FastAPI backend：PostgreSQL 資料模型、Alembic migration、Email OTP、JWT 與 CORS。
- 完成學校郵箱角色規則：`^[0-9]{7}-[0-9]$` 學生，同網域其他信箱自動為老師；外部管理員由預設郵箱與後台白名單控制。
- 完成學習數據 API：最後登入／活動、課程完成度、練習摘要、測驗成績與錯題。
- 完成管理員 API 與 `#/admin`：學生清單、學習數據、教師白名單新增／移除。
- 完成 DeepSeek `deepseek-v4-flash` AI 老師：全站面板、測驗中停用、依弱點生成練習、題目結構與集合運算驗證。
- 修復 AI 老師在非測驗頁被錯誤停用的問題：離開測驗時清除殘留 context，後端只以明確的 `quiz_active` 判斷測驗中。
- 擴充 7 個課程主題教材：每個主題增加最少 3 個例子、4 段詳細說明與 2 條常見錯誤，課程頁改為多例子與詳細說明區塊。
- 完成前端登入、路由保護、角色導覽、AI 面板、練習生成與 API 資料層；舊 `localStorage` 資料未遷移。
- 更新 Render blueprint：新增 `fatmathfat-api`、`fatmathfat-db` 與 `VITE_API_BASE_URL`。
- 完成線上 OTP 寄送：`fatmathfat-api` 升級至 `0.5c-512mb` 後，Gmail SMTP 465 / SSL、Python 3.11.11 已成功寄出驗證碼。
- 通過後端 pytest 13 項、前端 Vitest 12 項、後端 Alembic、前端 build、桌面／手機 Playwright 與離線登入驗證。
- 已將台灣教材用語稽核結果整合到說明文字；CBM 已重新索引至 679 nodes / 1886 edges。
- 已建立獨立部署 workspace `/Users/eric/script/math_website_render`。
- 已在獨立 workspace 新增 pointer-based 元素拖放與 `render.yaml`。
- 建立 GitHub repo `Eric0417/fatmathfat` 並部署 Render static site `fatmathfat`，deploy 狀態為 `live`。
- Render 部署網址：`https://fatmathfat.onrender.com/`。
- 課程教材擴充已推送為 `e643121`，Render static site 已 live；線上 bundle 已確認包含新版例子與詳細說明。
- 已將 Academic Blue 學術視覺同步至 Render 全棧版：淺灰白頁面、白色卡片、深藏青左側導覽、學院藍按鈕與低飽和學術集合圖；登入、API、AI、管理員、資料模型後端與 Render blueprint 未改。
- 已通過 Render workspace 的 `npm run typecheck`、13 項前端測試、production build，並以 mock 登入 State 驗證桌面、平板與手機頁面及登入頁。
- 已強化 AI 老師前端交互：送出後顯示等待狀態與動態點點，回覆以逐字效果顯示並自動捲動；後端 `/api/ai/chat` 與 AI 回覆內容不變。
- 已新增 `AiTeacherPanel.test.tsx`，以 jsdom 與真實 Chrome mock API 驗證等待狀態、停用狀態與回覆呈現。
- 調整學校網域登入規則：任何 `@g.puiching.edu.mo` 信箱都可登入，非學號格式自動以老師身分登入；外部管理員與白名單邏輯維持。
- 通過後端 pytest 14 項、前端 Vitest 13 項、typecheck 與 production build。

## 進行中

- 目前無進行中的功能問題；學校網域教師登入修正已完成，本提交將推送至 GitHub 部署。

## 待辦

- 若要支援描述法轉列舉法，需另存論域（如 `ℤ`、`ℕ`）並建立對應題型。
- 若要支援作業派發、即時在線狀態、AI 對話審查或 AI 題目入庫，需另做資料模型與管理流程。
- 若要支援描述法轉列舉法的實際論域資料模型，需建立 domain 資料結構。

## 給下一個 agent 的提示

- 先讀 `CONVENTIONS.md`，再讀本檔。
- 任何結構性變更都要重新索引 graph；目前 index 已反映新程式碼（690 nodes / 1934 edges），且 D-012 已寫入 ADR。
- 網站需要連線；PWA 靜態資源仍可快取，但未登入或離線時顯示登入頁。
- 目前視覺決策是 D-010「使用 Academic Blue 學術視覺並部署至 Render」；後續視覺調整集中在 `src/styles.css`，不要改回紫色、玻璃或霓虹風格。
- AI 老師目前為前端呈現層強化，決策與範圍記錄為 D-011；DeepSeek 後端與 API 契約未改。
- 學校網域教師登入規則記錄為 D-012；本次修正已加入本提交，推送後由 Render 部署後端服務。
- 後端路由在 `backend/app/routers/`，AI 服務在 `backend/app/services/`，資料庫 migration 在 `backend/alembic/`。
- 前端登入與 API client 在 `src/context/AuthContext.tsx` 與 `src/lib/api.ts`；AI 面板在 `src/components/AiTeacherPanel.tsx`。
- 重大決策已記進 `DECISIONS.md`；結構變更後需重新執行 CBM index 與 ADR。
- 原本的 `math_website` 仍是未初始化 Git 的開發目錄；本期實作與部署修改在 `math_website_render`。
- 本次 Academic Blue 前端改版將推送到 GitHub `main`，由 Render 自動部署 `fatmathfat` static site；後端服務不被修改。
