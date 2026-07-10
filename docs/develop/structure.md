# 项目结构

```
MaaKEDR/
├── interface.json                  # MaaFW 项目定义
├── maa-project.json / .lock.json   # 工具状态文件
├── package.json                    # Node 工具链（脚本）
├── maatools.config.mts             # MaaTools 配置
│
├── resource/base/
│   ├── default_pipeline.json       # 继承默认参数
│   ├── pipeline/
│   │   ├── startup.json            # 启动游戏
│   │   ├── claim_rewards.json      # 领取奖励
│   │   └── farm_resources.json     # 资源刷取
│   ├── image/                      # 模板图片
│   │   ├── claim_rewards/
│   │   ├── farm_resources/
│   │   └── ...
│   └── model/ocr/                  # PaddleOCR v5 模型
│
├── agent/                          # Python Agent
│   ├── bootstrap.py                # 入口：venv/依赖 → main.py
│   ├── main.py                     # 转接 → agent_runtime.run_agent()
│   ├── agent_runtime.py            # 核心：注册 → AgentServer
│   ├── custom/
│   │   ├── recognition/
│   │   └── action/
│   └── utils/
│
├── tasks/                          # 任务入口定义
│   ├── startup.json
│   ├── claim_rewards.json
│   └── farm_resources.json
│
├── tools/                          # 开发工具
│   ├── build-release.mjs
│   ├── check-project.mjs
│   ├── validate-schema.mjs
│   └── schema/
│
└── docs/                           # 文档
    ├── README.md
    └── develop/
```

## 三层架构

```
tasks/*.json ──→ pipeline/*.json ──→ agent/custom/
(task 入口)      (节点图)            (Python 自定义逻辑)
```

**Layer 1 — Tasks**：定义 GUI 中显示的任务入口和可选项

**Layer 2 — Pipeline**：JSON 节点构成的有向图，90% 的自动化逻辑在此

**Layer 3 — Agent**：Python 自定义识别/动作，处理复杂逻辑
