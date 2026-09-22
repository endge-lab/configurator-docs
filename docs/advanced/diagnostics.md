# Диагностика

`Endge.diagnostics` — единая точка сбора, просмотра и доставки диагностической
информации Core. Модуль хранит историю telemetry, реестр актуальных проблем и
создаёт JSON-снимки для инспекции текущего состояния системы.

## Структура модуля

`EndgeDiagnostics_Module` является корневым владельцем диагностики и явно
управляет тремя submodules и registry каналов:

- `Endge.diagnostics.telemetry` хранит bounded history логов и завершённых spans,
  применяет filters и routes, создаёт runtime adapters каналов вывода;
- `Endge.diagnostics.problems` хранит заменяемые наборы актуальных проблем. После
  исправления проблемы owner заменяет или очищает свой набор, поэтому это не
  журнал событий;
- `Endge.diagnostics.snapshots` создаёт снимки, применяет automatic policy и
  управляет глобальной подпиской на настроенную `TriggerActivation`;
- `Endge.diagnostics.adapters` регистрирует типы каналов вывода. В Core доступны
  `console` и `sentry`, приложение может добавить собственную factory.

Родитель проводит submodules через общий lifecycle и объединяет их уведомления.
Browser-specific подписка и сохранение файла изолированы в
`BrowserDiagnosticsSnapshot_Adapter`.

## Записи и spans

Для одиночного события используйте метод нужного severity:

```ts
import { Endge } from '@endge/core'

Endge.diagnostics.warn('Query returned an incomplete result', {
  phase: 'runtime',
  scope: { name: 'orders.query' },
  attributes: {
    'query.identity': 'orders.list',
    'rows.count': 42,
  },
})
```

Для операции с длительностью создайте span и обязательно завершите его:

```ts
const span = Endge.diagnostics.startSpan('orders.refresh', {
  phase: 'runtime',
  scope: { name: 'orders.runtime' },
})

try {
  await refreshOrders()
  span.end({ status: 'ok' })
}
catch (error) {
  span.recordException(error)
  span.end({ status: 'error', message: 'Refresh failed' })
}
```

Историю можно читать тем же filter contract, который используется в routing:

```ts
const recentRuntimeErrors = Endge.diagnostics.query({
  signals: ['log'],
  phases: ['runtime'],
  minSeverity: 17,
  limit: 50,
})
```

## Актуальные проблемы

Проблемы принадлежат стабильному owner. `replace` заменяет весь набор owner, а
пустой массив означает, что его проблемы устранены.

```ts
const owner = {
  key: 'runtime:orders.list',
  phase: 'runtime' as const,
  runtimeId: 'query:orders.list',
}

Endge.diagnostics.problems.replace(owner, [{
  key: 'response-shape',
  severity: 'error',
  code: 'query.response.invalid',
  message: 'Response does not match the compiled output type',
}])

// После успешного следующего запуска:
Endge.diagnostics.problems.replace(owner, [])
```

## Состав снимка

Обычный снимок Core имеет маркеры `format: "endge-diagnostics-snapshot"` и
`version: 2`. Он содержит рекурсивное дерево Federation и сохраняет совместимые
top-level поля тяжёлых Core-владельцев. Каждая тяжёлая часть включается
независимо:

| Настройка | Поле JSON | Что входит |
| --- | --- | --- |
| `telemetry` | `telemetry` | session, counters и выбранная история records |
| `problems` | `problems` | актуальный replaceable problem registry |
| `configuration` | `configuration` | effective configuration самого Diagnostics-модуля |
| `effectiveConfiguration` | `effectiveConfiguration` | полная effective Endge configuration текущего build |
| `domain` | `domain` | открытый persisted domain через `Endge.domain.toPlain()` |
| `program` | `program` | статус, diagnostics и компактные сведения compiled artifacts |
| `runtime` | `runtime` | активные и сохранённые удалённые hosts, их context и scopes |
| `raphData` | `raph.data` | текущее shared data tree Raph |
| `raphGraph` | `raph.graph` | nodes, routes, tree, frame и derived metrics Raph |
| автоматически | `federation` | всё явное дерево Modules, child Federations и trusted plugins |

