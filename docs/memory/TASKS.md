---
title: 任務清單
type: task
status: active
tags: [memory, tasks]
created: 2026-09-02
updated: 2026-09-06
---

# 任務清單

## 摘要

本專案的任務追蹤。新任務加入時遵守 [CONVENTIONS.md](CONVENTIONS.md)。

| 任務 | 狀態 | 備註 |
|------|------|------|
| 建立長期記憶庫 | done | 完成於 2026-09-02 |
| 定義 `.md` 寫作慣例 | done | 完成於 2026-09-02 |
| 索引到 codebase-memory-mcp | done | 完成於 2026-09-02 |
| 定義首版產品範圍 | done | 依附檔規格收斂為有限整數集合 MVP |
| 決定技術棧 | done | Vite + React + TypeScript + PWA |
| 實作首版前端 | done | 課程、Venn 工具、練習、測驗、成績儲存 |
| 驗證首版 MVP | done | 型別、單元測試、build、Playwright、離線重載 |
| 教學用語對照 | done | 已加入宇集／餘集與教材同義記號 |
| 建立獨立部署 workspace | done | 已複製至 `math_website_render` |
| Venn 元素拖放 | done | pointer capture 與 drop zones 已驗證 |
| Render 靜態部署（舊版） | done | 歷史記錄；新全棧版已更新 blueprint，但尚未部署 |
| 單元教材與常見錯誤 | done | 加入初學者版本、正式定義、常見錯誤與練習入口 |
| 題庫與題型擴充 | done | 8 個主題、題型、難度、提示與 Venn 圖題型 |
| 單元練習與綜合練習 | done | `/practice` 與 `/practice/:topic` 路由 |
| 探索器操作強化 | done | 復原、清空、獨立移除、狀態回饋與補集提示 |
| 韋恩圖拖拽恢復 | done | 從 `d3d2913`/GitHub `main` 合回 pointer drag，並通過瀏覽器驗證 |
| 錯題重做與學習紀錄 | done | 測驗/結果頁均可重做錯題；保存最近位置 |
| 頁尾與無障礙 | done | `developed by Eric Wong`、導覽標籤、離線提示 |
| 離線重載驗證 | done | 新增 `test:offline` 並通過 production preview 驗證 |
| FastAPI 後端與資料模型 | done | PostgreSQL、Alembic、OTP、JWT、學習數據與管理員 API |
| 學校郵箱與角色規則 | done | `@g.puiching.edu.mo` 學號為學生；`@puiching.edu.mo` 與 `@g.puiching.edu.mo` 非學號信箱自動為老師；外部管理員使用白名單 |
| 學校網域教師自動登入 | done | `@g.puiching.edu.mo` 非學號信箱與正式 `@puiching.edu.mo` 教師郵箱都能登入並取得老師權限 |
| DeepSeek AI 老師 | done | 全站面板、測驗中停用、依弱點生成練習、題目驗證 |
| 前端登入與角色導覽 | done | `#/login`、路由保護、管理員 `#/admin` |
| AI 生成練習 | done | 不保存題目，保存練習摘要 |
| Render 全棧部署設定 | done | 新增 backend web service 與 PostgreSQL blueprint |
| 郵件供應商支援 | done | Gmail SMTP 465 與 Resend API；D-014 後移除 Gmail API OAuth 路徑 |
| 驗證碼郵件格式 | done | 學生格式保留 multipart/alternative；非學生格式使用單一 `text/plain`，與診斷信一致 |
| Render 線上 OTP 投遞驗證 | done | `eb7047b` live；寄件來源為 `bot012223333@gmail.com`，教師驗證碼 MIME 已確認為單一 `text/plain` |
| AI 老師非測驗停用修正 | done | 離開測驗清除 context；後端只依 `quiz_active` 判斷 |
| 7 主題課程教材擴充 | done | 每主題 3+ 例子、4+ 詳細說明、2+ 常見錯誤 |
| 後端與瀏覽器測試 | done | pytest、Vitest、Playwright 與離線登入驗證 |
| 線上 OTP 寄送 | done | `0.5c-512mb`、Python 3.11.11、Gmail SMTP 465；`/api/auth/request-code` 回傳 200 |
| Academic Blue 前端視覺同步 | done | Render 版改為學術藍風格；保留登入、API、AI、管理員與全棧互動 |
| AI 老師回答互動強化 | done | 加入等待狀態、動態點點、逐字呈現、自動捲動與輸入停用效果 |
| 移除公開 Google OAuth 端點 | done | 刪除 `google/authorize`、`google/callback` 與 Gmail API credential 覆寫 |
| OTP 限流與安全 headers | done | IP、email、全域滑動視窗限流；CSP、frame、referrer、permissions、COOP |
| 測驗伺服器 session | done | 新增 `quiz_sessions`、`/api/quiz/*` 與 server-side AI 測驗檢查 |
| 伺服器計分 | done | `/api/progress/quiz` 只接受 answers，由 `quiz_bank.py` 計算分數與錯題 |
| 安全硬化部署驗證 | done | pytest 21 項、Vitest 13 項、typecheck、build、Alembic upgrade |
| 描述法論域資料模型 | pending | 若要支援描述法轉列舉法，需另存 `domain` |
