# События Component SFC на практике

Это руководство описывает весь реализованный Event-механизм Component SFC:
стандартные Events built-in тегов, локальные реакции в template, публичные
`definePorts.emits`, forwarding, Table Events, sandbox и визуальный редактор.

Важно различать три уровня:

| Уровень | Где объявляется | Что получает родитель |
| --- | --- | --- |
| Локальная реакция | `@click="action(...)"` на теге | Ничего, пока Event явно не опубликован |
| Публичный Event | `definePorts.emits` | Типизированный Event текущего Component SFC |
| Forwarding | `definePorts.forward` | Выбранные Events дочернего компонента |

Event является multicast-контрактом: реакция не заменяет публикацию и не
превращает Event в Action. Исключение — явный local modifier `.stop`, который
останавливает дальнейший маршрут конкретного occurrence.

## Только собственный контракт

```ts
const ports = definePorts({
  emits: {
    detailsOpened: event<{ id: string }>(),
  },
})
```

Такое событие можно испустить из разрешённой sandbox-реакции через
`ports.emits.detailsOpened({ id })` или через API runtime-host-а у системного
producer-а.

Если `from` отсутствует, Event принадлежит текущему Component SFC. Поле
`action` необязательно и не является default-значением: это текущая реакция,
которая хранится непосредственно в Source.

## Событие дочерней Table

```vue
<script setup lang="ts">
const ports = definePorts({
  emits: {
    rowActivated: event<TableRowActivatedEvent>({
      from: { ref: 'table', event: 'rowActivated' },
    }),
  },
})
</script>

<template>
  <Table ref="table" :rows="rows" row-key="id" />
</template>
```

## Direct Action

```ts
rowActivated: event<TableRowActivatedEvent>({
  from: { ref: 'table', event: 'rowActivated' },
  action: {
    identity: 'flight.open-details',
    input: {
      id: event('rowId'),
      row: event('row'),
    },
  },
})
```

`event()` передаёт весь payload. `event('row.id')` читает вложенное значение.

Direct Action запускается через `Endge.actions.execute` со scope текущего
runtime-компонента и target исходного элемента. Ошибка Action попадает в
diagnostics, но не отменяет публикацию Event другим подписчикам.

## Стандартные Events built-in тегов

Общий Event registry подключён к следующим renderer-neutral тегам:

`Text`, `DateTime`, `Number`, `Icon`, `Badge`, `Dot`, `Box`, `Flex`, `Grid`,
`Divider`, `Input`, `Textarea`, `Checkbox`, `Select` и `Table`.

Структурные теги `Column`, `Cell`, `ColumnMenu`, `MenuItem` и `MenuSeparator`
не являются самостоятельными rendered event targets. Вложенный пользовательский
`Component` публикует Events из собственного typed manifest.

### Указатель и мышь

| Identity | Название в UI | Payload |
| --- | --- | --- |
| `click` | Нажатие | `ComponentSFCPointerEventPayload` |
| `dblclick` | Двойное нажатие | `ComponentSFCPointerEventPayload` |
| `contextmenu` | Контекстное меню | `ComponentSFCPointerEventPayload` |
| `mousedown` | Нажатие кнопки мыши | `ComponentSFCPointerEventPayload` |
| `mouseup` | Отпускание кнопки мыши | `ComponentSFCPointerEventPayload` |
| `mousemove` | Движение мыши | `ComponentSFCPointerEventPayload` |
| `mouseover` | Наведение мыши | `ComponentSFCPointerEventPayload` |
| `mouseout` | Уход указателя мыши | `ComponentSFCPointerEventPayload` |
| `mouseenter` | Вход указателя мыши | `ComponentSFCPointerEventPayload` |
| `mouseleave` | Выход указателя мыши | `ComponentSFCPointerEventPayload` |
| `pointerdown` | Нажатие указателя | `ComponentSFCPointerEventPayload` |
| `pointerup` | Отпускание указателя | `ComponentSFCPointerEventPayload` |
| `pointermove` | Движение указателя | `ComponentSFCPointerEventPayload` |
| `pointerover` | Наведение указателя | `ComponentSFCPointerEventPayload` |
| `pointerout` | Уход указателя | `ComponentSFCPointerEventPayload` |
| `pointerenter` | Вход указателя | `ComponentSFCPointerEventPayload` |
| `pointerleave` | Выход указателя | `ComponentSFCPointerEventPayload` |

### Клавиатура, фокус и viewport

