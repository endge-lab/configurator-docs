# AuthProfile

`AuthProfile` — документ workspace с настройками аутентификации для API, к которым обращается приложение через Endge Core. В конфигураторе выберите раздел Auth Profiles, создайте профиль и укажите адаптер. Затем выберите профиль в настройках авторизации нужного Query или другого поддерживающего его документа.

Вход в сам конфигуратор настраивается отдельно на [backend](../configurator/authentication#способы-входа). Профиль не назначает пользователю Platform Admin, Admin, Editor или Viewer.

## Встроенные адаптеры

| Адаптер | `adapterId` | Данные для доступа | Сессия |
| --- | --- | --- | --- |
| [OIDC](./auth-profile/oidc) | `oidc` | Вход пользователя у провайдера | Через источник сессии приложения |
| [Bearer](./auth-profile/bearer) | `bearer` | Готовый токен | Без хранения сессии адаптером |
| [Basic Auth](./auth-profile/basic) | `basic` | Имя и пароль | Без хранения сессии адаптером |
| [OAuth2 Client Credentials](./auth-profile/oauth2-client-credentials) | `oauth2-client-credentials` | Client ID и client secret | Получение access token |
| [OAuth2 Password](./auth-profile/oauth2-password) | `oauth2-password` | Имя и пароль пользователя | Access token, refresh при наличии refresh token |

## Формат профиля

На страницах адаптеров приведены JSON-фрагменты настройки `AuthProfile`. `identity` — стабильное имя, по которому документ ссылается на профиль; `name` — его название. `active: true` включает профиль. Служебный ID документа создаётся отдельно и в примерах опущен.

- `config` содержит параметры выбранного протокола: issuer, client ID, scopes или token endpoint.
- `credentials` содержит ссылки на переменные с токеном, паролем или client secret.
- `session` задаёт хранение сессии для OIDC и OAuth2; у Bearer и Basic Auth это поле отсутствует.

Эти JSON-фрагменты не относятся к `endge-access.yaml`. [Файл внешних прав](../configurator/authentication/access-configuration) описывает предлагаемый маппинг ролей backend, а не настройку запросов приложения.

## Credentials и переменные

В production используйте ссылки вида `{API_TOKEN}`, `{API_USERNAME}` и `{API_PASSWORD}` в `credentials`. Имена условные: создайте соответствующие переменные workspace и настройте их значения для вашей среды. Core разрешает ссылки через механизм переменных; неразрешённая ссылка приводит к ошибке авторизации.

Ссылка на переменную не является отдельным защищённым хранилищем. Если Core выполняет запрос в браузере, нужное для запроса значение доступно в этом браузере. Сервисные секреты размещайте в доверенном окружении, где выполняется интеграция. Не сохраняйте реальные секреты в экспортируемом профиле: экспорт сохраняет его значения.

## Хранение сессии

OIDC и оба OAuth2-адаптера требуют `session`:

```json
{
  "session": {
    "storage": "memory",
    "persistRefreshToken": false
  }
}
```

| Поле | Значение |
| --- | --- |
| `storage: memory` | Сессия только в памяти текущего runtime |
| `storage: sessionStorage` | Хранение в браузере в пределах вкладки |
| `storage: localStorage` | Хранение в браузере между открытиями приложения |
| `persistRefreshToken: false` | Refresh token не записывается в браузерное хранилище |
| `persistRefreshToken: true` | При поддержке refresh token разрешена его запись в выбранное хранилище |

`persistRefreshToken: false` не отключает refresh в текущем runtime и не запрещает хранение access token согласно `storage`. Это также не настройка серверной cookie-сессии конфигуратора. У Client Credentials refresh token не используется: адаптер повторяет получение access token.

## Использование в запросе

Например, фрагмент политики авторизации Query выбирает профиль по `identity`:

```json
{
  "auth": {
    "mode": "profile",
    "profile": "api-basic"
  }
}
```

Это часть документа запроса, а не полный Query. Режим `none` отключает авторизацию, `inherit` использует унаследованную политику. Место настройки и возможности транспорта описаны в [Query](./query) и [Stream](./stream).

Профиль задаёт способ получить данные авторизации. Получающий API проверяет их и определяет доступ. Его роли и scopes не становятся административными ролями конфигуратора автоматически.
