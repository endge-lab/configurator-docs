<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed, onBeforeUnmount, ref } from 'vue'
import { isPublicDocumentationPage } from '../../../../scripts/documentation-pages.mjs'

type CopyState = 'idle' | 'copying' | 'copied' | 'failed'

const { page } = useData()
const state = ref<CopyState>('idle')
let resetTimer: ReturnType<typeof setTimeout> | undefined

/** Markdown-версию публичной страницы собирает scripts/build-llms.mjs рядом с HTML. */
const href = computed(() => !page.value.isNotFound && isPublicDocumentationPage(page.value.relativePath)
  ? withBase(`/${page.value.relativePath}`)
  : undefined)
const copyLabel = computed(() => ({
  idle: 'Скопировать Markdown',
  copying: 'Копирую…',
  copied: 'Скопировано',
  failed: 'Не удалось скопировать',
})[state.value])

async function copyMarkdown(): Promise<void> {
  if (!href.value || state.value === 'copying') {
    return
  }
  state.value = 'copying'
  try {
    const response = await fetch(href.value, { headers: { Accept: 'text/markdown, text/plain' } })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    await writeClipboard(await response.text())
    state.value = 'copied'
  }
  catch {
    state.value = 'failed'
  }
  clearTimeout(resetTimer)
  resetTimer = setTimeout(() => {
    state.value = 'idle'
  }, 2000)
}

/** Clipboard API доступен только в secure context; иначе — выделение скрытого textarea. */
async function writeClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.append(textarea)
  textarea.select()
  const copied = document.execCommand('copy')
  textarea.remove()
  if (!copied) {
    throw new Error('Clipboard недоступен')
  }
}

onBeforeUnmount(() => clearTimeout(resetTimer))
</script>

<template>
  <div v-if="href" class="EndgeMarkdownActions">
    <a
      class="EndgeMarkdownActions__button"
      :href="href"
      type="text/markdown"
      target="_blank"
      rel="noopener"
      title="Исходный текст страницы в Markdown — удобно для ИИ-агента"
    >
      <svg class="EndgeMarkdownActions__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6.5h16v11H4z" />
        <path d="M7 15V9l2.5 3L12 9v6M15.5 9v6M13.5 13l2 2 2-2" />
      </svg>
      Открыть как Markdown
    </a>
    <button
      type="button"
      class="EndgeMarkdownActions__button"
      :class="{ 'is-done': state === 'copied', 'is-failed': state === 'failed' }"
      :disabled="state === 'copying'"
      aria-live="polite"
      @click="copyMarkdown"
    >
      <svg class="EndgeMarkdownActions__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path v-if="state === 'copied'" d="M5 12.5l4.5 4.5L19 7.5" />
        <template v-else>
          <path d="M9 9h10v11H9z" />
          <path d="M5 15V4h10" />
        </template>
      </svg>
      {{ copyLabel }}
    </button>
  </div>
</template>
