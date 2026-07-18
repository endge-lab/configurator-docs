# MenuItem

`MenuItem` связывает пункт [ColumnMenu](./column-menu) с Action, объявленным в
`definePorts.provides` текущего Component SFC.

```vue
<MenuItem
  id="sort-ascending"
  action="table.sort.setColumnAsc"
  label="По возрастанию"
  icon="arrow-up"
/>
```

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `action` | literal string | Обязательная provided Action identity. |
| `label` | literal string | Обязательная подпись. |
| `id` | literal string | Stable item id; default равен `action`. |
| `icon` | literal string | Опциональная renderer-neutral icon identity. |

В v1 значения должны быть literals: dynamic menu descriptors compiler не принимает.
Атрибут `command` удалён и является compiler error.
