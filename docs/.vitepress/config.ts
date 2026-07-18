import { defineConfig } from 'vitepress'
import { configureNovaMarkdown } from './nova-markdown'
import { novaSidebar } from './nova-sidebar.generated'

export default defineConfig({
  lang: 'ru-RU',
  title: 'Endge',
  description: 'Документация платформы Endge и конфигуратора',
  cleanUrls: true,
  lastUpdated: true,
  markdown: {
    config: configureNovaMarkdown,
  },

  themeConfig: {
    nav: [
      { text: 'Endge', link: '/' },
      { text: 'Nova', link: '/nova/core/intro' },
    ],

    sidebar: {
      '/nova/': novaSidebar,
      '/': [
      {
        text: 'Начало',
        items: [
          { text: 'Что такое Endge', link: '/' },
          { text: 'Как работает Endge', link: '/getting-started/how-endge-works' },
        ],
      },
      {
        text: 'Домен Endge',
        items: [
          { text: 'Сущности Endge', link: '/domain/entities' },
          { text: 'Converter', link: '/reference/converter' },
          { text: 'Computation', link: '/reference/computation' },
          { text: 'DataView', link: '/reference/data-view' },
          { text: 'Query', link: '/reference/query' },
          { text: 'Component SFC', link: '/reference/component-sfc' },
          { text: 'Composition', link: '/reference/composition' },
          { text: 'Функциональные выражения', link: '/reference/value-expressions' },
          { text: 'Связи сущностей', link: '/domain/relations' },
          { text: 'Жизненный цикл документа', link: '/domain/lifecycle' },
        ],
      },
      {
        text: 'Компоненты SFC',
        collapsed: true,
        items: [
          { text: 'Обзор компонентов', link: '/domain/components/' },
          { text: 'Общие атрибуты', link: '/domain/components/common-attributes' },
          { text: 'Text', link: '/domain/components/text' },
          { text: 'DateTime', link: '/domain/components/date-time' },
          { text: 'Number', link: '/domain/components/number' },
          { text: 'Icon', link: '/domain/components/icon' },
          { text: 'Badge', link: '/domain/components/badge' },
          { text: 'Dot', link: '/domain/components/dot' },
          { text: 'Box', link: '/domain/components/box' },
          { text: 'Flex', link: '/domain/components/flex' },
          { text: 'Grid', link: '/domain/components/grid' },
          { text: 'Divider', link: '/domain/components/divider' },
          { text: 'Input', link: '/domain/components/input' },
          { text: 'Textarea', link: '/domain/components/textarea' },
          { text: 'Checkbox', link: '/domain/components/checkbox' },
          { text: 'Select', link: '/domain/components/select' },
          { text: 'Component', link: '/domain/components/component' },
          { text: 'Table', link: '/domain/components/table' },
          { text: 'Column', link: '/domain/components/column' },
          { text: 'Cell', link: '/domain/components/cell' },
          { text: 'ColumnMenu', link: '/domain/components/column-menu' },
          { text: 'MenuItem', link: '/domain/components/menu-item' },
          { text: 'MenuSeparator', link: '/domain/components/menu-separator' },
        ],
      },
      {
        text: 'Конфигуратор',
        items: [
          { text: 'Модули конфигуратора', link: '/configurator/modules' },
          { text: 'Основной рабочий процесс', link: '/configurator/workflow' },
          { text: 'Рабочая область Runtime Preview', link: '/configurator/runtime-preview-workspace' },
          { text: 'Горячие клавиши редактора', link: '/configurator/editor-hotkeys' },
        ],
      },
      {
        text: 'Практические руководства',
        collapsed: false,
        items: [
          { text: 'Работа с данными', link: '/guides/data' },
          { text: 'Преобразование данных', link: '/guides/transformations' },
          { text: 'Вычисления', link: '/guides/computations' },
          { text: 'Создание интерфейса', link: '/guides/components' },
          { text: 'Стилизация', link: '/guides/styling' },
        ],
      },
      {
        text: 'EndgeCSS',
        collapsed: false,
        items: [
          { text: 'Обзор', link: '/reference/endgecss/overview' },
          { text: 'Синтаксис и значения', link: '/reference/endgecss/syntax' },
          { text: 'Селекторы и каскад', link: '/reference/endgecss/selectors' },
          { text: 'Темы и директивы', link: '/reference/endgecss/directives' },
          { text: 'Стили ComponentSFC', link: '/reference/endgecss/sfc' },
          { text: 'Граница DOM и Canvas', link: '/reference/endgecss/dom-and-canvas' },
        ],
      },
      {
        text: 'Модули Endge',
        collapsed: false,
        items: [
          { text: 'Обзор модулей', link: '/core/modules' },
          { text: 'События и обновления', link: '/core/events-and-updates' },
          { text: 'Диагностика и отладка', link: '/core/diagnostics-and-debugging' },
        ],
      },
      {
        text: 'Инструменты разработчика',
        collapsed: true,
        items: [
          { text: 'Codegen', link: '/tools/codegen' },
          { text: 'Расширение Chrome', link: '/tools/chrome-extension' },
          { text: 'Утилита Codegen', link: '/tools/codegen-utility' },
          { text: 'Консоль', link: '/tools/console' },
          { text: 'DSL Playground (legacy)', link: '/tools/dsl-playground' },
        ],
      },
      {
        text: 'Архитектура',
        collapsed: true,
        items: [
          { text: 'Общая архитектура', link: '/architecture/overview' },
          { text: 'Source → Compiler → Program → Runtime', link: '/architecture/source-compiler-program-runtime' },
          { text: 'Доменные и runtime-сущности', link: '/architecture/domain-runtime-entities' },
          { text: 'Каскад конфигурации', link: '/architecture/configuration-cascade' },
          { text: 'Headless Runtime', link: '/architecture/headless-runtime' },
          { text: 'Федерации и модули', link: '/architecture/federation-and-modules' },
          { text: 'Bootstrap приложения', link: '/architecture/app-bootstrap' },
        ],
      },
      {
        text: 'Развитие платформы',
        collapsed: true,
        items: [
          { text: 'Roadmap', link: '/project/roadmap' },
        ],
      },
      ],
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'Поиск',
            buttonAriaLabel: 'Поиск по документации',
          },
          modal: {
            noResultsText: 'Ничего не найдено',
            resetButtonTitle: 'Очистить запрос',
            footer: {
              selectText: 'выбрать',
              navigateText: 'перейти',
              closeText: 'закрыть',
            },
          },
        },
      },
    },

    outline: {
      label: 'На этой странице',
      level: [2, 3],
    },
    docFooter: {
      prev: 'Предыдущая страница',
      next: 'Следующая страница',
    },
    lastUpdated: {
      text: 'Обновлено',
    },
    returnToTopLabel: 'Наверх',
    sidebarMenuLabel: 'Меню',
    darkModeSwitchLabel: 'Тема',
  },
})
