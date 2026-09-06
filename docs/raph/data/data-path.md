# DataPath

`DataPath` описывает адрес значения или маску подписки. Один формат используется data adapter, router, phases, observers и derived data.

## Формы пути

| Синтаксис | Значение |
| --- | --- |
| `user.name` | Поле объекта |
| `rows[3].status` | Элемент массива по индексу |
| `rows[id=10].status` | Элемент массива по значению поля |
| `rows[id="SU-10"].status` | Строковый параметр |
| `rows[*].status` | Один произвольный элемент массива |
| `orders.*.status` | Один произвольный dot-сегмент |
| `orders.*` | Любой оставшийся хвост, включая пустой |
| `rows[id=$rowId].status` | Динамическое значение или capture в router |

`[*]` и завершающий `*` имеют разную семантику. Первый соответствует одному индексному сегменту, второй является deep wildcard.

## Создание и сериализация

```ts
import { DataPath } from '@endge/raph'

const path = DataPath.fromString(
  'orders[id=$orderId].items[id=$itemId].price',
  {
    vars: {
      orderId: 10,
      itemId: 5,
    },
  },
)

console.log(path.toStringPath())
// orders[id=10].items[id=5].price
```

Основные операции:

- `DataPath.from(input, options?)` нормализует строку, `DataPath` или plain-описание;
- `DataPath.fromString(path, options?)` разбирает строку;
- `DataPath.fromPlain(value)` восстанавливает сериализованный путь;
- `toStringPath()` возвращает canonical string;
- `toPlain()` создаёт сериализуемое описание;
- `segments()` возвращает read-only список сегментов;
- `DataPath.match(mask, target)` проверяет совпадение.

## Динамические переменные

`vars` подставляет значения `$name`:

```ts
const path = DataPath.from('rows[id=$id].status', {
  vars: { id: 42 },
})
```

С `wildcardDynamic: true` неразрешённая динамическая часть становится wildcard. Этот режим полезен для подписок, но опасен для CRUD: wildcard-пути нельзя использовать как адрес единичного значения.

## Path и mask

Конкретный path адресует значение:

```text
orders[id=10].status
```

Mask выбирает множество возможных событий:

```text
orders[id=$orderId].status
orders[*].status
orders.*
```

Методы `get`, `set`, `merge` и `delete` ожидают concrete path. Wildcards предназначены для matching, tracking и subscriptions.

## Параметризованные коллекции

Сегмент `[id=10]` означает поиск элемента массива, у которого поле `id` равно `10`. Это не обращение к object key. Если текущий контейнер не является массивом, default adapter сообщает об ошибке.

