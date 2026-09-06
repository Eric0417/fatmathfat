---
title: 決策紀錄
type: decision
status: active
tags: [memory, decisions]
created: 2026-09-02
updated: 2026-09-07
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

**目前狀態：** 學校網域教師登入規則由 D-012 調整。

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

**目前狀態：** `fatmathfat-api` 已升級至 `0.5c-512mb`，Python 3.11.11 與 Gmail SMTP 465 已部署；D-014 已移除公開 Gmail OAuth 授權流程，寄件只保留 Gmail SMTP 與 Resend API。

## D-009 AI 測驗停用狀態以明確旗標為準

**狀態：** archived

**決定：** 後端只在 `AiChatRequest.quiz_active=true` 時拒絕 AI，不能從 UI 殘留的 `context.route=/quiz` 與 `question_id` 推斷測驗中。前端離開 `QuestionRunner` 時同時清除 `quizActive` 與 AI context。

**理由：** 使用者完成測驗並離開後，全域 context 的舊值仍可能被送出，導致明明不在測驗中卻得到「測驗進行中」的錯誤。

**替代方案：** 只在前端清 context，不修改後端──仍可能因其他呼叫或舊請求送出不完整狀態；只改後端不清理前端──較易留下錯誤展示。

**影響：** AI 測驗保護由明確的請求旗標負責；`do not answer during quiz` 的系統提示仍保留。

**過時因為：** D-014 改為伺服器測驗 session；後端不再信任客戶端 `quiz_active`。

## D-010 使用 Academic Blue 學術視覺並部署至 Render

**狀態：** active

**決定：** 在 Render 全棧版前端同步 Academic Blue 視覺：淺灰白頁面、白色卡片、深藏青左側導覽、學院藍主色、低飽和陶土色與學術集合圖。保留登入、角色導覽、AI 老師、管理後台、API client 與所有互動。

**理由：** 數學學習網站需要專業、理性、清晰且適合長時間閱讀，不適合遊戲、社交或霓虹科技風格。

**替代方案：** 保留舊視覺或只改開發版不部署。舊視覺不符合使用者方向；只改開發版不會讓線上網站更新。

**影響：** 只修改 Render workspace 的前端樣式、首頁 icon 結構、PWA 顏色與品牌資產；後端、資料庫、API、`render.yaml`、部署或環境變數不變。提交至 GitHub `main` 後由 Render blueprint 部署 static site；`fatmathfat-api` 程式碼未動。

## D-011 強化 AI 老師前回答互動

**狀態：** active

**決定：** 在不修改 DeepSeek 後端或 `/api/ai/chat` 契約的前提下，增加 AI 老師的等待、動態提示與回應呈現。送出問題後輸入區顯示「AI 正在整理回答」、對話區顯示動態點點；收到 API 回覆後以短暫逐字效果呈現，並自動捲動到最新訊息。回應內容仍完全來自後端。

**理由：** 原本只有 loading 與 disable 狀態，學生不易判斷 AI 是否仍在處理；新增視覺節奏能減少等待不安，也不會改變數學回答或 API 邏輯。

**替代方案：** 改接 streaming API 或修改後端回應格式。需要新增後端協定且會擴大改動範圍；目前需求可由前端呈現層完成。

**影響：** 修改 `src/components/AiTeacherPanel.tsx`、`src/styles.css`，新增 `AiTeacherPanel.test.tsx`；後端、資料庫、環境變數與 API response model 不變。

## D-012 學校網域教師免白名單自動登入

**狀態：** active

**決定：** `@g.puiching.edu.mo` 與 `@puiching.edu.mo` 網域開放登入。符合學號格式者維持學生角色，`@puiching.edu.mo` 教師郵箱及其他學校網域非學號信箱自動以老師身分登入；外部管理員仍以 `ADMIN_EMAILS` 與後台白名單授權。

**理由：** 學校同時存在 `@g.puiching.edu.mo` 教師帳號與 `@puiching.edu.mo` 行政/教師郵箱。原本只允許 `g.` 子網域，會讓根網域教師郵箱在寄送驗證碼前就被拒絕；學校網域本身已是清楚的學校成員信任邊界，不需逐人手動新增。

