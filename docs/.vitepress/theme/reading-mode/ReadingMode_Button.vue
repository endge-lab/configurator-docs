<script setup lang="ts">
import { computed } from 'vue'
import { useReadingMode } from '.'

const props = withDefaults(defineProps<{
  floating?: boolean
}>(), {
  floating: false,
})

const readingMode = useReadingMode()
const isEnabled = readingMode.enabled
const label = computed(() => props.floating || isEnabled.value
  ? 'Выйти из режима чтения'
  : 'Включить режим чтения')
</script>

<template>
  <button
    type="button"
    class="EndgeReadingMode_Button"
    :class="{
      'is-active': isEnabled,
      'is-floating': floating,
    }"
    :aria-label="label"
    :aria-pressed="isEnabled"
    :title="label"
    @click="readingMode.toggle()"
  >
    <svg
      v-if="floating"
      class="EndgeReadingMode_Button__icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M7 7l10 10M17 7 7 17" />
    </svg>

    <svg
      v-else
      class="EndgeReadingMode_Button__icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M4.5 6.5A2.5 2.5 0 0 1 7 4h2.25A2.75 2.75 0 0 1 12 6.75V20a3 3 0 0 0-3-3H4.5z" />
      <path d="M19.5 6.5A2.5 2.5 0 0 0 17 4h-2.25A2.75 2.75 0 0 0 12 6.75V20a3 3 0 0 1 3-3h4.5z" />
    </svg>
  </button>
</template>
