import * as path from 'path'
import type { Plugin } from 'vuepress'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const breadcrumbFix: Plugin = {
  name: 'breadcrumb-fix',
  clientConfigFile: path.resolve(__dirname, '../components/BreadcrumbFix.vue'),
}
