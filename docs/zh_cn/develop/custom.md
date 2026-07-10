# Custom 编写指南

## 自定义识别

当 TemplateMatch 和 OCR 无法满足需求时（如动态 ROI、条件判断），使用 Custom Recognition。

```python
from maa.agent.agent_server import AgentServer
from maa.custom_recognition import CustomRecognition
from maa.context import Context
from maa.pipeline import JOCR, JRecognitionType

@AgentServer.custom_recognition("MyRecognizer")
class MyRecognizer(CustomRecognition):
    def analyze(
        self, context: Context, argv: CustomRecognition.AnalyzeArg
    ) -> CustomRecognition.AnalyzeResult | None:
        # 解析 pipeline 传来的参数（JSON 字符串）
        # params = json.loads(argv.custom_recognition_param)

        # 使用 MaaFW API 做 OCR
        # detail = context.run_recognition_direct(
        #     JRecognitionType.OCR,
        #     JOCR(expected=["text"], roi=(x, y, w, h)),
        #     argv.image,
        # )

        # 返回识别结果
        return CustomRecognition.AnalyzeResult(
            box=(x, y, w, h),
            detail={"status": "found"}
        )
```

Pipeline 中调用：

```json
"NodeName": {
    "recognition": "Custom",
    "custom_recognition": "MyRecognizer",
    "custom_recognition_param": "{\"key\": \"value\"}",
    "action": { "type": "Click" }
}
```

> `custom_recognition_param` 是 JSON **字符串**（需序列化），不是 JSON 对象。

## 自定义动作

复杂操作（状态管理、条件逻辑）用 Custom Action。

```python
from maa.agent.agent_server import AgentServer
from maa.custom_action import CustomAction
from maa.context import Context

@AgentServer.custom_action("MyAction")
class MyAction(CustomAction):
    def run(
        self, context: Context, argv: CustomAction.RunArg
    ) -> CustomAction.RunResult:
        # params = json.loads(argv.custom_action_param)
        return CustomAction.RunResult(success=True)
```

Pipeline 中调用：

```json
"NodeName": {
    "recognition": "DirectHit",
    "action": {
        "type": "Custom",
        "param": {
            "custom_action": "MyAction",
            "custom_action_param": { "key": "value" }
        }
    }
}
```

> `custom_action_param` 是 JSON **对象**（直接传，不序列化）。

## MaaFW Python API

```python
# OCR
ocr = context.run_recognition_direct(
    JRecognitionType.OCR,
    JOCR(expected=["text"], roi=(x, y, w, h)),
    image,
)

# 模板匹配
match = context.run_recognition_direct(
    JRecognitionType.TemplateMatch,
    JTemplateMatch(template="path.png", roi=(x, y, w, h), threshold=0.8),
    image,
)

# 点击
context.run_action_direct(JActionType.Click, JClick(), box, "")

# 获取缓存截图
image = context.tasker.controller.cached_image

# 直接发送点击
context.tasker.controller.post_click(x, y).wait()

# 覆盖 next 跳转
context.override_next(argv.node_name, ["NextNodeA", "NextNodeB"])
```

## 注册模块

1. 在 `agent/custom/recognition/` 或 `agent/custom/action/` 下创建 Python 文件
2. 添加 `@AgentServer.custom_recognition("Name")` 或 `@AgentServer.custom_action("Name")` 装饰器
3. 在 `agent/custom/__init__.py` 的 `register_all()` 中注册模块
4. Pipeline 中通过 `custom_recognition` / `custom_action` 字段引用
