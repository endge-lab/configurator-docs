import type { Theme } from 'vitepress'
import type { App } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { provide } from 'vue'
import EndgeMermaid from './components/EndgeMermaid.vue'
import Layout from './Layout.vue'
import { ReadingMode_Module, readingModeInjectionKey } from './reading-mode'
import './styles.css'

const theme = {
  extends: DefaultTheme,
  Layout,
  setup() {
    provide(readingModeInjectionKey, new ReadingMode_Module())
  },
  enhanceApp({ app }: { app: App }) {
    app.component('EndgeMermaid', EndgeMermaid)
  },
}

export default theme as Theme
