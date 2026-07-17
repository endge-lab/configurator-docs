import {
  Nova,
  NovaNode,
  RaphSchedulerType,
  RendererType,
  type NovaApp,
  type NovaSchema,
  type NovaSoundDescriptor,
  type NovaSurface,
} from '@endge/nova'
import type { DocsExampleScenario } from '../nova-types'

type ScenarioRuntime = {
  resize: (width: number, height: number) => void
  destroy: () => void
}

type ScenarioEvents = Record<string, Event>

interface ScenarioTheme {
  background: string
  panel: string
  panelAlt: string
  text: string
  muted: string
  accent: string
  accent2: string
  accent3: string
  stroke: string
}

const SCENARIO_TITLES: Partial<Record<DocsExampleScenario, string>> = {
  'dispatch-dashboard': 'Flight operations',
  'radar-widget': 'Weather radar',
  'cockpit-panel': 'Cockpit telemetry',
  'airport-layers': 'Airport layers',
  'schema-primitives': 'Schema palette',
  'text-icons-texture': 'Ops card',
  'node-editor': 'Node editor',
  'scene-switcher': 'Scene switcher',
  'seat-map': 'Interactive seating',
  'command-palette': 'Command palette',
  'dense-hit-map': 'Dense hit map',
  'render-pipeline': 'Render pipeline',
  'dirty-culling': 'Dirty timeline',
  'hybrid-webgl': 'Hybrid renderer',
  'metrics-dashboard': 'Runtime metrics',
  'resizable-workspace': 'Resizable workspace',
  'contracts-reference': 'Contracts rail',
  'cookbook-gallery': 'Cookbook recipes',
  'styles-engine-lab': 'Styles engine lab',
  'sfc-compiler': 'Nova SFC compiler',
  'sound-mixer': 'Sound mixer',
  'cursor-studio': 'Cursor studio',
  'renderer-policy': 'Renderer policy',
  'input-diagnostics': 'Input diagnostics',
  'motion-presets': 'Motion presets',
  'motion-patterns': 'Motion patterns',
  'prime-components': 'Advanced UI primitives',
}

const SCENARIO_CAPTIONS: Partial<Record<DocsExampleScenario, string>> = {
  'dispatch-dashboard': 'surface lanes, badges and retained row updates',
  'radar-widget': 'animated sweep, signal markers and hover coordinates',
  'cockpit-panel': 'responsive cards, gauges and scheduler pulse',
  'airport-layers': 'logical surfaces: map, routes and UI overlay',
  'schema-primitives': 'rect, text, line, circle, polygon and dashed borders',
  'text-icons-texture': 'markdown text, icon tiles and texture-like bars',
  'node-editor': 'nested nodes, z-index and transform order',
  'scene-switcher': 'mount, pause, resume and destroy state transitions',
  'seat-map': 'hover, select and pointer-driven hit feedback',
  'command-palette': 'focused command state and keyboard scope mental model',
  'dense-hit-map': 'spatial candidates around a moving pointer',
  'render-pipeline': 'compile, frame and replay phases with moving command tokens',
  'dirty-culling': 'dirty spans, retained replay and culled ranges',
  'hybrid-webgl': 'WebGL-safe primitives with logical overlay',
  'metrics-dashboard': 'live frame counters and telemetry strips',
  'resizable-workspace': 'drag the splitter to resize panel geometry',
  'contracts-reference': 'contract tabs and active field rail',
  'cookbook-gallery': 'production canvas recipes with distinct layout patterns',
  'styles-engine-lab': 'selector specificity, pseudo rules and token overrides',
  'sfc-compiler': 'compiled .nova template, scoped .novacss and keyed patch stats',
  'sound-mixer': 'click pads to trigger tone descriptors and sound stats',
  'cursor-studio': 'hover, press and drag cursor declarations',
  'renderer-policy': 'clip stack, equal z-order and backend policy checks',
  'input-diagnostics': 'capture, bubble, selection and drag meta',
  'motion-presets': 'motion preview uses dedicated runtime',
  'motion-patterns': 'motion preview uses dedicated runtime',
  'prime-components': 'PrimeVue-inspired controls, overlays and media components',
}

