export const BASE_URL = '/MaaKEDR/'

export interface Locale {
  name: string
  htmlLang: string
  siteTitle: string
  siteDescription: string
}

export const locales: Locale[] = [
  {
    name: 'zh',
    htmlLang: 'zh-CN',
    siteTitle: 'MaaKEDR',
    siteDescription: '《雪松》小助手 — 基于 MaaFramework 的自动化工具',
  },
  {
    name: 'en',
    htmlLang: 'en-US',
    siteTitle: 'MaaKEDR',
    siteDescription: 'Cedar Automation Assistant — Powered by MaaFramework',
  },
]
