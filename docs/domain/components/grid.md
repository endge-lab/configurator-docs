# Grid

`Grid` — renderer-neutral track layout. Контейнер определяет колонки и строки,
а прямые children описывают placement через общие Grid attributes.

```vue
<Grid columns="12" gap="2" autoRows="28px" p="2">
  <Text colStart="1" colSpan="5" rowStart="1" rowSpan="2">
    Five columns
  </Text>
  <Box colStart="6" colSpan="7" rowStart="1" rowSpan="2">
    <Text>Seven columns</Text>
  </Box>
</Grid>
```

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `columns` | number/string | Число равных колонок или track expression; default `12`. |
| `rows` | number/string | Явные rows или track expression. |
| `gap` | number/string | Общий gap. |
| `columnGap`, `rowGap` | number/string | Независимые gaps. |
| `autoRows` | number/string | Размер implicit rows; без него высота content-driven. |
| `autoFlow` | string | `row`, `column`, `row dense`, `column dense`. |
| `align`, `justify` | string | Item alignment внутри cells. |
| spacing, size, constraints | number/string | [Общие атрибуты](./common-attributes). |

Прямые children принимают `colStart`, `colSpan`, `rowStart`, `rowSpan`.
Эти параметры сохраняются в Source и применяются Vue и Native DOM adapters.

