import * as path from 'path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vuepress'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const breadcrumbFix: Plugin = {
  name: 'breadcrumb-fix',
  clientConfigFile: path.resolve(__dirname, '../components/BreadcrumbFix.vue'),
}
