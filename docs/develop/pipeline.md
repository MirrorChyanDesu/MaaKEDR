# Pipeline 编写指南

## 节点结构

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

| 类型          | 用途         | 说明                                                     |
| ------------- | ------------ | -------------------------------------------------------- |
| TemplateMatch | 静态 UI 元素 | OpenCV 匹配，模板图在 `image/`，threshold 默认 0.7       |
| OCR           | 动态文本     | PaddleOCR v5，`order_by: "Horizontal"`，支持替换模式     |
| DirectHit     | 路由枢纽     | 始终匹配，用于 `next` 分支控制                           |
| Custom        | 复杂逻辑     | Python 类，通过 `@AgentServer.custom_recognition()` 注册 |

## 动作类型

| 类型      | 说明                                                          |
| --------- | ------------------------------------------------------------- |
| Click     | `target: true` = 点击识别中心；`target: [x,y,w,h]` = 绝对坐标 |
| DoNothing | 无动作路由节点                                                |
| Swipe     | `param.begin` / `param.end` / `param.duration`                |
| Custom    | Python 类，通过 `@AgentServer.custom_action()` 注册           |

## 关键字段

| 字段                       | 说明                                    |
| -------------------------- | --------------------------------------- |
| `next`                     | 后继节点数组（OR 逻辑，首个匹配者胜出） |
| `on_error`                 | 识别失败时的回退节点                    |
| `pre_delay` / `post_delay` | 动作前/后等待（毫秒）                   |
| `max_hit`                  | 最大命中次数，超出后跳过该节点          |
| `timeout`                  | 最大识别时间（默认 20000ms）            |
| `only_rec`                 | 仅识别不执行动作                        |

## 设计模式

### DirectHit 路由枢纽

```json
"HubNode": {
    "recognition": "DirectHit",
    "action": { "type": "DoNothing" },
    "next": ["BranchA", "BranchB", "BranchC"]
}
```

`next` 是 OR 逻辑：首个识别成功的节点被执行。

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
    // 无 next — [JumpBack] 返回父节点
}
```

`[JumpBack]` 前缀的节点执行后返回调用节点，只有非 JumpBack 节点能退出循环。

### max_hit 防循环

`max_hit: 5` 的节点最多执行 5 次，之后被跳过。用于循环出现的 UI 元素。

### 任务选项覆盖

`tasks/*.json` 中的 `pipeline_override` 可在运行时修改节点字段：

```json
"pipeline_override": {
    "FarmResources.Start": {
        "next": ["FarmResources.ResourceCollect"]
    }
}
```
