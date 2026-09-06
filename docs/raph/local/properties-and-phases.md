# Свойства и decorators

Local decorators сохраняют metadata на классах. Runtime извлекает её и создаёт исполняемые descriptors.

## Property

```ts
import { RaphProperty, RaphPropagation, RaphNode } from '@endge/raph'

interface NodeProperties {
  visible: boolean
  x: number
  width: number
  right: number
}

class ViewNode extends RaphNode<NodeProperties> {
  @RaphProperty({
    phase: 'layout',
    default: true,
    propagation: RaphPropagation.Down,
  })
  visible!: boolean

  @RaphProperty({
    phase: 'layout',
    default: 0,
  })
  x!: number
}
```

`RaphProperty` является коротким alias для `RaphLocalProperty`.

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
right!: number
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

## Ручная конфигурация

Для runtime со своим owner можно извлечь metadata через:

- `extractRaphLocalProperties(instance)`;
- `extractRaphLocalPhases(instance)`;
- `extractRaphLocalAfterHandlers(instance)`.

Именно этот путь использует Nova, чтобы самостоятельно владеть созданием `RaphApp`, выбором shared kernel и cleanup.