| Identity | Название в UI | Payload |
| --- | --- | --- |
| `keydown` | Нажатие клавиши | `ComponentSFCKeyboardEventPayload` |
| `keyup` | Отпускание клавиши | `ComponentSFCKeyboardEventPayload` |
| `focus` | Получение фокуса | `ComponentSFCInteractionEventPayload` |
| `blur` | Потеря фокуса | `ComponentSFCInteractionEventPayload` |
| `focusin` | Вход фокуса | `ComponentSFCInteractionEventPayload` |
| `focusout` | Выход фокуса | `ComponentSFCInteractionEventPayload` |
| `wheel` | Колесо мыши | pointer payload с `deltaX`, `deltaY` |
| `scroll` | Прокрутка | `ComponentSFCInteractionEventPayload` |

### Drag-and-drop

| Identity | Название в UI | Payload |
| --- | --- | --- |
| `dragstart` | Начало перетаскивания | `ComponentSFCPointerEventPayload` |
| `drag` | Перетаскивание | `ComponentSFCPointerEventPayload` |
| `dragend` | Завершение перетаскивания | `ComponentSFCPointerEventPayload` |
| `dragenter` | Вход перетаскивания | `ComponentSFCPointerEventPayload` |
| `dragleave` | Выход перетаскивания | `ComponentSFCPointerEventPayload` |
| `dragover` | Перетаскивание над областью | `ComponentSFCPointerEventPayload` |
| `drop` | Сброс | `ComponentSFCPointerEventPayload` |

Нативный `DataTransfer` наружу не передаётся.

### Form Events

Для `Input`, `Textarea`, `Checkbox` и `Select` дополнительно доступны `input` и
`change` с `ComponentSFCInputEventPayload`.

| Identity | Название в UI |
| --- | --- |
| `input` | Ввод |
| `change` | Изменение |

### Payload-контракты

Все interaction payload содержат:

```ts
interface ComponentSFCInteractionEventPayload {
  type: string
  modifiers: {
    alt: boolean
    ctrl: boolean
    meta: boolean
    shift: boolean
  }
}
```

Pointer payload дополнительно содержит `x`, `y`, `button`, `buttons` и
`pointerType`. Keyboard payload содержит `key`, `code` и `repeat`. Form payload
содержит `value` и, когда применимо, `checked`.

DOM Event и DOM element не входят в публичный payload. Поэтому один контракт
одинаково работает в native/RevoGrid, shadcn/TanStack и будущих renderer-ах.

## Локальная реакция на событие тега

Если событие не является частью публичного API компонента, Action можно
прикрепить прямо к тегу:

```vue
<Text
  ref="title"
  @click.stop.prevent="action({
    identity: 'audit.track-click',
    input: { pointer: event() },
  })"
>
  Открыть
</Text>
```

В этом случае `click` не появляется в `definePorts.emits` автоматически.
Локальный Action выполняется, `.prevent` отменяет browser default, а `.stop`
останавливает DOM bubbling и дальнейший public forwarding occurrence.

Если Event нужен и локально, и снаружи, добавьте публичный контракт и уберите
`.stop`:

```ts
const ports = definePorts({
  emits: {
    titleClicked: event<ComponentSFCPointerEventPayload>({
      from: { ref: 'title', event: 'click' },
    }),
  },
})
```

### Modifiers и bubbling

Следующие browser modifiers применяются к intrinsic Events built-in тегов:

| Modifier | Семантика |
| --- | --- |
| `.stop` | Выполняет локальную реакцию, затем останавливает DOM bubbling и Event routing выше текущей boundary |
| `.prevent` | Вызывает renderer-specific `preventDefault()`, если Event допускает отмену |
| `.self` | Запускает локальную реакцию только когда target совпадает с текущим rendered-узлом |
| `.once` | Запускает локальную реакцию один раз в пределах текущей mount-boundary |
| `.capture` | Подключает listener в capture phase |
| `.passive` | Подключает passive listener |

`.passive.prevent` является ошибкой compiler-а. После срабатывания `.once`
публичный Event продолжает публиковаться при следующих occurrences; один раз
выполняется именно локальная реакция.

Template handler обязан содержать безопасную reaction-форму `action({...})` или
`typescript({...})`. Вызов произвольной функции из `<script setup>` и передача
сырого DOM Event не поддерживаются.

## Локальный TypeScript

Когда direct Action недостаточен, sandbox можно использовать непосредственно на
теге:

```vue
<Text
  @contextmenu.prevent="typescript({
    inputs: { event: event() },
    compute({ event }, api) {
      return api.action('audit.write', {
        operation: 'title-context-menu',
        x: event.x,
        y: event.y,
      })
    },
  })"
>
  Рейс
</Text>
```

Это тот же sandbox, который используется в `definePorts.emits.action`.

## TypeScript в песочнице

