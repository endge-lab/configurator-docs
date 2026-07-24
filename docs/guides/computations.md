# Вычисления

Computation подходит для производных значений, которые зависят от входа и других узлов вычисления.

```ts
defineComputation({
  outputs: {
    base: input('value'),
    doubled: typescript({
      inputs: { value: output('base') },
      compute({ value }) {
        return value * 2
      },
    }),
  },
  result: output('doubled'),
})
```

## Когда использовать

- для одного результата, собранного из нескольких зависимостей;
- для переиспользуемой бизнес-логики;
- когда компоненту нужен реактивный вычисляемый ресурс;
- когда необходимо отделить вычисление от отображения.

## Ограничения

Узел `typescript` выполняется в sandbox Worker. В нём запрещены imports, сеть, файловая система, таймеры, async-функции и скрытое чтение домена. Обычные expression-узлы следует предпочитать там, где их достаточно.

Полный контракт: [Computation](/reference/computation).

## Вычисления представления таблиц

Для conditional presentation таблиц используются semantic results вместо CSS и
hex-цветов. Готовые контракты `groundhandling-process-state` и
`table-cell-conditional-presentation`, а также metadata колонок описаны в
[отдельном руководстве](/guides/table-presentation-computations).

Оба вычисления разделены на именованные `outputs`: каждый output становится
отдельным узлом compiler graph. TypeScript используется только для операций,
которых пока нет в ValueExpression, а не как реализация вычисления целиком.
