---
description: "Ошибки Controller registry, dependency bindings и collection-window: причины, восстановление и границы HTTP diagnostics."
---

# Ошибки Controllers и collection-window

Это diagnostics/ошибки **Core** `1.2.0-dev.15`, а не новые HTTP-коды Service Backend. [Controllers](/reference/controllers), [рецепт окна](/guides/collection-window). HTTP-каталог находится [отдельно](/agents/errors).

| Код / prefix | Проверить и исправить |
| --- | --- |
| controller-definition-collision / controller-provider-collision-or-missing-definition | Уникальная identity/key; definition зарегистрирована до provider |
| controller-provider-missing | Установить доверенный code provider в target host; Bundle содержит только definition |
| controller-definition-in-use / controller-provider-in-use | Сначала dispose всех instances, затем unregister |
| controller-owner-required | Передать реальный зарегистрированный parent host/id |
| controller-command-missing | Использовать объявленную command |
| controller-prop-unknown / controller-output-unknown / controller-value-type | Сверить поля и типы definition contract |
| controller-state-invalid / controller-state-already-owned | Верный Store/path и единственный writer |
| controller-state-commit-rejected | Guarded Update должен атомарно записать next при совпадении revision; не обходить конфликт |
| window-dependencies-required | Нужны state Store и load Query |
| window-state-invalid | Начальное value `{revision:0,rowsRevision:0,blocks:[]}` и корректные дальнейшие записи |
| window-paging-invalid / window-batchSize-invalid / window-maxLoadedRows-invalid / window-prefetchRows-invalid / window-initialOffset-invalid | Cursor/offset; положительные batch/limit, неотрицательные buffer/offset, целые числа |
| window-response-invalid / window-row-key-invalid | Rows — массив объектов со стабильным непустым String/Number key |
| window-offset-invalid / window-total-invalid | Offset равен запрошенному, total — неотрицательное целое |
| window-continuation-required / window-cursor-required | Явные flags/cursors либо offset+total; короткой длины недостаточно |
| window-no-progress | API возвращает новую область или закрывает край; не повторять прежний cursor с теми же rows |
| window-row-keys-required | Retain/release принимает массив либо `{keys:[...]}` |
| AbortError | Generation отменена при props/pause/teardown; старый результат не использовать |

Page failure публикуется как `error:{message,direction}` и блокирует автоматический demand; исправьте причину и вызовите retry/reset. Ошибки unknown command, регистрации и misuse SDK могут отклонять вызов непосредственно. Сетевые сообщения Query не являются стабильными кодами этой таблицы.

Linking diagnostics могут дополнительно уточнять недостающую dependency, чужой Update owner, неверный Query output или конфликт binding; читайте полную diagnostics artifact. Не исправляйте их добавлением вымышленного Controller HTTP collection. [Точные declarations](/reference/contracts/core/runtime).

## Retention и кэш страниц

| Код / prefix | Проверить и исправить |
| --- | --- |
| window-retention-invalid | `beforeRows`/`afterRows` — неотрицательные целые, оба не меньше `prefetchRows`; неизвестные поля отклоняются |
| window-cache-options-invalid / window-cache-policy-invalid / window-cache-*-invalid | Обязательны `key` и `storage`; сверить стратегии, fallback, целые возраста и положительные бюджеты |
| window-cache-budget-conflict | Владельцы одного cache key/context должны объявлять одинаковые `maxEntries` и `maxBytes` |
| window-cache-crypto-unavailable | Нет безопасного hashing API в host; кэш отключён, Query продолжает работать |
| window-cache-storage-unavailable / window-cache-storage-read-failed / window-cache-storage-write-failed / window-cache-storage-clear-failed | Проверить доступность IndexedDB, квоту и соединение; окно продолжает загрузку без гарантии сохранения |
| window-cache-value-not-serializable | Страница должна содержать JSON-совместимые значения; функции, циклы, Date/class instances и нечисловые числа не сохраняются |
| window-cache-entry-too-large / window-cache-write-queue-full | Уменьшить порцию или увеличить явный бюджет; сохранение этой страницы пропущено, активные данные доступны |
| window-cache-selection-required | Cache capability вызван до выбора контекста/выборки; приложение использует Controller API, не вызывает сервис напрямую |

`cacheStatus.error` — диагностика best-effort хранилища, отдельно от `error` загрузки страницы. Ошибка фонового Query сохраняет строки. `refreshPending:true` сообщает структурное изменение либо инвалидирование цепочки другим владельцем: завершите работу с правками и вызовите `refresh`. `clearCache` сохраняет отображаемые строки и не снимает уже установленный `refreshPending`. Подробности: [retention и политики кэша](/guides/collection-window-cache).

Изменение execution context даёт `AbortError` и pause старого Controller; `resume` такого экземпляра отклоняется. Освободите старого владельца и смонтируйте новый scope. HTTP 401/403 не заменяются кэшем даже при `onError:use-cache`; числовой статус сохраняется Query transport для этой проверки.
