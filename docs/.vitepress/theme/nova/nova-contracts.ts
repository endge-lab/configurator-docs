import type { DocsContractDefinition } from './nova-types'

export const DOCS_CONTRACTS: Record<string, DocsContractDefinition> = {
  'nova-app-create-options': {
    id: 'nova-app-create-options',
    kind: 'app',
    title: 'NovaAppCreateOptions',
    packageName: '@endge/nova',
    sourcePath: 'packages/@endge-nova/src/domain/types/base.types.ts',
    summary: 'Контракт создания NovaApp: canvas target, размер, input, renderer, scheduler и debug-настройки.',
    signature: 'interface NovaAppCreateOptions<E extends EventList = Record<string, any>>',
    groups: [
      {
        id: 'target-size',
        title: 'Target и size',
        caption: 'Минимальный набор, без которого runtime не создается.',
        items: [
          {
            name: 'target',
            type: 'HTMLCanvasElement',
            required: true,
            description: 'Видимый canvas, к которому NovaApp привязывает основной renderer и input listeners.',
          },
          {
            name: 'size.width',
            type: 'number',
            required: true,
            description: 'Логическая ширина runtime. Canvas pixel size рассчитывается через DPR.',
          },
          {
            name: 'size.height',
            type: 'number',
            required: true,
            description: 'Логическая высота runtime. Surfaces наследуют этот размер при создании и resize.',
          },
          {
            name: 'size.dpr',
            type: 'number',
            defaultValue: 'window.devicePixelRatio',
            description: 'Явный DPR, если приложение хочет управлять плотностью canvas самостоятельно.',
          },
          {
            name: 'size.maxDpr',
            type: 'number',
            description: 'Верхняя граница DPR для контроля памяти и backbuffer size.',
          },
        ],
      },
      {
        id: 'input',
        title: 'Input',
        caption: 'Pointer и keyboard можно отключать или ограничивать scope.',
        items: [
          {
            name: 'input.pointer.enabled',
            type: 'boolean',
            defaultValue: 'true',
            description: 'Подключает pointer events к canvas.',
          },
          {
            name: 'input.pointer.capture',
            type: 'boolean',
            defaultValue: 'true',
            description: 'Автоматически ставит pointer capture на target node после mousedown.',
          },
          {
            name: 'input.keyboard.scope',
            type: "'focused' | 'active' | 'hovered' | 'global' | 'manual'",
            defaultValue: "'focused'",
            description: 'Определяет, где Nova слушает keyboard events и когда их обрабатывает.',
          },
          {
            name: 'input.keyboard.preventDefault',
            type: "'never' | 'handled' | 'always'",
            defaultValue: "'handled'",
            description: 'Контролирует preventDefault для keyboard events.',
          },
        ],
      },
      {
        id: 'runtime',
        title: 'Renderer, scheduler и debug',
        items: [
          {
            name: 'renderer.main',
            type: 'RendererType.Web2D',
            defaultValue: 'Web2D',
            description: 'App-level backend для единственного visible canvas.',
          },
          {
            name: 'renderer.webgl',
            type: 'WebGLContextAttributes',
            description: 'Атрибуты WebGL-context для app-level WebGL backend.',
          },
          {
            name: 'scheduler.type',
            type: 'RaphSchedulerType',
            defaultValue: 'AnimationFrame',
            description: 'Scheduler reactive runtime.',
          },
          {
            name: 'scheduler.loop',
            type: 'boolean',
            defaultValue: 'false',
            description: 'Запускает постоянный loop сразу после init.',
          },
          {
            name: 'sound',
            type: 'NovaSoundOptions',
            description: 'Настройки app-level Sound Engine: mute, volume, maxVoices, unlock и format preference.',
          },
          {
            name: 'debug.telemetry',
            type: 'boolean',
            description: 'Включает сбор telemetry snapshots для renderer diagnostics.',
          },
        ],
      },
    ],
    notes: [
      'Создавайте NovaApp только после mount canvas в DOM.',
      'Для Vue-страниц destroy должен вызываться в cleanup lifecycle.',
    ],
    rawTs: `export interface NovaAppCreateOptions<E extends EventList = Record<string, any>> {
  target: HTMLCanvasElement
  size: NovaSizeOptions
  input?: NovaInputOptions
  renderer?: NovaRendererOptions
  scheduler?: NovaSchedulerOptions
  sound?: NovaSoundOptions
  debug?: NovaDebugOptions
  predefinedEvents?: (keyof E)[]
}`,
  },
  'nova-schema-item': {
    id: 'nova-schema-item',
    kind: 'schema',
    title: 'NovaSchemaItem',
    packageName: '@endge/nova',
    sourcePath: 'packages/@endge-nova/src/domain/types/renderer.types.ts',
    summary: 'Дискриминированный union всех primitives, которые renderer умеет отрисовывать через schema.',
    signature: "type NovaSchemaItem = { type: 'rect' | 'border' | 'text' | 'line' | 'circle' | 'arc' | 'icon' | 'polygon' }",
    groups: [
      {
        id: 'rect',
        title: 'rect',
        caption: 'Базовый прямоугольник для фонов, панелей, карточек и батчинга.',
        items: [
          { name: 'x, y', type: 'number', required: true, description: 'Локальная позиция внутри текущей node transform.' },
          { name: 'width, height', type: 'number', required: true, description: 'Логический размер rect.' },
          { name: 'styles.background', type: 'string | ImageBitmap | HTMLCanvasElement', description: 'Цвет, rgba или canvas texture/pattern.' },
          { name: 'styles.border', type: '{ color, width, radius, dashPattern, position }', description: 'Обводка rect. WebGL backend может rasterize сложные случаи в texture resource.' },
          { name: 'styles.opacity', type: 'number', description: 'Прозрачность элемента.' },
        ],
      },
      {
        id: 'text',
        title: 'text',
        caption: 'Текст с padding, align, ellipsis, markdown parser и clip.',
        items: [
          { name: 'text', type: 'string', required: true, description: 'Строка для отрисовки.' },
          { name: 'parser', type: "'string' | 'markdown'", defaultValue: "'string'", description: 'Markdown parser поддерживает базовые bold/italic/newline chunks.' },
          { name: 'styles.font', type: '{ family, size, weight }', description: 'Шрифт текста.' },
          { name: 'styles.padding', type: 'NovaStylePadding', description: 'Inner padding. Включает безопасный inner clip.' },
          { name: 'styles.align', type: '{ horizontal, vertical }', description: 'Выравнивание внутри text box.' },
          { name: 'styles.ellipsis', type: 'boolean', description: 'Обрезает длинный текст в одну строку.' },
        ],
      },
      {
        id: 'line-circle',
        title: 'line / circle / arc',
        caption: 'Простые primitives для связей, маркеров, progress rings и overlays.',
        items: [
          { name: 'line.x1/y1/x2/y2', type: 'number', required: true, description: 'Координаты начала и конца линии.' },
          { name: 'line.styles.dashPattern', type: 'number[]', description: 'Штриховка линии.' },
          { name: 'circle.x/y/radius', type: 'number', required: true, description: 'Центр и радиус круга.' },
          { name: 'circle.styles.border', type: '{ color, width, dashPattern }', description: 'Обводка круга.' },
          { name: 'arc.x/y/radius', type: 'number', required: true, description: 'Центр и радиус дуги.' },
          { name: 'arc.startAngle/endAngle', type: 'number', required: true, description: 'Углы в радианах.' },
          { name: 'arc.styles', type: '{ color, width, lineCap, opacity }', description: 'Цвет, толщина и окончание дуги.' },
        ],
      },
    ],
    notes: [
      'Schema items обычно создаются внутри render() node и передаются в renderer.schema().',
      'Для точного hit-test используйте setRenderBoundsFromSchema(schema).',
    ],
    rawTs: `export type NovaSchemaItem<TCustom extends { type: string } = never> =
  | ({ type: 'rect' } & NovaRect)
  | ({ type: 'border' } & NovaBorder)
  | ({ type: 'text' } & NovaText)
  | ({ type: 'line' } & NovaLine)
  | ({ type: 'circle' } & NovaCircle)
  | ({ type: 'arc' } & NovaArc)
  | ({ type: 'icon' } & NovaIcon)
  | ({ type: 'polygon' } & NovaPolygon)
  | TCustom`,
  },
  'nova-node': {
    id: 'nova-node',
    kind: 'node',
    title: 'NovaNode',
    packageName: '@endge/nova',
    sourcePath: 'packages/@endge-nova/src/model/runtime/tree/NovaNode.ts',
    summary: 'Базовый runtime-объект scene graph: transform, lifecycle, render, dirty flags и input handlers.',
    signature: 'class NovaNode<E extends EventList> extends RaphNode<NovaNodeProperties>',
    groups: [
      {
        id: 'properties',
        title: 'Properties',
        items: [
          { name: 'x, y', type: 'number', description: 'Локальная позиция node.' },
          { name: 'width, height', type: 'number', description: 'Логический размер и fallback bounds.' },
          { name: 'scaleX, scaleY, rotation', type: 'number', description: 'Transform-свойства matrix phase.' },
          { name: 'active, visible', type: 'boolean', description: 'Вычисляются с учетом parent state и управляют update/render/input.' },
          { name: 'interactive', type: 'boolean', description: 'Позволяет node участвовать в input registry.' },
        ],
      },
      {
        id: 'methods',
        title: 'Methods',
        items: [
          { name: 'options(opts)', type: 'this', description: 'Массово обновляет свойства node, включая zIndex через weight.' },
          { name: 'dirty(flags)', type: 'void', description: 'Помечает update/matrix/render phases dirty.' },
          { name: 'render()', type: 'void', description: 'Переопределяется в наследниках для отрисовки schema.' },
          { name: 'setLocalRenderBounds(bounds)', type: 'this', description: 'Задает точные bounds для culling и hit-test.' },
          { name: 'toLocal(gx, gy)', type: '[number, number]', description: 'Переводит координаты canvas в local coordinates node.' },
        ],
      },
      {
        id: 'events',
        title: 'Events',
        items: [
          { name: 'on(type, handler)', type: 'void', description: 'Подписка на bubble phase.' },
          { name: 'onCapture(type, handler)', type: 'void', description: 'Подписка на capture phase.' },
          { name: 'capturePointer(event)', type: 'void', description: 'Удерживает pointer на node во время drag.' },
          { name: 'focus(event, scope)', type: 'void', description: 'Ставит focus в default или named scope.' },
          { name: 'select(options, event)', type: 'void', description: 'Добавляет node в selection scope.' },
        ],
      },
    ],
    rawTs: `export class NovaNode<E extends EventList> extends RaphNode<NovaNodeProperties> {
  options(opts: Partial<NovaNodeProperties> & { zIndex?: number }): this
  dirty(opts: { matrix?: boolean; update?: boolean; render?: boolean } | string | string[]): void
  on<K extends keyof NovaNodeEventHandlers>(type: OneOrMany<K>, handler: NonNullable<NovaNodeEventHandlers[K]>): void
  render(): void
}`,
  },
  'nova-drag-event-meta': {
    id: 'nova-drag-event-meta',
    kind: 'event',
    title: 'NovaDragEventMeta',
    packageName: '@endge/nova',
    sourcePath: 'packages/@endge-nova/src/domain/types/events.types.ts',
    summary: 'Payload drag handlers: текущая позиция pointer, delta текущего шага и общий delta от dragstart.',
    signature: 'interface NovaDragEventMeta',
    groups: [
      {
        id: 'pointer',
        title: 'Pointer',
        items: [
          { name: 'pointerId', type: 'number', description: 'Pointer identifier. Для mouse fallback используется 1.' },
          { name: 'startX, startY', type: 'number', description: 'Canvas coordinates в момент mousedown.' },
          { name: 'x, y', type: 'number', description: 'Текущие canvas coordinates pointer.' },
        ],
      },
      {
        id: 'delta',
        title: 'Delta',
        items: [
          { name: 'dx, dy', type: 'number', description: 'Delta между последним и текущим mousemove.' },
          { name: 'totalDx, totalDy', type: 'number', description: 'Полное смещение от точки старта drag.' },
        ],
      },
    ],
    notes: [
      'Для перемещения node обычно используйте dx/dy.',
      'Для snap или ограничения drag удобнее totalDx/totalDy.',
    ],
    rawTs: `export interface NovaDragEventMeta {
  pointerId: number
  startX: number
  startY: number
  x: number
  y: number
  dx: number
  dy: number
  totalDx: number
  totalDy: number
}`,
  },
  'nova-surface': {
    id: 'nova-surface',
    kind: 'surface',
    title: 'NovaSurface',
    packageName: '@endge/nova',
    sourcePath: 'packages/@endge-nova/src/model/runtime/tree/NovaSurface.ts',
    summary: 'Logical render boundary: хранит node graph, retained frame, culling stats и composition order. Физическим canvas/backend владеет NovaApp.',
    signature: 'class NovaSurface<E extends EventList> extends NovaNode<E>',
    groups: [
      {
        id: 'creation',
        title: 'Создание',
        items: [
          { name: 'app.createSurface(name)', type: 'NovaSurface', description: 'Создает logical surface поверх app-level backend.' },
          { name: 'createNode(NodeClass)', type: 'NovaNode', description: 'Создает node, добавляет ее в surface graph и монтирует subtree.' },
        ],
      },
      {
        id: 'pipeline',
        title: 'Render policy',
        items: [
          { name: 'retained frame', type: 'NovaRenderFrame', description: 'Surface компилируется в retained frame и replay-ится через app-level backend.' },
          { name: 'frame dirty', type: 'NovaRenderCompileStats', description: 'Dirty-политика основана на retained graph и явных dirty reasons.' },
          { name: 'renderCullingMode', type: "'off' | 'bounds'", defaultValue: "'off'", description: 'Отсекает nodes вне bounds surface.' },
        ],
      },
      {
        id: 'stats',
        title: 'Stats',
        items: [
          { name: 'renderMetrics', type: 'NovaRenderMetrics', description: 'Commands, batches, timings, draw calls и upload counters последнего frame.' },
          { name: 'renderCompileStats', type: 'NovaRenderCompileStats', description: 'Сколько nodes rebuilt и cached.' },
          { name: 'renderCullingStats', type: 'NovaRenderCullingStats', description: 'Сколько nodes tested и culled.' },
        ],
      },
    ],
    rawTs: `export class NovaSurface<E extends EventList> extends NovaNode<E> {
  createNode<T extends NovaNode<E>>(NodeClassOrFactory?: ConstructorOrFactory<T>): T
  readonly renderMetrics: NovaRenderMetrics
  readonly renderCompileStats: NovaRenderCompileStats
  renderCullingMode: 'off' | 'bounds'
}`,
  },
  'nova-scene': {
    id: 'nova-scene',
    kind: 'scene',
    title: 'NovaScene',
    packageName: '@endge/nova',
    sourcePath: 'packages/@endge-nova/src/model/runtime/scene/NovaScene.ts',
    summary: 'Lifecycle container for root nodes: mount, pause, resume, unmount and destroy.',
    signature: 'class NovaScene<E extends EventList>',
    groups: [
      {
        id: 'lifecycle',
        title: 'Lifecycle',
        items: [
          { name: 'mount()', type: 'void', description: 'Переводит scene в mounted, вызывает onMount и монтирует roots.' },
          { name: 'pause()', type: 'void', description: 'Переводит mounted scene в paused и вызывает pause у roots.' },
          { name: 'resume()', type: 'void', description: 'Возвращает paused scene в mounted и invalidates app.' },
          { name: 'unmount()', type: 'void', description: 'Удаляет roots из graph и возвращает state в created.' },
          { name: 'destroy()', type: 'void', description: 'Финально уничтожает scene. Повторный mount запрещен.' },
        ],
      },
      {
        id: 'roots',
        title: 'Roots',
        items: [
          { name: 'addRoot(root)', type: 'NovaNode', description: 'Регистрирует root node, учитывая текущий lifecycle state.' },
          { name: 'removeRoot(root)', type: 'void', description: 'Удаляет root node и invalidates app.' },
          { name: 'rootCount', type: 'number', description: 'Количество root nodes внутри scene.' },
        ],
      },
    ],
    rawTs: `export class NovaScene<E extends EventList> {
  mount(): void
  pause(): void
  resume(): void
  unmount(): void
  destroy(): void
}`,
  },
  'nova-renderer': {
    id: 'nova-renderer',
    kind: 'renderer',
    title: 'NovaRenderContext',
    packageName: '@endge/nova',
    sourcePath: 'packages/@endge-nova/src/domain/types/renderer.types.ts',
    summary: 'Recorder/context API для node render phase. Backend instance не является public root API.',
    signature: 'interface NovaRenderContext',
    groups: [
      {
        id: 'schema',
        title: 'Schema methods',
        items: [
          { name: 'schema(schema)', type: 'void', description: 'Рисует schema в текущем порядке.' },
          { name: 'schemaBatched(schema)', type: 'void', description: 'Рисует schema с backend-specific batching.' },
          { name: 'schemaOrdered(schema)', type: 'void', description: 'Сохраняет визуальный порядок primitives.' },
        ],
      },
      {
        id: 'state',
        title: 'Drawing state',
        items: [
          { name: 'save() / restore()', type: 'void', description: 'Управляет graphics state.' },
          { name: 'clip(...) / clearClip()', type: 'void', description: 'Устанавливает и снимает clip region.' },
          { name: 'setTransform(matrix)', type: 'void', description: 'Применяет node matrix перед render.' },
        ],
      },
      {
        id: 'primitives',
        title: 'Primitives',
        items: [
          { name: 'rect / border / line', type: 'void', description: 'Базовая геометрия UI и timelines.' },
          { name: 'circle / polygon', type: 'void', description: 'Маркеры, зоны и схемы.' },
          { name: 'text / icon', type: 'void', description: 'Labels, markdown chunks и icon textures.' },
          { name: 'markState / restoreState', type: 'NovaRendererStateMark', description: 'Scoped boundary для clip/transform состояния компонента.' },
        ],
      },
    ],
    rawTs: `export interface NovaRenderer {
  schema(schema: NovaSchema): void
  schemaBatched(schema: NovaSchema): void
  schemaOrdered(schema: NovaSchema): void
  markState(): NovaRendererStateMark
  restoreState(mark: NovaRendererStateMark): void
  rect(params: NovaRect): void
  text(params: NovaText): void
}`,
  },
  'nova-spatial-index': {
    id: 'nova-spatial-index',
    kind: 'interface',
    title: 'NovaSpatialIndex',
    packageName: '@endge/nova',
    sourcePath: 'packages/@endge-nova/src/model/runtime/interaction/NovaSpatialIndex.ts',
    summary: 'Grid-based index for hit-test candidates in dense interactive scenes.',
    signature: 'class NovaSpatialIndex<E extends EventList>',
    groups: [
      {
        id: 'query',
        title: 'Query',
        items: [
          { name: 'rebuild(nodes)', type: 'void', description: 'Полностью пересобирает grid по interactive nodes.' },
          { name: 'update(node)', type: 'void', description: 'Обновляет node в cells по render bounds.' },
          { name: 'queryPoint(x, y)', type: 'NovaNode[]', description: 'Возвращает candidates из cell под pointer.' },
          { name: 'queryBounds(bounds)', type: 'NovaNode[]', description: 'Возвращает candidates по прямоугольнику.' },
        ],
      },
      {
        id: 'stats',
        title: 'Stats',
        items: [
          { name: 'cellCount', type: 'number', description: 'Количество занятых grid cells.' },
          { name: 'indexedNodeCount', type: 'number', description: 'Количество проиндексированных nodes.' },
        ],
      },
    ],
    rawTs: `export class NovaSpatialIndex<E extends EventList> {
  rebuild(nodes: Iterable<NovaNode<E>>): void
  update(node: NovaNode<E>): void
  queryPoint(x: number, y: number): Array<NovaNode<E>>
}`,
  },
  'nova-ui-kit-lazy-resizer': {
    id: 'nova-ui-kit-lazy-resizer',
    kind: 'ui-kit',
    title: 'LazyResizer',
    packageName: '@endge/nova-ui-kit',
    sourcePath: 'packages/@endge-nova-ui-kit/src/components/LazyResizer/LazyResizer.ts',
    summary: 'Reusable Nova node for panel resizing with wider hit bounds than visual line.',
    signature: 'class LazyResizer<E extends EventList> extends NovaNode<E>',
    groups: [
      {
        id: 'options',
        title: 'Options',
        items: [
          { name: 'direction', type: "'top' | 'right' | 'bottom' | 'left'", required: true, description: 'Сторона, по которой работает resize.' },
          { name: 'minSize / maxSize', type: 'number', required: true, description: 'Ограничения размера при drag.' },
          { name: 'lineWidth', type: 'number', defaultValue: '1', description: 'Визуальная толщина line.' },
          { name: 'lineWidthHover', type: 'number', defaultValue: '10', description: 'Толщина hit zone.' },
          { name: 'activeOverlayColor', type: 'string', description: 'Цвет overlay во время drag.' },
        ],
      },
      {
        id: 'callbacks',
        title: 'Callbacks',
        items: [
          { name: 'onChangeStart', type: '(event) => void', description: 'Точка подключения внешней модели перед resize.' },
          { name: 'onChangeMove', type: '(event, delta) => void', description: 'Синхронизация во время drag.' },
          { name: 'onChangeEnd', type: '(event, size) => void', description: 'Финальный размер после drag.' },
        ],
      },
    ],
    rawTs: `export interface LazyResizerOptions extends NovaNodeProperties {
  direction: Side
  minSize: number
  maxSize: number
  color?: string
  lineWidth?: number
  lineWidthHover?: number
}`,
  },
  'nova-motion-engine': {
    id: 'nova-motion-engine',
    kind: 'interface',
    title: 'NovaMotionEngine',
    packageName: '@endge/nova',
    sourcePath: 'packages/@endge-nova/src/model/motion/NovaMotionEngine.ts',
    summary: 'Runtime motion engine для tween, timeline, sequence, stagger и component transitions.',
    signature: 'class NovaMotionEngine',
    groups: [
      {
        id: 'engine',
        title: 'Engine',
        items: [
          { name: 'to(target, patch, options)', type: 'NovaMotionPlayback', description: 'Создает tween для node или component props.' },
          { name: 'timeline(options)', type: 'NovaMotionPlayback', description: 'Компилирует tracks/sequence/stagger в segments.' },
          { name: 'preset(target, name, options)', type: 'NovaMotionPlayback', description: 'Запускает именованный одиночный preset из общего каталога.' },
          { name: 'pattern(targets, name, options)', type: 'NovaMotionPlayback', description: 'Запускает групповой pattern для массива targets.' },
          { name: 'cancel(target?)', type: 'void', description: 'Отменяет все playback или только связанные с target.' },
          { name: 'pauseAll()', type: 'void', description: 'Ставит активные playback на паузу.' },
          { name: 'resumeAll()', type: 'void', description: 'Возобновляет paused playback.' },
        ],
      },
      {
        id: 'tween-options',
        title: 'Tween options',
        items: [
          { name: 'duration', type: 'number', defaultValue: '300', description: 'Длительность segment в ms.' },
          { name: 'delay', type: 'number', defaultValue: '0', description: 'Смещение старта tween.' },
          { name: 'easing', type: 'NovaMotionEasingName | function', defaultValue: 'linear', description: 'Функция прогресса.' },
          { name: 'repeat', type: 'number | Infinity', defaultValue: '0', description: 'Количество повторов после первого прохода.' },
          { name: 'yoyo', type: 'boolean', defaultValue: 'false', description: 'Разворачивает каждый второй цикл.' },
          { name: 'overwrite', type: 'boolean', defaultValue: 'true', description: 'Отменяет активные segments того же target + key.' },
        ],
      },
      {
        id: 'timeline',
        title: 'Timeline',
        items: [
          { name: 'tracks', type: 'NovaMotionTrack[]', description: 'Набор target/keyframes tracks.' },
          { name: 'keyframes', type: 'NovaMotionKeyframe[]', description: 'Patch-состояния с опциональным at.' },
          { name: 'sequence', type: 'NovaMotionSequenceItem[]', description: 'Последовательные tweens с накопленным at.' },
          { name: 'stagger', type: 'NovaMotionStaggerOptions', description: 'targets + patch + each offset.' },
        ],
      },
      {
        id: 'presets',
        title: 'Presets',
        items: [
          { name: 'NOVA_MOTION_PRESETS', type: 'Record<NovaMotionPresetName, NovaMotionPresetMeta>', description: 'Каталог одиночных анимаций с русскими описаниями.' },
          { name: 'NovaMotionPresetName', type: 'string union', description: 'Имена fade, slide, scale, rotate, attention, gesture и visual presets.' },
          { name: 'NovaMotionPresetOptions', type: 'NovaMotionOptions', description: 'Опции preset с distance, fill, stroke и strokeWidth для visual targets.' },
        ],
      },
      {
        id: 'patterns',
        title: 'Patterns',
        items: [
          { name: 'NOVA_MOTION_PATTERNS', type: 'Record<NovaMotionPatternName, NovaMotionPatternMeta>', description: 'Каталог групповых stagger, timeline, sequence и repeat patterns.' },
          { name: 'NovaMotionPatternName', type: 'string union', description: 'Имена групповых patterns для массивов targets.' },
          { name: 'NovaMotionPatternOptions', type: 'NovaMotionOptions', description: 'Опции pattern с each, distance и columns.' },
        ],
      },
      {
        id: 'playback',
        title: 'Playback',
        items: [
          { name: 'play()', type: 'void', description: 'Запускает playback.' },
          { name: 'pause()', type: 'void', description: 'Ставит playback на паузу.' },
          { name: 'resume()', type: 'void', description: 'Продолжает playback.' },
          { name: 'cancel()', type: 'void', description: 'Отменяет playback и освобождает loop lease при необходимости.' },
          { name: 'seek(time)', type: 'void', description: 'Сдвигает локальное время playback.' },
          { name: 'state', type: 'NovaMotionPlaybackState', description: 'idle/running/paused/finished/cancelled.' },
        ],
      },
    ],
    rawTs: `app.motion.to(node, { x: 240, opacity: 0.8 }, { duration: 180, easing: 'outCubic' })
app.motion.timeline({ tracks, repeat: Infinity, yoyo: true })
app.motion.preset(tile, 'fadeUp')
app.motion.pattern(cells, 'gridWave', { columns: 12 })`,
  },
  'nova-sound-engine': {
    id: 'nova-sound-engine',
    kind: 'interface',
    title: 'NovaSoundEngine',
    packageName: '@endge/nova',
    sourcePath: 'packages/@endge-nova/src/model/sound/NovaSoundEngine.ts',
    summary: 'App-level сервис для загрузки, кеширования и воспроизведения коротких UI/game sounds.',
    signature: 'class NovaSoundEngine',
    groups: [
      {
        id: 'lifecycle',
        title: 'Lifecycle',
        items: [
          { name: 'load(descriptor | descriptor[])', type: 'Promise<void>', description: 'Нормализует descriptors, выбирает source format и кеширует decoded resource по id.' },
          { name: 'preload(...)', type: 'Promise<void>', description: 'Алиас для фоновой загрузки sounds до первого interaction.' },
          { name: 'unlock()', type: 'Promise<void>', description: 'Разблокирует Web Audio context после пользовательского жеста.' },
          { name: 'destroy()', type: 'void', description: 'Останавливает handles, очищает кеши и освобождает backend resources.' },
        ],
      },
      {
        id: 'playback',
        title: 'Playback',
        items: [
          { name: 'play(id, options)', type: 'NovaSoundHandle', description: 'Запускает one-shot или loop playback и возвращает управляемый handle.' },
          { name: 'stop(handle | id?)', type: 'void', description: 'Останавливает конкретный handle, все handles asset id или весь активный playback.' },
          { name: 'scope(name)', type: 'NovaSoundScope', description: 'Создает lifecycle-bound scope для scene/component sounds.' },
          { name: 'stats()', type: 'NovaSoundStats', description: 'Возвращает loaded/active/played/skipped/decoded и текущие mute/volume flags.' },
        ],
      },
      {
        id: 'mix',
        title: 'Mix',
        items: [
          { name: 'setMuted(muted)', type: 'void', description: 'Переключает master mute без изменения renderer state.' },
          { name: 'setVolume(volume)', type: 'void', description: 'Меняет master volume в диапазоне 0..1.' },
          { name: 'setCategoryVolume(category, volume)', type: 'void', description: 'Меняет GainNode категории: ui, fx, ambient или custom category.' },
        ],
      },
    ],
    rawTs: `app.sound.load({ id: 'ui.click', src: ['click.ogg', 'click.mp3'] })
app.sound.play('ui.click', { dedupeKey: 'toolbar-click', cooldownMs: 80 })
const scope = app.sound.scope('scene')
scope.play('ambient.loop', { loop: true })`,
  },
  'nova-sound-descriptor': {
    id: 'nova-sound-descriptor',
    kind: 'interface',
    title: 'NovaSoundDescriptor',
    packageName: '@endge/nova',
    sourcePath: 'packages/@endge-nova/src/domain/types/sound.types.ts',
    summary: 'Описание sound asset: id, source fallback, category, volume и ограничения playback.',
    signature: 'interface NovaSoundDescriptor',
    groups: [
      {
        id: 'asset',
        title: 'Asset',
        items: [
          { name: 'id', type: 'string', required: true, description: 'Публичный ключ asset для app.sound.play(id).' },
          { name: 'src', type: 'string | string[]', required: true, description: 'URL, data URI, nova-tone source или список format fallback.' },
          { name: 'category', type: 'string', defaultValue: "'default'", description: 'Mixer category для отдельной громкости.' },
          { name: 'preload', type: 'boolean', defaultValue: 'false', description: 'Маркер намерения фоновой загрузки descriptor.' },
        ],
      },
      {
        id: 'defaults',
        title: 'Playback defaults',
        items: [
          { name: 'volume', type: 'number', defaultValue: '1', description: 'Базовая громкость asset.' },
          { name: 'loop', type: 'boolean', defaultValue: 'false', description: 'Default loop flag для play().' },
          { name: 'cooldownMs', type: 'number', defaultValue: '0', description: 'Минимальный интервал между playback одного dedupe key.' },
          { name: 'maxInstances', type: 'number', description: 'Лимит одновременных instances одного asset.' },
          { name: 'priority', type: 'number', defaultValue: '0', description: 'Приоритет при вытеснении из voice pool.' },
        ],
      },
    ],
    rawTs: `interface NovaSoundDescriptor {
  id: string
  src: string | string[]
  category?: string
  volume?: number
  loop?: boolean
  cooldownMs?: number
  maxInstances?: number
  priority?: number
}`,
  },
  'nova-sound-play-options': {
    id: 'nova-sound-play-options',
    kind: 'interface',
    title: 'NovaSoundPlayOptions',
    packageName: '@endge/nova',
    sourcePath: 'packages/@endge-nova/src/domain/types/sound.types.ts',
    summary: 'Runtime overrides одного playback: mix, rate, pan, loop, dedupe и limits.',
    signature: 'interface NovaSoundPlayOptions',
    groups: [
      {
        id: 'mix',
        title: 'Mix',
        items: [
          { name: 'volume', type: 'number', description: 'Громкость конкретного playback.' },
          { name: 'category', type: 'string', description: 'Переопределяет descriptor category.' },
          { name: 'pan', type: 'number', description: 'Stereo pan от -1 до 1, если backend поддерживает StereoPannerNode.' },
        ],
      },
      {
        id: 'behavior',
        title: 'Behavior',
        items: [
          { name: 'rate', type: 'number', defaultValue: '1', description: 'Playback rate/pitch для коротких feedback sounds.' },
          { name: 'loop', type: 'boolean', description: 'Запускает loop playback, который нужно остановить handle/scope lifecycle.' },
          { name: 'dedupeKey', type: 'string', description: 'Останавливает предыдущий active playback того же key.' },
          { name: 'cooldownMs', type: 'number', description: 'Локальный cooldown для rapid hover/click.' },
          { name: 'priority', type: 'number', description: 'Приоритет вытеснения из maxVoices pool.' },
        ],
      },
    ],
    rawTs: `interface NovaSoundPlayOptions {
  volume?: number
  rate?: number
  pan?: number
  loop?: boolean
  dedupeKey?: string
  cooldownMs?: number
  category?: string
  priority?: number
}`,
  },
}
