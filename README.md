<!-- markdownlint-disable MD033 MD041 -->
<div align="center">

<img alt="LOGO" src="resource/base/image/maakedr-logo_512x512.png" width="256" height="256" />

# MaaKEDR

《雪松》小助手。图像技术 + 模拟控制，解放双手！  
由 [MaaFramework](https://github.com/MaaXYZ/MaaFramework) 强力驱动！  
<a href="https://github.com/APPLe-DF/MaaKEDR" target="_blank" style="font-weight: bold;">🔗 本项目 GitHub 仓库</a>

</div>

<p align="center">
  <img alt="Python" src="https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white">
  <img alt="platform" src="https://img.shields.io/badge/platform-Windows-blueviolet">
  <img alt="license" src="https://img.shields.io/github/license/APPLe-DF/MaaKEDR">
  <br>
  <img alt="commit" src="https://img.shields.io/github/commit-activity/m/APPLe-DF/MaaKEDR">
</p>

<div align="center">

[English](./README.en.md) | [简体中文](./README.md)

</div>

> ℹ️ **项目状态：维护性更新**
>
> 本项目在完成清每日流程功能后，将转为**维护性更新模式**，
> 不再主动添加新内容，仅进行 bug 修复和必要的适配更新。
>
> 如需更完善的功能和更积极的维护，建议关注同类开源项目
> [MaaAssistantKedrgame (MAK)](https://github.com/Hollow-YK/MaaAssistantKedrgame)。

---

## 功能列表

- 启动游戏
- 领取奖励（派遣任务、每日/每周/军旅成就、战令通行证、邮箱，可独立开关）
- 资源刷取（特别军费行动、作战体能训练、兵种能力评级、载具对抗演练）
- 技能演练（基础技能、专业技能）
- 多关卡选择，可配置战斗次数（1~6 次 / 最大）
- 清空体力循环模式

---

## 使用说明

### 环境要求

- Windows 10+
- [VC++ Redistributable 2015+](https://aka.ms/vs/17/release/vc_redist.x64.exe)
- [.NET Desktop Runtime 10.0](https://dotnet.microsoft.com/download/dotnet/10.0)
- ADB 已配置（用于连接 Android 设备或模拟器）

### 下载安装

前往 [GitHub Releases](https://github.com/APPLe-DF/MaaKEDR/releases/latest) 下载最新版本压缩包，解压后运行即可。

### 安装运行

```bash
# 安装运行时依赖
DependencySetup_依赖库安装_win.bat

# 启动 GUI
MFAAvalonia.exe
```

在 MFAAvalonia 界面中选择任务并配置选项即可开始自动化。

---

## 开发相关

```bash
pnpm install          # 安装开发依赖
pnpm check            # 代码检查 + 类型检查
pnpm format:all       # 格式化所有文件
```

### 项目结构

```
MaaKEDR/
├── interface.json               # 项目入口配置
├── tasks/                       # 任务定义（GUI 中显示的任务列表）
│   ├── startup.json             #   启动游戏
│   ├── pvp.json                 #   玩家对战
│   ├── claim_rewards.json       #   领取奖励
│   └── farm_resources.json      #   资源刷取
├── resource/base/               # 核心资源
│   ├── pipeline/                #   Pipeline 流程定义
│   ├── image/                   #   模板匹配用图片
│   └── model/ocr/               #   PaddleOCR 模型
├── agent/                       # Python Agent（自定义识别/动作）
│   └── custom/
│       ├── recognition/         #   自定义识别
│       └── action/              #   自定义动作
├── docs/                        # 开发文档
├── tools/                       # 开发工具
└── .github/workflows/           # CI/CD 配置
```

更多文档请前往 [docs/](docs/README.md) 查看。

---

## 开发文档

详细的项目开发文档请参见 [docs/](docs/README.md)，包含：

- [Pipeline 编写指南](docs/zh_cn/develop/pipeline.md)
- [Custom 识别与动作开发](docs/zh_cn/develop/custom.md)
- [项目结构说明](docs/zh_cn/develop/structure.md)
- [格式化规范](docs/zh_cn/develop/formatting.md)
- [Bug 排查](docs/zh_cn/develop/fix.md)

---

## 鸣谢

### 核心框架

- [MaaFramework](https://github.com/MaaXYZ/MaaFramework)  
  基于图像识别的自动化黑盒测试框架

### UI 支持

- [MFAAvalonia](https://github.com/SweetSmellFox/MFAAvalonia)  
  基于 Avalonia UI 构建的 MaaFramework 通用 GUI 解决方案
- [MXU](https://github.com/MistEO/MXU)  
  基于 MaaFramework PI V2 协议的通用 GUI 客户端，使用 Tauri + React + TypeScript 构建

### 社区项目

- [M9A](https://github.com/MAA1999/M9A)  
  优秀的 MaaFramework 自动化项目，开发过程中多有参考

### 工具链

- [create-maa-project](https://github.com/Windsland52/create-maa-project) — 项目脚手架
- [MaaMCP](https://github.com/MAA-AI/MaaMCP) — MaaFramework MCP 服务器

---

## 加入我们

- MaaKEDR 交流群 QQ 群：1051890489

---

## 许可证

[AGPL-3.0](./LICENSE)
