# Оптимистичные обновления

Этот рецепт сразу показывает введённое пользователем значение, помечает его как
ожидающее серверного ответа и снимает ожидание после следующего серверного
события для того же поля.

Сценарий не требует, чтобы сервер возвращал идентификатор запроса:

```text
edited
  -> Action
     -> единый Update с invocation.kind: optimistic
        -> Data + Meta(status: waiting)
     -> Query

server event
  -> Stream
  -> тот же Update без optimistic-метки
     -> Data + Meta(status: synchronized)
  -> реактивный render Component SFC
```

Здесь Raph Meta хранит пользовательскую метаинформацию пути данных, а не
состояние компонента или таблицы. Строки `waiting`, `synchronized`, `accepted`
и `overridden` являются частью выбранной в рецепте политики: платформа не
придаёт им специального значения.

## Что потребуется

В Configurator создайте или выберите:

1. Store с изменяемой коллекцией `items` и устойчивым ключом `id`.
2. Update `items-change`, принадлежащий этому Store и обрабатывающий оба пути.
3. Query `items-save`, отправляющий `{ id, payload }` на сервер.
4. Action `items-edit-title`, последовательно вызывающий Update и Query.
5. Stream, направленный в Store через Composition.
6. Component SFC, получающий `items` из Composition.

Если эти сущности ещё не знакомы, сначала посмотрите [работу с данными](/guides/data),
[Query](/reference/query), [Update](/reference/update), [Action](/reference/action),
[Stream](/reference/stream) и [Composition](/reference/composition).

В примерах ниже `items`, `title` и все identities абстрактны. Они не являются
зарезервированными именами.

## 1. Создать единый Update

Создайте Update `items-change` и выберите владельцем Store с коллекцией `items`.
`handles` подключает документ к серверному событию, но не запрещает явно
вызывать тот же Update по identity из Action.

Оба пути передают `record` одинаковой формы. Только локальный вызов добавляет
пользовательскую метку `invocation.kind: 'optimistic'`:

```ts
defineUpdate({
  handles: ['ItemUpdated'],

  mutations: [
    {
      strategy: 'set',
      target: 'items[id=$id].title',
      value: input('record.title'),
      when: input('record').has('title'),
      vars: {
        id: 'record.id',
      },
    },

    {
      strategy: 'set',
      target: meta(
        'items[id=$id].title',
        'ui.optimistic',
      ),
      value: {
        status: 'waiting',
        optimisticValue: input('record.title'),
        previousValue: input('previousValue'),
      },
      when: eq(
        input('invocation.kind'),
        'optimistic',
      ),
      vars: {
        id: 'record.id',
      },
    },

    {
      strategy: 'merge',
      target: meta(
        'items[id=$id].title',
        'ui.optimistic',
      ),
      value: {
        status: 'synchronized',
        serverValue: input('record.title'),
        result: when(
          eq(
            input('record.title'),
            meta(
              'items[id=$id].title',
              'ui.optimistic',
            ).get('optimisticValue'),
          ),
          'accepted',
          'overridden',
        ),
      },
      when: and(
        not(eq(
          input('invocation.kind'),
          'optimistic',
        )),
        input('record').has('title'),
        hasMeta(
          'items[id=$id].title',
          'ui.optimistic',
        ),
      ),
      vars: {
        id: 'record.id',
      },
    },
  ],
})
```

Локальный вызов выполняет общую Data mutation и ставит `waiting`. Серверный
вызов выполняет ту же Data mutation, пропускает локальную Meta mutation и при
наличии ожидающей Meta переводит её в `synchronized`.

