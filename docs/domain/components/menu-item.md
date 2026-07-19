# MenuItem

`MenuItem` связывает пункт [ColumnMenu](./column-menu) с intrinsic Action Table,
built-in Action или Action, явно объявленным в `definePorts.provides` текущего
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

Статический input можно записать в object binding:

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
быть static object literal; runtime expressions будут добавлены отдельным
expression artifact.

| Атрибут | Тип | Назначение |
| --- | --- | --- |
| `action` | literal string / static object | Action identity либо `{ identity, input? }`. |
| `label` | literal string | Обязательная подпись. |
| `id` | literal string | Stable item id; default равен `action`. |
| `icon` | literal string | Опциональная renderer-neutral icon identity. |

В v1 `label`, `id` и `icon` должны быть literals. Атрибут `command` удалён и
является compiler error.
