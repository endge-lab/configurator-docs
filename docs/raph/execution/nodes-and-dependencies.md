# Nodes и зависимости

`RaphNode` — единица runtime graph. Нода может быть самостоятельной, участвовать в произвольных dependency edges и одновременно входить в parent/children дерево local runtime.

## Создание

```ts
import { RaphNode } from '@endge/raph'

const source = new RaphNode(app, {
  id: 'source',
  type: 'data-source',
  weight: 10,
  meta: { feature: 'schedule' },
})

app.addNode(source)
```

Идентификаторы должны быть уникальны внутри runtime graph. `type` используется для фильтрации нод в фазах, `weight` влияет на порядок, а `meta` доступна инспекторам и пользовательскому коду.

## Dependency graph

```ts
const transform = new RaphNode(app, { id: 'transform' })
const render = new RaphNode(app, { id: 'render' })

app.addNode(transform)
app.addNode(render)

app.addDependency(source, transform)
app.addDependency(transform, render)
```

Ребро `parent → child` означает направление распространения для `dirty-and-down` и обратное направление для `dirty-and-up`. `DepGraph` отклоняет self-reference, отсутствующие ноды и edges, которые создают цикл.

Полезные операции graph:

- `addDependency(parent, child)`;
- `removeDependency(parent, child)`;
- `graph.parentsOf(node)`;
- `graph.childrenOf(node)`;
- `graph.roots()`;
- `graph.getDepth(node)`;
- `graph.topoOrder()`.

## Parent/children tree

```ts
root.addChild(child)
```

`addChild` выполняет сразу несколько действий:

- перепривязывает child к runtime родителя;
- регистрирует child и его существующее поддерево;
- добавляет dependency edge `root → child`;
- помечает default local phases новой ноды dirty.

Tree нужен local runtime для наследования, propagation и структурного обхода. Произвольный dependency graph может иметь несколько родителей и не обязан совпадать с tree.

## Dirty state

```ts
node.dirty('render')
node.dirty(['layout', 'render'])
```

Dirty state хранится отдельно для каждой фазы. Повторные invalidations одной пары `node + phase` дедуплицируются, а связанные events накапливаются до выполнения.

## Cleanup

`node.dispose()` рекурсивно освобождает descendants ноды, очищает local values и снимает runtime-регистрацию. Если owner удаляет одиночную ноду из готового tree, используйте управляемый lifecycle runtime и не сохраняйте внешние сильные ссылки на disposed node.

