---
description: "Event-hooks Composition: onEvent связывает Event Component runtime с эффектом; terminal effects, область input, порядок, lifecycle и диагностика."
---

# Event-hooks Composition

`onEvent(runtimeAlias, eventName)` связывает опубликованный Event Component runtime с одним эффектом. Этот механизм дополняет Query-hooks `onMount`, `onChange` и `onSuccess`; data bindings в `.withProps(...)` сами по себе не запускают эффект.

## Три terminal effects

Следующий фрагмент требует Store `records`, принадлежащий ему Update `rename-item`, Action `audit.record` и Component SFC `item-list`, который публично объявляет `renamed`, `opened` и `selected`.

```ts
defineComposition({
  data: { records: store('records') },
  runtimes: { list: component('item-list') },
  hooks: [
    onEvent('list', 'renamed').applyUpdate(
      data('records'),
      update('rename-item'),
      { id: event('id'), name: event('name') },
    ),
    onEvent('list', 'opened').executeAction(
      action('audit.record'),
      { id: event('id'), occurredAt: now() },
    ),
    onEvent('list', 'selected').mutate(data('records'), {
      strategy: 'set',
      path: 'selectedId',
      value: event('id'),
    }),
  ],
})
```

| Terminal | Аргументы | Результат |
| --- | --- | --- |
| `.applyUpdate(data(alias), update(identity), input?)` | Объявленный Store alias, Update identity и optional mapping | Применяет именованный Store-owned Update |
| `.executeAction(action(identity), input?)` | Action identity и optional mapping | Выполняет Action через его effective implementation |
| `.mutate(data(alias), mutation)` | Store alias и mutation object | Одно локальное изменение Store |

Без input mapping Update/Action получает payload Event. `mutate` принимает `strategy: 'set' | 'replace' | 'merge' | 'append' | 'remove'`, статический `path`, необязательный `value` и `vars`. Ключ здесь называется **`path`**; у persisted Update тот же смысл выражается через **`target`**. Не смешивайте эти shapes.

```ts
onEvent('list', 'renamed').mutate(data('records'), {
  strategy: 'set',
  path: 'items[id=$id].name',
  vars: { id: event('id') },
  value: event('name'),
})
```

Для переиспользуемой логики, нескольких mutations и `handles` создавайте [Update](/reference/update). Для последовательности разных effects используйте [Action](/reference/action). Один `onEvent` имеет ровно один terminal effect; chain нескольких `.mutate` или `.executeAction` не поддерживается.

## Область видимости input

| Выражение | Поддержка |
| --- | --- |
| `event()` | Весь опубликованный payload |
| `event('item.id')` | Значение по literal dot-path |
| `now()` | ISO UTC timestamp выполнения effect |
| `event('name') ?? 'Без названия'` | Nullish fallback |
| Literal, array, object со статическими ключами | Рекурсивный mapping |
| `row`, `$row`, `props`, `fromData(...)`, arbitrary ValueExpression | Не входят в Composition event input |

Источник должен быть **Component runtime** текущей Composition. Имя Event относится к его public manifest. Локальный `@click` вложенного тега не публикуется наружу автоматически: SFC объявляет `emits.from` или `forward`. Alias runtime и имя Event — непустые статические строки.

## Порядок и lifecycle

Подписка принадлежит Composition и её runtime-графу. Unmount освобождает подписки. Сначала producer публикует свой Event, затем Composition обрабатывает связанный effect по скомпилированному контракту. Event не возвращает значение в исходный template и не является вызовом предоставленного Action.

Запись направляется только в writable-данные принадлежащего/подключённого Store. Сам факт получения Event не сохраняет ничего на backend. Для server persistence явно вызывайте Query/Action с согласованным контрактом и обрабатывайте ошибки.

## Diagnostics

`composition-event-source` — неверные arguments; `composition-event-runtime-kind` — источник не Component; `composition-event-effect-count` — не один terminal; `composition-event-apply-update`, `composition-event-execute-action`, `composition-event-mutate-shape` — неверный effect; `composition-event-input` — неподдерживаемый mapping.

[Compiler](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/services/compilers/composition-source-compile.ts), [точные types](/reference/contracts/core/source), [Query-hooks](/reference/composition#hooks), [события SFC](/guides/component-events).