const THEMES: Partial<Record<DocsExampleScenario, ScenarioTheme>> = {
  'dispatch-dashboard': makeTheme('#071a2f', '#0d2745', '#12375d', '#e8f5ff', '#9bbbd4', '#4fd1c5', '#f59e0b', '#fb7185', '#275274'),
  'radar-widget': makeTheme('#061814', '#08231e', '#0e332c', '#eafff7', '#8ecfbd', '#22c55e', '#e0fb6a', '#fb7185', '#1f6b58'),
  'cockpit-panel': makeTheme('#211507', '#34220c', '#4a3213', '#fff7df', '#e4bf7c', '#fbbf24', '#38bdf8', '#f97316', '#7a5319'),
  'airport-layers': makeTheme('#eef7ff', '#ffffff', '#dff0ff', '#13243a', '#5f738a', '#2563eb', '#16a34a', '#f97316', '#b9d4ef'),
  'schema-primitives': makeTheme('#f8f1e8', '#fffdf7', '#f1eadf', '#16201f', '#68756f', '#0f766e', '#db2777', '#f59e0b', '#d8cabb'),
  'text-icons-texture': makeTheme('#1a1024', '#281638', '#371c4c', '#fff7fb', '#d2a8bf', '#ff4d8d', '#2dd4bf', '#facc15', '#5b2b74'),
  'node-editor': makeTheme('#101522', '#151d2e', '#1e2b43', '#eef8ff', '#9db0c9', '#67e8f9', '#f97316', '#a78bfa', '#334764'),
  'scene-switcher': makeTheme('#10141f', '#171d2b', '#21283a', '#f5f7fb', '#aab3c4', '#a3e635', '#38bdf8', '#fb7185', '#39445d'),
  'seat-map': makeTheme('#081b2a', '#0d2a42', '#123956', '#e6f7ff', '#95b8cc', '#38bdf8', '#22c55e', '#f43f5e', '#1f5f85'),
  'command-palette': makeTheme('#15121d', '#21192d', '#2d223d', '#fff8ff', '#bdaecc', '#c084fc', '#22d3ee', '#f472b6', '#4a3861'),
  'dense-hit-map': makeTheme('#09131f', '#101f31', '#142b42', '#e8f4ff', '#9cb3c8', '#60a5fa', '#facc15', '#22c55e', '#2e4c69'),
  'render-pipeline': makeTheme('#111827', '#172033', '#202b42', '#f8fafc', '#a8b3c7', '#818cf8', '#22d3ee', '#f59e0b', '#35415a'),
  'dirty-culling': makeTheme('#21170b', '#302315', '#42301a', '#fff8ed', '#d7b98e', '#f59e0b', '#22c55e', '#ef4444', '#6d4a1e'),
  'hybrid-webgl': makeTheme('#090b12', '#111827', '#1f2937', '#f8fafc', '#a3adbd', '#22d3ee', '#a3e635', '#f97316', '#334155'),
  'metrics-dashboard': makeTheme('#071426', '#0d2239', '#12314f', '#eaf6ff', '#9db9d0', '#14b8a6', '#facc15', '#fb7185', '#25547c'),
  'resizable-workspace': makeTheme('#f6f8fb', '#ffffff', '#edf2f7', '#172033', '#64748b', '#2563eb', '#f97316', '#0f766e', '#d7e0ea'),
  'contracts-reference': makeTheme('#0d1220', '#151d2e', '#1e293b', '#f8fafc', '#aab5c8', '#a78bfa', '#38bdf8', '#fbbf24', '#3a4560'),
  'cookbook-gallery': makeTheme('#fff8f1', '#ffffff', '#f0ebe4', '#221a14', '#7a6756', '#e11d48', '#0891b2', '#f59e0b', '#ddcfc0'),
  'styles-engine-lab': makeTheme('#f8fafc', '#ffffff', '#eef2ff', '#0f172a', '#64748b', '#2563eb', '#16a34a', '#9333ea', '#dbe4ef'),
  'sfc-compiler': makeTheme('#101827', '#172033', '#223049', '#f8fafc', '#a7b3c7', '#a3e635', '#38bdf8', '#f97316', '#3b4b68'),
  'sound-mixer': makeTheme('#15130f', '#241f18', '#33291e', '#fff7ed', '#d7bca2', '#f97316', '#22d3ee', '#f43f5e', '#5b4732'),
  'cursor-studio': makeTheme('#f3fbf7', '#ffffff', '#e8f7ef', '#10251e', '#5b766d', '#059669', '#7c3aed', '#f59e0b', '#c5e5d6'),
  'renderer-policy': makeTheme('#f8fafc', '#ffffff', '#eef2f7', '#111827', '#64748b', '#2563eb', '#7c3aed', '#f97316', '#cbd5e1'),
  'input-diagnostics': makeTheme('#0f172a', '#182338', '#223451', '#f8fafc', '#a7b5cb', '#3b82f6', '#f97316', '#a855f7', '#405674'),
  'motion-presets': makeTheme('#fbf7ff', '#ffffff', '#f0e8ff', '#34174f', '#816a98', '#7c3aed', '#24b47e', '#f59e0b', '#dccbf2'),
  'motion-patterns': makeTheme('#fbf7ff', '#ffffff', '#f0e8ff', '#34174f', '#816a98', '#7c3aed', '#24b47e', '#f59e0b', '#dccbf2'),
  'prime-components': makeTheme('#f8fafc', '#ffffff', '#eef2f7', '#111827', '#64748b', '#2563eb', '#0f766e', '#f59e0b', '#cbd5e1'),
}

const SOUND_DESCRIPTORS: Array<NovaSoundDescriptor> = [
  { id: 'docs.pad.low', src: 'nova-tone://low?frequency=140&duration=0.13&type=sine', category: 'drums', volume: 0.36, cooldownMs: 90 },
  { id: 'docs.pad.mid', src: 'nova-tone://mid?frequency=420&duration=0.09&type=square', category: 'ui', volume: 0.32, cooldownMs: 80 },
  { id: 'docs.pad.high', src: 'nova-tone://high?frequency=820&duration=0.07&type=sine', category: 'fx', volume: 0.28, cooldownMs: 60 },
]

/**
 * Описывает Nova-node DocsScenarioNode и его runtime-поведение.
 */
class DocsScenarioNode extends NovaNode<ScenarioEvents> {
  private time = 0
  private activeIndex = 0
  private pointerX = 0
  private pointerY = 0
  private pointerInside = false
  private dragging = false
  private dragX = 0
  private dragY = 0
  private lastAction = 'ready'

