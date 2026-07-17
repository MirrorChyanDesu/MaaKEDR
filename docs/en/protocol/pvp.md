---
order: 5
icon: ri:sword-line
---

# PVP

| Item     | Value                             |
| -------- | --------------------------------- |
| Task     | `tasks/pvp.json`                  |
| Pipeline | `resource/base/pipeline/pvp.json` |

## Flow

Home → entry → battle UI → init count → select player → start → begin combat (retry until in battle) → speed → loop → skip OCR → read result → exit → next fight or main.

`BeginCombat` should retry if one click does nothing. Challenge limit ends the task. Automation does not guarantee wins.
