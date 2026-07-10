# Troubleshooting

## Log Files

- `debug/agent-bootstrap.log` — Agent startup log
- `maafw.log` — MaaFramework runtime log (project root)

## Common Issues

### Agent Startup Fails

**Error**: `Python >=3.13,<3.14 is required`

**Cause**: System Python version mismatch. Project requires Python 3.13.x.

**Fix**: Install `uv` and run `uv sync` to let it manage Python version automatically.

### Pipeline Node Stuck

**Error**: Task hangs on a node until timeout.

**Common causes**:

1. **Stale screenshot** — `post_delay` too short on previous action. Increase to 1000-2000ms after navigation clicks.
2. **Wrong ROI** — Game UI changed position. Update ROI coordinates.
3. **Outdated template** — Game UI changed visually. Recapture template image.
4. **No fallback** — Critical navigation node missing `on_error`.

### JumpBack Node Issues

**Symptom**: node doesn't behave as expected after execution.

**Cause**: JumpBack node has a `next` field. **JumpBack nodes must NOT have `next`.**

### Stage Not Found

**Symptom**: `CheckResourceStage` keeps returning failure.

**Possible causes**:

1. Stage is locked (grey text, OCR can't read) — check `lock_icon.png` template
2. Need to swipe to beginning first — verify `SwipeToBegin` executed
3. `custom_recognition_param` has wrong `stage_index` or `resource_type`

### Stamina Depletion Flow Stuck

**Symptom**: Task doesn't exit when stamina is empty.

**Cause**: `no_stamina.png` template missing or wrong ROI.
