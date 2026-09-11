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
      { text: 'Configurator', link: '/' },
      { text: 'Advanced', link: '/advanced/' },
      { text: 'Raph', link: '/raph/' },
      { text: 'Nova', link: '/nova/core/intro' },
      { text: 'Cookbook', link: '/cookbook/' },
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
            { text: 'Дочерние Federations', link: '/advanced/federation-composition' },
            { text: 'Расширения', link: '/advanced/federation-extensions' },
          ],
        },
        {
          text: 'Контекст и состояние',
          items: [
            { text: 'Контекст Endge', link: '/advanced/context-state/' },
            { text: 'Динамическое состояние', link: '/advanced/context-state/dynamic-state' },
            { text: 'Сериализация', link: '/advanced/context-state/serialization' },
            { text: 'Vue reactivity', link: '/advanced/context-state/vue-reactivity' },
          ],
        },
        {
          text: 'Диагностика',
          items: [
            { text: 'Модуль и снимки', link: '/advanced/diagnostics' },
            { text: 'Bridge: связь и отладка', link: '/advanced/bridge' },
          ],
        },
      ],
      '/raph/': [
        {
          text: 'Начало',
          items: [
            { text: 'Что такое Raph', link: '/raph/' },
            { text: 'Установка и быстрый старт', link: '/raph/getting-started' },
            { text: 'Какой API выбрать', link: '/raph/choosing-api' },
          ],
        },
        {
          text: 'Архитектура',
          items: [
            { text: 'Kernel, Runtime и Node', link: '/raph/architecture/kernel-runtime-node' },
            { text: 'Поток изменения данных', link: '/raph/architecture/data-flow' },
            { text: 'Жизненный цикл', link: '/raph/architecture/lifecycle' },
          ],
        },
        {
          text: 'Данные и маршрутизация',
          items: [
            { text: 'DataPath', link: '/raph/data/data-path' },
            { text: 'Meta-plane', link: '/raph/data/meta' },
            { text: 'Изменения и transactions', link: '/raph/data/mutations-and-transactions' },
            { text: 'Подписки и RaphRouter', link: '/raph/data/subscriptions-and-router' },
          ],
        },
        {
          text: 'Граф выполнения',
          items: [
            { text: 'Nodes и зависимости', link: '/raph/execution/nodes-and-dependencies' },
            { text: 'Phases и traversal', link: '/raph/execution/phases-and-traversal' },
            { text: 'Scheduler и frame loop', link: '/raph/execution/scheduler-and-frame-loop' },
          ],
        },
        {
          text: 'Производные данные',
          items: [
            { text: 'Обзор Derived', link: '/raph/derived/' },
            { text: 'Стратегии материализации', link: '/raph/derived/strategies' },
            { text: 'Lifecycle, ошибки и диагностика', link: '/raph/derived/lifecycle-and-errors' },
          ],
        },
        {
          text: 'Local Runtime',
          items: [
            { text: 'Обзор Local API', link: '/raph/local/' },
            { text: 'Свойства и decorators', link: '/raph/local/properties-and-phases' },
            { text: 'Propagation и порядок', link: '/raph/local/propagation-and-ordering' },
          ],
        },
        {
          text: 'Reactive API',
          items: [
            { text: 'Signals, Effects и Watch', link: '/raph/reactive' },
          ],
        },
        {
          text: 'Интеграции',
          collapsed: true,
          items: [
            { text: 'Shared Kernel и runtime lanes', link: '/raph/integrations/shared-kernel' },
            { text: 'Пользовательский DataAdapter', link: '/raph/integrations/data-adapter' },
            { text: 'Endge Core и Nova', link: '/raph/integrations/endge-and-nova' },
          ],
        },
        {
          text: 'Справочник',
          collapsed: true,
          items: [
            { text: 'Отладка и метрики', link: '/raph/debugging' },
            { text: 'Публичный API', link: '/raph/reference' },
          ],
        },
      ],
      '/nova/': novaSidebar,
      '/cookbook/': [
        {
          text: 'Cookbook',
          items: [
            { text: 'Обзор', link: '/cookbook/' },
          ],
        },
        {
          text: 'Данные и синхронизация',
          items: [
            { text: 'Оптимистичные обновления', link: '/cookbook/optimistic-updates' },
          ],
        },
      ],
      '/': [
        {
          text: 'О продукте',
          items: [
            { text: 'Что такое Endge', link: '/' },
            { text: 'Единая среда работы', link: '/getting-started/shared-workspace' },
            { text: 'Архитектура экосистемы', link: '/getting-started/architecture' },
            { text: 'Как работает Endge', link: '/getting-started/how-endge-works' },
          ],
        },
        {
          text: 'О продукте 2',
          items: [
            { text: 'Что такое Endge', link: '/product-v2/' },
            { text: 'Метамодель приложения', link: '/product-v2/metamodel' },
            { text: 'Контекст и варианты приложений', link: '/product-v2/context' },
            { text: 'Как работает Endge', link: '/product-v2/how-it-works' },
            { text: 'Единая среда работы', link: '/product-v2/workspace' },
            { text: 'Архитектура экосистемы', link: '/product-v2/ecosystem' },
          ],
        },
        {
          text: 'Начало',
          items: [
            { text: 'Начало работы', link: '/configurator/getting-started' },
            { text: 'Установка', link: '/configurator/installation' },
            {
              text: 'Аутентификация',
              link: '/configurator/authentication',
              collapsed: false,
              items: [
                { text: 'OIDC', link: '/configurator/authentication/oidc' },
                { text: 'Bearer JWT', link: '/configurator/authentication#backend-bearer' },
                { text: 'Разработка', link: '/configurator/authentication/development' },
                { text: 'Внешние права', link: '/configurator/authentication/access-configuration' },
              ],
            },
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
            {
              text: 'AuthProfile',
              link: '/reference/auth-profile',
              collapsed: true,
              items: [
                { text: 'OIDC', link: '/reference/auth-profile/oidc' },
                { text: 'Bearer', link: '/reference/auth-profile/bearer' },
                { text: 'Basic Auth', link: '/reference/auth-profile/basic' },
                {
                  text: 'OAuth2',
                  collapsed: false,
                  items: [
                    { text: 'Client Credentials', link: '/reference/auth-profile/oauth2-client-credentials' },
                    { text: 'Password', link: '/reference/auth-profile/oauth2-password' },
                  ],
                },
              ],
            },
            { text: 'Query', link: '/reference/query' },
            { text: 'Stream', link: '/reference/stream' },
            { text: 'Update', link: '/reference/update' },
            { text: 'Filter', link: '/reference/filter' },
            { text: 'Action', link: '/reference/action' },
            { text: 'Operation History', link: '/reference/operation-history' },
            { text: 'Component SFC', link: '/reference/component-sfc' },
            { text: 'Composition', link: '/reference/composition' },
            { text: 'Simulation', link: '/reference/simulation' },
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
