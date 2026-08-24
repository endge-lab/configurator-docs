# Адаптеры и ограничения

Component SFC зависит от публичного контракта Table, а не от API конкретной
grid-библиотеки. Стандартные Vue-адаптеры используют разные реализации:

| Адаптер | Реализация Table |
| --- | --- |
| `vue-native` | RevoGrid |
| `vue-shadcn` | TanStack Table и TanStack Virtual |
| `aodb` | AODB DataTable на TanStack Table |

Все адаптеры должны сохранять структуру `Table`/`Column`/`Cell`, смысловые Events,
Actions, row identity и authored defaults. Внешний Component SFC не импортирует
RevoGrid или TanStack.

## Стандартный selection UX

`selection-trigger="auto"` позволяет адаптеру выбрать привычное для его
окружения взаимодействие, не меняя публичный Source-контракт:

| Адаптер | `auto` разрешается как |
| --- | --- |
| `vue-native` | `row` |
| `vue-shadcn` | `row` |
| `aodb` | `control` |

Если переносимый Component SFC требует конкретного поведения, укажите
`control`, `row` или `both` явно. Явное значение имеет приоритет над стандартом
адаптера. Во всех вариантах используется одно состояние selection, поэтому
выбор через control обязан давать ту же подсветку, Events и Actions, что и
выбор через строку.

`cell-selection-mode="single"` одинаково поддерживается `vue-native`,
`vue-shadcn` и `aodb`. Во всех трёх реализациях identity ячейки — это
`rowId + columnKey`, публикуется `cellSelectionChanged`, а выбранная surface
получает states `selected` и `cell-selected`. Row selection и cell selection
работают одновременно и хранят независимое состояние. При `row`/`both` клик
по ячейке также применяет row-selection policy; при `control` — не меняет строки.
`Escape` очищает оба selection, если клавишу не обработал вложенный control.

## Что может различаться

- внешний вид toolbar и pagination;
- жест открытия меню заголовка;
- состав встроенного `default` column menu;
- наличие adapter-specific column manager;
- способ измерения виртуальных строк;
- theme hint и доступные visual tokens.

Если одинаковый UX обязателен, объявляйте inline `ColumnMenu` и проверяйте обе
активные реализации. Не делайте вывод о переносимости по одному renderer-у.

## Текущие ограничения

| Возможность | Статус |
| --- | --- |
| Локальный paging | Поддерживается |
| Виртуализация локальной коллекции | Поддерживается |
| Серверный paging через `lazy` | Пока не реализован |
| Сортировка | Локальная, по переданным `rows` |
| Универсальный `Table` search/filter prop | Отсутствует |
| Loading/error props | Отсутствуют; принадлежат внешнему runtime |
| Отдельный `ColumnMenu` на каждой Column | Не поддерживается в v1 |
| Grouping и aggregation contract | Не объявлен публичным Table API |
| Persistence selection | Не поддерживается |
| Выбор одной ячейки | Поддерживается во всех обязательных адаптерах |

## Как документировать расширение

Новая возможность становится общей только после появления renderer-neutral
контракта, compiler validation и реализации во всех обязательных адаптерах.
Опция одной grid-библиотеки не должна автоматически попадать в публичную SFC
документацию.

Application может зарегистрировать собственный adapter, но он обязан сохранить
внешние данные, Events, Actions и lifecycle Table. Adapter-specific расширения
не должны менять Source-контракт без отдельного публичного capability.
