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
| [Composition](/reference/composition) | значения `.withProps({...})` | `prop`, `fromOutput`, `fromData`, `fromStore`, `fromFilter(...).fields(...)`, `metadata`, `metadataOf` |
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

В Composition `fromOutput('runtime')` реактивно собирает объект всех outputs runtime-ноды с их публичными именами. `fromOutput('runtime', 'output')` читает значение одного output. Обе формы можно использовать внутри функциональных цепочек.

`metadataOf('runtime')` читает весь compiled metadata map документа, указанного runtime alias-ом. `metadataOf('runtime', 'namespace')` выбирает один namespace. Metadata статична в пределах собранного ProgramArtifact, но обе формы можно комбинировать с объектами и операциями ValueExpression.

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
| `value.set(path, next)` | Новая копия объекта со значением по dot-path |
| `value.unset(path)` | Новая копия объекта без значения по dot-path |
| `value.rename(from, to)` | Неизменяемо переносит значение между путями |
| `value.getKey(key)` | Читает динамический ключ объекта |
| `fromEntries(entries)` | Собирает объект из массива пар `[key, value]` |
| `lookupValue(key, dictionary, fallback?)` | Читает значение словаря по динамическому ключу |
| `coalesce(first, ...)` | Первое значение, которое не равно `null`, `undefined` или `NaN` |

```ts
prop('profile')
  .defaults({ locale: 'ru', settings: {} })
  .merge({ settings: { compact: true } })
  .omit(['token'])
```

### Синтаксис путей

Пути чтения понимают грамматику путей Raph. Это касается readers (`prop`, `value`, `row`, `response`, `data`, `errors`, `store`, `path`), второго аргумента `get`, `getOr`, `has` и `pick`, путей в `match`, `leftJoin`/`fullJoin ... by`, `lookupOne`/`lookupMany ... by`, outputs Query `response('...')`/`data('...')`, а также `path()`, `.pick()` и шаблонов `{...}` DataView.

| Путь | Что читается |
| --- | --- |
| `''` | сам источник |
| `legs.1.gate`, `title.length` | точечный путь, как раньше: числовой сегмент — индекс, у примитивов читаются свойства |
| `legs[1].gate` | индекс массива; у не-массива (`title[0]`) — `undefined` |
| `legs[id="L2"].gate`, `legs[id='L1']` | первый элемент-объект, у которого собственное поле `id` строго равно значению |
| `legs[id=3]`, `[active=true]`, `[active=null]` | значение без кавычек — число, булево или `null`; `[id=3]` не совпадает с `"3"` |
| `legs[id="L2"].crew[1].name` | сегменты комбинируются в любом порядке |
| `legs[id=$leg]`, `legs[$i]`, `legs[0].$field` | `$имя` — переменная из props выражения |

В DataView переменными путей служат props DataView: `path('leg.$field')`, `path('input.statuses[legId=$legId].value')`, `template('{leg.$field}')`.

Литеральный путь проверяется при компиляции: ошибка синтаксиса даёт `source-expression-path-invalid`, а `*` или `[*]` — `source-expression-path-wildcard` (wildcard допустим только в масках подписки Raph, но не в чтении). Если путь вычисляется выражением, ошибка проявляется только при вычислении: результат `undefined` (`has` — `false`) и предупреждение `value-path-invalid`, `value-path-wildcard` или `value-path-variable`, если переменная в `[$i]` или `[k=$v]` не задана. Исключение наружу не выходит.

### Путь из выражения

Второй аргумент `get`, `getOr` и `has` может быть выражением. Так поле читается по пути, который хранится в настройке или в props:

