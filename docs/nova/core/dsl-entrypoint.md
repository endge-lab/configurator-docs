# Nova DSL entrypoint

`.nova` файл может быть корневым entrypoint-компонентом приложения внутри `NovaCanvas`. Vue остается shell-слоем: держит DOM-разметку вокруг canvas, передает минимальные props и размонтирует runtime.

## Mount из Vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { NovaCanvas } from '@endge/nova-vue'

const theme = ref<'light' | 'dark'>('light')
</script>

<template>
  <NovaCanvas
    width="100%"
    height="100%"
    mount="./ui/NovaApp.nova"
    :props="{ theme }"
  />
</template>
```

`mount` принимает только статический путь к `.nova`. Компилятор превращает его в скрытый `nova-template`, импортирует компонент и обновляет `props` через существующий mount handle без remount.

## Standalone app.nova

Если приложение состоит из одного fullscreen Nova Canvas, Vue host не нужен. `novaStandaloneApp` создает canvas entry сам и монтирует `src/app.nova` на весь viewport.

```ts
import { RendererType } from '@endge/nova'
import { novaStandaloneApp } from '@endge/nova-compiler/vite'

export default {
  plugins: [
    novaStandaloneApp({
      entry: 'src/app.nova',
      options: {
        renderer: { main: RendererType.WebGL },
        input: true,
        size: { maxDpr: 2 },
      },
    }),
  ],
}
```

Компонентные библиотеки подключаются обычными imports внутри `.nova`. Например `import { Modeler } from '@endge/nova-modeler'` достаточно для `<Modeler.Root />`: compiler добавит нужную schema-регистрацию.

## Корневой `.nova`

```vue
<script setup lang="ts">
import { data } from '../model/data'
import { options } from '../model/options'

const props = defineProps()
</script>

<template>
  <Root :width="props.width" :height="props.height">
    <TimelineChart.Root
      :data="data"
      :options="options"
      :class-name="props.theme === 'dark' ? 'timeline-dark' : 'timeline-light'"
    />
  </Root>
</template>
```

`props.width`, `props.height`, `props.padding`, `props.background`, `props.border`, `props.clip`, `props.rootId`, `props.rootClassName` и `props.styleSheet` передаются `NovaCanvas` как системные props. Пользовательские props из `:props` добавляются в тот же объект.

## Composition

`<template src="./Panel.nova" />` inline-вставляет template без component boundary. Это удобно для разбиения больших DSL-файлов по папкам и не создает отдельный `NovaNode`.

`<Component src="./Panel.nova" />` создает настоящий component boundary. Используйте его, когда компоненту нужны свои props, lifecycle, refs или локальное состояние.

Нельзя одновременно использовать `mount="./ui/NovaApp.nova"` и inline DSL children внутри того же `NovaCanvas`: это две разные точки входа.
