import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

import { genSiteLocales, HOSTNAME, BASE_URL, locales } from './config/site.ts'

export default defineUserConfig({
  base: BASE_URL,
  lang: 'zh-CN',
  title: 'MaaKEDR',
  description: '《雪松》小助手 — 基于 MaaFramework 的自动化工具',

  locales: genSiteLocales(),

  plugins: [],

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: `${BASE_URL}images/maakedr-logo_128x128.png` }],
  ],

  bundler: viteBundler(),

  shouldPrefetch: false,

  theme: plumeTheme({
    hostname: HOSTNAME,

    docsRepo: 'APPLe-DF/MaaKEDR',
    docsDir: 'docs',
    docsBranch: 'master',

    editLink: true,
    lastUpdated: false,
    contributors: false,
    changelog: false,

    cache: 'filesystem',

    autoFrontmatter: {
      permalink: false,
      createTime: false,
      title: false,
    },

    search: {
      provider: 'local',
    },

    markdown: {
      image: {
        figure: true,
        lazyload: true,
        mark: true,
        size: true,
      },
      fileTree: {
        icon: 'colored',
      },
    },

    watermark: false,
  }),
})
