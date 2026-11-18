---
description: "Серверная пагинация / пейджинг: Query с offset и limit, Action, Store, Update и внешние элементы управления; отличия от локального Table paging, GraphQL, фильтров и группировки."
---

# Серверная пагинация через Query

::: tip Два версионных маршрута
Этот ручной Action/Query рецепт сохраняет опубликованный baseline Core `1.0.0-dev.12` / UI `1.0.0-dev.11`. Для двунаправленного скролла в Core `1.2.0-dev.15` / UI `2.0.0-dev.14` используйте [Controller collection-window](/guides/collection-window): Store + guarded Update + Query + typed viewport. Новый Controller не меняет `lazy` и не добавляет global scrollbar/remote seek.
:::

**Серверную загрузку страниц в Endge можно собрать. Готового серверного
режима встроенного пагинатора Table сейчас нет.** Query передаёт параметры
API источника, а приложение хранит состояние страницы и показывает ответ.
Требования к API определяет источник данных, а не факт использования REST/GraphQL.

## Матрица сценариев {#capabilities}

| Сценарий | Статус и владелец |
| --- | --- |
| Передать offset/limit, page/pageSize или cursor | Query props → REST request body/query params либо GraphQL variables |
| Заново выполнить запрос с другими параметрами | Action Query step либо явный Composition hook |
| Показать серверную страницу | Приложение публикует результат в Store и передаёт rows в Table |
| Встроенный серверный пагинатор, внешний totalCount, lazy loading | Не реализованы контрактом Table |
| Локальные страницы и виртуализация | Table работает с переданным массивом |
| Глобальные фильтры/сортировка/агрегаты | API источника выполняет операции до разбиения на страницы |
| Сводные строки от API | Можно показывать как обычные строки |
| Раскрываемые группы, grouped-row model и агрегаты Table | Публичный grouping/aggregation contract не объявлен |

## Граница встроенной таблицы {#table-boundary}

Встроенный paginator вычисляет число страниц по длине `rows` и ограничивает
номер страницы этим числом. Например, 25 загруженных записей при 10 000 на
сервере для него означают одну страницу. Событие `pageChanged` описывает это
локальное состояние. Один обработчик события не добавляет поддержку
серверного total и не отключает локальное разбиение. `lazy` этого не меняет.

В примере ниже внешние элементы управления запускают запрос, а `paging="virtual"`
показывает только полученную страницу без второго локального пагинатора.
Виртуализация не подгружает данные. `sort-mode="disabled"` исключает
сортировку одной страницы, которую можно ошибочно принять за сортировку всех данных.

## Минимальный сквозной пример

Цикл: **событие → Action → Query(offset, limit) → Update → Store → Table**.
Первый запрос явно запускается нажатием «Загрузить / обновить»; скрытого
запроса при рендере здесь нет. Action вызывается внутри Composition, чтобы
Update мог найти принадлежащий ей Store. Для обычного host-кода без Component
нужно передавать Action контекст родительского runtime.

API `GET https://api.example.test/orders?offset=0&limit=25` в примере —
**условный внешний сервис**, не endpoint Service Backend Endge. Он должен
вернуть `{ rows: [...], total: 10000 }`. Замените endpoint и output mapping
на контракт вашего сервиса. Для GET вычисленный `body` отправляется как URL
query parameters. Нужную авторизацию задайте в Query явно.

Создайте документы в указанном порядке. JSON-блоки являются телами запросов,
Source находится в поле `source`. `storeIdentity` Update — поле HTTP DTO,
а не параметр `defineUpdate`.


### Страница заказов

```ts
defineStore({
  data: {
    rows: value([]).contract(field('Object').array()),
    total: value(0),
    offset: value(0),
    limit: value(25),
  },
})
```

::: details Полное тело POST /api/v1/stores

```json [POST /api/v1/stores]
{
  "identity": "orders-page-state",
  "displayName": "Страница заказов",
  "sourceVersion": 1,
  "source": "defineStore({\n  data: {\n    rows: value([]).contract(field('Object').array()),\n    total: value(0),\n    offset: value(0),\n    limit: value(25),\n  },\n})"
}
```

:::


### Запрос страницы

```ts
defineQuery({
  kind: 'rest',
  props: defineProps({
    offset: field('Number').default(0),
    limit: field('Number').default(25),
  }),
  request: {
    endpoint: 'https://api.example.test',
    path: '/orders',
    method: 'GET',
    body: body(({ prop }) => ({ offset: prop('offset'), limit: prop('limit') })),
  },
  outputs: { page: output().from(response()) },
  mock: { enabled: false, data: { rows: [{ id: 'order-1', number: 'A-1' }], total: 1 } },
})
```

::: details Полное тело POST /api/v1/queries

