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
    ['link', { rel: 'icon', type: 'image/png', href: `${BASE_URL}images/maakedr-logo_512x512.png` }],
    ['meta', { name: 'baidu-site-verification', content: 'codeva-GnOwnwiCSA' }],
    ['meta', { name: 'msvalidate.01', content: '6A49AB032E4ED1D8DC8BD5B30324C3ED' }],
    ['meta', { name: 'google-site-verification', content: 'bLO4xMnM1-AK3Gw_hBpnuPxb3ztH4QW0HCHK_1_M7Tg' }],
  ],

  bundler: viteBundler(),

  shouldPrefetch: false,

  theme: plumeTheme({
    hostname: HOSTNAME,

    docsRepo: 'APPLe-DF/MaaKEDR',
    docsDir: 'docs',
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
