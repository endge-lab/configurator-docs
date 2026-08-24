# Configuration

`Configuration` — source-документ рабочего пространства, который объявляет типизированную категорию пользовательских настроек. Он нужен для значений, которые должны отличаться между Workspace, Tenant, Project и Environment, но не должны изменяться во время работы приложения.

Например, через Configuration можно задавать:

- комбинации клавиш и pointer-события;
- размеры и ограничения интерфейса;
- feature flags;
- наборы отображаемых колонок;
- ссылки на доменные сущности;
- вложенные параметры пользовательского Type;
- произвольные публичные JSON-настройки.

Configuration не предназначена для запросов, действий и secrets. Она описывает данные, а Component SFC, Query или другой потребитель решает, как эти данные использовать.

## Контракт документа

| Свойство | Значение |
|---|---|
| Document type | `configuration` |
| Source kind | `configuration` |
| Backend collection | `configurations` |
| Владелец | Workspace |
| Папки | не поддерживаются |
| Source version | `1` |
| Корневой DSL-вызов | `defineConfig(...)` |

`identity` документа становится ключом первого уровня в `$context.config`. `displayName` отображается как название категории в редакторах Workspace, Tenant, Project и Environment.

Например, документ с `identity: 'groundHandling'` и `displayName: 'Наземное обслуживание'` публикуется как:

```ts
$context.config.groundHandling
```

Source является единственным источником истины. Visual editor читает этот Source и применяет к нему локальные AST/source-патчи; отдельная visual-модель документа не сохраняется.

## Полный пример

```ts
defineConfig({
  actualTimeTriggers: value(TriggerSet, [
    {
      event: 'contextmenu',
      button: 2,
      prevent: true,
    },
    {
      event: 'keydown',
      code: ['KeyT'],
      modifiers: {
        mod: true,
        shift: true,
      },
      held: {
        code: ['Space'],
        match: 'all',
      },
      prevent: true,
    },
  ])
    .label('Установка фактического времени')
    .description('Способы запуска операции установки текущего времени'),

  rowHeight: value(Number, 32)
    .label('Высота строки')
    .description('Высота строки таблицы в пикселях')
    .min(24)
    .max(80)
    .step(1),

  compactMode: value(Boolean, true)
    .label('Компактный режим'),

  integrationOptions: value(JSON, {
    compact: true,
    visibleColumns: ['flight', 'actualTime'],
  }).label('Дополнительные параметры'),
})
```

Документ должен содержать ровно один expression statement с `defineConfig(...)`. Аргументом служит один object literal, а каждое его поле объявляет одну настройку.

## `value(Type, default?)`

Базовая форма значения:

```ts
key: value(Type, defaultValue)
```

Второй аргумент можно опустить, если compiler способен однозначно вывести default:

```ts
defineConfig({
  title: value(String),         // ''
  retries: value(Number),      // 0
  enabled: value(Boolean),     // false
  options: value(JSON),        // {}
  triggers: value(TriggerSet), // []
})
```

Для каждого значения доступны modifiers:

| Modifier | Назначение | Ограничение |
|---|---|---|
| `.label('...')` | человекочитаемое название поля | одна строка |
| `.description('...')` | пояснение под полем | одна строка |
| `.min(number)` | минимальное значение | только `Number` |
| `.max(number)` | максимальное значение | только `Number` |
| `.step(number)` | шаг numeric control | только `Number`, больше нуля |

Если `.label(...)` отсутствует, редактор строит label из key. Например, `actualTimeTriggers` отображается как `Actual Time Triggers`.

Порядок полей Source сохраняется. Key должен быть уникальным в пределах документа. Значения `__proto__`, `prototype` и `constructor` запрещены как небезопасные.

## Типы значений

Configuration использует тот же Type Registry, что и остальные source-документы.

### Встроенные типы

