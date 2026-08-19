# Editable и редактирование ячеек

Редактирование является поведением содержимого ячейки, а не отдельным режимом
`Table`. Primitive с `editable` открывает edit session и публикует semantic
Event `edited` после commit.

```vue
<Table id="orders" :rows="rows" row-key="id" paging="virtual">
  <Column key="status" title="Статус">
    <Text
      :value="value"
      editable
      edit-on="click"
      @edited="emit('rowEdited', {
        id: rowKey,
        patch: { [columnKey]: event('value') },
      })"
    />
  </Column>
</Table>
```

`Text`, `Number` и `DateTime` имеют встроенный editor. Во время commit их
`edited` payload содержит:

```ts
{
  value: unknown
  previousValue: unknown
}
```

`event('value')` читает новое значение из этого payload.

## Вход в режим редактирования

Если `edit-on` отсутствует, используется `click`:

```vue
<Text :value="value" editable />
```

Статическая короткая форма принимает одно непустое имя события:

```vue
<Text :value="value" editable edit-on="dblclick" />
```

Динамическая форма принимает строку, trigger descriptor или массив строк и
descriptor-ов:

```vue
<Text
  :value="value"
  editable
  :edit-on="[
    'dblclick',
    { event: 'focus', self: true },
  ]"
/>
```

Элементы массива работают как **ИЛИ**: достаточно совпадения одного trigger-а.
Условия внутри одного descriptor-а работают как **И**. Значения внутри `key`
или `code` работают как **ИЛИ**.

## Завершение редактирования

По умолчанию edit session завершается так:

- `Enter` сохраняет текущее значение и публикует `edited`;
- `Escape` отменяет черновик без `edited`;
- перевод фокуса за пределы всего `Editable` отменяет черновик без `edited`.

Переход фокуса между элементами внутри edit-варианта не закрывает editor. Для
составного editor-а используется bubbling-событие `focusout`, поэтому `blur` в
`cancel-on` нормализуется в `focusout`.

Поведение можно переопределить тем же trigger-контрактом, который используется
для `edit-on`:

```vue
<Editable
  :value="row.value"
  :cancel-on="[
    { event: 'keydown', key: ['Escape'], prevent: true, stop: true },
    { event: 'focusout' },
  ]"
  :commit-on="{
    event: 'keydown',
    key: ['Enter'],
    modifiers: { mod: true },
    prevent: true,
  }"
>
  <!-- default/edit variants -->
</Editable>
```

Semantic event `edited` от произвольного editor-а также сохраняет edit session.
Обычный browser event `change` больше не считается commit автоматически: это
позволяет потере фокуса именно отменять несохраненный черновик.

### Наследование настроек

Если `cancel-on` или `commit-on` не указаны в Source, editable-узел получает
соответствующие правила из эффективной конфигурации среды. Она вычисляется по
обычной цепочке `Workspace → Tenant → Project → Environment`.

Оба правила наследуются независимо. Например, колонка может явно задать только
`commit-on`, продолжая получать `cancel-on` из конфигурации. Во вкладке
«Редактирование» действие «Переопределить» записывает текущее эффективное
значение в Source, а «Наследовать» удаляет локальный атрибут.
Пустой локальный список сохраняется как `:cancel-on="[]"` или
`:commit-on="[]"` и явно отключает соответствующую автоматическую реакцию.

В настройках рабочего пространства и на каждом наследующем уровне используется
тот же редактор trigger-ов, включая запись сочетания клавиш и модификаторов.

### Выбор редактора в Visual editor

Visual editor показывает один сценарий независимо от итоговой Source-разметки:
пользователь включает редактирование и выбирает tag или Component редактора.

- Если отображение поддерживает intrinsic editing и выбран его родной editor
  (`Text` для `Text`, `Number` для `Number`, `DateTime` для `DateTime`), в Source
  сохраняется компактный атрибут `editable`.
- Для другого editor-а или сложного отображения, например `Flex`, содержимое
  автоматически оборачивается в `Editable` с `Variant name="default"` и
  `Variant name="edit"`.
