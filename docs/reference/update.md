# Update

Update — source-first рецепт изменения данных одного Store. Владелец задаётся
полем `storeIdentity` самого документа, а Source описывает типы обрабатываемых
событий и одну или несколько mutations.

Update не является отдельным глобальным обработчиком и не владеет runtime.
Компилятор включает его в таблицу обработчиков Store, а `StoreRuntimeHost`
применяет подготовленные mutation plans атомарно через Raph transaction.

## Полный пример

Пусть Update принадлежит Store `schedule` и получает payload:

```json
{
  "id": "SU-123",
  "patch": { "status": "boarding" }
}
```

Source документа:

```ts
defineUpdate({
  handles: ['schedule.row.updated', 'edited'],

  mutations: [
    {
      strategy: 'merge',
      target: 'rows[id=$id]',
      ifExists: 'rows[id=$id]',
      valueFrom: 'patch',
      vars: {
        id: 'id',
      },
    },
  ],
})
```

Runtime разрешит `$id` из `payload.id`, найдёт существующую строку и сольёт в неё
`payload.patch`. Если строка отсутствует, `ifExists` пропустит mutation.

## Владение Store

`storeIdentity` не объявляется внутри `defineUpdate(...)`. Он является отдельным
полем сохраняемого документа и выбирается при создании Update в Configurator.

Правила владения:

- один Update принадлежит ровно одному Store;
- mutation может писать только в `value(...)`-поле этого Store;
- запись в отсутствующее или derived-поле является compile error;
- Store не может применить Update, принадлежащий другому Store;
- два Update одного Store не могут содержать одинаковый тип в `handles`.

Такой контракт не позволяет Stream или Component SFC произвольно менять чужое
runtime-состояние.

## Handles

`handles` связывает нормализованный тип события с Update:

```ts
handles: 'schedule.row.updated'
```

или:

```ts
handles: ['schedule.row.updated', 'edited']
```

`handles: []` допустим для именованного Update, который вызывается явно. При
автоматическом `dispatchTo(...)` Store выбирает единственный Update, объявивший
тип события. Дубли типов внутри одного Store отклоняются компилятором.

## Mutations

`mutations` — непустой массив. Все его элементы сначала превращаются в mutation
plans, а затем применяются одной transaction.

| Поле | Назначение |
| --- | --- |
| `strategy` | `set`, `replace`, `merge`, `append` или `remove` |
| `target` | Store-relative path; `$var` подставляется из `vars` |
| `valueFrom` | Путь к значению в payload; пустая строка означает текущий payload |
| `vars` | Соответствие `$var` и payload path |
| `ifExists` | Store-relative guard path; mutation пропускается, если значения нет |
| `forEach` | Payload path для разворачивания одной mutation на несколько элементов |

Стратегии:

| Strategy | Поведение |
| --- | --- |
| `set` | Записывает новое значение по target |
| `replace` | Явно заменяет значение по target; в v1 исполняется как `set` |
| `merge` | Объединяет payload value с текущим значением |
| `append` | Добавляет одно значение или массив значений в массив target |
| `remove` | Удаляет значение по target; `valueFrom` не используется |

`target` должен быть безопасным относительным путём без ведущей точки и `..`.
Каждая переменная, использованная как `$name`, должна быть объявлена в `vars`.

## Несколько изменений

Один Update может изменить несколько частей Store атомарно:

```ts
defineUpdate({
  handles: ['schedule.row.removed'],

  mutations: [
    {
      strategy: 'remove',
      target: 'rows[id=$id]',
      vars: { id: 'id' },
    },
    {
      strategy: 'set',
      target: 'lastChangedAt',
      valueFrom: 'occurredAt',
      vars: {},
    },
  ],
})
```

Либо одна mutation может обработать коллекцию payload:

```ts
defineUpdate({
  handles: ['schedule.rows.updated'],

  mutations: [
    {
      strategy: 'merge',
      target: 'rows[id=$id]',
      forEach: 'items[]',
      ifExists: 'rows[id=$id]',
      valueFrom: 'patch',
      vars: { id: 'id' },
    },
  ],
})
```

Внутри `forEach` обычные пути читаются из текущего элемента. Для обращения к
исходному payload доступны `$root` и `$root.path`, к родительскому контейнеру —
`$parent` и `$parent.path`.

## Автоматический dispatch из Stream

[Stream](/reference/stream) нормализует сообщение, а Composition направляет его
в Store:

```ts
defineComposition({
  data: {
    schedule: store('schedule'),
  },

  runtimes: {
    changes: stream('schedule-events')
      .dispatchTo(data('schedule')),
  },
})
```

Store сопоставляет `event.type` с `handles` своих Updates. Stream при этом не
знает ни identity Update, ни mutation paths.

## Явный вызов из события компонента

Именованный Update можно выбрать в Composition независимо от `handles`:

```ts
defineComposition({
  data: {
    schedule: store('schedule'),
  },

  runtimes: {
    table: component('schedule-table'),
  },

  hooks: [
    onEvent('table', 'edited')
      .applyUpdate(
        data('schedule'),
        update('schedule-update-row'),
      ),
  ],
})
```

Payload Event передаётся Update как input по умолчанию. Для одноразового
локального UI-изменения Composition также поддерживает inline `.mutate(...)`.
Persisted Update нужен, когда рецепт переиспользуется или должен выбираться по
типу события через `dispatchTo(...)`.

Общая модель Event, occurrence, Action и глобальной transport-шины описана в
разделе [события и обновления](/core/events-and-updates).
