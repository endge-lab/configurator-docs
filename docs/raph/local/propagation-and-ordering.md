# Granularity и ordering

::: warning Страница не обновляется
Актуальная документация Raph — на сайте Raphy; публичный адрес сайта появится позже. Что из Raph нужно для работы с Endge — на странице [«Raph в Endge»](/reference/raph). Точные типы — в [контрактах Raph](/raph/contracts/).
:::

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

