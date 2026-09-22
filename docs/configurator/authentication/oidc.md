# OIDC

OIDC-адаптер обеспечивает вход в конфигуратор через Keycloak или другого совместимого провайдера. Браузер проходит вход у провайдера, а обмен кода и хранение серверной сессии принадлежат backend Endge.

::: warning Текущая реализация и проект
OIDC-вход, проверка JWT и refresh сессии уже реализованы. Разделы «Проект» описывают новую синхронизацию прав из claims. `endge-access.yaml`, `ACCESS_CONFIG_FILE` и внешнее управление назначениями пока не реализованы.
:::

## Механика входа

1. Конфигуратор направляет браузер на backend `/auth/login`, передавая адрес возврата через `returnTo`.
2. Backend создаёт одноразовую login transaction и отправляет браузер к OIDC provider. Используются Authorization Code, PKCE S256, `state` и `nonce`.
3. Провайдер возвращает браузер на `/auth/callback` backend.
4. Backend проверяет login transaction, обменивает код на токены и проверяет identity. В текущем callback для identity выбирается ID token, а при его отсутствии — access token.
5. Backend создаёт серверную сессию и выдаёт браузеру opaque `HttpOnly` cookie. Refresh token хранится зашифрованным на backend; токены провайдера не передаются frontend конфигуратора.
6. Браузер возвращается на разрешённый адрес конфигуратора. Защищённые API-запросы используют cookie.

Адрес Keycloak callback всегда указывает на backend. `returnTo` не заменяет `AUTH_REDIRECT_URL`: backend отдельно проверяет origin возвращаемого frontend URL по своему allowlist.

## Регистрация клиента Keycloak

Создайте OIDC client для конфигуратора и включите Standard Flow. Разрешите PKCE S256. Клиент должен выдавать ID token для входа и refresh token для продолжения сессии. Если включена аутентификация клиента, передайте его secret только backend через `AUTH_CLIENT_SECRET`.

Для примера ниже зарегистрируйте:

| Настройка | Пример |
| --- | --- |
| Realm | `endge` |
| Client ID | `endge-configurator` |
| Redirect URI | `https://backend.example.com/auth/callback` |
| Frontend URL | `https://configurator.example.com` |

Redirect URI должен совпадать со схемой, host, портом и путём реального backend. Настройте audience выдаваемых токенов согласно `AUTH_ALLOWED_AUDIENCES`. Для access token, используемого API и будущим маппингом, при необходимости добавьте audience mapper. Секреты не размещаются в `VITE_*` или workspace-документах.

Проверьте адреса endpoints по discovery document вашего realm. Текущий адаптер принимает явно настроенные URL и не обещает автоматически заполнить их из discovery.

## Переменные backend

Пример ниже дополняет настройки PostgreSQL, HTTP и шифрования из [установки](../installation). Домены и client ID заменяются на реальные значения вашей среды.

```dotenv
APP_ENV=production
PUBLIC_URL=https://backend.example.com
CORS_ALLOWED_ORIGINS=https://configurator.example.com
AUTH_MODE=oidc
AUTH_PROVIDER_ID=primary
AUTH_ISSUER=https://keycloak.example.com/realms/endge
AUTH_JWKS_URL=https://keycloak.example.com/realms/endge/protocol/openid-connect/certs
AUTH_ALLOWED_AUDIENCES=endge-configurator
AUTH_ALLOWED_ALGORITHMS=RS256
AUTH_USERNAME_CLAIM=preferred_username
AUTH_DISPLAY_NAME_CLAIM=name
AUTH_GROUPS_CLAIM=groups
AUTH_LOGIN_ADAPTER=oidc
AUTH_AUTHORIZATION_URL=https://keycloak.example.com/realms/endge/protocol/openid-connect/auth
AUTH_TOKEN_URL=https://keycloak.example.com/realms/endge/protocol/openid-connect/token
AUTH_LOGOUT_URL=https://keycloak.example.com/realms/endge/protocol/openid-connect/logout
AUTH_CLIENT_ID=endge-configurator
AUTH_SCOPES=openid,profile,email
AUTH_REDIRECT_URL=https://backend.example.com/auth/callback
AUTH_RETURN_URL=https://configurator.example.com
AUTH_ALLOWED_RETURN_ORIGINS=https://configurator.example.com
AUTH_SESSION_TTL=8h
AUTH_COOKIE_SECURE=true
AUTH_COOKIE_SAME_SITE=lax
```

При client authentication дополнительно передайте `AUTH_CLIENT_SECRET` через secret storage. `ENCRYPTION_KEY_ID` и `ENCRYPTION_KEY` также обязательны для backend. Значения секретов намеренно отсутствуют в примере.

`AUTH_PROVIDER_ID` — стабильное локальное имя источника. Пользователь сопоставляется по тройке provider ID, issuer и subject. Изменение provider ID может создать другую identity; одинаковое имя пользователя у двух источников не объединяет их.

`AUTH_ALLOWED_AUDIENCES`, `AUTH_ALLOWED_ALGORITHMS` и `AUTH_ALLOWED_RETURN_ORIGINS` принимают списки через запятую. Origin содержит схему, host и при необходимости порт, но не путь. В allowlist возврата нет wildcard.

В примере frontend и backend расположены под одним сайтом. Если они находятся на разных сайтах и требуется `SameSite=None`, одновременно нужен `AUTH_COOKIE_SECURE=true`; также учитываются CORS с credentials и политика сторонних cookie браузера.

