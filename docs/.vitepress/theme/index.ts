import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import NovaContract from './nova/components/NovaContract.vue'
import NovaExample from './nova/components/NovaExample.vue'
import NovaMermaid from './nova/components/NovaMermaid.vue'
import './styles.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('NovaExample', NovaExample)
    app.component('NovaContract', NovaContract)
    app.component('NovaMermaid', NovaMermaid)
  },
} satisfies Theme
