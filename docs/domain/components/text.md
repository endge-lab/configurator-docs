# Text

`Text` выводит строку, подпись или inline-значение. Значение можно передать
children-интерполяцией или атрибутом `value`.

```vue
<Flex col gap="1">
  <Text weight="600">{{ flight.number }}</Text>
  <Text color="muted" size="12" truncate>{{ flight.route }}</Text>
  <Text :value="flight.status" tooltip="Current status" />
</Flex>
```

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `value` / `:value` | string / expression | Заменяет текстовых children. |
| `color` | token/string | Цвет текста. |
| `size` | number/string | Размер текста. |
| `weight` | number/string | `400`–`700`, `normal`, `medium`, `semibold`, `bold`. |
| `align`, `valign` | string | Горизонтальное и вертикальное выравнивание. |
| `lineHeight` | number/string | Высота строки. |
| `truncate` | boolean | Однострочное сокращение. |
| `wrap` | boolean/string | `normal`, `nowrap`, `true`, `false`. |
| `tooltip` / `:tooltip` | string/expression | Tooltip metadata. |

Также доступны [общие атрибуты](./common-attributes), flow directives и Grid placement.

