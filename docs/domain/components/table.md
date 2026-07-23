# Table

`Table` отображает коллекцию строк и описывает её колонки через дочерние теги
[Column](./column). Таблица поддерживает сортировку, закрепление и видимость
колонок, контекстное меню, локальное разбиение на страницы и виртуальную
прокрутку.

Один и тот же тег работает через разные UI-адаптеры:

- Native Vue использует RevoGrid;
- приложение может подключить собственную реализацию; например, AODB использует
  локальный адаптер поверх TanStack Table.

Внешний контракт тега при этом остаётся одинаковым. Разработчику Component SFC
не требуется знать, какой grid используется внутри активного адаптера.

## Минимальный пример

```vue
<script setup lang="ts">
defineProps<{
  rows: Array<{
    id: string
    flight: string
    gate: string
  }>
}>()
</script>

<template>
  <Table :rows="rows" row-key="id">
    <Column key="flight" title="Рейс" />
    <Column key="gate" title="Выход" />
  </Table>
</template>
```

`rows` содержит полную локальную коллекцию. `row-key` указывает поле со
стабильным идентификатором строки.

## Атрибуты

| Атрибут | Тип | Значение по умолчанию | Назначение |
| --- | --- | --- | --- |
| `rows` / `:rows` | массив / выражение | `[]` | Данные таблицы. |
| `row-key` / `rowKey` | строка | `id` | Поле со стабильным идентификатором строки. |
| `selection-mode` / `selectionMode` | `none` / `single` / `multiple` | `none` | Режим локального выбора строк. |
| `id` / `tableId` | строка | — | Идентификатор экземпляра для сохранения состояния таблицы. |
| `paging` | `pages` / `virtual` | `pages` | Выбирает локальные страницы или единый виртуальный список. |
| `page-size` / `pageSize` | число / строка | `10` | Число строк на странице в режиме `pages`. |
| `page-sizes` / `pageSizes` | строка / массив | `10,25,50,100` | Размеры страницы, доступные пользователю. |
| `lazy` | boolean | `false` | Зарезервированный признак будущей удалённой загрузки. Сейчас запросы не выполняет. |
| `row-size` / `rowSize` | число / строка | `40` | Расчётная высота строки в пикселях. |
| `width` / `w` | число / строка | `100%` | Ширина таблицы. |
| `height` / `h` | число / строка | доступная высота | Высота таблицы. |
| `theme` | строка | зависит от адаптера | Подсказка адаптеру для выбора темы grid. |
| `sort-mode` | строка | зависит от декларации сортировки | Режим сортировки: `single`, `multiple`, `fixed` или `disabled`. |
| `default-sort` | строка | — | Начальная сортировка в формате `column:asc` или `column:desc`. |
| `column-pin` | `enabled` / `disabled` | зависит от адаптера | Разрешает или запрещает закрепление колонок. |
| `default-pin` | строка | — | Начальное закрепление в формате `column:left` или `column:right`. |
| `default-hidden` | строка | — | Ключи колонок, скрытых при первом открытии, через запятую. |
| `column-menu` | `default` / `disabled` | `default` | Включает встроенное меню колонок или отключает его. |
| `cell-align` | строка | `left` | Горизонтальное выравнивание содержимого ячеек. |
| `cell-vertical-align` | строка | `middle` | Вертикальное выравнивание содержимого ячеек. |

Допустимые прямые дочерние элементы: один [ColumnMenu](./column-menu) и любое
число [Column](./column).

## События Table

Оба адаптера публикуют одинаковые события и payload. DOM Event никогда не
выходит за границу renderer-а.

| Event identity | Название в UI | Основные поля payload |
| --- | --- | --- |
| `rowActivated` | Активация строки | `tableId`, `rowId`, `rowIndex`, `row`, `columnKey`, `activation` |
| `rowContextMenuRequested` | Контекстное меню строки | данные строки, `columnKey`, `anchor: { x, y }` |
| `selectionChanged` | Изменение выбора строк | `mode`, выбранные строки и идентификаторы, добавленные и удалённые идентификаторы |
| `sortChanged` | Изменение сортировки | `sort: { columnKey, direction }[]` |
| `columnVisibilityChanged` | Изменение видимости колонок | `visibility`, `hiddenColumnKeys` |
| `columnPinChanged` | Изменение закрепления колонок | `left`, `right` |
| `columnOrderChanged` | Изменение порядка колонок | `columnKeys` |
| `columnSizeChanged` | Изменение размера колонки | `sizes`, `changedColumnKey` |
| `pageChanged` | Изменение страницы | `pageIndex`, `pageSize`, `pageCount` |

Кроме этих смысловых Events, корневой тег `Table` поддерживает общие события
указателя, мыши, клавиатуры, фокуса, прокрутки и drag-and-drop. В частности,
доступны `click`, `dblclick`, `contextmenu`, `mouseover`, `pointerdown`,
`keydown`, `focus`, `wheel`, `scroll` и события drag-and-drop.

