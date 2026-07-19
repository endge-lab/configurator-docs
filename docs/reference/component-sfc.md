# Component SFC

Component SFC — основной исполняемый документ интерфейса. Он объединяет публичные порты, renderer-neutral template, локальные вычислительные ресурсы и EndgeCSS в одном source-документе.

Порт — это типизированная граница компонента. Он отвечает сразу на два вопроса: какое взаимодействие разрешено и в каком направлении оно идёт. Все порты объявляются одним top-level вызовом `definePorts({...})` и попадают в compiled artifact `Endge.program`. Неиспользуемые секции можно не указывать.

## Направления портов

| Секция | Кто владеет реализацией | Что разрешено |
| --- | --- | --- |
| `require` | Внешний provider | `computation`, `component`, `action` |
| `provides` | Экземпляр Component SFC | `action` |
| `emits` | Provider не нужен | `event` |

Такое разделение не позволяет спутать «что компоненту нужно», «что у него можно вызвать» и «о чём он уведомляет».

## Action и Event

`Action` — вызываемое типизированное поведение. У него один выбранный provider, input и output. Выполнение может завершиться ошибкой. Examples: открыть карточку, установить значение Filter, закрепить колонку, изменить сортировку.

`Event` — уведомление о факте, который уже произошёл. Оно не возвращает результат и может иметь несколько подписчиков. Examples: строка выделена, сортировка изменилась, данные загружены.

| Вопрос | Action | Event |
| --- | --- | --- |
| Семантика | «Выполни» | «Произошло» |
| Provider | Один | Не требуется |
| Subscribers | Не применимо | Ноль, один или несколько |
| Результат | Может быть | Нет |
| Может быть переопределён | Required Action — да | Нет, меняются подписчики |

Публичного UI-понятия `Command` в новом контракте нет. Старые Table commands были вторым именем для вызываемого поведения и создавали лишнюю классификацию. Sorting, filtering и pinning теперь называются Actions. Термин command остаётся допустим только для технических протоколов вроде debug console, где он не является SFC interaction contract.

Отдельный `defineEvents` не нужен: `definePorts.emits` уже описывает направление, имя и payload Event в том же manifest.

## Полная форма `definePorts`

```vue
<script setup lang="ts">
interface Props {
  rows: Flight[]
}

interface BoardInput {
  rows: Flight[]
}

interface BoardOutput {
  rows: Flight[]
  total: number
}

interface DetailsProps {
  flight: Flight
}

interface RowActivated {
  id: string
}

const props = defineProps<Props>()

const ports = definePorts({
  forward: {
    from: 'departures',
    ports: {
      provides: [
        'table.sort.setColumnAsc',
        'table.sort.clearAll',
        'table.column.pinLeft',
      ],
    },
  },
  require: {
    board: computation<BoardInput, BoardOutput>({
      default: 'flight-board-state',
    }),
    details: component<DetailsProps>({
      tag: 'Flight.Details',
      default: 'flight-details',
    }),
    openDetails: action<{ id: string }, void>({
      default: 'flight.open-details',
    }),
  },
  provides: {
    'board.refresh': action<void, void>(),
  },
  emits: {
    rowActivated: event<RowActivated>(),
  },
})

const board = ports.require.board({ rows: props.rows })
</script>

<template>
  <Table ref="departures" if="board.value" :rows="board.value.rows" row-key="id">
    <ColumnMenu>
      <MenuItem action="table.sort.setColumnAsc" label="По возрастанию" />
      <MenuItem action="table.column.pinLeft" label="Закрепить слева" />
      <MenuSeparator />
      <MenuItem action="table.sort.clearAll" label="Сбросить сортировку" />
    </ColumnMenu>
    <Column key="number" title="Рейс" sortable pinnable />
  </Table>
</template>
```

## `require`: компонент зависит от внешнего мира

Required port всегда содержит `default`. Это provider по умолчанию, который compiler проверяет на существование, active state и правильный kind. Manifest допускает будущую подмену provider без изменения source компонента; Composition override syntax ещё не включён в текущую версию.

### Computation

```ts
const ports = definePorts({
  require: {
    state: computation<ProcessInput, ProcessState>({
      default: 'process-state',
    }),
  },
})

const state = ports.require.state({ process: props.process })
```

Computation call допускается только в top-level `const` и принимает один object input. Runtime resource предоставляет `status`, `loading`, `value`, `error` и `refresh()`.

### Component

```ts
const ports = definePorts({
  require: {
    details: component<DetailsProps>({
      tag: 'Process.Details',
      default: 'process-details',
    }),
  },
})
```

После этого `<Process.Details />` становится локальным typed tag. Local tag имеет приоритет над global registry.

### Required Action

```ts
const ports = definePorts({
  require: {
    openDetails: action<{ id: string }, void>({
      default: 'flight.open-details',
    }),
  },
})
```

Компонент зависит от стабильного Action contract. В текущей версии declaration, `RAction` provider validation и program dependency уже компилируются. Composition override и универсальный template handler для произвольных primitives вводятся отдельно, чтобы не создавать скрытые DOM callbacks.

## `forward`: повторная публикация портов локальных компонентов

`forward` — отдельное поле `definePorts`, которое выводит публичные порты
компонента из public manifests компонентов, смонтированных в его локальном
template scope. Compiler не обходит внутренние template-деревья дочерних SFC:
каждая изолированная сущность отдаёт только собственный public manifest.

Самая короткая форма повторно публикует все `require`, `provides` и `emits` всех
локальных component bindings:

```ts
const ports = definePorts({
  forward: '*',
})
```

