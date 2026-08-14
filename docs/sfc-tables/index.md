# Таблицы SFC

Таблица в Component SFC — compound-компонент с единым renderer-neutral
контрактом. Source описывает данные, колонки, меню и authored defaults, compiler
переводит их в IR, а активный UI-адаптер материализует конкретный grid.

```vue
<Table
  ref="orders"
  id="orders"
  :rows="rows"
  row-key="id"
  paging="pages"
  page-size="25"
>
  <Column key="number" title="Номер" sortable />
  <Column key="status" title="Статус">
    <Cell><Badge :tone="row.statusTone">{{ value }}</Badge></Cell>
  </Column>
</Table>
```

## Границы ответственности

| Слой | Ответственность |
| --- | --- |
| Query / Store / DataView | Получение, хранение, обновление и подготовка строк |
| Component SFC | Структура Table, Column, Cell, меню и связи с портами |
| Table runtime | Локальная сортировка, paging, selection и состояние колонок |
| UI-адаптер | DOM/grid renderer, виртуализация и визуальные контролы |
| Action provider | Прикладной эффект: открытие, удаление, запрос или диалог |

`Table` не выполняет Query и не мутирует Store напрямую. Он принимает готовую
коллекцию `rows`, публикует смысловые Events и вызывает Actions через runtime.

## Что читать дальше

- Начните с [данных, строк и ячеек](./data-rows-cells).
- Для больших коллекций выберите режим в разделе
  [«Пейджинг и виртуализация»](./paging-and-virtualization).
- Меню строк и заголовков имеют разные context и описаны отдельно.
- Для интерактивных таблиц обязательно прочитайте
  [«События, порты и Actions»](./events-and-actions).
- Реальные различия renderer-ов перечислены в
  [«Адаптеры и ограничения»](./adapters-and-limitations).

Краткий справочник атрибутов остаётся на странице [Table](/domain/components/table).
