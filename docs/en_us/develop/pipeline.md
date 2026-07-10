# Pipeline Writing Guide

## Node Structure

Each pipeline node defines a recognition → action → transition step in JSON:

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

## Recognition Types

| Type          | Use Case           | Notes                                                      |
| ------------- | ------------------ | ---------------------------------------------------------- |
| TemplateMatch | Static UI elements | OpenCV matching, images in `image/`, default threshold 0.7 |
| OCR           | Dynamic text       | PaddleOCR v5, `expected` supports regex                    |
| DirectHit     | Routing hub        | Always matches, used for `next` branching                  |
| Custom        | Complex logic      | Python class via `@AgentServer.custom_recognition()`       |

## Action Types

| Type      | Description                                                                        |
| --------- | ---------------------------------------------------------------------------------- |
| Click     | Click recognized position. `target: true` = center; `target: [x,y,w,h]` = absolute |
| DoNothing | Recognition-only routing                                                           |
| Swipe     | `param.begin` / `param.end` / `param.duration`                                     |
| Custom    | Python class via `@AgentServer.custom_action()`                                    |

## Key Fields

| Field                      | Description                                                            |
| -------------------------- | ---------------------------------------------------------------------- |
| `pre_delay` / `post_delay` | Wait before/after action (ms). Use 1000-2000ms after navigation clicks |
| `max_hit`                  | Max times this node fires before being skipped                         |
| `timeout`                  | Recognition timeout (ms, default 20000)                                |
| `only_rec`                 | Recognize only, no action                                              |
| `on_error`                 | Fallback when recognition fails                                        |

## Design Patterns

### JumpBack Battle Loop

```json
"Dispatcher": {
    "recognition": "DirectHit",
    "action": { "type": "DoNothing" },
    "next": [
        "[JumpBack]HandleA",
        "[JumpBack]HandleB",
        "ExitNode"
    ]
},
"HandleA": {
    "recognition": "TemplateMatch",
    "template": "something.png",
    "action": { "type": "Click" }
    // NO next — JumpBack returns to parent
}
```

`[JumpBack]` nodes return to the parent after execution. **JumpBack nodes must NOT have `next`.**

### Task Option Override

Modify node behavior at runtime via `pipeline_override` in `tasks/*.json`:

```json
"pipeline_override": {
    "FarmResources.Start": {
        "next": ["FarmResources.ResourceCollect"]
    }
}
```

### max_hit Anti-Loop

```json
"ClaimButton": {
    "max_hit": 5,
    ...
}
```

Fires at most 5 times before being skipped. Good for cyclic UI elements.

## Tips

1. **post_delay** of 1000-2000ms after navigation clicks prevents stale screenshots
2. **OCR `expected` is regex** — `".*"` matches anything, `"^text$"` exact match
3. **ROI** is `[x, y, w, h]` at 1280x720 resolution
4. **Node naming** uses dot-separated hierarchy (e.g. `FarmResources.Start`)
5. **Always add `on_error`** to critical navigation nodes
