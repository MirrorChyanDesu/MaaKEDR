import { defineThemeConfig } from 'vuepress-theme-plume'
import { genThemeLocales } from './navigation/genLocales.ts'

export default defineThemeConfig({
  logo: '/images/maakedr-logo_32x32.png',

  appearance: true,

  social: [
    { icon: 'github', link: 'https://github.com/APPLe-DF/MaaKEDR' },
  ],
  navbarSocialInclude: ['github'],

  footer: {
    message: 'AGPL-3.0 License',
    copyright: 'Copyright © 2025 APPLe-DF',
  },

  locales: genThemeLocales(),
})
