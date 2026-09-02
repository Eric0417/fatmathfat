---
title: Markdown 檔案寫入慣例
type: convention
status: active
tags: [memory, conventions, markdown]
created: 2026-09-02
updated: 2026-09-02
---

# Markdown 檔案寫入慣例

這份文件是**本專案所有 `.md` 檔案的寫法標準**。任何 agent 或工程師在建立、修改、重新命名或刪除 `.md` 檔案前，都要先讀完它。

## 1. 目的：把記憶寫成「可被未來讀懂」的樣子

`.md` 檔案是長期記憶的載體。寫作的目標不是「記錄」，而是「讓 6 個月後的另一個 agent 只讀這份檔案就能接上」。因此內容要：

- **先給結論**，再給背景。
- **可被搜尋**，所以要有標籤與明確標題。
- **可被串接**，所以要用相對連結串起相關檔案。
- **有狀態**，讓讀者一眼看出舊決定是否仍然有效。

## 2. 檔案命名規則

檔案名稱一律：

- **ASCII**（`a-z`、`0-9`、`-`、`_`）。
- **kebab-case**：小寫、以 `-` 分隔，例如 `setup-memory-library.md`。
- 不含空白、中文、特殊符號，避免路徑與連結問題。

檔案名稱與其內容主題一致；一個主題一個檔案，不要把所有東西塞進同一份。

## 3. Frontmatter（YAML 表頭）

每個 `.md` 檔案在檔案最上方都要有 YAML frontmatter，夾在兩個 `---` 之間。欄位如下：

```yaml
---
title: 檔案標題（必要，可用中文）
type: note                 # note | index | convention | decision | handoff | task
status: active             # draft | active | archived
tags: [memory, tag-a]      # 至少一個；讓檔案可被搜尋
created: 2026-09-02        # 建立日期（YYYY-MM-DD）
updated: 2026-09-02        # 最後更新日期
---
```

規則：

- `title` 必填；型別與用途用 `type` 標記。
- `status` 必填。檔案若過時，改成 `archived`，不要直接刪掉歷史。
- `tags` 至少一個。建議固定有 `memory`，再加上主題標籤。
- `created` / `updated` 必填。改內容時把 `updated` 更新為當天日期。

## 4. 內文結構

用「漏斗式」結構，重要的在前：

1. `#` 一級標題（中文，與 `title` 一致）。
2. 一段 2–3 行的「摘要」，直接說這份檔案在講什麼。
3. 依需要使用 `##` 二級標題組織內容。
4. 用表格呈現有欄位的資訊（如決策比較、檔案清單、任務狀態）。
5. 用清單呈現依序步驟。

避免：

- 一級標題跳到不存在的層級（例如沒有 `##` 直接 `####`）。
- 把完整程式碼貼進記憶檔，除非那是不可替代的摘要。
- 寫「待補」「FIXME」而沒有描述接下來要做什麼。

## 5. 連結與引用

- **檔案對檔案**：用相對路徑的 Markdown 連結，例如 `[HANDOFF.md](HANDOFF.md)`。
- **程式碼**：引用時給專案相對路徑與行號，例如 `src/index.ts:42`，讓讀者能直接定位。
- **外部**：用完整 URL，`(https://example.com)`，不要省略協議。
- 不要用錨點猜測行號；寧可只給檔名。

## 6. 更新規則

- **同一主題**：直接更新既有檔案，不另起新檔。更新時同步改 `updated`。
- **新主題**：新開一檔，遵守命名與 frontmatter。
- **狀態變更**：`decision` 檔案改 `status`，並在 `DECISIONS.md` 補一行。
- **過時**：標 `archived`，保留內容，只加一段「過時因為…」。
- **每次完成工作**：更新 `HANDOFF.md` 的「完成」與「進行中」段落。

## 7. 與 codebase-memory-mcp 同步

`docs/memory/*.md` 是語意記憶，`codebase-memory-mcp` 是結構記憶。兩者都要保持同步：

- 新增或大幅改動結構（新模組、新入口）後，重新索引：`codebase-memory-mcp cli index_repository --repo-path /Users/eric/script/math_website --mode full --persistence false`。
- 重要架構決策，除了寫 `DECISIONS.md`，也寫入 CBM 的 ADR：`codebase-memory-mcp cli manage_adr --project math_website --mode update --content "..."`。
- graph 查詢結果只當做「線索」，重要的斷言仍要對照原始碼。

## 8. 檔案模板

### 決策模板（decision）

```markdown
---
title: 決策標題
type: decision
status: active
tags: [memory, decision]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# 決策標題

## 摘要
一句話說明決策與原因。

## 背景
為什麼需要做這個決定。

## 決定
具體採取的方案。

## 替代方案
被捨棄的方案與理由。

## 影響
對何處造成影響。
```

### 任務模板（task）

```markdown
---
title: 任務標題
type: task
status: draft
tags: [memory, task]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# 任務標題

| 狀態 | 描述 | 備註 |
|------|------|------|
| pending | 尚未開始 |  |
| in_progress | 進行中 |  |
| done | 已完成 |  |
```

> 上面兩組是起點，依實際需求增減欄位與段落。
