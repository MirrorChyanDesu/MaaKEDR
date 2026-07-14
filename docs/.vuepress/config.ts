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
    plugins: {
      blog: false,
    },
    locales: {
      '/zh_cn/': {
        navbar: [
          { text: '首页', link: '/' },
          { text: '开发文档', link: '/zh_cn/develop/' },
        ],
        sidebar: {
          '/zh_cn/develop/': [
            {
              text: '开发文档',
              children: [
                '/zh_cn/develop/pipeline.md',
                '/zh_cn/develop/custom.md',
                '/zh_cn/develop/vibe-coding.md',
                '/zh_cn/develop/fix.md',
                '/zh_cn/develop/formatting.md',
                '/zh_cn/develop/structure.md',
              ],
            },
          ],
        },
      },
      '/en_us/': {
        navbar: [
          { text: 'Home', link: '/' },
          { text: 'Development', link: '/en_us/develop/' },
        ],
        sidebar: {
          '/en_us/develop/': [
            {
              text: 'Development Docs',
              children: [
                '/en_us/develop/pipeline.md',
                '/en_us/develop/custom.md',
                '/en_us/develop/vibe-coding.md',
                '/en_us/develop/fix.md',
                '/en_us/develop/formatting.md',
                '/en_us/develop/structure.md',
              ],
            },
          ],
        },
      },
    },
  }),
})
