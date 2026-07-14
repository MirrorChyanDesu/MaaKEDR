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
  }),
})
