---
description: "Все 267 кодов ошибок Service Backend: формат ответа, HTTP-статус, смысл и что делать агенту — исправить, повторить или спросить пользователя."
---

<!-- Сгенерировано scripts/build-error-reference.mjs из docs/error-codes.yaml Service Backend. Не редактируйте вручную: pnpm errors:build. -->

# Коды ошибок Service Backend

Справочник собран из каталога ошибок backend 0.17.0 ([error-codes.yaml](https://github.com/endge-lab/service-backend/blob/main/docs/error-codes.yaml), sha256 `b3e24b109d07`): 267 кодов. Каталог генерируется из исходников backend, поэтому в нём есть каждый `code`, который сервер может вернуть. Если код пришёл, а здесь его нет, сверьтесь с исходниками развёрнутой версии ([правила](/agents/#sources-and-versions)).

## Как читать ответ ошибки

REST API отвечает на ошибку HTTP-статусом и JSON:

```json
{ "code": "validation_error", "message": "Некорректные поля запроса", "details": { "fields": { "modelVersion": "required field" } } }
```

- `code` — стабильный машинный код. Решение принимайте по нему, а не по тексту.
- `message` — описание для человека. Текст может быть на русском или английском и меняться между версиями.
- `details` — необязательный объект с подробностями: `fields` (поле → причина), `field`, `reason`, `maxTtlSeconds` и т. п. Ошибки middleware (`unauthorized`, `csrf_origin_rejected`, `user_inactive`) приходят без `details`; ответ `401 unauthorized` содержит `loginUrl` для браузера.
- MCP-инструмент сообщает ту же ошибку результатом с `isError: true` и JSON `{ "error": "<code>", "status": <HTTP>, "message": "…", "details": {…} }` ([MCP](/agents/mcp)).

Ответы без `code`:

- `413 Request Entity Too Large` текстом, если тело запроса больше 16 МиБ (у `/mcp` — больше 4 МиБ). Уменьшите запрос: разбейте его на части.
- `431` текстом, если заголовки больше 32 КиБ.
- `404` текстом от Bridge, если он выключен на сервере.
- Ошибки протокола JSON-RPC у `/mcp` (например, `-32602`, неизвестный инструмент) приходят в поле `error` JSON-RPC.

## Общие правила по статусам

| HTTP | Что означает | Что делать |
| --- | --- | --- |
| `400` | Запрос не прошёл проверку: тело, параметры, Source, заголовки | Не повторяйте без изменений. Исправьте поле из `details.fields` или `message` по схеме операции и отправьте снова |
| `401` | Нет действующих учётных данных | Получите или обновите токен; персональный токен перевыпускает пользователь |
| `403` | Не хватает роли или прав токена, права управляются провайдером | Не повторяйте и не обходите. Сообщите пользователю код и операцию |
| `404` | Объект не найден в этом workspace | Проверьте `identity` по списку, `X-Endge-Workspace` и не удалён ли объект (`includeDeleted=true`) |
| `409` | Конфликт состояния: identity занят, revision устарела, workspace изменился | Перечитайте объект или план, примените изменение к новой версии и повторите |
| `412` | `If-Match` импорта не совпал с состоянием workspace | Постройте план импорта заново |
| `413` | Тело слишком большое | Уменьшите тело запроса |
| `428` | Нет обязательного `If-Match` | Прочитайте объект, передайте его `ETag` в `If-Match` |
| `429` | Исчерпан лимит потоков Mock Generator | Закройте лишние потоки или подождите |
| `500` | Внутренняя ошибка сервера | Повторите не более одного раза; при повторе сообщите пользователю код и время запроса |
| `502`, `503`, `504` | Недоступен зависимый сервис (ИИ, Mock Generator, провайдер входа) | Подождите и повторите до 3 раз с паузой; затем сообщите пользователю |

Повторы, `If-Match` и лимиты описаны в разделе [Лимиты, повторы и идемпотентность](/agents/#limits).

## Группы

- [Вход и сессия](#auth) — 12
- [Персональные токены](#tokens) — 20
- [Роли и права доступа](#access) — 26
- [Запрос: тело, параметры и заголовки](#request) — 17
- [Фасеты](#facets) — 15
- [Коммиты, восстановление, импорт и экспорт](#history) — 27
- [Релизы и сборки](#releases) — 12
- [Профили сборки](#build-profiles) — 7
- [Документы, Source и папки](#documents) — 51
- [Workspace](#workspace) — 9
- [Интеграции, AuthProfile и подключения backend](#integrations) — 28
- [ИИ-ассистент и каталог моделей](#ai) — 21
- [Mock Generator и потоки тестовых данных](#mock) — 12
- [Общие и внутренние ошибки](#internal) — 10

## Вход и сессия {#auth}

| Код | HTTP | Смысл | Действие |
| --- | --- | --- | --- |
| <a id="auth_access_failed"></a>`auth_access_failed` | 401 | Вход в браузере завершился, но права пользователя не удалось подготовить. | Это браузерный поток /auth/*. Попросите пользователя войти повторно; при повторе ошибки — проверить группы пользователя в провайдере. |
| <a id="auth_login_failed"></a>`auth_login_failed` | 401 | Не удалось завершить вход (обмен кода на токены у провайдера OIDC не удался или транзакция входа устарела). | Браузерный поток /auth/*. Попросите пользователя начать вход заново (GET /auth/login). |
| <a id="auth_login_rejected"></a>`auth_login_rejected` | 401 | Провайдер OIDC отклонил вход или вернул ошибку. | Браузерный поток /auth/*. Попросите пользователя войти заново и проверить учётную запись в провайдере. |
| <a id="auth_login_unavailable"></a>`auth_login_unavailable` | 503 | Вход через провайдера OIDC временно недоступен. | Повторите вход позже; агенту с персональным токеном этот поток не нужен. |
| <a id="auth.access_token_required"></a>`auth.access_token_required` | 401 | Не передан access token (объявлено в HTTP-слое для совместимости). | Передайте Authorization: Bearer &lt;JWT access token провайдера OIDC \| персональный токен endge_pat_…&gt;. Если токен уже передан — он просрочен или недействителен: получите новый (для браузера — loginUrl из ответа). |
| <a id="auth.current_user_missing"></a>`auth.current_user_missing` | 401 | В контексте запроса нет текущего пользователя (запрос прошёл без аутентификации). | Передайте Authorization: Bearer &lt;JWT access token провайдера OIDC \| персональный токен endge_pat_…&gt;. Если токен уже передан — он просрочен или недействителен: получите новый (для браузера — loginUrl из ответа). |
| <a id="auth.identity_missing"></a>`auth.identity_missing` | 401 | В токене нет идентификатора пользователя (sub). | Передайте Authorization: Bearer &lt;JWT access token провайдера OIDC \| персональный токен endge_pat_…&gt;. Если токен уже передан — он просрочен или недействителен: получите новый (для браузера — loginUrl из ответа). |
| <a id="auth.invalid_access_token"></a>`auth.invalid_access_token` | 401 | Access token недействителен или просрочен (объявлено в HTTP-слое для совместимости). | Передайте Authorization: Bearer &lt;JWT access token провайдера OIDC \| персональный токен endge_pat_…&gt;. Если токен уже передан — он просрочен или недействителен: получите новый (для браузера — loginUrl из ответа). |
| <a id="csrf_origin_rejected"></a>`csrf_origin_rejected` | 403 | Изменяющий запрос с cookie-сессией пришёл без Origin или с Origin, которого нет в списке разрешённых. | Агенту не используйте cookie: передавайте Authorization: Bearer &lt;токен&gt;. Из браузера запрос должен идти с разрешённого origin. |
| <a id="session.auth_user_id_required"></a>`session.auth_user_id_required` | 400 | В запросе нет идентификатора пользователя. | Передайте Authorization: Bearer &lt;JWT access token провайдера OIDC \| персональный токен endge_pat_…&gt;. Если токен уже передан — он просрочен или недействителен: получите новый (для браузера — loginUrl из ответа). |
| <a id="unauthorized"></a>`unauthorized` | 401 | Нет действительной аутентификации (токен не передан, недействителен, просрочен или сессия закончилась). | Передайте Authorization: Bearer &lt;JWT access token провайдера OIDC \| персональный токен endge_pat_…&gt;. Если токен уже передан — он просрочен или недействителен: получите новый (для браузера — loginUrl из ответа). |
| <a id="user_inactive"></a>`user_inactive` | 403 | Пользователь деактивирован в Endge. | Не повторяйте. Попросите администратора платформы активировать пользователя. |

## Персональные токены {#tokens}

| Код | HTTP | Смысл | Действие |
| --- | --- | --- | --- |
| <a id="access_token_admin_forbidden"></a>`access_token_admin_forbidden` | 403 | Операция требует роли Admin workspace и недоступна персональному токену. | Не повторяйте с этим токеном. Покажите пользователю, что нужно сделать, и попросите выполнить операцию в Configurator или выпустить токен с нужными флагами («Для агента» в Configurator). |
| <a id="access_token_commit_forbidden"></a>`access_token_commit_forbidden` | 403 | Токен выпущен без флага commit; коммиты и релизы токеном запрещены. | Не повторяйте. Покажите пользователю план коммита (POST /api/v1/commits/plan, MCP endge_commit_plan) и попросите закоммитить в Configurator или выпустить токен с флагом commit. |
| <a id="access_token_delete_forbidden"></a>`access_token_delete_forbidden` | 403 | Токен выпущен без флага delete; удаление документов запрещено. | Не повторяйте с этим токеном. Покажите пользователю, что нужно сделать, и попросите выполнить операцию в Configurator или выпустить токен с нужными флагами («Для агента» в Configurator). |
| <a id="access_token_description_invalid"></a>`access_token_description_invalid` | 400 | description токена длиннее 1000 символов. | Исправьте поле из message (name, description, scope, flags, expiresAt) по схеме access_token.CreateRequest и повторите выпуск. |
| <a id="access_token_expired"></a>`access_token_expired` | 401 | Срок действия персонального токена истёк. | Не повторяйте с этим токеном. Попросите пользователя выпустить новый персональный токен в Configurator и передайте его в Authorization: Bearer endge_pat_…. |
| <a id="access_token_expiry_invalid"></a>`access_token_expiry_invalid` | 400 | expiresAt должен быть в будущем. | Исправьте поле из message (name, description, scope, flags, expiresAt) по схеме access_token.CreateRequest и повторите выпуск. |
| <a id="access_token_expiry_required"></a>`access_token_expiry_required` | 400 | Не передан обязательный expiresAt. | Исправьте поле из message (name, description, scope, flags, expiresAt) по схеме access_token.CreateRequest и повторите выпуск. |
| <a id="access_token_expiry_too_long"></a>`access_token_expiry_too_long` | 400 | expiresAt превышает максимальный срок жизни токена. | Исправьте поле из message (name, description, scope, flags, expiresAt) по схеме access_token.CreateRequest и повторите выпуск. |
| <a id="access_token_flags_require_write"></a>`access_token_flags_require_write` | 400 | Флаги commit и delete допустимы только при scope=write. | Исправьте поле из message (name, description, scope, flags, expiresAt) по схеме access_token.CreateRequest и повторите выпуск. |
| <a id="access_token_invalid"></a>`access_token_invalid` | 401 | Персональный токен не найден или его секрет не совпадает. | Не повторяйте с этим токеном. Попросите пользователя выпустить новый персональный токен в Configurator и передайте его в Authorization: Bearer endge_pat_…. |
| <a id="access_token_management_forbidden"></a>`access_token_management_forbidden` | 403 | Персональными токенами можно управлять только из пользовательской сессии, не токеном. | Не повторяйте. Попросите пользователя выпустить или отозвать токен в Configurator. |
| <a id="access_token_name_invalid"></a>`access_token_name_invalid` | 400 | name токена должен содержать от 1 до 120 символов. | Исправьте поле из message (name, description, scope, flags, expiresAt) по схеме access_token.CreateRequest и повторите выпуск. |
| <a id="access_token_not_found"></a>`access_token_not_found` | 404 | Персональный токен с таким id не найден или принадлежит другому пользователю. | Не повторяйте с тем же значением. Проверьте identity/id по списку (для удалённых — includeDeleted=true) и workspace в X-Endge-Workspace; затем повторите с правильным значением. |
| <a id="access_token_owner_admin_required"></a>`access_token_owner_admin_required` | 403 | Коммит токеном разрешён, только если владелец токена — Admin этого workspace; при выпуске токена флаг commit доступен только Admin. | Не повторяйте. Покажите пользователю план коммита (endge_commit_plan) и попросите закоммитить в Configurator; либо Admin workspace выпускает токен с флагом commit. |
| <a id="access_token_revoked"></a>`access_token_revoked` | 401 | Персональный токен отозван. | Не повторяйте с этим токеном. Попросите пользователя выпустить новый персональный токен в Configurator и передайте его в Authorization: Bearer endge_pat_…. |
| <a id="access_token_route_forbidden"></a>`access_token_route_forbidden` | 403 | Раздел API закрыт для персональных токенов (управление доступом и токенами, workspaces, AI, подключения, интеграции, Bridge, импорт, резервные копии, бандлы и выгрузки релизов). | Не повторяйте с токеном. Эту операцию выполняет пользователь в Configurator. |
| <a id="access_token_scope_exceeds_role"></a>`access_token_scope_exceeds_role` | 403 | Токен с scope=write может выпустить только пользователь с ролью Editor или выше в workspace токена. | Выпустите токен со scope=read или попросите пользователя получить роль Editor. |
| <a id="access_token_scope_insufficient"></a>`access_token_scope_insufficient` | 403 | Токен выпущен со scope=read и не разрешает изменения. | Не повторяйте с этим токеном. Покажите пользователю, что нужно сделать, и попросите выполнить операцию в Configurator или выпустить токен с нужными флагами («Для агента» в Configurator). |
| <a id="access_token_scope_invalid"></a>`access_token_scope_invalid` | 400 | scope токена должен быть read или write. | Исправьте поле из message (name, description, scope, flags, expiresAt) по схеме access_token.CreateRequest и повторите выпуск. |
| <a id="access_token_workspace_forbidden"></a>`access_token_workspace_forbidden` | 403 | Токен выпущен для другого workspace. | Не передавайте X-Endge-Workspace (или параметр workspace в MCP) либо укажите workspace токена (его видно в GET /api/session/me и endge_status). |

## Роли и права доступа {#access}

| Код | HTTP | Смысл | Действие |
| --- | --- | --- | --- |
| <a id="access_grant_id_invalid"></a>`access_grant_id_invalid` | 400 | Идентификатор назначения доступа не является UUID. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="access_grant_not_found"></a>`access_grant_not_found` | 404 | Назначение доступа с таким id не найдено. | Не повторяйте с тем же значением. Проверьте identity/id по списку (для удалённых — includeDeleted=true) и workspace в X-Endge-Workspace; затем повторите с правильным значением. |
| <a id="access_managed_externally"></a>`access_managed_externally` | 403 | Права доступа этого пользователя или workspace назначаются внешней системой (группы провайдера OIDC). | Не повторяйте. Попросите администратора изменить группы пользователя в провайдере идентификации; после этого пользователь должен войти заново. |
| <a id="access_scope_invalid"></a>`access_scope_invalid` | 400 | scopeType назначения должен быть platform или workspace. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="access_target_not_found"></a>`access_target_not_found` | 404 | Пользователь или workspace для назначения доступа не найден. | Не повторяйте с тем же значением. Проверьте identity/id по списку (для удалённых — includeDeleted=true) и workspace в X-Endge-Workspace; затем повторите с правильным значением. |
| <a id="access_user_id_invalid"></a>`access_user_id_invalid` | 400 | userId должен быть UUID. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="access_workspace_missing"></a>`access_workspace_missing` | 500 | Назначение доступа ссылается на недоступный workspace. | Не повторяйте: результат не изменится. Сообщите пользователю code, операцию и identity объекта — нужна диагностика на стороне сервера. |
| <a id="cursor_invalid"></a>`cursor_invalid` | 400 | cursor повреждён или не от этого списка. | Передавайте cursor из предыдущего ответа без изменений или начните список без cursor. |
| <a id="external_access_ambiguous"></a>`external_access_ambiguous` | 403 | Два access token с одинаковым iat дают разные права; backend не может выбрать. | Не повторяйте с тем же access token. Получите у провайдера новый access token (повторный вход в браузере или обновление токена) и повторите запрос; при повторе ошибки сообщите пользователю. |
| <a id="external_access_expired"></a>`external_access_expired` | 403 | Access token истёк во время подготовки прав. | Не повторяйте с тем же access token. Получите у провайдера новый access token (повторный вход в браузере или обновление токена) и повторите запрос; при повторе ошибки сообщите пользователю. |
| <a id="external_access_invalid"></a>`external_access_invalid` | 403 | Нет проверенных актуальных прав из внешнего провайдера. | Не повторяйте с тем же access token. Получите у провайдера новый access token (повторный вход в браузере или обновление токена) и повторите запрос; при повторе ошибки сообщите пользователю. |
| <a id="external_access_stale"></a>`external_access_stale` | 403 | Уже применён более новый access token этого пользователя; переданный токен устарел. | Получите у провайдера свежий access token (или обновите браузерную сессию) и повторите запрос с ним. |
| <a id="external_access_workspace_inactive"></a>`external_access_workspace_inactive` | 403 | Права из внешнего провайдера указывают на неактивный (архивный) workspace. | Не повторяйте. Попросите администратора восстановить workspace или изменить правила доступа. |
| <a id="last_platform_admin_required"></a>`last_platform_admin_required` | 409 | Нельзя снять роль с последнего Platform Admin. | Не повторяйте. Сначала назначьте Platform Admin другому пользователю, затем повторите изменение. |
| <a id="membership_role_invalid"></a>`membership_role_invalid` | 400 | Роль участника должна быть viewer, editor или admin. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="platform_admin_required"></a>`platform_admin_required` | 403 | Операция требует роли Platform Admin. | Не повторяйте. Попросите пользователя с ролью Platform Admin выполнить операцию или выдать роль. |
| <a id="platform_role_invalid"></a>`platform_role_invalid` | 400 | Для scopeType=platform допустима только роль admin. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="shared_squash_requires_admin"></a>`shared_squash_requires_admin` | 403 | Схлопывание (squash) ревизий других пользователей требует роли Admin workspace. | Используйте revisionPolicy=preserve или попросите Admin workspace выполнить коммит. |
| <a id="user_query_too_short"></a>`user_query_too_short` | 400 | Строка поиска пользователей q короче 2 символов. | Исправьте параметр запроса, названный в message, по описанию параметра в OpenAPI и повторите запрос. |
| <a id="workspace_admin_required"></a>`workspace_admin_required` | 403 | Операция требует роли Admin workspace. | Не повторяйте. Проверьте роль через GET /api/session/me (MCP: endge_status). Попросите пользователя выдать нужную роль или выполнить операцию самому. |
| <a id="workspace_editor_required"></a>`workspace_editor_required` | 403 | Операция требует роли Editor workspace. | Не повторяйте. Проверьте роль через GET /api/session/me (MCP: endge_status). Попросите пользователя выдать нужную роль или выполнить операцию самому. |
| <a id="workspace_forbidden"></a>`workspace_forbidden` | 403 | У пользователя нет доступа к этому workspace. | Не повторяйте. Проверьте роль через GET /api/session/me (MCP: endge_status). Попросите пользователя выдать нужную роль или выполнить операцию самому. |
| <a id="workspace_identity_required"></a>`workspace_identity_required` | 400 | workspaceIdentity обязателен. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="workspace_role_invalid"></a>`workspace_role_invalid` | 400 | Роль в workspace должна быть viewer, editor или admin. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="workspace_selection_invalid"></a>`workspace_selection_invalid` | 400 | selection.type должен быть all-active или selected. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="workspace_selection_required"></a>`workspace_selection_required` | 400 | Для selection.type=selected нужен непустой workspaceIdentities. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |

## Запрос: тело, параметры и заголовки {#request}

| Код | HTTP | Смысл | Действие |
| --- | --- | --- | --- |
| <a id="active_invalid"></a>`active_invalid` | 400 | active должен быть boolean. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="collection_unsupported"></a>`collection_unsupported` | 400 | Коллекция не поддерживается этой операцией. | Используйте одну из коллекций из описания параметра collection (MCP) или путь коллекции из OpenAPI. |
| <a id="if_match_invalid"></a>`if_match_invalid` | 400 | If-Match не содержит положительную revision. | Передайте в If-Match число revision из последнего чтения документа (например "3") и повторите. |
| <a id="invalid_json"></a>`invalid_json` | 400 | Аргумент MCP-инструмента (document или changes) должен быть JSON-объектом. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="limit_invalid"></a>`limit_invalid` | 400 | limit должен быть от 1 до 500. | Исправьте параметр запроса, названный в message, по описанию параметра в OpenAPI и повторите запрос. |
| <a id="not_found"></a>`not_found` | 404 | Сущность не найдена либо маршрут не существует (message «Маршрут не найден»). | Проверьте путь и метод по OpenAPI; для сущности — identity/id и workspace. Не повторяйте с теми же значениями. |
| <a id="object_expected"></a>`object_expected` | 400 | Поле из details.field должно быть JSON-объектом. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="offset_invalid"></a>`offset_invalid` | 400 | offset должен быть неотрицательным. | Исправьте параметр запроса, названный в message, по описанию параметра в OpenAPI и повторите запрос. |
| <a id="pagination.limit_invalid"></a>`pagination.limit_invalid` | 400 | limit вне допустимого диапазона. | Исправьте параметр запроса, названный в message, по описанию параметра в OpenAPI и повторите запрос. |
| <a id="path_parameter_invalid"></a>`path_parameter_invalid` | 400 | Параметр пути (details.field) должен быть URL-кодирован. | Закодируйте значение через encodeURIComponent и повторите. |
| <a id="precondition_required"></a>`precondition_required` | 428 | Для изменения документа нужен заголовок If-Match с текущей revision. | Прочитайте документ (GET), возьмите revision (или ETag) и повторите запрос с If-Match. |
| <a id="query_boolean_invalid"></a>`query_boolean_invalid` | 400 | Параметр запроса (details.field) должен быть true или false. | Исправьте параметр запроса, названный в message, по описанию параметра в OpenAPI и повторите запрос. |
| <a id="query_owner_invalid"></a>`query_owner_invalid` | 400 | owner должен быть me или all. | Исправьте параметр запроса, названный в message, по описанию параметра в OpenAPI и повторите запрос. |
| <a id="read_only_field"></a>`read_only_field` | 400 | Поля автора и аудита (createdBy, updatedBy, createdAt, updatedAt и т. п.) заполняет сервер. | Уберите эти поля из тела запроса и повторите. |
| <a id="snapshot_invalid"></a>`snapshot_invalid` | 400 | Параметр snapshot должен быть boolean. | Исправьте параметр запроса, названный в message, по описанию параметра в OpenAPI и повторите запрос. |
| <a id="string_array_invalid"></a>`string_array_invalid` | 400 | Поле из details.field должно быть массивом строк. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="validation_error"></a>`validation_error` | 400 | Тело запроса не разобрано как JSON (details.reason) или поля не прошли проверку контракта (details.fields). | Не повторяйте без изменений. Исправьте поля из details по схеме CreateRequest/PatchRequest операции в OpenAPI и отправьте снова. |

## Фасеты {#facets}

| Код | HTTP | Смысл | Действие |
| --- | --- | --- | --- |
| <a id="facet_color_invalid"></a>`facet_color_invalid` | 400 | color фасета должен быть #rrggbb строчными буквами. | Исправьте поле из message по схеме фасета в OpenAPI и повторите; перед повтором при необходимости перечитайте список фасетов (GET /api/v1/facets). |
| <a id="facet_configuration_invalid"></a>`facet_configuration_invalid` | 400 | Вклад фасета в конфигурацию задан неверно (mode inherit/replace и объект patch). | Исправьте поле из message по схеме фасета в OpenAPI и повторите; перед повтором при необходимости перечитайте список фасетов (GET /api/v1/facets). |
| <a id="facet_deleted"></a>`facet_deleted` | 409 | Документ фасета можно восстановить только внутри активного фасета. | Сначала восстановите фасет (POST /api/v1/facets/{facetIdentity}/restore), затем документ. |
| <a id="facet_document_folder_unsupported"></a>`facet_document_folder_unsupported` | 400 | Документы фасетов не поддерживают папки. | Уберите folderIdentity из запроса. |
| <a id="facet_folder_unsupported"></a>`facet_folder_unsupported` | 400 | Фасеты не поддерживают папки. | Уберите folderIdentity из запроса. |
| <a id="facet_icon_invalid"></a>`facet_icon_invalid` | 400 | icon фасета должен быть PascalCase-токеном. | Исправьте поле из message по схеме фасета в OpenAPI и повторите; перед повтором при необходимости перечитайте список фасетов (GET /api/v1/facets). |
| <a id="facet_identity_invalid"></a>`facet_identity_invalid` | 400 | facetIdentity обязателен и не длиннее 160 символов. | Исправьте поле из message по схеме фасета в OpenAPI и повторите; перед повтором при необходимости перечитайте список фасетов (GET /api/v1/facets). |
| <a id="facet_identity_locked"></a>`facet_identity_locked` | 409 | identity фасета нельзя менять, пока в нём есть активные документы. | Исправьте поле из message по схеме фасета в OpenAPI и повторите; перед повтором при необходимости перечитайте список фасетов (GET /api/v1/facets). |
| <a id="facet_identity_required"></a>`facet_identity_required` | 400 | Для документов фасета (collection=facet-documents) в MCP не передан facetIdentity. | Передайте facetIdentity — identity фасета из endge_list_documents с collection=facets — и повторите вызов. |
| <a id="facet_not_empty"></a>`facet_not_empty` | 409 | Фасет нельзя удалить, пока в нём есть активные документы. | Сначала удалите или перенесите документы фасета, затем повторите удаление. |
| <a id="facet_position_invalid"></a>`facet_position_invalid` | 400 | position должен быть неотрицательным целым. | Исправьте поле из message по схеме фасета в OpenAPI и повторите; перед повтором при необходимости перечитайте список фасетов (GET /api/v1/facets). |
| <a id="facet_positions_invalid"></a>`facet_positions_invalid` | 400 | Позиции фасетов не образуют непрерывный ряд с нуля. | Не повторяйте: результат не изменится. Сообщите пользователю code, операцию и identity объекта — нужна диагностика на стороне сервера. |
| <a id="facet_reorder_duplicate"></a>`facet_reorder_duplicate` | 400 | В списке перестановки фасетов повторяется identity. | Исправьте поле из message по схеме фасета в OpenAPI и повторите; перед повтором при необходимости перечитайте список фасетов (GET /api/v1/facets). |
| <a id="facet_reorder_set_mismatch"></a>`facet_reorder_set_mismatch` | 409 | Набор фасетов изменился — список перестановки не совпадает с текущим. | Перечитайте фасеты (GET /api/v1/facets) и повторите перестановку с полным актуальным списком. |
| <a id="facet_reorder_too_large"></a>`facet_reorder_too_large` | 400 | В перестановке больше 1000 фасетов. | Исправьте поле из message по схеме фасета в OpenAPI и повторите; перед повтором при необходимости перечитайте список фасетов (GET /api/v1/facets). |

## Коммиты, восстановление, импорт и экспорт {#history}

| Код | HTTP | Смысл | Действие |
| --- | --- | --- | --- |
| <a id="archive_cursor_invalid"></a>`archive_cursor_invalid` | 400 | cursor архива workspaces повреждён. | Передавайте cursor из предыдущего ответа без изменений или начните без cursor. |
| <a id="archive_limit_invalid"></a>`archive_limit_invalid` | 400 | limit архива должен быть от 1 до 200. | Исправьте параметр запроса, названный в message, по описанию параметра в OpenAPI и повторите запрос. |
| <a id="backup_description_too_long"></a>`backup_description_too_long` | 400 | description резервной копии длиннее 1000 символов. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="backup_id_invalid"></a>`backup_id_invalid` | 400 | id резервной копии должен быть UUID или last. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="backup_kind_invalid"></a>`backup_kind_invalid` | 400 | kind резервной копии должен быть manual или pre_import. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="domain_version_invalid"></a>`domain_version_invalid` | 400 | Не удалось вычислить версию домена импортируемых данных. | Сформируйте экспорт заново на исходном backend и повторите импорт. |
| <a id="domain_version_mismatch"></a>`domain_version_mismatch` | 409 | Импортированный workspace не совпал с версией домена источника. | Не повторяйте этот импорт. Сформируйте экспорт заново и создайте новый план импорта; при повторе сообщите пользователю. |
| <a id="encrypted_workspace_invalid"></a>`encrypted_workspace_invalid` | 400 | Конверт зашифрованного workspace повреждён. | Сформируйте экспорт заново и повторите импорт. |
| <a id="encrypted_workspace_unsupported"></a>`encrypted_workspace_unsupported` | 400 | Формат зашифрованного конверта не поддерживается этим backend. | Сформируйте экспорт на совместимой версии backend. |
| <a id="export_option_invalid"></a>`export_option_invalid` | 400 | Режим переноса при экспорте должен быть none, own или all. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="head_sequence_conflict"></a>`head_sequence_conflict` | 409 | После построения плана в workspace появились новые ревизии или коммиты — expectedHeadSequence устарел. | Заново запросите план (POST /api/v1/commits/plan или план восстановления; MCP endge_commit_plan), проверьте его и повторите с новым expectedHeadSequence. |
| <a id="import_owner_changed"></a>`import_owner_changed` | 409 | После построения плана изменилось сопоставление владельцев приватных AI-подключений или профилей сборки. | Не повторяйте применение этого плана. Создайте новый план импорта, проверьте его и примените. |
| <a id="import_plan_applied"></a>`import_plan_applied` | 409 | План импорта уже применён. | Повтор не нужен — проверьте результат импорта. Для нового импорта создайте новый план. |
| <a id="import_plan_corrupted"></a>`import_plan_corrupted` | 500 | Сохранённый план импорта повреждён. | Не повторяйте: результат не изменится. Сообщите пользователю code, операцию и identity объекта — нужна диагностика на стороне сервера. |
| <a id="import_plan_expired"></a>`import_plan_expired` | 409 | Срок действия плана импорта истёк. | Не повторяйте применение этого плана. Создайте новый план импорта, проверьте его и примените. |
| <a id="import_plan_not_found"></a>`import_plan_not_found` | 404 | План импорта не найден (неверный id или план удалён). | Не повторяйте применение этого плана. Создайте новый план импорта, проверьте его и примените. |
| <a id="import_requires_clean_commit"></a>`import_requires_clean_commit` | 409 | В workspace есть незакоммиченные ревизии; импорт требует чистого состояния. | Закоммитьте или отмените изменения (через пользователя), затем создайте план импорта заново. |
| <a id="nothing_to_commit"></a>`nothing_to_commit` | 409 | В workspace нет незакоммиченных ревизий. | Повтор не нужен — коммитить нечего. Проверьте, что изменения сохранены в нужном workspace. |
| <a id="nothing_to_restore"></a>`nothing_to_restore` | 409 | Workspace уже совпадает с целевым состоянием восстановления. | Повтор не нужен — восстанавливать нечего. |
| <a id="precondition_failed"></a>`precondition_failed` | 412 | Workspace изменился после построения плана импорта. | Не повторяйте применение этого плана. Создайте новый план импорта, проверьте его и примените. |
| <a id="revision_policy_invalid"></a>`revision_policy_invalid` | 400 | revisionPolicy должен быть preserve или squash. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="revision_snapshot_invalid"></a>`revision_snapshot_invalid` | 500 | Сохранённый снимок ревизии не прошёл проверку. | Не повторяйте: результат не изменится. Сообщите пользователю code, операцию и identity объекта — нужна диагностика на стороне сервера. |
| <a id="workspace_confirmation_invalid"></a>`workspace_confirmation_invalid` | 400 | confirmation должен совпадать с identity целевого workspace. | Попросите пользователя подтвердить операцию и передайте в confirmation точный identity workspace. |
| <a id="workspace_password_invalid"></a>`workspace_password_invalid` | 400 | Пароль неверен или зашифрованный артефакт повреждён. | Попросите пользователя проверить пароль и повторите. |
| <a id="workspace_password_required"></a>`workspace_password_required` | 400 | Для импорта зашифрованного workspace нужен пароль. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="workspace_password_too_long"></a>`workspace_password_too_long` | 400 | Пароль длиннее 1024 символов. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="workspace_schema_unsupported"></a>`workspace_schema_unsupported` | 400 | Версия схемы экспорта не поддерживается этим backend. | Не повторяйте. Обновите исходный backend и сформируйте новый экспорт либо импортируйте в совместимую версию. |

## Релизы и сборки {#releases}

| Код | HTTP | Смысл | Действие |
| --- | --- | --- | --- |
| <a id="build_commit_mismatch"></a>`build_commit_mismatch` | 409 | Коммит и бандл собраны из разных состояний workspace (headSequence не совпадает). | Пересоберите бандл из нужного коммита и повторите публикацию. |
| <a id="build_metadata_invalid"></a>`build_metadata_invalid` | 400 | Метаданные сборки некорректны. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="build_source_changed"></a>`build_source_changed` | 409 | После сборки модель изменилась или workspace был заменён. | Пересоберите проект из текущего состояния и повторите создание коммита или публикацию. |
| <a id="build_source_invalid"></a>`build_source_invalid` | 400 | Сборка относится к другому workspace или не имеет исходной ревизии. | Соберите бандл в этом workspace и повторите. |
| <a id="commit_message_required"></a>`commit_message_required` | 400 | Для собранной модели нужен message коммита. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="release_artifact_inconsistent"></a>`release_artifact_inconsistent` | 500 | Метаданные артефакта релиза противоречивы. | Не повторяйте: результат не изменится. Сообщите пользователю code, операцию и identity объекта — нужна диагностика на стороне сервера. |
| <a id="release_build_invalid"></a>`release_build_invalid` | 400 | Загруженный бандл релиза некорректен (подробности в message). | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="release_build_required"></a>`release_build_required` | 400 | К релизу нужно приложить ровно один Gzip-бандл не больше 15 МиБ. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="release_identity_reserved"></a>`release_identity_reserved` | 400 | identity last зарезервирован для чтения последнего релиза. | Выберите другой identity релиза. |
| <a id="release_last_read_only"></a>`release_last_read_only` | 400 | Псевдоним last доступен только для чтения. | Для изменения используйте точный identity релиза. |
| <a id="release_snapshot_invalid"></a>`release_snapshot_invalid` | 500 | Снимок релиза не прошёл проверку. | Не повторяйте: результат не изменится. Сообщите пользователю code, операцию и identity объекта — нужна диагностика на стороне сервера. |
| <a id="release_text_too_long"></a>`release_text_too_long` | 400 | Текст релиза превышает лимит. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |

## Профили сборки {#build-profiles}

| Код | HTTP | Смысл | Действие |
| --- | --- | --- | --- |
| <a id="build_profile_forbidden"></a>`build_profile_forbidden` | 403 | Пользователь не может управлять этим профилем сборки. | Не повторяйте. Проверьте роль через GET /api/session/me (MCP: endge_status). Попросите пользователя выдать нужную роль или выполнить операцию самому. |
| <a id="build_profile_visibility_forbidden"></a>`build_profile_visibility_forbidden` | 403 | Видимость профиля меняет только его владелец. | Не повторяйте. Проверьте роль через GET /api/session/me (MCP: endge_status). Попросите пользователя выдать нужную роль или выполнить операцию самому. |
| <a id="build_profile.display_name_invalid"></a>`build_profile.display_name_invalid` | 400 | displayName профиля сборки обязателен и не длиннее 160 символов. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="build_profile.identity_invalid"></a>`build_profile.identity_invalid` | 400 | identity профиля сборки должен быть UUID. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="build_profile.patch_empty"></a>`build_profile.patch_empty` | 400 | В PATCH профиля сборки нет ни одного поля. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="build_profile.settings_invalid"></a>`build_profile.settings_invalid` | 400 | Настройки профиля сборки содержат неподдерживаемое поле (подробности в message). | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="build_profile.visibility_invalid"></a>`build_profile.visibility_invalid` | 400 | visibility должен быть shared или private. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |

## Документы, Source и папки {#documents}

| Код | HTTP | Смысл | Действие |
| --- | --- | --- | --- |
| <a id="action_source_invalid"></a>`action_source_invalid` | 400 | source действия не должен быть пустым. | Передайте непустой source и sourceVersion, которые поддерживает коллекция (см. схему CreateRequest/PatchRequest и описание коллекции в документации), затем повторите запрос. |
| <a id="component_model_version_invalid"></a>`component_model_version_invalid` | 400 | modelVersion компонента должен быть положительным. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="component_source_required"></a>`component_source_required` | 400 | source компонента обязателен. | Передайте непустой source и sourceVersion, которые поддерживает коллекция (см. схему CreateRequest/PatchRequest и описание коллекции в документации), затем повторите запрос. |
| <a id="composition_kind_invalid"></a>`composition_kind_invalid` | 400 | kind композиции должен быть library, query или workspace. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="computation_contract_version_invalid"></a>`computation_contract_version_invalid` | 400 | contractVersion вычисления должен быть положительным. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="configuration_folder_unsupported"></a>`configuration_folder_unsupported` | 400 | Документы конфигураций не поддерживают папки. | Уберите folderIdentity из запроса и повторите. |
| <a id="configuration_source_version_invalid"></a>`configuration_source_version_invalid` | 400 | Конфигурации нужны source и sourceVersion=1. | Передайте непустой source и sourceVersion, которые поддерживает коллекция (см. схему CreateRequest/PatchRequest и описание коллекции в документации), затем повторите запрос. |
| <a id="display_name_invalid"></a>`display_name_invalid` | 400 | displayName обязателен и не длиннее 255 символов. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="display_name_required"></a>`display_name_required` | 400 | displayName обязателен. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="document_deleted_invalid"></a>`document_deleted_invalid` | 400 | deleted должен быть boolean. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="document_deleted_unsupported"></a>`document_deleted_unsupported` | 400 | Поле deleted поддерживается только для коллекций фасетов. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="document_input_invalid"></a>`document_input_invalid` | 400 | Данные документа некорректны. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="expected_revision_invalid"></a>`expected_revision_invalid` | 400 | expectedRevision (MCP) должен быть положительным числом. | Передайте текущую revision документа из поля revision последнего чтения. |
| <a id="folder_color_invalid"></a>`folder_color_invalid` | 400 | color папки должен быть в виде #rrggbb строчными буквами. | Перечитайте папку и её родителя (GET /api/v1/folders), исправьте поле из message и повторите. Системные и корневые папки менять нельзя — создайте свою папку. |
| <a id="folder_cycle"></a>`folder_cycle` | 400 | Новый родитель создаёт цикл папок (или цикл в импортируемом бандле). | Перечитайте папку и её родителя (GET /api/v1/folders), исправьте поле из message и повторите. Системные и корневые папки менять нельзя — создайте свою папку. |
| <a id="folder_entity_type_immutable"></a>`folder_entity_type_immutable` | 409 | entityType папки нельзя изменить после создания. | Перечитайте папку и её родителя (GET /api/v1/folders), исправьте поле из message и повторите. Системные и корневые папки менять нельзя — создайте свою папку. |
| <a id="folder_entity_type_invalid"></a>`folder_entity_type_invalid` | 400 | entityType должен быть коллекцией с папками и совпадать с типом документа. | Перечитайте папку и её родителя (GET /api/v1/folders), исправьте поле из message и повторите. Системные и корневые папки менять нельзя — создайте свою папку. |
| <a id="folder_icon_invalid"></a>`folder_icon_invalid` | 400 | icon папки должен быть PascalCase-токеном. | Перечитайте папку и её родителя (GET /api/v1/folders), исправьте поле из message и повторите. Системные и корневые папки менять нельзя — создайте свою папку. |
| <a id="folder_identity_required"></a>`folder_identity_required` | 400 | folderIdentity обязателен. | Перечитайте папку и её родителя (GET /api/v1/folders), исправьте поле из message и повторите. Системные и корневые папки менять нельзя — создайте свою папку. |
| <a id="folder_identity_too_long"></a>`folder_identity_too_long` | 400 | folderIdentity длиннее 160 символов. | Перечитайте папку и её родителя (GET /api/v1/folders), исправьте поле из message и повторите. Системные и корневые папки менять нельзя — создайте свою папку. |
| <a id="folder_is_system_unsupported"></a>`folder_is_system_unsupported` | 400 | Поле isSystem заменено на managedBy. | Уберите isSystem и используйте managedBy. |
| <a id="folder_move_unsupported"></a>`folder_move_unsupported` | 400 | Папки нельзя переносить общим перемещением документов. | Измените parentIdentity папки через PATCH /api/v1/folders/{identity}. |
| <a id="folder_placement_invalid"></a>`folder_placement_invalid` | 400 | placement должен быть frontend или workspace. | Перечитайте папку и её родителя (GET /api/v1/folders), исправьте поле из message и повторите. Системные и корневые папки менять нельзя — создайте свою папку. |
| <a id="folder_root_field_read_only"></a>`folder_root_field_read_only` | 400 | isRoot управляется сервером. | Уберите isRoot из запроса. |
| <a id="folder_root_invalid"></a>`folder_root_invalid` | 400 | Корневая папка коллекции или workspace имеет неверный identity, область или состояние. | Не повторяйте: результат не изменится. Сообщите пользователю code, операцию и identity объекта — нужна диагностика на стороне сервера. |
| <a id="folder_scope_immutable"></a>`folder_scope_immutable` | 409 | scope папки нельзя изменить. | Перечитайте папку и её родителя (GET /api/v1/folders), исправьте поле из message и повторите. Системные и корневые папки менять нельзя — создайте свою папку. |
| <a id="folder_scope_invalid"></a>`folder_scope_invalid` | 400 | scope папки должен быть collection или workspace. | Перечитайте папку и её родителя (GET /api/v1/folders), исправьте поле из message и повторите. Системные и корневые папки менять нельзя — создайте свою папку. |
| <a id="folder_self_parent"></a>`folder_self_parent` | 400 | Папка не может быть своим родителем. | Перечитайте папку и её родителя (GET /api/v1/folders), исправьте поле из message и повторите. Системные и корневые папки менять нельзя — создайте свою папку. |
| <a id="folder_workspace_entity_type_invalid"></a>`folder_workspace_entity_type_invalid` | 400 | Папки области workspace не задают entityType. | Перечитайте папку и её родителя (GET /api/v1/folders), исправьте поле из message и повторите. Системные и корневые папки менять нельзя — создайте свою папку. |
| <a id="identity_conflict"></a>`identity_conflict` | 409 | Документ с таким identity уже существует в коллекции workspace. | Выберите другой identity или измените существующий документ (PATCH с If-Match). Если документ удалён — восстановите его (POST …/restore). |
| <a id="identity_required"></a>`identity_required` | 400 | identity обязателен. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="identity_too_long"></a>`identity_too_long` | 400 | identity длиннее 160 символов. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="managed_by_invalid"></a>`managed_by_invalid` | 400 | managedBy должен быть user, system или integration. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="move_document_deleted"></a>`move_document_deleted` | 400 | Удалённые документы нельзя перемещать. | Восстановите документ или уберите его из списка перемещения. |
| <a id="move_document_duplicate"></a>`move_document_duplicate` | 400 | Один документ указан в перемещении дважды. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="move_documents_count_invalid"></a>`move_documents_count_invalid` | 400 | documents должен содержать от 1 до 500 элементов. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="query_source_version_invalid"></a>`query_source_version_invalid` | 400 | Для запросов (queries) sourceVersion должен быть 2. | Передайте непустой source и sourceVersion, которые поддерживает коллекция (см. схему CreateRequest/PatchRequest и описание коллекции в документации), затем повторите запрос. |
| <a id="relation_target_not_found"></a>`relation_target_not_found` | 400 | Документ ссылается на сущность, которой нет в workspace (подробности в message). | Создайте целевую сущность или исправьте ссылку на существующую, затем повторите. |
| <a id="revision_conflict"></a>`revision_conflict` | 409 | Документ изменился после вашего чтения — revision в If-Match устарела. | Перечитайте документ, заново примените свои изменения к актуальной версии и повторите с новой revision в If-Match. Не перезаписывайте чужие изменения вслепую. |
| <a id="simulation_source_version_invalid"></a>`simulation_source_version_invalid` | 400 | Симуляции нужны source и sourceVersion=1. | Передайте непустой source и sourceVersion, которые поддерживает коллекция (см. схему CreateRequest/PatchRequest и описание коллекции в документации), затем повторите запрос. |
| <a id="source_contract_invalid"></a>`source_contract_invalid` | 400 | Нужны source и положительный sourceVersion. | Передайте непустой source и sourceVersion, которые поддерживает коллекция (см. схему CreateRequest/PatchRequest и описание коллекции в документации), затем повторите запрос. |
| <a id="source_invalid"></a>`source_invalid` | 400 | source должен быть строкой. | Передайте непустой source и sourceVersion, которые поддерживает коллекция (см. схему CreateRequest/PatchRequest и описание коллекции в документации), затем повторите запрос. |
| <a id="source_too_large"></a>`source_too_large` | 400 | source больше 8 МиБ. | Уменьшите source (вынесите части в отдельные документы) и повторите. |
| <a id="source_version_invalid"></a>`source_version_invalid` | 400 | sourceVersion должен быть положительным. | Передайте непустой source и sourceVersion, которые поддерживает коллекция (см. схему CreateRequest/PatchRequest и описание коллекции в документации), затем повторите запрос. |
| <a id="system_folder_immutable"></a>`system_folder_immutable` | 409 | Корневые и системные папки нельзя изменять, удалять и восстанавливать из ревизии. | Перечитайте папку и её родителя (GET /api/v1/folders), исправьте поле из message и повторите. Системные и корневые папки менять нельзя — создайте свою папку. |
| <a id="update_store_required"></a>`update_store_required` | 400 | storeIdentity обновления состояния обязателен. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="vocab_auth_mode_invalid"></a>`vocab_auth_mode_invalid` | 400 | authMode справочника некорректен. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="vocab_mode_invalid"></a>`vocab_mode_invalid` | 400 | mode справочника некорректен. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="vocab_source_contract_invalid"></a>`vocab_source_contract_invalid` | 400 | source и sourceVersion справочника передаются только вместе. | Передайте непустой source и sourceVersion, которые поддерживает коллекция (см. схему CreateRequest/PatchRequest и описание коллекции в документации), затем повторите запрос. |
| <a id="vocab_source_invalid"></a>`vocab_source_invalid` | 400 | source справочника не должен быть пустым. | Передайте непустой source и sourceVersion, которые поддерживает коллекция (см. схему CreateRequest/PatchRequest и описание коллекции в документации), затем повторите запрос. |
| <a id="vocab_source_version_invalid"></a>`vocab_source_version_invalid` | 400 | sourceVersion справочника должен быть 1. | Передайте непустой source и sourceVersion, которые поддерживает коллекция (см. схему CreateRequest/PatchRequest и описание коллекции в документации), затем повторите запрос. |

## Workspace {#workspace}

| Код | HTTP | Смысл | Действие |
| --- | --- | --- | --- |
| <a id="installed_integrations_invalid"></a>`installed_integrations_invalid` | 400 | installedIntegrations должен быть корректным массивом. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="startup_composition_identity_invalid"></a>`startup_composition_identity_invalid` | 400 | startupCompositionIdentity должен быть непустым identity или null. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="startup_composition_not_found"></a>`startup_composition_not_found` | 400 | startupCompositionIdentity не указывает на активную композицию этого workspace. | Укажите identity существующей активной композиции (GET /api/v1/compositions) или null. |
| <a id="workspace_bootstrap_invalid"></a>`workspace_bootstrap_invalid` | 500 | При создании workspace не создалась корневая папка композиций. | Не меняйте запрос ради исправления. Для чтения можно повторить один раз через несколько секунд; перед повтором изменения сначала перечитайте состояние, чтобы не применить его дважды. Если ошибка повторяется, сообщите пользователю code, операцию и время. |
| <a id="workspace_configuration_values_invalid"></a>`workspace_configuration_values_invalid` | 400 | Значения конфигурации workspace не прошли проверку (подробности в message). | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="workspace_document_structure_invalid"></a>`workspace_document_structure_invalid` | 400 | documentStructure должен быть frontend или custom. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="workspace_input_invalid"></a>`workspace_input_invalid` | 400 | Данные workspace некорректны. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="workspace_not_found"></a>`workspace_not_found` | 404 | Workspace не найден, удалён или неактивен. | Не повторяйте с тем же значением. Проверьте identity/id по списку (для удалённых — includeDeleted=true) и workspace в X-Endge-Workspace; затем повторите с правильным значением. |
| <a id="workspace_required"></a>`workspace_required` | 400 | Не указан workspace для операции. | Передайте заголовок X-Endge-Workspace (REST) или параметр workspace (MCP) с identity из GET /api/v1/workspaces / endge_list_workspaces. |

## Интеграции, AuthProfile и подключения backend {#integrations}

| Код | HTTP | Смысл | Действие |
| --- | --- | --- | --- |
| <a id="auth_profile_adapter_required"></a>`auth_profile_adapter_required` | 400 | adapterId обязателен. | Сверьте adapterId, config и credentials с описанием адаптера в документации профилей аутентификации, исправьте названное в message поле и повторите. Секреты передавайте только в credentials. |
| <a id="auth_profile_field_unsupported"></a>`auth_profile_field_unsupported` | 400 | Поле не поддерживается профилем аутентификации. | Сверьте adapterId, config и credentials с описанием адаптера в документации профилей аутентификации, исправьте названное в message поле и повторите. Секреты передавайте только в credentials. |
| <a id="auth_profile_refresh_persistence_invalid"></a>`auth_profile_refresh_persistence_invalid` | 400 | persistRefreshToken должен быть boolean. | Сверьте adapterId, config и credentials с описанием адаптера в документации профилей аутентификации, исправьте названное в message поле и повторите. Секреты передавайте только в credentials. |
| <a id="auth_profile_session_forbidden"></a>`auth_profile_session_forbidden` | 400 | Адаптер не поддерживает блок session. | Сверьте adapterId, config и credentials с описанием адаптера в документации профилей аутентификации, исправьте названное в message поле и повторите. Секреты передавайте только в credentials. |
| <a id="auth_profile_session_required"></a>`auth_profile_session_required` | 400 | Адаптерам, выдающим токен, нужен блок session. | Сверьте adapterId, config и credentials с описанием адаптера в документации профилей аутентификации, исправьте названное в message поле и повторите. Секреты передавайте только в credentials. |
| <a id="auth_profile_storage_invalid"></a>`auth_profile_storage_invalid` | 400 | session.storage должен быть memory, sessionStorage или localStorage. | Сверьте adapterId, config и credentials с описанием адаптера в документации профилей аутентификации, исправьте названное в message поле и повторите. Секреты передавайте только в credentials. |
| <a id="backend_connection_not_found"></a>`backend_connection_not_found` | 404 | Backend-подключение не найдено. | Не повторяйте с тем же значением. Проверьте identity/id по списку (для удалённых — includeDeleted=true) и workspace в X-Endge-Workspace; затем повторите с правильным значением. |
| <a id="backend_name_required"></a>`backend_name_required` | 400 | name подключения обязателен. | Исправьте name или baseUrl (абсолютный http/https URL без userinfo, query и fragment) и повторите. |
| <a id="backend_name_too_long"></a>`backend_name_too_long` | 400 | name подключения длиннее 160 символов. | Исправьте name или baseUrl (абсолютный http/https URL без userinfo, query и fragment) и повторите. |
| <a id="backend_url_components_forbidden"></a>`backend_url_components_forbidden` | 400 | baseUrl содержит userinfo, query или fragment. | Исправьте name или baseUrl (абсолютный http/https URL без userinfo, query и fragment) и повторите. |
| <a id="backend_url_invalid"></a>`backend_url_invalid` | 400 | baseUrl не является абсолютным http/https URL. | Исправьте name или baseUrl (абсолютный http/https URL без userinfo, query и fragment) и повторите. |
| <a id="backend_url_scheme_invalid"></a>`backend_url_scheme_invalid` | 400 | Схема baseUrl должна быть http или https. | Исправьте name или baseUrl (абсолютный http/https URL без userinfo, query и fragment) и повторите. |
| <a id="basic_config_invalid"></a>`basic_config_invalid` | 400 | config профиля Basic должен быть пустым. | Сверьте adapterId, config и credentials с описанием адаптера в документации профилей аутентификации, исправьте названное в message поле и повторите. Секреты передавайте только в credentials. |
| <a id="basic_credentials_required"></a>`basic_credentials_required` | 400 | Для Basic нужны username и password в credentials. | Сверьте adapterId, config и credentials с описанием адаптера в документации профилей аутентификации, исправьте названное в message поле и повторите. Секреты передавайте только в credentials. |
| <a id="bearer_config_invalid"></a>`bearer_config_invalid` | 400 | config профиля Bearer должен быть пустым. | Сверьте adapterId, config и credentials с описанием адаптера в документации профилей аутентификации, исправьте названное в message поле и повторите. Секреты передавайте только в credentials. |
| <a id="bearer_token_required"></a>`bearer_token_required` | 400 | Для Bearer нужен credentials.token. | Сверьте adapterId, config и credentials с описанием адаптера в документации профилей аутентификации, исправьте названное в message поле и повторите. Секреты передавайте только в credentials. |
| <a id="credential_invalid"></a>`credential_invalid` | 400 | Каждое значение credentials должно быть непустой строкой. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="credentials_invalid"></a>`credentials_invalid` | 400 | credentials должен быть объектом с именованными строковыми значениями. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="integration_fields_required"></a>`integration_fields_required` | 400 | Интеграции нужны displayName и version. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="integration_input_invalid"></a>`integration_input_invalid` | 400 | Данные интеграции некорректны. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="oauth2_client_authentication_invalid"></a>`oauth2_client_authentication_invalid` | 400 | clientAuthentication должен быть client_secret_basic или client_secret_post. | Сверьте adapterId, config и credentials с описанием адаптера в документации профилей аутентификации, исправьте названное в message поле и повторите. Секреты передавайте только в credentials. |
| <a id="oauth2_client_credentials_config_invalid"></a>`oauth2_client_credentials_config_invalid` | 400 | Для client credentials нужны tokenEndpoint и clientId. | Сверьте adapterId, config и credentials с описанием адаптера в документации профилей аутентификации, исправьте названное в message поле и повторите. Секреты передавайте только в credentials. |
| <a id="oauth2_client_secret_required"></a>`oauth2_client_secret_required` | 400 | Нужен credentials.clientSecret. | Сверьте adapterId, config и credentials с описанием адаптера в документации профилей аутентификации, исправьте названное в message поле и повторите. Секреты передавайте только в credentials. |
| <a id="oauth2_password_config_invalid"></a>`oauth2_password_config_invalid` | 400 | Для password grant нужны tokenEndpoint и clientId. | Сверьте adapterId, config и credentials с описанием адаптера в документации профилей аутентификации, исправьте названное в message поле и повторите. Секреты передавайте только в credentials. |
| <a id="oauth2_password_credentials_required"></a>`oauth2_password_credentials_required` | 400 | Нужны credentials.username и credentials.password. | Сверьте adapterId, config и credentials с описанием адаптера в документации профилей аутентификации, исправьте названное в message поле и повторите. Секреты передавайте только в credentials. |
| <a id="oidc_config_invalid"></a>`oidc_config_invalid` | 400 | Для OIDC нужны issuer и clientId. | Сверьте adapterId, config и credentials с описанием адаптера в документации профилей аутентификации, исправьте названное в message поле и повторите. Секреты передавайте только в credentials. |
| <a id="oidc_credentials_forbidden"></a>`oidc_credentials_forbidden` | 400 | Профиль OIDC не хранит credentials. | Сверьте adapterId, config и credentials с описанием адаптера в документации профилей аутентификации, исправьте названное в message поле и повторите. Секреты передавайте только в credentials. |
| <a id="secret_field_forbidden"></a>`secret_field_forbidden` | 400 | Секрет передан вне credentials. | Перенесите секретные значения в верхнеуровневое поле credentials и повторите. |

## ИИ-ассистент и каталог моделей {#ai}

| Код | HTTP | Смысл | Действие |
| --- | --- | --- | --- |
| <a id="ai.adapter_invalid"></a>`ai.adapter_invalid` | 400 | adapter должен быть anthropic или ollama. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="ai.base_url_invalid"></a>`ai.base_url_invalid` | 400 | baseUrl должен быть абсолютным http/https URL. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="ai.clarification_linkage_invalid"></a>`ai.clarification_linkage_invalid` | 400 | Связь с уточнением в запуске AI неполная или неверная. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="ai.connection_forbidden"></a>`ai.connection_forbidden` | 403 | Пользователь не может управлять этим AI-подключением. | Не повторяйте. Проверьте роль через GET /api/session/me (MCP: endge_status). Попросите пользователя выдать нужную роль или выполнить операцию самому. |
| <a id="ai.connection_not_found"></a>`ai.connection_not_found` | 404 | AI-подключение не найдено. | Не повторяйте с тем же значением. Проверьте identity/id по списку (для удалённых — includeDeleted=true) и workspace в X-Endge-Workspace; затем повторите с правильным значением. |
| <a id="ai.conversation_conflict"></a>`ai.conversation_conflict` | 409 | Состояние AI-диалога не допускает операцию (например, идёт запуск). | Перечитайте диалог и повторите после завершения текущего запуска. |
| <a id="ai.conversation_not_found"></a>`ai.conversation_not_found` | 404 | AI-диалог не найден. | Не повторяйте с тем же значением. Проверьте identity/id по списку (для удалённых — includeDeleted=true) и workspace в X-Endge-Workspace; затем повторите с правильным значением. |
| <a id="ai.credential_required"></a>`ai.credential_required` | 400 | Нужен credential AI-подключения. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="ai.field_required"></a>`ai.field_required` | 400 | Обязательное поле AI-каталога не заполнено (имя поля в message). | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="ai.field_too_long"></a>`ai.field_too_long` | 400 | Поле AI-каталога длиннее 160 символов (имя поля в message). | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="ai.model_forbidden"></a>`ai.model_forbidden` | 403 | Пользователь не может управлять этим профилем модели. | Не повторяйте. Проверьте роль через GET /api/session/me (MCP: endge_status). Попросите пользователя выдать нужную роль или выполнить операцию самому. |
| <a id="ai.model_not_found"></a>`ai.model_not_found` | 404 | Профиль AI-модели не найден. | Не повторяйте с тем же значением. Проверьте identity/id по списку (для удалённых — includeDeleted=true) и workspace в X-Endge-Workspace; затем повторите с правильным значением. |
| <a id="ai.model_unavailable"></a>`ai.model_unavailable` | 409 | Выбранная AI-модель больше недоступна. | Выберите другую модель из GET /api/v1/ai/model-profiles и повторите. |
| <a id="ai.private_default_forbidden"></a>`ai.private_default_forbidden` | 400 | Приватная модель не может быть моделью платформы по умолчанию. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="ai.run_invalid"></a>`ai.run_invalid` | 400 | Для запуска AI нужны requestId и prompt. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="ai.viewer_required"></a>`ai.viewer_required` | 403 | Для AI-ассистента нужна роль Viewer workspace. | Не повторяйте. Проверьте роль через GET /api/session/me (MCP: endge_status). Попросите пользователя выдать нужную роль или выполнить операцию самому. |
| <a id="ai.visibility_invalid"></a>`ai.visibility_invalid` | 400 | visibility должен быть public или private. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="ai.workbench_bad_gateway"></a>`ai.workbench_bad_gateway` | 502 | AI Workbench вернул некорректный ответ. | Повторите один раз; при повторе ошибки не продолжайте и сообщите пользователю code и операцию. |
| <a id="ai.workbench_request_invalid"></a>`ai.workbench_request_invalid` | 400 | AI Workbench отклонил запрос как некорректный. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="ai.workbench_timeout"></a>`ai.workbench_timeout` | 504 | AI Workbench не ответил вовремя. | Повторите позже с паузой (например, 2, 5, 15 секунд); не более 3 попыток. Если не помогло — сообщите пользователю. |
| <a id="ai.workbench_unavailable"></a>`ai.workbench_unavailable` | 503 | AI Workbench недоступен. | Повторите позже с паузой (например, 2, 5, 15 секунд); не более 3 попыток. Если не помогло — сообщите пользователю. |

## Mock Generator и потоки тестовых данных {#mock}

| Код | HTTP | Смысл | Действие |
| --- | --- | --- | --- |
| <a id="mock.invalid_response"></a>`mock.invalid_response` | 502 | Mock Generator вернул некорректный ответ или поток. | Повторите один раз; при повторе ошибки не продолжайте и сообщите пользователю code и операцию. |
| <a id="mock.timeout"></a>`mock.timeout` | 504 | Mock Generator не подтвердил поток вовремя. | Повторите позже с паузой (например, 2, 5, 15 секунд); не более 3 попыток. Если не помогло — сообщите пользователю. |
| <a id="mock.unavailable"></a>`mock.unavailable` | 503 | Mock Generator недоступен или backend останавливается. | Повторите позже с паузой (например, 2, 5, 15 секунд); не более 3 попыток. Если не помогло — сообщите пользователю. |
| <a id="mock.upstream_error"></a>`mock.upstream_error` | 502 | Запрос к Mock Generator завершился ошибкой без собственного кода; статус выводится из gRPC-кода (обычно 502). | Повторите один раз; при повторе ошибки не продолжайте и сообщите пользователю code и операцию. |
| <a id="mock.viewer_required"></a>`mock.viewer_required` | 403 | Для Mock Generator нужна роль Viewer workspace. | Не повторяйте. Проверьте роль через GET /api/session/me (MCP: endge_status). Попросите пользователя выдать нужную роль или выполнить операцию самому. |
| <a id="request.invalid"></a>`request.invalid` | 400 | Тело запроса Mock Generator должно быть JSON-объектом. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="request.too_large"></a>`request.too_large` | 413 | Тело запроса превышает лимит байтов. | Уменьшите запрос (меньше схема или количество) и повторите. |
| <a id="stream.already_subscribed"></a>`stream.already_subscribed` | 409 | У потока уже есть подписчик (допускается один). | Закройте другую подписку или создайте новый поток. |
| <a id="stream.backpressure"></a>`stream.backpressure` | 429 | Клиент не успевает читать поток — буфер backend исчерпан. | Читайте события быстрее или уменьшите скорость генерации; создайте поток заново. |
| <a id="stream.limit_exceeded"></a>`stream.limit_exceeded` | 429 | Исчерпан лимит одновременных потоков. | Остановите ненужные потоки (DELETE /api/v1/mock-data/streams/{id}) и повторите позже. |
| <a id="stream.not_found"></a>`stream.not_found` | 404 | Поток не существует или истёк. | Создайте новый поток. |
| <a id="stream.replay_unsupported"></a>`stream.replay_unsupported` | 409 | Повтор событий по Last-Event-ID не поддерживается. | Не передавайте Last-Event-ID; для продолжения создайте новый поток. |

## Общие и внутренние ошибки {#internal}

| Код | HTTP | Смысл | Действие |
| --- | --- | --- | --- |
| <a id="common.conflict"></a>`common.conflict` | 409 | Состояние на сервере конфликтует с запросом. | Перечитайте затронутые сущности и повторите запрос с актуальными данными. |
| <a id="common.forbidden"></a>`common.forbidden` | 403 | Недостаточно прав для операции. | Не повторяйте. Проверьте роль через GET /api/session/me (MCP: endge_status). Попросите пользователя выдать нужную роль или выполнить операцию самому. |
| <a id="common.internal"></a>`common.internal` | 500 | Неожиданная ошибка сервера; причина записана в журнал backend и в ответ не передаётся. | Не меняйте запрос ради исправления. Для чтения можно повторить один раз через несколько секунд; перед повтором изменения сначала перечитайте состояние, чтобы не применить его дважды. Если ошибка повторяется, сообщите пользователю code, операцию и время. |
| <a id="common.invalid_input"></a>`common.invalid_input` | 400 | Запрос некорректен. | Не повторяйте запрос без изменений. Исправьте поле, названное в message (и в details.field, если оно есть), по схеме операции в OpenAPI и отправьте запрос снова. |
| <a id="common.not_found"></a>`common.not_found` | 404 | Запрошенная сущность не найдена в текущем workspace, удалена или недоступна этому пользователю. | Не повторяйте с тем же значением. Проверьте identity/id по списку (для удалённых — includeDeleted=true) и workspace в X-Endge-Workspace; затем повторите с правильным значением. |
| <a id="common.unauthorized"></a>`common.unauthorized` | 401 | Запрос не аутентифицирован или аутентификация недействительна. | Передайте Authorization: Bearer &lt;JWT access token провайдера OIDC \| персональный токен endge_pat_…&gt;. Если токен уже передан — он просрочен или недействителен: получите новый (для браузера — loginUrl из ответа). |
| <a id="internal_error"></a>`internal_error` | 500 | Неожиданная ошибка MCP-инструмента (статус 5xx); причина записана в журнал backend. | Не меняйте запрос ради исправления. Для чтения можно повторить один раз через несколько секунд; перед повтором изменения сначала перечитайте состояние, чтобы не применить его дважды. Если ошибка повторяется, сообщите пользователю code, операцию и время. |
| <a id="request_contract_missing"></a>`request_contract_missing` | 500 | Для операции не настроен контракт проверки запроса (ошибка сборки сервера). | Не меняйте запрос ради исправления. Для чтения можно повторить один раз через несколько секунд; перед повтором изменения сначала перечитайте состояние, чтобы не применить его дважды. Если ошибка повторяется, сообщите пользователю code, операцию и время. |
| <a id="snapshot_mapping_failed"></a>`snapshot_mapping_failed` | 500 | Не удалось разобрать снимок workspace в MCP-инструменте. | Не меняйте запрос ради исправления. Для чтения можно повторить один раз через несколько секунд; перед повтором изменения сначала перечитайте состояние, чтобы не применить его дважды. Если ошибка повторяется, сообщите пользователю code, операцию и время. |
| <a id="transport_mapping_failed"></a>`transport_mapping_failed` | 500 | Не удалось сформировать ответ из данных сервера. | Не меняйте запрос ради исправления. Для чтения можно повторить один раз через несколько секунд; перед повтором изменения сначала перечитайте состояние, чтобы не применить его дважды. Если ошибка повторяется, сообщите пользователю code, операцию и время. |

## Коды, которые приходят во время выполнения {#dynamic}

- Mock Generator передаёт собственный код в gRPC ErrorInfo (domain mockdata.v1, reason); backend отдаёт его как code без изменений, статус выводится из gRPC-кода (400, 404, 409, 413, 429, 499, 502, 503, 504). Без ErrorInfo используется mock.upstream_error. Смысл таких кодов описан в документации Mock Generator.
