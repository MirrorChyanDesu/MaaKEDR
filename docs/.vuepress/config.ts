import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

import { genSiteLocales } from './navigation/genLocales.ts'

const isProd = process.env.NODE_ENV === 'production'

export default defineUserConfig({
  base: '/MaaKEDR/',
  lang: 'zh-CN',
  title: 'MaaKEDR',
  description: '《雪松》小助手 — 基于 MaaFramework 的自动化工具',

  locales: genSiteLocales(),

  plugins: [],

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/images/maakedr-logo_32x32.png' }],
  ],

  bundler: viteBundler(),

  shouldPrefetch: false,

  theme: plumeTheme({
    hostname: 'https://maakedr.app',

    docsRepo: 'APPLe-DF/MaaKEDR',
    docsDir: '/docs',
    docsBranch: 'main',

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
