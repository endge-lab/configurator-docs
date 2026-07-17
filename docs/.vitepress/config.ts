import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'ru-RU',
  title: 'Endge Configurator Docs',
  description: 'Документация Endge Configurator',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: 'Документация', link: '/' },
    ],
    sidebar: [
      {
        text: 'Содержание',
        items: [
          { text: 'Тестовая страница', link: '/' },
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
