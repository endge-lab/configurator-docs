# MenuItem

`MenuItem` связывает пункт [ColumnMenu](./column-menu) или [RowMenu](./row-menu) с intrinsic Action Table,
built-in Action или Action, объявленным в `definePorts.require/provides` текущего
Component SFC.

```vue
<MenuItem
  id="sort-ascending"
  action="table.sort.setColumnAsc"
  label="По возрастанию"
  icon="arrow-up"
/>
```

Короткая форма содержит только identity. Если Action допускает отсутствие input,
provider использует своё default behavior:

```vue
<MenuItem
  action="built-in-console-log"
  label="Debug"
/>
```

Основной синтаксис отделяет Action identity от вычисляемого input:

```vue
<MenuItem
  action="order.open-details"
  :label="t('orders:menu.open', 'Открыть')"
  :input="{ id: rowId, row, columnKey, value }"
/>
```

Старый статический input в object binding остаётся совместимым:

```vue
<MenuItem
  :action="{
    identity: 'built-in-console-log',
    input: {
      message: 'Контекстное меню работает',
    },
  }"
  label="Debug"
/>
```

Action contract использует термин `input`, поэтому `payload` не поддерживается.
Пользовательские поля нельзя располагать рядом с `identity`: форма
`{ identity, message }` является compiler error. На текущем этапе `input` должен
быть static object literal. Dynamic input записывается отдельным `:input`.

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `action` | literal string / static object | Action identity либо legacy `{ identity, input? }`. |
| `input` | safe SFC expression | Input, вычисляемый в текущем menu context. |
| `label` | literal / safe SFC expression | Обязательная подпись, включая `t(key, fallback)`. |
| `id` | literal string | Stable item id; default равен `action`. |
| `icon` | literal string | Опциональная renderer-neutral icon identity. |

`id` и `icon` остаются literals. Атрибут `command` удалён и является compiler error.
