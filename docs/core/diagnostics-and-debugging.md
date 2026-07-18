# Диагностика и отладка

`EndgeDiagnostics` — единый facade диагностики ядра Endge. Он не зависит от configurator UI и объединяет два независимо подписываемых подмодуля:

```text
Endge.diagnostics
├── telemetry — append-only logs, exceptions, spans, routes и adapters
└── problems  — replaceable authoring/build/runtime problems
```

Facade одинаково работает во время компиляции, в пользовательском runtime, в headless-сценарии и при подключении внешних систем.

Старый `EndgeDebug` удалён. Producers больше не пишут в отдельный debug journal: logs, exceptions и spans проходят через `Endge.diagnostics`.

## Граница ответственности

Telemetry-подмодуль выполняет четыре задачи:

1. Нормализует logs, exceptions и spans в общий structured format.
2. Хранит ограниченную историю текущей session в памяти ядра.
3. Позволяет подписываться и делать read-only queries по records.
4. Передаёт выбранные records во внешние adapters по декларативным routes.

Problems-подмодуль хранит актуальное состояние проблем по стабильному owner: сущности, editor draft, runtime host или project. Исправленная проблема удаляется через `replace()` или `resolve()`, поэтому registry отвечает на вопрос «что сломано сейчас», а не хранит историю.

Модуль не отвечает за:

- внешний вид вкладки «Диагностика»;
- постоянное хранение истории между запусками;
- credentials для Sentry, Grafana или другого backend;
- runtime inspection snapshots и управление подключёнными browser tabs.

`ProgramArtifact.diagnostics` остаётся self-contained частью compiled artifact, необходимой runtime. После компиляции тот же набор атомарно публикуется в `Endge.diagnostics.problems` как централизованный индекс актуальных проблем. `EndgeRuntimeDebugger` остаётся отдельным transport/inspection tool, но передаёт нормализованные telemetry records.

Facade сохраняет короткие методы `info()`, `error()`, `recordException()`, `startSpan()` и другие. Они делегируют в `Endge.diagnostics.telemetry`, поэтому существующим producers не требуется более длинный вызов.

## Формат records

Первая версия поддерживает только два signals:

| Signal | Что хранится |
| --- | --- |
| `log` | Сообщение, severity, scope, attributes и optional correlation |
| `span` | Одна завершённая операция с началом, концом, duration и status |

Отдельные `trace-start`, `span-start` и `span-end` records не создаются. Активный span существует как handle, а после `end()` в store попадает один completed span. Это уменьшает шум и соответствует модели экспорта OpenTelemetry.

Основные поля log record:

```ts
interface DiagnosticsLogRecord {
  id: number
  signal: 'log'
  timestamp: number
  severityNumber: 1 | 5 | 9 | 13 | 17 | 21
  severityText: 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL'
  body: string
  eventName?: string
  scope: { name: string; version?: string }
  attributes: Record<string, string | number | boolean | Array<string | number | boolean>>
  traceId?: string
  spanId?: string
  traceFlags?: number
}
```

Основные поля completed span:

```ts
interface DiagnosticsSpanRecord {
  id: number
  signal: 'span'
  traceId: string
  spanId: string
  parentSpanId?: string
  name: string
  startTimestamp: number
  endTimestamp: number
  durationMs: number
  status: { code: 'unset' | 'ok' | 'error'; message?: string }
  scope: { name: string; version?: string }
  attributes: DiagnosticsAttributes
}
```

`traceId` — 16-byte W3C identifier в виде 32 hex-символов. `spanId` — 8-byte identifier в виде 16 hex-символов. `parentSpanId` нужен только completed span: у correlated log уже есть `spanId`, по которому восстанавливается его место в дереве.

## Severity и exceptions

Модуль использует базовые значения OpenTelemetry `SeverityNumber`:

| Метод | Number | Смысл |
| --- | ---: | --- |
| `trace()` | 1 | очень подробный технический след |
| `debug()` | 5 | данные для разработки и анализа |
| `info()` | 9 | нормальное значимое событие |
| `warn()` | 13 | потенциальная проблема без остановки операции |
| `error()` | 17 | ошибка или неуспешная операция |
| `fatal()` | 21 | критическая ошибка; сам метод не останавливает runtime |

