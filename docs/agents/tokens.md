---
description: "Персональный токен endge_pat_… для агента: доступ к одному workspace, права read/write и флаги commit/delete, срок, ограничения, API выпуска и ошибки."
---

# Персональные токены

Персональный токен (`endge_pat_…`) даёт агенту доступ к одному workspace от имени пользователя. Это проще входа через OIDC: пользователь выпускает токен в Configurator кнопкой «Для агента» ([как это выглядит](/configurator/agent-access)) и передаёт агенту готовый промпт. Агент отправляет токен в заголовке:

```http
Authorization: Bearer endge_pat_…
X-Endge-Workspace: variant-a
```

Тот же токен принимает [MCP-сервер backend](/agents/mcp).

## Свойства токена

| Свойство | Значение |
| --- | --- |
| Владелец | пользователь, выпустивший токен; правки агента записываются от его имени |
| Workspace | ровно один |
| Права | `read` (по умолчанию) или `write`; флаги `commit` и `delete` — только при `write` |
| Срок | обязателен: не раньше чем через минуту и не позже `ACCESS_TOKEN_MAX_TTL` backend (по умолчанию 30 дней) |
| Хранение | backend хранит только SHA-256 токена и префикс для списка; секрет показывается один раз |

Эффективные права — пересечение роли владельца в workspace и прав токена: `read` даёт не больше Viewer, `write` — не больше Editor. Понижение роли владельца сразу сужает токен. Выпуск токена `write` требует роли Editor и выше.

Коммит токеном (`POST /api/v1/commits`, MCP `endge_commit`) возможен, только если у токена есть флаг `commit`, а владелец — Admin этого workspace или Platform Admin. Токен с `commit` может выпустить только такой владелец. Права токена никогда не выше прав человека.

Изменения агента помечаются: ревизия документа получает `accessTokenId` и `accessTokenName`, автором (`createdBy`) остаётся владелец.

## Что токену недоступно

- управление токенами (`/api/v1/access-tokens`) — `403 access_token_management_forbidden`;
- разделы `/api/v1/access-grants`, `/service-users`, `/workspaces` (CRUD и участники), `/ai`, `/backend-connections`, `/integrations`, `/bridge`, `/domain/import`, `/domain/backups`, выгрузка релизов `/releases/{id}/bundle` и `/releases/{id}/export` — `403 access_token_route_forbidden`;
- `DELETE` без флага `delete` — `403 access_token_delete_forbidden`;
- `POST /api/v1/commits`, `/commits/{id}/restore`, `/releases`, `/releases/from-build`, `/releases/{id}/restore` без флага `commit` — `403 access_token_commit_forbidden`; планы `/plan` доступны;
- другой workspace — `403 access_token_workspace_forbidden`;
- создание, изменение, удаление и восстановление профилей авторизации (`/api/v1/auth-profiles`, MCP `collection: "auth-profiles"`) — `403 access_token_admin_forbidden` при любых флагах и любой роли владельца. Чтение профилей доступно.

Если агенту нужен профиль авторизации, он не создаёт его сам: в Query и Stream указывает `auth: { mode: 'inherit' }` (авторизация приложения) или просит пользователя создать профиль в Configurator и затем ссылается на него `auth: { mode: 'profile', profile: '<identity>' }`. Подробнее — [MCP: профили авторизации](/agents/mcp#профили-авторизации).

`GET /api/v1/domain`, `GET /api/v1/domain/export` и `GET /api/session/me` доступны. С токеном `session/me` показывает только workspace токена с суженной ролью.

## API

Маршруты управления работают только в сессии пользователя (cookie или JWT), не токеном.

```http
POST /api/v1/access-tokens
Content-Type: application/json

{
  "workspaceIdentity": "variant-a",
  "name": "Агент: правка запросов",
  "description": "Правка Query и DataView",
  "scope": "write",
  "commit": false,
  "delete": false,
  "expiresAt": "2026-11-02T10:00:00Z"
}
```

Ответ `201` содержит `token` (единственный раз) и `accessToken` — описание без секрета: `id`, `owner`, `workspaceIdentity`, `name`, `scope`, флаги, `tokenPrefix`, `status`, `createdAt`, `expiresAt`.

| Маршрут | Назначение |
| --- | --- |
| `GET /api/v1/access-tokens` | свои токены, включая истёкшие и отозванные, и `maxTtlSeconds`; `?owner=all` — все токены, только Platform Admin |
| `DELETE /api/v1/access-tokens/{id}` | отзыв своего токена или любого для Platform Admin; повторный отзыв — `204` |

Историю правок документа отдаёт `GET /api/v1/domain/documents/{type}/{identity}/revisions`. Параметры `snapshot=false`, `limit` (1–500) и `offset` дают страницу без снимков; `total` — общее число ревизий.

## Ошибки

Коды ниже относятся к токенам. Остальные коды backend с действиями агента — в [справочнике ошибок](/agents/errors).

| Код | HTTP | Когда |
| --- | --- | --- |
| `access_token_invalid` | 401 | неверный формат или неизвестный токен |
| `access_token_revoked` | 401 | токен отозван |
| `access_token_expired` | 401 | срок истёк — нужен новый токен |
| `access_token_workspace_forbidden` | 403 | запрос к другому workspace |
| `access_token_route_forbidden` | 403 | раздел закрыт для токенов |
| `access_token_management_forbidden` | 403 | токеном нельзя управлять токенами |
| `access_token_scope_insufficient` | 403 | изменение read-токеном |
| `access_token_delete_forbidden` | 403 | удаление без флага `delete` |
| `access_token_commit_forbidden` | 403 | коммит или релиз без флага `commit` |
| `access_token_owner_admin_required` | 403 | коммит токеном или выпуск токена с `commit`, когда владелец не Admin |
| `access_token_admin_forbidden` | 403 | операция только для Admin-сессии, например изменение `auth-profiles` |
| `access_token_scope_exceeds_role` | 403 | выпуск `write` при роли Viewer |
| `access_token_expiry_required`, `access_token_expiry_invalid`, `access_token_expiry_too_long` | 400 | срок не задан, раньше чем через минуту или больше предела |
| `access_token_flags_require_write` | 400 | `commit` или `delete` у read-токена |
| `access_token_scope_invalid`, `access_token_name_invalid`, `access_token_description_invalid` | 400 | неверные поля при выпуске |
| `access_token_not_found` | 404 | отзыв чужого или несуществующего токена |
| `user_inactive` | 403 | владелец деактивирован |

Ответы `401` и `403` с кодом `access_token_*` агент не обходит: он сообщает пользователю код и что пытался сделать.

Во внешнем режиме прав (external access) токен использует последний сохранённый снимок прав владельца: изменение у провайдера применяется после следующего входа владельца. Чтобы отключить доступ сразу, отзовите токен или деактивируйте пользователя.
