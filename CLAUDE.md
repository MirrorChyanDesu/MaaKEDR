# CLAUDE.md — MaaKEDR AI Agent Guide

This file provides guidance to AI agents (Claude Code, Codex CLI, OpenCode, etc.) when working with this repository.

## Project Overview

**MaaKEDR** is a MaaFramework (MaaFW) pipeline-based automation project for the game **雪松 (KEDR)**, scaffolded by `create-maa-project` (https://github.com/APPLe-DF/MaaKEDR). This is a **declarative automation system** — pipelines are defined in JSON, not imperative code. The GUI frontend is **MFAAvalonia** (.NET 10.0 desktop app). Target resolution is **1280x720 (16:9)**, controlled via **ADB** on Android emulators/devices.

### Quick Start for AI Agents

```bash
# Install toolchain deps
pnpm install

# Validate entire project (format + schema + maa check + project lint)
pnpm check

# Validate pipelines only (faster iteration)
pnpm exec maa-tools check

# Format all files
pnpm format:all       # uses pnpm run format internally

# Validate JSON files
python tools/validate_schema.py resource/base/pipeline/
```

### Project Health

```bash
# Run 23-item project health check
create-maa-project --doctor

# View managed-file drift
create-maa-project --diff

# Update schema baseline to latest
create-maa-project --update schema

# Sync metadata (version, name) across interface.json, package.json, maa-project.json
create-maa-project --sync metadata
```

## Architecture

### Three-Layer System

```
tasks/*.json ──→ pipeline/*.json ──→ agent/custom/
(task entries)    (node graph)       (Python custom logic)
```

**Layer 1 — Tasks (`tasks/*.json`):** Define what appears in the MFAAvalonia GUI. Maps to entry pipeline node + options that override pipeline behavior.

**Layer 2 — Pipeline (`resource/base/pipeline/*.json`):** Directed graph of JSON nodes. Each node defines a recognition + action + next transitions. This is where 90% of automation logic lives.

**Layer 3 — Agent (`agent/`):** Python custom recognition/action modules for complex logic that can't be expressed in JSON (dynamic ROIs, stateful counters).

### Pipeline Node Anatomy

Each pipeline node is a JSON object keyed by its fully-qualified name (dot-separated hierarchy):

```json
{
    "FarmResources.ClickStage": {
        "recognition": "Custom",
        "custom_recognition": "CheckResourceStage",
        "custom_recognition_param": "{\"stage_name\": \"1-1\", \"stage_index\": 1, \"resource_type\": \"特别军费行动\"}",
        "action": {"type": "Click"},
        "next": ["FarmResources.QuickBattle"],
        "on_error": ["FarmResources.StageLocked"],
        "pre_delay": 500,
        "timeout": 10000
    }
}
```

**Key fields:**

| Field                      | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| `recognition`              | `OCR` / `TemplateMatch` / `DirectHit` / `Custom`         |
| `expected`                 | OCR text pattern (regex)                                 |
| `roi`                      | Screen region `[x, y, w, h]` at 1280x720                 |
| `threshold`                | Match confidence (0.0-1.0)                               |
| `template`                 | Image path for TemplateMatch                             |
| `action.type`              | `Click` / `LongPress` / `Swipe` / `DoNothing` / `Custom` |
| `target` / `target_offset` | Click position override                                  |
| `next`                     | Array of subsequent nodes (OR logic — first match wins)  |
| `on_error`                 | Fallback nodes when recognition fails                    |
| `pre_delay` / `post_delay` | Milliseconds before/after action                         |
| `max_hit`                  | Max times this node can be hit before skipped            |
| `timeout`                  | Max recognition time in ms (default 20000)               |
| `only_rec`                 | If true, only recognizes without executing action        |
| `focus`                    | UI notifications on recognition succeed/fail             |

**Default parameters** are inherited from `resource/base/default_pipeline.json` — timeout, pre_delay, post_delay, threshold per recognition type, etc.

### Recognition Types

| Type              | When to Use                               | Details                                                                                   |
| ----------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------- |
| **TemplateMatch** | Static UI elements with unique appearance | OpenCV matching; template image in `image/`; method=5 default; threshold=0.7              |
| **OCR**           | Dynamic text content                      | PaddleOCR v5 models in `model/ocr/`; `order_by: "Horizontal"`; replace patterns supported |
| **DirectHit**     | Routing hub / dispatcher                  | Always matches; used for `next` branching control                                         |
| **Custom**        | Complex logic + dynamic ROI               | Python class registered via `@AgentServer.custom_recognition()`                           |

### Action Types

| Type          | Details                                                                             |
| ------------- | ----------------------------------------------------------------------------------- |
| **Click**     | `target: true` = click at recognition center; `target: [x,y,w,h]` = absolute coords |
| **DoNothing** | Zero-action routing node                                                            |
| **Swipe**     | `param.begin` / `param.end` / `param.duration`                                      |
| **Custom**    | Python class via `@AgentServer.custom_action()`                                     |

### Task Options & Pipeline Override

Options in `tasks/*.json` use `pipeline_override` to modify pipeline nodes at runtime. This is the primary mechanism for user-configurable behavior:

```json
{
    "option": {
        "farm_category": {
            "type": "select",
            "label": "刷取板块",
            "default_case": "资源收集",
            "cases": [
                {
                    "name": "资源收集",
                    "pipeline_override": {
                        "FarmResources.Start": {
                            "next": ["FarmResources.ResourceCollect"]
                        }
                    }
                },
                {
                    "name": "技能演练",
                    "pipeline_override": {
                        "FarmResources.Start": {
                            "next": ["FarmResources.SkillTraining"]
                        }
                    }
                }
            ]
        }
    }
}
```

Overrides can modify any node field — `next`, `custom_recognition_param`, `threshold`, `roi`, etc. Cases can also chain sub-options via `"option": ["farm_battle_count"]` for cascaded configuration.

## Pipeline Files

### `resource/base/pipeline/startup.json`

- **Task:** `启动游戏`
- **Flow:** Launch → check splash → login → enter main interface
- Entry: `LaunchGame` (defined in this file)

### `resource/base/pipeline/claim_rewards.json`

- **Task:** `领取奖励` (entry: `ClaimRewards.Start`)
- **Flow:** Collect daily/weekly/military rewards → Battle Pass → Mailbox
- **Pattern:** Sequential linear check with `on_error` fallthrough:
  `CheckDaily → ClaimButton → CheckWeekly → ClaimButton → CheckMilitary → Exit`
- Common shared nodes: `Common.BackButton`, `Common.CheckItemObtained`

### `resource/base/pipeline/farm_resources.json`

- **Task:** `资源刷取` (entry: `FarmResources.CheckHomePage`)
- This is the most complex pipeline. Two modes:
    - **Normal mode:** Farm N times (1-6 or max), stop after assigned count
    - **清空体力 (Clear Stamina) mode:** Farm 1 time, loop until stamina depleted

#### Key Node Subsystem: BattleState [JumpBack] Pattern

The battle loop uses MaaFW's `[JumpBack]` prefix to return to a parent node after each action, avoiding linear chains with hard waits:

```
FarmResources.BattleStage (DirectHit, dispatcher)
  ├── [JumpBack]FarmResources.ClickVictory    → back to BattleStage
  ├── [JumpBack]FarmResources.ClickItemDialog → back to BattleStage
  └── FarmResources.QuickBattle                 → next battle or exit
```

When a node starts with `[JumpBack]`, it returns control to the calling node after execution. This creates a tight loop:

- BattleStage tries ClickVictory → if match, click → JumpBack to BattleStage
- BattleStage tries ClickItemDialog → if match, click → JumpBack to BattleStage
- BattleStage tries QuickBattle → if match, proceed to next battle setup

**Critical:** `[JumpBack]` nodes must NOT have `next` arrays — the prefix handles routing.

#### 清空体力 Mode Flow

```
QuickBattle → SetBattleCountMax → PrepareBattle
  ├── CheckStamina (no stamina dialog found) → StartBattle → BattleStage (loop)
  └── CheckStamina (stamina dialog found) → ReduceCount → PrepareBattle (retry)
       → ReduceCount fails (target < 1) → NoStamina → ExitStage → ExitStageConfirm → ReturnMain
```

After each battle completes:

```
BattleStage → [JumpBack]ClickVictory → [JumpBack]ClickItemDialog → QuickBattle → ...
```

The `ResetCountTarget` action resets the counter before each battle cycle.

#### Stamina Check

CheckStamina uses TemplateMatch at `[1014, 197, 100, 76]` with template `farm_resources/no_stamina.png`. When stamina dialog found, click absolute coords `(323, 611)` to dismiss it. On detection, stamina flow reduces battle count and retries PrepareBattle — no separate `ExitStage` chain needed.

#### Stage Selection with Dynamic ROI

The `CheckResourceStage` custom recognition handles dynamic ROI per resource type + stage index:

```python
RESOURCE_STAGES = {
    "特别军费行动": { 1: [26, 475, 184, 56], 2: [516, 523, 185, 56], ... },
    "作战体能训练": { 1: [26, 475, 184, 56], 2: [516, 523, 185, 56], ... },
    "兵种能力评级": { 1: [164, 481, 62, 44], 2: [516, 523, 185, 56], ... },
    "载具对抗演练": { 1: [170, 482, 50, 42], 2: [660, 532, 50, 42], ... },
}
```

Each stage also checks for a lock icon near the OCR result to detect locked levels.

## Agent System

### File Layout

```
agent/
├── bootstrap.py            # Entry: venv management + deps check → main.py
├── main.py                 # Thin shim: chdir, import path → agent_runtime.run_agent()
├── agent_runtime.py        # Core: custom.register_all() → AgentServer.start_up()
├── custom/
│   ├── __init__.py         # register_all() — auto-discovers action/reco modules
│   ├── recognition/
│   │   └── farm_resources.py   # CheckResourceStage (CustomRecognition)
│   └── action/
│       └── ocr_logger.py       # LogOCRResult (CustomAction — log OCR to UI)
└── utils/
    ├── __init__.py             # Unified re-exports
    ├── logger.py               # Loguru logger config
    ├── params.py               # parse_params() + coerce_like() for pipeline params
    └── runtime_paths.py        # RuntimePaths singleton (project_root, work_root)
```

### Startup Sequence

1. **MFAAvalonia** launches `./agent/bootstrap.py` with socket ID arg
2. **bootstrap.py** checks Python ≥3.13,<3.14, manages venv (Linux only), installs deps, then runs `main.py`
3. **main.py** sets UTF-8 encoding, chdir to project root, adjusts sys.path, calls `run_agent()`
4. **agent_runtime.py** imports custom module → `custom.register_all()` → `AgentServer.start_up(socket_id)`
5. Agent listens for pipeline custom recognition/action calls via MaaAgent protocol

### Custom Recognition — `CheckResourceStage`

```python
@AgentServer.custom_recognition("CheckResourceStage")
class CheckResourceStage(CustomRecognition):
    def analyze(self, context, argv) -> AnalyzeResult | RectType | None:
        params = parse_params(argv.custom_recognition_param)
        # 1. Get stage ROI by resource_type + stage_index
        # 2. OCR to find stage name text (handles with/without dash formats)
        # 3. Check for "奖励" text interference → narrow ROI
        # 4. Check lock icon via TemplateMatch near OCR result
        # 5. Return box or None
```

Called from pipeline: `"custom_recognition": "CheckResourceStage"` with JSON params.

### Custom Actions

| Action                   | Purpose                                   | Parameters                                                      |
| ------------------------ | ----------------------------------------- | --------------------------------------------------------------- |
| `SetBattleCount`         | Set battle count (1-6 or "max")           | `target_count`, `count_roi`, `plus_button`, `max_template`      |
| `ReduceBattleCount`      | Reduce count by 1 (stateful across calls) | `minus_button`, `count_roi`                                     |
| `ResetBattleCountTarget` | Reset shared counter to 6                 | (none)                                                          |
| `LogOCRResult`           | Log OCR results to UI                     | `recognition_name`, `action_key`, `return_text`, `click_target` |

**Stateful actions:** `ReduceBattleCount` uses module-level variables (`_current_target_count`, `_current_run_epoch`) to track state across pipeline invocations. Must call `ResetBattleCountTarget` before starting a new battle cycle.

### Utility Modules

- **`params.py`** — `parse_params()` parses JSON string params; `coerce_like()` handles type coercion (e.g. int ↔ float)
- **`logger.py`** — Loguru-based, writes to `debug/` directory
- **`runtime_paths.py`** — Singleton containing `project_root` and `work_root` paths

### MaaFW Python API Key Patterns

```python
# OCR
ocr_detail = context.run_recognition_direct(
    JRecognitionType.OCR,
    JOCR(expected=["text"], roi=(x, y, w, h)),
    image,
)

# TemplateMatch
match_detail = context.run_recognition_direct(
    JRecognitionType.TemplateMatch,
    JTemplateMatch(template="path.png", roi=(x, y, w, h), threshold=0.8),
    image,
)

# Click
context.run_action_direct(JActionType.Click, JClick(), box, "")

# Get cached screenshot
image = context.tasker.controller.cached_image

# Capture fresh screenshot
image = context.tasker.controller.post_screencap().wait().get()

# Post click directly
context.tasker.controller.post_click(x, y).wait()
```

## Configuration Files

| File                     | Purpose                                                                     | Tracked? |
| ------------------------ | --------------------------------------------------------------------------- | -------- |
| `interface.json`         | MaaFW project definition: controller, resources, agent config, task imports | ✅ Yes   |
| `maa-project.json`       | Tooling metadata (slug, displayName, version, features, addons)             | ✅ Yes   |
| `maa-project.lock.json`  | Resolved tool state (template version, file hashes, pending actions)        | ✅ Yes   |
| `maatools.config.mts`    | MaaTools CLI config + custom action parser                                  | ✅ Yes   |
| `package.json`           | Node toolchain scripts (check, format, lint)                                | ✅ Yes   |
| `config/pip_config.json` | Pip mirror settings (auto-created by bootstrap)                             | ❌ No    |

### Key Config Notes

- **`interface.json` agent field** — Uses v2 array format: `"agent": [{ "child_exec": "python", ... }]`
- **VSCode enabled** — `features.vscode.enabled: true` but `.vscode/` is gitignored. CI `check-project.mjs` will report missing `.vscode/settings.json` — acceptable, CI uses `check:ci` script which skips this check
- **`maa-project.json`** has `interfaceUnmanaged: true` — interface.json metadata is manually maintained, not auto-synced

## File Layout

```
MaaKEDR/
├── interface.json                  # MaaFW project definition
├── maa-project.json / .lock.json   # Tooling state files
├── package.json                    # Node toolchain (scripts)
├── maatools.config.mts             # MaaTools config
│
├── resource/base/
│   ├── default_pipeline.json       # Inherited defaults
│   ├── pipeline/
│   │   ├── startup.json            # Game startup flow
│   │   ├── claim_rewards.json      # Reward claiming flow
│   │   └── farm_resources.json     # Resource farming flow
│   ├── image/                      # Template images
│   │   ├── claim_rewards/          # Reward-related images
│   │   ├── farm_resources/         # Farm-related images
│   │   ├── battle_victory.png      # Victory screen
│   │   ├── item_obtained_dialog.png
│   │   ├── back_button.png
│   │   ├── return_main.png
│   │   └── main_option.png
│   └── model/ocr/                  # PaddleOCR v5 models
│       └── manifest.json
│
├── agent/                          # Python Agent code
│   ├── bootstrap.py                # Entry: venv/deps → main.py
│   ├── main.py                     # Shim → agent_runtime.run_agent()
│   ├── agent_runtime.py            # Core: register_all() → AgentServer
│   ├── custom/
│   │   ├── __init__.py             # register_all() auto-discovery
│   │   ├── recognition/
│   │   │   └── farm_resources.py   # CheckResourceStage + battle actions
│   │   └── action/
│   │       └── ocr_logger.py       # LogOCRResult action
│   └── utils/
│       ├── __init__.py             # Unified re-exports
│       ├── logger.py               # Loguru config
│       ├── params.py               # Parameter parsing
│       └── runtime_paths.py        # Path singleton
│
├── tasks/                          # Task entry-point definitions
│   ├── startup.json                # 启动游戏
│   ├── claim_rewards.json          # 奖励领取
│   └── farm_resources.json         # 资源刷取
│
├── tools/                          # Dev utilities
│   ├── minify_json.py              # JSON minifier
│   ├── validate_schema.py          # JSON schema validator
│   ├── validate-schema.mjs         # Node-based schema validation
│   └── check-project.mjs           # Project integrity checker
│
├── tools/schema/                   # JSON Schema files (v2)
│   ├── pipeline.schema.json
│   ├── interface.schema.json
│   ├── custom.action.schema.json
│   └── custom.recognition.schema.json
│
├── deps/tools/                     # Legacy schema (v0)
│
├── requirements.txt                # Python deps (maafw, loguru)
├── pyproject.toml                  # Python project config
│
├── .editorconfig, .gitattributes, .gitignore
├── .prettierrc.mjs                 # Prettier with MaaFW sort plugin
└── .vscode/                        # VSCode debug/task config (gitignored)
```

## Pipeline Design Patterns

### 1. Standard Recognition + Click

```json
"NodeName": {
    "recognition": "TemplateMatch",
    "roi": [100, 200, 80, 50],
    "template": "my_button.png",
    "threshold": 0.8,
    "action": { "type": "Click" },
    "next": ["NextNode"],
    "on_error": ["FallbackNode"]
}
```

### 2. DirectHit Routing Hub

```json
"HubNode": {
    "recognition": "DirectHit",
    "action": { "type": "DoNothing" },
    "next": ["BranchA", "BranchB", "BranchC"]
}
```

`next` acts as OR: the first node whose recognition succeeds is followed. Used for branching based on which UI element is visible.

### 3. [JumpBack] Battle Loop

```json
"BattleStage": {
    "recognition": "DirectHit",
    "action": { "type": "DoNothing" },
    "next": [
        "[JumpBack]ClickVictory",
        "[JumpBack]ClickItemDialog",
        "QuickBattle"
    ]
},
"ClickVictory": {
    "recognition": "TemplateMatch",
    "template": "battle_victory.png",
    "threshold": 0.8,
    "action": { "type": "Click" }
    // NO next — [JumpBack] returns to BattleStage
}
```

`[JumpBack]` prefix: after node executes, control returns to parent (BattleStage). Only the non-`[JumpBack]` node (QuickBattle) exits the loop. This is the recommended pattern for screen-based UI navigation over linear chains with hard waits.

### 4. OCR with Dynamic Params

```json
"OCRNode": {
    "recognition": "OCR",
    "expected": ".*button.*",
    "roi": [500, 300, 200, 50],
    "action": { "type": "Click" }
}
```

### 5. Custom Recognition with Agent

```json
"CustomNode": {
    "recognition": "Custom",
    "custom_recognition": "MyRecognizer",
    "custom_recognition_param": "{\"key\": \"value\"}",
    "action": { "type": "Click" }
}
```

### 6. Custom Action

```json
"ActionNode": {
    "recognition": "DirectHit",
    "action": {
        "type": "Custom",
        "param": {
            "custom_action": "MyAction",
            "custom_action_param": { "key": "value" }
        }
    }
}
```

### 7. max_hit Anti-Loop

Nodes with `max_hit: 5` fire at most 5 times before MaaFW skips them. Used for cyclic UI elements (reward badges, claim buttons) that appear multiple times.

### 8. Focus for UI Notifications

```json
"focus": {
    "Node.Recognition.Succeeded": "向用户显示的消息",
    "Node.Action.Starting": {
        "content": "消息内容",
        "display": ["log", "toast"]
    }
}
```

## Development Guide

### Commands

```bash
pnpm install              # Install Node deps (MaaTools, Prettier, AJV)
pnpm check                # Full check: format → schema → maa check → project lint
pnpm check:ci             # CI-safe: format check + project lint (skips schema)
pnpm check:maa            # MaaTools pipeline validation
pnpm check:schema         # Node schema validation against JSON Schema
pnpm format               # Prettier format all files
pnpm format:check         # Prettier check only
pnpm lint                 # check-project.mjs integrity check (23 items)
pnpm check:py             # Ruff lint + Pyright type check
pnpm run release:dry-run  # Simulate release build
pnpm run sync:runtime     # Sync MaaFW runtime
```

### Adding Pipeline Nodes

1. Add node JSON to the appropriate `resource/base/pipeline/*.json` file
2. Add template images to `resource/base/image/` as needed
3. Add task entry + options in `tasks/*.json` if exposing in GUI
4. Run `pnpm check:maa` to validate pipeline
5. Run `pnpm format` to format JSON

### Adding Agent Custom Logic

1. Add a new class in `agent/custom/recognition/` or `agent/custom/action/`
2. Decorate with `@AgentServer.custom_recognition("Name")` or `@AgentServer.custom_action("Name")`
3. Register in `agent/custom/__init__.py::register_all()`
4. Reference in pipeline nodes via `custom_recognition` / `custom_action` fields
5. Add schema to `tools/schema/custom.recognition.schema.json` / `custom.action.schema.json`
6. Add parser config in `maatools.config.mts` custom parser

### Using create-maa-project

```bash
# Health check (23 checks)
create-maa-project --doctor

# Preview managed-file updates
create-maa-project --update template --diff

# Apply template updates
create-maa-project --update template

# Update schema baselines
create-maa-project --update schema

# Sync metadata across files
create-maa-project --sync metadata

# Update Python dependencies
create-maa-project --update python-deps

# Update MaaFW runtime
create-maa-project --update maafw

# Add GitHub CI workflows (if missing)
create-maa-project --add github
```

> **Warning:** `--add dev-tools` overwrites `package.json` scripts. If re-adding, restore custom scripts (like `check:py`) afterward.

### Image Conventions

- All template images are stored in `resource/base/image/`
- Per-feature subdirectories: `claim_rewards/`, `farm_resources/`
- Shared images at root: `battle_victory.png`, `item_obtained_dialog.png`, `back_button.png`, `return_main.png`, `main_option.png`
- Image names are descriptive kebab-case: `quick_battle.png`, `start_battle.png`, `no_stamina.png`
- TemplateMatch images should be exact pixel crops of the UI element at 1280x720

### Runtime Setup

```bash
# Install VC++ 2015+ Runtime and .NET Desktop Runtime 10.0
DependencySetup_依赖库安装_win.bat

# Then launch MFAAvalonia.exe
```

## Conventions

- **Encoding:** UTF-8, LF line endings (enforced by `.editorconfig` and `.gitattributes`)
- **Indentation:** 4 spaces for JSON/YAML, 2 spaces for TypeScript/Markdown
- **JSON-with-Comments:** Pipeline files, task files, and `interface.json` support `//` comments
- **ONNX files are binary** in git (tracked but not diffable)
- **Pipeline naming:** Dot-separated hierarchical names (e.g. `FarmResources.Start`, `ClaimRewards.CheckDaily`)
- **ROI coordinates:** `[x, y, width, height]` in pixels at 1280x720 resolution
- **Template image paths:** Relative to `resource/base/image/`
- **Gitignored:** `node_modules/`, `.venv/`, `config/`, `dist/`, `debug/`, `.create-maa-project/`, `test_*.json`
- **Commit style:** Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`), one concern per commit, natural language descriptions

## Common Pitfalls for AI Agents

1. **[JumpBack] nodes must NOT have `next`** — The `[JumpBack]` prefix handles routing. Adding `next` to a JumpBack node breaks the loop. Only the exit node (non-JumpBack) in a BattleStage dispatcher should have `next`.

2. **Task options override pipeline behavior** — When adding a new feature to pipeline, check `tasks/*.json` for `pipeline_override` that may override your node's `next` or `custom_recognition_param`. The override at the task level wins at runtime.

3. **Ruff vs npm ruff** — `pnpm exec ruff` runs a JS npm package named `ruff`, NOT the Python linter. Always use `uv run ruff` for Python linting.

4. **Pyright needs uv context** — `pnpm exec pyright` won't find Python packages in the uv venv. Use `uv run pyright` to get correct type resolution.

5. **Don't set `next` on DirectHit dispatch nodes** that have multiple targets — `next` acts as OR; the first matching child is followed. If a child needs JumpBack, only the JumpBack targets should omit `next`, not the parent dispatcher.

6. **Wait times are critical** — Pipeline nodes execute fast. Insufficient `post_delay` after a Click causes the next recognition to run on a stale screenshot. Post_delay of 1000-2000ms is common after navigation clicks.

7. **Agent custom recognition_param is JSON string** — The `custom_recognition_param` field in pipeline must be a JSON string (serialized), not a JSON object. The `custom_action_param` for `"type": "Custom"` is a JSON object. Different serialization rules apply.

8. **max_hit counts cross-session** — After max_hit is reached, the node won't fire again in the same task run. Use `ResetCount` custom action to reset if needed.

9. **OCR expects regex, not literal** — The `expected` field is a regex pattern. Use `".*"` to match anything, `"^text$"` for exact match, `"text1|text2"` for alternatives.

10. **TemplateMatch threshold is per-type from defaults** — Default threshold 0.7 is inherited from `default_pipeline.json.TemplateMatch.threshold`. Override per-node if needed.

## User Preferences

- **Commit style:** Keep commit messages short and general (e.g., "fix: 调整每日登录弹窗 ROI"), not overly detailed.
- **Push only on approval:** Present commit message for review before pushing. Only push when explicitly told to.
- **Do not push unilaterally** after making changes — wait for user confirmation.

## Related Projects & References

- **MaaFramework Documentation:** https://maaframework.github.io/
- **M9A Reference Project:** `G:\M9AA\M9A-pr\55\M9A` (mature example of similar MaaFW pipeline project)
- **create-maa-project Scaffold Tool:** `G:\M9AA\create-maa-project` (upstream dev tool; TypeScript source)
- **MaaKEDR交流群 QQ:** 1051890489
- **Repository:** https://github.com/APPLe-DF/MaaKEDR
