# DataView

DataView описывает преобразование входных данных в выходную форму. Один механизм используется для глобальных доменных DataView и локальных DataView внутри Query.

## Основные правила

- `defineDataView({...})` описывает source.
- Режим `pipeline` декларативен и выполняется runtime-интерпретатором.
- Режим `manual` содержит пользовательский код и разрешён только для trusted/global сценария.
- Глобальная и локальная формы компилируются в один `DataViewProgramPayload`.

## Pipeline

```ts
defineDataView({
  mode: 'pipeline',
  steps: [
    from('raw').as('row'),
    map({
      ...spread('row'),
      flightNumber: path('row.flight'),
    }),
  ],
})
```

Шаги выполняются последовательно. Базовые операции — `from`, `join` и `map`.

## `from(source).as(alias)`

Выбирает массив из входного scope и задаёт имя текущей строки:

```ts
from('raw').as('row')
```

## `map({...})`

Формирует выходной объект для каждой строки:

```ts
map({
  id: path('row.id'),
  flightNumber: path('row.flight'),
})
```

## `spread(alias)`

Копирует поля исходного объекта. Явно заданное после `spread` поле переопределяет скопированное значение.

```ts
map({
  ...spread('row'),
  flightNumber: path('row.flight'),
})
```

## `path(path)`

Читает значение из scope:

```ts
path('input.meta.requestId')
path('row.flight')
path('attrs.items')
```

## `join(source).by(...)`

Присоединяет данные из другого массива:

```ts
join('attrs').by({
  left: 'leg.id',
  right: 'legId',
  as: 'legAttrs',
})
```

`left` читается из текущего scope, `right` — из каждого элемента массива `source`. Первый найденный элемент сохраняется под именем `as`.

## Операции над `path`

```ts
path('row.airport').pick('code')
path('row.statuses').find({ active: true })
path('row.std').convert(converter('date.iso_to_time'), { format: 'HH:mm' })
```

- `pick` берёт вложенное поле;
- `find` ищет элемент массива;
- `convert` применяет глобальный Converter.

## `template(template)`

Формирует строку из текущего scope:

```ts
template('{row.flight} / {row.destination}')
```

## DataView внутри DataView

Другой DataView можно применить к выбранному source до обхода строк:

```ts
from('items')
  .dataView(dataView('normalizeFlight'))
  .as('row')
```

Локальный вложенный DataView должен использовать режим `pipeline`.

## Manual DataView

```ts
defineDataView({
  mode: 'manual',
  transform(input, tools) {
    return input.raw
  },
})
```

Manual-режим выполняет пользовательский код, поэтому не разрешён для локального DataView внутри Query или другого DataView первой версии.

## Компиляция и исполнение

Compiler создаёт ProgramArtifact с payload типа DataViewProgramPayload. Глобальный и query-owned DataView исполняются одним runtime-executor, что сохраняет одинаковую семантику преобразования.
