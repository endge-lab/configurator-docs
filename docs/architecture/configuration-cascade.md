# Каскад конфигурации

Endge собирает effective configuration одного execution context из defaults активных Configuration-документов и четырёх уровней контекста.

Нормативный порядок:

```text
Source defaults → Workspace → Tenant → Project → Environment
```

Более поздний слой имеет больший приоритет:

```text
Environment > Project > Tenant > Workspace > Source defaults
```

Отсутствующее локальное переопределение ничего не меняет: значение наследуется из предыдущего слоя.

## Источники значений

| Слой | Назначение | Приоритет |
|---|---|---:|
| Source defaults | Defaults из активных [Configuration-документов](/reference/configuration) | 0 |
| `Workspace` | Полная persisted-конфигурация рабочего пространства | 1 |
| `Tenant` | Настройки организации или заказчика | 2 |
| `Project` | Настройки конкретного приложения | 3 |
| `Environment` | Настройки конкретной среды исполнения | 4 |

`Project`, `Tenant` и `Environment` — независимые координаты execution context. Они не обязаны образовывать цепочку владения. Порядок описывает resolution, а не иерархию сущностей.

`Environment` здесь означает доменную сущность Endge. Это не переменные процесса, `VITE_*`, параметры контейнера или операционной системы.

## Две части конфигурации

Effective configuration содержит:

1. системные настройки Endge: locale, theme, timezone, auth-profile identity, SFC adapters, editing, tooltips и diagnostics;
2. динамические типизированные значения из Configuration-документов.

Workspace хранит их в одном `EndgeConfiguration`, но пользовательские категории находятся во внутреннем namespace `values`:

```ts
type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue }

type EndgeConfigurationValues =
  Record<string, Record<string, JsonValue>>

interface EndgeConfiguration {
  vars: EndgeVariableDefinition[]

  locales: EndgeLocaleDefinition[]
  defaultLocale: string
  fallbackLocale: string

  themes: EndgeThemeDefinition[]
  defaultTheme: string

  timezones: EndgeTimezoneDefinition[]
  defaultTimezone: string

  defaultAuthProfileIdentity: string | null
  sfcAdapterIds: string[]
  defaultSfcAdapterId: string

  sfcEditing: EndgeSFCEditingConfiguration
  tooltips: EndgeTooltipConfiguration
  diagnostics: EndgeDiagnosticsConfiguration

  values: EndgeConfigurationValues
}
```

`values` — storage namespace. В публичном `$context.config` он удаляется, а identity Configuration-документа поднимается на первый уровень.

## Ранняя schema-фаза

Configuration resolution начинается до основного compile lifecycle:

1. собирается ранний Type catalog;
2. активные Configuration Source v1 компилируются без выполнения JavaScript;
3. ссылки на пользовательские и reference-типы разрешаются через Type Registry;
4. defaults проверяются по типам;
5. категории сортируются по `displayName`, затем по `identity`;
6. schema catalog передаётся effective configuration resolver.

Ошибки Source, неизвестные Type, невалидные defaults и конфликтующие identity попадают в Problems. Основной compiler использует готовый schema catalog и не интерпретирует Configuration Source повторно.

## Алгоритм resolution

Упрощённо процесс выглядит так:

```ts
let effective = normalize(workspace.configuration)
effective.values = applySourceDefaults(effective.values)

effective = applyContribution(effective, tenant.configuration)
effective.values = applySourceDefaults(effective.values)

effective = applyContribution(effective, project.configuration)
effective.values = applySourceDefaults(effective.values)

effective = applyContribution(effective, environment.configuration)
effective.values = applySourceDefaults(effective.values)
```

`applySourceDefaults(...)` не перезаписывает совместимые persisted values. Он добавляет отсутствующие defaults, проверяет активные поля и исключает stale-ключи из effective projection.

Полученный объект становится immutable input для compiler и runtime. Он:

- не сохраняется как отдельный источник истины;
- не записывается обратно в Workspace, Tenant, Project или Environment;
- пересчитывается при новом boot/build;
- должен быть детерминирован для одинакового Domain и execution context;
- входит в `contextHash`.

## Пример вычисления

Пусть Configuration `groundHandling` объявляет:

```ts
defineConfig({
  rowHeight: value(Number, 32),
  compactMode: value(Boolean, false),
})
```

Слои задают следующие значения:

| Слой | `rowHeight` | `compactMode` |
|---|---:|---:|
| Source default | `32` | `false` |
| Workspace | `36` | `true` |
| Tenant | — | `false` |
| Project | `40` | — |
| Environment | `44` | — |

Результат:

```json
{
  "groundHandling": {
    "rowHeight": 44,
    "compactMode": false
  }
}
```

Если удалить Environment override для `rowHeight`, effective value станет `40`. После удаления Project override вернётся Workspace value `36`. Source default `32` используется только когда значение не задано ни одним persisted-слоем.

## Execution context и build context

Активные координаты задаются execution context:

```ts
export interface EndgeExecutionContext {
  projectIdentity: string
  tenantIdentity: string
  environmentIdentity: string
}
```

После resolution compiler получает build context:

