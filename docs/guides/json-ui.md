# JSON UI `endge-ui/v1`

JSON UI отдаёт Component SFC как данные: дерево узлов с уже вычисленными значениями, стабильными id и списком событий. Хост — мобильное приложение, другой фреймворк или агент — рисует дерево сам, получает изменения патчами и передаёт действия пользователя обратно через `dispatch`.

JSON UI — рендер-адаптер ядра `@endge/core` (`EndgeUIJsonAdapter`, id `endge-ui-json`). Он использует artifact SFC и тот же evaluator выражений, что адаптеры Vue, поэтому второго компилятора шаблонов нет. Адаптер регистрируется в `Endge.uiRegistry` при запуске, но не активируется: активным остаётся Vue/DOM, а JSON mount работает параллельно. Регистрировать его вручную не нужно; повторный `Endge.uiRegistry.adapters.register(EndgeUIJsonAdapter)` того же объекта ничего не меняет и возвращает уже зарегистрированный адаптер. Другой объект с тем же id завершается ошибкой «already registered».

## API хоста

```ts
import type { ComponentSFCRenderPort } from '@endge/core'
import { applyEndgeUIPatch, Endge, mountEndgeUIJson } from '@endge/core'

const session = await Endge.runtime.composition.mount('flight-inspector')
// getChild возвращает общий RuntimeHost; узел Component SFC приводится к порту рендера.
const host = session.host.getChild('inspector') as unknown as ComponentSFCRenderPort

const ui = mountEndgeUIJson(host, {
  locale: 'ru',            // по умолчанию — locale контекста Endge
  timezone: 'UTC',         // по умолчанию — timezone контекста Endge
  tableRowLimit: 100,      // окно строк Table
  schedule: 'microtask',   // или 'sync'
})

let snapshot = ui.snapshot()
const off = ui.subscribe((patch) => {
  snapshot = applyEndgeUIPatch(snapshot, patch)
})

await ui.dispatch(nodeId, 'click', { x: 10, y: 20 })
ui.refresh()   // пересчитать сразу; вернёт патч или null
ui.unmount()
```

| Опция | Назначение |
| --- | --- |
| `input` | источник входа host-а; без него — источник, установленный Composition |
| `locale`, `timezone` | форматирование `Number` и `DateTime` |
| `theme` | тема правил EndgeCSS, по умолчанию `Endge.ui.theme` |
| `tableRowLimit` | размер окна строк Table, по умолчанию 100 |
| `schedule` | `microtask` объединяет несколько изменений в один патч, `sync` строит патч сразу |

Mount не создаёт и не уничтожает runtime host: он только подписывается на его изменения и освобождает свои ресурсы в `unmount()`. После каждого `dispatch` снимок пересчитывается синхронно. `dispatch` возвращает `{ handled: true }` или `{ handled: false, reason }`, где `reason` — `unknown-node`, `unknown-event` или `unmounted`.

## Снимок

```json
{
  "format": "endge-ui/v1",
  "revision": 1,
  "component": "flight-inspector",
  "roots": [{
    "id": "root-0", "type": "Flex", "props": { "col": true, "gap": "3" },
    "children": [
      { "id": "root-0-0-0", "type": "Text", "props": { "weight": "600" }, "children": [
        { "id": "root-0-0-0-0", "type": "#text", "props": {}, "children": [], "text": "Инспектор рейса SU 1402" }
      ] }
    ]
  }]
}
```

Узел: `{ id, type, props, children, text?, events?, classes?, states?, parts?, style?, component?, editable?, table?, menu?, markers? }`.

- `type` — тег шаблона (`Text`, `Number`, `DateTime`, `Badge`, `Flex`, `Grid`, `Input`, `Select`, `Table`, `Editable`, `Component` и другие) или служебный `#text`, `#row`, `#cell`.
- `props` — вычисленные props: функции и `undefined` отброшены, `Date` → ISO-строка, `NaN`/`Infinity` и циклы → `null`, глубина не больше 32. `class`, `state` и `part` вынесены в `classes`, `states` и `parts`.
- `text` — готовый к показу текст: интерполяция, `Number` (`decimals`, `minFractionDigits`, `prefix`, `suffix`, `empty`) и `DateTime` (`format` `HH:mm`/`date`/`datetime`, `timezone`, `empty`). Исходное `value` остаётся в `props`.
- `style` — объявления EndgeCSS, применённые к узлу с условием `renderer: 'json'`; токены и `var(...)` не разворачиваются. Layout-props (`gap`, `p`, `tone`) остаются токенами в `props`.

