# Данные, строки и ячейки

`rows` — полная локальная коллекция, доступная текущему экземпляру `Table`.
Обычно она приходит в Component SFC через prop, связанный с DataView или Store.

```vue
<script setup lang="ts">
defineProps<{
  rows: Array<{
    id: number
    number: string
    customer: { name: string }
    status: string
  }>
}>()
</script>

<template>
  <Table :rows="rows" row-key="id">
    <Column key="number" title="Номер" />
    <Column key="customer.name" title="Клиент" />
    <Column key="status" title="Статус" />
  </Table>
</template>
```

## Identity строки

`row-key` указывает поле со стабильной identity. По умолчанию используется `id`.
Identity должна быть уникальной и сохраняться при сортировке, paging,
виртуализации и обновлении коллекции.

В отличие от `Column.key`, `row-key` не является вложенным dot-path. Если
identity находится внутри объекта, подготовьте плоское поле в DataView.

Не используйте `rowIndex` как identity. Индекс меняется при сортировке и
фильтрации. Значение `rowKey`, напротив, сохраняет исходный тип: если `id` в
данных является числом, в SFC context он также остаётся числом.

## Контекст ячейки

Внутри `Column` и `Cell` доступны:

| Local | Значение |
| --- | --- |
| `row` | Полная текущая строка |
| `rowKey` | Значение поля `row-key` с исходным типом |
| `rowIndex` | Индекс в полной отсортированной коллекции |
| `columnKey` | Ключ текущей колонки |
| `value` | Значение строки по пути `columnKey` |
| `columnMeta` | Compiled metadata текущей `Column` |

```vue
<Column key="status" title="Статус">
  <Cell>
    <Flex row gap="2" align="center">
      <Dot :tone="row.statusTone" />
      <Text>{{ value }}</Text>
    </Flex>
  </Cell>
</Column>
```

`Cell` необязателен. Без него renderer выводит значение по `Column.key`. Если
внутри `Column` есть визуальные children без обёртки `Cell`, они получают тот же
контекст.

## Обработка browser events на Cell

`Cell` поддерживает общий атрибут `:on`. Это позволяет привязать реакцию к жесту
конкретной ячейки без дополнительного `Box` или `Flex`:

```vue
<Column key="status" title="Статус">
  <Cell
    :on="{
      event: 'click',
      modifiers: { shift: true },
      reaction: action({
        identity: 'status.inspect',
        input: { rowId: rowKey, row, columnKey, value, event: event() },
      }),
    }"
  >
    <Text>{{ value }}</Text>
  </Cell>
</Column>
```

В Visual editor обработчики находятся в настройках выбранной колонки. При первом
добавлении редактор автоматически оборачивает существующих прямых children
колонки в `Cell`, не заменяя их Source.

## Обновление `rows`

Новый массив строк не сбрасывает authored-конфигурацию Table. Runtime:

- пересчитывает sort и paging;
- ограничивает номер страницы новым диапазоном;
- удаляет из selection identities, которых больше нет;
- повторно рендерит только актуальное окно строк.

Для записи изменений обратно в данные используйте semantic Event и Store-owned
Update. Подробный путь описан в [редактировании ячеек](./cell-editing).
