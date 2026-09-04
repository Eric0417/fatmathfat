---
title: 決策紀錄
type: decision
status: active
tags: [memory, decisions]
created: 2026-09-02
updated: 2026-09-04
---

# 決策紀錄

## 摘要

這裡記錄本專案的重大決策。每個決定附上理由、替代方案與影響。

## D-001 採用兩層記憶模型

**狀態：** active

**決定：** 同時使用 `docs/memory/*.md`（語意/長期記憶）與 `codebase-memory-mcp`（程式結構/呼叫圖）兩層記憶。

**理由：** 語意記憶回答「為什麼與現在到哪了」，結構記憶回答「誰呼叫誰與相依性」。兩者資訊型別不同，混合會讓彼此都難維護。

**替代方案：** 只用單一 `AGENTS.md` 容納一切 —— 會隨專案成長而失控；只靠 graph —— 無法保存決策與狀態。

**影響：** 未來 agent 需先讀 `.md` 記憶，再用 graph 做程式結構查詢；兩者都要在有結構變更時同步更新。

## D-002 採用靜態 React/TypeScript PWA

**狀態：** archived

**決定：** 首版使用 Vite + React + TypeScript，加上 PWA service worker，資料與紀錄全部放在瀏覽器端，不建立後端。

**理由：** 目標是平板課堂使用、免登入、離線可用，且首版內容規模不需要伺服器或資料庫。

**替代方案：** Next.js / 後端 API / 帳號系統 —— 會增加部署與權限成本，但沒有對應的學習效益。

**影響：** 部署目標為靜態檔案；課程題目集中放在 `src/data/`，集合運算與儲存邏輯留在 `src/lib/`。

**過時因為：** D-006 已新增 FastAPI + PostgreSQL 後端與登入；靜態前端本身保留，但「不建立後端」不再適用。

## D-003 保留「⊆ / ⊊」主約定，並標註台灣教材同義記號

**狀態：** active

**決定：** 網站統一使用 `⊆` 表示子集合、`⊊` 表示真子集合，並在說明中標註部分教材的 `A⊂B` 可視為包含相等的同義表示；補集主顯示 `Aᶜ`，同時補充 `A′`、`A^c`、`Ā`。

**理由：** `⊂` 在不同教材中可能代表子集合或真子集合；保持明確主約定能避免題目歧義，同時讓教師容易對照自己在使用的教材。

**替代方案：** 把所有題目改成 `⊂` —— 雖然接近部分台灣教材，但會重新引入歧義。

**影響：** 數學資料模型仍分開保存 subset 與 proper subset；UI 提供中文文字解釋，不能只靠符號表達。

## D-004 新增獨立部署 workspace 並部署為 Render static site

**狀態：** active

**決定：** 將原專案複製到 `/Users/eric/script/math_website_render`，在那裡加入 pointer-based 拖曳、建立獨立 Git repo，並使用 `render.yaml` 建置 Render static site。

**理由：** 避免 Render 設定、Git repo 與版本控制狀態污染原本的 `math_website` 開發目錄。

**替代方案：** 直接在原目錄初始化 Git 與部署 —— 沒有獨立性，也會改變原本工作區狀態。

**影響：** GitHub repo 為 `https://github.com/Eric0417/fatmathfat`，Render URL 為 `https://fatmathfat.onrender.com/`；後續部署修改以 `math_website_render` 為準。

## D-005 保留靜態前端架構，以資料擴充補齊學習體驗

**狀態：** active

**決定：** 不重寫 Vite + React + TypeScript 首版，繼續使用資料驅動題庫、hash routing、`localStorage` 與 PWA；在原有 HTML/CSS/元件上補齊單元練習、錯題重做與操作工具。

**理由：** 現有架構能支援完整 MVP，需求主要是課程深度與學習回饋，不需要新增後端、帳號或框架。擴充題庫與控制能力比重做架構更符合「簡單、易維護」。

**替代方案：** 使用 Next.js 或 React Router、建立後端題目管理、引入狀態管理庫 —— 都增加維護成本，但沒有對應的學習效益。

**影響：** 新功能集中在 `src/data/`、`src/lib/` 與既有頁面元件；PWA 仍維持 production-ready；部署仍以 `dist/` 作為靜態網站。

## D-006 加入 FastAPI 後端與學校郵箱 OTP 登入

**狀態：** active

**決定：** 保留原有 Vite + React 前端，新增 FastAPI + PostgreSQL 後端；學生使用 `^[0-9]{7}-[0-9]$@g.puiching.edu.mo` 郵箱 OTP 登入，`wongeric1417@gmail.com` 為第一位管理員，其他教師透過後台白名單加入。

**理由：** 需要全站登入、跨裝置學習數據與管理員檢視，純前端無法安全寄送驗證碼或保存學生資料。

**替代方案：** 繼續使用 `localStorage` 或以 Supabase Auth 取代自建 API —— 無法滿足管理員學習數據；Supabase 會引入額外服務但可行。

**影響：** 網站不再宣稱免登入或離線可用；舊紀錄留於原裝置但不遷移。Render 新增 web service 與 PostgreSQL。

## D-007 使用 DeepSeek 作為全站 AI 老師

**狀態：** active

**決定：** 後端以 DeepSeek `deepseek-v4-flash` proxy 提供全站 AI 面板；測驗進行中禁止使用，課程與練習未作答時只給提示，完成後才解釋答案。依弱點生成練習題必須符合現有 `QuizQuestion` 契約並通過後端驗證。

**理由：** 直接把 API key 放前端會外洩；生成題目若不驗證，AI 可能有數學錯誤或格式錯誤。

**替代方案：** 只做固定提示、不生成新題、或使用其他 AI API —— 會少掉個人化弱點練習或需重新驗證 API。

**影響：** 不保存對話、不保存 AI 生成題目，只保存練習摘要；需要 DeepSeek API key、模型名稱與 Render 環境變數。

## D-008 郵件寄送以 Gmail SMTP 465 為基礎

**狀態：** active

**決定：** 寄送驗證碼採用 Gmail SMTP 465 / SSL，使用 `EMAIL_FROM` 與 `GMAIL_APP_PASSWORD`。Resend API 與 Gmail API 保留為可選路徑，但不需要為寄送驗證碼設定 Google Client Secret 或 redirect URI。

**理由：** 另一個 IELTS Render 專案已驗證 `smtp.gmail.com:465` 可成功寄信；本專案先前的失敗來自 587 / STARTTLS 路徑，而且線上服務未使用 Render blueprint 的 Python 3.11 環境變數。

**替代方案：** 只保留 Resend API——需要額外 key；只保留 Gmail OAuth——需要 Google Cloud OAuth Client 與授權流程。Google Device Flow 不支援 `gmail.send` scope。

**影響：** Render 需設定 `EMAIL_FROM`、`GMAIL_APP_PASSWORD`，並使用 `SMTP_PORT=465`；`GOOGLE_CLIENT_ID` 不是寄送驗證碼的必要條件。線上服務需使用 Python 3.11.11 環境變數。

**目前狀態：** 已部署到 `math_website_render` 並確認 Python 3.11.11，但 `fatmathfat-api`（free plan）連 `smtp.gmail.com:465` 仍逾時；可成功寄信的 IELTS 專案使用 starter plan。若維持 free plan，需改用 Resend API 或 Gmail API。
