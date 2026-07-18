# Input

`Input` отображает scalar value в однострочном native control.

```vue
<Input :value="search" placeholder="Search" />
<Input type="Number" :value="delay" min="0" max="180" step="1" />
<Input type="DateTime" :value="updatedAt" readonly />
```

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `type` | `String` / `Number` / `Date` / `Time` / `DateTime` | Scalar type; default `String`. |
| `value` / `:value` | scalar/expression | Отображаемое значение. |
| `placeholder` | string | Placeholder. |
| `min`, `max`, `step` | string/number | Native-compatible limits. |
| `readonly` | boolean | Read-only state. |
| `disabled` | boolean | Disabled state. |

::: warning Display-only v1
Пользовательский ввод не отправляется в Store, Composition или runtime host.
При следующем render значение снова берётся из SFC props.
:::

