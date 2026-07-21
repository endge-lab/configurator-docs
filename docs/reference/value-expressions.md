# Функциональные выражения

ValueExpression — общий декларативный язык значений Endge. Он используется там, где нужно прочитать данные, отобрать или преобразовать коллекцию, собрать объект, вычислить условие либо связать несколько наборов данных. Выражение компилируется в безопасное статическое представление и исполняется штатным evaluator-ом Endge: это не произвольный JavaScript и не `eval`.

::: warning Важно
Общими являются операции над значениями, но не источники данных. Например, `response()` существует только в Query, `input()` — только в Computation, а `fromOutput()` — только в Composition.
:::

## Где доступен язык

| Сущность | Где используется ValueExpression | Доступные источники |
| --- | --- | --- |
| [Query](/reference/query) | `request.body`, выражение в `output().from(...)` | `prop(path)`, `response(path?)` |
| [DataView](/reference/data-view) | поля `map`, режимы `projection` и `expression` | `path(path)` и текущее значение цепочки |
| [Computation](/reference/computation) | узлы `outputs` и `result` | `input(path?)`, `output(name)` |
| [Composition](/reference/composition) | значения `.withProps({...})` | `prop`, `fromOutput`, `fromData`, `fromStore`, `fromFilter(...).fields(...)`, `metadata`, direct binding `metadataOf` |
| [Converter](/reference/converter) | не является host для ValueExpression | Converter вызывается специальной операцией DataView |
| [Component SFC](/reference/component-sfc) | использует отдельный язык template/script-выражений | props, local state и ресурсы портов |

## Базовая модель

Операции можно записывать функциями или объединять в цепочки. В цепочке результат слева автоматически становится первым аргументом следующей операции:

```ts
prop('rows')
  .where(match({ active: true }))
  .sortBy(get('name'))
  .map(pick(['id', 'name']))
```

Эквивалентная вложенная запись допустима, но обычно читается хуже:

```ts
map(
  sortBy(
    where(prop('rows'), match({ active: true })),
    get('name'),
  ),
  pick(['id', 'name']),
)
```

Все операции immutable: они возвращают новое значение и не изменяют исходные объекты или массивы.

### Селекторы и предикаты

`get`, `pick` и другие выражения можно передавать как селекторы, а `match`, `eq`, `gt`, `and` — как предикаты:

```ts
prop('items')
  .where(and(
    eq(get('status'), 'active'),
    gt(get('delay'), 5),
  ))
  .map(get('id'))
```

В операциях над коллекциями селектор вычисляется относительно текущего элемента. Для объекта текущей строки также доступен `$index`.

## Объекты и пути

| API | Результат |
| --- | --- |
| `value.get(path)` | Значение по dot-path; если пути нет — `undefined` |
| `value.getOr(path, fallback)` | Значение по пути либо fallback для `null`, `undefined` и `NaN` |
| `value.has(path)` | Есть ли собственное значение по пути |
| `value.defaultTo(fallback)` | Fallback для `null`, `undefined` и `NaN` |
| `value.pick(['id', 'name'])` | Новый объект только с выбранными полями |
| `value.pick('nested.path')` | Значение по пути; совместимая сокращённая форма |
| `value.omit(['secret'])` | Новый объект без перечисленных полей |
| `value.merge(other, ...)` | Глубокое объединение; более позднее значение имеет приоритет |
| `value.defaults(other, ...)` | Глубокое заполнение отсутствующих или nullish-полей |
| `value.compact()` | Рекурсивно убирает nullish-элементы массивов и пустые/nullish-поля объектов |
| `value.keys()` | Массив ключей объекта |
| `value.values()` | Массив значений объекта |
| `value.entries()` | Массив пар `[key, value]` |

```ts
prop('profile')
  .defaults({ locale: 'ru', settings: {} })
  .merge({ settings: { compact: true } })
  .omit(['token'])
```

## Коллекции

| API | Результат |
| --- | --- |
| `collection.map(selector)` | Преобразует каждый элемент |
| `collection.where(predicate)` | Оставляет элементы, для которых условие истинно |
| `collection.reject(predicate)` | Исключает элементы, для которых условие истинно |
| `collection.find(predicate)` | Возвращает первый найденный элемент |
| `collection.some(predicate)` | Проверяет, подходит ли хотя бы один элемент |
| `collection.every(predicate)` | Проверяет, подходят ли все элементы |
| `collection.flatMap(selector)` | Преобразует и разворачивает результат на один уровень |
| `collection.flatten()` | Разворачивает вложенные массивы на один уровень |
| `collection.uniq()` | Удаляет структурно одинаковые значения |
| `collection.uniqBy(selector)` | Оставляет первый элемент для каждого ключа |
| `collection.concat(other, ...)` | Объединяет коллекции |
| `collection.take(count?)` | Берёт первые `count` элементов; по умолчанию один |
| `collection.drop(count?)` | Пропускает первые `count` элементов; по умолчанию один |
| `collection.sortBy(selector)` | Возвращает новую коллекцию, отсортированную по селектору |
| `collection.groupBy(selector)` | Группирует элементы в объект `{ key: items[] }` |
| `collection.keyBy(selector)` | Индексирует элементы в объект; последний элемент ключа побеждает |
| `collection.size()` | Количество элементов |

Если операция коллекции получает одиночное значение, оно рассматривается как коллекция из одного элемента; `null` и `undefined` становятся пустой коллекцией.

```ts
response('items')
  .where(match({ active: true }))
  .uniqBy(get('id'))
  .sortBy(get('name'))
```

## Агрегации

