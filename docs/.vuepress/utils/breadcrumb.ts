import { fileURLToPath } from 'node:url'
import path from 'node:path'

export const BREADCRUMB_HOME_PATHS = [
  '/',
  '/index.html',
  '/zh/',
  '/zh/index.html',
  '/en/',
  '/en/index.html',
]

export function isHomeOrIndex(routePath: string): boolean {
  return BREADCRUMB_HOME_PATHS.includes(routePath)
}
