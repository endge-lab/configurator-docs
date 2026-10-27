---
description: "MCP-сервер Service Backend: подключение по Streamable HTTP с Bearer-токеном, порядок работы, инструменты endge_* (документы, фасеты, откат, коммиты), поле версии формата, ресурсы документации и пакет @endge/mcp."
---

# MCP-сервер backend

Service Backend сам является MCP-сервером: endpoint `{HTTP_BASE_PATH}/mcp` на том же порту, что HTTP API. Транспорт — Streamable HTTP. Сервер принимает [персональные токены](/agents/tokens) и Bearer JWT; инструменты вызывают те же use case, что REST, поэтому права, проверки и пометка правок агента совпадают.

## Подключение

Claude Code с токеном из кнопки «Для агента» Configurator:

```bash
claude mcp add --transport http endge https://endge.example.com/endge/mcp \
  --header "Authorization: Bearer endge_pat_…"
```

Локально адрес — `http://localhost:8080/mcp`, при заданном `HTTP_BASE_PATH` — `http://localhost:8080/<base>/mcp`.

- Claude Desktop и Cursor подключаются через `mcp-remote` с заголовком `Authorization` или через HTTP-транспорт клиента с headers.
- Веб-коннекторы claude.ai передают только URL и OAuth. Произвольный заголовок там не задать, поэтому персональный токен к ним не подключить.

## Устройство

- Сервер stateless: `Mcp-Session-Id` не выдаётся, каждый `POST` обслуживается отдельно, ответы — `application/json` без SSE. Запросы можно распределять по экземплярам backend без привязки. `GET` и `DELETE` отвечают `405`.
- Запросов сервер → клиент (sampling, elicitation) и уведомлений нет.
- Без учётных данных или с неверным токеном — `401` с телом `AuthMiddleware` (`unauthorized`, `access_token_invalid`, `access_token_revoked`, `access_token_expired`) и заголовком `WWW-Authenticate: Bearer realm="endge"`.
- Workspace: для токена — workspace токена, параметр `workspace` можно не передавать (другой — `access_token_workspace_forbidden`). Для JWT параметр обязателен (`workspace_required`).

## Порядок работы

