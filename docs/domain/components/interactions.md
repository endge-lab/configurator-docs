# Сложные события через `:on`

Аннотация `:on` связывает событие visual SFC-тега с одной или несколькими
реакциями. Она использует тот же trigger-контракт, что и `edit-on`, поэтому
комбинации клавиш, удерживаемые клавиши и pointer button описываются одинаково.

## Базовый пример

```vue
<Text
  value="Открыть"
  :on="{
    event: 'click',
    reaction: action({
      identity: 'order.open',
      input: { id: rowId },
    }),
  }"
/>
```

В обычной форме `event` задаётся статической строкой. В ссылочной форме compiler
получает допустимую event-поверхность тега, а активные triggers вычисляются из
effective configuration во время рендера. `reaction` является Source-синтаксисом,
а не JavaScript callback.

## Trigger-контракт

| Поле | Тип | Назначение |
| --- | --- | --- |
| `event` | string | Имя intrinsic или объявленного semantic Event. |
| `key` | string или string[] | Допустимые `KeyboardEvent.key`, без учёта регистра. |
| `code` | string или string[] | Физические `KeyboardEvent.code`, не зависящие от раскладки. |
| `held.key` / `held.code` | string[] | Обычные клавиши, удерживаемые во время события. |
| `held.match` | `all` или `any` | Требовать все клавиши или хотя бы одну. По умолчанию `all`. |
| `held.exact` | boolean | Запретить дополнительные удерживаемые обычные клавиши. |
| `modifiers` | object | `ctrl`, `shift`, `alt`, `meta`, `mod`, `altGraph`, `exact`. |
| `button` | number | Pointer/mouse button. Основная кнопка — `0`, правая — `2`. |
| `repeat` | boolean | Разрешить или запретить повторный `keydown`. |
| `composing` | boolean | Состояние IME composition. |

`mod` означает Command на macOS и Control на Windows/Linux. Значение `false`
является явным условием. Например, `shift: false` запрещает Shift. `exact`
запрещает физические modifiers, не упомянутые в объекте.

```vue
<Box
  :on.stop.prevent="{
    event: 'contextmenu',
    button: 2,
    held: { code: ['KeyW'], exact: true },
    modifiers: { shift: true, exact: true },
    reaction: action({
      identity: 'cell.mark',
      input: { rowId, columnKey, event: event() },
    }),
  }"
/>
```

## Modifiers аннотации

| Modifier | Семантика |
| --- | --- |
| `.stop` | Синхронно вызывает `stopPropagation()` и прекращает semantic forwarding occurrence. |
| `.prevent` | Синхронно вызывает `preventDefault()` до запуска reactions. |
| `.self` | Срабатывает только когда `target === currentTarget`. |
| `.once` | Выполняет совпавшее правило один раз за mount этого узла. |
| `.capture` | Устанавливает listener на capture-фазе. |
| `.passive` | Устанавливает passive listener. |

Эти флаги можно записывать и boolean-полями правила. Суффикс применяется ко
всем правилам аннотации и имеет приоритет над `false` внутри правила.
`passive` нельзя объединять с `prevent`: compiler выдаст
`sfc-template-on-passive-prevent`. Поля `capture` и `passive` внутри объекта
должны быть статическими boolean.

`self` проверяется до `once`. `once` потребляется после совпадения и до запуска
reaction, поэтому ошибка Action не активирует правило повторно.

## Несколько правил и reactions

Массив правил использует `first-match-wins`. После первого совпадения остальные
правила этой аннотации не проверяются для данного occurrence.

```vue
<Text
  :value="row.name"
  :on="[
    {
      event: 'keydown',
      code: ['Enter'],
      reaction: action({ identity: 'row.open', input: { id: rowId } }),
    },
    {
      event: 'click',
      reaction: [
        action({ identity: 'selection.set', input: { id: rowId } }),
        query({ identity: 'details.refresh', input: { id: rowId } }),
        emit('rowSelected', { id: rowId }),
      ],
    },
  ]"
/>
```

Reactions выполняются последовательно и ожидаются через `await`. Ошибка
останавливает оставшуюся последовательность. Результат одной reaction не
становится input следующей автоматически. Поддерживаются `action()`, `query()`,
`emit()` и `typescript()`.

## TriggerSet из effective configuration

Когда между окружениями должен меняться только способ запуска, используйте
ссылочную форму `{ triggers, reaction }`:

```vue
<Cell
  :on="{
    triggers: $context.config.groundHandling.actualTimeTriggers,
    reaction: query({
      identity: 'groundHandling.actualTime.update',
      input: {
        legId: row.arrivalLeg.id,
        station: row.arrivalLeg.latestArrivalStationIataCode,
        code: 'Bridge On',
        point: 'value',
        value: now(),
        comment: null,
      },
    }),
  }"
>
  <GroundHandlingProcess
    :process="row.arrivalLeg.groundHandling[code = 'Bridge On']"
  />
</Cell>
```

`triggers` принимает runtime expression, возвращающий `TriggerSet`. Каждый
элемент массива является самостоятельным правилом, а порядок сохраняет
`first-match-wins`. Event должен входить в event-поверхность текущего тега.

Configuration может определить для одного Environment `contextmenu`, для
другого `click`, а для третьего `keydown` с modifiers и held keys. Reaction и
Query identity при этом не меняются. Пустой TriggerSet не устанавливает
listener-ы и отключает реакцию.

Ссылочная форма не включает `editable` и не публикует `edited`: совпавший trigger
немедленно запускает указанную reaction.

