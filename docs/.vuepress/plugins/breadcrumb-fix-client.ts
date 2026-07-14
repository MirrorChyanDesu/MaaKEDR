import { useRoute } from 'vuepress/client'
import { Breadcrumb as ThemeBreadcrumb } from 'vuepress-theme-plume'

const route = useRoute()

function isHomeOrIndex(): boolean {
  return (
    route.path === '/' ||
    route.path.endsWith('/index.html') ||
    route.path === '/zh/' ||
    route.path === '/en/' ||
    route.path === '/zh/index.html' ||
    route.path === '/en/index.html'
  )
}
