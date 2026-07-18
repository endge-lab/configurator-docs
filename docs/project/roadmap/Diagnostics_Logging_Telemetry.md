# Развитие диагностики, логирования и телеметрии

Базовая архитектура единого observability-модуля реализована. Текущий контракт, методы, configuration и migration описаны в разделе [«Диагностика и отладка»](../../core/diagnostics-and-debugging.md).

## Реализованная основа

- одна публичная точка входа `Endge.diagnostics`;
- два независимо подписываемых подмодуля: `telemetry` и `problems`;
- OTel-aligned records двух типов: `log` и completed `span`;
- ERROR/FATAL exceptions как structured logs с `exception.*` attributes;
- W3C-compatible `traceId`, `spanId`, `parentSpanId` и `traceFlags`;
- bounded in-memory storage текущей session;
- filters, subscriptions, counters и JSON-safe manual/automatic snapshots;
- синхронные context providers и автоматические `user.id`/`session.id` из auth context;
- именованные outputs, декларативные routes и runtime `DiagnosticsAdapterFactory` registry;
- встроенный console adapter с pretty/JSON форматами;
- configuration cascade `Workspace → Tenant → Project → Environment`;
- replaceable problem registry с owner/entity/runtime filters;
- compiler publication в problems и correlated build logs;
- удаление `REntity.validationErrors` и configurator Pinia diagnostics mirror;
- compiler spans и first-class `authoring`/`build`/`runtime` phase;
- configuration editor для collection, outputs, routing и snapshots;
- удаление старого отдельного debug journal.

## Следующие этапы

### 1. Integration adapters

Реализовывать adapters отдельными packages или integrations:

- Sentry — exceptions, ERROR/FATAL events и tracing context;
- OTLP — универсальная доставка logs и spans в OpenTelemetry Collector;
- Loki/Tempo — обычно через OTLP или специализированный backend gateway.

Credentials должны оставаться в защищённой integration configuration. Diagnostics output хранит только `adapterType` и JSON-safe options; route ссылается на output по `outputId`.

### 2. Дополнительные producers

Подключать spans только к операциям, для которых duration и correlation реально полезны: query execution, action flow, remote request и renderer boundary. Обычные факты должны оставаться logs, чтобы не создавать лишние spans.

### 3. Metrics

Metrics пока не входят в API. Перед добавлением нужны реальные use cases, aggregation model, cardinality limits и export contract. Metrics следует добавить отдельным signal, а не кодировать через log attributes или псевдо-measurement events.

### 4. Production policies

До массового production export нужны:

- sampling для traces;
- batch и retry policy внутри adapters;
- limits на размер body и attributes;
- allowlist/redaction поверх обязательной core redaction;
- monitoring adapter failures и dropped records.

## Архитектурное правило

Новые backend formats не добавляются в core как `SentryRecord`, `GrafanaRecord` или `LokiRecord`. Core сохраняет универсальный diagnostics contract; transport-specific mapping принадлежит adapter-у.
