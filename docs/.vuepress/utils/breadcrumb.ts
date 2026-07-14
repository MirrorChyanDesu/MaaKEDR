import { BASE_URL, locales } from '../navigation/i18n.ts'

export const BREADCRUMB_HOME_PATHS = (() => {
  const paths = [BASE_URL, `${BASE_URL}index.html`]
  for (const locale of locales) {
    paths.push(`${BASE_URL}${locale.name}/`, `${BASE_URL}${locale.name}/index.html`)
  }
  return paths
})()

export function isHomeOrIndex(routePath: string): boolean {
  return BREADCRUMB_HOME_PATHS.includes(routePath)
}