```json [POST /api/v1/queries]
{
  "identity": "orders-page",
  "displayName": "Запрос страницы",
  "sourceVersion": 2,
  "source": "defineQuery({\n  kind: 'rest',\n  props: defineProps({\n    offset: field('Number').default(0),\n    limit: field('Number').default(25),\n  }),\n  request: {\n    endpoint: 'https://api.example.test',\n    path: '/orders',\n    method: 'GET',\n    body: body(({ prop }) => ({ offset: prop('offset'), limit: prop('limit') })),\n  },\n  outputs: { page: output().from(response()) },\n  mock: { enabled: false, data: { rows: [{ id: 'order-1', number: 'A-1' }], total: 1 } },\n})"
}
```

:::


### Принятая страница

```ts
defineUpdate({
  handles: [],
  mutations: [
    { strategy: 'set', target: 'rows', valueFrom: 'rows' },
    { strategy: 'set', target: 'total', valueFrom: 'total' },
    { strategy: 'set', target: 'offset', valueFrom: 'offset' },
    { strategy: 'set', target: 'limit', valueFrom: 'limit' },
  ],
})
```

::: details Полное тело POST /api/v1/updates

```json [POST /api/v1/updates]
{
  "identity": "orders-page-received",
  "displayName": "Принятая страница",
  "storeIdentity": "orders-page-state",
  "sourceVersion": 1,
  "source": "defineUpdate({\n  handles: [],\n  mutations: [\n    { strategy: 'set', target: 'rows', valueFrom: 'rows' },\n    { strategy: 'set', target: 'total', valueFrom: 'total' },\n    { strategy: 'set', target: 'offset', valueFrom: 'offset' },\n    { strategy: 'set', target: 'limit', valueFrom: 'limit' },\n  ],\n})"
}
```

:::


### Загрузить страницу

```ts
defineAction({
  contract: { input: field('Object'), output: field('Object') },
  steps: {
    paging: {
      offset: choose([
        { when: eq(input('direction'), 'first'), then: 0 },
        { when: eq(input('direction'), 'previous'), then: clamp(subtract(input('offset'), input('limit')), 0, input('offset')) },
      ], add(input('offset'), input('limit'))),
      limit: input('limit'),
    },
    request: query({ identity: 'orders-page', input: output('paging') }),
    publish: update({
      identity: 'orders-page-received',
      input: {
        rows: output('request').get('page.rows'),
        total: output('request').get('page.total'),
        offset: output('paging').get('offset'),
        limit: output('paging').get('limit'),
      },
    }),
  },
  output: output('publish'),
})
```

::: details Полное тело POST /api/v1/actions

```json [POST /api/v1/actions]
{
  "identity": "orders-load-page",
  "displayName": "Загрузить страницу",
  "sourceVersion": 1,
  "source": "defineAction({\n  contract: { input: field('Object'), output: field('Object') },\n  steps: {\n    paging: {\n      offset: choose([\n        { when: eq(input('direction'), 'first'), then: 0 },\n        { when: eq(input('direction'), 'previous'), then: clamp(subtract(input('offset'), input('limit')), 0, input('offset')) },\n      ], add(input('offset'), input('limit'))),\n      limit: input('limit'),\n    },\n    request: query({ identity: 'orders-page', input: output('paging') }),\n    publish: update({\n      identity: 'orders-page-received',\n      input: {\n        rows: output('request').get('page.rows'),\n        total: output('request').get('page.total'),\n        offset: output('paging').get('offset'),\n        limit: output('paging').get('limit'),\n      },\n    }),\n  },\n  output: output('publish'),\n})"
}
```

:::


### Заказы с внешним пейджингом

```vue
<script setup lang="ts">
interface Props {
  rows: Array<{ id: string; number: string }>
  total: number
  offset: number
  limit: number
}
const props = defineProps<Props>()
const ports = definePorts({
  require: { load: action<{ offset: number; limit: number; direction: string }, unknown>({ default: 'orders-load-page' }) },
})
</script>
<template>
  <Flex col gap="2">
    <Text @click="ports.require.load({ offset: 0, limit: props.limit, direction: 'first' })">Загрузить / обновить</Text>
    <Text if="props.offset > 0" @click="ports.require.load({ offset: props.offset, limit: props.limit, direction: 'previous' })">Назад</Text>
    <Text if="props.offset + props.limit < props.total" @click="ports.require.load({ offset: props.offset, limit: props.limit, direction: 'next' })">Далее</Text>
    <Text>Смещение {{ props.offset }}, всего {{ props.total }}</Text>
    <Table id="orders-page" :rows="props.rows" row-key="id" paging="virtual" sort-mode="disabled">
      <Column key="number" title="Номер" />
    </Table>
  </Flex>
</template>
```

::: details Полное тело POST /api/v1/components

