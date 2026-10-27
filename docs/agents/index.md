# Endge для ИИ-агентов

Эта страница написана для языковой модели или агента, которому пользователь дал
документацию Endge и попросил работать с его рабочим пространством. Агент
подключается к Service Backend напрямую по HTTP от имени пользователя: читает и
изменяет документы конфигурации, проверяет и фиксирует изменения.

Самый простой доступ — [персональный токен](/agents/tokens) `endge_pat_…`, который
пользователь выпускает в Configurator кнопкой «Для агента» вместе с готовым
промптом. Если у агента есть MCP-клиент, подключите [MCP-сервер backend](/agents/mcp)
`/mcp` с тем же токеном. Без MCP достаточно этой страницы и [справочника API](#справочник-api).

## Что такое Endge в терминах API

- **Service Backend** — HTTP-сервер (REST/JSON) с PostgreSQL. Он хранит
  конфигурацию приложений, которую пользователи собирают в Configurator.
- **Workspace** (рабочее пространство) — изолированный набор документов.
  Почти все запросы `/api/v1/*` требуют заголовок `X-Endge-Workspace: <identity>`.
- **Документ** — единица конфигурации: запрос данных, компонент, хранилище,
  действие, вычисление и т. д. Документы лежат в коллекциях: `/api/v1/queries`,
  `/api/v1/components` и других. У каждого документа есть уникальный в коллекции
  `identity`, `displayName`, необязательные `description`, `meta`,
  `folderIdentity` и счётчик `revision`.
- **Source** — большинство документов описывается исходным кодом на
  TypeScript-подобном DSL в поле `source`, например `defineQuery({...})`. Формат
  каждого типа описан в разделе «Справочник»: [Query](/reference/query),
  [Component SFC](/reference/component-sfc), [Composition](/reference/composition),
  [Computation](/reference/computation), [Type](/reference/type) и других.
  Номер формата хранится в `sourceVersion`.
- **Revision** — номер версии документа. Каждое изменение увеличивает его на
  единицу. Изменение и удаление требуют текущей revision в заголовке `If-Match`.
- **Commit** — фиксация накопленных revisions с сообщением, как коммит в Git.
  **Release** — неизменяемый переносимый снимок коммита.

## Адрес сервера

Спросите у пользователя адрес Service Backend, если его нет в контексте.

- Локальная разработка: `http://localhost:8080`.
- Сервер может работать под префиксом пути (`HTTP_BASE_PATH`), например
  `https://example.com/endge`. Тогда все пути ниже добавляются к этому префиксу.
- Проверка доступности без входа: `GET /health` и `GET /version`.

```bash
curl -s "$ENDGE_URL/health"
curl -s "$ENDGE_URL/version"
```

## Вход от имени пользователя

Если пользователь дал персональный токен `endge_pat_…`, вход не нужен: передавайте
его в `Authorization: Bearer` и пропустите шаги ниже. Права и ограничения токена
описаны на странице [Персональные токены](/agents/tokens).

Service Backend не принимает логин и пароль сам. Пользователь входит через
OIDC-провайдера (обычно Keycloak), а backend проверяет JWT access token этого
провайдера. Агенту нужен такой токен. Каждый запрос он отправляет с заголовком:

```http
Authorization: Bearer <access_token>
```

### Шаг 1. Узнать режим сервера

```bash
curl -s -i "$ENDGE_URL/auth/session"
```

- `200` без заголовка `Authorization` — сервер в режиме разработки
  (`AUTH_MODE=dev`). Все запросы выполняются от фиксированного пользователя
  разработки, токен не нужен. Переходите к разделу [Рабочее пространство](#рабочее-пространство).
  `/auth/session` служит только для проверки входа; роли и workspace отдаёт
  `GET /api/session/me`.
- `401` с телом `{"code":"unauthorized","message":"authentication required","loginUrl":"..."}` —
  нужен токен. `loginUrl` предназначен для браузера пользователя: он запускает
  вход в Configurator и выдаёт cookie-сессию, а не токен. Агенту нужен один из
  способов ниже.

### Шаг 2. Получить параметры провайдера

Для получения токена нужны:

- **issuer** — адрес realm провайдера, например
  `https://keycloak.example/realms/endge`;
- **client_id** клиента, через которого входят агенты.

Спросите их у пользователя или его администратора. Endpoints провайдера агент
узнаёт сам из стандартного discovery-документа:

```bash
curl -s "$ISSUER/.well-known/openid-configuration"
# token_endpoint, device_authorization_endpoint, ...
```

Клиент Configurator (`endge-configurator`) обычно конфиденциальный: он требует
секрет, которого у агента нет. Поэтому для агентов администратор создаёт
отдельный публичный клиент. Настройка описана в разделе
[Подготовка провайдера администратором](#подготовка-провайдера-администратором).

### Шаг 3. Получить access token

Выберите первый доступный способ.

**A. Вход через браузер по коду (Device Authorization Grant). Рекомендуется.**
Пароль не проходит через агента. Пользователь входит на странице своего
провайдера, в том числе с 2FA.

```bash
curl -s -X POST "$DEVICE_AUTHORIZATION_ENDPOINT" \
  -d "client_id=$CLIENT_ID" -d "scope=openid profile"
# {"device_code":"...","user_code":"ABCD-EFGH","verification_uri":"...",
#  "verification_uri_complete":"...","expires_in":600,"interval":5}
```

Покажите пользователю `verification_uri_complete` (или `verification_uri` и
`user_code`) и попросите войти. Затем опрашивайте token endpoint не чаще
`interval` секунд:

```bash
curl -s -X POST "$TOKEN_ENDPOINT" \
  -d "grant_type=urn:ietf:params:oauth:grant-type:device_code" \
  -d "client_id=$CLIENT_ID" -d "device_code=$DEVICE_CODE"
```

Ответ `authorization_pending` означает «пользователь ещё не вошёл», `slow_down` —
«увеличьте интервал на 5 секунд», `expired_token` — «начните заново». Успешный
ответ содержит `access_token`, `expires_in` и обычно `refresh_token`.

**B. Логин и пароль (Resource Owner Password Credentials).** Используйте, только
если пользователь сам предпочёл этот способ и у клиента включены Direct Access
Grants. Способ не работает с 2FA и внешними identity providers и считается
устаревшим в OAuth 2.1.

```bash
curl -s -X POST "$TOKEN_ENDPOINT" \
  -d "grant_type=password" -d "client_id=$CLIENT_ID" \
  -d "scope=openid profile" \
  --data-urlencode "username=$USERNAME" --data-urlencode "password=$PASSWORD"
```

Правила для пароля:

- спросите логин и пароль явно и объясните, что они уйдут только на token
  endpoint провайдера, а не в Endge;
- держите пароль только в памяти на время одного запроса, не сохраняйте его в
  файлы, историю команд, логи или ответы;
- если ответ `unauthorized_client` или `invalid_grant` с текстом о запрещённом
  grant, этот способ выключен: перейдите к способу A.

**C. Готовый токен.** Пользователь может сам получить access token (например,
через `kcadm`, Postman или свою утилиту) и передать его агенту.

**D. Сервисный аккаунт (Client Credentials).** Для автоматизации без человека
администратор создаёт конфиденциальный клиент с service account и выдаёт агенту
`client_id` и `client_secret`. Действия выполняются от имени сервисного
аккаунта, а не пользователя.

```bash
curl -s -X POST "$TOKEN_ENDPOINT" -d "grant_type=client_credentials" \
  -d "client_id=$CLIENT_ID" --data-urlencode "client_secret=$CLIENT_SECRET"
```

### Требования backend к токену

Backend проверяет подпись (по JWKS провайдера), алгоритм, `iss`, `aud`, `kid`,
`sub`, `exp` и наличие `iat`.

- `aud` должен содержать одно из значений `AUTH_ALLOWED_AUDIENCES` сервера
  (обычно `endge-configurator`). Токен публичного клиента агентов получает это
  значение через audience mapper.
- Права берутся из claims access token, если сервер работает во внешнем режиме
  прав (см. [внешние права](/configurator/authentication/access-configuration)).
  Иначе — из назначений, которые хранит Endge.
- Токен с `iat` более чем на 30 секунд в будущем отклоняется.

### Обновление токена

До истечения `expires_in` обновите токен:

```bash
curl -s -X POST "$TOKEN_ENDPOINT" -d "grant_type=refresh_token" \
  -d "client_id=$CLIENT_ID" -d "refresh_token=$REFRESH_TOKEN"
```

Ответы backend, связанные с токеном:

| Ответ | Что делать |
| --- | --- |
| `401 unauthorized` | Токен отсутствует, истёк или не прошёл проверку. Обновите или получите заново |
| `403 external_access_stale` | Пришёл токен старше уже применённого. Получите новый токен |
| `403 external_access_ambiguous` | Два токена с одинаковым `iat` дали разные права. Получите новый токен |
| Другие `403` | Нет роли для операции. Сообщите пользователю |

Не печатайте токены и refresh token в ответах пользователю и не записывайте их
в файлы без его просьбы.

## Рабочее пространство

```bash
curl -s "$ENDGE_URL/api/session/me" -H "Authorization: Bearer $TOKEN"
```

Ответ содержит пользователя, признак `platformAdmin` и список `workspaces` с
ролями. Роли:

| Роль | Что разрешено |
| --- | --- |
| Viewer | Чтение документов workspace |
| Editor | Чтение и изменение документов |
| Admin | Администрирование workspace |
| Platform Admin | Всё во всех workspace |

Если workspace несколько, спросите пользователя, с каким работать. Дальше
передавайте его `identity` во всех запросах к документам, папкам, фасетам,
домену (`/api/v1/domain*`), коммитам и релизам — в том числе в чтении. Без
заголовка сервер ответит `400 workspace_required`. Для конкретной операции
заголовок указан в справочнике API параметром `X-Endge-Workspace`:

```http
X-Endge-Workspace: default
```

## Чтение

Весь workspace одним ответом (документы всех коллекций; revision, автор и время
изменения каждого документа лежат в его поле `state`):

```bash
curl -s "$ENDGE_URL/api/v1/domain" \
  -H "Authorization: Bearer $TOKEN" -H "X-Endge-Workspace: $WS"
```

Список одной коллекции с пагинацией (`limit` до 500, `offset`) и фильтрами
`folderIdentity`, `active`, `includeDeleted`:

```bash
curl -s "$ENDGE_URL/api/v1/queries?limit=100&offset=0" \
  -H "Authorization: Bearer $TOKEN" -H "X-Endge-Workspace: $WS"
# {"items":[...],"total":1,"limit":100,"offset":0}
```

Один документ: `GET /api/v1/<коллекция>/<identity>`. Текущая revision приходит в
поле `revision` и в заголовке `ETag`.

### Коллекции документов

| Коллекция | Документ | Схемы в справочнике API | Описание |
| --- | --- | --- | --- |
| `types` | Type | `domain_type.*` | Типы данных |
| `queries` | Query | `query.*` | Получение данных по REST или GraphQL ([руководство GraphQL](/guides/graphql)) |
| `streams` | Stream | `stream.*` | Потоки данных |
| `data-views` | DataView | `data_view.*` | Представления данных |
| `filters` | Filter | `filter.*` | Фильтры |
| `converters` | Converter | `converter.*` | Преобразователи значений |
| `computations` | Computation | `computation.*` | Вычисления |
| `stores` | Store | `store.*` | Хранилища состояния |
| `updates` | Update | `update.*` | Изменения данных |
| `simulations` | Simulation | `simulation.*` | Симуляции |
| `mocks` | Mock | `mock.*` | Тестовые данные |
| `vocabs` | Vocab | `vocab.*` | Справочники |
| `i18n-bundles` | I18n bundle | `i18n_bundle.*` | Переводы |
| `components` | Component | `component.*` | Компоненты интерфейса (SFC, таблицы) |
| `compositions` | Composition | `composition.*` | Связывание компонентов и данных |
| `actions` | Action | `action.*` | Действия |
| `navigations` | Navigation | `navigation.*` | Навигация |
| `styles` | Style | `style.*` | Стили |
| `auth-profiles` | AuthProfile | `auth_profile.*` | Аутентификация интеграций конечного приложения |
| `configurations` | Configuration | `configuration.*` | Конфигурации приложения |
| `integrations` | Integration | `integration.*` | Подключённые интеграции |
| `folders` | Folder | `folder.*` | Папки |
| `facets` | Facet | `facet.*` | Фасеты и их документы (`/facets/{facetIdentity}/documents`) |

Точные поля создания и изменения — в схемах справочника API из колонки «Схемы»:
`query.CreateRequest`, `query.PatchRequest`, `query.Response` и т. д.
Смысл документов и их связи описаны в разделе [Сущности Endge](/domain/entities).

## Изменение

### Создание

Минимальный Query: REST-запрос `GET https://api.example.com/orders`, output
`raw` берёт поле `items` ответа. `endpoint` — строка с базовым адресом или
`env('ИМЯ')`, `path` — путь. Остальные поля из [полного примера](/reference/query)
(`props`, `headers`, `auth`, `mock` и другие) необязательны.

```ts
defineQuery({
  kind: 'rest',
  request: { endpoint: 'https://api.example.com', path: '/orders', method: 'GET' },
  outputs: { raw: output().from(response('items')) },
})
```

Тот же документ в запросе на создание (source передаётся строкой JSON):

```bash
curl -s -X POST "$ENDGE_URL/api/v1/queries" \
  -H "Authorization: Bearer $TOKEN" -H "X-Endge-Workspace: $WS" \
  -H "Content-Type: application/json" \
  -d @- <<'JSON'
{
  "identity": "orders",
  "displayName": "Заказы",
  "sourceVersion": 2,
  "source": "defineQuery({\n  kind: 'rest',\n  request: { endpoint: 'https://api.example.com', path: '/orders', method: 'GET' },\n  outputs: { raw: output().from(response('items')) },\n})"
}
JSON
```

- `identity` уникален в коллекции, до 160 символов.
- `sourceVersion` берите из существующего документа того же типа. Для новых
  документов Query актуальна версия `2`, для остальных source-документов — `1`.
- Пишите `source` по формату из справочника типа и сверяйтесь с примерами.
  Перед созданием прочитайте 1–2 существующих документа того же типа.
- **Сервер не проверяет `source`**: он хранит его как текст и примет даже
  синтаксически неверный код. Ошибки покажет компилятор Configurator при
  открытии документа. Поэтому строго следуйте синтаксису из справочника и
  после записи предложите пользователю открыть документ в Configurator.

### Изменение и удаление

```bash
curl -s -X PATCH "$ENDGE_URL/api/v1/queries/orders" \
  -H "Authorization: Bearer $TOKEN" -H "X-Endge-Workspace: $WS" \
  -H "Content-Type: application/json" -H 'If-Match: "3"' \
  -d '{"displayName":"Заказы клиентов"}'
```

- `PATCH` меняет только переданные поля.
- `If-Match` содержит текущую revision в кавычках. Без него сервер вернёт `428`,
  с устаревшей revision — `409` (`revision_conflict`). При `409` перечитайте
  документ, примените изменение к новой версии и повторите.
- В ответе новая revision приходит в теле и в `ETag`.
- `DELETE /api/v1/<коллекция>/<identity>` с `If-Match` выполняет мягкое удаление.
  `POST /api/v1/<коллекция>/<identity>/restore` восстанавливает документ.
- `POST /api/v1/domain/documents/move` атомарно переносит до 500 документов в
  одну папку.
- История revisions документа:
  `GET /api/v1/domain/documents/{type}/{identity}/revisions`, где `{type}` — имя
  коллекции, например `queries`.

### Фиксация изменений

Изменения сразу сохраняются в базе как revisions, но не входят в историю, пока
их не зафиксируют коммитом.

1. `POST /api/v1/commits/plan` с телом `{}` ничего не меняет и возвращает
   число ожидающих revisions и документов, авторов и `headSequence`. Списка
   изменённых документов в ответе нет: чтобы назвать их пользователю,
   сравните `state.revision` и `state.updatedAt` документов из `GET /api/v1/domain`
   с моментом последнего коммита (`GET /api/v1/commits`) или посмотрите историю
   нужных документов. После коммита его состав отдаёт `GET /api/v1/commits/{id}/diff`.
2. `POST /api/v1/commits` с телом
   `{"message":"...","expectedHeadSequence":<headSequence из плана>,"revisionPolicy":"preserve"}`
   создаёт коммит. `squash` объединяет revisions одного документа. Если за это
   время кто-то зафиксировал изменения, сервер вернёт `409 head_sequence_conflict`:
   запросите план заново.
3. `POST /api/v1/releases` создаёт неизменяемый релиз из коммита.

Коммит и релиз видят все участники workspace. Выполняйте их только по прямой
просьбе пользователя.

### Перенос workspace

- `GET /api/v1/domain/export` — переносимый пакет текущего состояния без
  истории, ролей и секретов.
- `POST /api/v1/domain/import/plan` проверяет пакет, ничего не меняя.
  `POST /api/v1/domain/import` применяет его.

## Ошибки

Ошибки возвращаются в одном формате:

```json
{ "code": "validation_error", "message": "Запрос не прошёл валидацию", "details": { "fields": { "identity": "..." } } }
```

| Код HTTP | Значение |
| --- | --- |
| `400` | `validation_error`: смотрите `details.fields`. `workspace_required`: нет заголовка `X-Endge-Workspace` |
| `401` | Нет действующего токена; для персонального токена — `access_token_invalid`, `access_token_revoked`, `access_token_expired` |
| `403` | Нет роли или права управляются внешним провайдером (`access_managed_externally`); для персонального токена — коды `access_token_*` ([список](/agents/tokens#ошибки)) |
| `404` | Документ не найден или `workspace_not_found` |
| `409` | Конфликт: `identity_conflict`, `revision_conflict` или `head_sequence_conflict` |
| `428` | `precondition_required`: нет заголовка `If-Match` |

## Порядок работы агента

1. Проверьте `GET /health`, определите режим входа и получите токен.
2. Прочитайте `GET /api/session/me` и выберите workspace вместе с пользователем.
3. Прочитайте затронутые документы и 1–2 похожих документа того же типа.
4. Сформулируйте изменение и для заметных правок покажите его пользователю до записи.
5. Пишите минимальными `PATCH` с актуальной revision. При `409` перечитайте документ.
6. Удаление, импорт, коммит, релиз, изменение прав и операции администратора
   выполняйте только по явной просьбе пользователя.
7. После записи перечитайте документ и сообщите пользователю итог: identity, новую revision.

## Подготовка провайдера администратором

Чтобы агенты входили от имени пользователей, администратор Keycloak один раз
создаёт клиент, например `endge-agent`:

1. **Client authentication** выключен (публичный клиент).
2. **OAuth 2.0 Device Authorization Grant** включён.
3. **Direct access grants** включается, только если нужен вход по паролю.
4. **Audience mapper** добавляет в access token значение из
   `AUTH_ALLOWED_AUDIENCES` backend (обычно `endge-configurator`).
5. В access token попадают claims, которые используют правила
   [внешних прав](/configurator/authentication/access-configuration)
   (например, роли клиента `endge-configurator`).
6. Пользователю сообщают `issuer` и `client_id` = `endge-agent`.

Backend при этом перенастраивать не нужно: он проверяет любой токен своего
issuer с подходящим audience.

## MCP-сервер

Backend отвечает как MCP-сервер на `{HTTP_BASE_PATH}/mcp` (Streamable HTTP) и
принимает персональные токены и JWT. Инструменты, подключение клиентов и
ограничения описаны на странице [MCP-сервер backend](/agents/mcp). Там же —
отдельный Node-пакет `@endge/mcp` со входом через device flow.

## Справочник API

- Полный справочник всех операций и схем в Markdown — в файле
  `llms-full/api.txt` рядом с `llms.txt` этого сайта. Он генерируется из
  спецификации OpenAPI при сборке документации.
- Машиночитаемая спецификация OpenAPI 3:
  <https://github.com/endge-lab/service-backend/blob/main/docs/openapi3.yaml>.
- Сервер вне production отдаёт её по адресу `/swagger/openapi3.yaml`, а
  интерактивную документацию — по `/swagger`.

## Исходный код

Публичные репозитории Endge, в которых можно проверить поведение:

- Service Backend (Go): <https://github.com/endge-lab/service-backend>
- Configurator (Vue): <https://github.com/endge-lab/configurator>
- `@endge/core` — домен, компиляторы Source, runtime: <https://github.com/endge-lab/core>
- `@endge/ui-vue`: <https://github.com/endge-lab/ui-vue>
- `@endge/utils`: <https://github.com/endge-lab/utils>
- `@endge/computation-sandbox`: <https://github.com/endge-lab/computation-sandbox>
- Общая библиотека Go-сервисов: <https://github.com/endge-lab/service-kit-go>
- Эта документация: <https://github.com/endge-lab/configurator-docs>