`recordException(error)` отличается от `error(body)`: он принимает `unknown`, безопасно извлекает тип, message и stack и записывает их в `exception.*` attributes. Это structured ERROR log, а не третий вид record. Через `severityNumber: 21` exception можно отметить как FATAL.

```ts
try {
  await executeQuery()
}
catch (error) {
  Endge.diagnostics.recordException(error, {
    scope: { name: 'endge.query' },
    eventName: 'query.execute.exception',
    attributes: { 'endge.query.id': query.identity },
  })
}
```

## Работа со spans

```ts
const compile = Endge.diagnostics.startSpan('domain.compile', {
  scope: { name: 'endge.compiler', version: '1.0.0' },
  attributes: { 'endge.project.id': projectIdentity },
})

const stores = compile.startChild('compile.store', {
  attributes: { 'endge.compiler.entity.count': 12 },
})

stores.log({
  body: 'Компиляция stores завершена',
  severityNumber: 9,
  eventName: 'endge.compiler.phase.completed',
})

stores.end({ status: 'ok' })
compile.end({ status: 'ok' })
```

Span handle предоставляет:

- `setAttributes()` — добавить attributes до завершения;
- `startChild()` — создать child span с общей trace correlation;
- `log()` — записать correlated log;
- `recordException()` — записать correlated exception;
- `end()` — идемпотентно завершить span и создать итоговый record.

Повторный `end()` возвращает `null` и не создаёт дубликат.

## Хранение в ядре

По умолчанию diagnostics collection включён. Core хранит INFO и более серьёзные logs, а также completed spans:

```ts
const defaultDiagnosticsConfiguration = {
  collection: {
    enabled: true,
    signals: ['log', 'span'],
    minSeverity: 9,
    maxRecords: 2_000,
  },
  routes: [],
}
```

Это bounded in-memory storage текущей session, а не постоянный архив. После достижения `maxRecords` самые старые records вытесняются. `reset()` завершает активные spans, выполняет best-effort flush adapters, освобождает их и начинает новую session. `clear()` очищает только историю и counters, не меняя configuration и adapters.

Таким образом, фраза «records всегда хранятся в core» верна только для records, которые прошли collection policy. Сбор можно отключить, signal можно исключить, а log ниже `minSeverity` будет отброшен.

## Актуальные problems

Problems используют другие storage semantics: это не bounded event history, а replaceable state, сгруппированный по owner.

```ts
const owner = createDiagnosticsEntityOwner({
  entityType: 'component-sfc',
  id: component.id,
  identity: component.identity,
})

Endge.diagnostics.problems.replace(owner, [
  {
    severity: 'error',
    code: 'sfc-template-invalid',
    message: 'Template содержит синтаксическую ошибку',
    sourcePath: 'template',
    start: 120,
    end: 131,
  },
])

// Следующая успешная проверка удаляет старые problems этого owner.
Endge.diagnostics.problems.replace(owner, [])
```

Основные методы:

- `replace(owner, problems)` — атомарно заменить результат authoring/build validation;
- `upsert(owner, problem)` — добавить или обновить persistent runtime problem;
- `resolve(ownerKey, problemKey)` — отметить runtime problem решённой;
- `query(filter)` — получить immutable snapshot;
- `clear(filter)` — очистить весь registry или выбранную фазу;
- `snapshot(filter)` — получить revision и текущий набор problems.

`REntity` больше не содержит mutable `validationErrors`. Pure entity validation возвращает данные через `getDiagnosticProblems()`, а `EndgeDomain` или compiler публикует их в problem registry. Это исключает чтение protected state через `any` и stale errors после успешной проверки.

Compiler problem может одновременно существовать в двух формах:

1. В `problems` — пока проблема актуальна.
2. Как structured log внутри build trace — как исторический факт конкретной сборки.

Это не две competing sources of truth: `problems` отвечает за current state, telemetry — за history и correlation.

## Авторизованный пользователь и session context

`Endge.auth` автоматически регистрирует синхронный context provider в diagnostics. Для активной авторизации каждый новый log и span получает OTel-aligned attributes:

```ts
attributes: {
  'user.id': 'opaque-oidc-subject',
  'session.id': 'authenticated-session-id',
  'endge.auth.profile.id': 'keycloak-main',
}
```

