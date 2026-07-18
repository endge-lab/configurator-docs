# MenuItem

`MenuItem` связывает пункт [ColumnMenu](./column-menu) с runtime command.

```vue
<MenuItem
  id="sort-ascending"
  command="table.sort.setColumnAsc"
  label="Sort ascending"
  icon="arrow-up"
/>
```

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `command` | literal string | Обязательная command identity. |
| `label` | literal string | Обязательная подпись. |
| `id` | literal string | Stable item id; default равен `command`. |
| `icon` | literal string | Опциональная renderer-neutral icon identity. |

В v1 значения должны быть literals: dynamic menu descriptors compiler не принимает.

