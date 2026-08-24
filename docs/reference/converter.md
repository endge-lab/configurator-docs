# Converter

Converter — доменная сущность, которая синхронно преобразует текущее значение в другой тип или формат. Чтобы Converter работал в runtime, нужен доменный документ и привязанный обработчик.

Converter не является host для [общих функциональных выражений](/reference/value-expressions): это явная императивная граница с зарегистрированным handler. В source он вызывается специальной операцией [DataView](/reference/data-view#legacy-операции-path).

## 1. Создайте документ

В конфигураторе создайте Converter с уникальным identity, например `string-to-number`. Identity будет использоваться во всех ссылках на преобразование.

## 2. Установите provider и override

```ts
import { Endge } from '@endge/core'

function stringToNumber(value: unknown, options?: { emptyAsNull?: boolean }): number | null {
  if (value == null || value === '') return null
  const result = Number(value)
  return Number.isNaN(result) ? null : result
}

const removeProvider = Endge.converters.provide({
  identity: 'string-to-number',
  key: 'application.string-to-number',
  origin: { kind: 'local', owner: 'application' },
  convert: stringToNumber,
})

const removeOverride = Endge.converters.override({
  identity: 'string-to-number',
  providerKey: 'application.string-to-number',
})
```

Provider следует устанавливать после загрузки домена. `override` полностью выбирает его вместо default implementation; скрытого fallback при ошибке нет. При остановке модуля сначала вызовите `removeOverride()`, затем `removeProvider()`.

## Использование в DataView

```ts
path('row.amount').convert('string-to-number')
```

Опции можно передать вторым аргументом:

```ts
path('row.std').convert(
  'date.iso_to_time',
  { format: 'HH:mm' },
)
```

Legacy wrapper syntax остаётся допустимым: `.convert(converter('string-to-number'))` компилируется в ту же внешнюю ссылку.

## Значение и массив

Обработчик получает текущее значение целиком и вызывается один раз. Массив не преобразуется поэлементно автоматически. Для явного обхода элементов используйте DataView, а Converter вызывайте внутри его `map`/projection.

Каноническая сигнатура handler:

```ts
(value: unknown, options?: unknown) => unknown
```

Однопараметрические обработчики остаются совместимыми. Возвращать `Promise` нельзя: async Converter завершается runtime-ошибкой.

## Проверка ошибок

| Ситуация | Что проверить |
| --- | --- |
| Provider не установился | Существует ли Converter в загруженном домене |
| Результат `null` | Привязан ли handler и принимает ли он входной формат |
| Неверный результат списка | Должно ли преобразование применяться к каждому элементу |
| Разные результаты в окружениях | Одинакова ли регистрация обработчиков при bootstrap |
