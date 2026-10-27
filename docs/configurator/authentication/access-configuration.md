# Внешние права

Service Backend читает YAML-маппинг доверенных OIDC access-token claims в роли Endge. Это runtime-конфигурация backend: изменения применяются после перезапуска. Отдельный экран внешних прав в текущем Configurator отсутствует; API запрещает ручные изменения назначений независимо от UI.

## Путь и режим

По умолчанию используется `endge-access.yaml` рядом с исполняемым файлом. `ACCESS_CONFIG_FILE` задаёт **абсолютный** путь:

```bash
ACCESS_CONFIG_FILE=/etc/endge/access.yaml /opt/endge/service-backend
```

Для `go run` задайте путь явно: temporary binary не находится в исходном каталоге.

| Состояние | Результат |
| --- | --- |
| Переменная пуста, стандартного файла нет | `local` |
| Файл найден и валиден | `external` |
| Явно указанный файл отсутствует или не читается | Ошибка запуска |
| YAML невалиден или несовместим с auth-настройками | Ошибка запуска, без local fallback |

External требует OIDC identity и OIDC login adapter. Dev identity несовместима с этим файлом. Provider должен совпадать с `AUTH_PROVIDER_ID`.

## Пример YAML {#yaml-example}

Все имена и claims ниже условные; соответствующие Workspace должны уже существовать.

<!-- #region roles-example -->
```yaml
version: 1
adapter: oidc
provider: example-provider
displayName: Example Identity Provider
claimsSource: access_token
rules:
  - id: platform-admin
    when:
      path: /roles
      contains: platform-admin
    grant:
      scope: platform
      role: admin
  - id: workspace-admin
    when:
      path: /roles
      contains: workspace-admin
    grant:
      scope: workspace
      workspace: example-workspace
      role: admin
  - id: workspace-editor
    when:
      path: /roles
      contains: workspace-editor
    grant:
      scope: workspace
      workspace: example-workspace
      role: editor
  - id: workspace-viewer
    when:
      path: /roles
      contains: workspace-viewer
    grant:
      scope: workspace
      workspace: example-workspace
      role: viewer
```
<!-- #endregion roles-example -->

## Строгая схема

| Поле | Контракт |
| --- | --- |
| `version` | Только `1` |
| `adapter` | Только `oidc` |
| `provider` | Непустое совпадение с backend provider identity |
| `displayName` | Непустое отображаемое имя |
| `claimsSource` | Только `access_token` |
| `rules` | Обязательный список; пустой список даёт пустой набор назначений |
| `rules[].id` | Непустой уникальный идентификатор |
| `when.path` | JSON Pointer, с escaping `~0` и `~1` |
| `when.equals` | Scalar string, boolean или конечное число |
| `when.contains` | Строка для проверки членства в массиве строк |
| `grant.scope` | `platform` или `workspace` |
| `grant.role` | Для platform только `admin`; для workspace `viewer`, `editor`, `admin` |
| `grant.workspace` | Фиксированная непустая identity для workspace grant; отсутствует для platform |

Условие содержит ровно один из `equals` / `contains`. Regex, wildcard workspace `*`, шаблоны identity и создание Workspace правилом не поддерживаются. Неизвестные поля, повторные ключи, дополнительные YAML documents, aliases, merge keys и null отклоняются. Сравнение не приводит строку к числу или boolean. Отсутствующий путь не даёт совпадения. При нескольких совпадениях действует наиболее сильная роль соответствующей области.

## Keycloak: группы и роли {#keycloak}

Правило сравнивает claim access token с YAML буквально. Большинство ошибок настройки возникает здесь.

### Как работает `contains`

`contains` — **точное совпадение элемента массива строк**: учитываются регистр, пробелы и слеши. Подстрока, префикс и шаблоны не совпадают. Если по пути `when.path` лежит не массив или в массиве есть элемент не-строка, правило не срабатывает. Для одиночной строки используйте `equals`.

### Полный путь группы

Маппер Keycloak **Group Membership** по умолчанию включает **Full group path**: группа приходит как `/endge-editors`, вложенная — как `/company/endge-editors`. Выберите один вариант:

