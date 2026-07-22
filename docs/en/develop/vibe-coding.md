---
title: "Vibe Coding"
order: 2
icon: "ri:robot-fill"
---

# Vibe Coding Development

## Overview

This project was largely developed using **Vibe Coding** — generating code through iterative conversations with an AI assistant. The developer provides requirements, screenshots, ROIs, UI analysis, and validation; the AI implements pipeline logic, Python custom nodes, CI/CD configuration, and documentation.

## Toolchain

### MaaMCP

[MaaMCP](https://github.com/MAA-AI/MaaMCP) is an MCP server in the MaaFramework ecosystem that provides AI assistants with direct access to MaaFramework projects. The AI uses MaaMCP to understand project structure, read pipeline files, and analyze logs, greatly improving development efficiency.

### create-maa-project

[create-maa-project](https://github.com/Windsland52/create-maa-project) is the project scaffolding tool for MaaFramework. It handles project initialization, runtime synchronization, schema validation, and release workflows for this project.

### AGENTS.md

[AGENTS.md](https://github.com/APPLe-DF/MaaKEDR/blob/main/AGENTS.md) is the AI behavior guide for this project. It defines behavioral norms and constraints for the AI assistant during development, including project structure, documentation references, build commands, coding conventions, and strategies for common development scenarios. The AI learns from this file to ensure generated code aligns with the project's conventions.

## Reference Repositories

The AI referenced the following repositories during development:

### MaaFramework Repository

A local clone of [MaaFramework](https://github.com/MaaXYZ/MaaFramework) was used to help the AI understand the framework's API design, pipeline protocol specifications, and implementation details. When encountering framework-level issues, the AI could directly consult the source code.

### M9A Repository

A local clone of [M9A](https://github.com/MAA1999/M9A) was used as a reference. M9A is an excellent community MaaFramework project that has been restructured with `create-maa-project`. It provides valuable reference for pipeline design patterns, custom node implementations, CI/CD configuration, and release workflows.

## Development Workflow

1. **Requirements**: Developer provides feature requirements, screenshots, and ROIs. If the AI has multimodal capabilities (such as Fable 5), it can also use **MaaMCP** to autonomously perform screenshot recognition and UI analysis.
2. **AI Implementation**: AI references MaaFramework API and M9A implementations, writes pipeline and Python code
3. **Validation**: Run `pnpm check` and `pnpm check:py` for code quality
4. **Iteration**: Developer reviews, provides feedback, AI adjusts
5. **Release**: Package and publish using the create-maa-project toolchain

## Acknowledgments

Thanks to the MaaFramework team for the powerful framework, the M9A project for excellent reference implementations, and tools like MaaMCP and create-maa-project that greatly reduced the development difficulty of this project.