### Id узлов

- Id — id узла шаблона. Повторяемый узел получает `…[ключ]` (значение `:key`, иначе индекс), его потомки — префикс `…[ключ]/`.
- Содержимое вложенного Component — с префиксом `<id узла Component>>`; строка таблицы — `<table>[rowKey]`, ячейка — `<row>.<column>`.
- Символы `[ ] / > . ~` в ключах экранируются (`%5b`), при коллизии добавляется суффикс `~n`.
- Id стабильны между снимками одного artifact; после перекомпиляции шаблона могут смениться.

## Патч

Патч адресует узлы по id, а не по индексам массивов (это не RFC 6902): вставка строки в начало списка не превращается в каскад замен.

```json
{
  "format": "endge-ui/v1", "baseRevision": 1, "revision": 2,
  "ops": [
    { "op": "update", "id": "root-0-0-0-0", "set": { "text": "Инспектор рейса SU 1403" } }
  ]
}
```

| `op` | Поля | Смысл |
| --- | --- | --- |
| `update` | `id`, `set?`, `unset?` | новые значения собственных полей узла (кроме `id`, `type`, `children`) |
| `children` | `id` (`null` — корни), `children` | новый порядок детей: `{ ref: id }` — существующий узел, иначе новый узел целиком; не перечисленные удаляются |
| `replace` | `id`, `node` | замена поддерева при смене типа узла |
| `markers` | `markers` | новые маркеры снимка |

Операции применяются по порядку. `applyEndgeUIPatch(snapshot, patch)` применяет патч и проверяет `baseRevision`. `diffEndgeUIJsonSnapshots(previous, next)` строит патч между двумя снимками.

## События

`events` узла перечисляет, что можно передать в `dispatch`:

- события тега с обработчиком `@event` или наблюдаемые публичным портом — маршрутизируются как в DOM, с props и переменными цикла;
- события `:on` — триггер выбирается по payload (`key`, `code`, `button`, `modifiers`, `held`, `repeat`);
- payload дополняется `type`, `occurredAt`, `modifiers`, `held`; скаляр становится `{ value }`.

**Editable.** Узел содержит `editable: { active, value, draft?, triggers }`. События `edit.begin`, `edit.input { value }`, `edit.commit { value? }` и `edit.cancel` управляют сессией редактирования; commit публикует `edited`. `triggers` — нормализованный `:edit-on`, какой жест считать входом в редактирование, решает хост.

**Table.** Узел содержит `table: { rowKey, columns, rowCount, offset, limit }`, колонки — `{ key, title, width?, align?, sortable?, menu? }`. Строки — дети `#row` (`props: { key, index }`), ячейки — `#cell` (`props: { column, value }`). Показывается окно строк: `dispatch(tableId, 'table.page', { offset, limit })` сдвигает его, при неполном окне узел получает маркер `endge-ui-table-window`. Сортировку, закрепление и видимость колонок делает хост: JSON передаёт только метаданные колонок.

**Меню таблицы.** CellMenu и RowMenu вычисляются для каждой ячейки (`menu.items` с `visible`, `disabled`, `label`), ColumnMenu — в `table.columns[].menu`. `dispatch(cellId, 'menu.select', { item })` или `dispatch(tableId, 'menu.select', { item, column })` выполняет Action, повторно проверив `visible` и `disabled`.

**Вложенный Component** разворачивается: узел `type: 'Component'`, `component: '<identity>'`, дети — корни дочернего шаблона со своими событиями и портами.

## Маркеры

То, что нельзя перенести в JSON, отмечается маркером `{ code, severity, message }`:

| Код | Когда |
| --- | --- |
| `endge-ui-component-missing`, `endge-ui-component-cycle` | вложенный Component не найден, не рендерится или образует цикл |
| `endge-ui-unsupported` | семантические `:on` на вложенном Component |
| `endge-ui-held-keys` | триггер проверяет удерживаемые клавиши: хост должен передать `payload.held` |
| `endge-ui-table-window` | показана часть строк таблицы |
| `endge-ui-ir-missing` | artifact компонента без IR (снимок) |

Компонент только для чтения отдаёт формы с `readonly`/`disabled` и без событий.

## Схема