## Проверка токена и обновление сессии

Backend проверяет подпись JWT через JWKS, разрешённый алгоритм, issuer, audience, наличие `kid`, subject и expiration. Bearer-запрос проходит проверку токена, cookie-запрос — проверку серверной сессии. Успешный вход не освобождает последующие запросы от проверки действующей авторизации.

Срок серверной сессии и срок токена различаются. Сейчас `AUTH_SESSION_TTL` по умолчанию равен восьми часам. На запросе backend проверяет, пора ли обновить identity; refresh запускается при приближении срока токена за 30 секунд. Это проверка на запросе, а не постоянный фоновый опрос. При неуспешном refresh текущая серверная сессия отзывается.

Срок JWT определяется провайдером. Настройки Keycloak описаны в [Session and token timeouts](https://www.keycloak.org/docs/latest/server_admin/#_timeouts). Повторная локальная проверка JWT не сообщает о снятии роли или отзыве сессии в Keycloak до истечения токена. Для рассматриваемой модели такая задержка допустима; remote introspection на каждый запрос не требуется.

## Проект: откуда брать права OIDC

Новая синхронизация использует **проверенный access token**. Выбор ID token в текущем login flow относится к identity и не означает, что из него будут автоматически читаться внешние права.

До маппинга backend отдельно проверяет access token, его audience и принадлежность той же identity, для которой создана сессия. Наличие поля в ID token или ответе браузера не заменяет эту проверку. В первом варианте внешних прав `claimsSource` допускает только `access_token`; непрозрачные токены и UserInfo как источник прав не входят в этот вариант.

Если нужные атрибуты есть только в ID token, настройте их выдачу в access token на стороне провайдера. Маппер должен получать актуальные данные и при обычной выдаче, и при refresh.

Структуру claims определяет пользователь: это могут быть массивы строк, вложенные объекты и скалярные значения. Файл маппинга задаёт точные пути к нужным значениям, условия их сравнения и соответствующие роли Endge. Специального имени корневого поля или заранее заданной структуры не требуется.

## Проект: пример данных для маппинга

Ниже условный **фрагмент claims**, а не JWT, который можно отправить API. Служебные поля проверки токена опущены. Имена `roles`, `permissions` и вложенность выбраны только для примера; в своей конфигурации используйте структуру вашего провайдера:

```json
{
  "roles": ["workspace-viewer"],
  "permissions": {
    "workspace": {
      "edit": true
    }
  }
}
```

С [основным YAML-примером](./access-configuration#yaml-example) этот фрагмент даёт Editor в workspace `example-workspace`: совпадают правила Viewer и Editor, внутри одной области выбирается более высокая роль. Platform Admin не назначается, потому что `platform-admin` отсутствует.

Для другого формата claims замените `when.path` и условие в YAML. Результат правила задаётся независимо через `grant`: область платформы или конкретный workspace и одна из поддерживаемых ролей.

## Проект: YAML для всех ролей

В этом примере представлены Platform Admin и три роли workspace. Это тот же пример, что на странице [Внешние права](./access-configuration#yaml-example); комментарии объясняют, какие значения заменить. Файл пока является проектом контракта.

<!--@include: ./access-configuration.md#roles-example-->

Для приведённого выше фрагмента claims совпадут только Viewer и Editor. Чтобы получить Admin workspace, провайдер должен добавить `workspace-admin` в массив `roles`; для Platform Admin — `platform-admin`.

## Проект: вход, refresh и снятие прав

При входе или новом access token backend вычисляет полный набор назначений по активному файлу и атомарно заменяет набор пользователя в БД. При refresh синхронизация выполняется до разрешения следующей защищённой операции. Наличие прежней записи не является основанием пропустить удаление или понижение роли.

Пример с условным сроком JWT пять минут:

| Время | Событие | Результат |
| --- | --- | --- |
| 12:00 | Выдан токен с Editor | Назначение синхронизировано в Endge |
| 12:01 | Editor снят у провайдера | Уже выданный токен может ещё действовать |
| До 12:05 | Получен новый токен без Editor | Назначение удаляется или понижается по новому полному набору |
| После срока старого токена | Новый токен получить нельзя | Защищённые запросы не продолжаются со старыми правами |

Получение нового токена зависит от запросов и работы refresh. Если запросов не было, старая строка в БД может сохраняться дольше пяти минут, но сама по себе не даёт доступа: при следующем запросе сначала проверяется сессия и при необходимости обновляются права.

Если провайдер выдал корректный токен без назначений, ответ защищённой операции будет отказом в доступе, а не обязательно отказом во входе. Во внешнем диалоге можно показать отсутствие доступа. Если провайдер отклонил refresh, требуется новая аутентификация.

## Проект: проверка интеграции перед реализацией

Для согласования необходимо проверить [YAML-контракт](./access-configuration), выбранные имена ролей и workspace, а также допущение о задержке отзыва. При последующей реализации отдельно проверяются вход, refresh с понижением роли, пустой набор, неуспешная синхронизация, параллельные сессии и запрет ручных mutations.

Описание этих сценариев не означает, что новый механизм уже работает или был проверен на живом Keycloak.

## Источники

- [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0.html) — identity, ID token и проверка ответа входа.
- [Keycloak Server Administration](https://www.keycloak.org/docs/latest/server_admin/) — клиент, мапперы, роли и сроки токенов.
- [Keycloak OIDC endpoints](https://www.keycloak.org/securing-apps/oidc-layers) — endpoints провайдера.