Есть важное различие: `@contextmenu` относится ко всей области Table и имеет
общий pointer payload, а `@rowContextMenuRequested` возникает только для строки
и содержит `rowId`, `row`, `columnKey` и `anchor`. Оба варианта можно обработать
локально через `action(...)` в атрибуте или вывести наружу через
`definePorts.emits`/`forward`.

Общий список браузерных Events, их payload и правила `.stop`/bubbling описаны в
[руководстве по событиям Component SFC](/guides/component-events).

Начальная гидратация состояния события не создаёт. Изменения через встроенные
Table Actions, напротив, публикуют те же события, что и действия пользователя.
Resize объединяется: подписчик получает итоговый размер, а не сообщение на
каждое движение указателя.

## Выбор и активация строк

```vue
<Table
  ref="table"
  id="departures"
  :rows="rows"
  row-key="id"
  selection-mode="multiple"
/>
```

- одинарный клик или `Space` изменяет выбор;
- в режиме `multiple` `Cmd/Ctrl` переключает одну строку, а `Shift` выбирает диапазон;
- двойной клик или `Enter` публикует `rowActivated`;
- контекстное меню строки публикует `rowContextMenuRequested`;
- выбор хранится только в смонтированном экземпляре;
- если выбранная строка исчезла из `rows`, Table пересчитывает выбор и публикует `selectionChanged`.

Чтобы вывести события Table в контракт Component SFC, используйте `from` или
`forward`:

```ts
const ports = definePorts({
  emits: {
    rowActivated: event<TableRowActivatedEvent>({
      from: { ref: 'table', event: 'rowActivated' },
    }),
  },
})
```

## Видимость колонок

По умолчанию видны все колонки. `default-hidden` содержит только ключи колонок,
которые нужно скрыть при первом открытии таблицы:

```vue
<Table
  id="schedule"
  :rows="rows"
  default-hidden="internalId,debugInfo"
>
  <Column key="flight" title="Рейс" />
  <Column key="internalId" title="Внутренний ID" />
  <Column key="debugInfo" title="Диагностика" />
</Table>
```

Отдельный `visibility-mode` не нужен. Колонки, которых нет в `default-hidden`,
остаются видимыми; новые колонки также видимы автоматически. Если список стал
пустым, атрибут можно удалить.

Ключи в `default-hidden` должны ссылаться на существующие прямые `Column` со
статическим `key`. Compiler выдаёт diagnostic для отсутствующего или
повторяющегося ключа. Dynamic expression остаётся доступным в Source, но
визуальный редактор не перезаписывает такое выражение.

Все UI-адаптеры применяют один и тот же Source default. Native Vue/RevoGrid
скрывает перечисленные колонки и принимает runtime visibility actions.
Прикладной адаптер может дополнительно предоставить собственный column manager,
не меняя контракт `Table`.

::: warning Не контроль доступа
`default-hidden` управляет только представлением. Данные скрытой колонки могут
оставаться в `rows`, поэтому атрибут нельзя использовать для защиты секретных
или недоступных пользователю данных.
:::

## Как выбрать режим отображения

| Задача | Конфигурация |
| --- | --- |
| Показать данные по 10 строк с переключением страниц | `paging="pages"` |
| Разрешить пользователю выбирать размер страницы | `paging="pages" page-sizes="10,25,50,100"` |
| Показать всю локальную выборку одной прокручиваемой таблицей | `paging="virtual"` |
| Подготовить декларацию к будущей серверной загрузке | `lazy`, но пока без изменения поведения запроса |

## Локальное разбиение на страницы

Режим `pages` используется по умолчанию. Все строки уже должны находиться в
`rows`: таблица не обращается к серверу, а сама выбирает текущую страницу из
локального массива.

```vue
<Table
  id="departures"
  :rows="rows"
  row-key="id"
  paging="pages"
  page-size="10"
  page-sizes="10,25,50,100"
>
  <Column key="flight" title="Рейс" sortable />
  <Column key="std" title="Вылет" sortable sort="date" />
  <Column key="gate" title="Выход" />
</Table>
```

В этом режиме таблица:

1. получает полную локальную коллекцию;
2. применяет сортировку ко всей коллекции;
3. выбирает строки текущей страницы;
4. показывает панель управления страницами.

`page-size="10"` означает, что одновременно отображается не более десяти строк.
`page-sizes="10,25,50,100"` формирует список доступных размеров страницы. После
смены размера таблица возвращается на первую страницу.

Следующая сокращённая запись полностью допустима:

```vue
<Table :rows="rows" />
```

Она эквивалентна следующей конфигурации:

```vue
<Table
  :rows="rows"
  paging="pages"
  page-size="10"
  page-sizes="10,25,50,100"
/>
```

## Единый виртуальный список

Режим `virtual` нужен, когда все данные уже загружены локально, но пользователю
не нужны страницы. Он может непрерывно прокручивать всю выборку.

```vue
<Table
  id="departures"
  :rows="rows"
  row-key="id"
  paging="virtual"
  row-size="40"
>
  <Column key="flight" title="Рейс" sortable />
  <Column key="std" title="Вылет" sortable sort="date" />
  <Column key="gate" title="Выход" />
</Table>
```

В режиме `virtual`:

