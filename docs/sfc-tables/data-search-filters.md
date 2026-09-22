# Источники данных, поиск и фильтры

`Table` является потребителем данных, а не владельцем сетевого lifecycle.
Рекомендуемая цепочка выглядит так:

```text
Query → Store → DataView → Component SFC → Table
```

- Query получает внешние данные.
- Store владеет изменяемым состоянием.
- DataView формирует нужную выборку и presentation-поля.
- Component SFC принимает готовые строки и передаёт их в `Table`.

```ts
defineComposition({
  data: {
    orders: dataView('active-orders'),
  },
  runtimes: {
    table: component('orders-table').withProps({
      rows: fromData('orders.items'),
    }),
  },
})
```

## Поиск и фильтры

У renderer-neutral `Table` нет универсальных props `search` или `filters`.
Поиск и фильтрация должны изменять входную выборку через DataView, Filter runtime
или другое объявленное runtime-звено.

Некоторые application renderers могут показывать toolbar поиска или встроенный
Filter UI вокруг Table. Это capability внешнего runtime-контекста, а не часть
переносимого SFC-контракта. Component SFC не должен зависеть от наличия такого
toolbar.

## Локальная и серверная фильтрация

| Сценарий | Владелец |
| --- | --- |
| Отбор уже загруженных строк | DataView или локальная derived-проекция |
| Параметр API-запроса | Filter → Query input |
| Хранение введённого значения | Filter runtime или Store |
| Отображение результата | Table через `rows` |

Пустой массив является корректным состоянием Table. Loading и error не входят в
его публичные props: их следует показывать окружающим Component SFC или
Composition, которые знают состояние Query.

## Что не следует делать

- выполнять fetch из renderer-а Table;
- хранить вторую изменяемую копию строк внутри Vue-страницы;
- считать поиск конкретного адаптера универсальной функцией `Table`;
- использовать `lazy` как уже работающий серверный contract.

О текущем статусе `lazy` см. [пейджинг и виртуализацию](./paging-and-virtualization).