Все mutations сначала полностью вычисляются и проверяются, а затем применяются
одной Raph transaction. Компонент не увидит промежуточное состояние, в котором
Data уже изменились, а Meta ещё нет. `when` пропускает только свою mutation и
не прерывает остальной Update. Подробнее: [условные mutations](/reference/update#условные-mutations-через-when).

Meta можно записать только для существующего DataPath. Поэтому строка с нужным
`id` и поле `title` должны существовать до запуска Update. Удаление строки или
поля через Raph автоматически удалит связанную Meta. Полный lifecycle описан в
[Raph Meta-plane](/raph/data/meta).

## 2. Выполнить локальный Update перед Query

Создайте Query `items-save` с входом следующей формы:

```ts
{
  id: string
  payload: {
    title: string
  }
}
```

Transport, endpoint и авторизацию настройте как обычно по
[справочнику Query](/reference/query). Затем создайте Action
`items-edit-title`:

```ts
defineAction({
  contract: {
    input: field('Object'),
  },

  steps: {
    optimistic: update({
      identity: 'items-change',
      input: {
        invocation: {
          kind: 'optimistic',
        },
        record: {
          id: input('id'),
          title: input('value'),
        },
        previousValue: input('previousValue'),
      },
    }),

    request: query({
      identity: 'items-save',
      input: {
        id: input('id'),
        payload: {
          title: input('value'),
        },
      },
    }),
  },
})
```

Именованные шаги Action выполняются последовательно, поэтому Query начнётся
только после успешного локального Update. Верхнеуровневый `output` здесь не
нужен: вызывающий компонент не использует результат Action.

Ошибка Query сама по себе не откатывает Data и не меняет Meta. Политика ошибки,
повторной отправки или отмены остаётся пользовательской логикой Action. Если
нужна отмена по `Mod+Z`, добавьте `operation(...)` и настройте
[Operation History](/reference/operation-history).

## 3. Запустить Action из редактируемого значения

В Component SFC передайте новое и предыдущее значения из события `edited`:

```vue
<script setup lang="ts">
defineProps<{
  items: Item[]
}>()
</script>

<template>
  <Table :rows="items" row-key="id">
    <Column key="title" title="Название">
      <Text
        class="optimistic-value"
        :value="$row.data.title"
        :state="{
          waiting: $data.metaOf($row.data.title, 'ui.optimistic')?.status === 'waiting',
          overridden: $data.metaOf($row.data.title, 'ui.optimistic')?.result === 'overridden',
        }"
        editable
        @edited.stop="action({
          identity: 'items-edit-title',
          input: {
            id: $row.id,
            value: event('value'),
            previousValue: event('previousValue'),
          },
        })"
      >
        {{ $row.data.title }}
      </Text>
    </Column>
  </Table>
</template>

<style scoped lang="endgecss">
.optimistic-value:state(waiting) {
  background-color: rgba(245, 158, 11, 0.2);
}

.optimistic-value:state(overridden) {
  background-color: rgba(239, 68, 68, 0.16);
}
</style>
```

`$data.metaOf(reference, namespace?)` получает Meta по provenance входного
значения и подписывает Component runtime на её изменения. В него передаётся
сама статическая ссылка `$row.data.title`, а не строковый DataPath. Подробнее:
[контекстные переменные Component SFC](/sfc-tables/context-variables#метаданные-входных-данных)
и [стили Component SFC](/reference/endgecss/sfc).

## 4. Применить следующее серверное событие

Пусть Stream нормализует сообщение к форме:

```ts
{
  type: 'ItemUpdated',
  record: {
    id: 'item-42',
    title: 'Новое значение',
  },
}
```

Отдельный Update создавать не нужно. Composition направляет событие в Store,
Store находит уже созданный `items-change` по `handles: ['ItemUpdated']` и
передаёт ему payload без `invocation.kind: 'optimistic'`.

Поэтому единый Update:

1. применяет общую Data mutation;
2. пропускает mutation, устанавливающую `waiting`;
3. выполняет server-ветку, если для пути существует ожидающая Meta.

Все expressions читают pre-update state. Поэтому server-ветка сравнивает
серверное значение с `optimisticValue`, которое существовало до применения
всего Update, хотя общая Data mutation находится выше в Source.

Условием завершения ожидания является наличие поля `record.title`, а не
совпадение значений:

- совпало — `result: 'accepted'`;
- пришло другое значение — Store принимает серверное значение и сохраняет
  `result: 'overridden'`;
- поля `title` в событии нет — ни Data, ни Meta этого поля не меняются.

Если после серверного касания Meta больше не нужна, замените server Meta
mutation на удаление namespace:

```ts
{
  strategy: 'remove',
  target: meta(
    'items[id=$id].title',
    'ui.optimistic',
  ),
  when: and(
    not(eq(
      input('invocation.kind'),
      'optimistic',
    )),
    input('record').has('title'),
    hasMeta(
      'items[id=$id].title',
      'ui.optimistic',
    ),
  ),
  vars: {
    id: 'record.id',
  },
}
```

## 5. Связать Store, Stream и Component в Composition

Composition активирует Store, направляет события Stream в его Updates и
передаёт коллекцию компоненту:

```ts
defineComposition({
  data: {
    application: store('application-data'),
  },

  runtimes: {
    changes: stream('application-events')
      .dispatchTo(data('application')),

    table: component('items-table').withProps({
      items: fromData('application.items'),
    }),
  },
})
```

При прямом `fromData(...)` provenance пути передаётся автоматически, поэтому
`$data.metaOf($row.data.title, 'ui.optimistic')` сможет найти Meta без
дополнительного prop или журнала.

Если коллекция сначала проходит через DataView и её runtime path перестаёт
совпадать с owner path Store, добавьте явное отображение `.metaFrom(...)`:

```ts
table: component('items-table').withProps({
  items: fromData('application.items')
    .dataView('visible-items', {
      search: fromOutput('filters', 'search'),
    })
    .metaFrom('application.items', {
      key: 'id',
      fields: {
        title: 'title',
      },
    }),
})
```

`key` связывает преобразованную строку с исходной по устойчивому identity, а
`fields` отображает путь видимого поля на путь owner data. Без `.metaFrom(...)`
значения останутся обычными props, но `$data.metaOf(...)` для них вернёт
`undefined`. Полный контракт находится в разделе
[передачи props runtime-нодам](/reference/composition#передача-props-runtime-нодам).

## Что именно подтверждает этот рецепт

Без request ID, server revision или другого causal token система не может
доказать, что конкретное серверное событие вызвано конкретным Query. Этот рецепт
использует более простую политику: **следующее серверное касание того же поля
завершает ожидание**.

Это подходит, когда сервер сохраняет порядок событий или интерфейсу достаточно
показать последнее наблюдаемое серверное состояние. Если пользователь несколько
раз быстро изменит одно поле, запоздавшее событие первой записи может завершить
ожидание более новой записи. Для строгого подтверждения потребуется доступный в
событии monotonic revision, client token или иной causal marker; Raph Meta может
хранить такой marker, но не создаёт его автоматически.

## Диагностика

| Симптом | Что проверить |
| --- | --- |
| Meta Update завершается ошибкой | DataPath owner существует до записи Meta; `id` и `vars` разрешились |
| Значение изменилось, но ожидание не появилось | Обе mutations находятся в одном локальном Update и используют один namespace |
| Ожидание не снимается | Stream направлен в нужный Store, тип события совпадает с `handles`, payload содержит целевое поле |
| `$data.metaOf(...)` возвращает `undefined` | prop пришёл из Raph-backed `fromData(...)`; после DataView настроен `.metaFrom(...)` |
| Подсвечивается не та строка | Коллекция использует устойчивый identity path, а не позиционный индекс |

В Configurator ошибки синтаксиса, неизвестные identities и несовместимые пути
показываются в Source editor и в [Problems](/configurator/problems-workspace).
Безопасные условия `when(...)`, `eq(...)`, `and(...)` и чтение `.get(...)`
описаны в [функциональных выражениях](/reference/value-expressions).
