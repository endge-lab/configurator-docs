# Divider

`Divider` визуально разделяет соседние элементы.

```vue
<Flex col gap="2">
  <Text>Header</Text>
  <Divider />
  <Text>Body</Text>
</Flex>

<Flex row gap="2">
  <Text>Left</Text>
  <Divider orientation="vertical" />
  <Text>Right</Text>
</Flex>
```

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `orientation` | `horizontal` / `vertical` | Направление. |
| `vertical` | boolean | Shortcut вертикального режима. |
| `color` | token/string | Цвет. |
| `thickness` | number/string | Толщина линии. |
| `width` / `w`, `height` / `h` | number/string | Bounds. |
| margin attributes | number/string | Внешние интервалы. |

