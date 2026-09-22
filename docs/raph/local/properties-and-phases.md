# Свойства, phases и конфигурация

Local decorators сохраняют metadata на классах. Runtime извлекает её и создаёт исполняемые descriptors. Decorator сам не создаёт JavaScript-поле и не перехватывает чтение или запись: публичный accessor ноды должен делегировать операции в `node.get` и `node.set`.

## Property

```ts
import {
  RaphApp,
  RaphNode,
  RaphPropagation,
  RaphProperty,
} from '@endge/raph'

interface NodeProperties {
  visible: boolean
  x: number
  width: number
  right: number
}

class ViewNode extends RaphNode<NodeProperties> {
  constructor(app = new RaphApp<NodeProperties>()) {
    super(app)
  }

  @RaphProperty({
    phase: 'layout',
    default: true,
    propagation: RaphPropagation.Down,
  })
  get visible(): boolean {
    return this.get('visible')
  }

  set visible(value: boolean) {
    this.set('visible', value)
  }

  @RaphProperty({
    phase: 'layout',
    default: 0,
  })
  get x(): number {
    return this.get('x')
  }

  set x(value: number) {
    this.set('x', value)
  }
}
```

`RaphProperty` является коротким alias для `RaphLocalProperty`.

Запись через accessor вызывает `node.set`, поэтому property descriptor записывает local value и ставит связанную phase в dirty queue. Объявление вида `visible!: boolean` создаёт только TypeScript-поле и не подключает этот lifecycle.

Property options:

- `phase` — имя dirty phase;
- `default` — значение до первой явной записи;
- `propagation` — `None`, `Down` или `Up`;
- `compute(self)` — функция пересчёта;
- `dependsOn` — порядок других properties внутри той же phase.

## Computed local property

```ts
@RaphProperty({
  phase: 'layout',
  dependsOn: ['x', 'width'],
  compute: node => node.get('x') + node.get('width'),
})
get right(): number {
  return this.get('right')
}
```

Во время `init()` runtime топологически сортирует properties phase по `dependsOn`. Цикл dependencies приводит к ошибке.

## Phase

```ts
import { Raph, RaphLocalPhase } from '@endge/raph'

class ViewRuntime {
  @RaphLocalPhase({ name: 'layout', priority: 10 })
  layout(payload) {
    Raph.processDirtyNodes({ payload })
  }

  @RaphLocalPhase({ name: 'render', priority: 20, always: true })
  render(payload) {
    Raph.processDirtyNodes({ payload })
  }
}
```

Если phase явно объявлена методом, этот метод является её processor. `Raph.processDirtyNodes` пересчитывает зарегистрированные properties для dirty nodes и вызывает node after-hooks.

Если property ссылается на phase без отдельного decorated method, `configureLocal` создаёт phase с default processor.

## Сборка runtime из decorators

`Raph.configureLocal` читает metadata с экземпляров runtime и ноды, создаёт `RaphApp`, phases и property descriptors. Инициализация остаётся явной:

```ts
import { Raph, RaphSchedulerType } from '@endge/raph'

const runtime = new ViewRuntime()
const { app, phases, props } = Raph.configureLocal<
  NodeProperties,
  ViewRuntime,
  ViewNode
>(
  () => runtime,
  () => new ViewNode(),
)

app.options({ scheduler: RaphSchedulerType.Sync })
app.init()

const node = new ViewNode(app)
app.addNode(node)
node.x = 10
```

Возвращаемые `phases` и `props` — те же исполняемые descriptors, которые можно создать вручную.

## After-hook ноды

```ts
import { RaphAfter } from '@endge/raph'

class ViewNode extends RaphNode<NodeProperties> {
  @RaphAfter({ phase: 'layout' })
  afterLayout() {
    // Реакция после пересчёта local properties этой ноды
  }
}
```

`RaphAfter` является alias для `RaphLocalAfter`. Hook вызывается после обработки конкретной ноды, если processor использует стандартный `processDirtyNodes` flow.

## Без decorators: runtime descriptors

Когда application или integration layer сам владеет созданием runtime, тот же Local API можно настроить без decorator metadata:

```ts
import {
  Raph,
  RaphApp,
  RaphLocalPhaseRuntime,
  RaphLocalPropertyRuntime,
  RaphNode,
  RaphPropagation,
  RaphSchedulerType,
} from '@endge/raph'

interface LocalProperties {
  x: number
}

const app = new RaphApp<LocalProperties>({
  scheduler: RaphSchedulerType.Sync,
})

const layout = new RaphLocalPhaseRuntime<LocalProperties>(
  'layout',
  'dirty',
  payload => Raph.processDirtyNodes({ payload }),
)

app.addLocalPhase(layout)
app.addLocalProperty(new RaphLocalPropertyRuntime<LocalProperties, 'x'>(
  'x',
  'layout',
  RaphPropagation.None,
  undefined,
  [],
  0,
))
app.init()

const node = new RaphNode<LocalProperties>(app, { id: 'box' })
app.addNode(node)

node.set('x', 10)
console.log(node.get('x')) // 10
```

Порядок важен: сначала добавьте phase, затем связанные properties, после этого вызовите `init()`. `node.set` и `node.get` работают одинаково независимо от того, получены descriptors из decorators или созданы вручную.

Для ручного аналога `RaphAfter` назначьте `layout.afterProcess`. Для собственного processor можно заменить вызов `Raph.processDirtyNodes`, но тогда integration layer сам отвечает за пересчёт properties и after-hook lifecycle.

## Низкоуровневая запись без descriptor

Если property descriptor вообще не нужен, значение можно хранить напрямую:

```ts
node.setLocal('x', 10)
node.dirty('layout')

// То же хранилище через короткий API:
node.local.set('x', 20)
node.dirty('layout')
```

`setLocal` и `local.set` не выбирают phase и не добавляют ноду в dirty queue. Этот путь подходит только owner-коду, который сам контролирует invalidation.

## Извлечение decorator metadata

Для runtime со своим owner можно извлечь metadata через:

- `extractRaphLocalProperties(instance)`;
- `extractRaphLocalPhases(instance)`;
- `extractRaphLocalAfterHandlers(instance)`.

Именно этот путь использует Nova, чтобы самостоятельно владеть созданием `RaphApp`, выбором shared kernel и cleanup.
