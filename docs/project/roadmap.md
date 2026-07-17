# Развитие платформы

Roadmap фиксирует направления развития, их зависимости и риски. Это рабочий архитектурный материал, а не обещание конкретной даты поставки.

## Направления

| Направление | Содержание |
| --- | --- |
| [Рефакторинг ядра](./roadmap/Core_Refactoring_And_Feature_Modularization) | Тонкое ядро и feature-модули |
| [EDB](./roadmap/EDB_Immutable_Data_Module) | Быстрые неизменяемые коллекции и локальные индексы |
| [Диагностика](./roadmap/Diagnostics_Logging_Telemetry) | Логи, traces, measurements и exporters |
| [Обработка ошибок](./roadmap/Error_Handling) | Единый контракт ошибки и обработчики |
| [Конфигурация и feature flags](./roadmap/Configuration_And_Feature_Flags) | Типизированная конфигурация приложения |
| [Переменные окружения](./roadmap/Variables_Env_Override) | Переопределение значений без изменения домена |
| [RBAC и аудит](./roadmap/RBAC_Policies_And_Audit) | Права, политики и журнал действий |
| [Уведомления](./roadmap/Notifications) | Единый пользовательский feedback |
| [Регистр модальных окон](./roadmap/Modal_Registry) | Открытие модалов через публичный API |
| [Health checks](./roadmap/Health_Checks_And_Platform_Status) | Readiness, liveness и состояние платформы |
| [Backup и restore](./roadmap/Backup_Restore_Policies) | Политики резервного копирования |
| [Версионирование](./roadmap/Versioning_And_Updates) | Совместимость, обновление и откат |
| [Виртуализация](./roadmap/Virtualization_Of_Lists_And_Tables) | Работа с большими списками и таблицами |
| [Оптимизация bundle](./roadmap/Bundle_Optimization_And_Tenant_Isolation) | Производительность и tenant isolation |
| [Доступность](./roadmap/Accessibility_A11y) | WCAG, клавиатура и assistive technologies |

## Как читать roadmap

Каждая детальная страница описывает назначение, текущее состояние, целевую модель, план, риски и зависимости. Перед планированием необходимо сверять «текущее состояние» с кодом: roadmap может отставать от реализации.

## Приоритеты

Приоритет определяется не только ценностью функции, но и её ролью для других направлений. Например, единая диагностика нужна обработке ошибок и эксплуатации, а конфигурация окружения влияет на безопасный deploy.