| Тип | Допустимое значение | Auto-default | Visual editor |
|---|---|---|---|
| `String` | строка | `''` | Input |
| `Number` | конечное число | `0` | numeric Input |
| `Boolean` | boolean | `false` | Switch |
| `ID` | строка или число | `''` | Input |
| `Null` | только `null` | `null` | JSON/null control |
| `Time` | строка времени | `''` | Time control |
| `DateTime` | строка даты и времени | `''` | DateTime control |
| `Object` | JSON object | `{}` | Monaco JSON |
| `Any` | любое JSON-значение | `null` | Monaco JSON |
| `JSON` | любое JSON-значение | `{}` | Monaco JSON |
| `TriggerSet` | массив interaction triggers | `[]` | trigger-list editor |

`JSON` хранится как parsed JSON value, а не как строка с JSON. Значение должно быть JSON-сериализуемым: допускаются `null`, boolean, конечные числа, строки, массивы и объекты с безопасными ключами.

### Inline type expressions

В `value(...)` можно использовать inline-описания:

```ts
defineConfig({
  density: value(enumOf(['compact', 'normal', 'comfortable']), 'normal'),

  visibleColumns: value(arrayOf(String), ['flight', 'actualTime']),

  labels: value(recordOf(String), {
    arrival: 'Прибытие',
    departure: 'Вылет',
  }),

  refreshPolicy: value(
    objectOf({
      enabled: field(Boolean),
      intervalSeconds: field(Number).min(1).max(300),
    }),
    {
      enabled: true,
      intervalSeconds: 30,
    },
  ),

  selected: value(unionOf(String, Number), 'default'),
})
```

Поддерживаются:

- `enumOf([...])`;
- `arrayOf(Type)`;
- `recordOf(Type)`;
- `objectOf({ ... })` с `field(...)`;
- `unionOf(TypeA, TypeB, ...)`;
- ссылки на зарегистрированные пользовательские и reference-типы.

### Пользовательские Type

Если Type зарегистрирован в Workspace, на него можно ссылаться по identity:

```ts
defineConfig({
  processAppearance: value(GroundHandlingAppearance, {
    criticality: 'half-critical',
    targetVisible: true,
    actualVisible: true,
  }),
})
```

Вместо identifier допустима явная ссылка:

```ts
defineConfig({
  processAppearance: value(type('GroundHandlingAppearance'), {
    criticality: 'half-critical',
    targetVisible: true,
    actualVisible: true,
  }),
})
```

Структурный пользовательский Type редактируется рекурсивной формой. Reference-type отображается entity picker и сохраняет ID или identity в соответствии с контрактом самого Type. Reference всегда требует явного непустого default.

## Правила auto-default

Если второй аргумент `value(...)` отсутствует, compiler строит default по следующим правилам:

| Type expression | Результат |
|---|---|
| `String`, `ID`, `Time`, `DateTime` | `''` |
| `Number` | `0` |
| `Boolean` | `false` |
| `Null`, `Any` | `null` |
| `Object`, `JSON`, `recordOf(...)` | `{}` |
| `arrayOf(...)`, `TriggerSet` | `[]` |
| непустой `enumOf(...)` | первый вариант |
| `unionOf(...)` | default первого варианта, для которого его можно вывести |
| object Type | объект из defaults обязательных полей; optional-поля пропускаются |

Явный default обязателен, если его нельзя построить безопасно. Типичные случаи:

- reference-type;
- неизвестный или неразрешимый Type;
- обязательная рекурсия;
- Type без структурного definition;
- union, в котором ни один вариант не имеет выводимого default.

Visual editor всегда записывает default явно. Ручной Source может использовать сокращённую форму `value(Type)`.

::: info Порядок `unionOf` имеет значение
Текущий compiler выбирает первый вариант union, для которого можно вывести default. Если порядок вариантов не должен определять значение, задайте default явно.
:::

## Статический DSL

Configuration Source парсится, но не выполняется как JavaScript. Это делает сборку воспроизводимой и не позволяет source-документу получить доступ к окружению configurator.

Разрешены только статические литералы и известные DSL-конструкции. Запрещены:

- `import` и `export`;
- дополнительные statements;
- spreads;
- computed keys;
- переменные и обращения к внешним identifiers в default;
- вызовы пользовательских функций;
- arrow/function expressions;
- getters, setters и methods;
- array holes;
- `NaN`, `Infinity` и другие не-JSON значения.

