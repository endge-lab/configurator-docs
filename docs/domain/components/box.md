# Box

`Box` группирует содержимое и задаёт bounds, фон, border и spacing. Он не меняет
layout children: для flow используйте [Flex](./flex), для tracks — [Grid](./grid).

```vue
<Box p="4" bg="surface" borderWidth="1" borderColor="muted" r="4">
  <Text weight="600">{{ flight.number }}</Text>
</Box>
```

| Атрибуты | Тип | Назначение |
| --- | --- | --- |
| `bg` | token/string | Фон. |
| `borderWidth`, `borderColor` | number/string | Рамка. |
| `radius` / `r` | number/string | Скругление. |
| `p`, `px`, `py`, `pt`, `pr`, `pb`, `pl` | number/string | Padding. |
| `m`, `mx`, `my`, `mt`, `mr`, `mb`, `ml` | number/string | Margin. |
| `width` / `w`, `height` / `h` | number/string | Размеры. |
| `minWidth`, `maxWidth`, `minHeight`, `maxHeight` | number/string | Constraints. |
| `tooltip` / `:tooltip` | string/expression | Tooltip metadata. |

