# Vibe Coding 开发说明

## 概述

本项目很大程度使用了 **Vibe Coding** 开发模式 —— 通过与 AI 助手对话逐步生成代码。开发者负责提供需求、截图、ROI 坐标、UI 分析和验收，AI 负责实现 pipeline 逻辑、Python 自定义节点、CI/CD 配置和文档编写。

## 工具链

### MaaMCP

[MaaMCP](https://github.com/MAA-AI/MaaMCP) 是 MaaFramework 生态中的 MCP 服务器，为 AI 助手提供了直接操作 MaaFramework 项目的能力。AI 可以通过 MaaMCP 理解项目结构、读取 pipeline 文件、分析问题日志，大幅提升了开发效率。

### create-maa-project

[create-maa-project](https://github.com/Windsland52/create-maa-project) 是 MaaFramework 的项目脚手架工具，用于创建、维护和发布 MaaFramework 项目。本项目的初始化、运行时同步、schema 验证和发布流程均依赖此工具。

### AGENTS.md

[AGENTS.md](../../../AGENTS.md) 是本项目的 AI 行为指南文件。它定义了 AI 助手在开发过程中的行为规范和约束条件，包括项目结构说明、文档指引、构建命令、编码规范、常用开发场景的应对策略等。AI 在开发过程中通过学习该文件了解项目约定，确保生成代码的风格和规范与项目保持一致。

## 参考仓库

AI 在开发过程中参考了以下仓库的代码和架构设计：

### MaaFramework 仓库

本地克隆了 [MaaFramework](https://github.com/MaaXYZ/MaaFramework) 仓库，用于让 AI 理解框架的 API 设计、pipeline 协议规范和具体实现细节。当遇到框架层面的问题时，AI 可以直接查阅源码寻找答案。

### M9A 仓库

本地克隆了 [M9A](https://github.com/MAA1999/M9A) 仓库，这是一个优秀的 MaaFramework 社区项目，经过了 `create-maa-project` 重构，具有很高的参考价值。在项目开发过程中，很多问题（如 pipeline 设计模式、自定义节点实现、CI/CD 配置、发版流程等）都通过让 AI 学习 M9A 的代码得到了解决。

## 开发流程

1. **需求分析**：开发者提出功能需求，提供游戏截图和 ROI。如果接入的 AI 具备多模态能力且能力强大（如 Fable 5 等），也可以通过 **MaaMCP** 让 AI 自主进行截图识别、UI 分析等工作，进一步降低人工介入。
2. **AI 实现**：AI 参考 MaaFramework API 和 M9A 实现，编写 pipeline 和 Python 代码
3. **验证**：运行 `pnpm check` 和 `pnpm check:py` 确保代码质量
4. **迭代**：开发者验收，提出修改意见，AI 调整
5. **发版**：使用 create-maa-project 工具链完成打包和发布

## 致谢

感谢 MaaFramework 团队提供的强大框架，感谢 M9A 项目的优秀实践参考，感谢 MaaMCP 和 create-maa-project 等工具的支持，大幅降低了本项目的开发难度。