- При возврате к родному editor-у канонический `Editable` сворачивается обратно
  в intrinsic-форму, если это можно сделать без потери дополнительных
  деклараций.

До выбора editor-а Source не изменяется: Visual editor не создаёт временный
`Editable` без обязательного edit-варианта. Выключение редактирования сохраняет
обычное отображение и удаляет только editing-поведение.

Если единственный корень ячейки содержит один или несколько вложенных
`editable`-элементов, ячейка помечается как редактируемая. Такая структура
остаётся Source-owned, поскольку каждый вложенный editor может иметь собственные
value, trigger и reaction; Visual editor показывает количество найденных узлов
и не предлагает общий переключатель для всей ячейки.

## Полный контракт trigger-а

```ts
interface ComponentSFCEditTrigger {
  event: string

  key?: string[]
  code?: string[]
  held?: {
    key?: string[]
    code?: string[]
    match?: 'all' | 'any'
    exact?: boolean
  }
  modifiers?: {
    ctrl?: boolean
    shift?: boolean
    alt?: boolean
    meta?: boolean
    mod?: boolean
    altGraph?: boolean
    exact?: boolean
  }

  repeat?: boolean
  composing?: boolean
  button?: number

  stop?: boolean
  prevent?: boolean
  self?: boolean
}
```

| Поле | Значение |
|---|---|
| `event` | Имя события, например `click`, `dblclick`, `keydown`, `focus` |
| `key` | Логическое значение `KeyboardEvent.key`, с учётом раскладки |
| `code` | Физическая клавиша `KeyboardEvent.code`, без зависимости от раскладки |
| `held` | Обычные немодификаторные клавиши, удерживаемые во время события |
| `modifiers` | Фильтр Control, Shift, Alt/Option, Meta/Command и платформенного `mod` |
| `repeat` | Требуемое состояние автоповтора при удержании клавиши |
| `composing` | Требуемое состояние IME/composition |
| `button` | `0` — левая, `1` — средняя, `2` — правая кнопка указателя |
| `stop` | После совпадения вызывает `stopPropagation()` |
| `prevent` | После совпадения вызывает `preventDefault()`, если событие cancelable |
| `self` | Разрешает событие только при `target === currentTarget` |

Если одновременно заданы `key` и `code`, должны совпасть оба фильтра.

## Модификаторы и три состояния

Каждый физический модификатор поддерживает три состояния:

```ts
ctrl: true       // Control обязательно нажат
ctrl: false      // Control обязательно не нажат
ctrl: undefined  // состояние Control неважно
```

То же правило действует для `shift`, `alt`, `meta`, `mod` и `altGraph`.

Без `exact` неописанные физические модификаторы не влияют на совпадение:

```vue
:edit-on="[{
  event: 'keydown',
  key: ['e'],
  modifiers: { ctrl: true },
}]"
```

Этот trigger совпадёт с `Ctrl+E`, `Ctrl+Shift+E` и `Ctrl+Alt+E`.

`exact: true` запрещает дополнительные `ctrl`, `shift`, `alt` и `meta`:

```vue
:edit-on="[{
  event: 'keydown',
  key: ['e'],
  modifiers: {
    ctrl: true,
    exact: true,
  },
}]"
```

Теперь совпадёт только `Ctrl+E`. Явные значения `false` полезны, когда нужно
запретить один модификатор, но оставить остальные безразличными.

## Control и кроссплатформенный `mod`

`ctrl` всегда означает физическую клавишу Control. На macOS он не становится
Command автоматически.

`mod` означает основной shortcut modifier текущей платформы:

| Платформа | `mod: true` |
|---|---|
| Windows | Control |
| Linux | Control |
| macOS | Meta/Command |

Один и тот же portable shortcut для Windows, Linux и macOS:

```vue
<Text
  :value="value"
  editable
  :edit-on="[{
    event: 'keydown',
    key: ['e', 'r'],
    modifiers: {
      mod: true,
      exact: true,
    },
    repeat: false,
    composing: false,
    prevent: true,
    stop: true,
  }]"
/>
```

Он означает `Ctrl+E` или `Ctrl+R` на Windows/Linux и `⌘E` или `⌘R` на
macOS.

