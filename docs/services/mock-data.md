---
description: "Mock Generator: детерминированные данные по подмножеству JSON Schema 2020-12 и stream sessions через HTTP API backend; ошибки и лимиты."
---

# Mock Data service

Mock Generator создаёт детерминированные данные по поддерживаемому подмножеству JSON Schema Draft 2020-12 и обслуживает временные stream sessions. Configurator и агент обращаются к **Service Backend**, который проверяет пользователя, Workspace и права; напрямую подключать браузер к gRPC generator не требуется.

## Публичная граница

| Операция | Назначение |
| --- | --- |
| `GET /api/v1/mock-data/capabilities` | Эффективные лимиты и доступные возможности |
| `POST /api/v1/mock-data/generate` | Ограниченная генерация JSON по schema и параметрам |
| `/api/v1/mock-data/streams` | Создание и управление временными stream sessions |

Полные request/response DTO, статусы и все операции с session приведены в [HTTP API](/llms-full/api.txt). Не конструируйте body по предполагаемым именам полей. Семантика схемы, relations и mappings ограничена опубликованным контрактом generator: произвольный JSON Schema keyword не гарантирует поддержку.

## Генерация и сохранение

Сначала прочитайте capabilities, затем передайте schema, ограничения объёма и seed согласно DTO. Одинаковые поддерживаемые входы и seed дают воспроизводимые данные в рамках версии generator. Результат генерации не становится документом Mock автоматически: сохранение fixture в Workspace — отдельная авторизованная операция с revision.

[Mock document](/reference/mock) хранит JSON/text fixture либо code-provider reference. Mock Generator является отдельным сервисом: отсутствие generator не запрещает чтение уже сохранённого fixture. Query mock mode и Simulation используют свои explicit bindings; генерация не переключает production data mode.

## Stream lifecycle

Session хранится в памяти generator и принадлежит actor. Она не является долговечным broker topic. Создание, открытие SSE, pause/resume, KeepAlive и закрытие имеют отдельные операции в API. Lease обновляется успешным KeepAlive; data frames и SSE heartbeat не заменяют KeepAlive. Клиент должен закрывать session при завершении preview и не рассчитывать на переживание перезапуска сервиса.

В source defaults ready session истекает через 30 секунд, активная — через 180 секунд после последнего успешного KeepAlive; рекомендуемый интервал KeepAlive около 30 секунд, в том числе при pause. Runtime capabilities и deployment settings имеют приоритет над этими defaults.

## Ошибки и лимиты

Ограничиваются размер запроса/ответа, schema nodes/depth, array/string length, count, concurrency, число sessions и buffered bytes. При unsupported schema, исчерпании лимита, timeout, lease expiry или backpressure обрабатывайте явную ошибку API; не подменяйте её пустым «успешным» набором. Генератор не требует PostgreSQL, Redis или отдельного message broker.

Исходники Mock Generator закрыты: публичного repository нет, gRPC-контракт `api/proto/mockdata/v1/mockdata.proto` не опубликован. Агент работает только через [HTTP API backend](/llms-full/api.txt) (`/api/v1/mock-data/*`); коды ошибок — в [справочнике](/agents/errors#mock).
