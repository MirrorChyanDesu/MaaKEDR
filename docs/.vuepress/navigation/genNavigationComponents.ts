import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'node:url'
import { default as matter } from 'gray-matter'
import { ThemeCollectionItem, ThemeNavItem, ThemeSidebarItem } from 'vuepress-theme-plume'

import { Locale } from './i18n.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const QQ_LINK = 'https://qm.qq.com/q/clvWu1RoWI'

interface MetaData {
  baseName: string
  order: number
  title: string
  icon: string
  index: boolean
}

interface NavigationComponents {
  navbar: ThemeNavItem[]
  collections: ThemeCollectionItem[]
}

type SidebarItem = ThemeSidebarItem | string

function logWarning(message: string): void {
  console.warn(`[genNavigationComponents] ${message}`)
}

function getMetaData(dir: string, entry: fs.Dirent): MetaData | null {
  const currentPath = path.join(dir, entry.name)
  if (!fs.existsSync(currentPath)) {
    logWarning(`Path does not exist: ${currentPath}`)
    return null
  }

  let mdFilePath = ''
  if (entry.isDirectory()) {
    mdFilePath = path.join(currentPath, 'README.md')
  } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name.toLowerCase() !== 'readme.md') {
    mdFilePath = currentPath
  } else {
    return null
  }

  if (!fs.existsSync(mdFilePath)) {
    logWarning(`README.md not found for: ${entry.name} in ${dir}`)
    return null
  }

  const fileContent = fs.readFileSync(mdFilePath, 'utf-8')
  const meta = matter(fileContent).data ?? {}

  const baseName = path.parse(entry.name).name
  const rawOrder = entry.isDirectory() ? meta?.dir?.order : meta?.order
  const parsedOrder = rawOrder == null ? Number.MAX_SAFE_INTEGER : Number(rawOrder)
  const order = Number.isFinite(parsedOrder) ? parsedOrder : Number.MAX_SAFE_INTEGER
  const title = String(meta?.title ?? /^# (.+)/m.exec(fileContent)?.[1] ?? baseName)
  const icon = String(meta?.icon ?? '')
  const index = entry.isDirectory() ? Boolean(meta?.index ?? true) : true

  return {
    baseName,
    order,
    title,
    icon,
    index,
  }
}

function getSidebarItems(dir: string): SidebarItem[] {
  interface WrappedSidebarItem {
    sidebarItem: SidebarItem
    order: number
  }

  if (!fs.existsSync(dir)) {
    logWarning(`Directory does not exist: ${dir}`)
    return []
  }

  let entries: fs.Dirent[]
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true }).filter((e) => !e.name.startsWith('.'))
  } catch (error) {
    logWarning(`Failed to read directory ${dir}: ${error instanceof Error ? error.message : String(error)}`)
    return []
  }

  const sidebarItemsWithOrder: WrappedSidebarItem[] = []
  for (const entry of entries) {
    let sidebarItem: SidebarItem

    const metaData = getMetaData(dir, entry)
    if (!metaData) {
      continue
    }

    if (entry.isDirectory()) {
      const children = getSidebarItems(path.join(dir, entry.name))
      sidebarItem = {
        text: metaData.title,
        link: metaData.index ? `${metaData.baseName}/` : undefined,
        icon: metaData.icon,
        collapsed: true,
        prefix: `${metaData.baseName}/`,
        items: children,
      }
    } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name.toLowerCase() !== 'readme.md') {
      sidebarItem = entry.name
    } else {
      continue
    }

    sidebarItemsWithOrder.push({ sidebarItem, order: metaData.order })
  }
  sidebarItemsWithOrder.sort((a, b) => a.order - b.order)
  return sidebarItemsWithOrder.map((i) => i.sidebarItem)
}

export function genNavigationComponents(
  locale: Locale,
  baseDir = path.resolve(__dirname, '../../'),
): NavigationComponents {
  interface WrappedNavigationComponent {
    navItem: ThemeNavItem
    collectionItem: ThemeCollectionItem
    order: number
  }

  const navigationComponentsWithOrder: WrappedNavigationComponent[] = []

  const langDir = path.join(baseDir, locale.name)

  if (!fs.existsSync(langDir)) {
    logWarning(`Locale directory does not exist: ${langDir}`)
    return { navbar: [], collections: [] }
  }

  let entries: fs.Dirent[]
  try {
    entries = fs.readdirSync(langDir, { withFileTypes: true }).filter((e) => !e.name.startsWith('.'))
  } catch (error) {
    logWarning(`Failed to read locale directory ${langDir}: ${error instanceof Error ? error.message : String(error)}`)
    return { navbar: [], collections: [] }
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const metaData = getMetaData(langDir, entry)
    if (!metaData) {
      continue
    }

    const navbarItem: ThemeNavItem = {
      text: metaData.title,
      icon: metaData.icon,
      link: `/${locale.name}/${metaData.baseName}/`,
    }

    const collectionItem: ThemeCollectionItem = {
      type: 'doc',
      title: metaData.title,
      dir: metaData.baseName,
      linkPrefix: `/${locale.name}/${metaData.baseName}/`,
      sidebar: getSidebarItems(path.join(langDir, entry.name)),
    }

    navigationComponentsWithOrder.push({
      navItem: navbarItem,
      collectionItem,
      order: metaData.order,
    })
  }

  navigationComponentsWithOrder.sort((a, b) => a.order - b.order)

  const navbar: ThemeNavItem[] = navigationComponentsWithOrder.map((i) => i.navItem)

  navbar.push({
    text: locale.name === 'zh' ? 'QQ群' : 'QQ Group',
    icon: 'ri:qq-fill',
    link: QQ_LINK,
  })

  return {
    navbar,
    collections: navigationComponentsWithOrder.map((i) => i.collectionItem),
  }
}