Если на всех платформах нужен именно физический Control, используйте `ctrl`:

```vue
:edit-on="[{
  event: 'keydown',
  key: ['e', 'r'],
  modifiers: {
    ctrl: true,
    exact: true,
  },
}]"
```

На macOS это `Control+E` или `Control+R`, а не `Command+E`/`Command+R`.

Физический `meta` означает Command на macOS и Windows/Super на других
платформах:

```vue
:edit-on="[{
  event: 'keydown',
  key: ['e'],
  modifiers: {
    meta: true,
    alt: true,
    exact: true,
  },
}]"
```

## Массив разных комбинаций

Для `Ctrl+E` **или** `Ctrl+Shift+R` нужны два descriptor-а, потому что это два
разных состояния модификаторов:

```vue
<Text
  :value="value"
  editable
  :edit-on="[
    {
      event: 'keydown',
      key: ['e'],
      modifiers: {
        ctrl: true,
        exact: true,
      },
      prevent: true,
    },
    {
      event: 'keydown',
      key: ['r'],
      modifiers: {
        ctrl: true,
        shift: true,
        exact: true,
      },
      prevent: true,
    },
  ]"
/>
```

Portable-вариант использует `mod` вместо `ctrl`:

```vue
:edit-on="[
  {
    event: 'keydown',
    key: ['e'],
    modifiers: { mod: true, exact: true },
  },
  {
    event: 'keydown',
    key: ['r'],
    modifiers: { mod: true, shift: true, exact: true },
  },
]"
```

## `key` или `code`

`key` описывает логический символ. Сравнение букв выполняется без учёта
регистра; Shift проверяется отдельно через `modifiers.shift`.

```vue
key: ['e']
```

При русской раскладке та же физическая клавиша вернёт `key: 'у'`, поэтому такой
trigger не совпадёт.

`code` описывает физическое положение клавиши:

```vue
code: ['KeyE', 'KeyR']
```

Такой shortcut продолжит работать при другой раскладке. Выбирайте:

- `key`, когда важен введённый символ;
- `code`, когда важна стабильная физическая клавиша.

## Удерживаемые обычные клавиши

`key` и `code` верхнего уровня проверяют клавишу, которая создала текущее
keyboard event. `held` проверяет обычные немодификаторные клавиши, которые уже
удерживаются во время другого события, например правого клика.

По умолчанию массив внутри `held` работает как **И** — должны удерживаться все
перечисленные клавиши:

```vue
held: {
  code: ['KeyW', 'KeyE', 'Space'],
}
```

Для логики **ИЛИ** укажите `match: 'any'`:

```vue
held: {
  code: ['KeyW', 'KeyE'],
  match: 'any',
}
```

`held.exact: true` запрещает другие удерживаемые обычные клавиши. Control,
Shift, Alt/Option, Meta/Command и AltGraph в `held` не входят — они всегда
описываются отдельно через `modifiers`.

Если одновременно заданы `held.key` и `held.code`, оба фильтра должны совпасть.
Для shortcut-ов обычно предпочтительнее `held.code`, потому что он не зависит
от активной раскладки.

### Правый клик + Shift + Command + W

На macOS полная запись выглядит так:

```vue
<Text
  :value="value"
  editable
  :edit-on="[{
    event: 'contextmenu',
    button: 2,
    held: {
      code: ['KeyW'],
      exact: true,
    },
    modifiers: {
      shift: true,
      meta: true,
      exact: true,
    },
    prevent: true,
    stop: true,
  }]"
/>
```

Здесь `meta: true` означает именно физический Command. Если нужен основной
modifier текущей платформы — Command на macOS и Control на Windows/Linux —
используйте `mod: true`.

::: warning Command+W
`Command+W` является стандартной командой закрытия вкладки. Если сначала
зажать Command, а затем нажать W, браузер может закрыть вкладку ещё до правого
клика. `prevent` на последующем `contextmenu` не может отменить уже обработанный
`keydown`. Контракт распознаёт состояние, но не отменяет системные и browser
shortcuts, произошедшие раньше trigger event.
:::