## Значения `event()` и `now()`

`event()` возвращает сериализуемый snapshot, а не DOM Event. В нём доступны:

| Группа | Доступные пути `event('…')` | Значение |
| --- | --- | --- |
| Все intrinsic events | `type` | Имя события, например `click` или `keydown`. |
| Все intrinsic events | `occurredAt` | ISO 8601 UTC timestamp исходного occurrence. |
| Modifiers | `modifiers.alt`, `modifiers.altGraph`, `modifiers.ctrl`, `modifiers.meta`, `modifiers.shift` | Состояние клавиш-модификаторов. |
| Held keys | `held.key`, `held.code` | Массивы удерживаемых логических клавиш и физических кодов. |
| Pointer/mouse/drag | `x`, `y`, `button`, `buttons`, `pointerType` | Координаты и состояние указателя. Правая кнопка имеет `button: 2`. |
| Wheel | `deltaX`, `deltaY` | Горизонтальное и вертикальное смещение колеса/trackpad. |
| Keyboard | `key`, `code`, `repeat`, `composing` | Данные клавиатурного события. |
| Input controls | `value`, `checked` | Текущее значение; для multiple Select `value` является массивом строк. |

Примеры чтения:

```ts
event()                    // весь snapshot
event('type')              // 'contextmenu'
event('occurredAt')        // время исходного события
event('modifiers.shift')   // true или false
event('held.code')         // ['Space']
event('button')            // 2
event('key')               // 't'
event('value')             // значение Input/Select
```

Dot-path может читать и поля semantic/custom Event. Например, для payload
`{ row: { id: 'leg-1' } }` доступно `event('row.id')`. Если путь отсутствует в
конкретном payload, результатом будет `undefined`.

Встроенные semantic Events `Table` имеют собственные typed payload:

| Table Event | Доступные пути |
| --- | --- |
| Все Table Events | `tableId` |
| `rowActivated` | `rowId`, `rowIndex`, `row`, `columnKey`, `activation` |
| `rowContextMenuRequested` | `rowId`, `rowIndex`, `row`, `columnKey`, `anchor.x`, `anchor.y` |
| `selectionChanged` | `mode`, `selectedRowIds`, `selectedRows`, `addedRowIds`, `removedRowIds` |
| `sortChanged` | `sort` и вложенные `sort.<index>.columnKey`, `sort.<index>.direction` |
| `columnVisibilityChanged` | `visibility`, `hiddenColumnKeys` |
| `columnPinChanged` | `left`, `right` |
| `columnOrderChanged` | `columnKeys` |
| `columnSizeChanged` | `sizes`, `changedColumnKey` |
| `pageChanged` | `pageIndex`, `pageSize`, `pageCount` |

Например: `event('rowId')`, `event('anchor.x')` или
`event('selectedRowIds')`. Пользовательские Events предоставляют поля своего
`payloadType`; `event(path)` не ограничивает их заранее общим DOM-каталогом.

`now()` не читает Event. Это безопасный DSL-примитив, который возвращает текущее
время начала выполнения reaction как ISO 8601 UTC-строку:

```ts
query({
  identity: 'groundHandling.actualTime.update',
  input: {
    value: now(),
    sourceEventAt: event('occurredAt'),
  },
})
```

Все вложенные использования `now()` внутри одного input получают одно значение.
Используйте `now()` для команды «установить текущее время», а
`event('occurredAt')` — когда важно сохранить именно время исходного browser
occurrence.

Помимо `event()` и `now()`, input поддерживает JSON literals, массивы, объекты и
lexical SFC scope: `row`, `rowKey`, `rowIndex`, `columnKey`, `value` и другие
доступные в текущем узле locals.

`now()` относится только к безопасному DSL input для Event reactions
(`action`, `query`, `emit` и Composition event effects). Это не глобальная
функция ValueExpression и не добавляет скрытые часы в `defineComputation`.

## Совместимость с `@event` и editable

Простая запись остаётся доступна:

```vue
<Text @click="action({ identity: 'order.open' })" />
```

Она использует тот же runtime Event-механизм без дополнительных условий.
`@click` и `:on` на одном узле являются независимыми локальными обработчиками.

`edit-on` использует тот же trigger descriptor:

```vue
<Text
  :value="row.name"
  editable
  :edit-on="{ event: 'click', held: { code: ['KeyW'] } }"
  :on="{ event: 'click', held: { code: ['KeyW'] }, reaction: action({ identity: 'audit.edit-opened' }) }"
/>
```

Один жест может запустить reaction и открыть editable. `.stop` не отменяет
обработчик того же VNode.

## Где доступен `:on`

Аннотация работает на visual tags с собственной event-поверхностью: `Text`,
`DateTime`, `Number`, `Icon`, `Badge`, `Dot`, `Box`, `Flex`, `Grid`, `Divider`,
`Input`, `Textarea`, `Checkbox`, `Select`, `Table` и `Cell`.

`Cell` является специальной структурной границей: адаптер связывает его `:on` с
реальной renderer-owned поверхностью табличной ячейки. Остальные структурные
`Column`, `Variant`, `ColumnMenu`, `RowMenu`, `MenuItem` и `MenuSeparator` не
создают самостоятельный event target; compiler выдаёт диагностику.

У вложенного пользовательского SFC можно обрабатывать Events его typed manifest.
Для raw DOM-жеста используйте visual wrapper: Vue fallthrough и форма корневого
узла дочернего компонента не являются частью renderer-neutral контракта.
