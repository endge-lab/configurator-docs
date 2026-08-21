# Converter

Converter — доменная сущность, которая синхронно преобразует текущее значение в другой тип или формат. Чтобы Converter работал в runtime, нужен доменный документ и привязанный обработчик.

Converter не является host для [общих функциональных выражений](/reference/value-expressions): это явная императивная граница с зарегистрированным handler. В source он вызывается специальной операцией [DataView](/reference/data-view#legacy-операции-path).

## 1. Создайте документ

В конфигураторе создайте Converter с уникальным identity, например `string-to-number`. Identity будет использоваться во всех ссылках на преобразование.

## 2. Привяжите обработчик

```ts
import { Endge } from '@endge/core'

function stringToNumber(value: unknown, options?: { emptyAsNull?: boolean }): number | null {
  if (value == null || value === '') return null
  const result = Number(value)
  return Number.isNaN(result) ? null : result
}

const unbind = Endge.bind.converter('string-to-number', stringToNumber)
```

Binding следует выполнять после загрузки домена. Если документа с таким identity нет, привязка не будет установлена.

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
| Binding не установился | Существует ли Converter в загруженном домене |
| Результат `null` | Привязан ли handler и принимает ли он входной формат |
| Неверный результат списка | Должно ли преобразование применяться к каждому элементу |
| Разные результаты в окружениях | Одинакова ли регистрация обработчиков при bootstrap |