**替代方案：** 繼續由管理員逐一新增老師信箱。會增加管理者負擔，也直接造成目前的老師無法登入。

**影響：** 修改 `backend/app/auth.py`、登入頁提示與相關文件；無資料庫 migration。學號信箱角色不變，`@puiching.edu.mo` 教師郵箱擁有老師權限，既有 `@g.puiching.edu.mo` 非學號信箱仍保留老師權限。

## D-013 非學生格式郵箱改用診斷信相同的 text/plain 寄送

**狀態：** active

**決定：** 符合學生格式的郵箱保留 multipart/alternative；其他非學生格式郵箱使用單一 `text/plain` 郵件，和可成功送達的診斷信完全相同。Gmail SMTP、Gmail API 與 Resend 路徑都支援 plain-only。

**理由：** 實際驗證顯示教師信箱能收到純文字診斷信，但 multipart/alternative 的正式驗證碼郵件仍未送達；因此非學生格式郵箱必須完全改用 plain text，不能只附加文字版。

**替代方案：** 只保留 multipart/alternative——已在線上驗證無效；全部改為 plain text——會改變學生郵件格式，且不符合「只針對非學生格式」的需求。

**影響：** 修改 `backend/app/services/emailer.py`、`backend/app/routers/auth.py` 與測試；無資料庫 migration。教師/管理員郵件使用純文字，學生郵件維持原格式。

**目前狀態：** `eb7047b` 已部署至 Render；寄件來源為 `bot012223333@gmail.com`，教師驗證碼 MIME 已確認是單一 `text/plain`。

## D-014 採用伺服器測驗 session 與安全硬化

**狀態：** active

**決定：** 移除公開 Google OAuth authorize/callback 端點與 Gmail API credential 覆寫路徑；OTP 增加 IP、email 與全局限流；測驗改為伺服器 session，並由後端根據固定題庫重新計算測驗分數；前端與 API 增加安全 headers，JWT 有效期降為 60 分鐘。

**理由：** PentAGI 安全評估發現公開 OAuth callback 可能覆寫寄件身份、`quiz_active` 可由客戶端偽造、OTP 可被濫用，且測驗分數由客戶端提交。伺服器 session 與後端計分可消除最直接的身份與資料完整性風險。

**替代方案：** 僅在前端隱藏 AI 按鈕或維持客戶端分數——無法阻止修改請求；保留 Gmail OAuth——持續暴露高風險 callback；改用完整 HttpOnly cookie session——改動較大，留待下一輪。

**影響：** 新增 `quiz_sessions` migration、`/api/quiz/*` 路由、`quiz_bank.py` 與 `rate_limit.py`；前端 `QuizPage`、`QuestionRunner`、`AiTeacherContext` 與 `AiTeacherPanel` 改用 `quiz_session_id`；`/api/progress/quiz` 只接受 answers 並由後端計分。

## D-015 手機與平板採用觸控優先的響應式介面

**狀態：** active

**決定：** 手機改用固定底部導覽，標籤與圖示同時顯示並維持至少 44px 點擊區；平板橫向與小尺寸桌面在 1180px 以下改用頂部導覽，避免左側欄過度壓縮內容。課程單元清單在 820px 以下改成可橫向捲動的 snap 清單；集合工具改掉固定最小欄寬，避免 iPad 橫向溢出。AI 老師面板在手機上移到底部導覽上方，並加入安全區域留白。

**理由：** 原本 320px 手機的導覽會折成兩列、課程頁橫向溢出 74px，iPad 橫向集合工具溢出 191px；純靠既有斷點不足以處理教師多一個「管理」入口與觸控操作。底部導覽符合手機慣用操作，水平 unit rail 能讓學生先看到教材，而不是先滑過七個單元。

**替代方案：** 只縮小字體與隱藏標籤，或繼續使用頂部 icon 導覽。前者無法解決 7 個入口與長內容；後者在手機上缺少可發現性，且 320px 仍可能折行。

