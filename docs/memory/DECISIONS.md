---
title: 決策紀錄
type: decision
status: active
tags: [memory, decisions]
created: 2026-09-02
updated: 2026-09-02
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

**狀態：** active

**決定：** 首版使用 Vite + React + TypeScript，加上 PWA service worker，資料與紀錄全部放在瀏覽器端，不建立後端。

**理由：** 目標是平板課堂使用、免登入、離線可用，且首版內容規模不需要伺服器或資料庫。

**替代方案：** Next.js / 後端 API / 帳號系統 —— 會增加部署與權限成本，但沒有對應的學習效益。

**影響：** 部署目標為靜態檔案；課程題目集中放在 `src/data/`，集合運算與儲存邏輯留在 `src/lib/`。

## D-003 保留「⊆ / ⊊」主約定，並標註台灣教材同義記號

**狀態：** active

**決定：** 網站統一使用 `⊆` 表示子集合、`⊊` 表示真子集合，並在說明中標註部分教材的 `A⊂B` 可視為包含相等的同義表示；補集主顯示 `Aᶜ`，同時補充 `A′`、`A^c`、`Ā`。

**理由：** `⊂` 在不同教材中可能代表子集合或真子集合；保持明確主約定能避免題目歧義，同時讓教師容易對照自己在使用的教材。

**替代方案：** 把所有題目改成 `⊂` —— 雖然接近部分台灣教材，但會重新引入歧義。

**影響：** 數學資料模型仍分開保存 subset 與 proper subset；UI 提供中文文字解釋，不能只靠符號表達。

## D-004 建立獨立部署 workspace 並部署為 Render static site

**狀態：** active

**決定：** 將專案複製到 `/Users/eric/script/math_website_render`，建立獨立 Git repo，使用 `render.yaml` 在 Render 建置 `<repo>/dist`。

**理由：** 避免部署設定與 Render service 污染原本的 `math_website` 工作區；靜態 PWA 不需要後端，因此使用 Runtime `static`。

**替代方案：** 直接在原目錄建立 `.git` 並部署 —— 會改變原本 workspace 的版本控制狀態，且不具備獨立性。

**影響：** 後續部署與 drag-and-drop 的修改以 `math_website_render` 為準；Render CLI 會從 GitHub repo 建立 service。

**實現結果：** GitHub repo 為 `https://github.com/Eric0417/fatmathfat`，Render 部署 URL 為 `https://fatmathfat.onrender.com/`，service ID 為 `srv-dac3ilgn74is7391im7g`。舊名稱 `math-website` 與舊網域已由新名稱取代。
