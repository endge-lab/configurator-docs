# Component SFC

Component SFC — основной исполняемый документ интерфейса. Он объединяет публичные порты, renderer-neutral template, локальные вычислительные ресурсы и EndgeCSS в одном source-документе.

## Функции runtime-контекста

`defineProps` описывает только публичные бизнес-входы Component SFC. Переводы и
справочники не нужно добавлять в props: безопасные template-выражения получают
их из ближайшего Composition runtime scope через две встроенные функции.

| Функция | Что возвращает | Где объявляется provider |
| --- | --- | --- |
| `t(key, fallback?)` | Переведённую строку | `Composition.resources` через `i18n(identity)` |
| `vocab(alias, mapping?)` | `SourceFieldOption[]` | `Composition.data` через `vocab(identity)` |

Это не Vue `provide/inject` и не импортируемые функции. Они доступны только
внутри SFC template expressions, например в интерполяции или динамическом
атрибуте. Вызвать их как обычный top-level код в `<script setup>` нельзя.

### Переводы: `t()`

Глобальная функция `t` доступна в безопасных SFC template-выражениях без `useI18n` и импортов:

```vue
<template>
  <Text>{{ t('schedule:title') }}</Text>
  <Text :tooltip="t('schedule:refreshHint', 'Обновить данные')">
    {{ t('common:actions.refresh') }}
  </Text>
</template>
```

Первый сегмент до двоеточия — alias ресурса из `Composition.resources`, а не identity документа. Второй аргумент — необязательный fallback. Если ключ не найден и fallback не передан, renderer показывает исходный ключ как <code>&#123;&#123;schedule:title&#125;&#125;</code>.

Компонент получает только catalog своего Composition/runtime scope. Словари родительских и вложенных Composition накапливаются; глобальный список всех документов workspace компоненту не открывается. При смене `Endge.context.currentLocale` runtime инвалидирует application scope и заново рендерит активные компоненты.

Регистрация словаря и правила коллизий описаны в [Composition](/reference/composition#data-и-resources), а структура отдельного документа — в [I18n Bundle](/reference/i18n-bundle).

### Справочники: `vocab()`

Composition загружает физические Vocab documents и публикует дочерним runtime
только локальные aliases:

```ts
defineComposition({
  data: {
    airlines: vocab('aodb-airlines'),
    serviceTypes: vocab('aodb-flight-service-types'),
  },

  runtimes: {
    card: component('schedule-card'),
  },
})
```

`aodb-airlines` и `aodb-flight-service-types` — физические identities. Component
SFC их не знает и обращается только к aliases `airlines` и `serviceTypes`:

```vue
<script setup lang="ts">
defineProps<{
  flight: ScheduleCardModel
}>()
</script>

<template>
  <Select
    :value="flight.flightCarrier"
    :options="vocab('airlines', {
      valuePath: 'code',
      labelPath: 'description',
    })"
  />

  <Select
    :value="flight.serviceType"
    :options="vocab('serviceTypes', {
      valuePath: 'code',
      labelPath: 'description',
    })"
  />
</template>
```

Сигнатура:

```ts
vocab(
  alias: string,
  mapping?: {
    valuePath: string
    labelPath: string
  },
): SourceFieldOption[]
```

Правила:

- `alias` должен быть непустой статической строкой;
- mapping, если передан, должен быть статическим object literal с обеими
  строковыми настройками `valuePath` и `labelPath`;
- без mapping используются пути `value` и `label`, поэтому исходные записи уже
  должны соответствовать `SourceFieldOption`;
- записи без scalar `value` (`string`, `number` или `boolean`) не становятся
  options;
- отсутствующий alias является runtime error — Component SFC не ищет Vocab по
  identity или произвольному ключу глобального кеша.

Compiler сохраняет обращения `vocab()` в runtime dependencies Component SFC
artifact. При render Component host разрешает alias в effective catalog
ближайшего Composition scope, читает массив по связанному Raph path и
подписывается на него. Если `Endge.vocabs` обновит справочник, Vue bridge повторно
рендерит компонент без изменения props.

Корневые aliases наследуются дочерними scopes и вложенными Composition.
Одноимённый alias ближайшего scope перекрывает alias предка только внутри своего
поддерева. Component SFC сам ничего не загружает: Composition активирует Vocab
dependencies до создания runtime-нод соответствующего scope.

Для прямого preview Configurator читает compiler-derived Vocab dependencies SFC
и создаёт временную preview Composition. Alias должен иметь единственного
provider среди compiled Composition artifacts. Если ни одна Composition его не
публикует, Configurator допускает только точное совпадение alias с Vocab identity.
Неоднозначный alias не выбирается автоматически: такой компонент нужно открывать
через intended Composition preview.

Подробности загрузки и cache policy находятся на странице
[Справочники (Vocab)](/reference/vocab).

## Preview props

`definePreviewProps({...})` задаёт входные значения только для Component SFC preview. Они не становятся defaults публичного component contract и не применяются, когда компонент монтирует Composition.

```vue
<script setup lang="ts">
defineProps<{
  title: string
  rows: FlightRow[]
}>()

definePreviewProps({
  title: 'Рейсы на перроне',
  rows: [
    { id: 'SU100', status: 'boarding' },
  ],
})
</script>

<template>
  <Table :rows="rows" row-key="id" />
</template>
```

Для runtime-backed preview component props поддерживаются `fromStore(path)` и `fromData('store.path')`. Второй аргумент позволяет подготовить Store seed и запустить Query перед render:

```ts
definePreviewProps(
  {
    rows: fromData('schedule.table'),
  },
  {
    run: [
      query('schedule').storeTo(store('schedule'), {
        table: output('rows'),
      }),
    ],
  },
)
```

`RMock` references через `mock(identity)` сейчас являются preview API Composition и Store initializer API. Component SFC использует inline values, `fromStore` или `fromData`; различия собраны на странице [Mock data](/reference/mock).

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
| Может быть переопределён | Required Action — да | Контракт нет, прикреплённая реакция — да |

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

Это public compiled contract и origin map. Для Events runtime создаёт отдельную
границу каждого mounted Component SFC: occurrence дочернего компонента проходит
через `forward` в родительскую границу и публикуется её подписчикам. Для Actions
origin по-прежнему указывает конкретный mounted child, которому runtime
адресует вызов. `forward` не создаёт скрытый DOM callback и не анализируется
повторно во время исполнения.

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
  // Собственное событие текущего компонента.
  detailsOpened: event<{ id: string }>(),

  // Событие дочерней Table с прикреплённой реакцией.
  rowActivated: event<TableRowActivatedEvent>({
    from: { ref: 'table', event: 'rowActivated' },
    action: {
      identity: 'flight.open-details',
      input: { id: event('rowId') },
    },
  }),
}
```

Отсутствие `from` означает собственное событие Component SFC. Если `from`
указан, compiler проверяет literal `ref`, имя события дочернего компонента и тип
payload. Для `Table` список событий берётся из встроенного реестра портов.

Поле `action` необязательно. Оно хранит текущую реакцию прямо в Source и не
потребляет событие: runtime сначала публикует Event подписчикам, затем запускает
реакцию и продолжает `forward`. Ошибка реакции попадает в diagnostics, но не
отменяет публикацию. Отдельных полей `bindings` и `default` у Event нет.

В direct Action вход можно собрать из payload:

- `event()` передаёт весь payload;
- `event('rowId')` читает поле;
- `event('row.id')` читает вложенное поле по dot-path;
- literal, массивы и объекты можно комбинировать с этими выражениями.

Action выполняется через `Endge.actions.execute` и получает scope текущего
runtime-компонента и target исходной Table.

### Реакция TypeScript в песочнице

```ts
emits: {
  rowContextMenuRequested: event<TableRowContextMenuRequestedEvent>({
    from: { ref: 'table', event: 'rowContextMenuRequested' },
    action: typescript({
      inputs: { event: event() },
      compute({ event }, api) {
        return [
          api.action('audit.write', {
            operation: 'row-context-menu',
            rowId: event.rowId,
          }),
          ports.emits.detailsOpened({ id: event.rowId }),
        ]
      },
    }),
  }),
}
```

Песочница возвращает один effect или массив effects. Разрешены только
`api.action(...)` и заранее объявленные `ports.emits.*`. Imports, DOM, сеть,
таймеры и прямой доступ к `Endge` запрещены. Runtime ограничивает одну цепочку
32 переходами/effects и останавливает циклический повторный emit.

Удаление реакции в визуальном редакторе удаляет только `action`. Сам Event
остаётся в `emits` и продолжает публиковаться.

### События непосредственно на тегах

Если реакция нужна только внутри текущего шаблона, Event необязательно выводить
в публичный `emits`. Action можно указать прямо в атрибуте тега:

```vue
<Text
  ref="title"
  @click.stop="action({
    identity: 'audit.track-click',
    input: { pointer: event() },
  })"
