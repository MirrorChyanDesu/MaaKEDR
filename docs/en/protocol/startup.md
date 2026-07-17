---
order: 2
icon: ri:play-circle-line
---

# Startup & Login

| Item      | Value                                        |
| --------- | -------------------------------------------- |
| Task      | `tasks/startup.json`                         |
| Pipeline  | `resource/base/pipeline/startup.json`        |
| Overrides | bilibili / taptap pipeline packs when needed |

## Flow

```text
Launch game → loading / start → daily login popups → main UI → done
```

Templates live under `resource/base/image/` (e.g. `daily_login_reward.png`, `main_option.png`). Prefer freezes/recognition over long fixed delays.
