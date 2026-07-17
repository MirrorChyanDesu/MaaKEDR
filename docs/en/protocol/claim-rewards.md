---
order: 3
icon: ri:gift-line
---

# Claim Rewards

| Item     | Value                                       |
| -------- | ------------------------------------------- |
| Entry    | `ClaimRewards`                              |
| Task     | `tasks/claim_rewards.json`                  |
| Pipeline | `resource/base/pipeline/claim_rewards.json` |

## Options

| Key                   | Meaning                   |
| --------------------- | ------------------------- |
| `claim_dispatch`      | Dispatch rewards          |
| `dispatch_redeploy`   | Redeploy after claim      |
| `claim_daily_rewards` | Daily / weekly / military |
| `claim_battle_pass`   | Battle pass               |
| `claim_mailbox`       | Mailbox                   |

## Flow

Main hub after home check → dispatch / daily / battle pass / mailbox modules → return hub or exit.

`CheckMainInterface` must `next` into `MainHub` to avoid loops. Item popups: `Common.CheckItemObtained`.
