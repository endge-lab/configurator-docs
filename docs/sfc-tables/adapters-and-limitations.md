# Адаптеры и ограничения

Component SFC зависит от публичного контракта Table, а не от API конкретной
grid-библиотеки. Стандартные Vue-адаптеры используют разные реализации:

| Адаптер | Реализация Table |
| --- | --- |
| `vue-native` | RevoGrid |
| `vue-shadcn` | TanStack Table и TanStack Virtual |

Оба должны сохранять структуру `Table`/`Column`/`Cell`, смысловые Events,
Actions, row identity и authored defaults. Внешний Component SFC не импортирует
RevoGrid или TanStack.

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

## Как документировать расширение

Новая возможность становится общей только после появления renderer-neutral
контракта, compiler validation и реализации во всех обязательных адаптерах.
Опция одной grid-библиотеки не должна автоматически попадать в публичную SFC
документацию.

Application может зарегистрировать собственный adapter, но он обязан сохранить
внешние данные, Events, Actions и lifecycle Table. Adapter-specific расширения
не должны менять Source-контракт без отдельного публичного capability.
