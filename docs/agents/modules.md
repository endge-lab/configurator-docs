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

Сверьте `primitive` и `id` в `manifest.contributes.renderers` точной версии. В workspace настройка `configuration.defaultRenderers` хранит пары вида `{ "Table": { "identity": "custom-ui", "version": "1.0.0", "rendererId": "slot" } }`. Сохраняйте остальные поля конфигурации. В Configurator корневой адаптер имеет ID `vue`. Пункт `default` удаляет ключ тега. При отсутствии выбора в композиции используется штатный рендерер приложения. В режиме `live` проверьте переопределение повторной загрузкой workspace. Для bundle проверьте, что приложение получило новый релиз конфигурации. Configurator читает manifest для списка настроек и загружает выбранный модуль при запуске SFC. Для локального переопределения на экземпляре компонента используйте `.withRenderers({ Table: 'visual:slot' })`. [Настройки UI](/configurator/modules#рендереры-рабочего-пространства)

## Проверить или опубликовать ZIP через API

Все операции каталога идут по `/api/v1/modules` на Backend и работают без `X-Endge-Workspace`. Для HTTP используйте OIDC access token пользователя или его браузерную сессию. Создание, изменение метаданных и публикация требуют администратора платформы. Для обычных запросов агента с PAT каталог отвечает `access_token_route_forbidden`. MCP-инструменты работают с документом Composition, а операции каталога выполняются напрямую по REST или через Configurator. [Персональные токены](/agents/tokens)

| Метод и маршрут | Вход или результат |
| --- | --- |
| `GET /api/v1/modules` | Список модулей Backend |
| `POST /api/v1/modules` | Multipart `identity`, `name`, необязательное `description`, `archive`. Публикует первую версию атомарно с созданием карточки |
| `GET /api/v1/modules/{identity}` | Метаданные, ревизия и опубликованные версии |
| `PATCH /api/v1/modules/{identity}` | JSON с `name` или `description`, заголовок `If-Match` с актуальной ревизией карточки |
| `POST /api/v1/modules/{identity}/versions` | Multipart `archive`. Версия берётся из manifest |
| `GET /api/v1/modules/{identity}/versions/{version}` | Manifest, SHA-256 оригинального ZIP, размер, `archiveUrl` и `assets` |
| `GET /api/v1/modules/{identity}/versions/{version}/archive` | Оригинал опубликованного ZIP |
| `GET /api/v1/modules/{identity}/versions/{version}/assets/{file}` | `module.js` или, при наличии, `module.css` |

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