- таблица получает всю локальную коллекцию;
- страницы и панель переключения страниц отсутствуют;
- сортировка применяется ко всей коллекции;
- в интерфейсе создаются только строки, попавшие в видимую область, и небольшой
  запас строк рядом с ней;
- при прокрутке видимое окно строк пересчитывается автоматически.

Это позволяет работать с тысячами локальных строк без одновременного создания
тысяч DOM-элементов. Native Vue делегирует виртуализацию RevoGrid. Прикладной
адаптер отвечает за эквивалентную виртуализацию в своей табличной реализации.

`page-size` и `page-sizes` в этом режиме не управляют отображением, поэтому их
указывать не нужно.

## Атрибут lazy

`lazy` предназначен для будущей удалённой загрузки страниц:

```vue
<Table
  :rows="rows"
  paging="pages"
  page-size="10"
  lazy
>
  <Column key="flight" title="Рейс" />
</Table>
```

::: warning Текущее ограничение
Сейчас `lazy` не отправляет запросы, не передаёт `limit` и `offset` и не знает
об общем количестве строк на сервере. Пока backend contract не реализован,
таблица продолжает считать `rows` полной локальной коллекцией и выполняет обычное
локальное разбиение на страницы.
:::

Таким образом, `lazy` не является третьим режимом `paging`. `paging` отвечает за
визуальное представление уже переданных строк, а `lazy` в будущем будет отвечать
за способ получения данных.

## Состояние таблицы

Для таблицы, состояние которой должно сохраняться между повторными отрисовками,
задайте стабильный `id`:

```vue
<Table
  id="schedule-departures"
  :rows="rows"
  paging="pages"
  page-size="25"
>
  <Column key="flight" title="Рейс" sortable />
  <Column key="std" title="Вылет" sortable />
</Table>
```

Если runtime предоставляет хранилище состояния, адаптер использует этот
идентификатор для сохранения текущей страницы, выбранного размера страницы,
сортировки, порядка, видимости и закрепления колонок. Не используйте один `id`
для двух разных таблиц, смонтированных одновременно.

Сохранённая пользователем видимость имеет приоритет над `default-hidden`.
Source-значение применяется, когда сохранённого runtime state ещё нет или оно
сброшено. Это отделяет authored default от персональной настройки пользователя.

## Пользовательское содержимое ячейки

Внутри `Cell` доступны текущая строка `row`, значение колонки `value` и индекс
строки `rowIndex`:

```vue
<Table :rows="rows" row-key="id" paging="virtual">
  <Column key="flight" title="Рейс" sortable>
    <Cell>
      <Badge tone="info">{{ row.flight }}</Badge>
    </Cell>
  </Column>

  <Column key="std" title="Вылет" sortable sort="date">
    <Cell>
      <DateTime :value="value" format="HH:mm" />
    </Cell>
  </Column>
</Table>
```

Виртуализация не меняет контекст ячейки: `rowIndex` остаётся индексом строки в
полной отсортированной коллекции, а не позицией внутри видимого окна.

## Меню и встроенные Actions

Встроенное и объявленное через `ColumnMenu` меню автоматически использует
системные Table Actions. Повторно объявлять их в `definePorts.provides` не нужно.

```vue
<script setup lang="ts">
const ports = definePorts({
  forward: {
    from: 'departures',
    ports: {
      provides: '*',
    },
  },
})
</script>

<template>
  <Table
    ref="departures"
    id="departures"
    :rows="rows"
    sort-mode="multiple"
    default-sort="std:asc,flight:asc"
    column-pin="enabled"
    default-pin="flight:left,status:right"
    default-hidden="status"
  >
    <ColumnMenu>
      <MenuItem action="table.sort.clearAll" label="Сбросить сортировку" />
    </ColumnMenu>

    <Column key="flight" title="Рейс" sortable />
    <Column key="std" title="Вылет" sortable sort="date" />
    <Column key="status" title="Статус" />
  </Table>
</template>
```

Если Actions должны стать частью внешнего контракта всего Component SFC,
используйте `forward` от literal `ref`, как в примере выше.

| Action | Эффект |
| --- | --- |
| `table.sort.setColumnAsc` | Сортирует текущую колонку по возрастанию. |
| `table.sort.setColumnDesc` | Сортирует текущую колонку по убыванию. |
| `table.sort.clearColumn` | Удаляет сортировку текущей колонки. |
| `table.sort.clearAll` | Удаляет все активные сортировки. |
| `table.column.pinLeft` | Закрепляет текущую колонку слева. |
| `table.column.pinRight` | Закрепляет текущую колонку справа. |
| `table.column.unpin` | Снимает закрепление текущей колонки. |
| `table.column.resetPin` | Возвращает начальное закрепление текущей колонки. |
| `table.column.resetAllPins` | Возвращает начальное закрепление всех колонок. |
| `table.column.hide` | Скрывает текущую колонку в runtime state. |

Каждый Action получает контекст конкретного смонтированного экземпляра `Table`.
Состояние сортировки, видимости и закрепления не становится глобальным singleton
даже при нескольких экземплярах одного Component SFC.