```json [POST /api/v1/components]
{
  "identity": "orders-page-screen",
  "displayName": "Заказы с внешним пейджингом",
  "modelVersion": 1,
  "source": "<script setup lang=\"ts\">\ninterface Props {\n  rows: Array<{ id: string; number: string }>\n  total: number\n  offset: number\n  limit: number\n}\nconst props = defineProps<Props>()\nconst ports = definePorts({\n  require: { load: action<{ offset: number; limit: number; direction: string }, unknown>({ default: 'orders-load-page' }) },\n})\n</script>\n<template>\n  <Flex col gap=\"2\">\n    <Text @click=\"ports.require.load({ offset: 0, limit: props.limit, direction: 'first' })\">Загрузить / обновить</Text>\n    <Text if=\"props.offset > 0\" @click=\"ports.require.load({ offset: props.offset, limit: props.limit, direction: 'previous' })\">Назад</Text>\n    <Text if=\"props.offset + props.limit < props.total\" @click=\"ports.require.load({ offset: props.offset, limit: props.limit, direction: 'next' })\">Далее</Text>\n    <Text>Смещение {{ props.offset }}, всего {{ props.total }}</Text>\n    <Table id=\"orders-page\" :rows=\"props.rows\" row-key=\"id\" paging=\"virtual\" sort-mode=\"disabled\">\n      <Column key=\"number\" title=\"Номер\" />\n    </Table>\n  </Flex>\n</template>"
}
```

:::


### Серверный пейджинг

```ts
defineComposition({
  data: { page: store('orders-page-state') },
  runtimes: {
    screen: component('orders-page-screen').withProps({
      rows: fromData('page.rows'), total: fromData('page.total'),
      offset: fromData('page.offset'), limit: fromData('page.limit'),
    }),
  },
})
```

::: details Полное тело POST /api/v1/compositions

```json [POST /api/v1/compositions]
{
  "identity": "orders-page-example",
  "displayName": "Серверный пейджинг",
  "sourceVersion": 1,
  "source": "defineComposition({\n  data: { page: store('orders-page-state') },\n  runtimes: {\n    screen: component('orders-page-screen').withProps({\n      rows: fromData('page.rows'), total: fromData('page.total'),\n      offset: fromData('page.offset'), limit: fromData('page.limit'),\n    }),\n  },\n})",
  "kind": "workspace"
}
```

:::


В демонстрационном Source используются встроенные `Text` с обработчиком click.
Тег `Button` не является встроенным в Endge SFC: для полноценной кнопки с
клавиатурным управлением используйте зарегистрированный Component port вашего UI.

## Ошибки, конкуренция и смена фильтров

Минимальный пример показывает последовательную загрузку страниц. Update идёт
после успешного Query, поэтому ошибка запроса не заменяет текущие строки и
подтверждённый offset. Ошибка Action должна быть показана вызывающим UI.
Loading/error принадлежат внешнему runtime/host, у Table таких props нет.

Для рабочего экрана host должен запрещать повторный запуск во время запроса
или использовать управляемый Query runtime с правилом последнего запроса.
Action-вызовы создают отдельные запросы: latest-wins одного QueryRuntimeHost
не гарантирует порядок между параллельными Action. Не выдавайте этот пример
за готовую защиту от конкурирующих кликов. При unmount освобождайте ресурсы
через runtime lifecycle; не заводите глобальные подписки для пейджинга.

Изменение размера страницы или фильтра возвращает offset к 0. Порядок должен
быть устойчивым на стороне сервера (например, дата и уникальный id), иначе
записи между страницами могут повторяться или пропадать. При удалении последней
страницы приложение выбирает допустимое смещение и повторяет запрос.
Для cursor API храните серверные cursors и hasMore: произвольный переход к
номеру страницы и total могут не поддерживаться этим API.

## Другие способы запуска и GraphQL

В Composition `.withProps(...)` задаёт входы, `.storeTo(...)` — публикацию,
`onMount().run(...)` — начальный запуск, а `onChange(prop('…')).run(...)` —
повторный запуск. **Изменение binding само по себе не запускает Query.**
`onChange(fromData(...))` не является поддерживаемой формой hook.
Используйте объявленный prop или named output runtime: [точный контракт hooks](/reference/composition#hooks).

GraphQL меняет транспорт, но не разделение ответственности. Объявите переменные
operation и сопоставьте их с `prop('offset')`/`prop('limit')` в `variables`;
output читает `data(...)`. Имена arguments, connection/edges/pageInfo,
поддержку total и группировки определяет схема сервера. [Query REST/GraphQL](/reference/query).

## Версии и дальнейшее чтение

Контракт примера рассчитан на опубликованные `@endge/core@1.0.0-dev.12`
и `@endge/ui-vue@1.0.0-dev.11`. Это фиксированный baseline примера,
а не обещание, что npm latest или работающий стенд имеют эти версии.
[Как установить точную версию и открыть её исходники](/agents/repositories#versions).

- [Query props и outputs](/reference/query).
- [Action Query/Update steps](/reference/action).
- [Store](/reference/store) и [Update](/reference/update).
- [Событие Component → Composition → Action](/reference/composition-events).
- [Локальный пейджинг и виртуализация](/sfc-tables/paging-and-virtualization).
- [Данные, поиск и фильтры](/sfc-tables/data-search-filters).
- [Матрица ограничений адаптера](/sfc-tables/adapters-and-limitations).
