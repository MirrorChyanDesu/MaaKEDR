# Custom Recognition & Action

## Custom Recognition

Use when TemplateMatch or OCR can't handle your needs (dynamic ROI, conditional logic).

```python
from maa.agent.agent_server import AgentServer
from maa.custom_recognition import CustomRecognition
from maa.context import Context

@AgentServer.custom_recognition("MyRecognizer")
class MyRecognizer(CustomRecognition):
    def analyze(
        self, context: Context, argv: CustomRecognition.AnalyzeArg
    ) -> CustomRecognition.AnalyzeResult | None:
        # Parse params from pipeline (JSON string)
        # params = json.loads(argv.custom_recognition_param)

        # Use MaaFW API for OCR/template matching
        # detail = context.run_recognition_direct(...)

        return CustomRecognition.AnalyzeResult(
            box=(x, y, w, h),
            detail={"status": "found"}
        )
```

Pipeline usage:

```json
"NodeName": {
    "recognition": "Custom",
    "custom_recognition": "MyRecognizer",
    "custom_recognition_param": "{\"key\": \"value\"}",
    "action": { "type": "Click" }
}
```

> `custom_recognition_param` is a JSON **string** (serialized), not an object.

## Custom Action

For stateful operations or complex logic.

```python
from maa.agent.agent_server import AgentServer
from maa.custom_action import CustomAction
from maa.context import Context

@AgentServer.custom_action("MyAction")
class MyAction(CustomAction):
    def run(
        self, context: Context, argv: CustomAction.RunArg
    ) -> CustomAction.RunResult:
        return CustomAction.RunResult(success=True)
```

Pipeline usage:

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

> `custom_action_param` is a JSON **object** (passed directly, not serialized).

## MaaFW Python API

```python
# OCR
detail = context.run_recognition_direct(
    JRecognitionType.OCR,
    JOCR(expected=["text"], roi=(x, y, w, h)),
    image,
)

# Template match
match = context.run_recognition_direct(
    JRecognitionType.TemplateMatch,
    JTemplateMatch(template="path.png", roi=(x, y, w, h), threshold=0.8),
    image,
)

# Click
context.run_action_direct(JActionType.Click, JClick(), box, "")

# Get cached screenshot
image = context.tasker.controller.cached_image

# Override next transition
context.override_next(argv.node_name, ["NextNodeA", "NextNodeB"])
```

## Registration

1. Create a Python file in `agent/custom/recognition/` or `agent/custom/action/`
2. Add `@AgentServer.custom_recognition("Name")` or `@AgentServer.custom_action("Name")` decorator
3. Register the module in `agent/custom/__init__.py::register_all()`
4. Reference via `custom_recognition` / `custom_action` in pipeline JSON
