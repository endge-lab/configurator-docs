# Справочники (Vocab)

Vocab описывает внешний справочник: его стабильный `identity`, API-коллекцию, адрес источника и режим авторизации. Документ Vocab хранится в Domain, а загруженные значения — в общем runtime-кеше Raph по пути:

```text
vocabs.<collectionSlug>
```

Composition и built-in Actions используют один модуль `Endge.vocabs`. Они не создают отдельные копии значений и не меняют место хранения справочников.

## Ручное управление

В каталоге built-in Actions `Справочники` доступны:

| Action identity | Назначение |
| --- | --- |
| `built-in-vocabs-acquire` | Загрузить отсутствующие справочники, используя cache-first |
| `built-in-vocabs-refresh` | Принудительно перечитать справочники из сети |
| `built-in-vocabs-invalidate` | Удалить справочники из Raph-кеша без сетевого запроса |

Каждый Action принимает один или несколько Vocab references. Эти Actions принадлежат ядру: они существуют без документов Action в базе данных.

Ручной вызов нужен, когда порядок определяет приложение. Например, AODB после авторизации сначала загружает только `workspace`; остальные справочники не должны автоматически подгружаться до активации соответствующей Composition.

## Декларация в Composition

Корневой `data` активируется вместе с корневым scope:

```ts
defineComposition({
  data: {
    airlines: vocab('airlines'),

    aircrafts: vocab('aircrafts').policy({
      strategy: 'cache-first',
      maxAgeMs: 86_400_000,
    }),

    stations: vocab('stations').policy({
      strategy: 'stale-while-revalidate',
      maxAgeMs: 300_000,
      onError: 'use-cache',
    }),

    flightServiceTypes: vocab('flight-service-types').policy({
      strategy: 'network-first',
      onError: 'fail',
    }),
  },

  runtimes: {
    schedule: component('schedule'),
  },
})
```

Если `.policy(...)` отсутствует, compiler использует:

```ts
{
  strategy: 'cache-first',
  maxAgeMs: null,
  onError: 'fail',
}
```

## Использование в Component SFC

Component SFC не получает загруженный массив через `defineProps` и не вызывает
загрузку самостоятельно. Имя поля в `Composition.data` становится публичным
alias ближайшего runtime scope:

```ts
defineComposition({
  data: {
    airlines: vocab('aodb-airlines'),
  },

  runtimes: {
    card: component('schedule-card'),
  },
})
```

SFC преобразует записи справочника в `SourceFieldOption[]` встроенной функцией:

```vue
<Select
  :value="flight.flightCarrier"
  :options="vocab('airlines', {
    valuePath: 'code',
    labelPath: 'description',
  })"
/>
```

Первый аргумент — статический публичный alias `airlines`, а не физическая
identity `aodb-airlines`. Mapping также статичен и задаёт пути внутри одной
записи. Если записи уже имеют поля `value` и `label`, второй аргумент можно
опустить:

```vue
<Select :value="status" :options="vocab('statuses')" />
```

Compiler сохраняет alias и mapping в runtime dependencies SFC artifact.
Component host разрешает alias через effective Composition catalog и
подписывается на связанный `vocabs.<collectionSlug>` path. Обновление общего
Raph-кеша приводит к повторному render без передачи нового prop.

Если alias отсутствует в runtime tree, это ошибка конфигурации. SFC не выполняет
fallback-поиск по глобальному cache и не может подставить физическую identity.
Полный SFC-контракт описан в
[Component SFC: функции runtime-контекста](/reference/component-sfc#функции-runtime-контекста).

В прямом Component SFC preview Configurator создаёт временную Composition по
compiler-derived dependencies. Он использует единственное соответствие alias к
Vocab identity из compiled Composition artifacts; неоднозначный alias требует
запуска через конкретную Composition preview. Это preview-only поведение и не
меняет production resolution.

## Политика загрузки

```ts
interface VocabLoadPolicy {
  strategy:
    | 'cache-first'
    | 'network-first'
    | 'stale-while-revalidate'
  maxAgeMs?: number | null
  onError?: 'fail' | 'use-cache'
}
```

| Strategy | Поведение |
| --- | --- |
| `cache-first` | Использует свежий кеш; при отсутствии или истечении `maxAgeMs` ожидает сетевую загрузку |
| `network-first` | Сначала ожидает сеть; при `onError: 'use-cache'` может вернуть существующий кеш |
| `stale-while-revalidate` | Немедленно использует существующее значение и, если оно устарело, обновляет его в фоне |

`maxAgeMs: null` означает, что запись не устаревает автоматически. `maxAgeMs: 0` требует обновления при каждой активации согласно выбранной strategy.

`onError: 'use-cache'` работает только при наличии существующего значения. Если кеша нет, ошибка загрузки остается ошибкой активации.

## Scope

Vocab можно привязать к lifecycle scope:

```ts
defineComposition({
  data: {
    airlines: vocab('airlines'),
  },

  runtimes: {
    published: scope({
      data: {
        aircrafts: vocab('aircrafts').policy({
          strategy: 'cache-first',
          maxAgeMs: 86_400_000,
        }),
      },
      runtimes: {
        table: component('published-schedule'),
      },
    }),

    sandbox: scope({
      data: {
        stations: vocab('stations').policy({
          strategy: 'network-first',
          onError: 'use-cache',
        }),
      },
      runtimes: {
        table: component('sandbox-schedule'),
      },
    }).activateOn(manual()),
  },
})
```

При активации scope runtime:

1. параллельно разрешает все Vocab-зависимости этого scope;
2. для блокирующих стратегий ожидает их завершения;
3. затем создаёт runtime-ноды scope.

Корневые aliases видимы во всех дочерних scopes. Alias вложенного scope видим в
нём и его потомках. Если вложенный scope объявляет alias с тем же именем, его
Vocab становится ближайшим provider только для этого поддерева; после выхода из
scope снова действует родительский alias. В текущем контракте вложенный
`scope.data` принимает Vocab, а Store объявляется только в корневом `data`.

Деактивация или уничтожение Composition не удаляет общий Vocab-кеш. Явное удаление выполняет только `invalidate`. Параллельные запросы одного `identity` объединяются в один in-flight запрос.

## Граница ответственности

- Domain хранит конфигурацию Vocab.
- Compiler проверяет декларацию и сохраняет нормализованную policy в Program artifact.
- Composition runtime решает, когда dependency нужна.
- `Endge.vocabs` загружает и дедуплицирует запросы.
- Raph хранит текущие значения.
- Component SFC host разрешает публичный alias, строит options и подписывается на cache path.
- Renderer повторяет render при изменении использованного справочника.
- Приложение самостоятельно определяет ручные загрузки до активации Composition.

Разделение кеша по пользователю, workspace или auth-сессии не выводится неявно из Composition. До появления отдельного `cacheScope` приложение должно явно инвалидировать чувствительные справочники при смене контекста авторизации.
