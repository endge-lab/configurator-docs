# Компоненты Endge SFC

Компоненты Endge SFC — renderer-neutral теги template. Source не содержит HTML
или Vue-компоненты: compiler преобразует теги в общий IR, после чего выбранный
adapter материализует их во Vue, Native DOM или другой target.

## Visual primitives

| Группа | Теги |
| --- | --- |
| Layout | [Box](./box), [Flex](./flex), [Grid](./grid), [Divider](./divider) |
| Content | [Text](./text), [DateTime](./date-time), [Number](./number), [Icon](./icon), [Badge](./badge), [Dot](./dot) |
| Display-only controls | [Input](./input), [Textarea](./textarea), [Checkbox](./checkbox), [Select](./select) |

Эти теги входят в обязательный renderer-adapter contract. Стандартные adapters:

- `native-vue` из `@endge/ui-vue`;
- `native-dom` из `@endge/native-dom`.

## Runtime и structural primitives

| Назначение | Теги |
| --- | --- |
| Вызов дочернего SFC | [Component](./component) |
| Таблица | [Table](./table), [Column](./column), [Cell](./cell) |
| Меню колонок | [ColumnMenu](./column-menu), [MenuItem](./menu-item), [MenuSeparator](./menu-separator) |

Structural tags компилируются в тот же IR, но обрабатываются runtime renderer-ом,
а не visual adapter map.

## Полный пример

```vue
<script setup lang="ts">
defineProps<{
  flights: FlightLeg[]
}>()
</script>

<template>
  <Grid columns="12" gap="2">
    <Flex col gap="2" colStart="1" colSpan="12">
      <Text weight="600">Flights</Text>
      <Badge tone="info">{{ flights.length }}</Badge>
    </Flex>

    <Table :rows="flights" row-key="id" colStart="1" colSpan="12">
      <Column key="number" title="Flight" sortable>
        <Cell><Text>{{ row.number }}</Text></Cell>
      </Column>
    </Table>
  </Grid>
</template>
```

Все visual tags принимают [общие атрибуты](./common-attributes), Endge
control-flow directives и собственные атрибуты, перечисленные на их страницах.

