# Flex

`Flex` — flow layout для последовательной row/column композиции. Он распределяет
доступное пространство родителя и не использует скрытую editor grid geometry.

```vue
<Flex col gap="2" p="2">
  <Text>Обе строки заполняют доступную ширину</Text>
  <Text color="muted">Высота определяется содержимым</Text>
</Flex>

<Flex row gap="4" align="center" justify="space-between">
  <Text>{{ flight.number }}</Text>
  <Badge :tone="flight.statusTone">{{ flight.status }}</Badge>
</Flex>
```

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `direction` | `row` / `column` | Основное направление. |
| `row`, `col` | boolean | Shortcuts; `direction` имеет приоритет. |
| `gap` | number/string | Расстояние между children. |
| `align` | `start` / `center` / `end` / `stretch` | Cross-axis alignment. |
| `justify` | `start` / `center` / `end` / `space-between` | Main-axis distribution. |
| `wrap` | boolean/string | `wrap` или `nowrap`. |
| `bg`, border, radius | token/string | Container appearance. |
| spacing, size, constraints | number/string | [Общие атрибуты](./common-attributes). |

В UI editor column children растягиваются по ширине, а row children получают
равную flexible basis. Для точного column span используйте `Grid`.

