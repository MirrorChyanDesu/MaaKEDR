import { BASE_URL, locales, buildHomePaths } from '../navigation/i18n.ts'

export const BREADCRUMB_HOME_PATHS = buildHomePaths(BASE_URL, locales)

export function isHomeOrIndex(routePath: string): boolean {
  return BREADCRUMB_HOME_PATHS.includes(routePath)
}