Результат разворачивается compiler-ом в обычный manifest текущего SFC. Каждый
forwarded port содержит origin: node id, literal `ref`, component identity/tag и
исходное имя порта. Runtime читает artifact и не анализирует source повторно.

На текущем этапе это public compiled contract и origin map. Маршрутизация
внешнего вызова или Event subscription к конкретному mounted child относится к
Composition binding layer. `forward` не создаёт скрытый DOM callback и не
подменяет runtime wiring.

### Всё от одного `ref`

```ts
const ports = definePorts({
  forward: {
    from: 'departures',
  },
})
```

```vue
<Table ref="departures" :rows="rows" />
```

Отсутствующее `ports` эквивалентно `ports: '*'`.

### Только одно направление

```ts
const ports = definePorts({
  forward: {
    from: 'departures',
    ports: {
      provides: '*',
    },
  },
})
```

Здесь `require` и `emits` не прокидываются. Направления никогда не меняются:
child `require` становится parent `require`, child `provides` — parent
`provides`, child `emits` — parent `emits`.

### Разные выборки от разных `ref`

```ts
const ports = definePorts({
  forward: [
    {
      from: 'departures',
      ports: {
        provides: [
          'table.column.*',
          'table.sort.clearAll',
        ],
        emits: [
          'rowActivated',
        ],
      },
    },
    {
      from: 'filters',
      ports: {
        require: [
          'loadDictionary',
        ],
        provides: [
          'filter.apply',
          'filter.reset',
        ],
        emits: [
          'valueChanged',
        ],
      },
    },
  ],
})
```

`from` принимает `"*"`, один literal `ref` или массив refs. Selector направления
принимает `"*"`, массив exact identities/wildcards либо полную форму:

```ts
const ports = definePorts({
  forward: {
    from: ['departures', 'arrivals'],
    namespace: 'ref',
    ports: {
      provides: {
        include: ['table.column.*', 'table.sort.*'],
        exclude: ['table.sort.clearAll'],
        rename: {
          'table.column.pinLeft': 'column.pinLeft',
        },
      },
    },
  },
})
```

`namespace: 'ref'` создаёт identities вроде
`departures.table.column.pinLeft`. Можно передать literal namespace либо
`'none'`. Для namespace `ref` каждый выбранный компонент обязан иметь literal
`ref`.

### Diagnostics

Forwarding не использует silent override или last-write-wins:

- неизвестный `ref` — build error `sfc-port-forward-ref-missing`;
- одинаковый `ref` — build error `sfc-port-forward-ref-duplicate`;
- совпавшие public port names — build error `sfc-port-forward-collision`;
- совпавший component tag — build error `sfc-port-forward-tag-collision`;
- selector без совпадений — warning `sfc-port-forward-selection-empty`.

Все diagnostics публикуются в общей системе build problems и имеют source range
поля `definePorts.forward`.

## `provides`: действие можно вызвать у компонента

Provided Action не содержит `default`: его реализация принадлежит mounted instance компонента. Имя является публичной Action identity.

```ts
provides: {
  'table.sort.setColumnAsc': action<unknown, void>(),
  'table.column.pinLeft': action<unknown, void>(),
}
```

Для Table runtime target реализует sort/pin operations. Context menu вызывает их через единый `Endge.actions.execute()` pipeline. Compiler также публикует provided/forwarded port как `origin: derived`, поэтому он виден в Domain Widget и Action palette без записи в Payload. Одна и та же Component SFC definition может быть смонтирована несколько раз: каждый вызов получает target конкретной Table instance, поэтому state не смешивается.

## `emits`: компонент сообщает о факте

```ts
emits: {
  rowActivated: event<{ id: string }>(),
  selectionChanged: event<{ ids: string[] }>(),
}
```

Compiler добавляет эти Events во внешний contract компонента. Event не содержит `default`, потому что у него нет provider. Само объявление ещё не публикует Event: production bridge от интерактивного primitive и Composition Event-to-Action routing остаются отдельным следующим шагом. Отсутствие подписчиков после появления routing не будет ошибкой.

## Компиляция и runtime

1. Source parser читает `definePorts`.
2. Compiler валидирует направления, kinds и defaults.
3. Typed manifest, events contract и dependencies сохраняются в Component SFC artifact.
4. `ComponentSFCRuntimeHost` читает только artifact, а не повторно анализирует source.
5. Renderer передаёт typed target mounted instance в `Endge.actions.execute()`.

Подробный контракт providers, overrides и target diagnostics описан в [Actions](./action.md).

Это сохраняет source-first boundary: persisted document остаётся декларативным, compiler produces executable contract, runtime only executes it.

## Ошибки компиляции

Compiler отклоняет:

- flat ports без `require`, `provides` или `emits`;
- удалённую секцию `request`: используйте `require` и `ports.require`;
- `default` у provided Action или Event;
- required port без `default`;
- `MenuItem command="..."`;
- `MenuItem action="..."`, если Action не является intrinsic capability Table,
  известным built-in Action или не объявлен в `definePorts.provides`;
- `MenuItem :action="..."` без static `{ identity, input? }`;
- `payload` или пользовательские поля вне `action.input` в object binding;
- неоднозначные или конфликтующие `forward` rules;
- повторяющиеся имена ports и неправильные kinds в секции.

## Renderer-neutral контракт

Template tags обозначают абстрактные UI primitives, а не HTML elements. DOM, Canvas или другой adapter материализует тот же IR своим способом. Action context также не содержит DOM event как архитектурный контракт; renderer-specific details остаются внутри adapter.

## Legacy `Component`

Старый `Component` хранит Table/DSL/JSX-конфигурацию как data-only document и не создаёт runtime host. Для нового исполняемого интерфейса используется Component SFC.
