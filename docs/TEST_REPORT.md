---
title: 集合好好學測試報告
type: note
status: active
tags: [memory, test-report, math-website]
created: 2026-09-03
updated: 2026-09-03
---

# 集合好好學測試報告

## 摘要

最終驗證以現有 `package.json` 中的指令為主。專案沒有 ESLint 設定或 `lint` script，因此未執行 `npm run lint`；其餘型別檢查、單元測試、production build、瀏覽器流程與離線重載均已通過。

## 執行結果

| 指令 | 結果 | 說明 |
|------|------|------|
| `npm run typecheck` | 通過 | `tsc -b`，無 TypeScript 錯誤。 |
| `npm test` | 通過 | 3 個測試檔、16 個測試全數通過。 |
| `npm run build` | 通過 | Vite production build 成功；PWA 預快取 18 個資源。 |
| `npm run test:browser` | 通過 | 桌面與手機 Chrome 驗證，無 console error、無水平溢出。 |
| `npm run test:offline` | 通過 | production preview 下 service worker 控制與離線重載成功。 |
| `npm run lint` | 未提供 | `package.json` 沒有對應 script，也未安裝 ESLint。 |

## 單元測試涵蓋

### 集合運算

- 交集、聯集、`A − B`、`B − A`。
- 補集，含無全集提示。
- 空集合、重複元素移除、元素排序穩定。
- 元素順序不同仍視為相同集合。
- 子集合、真子集合與集合相等。
- Venn 區域分類與運算結果。

### 本機儲存

- 測驗歷史最新在前。
- 完成單元不重複儲存。
- 最近學習位置保存。
- `clearAllProgress` 同時清除測驗與單元進度。
- 格式錯誤的舊資料不會使應用崩潰。

### 題庫

- 題目 ID 唯一，每個答案都存在選項中。
- 每個主題至少 5 題。
- 每個課程單元至少 5 題。
- 總測驗至少 10 題，且題目不重複。

## 瀏覽器驗證

- 桌面首頁、課程、探索器、單元練習、測驗與學習結果可正常載入。
- 首頁包含「學習結果」入口、免登入說明與本機儲存說明。
- 頁尾在桌面與手機均完全顯示 `developed by Eric Wong`。
- 手機導覽連結具有 `aria-label`。
- 課程頁提供「開始練習」入口。
- 探索器加入元素後可用「復原」回到上一步；元素可從 U 移除。
- 練習答題後顯示回饋；單元練習路由可正常載入。
- 測驗完成後可進入錯題重做並返回結果。
- 測驗結果與學習結果頁均顯示建議重學內容。
- 學習結果頁顯示最近分數、最高分、完成單元、最近學習位置與錯題重做。
- 桌面、手機首頁、探索器、練習頁均無水平溢出。

## 離線驗證

1. 啟動 production build 的 `vite preview`。
2. 第一次載入後等待 service worker 就緒。
3. 將瀏覽器切為離線並重新載入網站。
4. 確認首頁仍然渲染、探索器可開啟、頁尾存在，且沒有 console error。

結果：通過。