  /**
   * Создает экземпляр DocsScenarioNode и подготавливает базовое состояние.
   */
  constructor(
    app: NovaApp<ScenarioEvents>,
    surface: NovaSurface<ScenarioEvents>,
    private readonly scenario: DocsExampleScenario,
  ) {
    super(app, surface)
    this.options({
      x: 0,
      y: 0,
      width: app.width,
      height: app.height,
      interactive: true,
      cursor: {
        hover: scenario === 'cursor-studio' ? 'grab' : 'pointer',
        pressed: scenario === 'cursor-studio' ? 'grabbing' : 'crosshair',
        dragging: 'grabbing',
      },
    })

    this.on('mousemove', event => this.setPointer(event))
    this.on('mouseenter', event => {
      this.pointerInside = true
      this.setPointer(event)
    })
    this.on('mouseleave', () => {
      this.pointerInside = false
      this.dragging = false
      this.dirty({ render: true })
    })
    this.on('mousedown', event => {
      this.capturePointer(event)
      this.focus(event, 'docs')
      this.dragging = true
      this.lastAction = 'capture'
      this.dirty({ render: true })
    })
    this.on('dragmove', (_event, _dx, _dy, meta) => {
      this.dragX = meta.totalDx
      this.dragY = meta.totalDy
      this.lastAction = `drag ${Math.round(meta.totalDx)}:${Math.round(meta.totalDy)}`
      this.dirty({ render: true })
    })
    this.on('dragend', () => {
      this.dragging = false
      this.lastAction = 'dragend'
      this.dirty({ render: true })
    })
    this.on('click', () => this.activate())
    this.on('keydown', event => {
      this.activeIndex = (this.activeIndex + 1) % 8
      this.lastAction = `key ${event.key}`
      this.dirty({ render: true })
    })
  }

  /**
   * Обновляет значение состояния DocsScenarioNode.
   */
  setTime(value: number): void {
    this.time = value
    this.dirty({ render: true })
  }

  /**
   * Выполняет внутренний шаг activate для DocsScenarioNode.
   */
  private activate(): void {
    this.activeIndex = (this.activeIndex + 1) % 8
    this.lastAction = `click ${this.activeIndex}`

    if (this.scenario === 'sound-mixer') {
      const id = SOUND_DESCRIPTORS[this.activeIndex % SOUND_DESCRIPTORS.length]!.id
      const handle = this.nova.sound.play(id, { dedupeKey: `docs-${id}`, cooldownMs: 80 })
      this.lastAction = handle.state === 'playing' ? `play ${id.replace('docs.pad.', '')}` : 'sound skipped'
    }

    this.dirty({ render: true })
  }

  /**
   * Обновляет значение состояния DocsScenarioNode.
   */
  private setPointer(event: MouseEvent): void {
    this.pointerX = event.offsetX
    this.pointerY = event.offsetY
    this.pointerInside = true
    this.dirty({ render: true })
  }

  /**
   * Выполняет отрисовку DocsScenarioNode.
   */
  render(): void {
    const width = this.nova.width
    const height = this.nova.height
    const theme = THEMES[this.scenario] ?? THEMES['dispatch-dashboard']!
    const schema: NovaSchema = []
    const pulse = (Math.sin(this.time / 420) + 1) / 2

    addShell(
      schema,
      width,
      height,
      theme,
      SCENARIO_TITLES[this.scenario] ?? 'Nova scenario',
      SCENARIO_CAPTIONS[this.scenario] ?? 'canvas runtime preview',
    )

    switch (this.scenario) {
      case 'radar-widget':
        addRadar(schema, width, height, theme, this.time, this.pointerX, this.pointerY, this.pointerInside)
        break
      case 'cockpit-panel':
        addCockpit(schema, width, height, theme, pulse)
        break
      case 'airport-layers':
        addAirport(schema, width, height, theme, false, pulse)
        break
      case 'schema-primitives':
        addPrimitiveGallery(schema, width, height, theme, pulse)
        break
      case 'text-icons-texture':
        addTextTexture(schema, width, height, theme, pulse)
        break
      case 'node-editor':
        addNodeEditor(schema, width, height, theme, this.activeIndex, pulse)
        break
      case 'scene-switcher':
        addSceneSwitcher(schema, width, height, theme, this.activeIndex)
        break
      case 'seat-map':
        addSeatMap(schema, width, height, theme, this.pointerX, this.pointerY, this.activeIndex)
        break
      case 'command-palette':
        addCommandPalette(schema, width, height, theme, this.activeIndex, this.lastAction)
        break
      case 'dense-hit-map':
        addDenseHitMap(schema, width, height, theme, this.pointerX, this.pointerY, this.pointerInside, this.time)
        break
      case 'render-pipeline':
        addPipeline(schema, width, height, theme, this.time)
        break
      case 'dirty-culling':
        addDirtyTimeline(schema, width, height, theme, this.time)
        break
      case 'hybrid-webgl':
        addAirport(schema, width, height, theme, true, pulse)
        break
      case 'metrics-dashboard':
        addMetrics(schema, width, height, theme, this.time)
        break
      case 'resizable-workspace':
        addWorkspace(schema, width, height, theme, this.dragging, this.dragX)
        break
      case 'contracts-reference':
        addContracts(schema, width, height, theme, this.activeIndex)
        break
      case 'cookbook-gallery':
        addCookbook(schema, width, height, theme, this.activeIndex)
        break
      case 'styles-engine-lab':
        addStylesLab(schema, width, height, theme, this.activeIndex, pulse)
        break
      case 'sfc-compiler':
        addSfcCompiler(schema, width, height, theme, this.activeIndex, pulse)
        break
      case 'sound-mixer':
        addSoundMixer(schema, width, height, theme, this.activeIndex, this.lastAction, this.nova.sound.stats())
        break
      case 'cursor-studio':
        addCursorStudio(schema, width, height, theme, this.pointerX, this.pointerY, this.pointerInside, this.dragging)
        break
      case 'renderer-policy':
        addRendererPolicy(schema, width, height, theme, this.activeIndex)
        break
      case 'input-diagnostics':
        addInputDiagnostics(schema, width, height, theme, this.lastAction, this.dragX, this.dragY)
        break
      case 'prime-components':
        addPrimeComponents(schema, width, height, theme, this.activeIndex, pulse)
        break
      case 'dispatch-dashboard':
      default:
        addDispatch(schema, width, height, theme, this.activeIndex, pulse)
        break
    }

    this.renderSchemaOrdered(schema)
  }
}