```ts
export interface EndgeBuildContext {
  workspaceIdentity: string
  execution: EndgeExecutionContext
  configuration: EndgeConfiguration
  contextHash: string
}
```

`configuration` здесь уже является effective configuration. Она не является contribution какого-либо одного слоя.

## Persisted Workspace values

Workspace хранит полные пользовательские значения:

```json
{
  "configuration": {
    "values": {
      "groundHandling": {
        "rowHeight": 36,
        "compactMode": true
      }
    }
  }
}
```

Первый key — identity Configuration-документа, второй — key значения из `defineConfig(...)`.

## Contribution Tenant, Project и Environment

Остальные уровни хранят contribution, а не копию effective result:

```ts
export type EndgeConfigurationContribution =
  | {
      mode: 'inherit'
      patch: EndgeConfigurationPatch
    }
  | {
      mode: 'replace'
      value: EndgeConfiguration
    }
```

### Режим `inherit`

`inherit` сохраняет upstream configuration и применяет только локальные операции.

```ts
export type EndgeValueOverride<T> =
  | { op: 'set', value: T }
  | { op: 'remove' }

export type EndgeConfigurationValuePatch = Record<
  string,
  Record<string, EndgeValueOverride<JsonValue>>
>

export interface EndgeConfigurationPatch {
  // системные scalar и collection patches
  values?: EndgeConfigurationValuePatch
}
```

Пример Environment contribution:

```json
{
  "mode": "inherit",
  "patch": {
    "values": {
      "groundHandling": {
        "rowHeight": {
          "op": "set",
          "value": 44
        },
        "compactMode": {
          "op": "remove"
        }
      }
    }
  }
}
```

Для Configuration values:

- `set` задаёт локальное значение поля;
- `remove` удаляет override текущего слоя и сохраняет upstream value;
- отсутствие операции также означает inheritance;
- операция одного поля не затрагивает соседние поля категории.

Для системных collections используются `upsert` и `remove` по стабильному ключу. Их semantics отличаются от field-level Configuration value: collection `remove` действительно удаляет item из effective collection.

### Режим `replace`

`replace` отбрасывает накопленный upstream result и начинает разрешение с полной конфигурации replace-слоя:

```text
Workspace → Tenant → Project (replace) → Environment
                        │
                        └─ новый полный base
```

После replace schema resolver снова дополняет отсутствующие Configuration values defaults активных source-документов. Последующие слои продолжают применяться в обычном порядке.

Например, `Project (replace)` сбрасывает Workspace и Tenant, но не отменяет Environment contribution.

Для обычных переопределений предпочтителен `inherit`. `replace` нужен только слою, который действительно владеет независимой полной конфигурацией.

## Ошибочные и stale-значения

Persisted данные не удаляются автоматически при изменении Source:

| Ситуация | Persisted JSON | Effective configuration | Diagnostic |
|---|---|---|---|
| значение совместимо с активным полем | сохраняется | применяется | нет |
| значение несовместимо с Type | сохраняется | build блокируется | error |
| field удалён из Source | сохраняется | игнорируется | warning |
| Configuration удалена или неактивна | сохраняется | игнорируется | stale |
| field/document восстановлен с совместимым Type | сохраняется | применяется повторно | снимается |

Resolver не выполняет silent fallback к default для несовместимого значения и не исправляет persisted JSON за пользователя.

## Интерфейс редактора

Один `ConfigurationSettingsEditor` используется для всех уровней.

### Workspace

Workspace редактирует полную конфигурацию:

```ts
interface WorkspaceConfigurationEditorProps {
  variant: 'root'
  modelValue: EndgeConfiguration
}
```

Для каждой активной Configuration schema после системных разделов добавляется отдельная категория.

### Tenant, Project и Environment

Остальные уровни редактируют contribution относительно upstream snapshot:

```ts
interface ConfigurationContributionEditorProps {
  variant: 'contribution'
  modelValue: EndgeConfigurationContribution
  upstream: EndgeConfiguration
}
```

Upstream зависит от слоя:

| Редактируемый слой | Upstream preview |
|---|---|
| `Tenant` | Source defaults → Workspace |
| `Project` | Source defaults → Workspace → Tenant |
| `Environment` | Source defaults → Workspace → Tenant → Project |

UI должен различать:

- inherited value;
- local override;
- effective value;
- источник итогового значения;
- invalid и stale persisted values;
- режим `inherit` или `replace`.

Сброс локального override означает возврат к inheritance, а не удаление upstream value.

## Публичная runtime-проекция

После boot effective configuration публикуется в Component SFC как глубоко замороженный `$context.config`:

```ts
$context.config.defaultTheme
$context.config.defaultTimezone
$context.config.sfcEditing
$context.config.tooltips
$context.config.groundHandling.rowHeight
```

Системные публичные поля и Configuration identities находятся на одном уровне. Внутренний `values`, `vars`, diagnostics internals и credentials в snapshot не входят.

Snapshot не создаёт runtime subscriptions и не обновляется реактивно. Новые persisted values становятся доступны после нового boot/build.

::: warning Публичные данные
Effective Configuration доступна в браузере. Каскад не является механизмом хранения secrets или разграничения доступа к credentials.
:::
