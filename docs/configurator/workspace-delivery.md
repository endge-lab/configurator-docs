# История, перенос и выпуск Workspace

Service Backend разделяет текущие документы, их revisions, commit snapshots, releases и runtime bundles. Они решают разные задачи; сохранение документа не выпускает релиз и не публикует приложение.

## Сохранение и история

Документ читается вместе с `revision`. Изменение выполняется с `If-Match` согласно HTTP API. При `409` перечитайте актуальную версию и пересмотрите правку; повторная отправка старого body не решает конфликт. История отдельного документа показывает revisions, автора и происхождение изменения. Восстановление всего Workspace — отдельная операция, а не переключение локального редактора.

## Commit

| Endpoint под `/api/v1` | Назначение |
| --- | --- |
| `POST /commits/plan` | План фиксации текущего head |
| `POST /commits` | Создание commit с `expectedHeadSequence` |
| `GET /commits`, `GET /commits/{id}` | История и один commit |
| `GET /commits/{id}/diff` | Различия |
| `POST /commits/{id}/restore/plan` | Предварительный план восстановления |
| `POST /commits/{id}/restore` | Применение восстановления с контролем актуальности |

Создание commit требует соответствующих прав; токен агента может отдельно запрещать эту операцию. План даёт возможность проверить состав действия до mutation. Если head изменился, получите новый план и не обходите optimistic concurrency.

## Release и build profile

Release фиксирует версионированный снимок для дальнейшего получения/переноса. API предоставляет список, чтение, export и restore plan/restore. `POST /releases/from-build` создаёт release из build; `GET /releases/{identity}/bundle` выдаёт runtime bundle. Это не команда deployment.

Build profiles доступны через `/build-profiles`: list/create/patch/delete. Они определяют параметры сборки; DTO профиля смотрите в [API](/llms-full/api.txt). Не переносите произвольные bootstrap options в body профиля по сходству названий. Сборка зависит от текущего структурного контекста, Source versions, зарегистрированных implementations и compiler version.

Runtime bundle используется read-only provider `dataProvider: 'bundle'`. Нельзя считать bundle полноценным редакторским backup или использовать его для записи в live backend. Контракт bundle: [Domain export types](/reference/contracts/core/domain).

## Export, import и backup

| Endpoint под `/api/v1` | Назначение |
| --- | --- |
| `GET /domain/export` | Переносимый export Workspace по параметрам API |
| `POST /domain/import/plan` | Проверка и план импорта |
| `POST /domain/import` | Применение согласованного импорта |
| `/domain/backups` | Создание и список snapshot backups |
| `GET /domain/backups/{id}` | Сведения о backup |
| `GET /domain/backups/{id}/export` | Скачивание выбранного backup |
| `GET /domain/backups/archive` | Архив backups |

Перед импортом проверьте schema version, целевой Workspace, dependencies, конфликтующие identities и план замены. Workspace snapshot schema — **10** в текущем backend source; это число не совпадает с Query Source version, compiler version или npm package version. Не меняйте его вручную ради прохождения проверки: используйте поддерживаемый migration/import contract.

Непосредственно перед изменяющим запросом перечитайте требуемые head/revision. Секреты и зашифрованные credentials имеют собственный transport/storage contract; не заменяйте encrypted payload открытыми значениями и не обещайте переносимость без нужного ключа. Полная форма параметров и ошибки каждой операции — [HTTP API](/llms-full/api.txt), [source backend](https://github.com/endge-lab/service-backend).