function addDispatch(schema: NovaSchema, width: number, height: number, theme: ScenarioTheme, activeIndex: number, pulse: number): void {
  const lanes = ['SVO 214', 'LED 118', 'AER 442', 'KZN 090']
  lanes.forEach((label, index) => {
    const y = 74 + index * Math.max(36, (height - 136) / 4)
    const active = activeIndex % lanes.length === index
    schema.push(panel(34, y, width - 68, 34, active ? theme.panelAlt : theme.panel, theme))
    schema.push(text(label, 48, y + 7, 86, 18, theme.text, 12, '800'))
    schema.push(line(144, y + 17, width - 92, y + 17, active ? theme.accent : theme.stroke, active ? 3 : 2))
    schema.push(circle(width - 70 - index * 28, y + 17, 7 + (active ? pulse * 5 : 0), index === 2 ? theme.accent3 : theme.accent2, theme.stroke))
  })
  schema.push(text('click rows to advance retained state', 40, height - 44, width - 80, 18, theme.muted, 11, '700', 'center'))
}

function addPrimeComponents(schema: NovaSchema, width: number, height: number, theme: ScenarioTheme, activeIndex: number, pulse: number): void {
  const cardW = Math.max(150, (width - 88) / 3)
  const startY = 74
  const labels = ['SpeedDial / Dock', 'Media / Progress', 'Controls / Overlay']

  labels.forEach((label, index) => {
    const x = 32 + index * (cardW + 12)
    schema.push(panel(x, startY, cardW, height - 112, index === activeIndex % 3 ? theme.panelAlt : theme.panel, theme))
    schema.push(text(label, x + 14, startY + 14, cardW - 28, 18, theme.text, 12, '800'))
  })

  const sx = 52
  const sy = startY + 58
  ;[0, 1, 2, 3].forEach(index => {
    const angle = -Math.PI + index * 0.55
    schema.push(circle(sx + 70 + Math.cos(angle) * 52, sy + 78 + Math.sin(angle) * 52, 14 + (index === activeIndex % 4 ? pulse * 5 : 0), [theme.accent, theme.accent2, theme.accent3, '#7c3aed'][index]!, '#ffffff', 2))
  })
  schema.push(circle(sx + 70, sy + 78, 20, theme.accent, '#ffffff', 2))
  ;[0, 1, 2, 3].forEach(index => {
    schema.push(panel(sx + 126 + index * 34, sy + 104 - (index === activeIndex % 4 ? 8 : 0), 28, 28, '#ffffff', theme))
  })

  const mx = 52 + cardW + 12
  schema.push(panel(mx + 16, sy, cardW - 32, 68, theme.accent, theme))
  schema.push(text('Galleria', mx + 30, sy + 22, cardW - 60, 18, '#ffffff', 13, '800', 'center'))
  schema.push(panel(mx + 16, sy + 84, cardW - 32, 14, '#dbe4ef', theme))
  schema.push({
    type: 'rect',
    x: mx + 18,
    y: sy + 86,
    width: (cardW - 36) * (0.58 + pulse * 0.18),
    height: 10,
    styles: { background: theme.accent2 },
  })
  ;[0, 1, 2].forEach(index => {
    schema.push(circle(mx + 34 + index * 28, sy + 124, 8, [theme.accent, theme.accent2, theme.accent3][index]!, '#ffffff', 1))
  })

  const ox = 52 + (cardW + 12) * 2
  schema.push(panel(ox + 18, sy, cardW - 36, 64, '#ffffff', theme))
  schema.push(text('Dialog', ox + 34, sy + 14, cardW - 68, 18, theme.text, 13, '800'))
  schema.push(text('mask / slide / scale', ox + 34, sy + 36, cardW - 68, 16, theme.muted, 10, '700'))
  schema.push(panel(ox + 18, sy + 82, cardW - 36, 32, '#e2e8f0', theme))
  schema.push({
    type: 'rect',
    x: ox + 22 + (cardW - 48) * (activeIndex % 3) / 3,
    y: sy + 86,
    width: (cardW - 48) / 3,
    height: 24,
    styles: { background: '#ffffff' },
  })
  schema.push(circle(ox + 36, sy + 134, 10, activeIndex % 2 === 0 ? theme.accent : '#cbd5e1', '#ffffff', 2))
  schema.push(text('Tabs Stepper Toggle', ox + 54, sy + 124, cardW - 76, 18, theme.text, 11, '700'))
}

function addRadar(schema: NovaSchema, width: number, height: number, theme: ScenarioTheme, time: number, pointerX: number, pointerY: number, inside: boolean): void {
  const cx = width / 2
  const cy = height / 2 + 22
  const angle = (time / 850) % (Math.PI * 2)
  for (let index = 0; index < 4; index += 1) {
    schema.push(circle(cx, cy, 32 + index * 30, 'transparent', theme.stroke, 1))
  }
  schema.push(line(cx, cy, cx + Math.cos(angle) * 130, cy + Math.sin(angle) * 130, theme.accent, 4))
  ;[[cx - 82, cy - 28], [cx + 48, cy + 36], [cx + 86, cy - 70], [cx - 28, cy + 78]].forEach(([x, y], index) => {
    schema.push(circle(x, y, 7 + (index % 2), index === 2 ? theme.accent3 : theme.accent2, theme.background, 2))
  })
  if (inside) {
    schema.push(circle(pointerX, pointerY, 12, 'transparent', theme.accent3, 2))
    schema.push(text(`${Math.round(pointerX)}, ${Math.round(pointerY)}`, 32, height - 45, 180, 18, theme.accent2, 11, '800'))
  }
}

