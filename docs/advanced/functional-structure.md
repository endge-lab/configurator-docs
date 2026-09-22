# Структура функционального блока

Структура следует фактическим owners, а не фиксированному шаблону папок. Для
экосистемы Endge это рекомендация: она помогает одинаково читать packages и
приложения, но не требует создавать пустые layers.

## Federation-first feature

Feature с собственной Federation разделяет её kernel и дочерние Modules:

```text
feature/
├── kernel/
│   ├── FeatureFederation.ts
│   ├── config/
│   ├── constants/
│   ├── domain/
│   ├── model/
│   ├── services/
│   ├── tools/
│   ├── types/
│   └── ui/
└── modules/
    ├── Leaf_Module.ts
    └── structured-module/
        ├── Structured_Module.ts
        ├── config/
        ├── constants/
        ├── domain/
        ├── model/
        ├── services/
        ├── tools/
        ├── types/
        └── ui/
```

`kernel` принадлежит самой Federation: здесь находятся её declaration,
orchestration и feature-level сущности. `modules` содержит только Modules этой
Federation и принадлежащие им внутренние slices.

## Feature без Federation

Если feature не владеет Federation и набором Modules, она сама является
functional root:

```text
feature/
├── config/
├── constants/
├── domain/
├── model/
├── services/
├── tools/
├── types/
└── ui/
```

Обёртки `kernel` и `modules` в этом случае не создаются. Они обозначают реальную
архитектурную модель, а не обязательный уровень вложенности.

## Когда создавать папку Module

Leaf Module, состоящий только из класса, остаётся одним файлом непосредственно в
`modules`. Собственная папка появляется, когда Module уже владеет дополнительным
domain/model, Service, adapter, config, tool, UI или submodule.

```text
modules/
├── Clock_Module.ts
└── schedule/
    ├── Schedule_Module.ts
    ├── domain/
    ├── services/
    └── ui/
```

## Роли папок

| Папка | Ответственность |
| --- | --- |
| `domain` | Business contracts, entities, rules и domain values |
| `model` | Stateful application/runtime models владельца |
| `services` | Связные operations и orchestration без собственного Module identity |
| `config` | Расширяемая конфигурация владельца |
| `constants` | Стабильные именованные identities и values |
| `adapters`, `clients` | Реализации внешних contracts |
| `tools` | Чистые scoped-утилиты без state и side effects |
| `types` | Technical и framework contracts functional root |
| `ui` | Presentation, принадлежащая этому owner |

Появление `domain` не переносит в него все типы. Business contracts находятся в
`domain/types`, а технические contracts Federation или Module остаются в соседнем
`types`.

::: tip Минимальная структура
Создавайте slice после появления реальной ответственности. Пустые `domain`,
`services`, `types` или `ui` не улучшают архитектуру.
:::
