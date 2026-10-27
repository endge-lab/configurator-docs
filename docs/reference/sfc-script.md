---
description: "Блок <script setup> Component SFC: минимальный компонент, макросы, локальный Computation resource, ограничения, preview и contracts парсера."
---

# Script Component SFC

`<script setup lang="ts">` Component SFC описывает contracts и локальные вычислительные ресурсы. Внешнее сходство с Vue SFC не делает этот текст Vue-программой: Endge извлекает макросы и компилирует известные bindings, а runtime исполняет готовый artifact.

## Минимальный полный компонент

```vue
<script setup lang="ts">
interface Props {
  title: string
  items: Array<{ id: string; name: string }>
}

const props = defineProps<Props>()
</script>

<template>
  <Flex col gap="2">
    <Text weight="600">{{ props.title }}</Text>
    <Text for="item in props.items" :key="item.id">{{ item.name }}</Text>
  </Flex>
</template>
```

Такой компонент не требует внешних Type documents. Для общего доменного Type можно использовать именованный contract, разрешаемый текущим Type Registry. Нельзя считать любой сложный TypeScript utility type автоматически поддержанным parser-ом props: compiler извлекает поля локального interface/type literal либо object Type из Registry. Для предсказуемого контракта используйте явную object shape.

## Макросы

| Макрос | Назначение | Где читать |
| --- | --- | --- |
| `defineProps<Props>()` | Публичные business-входы | [Component SFC](/reference/component-sfc) |
| `definePorts({...})` | Required/provided Actions, Query/Computation/Component и Events, forwarding | [Порты](/reference/component-sfc#направления-портов) |
| `definePreviewProps({...}, options?)` | Preview fixtures и подготовка runtime | [Preview props](/reference/component-sfc#preview-props) |
| `defineMetadata({...})` | Статическая metadata всего документа | [Metadata](/reference/metadata) |

Макросы объявляются на верхнем уровне. Не вызывайте их внутри функций, условий или циклов. `definePorts` описывает один manifest; одинаковые публичные имена props/ports, повторные декларации и неправильные направления диагностируются compiler-ом. `defineMetadata` — один статический JSON object без вычислений.

## Локальный Computation resource

```vue
<script setup lang="ts">
interface Props { amount: number }
interface Input { amount: number }
interface Result { label: string }

const props = defineProps<Props>()
const ports = definePorts({
  require: {
    summary: computation<Input, Result>({ default: 'item-summary' }),
  },
})
const summary = ports.require.summary({ amount: props.amount })
</script>

<template>
  <Text if="summary.loading">Загрузка</Text>
  <Text else-if="summary.error">{{ summary.error.message }}</Text>
  <Text else>{{ summary.value?.label }}</Text>
</template>
```

Это пример с внешней зависимостью: Computation `item-summary` должна существовать и иметь совместимый input/result. Вызов Computation создаётся в top-level `const`, принимает один object input и принадлежит lifecycle экземпляра компонента. Его состояния — `status`, `loading`, `value`, `error`; `refresh()` относится к resource API. При смене input применяется latest-wins.

Required Query и Action вызываются как reactions на события. Их нельзя запускать произвольным top-level кодом для скрытого side effect при рендере. Component port регистрирует локальный tag с default provider; произвольное имя с заглавной буквы без регистрации не является встроенным тегом.

## Что не переносится из обычного приложения

- `import` произвольного handler не предоставляет runtime capability Source SFC.
- Vue `ref`, `watch`, `computed`, lifecycle hooks и DOM APIs не являются макросами Endge.
- Произвольная `const`-переменная не превращается в вычисляемое runtime state только потому, что parser видит её имя.
- Функция из script не становится разрешённой template callback.
- `defineEmits` и `defineEvents` не заменяют `definePorts.emits`.
- Наличие пользовательского TypeScript в `typescript.compute` не открывает доступ к `Endge`, transport или DOM.

Логику подготовки данных выражайте в DataView/Computation; эффекты — в Action, Query и Update; связи и lifecycle — в Composition. Для обычного TypeScript host применяются [публичные API библиотек](/reference/contracts/), а не правила script Source.

## Preview и сохранение

Preview fixtures не меняют production defaults. `definePreviewProps` может содержать inline values и runtime-backed `fromStore`/`fromData` с разрешёнными preview options. Запуск draft использует временный artifact reader и не сохраняет документ автоматически. Контекстные и standalone запуски различаются: [Runtime Preview](/configurator/runtime-preview-workspace).

## Parser и contracts

[Разбор SFC](https://github.com/endge-lab/core/blob/main/src/features/core/modules/compiler/services/component-sfc/component-sfc-parse.ts), [анализ script](https://github.com/endge-lab/core/blob/main/src/features/core/modules/compiler/services/component-sfc/component-sfc-script.ts), [compile/linking](/reference/contracts/core/compiler), [выражения template](/reference/sfc-expressions).
