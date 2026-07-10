# Pipeline 编写指南

## 节点结构

Pipeline 节点用 JSON 定义，每个节点描述一个识别 → 动作 → 跳转的完整步骤：

```json
{
    "NodeName": {
        "recognition": "TemplateMatch",
        "roi": [
            100,
            200,
            80,
            50
        ],
        "template": "button.png",
        "threshold": 0.8,
        "action": {"type": "Click"},
        "next": ["NextNode"],
        "on_error": ["FallbackNode"]
    }
}
```

## 识别类型

| 类型          | 适用场景     | 说明                                                             |
| ------------- | ------------ | ---------------------------------------------------------------- |
| TemplateMatch | 静态 UI 元素 | OpenCV 模板匹配，图片放 `image/` 目录，threshold 默认 0.7        |
| OCR           | 动态文本     | PaddleOCR v5，`expected` 支持正则，`roi` 指定文字区域            |
| DirectHit     | 路由分发     | 始终匹配成功，用于 `next` 分支控制                               |
| Custom        | 复杂逻辑     | Python 自定义识别，通过 `@AgentServer.custom_recognition()` 注册 |

## 动作类型

| 类型      | 说明                                                              |
| --------- | ----------------------------------------------------------------- |
| Click     | 点击识别位置。`target: true` 点中心，`target: [x,y,w,h]` 指定坐标 |
| DoNothing | 仅做识别路由，不执行操作                                          |
| Swipe     | 滑动。`param.begin` / `param.end` / `param.duration`              |
| Custom    | Python 自定义动作，通过 `@AgentServer.custom_action()` 注册       |

## 常用字段

| 字段                       | 说明                                               |
| -------------------------- | -------------------------------------------------- |
| `pre_delay` / `post_delay` | 动作前/后等待（毫秒），导航点击后建议 1000-2000ms  |
| `max_hit`                  | 最大命中次数，超过后节点被跳过。用于循环出现的元素 |
| `timeout`                  | 识别超时（ms），默认 20000                         |
| `only_rec`                 | 仅识别不动作                                       |
| `focus`                    | 命中/失败时显示通知                                |

## 设计模式

### DirectHit 路由枢纽

```json
"HubNode": {
    "recognition": "DirectHit",
    "action": { "type": "DoNothing" },
    "next": ["BranchA", "BranchB"]
}
```

`next` 是 OR 逻辑：从上到下依次尝试，第一个识别成功的节点被执行。

### [JumpBack] 战斗循环

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
    "action": { "type": "Click" }
}
```

`[JumpBack]` 节点执行后返回父节点，只有非 JumpBack 节点能退出循环。**JumpBack 节点不能有 `next`。**

### 任务选项覆盖

`tasks/*.json` 中用 `pipeline_override` 在运行时修改节点行为：

```json
"pipeline_override": {
    "FarmResources.Start": {
        "next": ["FarmResources.ResourceCollect"]
    },
    "FarmResources.ClickStage": {
        "custom_recognition_param": "{\"stage_name\": \"1-1\", \"stage_index\": 1, \"resource_type\": \"特别军费行动\"}"
    }
}
```

可以修改 `next`、`roi`、`threshold`、`custom_recognition_param` 等任意字段。

### max_hit 防循环

```json
"ClaimButton": {
    "max_hit": 5,
    "recognition": "TemplateMatch",
    ...
}
```

最多命中 5 次后跳过，适合循环出现的领取按钮。

## 注意事项

1. **等待时间要充足** — `post_delay` 不够会导致截到过时画面。导航点击后至少 1000ms
2. **OCR expected 是正则表达式** — `".*"` 匹配任意，`"^text$"` 精确匹配
3. **ROI 以 1280x720 为基准** — 坐标 `[x, y, w, h]`
4. **node 名称用点分隔层级** — 如 `FarmResources.Start`、`ClaimRewards.CheckDaily`
5. **`on_error` 兜底** — 重要的导航节点要加 `on_error`，避免卡死
