# Обзор Local Runtime

Local Runtime хранит быстрые свойства непосредственно на `RaphNode` и связывает их изменения с dirty phases.

Он подходит для состояния, которое принадлежит конкретной ноде:

- visibility и opacity;
- position и размеры;
- layout-флаги;
- render-state;
- интерактивные состояния runtime-объекта.

Raph не связывает Local API с DOM, Canvas или конкретным renderer. Один и тот же механизм может использоваться любым node-based runtime.

## Отличие от shared data

| Shared data | Local Runtime |
| --- | --- |
| Принадлежит `RaphKernel` | Принадлежит `RaphNode` |
| Адресуется через `DataPath` | Адресуется именем свойства |
| Видна всем runtime lanes kernel | Видна через конкретную node |
| Публикует path events | Помечает node dirty в связанной phase |
| Подходит для business/application data | Подходит для transient runtime state |

Оба слоя могут жить в одном runtime. Например, общая коллекция задач хранится в kernel, а вычисленные layout bounds каждой визуальной ноды — локально.

## Основные сущности

- `RaphLocalPropertyRuntime` связывает property с phase, default value, compute и propagation;
- `RaphLocalPhaseRuntime` хранит порядок properties и запускает их обработку;
- `RaphPropagation` определяет распространение dirty state по tree;
- decorators описывают properties, phases и after-hooks на классах;
- `Raph.configureLocal` собирает простой local runtime из decorator metadata.

## Запись значения

Если property зарегистрирована в runtime, используйте `node.set`:

```ts
node.set('x', 10)
const x = node.get('x')
```

`node.set` записывает значение и помечает связанную phase dirty.

`node.local.set` и `node.setLocal` являются низкоуровневой прямой записью. Они обходят property descriptor и сами не ставят phase в dirty queue:

```ts
node.local.set('x', 10)
node.dirty('layout')
```

Используйте raw local API только когда lifecycle и invalidation явно контролируются вызывающим owner.

## Tree

Local propagation использует `parent` и `children`, создаваемые через `addChild`. Несвязанные dependency edges не создают local inheritance автоматически.

