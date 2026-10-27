---
description: "Функции и readers общего языка выражений Source, извлечённые из compiler: имя, операция IR и число аргументов."
---

# Каталог функций авторских выражений

Таблица извлечена из compiler source вместе с [TypeScript-контрактами](/reference/contracts/). Она фиксирует имена и число аргументов; семантика, примеры и правила null описаны в [функциональных выражениях](/reference/value-expressions).

**Область применения:** общий Source Expression DSL. Это не список JavaScript-функций SFC. Конкретный host может сужать readers и операции: например, [Filter](/reference/filter) допускает лишь небольшой whitelist. Не переносите эту таблицу в SFC interpolation или event input.

## Операции

| Функция | IR operation | Аргументы функции |
| --- | --- | --- |
| `merge(...)` | `merge` | 2+ |
| `compact(...)` | `compact` | 1 |
| `get(...)` | `get` | 2 |
| `getOr(...)` | `get-or` | 3 |
| `has(...)` | `has` | 2 |
| `defaultTo(...)` | `default-to` | 2 |
| `pick(...)` | `pick` | 2 |
| `omit(...)` | `omit` | 2 |
| `defaults(...)` | `defaults` | 2+ |
| `keys(...)` | `keys` | 1 |
| `values(...)` | `values` | 1 |
| `entries(...)` | `entries` | 1 |
| `map(...)` | `map` | 2 |
| `where(...)` | `where` | 2 |
| `reject(...)` | `reject` | 2 |
| `find(...)` | `find` | 2 |
| `some(...)` | `some` | 2 |
| `every(...)` | `every` | 2 |
| `flatMap(...)` | `flat-map` | 2 |
| `flatten(...)` | `flatten` | 1 |
| `uniq(...)` | `uniq` | 1 |
| `uniqBy(...)` | `uniq-by` | 2 |
| `concat(...)` | `concat` | 2+ |
| `take(...)` | `take` | 1–2 |
| `drop(...)` | `drop` | 1–2 |
| `sortBy(...)` | `sort-by` | 2 |
| `groupBy(...)` | `group-by` | 2 |
| `keyBy(...)` | `key-by` | 2 |
| `size(...)` | `size` | 1 |
| `sum(...)` | `sum` | 1 |
| `sumBy(...)` | `sum-by` | 2 |
| `min(...)` | `min` | 1 |
| `max(...)` | `max` | 1 |
| `minBy(...)` | `min-by` | 2 |
| `maxBy(...)` | `max-by` | 2 |
| `trim(...)` | `trim` | 1 |
| `lowerCase(...)` | `lower-case` | 1 |
| `upperCase(...)` | `upper-case` | 1 |
| `split(...)` | `split` | 2 |
| `join(...)` | `join` | 1–2 |
| `match(...)` | `match` | 2 |
| `eq(...)` | `eq` | 2 |
| `ne(...)` | `ne` | 2 |
| `gt(...)` | `gt` | 2 |
| `gte(...)` | `gte` | 2 |
| `lt(...)` | `lt` | 2 |
| `lte(...)` | `lte` | 2 |
| `includes(...)` | `includes` | 2 |
| `or(...)` | `or` | 1+ |
| `when(...)` | `when` | 3 |
| `not(...)` | `not` | 1 |
| `isNil(...)` | `is-nil` | 1 |
| `isEmpty(...)` | `is-empty` | 1 |
| `and(...)` | `and` | 1+ |
| `between(...)` | `between` | 3 |
| `inList(...)` | `in-list` | 1–2 |
| `inArray(...)` | `in-array` | 2 |
| `relativeDate(...)` | `relative-date` | 1 |
| `relativeDateTime(...)` | `relative-date-time` | 1–2 |
| `leftJoin(...)` | `left-join` | 2 |
| `fullJoin(...)` | `full-join` | 2 |
| `by(...)` | `join-by` | 2+ |
| `byAny(...)` | `join-by-any` | 2+ |
| `coalesce(...)` | `coalesce` | 1+ |
| `lookupOne(...)` | `lookup-one` | 1 |
| `lookupMany(...)` | `lookup-many` | 1 |
| `enrich(...)` | `enrich` | 3 |
| `choose(...)` | `choose` | 2 |
| `lookupValue(...)` | `lookup-value` | 2–3 |
| `toString(...)` | `to-string` | 1 |
| `toNumber(...)` | `to-number` | 1–2 |
| `toBoolean(...)` | `to-boolean` | 1–2 |
| `typeOf(...)` | `type-of` | 1 |
| `isString(...)` | `is-string` | 1 |
| `isNumber(...)` | `is-number` | 1 |
| `isBoolean(...)` | `is-boolean` | 1 |
| `isArray(...)` | `is-array` | 1 |
| `isObject(...)` | `is-object` | 1 |
| `isDateTime(...)` | `is-date-time` | 1 |
| `isDuration(...)` | `is-duration` | 1 |
| `add(...)` | `add` | 2+ |
| `subtract(...)` | `subtract` | 2 |
| `multiply(...)` | `multiply` | 2+ |
| `divide(...)` | `divide` | 2 |
| `modulo(...)` | `modulo` | 2 |
| `abs(...)` | `abs` | 1 |
| `negate(...)` | `negate` | 1 |
| `round(...)` | `round` | 1–2 |
| `floor(...)` | `floor` | 1 |
| `ceil(...)` | `ceil` | 1 |
| `clamp(...)` | `clamp` | 3 |
| `average(...)` | `average` | 1 |
| `averageBy(...)` | `average-by` | 2 |
| `startsWith(...)` | `starts-with` | 2 |
| `endsWith(...)` | `ends-with` | 2 |
| `replace(...)` | `replace` | 3 |
| `replaceAll(...)` | `replace-all` | 3 |
| `slice(...)` | `slice` | 2–3 |
| `padStart(...)` | `pad-start` | 2–3 |
| `padEnd(...)` | `pad-end` | 2–3 |
| `normalizeWhitespace(...)` | `normalize-whitespace` | 1 |
| `set(...)` | `set` | 3 |
| `unset(...)` | `unset` | 2 |
| `rename(...)` | `rename` | 3 |
| `getKey(...)` | `get-key` | 2 |
| `fromEntries(...)` | `from-entries` | 1 |
| `first(...)` | `first` | 1 |
| `last(...)` | `last` | 1 |
| `at(...)` | `at` | 2 |
| `reverse(...)` | `reverse` | 1 |
| `sortByDesc(...)` | `sort-by-desc` | 2 |
| `orderBy(...)` | `order-by` | 2 |
| `chunk(...)` | `chunk` | 2 |
| `union(...)` | `union` | 2+ |
| `intersection(...)` | `intersection` | 2 |
| `difference(...)` | `difference` | 2 |
| `countBy(...)` | `count-by` | 2 |
| `dateTime(...)` | `date-time` | 1 |
| `duration(...)` | `duration` | 1 |
| `dateTimeAdd(...)` | `date-time-add` | 2 |
| `dateTimeSubtract(...)` | `date-time-subtract` | 2 |
| `dateTimeDifference(...)` | `date-time-difference` | 2 |
| `dateTimeStartOf(...)` | `date-time-start-of` | 2 |
| `dateTimeEndOf(...)` | `date-time-end-of` | 2 |
| `dateTimePart(...)` | `date-time-part` | 2 |
| `durationAdd(...)` | `duration-add` | 2+ |
| `durationSubtract(...)` | `duration-subtract` | 2 |
| `durationTotal(...)` | `duration-total` | 2 |
| `containsAll(...)` | `contains-all` | 2 |
| `containsAny(...)` | `contains-any` | 2 |