Federation вызывает `createDiagnosticsSnapshot()` каждого зарегистрированного
Module. По умолчанию метод делегирует в `serialize()`, а владельцы более сложного
состояния возвращают специализированную проекцию. Domain отдаёт `toPlain()`,
Program — summary compiled artifacts, Runtime — hosts, scopes и operation
histories, Context — effective execution context, Auth — только безопасные
actor/session metadata без tokens.

Snapshots-подмодуль напрямую вызывает `Endge.createDiagnosticsSnapshot()`.
После обхода дерева он отдельно добавляет Raph через
`Endge.runtime.snapshotRaph(options)`, чтобы существующие настройки `raphData` и `raphGraph`
продолжали независимо управлять объёмом файла.

`EndgeDiagnostics_Module` создаётся без provider callbacks. Его constructor
не читает соседние Modules: обращения к владельцам происходят при сборе снимка.
Снимок Core формируется в формате version 2; отдельный режим сборки через
`DiagnosticsSnapshotProviders` удалён.

Внешняя trusted Federation, подключённая до boot, автоматически появляется в
этом же дереве вместе со своими Modules. Отдельный provider в Diagnostics для неё
не нужен.

```ts
export class ExternalCache_Module extends EndgeModule {
  public override createDiagnosticsSnapshot() {
    return {
      entries: this.cache.size,
      pendingLoads: this.pendingLoads,
    }
  }
}
```

Узел Module содержит `path`, `key`, `moduleName` и status. Значения Domain,
Program, Runtime и effective Configuration физически остаются в прежних
top-level полях, а соответствующий узел дерева получает `status: "referenced"`
и `snapshotRef`. Поэтому тяжёлые данные не дублируются в одном JSON.

Если одна проекция не читается из-за повреждённого runtime state, остальные
узлы всё равно попадают в файл. Узел получает `status: "failed"`, а ошибка
top-level owner дополнительно записывается в `captureErrors`.

::: warning Снимок предназначен для инспекции
Диагностический snapshot не является точкой восстановления runtime. Program и
Raph являются производными структурами, а subscriptions, network connections,
DOM и pending operations не могут быть перенесены в другое окружение одним JSON.
:::

### Ручной снимок

```ts
const snapshot = Endge.diagnostics.downloadSnapshot({
  includeTelemetry: true,
  includeProblems: true,
  includeConfiguration: true,
  includeEffectiveConfiguration: true,
  includeDomain: true,
  includeProgram: true,
  includeRuntime: true,
  includeRaphData: false,
  includeRaphGraph: true,
})

console.info(`Скачан снимок ${snapshot.generatedAt}`)
```

Без options метод использует effective `diagnostics.snapshots.content`.
Дополнительный `filter` ограничивает только telemetry records и не изменяет
остальные части снимка.

### Снимок по горячей клавише

Shortcut использует общий встроенный тип `TriggerActivation`. Обычная комбинация
по-прежнему хранится как legacy `TriggerSet`: элементы массива проверяются как
альтернативы, а пустой массив отключает глобальную подписку. Поэтому существующие
persisted значения не требуют миграции. Для последовательности используется
объект с `mode: 'sequence'`; каждый шаг содержит свой `TriggerSet`, а
`maxIntervalMs` задаёт максимальную паузу после предыдущего шага.

В этой политике Core обрабатывает только `keydown` и `keyup`; pointer events
намеренно не становятся глобальными командами.

```ts
const diagnostics = {
  snapshots: {
    // Состав ручного снимка опущен
    content: {
      telemetry: true,
      problems: true,
      configuration: false,
    },
    shortcut: {
      triggerSet: [{
        event: 'keydown',
        code: ['KeyD'],
        repeat: false,
        composing: false,
        modifiers: { mod: true, shift: true, exact: true },
        prevent: true,
        stop: true,
      }],
      content: {
        telemetry: true,
        problems: true,
        configuration: true,
        effectiveConfiguration: true,
        domain: true,
        program: true,
        runtime: true,
        raphData: true,
        raphGraph: true,
      },
    },
  },
}
```

