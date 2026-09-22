# OIDC

OIDC-адаптер `AuthProfile` обеспечивает пользовательскую сессию приложения на Endge Core через Authorization Code + PKCE. Токенами управляет приложение в браузере. Вход в сам Configurator настраивается отдельно на [backend](../../configurator/authentication/oidc).

## Настройка

```json
{
  "identity": "app-oidc",
  "name": "Вход в приложение",
  "active": true,
  "adapterId": "oidc",
  "config": {
    "issuer": "https://keycloak.example.com/realms/endge",
    "clientId": "endge-app",
    "scopes": [
      "openid",
      "profile",
      "email"
    ]
  },
  "credentials": {},
  "session": {
    "storage": "memory",
    "persistRefreshToken": false
  }
}
```

`credentials` должен быть пустым объектом. Для браузерного приложения зарегистрируйте отдельный публичный клиент с Authorization Code + PKCE и разрешёнными callback URL; client secret в этот профиль не добавляется.

Сохранение профиля само по себе не открывает окно входа. Host-приложение создаёт браузерный источник сессии через `Endge.auth.createOidcSessionSource(profile, options)`, передаёт `redirectUri` и выбирает `flow: 'popup'` или `flow: 'redirect'`. Оно подключает источник через `Endge.auth.session.connect(profile.identity, source)`, запускает вход и обрабатывает callback соответствующего flow. Для popup отдельно настраивается `popupRedirectUri`.

Подключённый источник предоставляет Core токены и их обновление. Без действующей сессии требуется интерактивный вход; адаптер не может получить пользовательский токен только из issuer и client ID. Настройки хранения и выбора профиля в запросах см. в разделе [AuthProfile](../auth-profile).

