# Pipeline Guide

## Node Structure

Each pipeline node defines a recognition → action → transition step:

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

| Type          | Use Case      | Description                                                       |
| ------------- | ------------- | ----------------------------------------------------------------- |
| TemplateMatch | Static UI     | OpenCV template matching, images in `image/`, threshold 0.7       |
| OCR           | Dynamic text  | PaddleOCR v5, `expected` supports regex, `roi` for text region    |
| DirectHit     | Routing       | Always matches, used for `next` branching                         |
| Custom        | Complex logic | Python custom recognition via `@AgentServer.custom_recognition()` |
| ColorMatch    | Color filter  | Used with OCR `color_filter` field for background removal         |

## Action Types

| Type      | Description                                                                       |
| --------- | --------------------------------------------------------------------------------- |
| Click     | Click matched position. `target: true` for center, `target: [x,y,w,h]` for offset |
| DoNothing | Recognition-only, no action                                                       |
| Swipe     | Swipe with `param.begin` / `param.end` / `param.duration`                         |
| Custom    | Python custom action via `@AgentServer.custom_action()`                           |

## Common Fields

| Field                      | Description                                                   |
| -------------------------- | ------------------------------------------------------------- |
| `pre_delay` / `post_delay` | Wait before/after action (ms). Navigation clicks: 1000-2000ms |
| `post_wait_freezes`        | Wait until screen stops changing (smarter than fixed delay)   |
| `max_hit`                  | Max hits before skip. For looping UI elements                 |
| `timeout`                  | Recognition timeout (ms), default 20000                       |
| `only_rec`                 | Recognition only, no action                                   |
| `focus`                    | Log notification on hit/failure                               |
| `color_filter`             | OCR color pre-filter, references a ColorMatch node            |

## Naming Conventions

- Use **dot-separated hierarchy**: `FarmResources.Start`, `ClaimRewards.CheckDaily`
- Prefix with module name: `PVP.`, `BattlePass.`, `Common.`
- JumpBack nodes must NOT have `next`

## Design Patterns

### Linear Flow

Best for sequential operations (e.g., game launch):

```json
"LaunchGame": {
    "recognition": "DirectHit",
    "action": {
        "type": "DoNothing",
        "param": { "package": "com.phxh.official.nld" }
    },
    "next": ["ClickToStart"]
},
"ClickToStart": {
    "recognition": "TemplateMatch",
    "template": "click_to_start.png",
    "action": { "type": "Click" },
    "post_delay": 2000,
    "next": ["DailyLoginReward", "CheckHomePage"]
}
```

### DirectHit Hub

```json
"HubNode": {
    "recognition": "DirectHit",
    "action": { "type": "DoNothing" },
    "next": ["BranchA", "BranchB"]
}
```

`next` is OR logic: tries from top to bottom, executes the first match.

### [JumpBack] Central Hub

Suitable for repeating sub-module visits (e.g., reward claim loop):

```json
"ClaimRewards.MainHub": {
    "recognition": "DirectHit",
    "action": { "type": "DoNothing" },
    "next": [
        "[JumpBack]DispatchClaim.Start",
        "[JumpBack]ClaimRewards.Start",
        "[JumpBack]BattlePass.Start",
        "[JumpBack]Mailbox.Start"
    ]
}
```

`[JumpBack]` nodes return to the parent after execution. Only non-JumpBack nodes can exit the loop.

### Battle Loop

```json
"BattleStage": {
    "recognition": "DirectHit",
    "action": { "type": "DoNothing" },
    "next": [
        "[JumpBack]ClickVictory",
        "[JumpBack]ClickItemDialog",
        "QuickBattle"
    ]
}
```

### Task Option Override

`tasks/*.json` uses `pipeline_override` to modify node behavior at runtime:

```json
"pipeline_override": {
    "FarmResources.Start": {
        "next": ["FarmResources.ResourceCollect"]
    }
}
```

Can override `next`, `roi`, `threshold`, `custom_action_param`, etc.

### max_hit Anti-loop

```json
"ClaimButton": {
    "max_hit": 5,
    ...
}
```

Max 5 hits before skip. Counts cross-session.

## Notes

1. **Sufficient delays** — At least 1000ms after navigation clicks
2. **OCR expected is regex** — `".*"` matches anything, `"^text$"` exact match
3. **ROI at 1280x720** — coordinates `[x, y, w, h]`
4. **Always add `on_error`** — For critical navigation nodes
5. **`next` order matters** — Put high-priority matches first
6. **Use `post_wait_freezes`** — More reliable than fixed `post_delay` for animations
