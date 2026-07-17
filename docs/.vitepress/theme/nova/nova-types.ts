export type DocsExampleScenario =
  | 'dispatch-dashboard'
  | 'radar-widget'
  | 'cockpit-panel'
  | 'airport-layers'
  | 'schema-primitives'
  | 'text-icons-texture'
  | 'node-editor'
  | 'scene-switcher'
  | 'seat-map'
  | 'command-palette'
  | 'dense-hit-map'
  | 'render-pipeline'
  | 'dirty-culling'
  | 'hybrid-webgl'
  | 'metrics-dashboard'
  | 'resizable-workspace'
  | 'contracts-reference'
  | 'cookbook-gallery'
  | 'styles-engine-lab'
  | 'sfc-compiler'
  | 'sound-mixer'
  | 'cursor-studio'
  | 'renderer-policy'
  | 'input-diagnostics'
  | 'motion-presets'
  | 'motion-patterns'
  | 'prime-components'

export interface DocsContractField {
  name: string
  type?: string
  required?: boolean
  defaultValue?: string
  description: string
  badge?: string
}

export interface DocsContractGroup {
  id: string
  title: string
  caption?: string
  items: Array<DocsContractField>
}

export interface DocsContractDefinition {
  id: string
  kind: string
  title: string
  packageName: string
  sourcePath: string
  summary: string
  signature: string
  groups: Array<DocsContractGroup>
  notes?: Array<string>
  rawTs?: string
}