`user.id` берётся только из стабильного OIDC `sub`: сначала из `userinfo`, затем из ID token или access token. `session.id` берётся из `sid` либо Keycloak `session_state`. Email, login, access token, refresh token и полный claims payload автоматически не копируются.

В системе существуют три разных identifier:

```text
diagnostics.sessionId  — lifecycle локального diagnostics collector
session.id             — авторизованная пользовательская session
traceId                — одна связанная техническая операция
```

Actor context не входит в `DiagnosticsResource`, потому что пользователь может измениться без перезапуска runtime. Он фиксируется в момент создания record. Для span значения фиксируются при `startSpan()`, поэтому logout или смена пользователя до `end()` не меняет владельца уже начатой операции.

Headless build и anonymous runtime продолжают создавать records без `user.id` и `session.id`.

Другие модули могут использовать тот же механизм без зависимости diagnostics от auth:

```ts
const unregister = Endge.diagnostics.registerContextProvider('request', () => ({
  'endge.request.id': currentRequestId,
}))

unregister()
```

Provider должен быть синхронным, возвращать только плоские attributes и не выполнять network requests. Его ошибка учитывается в `contextProviderFailures` и не прерывает producer. Context provider attributes имеют приоритет над одноимёнными attributes конкретного producer, поэтому локальный вызов не может подменить системный `user.id`.

## `EndgeConfiguration`

Diagnostics является частью effective configuration:

```ts
interface EndgeConfiguration {
  // остальные поля configuration
  diagnostics: {
    collection: {
      enabled: boolean
      signals: Array<'log' | 'span'>
      minSeverity: 1 | 5 | 9 | 13 | 17 | 21
      maxRecords: number
    }
    routes: Array<{
      id: string
      enabled: boolean
      match: DiagnosticsFilter
      target: {
        adapterId: string
        integrationId?: string
      }
    }>
  }
}
```

Порядок configuration cascade:

```text
Workspace → Tenant → Project → Environment
```

Каждый следующий слой переопределяет effective result предыдущего. Collection fields применяются как value overrides, а routes merge-ятся по стабильному `id` через стандартные collection patch operations.

В первой UI-версии configurator только отображает собранные records. Визуальный редактор configuration routes можно добавить позже: отсутствие editor-а не мешает хранить и применять поля `EndgeConfiguration.diagnostics`.

## Чтение и подписка

`query()` возвращает snapshot подходящих records. Он не отдаёт mutable внутреннее хранилище.

```ts
const errors = Endge.diagnostics.query({
  signals: ['log'],
  minSeverity: 17,
  scopes: ['endge.compiler'],
  limit: 100,
})
```

`Endge.diagnostics.query()` является facade alias для `Endge.diagnostics.telemetry.query()`. Для нового UI-кода рекомендуется обращаться к подмодулю явно, чтобы не смешивать telemetry records и problems.

`subscribe(filter, listener, options)` подключает пользователя к live stream. `replayStored: true` сначала воспроизводит уже сохранённые records, прошедшие тот же filter.

```ts
const unsubscribe = Endge.diagnostics.subscribe(
  { signals: ['log'], minSeverity: 17 },
  record => showError(record),
  { replayStored: true },
)

unsubscribe()
```

Ошибка одного listener изолируется и не ломает producer. Для общей реактивности модуля также сохранена стандартная форма `subscribe(() => void)` из `EndgeModule`.

Дополнительные read methods:

- `getCounters()` — размеры store, drops, adapter/listener/context-provider failures, active providers и spans;
- `snapshot()` — session id, configuration, resource, counters и optional records;
- `configuration` — копия effective diagnostics configuration;
- `resource` — общие attributes запуска;
- `sessionId` — identifier текущей diagnostics session.

## Adapters и routes

Adapter — runtime integration, которая принимает уже нормализованный `DiagnosticsRecord`. Route определяет, какие records направить в adapter.

```ts
const unregister = Endge.diagnostics.registerAdapter({
  id: 'console',

  accept(record, context) {
    console.log(context.routeId, record)
  },

  flush() {
    // Доставить внутренний buffer adapter-а.
  },

  dispose() {
    // Освободить transport или connection.
  },
})
```

Основные методы:

