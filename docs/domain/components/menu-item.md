# MenuItem

`MenuItem` связывает пункт [ColumnMenu](./column-menu) или [CellMenu](./row-menu)
с прямой Action identity либо с Action port текущего Component SFC.

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
  v-if="$row.data.status !== 'archived'"
  :disabled="!$row.data.canOpen"
  :input="{ id: $row.id, field: $column.key, value: $cell.value }"
/>
```

Прямая строка является внешней Action dependency и не требует объявления в
`definePorts`. Если Action объявлен как `definePorts.require/provides`, ссылка
на его key задаётся expression binding:

```vue
<MenuItem :action="openDetails" label="Открыть" :input="{ id: rowId }" />
```

Прежняя строковая ссылка на существующий port key остаётся совместимой, но для
нового Source рекомендуется явный expression binding.

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
| `action` | literal string / port expression / static object | Прямая Action identity, Action port key либо legacy `{ identity, input? }`. |
| `input` | safe SFC expression | Input, вычисляемый в текущем menu context. |
| `label` | literal / safe SFC expression | Обязательная подпись, включая `t(key, fallback)`. |
| `id` | literal string | Stable item id; default равен `action`. |
| `icon` | literal string | Опциональная renderer-neutral icon identity. |
| `v-if` | safe SFC expression | Полностью скрывает пункт, если условие ложно. |
| `disabled` | boolean / safe SFC expression | Оставляет пункт видимым, но запрещает выполнение. |

`id` и `icon` остаются literals. Атрибут `command` удалён и является compiler error.
