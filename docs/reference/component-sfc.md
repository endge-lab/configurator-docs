# Component SFC

ComponentSFC — основной исполняемый документ интерфейса. Он объединяет публичные порты, template, локальную логику и EndgeCSS-стили в одном source-документе.

Выражения Component SFC имеют отдельный renderer-neutral контракт и не являются [ValueExpression](/reference/value-expressions). Общий функциональный API применяется в Query, DataView, Computation и bindings Composition, а компонент получает уже подготовленные ресурсы через ports и props.

## Структура

```vue
<script setup lang="ts">
interface Input {
  rows: unknown[]
}

interface Output {
  rows: unknown[]
  total: number
}

const ports = definePorts({
  board: computation<Input, Output>({
    default: 'item-list-state',
  }),
})

const board = ports.board({ rows: props.rows })
</script>

<template>
  <Stack class="board">
    <Text>Рейсы</Text>
    <Table if="board.value" :rows="board.value.rows" />
  </Stack>
</template>

<style scoped lang="endgecss">
.board {
  gap: 12px;
}
</style>
```

Конкретный набор UI-примитивов зависит от установленного runtime и UI-регистра.

## Порты

Порт — типизированная точка подключения Component SFC к внешней исполняемой сущности Endge. Через порт компонент объявляет необходимую зависимость, но не связывается напрямую с её runtime-host, расположением в Store или деталями реализации.

::: info Граница порта
**Component SFC → типизированный порт → runtime-ресурс или дочерний компонент**

Порт принадлежит компоненту-потребителю. Подключаемая Computation или Component SFC ничего не знает о том, кто и где её использует.
:::

Порты объявляются одним top-level вызовом `definePorts({...})` внутри `<script setup>`. Сейчас поддерживаются два вида: `computation` и `component`.

### Computation port

Computation port подключает [Computation](/reference/computation) и превращает её результат в реактивный ресурс компонента:

```ts
interface ProcessInput {
  process: Process
}

interface ProcessState {
  target: string
  highlighted: boolean
}

const ports = definePorts({
  state: computation<ProcessInput, ProcessState>({
    default: 'item-state',
  }),
})

const state = ports.state({
  process: props.process,
})
```

| Часть объявления | Значение |
| --- | --- |
| `state` | Локальное имя порта внутри компонента |
| `ProcessInput` | Тип объекта, передаваемого в Computation |
| `ProcessState` | Тип результата Computation |
| `default` | Identity Computation по умолчанию |
| `ports.state(input)` | Создание реактивного ресурса для указанного input |

Вызов Computation port должен инициализировать top-level `const` и принимать ровно один object input. Compiler фиксирует зависимость от Computation, а также проверяет наличие, kind и активность provider.

Параметры `<Input, Output>` задают типизированный контракт на стороне Component SFC и сохраняются в manifest. В текущей версии compiler ещё не сравнивает их автоматически с persisted input/output metadata самой Computation.

### Component port

Component port подключает другой Component SFC как типизированный локальный template tag:

```ts
interface DetailsProps {
  process: Process
}

const ports = definePorts({
  details: component<DetailsProps>({
    default: 'item-details',
    tag: 'ProcessDetails',
  }),
})
```

```vue
<ProcessDetails :process="props.process" />
```

- `DetailsProps` задаёт публичные props дочернего компонента;
- `default` указывает его identity;
- `tag` объявляет локальное имя, доступное в template;
- Component port не вызывается как функция в script.

Compiler сохраняет оба вида портов в manifest скомпилированного Component SFC и включает providers в список его зависимостей.

## Состояния ресурса

Computation port возвращает ресурс, состояние которого следует отображать явно:

| Поле | Значение |
| --- | --- |
| `status` | `idle`, `pending`, `success` или `error` |
| `loading` | Выполнение ещё не завершено |
| `value` | Последний успешно вычисленный результат |
| `error` | Структурированная ошибка Computation либо `null` |
| `refresh()` | Принудительный повторный запуск |

```vue
<Text if="state.loading">Вычисление…</Text>
<Text else-if="state.error" color="danger">
  {{ state.error.message }}
</Text>
<Text else-if="state.value">{{ state.value.target }}</Text>
<Text else>Нет данных</Text>
```

Runtime пересчитывает ресурс при изменении input. Если вычисление содержит `typescript`-узел, ресурс проходит через `pending`; для полностью синхронного expression-графа результат может быть доступен сразу. При уничтожении Component SFC его ресурсы и подписки освобождаются.

## Renderer-neutral контракт

Теги template обозначают абстрактные UI-примитивы, а не HTML-элементы. Адаптер представления решает, как материализовать их в конкретной среде. То же относится к `state`, `part` и EndgeCSS.

## Жизненный цикл

После компиляции `ComponentSFCRuntimeHost` создаёт ресурсы портов, следит за реактивными входами и освобождает подписки при уничтожении. Vue-адаптер только отображает состояние host.

Если props компонента формируются в runtime-графе, их источник и преобразование описываются в [`component(...).withProps({...})`](/reference/composition#передача-props).

## Legacy-документ Component

Старый `Component` хранит Table/DSL/JSX-конфигурацию как data-only документ. Он не создаёт runtime-host. Для нового исполняемого интерфейса используется ComponentSFC.
