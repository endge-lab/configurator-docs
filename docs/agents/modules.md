---
description: "Маршрут агента для глобального каталога модулей Endge: проверка точной версии, права, REST, подключение в Composition и проверка Table и Timeline."
---

# Модули композиции

Модуль в каталоге Backend — версионированная сборка, общая для рабочих пространств этого Backend. Документ Composition хранит ссылку `module(identity, version)` в `resources`. Компилятор Core проверяет DSL и выбирает ветку `contextSwitch` по фасетам. Хост загружает выбранную версию при активации scope.

## Подключить существующий модуль

1. Уточните Backend, workspace, Composition и фасеты. Прочитайте Source и текущую ревизию Composition. Для вложенной ветки проверьте предков и другие объявления с тем же ключом ресурса.
2. Проверьте точную пару `identity + version` в карточке каталога или в REST. Для локальной поставки проверьте, что эту пару предоставляет loader хоста. Если у вас только PAT, запросите у пользователя метаданные опубликованной версии или попросите его сверить пару в Configurator. Запись Composition доступна с обычными правами редактирования workspace.
3. Добавьте, например, `resources: { visual: module('custom-ui', '1.0.0') }`. Для ветки с другим визуалом объявите тот же ключ ближе к ней. Для выбора по фасету используйте `contextSwitch({ default: module(...), cases: [{ when: { deployment: 'test' }, use: module(...) }] })`. Используйте точные версии, включая prerelease, если он указан в каталоге. [Полный пример Composition](/reference/composition#модули-композиции)
4. Для записи используйте `PATCH /api/v1/compositions/{identity}` с `X-Endge-Workspace`, `If-Match`, `source` и `sourceVersion: 1`. Через MCP используйте `endge_update_document` для коллекции `compositions` с текущей `revision`. Сверьте сохранённый Source и скомпилируйте выбранный контекст. [Авторинг Source](/agents/authoring)
5. Запустите Runtime Preview нужной ветки. Проверьте оформление таблицы и список пресетов активного scope. В SFC укажите только имя пресета и его `settings`. После смены фасета запустите Preview повторно и проверьте обе ветки. При адресной замене с тем же именем пресета проверьте, что график использует новый provider и старые подписки сняты. Запись документа, компиляция и поведение Preview подтверждаются отдельно. [Timeline Chart](/domain/components/timeline-chart#пресет-приложения)

## Назначить рендерер в рабочем пространстве

Сверьте `primitive` и `id` в `manifest.contributes.renderers` точной версии. В workspace настройка `configuration.defaultRenderers` хранит пары вида `{ "Table": { "identity": "custom-ui", "version": "1.0.0", "rendererId": "slot" } }`. Сохраняйте остальные поля конфигурации. Удаление ключа тега возвращает рендерер корневого адаптера. Configurator читает manifest для списка настроек и загружает выбранный модуль при запуске SFC. Для локального переопределения на экземпляре компонента используйте `.withRenderers({ Table: 'visual:slot' })`. [Настройки UI](/configurator/modules#рендереры-рабочего-пространства)

Для офлайн-поставки используйте контекстную сборку с включённым параметром **«Включить модули в артефакт»**. Состав версий определяется по выбранным программам и эффективным настройкам тегов. Проверяйте распакованный `endge-bundle` версии 2, включая `bundle`, `delivery.variants` и `delivery.modules`. Для одного тенанта во всех вариантах значение `context.facets.tenant` должно совпадать. [Сборка выбранного контекста](/guides/context-specific-bundle#выбор-вариантов-и-автономная-поставка)

## Проверить или опубликовать ZIP через API

Все операции каталога идут по `/api/v1/modules` на Backend и работают без `X-Endge-Workspace`. Для HTTP используйте OIDC access token пользователя или его браузерную сессию. Создание, изменение метаданных, публикация, просмотр архива и восстановление требуют администратора платформы. Для обычных запросов агента с PAT каталог отвечает `access_token_route_forbidden`. MCP-инструменты работают с документом Composition, а операции каталога выполняются напрямую по REST или через Configurator. [Персональные токены](/agents/tokens)

| Метод и маршрут | Вход или результат |
| --- | --- |
| `GET /api/v1/modules` | Активные модули Backend. `?deleted=true` возвращает архив с текущими ревизиями |
| `POST /api/v1/modules` | Multipart `name`, `archive` и необязательное `description`. Backend берёт идентификатор и версию из manifest и публикует первую версию атомарно с созданием карточки. Если клиент передаёт необязательное поле `identity`, оно должно совпадать с manifest |
| `GET /api/v1/modules/{identity}` | Метаданные, ревизия и опубликованные версии |
| `PATCH /api/v1/modules/{identity}` | JSON с `name` или `description`, заголовок `If-Match` с актуальной ревизией карточки |
| `DELETE /api/v1/modules/{identity}` | Перенос в архив с `If-Match`. Ответ содержит `deletedAt` и новую ревизию |
| `POST /api/v1/modules/{identity}/restore` | Восстановление с `If-Match` по ревизии записи в архиве |
| `POST /api/v1/modules/{identity}/versions` | Multipart `archive`. Версия берётся из manifest, идентификатор должен совпадать с `{identity}` в маршруте |
| `GET /api/v1/modules/{identity}/versions/{version}` | Manifest, SHA-256 оригинального ZIP, размер, `archiveUrl` и `assets` |
| `GET /api/v1/modules/{identity}/versions/{version}/archive` | Оригинал опубликованного ZIP |
| `GET /api/v1/modules/{identity}/versions/{version}/assets/{file}` | `module.js` или, при наличии, `module.css` |

После архивации карточка возвращает `404`, а manifest, ZIP и assets остаются доступны по точной версии. Ответ о версии содержит `moduleArchived: true`. Перед созданием новой привязки проверьте, что модуль активен. При конфликте ревизии перечитайте карточку или запись в архиве и проверьте состояние перед повтором.

Добавляйте маршруты к полному базовому адресу Backend, включая префикс. Кодируйте версию как путь из одного сегмента. Например, для проверки версии с помощью пользовательского OIDC-токена:

```bash
curl --fail-with-body \
  -H "Authorization: Bearer $ENDGE_ACCESS_TOKEN" \
  "$ENDGE_URL/api/v1/modules/custom-ui/versions/1.0.0"
```

Публикация следующей версии:

```bash
curl --fail-with-body \
  -H "Authorization: Bearer $ENDGE_ACCESS_TOKEN" \
  -F "archive=@custom-ui-1.0.1.zip" \
  "$ENDGE_URL/api/v1/modules/custom-ui/versions"
```

При `module_archive_invalid` проверьте имена файлов, формат manifest, identity, SemVer и размер ZIP. При `module_conflict` перечитайте карточку перед повторением PATCH. Для изменённых байтов сборки используйте новый номер версии. Повторная публикация тех же байтов по маршруту версий возвращает существующую версию. При `module_not_found` проверьте Backend и точную пару `identity + version`. [Формат сборки и локальная поставка](/configurator/modules#формат-сборки) · [Справочник ошибок](/agents/errors#module-catalog) · [HTTP OpenAPI](/llms-full/api.txt)