1. Прочитайте ресурс `llms-agent` (`<AGENT_DOCS_URL>/llms-agent.txt`) — ядро документации: правила, коды ошибок, авторинг Source и список всех операций. Инструкции сервера (`initialize`) начинаются с этого шага. Ядро длиннее одного ответа ресурса и приходит [частями](#чтение-по-частям): прочитайте все части по порядку.
2. `endge_status` → `endge_list_workspaces` → чтение: `endge_get_workspace`, `endge_list_documents`, `endge_get_document`. Перед созданием документа прочитайте похожий документ той же коллекции, проверенное тело в ресурсе `agents/document-examples.md` и часть справочника `llms-full/reference/{type}.txt`.
   Для сложной задачи со связями (несколько Composition, Store и Update, компоненты с портами, различия тенантов) прочитайте ресурс `agents/vertical-slice.md`: порядок создания, выбор документа и коды ошибок каждой связи.
3. Изменение: `endge_create_document`, `endge_update_document`, откат `endge_restore_revision`. Каждый вызов с `revision` проверяет текущую ревизию; при `revision_conflict` перечитайте документ.
4. `endge_commit_plan` — покажите пользователю документы плана, особенно чужие правки. `endge_commit` — только по его просьбе.

## Инструменты

Набор зависит от прав запроса. Read-токен не видит изменяющих инструментов, а вызов скрытого инструмента по имени — ошибка протокола `unknown tool`.

| Инструмент | Права | Назначение |
| --- | --- | --- |
| `endge_status` | все | состояние сервера и ссылки на документацию |
| `endge_list_workspaces` | все | доступные workspace; токен видит только свой |
| `endge_list_documents` | все | документы коллекции: `withSource`, `limit` 1–500 (по умолчанию 100), `offset`, `folderIdentity`, `includeDeleted` |
| `endge_get_document` | все | документ коллекции |
| `endge_get_workspace` | все | сводка workspace по коллекциям или полный снимок (`full=true`) |
| `endge_document_revisions` | все | история документа: `limit` (20), `offset`, `withSnapshot` |
| `endge_get_revision` | все | одна ревизия со снимком документа (`revisionId`) |
| `endge_commit_plan` | все | план коммита с перечнем документов |
| `endge_list_commits` | все | история коммитов от новых к старым: `limit` (20), `offset` |
| `endge_get_commit` | все | коммит и его изменения (diff) |
| `endge_create_document` | `write` | создание документа |
| `endge_update_document` | `write` | изменение; `revision` обязателен |
| `endge_restore_document` | `write` | восстановление удалённого документа |
| `endge_restore_revision` | `write` | откат документа к прошлой ревизии |
| `endge_delete_document` | `write` + `delete` | удаление (аннотация `destructive`) |
| `endge_commit` | `write` + `commit`, владелец Admin | коммит |

`collection` — коллекция документного API, `facets` (фасеты) или `facet-documents` (документы фасета, например тенанты). Персональному токену инструменты изменения не предлагают `auth-profiles`: см. [профили авторизации](#профили-авторизации). Тело документа в `endge_create_document` и `endge_update_document`, а также параметры `endge_commit` проверяются тем же DTO, что REST: неизвестные поля отклоняются, ошибка — `validation_error` с `details.fields` или `details.reason`. Токен с флагом `commit` не видит `endge_commit`, если его владелец не Admin workspace. JWT-сессия видит `endge_commit`, только если пользователь Platform Admin или Admin хотя бы одного workspace; коммит в workspace без роли Admin use case отклоняет с `workspace_admin_required`.

Ошибка инструмента — результат с `isError: true` и JSON `{ error, status, message, details?, hint? }`, где `error` — код backend: смысл и действие для каждого кода — в [справочнике ошибок](/agents/errors). Непредвиденный сбой возвращается как `internal_error` без подробностей. Ошибки протокола JSON-RPC (неизвестный инструмент, неверные параметры) приходят в поле `error` ответа JSON-RPC, а не результатом инструмента.

Тело запроса `/mcp` — до 4 МиБ (больше — `413` текстом). Сервер не хранит сессий: повтор вызова — это новый вызов, поэтому изменяющие инструменты повторяйте по правилам [повторов](/agents/#limits).

### Поле версии формата

Версия формата `source` называется по-разному: у `components` — `modelVersion`, у остальных коллекций с Source — `sourceVersion`. Значение — **текущая версия языка Source**, а не ревизия документа: её пишет Configurator при создании документа и принимает компилятор. Чужое поле отклоняется как неизвестное (`validation_error`), а подсказка `hint` ошибки называет поле и его значение. Описание `endge_create_document` строится из DTO `CreateRequest` и перечисляет для каждой коллекции текущее значение и другие обязательные поля, например `- computations: sourceVersion=1 (обязательно); ещё обязательно: contractVersion=1`:

| Коллекции | Поле и значение | Ещё обязательно |
| --- | --- | --- |
| `queries` | `sourceVersion: 2`, другое значение — ошибка | — |
| `simulations`, `configurations` | `sourceVersion: 1`, другое значение — ошибка | — |
| `vocabs`, `filters` | `sourceVersion: 1` вместе с `source` | — |
| `types`, `data-views`, `compositions`, `stores`, `streams`, `styles`, `actions` | `sourceVersion: 1` | — |
| `updates` | `sourceVersion: 1` | `storeIdentity` |
| `computations` | `sourceVersion: 1` | `contractVersion: 1` |
| `components` | `modelVersion: 1` (не `sourceVersion`) | — |
| `auth-profiles` | поля версии нет | `adapterId`; только пользователь с ролью Admin |
| `folders`, `mocks`, `converters`, `i18n-bundles`, `navigations`, `facets`, `facet-documents` | поля версии нет | — |

Сервер у части коллекций принимает и другое положительное число, но компилятор и Configurator знают только эти версии: передавайте ровно их. В `endge_update_document` поле версии передаётся вместе с новым `source`. Проверенные тела всех коллекций — [примеры документов](/agents/document-examples).

### Профили авторизации

`auth-profiles` создаёт, меняет и удаляет только пользователь с ролью Admin workspace. Персональному токену эти операции недоступны при любых флагах (`403 access_token_admin_forbidden`), поэтому инструменты изменения не перечисляют `auth-profiles` в `collection` для токена. Читать профили токен может.

Что делать агенту, которому нужен профиль:

- если запрос использует ту же авторизацию, что приложение, укажите в Query и Stream `auth: { mode: 'inherit' }` — профиль не нужен;
- если нужен отдельный профиль, попросите пользователя создать его в Configurator: назовите `identity`, `adapterId`, `config` и имена переменных workspace для секретов (например, `{EXAMPLE_API_TOKEN}`). После этого сошлитесь на него: `auth: { mode: 'profile', profile: '<identity>' }`. Компилятор Query ссылку на несуществующий профиль не проверяет (инструмент оценки выдаёт только предупреждение `grader-dangling-reference`), и она проявится лишь при выполнении запроса, поэтому до создания профиля оставьте `inherit`.

### Фасеты и документы фасетов

Фасеты — те же инструменты документов с `collection: "facets"`; документы фасета — `collection: "facet-documents"` и обязательный `facetIdentity` (без него — `facet_identity_required`). Вызовы идут в use case REST `/api/v1/facets` и проверяются его DTO:

- фасет: `identity`, `displayName`, `icon` (PascalCase-имя иконки, например `MapPin`), `color` (`#rrggbb`), `meta`;
- документ фасета: `identity`, `displayName`, `description`, `configuration`, `meta`, `active`. `configuration` — вклад в конфигурацию, обязателен: `{ "mode": "inherit", "patch": {…} }` (дополнить общую) или `{ "mode": "replace", "value": {…} }` (заменить); иначе `facet_configuration_invalid`.

```json
{ "name": "endge_create_document", "arguments": {
  "collection": "facet-documents", "facetIdentity": "tenant",
  "document": { "identity": "tenant-c", "displayName": "Тенант C",
                "configuration": { "mode": "inherit", "patch": {} } } } }
```

История, откат, удаление и восстановление фасетов работают так же, как у документов. Порядок фасетов (`POST /api/v1/facets/reorder`) меняется только через HTTP API.

### Откат к ревизии

`endge_document_revisions` даёт `id` ревизий, `endge_get_revision` — снимок документа после выбранной ревизии. `endge_restore_revision` с `revisionId` и текущей `revision` документа делает то же, что `POST /api/v1/domain/documents/{type}/{identity}/revisions/{revisionId}/restore` с `If-Match`: содержимое берётся из снимка, создаётся новая ревизия, история не переписывается. Удалённый документ возвращает `endge_restore_document`.

### Коммиты и план

`endge_commit_plan` возвращает счётчики (`revisionCount`, `documentCount`), участников, `headSequence` для `endge_commit` и `documents` — документы с ревизиями, ожидающими коммита:

```json
{ "collection": "queries", "identity": "orders", "displayName": "Заказы",
  "revisionCount": 2, "operations": ["create", "update"],
  "authors": [{ "id": "…", "username": "anna" }],
  "accessTokens": [{ "id": "…", "name": "Codex: заказы" }] }
```

`accessTokens` есть, если документ меняли персональным токеном. REST `POST /api/v1/commits/plan` документы не перечисляет.

`endge_list_commits` — коммиты без изменений, `total` — все коммиты workspace. `endge_get_commit` — как `GET /api/v1/commits/{id}/diff`: `changes` с коллекцией, identity, операцией и `beforeRevisionId`/`afterRevisionId`; содержимое версий читает `endge_get_revision`.

## Документация как ресурсы

Если задана переменная `AGENT_DOCS_URL` (абсолютный http(s) URL этого сайта документации), `resources/read` возвращает **текст** файлов документации: backend сам получает файл по этому адресу. Ресурсы в порядке чтения:

| Ресурс | Файл | Содержимое |
| --- | --- | --- |
| `llms-agent` | `llms-agent.txt` | ядро для агента — **читать первым** |
| `llms` | `llms.txt` | оглавление всех страниц |
| `agents-guide` | `agents/index.md` | руководство агента |
| `agents-mcp` | `agents/mcp.md` | эта страница |
| `agents-errors` | `agents/errors.md` | коды ошибок |
| `agents-scenarios` | `agents/scenarios.md` | сквозные сценарии |
| `llms-manifest` | `llms-manifest.json` | состав выгрузки: группы API и части справочника |

Шаблоны ресурсов (`resources/templates/list`), URI — `<AGENT_DOCS_URL>/…`:

| Шаблон | Пример | Содержимое |
| --- | --- | --- |
| `llms-full/api/{group}.txt` | `llms-full/api/facets.txt` | операции группы API со схемами тел |
| `llms-full/reference/{+type}.txt` | `llms-full/reference/query.txt` | Source одного типа документа |
| `llms-full/{section}.txt` | `llms-full/guides.txt` | раздел сайта целиком |
| `{+path}.md` | `agents/tokens.md` | любая страница в Markdown |

Правила чтения:

- запрос уходит только под префикс `AGENT_DOCS_URL`; разрешены файлы `.md`, `.txt` и `llms-manifest.json`, путь из латиницы, цифр, `.`, `_`, `-`, `/` без `..`; перенаправление за пределы префикса отклоняется;
- таймаут — 10 с, файл больше 2 МиБ обрезается по границе строки с пометкой, где читать продолжение (например, `llms-full.txt` целиком не помещается — читайте части);
- ответ `resources/read` не длиннее ≈60 тыс. символов, длинный файл отдаётся [частями](#чтение-по-частям);
- файл кешируется в памяти backend на 10 минут;
- несуществующий файл — ошибка JSON-RPC `Resource not found`; сбой сети или ответ не `200` — ошибка с адресом файла: откройте ссылку напрямую или повторите позже.

Адрес должен быть доступен из backend. Без `AGENT_DOCS_URL` ресурсов нет. Те же ссылки есть в инструкциях сервера и в `endge_status`.

### Чтение по частям

MCP-клиенты ограничивают размер ответа инструмента (Claude Code — около 25 тыс. токенов), поэтому backend не отдаёт больше ≈60 тыс. символов за один `resources/read`. Длинный файл, например ядро `llms-agent.txt`, делится на части по заголовкам Markdown (не посреди строки и не внутри блока кода):

- адрес без параметра возвращает первую часть, `<адрес>?part=N` — часть `N` (с 1);
- первая строка части — `[Часть N из M: <адрес>. Следующая: <адрес>?part=N+1]`, последняя строка — `[Конец части N из M. Продолжение: …]`; у последней части — `Это последняя часть`;
- короткий файл приходит целиком, без заголовка; `?part=1` для него тоже допустим;
- номер вне диапазона — ошибка с допустимым диапазоном; другие параметры адреса не принимаются.

Части доступны всем ресурсам и шаблонам выше: в `resources/templates/list` это шаблон `{+resource}{?part}` («Часть длинного ресурса»). Файлы вне списка и шаблонов (например, `llms-full.txt`) не читаются и по частям.

## Пакет `@endge/mcp`

Отдельный Node-пакет `@endge/mcp` запускается рядом с агентом и ходит в HTTP API backend. Он умеет входить через device flow (`ENDGE_OIDC_ISSUER`, `ENDGE_OIDC_CLIENT_ID`) и даёт `endge_api_request` для произвольных операций. Переменные: `ENDGE_URL`, `ENDGE_WORKSPACE`, `ENDGE_TOKEN`, `ENDGE_MCP_READ_ONLY`. Пакет пока не опубликован в npm. Если backend доступен по сети, проще подключить встроенный `/mcp`.