function addCockpit(schema: NovaSchema, width: number, height: number, theme: ScenarioTheme, pulse: number): void {
  ;[['FPS', '60'], ['DPR', '2.0'], ['LOOP', 'lease']].forEach(([label, value], index) => {
    const x = 36 + index * ((width - 72) / 3)
    schema.push(panel(x, 80, (width - 96) / 3, 92, theme.panelAlt, theme))
    schema.push(text(label, x + 16, 94, 80, 18, theme.muted, 11, '700'))
    schema.push(text(value, x + 16, 124, 110, 28, index === 0 ? theme.accent2 : theme.text, 23, '800'))
  })
  const y = height - 62
  schema.push(line(44, y, width - 44, y, theme.stroke, 2, [8, 8]))
  schema.push(circle(66 + (width - 132) * pulse, y, 8, theme.accent, theme.background, 2))
}

function addAirport(schema: NovaSchema, width: number, height: number, theme: ScenarioTheme, hybrid: boolean, pulse: number): void {
  const runwayY = height / 2 + 32
  schema.push({
    type: 'polygon',
    points: [{ x: 46, y: runwayY - 22 }, { x: width - 58, y: runwayY - 54 }, { x: width - 48, y: runwayY - 16 }, { x: 58, y: runwayY + 16 }],
    styles: { background: hybrid ? '#1f2937' : theme.panelAlt, stroke: theme.stroke, lineWidth: 2 },
  })
  for (let index = 0; index < 8; index += 1) {
    const x = 84 + index * ((width - 168) / 7)
    schema.push(line(x, runwayY - 24, x + 22, runwayY - 26, hybrid ? '#e2e8f0' : theme.text, 2))
  }
  ;['map', hybrid ? 'WebGL' : 'routes', 'overlay'].forEach((label, index) => {
    schema.push(panel(38 + index * 118, 76, 92, 30, index === 1 ? theme.accent : theme.panel, theme))
    schema.push(text(label, 50 + index * 118, 84, 72, 12, index === 1 ? '#ffffff' : theme.text, 10, '800'))
  })
  schema.push(circle(width - 88, runwayY - 78, 7 + pulse * 5, theme.accent3, theme.stroke, 1))
}

function addPrimitiveGallery(schema: NovaSchema, width: number, height: number, theme: ScenarioTheme, pulse: number): void {
  schema.push(panel(40, 80, 118, 72, theme.accent, theme))
  schema.push(circle(220, 116, 30 + pulse * 8, theme.accent2, '#bbf7d0', 2))
  schema.push({
    type: 'polygon',
    points: [{ x: width - 150, y: 82 }, { x: width - 72, y: 120 }, { x: width - 150, y: 154 }],
    styles: { background: theme.accent3, stroke: '#fff4b8', lineWidth: 2 },
  })
  schema.push(line(58, height - 72, width - 58, height - 72, theme.accent, 4, [12, 8]))
  schema.push(text('active / clip / meta travel with every schema item', 54, height - 50, width - 108, 18, theme.muted, 11, '700', 'center'))
}

function addTextTexture(schema: NovaSchema, width: number, height: number, theme: ScenarioTheme, pulse: number): void {
  schema.push(panel(46, 76, width - 92, height - 122, theme.panelAlt, theme))
  schema.push(text('**Gate A12** boarding', 68, 96, width - 150, 30, theme.text, 18, '800', 'left', 'markdown'))
  schema.push(text('PAX 148 / bags 92 / fuel ok', 68, 138, width - 136, 22, theme.muted, 12, '700'))
  schema.push(circle(width - 82, 112, 18, theme.accent2, '#ffffff', 2))
  for (let index = 0; index < 9; index += 1) {
    schema.push(panel(70 + index * 24, height - 80, 14, 26 + pulse * 12 * ((index % 3) / 2), index % 2 ? theme.accent : theme.accent3, theme))
  }
}

function addNodeEditor(schema: NovaSchema, width: number, height: number, theme: ScenarioTheme, activeIndex: number, pulse: number): void {
  const nodes = [
    ['Source', 54, 92],
    ['Transform', width / 2 - 62, 146],
    ['Renderer', width - 166, 92],
  ] as const
  schema.push(line(160, 119, width / 2 - 62, 170, theme.accent, 2))
  schema.push(line(width / 2 + 62, 170, width - 166, 119, theme.accent2, 2))
  nodes.forEach(([label, x, y], index) => {
    schema.push(panel(x, y + (activeIndex % 3 === index ? -pulse * 8 : 0), 112, 54, activeIndex % 3 === index ? theme.panelAlt : theme.panel, theme))
    schema.push(text(label, x + 12, y + 18, 88, 18, theme.text, 12, '800'))
  })
  schema.push(text('parent transform -> child bounds -> ordered render', 42, height - 45, width - 84, 18, theme.muted, 11, '700', 'center'))
}

function addSceneSwitcher(schema: NovaSchema, width: number, _height: number, theme: ScenarioTheme, activeIndex: number): void {
  ;['created', 'mounted', 'paused', 'destroyed'].forEach((label, index) => {
    const x = 38 + index * ((width - 76) / 4)
    const active = activeIndex % 4 === index
    schema.push(panel(x, 108, (width - 104) / 4, 58, active ? theme.accent2 : theme.panel, theme))
    schema.push(text(label, x + 11, 128, (width - 146) / 4, 18, active ? theme.background : theme.text, 11, '800'))
  })
}

