import { ThemeCollectionItem, ThemeNavItem } from 'vuepress-theme-plume'

export interface NavigationConfig {
  navbar: ThemeNavItem[]
  collections: ThemeCollectionItem[]
}

const zh: NavigationConfig = {
  navbar: [
    { text: '开发文档', icon: 'ph:code-bold', link: '/zh/develop/' },
  ],
  collections: [
    {
      type: 'doc',
      title: '开发文档',
      dir: 'develop',
      sidebar: [
        'pipeline.md',
        'custom.md',
        'vibe-coding.md',
        'fix.md',
        'formatting.md',
        'structure.md',
      ],
    },
  ],
}

const en: NavigationConfig = {
  navbar: [
    { text: 'Development Docs', icon: 'ph:code-bold', link: '/en/develop/' },
  ],
  collections: [
    {
      type: 'doc',
      title: 'Development Docs',
      dir: 'develop',
      sidebar: [
        'pipeline.md',
        'custom.md',
        'vibe-coding.md',
        'fix.md',
        'formatting.md',
        'structure.md',
      ],
    },
  ],
}

export const navigation: Record<string, NavigationConfig> = { zh, en }
