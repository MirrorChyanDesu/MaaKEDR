# Custom 编写指南

## 自定义识别

```python
from maa.agent.agent_server import AgentServer
from maa.custom_recognition import CustomRecognition
from maa.context import Context

@AgentServer.custom_recognition("YourRecognizer")
class YourRecognizer(CustomRecognition):
    def analyze(self, context: Context, argv: CustomRecognition.AnalyzeArg):
        # 解析参数（JSON 字符串）
        params = json.loads(argv.custom_recognition_param)
        # 识别逻辑
        return CustomRecognition.AnalyzeResult(box=(x, y, w, h), detail={})
```

Pipeline 中调用：

```json
"NodeName": {
    "recognition": "Custom",
    "custom_recognition": "YourRecognizer",
    "custom_recognition_param": "{\"key\": \"value\"}",
    "action": { "type": "Click" }
}
```

> `custom_recognition_param` 必须是 JSON **字符串**（序列化后），不是 JSON 对象。

## 自定义动作

```python
from maa.agent.agent_server import AgentServer
from maa.custom_action import CustomAction
from maa.context import Context

@AgentServer.custom_action("YourAction")
class YourAction(CustomAction):
    def run(self, context: Context, argv: CustomAction.RunArg):
        params = json.loads(argv.custom_action_param)
        return CustomAction.RunResult(success=True)
```

Pipeline 中调用：

```json
"NodeName": {
    "recognition": "DirectHit",
    "action": {
        "type": "Custom",
        "param": {
            "custom_action": "YourAction",
            "custom_action_param": { "key": "value" }
        }
    }
}
```

> `custom_action_param` 是 JSON **对象**（直接传，不序列化）。

## MaaFW Python API

```python
# OCR
ocr_detail = context.run_recognition_direct(
    JRecognitionType.OCR,
    JOCR(expected=["text"], roi=(x, y, w, h)),
    image,
)

# 模板匹配
match_detail = context.run_recognition_direct(
    JRecognitionType.TemplateMatch,
    JTemplateMatch(template="path.png", roi=(x, y, w, h), threshold=0.8),
    image,
)

# 点击
context.run_action_direct(JActionType.Click, JClick(), box, "")

# 获取截图
image = context.tasker.controller.cached_image

# 发起点击
context.tasker.controller.post_click(x, y).wait()

# 覆盖 next 跳转
context.override_next(argv.node_name, ["NextNodeA", "NextNodeB"])
```
