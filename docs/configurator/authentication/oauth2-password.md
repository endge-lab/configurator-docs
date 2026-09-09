# OAuth2 Password

Адаптер `oauth2-password` получает access token, передавая имя и пароль пользователя непосредственно на token endpoint. В текущем Core он поддерживается; для нового пользовательского входа используйте [OIDC](./oidc#runtime-profile), при котором пароль вводится у провайдера.

## Настройка

Для среды, где провайдер поддерживает Password grant, создайте профиль:

```json
{
  "identity": "password-api",
  "name": "API: OAuth2 Password",
  "active": true,
  "adapterId": "oauth2-password",
  "config": {
    "tokenEndpoint": "https://identity.example.com/oauth/token",
    "clientId": "endge-test-client",
    "scopes": [
      "api.read"
    ]
  },
  "credentials": {
    "username": "{API_USERNAME}",
    "password": "{API_PASSWORD}"
  },
  "session": {
    "storage": "memory",
    "persistRefreshToken": false
  }
}
```

Подготовьте переменные `API_USERNAME` и `API_PASSWORD`, замените client ID, URL и scopes на значения вашей среды. Список scopes может быть пустым. У этого адаптера нет поля `clientSecret` или настройки `clientAuthentication`. Общие правила описаны в разделе [Профили](./profiles).

## Как получается и обновляется токен

Адаптер отправляет POST с `Content-Type: application/x-www-form-urlencoded` и полями `grant_type=password`, `client_id`, `username`, `password`, а также scopes через пробел. Ответ должен содержать `access_token`; запросы к API используют `Authorization: Bearer …`.

Если провайдер вернул refresh token, адаптер поддерживает обновление через `grant_type=refresh_token`. Без refresh token новое получение сессии требует повторного Password grant. Сроки берутся из `expires_in` и, при наличии, `refresh_expires_in`.

В примере сессия хранится только в памяти. `persistRefreshToken: false` не отключает refresh, пока refresh token доступен в текущем runtime; оно запрещает его запись в браузерное хранилище.

## Ограничения

Приложение получает доступ к паролю пользователя. При работе Core в браузере это означает доступность credentials в браузере и требование CORS на token endpoint. Адаптер не выполняет перенаправление на страницу входа и не реализует интерактивные шаги MFA.

Этот профиль не добавляет вход по паролю в Service Backend конфигуратора. Для его пользовательского входа используется отдельная [OIDC-конфигурация backend](./oidc).
