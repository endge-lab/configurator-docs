# Textarea

`Textarea` отображает многострочное string value.

```vue
<Textarea
  :value="flight.comment"
  rows="4"
  placeholder="No comment"
  readonly
/>
```

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `value` / `:value` | string/expression | Отображаемый текст. |
| `rows` | number/string | Количество видимых строк. |
| `placeholder` | string | Placeholder. |
| `readonly` | boolean | Read-only state. |
| `disabled` | boolean | Disabled state. |
| size, spacing, Grid placement | number/string | [Общие атрибуты](./common-attributes). |

Тег display-only в v1 и не предоставляет `v-model` или update callback.