Некорректные примеры:

```ts
import defaults from './defaults'

defineConfig({
  ...defaults,
  [dynamicKey]: value(String, readValue()),
})
```

## `TriggerSet`

`TriggerSet` — массив декларативных interaction triggers. Элементы массива объединяются через OR: срабатывание любого элемента подходит. Поля одного элемента объединяются через AND.

```ts
defineConfig({
  actualTimeTriggers: value(TriggerSet, [
    {
      event: 'contextmenu',
      button: 2,
      prevent: true,
    },
    {
      event: 'keydown',
      code: ['KeyT'],
      modifiers: {
        mod: true,
        shift: true,
        exact: true,
      },
      held: {
        code: ['Space'],
        match: 'all',
      },
      prevent: true,
    },
  ]),
})
```

Пустой массив разрешён и означает отсутствие реакции:

```ts
defineConfig({
  actualTimeTriggers: value(TriggerSet, []),
})
```

Trigger может содержать:

- `event` — имя DOM/intrinsic события;
- `key` — логическое значение клавиши с учётом текущей раскладки;
- `code` — физический код клавиши, не зависящий от раскладки;
- `modifiers.mod`, `ctrl`, `meta`, `shift`, `alt`, `exact`;
- `held.key`, `held.code`, `held.match`, `held.exact`;
- pointer `button`;
- `repeat` и `composing`;
- event flags `stop`, `prevent`, `self`, `once`, `capture`, `passive`.

`mod` означает Meta/Command на macOS и Control на Windows/Linux. `held.match: 'all'` требует все перечисленные клавиши, а `held.match: 'any'` — хотя бы одну.

`passive: true` нельзя объединять с `prevent: true`. Браузер или операционная система могут перехватить системное сочетание до приложения.

Один и тот же TriggerSet можно связать с неизменной reaction через `:on`:

```vue
<Cell
  :on="{
    triggers: $context.config.groundHandling.actualTimeTriggers,
    reaction: query({
      identity: 'groundHandling.actualTime.update',
      input: {
        legId: row.arrivalLeg.id,
        value: now(),
      },
    }),
  }"
>
  <GroundHandlingProcess :process="row.arrivalLeg.groundHandling[code = 'Bridge On']" />
</Cell>
```

