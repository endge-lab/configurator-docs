# Реактивность Nova DSL

Nova DSL использует собственные runtime-сигналы. Они не завязаны на Vue reactivity и безопасно работают с несколькими `NovaApp`, если сигнал импортирован из общего модуля.

## Signal и computed

```ts
import { Nova } from '@endge/nova'

const count = Nova.signal(0)
const doubled = Nova.computed(() => count.value * 2)

count.value = 1
console.log(doubled.value)
```

Когда `.value` читается во время update/template pass скомпилированного `.nova` компонента, runtime запоминает связь `signal -> NovaNode`. При записи в signal зависимые nodes получают `dirty({ update: true, render: true })`, а приложение инвалидируется.

`Nova.computed` ленивый: он пересчитывается только при чтении `.value`, но при изменении источников инвалидирует downstream nodes и computed.

## В `.nova` файле

```vue
<script setup lang="ts">
import { Nova } from '@endge/nova'

const progress = Nova.signal(62)
const label = Nova.computed(() => `${progress.value}%`)
</script>

<template>
  <Root>
    <TextBlock :text="label.value" />
  </Root>
</template>
```

Здесь изменение `progress.value` пометит только node, который читал `label.value` во время tracked update. Если ветка template перестала читать сигнал, подписка будет заменена на следующем update.

## Refs не signals

`Nova.ref<T>(name?)` и `Nova.refMap<T>()` остаются component/API refs:

```ts
const timeline = Nova.ref<TimelineRootApi>('timeline')
const rows = Nova.refMap<RowApi>()
```

Они нужны для доступа к API смонтированных nodes и не участвуют в reactive dependency tracking. Для состояния используйте `Nova.signal` или `Nova.computed`.

## Ограничение Vue ref

Vue `ref` можно передать в `.nova` через `NovaCanvas :props`, но внутри `.nova` не стоит импортировать Vue reactivity как состояние DSL. Vue не знает, какие NovaNodes читали это значение. Для локальной интерактивности внутри canvas используйте `Nova.signal`, а Vue оставляйте для shell-состояния и bridge-пропсов.
