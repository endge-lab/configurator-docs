# Индексация коллекций

::: warning Страница не обновляется
Актуальная документация Raph — на сайте Raphy; публичный адрес сайта появится позже. Что из Raph нужно для работы с Endge — на странице [«Raph в Endge»](/reference/raph). Точные типы — в [контрактах Raph](/raph/contracts/).
:::

`DefaultDataAdapter` ускоряет selectors вида `orders[id=42]`. Индекс принадлежит
adapter, а не `DataPath`, `RaphRouter` или Runtime.

```ts
const adapter = new DefaultDataAdapter(
  {
    orders: [
      { id: 1, status: 'draft' },
      { id: 2, status: 'ready' },
    ],
  },
  {
    indexEnabled: true,
    indexStrategy: 'lazy-key',
    autoCreate: true,
    arrayDelete: 'splice',
  },
)

const kernel = new RaphKernel({ adapter })
console.log(kernel.get('orders[id=2].status'))
```

## Стратегии

- `eager-all-keys` при первом selector lookup индексирует все простые поля;
- `lazy-key` индексирует только запрошенный ключ;
- `indexEnabled: false` оставляет линейный поиск.

Indexes хранятся по identity массива и создаются лениво. `replaceRoot`, смена
опций и структурные изменения сбрасывают затронутые indexes.

Selector key должен быть стабильным и уникальным. Дубликаты могут давать разный
результат между индексированным и линейным режимом. Не мутируйте root напрямую:
проводите изменения через adapter/Kernel API.
