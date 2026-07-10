# 格式化与规范

## 编码与缩进

- 编码：UTF-8
- 换行：LF（`.editorconfig` 和 `.gitattributes` 强制）
- JSON/YAML 缩进：4 空格
- TypeScript/Markdown 缩进：2 空格

## 命名规范

- Pipeline 节点：点分隔层级（如 `FarmResources.Start`、`ClaimRewards.CheckDaily`）
- 模板图片：描述性 kebab-case（如 `quick_battle.png`、`start_battle.png`）
- ROI 坐标：`[x, y, width, height]`，1280x720 分辨率

## 文件注释

Pipeline JSON 文件支持 `//` 注释（JSON-with-Comments）。

## 提交规范

- 格式： Conventional Commits（`feat:`、`fix:`、`docs:`、`chore:`）
- 每笔提交只关注一个改动
- 描述用自然语言，简洁清晰
