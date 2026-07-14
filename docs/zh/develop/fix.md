---
title: "Bug 排查"
order: 3
icon: "ri:bug-fill"
---

# Bug 排查

## 日志文件位置

| 文件                        | 说明                                |
| --------------------------- | ----------------------------------- |
| `debug/agent-bootstrap.log` | Agent 启动日志                      |
| `maafw.log`                 | MaaFramework 运行日志（项目根目录） |
| `debug/`                    | 调试截图目录（识别过程的截图）      |

## 问题分类

### 启动类

#### Agent 启动失败

现象：`Python >=3.13,<3.14 is required`

原因：系统 Python 版本不匹配。项目需要 Python 3.13.x。

解决：项目使用 `uv` 管理 Python 版本，确保已安装 `uv` 并执行过 `uv sync`。

#### Custom 模块未注册

现象：自定义识别或动作执行失败，返回 `success: false`

常见原因：`agent/custom/recognition/__init__.py` 的 `RECOGNITION_MODULES` 中没有添加新的模块名。

解决：添加模块名，例如 `RECOGNITION_MODULES = ("farm_resources", "pvp")`。

### 运行时类

#### Pipeline 节点卡住

现象：任务在某节点停留不动直到超时

常见原因：

1. **截图过时** — 前一个操作的 `post_delay` 太短，截图时画面还没稳定。加长 `post_delay`（导航后至少 1000ms）
2. **ROI 不匹配** — 游戏更新后 UI 位置变了，需更新 ROI
3. **模板图片过时** — 游戏 UI 变更后模板图失效，需重新截图
4. **节点没有兜底** — 重要的导航节点没加 `on_error`

#### JumpBack 节点异常

现象：JumpBack 节点执行后行为不符合预期

原因：JumpBack 节点设置了 `next`。参考规则：**JumpBack 节点不能有 `next`**。

#### 清体力模式循环

现象：体力不足时一直在减次数，减到 1 后仍然继续

常见原因：清体力模式的 `ExitStage` 和 `ExitStageConfirm` 的 `next` 指向了 `BattleStage` 而不是退出路径。

解决：检查 `tasks/farm_resources.json` 中清体力模式的 override，确保退出路径正确。

### 识别类

#### 关卡识别不到

现象：`CheckResourceStage` 一直返回失败

可能原因：

1. 关卡未解锁（文字灰色，OCR 无法识别）— 检查 `lock_icon.png` 模板
2. 需要先向左滑动复位（关卡列表偏移了）— 确认 `SwipeToBegin` 节点已执行
3. `custom_recognition_param` 中的 `stage_index` 或 `resource_type` 不匹配

#### 体力不足时流程卡住

现象：体力耗尽后任务不退出

原因：`no_stamina.png` 模板图片不存在或 ROI 不对，导致无法识别体力不足弹窗。

#### Schema 验证失败

现象：CI 报错 `must NOT have unevaluated properties`

原因：使用了不被当前 schema 支持的字段。常见如 `only_rec` 搭配 TemplateMatch 使用。

解决：检查 `tools/schema/` 下的 schema 定义，移除不支持的字段。

### 日志分析

运行日志（`maafw.log`）中包含每次识别的详细结果：

```json
{
    "reco_id": 400000431,
    "algorithm": "Custom",
    "box": null,
    "detail": {"all": [], "best": null},
    "name": "PVP.ReadResult"
}
```

- `box: null` — 识别未命中
- `box: [x, y, w, h]` — 识别成功，返回区域坐标
- `detail.all` — 所有识别结果
- `detail.best` — 最佳匹配结果

查看 `debug/` 目录下的截图可以确认当前画面是否与预期一致。
