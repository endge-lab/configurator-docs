# Granularity и ordering

Runtime поддерживает несколько source granules одним `watch` API.

```ts
renderer.watch(shape.x, 'matrix', updateMatrix)
renderer.watch(shape, 'render', renderShape)
renderer.watch(scene, 'render', renderScene, { include: 'subtree' })
renderer.watch(runtime, 'render', renderApplication)
renderer.watch(runtime.frameTick, 'render', renderFrame)
```

- node source по умолчанию означает `self`;
- `include: 'subtree'` реагирует на self и descendants;
- runtime source реагирует на изменения Runtime, кроме frameTick;
- subtree notification проходит вверх по ancestors, не сканируя descendants;
- indexes создаются лениво при первой подписке.

## Aggregate

```ts
const viewportChanges = renderer.aggregate([
  camera.zoom,
  { source: scene, include: 'subtree' },
  theme,
])

renderer.watch(viewportChanges, 'render', renderViewport)
```

Aggregate immutable, принадлежит создавшему owner и принимает только sources
того же Runtime. Одна причина дедуплицируется независимо от числа путей до неё.

Granularity выбирает, какая binding активируется. Порядок её выполнения отдельно
задаётся phase `process`.

