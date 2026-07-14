import { BASE_URL, locales, buildHomePaths } from '../navigation/i18n.ts'

export const BREADCRUMB_HOME_PATHS = buildHomePaths(BASE_URL, locales)

/** Normalize a route path: remove trailing slash (unless root), lowercase, decode */
export function normalizeRoutePath(routePath: string): string {
  if (!routePath) return '/'
  const decoded = decodeURIComponent(routePath)
  const withoutTrailingSlash = decoded.replace(/\/+$/, '') || '/'
  return withoutTrailingSlash
}

export function isHomeOrIndex(routePath: string): boolean {
  const normalized = normalizeRoutePath(routePath)
  return BREADCRUMB_HOME_PATHS.includes(normalized)
}
