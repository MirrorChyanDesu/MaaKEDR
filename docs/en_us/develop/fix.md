---
order: 3
icon: "ri:bug-fill"
---

# Troubleshooting

## Log Files

| File                        | Description                             |
| --------------------------- | --------------------------------------- |
| `debug/agent-bootstrap.log` | Agent startup log                       |
| `maafw.log`                 | MaaFramework runtime log (project root) |
| `debug/`                    | Debug screenshots                       |

## Categories

### Startup Issues

#### Agent fails to start

Error: `Python >=3.13,<3.14 is required`

Cause: Wrong Python version. Project requires Python 3.13.x.

Fix: Use `uv` for Python management, run `uv sync`.

#### Custom module not registered

Error: Custom action/recognition returns `success: false`

Cause: Module not added to `RECOGNITION_MODULES` in `agent/custom/recognition/__init__.py`.

Fix: Add module name, e.g. `RECOGNITION_MODULES = ("farm_resources", "pvp")`.

### Runtime Issues

#### Pipeline node stuck

Symptoms: Task hangs on a node until timeout.

Common causes:

1. Stale screenshot — `post_delay` too short. Increase to 1000ms+
2. ROI mismatch — Game UI changed, update ROI
3. Outdated template — UI changed, re-screenshot
4. Missing fallback — Critical nodes lack `on_error`

#### JumpBack node misbehavior

Cause: JumpBack node has `next` field. **JumpBack nodes must NOT have `next`.**

#### Stamina drain mode loops

Cause: `ExitStage` and `ExitStageConfirm` override points to `BattleStage` instead of exit path.

Fix: Check the clear stamina mode override in `tasks/farm_resources.json`.

### Recognition Issues

#### Stage not found

Symptoms: `CheckResourceStage` keeps failing

Common causes:

1. Stage locked — update `lock_icon.png` template
2. Stage list offset — confirm `SwipeToBegin` executed
3. Wrong `stage_index` or `resource_type` in params

#### Stamina popup not recognized

Cause: `no_stamina.png` template missing or wrong ROI.

#### Schema validation fails

Error: `must NOT have unevaluated properties`

Cause: Using unsupported field in the current schema.

Fix: Remove unsupported fields or update `tools/schema/` definitions.

### Log Analysis

Runtime logs (`maafw.log`) contain detailed recognition results:

```json
{
    "reco_id": 400000431,
    "algorithm": "Custom",
    "box": null,
    "detail": {"all": [], "best": null},
    "name": "PVP.ReadResult"
}
```

- `box: null` — no match
- `box: [x, y, w, h]` — match found
- `debug/` screenshots show actual screen state