```ts
get(row(''), prop('fieldPath'))
getOr(row(''), prop('fieldPath'), '—')
row('legs').map(get(prop('fieldPath')))
// DataView: значение поля по пути из схемы инспектора
get(path(''), get('path'))
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
| `collection.first()` / `.last()` | Первый или последний элемент |
| `collection.at(index)` | Элемент по индексу; отрицательный индекс считается с конца |
| `collection.reverse()` | Новая коллекция в обратном порядке |
| `collection.sortByDesc(selector)` | Сортировка по убыванию |
| `orderBy(collection, descriptors)` | Стабильная сортировка по нескольким `{ by, direction }` |
| `collection.chunk(size)` | Разбивает коллекцию на части |
| `union(left, right, ...)` | Объединение без структурных дублей |
| `intersection(left, right)` | Структурное пересечение |
| `difference(left, right)` | Элементы left, отсутствующие в right |
| `collection.countBy(selector)` | Считает элементы по ключу селектора |

Если операция коллекции получает одиночное значение, оно рассматривается как коллекция из одного элемента; `null` и `undefined` становятся пустой коллекцией.

```ts
response('items')
  .where(match({ active: true }))
  .uniqBy(get('id'))
  .sortBy(get('name'))
```

Сортировка по нескольким полям задаётся декларативно:

```ts
orderBy(response('items'), [
  { by: get('priority'), direction: 'desc' },
  { by: get('name'), direction: 'asc' },
])
```

## Агрегации

| API | Результат |
| --- | --- |
| `collection.sum()` | Сумма числовых значений |
| `collection.sumBy(selector)` | Сумма значений селектора |
| `collection.min()` / `.max()` | Минимальное или максимальное значение |
| `collection.minBy(selector)` / `.maxBy(selector)` | Элемент с минимальным или максимальным значением селектора |
| `collection.average()` | Среднее арифметическое |
| `collection.averageBy(selector)` | Среднее арифметическое значений селектора |

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
| `concat(first, ...)` | Склеивает строки, если все arguments строковые; иначе объединяет коллекции |
| `value.startsWith(prefix)` / `.endsWith(suffix)` | Проверяет начало или конец строки |
| `value.replace(search, replacement)` | Заменяет первое буквальное вхождение |
| `value.replaceAll(search, replacement)` | Заменяет все буквальные вхождения |
| `value.slice(start, end?)` | Возвращает часть строки или массива |
| `value.padStart(length, fill?)` / `.padEnd(...)` | Дополняет строку |
| `value.normalizeWhitespace()` | Убирает пробелы по краям и схлопывает внутренние whitespace |

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
| `choose([{ when, then }], fallback)` | Вычисляет `then` только у первой истинной ветки |
| `containsAll(container, values)` | Контейнер содержит все значения |
| `containsAny(container, values)` | Контейнер содержит хотя бы одно значение |

```ts
when(
  and(eq(prop('status'), 'active'), gt(prop('amount'), 0)),
  'ready',
  'blocked',
)
```

`when` и `choose` ленивые: невыбранные ветки не вычисляются.

## Типы и преобразования

| API | Результат |
| --- | --- |
| `toString(value)` | Строка; nullish-значение становится пустой строкой |
| `toNumber(value, fallback?)` | Конечное число либо fallback |
| `toBoolean(value, fallback?)` | Boolean для boolean, чисел и строк `true/false`, `1/0`, `yes/no`, `on/off` |
| `typeOf(value)` | `undefined`, `null`, `string`, `number`, `boolean`, `array`, `object`, `date-time` или `duration` |
| `isString`, `isNumber`, `isBoolean` | Проверка scalar-типа |
| `isArray`, `isObject` | Проверка структуры |
| `isDateTime`, `isDuration` | Проверка допустимого DateTime или Duration |

Преобразования не бросают исключение из-за пользовательского значения. Если
преобразование невозможно, `toNumber` и `toBoolean` возвращают переданный
fallback либо `undefined`.

## Числа

| API | Результат |
| --- | --- |
| `add(first, ...)` / `subtract(left, right)` | Сложение и вычитание |
| `multiply(first, ...)` / `divide(left, right)` | Умножение и деление |
| `modulo(left, right)` | Остаток от деления |
| `abs`, `negate`, `floor`, `ceil` | Базовые числовые преобразования |
| `round(value, precision?)` | Округление; precision — число знаков после запятой |
| `clamp(value, min, max)` | Ограничивает значение диапазоном |

Деление и остаток от деления на ноль возвращают `undefined`. В арифметических
операциях нечисловое значение даёт `0`, как и в существующем `sum`.

Одноаргументная форма `inList(list)` сохранена для совместимости и формирует legacy-дескриптор `{ in: list }`. В новых ValueExpression используйте явную форму `inList(value, list)`.

## DateTime и Duration

Новые операции времени чистые: они не читают системные часы. Текущее время,
если оно нужно бизнес-правилу, передаётся в выражение как обычный реактивный
вход.

```ts
dateTimeSubtract(
  input('now'),
  duration({ minutes: 5 }),
)
```

`dateTime(value)` нормализует допустимое значение в ISO UTC. `duration({...})`
принимает `weeks`, `days`, `hours`, `minutes`, `seconds` и `milliseconds` и
возвращает JSON-compatible объект:

```ts
{ kind: 'duration', milliseconds: 300000 }
```

| API | Результат |
| --- | --- |
| `dateTime(value)` | ISO UTC либо `undefined` |
| `duration(parts)` | Нормализованная длительность |
| `dateTimeAdd(value, duration)` / `dateTimeSubtract(...)` | DateTime со сдвигом |
| `dateTimeDifference(left, right)` | Длительность `left - right` |
| `dateTimeStartOf(value, unit)` / `dateTimeEndOf(...)` | UTC-граница `year/month/week/day/hour/minute/second` |
| `dateTimePart(value, part)` | UTC-часть: `year/month/day/weekday/hour/minute/second/millisecond/timestamp` |
| `durationAdd(first, ...)` / `durationSubtract(left, right)` | Арифметика длительностей |
| `durationTotal(value, unit)` | Полное число `weeks/days/hours/minutes/seconds/milliseconds` |

`days` и `weeks` в Duration — точные интервалы по 24 часа и 7 дней. Операции
форматирования и преобразования временных зон в ValueExpression намеренно не
входят: это ответственность отображения.

### Legacy relative date

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

`relativeDate` и `relativeDateTime` сохранены для совместимости, но читают
системное время и потому не подходят для реактивных Computation. В новых
вычислениях используйте явный `now` вместе с `dateTimeAdd` /
`dateTimeSubtract`.

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

## Контекст сборки

Фасеты и Configuration фиксируются при запуске Endge, поэтому четыре функции контекста вычисляются при компиляции и попадают в программу константами. Смена фасета или значения Configuration меняет `contextHash` сборки: прежние artifacts становятся устаревшими (`program-artifact-stale`) и пересобираются.

| Функция | Результат при компиляции |
| --- | --- |
| `facet('tenant')` | identity выбранного документа фасета или `null`, если фасет не выбран |
| `config('inspector.page')` | значение Configuration по пути (синтаксис путей выше); нет значения — `undefined` |
| `context({ tenant: 'kzn', stage: 'prod' })` | `true`, если совпали все перечисленные фасеты; не перечисленный фасет может быть любым |
| `contextSwitch({ default, cases: [{ when, use }] })` | `use` совпавшего case с наибольшим числом условий, иначе `default` |

`config(...)` читает ту же проекцию, что `$context.config` в Component SFC: системные поля (`defaultLocale`, `themes` и другие) и значения документов Configuration по их identity.

Правила `contextSwitch`:

- `default` обязателен, `when` не может быть пустым;
- cases одинаковой специфичности, которые могут совпасть одновременно, — ошибка независимо от порядка;
- компилируются и проверяются все ветки, включая невыбранные: ошибка в любой ветке — ошибка сборки;
- `use` и `default` — любые выражения, включая readers и вложенный `contextSwitch`; модификаторы пишутся после вызова: `contextSwitch({...}).trim()`.

Функции доступны везде, где выражение проходит общий компилятор Source: request, body, variables и outputs Query, output, `map`, `select` и `filter` DataView, Computation, Action, Update, headers и variables Stream, outputs Filter, значения Composition, defaults полей `defineProps`.

```ts
defineQuery({
  kind: 'rest',
  request: {
    endpoint: 'https://ops.example.test',
    path: config('inspector.endpoint'),
    method: 'POST',
    headers: {
      'X-Tenant': facet('tenant'),
      'X-Page': toString(config('inspector.page')),
      'X-Mode': contextSwitch({ default: 'read', cases: [{ when: { tenant: 'kzn' }, use: 'legacy' }] }),
    },
  },
  outputs: { raw: output().from(response()) },
})
```

Аргумент reader остаётся литеральной строкой: `response(contextSwitch(...))` даёт `source-expression-read-path`. Выбирайте reader целиком:

```ts
place: output().from(contextSwitch({
  default: response('flight.gate'),
  cases: [{ when: { tenant: 'kzn' }, use: response('flight.stand') }],
})),
```

Вне сборки — в редакторе без контекста или в изолированной компиляции — `facet` даёт `null`, `config` — `undefined`, `context` — `false`, `contextSwitch` — `default`, и документ получает одну информационную диагностику `source-expression-context-unbound`. Редактор Configurator проверяет Source в контексте текущего запуска (`Endge.source.currentSourceContext()`), поэтому видит выбранный тенант.

| Код | Severity | Когда |
| --- | --- | --- |
| `source-expression-context-unbound` | info | функция вызвана вне контекста сборки |
| `source-expression-facet-unknown` | warning | фасета нет среди активных фасетов домена (`facet()`, ключи `context()`, `when`, `enabledWhen`) |
| `source-expression-facet-argument`, `source-expression-config-argument` | error | аргумент не одна непустая строка |
| `source-expression-context-shape`, `-empty`, `-entry`, `-duplicate` | error | `context(...)` не с object literal, пустой, неверная пара или повтор ключа |
| `source-expression-context-switch-*` | error | форма `contextSwitch`: нет `default` или `use`, лишнее свойство, неверный `cases`/`when`, пересечение cases (`-ambiguous`) |

`contextSwitch` выбирает также ссылки и структуру документов: runtime Composition, фрагменты GraphQL, ссылки на Type и DataView, привязки портов SFC. Эти формы описаны на страницах [Composition](/reference/composition#contextswitch), [Query](/reference/query#фрагменты-по-контексту), [Type](/reference/type#contextswitch-и-extends), [DataView](/reference/data-view#ссылка-по-контексту) и [Component SFC](/reference/component-sfc#порт-по-контексту). Выбор тенанта при запуске — на странице [Выбор тенанта](/configurator/tenant-selection).

## Ограничения языка

Пути и переменные:

- неизвестная `$имя` в позиции ключа читается буквально — так работают ключи вида `$type`; опечатка в имени переменной поэтому даёт `undefined` без предупреждения;
- ключи с точкой или `[` недоступны: экранирования ключей нет, кавычки работают только в значении селектора;
- пути записи (`set`, `unset`, `rename`, `enrich`), readers обновлений Store и пути маршрутизации Stream остаются точечными: селекторы, индексы `[n]` и `$имя` в них не поддерживаются.

ValueExpression намеренно не поддерживает:

- произвольные функции и вызовы JavaScript;
- callback-функции вроде `array.map(row => ...)`;
- циклы, `reduce` и мутацию данных;
- `async`/`await`, Promise и сетевые вызовы;
- доступ к глобальному окружению;
- object spread и вычисляемые ключи внутри общего выражения;
- пользовательские comparator-функции для сортировки.
- чтение текущего времени через `now()` или другой скрытый глобальный источник;
- регулярные выражения и JSON parse/stringify.

Вместо callback используются выражения-селекторы: `.map(get('id'))`, `.where(match({...}))`, `.sortBy(get('name'))`. Если задачу нельзя выразить общим API, используйте [Computation с `typescript`-узлом](/reference/computation#typescript-узел) либо зарегистрированный [Converter](/reference/converter), сохраняя императивную часть в явной границе.

## Связанные документы

- [Query: HTTP-контракт, props и outputs](/reference/query)
- [DataView: режимы и структурный pipeline](/reference/data-view)
- [Computation: граф вычислений](/reference/computation)
- [Composition: runtime-граф и связи](/reference/composition)
- [Converter: зарегистрированные преобразования](/reference/converter)
