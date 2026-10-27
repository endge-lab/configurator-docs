---
description: "Raph — TypeScript-библиотека реактивных данных с двумя контурами: standalone reactive core и Runtime с Kernel, phases и ownership."
---

# Raph

::: warning Страница не обновляется
Актуальная документация Raph — на сайте Raphy; публичный адрес сайта появится позже. Что из Raph нужно для работы с Endge — на странице [«Raph в Endge»](/reference/raph). Точные типы — в [контрактах Raph](/raph/contracts/).
:::

Raph — TypeScript-библиотека с двумя явно разделёнными контурами:

- standalone reactivity для дешёвых синхронных `signal/computed/effect/watch`;
- Runtime для owner lifecycle, фаз, path/meta sources, гранулярности и управляемого scheduler.

Runtime не имеет dirty-node queue. Единица исполнения — persistent binding
`phase + effect + consumer owner`. Producer добавляет cause в уже существующую
binding и ставит её в очередь максимум один раз.

## Основные сущности

| Сущность | Ответственность |
| --- | --- |
| `RaphReactivity` | Изолированный синхронный reactive graph |
| `RaphKernel` | Path/meta data, transactions и materialized derived |
| `RaphRuntime` | Owners, phases, scheduler и phase bindings |
| `RaphScope` | Lifecycle-владелец ресурсов без позиции в дереве |
| `RaphNode` | Scope с parent/children ownership |
| `PathHandle` | Ленивый reactive source одного data path |
| `RaphAggregate` | Immutable объединение нескольких Runtime sources |
| `Raph` | Явно конфигурируемый facade одного режима |

## Когда подходит Runtime

Runtime полезен, когда важны:

- детерминированный порядок фаз;
- lifecycle ресурсов вместе с owner;
- сортировка задач по consumer или source hierarchy;
- self/subtree/runtime granularity;
- path/meta события и причины выполнения;
- custom `process(batch)`, `defer` и `cancel`;
- animation-frame или microtask scheduling.

Для небольшого локального reactive graph используйте standalone
`RaphReactivity` или `Raph.configure({ mode: 'reactivity' })`.

## Следующие страницы

- [Быстрый старт](/raph/getting-started)
- [Какой API выбрать](/raph/choosing-api)
- [Kernel, Runtime и Node](/raph/architecture/kernel-runtime-node)
- [Phases, process и ordering](/raph/execution/phases-and-traversal)
- [Signals, Effects и Watch](/raph/reactive)

