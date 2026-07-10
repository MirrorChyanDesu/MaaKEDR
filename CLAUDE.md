# CLAUDE.md — MaaKEDR AI Agent Guide

This file provides guidance to AI agents when working with this repository. Detailed documentation is in `docs/`.

## Quick Start

```bash
pnpm install              # Install toolchain deps
pnpm check                # Full validation (format + schema + maa + lint)
pnpm exec maa-tools check # Validate pipelines only (faster)
pnpm format               # Format all files
pnpm check:py             # Ruff lint + Pyright type check
```

## Architecture

Three layers: `tasks/*.json` → `pipeline/*.json` → `agent/custom/` (Python).

Pipeline nodes are JSON objects with `recognition` + `action` + `next`. Key fields:

| Field         | Description                                      |
| ------------- | ------------------------------------------------ |
| `recognition` | `OCR` / `TemplateMatch` / `DirectHit` / `Custom` |
| `next`        | OR logic — first matching node wins              |
| `on_error`    | Fallback when recognition fails                  |
| `max_hit`     | Max times this node fires before skipped         |
| `timeout`     | Recognition timeout (ms, default 20000)          |

See `docs/develop/pipeline.md` for patterns and `docs/develop/custom.md` for Agent API.

## Pipeline Files

- `startup.json` — Game launch → login → main interface
- `claim_rewards.json` — Rewards → Battle Pass → Mailbox → Dispatch
- `farm_resources.json` — Resource farming with battle loop + stamina handling

## Critical Rules

1. `[JumpBack]` nodes must NOT have `next` — the prefix handles routing.
2. Task options override pipeline behavior — check `tasks/*.json` for `pipeline_override`.
3. Use `uv run ruff` / `uv run pyright` for Python linting (NOT `pnpm exec`).
4. `custom_recognition_param` is a JSON **string**; `custom_action_param` is a JSON **object**.
5. Insufficient `post_delay` causes stale screenshots. Use 1000-2000ms after navigation clicks.
6. `max_hit` counts cross-session.
7. OCR `expected` is regex, not literal.
8. TemplateMatch threshold defaults to 0.7 from `default_pipeline.json`.

## User Preferences

- **Commit style:** Keep commit messages short and general, not overly detailed.
- **Commit format:** 一句简短但逻辑清晰的话，体现修改的功能和内容（如 `fix: 资源刷取检测锁定后立即停止`）
- **Push only on approval:** Present commit message for review before pushing. Only push when explicitly told to.
- **Do not push unilaterally** after making changes — wait for user confirmation.

## Related Projects & References

- **MaaFramework Documentation:** https://maaframework.github.io/
- **M9A Reference Project:** `G:\M9AA\M9A-pr\55\M9A`
- **create-maa-project Scaffold Tool:** `G:\M9AA\create-maa-project`
- **MaaKEDR交流群 QQ:** 1051890489
- **Repository:** https://github.com/APPLe-DF/MaaKEDR
