import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'ru-RU',
  title: 'Endge Configurator Docs',
  description: 'Документация Endge Configurator',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: 'Главная', link: '/' },
      { text: 'Тестовая страница', link: '/guide/' },
    ],
    sidebar: [
      {
        text: 'Документация',
        items: [
          { text: 'Тестовая страница', link: '/guide/' },
        ],
      },
    ],
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/endge-lab/configurator-docs' },
    ],
  },
})