function addSeatMap(schema: NovaSchema, width: number, height: number, theme: ScenarioTheme, pointerX: number, pointerY: number, activeIndex: number): void {
  let hovered = -1
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const index = row * 8 + col
      const x = 54 + col * Math.max(26, (width - 108) / 9)
      const y = 78 + row * 30
      if (pointerX >= x && pointerX <= x + 24 && pointerY >= y && pointerY <= y + 20) hovered = index
      const selected = activeIndex === index % 8
      schema.push({
        type: 'rect',
        x,
        y,
        width: 24,
        height: 20,
        styles: {
          background: selected ? theme.accent : hovered === index ? theme.accent3 : (row + col) % 5 === 0 ? theme.accent3 : theme.accent2,
          border: { color: theme.stroke, width: hovered === index ? 2 : 1, radius: 5 },
        },
      })
    }
  }
  schema.push(text(hovered >= 0 ? `hover seat ${hovered + 1}` : 'move pointer over seats', 44, height - 50, width - 88, 18, theme.muted, 11, '800'))
}

function addCommandPalette(schema: NovaSchema, width: number, height: number, theme: ScenarioTheme, activeIndex: number, lastAction: string): void {
  schema.push(panel(54, 76, width - 108, height - 118, theme.panelAlt, theme))
  ;['Move selection', 'Toggle overlay', 'Zoom to fit', 'Open metrics'].forEach((label, index) => {
    const y = 102 + index * 34
    const active = activeIndex % 4 === index
    schema.push(panel(76, y, width - 152, 25, active ? theme.accent : theme.panel, theme))
    schema.push(text(label, 92, y + 5, width - 184, 14, active ? '#ffffff' : theme.text, 11, '800'))
  })
  schema.push(text(lastAction, 78, height - 48, width - 156, 18, theme.accent2, 11, '800'))
}

function addDenseHitMap(schema: NovaSchema, width: number, height: number, theme: ScenarioTheme, pointerX: number, pointerY: number, inside: boolean, time: number): void {
  let candidates = 0
  for (let index = 0; index < 120; index += 1) {
    const x = 42 + (index % 20) * ((width - 84) / 20)
    const y = 74 + Math.floor(index / 20) * 23
    const near = inside && Math.hypot(pointerX - x, pointerY - y) < 34
    if (near) candidates += 1
    schema.push(circle(x, y, near ? 6 : 3.5, near ? theme.accent3 : index % 13 === 0 ? theme.accent2 : theme.accent, 'transparent', 0))
  }
  schema.push(line(44, height - 50, 44 + ((time / 20) % Math.max(80, width - 88)), height - 50, theme.accent2, 3))
  schema.push(text(`spatial candidates: ${candidates} / 120`, 44, height - 72, width - 88, 18, theme.muted, 11, '800'))
}

function addPipeline(schema: NovaSchema, width: number, height: number, theme: ScenarioTheme, time: number): void {
  const steps = ['Node', 'Compile', 'Frame', 'Replay']
  steps.forEach((step, index) => {
    const x = 46 + index * ((width - 92) / 4)
    schema.push(panel(x, 106, (width - 124) / 4, 58, index === 2 ? theme.panelAlt : theme.panel, theme))
    schema.push(text(step, x + 12, 126, (width - 170) / 4, 18, theme.text, 12, '800'))
    if (index < steps.length - 1) schema.push(line(x + (width - 124) / 4, 135, x + (width - 92) / 4, 135, theme.accent, 2))
  })
  schema.push(circle(56 + ((time / 8) % Math.max(100, width - 112)), height - 64, 8, theme.accent3, theme.background, 2))
}

function addDirtyTimeline(schema: NovaSchema, width: number, height: number, theme: ScenarioTheme, time: number): void {
  const active = Math.floor(time / 280) % 14
  for (let index = 0; index < 14; index += 1) {
    const dirty = index === active || index === (active + 1) % 14 || index === 10
    schema.push({
      type: 'rect',
      x: 42 + index * ((width - 84) / 14),
      y: 96 + (index % 3) * 26,
      width: Math.max(18, (width - 112) / 16),
      height: 18,
      styles: { background: dirty ? theme.accent : theme.accent2, border: { color: theme.stroke, width: 1, radius: 4 } },
    })
  }
  schema.push(text('rebuilt 3 / cached 11 / culled outside viewport', 46, height - 48, width - 92, 18, theme.muted, 11, '800'))
}

function addMetrics(schema: NovaSchema, width: number, height: number, theme: ScenarioTheme, time: number): void {
  ;[['FPS', '60'], ['commands', String(160 + Math.round((Math.sin(time / 500) + 1) * 18))], ['batches', '12']].forEach(([label, value], index) => {
    const x = 44 + index * ((width - 88) / 3)
    schema.push(panel(x, 92, (width - 112) / 3, 72, theme.panelAlt, theme))
    schema.push(text(label, x + 14, 106, 90, 16, theme.muted, 10, '700'))
    schema.push(text(value, x + 14, 130, 90, 24, theme.text, 22, '800'))
  })
  for (let index = 0; index < 16; index += 1) {
    schema.push(panel(46 + index * ((width - 92) / 16), height - 68, 10, 16 + ((index * 9 + time / 40) % 28), index % 2 ? theme.accent : theme.accent2, theme))
  }
}

function addWorkspace(schema: NovaSchema, width: number, height: number, theme: ScenarioTheme, dragging: boolean, dragX: number): void {
  const split = Math.max(120, Math.min(width - 150, width * 0.36 + dragX))
  schema.push(panel(40, 76, split, height - 122, theme.panelAlt, theme))
  schema.push(panel(54 + split, 76, Math.max(80, width - split - 166), height - 122, theme.panel, theme))
  schema.push(panel(width - 104, 76, 64, height - 122, theme.panelAlt, theme))
  schema.push(line(50 + split, 82, 50 + split, height - 54, dragging ? theme.accent3 : theme.accent, 5))
  schema.push(text(dragging ? 'dragging LazyResizer' : 'drag the splitter', 58, height - 64, 220, 18, theme.muted, 11, '800'))
}

