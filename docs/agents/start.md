---
description: "Короткий маршрут агента по задаче: серверная пагинация, Query и Actions, сборка по фасетам, точные версии, авторинг и доступ к API."
---

# Выберите задачу

## Controllers и двунаправленный скролл

Core `1.2.0-dev.15` / UI `2.0.0-dev.14` поддерживает code-owned [Controllers](/reference/controllers) и [скользящее окно cursor/offset](/guides/collection-window). Начните с [короткого маршрута агента](/agents/controllers): полный Store/guarded Update/Query/typed SFC/Composition и исполнимые Source/SDK exercises. Controller объявляется в Source Composition или через SDK.


Для чтения документации и исходников токен Endge не нужен. Авторизацию
подключайте, когда задача требует доступа к workspace или API стенда.
Сначала откройте нужный маршрут, затем точные контракты по ссылкам внутри него.
Большой [llms-agent.txt](/llms-agent.txt) — дополнительный сборник для работы
через HTTP API/MCP, а не обязательное чтение перед любым вопросом.

## Возможности таблицы и работа с данными

| Задача / поисковые слова | Короткий ответ | Читать сначала |
| --- | --- | --- |
| Скользящее окно, infinite scroll, cursor / offset, load before/after | Controller управляет bounded retained window, Table сообщает viewport | [Маршрут Controllers/window](/agents/controllers), [полный рецепт](/guides/collection-window) |
| Серверная страница с внешними кнопками | Параметризованный Query и внешнее управление; готового server mode Table нет | [Ручной рецепт прежнего baseline](/sfc-tables/server-paging) |
| Повторный запрос, новые параметры, REST, GraphQL variables | Query получает props; Action вызывает Query с input; в Composition повторный запуск объявляется hook | [Query](/reference/query), [Action](/reference/action), [Composition hooks](/reference/composition#hooks) |
| Клиентские страницы или виртуальный скролл | Table делит или виртуализирует уже загруженные rows | [Пейджинг и виртуализация](/sfc-tables/paging-and-virtualization) |
| Серверная фильтрация и сортировка | Их выполняет API источника; Query передаёт параметры. Сортировка Table применяется только к загруженным rows | [Серверный рецепт](/sfc-tables/server-paging), [данные и фильтры](/sfc-tables/data-search-filters) |
| Группировка, grouping, aggregation, groupBy | API может вернуть сводные строки; раскрываемые группы и агрегаты не объявлены публичным Table API | [Матрица сценариев](/sfc-tables/server-paging#capabilities) |
| Что означает lazy; можно ли использовать pageChanged для backend | lazy не включает серверный режим; pageChanged описывает локальные страницы | [Ограничения пагинатора](/sfc-tables/server-paging#table-boundary) |

Отсутствие готового режима Table не означает отсутствие параметризованных
запросов в Core. Наличие GraphQL или опций в TanStack само по себе не доказывает
поддержку пагинации API источника или renderer-neutral контракта таблицы.

## Остальные задачи

| Задача | Маршрут |
| --- | --- |
| Проверить установленную версию, npm latest/dev, GitHub main/tag | [Репозитории и версии](/agents/repositories#versions) |
| Создать или изменить Source документа | [Авторинг](/agents/authoring), затем [примеры HTTP DTO](/agents/document-examples) |
| Собрать несколько документов в экран | [Вертикальный срез](/agents/vertical-slice) |
| Собрать Bundle для одного заказчика, выбрать фасеты, исключить чужие ветки | Компиляция от фиксированной startup Composition с `startup-composition / effective-context`; [полный пример и ограничения](/guides/context-specific-bundle), [порядок действий агента](/agents/authoring#сборка-и-поставка-выбранного-контекста) |
| Добавить TimelineChart или синхронизировать несколько шкал | [Timeline через MCP](/agents/timeline) |
| Читать/изменять workspace через HTTP API | [Руководство](/agents/), затем [токены](/agents/tokens) и нужная группа [API](/llms-full/api.txt) |
| Подключить MCP | [MCP](/agents/mcp) |
| Разобрать ошибку | [Коды ошибок](/agents/errors), затем исходники точной версии |

В выводе указывайте отдельно возможность платформы, готовую настройку Table,
версию проверенного пакета и факт проверки работающего приложения.


Для retention, memory/IndexedDB и политик обновления окна: [кэш страниц](/guides/collection-window-cache.md). Версии пакетов и команды запуска указаны в руководстве.