**影響：** `AppShell` 新增手機導覽與手機登出，`src/styles.css` 新增 touch-first refinement；瀏覽器驗證加入 320px、1024px、登入頁、AI 面板與手機集合操作。後端、資料模型、API、`render.yaml` 與 PWA 設定不變。

## D-016 採用 S4／S5 年級分類與 S5 直線坐標幾何

**狀態：** active

**決定：** 在 `math_website_render` 加入 `GradeLevel = 'S4' | 'S5'`。學生於 Email OTP 登入時必須選擇年級，之後可透過 `PATCH /api/auth/grade` 切換；教師不選年級，管理頁可看到所有年級。現有集合課程標記為 S4，新增照片整理出的 S5「直線坐標幾何」課程、練習、測驗與可拖動直線實驗室。

**理由：** 不同年級需要不同課程、題庫與工具。目前登入、學習數據、測驗 session 與管理後台都在全棧工作區，因此年級應成為帳號與測驗資料的第一級分類，而不是只在前端切換視覺。

**替代方案：** 只在 localStorage 切換年級 —— 換裝置或重新登入會遺失，也無法讓教師統計；把 S5 內容混入同一組課程 —— 學生容易看到不屬於自己的教材；直接改開發目錄靜態版 —— 那裏沒有登入與後端同步能力。

**影響：** 新增 `users.grade_level`、`quiz_sessions.grade_level`、`quiz_attempts.grade_level` migration；新增 `contentRegistry`、`s5Curriculum`、`s5Questions`、`coordinateMath`、`CoordinateLineLab` 與 `#/s5-lab`。S4 AI 老師不變，S5 v1 隱藏 AI 老師與 AI 生成練習。原始 JPEG 不提交，OCR Markdown 存放於 `content/s5/ocr/`。

## D-017 非學生 OTP 寄件增加預設寄件者 fallback

**狀態：** active

**決定：** 非學生帳號寄送驗證碼時，先嘗試既有的 `TEACHER_EMAIL_FROM`／`TEACHER_GMAIL_APP_PASSWORD`；若失敗，再以一般 `EMAIL_FROM`／`GMAIL_APP_PASSWORD` 使用單一 `text/plain` 重試。只有兩者都失敗才回傳 `503`。

**理由：** 線上教師寄件帳號失效時，所有管理員都會因單一寄件路徑失敗而無法登入；一般學生寄件帳號仍在正常運作，適合當作即時備援。仍保留純文字格式，不回到先前教師郵件無法送達的 multipart 路徑。

**替代方案：** 要求手動更換教師 app password，會讓管理員登入繼續中斷；完全取消教師專用寄件者，會忽略既有教師郵件相容性決策。

**影響：** 修改 `backend/app/routers/auth.py` 與 auth 測試；無資料庫 migration。線上已以 `imwong@g.puiching.edu.mo` 驗證 request-code 回傳 `200`。

## D-018 管理員學生清單加入 S4／S5 年級篩選

**狀態：** active

**決定：** 管理頁仍一次取得所有學生，但新增「全部／S4／S5」年級篩選與各年級人數。預設顯示全部，切換後只列出對應年級；未指定年級只會出現在「全部」。

**理由：** 學生成長後，單一混合清單不易讓管理員檢查不同年級的學習狀況；顯式篩選比只加一個年級欄位更容易使用，也避免要求教師切換自己的年級身份。

**替代方案：** 依教師自身年級限制管理頁 —— 會讓教師看不到其他年級；另建後端分頁 —— 目前學生規模不需要。

**影響：** 修改 `src/pages/AdminPage.tsx`、`src/styles.css` 與管理頁測試；後端 `/api/admin/students` 仍回傳全部學生，無 API 或資料庫變更。

## D-019 教師可切換 S4／S5 檢視並啟用 S5 AI 老師

**狀態：** active

**決定：** 教師帳號不寫入伺服器年級，而是在前端以 `GradeViewContext` 保存「目前檢視年級」，並加入 S4／S5 切換。S5 也顯示 AI 老師與 AI 生成練習；後端依 context 的 `grade_level`、route 與 topic 動態切換集合或直線坐標幾何提示詞。S5 課程增加解題策略、應用情境、公式速查與更多挑戰題。

