# Converter

Converter — доменная сущность, которая преобразует отдельное значение в другой тип или формат. Чтобы Converter работал в runtime, нужен доменный документ и привязанный обработчик.

Converter не является host для [общих функциональных выражений](/reference/value-expressions): это явная императивная граница с зарегистрированным handler. В source он вызывается специальной операцией [DataView](/reference/data-view#legacy-операции-path).

## 1. Создайте документ

В конфигураторе создайте Converter с уникальным identity, например `string-to-number`. Identity будет использоваться во всех ссылках на преобразование.

## 2. Привяжите обработчик

```ts
import { Endge } from '@endge/core'

function stringToNumber(value: unknown): number | null {
  if (value == null || value === '') return null
  const result = Number(value)
  return Number.isNaN(result) ? null : result
}

const unbind = Endge.bind.converter('string-to-number', stringToNumber)
```

Binding следует выполнять после загрузки домена. Если документа с таким identity нет, привязка не будет установлена.

## Использование в DataView

```ts
path('row.amount').convert(converter('string-to-number'))
```

Опции можно передать вторым аргументом:

```ts
path('row.std').convert(
  converter('date.iso_to_time'),
  { format: 'HH:mm' },
)
```

## Значение и массив

Обработчик обычно описывает преобразование одного значения. Если механизм вызова получает массив, один Converter может быть применён к каждому элементу автоматически.

## Проверка ошибок

| Ситуация | Что проверить |
| --- | --- |
| Binding не установился | Существует ли Converter в загруженном домене |
| Результат `null` | Привязан ли handler и принимает ли он входной формат |
| Неверный результат списка | Должно ли преобразование применяться к каждому элементу |
| Разные результаты в окружениях | Одинакова ли регистрация обработчиков при bootstrap |