>
  Открыть рейс
</Text>
```

Такой обработчик остаётся локальным. Чтобы тот же `click` был доступен
родительскому компоненту, его нужно явно опубликовать через `emits.from` или
`forward`:

```ts
emits: {
  titleClicked: event<ComponentSFCPointerEventPayload>({
    from: { ref: 'title', event: 'click' },
  }),
}
```

Built-in registry описывает общие события указателя, мыши, клавиатуры, фокуса,
прокрутки и drag-and-drop. Для `Input`, `Textarea`, `Checkbox` и `Select` также
доступны `input` и `change`. Payload не содержит DOM Event и одинаков для всех
renderer-ов.

Поддержаны modifiers `.stop`, `.prevent`, `.self`, `.once`, `.capture` и
`.passive`. `.stop` останавливает DOM bubbling и дальнейшую публикацию этого
occurrence через Event boundary, но локальный Action выполняется. Комбинация
`.passive.prevent` запрещена compiler-ом.

`Table` имеет и общие браузерные Events (`click`, `contextmenu`, `keydown` и
другие), и девять смысловых Table Events. Например, `contextmenu` сообщает о
нажатии на область Table, а `rowContextMenuRequested` дополнительно содержит
строку, колонку и координаты anchor.

Полный список event-capable тегов, intrinsic Events, payload-полей, modifiers и
вариантов routing приведён в руководстве
[«События Component SFC на практике»](/guides/component-events).

## Компиляция и runtime

1. Source parser читает `definePorts`.
2. Compiler валидирует направления, kinds и defaults.
3. Typed manifest, events contract и dependencies сохраняются в Component SFC artifact.
4. `ComponentSFCRuntimeHost` читает только artifact, а не повторно анализирует source.
5. Renderer публикует occurrence через границу Event текущего экземпляра.
6. Runtime запускает прикреплённый Action и применяет `forward` независимо друг от друга.

Подробный контракт providers, overrides и target diagnostics описан в [Actions](./action.md).

Это сохраняет source-first boundary: persisted document остаётся декларативным, compiler produces executable contract, runtime only executes it.

## Ошибки компиляции

Compiler отклоняет:

- flat ports без `require`, `provides` или `emits`;
- удалённую секцию `request`: используйте `require` и `ports.require`;
- `default` у provided Action или Event; реакция Event задаётся полем `action`;
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
