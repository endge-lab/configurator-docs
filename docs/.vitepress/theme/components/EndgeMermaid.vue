<script setup lang="ts">
import { useData } from 'vitepress'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { createEndgeMermaidTheme } from '../mermaid-theme'

const props = defineProps<{ source: string }>()
const { isDark } = useData()
const diagram = ref<HTMLElement | null>(null)
const error = ref('')
const isExpanded = ref(false)
let renderGeneration = 0
let previousBodyOverflow = ''
let previousDocumentOverflow = ''

function setExpanded(expanded: boolean): void {
  if (isExpanded.value === expanded) {
    return
  }

  isExpanded.value = expanded

  if (expanded) {
    previousBodyOverflow = document.body.style.overflow
    previousDocumentOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return
  }

  document.body.style.overflow = previousBodyOverflow
  document.documentElement.style.overflow = previousDocumentOverflow
}

function toggleExpanded(): void {
  setExpanded(!isExpanded.value)
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && isExpanded.value) {
    setExpanded(false)
  }
}

async function renderDiagram(): Promise<void> {
  if (!diagram.value) {
    return
  }
  const generation = ++renderGeneration
  error.value = ''

  try {
    const source = decodeURIComponent(props.source)
    const mermaid = (await import('mermaid')).default
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      ...createEndgeMermaidTheme(isDark.value),
      flowchart: {
        curve: 'basis',
        nodeSpacing: 38,
        padding: 18,
        rankSpacing: 44,
      },
    })
    const id = `endge-mermaid-${Math.random().toString(36).slice(2)}`
    const result = await mermaid.render(id, source)
    if (generation !== renderGeneration || !diagram.value) {
      return
    }
    diagram.value.innerHTML = result.svg
  }
  catch (cause) {
    if (generation !== renderGeneration) {
      return
    }
    error.value = cause instanceof Error ? cause.message : 'Не удалось построить диаграмму.'
  }
}

watch(() => props.source, () => void renderDiagram())
watch(isDark, () => void renderDiagram())
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  void renderDiagram()
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (isExpanded.value) {
    document.body.style.overflow = previousBodyOverflow
    document.documentElement.style.overflow = previousDocumentOverflow
  }
})
</script>

<template>
  <figure
    class="endge-mermaid"
    :class="{ 'endge-mermaid--expanded': isExpanded }"
    :aria-label="isExpanded ? 'Диаграмма в полноэкранном режиме' : undefined"
    :aria-modal="isExpanded ? 'true' : undefined"
    :role="isExpanded ? 'dialog' : undefined"
  >
    <button
      class="endge-mermaid__fullscreen-button"
      type="button"
      :aria-expanded="isExpanded"
      :aria-label="isExpanded ? 'Закрыть полноэкранную схему' : 'Открыть схему на весь экран'"
      :title="isExpanded ? 'Закрыть полноэкранную схему' : 'Открыть схему на весь экран'"
      @click="toggleExpanded"
    >
      <svg
        v-if="isExpanded"
        aria-hidden="true"
        viewBox="0 0 24 24"
      >
        <path d="M6 6l12 12M18 6 6 18" />
      </svg>
      <svg
        v-else
        aria-hidden="true"
        viewBox="0 0 24 24"
      >
        <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
      </svg>
    </button>
    <div ref="diagram" />
    <figcaption v-if="error">
      {{ error }}
    </figcaption>
  </figure>
</template>
