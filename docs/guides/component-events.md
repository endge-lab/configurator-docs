# События Component SFC на практике

Это руководство показывает основные варианты `definePorts.emits`. Во всех
вариантах Event остаётся публичным multicast-контрактом. Поле `action` только
добавляет реакцию.

## Только собственный контракт

```ts
const ports = definePorts({
  emits: {
    detailsOpened: event<{ id: string }>(),
  },
})
```

Такое событие можно испустить из разрешённой sandbox-реакции через
`ports.emits.detailsOpened({ id })` или через API runtime-host-а у системного
producer-а.

## Событие дочерней Table

```vue
<script setup lang="ts">
const ports = definePorts({
  emits: {
    rowActivated: event<TableRowActivatedEvent>({
      from: { ref: 'table', event: 'rowActivated' },
    }),
  },
})
</script>

<template>
  <Table ref="table" :rows="rows" row-key="id" />
</template>
```

## Direct Action

```ts
rowActivated: event<TableRowActivatedEvent>({
  from: { ref: 'table', event: 'rowActivated' },
  action: {
    identity: 'flight.open-details',
    input: {
      id: event('rowId'),
      row: event('row'),
    },
  },
})
```

`event()` передаёт весь payload. `event('row.id')` читает вложенное значение.

## TypeScript в песочнице

```ts
const ports = definePorts({
  emits: {
    detailsOpened: event<{ id: string }>(),
    rowContextMenuRequested: event<TableRowContextMenuRequestedEvent>({
      from: { ref: 'table', event: 'rowContextMenuRequested' },
      action: typescript({
        inputs: { event: event() },
        compute({ event }, api) {
          return [
            api.action('audit.write', { rowId: event.rowId }),
            ports.emits.detailsOpened({ id: event.rowId }),
          ]
        },
      }),
    }),
  },
})
```

Этот вариант следует использовать только когда direct Action недостаточен.
Песочница не предоставляет DOM, сеть, imports, timers или прямой `Endge`.

## Выборочный forwarding

```ts
const ports = definePorts({
  forward: {
    from: 'table',
    ports: {
      emits: ['rowActivated', 'selectionChanged'],
    },
  },
})
```

## Forwarding всех событий

```ts
const ports = definePorts({
  forward: {
    from: 'table',
    ports: {
      emits: '*',
    },
  },
})
```

Явное одноимённое поле в `emits` может дополнить forwarded Event реакцией, если
origin совпадает. Остальные коллизии остаются ошибками compiler-а.

## Визуальный редактор

В редакторе Table раздел «События» показывает встроенные события и позволяет
выбрать Action, режим «Без реакции» или TypeScript. Раздел «Порты» управляет
`require`, `provides`, `emits` и `forward`.

Изменения сразу патчат Source. Ручное изменение Source сразу восстанавливается в
UI. Если `definePorts` содержит spread, computed keys или другую сложную
конструкцию, редактор переходит в source-only и не переписывает блок.
