import type { HeadConfig } from 'vitepress'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vitepress'
import { autoDescription, isPublicDocumentationPage, splitFrontmatter } from '../../scripts/documentation-pages.mjs'
import { configureDocsMarkdown } from './docs-markdown'
import { resolveSiteBase, withFileBase } from './site-base'

export default defineConfig({
  lang: 'ru-RU',
  title: 'Endge',
  titleTemplate: 'Endge | :title',
  description: 'Документация платформы Endge и конфигуратора',
  head: [
    // head не получает base от VitePress; сайт может публиковаться под `--base /endge-docs/`.
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${resolveSiteBase()}favicon.svg` }],
  ],
  cleanUrls: true,
  lastUpdated: true,
  markdown: {
    config: configureDocsMarkdown,
  },

  // Страница без frontmatter description получает то же описание, что и в llms.txt:
  // первый абзац текста (scripts/documentation-pages.mjs).
  transformPageData(pageData, { siteConfig }) {
    if (pageData.description || !isPublicDocumentationPage(pageData.relativePath)) {
      return
    }
    const source = readFileSync(path.join(siteConfig.srcDir, pageData.relativePath), 'utf8')
    const description = autoDescription(splitFrontmatter(source).body.replace(/^# .*$/m, ''))
    if (description) {
      pageData.description = description
    }
  },

  // Markdown-версию страницы и llms.txt собирает scripts/build-llms.mjs; ссылки учитывают base (`--base /endge-docs/`).
  transformHead({ pageData, siteConfig }) {
    const base = siteConfig.site.base
    const head: Array<HeadConfig> = [
      ['link', { rel: 'help', type: 'text/plain', href: `${base}llms.txt`, title: 'Документация для ИИ-агентов (llms.txt)' }],
    ]
    if (isPublicDocumentationPage(pageData.relativePath)) {
      head.push(['link', { rel: 'alternate', type: 'text/markdown', href: `${base}${pageData.relativePath}`, title: 'Markdown-версия страницы' }])
    }
    return head
  },

  themeConfig: {
    nav: [
      { text: 'Configurator', link: '/' },
      { text: 'Advanced', link: '/advanced/' },
      { text: 'Raph', link: '/raph/' },
    ],

    sidebar: {
      '/advanced/': [
        {
          text: 'Federation',
          items: [
            { text: 'Обзор', link: '/advanced/' },
            { text: 'Встраивание Core и API', link: '/advanced/core-api' },
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
            { text: 'Маршрут агента', link: '/raph/agent-guide' },
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
            { text: 'Индексация коллекций', link: '/raph/data/indexing' },
            { text: 'Meta-plane', link: '/raph/data/meta' },
            { text: 'Изменения и transactions', link: '/raph/data/mutations-and-transactions' },
            { text: 'Подписки и RaphRouter', link: '/raph/data/subscriptions-and-router' },
          ],
        },
        {
          text: 'Граф выполнения',
          items: [
            { text: 'Nodes и зависимости', link: '/raph/execution/nodes-and-dependencies' },
            { text: 'Phases, process и ordering', link: '/raph/execution/phases-and-traversal' },
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
          text: 'Ownership и granularity',
          items: [
            { text: 'Owner-local state', link: '/raph/local/' },
            { text: 'Signals и phase bindings', link: '/raph/local/properties-and-phases' },
            { text: 'Granularity и ordering', link: '/raph/local/propagation-and-ordering' },
          ],
        },
        {
          text: 'Reactive API',
          items: [
            { text: 'Signals, Effects и Watch', link: '/raph/reactive' },
            { text: 'Observable objects и buffers', link: '/raph/observable' },
            { text: 'State machines', link: '/raph/machines' },
          ],
        },
        {
          text: 'Интеграции',
          collapsed: true,
          items: [
            { text: 'Shared Kernel и runtime lanes', link: '/raph/integrations/shared-kernel' },
            { text: 'Пользовательский DataAdapter', link: '/raph/integrations/data-adapter' },
            { text: 'Endge и renderer host', link: '/raph/integrations/endge-and-nova' },
          ],
        },
        {
          text: 'Справочник',
          collapsed: true,
          items: [
            { text: 'Отладка и метрики', link: '/raph/debugging' },
            { text: 'Публичный API', link: '/raph/reference' },
            { text: 'Точные контракты из source', link: '/raph/contracts/' },
          ],
        },
      ],
      '/': [
        {
          text: 'О продукте',
          items: [
            { text: 'Что такое Endge', link: '/product/' },
            { text: 'Метамодель приложения', link: '/product/metamodel' },
            { text: 'Контекст и варианты приложений', link: '/product/context' },
            { text: 'Как работает Endge', link: '/product/how-it-works' },
            { text: 'Единая среда работы', link: '/product/workspace' },
            { text: 'Архитектура экосистемы', link: '/product/ecosystem' },
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
          text: 'ИИ-агентам',
          items: [
            { text: 'Работа с Endge через API', link: '/agents/' },
            { text: 'Авторинг Source и SFC', link: '/agents/authoring' },
            { text: 'Примеры документов всех типов', link: '/agents/document-examples' },
            { text: 'Вертикальный срез', link: '/agents/vertical-slice' },
            { text: 'Репозитории и source map', link: '/agents/repositories' },
            { text: 'Персональные токены', link: '/agents/tokens' },
            { text: 'MCP-сервер backend', link: '/agents/mcp' },
            { text: 'Сквозные сценарии', link: '/agents/scenarios' },
            { text: 'Коды ошибок', link: '/agents/errors' },
            {
              text: 'Файлы для агента',
              items: [
                { text: 'llms.txt — обзор и оглавление', link: withFileBase('/llms.txt'), target: '_blank', rel: 'noopener' },
                { text: 'llms-agent.txt — ядро для агента', link: withFileBase('/llms-agent.txt'), target: '_blank', rel: 'noopener' },
                { text: 'llms-full.txt — вся документация', link: withFileBase('/llms-full.txt'), target: '_blank', rel: 'noopener' },
              ],
            },
          ],
        },
        {
          text: 'Домен Endge',
          items: [
            { text: 'Сущности Endge', link: '/domain/entities' },
            { text: 'Матрица возможностей', link: '/reference/capabilities' },
            { text: 'Контракты библиотек', link: '/reference/contracts/' },
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
            { text: 'Store', link: '/reference/store' },
            { text: 'Update', link: '/reference/update' },
            { text: 'Filter', link: '/reference/filter' },
            { text: 'Action', link: '/reference/action' },
            { text: 'Operation History', link: '/reference/operation-history' },
            { text: 'Component SFC', link: '/reference/component-sfc' },
            { text: 'SFC script и macros', link: '/reference/sfc-script' },
            { text: 'SFC expressions', link: '/reference/sfc-expressions' },
            { text: 'Composition', link: '/reference/composition' },
            { text: 'Composition event hooks', link: '/reference/composition-events' },
            { text: 'Simulation', link: '/reference/simulation' },
            { text: 'Справочники (Vocab)', link: '/reference/vocab' },
            { text: 'I18n Bundle', link: '/reference/i18n-bundle' },
            { text: 'Configuration', link: '/reference/configuration' },
            { text: 'Функциональные выражения', link: '/reference/value-expressions' },
            { text: 'Каталог функций и arity', link: '/reference/language-catalog' },
            { text: 'Общий контракт field', link: '/reference/field-contracts' },
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
            { text: 'Запуск Query и схема GraphQL', link: '/configurator/query-run-and-graphql-schema' },
            { text: 'Выбор тенанта', link: '/configurator/tenant-selection' },
            { text: 'Доступ для агента и история', link: '/configurator/agent-access' },
            { text: 'История, перенос и выпуск', link: '/configurator/workspace-delivery' },
            { text: 'Горячие клавиши редактора', link: '/configurator/editor-hotkeys' },
          ],
        },
        {
          text: 'Практические руководства',
          collapsed: false,
          items: [
            { text: 'Работа с данными', link: '/guides/data' },
            { text: 'GraphQL', link: '/guides/graphql' },
            { text: 'Преобразование данных', link: '/guides/transformations' },
            { text: 'Вычисления', link: '/guides/computations' },
            { text: 'Представление таблиц', link: '/guides/table-presentation-computations' },
            { text: 'Создание интерфейса', link: '/guides/components' },
            { text: 'События Component SFC', link: '/guides/component-events' },
            { text: 'JSON UI endge-ui/v1', link: '/guides/json-ui' },
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
                { text: 'Оптимизация bundle', link: '/project/roadmap/Bundle_Optimization_And_Context_Isolation' },
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
