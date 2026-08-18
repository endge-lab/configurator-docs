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

`event` всегда задаётся статической строкой: adapter должен знать имя события
до рендера, чтобы установить listener. `reaction` является Source-синтаксисом,
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

## Значение `event()`

`event()` возвращает сериализуемый snapshot, а не DOM Event. В нём доступны:

- `type`, `modifiers` и `held`;
- `x`, `y`, `button`, `buttons`, `pointerType` для pointer events;
- `key`, `code`, `repeat`, `composing` для keyboard events;
- `value` и `checked` для form controls.

Можно передать весь snapshot через `event()` или конкретное поле через
`event('held.code')`.

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
`Input`, `Textarea`, `Checkbox`, `Select` и `Table`.

Структурные `Column`, `Cell`, `Variant`, `ColumnMenu`, `RowMenu`, `MenuItem` и
`MenuSeparator` не создают самостоятельный event target. Compiler выдаёт
диагностику; поместите `:on` на визуальный дочерний `Box`, `Flex` или `Text`.

У вложенного пользовательского SFC можно обрабатывать Events его typed manifest.
Для raw DOM-жеста используйте visual wrapper: Vue fallthrough и форма корневого
узла дочернего компонента не являются частью renderer-neutral контракта.
