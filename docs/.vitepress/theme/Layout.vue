<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { onMounted } from 'vue'
import { useReadingMode } from './reading-mode'
import ReadingMode_Button from './reading-mode/ReadingMode_Button.vue'

const { Layout } = DefaultTheme
const readingMode = useReadingMode()
const isReadingMode = readingMode.enabled

onMounted(() => readingMode.start())
</script>

<template>
  <div
    class="EndgeDocsLayout"
    :class="{ 'is-reading': isReadingMode }"
  >
    <Layout>
      <template #nav-bar-content-after>
        <ReadingMode_Button />
      </template>

      <template #layout-bottom>
        <ReadingMode_Button v-if="isReadingMode" floating />
      </template>
    </Layout>
  </div>
</template>
