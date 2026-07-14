import { SiteLocaleConfig, LocaleConfig } from 'vuepress'
import { ThemeLocaleData } from 'vuepress-theme-plume'

import { locales } from './i18n.ts'
import { navigation } from '../config/navigation.ts'

export function genSiteLocales(): SiteLocaleConfig {
  const siteLocales: SiteLocaleConfig = {}
  for (const locale of locales) {
    siteLocales[`/${locale.name}/`] = {
      lang: locale.htmlLang,
      title: locale.siteTitle,
      description: locale.siteDescription,
    }
  }
  return siteLocales
}

export function genThemeLocales(): LocaleConfig<ThemeLocaleData> {
  const themeLocales: LocaleConfig<ThemeLocaleData> = {}
  for (const locale of locales) {
    const nav = navigation[locale.name]
    themeLocales[`/${locale.name}/`] = {
      navbar: nav?.navbar ?? [],
      collections: nav?.collections ?? [],
    }
  }
  return themeLocales
}
