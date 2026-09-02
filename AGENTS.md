# AGENTS.md

This is the working guide for agents collaborating on `/Users/eric/script/math_website`.

## Memory system

This project uses a two-layer memory model:

1. **Semantic / long-term memory** lives in [`docs/memory/`](docs/memory/README.md) as Markdown files. This is the source of truth for project state, decisions, architecture, tasks, and reasoning.
2. **Code-structure memory** lives in the `codebase-memory-mcp` graph (call graph, file/package structure, definitions, cross-references). Use it for code discovery and impact analysis.

## Workflow for every step

1. Read this file, then [`docs/memory/README.md`](docs/memory/README.md) to learn the layout.
2. Read [`docs/memory/CONVENTIONS.md`](docs/memory/CONVENTIONS.md) *before writing any `.md` file*. Every `.md` file in this repo must follow it.
3. Read [`docs/memory/HANDOFF.md`](docs/memory/HANDOFF.md) to load the current state.
4. Prefer the `codebase-memory-mcp` graph tools (`search_graph`, `trace_path`, `get_code_snippet`, `query_graph`, `get_architecture`) for code structure queries. Fall back to `rg`/file read on reported coverage gaps.
5. After finishing work, update [`docs/memory/HANDOFF.md`](docs/memory/HANDOFF.md) and, if a decision changed, [`docs/memory/DECISIONS.md`](docs/memory/DECISIONS.md).

## Rules of thumb

- Never overwrite or delete existing memory files without a stated reason.
- Make surgical changes; each changed line should trace to the task.
- Keep `.md` memory content in Traditional Chinese, filenames ASCII/kebab-case.
- Sync meaningful state changes to `codebase-memory-mcp` (`index_repository`, `manage_adr`) as well as to `docs/memory/`.