- оставьте Full group path включённым и пишите в правиле полный путь со слешем (`contains: /endge-editors`);
- выключите **Full group path** в маппере — тогда приходит короткое имя (`contains: endge-editors`). Имена групп в разных ветках дерева при этом могут совпасть.

Если не уверены, какой вариант настроен, добавьте два правила на одну роль — с `/группа` и без слеша. При нескольких совпадениях действует наиболее сильная роль, так что дубль безопасен.

### Группы должны быть в access token

Backend читает claims **access token** (`claimsSource: access_token`), а не ID token и не userinfo. В клиенте Keycloak, через который входят пользователи (и в клиенте агентов, если он отдельный):

1. **Clients → клиент → Client scopes → `<клиент>-dedicated` → Add mapper → By configuration → Group Membership**.
2. **Token Claim Name** — имя claim, например `groups`; в YAML это путь `/groups`.
3. **Add to access token** — ON. Full group path — по выбранному выше варианту.

### Проверка без входа пользователя

**Clients → клиент → Client scopes → Evaluate**: выберите пользователя, нажмите **Generated access token** и найдите claim `groups`. Значение элемента массива должно совпасть с `contains` символ в символ.

### Пример правила по существующей группе

Группа `endge-editors` в корне дерева Keycloak, маппер Group Membership с Full group path ON, claim `groups`:

```yaml
rules:
  - id: example-workspace-editor
    when:
      path: /groups
      contains: /endge-editors
    grant:
      scope: workspace
      workspace: example-workspace
      role: editor
  # Тот же grant, если Full group path выключен.
  - id: example-workspace-editor-short
    when:
      path: /groups
      contains: endge-editors
    grant:
      scope: workspace
      workspace: example-workspace
      role: editor
```

### После изменения

- Изменили YAML — перезапустите backend (все экземпляры).
- Изменили группы пользователя или маппер — пользователь должен получить **новый** access token: выйти из Configurator и войти снова. Старый токен несёт старые claims; токен старше уже применённого отклоняется кодом `external_access_stale`.
- Персональный токен `endge_pat_…` использует последний сохранённый снимок прав владельца и обновится только после его следующего входа.

### Как увидеть итоговую роль

`GET /api/session/me` (с cookie Configurator или `Authorization: Bearer`) возвращает `accessManagement.mode` (`external` или `local`), `platformAdmin` и `workspaces[].role` — роль после применения правил. `GET /auth/session` отдаёт тот же ответ для проверки входа. Если workspace нет в списке, ни одно правило не совпало: сравните claim из Evaluate с `contains`. Коды отказа — в [справочнике ошибок](/agents/errors#access).

## Атомарная синхронизация

После проверки токена backend заменяет все назначения текущего пользователя в одной транзакции. Workspace из совпавшего правила должен существовать и быть активным; ошибка не даёт частичного набора. Назначения других пользователей не изменяются этим запросом. Пустой набор удаляет прежние права.

Сохраняются версия конфигурации, token hash, `iat`, hash назначений и время синхронизации. Сырой JWT не нужен для отображения прав. Обновления одной identity сериализуются. Более старый `iat` получает `external_access_stale`; конфликтующие назначения от разных токенов с одинаковым `iat` — `external_access_ambiguous`. Невалидный/истёкший снимок и неактивный Workspace также блокируют операцию.

## Смена конфигурации

Версия policy зависит от YAML и доверенных auth-настроек. После изменения нужен перезапуск и актуальная проверка токена; старый снимок не является локальным override. В external-режиме bootstrap первого администратора и legacy platform-admin groups не добавляют назначения.

При удалении файла режим становится local; сохранённые строки назначений не следует считать автоматически пересчитанными из provider. Перед сменой режима проверьте действующие административные назначения и согласуйте одинаковую конфигурацию всех экземпляров backend. Автоматическое создание аварийного администратора из-за удаления файла не предусмотрено.

[Parser и startup validation](https://github.com/endge-lab/service-backend/blob/main/internal/config/access.go). [Синхронизация](https://github.com/endge-lab/service-backend/blob/main/internal/usecase/access_control/external.go). Эти ссылки описывают source; проверка конкретного OIDC deployment выполняется отдельно.
