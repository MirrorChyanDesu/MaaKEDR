# Bug 排查

## 日志文件位置

- `debug/agent-bootstrap.log` — Agent 启动日志
- `maafw.log` — MaaFramework 运行日志（项目根目录）

## 常见问题

### Agent 启动失败

**现象**：`Python >=3.13,<3.14 is required`

**原因**：系统 Python 版本不匹配。项目需要 Python 3.13.x。

**解决**：项目使用 `uv` 管理 Python 版本，确保已安装 `uv` 并执行过 `uv sync`。

### Pipeline 节点卡住

**现象**：任务在某节点停留不动直到超时

**常见原因**：

1. **截图过时** — 前一个操作的 `post_delay` 太短，截图时画面还没稳定。加长 `post_delay`（导航后至少 1000ms）
2. **ROI 不匹配** — 游戏更新后 UI 位置变了，需更新 ROI
3. **模板图片过时** — 游戏 UI 变更后模板图失效，需重新截图
4. **节点没有兜底** — 重要的导航节点没加 `on_error`

### JumpBack 节点异常

**现象**：JumpBack 节点执行后行为不符合预期

**原因**：JumpBack 节点设置了 `next`。参考规则：**JumpBack 节点不能有 `next`**。

### 关卡识别不到

**现象**：`CheckResourceStage` 一直返回失败

**可能原因**：

1. 关卡未解锁（文字灰色，OCR 无法识别）— 检查 `lock_icon.png` 模板
2. 需要先向左滑动复位（关卡列表偏移了）— 确认 `SwipeToBegin` 节点已执行
3. `custom_recognition_param` 中的 `stage_index` 或 `resource_type` 不匹配

### 体力不足时流程卡住

**现象**：体力耗尽后任务不退出

**原因**：`no_stamina.png` 模板图片不存在或 ROI 不对，导致无法识别体力不足弹窗
