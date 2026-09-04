import { defineConfig } from 'vitepress'
import { configureDocsMarkdown } from './docs-markdown'
import { novaSidebar } from './nova-sidebar.generated'

export default defineConfig({
  lang: 'ru-RU',
  title: 'Endge',
  description: 'Документация платформы Endge и конфигуратора',
  cleanUrls: true,
  lastUpdated: true,
  markdown: {
    config: configureDocsMarkdown,
  },

  themeConfig: {
    nav: [
      { text: 'Core', link: '/' },
      { text: 'Advanced', link: '/advanced/' },
      { text: 'Nova', link: '/nova/core/intro' },
    ],

    sidebar: {
      '/advanced/': [
        {
          text: 'Federation',
          items: [
            { text: 'Обзор', link: '/advanced/' },
            { text: 'Структура feature', link: '/advanced/functional-structure' },
            { text: 'Modules и submodules', link: '/advanced/modules' },
            { text: 'Определение Federation', link: '/advanced/defining-federation' },
          ],
        },
      ],
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
            { text: 'Type', link: '/reference/type' },
            { text: 'Mock data', link: '/reference/mock' },
            { text: 'Query', link: '/reference/query' },
            { text: 'Stream', link: '/reference/stream' },
            { text: 'Update', link: '/reference/update' },
            { text: 'Filter', link: '/reference/filter' },
            { text: 'Action', link: '/reference/action' },
            { text: 'Operation History', link: '/reference/operation-history' },
            { text: 'Component SFC', link: '/reference/component-sfc' },
            { text: 'Composition', link: '/reference/composition' },
            { text: 'Справочники (Vocab)', link: '/reference/vocab' },
            { text: 'I18n Bundle', link: '/reference/i18n-bundle' },
            { text: 'Configuration', link: '/reference/configuration' },
            { text: 'Функциональные выражения', link: '/reference/value-expressions' },
            { text: 'Metadata', link: '/reference/metadata' },
            { text: 'Связи сущностей', link: '/domain/relations' },
            { text: 'Жизненный цикл документа', link: '/domain/lifecycle' },
          ],
        },
        {
          text: 'Компоненты SFC',
          collapsed: true,
          items: [
            {
              text: 'Основы',
              items: [
                { text: 'Обзор компонентов', link: '/domain/components/' },
                { text: 'Общие атрибуты', link: '/domain/components/common-attributes' },
                { text: 'Сложные события через :on', link: '/domain/components/interactions' },
              ],
            },
            {
              text: 'Компоненты представления',
              collapsed: true,
              items: [
                { text: 'Text', link: '/domain/components/text' },
                { text: 'DateTime', link: '/domain/components/date-time' },
                { text: 'Number', link: '/domain/components/number' },
                { text: 'Icon', link: '/domain/components/icon' },
                { text: 'Badge', link: '/domain/components/badge' },
                { text: 'Dot', link: '/domain/components/dot' },
                { text: 'Tooltip', link: '/domain/components/tooltip' },
              ],
            },
            {
              text: 'Компоненты компоновки',
              collapsed: true,
              items: [
                { text: 'Box', link: '/domain/components/box' },
                { text: 'Flex', link: '/domain/components/flex' },
                { text: 'Grid', link: '/domain/components/grid' },
                { text: 'Divider', link: '/domain/components/divider' },
              ],
            },
            {
              text: 'Элементы ввода',
              collapsed: true,
              items: [
                { text: 'Input', link: '/domain/components/input' },
                { text: 'Textarea', link: '/domain/components/textarea' },
                { text: 'Checkbox', link: '/domain/components/checkbox' },
                { text: 'Select', link: '/domain/components/select' },
              ],
            },
            {
              text: 'Структурные компоненты',
              collapsed: true,
              items: [
                { text: 'Component', link: '/domain/components/component' },
                { text: 'Table', link: '/domain/components/table' },
                { text: 'Column', link: '/domain/components/column' },
                { text: 'Cell', link: '/domain/components/cell' },
                { text: 'ColumnMenu', link: '/domain/components/column-menu' },
                { text: 'RowMenu', link: '/domain/components/row-menu' },
                { text: 'MenuItem', link: '/domain/components/menu-item' },
                { text: 'MenuSeparator', link: '/domain/components/menu-separator' },
              ],
            },
            { text: 'Редактирование значений', link: '/sfc-tables/cell-editing' },
          ],
        },
        {
          text: 'Таблицы SFC',
          collapsed: true,
          items: [
            { text: 'Обзор', link: '/sfc-tables/' },
            { text: 'Данные, строки и ячейки', link: '/sfc-tables/data-rows-cells' },
            { text: 'Источники данных, поиск и фильтры', link: '/sfc-tables/data-search-filters' },
            { text: 'Пейджинг и виртуализация', link: '/sfc-tables/paging-and-virtualization' },
            { text: 'Сортировка', link: '/sfc-tables/sorting' },
            { text: 'Выбор строк и ячеек', link: '/sfc-tables/selection-and-activation' },
            { text: 'Контекстные переменные', link: '/sfc-tables/context-variables' },
            { text: 'Контекстное меню ячеек', link: '/sfc-tables/row-context-menu' },
            { text: 'Меню заголовков колонок', link: '/sfc-tables/column-header-menu' },
            { text: 'Управление колонками', link: '/sfc-tables/column-management' },
            { text: 'Editable и редактирование ячеек', link: '/sfc-tables/cell-editing' },
            { text: 'Состояние таблицы', link: '/sfc-tables/state' },
            { text: 'События, порты и Actions', link: '/sfc-tables/events-and-actions' },
            { text: 'Стили и представление', link: '/sfc-tables/styling-and-presentation' },
            { text: 'Адаптеры и ограничения', link: '/sfc-tables/adapters-and-limitations' },
          ],
        },
        {
          text: 'Конфигуратор',
          items: [
            { text: 'Модули конфигуратора', link: '/configurator/modules' },
            { text: 'Основной рабочий процесс', link: '/configurator/workflow' },
            { text: 'Рабочая область Runtime Preview', link: '/configurator/runtime-preview-workspace' },
            { text: 'Рабочая область Problems', link: '/configurator/problems-workspace' },
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
            { text: 'Представление таблиц', link: '/guides/table-presentation-computations' },
            { text: 'Создание интерфейса', link: '/guides/components' },
            { text: 'События Component SFC', link: '/guides/component-events' },
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
          text: 'Инструменты разработчика',
          collapsed: true,
          items: [
            { text: 'Codegen', link: '/tools/codegen' },
            { text: 'Расширение Chrome', link: '/tools/chrome-extension' },
            { text: 'Утилита Codegen', link: '/tools/codegen-utility' },
            { text: 'DSL Playground (legacy)', link: '/tools/dsl-playground' },
          ],
        },
        {
          text: 'Сервисы',
          collapsed: true,
          items: [
            {
              text: 'AI Workbench',
              collapsed: true,
              items: [
                { text: 'Общая схема', link: '/services/ai-workbench/data-preparation' },
                {
                  text: 'Этапы подготовки',
                  collapsed: true,
                  items: [
                    { text: '1. Нормализация и план', link: '/services/ai-workbench/stages/normalization-and-planning' },
                    { text: '2. Источники и извлечение', link: '/services/ai-workbench/stages/sources-and-retrieval' },
                    { text: '3. Разрешение сущностей', link: '/services/ai-workbench/stages/entity-resolution' },
                    { text: '4. Уточнения', link: '/services/ai-workbench/stages/clarification-loop' },
                    { text: '5. Сборка контекста', link: '/services/ai-workbench/stages/context-assembly' },
                    { text: '6. Генерация и проверка', link: '/services/ai-workbench/stages/generation-and-validation' },
                  ],
                },
              ],
            },
            { text: 'Vocabs', link: '/services/vocabs' },
            { text: 'MockData', link: '/services/mock-data' },
          ],
        },
        {
          text: 'Развитие платформы',
          collapsed: true,
          items: [
            {
              text: 'Roadmap',
              collapsed: true,
              items: [
                { text: 'Обзор', link: '/project/roadmap' },
                { text: 'Рефакторинг ядра', link: '/project/roadmap/Core_Refactoring_And_Feature_Modularization' },
                { text: 'EDB', link: '/project/roadmap/EDB_Immutable_Data_Module' },
                { text: 'Диагностика', link: '/project/roadmap/Diagnostics_Logging_Telemetry' },
                { text: 'Обработка ошибок', link: '/project/roadmap/Error_Handling' },
                { text: 'Конфигурация и feature flags', link: '/project/roadmap/Configuration_And_Feature_Flags' },
                { text: 'Переменные окружения', link: '/project/roadmap/Variables_Env_Override' },
                { text: 'RBAC и аудит', link: '/project/roadmap/RBAC_Policies_And_Audit' },
                { text: 'Уведомления', link: '/project/roadmap/Notifications' },
                { text: 'Регистр модальных окон', link: '/project/roadmap/Modal_Registry' },
                { text: 'Health checks', link: '/project/roadmap/Health_Checks_And_Platform_Status' },
                { text: 'Backup и restore', link: '/project/roadmap/Backup_Restore_Policies' },
                { text: 'Версионирование', link: '/project/roadmap/Versioning_And_Updates' },
                { text: 'Виртуализация', link: '/project/roadmap/Virtualization_Of_Lists_And_Tables' },
                { text: 'Оптимизация bundle', link: '/project/roadmap/Bundle_Optimization_And_Tenant_Isolation' },
                { text: 'Доступность', link: '/project/roadmap/Accessibility_A11y' },
              ],
            },
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