Runtime начинает отслеживание после render первого editable-узла и сбрасывает
удерживаемые клавиши при `keyup`, потере фокуса окна, `pagehide` и скрытии
документа. Если `keydown` произошёл до инициализации renderer-а или был перехвачен
ОС, восстановить это состояние невозможно.

## Повтор и ввод через IME

Для shortcut-ов входа в editor обычно рекомендуется явно запрещать повтор и
composition:

```vue
:edit-on="[{
  event: 'keydown',
  code: ['KeyE'],
  modifiers: { mod: true, exact: true },
  repeat: false,
  composing: false,
}]"
```

`repeat: false` не открывает новую session при удержании клавиши.
`composing: false` не запускает редактирование во время IME/composition.

## AltGraph

На части Windows/Linux-клавиатур AltGr представлен одновременно как
`Ctrl+Alt`. Если браузер предоставляет `getModifierState('AltGraph')`, фильтр
позволяет отличить AltGr от намеренного `Ctrl+Alt`:

```vue
:edit-on="[{
  event: 'keydown',
  code: ['KeyE'],
  modifiers: {
    ctrl: true,
    alt: true,
    altGraph: false,
    exact: true,
  },
}]"
```

Поддержка определения AltGraph зависит от браузера и раскладки. Если браузер
не сообщает это состояние, runtime не может надёжно отличить AltGr от
`Ctrl+Alt`.

## Комбинации с указателем

Модификаторы применяются не только к клавиатуре. Например, редактирование по
основному платформенному modifier + левая кнопка:

```vue
:edit-on="[{
  event: 'click',
  button: 0,
  modifiers: {
    mod: true,
    exact: true,
  },
  self: true,
  prevent: true,
  stop: true,
}]"
```

## Ограничения браузера и ОС

`edit-on` описывает одно browser event, модификаторы и снимок одновременно
удерживаемых обычных клавиш. Он не описывает последовательности вроде `Ctrl+K`,
затем `Ctrl+C`; для таких sequence shortcuts нужен отдельный controller.

Также учитывайте:

- системные сочетания вроде `Alt+Tab`, `Cmd+Tab` и `Ctrl+Alt+Delete` могут не
  попасть в страницу вообще;
- browser shortcuts вроде `Ctrl+R`/`⌘R` можно отменить через `prevent` только
  если браузер передал cancelable `keydown` странице;
- для предотвращения browser action используйте `keydown`: на `keyup` уже
  может быть поздно;
- отображаемый узел должен получать фокус, иначе локальный `keydown` до него не
  дойдёт;
- текущий `held` tracker не различает, левый или правый Control удерживался во
  время нажатия другой клавиши; для этого нужен отдельный учёт сторон modifier-а.

## Встроенный editor

После входа в edit session встроенный editor использует собственные правила:

- `Enter` сохраняет draft;
- `Escape` отменяет draft;
- `change` завершает редактирование.

Одновременно runtime держит одну активную edit session компонента.

## Пользовательский editor

Для сложного представления используйте `Editable` с вариантами `default` и
`edit` либо вложенный Component, который объявляет вариант `edit`. Компонент
editor-а должен опубликовать `edited`; host завершит ту же edit session и
передаст нормализованный payload родителю.

```vue
<Editable
  :value="value"
  :edit-on="[{
    event: 'keydown',
    key: ['Enter', 'F2'],
    modifiers: { exact: true },
    prevent: true,
    stop: true,
  }]"
  @edited="emit('edited', event())"
>
  <Variant name="default">
    <Text :value="value" />
  </Variant>
  <Variant name="edit">
    <Input :value="value" />
  </Variant>
</Editable>
```

## Полный путь изменения данных

```text
editor commit
  → semantic edited Event
  → Component SFC event boundary
  → Composition routing
  → Store-owned Update
  → изменение Store
  → новая DataView/props-проекция
  → повторный render Table
```

`Table` и editor не должны мутировать объект `row` напрямую. Если Event
публикуется, но Store/Update не изменён, следующий render вернёт исходное
значение.

Используйте `rowKey`, а не `rowIndex`, для выбора записи Store. Это особенно
важно при сортировке, виртуализации и числовых identifiers.