function addContracts(schema: NovaSchema, width: number, height: number, theme: ScenarioTheme, activeIndex: number): void {
  ;['Overview', 'Fields', 'Raw TS'].forEach((label, index) => {
    const active = activeIndex % 3 === index
    schema.push(panel(48 + index * 110, 76, 92, 34, active ? theme.accent : theme.panel, theme))
    schema.push(text(label, 60 + index * 110, 86, 68, 12, active ? '#ffffff' : theme.text, 10, '800'))
  })
  schema.push(panel(48, 128, width - 96, height - 176, theme.panelAlt, theme))
  schema.push(text('NovaNode', 68, 148, 160, 20, theme.text, 16, '800'))
  schema.push(text('properties / methods / events / raw TS', 68, 180, width - 136, 18, theme.muted, 11, '700'))
}

function addCookbook(schema: NovaSchema, width: number, _height: number, theme: ScenarioTheme, activeIndex: number): void {
  ;['Minimap', 'Drag window', 'Selection', 'Timeline'].forEach((label, index) => {
    const x = 46 + (index % 2) * ((width - 112) / 2)
    const y = 78 + Math.floor(index / 2) * 78
    const active = activeIndex % 4 === index
    schema.push(panel(x, y, (width - 138) / 2, 58, active ? theme.accent : theme.panelAlt, theme))
    schema.push(text(label, x + 14, y + 19, 120, 18, active ? '#ffffff' : theme.text, 12, '800'))
  })
}

function addStylesLab(schema: NovaSchema, width: number, height: number, theme: ScenarioTheme, activeIndex: number, pulse: number): void {
  ;['Root', '.card:hover', 'Button:pressed'].forEach((selector, index) => {
    const x = 42 + index * ((width - 84) / 3)
    const active = activeIndex % 3 === index
    schema.push(panel(x, 84, (width - 112) / 3, 76, active ? theme.accent : theme.panelAlt, theme))
    schema.push(text(selector, x + 12, 106, (width - 150) / 3, 18, active ? '#ffffff' : theme.text, 11, '800'))
    schema.push(text(active ? `specificity ${10 + Math.round(pulse * 8)}` : 'indexed', x + 12, 132, 90, 14, active ? '#dbeafe' : theme.muted, 10, '700'))
  })
  schema.push(text('selector source compiles once, component props patch by rule mask', 44, height - 52, width - 88, 18, theme.muted, 11, '800', 'center'))
}

function addSfcCompiler(schema: NovaSchema, width: number, height: number, theme: ScenarioTheme, activeIndex: number, pulse: number): void {
  ;['parse .nova', 'compile .novacss', 'keyed reconcile', 'emit NovaNode'].forEach((label, index) => {
    const active = activeIndex % 4 === index
    const y = 76 + index * 39
    schema.push(panel(48 + index * 20, y, width - 116 - index * 20, 30, active ? '#365314' : theme.panelAlt, theme))
    schema.push(text(label, 64 + index * 20, y + 7, 210, 14, theme.text, 11, '800'))
    schema.push(text(active ? `patched ${Math.round(20 + pulse * 18)}` : 'reused', width - 160, y + 7, 90, 14, active ? theme.accent : theme.muted, 10, '700'))
  })
  schema.push(text('generated files stay debug artifacts, source remains .nova + .novacss', 50, height - 46, width - 100, 18, theme.muted, 11, '800'))
}

function addSoundMixer(
  schema: NovaSchema,
  width: number,
  height: number,
  theme: ScenarioTheme,
  activeIndex: number,
  lastAction: string,
  stats: { loaded: number; active: number; played: number; skipped: number; unlocked: boolean; muted: boolean },
): void {
  ;['low', 'mid', 'high', 'loop'].forEach((label, index) => {
    const x = 46 + (index % 2) * ((width - 110) / 2)
    const y = 82 + Math.floor(index / 2) * 68
    const active = activeIndex % 4 === index
    schema.push(panel(x, y, (width - 140) / 2, 50, active ? theme.accent : theme.panelAlt, theme))
    schema.push(text(label, x + 14, y + 15, 120, 18, active ? '#ffffff' : theme.text, 12, '800'))
  })
  schema.push(text(`${lastAction} | loaded ${stats.loaded} active ${stats.active} played ${stats.played} skipped ${stats.skipped}`, 48, height - 50, width - 96, 18, theme.accent2, 11, '800'))
}

function addCursorStudio(schema: NovaSchema, width: number, height: number, theme: ScenarioTheme, pointerX: number, pointerY: number, inside: boolean, dragging: boolean): void {
  ;['native', 'url', 'component'].forEach((label, index) => {
    const x = 44 + index * ((width - 88) / 3)
    schema.push(panel(x, 88, (width - 114) / 3, 72, theme.panelAlt, theme))
    schema.push(text(label, x + 14, 115, 90, 18, theme.text, 12, '800'))
  })
  if (inside) {
    schema.push({
      type: 'polygon',
      points: [{ x: pointerX, y: pointerY }, { x: pointerX + 18, y: pointerY + 8 }, { x: pointerX + 7, y: pointerY + 16 }],
      styles: { background: dragging ? theme.accent3 : theme.accent2, stroke: theme.text, lineWidth: 1 },
    })
  }
  schema.push(text(dragging ? 'cursor state: dragging' : 'hover and press canvas cards', 48, height - 48, width - 96, 18, theme.muted, 11, '800'))
}

