# Развитие платформы

Roadmap фиксирует направления развития, их зависимости и риски. Это рабочий архитектурный материал, а не обещание конкретной даты поставки.

Статусы сверены с исходным кодом 28 августа 2026 года. «Частично реализовано» означает, что в коде есть подтверждённая основа направления, но целевой контракт детальной страницы ещё не закрыт полностью. Наличие отдельного класса, endpoint или UI-сценария само по себе не завершает направление.

## Направления

| Направление | Состояние | Что осталось |
| --- | --- | --- |
| [Рефакторинг ядра](./roadmap/Core_Refactoring_And_Feature_Modularization) | Частично реализовано | Слои выделены, но тонкое ядро, feature-границы и сокращение общего public barrel не завершены |
| [EDB](./roadmap/EDB_Immutable_Data_Module) | Не реализовано как отдельный модуль | `Vocabs` получил cache strategies, но универсального indexed/persistent data layer нет |
| [Диагностика](./roadmap/Diagnostics_Logging_Telemetry) | Частично реализовано | Базовый diagnostics contract и Sentry adapter готовы; OTLP, metrics и production policies остаются |
| [Обработка ошибок](./roadmap/Error_Handling) | Частично реализовано | Есть render guard и Vue adapter; единый типизированный error contract и локальные boundaries не завершены |
| [Конфигурация и feature flags](./roadmap/Configuration_And_Feature_Flags) | Частично реализовано | Domain configuration cascade готов, но env и feature flags всё ещё не собраны в единый фасад |
| [Переменные окружения](./roadmap/Variables_Env_Override) | Частично реализовано | Runtime/Vite overrides работают; отображение источника значения и полный публичный контракт отсутствуют |
| [RBAC и аудит](./roadmap/RBAC_Policies_And_Audit) | Частично реализовано | Backend RBAC и frontend access-control есть; отдельный неизменяемый audit trail не завершён |
| [Уведомления](./roadmap/Notifications) | Не реализовано как единый слой | В приложении сохраняются прямые вызовы `vue-sonner` без общего facade и policies |
| [Регистр модальных окон](./roadmap/Modal_Registry) | Частично реализовано | IDE-модалы принадлежат общему Module, но generic registry, typed payload map и Promise API отсутствуют |
| [Health checks](./roadmap/Health_Checks_And_Platform_Status) | Частично реализовано | Публичные liveness/version endpoints есть; dependency readiness и единый frontend health state отсутствуют |
| [Backup и restore](./roadmap/Backup_Restore_Policies) | Частично реализовано | Manual backup/restore API и retention есть; расписание, RPO/RTO и operational runbook отсутствуют |
| [Версионирование](./roadmap/Versioning_And_Updates) | Частично реализовано | API v1, schema versions, migrations и отображение версий есть; compatibility policy и customer update process не завершены |
| [Виртуализация](./roadmap/Virtualization_Of_Lists_And_Tables) | Частично реализовано | Таблицы используют RevoGrid; общий virtual list и порог применения для остальных списков отсутствуют |
| [Оптимизация bundle](./roadmap/Bundle_Optimization_And_Tenant_Isolation) | Частично реализовано | Routes, widgets и editors загружаются лениво; artifact audit и формальная tenant isolation policy отсутствуют |
| [Доступность](./roadmap/Accessibility_A11y) | Частично реализовано | В компонентах есть focus/ARIA-практики; единый WCAG contract, CI gate и полный keyboard/screen-reader audit отсутствуют |

## Как читать roadmap

Каждая детальная страница описывает назначение, текущее состояние, целевую модель, план, риски и зависимости. Перед планированием необходимо сверять «текущее состояние» с кодом: roadmap может отставать от реализации.

## Приоритеты

Приоритет определяется не только ценностью функции, но и её ролью для других направлений. Например, единая диагностика нужна обработке ошибок и эксплуатации, а конфигурация окружения влияет на безопасный deploy.

<small>Версия: 1.1.0</small>
