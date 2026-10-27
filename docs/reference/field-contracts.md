---
description: "Общий контракт field(...) авторского Source: объявление типизированного значения, модификаторы, тип по структурному контексту и диагностика."
---

# Общий контракт field

`field(...)` — синтаксис авторского Source для объявления типизированного значения. Это не конструктор JavaScript и не универсальная схема валидации backend. Его используют, в частности, props Query/Stream/Composition, Filter fields и объявления Configuration. Допустимый источник значения и набор readers задаёт владеющий документ.

```ts
field('String').optional().default('')
field('Number').array().default([])
field('String').options([
  { value: 'new', label: 'Новая запись' },
  { value: 'done', label: 'Готово' },
])
field('String').vocab('categories', {
  valuePath: 'code',
  labelPath: 'title',
})
```

В строке типа можно использовать primitive identity или identity существующего доменного Type. Примитивы: `String`, `Number`, `Boolean`, `Date`, `Time`, `DateTime`, `Object`. Для доменного типа сначала создайте Type; не подменяйте ссылку inline TypeScript interface. В hosts, явно допускающих inline type expressions, поддерживаются `objectOf` и `recordOf`; это разрешение не переносится автоматически на остальные hosts.

## Модификаторы

| Форма | Семантика и ограничения |
| --- | --- |
| `.optional()` | Необязательное значение |
| `.array()` | Массив значений данного типа |
| `.default(expression)` | Начальное значение; expression проверяется по контексту host |
| `.options([{ value, label? }])` | Статические варианты: value — string, number или boolean; label — строка |
| `.vocab(identity, { valuePath, labelPath })` | Варианты из Vocab; оба пути обязательны |
| `.meta({ namespace: { ... } })` | Статическая JSON-compatible namespaced metadata |
| `.from(filter(identity).output(name))` | Источник значения из Filter output там, где host поддерживает default source |
| `.from(defineFilter({ ... }).output(name))` | Inline Filter output с тем же ограничением host |

`.options` и `.vocab` взаимоисключающие. `.default` и `.from` также взаимоисключающие. `null` не допускается как option value; пустой список options даёт warning. Литеральный default проверяется на соответствие типу и array-флагу; nullable initial value не превращает optional в отдельный primitive type.

Metadata принимает object literal без spread, computed keys и функций; она не становится state поля. [Select metadata](/reference/metadata) управляет представлением независимо от значения.

## Тип, зависящий от структурного контекста

```ts
field(contextSwitch({
  default: 'Item',
  cases: [
    { when: { variant: 'variant-a' }, use: type('ExtendedItem') },
  ],
})).array()
```

Здесь `variant` — заранее созданный Facet, а `variant-a` — его существующий документ. `Item` и `ExtendedItem` также должны существовать. Compiler проверяет все варианты и фиксирует выбранный в artifact; это не runtime-переключение типа каждой строки. Синтаксис `when` и selection rules см. в [контексте](/reference/value-expressions).

## Диагностика и порядок проверки

Ошибки общего parser имеют prefix `source-field-`: `shape`, `type`, `method-unsupported`, `options-vocab-conflict`, `default-source-conflict`, `default-type`, `vocab-paths`, `from-output`, `meta-duplicate`. После них возможны host-specific ошибки, например запрет Filter default source в Stream props или ссылка на отсутствующий Type/Vocab. Исправляйте общий синтаксис, затем ссылки и ограничения host.

[Владеющий parser](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/services/compilers/source-field-compile.ts). [Source contracts](/reference/contracts/core/source).
