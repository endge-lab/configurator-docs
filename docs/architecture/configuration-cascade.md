# Каскад конфигурации

Endge собирает effective configuration для одного execution context из четырёх слоёв. Слои применяются последовательно, а более поздний слой имеет более высокий приоритет при конфликте.

Нормативный порядок:

```text
Workspace → Project → Tenant → Environment
```

Следовательно, при переопределении одного и того же значения действует такой приоритет:

```text
Environment > Tenant > Project > Workspace
```

`Environment` имеет наивысший приоритет, `Workspace` служит фундаментом. Отсутствующее переопределение ничего не меняет: значение продолжает наследоваться из предыдущего слоя.

::: warning Статус реализации
Этот документ фиксирует целевой архитектурный контракт. На момент его принятия `@endge/core` применяет слои в порядке `Workspace → Project → Environment → Tenant`. До синхронизации Core с этим контрактом фактический runtime order отличается: последним применяется `Tenant`.
:::

## Роль каждого слоя

| Слой | Назначение | Приоритет |
|---|---|---:|
| `Workspace` | Полная исходная конфигурация пространства | 1 — базовый |
| `Project` | Настройки конкретного приложения или прикладной модели | 2 |
| `Tenant` | Настройки организации или заказчика | 3 |
| `Environment` | Настройки конкретной среды исполнения: development, test, staging, production | 4 — наивысший |

`Project`, `Tenant` и `Environment` являются независимыми координатами execution context. Они не образуют обязательную цепочку владения: Tenant не обязан принадлежать Project, а Environment может использоваться несколькими Project. Порядок выше описывает только resolution — вычисление итоговой конфигурации.

Здесь `Environment` означает доменную сущность Endge, выбранную в execution context. Не следует смешивать её с переменными процесса, такими как `VITE_*`, переменными контейнера или операционной системы. Если platform environment variables участвуют в разрешении значений, для них нужен отдельный явный контракт.

## Как вычисляется effective configuration

Resolver начинает с полной конфигурации Workspace и применяет три contribution:

```ts
let effective = normalize(workspace.configuration)

effective = apply(effective, project.configuration)
effective = apply(effective, tenant.configuration)
effective = apply(effective, environment.configuration)
```

Полученный объект передаётся в build context и используется compiler и runtime. Effective configuration является производным результатом одного boot/build lifecycle:

- она не сохраняется как отдельный источник истины;
- она не записывается обратно в Workspace, Project, Tenant или Environment;
- изменение выбранного execution context требует нового resolution и нового build context;
- одинаковые source configuration и execution context должны давать одинаковый результат.

### Пример конфликта

Пусть все четыре слоя задают переменную `API_URL`:

```text
Workspace:   https://api.example.com
Project:     https://project-api.example.com
Tenant:      https://customer-api.example.com
Environment: https://staging-api.example.com
```

Effective value:

```text
https://staging-api.example.com
```

Environment побеждает, потому что его contribution применяется последним. Если Environment не задаёт `API_URL`, результатом будет tenant value. Если значение отсутствует и в Tenant, используется Project, затем Workspace.

## Execution context и build context

Выбор слоёв задаётся structural context одного запуска:

```ts
export interface EndgeExecutionContext {
  projectIdentity: string
  tenantIdentity: string
  environmentIdentity: string
}
```

После resolution compiler получает immutable build context:

```ts
export interface EndgeBuildContext {
  workspaceIdentity: string
  execution: EndgeExecutionContext
  configuration: EndgeConfiguration
  contextHash: string
}
```

`configuration` здесь уже является effective configuration, а не contribution одного из слоёв. `contextHash` должен учитывать Workspace, выбранные Project/Tenant/Environment и итоговую конфигурацию.

## Persisted configuration interface

Workspace хранит полную `EndgeConfiguration`:

```ts
export interface EndgeConfiguration {
  vars: EndgeVariableDefinition[]
  sse?: EndgeSSEConfiguration

  locales: EndgeLocaleDefinition[]
  defaultLocale: string
  fallbackLocale: string

  themes: EndgeThemeDefinition[]
  defaultTheme: string

  defaultAuthProfileIdentity: string | null

  sfcAdapterIds: string[]
  defaultSfcAdapterId: string
}
```

Project, Tenant и Environment хранят не копию результата, а собственный `EndgeConfigurationContribution`:

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

`inherit` сохраняет upstream configuration и содержит только локальные операции слоя:

```ts
export type EndgeValueOverride<T> =
  | { op: 'set', value: T }
  | { op: 'remove' }

export type EndgeCollectionPatchEntry<T> =
  | { key: string, op: 'upsert', value: T }
  | { key: string, op: 'remove' }

export interface EndgeCollectionPatch<T> {
  entries: EndgeCollectionPatchEntry<T>[]
}

export interface EndgeConfigurationPatch {
  vars?: EndgeCollectionPatch<EndgeVariableDefinition>
  sse?: EndgeValueOverride<EndgeSSEConfiguration>

  locales?: EndgeCollectionPatch<EndgeLocaleDefinition>
  defaultLocale?: EndgeValueOverride<string>
  fallbackLocale?: EndgeValueOverride<string>

  themes?: EndgeCollectionPatch<EndgeThemeDefinition>
  defaultTheme?: EndgeValueOverride<string>

  defaultAuthProfileIdentity?: EndgeValueOverride<string>

  sfcAdapterIds?: EndgeCollectionPatch<string>
  defaultSfcAdapterId?: EndgeValueOverride<string>
}
```

Правила операций:

- отсутствующее поле наследуется без изменений;
- `set` явно задаёт scalar value;
- `remove` удаляет optional value или сбрасывает nullable value;
- `upsert` добавляет либо заменяет collection item по стабильному ключу;
- `remove` для collection удаляет item по ключу;
- required scalar нельзя удалить, если после этого конфигурация станет невалидной.

Пример tenant contribution:

```json
{
  "mode": "inherit",
  "patch": {
    "defaultLocale": {
      "op": "set",
      "value": "en"
    },
    "themes": {
      "entries": [
        {
          "key": "tenant-brand",
          "op": "upsert",
          "value": {
            "identity": "tenant-brand",
            "displayName": "Tenant Brand"
          }
        }
      ]
    }
  }
}
```

### Режим `replace`

`replace` полностью отбрасывает accumulated upstream result и начинает разрешение с переданной полной конфигурации:

```text
Workspace → Project → Tenant (replace) → Environment
                         └───────────────┘
                         новый полный base
```

Environment всё равно применяется после tenant replacement. Аналогично, `Project (replace)` сбрасывает Workspace, но не отменяет последующие Tenant и Environment.

`replace` следует применять только когда слою действительно нужен независимый полный configuration contract. Для обычных переопределений предпочтителен `inherit`: он сохраняет происхождение значений и уменьшает риск случайно удалить настройки предыдущих слоёв.

## Интерфейс редактора конфигурации

Редактор должен явно разделять root configuration и contribution.

### Workspace editor

Workspace редактирует полную конфигурацию:

```ts
interface WorkspaceConfigurationEditorProps {
  variant: 'root'
  modelValue: EndgeConfiguration
}
```

Все required values должны быть заполнены и валидны до сохранения.

### Project, Tenant и Environment editor

Остальные слои редактируют contribution относительно upstream snapshot:

```ts
interface ConfigurationContributionEditorProps {
  variant: 'contribution'
  modelValue: EndgeConfigurationContribution
  upstream: EndgeConfiguration
}
```

`upstream` зависит от редактируемого слоя:

| Редактируемый слой | Upstream preview |
|---|---|
| `Project` | `Workspace` |
| `Tenant` | `Workspace → Project` |
| `Environment` | `Workspace → Project → Tenant` |

UI редактора должен показывать для каждого значения:

- inherited value из upstream;
- local operation текущего contribution;
- effective value после применения contribution;
- режим слоя: `inherit` или `replace`;
- источник итогового значения, если он известен.

Для collection fields UI должен отличать inherited item, local `upsert` и local `remove`. Сброс локальной операции означает возврат к inheritance, а не удаление upstream value.

## Границы и дальнейшее развитие

Текущий общий contribution interface технически разрешает каждому слою менять любое поле `EndgeConfiguration`. Это простой deterministic contract, но он не выражает ownership разных классов настроек.

В дальнейшем interface может быть разделён на layer-specific contracts, например:

```ts
type ProjectConfigurationContribution = /* application settings */
type TenantConfigurationContribution = /* customer settings */
type EnvironmentConfigurationContribution = /* operational settings */
```

Такое разделение не меняет общий resolution order. Оно ограничивает только набор полей, которые конкретный слой имеет право переопределять. Пока layer-specific contracts не введены, Environment остаётся последним и имеет наивысший формальный приоритет для любого конфликта в общей конфигурации.