Та же настройка для последовательности `Command/Ctrl+E`, затем
`Command/Ctrl+R`:

```ts
shortcut: {
  triggerSet: {
    mode: 'sequence',
    steps: [
      {
        triggerSet: [{
          event: 'keydown',
          code: ['KeyE'],
          modifiers: { mod: true, exact: true },
          repeat: false,
        }],
      },
      {
        maxIntervalMs: 800,
        triggerSet: [{
          event: 'keydown',
          code: ['KeyR'],
          modifiers: { mod: true, exact: true },
          repeat: false,
        }],
      },
    ],
  },
}
```

`mod` означает `Command` на macOS и `Ctrl` на Windows/Linux. Редактор комбинации
в Конфигураторе записывает физический `code`, поэтому раскладка клавиатуры не
меняет shortcut. Подписка создаётся в `start()` Core и снимается в `reset()`;
Конфигуратор только сохраняет configuration.

### Автоматический снимок

Automatic policy срабатывает, когда за заданное окно накопилось нужное число
`ERROR`/`FATAL` records. После отправки действует cooldown.

```ts
const diagnostics = {
  // telemetry.outputs и telemetry.routes опущены для краткости
  snapshots: {
    content: {
      telemetry: true,
      problems: true,
      configuration: false,
      effectiveConfiguration: true,
      domain: true,
      program: true,
      runtime: true,
      raphData: false,
      raphGraph: true,
    },
    shortcut: {
      triggerSet: [],
      content: {
        telemetry: true,
        problems: true,
        configuration: false,
        effectiveConfiguration: true,
        domain: true,
        program: true,
        runtime: true,
        raphData: false,
        raphGraph: true,
      },
    },
    automatic: {
      enabled: true,
      errorCount: 5,
      windowSeconds: 60,
      cooldownSeconds: 300,
      outputIds: ['support-sentry'],
    },
  },
}
```

Для явной отправки текущего снимка в настроенные каналы используйте:

```ts
Endge.diagnostics.sendSnapshot(['support-sentry'], {
  trigger: 'manual',
  includeRaphData: false,
})
```

Adapter должен поддерживать `acceptSnapshot`. Встроенный Sentry adapter передаёт
снимок как JSON attachment, если у output включена опция `sendSnapshots`.

## Настройка в Конфигураторе

В редакторе Configuration раздел **Диагностика** содержит семь подпунктов:

1. **Сбор** — включение telemetry, signals и минимальный severity.
2. **История** — bounded limit и текущее заполнение локального store.
3. **Каналы вывода** — console, Sentry и их options.
4. **Маршрутизация** — filters, связывающие records с output.
5. **Ручной снимок** — состав файла и кнопка скачивания JSON.
6. **Хоткей снимок** — независимый состав и активация одной комбинацией либо
   последовательностью с интервалами.
7. **Автоматические снимки** — error policy, cooldown и канал доставки.

Кнопка **Скачать JSON** снимает состояние того Core instance, в котором открыт
Конфигуратор. Ручной и shortcut-сценарии сохраняют независимый состав. Automatic
policy использует состав ручного снимка и отправляет файл в выбранный output.
Независимо от способа запуска дерево содержит все зарегистрированные Modules и
child Federations; content toggles отключают тяжёлые Core-проекции до их чтения.

## Безопасность снимка

Перед возвратом Core рекурсивно приводит снимок к JSON-safe значениям, обрабатывает
циклические ссылки и заменяет значения полей с чувствительными именами — например
`password`, `token`, `secret`, `credential`, `authorization`, `cookie`, `dsn` и
`apiKey` — на `[REDACTED]`. Количество замен находится в `redaction.fields`.

Это защита от типичных credential-полей, а не классификатор пользовательских
данных. Business payload может содержать персональные или коммерческие сведения
под обычными ключами, поэтому перед отправкой снимок всё равно нужно проверить.
Module, владеющий credentials или чувствительным внешним состоянием, должен
переопределить `createDiagnosticsSnapshot()` безопасной проекцией и не полагаться
только на общий redactor.
