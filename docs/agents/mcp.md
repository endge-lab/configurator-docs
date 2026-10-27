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
| `endge_commit_plan` | все | план коммита |
| `endge_create_document` | `write` | создание документа |
| `endge_update_document` | `write` | изменение; `revision` обязателен |
| `endge_restore_document` | `write` | восстановление удалённого документа |
| `endge_delete_document` | `write` + `delete` | удаление (аннотация `destructive`) |
| `endge_commit` | `write` + `commit`, владелец Admin | коммит |

`collection` — одна из коллекций документного API. Тело документа в `endge_create_document` и `endge_update_document`, а также параметры `endge_commit` проверяются тем же DTO, что REST: неизвестные поля отклоняются, ошибка — `validation_error` с `details.fields`. Токен с флагом `commit` не видит `endge_commit`, если его владелец не Admin workspace. JWT-сессия видит `endge_commit`, только если пользователь Platform Admin или Admin хотя бы одного workspace; коммит в workspace без роли Admin use case отклоняет с `workspace_admin_required`.

Ошибка инструмента — результат с `isError: true` и JSON `{ error, status, message, details?, hint? }`, где `error` — код backend. Непредвиденный сбой возвращается как `internal_error` без подробностей.

## Документация как ресурсы

Если задана переменная `AGENT_DOCS_URL` (абсолютный http(s) URL этого сайта документации), сервер публикует четыре ресурса-ссылки: `llms.txt`, `llms-full/agents.txt`, `llms-full/reference.txt`, `llms-full/api.txt`. Чтение ресурса возвращает название, назначение и ссылку — backend не скачивает документацию. Те же ссылки есть в инструкциях сервера и в `endge_status`.

## Пакет `@endge/mcp`

Отдельный Node-пакет `@endge/mcp` запускается рядом с агентом и ходит в HTTP API backend. Он умеет входить через device flow (`ENDGE_OIDC_ISSUER`, `ENDGE_OIDC_CLIENT_ID`) и даёт `endge_api_request` для произвольных операций. Переменные: `ENDGE_URL`, `ENDGE_WORKSPACE`, `ENDGE_TOKEN`, `ENDGE_MCP_READ_ONLY`. Пакет пока не опубликован в npm. Если backend доступен по сети, проще подключить встроенный `/mcp`.
