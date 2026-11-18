---
description: "Оглавление практических руководств Endge: данные, GraphQL, преобразования и вычисления, интерфейс, события, таблицы, JSON UI, стили и сквозные примеры."
---

# Руководства

## Controllers и двунаправленный скролл

Core `1.2.0-dev.15` / UI `2.0.0-dev.14` поддерживает code-owned [Controllers](/reference/controllers) и [скользящее окно cursor/offset](/guides/collection-window). Начните с [короткого маршрута агента](/agents/controllers): полный Store/guarded Update/Query/typed SFC/Composition и исполнимые Source/SDK exercises. Controller объявляется в Source Composition или через SDK.


Руководство ведёт по задаче от начала до результата. Точный синтаксис каждого документа — в [справочнике](/reference/).

## Данные

| Руководство | Задача |
| --- | --- |
| [Работа с данными](/guides/data) | Получить данные Query и передать их потребителю |
| [GraphQL](/guides/graphql) | Подключить GraphQL-источник |
| [Преобразование данных](/guides/transformations) | Привести ответ к нужной форме |
| [Вычисления](/guides/computations) | Посчитать производное значение |

## Интерфейс

| Руководство | Задача |
| --- | --- |
| [Создание интерфейса](/guides/components) | Собрать экран из Component SFC |
| [События Component SFC](/guides/component-events) | Связать события компонента с действиями |
| [Условное представление таблиц](/guides/table-presentation-computations) | Менять вид строк и ячеек по данным |
| [JSON UI endge-ui/v1](/guides/json-ui) | Описать интерфейс в JSON |
| [Стилизация](/guides/styling) | Оформить компоненты через EndgeCSS |

## Сквозные задачи

Примеры и срез проверены компиляцией всего workspace, сценарии — на работающем backend; они подходят как образец для людей и агентов.

- [Примеры документов всех типов](/agents/document-examples) — проверенный документ каждого типа и порядок создания.
- [Вертикальный срез](/agents/vertical-slice) — связанный набор документов от Type до Composition; когда он нужен и когда нет.
- [Сквозные сценарии](/agents/scenarios) — создание и выпуск документов, конфликт версий, откат ревизии, тенанты.
