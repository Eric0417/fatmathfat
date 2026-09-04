---
title: 集合好好學測試報告
type: note
status: active
tags: [memory, test-report, math-website]
created: 2026-09-03
updated: 2026-09-04
---

# 集合好好學測試報告

## 摘要

最終驗證以現有 `package.json` 與 `backend/` 測試為主。專案沒有 ESLint 設定或 `lint` script，因此未執行 `npm run lint`；其餘型別檢查、前端單元測試、後端 pytest、production build、瀏覽器流程與離線登入驗證均已通過。

## 執行結果

| 指令 | 結果 | 說明 |
|------|------|------|
| `npm run typecheck` | 通過 | `tsc -b`，無 TypeScript 錯誤。 |
| `npm test` | 通過 | 4 個測試檔、12 個測試全數通過。 |
| `npm run build` | 通過 | Vite production build 成功；PWA 預快取 18 個資源。 |
| `backend/.venv/bin/python -m pytest` | 通過 | 後端 13 個測試全數通過。 |
| `npm run test:browser` | 通過 | 登入 token 下桌面與手機 Chrome 驗證，含管理員與 AI 面板。 |
| `npm run test:offline` | 通過 | production preview 下離線重新載入會顯示登入頁。 |
| `npm run lint` | 未提供 | `package.json` 沒有對應 script，也未安裝 ESLint。 |

## 單元測試涵蓋

### 集合運算

- 交集、聯集、`A − B`、`B − A`。
- 補集，含無全集提示。
- 空集合、重複元素移除、元素排序穩定。
- 元素順序不同仍視為相同集合。
- 子集合、真子集合與集合相等。
- Venn 區域分類與運算結果。

### 舊版資料與 API client

- 前端已移除舊 `localStorage` 學習資料模組；瀏覽器中的舊資料保留但不遷移。
- API client 只保存登入 token，不保存學習紀錄。
- 學習資料讀寫改由後端 API 驗證，且後端測試涵蓋進度、測驗與管理員查詢。

### 後端認證與學習資料

- 學生郵箱格式、非白名單郵箱拒絕與管理員白名單。
- OTP 取得、驗證、過期、次數限制與管理員角色。
- Resend API 優先使用；Gmail API 在 `EMAIL_FROM` 為空時讀取 OAuth 授權後儲存的寄件郵箱。
- Gmail SMTP 465 / SSL 在沒有 Google Client Secret 時仍可寄送。
- 管理員 API 權限、管理員新增／移除。
- 學習資料 API：課程完成、練習摘要、測驗結果與最後活動。

### AI 老師

- 測驗進行中禁止 AI。
- DeepSeek 回應 JSON 解析與錯誤處理。
- 生成題目白名單、選項唯一性、答案包含性與集合運算驗證。
- 不合法的生成題目會被後端拒絕。

### 題庫

- 題目 ID 唯一，每個答案都存在選項中。
- 每個主題至少 5 題。
- 每個課程單元至少 5 題。
- 總測驗至少 10 題，且題目不重複。

## 瀏覽器驗證

- 桌面首頁、課程、探索器、單元練習、測驗與學習結果可正常載入。
- 首頁包含「學習結果」入口、登入狀態與同步說明。
- 頁尾在桌面與手機均完全顯示 `developed by Eric Wong`。
- 手機導覽連結具有 `aria-label`。
- 課程頁提供「開始練習」入口。
- 7 個課程主題逐一驗證：每頁至少 3 個例子、4 段詳細說明、2 條常見錯誤。
- 探索器加入元素後可用「復原」回到上一步；元素可從 U 移除。
- 探索器實際拖拽元素到 A 區域後，Venn 圖與元素狀態同步更新。
- 練習答題後顯示回饋；單元練習路由可正常載入。
- 測驗完成後可進入錯題重做並返回結果。
- 測驗結果與學習結果頁均顯示建議重學內容。
- 學習結果頁顯示最近分數、最高分、完成單元、最近學習位置與錯題重做。
- 管理員後台顯示學生清單、管理員白名單與學習數據表格。
- AI 老師浮動面板可在桌面開啟且輸入框正常渲染。
- 測驗結束並跳到其他頁面後送出 AI 問題，請求的 `quiz_active=false`，且無殘留 `/quiz` context。
- 桌面、手機首頁、探索器、練習頁均無水平溢出。

## 離線驗證

1. 啟動 production build 的 `vite preview`。
2. 第一次載入後等待 service worker 就緒。
3. 將瀏覽器切為離線並重新載入網站。
4. 確認網站回到登入頁，未繞過登入與 API 保護。

結果：通過。

線上 OTP 在 Render `0.5c-512mb`、Python 3.11.11、`SMTP_PORT=465` 與既有 Gmail secrets 下回傳 `200`，日誌為 `POST /api/auth/request-code HTTP/1.1 200 OK`，且無新的寄信逾時記錄。