function addRendererPolicy(schema: NovaSchema, width: number, height: number, theme: ScenarioTheme, activeIndex: number): void {
  schema.push(panel(44, 84, width - 88, height - 136, theme.panel, theme))
  schema.push({
    type: 'rect',
    x: 72,
    y: 112,
    width: 118,
    height: 64,
    styles: { background: '#dbeafe', border: { color: theme.accent, width: activeIndex % 2 ? 4 : 2, radius: 10, dashPattern: [8, 5] } },
  })
  schema.push(circle(width / 2, 146, 36, '#fef3c7', '#d97706', 4))
  schema.push({
    type: 'polygon',
    points: [{ x: width - 146, y: 106 }, { x: width - 74, y: 146 }, { x: width - 132, y: 190 }],
    styles: { background: '#ede9fe', stroke: theme.accent2, lineWidth: 3 },
  })
  schema.push(text('clip stack, text atlas, icon texture, stable equal-z order', 68, height - 62, width - 136, 20, theme.text, 12, '800'))
}

function addInputDiagnostics(schema: NovaSchema, width: number, height: number, theme: ScenarioTheme, lastAction: string, dragX: number, dragY: number): void {
  ;['capture', 'target', 'bubble'].forEach((label, index) => {
    const x = 52 + index * ((width - 104) / 3)
    schema.push(panel(x, 92 + index * 22, (width - 132) / 3, 64, index === 1 ? theme.accent : theme.panelAlt, theme))
    schema.push(text(label, x + 14, 116 + index * 22, 90, 18, index === 1 ? '#ffffff' : theme.text, 12, '800'))
  })
  schema.push(panel(48, height - 78, width - 96, 36, theme.panelAlt, theme))
  schema.push(text(`${lastAction} | dx ${Math.round(dragX)} dy ${Math.round(dragY)}`, 62, height - 67, width - 124, 14, theme.accent2, 11, '800'))
}

function addShell(schema: NovaSchema, width: number, height: number, theme: ScenarioTheme, title: string, caption: string): void {
  schema.push(
    { type: 'rect', x: 0, y: 0, width, height, styles: { background: theme.background } },
    { type: 'rect', x: 16, y: 16, width: width - 32, height: height - 32, styles: { background: theme.panel, border: { color: theme.stroke, width: 1, radius: 8 } } },
    text(title, 32, 27, width - 64, 21, theme.text, 15, '800'),
    text(caption, 32, 50, width - 64, 16, theme.muted, 10, '700'),
  )
}

function makeTheme(
  background: string,
  panelColor: string,
  panelAlt: string,
  textColor: string,
  muted: string,
  accent: string,
  accent2: string,
  accent3: string,
  stroke: string,
): ScenarioTheme {
  return { background, panel: panelColor, panelAlt, text: textColor, muted, accent, accent2, accent3, stroke }
}

function panel(x: number, y: number, width: number, height: number, fill: string, theme: ScenarioTheme): NovaSchema[number] {
  return {
    type: 'rect',
    x,
    y,
    width: Math.max(1, width),
    height: Math.max(1, height),
    styles: { background: fill, border: { color: theme.stroke, width: 1, radius: 7 } },
  }
}

function circle(x: number, y: number, radius: number, fill: string, stroke: string, strokeWidth = 1): NovaSchema[number] {
  return {
    type: 'circle',
    x,
    y,
    radius: Math.max(1, radius),
    styles: {
      background: fill,
      border: { color: stroke, width: strokeWidth },
    },
  }
}

function line(x1: number, y1: number, x2: number, y2: number, color: string, width: number, dashPattern?: Array<number>): NovaSchema[number] {
  return {
    type: 'line',
    x1,
    y1,
    x2,
    y2,
    styles: { color, width, dashPattern },
  }
}

function text(
  value: string,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  size: number,
  weight: '600' | '700' | '800',
  align: 'left' | 'center' = 'left',
  parser?: 'markdown',
): NovaSchema[number] {
  return {
    type: 'text',
    text: value,
    x,
    y,
    width: Math.max(1, width),
    height: Math.max(1, height),
    parser,
    styles: {
      color,
      font: { family: 'monospace', size, weight },
      align: { horizontal: align, vertical: 'middle' },
      ellipsis: true,
    },
  }
}

export function createNovaScenarioPreview(
  target: HTMLCanvasElement,
  scenario: DocsExampleScenario = 'dispatch-dashboard',
): ScenarioRuntime {
  const app = Nova.createApp<ScenarioEvents>({
    target,
    size: {
      width: Math.max(1, target.clientWidth),
      height: Math.max(1, target.clientHeight),
      maxDpr: 2,
    },
    renderer: { main: RendererType.Web2D },
    scheduler: { type: RaphSchedulerType.AnimationFrame, loop: false },
    sound: { unlock: 'first-input', maxVoices: 24 },
    input: {
      pointer: { enabled: true },
      keyboard: { enabled: true, scope: 'focused' },
    },
  })

  if (scenario === 'sound-mixer') {
    void app.sound.preload(SOUND_DESCRIPTORS)
  }

  const surface = app.createSurface(`docs-${scenario}`)
  const root = surface.createNode((nova, novaSurface) => new DocsScenarioNode(nova, novaSurface, scenario))
  let frame = 0
  let destroyed = false

  const tick = (time: number): void => {
    if (destroyed) return
    root.setTime(time)
    app.invalidate()
    frame = window.requestAnimationFrame(tick)
  }

  frame = window.requestAnimationFrame(tick)
  app.invalidate()

  return {
    /**
     * Обновляет размеры runtime-представления текущего класса.
     */
    resize(width: number, height: number): void {
      app.options({ width: Math.max(1, width), height: Math.max(1, height) })
      root.options({ width: app.width, height: app.height })
      root.dirty({ render: true })
      app.invalidate()
    },
    /**
     * Освобождает runtime-ресурсы и подписки текущего класса.
     */
    destroy(): void {
      destroyed = true
      window.cancelAnimationFrame(frame)
      app.destroy()
    },
  }
}