| API | Результат |
| --- | --- |
| `collection.sum()` | Сумма числовых значений |
| `collection.sumBy(selector)` | Сумма значений селектора |
| `collection.min()` / `.max()` | Минимальное или максимальное значение |
| `collection.minBy(selector)` / `.maxBy(selector)` | Элемент с минимальным или максимальным значением селектора |

```ts
response('orders').where(match({ paid: true })).sumBy(get('amount'))
```

Нечисловые значения при суммировании дают вклад `0`. Для пустой коллекции `min`, `max`, `minBy` и `maxBy` возвращают `undefined`.

## Строки

| API | Результат |
| --- | --- |
| `value.trim()` | Строка без пробелов по краям |
| `value.lowerCase()` | Строка в нижнем регистре |
| `value.upperCase()` | Строка в верхнем регистре |
| `value.split(separator)` | Массив частей строки |
| `collection.join(separator?)` | Строка из элементов; separator по умолчанию `,` |
| `value.includes(fragment)` | Подстрока для строки или структурное вхождение для массива |

Строковые операции преобразуют `null` и `undefined` в пустую строку.

## Сравнения и условия

| API | Назначение |
| --- | --- |
| `match({ path: value })` | Проверяет поля объекта, включая dot-path |
| `eq(left, right)` / `ne(left, right)` | Структурное равенство или неравенство |
| `gt`, `gte`, `lt`, `lte` | Сравнение значений |
| `between(value, min, max)` | Включительный диапазон; null-граница считается открытой |
| `inList(value, list)` | Принадлежность значения списку |
| `inArray(value, array)` | Принадлежность массиву; пустой массив не ограничивает значение |
| `and(condition, ...)` | Логическое И |
| `or(condition, ...)` | Логическое ИЛИ |
| `not(condition)` | Логическое отрицание |
| `when(condition, value, fallback)` | Выбирает и вычисляет только нужную ветку |
| `isNil(value)` | `true` для `null` или `undefined` |
| `isEmpty(value)` | Проверка пустой строки, массива или объекта |

```ts
when(
  and(eq(prop('status'), 'active'), gt(prop('amount'), 0)),
  'ready',
  'blocked',
)
```

Одноаргументная форма `inList(list)` сохранена для совместимости и формирует legacy-дескриптор `{ in: list }`. В новых ValueExpression используйте явную форму `inList(value, list)`.

## Относительные даты

| API | Результат |
| --- | --- |
| `relativeDate(offset)` | Дата `YYYY-MM-DD`, например `relativeDate('-7d')` |
| `relativeDateTime(offset)` | ISO date-time относительно текущего момента |
| `relativeDateTime(offset, boundary)` | ISO date-time с `startOfDay` или `endOfDay` |

```ts
between(
  get('createdAt'),
  relativeDateTime('-7d', 'startOfDay'),
  relativeDateTime('0d', 'endOfDay'),
)
```

## Объединение коллекций

### `leftJoin` и `fullJoin`

```ts
leftJoin(leftRows, rightRows)
  .by({ left: 'customerId', right: 'id' })
  .coalesce({ prefer: 'left' })
```

- `leftJoin` сохраняет все элементы левой коллекции;
- `fullJoin` дополнительно сохраняет несовпавшие элементы справа;
- `.by('id')` сравнивает одинаковый путь с обеих сторон;
- `.by({ left, right })` задаёт разные пути;
- `.by(first, second)` формирует составное условие И;
- `.byAny(first, second)` формирует альтернативные условия ИЛИ;
- `null` и `undefined` не образуют совпадение;
- без `.coalesce()` строка имеет форму `{ left, right }`;
- `.coalesce({ prefer: 'left' | 'right' })` глубоко объединяет стороны; по умолчанию приоритет у левой.

Если одному элементу соответствует несколько строк, join сохраняет кардинальность и публикует runtime warning `value-expression-join-ambiguous`.

### `lookupOne` и `lookupMany`

Lookup связывает текущий объект с внешней коллекцией:

```ts
lookupOne(response('attributes'))
  .by({ source: 'entityId', target: 'id' })

lookupMany(response('events')).by('entityId')
```

- `.by('foreignId')` сравнивает `source.foreignId` с `current.id`;
- `.by({ source, target })` задаёт оба пути явно;
- `lookupOne` возвращает первый элемент или `undefined`;
- `lookupMany` возвращает все совпавшие элементы;
- несколько совпадений `lookupOne` вызывают warning `value-expression-lookup-ambiguous`.

### `enrich`

`enrich` неизменяемо дополняет вложенную ветку каждого элемента коллекции:

```ts
rows.enrich('details', {
  attributes: lookupMany(response('attributes')).by('entityId'),
})
```

Поля вычисляются в контексте выбранной ветки и затем глубоко объединяются с ней.

## Ограничения языка

ValueExpression намеренно не поддерживает:

- произвольные функции и вызовы JavaScript;
- callback-функции вроде `array.map(row => ...)`;
- циклы, `reduce` и мутацию данных;
- `async`/`await`, Promise и сетевые вызовы;
- доступ к глобальному окружению;
- object spread и вычисляемые ключи внутри общего выражения;
- пользовательские comparator-функции для сортировки.

Вместо callback используются выражения-селекторы: `.map(get('id'))`, `.where(match({...}))`, `.sortBy(get('name'))`. Если задачу нельзя выразить общим API, используйте [Computation с `typescript`-узлом](/reference/computation#typescript-узел) либо зарегистрированный [Converter](/reference/converter), сохраняя императивную часть в явной границе.

## Связанные документы

- [Query: HTTP-контракт, props и outputs](/reference/query)
- [DataView: режимы и структурный pipeline](/reference/data-view)
- [Computation: граф вычислений](/reference/computation)
- [Composition: runtime-граф и связи](/reference/composition)
- [Converter: зарегистрированные преобразования](/reference/converter)
