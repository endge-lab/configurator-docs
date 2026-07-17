<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { exampleSource, NOVA_EXAMPLES } from '../nova-examples'

const props = withDefaults(defineProps<{
  id: string
  layout?: 'tabs' | 'split'
  defaultTab?: 'canvas' | 'code'
  display?: 'code-only' | 'canvas-only' | 'both'
  height?: string
}>(), {
  layout: 'tabs',
  defaultTab: 'code',
  display: 'both',
  height: '360px',
})

type ExampleTab = 'canvas' | 'code'

const host = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const error = ref('')
const activeTab = ref<ExampleTab>(initialTab())
const definition = computed(() => NOVA_EXAMPLES[props.id] ?? {
  title: props.id,
  caption: 'Интерактивный пример Nova.',
  scenario: 'dispatch-dashboard' as const,
})
const source = computed(() => exampleSource(props.id, definition.value))
const exampleStyle = computed(() => ({ '--nova-example-height': safeHeight(props.height) }))

let runtime: { resize: (width: number, height: number) => void; destroy: () => void } | null = null
let resizeObserver: ResizeObserver | null = null

function initialTab(): ExampleTab {
  if (props.display === 'code-only') return 'code'
  if (props.display === 'canvas-only') return 'canvas'
  return props.defaultTab
}

function safeHeight(value: string): string {
  return /^(?:\d+(?:\.\d+)?(?:px|rem|em|vh|svh|dvh|%)|(?:clamp|min|max|calc)\([0-9a-zA-Z\s,%.+\-*/()]+\))$/.test(value)
    ? value
    : '360px'
}

function resizeRuntime(): void {
  if (!host.value || !runtime) return
  runtime.resize(host.value.clientWidth, host.value.clientHeight)
}

function destroyRuntime(): void {
  runtime?.destroy()
  runtime = null
}

async function mountRuntime(): Promise<void> {
  if (props.display === 'code-only') return
  await nextTick()
  if (!canvas.value || !host.value) return

  destroyRuntime()
  error.value = ''

  try {
    const { createNovaScenarioPreview } = await import('../runtime/nova-scenario')
    runtime = createNovaScenarioPreview(canvas.value, definition.value.scenario)
    resizeRuntime()
  }
  catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Не удалось запустить Nova runtime.'
  }
}

watch(() => props.id, () => void mountRuntime())
watch(() => props.defaultTab, () => { activeTab.value = initialTab() })
watch(activeTab, tab => {
  if (tab === 'canvas') void mountRuntime()
  else if (props.layout !== 'split') destroyRuntime()
})

onMounted(() => {
  resizeObserver = new ResizeObserver(resizeRuntime)
  if (host.value) resizeObserver.observe(host.value)
  if (activeTab.value === 'canvas' || props.layout === 'split') void mountRuntime()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
  destroyRuntime()
})
</script>

<template>
  <section
    class="nova-example"
    :class="{ 'nova-example--split': layout === 'split' }"
    :style="exampleStyle"
  >
    <header class="nova-example__header">
      <div>
        <span>Исполняемый пример</span>
        <strong>{{ definition.title }}</strong>
        <small>{{ definition.caption }}</small>
      </div>

      <div
        v-if="layout === 'tabs' && display === 'both'"
        class="nova-example__tabs"
        role="tablist"
        aria-label="Переключение примера"
      >
        <button
          v-for="tab in (['canvas', 'code'] as const)"
          :key="tab"
          type="button"
          role="tab"
          :aria-selected="activeTab === tab"
          :class="{ 'is-active': activeTab === tab }"
          @click="activeTab = tab"
        >
          {{ tab === 'canvas' ? 'Canvas' : 'Код' }}
        </button>
      </div>
    </header>

    <div v-if="layout === 'split'" class="nova-example__split">
      <pre v-if="display !== 'canvas-only'" class="nova-example__code"><code>{{ source }}</code></pre>
      <div v-if="display !== 'code-only'" ref="host" class="nova-example__canvas-host">
        <canvas ref="canvas" aria-label="Интерактивный пример Nova" />
        <p v-if="error" class="nova-example__error">{{ error }}</p>
      </div>
    </div>

    <div v-else class="nova-example__body">
      <pre v-if="activeTab === 'code'" class="nova-example__code"><code>{{ source }}</code></pre>
      <div v-else ref="host" class="nova-example__canvas-host">
        <canvas ref="canvas" aria-label="Интерактивный пример Nova" />
        <p v-if="error" class="nova-example__error">{{ error }}</p>
      </div>
    </div>
  </section>
</template>
