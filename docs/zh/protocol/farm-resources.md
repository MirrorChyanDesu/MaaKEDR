---
order: 4
icon: ri:treasure-map-line
---

# 资源刷取协议

## 任务入口

| 项     | 值                                           |
| ------ | -------------------------------------------- |
| 任务名 | 资源刷取                                     |
| entry  | `FarmResources.CheckHomePage`                |
| 定义   | `tasks/farm_resources.json`                  |
| 流程   | `resource/base/pipeline/farm_resources.json` |

## 选项结构

```text
farm_battle_mode（战斗模式）
  ├─ 单次战斗 → farm_battle_count（1–6 / 最大）
  └─ 清空体力 → pipeline_override（最大次数 + 减次数 + 退出路径）

farm_category（刷取板块）
  ├─ 资源收集 → farm_resource_type → farm_resource_stage_1~4
  └─ 技能演练 → farm_skill_type → farm_skill_stage_1~2
```

## 资源收集关卡

| 类型         | stage 选项 key          | 关卡编号约定               |
| ------------ | ----------------------- | -------------------------- |
| 特别军费行动 | `farm_resource_stage_1` | **1-1 ~ 1-5**（有第 5 关） |
| 作战体能训练 | `farm_resource_stage_2` | **2-1 ~ 2-4**（无第 5 关） |
| 兵种能力评级 | `farm_resource_stage_3` | **3-1 ~ 3-4**（无第 5 关） |
| 载具对抗演练 | `farm_resource_stage_4` | **4-1 ~ 4-5**（有第 5 关） |

关卡选择通过 `FarmResources.ClickStage` 的 `custom_recognition_param` 传入：

```json
{
    "stage_name": "1-1",
    "stage_index": 1,
    "resource_type": "特别军费行动"
}
```

第 4、5 关（可见需要滑动时）会对 `SelectStage` 注入 `next → SwipeToRight`。

## 技能演练

| 类型         | stage 选项           | 关卡名示例   |
| ------------ | -------------------- | ------------ |
| 基础技能演练 | `farm_skill_stage_1` | 基础训练 1–3 |
| 专业技能演练 | `farm_skill_stage_2` | 专业训练 1–3 |

通过 `ClickSkillStage` 的 ROI + OCR `expected` 定位；锁定态用 `CheckSkillLocked`。

## 战斗模式

### 单次战斗

`QuickBattle` → `SetBattleCount`（按选项 target_count）→ `PrepareBattle` → 体力检测 → 开战 → `BattleStage` 循环。

### 清空体力

`pipeline_override` 将：

- `QuickBattle.next` → `SetBattleCountMax`
- `CheckStamina.next` → `ReduceCount`（不够则减次数再试）
- `BattleStage` 增加回主页 / 再准备等兜底
- 退出走 `ExitStageConfirm` → `ReturnMainFromFarm`

## 关键节点

| 节点                     | 作用                         |
| ------------------------ | ---------------------------- |
| `SetBattleCount`         | Custom：点加减设置次数       |
| `SetBattleCountMax`      | Custom：设为最大             |
| `ReduceCount`            | Custom：体力不足时减次数     |
| `CheckStamina`           | 无体力弹窗                   |
| `BattleStage`            | 胜利用 / 物品弹窗 / 再快速战 |
| `ClickVictory`           | 胜利画面                     |
| `ClickItemDialog`        | 获得物品                     |
| `StageLocked` / 锁定提示 | 关卡或快速战未解锁           |

Custom 实现：`agent/custom/` 下与 `SetBattleCount`、`ReduceBattleCount`、关卡识别等相关模块。

## 图片目录

`resource/base/image/farm_resources/`（入口、快速战、准备、胜利、锁定等）。
