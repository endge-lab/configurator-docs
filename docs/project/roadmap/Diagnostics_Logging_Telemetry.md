# Развитие диагностики, логирования и телеметрии

Базовая архитектура единого observability-модуля реализована. Текущий контракт, методы, configuration и migration описаны в разделе [«Диагностика и отладка»](../../core/diagnostics-and-debugging.md).

## Реализованная основа

- одна публичная точка входа `Endge.diagnostics`;
- OTel-aligned records двух типов: `log` и completed `span`;
- ERROR/FATAL exceptions как structured logs с `exception.*` attributes;
- W3C-compatible `traceId`, `spanId`, `parentSpanId` и `traceFlags`;
- bounded in-memory storage текущей session;
- filters, subscriptions, counters и snapshots;
- декларативные routes и runtime `DiagnosticsAdapter` registry;
- configuration cascade `Workspace → Tenant → Project → Environment`;
- compiler spans и configurator presentation layer;
- удаление старого отдельного debug journal.

## Следующие этапы

### 1. Console adapter

Добавить небольшой встроенный adapter с читаемым browser/Node console output. Он должен форматировать logs и completed spans, но не менять core record format.

### 2. Integration adapters

Реализовывать adapters отдельными packages или integrations:

- Sentry — exceptions, ERROR/FATAL events и tracing context;
- OTLP — универсальная доставка logs и spans в OpenTelemetry Collector;
- Loki/Tempo — обычно через OTLP или специализированный backend gateway.

Credentials должны оставаться в защищённой integration configuration. Diagnostics route хранит только `adapterId` и optional `integrationId`.

### 3. Configurator editor

Добавить UI для collection policy и routes. Сначала достаточно контролов для:

- включения signals;
- severity threshold;
- bounded capacity;
- выбора adapter/integration;
- фильтра по scope, event name и attributes.

Core configuration уже поддерживает эти поля, поэтому UI не требует изменения runtime contract.

### 4. Дополнительные producers

Подключать spans только к операциям, для которых duration и correlation реально полезны: query execution, action flow, remote request и renderer boundary. Обычные факты должны оставаться logs, чтобы не создавать лишние spans.

### 5. Metrics

Metrics пока не входят в API. Перед добавлением нужны реальные use cases, aggregation model, cardinality limits и export contract. Metrics следует добавить отдельным signal, а не кодировать через log attributes или псевдо-measurement events.

### 6. Production policies

До массового production export нужны:

- sampling для traces;
- batch и retry policy внутри adapters;
- limits на размер body и attributes;
- allowlist/redaction поверх обязательной core redaction;
- monitoring adapter failures и dropped records.

## Архитектурное правило

Новые backend formats не добавляются в core как `SentryRecord`, `GrafanaRecord` или `LokiRecord`. Core сохраняет универсальный diagnostics contract; transport-specific mapping принадлежит adapter-у.
