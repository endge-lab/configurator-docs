# Nodes и зависимости

`RaphNode` одновременно является lifecycle owner и позицией в parent/children
tree. Producers могут принадлежать любой scope; effect принадлежит consumer
owner.

## Reactive edges

```ts
const source = parent.signal(0)

child.effect('update', () => {
  consume(source.get())
})
```

Implicit read разрешён для source того же owner, ancestor или runtime root.
Sibling/descendant dependency должна быть явной:

```ts
sibling.watch(source, 'update', task => {
  consume(task.causes)
})
```

Cross-runtime source отклоняется.

## Structure

`addChild`, `reorderChildren`, создание и disposal node публикуют structure
causes. Цепочка изменений одной node коалесцируется до net old → new snapshot.

## Нерективное состояние

```ts
node.cache = nextCache
node.touch({ reason: 'cache-rebuilt' })
```

`touch` активирует self/subtree/runtime granules, но не создаёт скрытую
универсальную dirty phase. Частые phase requests лучше выражать отдельным
owner-owned pulse signal.

