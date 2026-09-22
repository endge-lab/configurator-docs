# Сериализация состояния

`getState` и `setState` поддерживают три режима. Выбор режима является явной
частью контракта владельца состояния.

## Plain JSON

Без дополнительных аргументов Core сохраняет обычное JSON-compatible значение:

```ts
interface PanelState {
  open: boolean
  selectedIds: string[]
}

Endge.context.setState<PanelState>('my-module.panel', {
  open: true,
  selectedIds: ['flight-list'],
})

const state = Endge.context.getState<PanelState>('my-module.panel')
```

TypeScript generic не существует в runtime и сам по себе не восстанавливает
class instance, `Date`, `Map` или методы.

## Class и reflect annotations

Передайте constructor, если состояние описано классом и использует существующий
механизм `class-transformer`/`@endge/utils`:

```ts
import { Expose, Type } from 'class-transformer'

class ItemState {
  @Expose()
  id = ''
}

class PanelState {
  @Expose()
  open = false

  @Expose()
  @Type(() => ItemState)
  items: ItemState[] = []
}

const state = new PanelState()
state.open = true

Endge.context.setState('my-module.panel', state, PanelState)
const restored = Endge.context.getState('my-module.panel', PanelState)
```

В этом режиме Core использует `Serialize.toPlain(...)` и
`Serialize.fromJSON(...)`. Действуют annotations `@Expose`, `@Type` и
поддерживаемый проектом callback `@onDeserialized`. Поскольку сериализация
исключает неэкспонированные поля, persistent свойства должны быть отмечены явно.

## Ручной codec

Codec нужен, если storage shape должен отличаться от runtime shape:

```ts
interface SearchState {
  query: string
  updatedAt: Date
}

const searchStateCodec = {
  serialize: (state: SearchState) => ({
    query: state.query,
    updatedAt: state.updatedAt.toISOString(),
  }),
  deserialize: (value: unknown): SearchState => {
    const raw = value as { query?: unknown, updatedAt?: unknown }
    return {
      query: String(raw.query ?? ''),
      updatedAt: new Date(String(raw.updatedAt ?? 0)),
    }
  },
}

const searchState: SearchState = {
  query: 'SU 100',
  updatedAt: new Date(),
}

Endge.context.setState('my-module.search', searchState, searchStateCodec)
const restored = Endge.context.getState('my-module.search', searchStateCodec)
```

Codec должен валидировать входные данные и возвращать безопасный default либо
бросать ошибку. Core перехватывает ошибку storage/codec и возвращает `undefined`.

## Versioning

Если shape меняется несовместимо, включите version в значение и выполните
миграцию в `deserialize`. Версия относится к состоянию потребителя; version `v1`
в storage key Core описывает только формат общей изоляции scope.
