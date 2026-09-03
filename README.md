---
title: 集合好好學
type: note
status: active
tags: [memory, readme, math-website]
created: 2026-09-03
updated: 2026-09-03
---

# 集合好好學

「集合好好學」是一個給高一學生與集合初學者使用的免登入靜態網站，以繁體中文呈現集合概念、Venn 圖、集合運算、單元練習與本機學習紀錄。所有資料與成績都留在目前瀏覽器裝置中，不需要後端、帳號或教師管理系統。

## 技術架構

- Vite + React 19 + TypeScript
- 原生 hash routing
- 單一 CSS，無 UI 框架
- `src/lib/setMath.ts`：集合運算與圖形區域邏輯
- `src/lib/storage.ts`：`localStorage` 本機紀錄
- `src/data/questions.ts`：題庫、題型、難度與單元查詢
- `src/data/curriculum.ts`：教材與單元資料
- `vite-plugin-pwa` + Workbox：PWA 離線快取
- Vitest：集合運算、儲存、題庫測試
- Playwright Core：桌面與手機瀏覽器驗證

## 本機啟動

```bash
npm install
npm run dev
```

預設網址為 `http://127.0.0.1:5173`。網站使用 hash routing，可直接開啟如 `http://127.0.0.1:5173/#/lessons/set`。

## 測試與建置

```bash
npm run typecheck
npm test
npm run build
```

瀏覽器驗證需要先啟動 dev server，且本機需有 Google Chrome：

```bash
npm run dev -- --host 127.0.0.1
npm run test:browser
```

離線驗證需先執行 production preview：

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
npm run test:offline
```

目前 `package.json` 沒有 `lint` script，也未安裝 ESLint。

## 主要頁面

| 路由 | 內容 |
|------|------|
| `#/` | 首頁與學習入口 |
| `#/lessons` | 課程單元列表 |
| `#/lessons/:id` | 單元教材 |
| `#/explorer` | 集合操作工具與 Venn 圖 |
| `#/practice` | 綜合練習 |
| `#/practice/:topic` | 單元練習 |
| `#/quiz` | 12 題總測驗 |
| `#/results` | 本機學習結果與單元進度 |

集合探索器同時支援點選指派，以及將元素拖拽到 A、B、交集或 U 外。

## 離線使用

第一次在網路環境中載入後，Service Worker 會快取必要資源。之後即使沒有網路，仍可閱讀教材、操作集合工具、進行練習與測驗，並把學習紀錄儲存在目前裝置。網路中斷時頁面會顯示離線提示。

## 部署

這是一個純靜態網站，沒有環境變數或 API key。部署時可執行：

```bash
npm run build
```

將 `dist/` 目錄作為靜態網站根目錄發布即可。若是 Render Static Site，Build Command 使用 `npm run build`，Publish directory 使用 `dist`。

## 文件

- `docs/IMPROVEMENT_PLAN.md`：改善計畫、風險與執行順序
- `docs/IMPLEMENTATION_STATUS.md`：功能與離線狀態
- `docs/TEST_REPORT.md`：測試範圍與結果
- `docs/memory/`：長期記憶庫、架構、決策與交接狀態
