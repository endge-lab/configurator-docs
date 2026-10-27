---
description: "Store Source — runtime-набор writable-данных и производных полей: корень и порядок полей, mock initializer, подключение, владение и lifecycle."
---

# Store Source

Store объявляет принадлежащий runtime набор writable-данных и производных полей. Persisted документ хранит `sourceVersion: 1` и авторский `defineStore(...)`; значения смонтированного Store не записываются обратно в этот source. В REST API используется коллекция `stores`.

## Полный самостоятельный Source

```ts
defineStore({
  data: {
    items: value([]).contract(field('Object').array()),
    selectedId: value(null),
    activeItems: derived()
      .from('items')
      .select(path('').where(match({ active: true })))
      .contract(field('Object').array()),
  },
})
```

`Object` в примере — встроенный тип. Для строгого доменного контракта замените его identity созданного Type, например `field('Item')`. Это потребует существования соответствующего Type в текущем Domain.

## Корень и порядок полей

`defineStore` принимает один object literal с `data` и необязательной статической `metadata`. `data` — object literal с уникальными именами полей. Каждый элемент имеет форму `value(...)` или `derived().from(...)`.

Поля обрабатываются в порядке Source. `derived().from('items')` ссылается на **ранее объявленное поле того же Store**. Forward references и ссылки на другой Store не разрешены. Производное поле может зависеть от другого уже объявленного derived-поля.

| Форма | Аргументы | Поведение |
| --- | --- | --- |
| `value(initial)` | Один JSON-compatible literal либо `mock('identity')` | Начальное изменяемое значение |
| `value(initial).contract(field(Type))` | Field contract, включая `.array()` и `.optional()` | Тип writable-поля |
| `derived().from('field')` | Статическое имя предыдущего поля | Источник производного значения |
| `.dataView('identity')` | Ссылка на глобальный DataView | Преобразует всё текущее значение |
| `.dataView(defineDataView({...}))` | Inline DataView | Не создаёт отдельный Domain document |
| `.dataView(contextSwitch({...}))` | Варианты DataView по фасетам | Проверяются все ветки, исполняется выбранная |
| `.select(expression)` | Object projection или ValueExpression | Короткая форма inline DataView |
| `.contract(field(Type))` | Один field contract | Тип итогового значения |

У derived-поля обязателен хотя бы один `.dataView(...)` или `.select(...)`. Несколько преобразований применяются последовательно. В `.select(...)` источник доступен через DataView reader `path(...)`, а не через `input`, `response` или runtime alias Composition. Сам `value(...)` принимает статический initializer; ValueExpression в initializer не выполняется.

## Mock initializer

```ts
defineStore({
  data: {
    items: value(mock('items-fixture')),
  },
})
```

Mock с такой identity должен существовать. Fixture materialize-ится при создании Store в effective mock mode. В live-режиме mock initializer даёт `undefined`; выбор режима определяет runtime-контракт Mock; см. [Mock data](/reference/mock). Не используйте fixture как скрытый production default. Изменение fixture или режима у уже созданного Store не пересоздаёт его данные автоматически.

## Подключение и владение

```ts
defineComposition({
  data: {
    records: store('records'),
  },
  runtimes: {
    list: component('item-list').withProps({
      items: fromData('records.activeItems'),
    }),
  },
})
```

Это фрагмент связанного сценария: нужны Store `records` и Component SFC `item-list` с публичным prop `items`. Alias `records` локален для Composition. Правила `.contextual()`, `.isolated()`, `.injected()`, `.slot(...)` и `.withData(...)` определяют создание или заимствование экземпляра; полный контракт — [Composition](/reference/composition#data-и-resources).

Query публикует output в writable-поле только через Composition `.storeTo(...)`. Stream направляет события через `.dispatchTo(...)`. [Update](/reference/update) принадлежит одному Store, а его `handles` формирует таблицу обработчиков этого Store. Один тип события не может принадлежать двум Updates одного Store.

Derived-поля доступны для чтения. Записывать в них через Update или публикацию Query запрещено. Raph Meta может аннотировать существующий путь derived-значения без изменения Data.

## Lifecycle и ошибки

Создание владельца и заимствование contextual Store — разные операции: borrower не сбрасывает данные provider-а. При уничтожении owning runtime освобождаются derived handles, subscriptions и принадлежащие ему данные. Persistence Filter/Table не сохраняет Store data.

| Diagnostic | Причина |
| --- | --- |
| `store-source-define-missing` | Нет `defineStore({...})` |
| `store-source-property-unsupported` | Неизвестное корневое свойство |
| `store-data-duplicate` | Повтор имени поля |
| `store-value-static` | Initializer не static JSON и не `mock(identity)` |
| `store-value-method` | Неподдерживаемый modifier writable-поля |
| `store-derived-source` | Нет `.from(field)` |
| `store-derived-forward-reference` | Источник не объявлен выше |
| `store-derived-transform` | Нет преобразования |
| `store-derived-method` | Неизвестный modifier derived-поля |
| `store-contract-duplicate` | Повторный contract |

Точные types и методы: [Source API](/reference/contracts/core/source), [runtime API](/reference/contracts/core/runtime). Реализация синтаксиса: [store-source-compile.ts](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/services/compilers/store-source-compile.ts).