При смене Tenant, Project или Environment меняется effective TriggerSet, но не
Query. Совпадение выполняет reaction сразу и не включает режим редактирования.
Подробности: [сложные события через `:on`](/domain/components/interactions#triggerset-из-effective-configuration).

`now()` возвращает текущее время выполнения reaction в формате ISO 8601 UTC.
Если вместо этого требуется timestamp исходного browser event, используйте
`event('occurredAt')`. Полный каталог `event('…')` приведён в
[справочнике взаимодействий](/domain/components/interactions#значения-event-и-now).

## Редактирование в Configurator

После создания Configuration Configurator автоматически добавляет:

1. документ в дерево активного Workspace;
2. Main editor для identity, displayName и description;
3. Visual editor со строкой на каждое значение;
4. Source editor с diagnostics, completion, references и formatting;
5. категорию настроек в редакторы Workspace, Tenant, Project и Environment.

Visual editor выбирает control по Type. Для JSON используется Monaco: невалидный текст остаётся локальным draft и не заменяет последнее корректное parsed value. Для `TriggerSet` используется специализированный список триггеров. Вложенные object/record Type редактируются рекурсивно.

Изменение Visual-представления всегда патчит Source. Порядок значений, соседние поля и не затронутые части документа сохраняются.

## Persisted values

Defaults принадлежат Source-документу. Пользовательские значения Workspace сохраняются отдельно во внутреннем namespace `configuration.values`:

```json
{
  "configuration": {
    "values": {
      "groundHandling": {
        "actualTimeTriggers": [
          {
            "event": "contextmenu",
            "button": 2,
            "prevent": true
          }
        ],
        "rowHeight": 32
      }
    }
  }
}
```

Здесь `groundHandling` — identity Configuration-документа, а `actualTimeTriggers` и `rowHeight` — keys его значений. Namespace `values` является внутренним storage-контрактом и не публикуется в SFC.

Tenant, Project и Environment хранят field-level операции:

```json
{
  "mode": "inherit",
  "patch": {
    "values": {
      "groundHandling": {
        "rowHeight": {
          "op": "set",
          "value": 40
        }
      }
    }
  }
}
```

`set` создаёт локальное переопределение. `remove` означает отсутствие локального override и возврат к inherited value; upstream значение при этом не удаляется.

## Effective configuration

Для каждого boot/build Endge вычисляет один итоговый snapshot:

```text
Source defaults → Workspace → Tenant → Project → Environment
```

Более правый слой имеет больший приоритет. Например:

| Слой | `groundHandling.rowHeight` |
|---|---:|
| Source default | `32` |
| Workspace | `36` |
| Tenant | наследуется |
| Project | `40` |
| Environment | `44` |

Effective value будет равно `44`. Если удалить Environment override, результатом станет `40`. Если удалить также Project override, вернётся Workspace value `36`.

### `inherit` и `replace`

В режиме `inherit` слой применяет только свои field-level операции и сохраняет все остальные upstream values.

В режиме `replace` накопленная конфигурация слоя отбрасывается. Для Configuration values сначала снова применяются defaults активных source-документов, затем значения replace-слоя и последующие contribution.

Обычно следует использовать `inherit`. `replace` нужен только для контекста, который действительно должен иметь независимую полную конфигурацию.

### Ошибочные и stale-значения

Resolver не удаляет сохранённые данные автоматически:

- несовместимое значение активного поля сохраняется, получает diagnostic и блокирует build;
- значение неизвестного или удалённого документа не входит в effective configuration;
- неизвестный key активного документа сохраняется как stale и даёт warning;
- если документ или поле восстановить и тип снова совместим, сохранённое значение применяется повторно.

Silent fallback к default для несовместимого активного значения не выполняется.

## `$context.config`

Effective values доступны в любом Component SFC через immutable context snapshot:

```html
<DateTime
  editable
  :edit-on="$context.config.groundHandling.actualTimeTriggers"
/>
```

Публичный контракт плоский:

```ts
$context.config.defaultTheme
$context.config.defaultLocale
$context.config.defaultTimezone
$context.config.sfcEditing
$context.config.tooltips
$context.config.groundHandling.actualTimeTriggers
$context.config.groundHandling.rowHeight
```

Системные публичные поля находятся непосредственно в `$context.config`. Identity каждого Configuration-документа добавляется на тот же первый уровень. Поэтому identity, совпадающие с системными ключами, а также `__proto__`, `prototype` и `constructor`, запрещены.

В `$context.config` не публикуются:

- внутренний namespace `values`;
- `vars`;
- diagnostics internals;
- credentials;
- приватные adapter options.

Snapshot глубоко заморожен. Он не сохраняется в local storage, не публикуется в Raph и не создаёт runtime subscriptions. Изменение persisted configuration начинает действовать только после нового boot/build и участвует в `contextHash`.

## Import, export и hash

Новые Workspace snapshots всегда содержат `documents.configurations`, включая пустой массив. Snapshot schemaVersion 1 без этой коллекции импортируется как `configurations: []`.

Глобальный bundle `schemaVersion` остаётся равным `1`. Версия самого Configuration-документа задаётся обязательным `sourceVersion: 1`; отсутствующая, неположительная или неизвестная версия отклоняется.

Domain hash изменяется при изменении:

- identity или Source Configuration-документа;
- Type или default значения;
- Workspace/Tenant/Project/Environment values;
- soft-delete или restore активного документа.

Порядок документов и порядок JSON keys не должны влиять на hash.

::: warning Configuration публична
Configuration доставляется в браузер и доступна клиентскому JavaScript. Не храните здесь пароли, access/refresh tokens, private keys, client secrets и другие credentials.
:::
