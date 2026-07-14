import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  base: '/MaaKEDR/',
  lang: 'zh-CN',
  title: 'MaaKEDR',
  description: '《雪松》小助手 — 基于 MaaFramework 的自动化工具',
  bundler: viteBundler(),
  shouldPrefetch: false,
  theme: plumeTheme({
    hostname: 'https://appledf.github.io',
    docsRepo: 'APPLe-DF/MaaKEDR',
    docsDir: 'docs',
    docsBranch: 'master',
    editLink: true,
    cache: 'filesystem',
    autoFrontmatter: {
      permalink: false,
      createTime: false,
      title: false,
    },
    footer: false,
    watermark: false,
    notes: [],
    locales: {
      '/zh_cn/': {
        navbar: [
          { text: '首页', link: '/' },
          { text: '开发文档', link: '/zh_cn/develop/' },
        ],
        collections: [
          {
            dir: '/zh_cn/develop/',
            link: '/zh_cn/develop/',
            text: '开发文档',
            sidebar: [
              { text: 'Pipeline 编写指南', link: '/zh_cn/develop/pipeline' },
              { text: 'Custom 编写指南', link: '/zh_cn/develop/custom' },
              { text: 'Vibe Coding 说明', link: '/zh_cn/develop/vibe-coding' },
              { text: 'Bug 排查', link: '/zh_cn/develop/fix' },
              { text: '格式化规范', link: '/zh_cn/develop/formatting' },
              { text: '项目结构说明', link: '/zh_cn/develop/structure' },
            ],
          },
        ],
      },
      '/en_us/': {
        navbar: [
          { text: 'Home', link: '/' },
          { text: 'Development', link: '/en_us/develop/' },
        ],
        collections: [
          {
            dir: '/en_us/develop/',
            link: '/en_us/develop/',
            text: 'Development Docs',
            sidebar: [
              { text: 'Pipeline Guide', link: '/en_us/develop/pipeline' },
              { text: 'Custom Guide', link: '/en_us/develop/custom' },
              { text: 'Vibe Coding', link: '/en_us/develop/vibe-coding' },
              { text: 'Troubleshooting', link: '/en_us/develop/fix' },
              { text: 'Formatting', link: '/en_us/develop/formatting' },
              { text: 'Project Structure', link: '/en_us/develop/structure' },
            ],
          },
        ],
      },
    },
  }),
})