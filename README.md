---
title: 集合好好學
type: note
status: active
tags: [memory, readme, math-website]
created: 2026-09-03
updated: 2026-09-04
---

# 集合好好學

「集合好好學」是一個給學校學生與集合初學者使用的繁體中文學習網站。網站以 Vite + React 呈現集合概念、Venn 圖、集合運算、單元練習、測驗與學習紀錄；後端使用 FastAPI + PostgreSQL 保存登入、學習數據與管理員資料，並以 DeepSeek 提供全站 AI 老師。

## 技術架構

- Vite + React 19 + TypeScript
- FastAPI + SQLAlchemy + Alembic
- PostgreSQL（Render）與 SQLite（本機測試）
- Email OTP 登入 + JWT 會話
- DeepSeek `deepseek-v4-flash` AI 老師
- 原生 hash routing、單一 CSS、無 UI 框架
- `src/lib/setMath.ts`：集合運算與圖形區域邏輯
- `src/lib/api.ts`：後端 API client
- `src/data/questions.ts`：題庫、題型、難度與單元查詢
- `src/data/curriculum.ts`：教材與單元資料
- `vite-plugin-pwa` + Workbox：PWA 離線快取
- Vitest：集合運算、儲存、題庫與前端邏輯測試
- pytest：後端驗證碼、角色、學習資料、管理員與 AI 題目測試
- Playwright Core：登入後桌面與手機瀏覽器驗證

## 本機啟動

先啟動後端：

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env
# 設定 DATABASE_URL、JWT_SECRET、GMAIL_APP_PASSWORD、EMAIL_FROM、DEEPSEEK_API_KEY
.venv/bin/alembic upgrade head
.venv/bin/uvicorn app.main:app --reload --port 8000
```

再啟動前端：

```bash
npm install
npm run dev
```

預設網址為 `http://127.0.0.1:5173`。Vite 會在開發模式把 `/api` proxy 到 `http://127.0.0.1:8000`；網站使用 hash routing，可直接開啟如 `http://127.0.0.1:5173/#/lessons/set`。

## 測試與建置

```bash
npm run typecheck
npm test
npm run build
cd backend && .venv/bin/python -m pytest
```

瀏覽器驗證需要先啟動 dev server，且本機需有 Google Chrome：

```bash
npm run dev -- --host 127.0.0.1
TEST_TOKEN=<管理員 JWT> npm run test:browser
```

瀏覽器驗證會以本地測試建置的 JWT 進入網站；正式使用者的登入流程仍由 `#/login` 的 Email OTP 完成。

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
| `#/login` | Email 驗證碼登入 |
| `#/` | 首頁與學習入口 |
| `#/lessons` | 課程單元列表 |
| `#/lessons/:id` | 單元教材 |
| `#/explorer` | 集合操作工具與 Venn 圖 |
| `#/practice` | 綜合練習 |
| `#/practice/:topic` | 單元練習 |
| `#/quiz` | 12 題總測驗 |
| `#/results` | 學習結果與單元進度 |
| `#/admin` | 管理員學生數據與管理員白名單 |

集合探索器同時支援點選指派，以及將元素拖拽到 A、B、交集或 U 外。全站提供 AI 老師浮動面板，測驗進行中會停用。

## 連線與登入

學生郵箱必須符合 `7 位數字-1 位數字@g.puiching.edu.mo`；管理員使用白名單郵箱。網站需要連線才能登入、同步學習紀錄與使用 AI 老師。Service Worker 只快取靜態資源，登入後若離線會回到登入頁。

## 部署

部署使用 `render.yaml` 藍圖，包含：

- `fatmathfat-api`：FastAPI backend + PostgreSQL
- `fatmathfat`：Vite static site
- `fatmathfat-db`：Render PostgreSQL database

在 Render 環境變數中設定 `JWT_SECRET`、`ADMIN_EMAILS`、`GMAIL_APP_PASSWORD`、`EMAIL_FROM`、`DEEPSEEK_API_KEY` 等值；生產 API 網址為 `https://fatmathfat-api.onrender.com`。前端靜態站須設定 `VITE_API_BASE_URL`。

## 文件

- `docs/IMPROVEMENT_PLAN.md`：改善計畫、風險與執行順序
- `docs/IMPLEMENTATION_STATUS.md`：功能與離線狀態
- `docs/TEST_REPORT.md`：測試範圍與結果
- `docs/memory/`：長期記憶庫、架構、決策與交接狀態
