# Компоненты Endge SFC

Компоненты Endge SFC — renderer-neutral теги template. Source не содержит HTML
или Vue-компоненты: compiler преобразует теги в общий IR, после чего выбранный
adapter материализует их во Vue, Native DOM или другой target.

## Компоненты представления

[Text](./text), [DateTime](./date-time), [Number](./number), [Icon](./icon),
[Badge](./badge), [Dot](./dot) и [Tooltip](./tooltip) отображают данные и
состояние интерфейса. Они не определяют способ сохранения изменённого значения.

Visual primitives входят в базовый renderer-adapter contract. Shell-owned
`Tooltip` дополнительно входит в Vue adapter contract. Поддерживаемые adapters:

- `vue-native` из `@endge/ui-vue`;
- `vue-shadcn` из `@endge/ui-vue-shadcn`.

## Компоненты компоновки

[Box](./box), [Flex](./flex), [Grid](./grid) и [Divider](./divider) задают
расположение и визуальную структуру содержимого, не добавляя data-flow.

## Элементы ввода

[Input](./input), [Textarea](./textarea), [Checkbox](./checkbox) и
[Select](./select) отображают привычные элементы управления. В текущем
контракте они не владеют writeback: изменение данных определяется отдельным
механизмом редактирования, а не самим тегом.

## Структурные компоненты

| Назначение | Теги |
| --- | --- |
| Вызов дочернего SFC | [Component](./component) |
| Таблица | [Table](./table), [Column](./column), [Cell](./cell) |
| Меню таблицы | [ColumnMenu](./column-menu), [CellMenu](./row-menu), [MenuItem](./menu-item), [MenuSeparator](./menu-separator) |

Structural tags компилируются в тот же IR, но обрабатываются runtime renderer-ом,
а не visual adapter map.

Подробные сценарии paging, selection, меню и состояния находятся в отдельном
разделе [«Таблицы SFC»](/sfc-tables/).

## Редактирование значений

Редактирование — сквозное поведение, а не отдельный вид компонента. `Text`,
`Number` и `DateTime` могут открыть встроенный editor через `editable`, а
пользовательский editor подключается тем же runtime-контрактом. Запуск сессии,
выбор editor-а, commit, cancel и событие `edited` описаны в руководстве
[«Редактирование значений»](/sfc-tables/cell-editing).

## Полный пример

```vue
<script setup lang="ts">
defineProps<{
  orders: Order[]
}>()
</script>

<template>
  <Grid columns="12" gap="2">
    <Flex col gap="2" colStart="1" colSpan="12">
      <Text weight="600">Orders</Text>
      <Badge tone="info">{{ orders.length }}</Badge>
    </Flex>

    <Table :rows="orders" row-key="id" colStart="1" colSpan="12">
      <Column key="number" title="Номер" sortable>
        <Cell><Text>{{ row.number }}</Text></Cell>
      </Column>
    </Table>
  </Grid>
</template>
```

Все visual tags принимают [общие атрибуты](./common-attributes), Endge
control-flow directives и собственные атрибуты, перечисленные на их страницах.
Для сложных комбинаций событий используйте [универсальную аннотацию `:on`](./interactions).