- `registerAdapter()` — зарегистрировать runtime adapter;
- `unregisterAdapter()` — flush, dispose и удалить adapter;
- `flush()` — best-effort flush всех adapters без завершения session;
- `configure()` — применить уже разрешённую effective configuration и resource.

Adapter failures учитываются в counters и не прерывают producer. Credentials не должны находиться в diagnostics routes. `integrationId` ссылается на отдельно защищённую integration configuration.

### Sentry

Sentry adapter обычно отправляет:

- ERROR/FATAL logs и `exception.*` — как captured exceptions или events;
- trace/span correlation — в Sentry tracing context;
- scope и attributes — как tags/extra с дополнительной allowlist policy.

Compiler records получают attribute `endge.phase = build`. Если compile problems нужны только configurator-у, Sentry route должен принимать только `endge.phase = runtime`. Локальная build history при этом остаётся доступной и не отправляется наружу.

### Grafana

Grafana обычно является visual layer над Loki, Tempo и Prometheus-compatible storage:

- logs направляются в Loki;
- spans — в Tempo;
- Grafana связывает их по trace id.

Поэтому core не должен иметь `SentryRecord` или `GrafanaRecord`. Общий OTel-aligned `DiagnosticsRecord` остаётся универсальным, а конкретный adapter выполняет transport mapping.

Metrics не входят в первую версию API. Их следует добавлять отдельным signal после появления реального producer и storage/export contract, а не моделировать заранее через псевдо-logs.

## Configurator UI

Configurator не создаёт Pinia-копию diagnostics state. Vue layer подписывается непосредственно на независимые core submodules и строит только computed presentation:

```text
Endge.diagnostics.telemetry ── subscribe ──→ span/log tree, timeline, Pulse
Endge.diagnostics.problems  ── subscribe ──→ global/entity Problems UI
```

Configurator использует небольшой structural Vue adapter над `subscribe()`: он не копирует records или problems и не добавляет второй lifecycle. Core не хранит `LogNode`, раскрытые строки или состояние выбранной вкладки. Это позволяет использовать тот же diagnostics module без Vue и без configurator-а.

Актуальные problems отображаются в самостоятельной [рабочей области Problems](/configurator/problems-workspace). Левый widget содержит собственное problem-centric дерево и не изменяет Project tree. При выборе сущности основная часть конфигуратора показывает её problems по фазам. Старый нижний Errors widget удалён; telemetry остаётся в Pulse и других telemetry views.

Один presentation-компонент `EntityProblemsPanel` используется и в глобальной рабочей области, и во вкладках **Диагностика** редакторов сущностей. In an entity editor, the panel receives only a stable `entityRef` and subscribes to `Endge.diagnostics.problems` directly. It does not receive legacy `validationErrors` and does not render raw diagnostics JSON. Workspace may pass its already computed problem selection to the same component, including runtime-only owners without a persisted document.

## Безопасность

Перед записью core redacts attributes, имя которых содержит `authorization`, `cookie`, `credential`, `password`, `secret` или `token`. Producers всё равно должны передавать только минимальный безопасный контекст и не помещать пользовательские payload в `body` или attributes.

`user.id` и `session.id` являются linkable identifiers. Loki adapter не должен превращать их в labels с высокой cardinality; их следует хранить как structured metadata. Для внешнего контура, где raw subject запрещён, adapter должен заменить `user.id` на контролируемый `user.hash`.

Для Sentry/Grafana adapters рекомендуется дополнительная allowlist policy, sampling и ограничение размера batch. Core redaction — обязательная нижняя граница, а не полная data governance policy внешней системы.

## Миграция с `EndgeDebug`

| Было | Стало |
| --- | --- |
| `Endge.debug` | `Endge.diagnostics` |
| `REntity.validationErrors` | `Endge.diagnostics.problems` |
| debug-specific record tree в core | независимые `log`/`span` records |
| trace/span start/end events | один completed span |
| debug exporter | `DiagnosticsAdapter` + route |
| UI types в core journal | presentation tree в configurator |
| неограниченная история | bounded session storage |

Новые producers должны использовать `info()`/`warn()`/`error()`, `recordException()` или `startSpan()`. Возвращать alias `Endge.debug` для совместимости не нужно: это сохранило бы две публичные точки входа и продлило бы архитектурную двойственность.
