# OAuth2 Client Credentials

Адаптер `oauth2-client-credentials` получает access token от имени клиента по client ID и client secret. Пользовательский вход в этом grant не участвует.

## Настройка

Зарегистрируйте клиента у OAuth2 provider, разрешите Client Credentials и нужные scopes. Укажите token endpoint вашей среды:

```json
{
  "identity": "service-api",
  "name": "Сервисный API",
  "active": true,
  "adapterId": "oauth2-client-credentials",
  "config": {
    "tokenEndpoint": "https://identity.example.com/oauth/token",
    "clientId": "endge-service",
    "scopes": [
      "api.read"
    ],
    "clientAuthentication": "client_secret_basic"
  },
  "credentials": {
    "clientSecret": "{API_CLIENT_SECRET}"
  },
  "session": {
    "storage": "memory",
    "persistRefreshToken": false
  }
}
```

`clientId`, `scopes` и URL условные. Список `scopes` может быть пустым, если это допускает провайдер. Подготовьте переменную `API_CLIENT_SECRET` и выберите профиль `service-api` в запросе. Правила credentials и хранения описаны в разделе [Профили](./profiles).

## Как получается токен

Адаптер отправляет POST на `tokenEndpoint` с `Content-Type: application/x-www-form-urlencoded`, `grant_type=client_credentials` и scopes через пробел. Способ передачи client ID и секрета определяется `clientAuthentication`:

| Значение | Передача credentials на token endpoint |
| --- | --- |
| `client_secret_basic` | В заголовке HTTP Basic |
| `client_secret_post` | В полях формы `client_id` и `client_secret` |

Ответ должен содержать `access_token`; `expires_in` задаёт срок его действия. Последующие запросы к API используют `Authorization: Bearer …`.

Адаптер не использует refresh token. Когда требуется обновление сессии, Core повторяет Client Credentials grant. Если провайдер не сообщил срок действия, автоматическое определение момента истечения по JWT не выполняется.

## Где выполнять интеграцию

Адаптер обращается к token endpoint из того окружения, где работает Core. Если это браузер, провайдер должен разрешать CORS, а client secret будет доступен в браузере. Для production-интеграции с сервисным секретом выполняйте её в доверенном окружении; ссылка `{API_CLIENT_SECRET}` сама по себе секрет не скрывает.

Этот профиль не создаёт пользовательскую сессию конфигуратора и не назначает административные роли Endge.