В chain-форме receiver занимает место первого аргумента. В predicate callbacks часть операций может неявно читать текущий элемент; такие сокращения применяйте только по примерам общего reference. `coalesce(...)` использует обычную операцию coalesce, а `.coalesce(...)` внутри join — отдельную join operation.

## Readers

| Имя | IR read kind | Доступность |
| --- | --- | --- |
| `env` | `env` | Определяется host-документом |
| `endgeVar` | `env` | Определяется host-документом |
| `prop` | `prop` | Определяется host-документом |
| `value` | `value` | Определяется host-документом |
| `row` | `row` | Определяется host-документом |
| `response` | `response` | Определяется host-документом |
| `store` | `store` | Определяется host-документом |
| `path` | `scope` | Определяется host-документом |
| `__computationOutput` | `computation-output` | Внутреннее имя compiler; не писать вручную |
| `__graphqlErrors` | `graphql-errors` | Внутреннее имя compiler; не писать вручную |

`facet`, `config`, `context`, `contextSwitch` — отдельные compiler-owned конструкции структурного контекста. `input`, `event`, `now` и другие специализированные readers принадлежат конкретным языкам; отсутствие в общей таблице не отменяет их локальный контракт.

[Владеющий compiler](https://github.com/endge-lab/core/blob/main/src/features/core/modules/source/services/compilers/source-expression-compile.ts).