`ENDGE_UI_JSON_SCHEMA` — JSON Schema draft 2020-12 (`$id` `https://endge.dev/schemas/endge-ui/v1.json`, корень — `oneOf` снимок или патч). `validateEndgeUIJson(value, 'snapshot' | 'patch' | 'any')` проверяет документ по этой схеме и возвращает список проблем.

## Пример хоста

Хост без фреймворка ниже строит DOM из снимка (`Flex` → `div` с `display: flex`, `Table`/`#row`/`#cell` → `table`/`tr`/`td`, атрибут `data-endge-id`, классы и стиль EndgeCSS), вешает обработчики на `events` и вызывает `dispatch`, а патчи применяет по id с повторным использованием элементов.

Тот же код с минимальной подделкой DOM проверяется тестом в репозитории `@endge/core` (`src/test/examples/endge-ui-json-dom-host.ts`). В пакет npm пример не входит — скопируйте его в своё приложение.

```ts
import type { EndgeUIJsonMount, EndgeUINode, EndgeUIPatch } from '@endge/core'

const TAGS: Record<string, string> = {
  'Flex': 'div',
  'Box': 'div',
  'Grid': 'div',
  'Divider': 'hr',
  'Input': 'input',
  'Textarea': 'textarea',
  'Checkbox': 'input',
  'Select': 'select',
  'Table': 'table',
  '#row': 'tr',
  '#cell': 'td',
  'DateTime': 'time',
}

export function createEndgeUIDomHost(mount: EndgeUIJsonMount): { root: HTMLElement, destroy: () => void } {
  const root = document.createElement('div')
  const elements = new Map<string, ChildNode>()
  const nodes = new Map<string, EndgeUINode>()

  const build = (node: EndgeUINode): ChildNode => {
    nodes.set(node.id, node)
    if (node.type === '#text') {
      const text = document.createTextNode(node.text ?? '')
      elements.set(node.id, text)
      return text
    }
    const element = document.createElement(TAGS[node.type] ?? 'span')
    element.setAttribute('data-endge-id', node.id)
    element.setAttribute('data-endge-type', node.type)
    if (node.classes?.length) {
      element.setAttribute('class', node.classes.join(' '))
    }
    if (node.type === 'Flex') {
      element.style.setProperty('display', 'flex')
      element.style.setProperty('flex-direction', node.props.col ? 'column' : 'row')
    }
    for (const [property, value] of Object.entries(node.style ?? {})) {
      element.style.setProperty(property, value)
    }
    for (const event of node.events ?? []) {
      element.addEventListener(event, (domEvent) => {
        const target = domEvent.target as { value?: unknown } | null
        void mount.dispatch(node.id, event, target && 'value' in target ? { value: target.value } : {})
      })
    }
    if (node.children.length) {
      element.replaceChildren(...node.children.map(build))
    }
    else if (node.text !== undefined) {
      element.textContent = node.text
    }
    elements.set(node.id, element)
    return element
  }

  const apply = (patch: EndgeUIPatch): void => {
    for (const op of patch.ops) {
      if (op.op === 'update') {
        const node = nodes.get(op.id)
        if (!node) {
          continue
        }
        for (const field of op.unset ?? []) {
          delete (node as Partial<EndgeUINode>)[field]
        }
        Object.assign(node, op.set)
        elements.get(op.id)?.replaceWith(build(node))
      }
      else if (op.op === 'replace') {
        elements.get(op.id)?.replaceWith(build(op.node))
      }
      else if (op.op === 'children') {
        // { ref } — существующий узел, иначе новый узел целиком.
        const children = op.children.map(entry => 'ref' in entry && !('type' in entry) ? nodes.get(entry.ref)! : entry as EndgeUINode)
        const parent = op.id === null ? root : elements.get(op.id) as HTMLElement | undefined
        if (op.id !== null) {
          nodes.get(op.id)!.children = children
        }
        parent?.replaceChildren(...children.map(child => elements.get(child.id) ?? build(child)))
      }
    }
  }

  root.replaceChildren(...mount.snapshot().roots.map(build))
  const unsubscribe = mount.subscribe(apply)
  return {
    root,
    destroy: () => {
      unsubscribe()
      elements.clear()
      nodes.clear()
    },
  }
}
```

Подключение: `document.body.append(createEndgeUIDomHost(mountEndgeUIJson(host)).root)`; при уходе со страницы вызовите `destroy()` и `unmount()` у mount.
