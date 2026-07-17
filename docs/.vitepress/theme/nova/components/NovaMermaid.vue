<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{ source: string }>()
const diagram = ref<HTMLElement | null>(null)
const error = ref('')

async function renderDiagram(): Promise<void> {
  if (!diagram.value) return
  error.value = ''

  try {
    const source = decodeURIComponent(props.source)
    const mermaid = (await import('mermaid')).default
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'neutral',
    })
    const id = `nova-mermaid-${Math.random().toString(36).slice(2)}`
    const result = await mermaid.render(id, source)
    diagram.value.innerHTML = result.svg
  }
  catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Не удалось построить диаграмму.'
  }
}

watch(() => props.source, () => void renderDiagram())
onMounted(() => void renderDiagram())
</script>

<template>
  <figure class="nova-mermaid">
    <div ref="diagram" />
    <figcaption v-if="error">{{ error }}</figcaption>
  </figure>
</template>
