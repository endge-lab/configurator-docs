---
description: "Три сквозных сценария с запросами и ответами: Query и Component с коммитом, конфликт ревизии и откат, тенанты через фасет и contextSwitch."
---

# Сквозные сценарии

Три сценария показывают полную последовательность запросов агента: что отправить, какой ответ ждать и что делать при ошибке. Каждый шаг выполнен на Service Backend 0.16.1 с персональным токеном `write` и флагом `commit`; ответы ниже — из этого прогона, сокращены до важных полей (`…`), идентификаторы заменены. Данные условные.

Общие переменные:

```bash
ENDGE_URL=http://localhost:8080          # адрес Service Backend, с HTTP_BASE_PATH, если он задан
TOKEN=endge_pat_…                        # персональный токен от пользователя
WS=demo                                  # identity workspace (у токена — его workspace)
H=(-H "Authorization: Bearer $TOKEN" -H "X-Endge-Workspace: $WS")
```

`If-Match` и `ETag` содержат revision документа в кавычках: `"3"`. Коды ошибок и действия по ним — в [справочнике ошибок](/agents/errors), правила повторов — в разделе [Лимиты, повторы и идемпотентность](/agents/#limits).

## А. Создать Query и Component и закоммитить {#create-and-commit}

### 1. Проверить сервер и права

```bash
curl -s "$ENDGE_URL/version"
# 200 {"service":"service_backend","version":"0.16.1","workspaceSchemaVersion":10,…}

curl -s "$ENDGE_URL/api/session/me" -H "Authorization: Bearer $TOKEN"
# 200 {"platformAdmin":false,"accessManagement":{"mode":"local"},
#      "workspaces":[{"identity":"demo","role":"editor",…}],…}
```

Версия нужна, чтобы при расхождении сверяться с исходниками этой версии ([правило](/agents/repositories#source-of-truth)). С персональным токеном `session/me` показывает только workspace токена и роль, суженную токеном: `write` даёт не больше `editor`. Коммит токеном разрешает флаг `commit` при роли владельца Admin, поэтому роль `editor` в ответе ему не мешает.

### 2. Прочитать состояние workspace

```bash
curl -s "$ENDGE_URL/api/v1/domain/status" "${H[@]}"
# 200 {"workspace":"demo","state":"clean","pendingRevisionCount":0,
#      "commitId":"…","commitMessage":"Initial workspace state",…}

curl -s "$ENDGE_URL/api/v1/queries?limit=100&offset=0" "${H[@]}"
# 200 {"items":[],"limit":100,"offset":0,"total":0}
```

`state: clean` — нет незафиксированных изменений. Если `dirty`, в workspace уже есть чужие или прежние правки: они войдут в тот же коммит. Сообщите об этом пользователю до коммита.

### 3. Создать Query

```bash
curl -s -i -X POST "$ENDGE_URL/api/v1/queries" "${H[@]}" -H "Content-Type: application/json" -d @- <<'JSON'
{
  "identity": "orders",
  "displayName": "Заказы",
  "sourceVersion": 2,
  "source": "defineQuery({\n  kind: 'rest',\n  request: { endpoint: 'https://api.example.com', path: '/orders', method: 'GET' },\n  outputs: { raw: output().from(response('items')) },\n})\n"
}
JSON
# 201, ETag: "1"
# {"id":"…","identity":"orders","displayName":"Заказы","revision":1,"sourceVersion":2,
#  "folderIdentity":"root-queries",…}
```

Повтор того же запроса:

```text
409 {"code":"identity_conflict","message":"Identity already exists"}
```

`409 identity_conflict` после сетевого сбоя означает, что первый запрос прошёл: прочитайте `GET /api/v1/queries/orders` и продолжайте с ним, а не создавайте документ под другим identity.

### 4. Создать Component

У Component номер формата — `modelVersion`, а не `sourceVersion`. Ошибки, которые вернул сервер на неверное тело:

```text
# "sourceVersion": 1 вместо modelVersion
400 {"code":"validation_error","message":"Некорректное тело запроса",
     "details":{"reason":"json: unknown field \"sourceVersion\""}}

# без modelVersion
400 {"code":"validation_error","message":"Некорректные поля запроса",
     "details":{"fields":{"modelVersion":"required field"}}}
```

Правильный запрос:

```bash
curl -s -i -X POST "$ENDGE_URL/api/v1/components" "${H[@]}" -H "Content-Type: application/json" -d @- <<'JSON'
{
  "identity": "orders-title",
  "displayName": "Заголовок заказов",
  "modelVersion": 1,
  "source": "<script setup lang=\"ts\">\ndefineProps<{\n  title: string\n}>()\n</script>\n\n<template>\n  <Text>{{ props.title }}</Text>\n</template>\n"
}
JSON
# 201, ETag: "1"
```

### 5. Проверить

```bash
curl -s -i "$ENDGE_URL/api/v1/components/orders-title" "${H[@]}"
# 200, ETag: "1" — тело совпадает с отправленным

curl -s "$ENDGE_URL/api/v1/domain/status" "${H[@]}"
# 200 {"state":"dirty","pendingRevisionCount":2,…}
```

Сервер хранит `source` как текст и **не компилирует** его: синтаксическую ошибку он примет. Проверьте Source до записи по справочнику типа, а после записи — одним из способов:

- попросите пользователя открыть документ в Configurator: редактор покажет диагностику компилятора;
- если у агента есть Node.js, скомпилируйте Source опубликованным пакетом `@endge/core` (метод `Endge.source.compile`, [контракт](/reference/contracts/core/source)). Пример — в [сценарии В](#check-tenants). Компилятор Component SFC в этот метод не входит: Component проверяйте в Configurator.

### 6. Закоммитить

Коммит виден всем участникам workspace — выполняйте его только по просьбе пользователя.

```bash
curl -s -X POST "$ENDGE_URL/api/v1/commits/plan" "${H[@]}" -H "Content-Type: application/json" -d '{}'
# 200 {"baseSequence":21,"headSequence":23,"revisionCount":2,"documentCount":2,
#      "contributors":[{"username":"…"}],"shared":false}

curl -s -X POST "$ENDGE_URL/api/v1/commits" "${H[@]}" -H "Content-Type: application/json" \
  -d '{"message":"Заказы: Query и компонент","expectedHeadSequence":23,"revisionPolicy":"preserve"}'
# 201 {"id":"<commit-id>","baseSequence":21,"headSequence":23,"message":"Заказы: Query и компонент",
#      "changes":[{"documentType":"components","documentIdentity":"orders-title","operation":"create",…},
#                 {"documentType":"queries","documentIdentity":"orders","operation":"create",…}],…}
```

Ошибки на этом шаге:

| Ответ | Причина | Что делать |
| --- | --- | --- |
| `409 head_sequence_conflict` | После плана в workspace появились новые revisions | Запросите план заново, покажите пользователю новый состав, повторите с новым `headSequence` |
| `409 nothing_to_commit` | Нечего фиксировать; так же отвечает повтор уже выполненного коммита | Проверьте `GET /api/v1/domain/status`: `state: clean` значит, что коммит уже есть |
| `403 access_token_commit_forbidden` | У токена нет флага `commit` | Покажите пользователю план и попросите закоммитить в Configurator |

`shared: true` в плане означает, что в коммит попадут правки других участников (`contributors`). `revisionPolicy: "squash"` для такого коммита требует роли Admin (`shared_squash_requires_admin`).

### 7. Убедиться в результате

```bash
curl -s "$ENDGE_URL/api/v1/domain/status" "${H[@]}"
# 200 {"state":"clean","commitId":"<commit-id>","commitMessage":"Заказы: Query и компонент",…}

curl -s "$ENDGE_URL/api/v1/commits/<commit-id>/diff" "${H[@]}"
# 200 {"id":"<commit-id>","changes":[…],…}
```

## Б. Конфликт ревизии, история и откат {#conflict-history-restore}

### 1. Прочитать документ

```bash
curl -s -i "$ENDGE_URL/api/v1/queries/orders" "${H[@]}"
# 200, ETag: "1", {"revision":1,"displayName":"Заказы",…}
```

Запомните `ETag`: это revision, от которой агент строит изменение.

### 2. Изменение без `If-Match`

```bash
curl -s -X PATCH "$ENDGE_URL/api/v1/queries/orders" "${H[@]}" \
  -H "Content-Type: application/json" -d '{"displayName":"Заказы клиентов"}'
# 428 {"code":"precondition_required","message":"If-Match header is required"}
```

### 3. Конфликт

Пока агент готовил правку, другой участник изменил документ: revision стала `2` (`description` = «Список заказов из внешнего API»). Правка агента с прочитанной revision:

```bash
curl -s -X PATCH "$ENDGE_URL/api/v1/queries/orders" "${H[@]}" -H 'If-Match: "1"' \
  -H "Content-Type: application/json" -d '{"displayName":"Заказы клиентов"}'
# 409 {"code":"revision_conflict","message":"Document revision does not match If-Match"}
```

### 4. Разрешить конфликт

Не повторяйте запрос с тем же `If-Match`. Перечитайте документ, проверьте, что чужая правка не противоречит вашей, и примените изменение к новой версии:

```bash
curl -s -i "$ENDGE_URL/api/v1/queries/orders" "${H[@]}"
# 200, ETag: "2", {"revision":2,"displayName":"Заказы","description":"Список заказов из внешнего API",…}

curl -s -i -X PATCH "$ENDGE_URL/api/v1/queries/orders" "${H[@]}" -H 'If-Match: "2"' \
  -H "Content-Type: application/json" -d '{"displayName":"Заказы клиентов"}'
# 200, ETag: "3", {"revision":3,"displayName":"Заказы клиентов","description":"Список заказов из внешнего API",…}
```

`PATCH` меняет только переданные поля, поэтому чужое `description` сохранилось. Если правки затрагивают одно поле (например, `source`), объедините их сами или спросите пользователя. Повтор того же `PATCH` с `If-Match: "2"` после успеха вернёт `409 revision_conflict`: перечитайте документ и убедитесь, что правка уже есть.

### 5. Посмотреть историю

```bash
curl -s "$ENDGE_URL/api/v1/domain/documents/queries/orders/revisions?snapshot=false&limit=20&offset=0" "${H[@]}"
# 200 {"total":3,"limit":20,"offset":0,"items":[
#   {"id":"<rev-3>","revisionNumber":3,"operation":"update","accessTokenName":"Агент: сценарии",…},
#   {"id":"<rev-2>","revisionNumber":2,"operation":"update",…},
#   {"id":"<rev-1>","revisionNumber":1,"operation":"create","committedInCommitId":"<commit-id>",…}]}

curl -s "$ENDGE_URL/api/v1/domain/documents/queries/orders/revisions/<rev-1>" "${H[@]}"
# 200 {"revisionNumber":1,"snapshot":{"identity":"orders","data":{"source":"defineQuery({…","sourceVersion":2},…},…}
```

Новые revisions идут первыми. `accessTokenId` и `accessTokenName` есть у правок, сделанных персональным токеном; `committedInCommitId` — у зафиксированных. Без `limit` сервер вернёт всю историю: для длинной истории передавайте `limit` (до 500).

### 6. Откатить к revision 1

Откат создаёт **новую** revision с содержимым выбранной; история не переписывается. Нужен `If-Match` с текущей revision документа:

```bash
curl -s -X POST "$ENDGE_URL/api/v1/domain/documents/queries/orders/revisions/<rev-1>/restore" "${H[@]}" -H 'If-Match: "2"'
# 409 {"code":"revision_conflict",…}  — "2" уже устарела

curl -s -i -X POST "$ENDGE_URL/api/v1/domain/documents/queries/orders/revisions/<rev-1>/restore" "${H[@]}" -H 'If-Match: "3"'
# 200, ETag: "4", {"revision":4,"displayName":"Заказы","description":null,…}
```

Проверка: `GET /api/v1/queries/orders` возвращает `ETag: "4"` и содержимое revision 1. `POST /api/v1/commits/plan` показывает `revisionCount: 3, documentCount: 1` — правки и откат ждут коммита ([сценарий А, шаг 6](#create-and-commit)).

## В. Тенанты: фасет и `contextSwitch` {#tenants}

Тенант — документ фасета `tenant`. Query выбирает путь запроса по выбранному тенанту ([Выбор тенанта](/configurator/tenant-selection), [`contextSwitch`](/reference/value-expressions#контекст-сборки)).

### 1. Создать фасет и документы фасета

```bash
curl -s -X POST "$ENDGE_URL/api/v1/facets" "${H[@]}" -H "Content-Type: application/json" \
  -d '{"identity":"tenant","displayName":"Тенант","icon":"Building2","color":"#2563eb"}'
# 201, ETag: "1", {"identity":"tenant","revision":1,"documentCount":0,…}

curl -s -X POST "$ENDGE_URL/api/v1/facets/tenant/documents" "${H[@]}" -H "Content-Type: application/json" \
  -d '{"identity":"tenant-a","displayName":"Тенант A"}'
# 201, ETag: "1"

curl -s -X POST "$ENDGE_URL/api/v1/facets/tenant/documents" "${H[@]}" -H "Content-Type: application/json" \
  -d '{"identity":"tenant-b","displayName":"Тенант B"}'
# 201, ETag: "1"; повтор — 409 identity_conflict

curl -s "$ENDGE_URL/api/v1/facets/tenant/documents" "${H[@]}"
# 200 {"items":[{"identity":"tenant-a",…},{"identity":"tenant-b",…}],…}
```

`icon`, `color`, `identity` и `displayName` фасета обязательны.

### 2. Использовать тенант в Query

```ts
defineQuery({
  kind: 'rest',
  request: {
    endpoint: 'https://api.example.com',
    path: contextSwitch({
      default: '/orders',
      cases: [{ when: { tenant: 'tenant-b' }, use: '/v2/orders' }],
    }),
    method: 'GET',
    headers: { 'X-Tenant': facet('tenant') },
  },
  outputs: { raw: output().from(response('items')) },
})
```

```bash
curl -s -i "$ENDGE_URL/api/v1/queries/orders" "${H[@]}"        # ETag: "4"
curl -s -i -X PATCH "$ENDGE_URL/api/v1/queries/orders" "${H[@]}" -H 'If-Match: "4"' \
  -H "Content-Type: application/json" -d @patch.json             # {"source":"defineQuery({…})"}
# 200, ETag: "5", {"revision":5,"source":"defineQuery({\n  kind: 'rest',\n  request: {\n    …contextSwitch(…"}
```

### 3. Проверить результат {#check-tenants}

Сервер подтверждает только сохранение:

```bash
curl -s "$ENDGE_URL/api/v1/domain" "${H[@]}"
# 200, ETag: "<generation>:<headSequence>"
# documents.facets: [{"identity":"tenant","documentCount":2,…}]
# documents.facet-documents: [{"facetIdentity":"tenant","identity":"tenant-a",…},{…"tenant-b"…}]
# documents.queries: [{"identity":"orders","source":"defineQuery({… contextSwitch(…","state":{"revision":5,…}}]
```

Выбор ветки происходит при сборке, на стороне Configurator и runtime. Проверить его можно так:

- **Компиляцией `@endge/core`** (Node.js, пакет из npm той же версии, что у пользователя):

  ```js
  import { readFileSync } from 'node:fs'
  import { Endge } from '@endge/core'

  const source = readFileSync('orders.query.ts', 'utf8')
  for (const tenant of ['tenant-a', 'tenant-b']) {
    const result = Endge.source.compile('query', source, {
      sourceVersion: 2,
      sourceContext: { facets: { tenant }, config: {}, knownFacets: ['tenant'] },
    })
    console.log(tenant, result.ok, result.artifact?.query?.value,
      result.artifact?.headers?.properties?.['X-Tenant']?.value, result.diagnostics.map(d => d.code))
  }
  ```

  Результат прогона с `@endge/core` 1.0.0-dev.11:

  ```text
  tenant-a true /orders tenant-a []
  tenant-b true /v2/orders tenant-b []
  ```

  Без `sourceContext` компилятор возвращает ветку `default` и диагностику `info:source-expression-context-unbound`. Ошибка в любой ветке даёт `ok: false` и `error:…` в `diagnostics`, например `source-expression-read-path` для `response(items)` без кавычек.

- **В Configurator**: пользователь переключает тенант в шапке, редактор Query показывает выбранную ветку `contextSwitch`.

Коммит фасета и Query выполняется как в [сценарии А](#create-and-commit). Конфигурацию тенанта (`configuration` документа фасета) меняет `PATCH /api/v1/facets/tenant/documents/{documentIdentity}` с `If-Match`.
