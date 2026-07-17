---
order: 4
icon: ri:treasure-map-line
---

# Farm Resources

| Item     | Value                                        |
| -------- | -------------------------------------------- |
| Entry    | `FarmResources.CheckHomePage`                |
| Task     | `tasks/farm_resources.json`                  |
| Pipeline | `resource/base/pipeline/farm_resources.json` |

## Stages (resource collect)

| Type              | Stages                 |
| ----------------- | ---------------------- |
| Special funds     | **1-1 … 1-5**          |
| Physical training | **2-1 … 2-4** (no 2-5) |
| Unit rating       | **3-1 … 3-4** (no 3-5) |
| Vehicle drill     | **4-1 … 4-5**          |

## Modes

- **Single battle**: `SetBattleCount` from option (1–6 / max)
- **Drain stamina**: `SetBattleCountMax`, `ReduceCount` on low stamina, exit via confirm → main

Skill training: basic / advanced stages via OCR + lock checks. Custom actions: battle count helpers in `agent/custom/`.
