<!-- markdownlint-disable MD033 MD041 -->
<div align="center">

<img alt="LOGO" src="resource/base/image/maakedr-logo_512x512.png" width="256" height="256" />

# MaaKEDR

Cedar Automation Assistant. Image recognition + simulated control, free your hands!  
Powered by [MaaFramework](https://github.com/MaaXYZ/MaaFramework)!  
<a href="https://github.com/APPLe-DF/MaaKEDR" target="_blank" style="font-weight: bold;">🔗 GitHub Repository</a>

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

> ⚠️ **Project Status: Semi-Abandoned**
>
> The developer is lazy and recently discovered a similar open-source project
> [MaaAssistantKedrgame (MAK)](https://github.com/Hollow-YK/MaaAssistantKedrgame)
> with more complete features and active maintenance.
> If you need a reliable tool, please use [MAK](https://github.com/Hollow-YK/MaaAssistantKedrgame) instead.
>
> This project is now **semi-abandoned** and will no longer be maintained as a primary tool,
> but may receive occasional updates as the developer's personal practice project.

---

## Features

- Game Launch
- Claim Rewards (daily/weekly/military achievements, battle pass, mailbox — individually toggleable)
- Resource Farming (Special Funds, Physical Training, Unit Rating, Vehicle Drill)
- Skill Training (Basic Skills, Advanced Skills)
- Multiple stage selection with configurable battle count (1-6 / max)
- Stamina-drain loop mode

---

## User Guide

### Requirements

- Windows 10+
- [VC++ Redistributable 2015+](https://aka.ms/vs/17/release/vc_redist.x64.exe)
- [.NET Desktop Runtime 10.0](https://dotnet.microsoft.com/download/dotnet/10.0)
- ADB set up (for connecting to Android device or emulator)

### Installation & Run

```bash
# Install runtime dependencies
DependencySetup_依赖库安装_win.bat

# Launch the GUI
MFAAvalonia.exe
```

Select tasks and configure options in the MFAAvalonia UI to start automation.

---

## Development

```bash
pnpm install          # Install dev dependencies
pnpm check            # Lint + typecheck
pnpm format:all       # Format all files
```

### Project Structure

```
MaaKEDR/
├── resource/base/           # Core resources
│   ├── pipeline/            # Pipeline definitions
│   ├── image/               # Template images
│   └── model/ocr/           # PaddleOCR models
├── agent/                   # Python Agent (custom recognition/actions)
│   └── custom/
│       ├── recognition/     # Custom recognition
│       └── action/          # Custom actions
├── tasks/                   # Task entry points
├── tools/                   # Dev tools
└── interface.json           # MaaFramework project definition
```

For more documentation, visit the [MaaFramework](https://github.com/MaaXYZ/MaaFramework) main repository.

---

## Development Docs

See [docs/](docs/README.md) for detailed development documentation:

- Pipeline Writing Guide
- Custom Recognition & Action Development
- Project Structure
- Formatting Conventions
- Troubleshooting

---

## Acknowledgments

### Core Framework

- [MaaFramework](https://github.com/MaaXYZ/MaaFramework)  
  An automation black-box testing framework based on image recognition

### UI Support

- [MFAAvalonia](https://github.com/SweetSmellFox/MFAAvalonia)  
  Universal MaaFramework GUI solution built with Avalonia UI

### Community Project

- [M9A](https://github.com/MAA1999/M9A)  
  An excellent MaaFramework automation project — referenced during development

### Toolchain

- [create-maa-project](https://github.com/Windsland52/create-maa-project) — Project scaffolding
- [MaaMCP](https://github.com/MAA-AI/MaaMCP) — MaaFramework MCP server

---

## Join Us

- MaaKEDR Community QQ Group: 1051890489

---

## License

[AGPL-3.0](./LICENSE)
