import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { provide } from 'vue'
import EndgeMermaid from './components/EndgeMermaid.vue'
import Layout from './Layout.vue'
import NovaContract from './nova/components/NovaContract.vue'
import NovaExample from './nova/components/NovaExample.vue'
import { ReadingMode_Module, readingModeInjectionKey } from './reading-mode'
import './styles.css'

export default {
  extends: DefaultTheme,
  Layout,
  setup() {
    provide(readingModeInjectionKey, new ReadingMode_Module())
  },
  enhanceApp({ app }) {
    app.component('EndgeMermaid', EndgeMermaid)
    app.component('NovaExample', NovaExample)
    app.component('NovaContract', NovaContract)
  },
} satisfies Theme
