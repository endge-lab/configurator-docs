# DateTime

`DateTime` семантически выводит дату или время. Standard Vue adapter создаёт
`<time>` и форматирует валидное date-like значение через `Intl.DateTimeFormat`.

```vue
<Flex row gap="2">
  <DateTime :value="flight.std" format="HH:mm" />
  <DateTime :value="flight.updatedAt" format="date" color="muted" />
</Flex>
```

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `value` / `:value` | date/string/expression | Исходное значение. |
| `format` | string | `HH:mm`, `date` или default date+time. |
| `timezone` | string | Renderer-neutral timezone hint. |
| `empty` | string | Текст для пустого значения. |
| `color`, `size`, `weight`, `align` | token/string | Typography attributes. |
| `tooltip` / `:tooltip` | string/expression | Tooltip metadata. |

::: warning Current adapter scope
`native-vue` v1 непосредственно поддерживает `HH:mm`, `date` и default format.
Произвольная format string и `timezone` сохраняются в IR, но требуют adapter support.
:::

