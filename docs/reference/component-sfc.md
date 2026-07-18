# Component SFC

Component SFC — основной исполняемый документ интерфейса. Он объединяет публичные порты, renderer-neutral template, локальные вычислительные ресурсы и EndgeCSS в одном source-документе.

Порт — это типизированная граница компонента. Он отвечает сразу на два вопроса: какое взаимодействие разрешено и в каком направлении оно идёт. Все порты объявляются одним top-level вызовом `definePorts({...})` и попадают в compiled artifact `Endge.program`. Неиспользуемые секции можно не указывать.

## Направления портов

| Секция | Кто владеет реализацией | Что разрешено |
| --- | --- | --- |
| `request` | Внешний provider | `computation`, `component`, `action` |
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
| Может быть переопределён | Requested Action — да | Нет, меняются подписчики |

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
  request: {
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
    'table.sort.setColumnAsc': action<unknown, void>(),
    'table.sort.clearAll': action<unknown, void>(),
    'table.column.pinLeft': action<unknown, void>(),
  },
  emits: {
    rowActivated: event<RowActivated>(),
  },
})

const board = ports.request.board({ rows: props.rows })
</script>

<template>
  <Table if="board.value" :rows="board.value.rows" row-key="id">
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

## `request`: компонент зависит от внешнего мира

Requested port всегда содержит `default`. Это provider по умолчанию, который compiler проверяет на существование, active state и правильный kind. Manifest допускает будущую подмену provider без изменения source компонента; Composition override syntax ещё не включён в текущую версию.

### Computation

```ts
const ports = definePorts({
  request: {
    state: computation<ProcessInput, ProcessState>({
      default: 'process-state',
    }),
  },
})

const state = ports.request.state({ process: props.process })
```

Computation call допускается только в top-level `const` и принимает один object input. Runtime resource предоставляет `status`, `loading`, `value`, `error` и `refresh()`.

### Component

```ts
const ports = definePorts({
  request: {
    details: component<DetailsProps>({
      tag: 'Process.Details',
      default: 'process-details',
    }),
  },
})
```

После этого `<Process.Details />` становится локальным typed tag. Local tag имеет приоритет над global registry.

### Requested Action

```ts
const ports = definePorts({
  request: {
    openDetails: action<{ id: string }, void>({
      default: 'flight.open-details',
    }),
  },
})
```

Компонент зависит от стабильного Action contract. В текущей версии declaration, `RAction` provider validation и program dependency уже компилируются. Composition override и универсальный template handler для произвольных primitives вводятся отдельно, чтобы не создавать скрытые DOM callbacks.

## `provides`: действие можно вызвать у компонента

Provided Action не содержит `default`: его реализация принадлежит mounted instance компонента. Имя является публичной Action identity.

```ts
provides: {
  'table.sort.setColumnAsc': action<unknown, void>(),
  'table.column.pinLeft': action<unknown, void>(),
}
```

Для Table runtime target реализует sort/pin operations. Context menu вызывает их через единый `Endge.runtime.actions` registry. Одна и та же Component SFC definition может быть смонтирована несколько раз: каждый вызов получает runtime context конкретной Table instance, поэтому state не смешивается.

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
5. Renderer передаёт Action context mounted instance в `Endge.runtime.actions`.

Это сохраняет source-first boundary: persisted document остаётся декларативным, compiler produces executable contract, runtime only executes it.

## Ошибки компиляции

Compiler отклоняет:

- flat ports без `request`, `provides` или `emits`;
- `default` у provided Action или Event;
- requested port без `default`;
- `MenuItem command="..."`;
- `MenuItem action="..."`, если Action не объявлен в `definePorts.provides`;
- повторяющиеся имена ports и неправильные kinds в секции.

## Renderer-neutral контракт

Template tags обозначают абстрактные UI primitives, а не HTML elements. DOM, Canvas или другой adapter материализует тот же IR своим способом. Action context также не содержит DOM event как архитектурный контракт; renderer-specific details остаются внутри adapter.

## Legacy `Component`

Старый `Component` хранит Table/DSL/JSX-конфигурацию как data-only document и не создаёт runtime host. Для нового исполняемого интерфейса используется Component SFC.
