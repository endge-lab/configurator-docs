# Basic Auth

Адаптер `basic` передаёт внешнему API имя пользователя и пароль через HTTP Basic Authentication. Его выбирают, если именно такой способ поддерживает принимающий API.

## Настройка

Создайте `AuthProfile` с адаптером Basic Auth и двумя ссылками в `credentials`:

```json
{
  "identity": "api-basic",
  "name": "API: Basic Auth",
  "active": true,
  "adapterId": "basic",
  "config": {},
  "credentials": {
    "username": "{API_USERNAME}",
    "password": "{API_PASSWORD}"
  }
}
```

`config` должен быть пустым объектом; `session` не указывается. Подготовьте переменные `API_USERNAME` и `API_PASSWORD`, затем выберите `api-basic` в политике авторизации запроса. Общие правила см. в разделе [Профили](./profiles).

## Как выполняется запрос

Core разрешает имя и пароль, соединяет их через двоеточие, кодирует в Base64 и формирует заголовок:

```http
Authorization: Basic <base64(username:password)>
```

Base64 — кодирование, а не шифрование. API должен быть доступен по HTTPS. Проверку имени и пароля выполняет сам API; создание заголовка не подтверждает, что credentials приняты.

Адаптер не получает access token и не использует OAuth-сессию, expiration или refresh. Для смены пароля обновляется соответствующая переменная. Basic подходит для транспорта, передающего заголовки запроса; наличие профиля не гарантирует его поддержку любым транспортом.

## Связь со входом в конфигуратор

Basic Auth существует как адаптер `AuthProfile` в Core. Вход по Basic Auth в Service Backend конфигуратора не реализован. Его вход для пользователей настраивается через [OIDC](./oidc), а локальная разработка — через [dev identity](./development).

`client_secret_basic` в [OAuth2 Client Credentials](./oauth2-client-credentials) — другой сценарий: Basic-заголовок аутентифицирует клиента на token endpoint, после чего API получает Bearer access token.
