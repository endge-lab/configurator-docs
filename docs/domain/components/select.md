# Select

`Select` отображает одиночный или множественный выбор из `SourceFieldOption[]`.

```vue
<Select
  :value="status"
  :options="statusOptions"
  placeholder="Status"
/>

<Select multiple :value="airlines" :options="airlineOptions" />
```

```ts
type SourceFieldOption = {
  value: string | number | boolean
  label?: string
}
```

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `value` / `:value` | scalar/scalar[]/expression | Selected value или массив для `multiple`. |
| `options` / `:options` | `SourceFieldOption[]`/expression | Доступные варианты. |
| `multiple` | boolean | Multiple selection. |
| `placeholder` | string | Placeholder одиночного режима. |
| `readonly` | boolean | Metadata; native select не блокируется. |
| `disabled` | boolean | Disabled state. |

DOM values сравниваются через string normalization. Тег display-only и не
передаёт `change` обратно в runtime.

