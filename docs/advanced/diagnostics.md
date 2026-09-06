# Диагностика

`Endge.diagnostics` — единая точка сбора, просмотра и доставки диагностической
информации Core. Модуль хранит историю telemetry, реестр актуальных проблем и
создаёт переносимые JSON-снимки текущего состояния системы.

## Структура модуля

`EndgeDiagnostics_Module` является корневым владельцем диагностики и явно
управляет двумя submodules:

- `Endge.diagnostics.telemetry` хранит bounded history логов и завершённых spans,
  применяет filters и routes, создаёт runtime adapters каналов вывода;
- `Endge.diagnostics.problems` хранит заменяемые наборы актуальных проблем. После
  исправления проблемы owner заменяет или очищает свой набор, поэтому это не
  журнал событий;
- `Endge.diagnostics.adapters` регистрирует типы каналов вывода. В Core доступны
  `console` и `sentry`, приложение может добавить собственную factory.

Родитель проводит submodules через общий lifecycle, объединяет их уведомления и
владеет политикой ручных и автоматических снимков.

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

Снимок имеет маркеры `format: "endge-diagnostics-snapshot"` и `version: 1`.
Каждая тяжёлая часть включается независимо:

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

Core получает каждую часть у её владельца состояния. Если одна проекция не
читается из-за повреждённого runtime state, остальные части всё равно попадают в
файл, а ошибка записывается в `captureErrors`.

### Ручной снимок

```ts
const snapshot = Endge.diagnostics.snapshot({
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

const json = JSON.stringify(snapshot, null, 2)
```

Без options метод использует effective `diagnostics.snapshots.content`.
Дополнительный `filter` ограничивает только telemetry records и не изменяет
остальные части снимка.

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

В редакторе Configuration раздел **Диагностика** содержит пять подпунктов:

1. **Сбор** — включение telemetry, signals и минимальный severity.
2. **История** — bounded limit и текущее заполнение локального store.
3. **Каналы вывода** — console, Sentry и их options.
4. **Маршрутизация** — filters, связывающие records с output.
5. **Снимки** — точный состав файла, automatic policy и кнопка скачивания JSON.

Кнопка **Скачать JSON** снимает состояние того Core instance, в котором открыт
Конфигуратор. Выбранный состав одновременно сохраняется в configuration и
используется automatic policy.

## Безопасность снимка

Перед возвратом Core рекурсивно приводит снимок к JSON-safe значениям, обрабатывает
циклические ссылки и заменяет значения полей с чувствительными именами — например
`password`, `token`, `secret`, `credential`, `authorization`, `cookie`, `dsn` и
`apiKey` — на `[REDACTED]`. Количество замен находится в `redaction.fields`.

Это защита от типичных credential-полей, а не классификатор пользовательских
данных. Business payload может содержать персональные или коммерческие сведения
под обычными ключами, поэтому перед отправкой снимок всё равно нужно проверить.
