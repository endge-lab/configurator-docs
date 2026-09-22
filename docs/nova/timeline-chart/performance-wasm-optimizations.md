# WASM-оптимизации

WASM-режимы TimelineChart v2 выключены по умолчанию. Они нужны для плотных производственных сцен, где bottleneck находится в повторяемой числовой работе: поиск видимых кандидатов, grouping узких задач, сборка простых rect-batches или batch hit-test.

Главный флаг - `rendering.wasm.enabled`. Если он выключен, timeline всегда использует обычный JS path, даже если дочерние флаги выставлены в `true`.

```ts
const options = {
  rendering: {
    wasm: {
      enabled: true,
    },
  },
}
```

## Visible extraction

`visibleExtraction` разрешает numeric WASM kernel для извлечения видимых range-кандидатов из плотных buffers. JS остается владельцем объектов, групп, selection, tooltip и публичной модели данных. Если текущий кадр нельзя безопасно перевести в numeric path, timeline пишет fallback diagnostics и продолжает JS path.

```ts
const options = {
  rendering: {
    wasm: {
      enabled: true,
      visibleExtraction: true,
    },
  },
}
```

Включайте этот флаг для сцен с большим числом задач и частым zoom/scroll. Не ждите выигрыша на малых наборах или если основная стоимость находится в task template, text rendering или custom callbacks.

## Task Density LOD

`taskDensityLod` - render-only LOD. Он не меняет данные, `visibleBlocks`, hit-test, tooltip и selection. Если в одной строке несколько узких range-задач становятся визуально неразличимыми, planner заменяет их одним серым rect-cluster и не вызывает дорогой task profile для этих задач.

Для работы режима нужно включить сам LOD и, отдельно, WASM implementation:

```ts
const options = {
  rendering: {
    taskDensityLod: {
      enabled: true,
      maxTaskWidthPx: 5,
      maxGapPx: 2,
      minClusterSize: 2,
      color: '#b8c0c7',
    },
    wasm: {
      enabled: true,
      taskDensityLod: true,
    },
  },
}
```

Параметры:

```ts
const taskDensityLod = {
  maxTaskWidthPx: 5, // задача считается узкой
  maxGapPx: 2, // соседние узкие задачи попадают в один run
  minClusterSize: 2, // минимальный размер run для замены
  color: '#b8c0c7',
}
```

Включайте для zoom-out, где отдельные балки уже не читаются. Не включайте, если важно видеть цвет/иконки/текст каждой узкой задачи даже при сильном zoom-out.

## Hit-test batch-only

`hitTest` в WASM работает только в batch-only режиме. Он не заменяет обычный pointer/mousemove path, потому что один JS-to-WASM вызов на каждое движение мыши обычно дороже, чем JS hit-test. Режим нужен для массовых запросов, например для внешнего overlay, аналитики или prefetch-проверок.

```ts
const options = {
  rendering: {
    wasm: {
      enabled: true,
      hitTest: {
        enabled: true,
        mode: 'batch-only',
      },
    },
  },
}
```

Пример batch-запроса:

```ts
const hits = timelineRef.value?.hitTestBatch([
  { x: 120, y: 80 },
  { x: 240, y: 80 },
  { x: 360, y: 120 },
])
```

## Standard-mode WASM kernels

Standard-mode kernels не являются LOD. Они не заменяют task template на серый rect, не меняют `visibleBlocks`, selection, tooltip и hit-test model. Их задача - перенести повторяемую числовую работу в WASM, сохранив обычную картинку.

Все standard-mode kernels зависят от общего флага:

```ts
const options = {
  rendering: {
    wasm: {
      enabled: true,
    },
  },
}
```

### Visible geometry

`visibleGeometry` считает экранную геометрию плотного task buffer: visible indices, `x/y/width/height`. JS остается владельцем объектов, групп, фильтров и callbacks.

```ts
const options = {
  rendering: {
    wasm: {
      enabled: true,
      visibleGeometry: true,
    },
  },
}
```

Включайте для больших сцен, где profiling показывает стоимость подготовки видимой геометрии. Не включайте, если bottleneck находится в templates, text или GPU upload.

### Overlap layout

`overlapLayout` ускоряет расчет collapsed overlap ordering: какие задачи входят в overlap-компонент, какой у них `zRank` и какой component id использовать для отрисовки.

```ts
const options = {
  rendering: {
    wasm: {
      enabled: true,
      overlapLayout: true,
    },
  },
}
```

Включайте для сцен с большим числом пересекающихся задач в `allowOverlap` группах. Этот режим не упрощает визуал: он только ускоряет числовую часть расчета overlap.

### Sort/filter

`sortFilter` переносит numeric sort/filter для плотных task buffers. Пользовательские callbacks, object mapping и доменные фильтры остаются в JS.

```ts
const options = {
  rendering: {
    wasm: {
      enabled: true,
      sortFilter: true,
    },
  },
}
```

Включайте после замера, если в diagnostics видно, что сортировка или числовая фильтрация task buffers занимает заметное время.

### Incremental diff

`incrementalDiff` считает affected tasks/groups/rows/time range для batch updates. Он полезен для SSE или частых `update/batch`, где за кадр приходит много изменений.

```ts
const options = {
  rendering: {
    wasm: {
      enabled: true,
      incrementalDiff: true,
    },
  },
}
```

Включайте для потоковых обновлений. Для редких одиночных updates overhead копирования в WASM может быть больше выигрыша.

