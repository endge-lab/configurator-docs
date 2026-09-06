# Vue reactivity

Package `@endge/ui-vue` экспортирует `useContextState`. Он возвращает обычный
Vue `Ref`, связанный с dynamic state Core.

```ts
import { useContextState } from '@endge/ui-vue'

const navigation = useContextState(
  'my-module.navigation',
  () => ({
    expanded: true,
    selected: [] as string[],
  }),
)

navigation.value.expanded = false
navigation.value.selected.push('operations')
```

Вложенные изменения отслеживаются глубоко и автоматически передаются в
`Endge.context.setState(...)`. Изменение того же key другим потребителем обновляет
`Ref`; при смене context или пользователя composable перечитывает значение нового
scope. Подписки освобождаются вместе с текущим Vue effect scope.

## Class state

Constructor или ручной codec передаётся третьим аргументом так же, как в Core:

```ts
const panel = useContextState(
  'my-module.panel',
  () => new PanelState(),
  PanelState,
)
```

## Частые обновления

`useContextState` записывает каждое наблюдаемое изменение. Для scroll position,
Monaco view state и других высокочастотных событий сначала обновляйте значение
через debounce или сохраняйте агрегированный snapshot. Например, состояние
редактора можно снимать после короткой паузы, а не при каждом событии прокрутки
или перемещении курсора.

Composable следует создавать после boot, когда Core уже определил workspace и
пользователя. Для singleton, живущего вне component scope, подписка сохраняется
до конца жизни приложения; обычным компонентам предпочтителен вызов из `setup`.
