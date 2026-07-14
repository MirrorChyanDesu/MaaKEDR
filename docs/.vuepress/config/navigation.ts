import { ThemeCollectionItem, ThemeNavItem } from 'vuepress-theme-plume'

export interface NavigationConfig {
  navbar: ThemeNavItem[]
  collections: ThemeCollectionItem[]
}

const zh: NavigationConfig = {
  navbar: [
    { text: '用户手册', icon: 'mdi:user', link: '/zh/manual/' },
    { text: '开发文档', icon: 'ph:code-bold', link: '/zh/develop/' },
  ],
  collections: [
    {
      type: 'doc',
      title: '用户手册',
      dir: 'manual',
      sidebar: ['newbie.md', 'faq.md', 'connection.md', 'introduction.md'],
    },
    {
      type: 'doc',
      title: '开发文档',
      dir: 'develop',
      sidebar: [
        'setup.md',
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
    { text: 'User Manual', icon: 'mdi:user', link: '/en/manual/' },
    { text: 'Development Docs', icon: 'ph:code-bold', link: '/en/develop/' },
  ],
  collections: [
    {
      type: 'doc',
      title: 'User Manual',
      dir: 'manual',
      sidebar: ['newbie.md', 'faq.md', 'connection.md', 'introduction.md'],
    },
    {
      type: 'doc',
      title: 'Development Docs',
      dir: 'develop',
      sidebar: [
        'setup.md',
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