**理由：** 管理員需要親自瀏覽與驗證 S5 內容，卻不應被永久標記為某年級學生。教師檢視年級只需前端狀態，學生年級仍由伺服器保存。S5 若沒有 AI，老師就無法用現有 AI 老師輔助課程。

**替代方案：** 給教師新增資料庫年級欄位 —— 會混淆「學生年級」與「教師檢視偏好」；維持 S5 無 AI —— 無法滿足教師與學生的輔導需求。

**影響：** 新增 `src/context/GradeViewContext.tsx`；AppShell 對所有登入者顯示年級切換；AI validator、router 與 schema 支援 S5 topics/kinds/tags；S5 curriculum、questions、lesson UI、line lab 與瀏覽器驗證同步擴充。無資料庫 migration。

## D-020 定比分點 λ 使用平滑滑桿與自訂範圍

**狀態：** active

**決定：** S5 直線實驗室的 λ 改為動態步距滑桿，預設範圍 `−5 ≤ λ ≤ 5`，使用者可分別調整下限與上限，也可直接輸入精確數值。當 λ = −1 時顯示「未定義」而不是繪出錯誤的定比分點。

**理由：** 原本固定 `step=0.5` 使滑桿跳動感明顯；教學上也需要探索更廣或更窄的 λ 範圍，以及準確測試 λ = −1 的無定義特例。

**替代方案：** 只把 step 改成更小值 —— 能改善順滑度，但無法讓使用者自訂範圍；改用純數字輸入 —— 失去視覺拖動觀察。

**影響：** 修改 `CoordinateLineLab`、其元件測試與 S5 browser verification；無後端或資料庫變更。

## D-021 清除 S5 殘留集合視覺並強化年級切換辨識

**狀態：** active

**決定：** S5 所有課程都使用 `CoordinateLineLab`，不再顯示任何 Venn 圖。S4／S5 切換按鈕加入不同圖示與顏色：S4 用學院藍、S5 用陶土色，並提供明確的 `aria-label` 與 `data-grade`。S5 每課新增可展開的情境挑戰。

**理由：** S5 前三課原先在 `lesson.gradeLevel === 'S5'` 分支之外仍落入 Venn fallback，造成集合內容混入直線課程；兩個年級按鈕共用同一主色也難以快速辨識。

**替代方案：** 只在 CSS 隱藏 Venn —— 無法解決語意錯誤與可維護性；只改文字顏色 —— 辨識度仍不足。

**影響：** 修改 `LessonsPage`、`AppShell`、S5 curriculum/types、styles 與 S4/S5 browser verification。無後端或資料庫變更。

## D-022 S4／S5 內容一致性、數學正確性與課程深度修復

**狀態：** active

**決定：** 將全站產品名改為中性的「數學好好學」，S4 使用集合圖示與副標，S5 使用直線幾何圖示與副標。S5 每課使用專屬視覺，不再把同一套完整直線實驗室重複嵌入所有課程；修正截距式、平行／重合、三點面積、法線式符號、定比分點定義等數學文字。S5 範例與挑戰加入逐步解題。綜合練習改為每主題至少一題，後端 AI 生成 S5 題目必須通過可解析題型的數學校驗。

**理由：** 使用者發現 S5 有 S4 品牌與圖形殘留，且課件深度不足、部分定義有數學矛盾；只補字數無法解決正確性與年級隔離問題。

**替代方案：** 保留原產品名並只改副標 —— 仍會讓 S5 顯示集合品牌；只在前端隱藏 S4 圖 —— 無法解決課程視覺與數學內容；只擴充 AI prompt —— 無法阻止 AI 生成錯誤答案。

**影響：** 修改 `AppShell`、`LoginPage`、PWA metadata、S5 curriculum/types、`S5LessonVisual`、`CoordinateLineLab`、`contentRegistry`、`question_validator.py` 與 S4/S5 browser verification。無資料庫 migration。
