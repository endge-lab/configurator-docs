import type { DocsExampleScenario } from './nova-types'

export interface NovaExampleDefinition {
  title: string
  caption: string
  scenario: DocsExampleScenario
}

export const NOVA_EXAMPLES: Record<string, NovaExampleDefinition> = {
  'nova-intro-dispatch': example('Панель диспетчера', 'Карточки рейсов, маршруты и статусы в одном canvas.', 'dispatch-dashboard'),
  'nova-quick-radar': example('Виджет радара', 'Минимальный runtime с предметным canvas preview.', 'radar-widget'),
  'nova-app-cockpit': example('Адаптивная панель', 'Размеры, DPR и scheduler на telemetry panel.', 'cockpit-panel'),
  'nova-surface-airport': example('Слои карты аэропорта', 'Фон, маршруты и overlay на logical surfaces.', 'airport-layers'),
  'nova-schema-primitives': example('Галерея schema primitives', 'Rect, line, circle, arc, polygon и dashed styling.', 'schema-primitives'),
  'nova-text-icons-texture': example('Операционная карточка', 'Текст, status icon и texture-like progress.', 'text-icons-texture'),
  'nova-node-editor': example('Мини-редактор nodes', 'Transform, bounds и render order вложенной сцены.', 'node-editor'),
  'nova-scene-switcher': example('Переключатель сцен', 'Mount, pause, resume, unmount и destroy.', 'scene-switcher'),
  'nova-input-seat-map': example('Интерактивная карта мест', 'Hover, selection и drag на плотной canvas-сцене.', 'seat-map'),
  'nova-command-palette': example('Командная палитра', 'Keyboard scopes и focused node.', 'command-palette'),
  'nova-dense-hit-map': example('Плотная hit-test карта', 'Spatial candidates вокруг указателя.', 'dense-hit-map'),
  'nova-render-pipeline': example('Render pipeline', 'Compile, frame и replay phases.', 'render-pipeline'),
  'nova-dirty-culling': example('Dirty timeline', 'Retained replay, dirty spans и culling.', 'dirty-culling'),
  'nova-hybrid-webgl': example('Hybrid renderer', 'WebGL-safe primitives и logical overlay.', 'hybrid-webgl'),
  'nova-metrics-dashboard': example('Runtime metrics', 'FPS, commands и batches в живой сцене.', 'metrics-dashboard'),
  'nova-resizable-workspace': example('Рабочая область с resize', 'Интерактивный splitter и panel geometry.', 'resizable-workspace'),
  'nova-contracts-reference': example('Справочник contracts', 'Поля и runtime-контракты без перегруза статьи.', 'contracts-reference'),
  'nova-cookbook-gallery': example('Галерея рецептов', 'Паттерны рабочих canvas-интерфейсов.', 'cookbook-gallery'),
  'nova-styles-engine-lab': example('Styles engine', 'Selector matching и token overrides.', 'styles-engine-lab'),
  'nova-sfc-compiler': example('Компилятор Nova SFC', '.nova, .novacss и keyed patching.', 'sfc-compiler'),
  'nova-sound-mixer': example('Sound mixer', 'Интерактивные pads и Sound Engine lifecycle.', 'sound-mixer'),
  'nova-cursor-studio': example('Студия курсоров', 'Hover, pressed и dragging declarations.', 'cursor-studio'),
  'nova-renderer-policy': example('Renderer policy', 'Clip stack, z-order и backend rules.', 'renderer-policy'),
  'nova-input-diagnostics': example('Диагностика input', 'Capture, bubble, selection и drag meta.', 'input-diagnostics'),
  'nova-motion-presets': example('Motion presets', 'Одиночные animation presets.', 'motion-presets'),
  'nova-motion-patterns': example('Motion patterns', 'Stagger, wave, sequence и repeat.', 'motion-patterns'),
  'nova-prime-components': example('Продвинутые UI primitives', 'Controls, overlays и retained canvas components.', 'prime-components'),
  'popover-custom-panel': example('Popover custom panel', 'Произвольный overlay content.', 'prime-components'),
  'context-menu-via-popover-action-list': example('Context menu', 'Popover и ActionList как два независимых блока.', 'prime-components'),
  'dialog-draggable-resizable': example('Dialog drag и resize', 'Modal surface с constraints.', 'prime-components'),
  'chip-filter-row': example('Chip filter row', 'Выбранные фильтры и remove actions.', 'prime-components'),
  'toast-region-stack': example('Toast stack', 'Переиспользование nodes в notification stack.', 'prime-components'),
  'timeline-chart-basic': example('Timeline: базовый пример', 'Группы, задачи и временная шкала.', 'dirty-culling'),
  'timeline-chart-options': example('Timeline: options', 'Изменение layout и visual options.', 'resizable-workspace'),
  'timeline-chart-all-options': example('Timeline: полный контракт options', 'Кодовый справочник конфигурации.', 'dirty-culling'),
  'timeline-chart-task-profile': example('Timeline: task profile', 'Визуальные профили задач.', 'airport-layers'),
  'timeline-chart-task-dragging': example('Timeline: drag задач', 'Pointer capture и изменение диапазона.', 'seat-map'),
  'timeline-chart-api-updates': example('Timeline: API updates', 'Batch update и retained frame.', 'render-pipeline'),
  'timeline-chart-live-updates': example('Timeline: live updates', 'Частые изменения и runtime metrics.', 'metrics-dashboard'),
  'timeline-chart-markers': example('Timeline: markers', 'Маркеры и overlay-слои.', 'airport-layers'),
  'timeline-chart-annotations': example('Timeline: annotations', 'Points, links и routing.', 'airport-layers'),
}

export function exampleSource(id: string, definition: NovaExampleDefinition): string {
  return `import { Nova, NovaNode, type NovaSchema } from '@endge/nova'

// Документационный сценарий: ${id}
class ExampleNode extends NovaNode<Record<string, Event>> {
  render(): void {
    const schema: NovaSchema = [
      {
        type: 'rect',
        x: 24,
        y: 24,
        width: this.width - 48,
        height: this.height - 48,
        styles: { background: '#0d2745' },
      },
      {
        type: 'text',
        x: 44,
        y: 44,
        width: this.width - 88,
        height: 32,
        text: '${escapeSource(definition.title)}',
        styles: { color: '#e8f5ff' },
      },
    ]

    this.renderer.schema(schema)
    this.setRenderBoundsFromSchema(schema)
  }
}

export function mountExample(canvas: HTMLCanvasElement) {
  const app = Nova.createApp({
    target: canvas,
    size: { width: canvas.clientWidth, height: canvas.clientHeight, maxDpr: 2 },
    scheduler: { loop: false },
  })
  const surface = app.surface({ id: '${definition.scenario}' })
  surface.createNode(ExampleNode)

  return () => app.destroy()
}`
}

function example(title: string, caption: string, scenario: DocsExampleScenario): NovaExampleDefinition {
  return { title, caption, scenario }
}

function escapeSource(value: string): string {
  return value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")
}