### Batch hit-test standard kernel

`hitTest` остается batch-only, но использует standard-mode spatial kernel. Он за один вызов извлекает видимую геометрию и ищет ближайшие задачи для массива точек.

```ts
const options = {
  rendering: {
    wasm: {
      enabled: true,
      hitTest: {
        enabled: true,
        mode: 'batch-only',
      },
    },
  },
}
```

Обычный pointer/mousemove path остается JS. Для одиночных запросов boundary overhead обычно съедает пользу.

## Fused render pipeline

`fusedRenderPipeline` - самый агрессивный режим. Он объединяет несколько шагов в один WASM-коридор: numeric visible pass, density grouping и сборку rect batch для серых density-clusters. Цель - избежать нескольких больших JS/WASM boundary calls и повторного копирования buffers.

```ts
const options = {
  rendering: {
    wasm: {
      enabled: true,
      fusedRenderPipeline: {
        enabled: true,
        maxTaskWidthPx: 5,
        maxGapPx: 2,
        minClusterSize: 2,
        color: '#b8c0c7',
      },
    },
  },
}
```

Приоритеты:

```ts
const options = {
  rendering: {
    wasm: {
      enabled: true,
      visibleExtraction: true,
      taskDensityLod: true,
      fusedRenderPipeline: {
        enabled: true,
        maxTaskWidthPx: 5,
        maxGapPx: 2,
        minClusterSize: 2,
      },
    },
  },
}
```

Если `fusedRenderPipeline.enabled === true`, timeline сначала пробует fused path. Если WASM недоступен или кадр не подходит, он откатывается к отдельным включенным kernels, а затем к JS. Широкие, selected, invalid, background и collapsed-overlap задачи остаются в обычном JS planner, чтобы не ломать слойность и интерактивность.

Включайте fused pipeline для сильного zoom-out и десятков тысяч видимых узких задач. Не включайте его, если нужна pixel-perfect отрисовка каждого task template при любой ширине.

## Отличие от clusterThresholdPx

`clusterThresholdPx` меняет видимый список блоков и идет через `cluster` template. Это полезно, когда продукт хочет показать пользователю настоящие агрегированные clusters.

`taskDensityLod` и `fusedRenderPipeline` не меняют модель данных и interaction. Они только заменяют render output для задач, которые уже визуально слились в плотную серую массу.

```ts
const dataClusterOptions = {
  clusterThresholdPx: 4,
}

const renderOnlyOptions = {
  clusterThresholdPx: 0,
  rendering: {
    taskDensityLod: {
      enabled: true,
      maxTaskWidthPx: 5,
      maxGapPx: 2,
      minClusterSize: 2,
    },
    wasm: {
      enabled: true,
      fusedRenderPipeline: {
        enabled: true,
      },
    },
  },
}
```

## Diagnostics

Timeline пишет статус каждого kernel в `wasmDiagnostics`. Это нужно читать при ручном profiling: активный флаг не гарантирует, что конкретный кадр ушел в WASM.

```ts
import type { NovaApp } from '@endge/nova'
import type { NovaCanvasReadyPayload } from '@endge/nova-vue'
import type { TimelineWasmDiagnostics } from '@engine2d/timeline-chart'

let timelineApp: NovaApp | null = null

function handleReady(payload: NovaCanvasReadyPayload): void {
  timelineApp = payload.app
}

function logWasmDiagnostics(): void {
  const diagnostics = findTimelineStore(timelineApp)?.wasmDiagnostics

  console.table({
    enabled: diagnostics?.enabled,
    visibleExtraction: diagnostics?.kernels.visibleExtraction,
    visibleGeometry: diagnostics?.kernels.visibleGeometry,
    overlapLayout: diagnostics?.kernels.overlapLayout,
    sortFilter: diagnostics?.kernels.sortFilter,
    incrementalDiff: diagnostics?.kernels.incrementalDiff,
    taskDensityLod: diagnostics?.kernels.taskDensityLod,
    hitTest: diagnostics?.kernels.hitTest,
    fusedRenderPipeline: diagnostics?.kernels.fusedRenderPipeline,
    fallbackReason: diagnostics?.fallbackReason,
    jsToWasmCalls: diagnostics?.jsToWasmCalls,
    copiedBytesToWasm: diagnostics?.copiedBytesToWasm,
    copiedBytesFromWasm: diagnostics?.copiedBytesFromWasm,
  })
}

function findTimelineStore(app: NovaApp | null): TimelineDiagnosticsStore | null {
  if (!app) return null

  for (const surface of app.surfaces) {
    const store = findTimelineStoreInNode(surface as TimelineDiagnosticsNode)
    if (store) return store
  }

  return null
}

function findTimelineStoreInNode(node: TimelineDiagnosticsNode): TimelineDiagnosticsStore | null {
  if (node.store?.wasmDiagnostics) return node.store

  for (const child of node.children ?? []) {
    const store = findTimelineStoreInNode(child)
    if (store) return store
  }

  return null
}

interface TimelineDiagnosticsStore {
  wasmDiagnostics?: TimelineWasmDiagnostics
}

interface TimelineDiagnosticsNode {
  store?: TimelineDiagnosticsStore
  children?: TimelineDiagnosticsNode[]
}
```

Практическое правило: включайте WASM только после сравнения с JS baseline на своей сцене. Если FPS не меняется, значит bottleneck находится не в numeric kernels, а в templates, text, GPU upload, draw calls или внешних updates.