```ts
const ports = definePorts({
  emits: {
    detailsOpened: event<{ id: string }>(),
    rowContextMenuRequested: event<TableRowContextMenuRequestedEvent>({
      from: { ref: 'table', event: 'rowContextMenuRequested' },
      action: typescript({
        inputs: { event: event() },
        compute({ event }, api) {
          return [
            api.action('audit.write', { rowId: event.rowId }),
            ports.emits.detailsOpened({ id: event.rowId }),
          ]
        },
      }),
    }),
  },
})
```

Этот вариант следует использовать только когда direct Action недостаточен.
Песочница не предоставляет DOM, сеть, imports, timers или прямой `Endge`.

Sandbox возвращает один effect или массив effects. Разрешены только
`api.action(...)` и вызовы объявленных `ports.emits.*`. Runtime защищён от
циклического повторного emit и ограничивает цепочку 32 Event-hops/effects.

## Контекстное меню Table

У Table есть два разных контракта:

- `contextmenu` — стандартный Event всей rendered-области Table;
- `rowContextMenuRequested` — смысловой Table Event конкретной строки с
  `rowId`, `row`, `columnKey` и `anchor: { x, y }`.

Для открытия меню строки обычно нужен `rowContextMenuRequested`. Его можно
обработать локально:

```vue
<Table
  ref="table"
  :rows="rows"
  @rowContextMenuRequested="action({
    identity: 'flight.open-context-menu',
    input: {
      rowId: event('rowId'),
      anchor: event('anchor'),
    },
  })"
/>
```

Или опубликовать родителю через `emits.from`/`forward`, как любой другой Event.

## Выборочный forwarding

```ts
const ports = definePorts({
  forward: {
    from: 'table',
    ports: {
      emits: ['rowActivated', 'selectionChanged'],
    },
  },
})
```

## Forwarding всех событий

```ts
const ports = definePorts({
  forward: {
    from: 'table',
    ports: {
      emits: '*',
    },
  },
})
```

Явное одноимённое поле в `emits` может дополнить forwarded Event реакцией, если
origin совпадает. Остальные коллизии остаются ошибками compiler-а.

`forward: '*'` пробрасывает все поддерживаемые направления дочерних bindings:
`require`, `provides` и `emits`. Чтобы не расширять публичный API компонента
случайно, для interaction Events обычно предпочтителен явный selector.

## Runtime routing

Для каждого смонтированного Component SFC создаётся собственная Event boundary.
Occurrence проходит следующий путь:

1. Renderer нормализует native occurrence в typed payload.
2. Boundary запускает локальную `@event` reaction.
3. Если нет `.stop`, boundary находит публичный `emits` по origin.
4. Публичная reaction из `emits.action` выполняется независимо от публикации.
5. `forward` передаёт occurrence родительской boundary.
6. На корневой boundary подписчики получают Event через runtime-host.

Автоматической отправки каждого occurrence в глобальный `Endge.events` нет.
Runtime-host предоставляет `emitEventPort(name, payload)` для системных
producer-ов и `onEventPort(name, listener)` для подписчиков.

## Визуальный редактор

В редакторе Table раздел «События» показывает встроенные события и позволяет
выбрать Action, режим «Без реакции» или TypeScript. Раздел «Порты» управляет
`require`, `provides`, `emits` и `forward`.

Изменения сразу патчат Source. Ручное изменение Source сразу восстанавливается в
UI. Если `definePorts` содержит spread, computed keys или другую сложную
конструкцию, редактор переходит в source-only и не переписывает блок.

В виртуальном корне «События» built-in Events показываются русскими названиями.
При удержании `Option/Alt` Domain Widget временно показывает неизменяемую
identity, например `Text.click` или `Table.rowActivated`. Тип payload доступен в
данных Event и редакторе портов, но не дублируется Badge справа от названия.

Корень строится только на frontend и содержит:

```text
События
├── Built-in
│   ├── Text
│   ├── Input
│   └── Table
└── Local
    └── <Component SFC>
        ├── Собственные
        └── Проброшенные
```

Узлы каталога виртуальные: они не создают backend entity и не сохраняются в
Payload. Local Event открывает Source владельца. Для пользовательского Event
без отдельного русского display name UI использует его Source-имя; identity при
этом всегда остаётся неизменной.

## Диагностика compiler-а

Compiler сообщает ошибку, если:

- `from.ref` не найден или не является однозначным literal `ref`;
- дочерний тег не публикует указанное имя Event;
- payload публичного Event несовместим с payload источника;
- template использует неизвестный Event или modifier;
- `@event` не содержит `action({...})`/`typescript({...})`;
- объединены `.passive` и `.prevent`;
- forwarding создаёт collision публичных port identities;
- sandbox обращается к DOM, network, imports, timers или неразрешённому effect.
