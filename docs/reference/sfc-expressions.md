---
description: "Выражения template Component SFC: безопасный expression IR без JavaScript, область видимости, словарь конструкций, функции, control flow."
---

# Выражения Component SFC

Template Component SFC компилируется в безопасный expression IR. Runtime не выполняет произвольный JavaScript, `eval` или Vue component code. Этот язык отличается от [ValueExpression](/reference/value-expressions) документов Query/DataView/Computation.

## Чтение и область видимости

```vue
<Text>{{ props.title }}</Text>
<Text>{{ title }}</Text>
<Text if="items.length > 0">{{ items[0].name }}</Text>
<Text>{{ item?.name ?? 'Без названия' }}</Text>
```

`props` — object входов текущего экземпляра. Прямой alias `title` разрешается из locals, затем из props. Доступны только объявленные/переданные значения; имя JavaScript global не становится доступным автоматически.

`$context` содержит workspace, facets, пользователя, locale, theme, timezone, effective `config` и временный `input.keyboard`. Полей `$context.permissions` и `$context.features` в стандартном snapshot нет: передавайте business-флаги через props либо читайте объявленный Configuration через `$context.config.<identity>.<field>`. Состояние `$row`, `$column`, `$cell`, `$table` доступно только внутри соответствующей таблицы; см. [контекстные переменные](/sfc-tables/context-variables).

Чтение отсутствующего или nullish объекта возвращает `undefined`. Строки и массивы открывают `length` и числовой индекс. У objects читаются собственные свойства. `__proto__`, `prototype` и `constructor` заблокированы.

## Полный словарь expression-конструкций

| Конструкция | Пример | Особенности |
| --- | --- | --- |
| Literals | `'text'`, `42`, `true`, `null` | Также доступны `undefined`, `NaN`, `Infinity` |
| Массив | `[props.a, props.b]` | Без callback и spread |
| Object | `{ title: props.title, active: true }` | Статические ключи; computed keys/spread не входят в template object contract |
| Member | `props.item.name`, `props.items[0]` | Собственные поля, индекс, `length` |
| Selector | `items[id = 'item-1'].name` | Специальное расширение Endge: первый object с совпавшим собственным полем; это не присваивание |
| Template string | `` `Запись: ${props.title}` `` | Вставки сами являются безопасными выражениями |
| Unary | `!x`, `+x`, `-x`, `~x`, `typeof x`, `void x` | Без `delete` и mutation |
| Arithmetic | `+`, `-`, `*`, `/`, `%`, `**` | JavaScript numeric/string semantics |
| Comparison | `===`, `!==`, `==`, `!=`, `<`, `<=`, `>`, `>=` | `==` сохраняет coercion JavaScript; предпочитайте явные типы |
| Bitwise | `&`, `\|`, `^`, `<<`, `>>`, `>>>` | Числовые bitwise operations |
| Logical | `&&`, `\|\|`, `??` | Вычисляется нужная ветвь |
| Conditional | `ready ? 'Готово' : 'Ожидание'` | Вычисляется выбранная ветвь |
| Type wrapper | `value as string`, `value!` | TypeScript wrapper снимается при lowering; runtime type validation не добавляется |

## Разрешённые функции и методы

Этот перечень соответствует evaluator; наличие похожего метода у JavaScript prototype не разрешает его вызов.

| Группа | Разрешённые вызовы |
| --- | --- |
| Приведение | `Boolean(value)`, `Number(value)`, `String(value)` |
| Type checks | `Array.isArray(value)`, `Number.isFinite(value)`, `Number.isNaN(value)`, `Object.is(a, b)` |
| Math | `Math.abs`, `Math.ceil`, `Math.floor`, `Math.round`, `Math.trunc`, `Math.max`, `Math.min` |
| String | `.includes`, `.startsWith`, `.endsWith`, `.toLowerCase`, `.toUpperCase`, `.trim` |
| Array | `.includes(value, fromIndex?)` |
| Перевод | `t('alias:key', fallback?)` |
| Vocab options | `vocab('alias', { valuePath, labelPath }?)` |
| Meta входных данных | `$data.metaOf(reference, namespace?)` |

`t` и `vocab` получают provider из Composition runtime scope. `$data.metaOf` принимает статическую provenance-ссылку и literal namespace; передача результата функции вместо ссылки запрещена. Контракты: [Component SFC](/reference/component-sfc), [метаданные входных данных](/sfc-tables/context-variables#метаданные-входных-данных).

Не поддерживаются `.map(...)`, `.filter(...)`, `.reduce(...)`, произвольные функции из props, `JSON.parse/stringify`, `Date.now()`, `new Date()`, imports, function expressions, assignments и `await`. Неподдерживаемый expression не получает доступ к JavaScript engine: evaluator возвращает `undefined`; дополнительные compiler diagnostics зависят от места использования. Поэтому неизвестный метод нельзя считать корректным только из-за отсутствия exception.

## Control flow

```vue
<Flex col>
  <Text if="props.loading">Загрузка</Text>
  <Text else-if="props.error">Ошибка</Text>
  <Text else>{{ props.title }}</Text>

  <Text for="item in props.items" :key="item.id">{{ item.name }}</Text>
</Flex>
```

`if`, `else-if`, `else`, `for` — Endge directives. Не переносите Vue `v-model`, arbitrary directives, callbacks и импортированные Vue components в Source SFC. В отдельных структурных контрактах вроде MenuItem поддерживается явно описанный `v-if`; это не обещание полного Vue DSL. Dynamic attributes используют `:name="expression"`.

## Event input — отдельная грамматика

В `@event`/`:on` reaction разрешены `action(...)`, `query(...)`, required port calls, `emit(...)`, `typescript(...)` и `operation(...)` в описанных этими механизмами формах. Обычное template-выражение не выполняет эффект.

```vue
<Text
  :value="props.item.name"
  editable
  @edited="action({
    identity: 'item.rename',
    input: { id: props.item.id, name: event('value'), previousName: event('previousValue') },
  })"
/>
```

Input допускает literals, arrays, objects, `event(path?)`, `now()`, `??` и lexical SFC scope. В SFC event input computed object keys могут быть собраны из безопасного input expression, например `{ [columnKey]: event('value') }`. Это специальный контракт event input; он не включает computed keys во все template objects или ValueExpression.

Composition event mapping имеет более узкую область: literals, objects со статическими ключами, arrays, `event`, `now`, `??`; lexical locals компонента там недоступны. См. [Composition events](/reference/composition-events).

## Где находится реализация

- [Lowering template expression](https://github.com/endge-lab/core/blob/main/src/features/core/modules/compiler/services/component-sfc/component-sfc-expression-ir.ts).
- [Runtime evaluator и whitelist](https://github.com/endge-lab/core/blob/main/src/features/core/modules/runtime/services/component-sfc-expression-evaluate.ts).
- [Парсер event input](https://github.com/endge-lab/core/blob/main/src/features/core/modules/compiler/services/component-sfc/component-sfc-ports.ts).
- [Точные IR и payload types](/reference/contracts/core/domain).
