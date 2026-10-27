# Инспектор по тенантам АФЛ/КЗН

Задача: один инспектор рейса для двух тенантов. Данные приходят из одного GraphQL API, но АФЛ показывает выход и КВС, а КЗН — стоянку, агента наземного обслуживания и второго пилота. Набор секций и полей должен настраиваться без правки компонента.

Решение использует один Query по супермножеству схемы, фасет «тенант» и схему инспектора в Configuration. Тенант выбирает фрагмент GraphQL, contract ответа, секции инспектора и дополнительный компонент.

[Скачать пример workspace](/examples/tenant-inspector.json){target="_blank"}

## Документы

| Документ | Identity | Роль |
| --- | --- | --- |
| Facet | `tenant` | документы `afl` и `kzn` |
| Facet document | `tenant/afl`, `tenant/kzn` | секции инспектора тенанта (`inherit`), у КЗН ещё заголовок |
| Type | `Flight`, `CrewMember` | рейс АФЛ: `gate`, `crew[]` |
| Type | `FlightKzn` | рейс КЗН: `Flight` + `stand`, `handlingAgent` |
| Type | `InspectorSection`, `InspectorField` | схема инспектора: секция → поля (подпись, путь, формат) |
| Configuration | `inspector` | `title` и `sections` по умолчанию |
| Query | `flight` | GraphQL-запрос рейса |
| DataView | `inspector-model` | рейс + схема → модель инспектора |
| Component SFC | `flight-inspector` | инспектор |
| Component SFC | `kzn-handling` | стоянка и агент, только для КЗН |
| Composition | `flight-inspector` | собирает всё вместе |

## Типы

Тип рейса КЗН наследует рейс АФЛ ([`extends`](/reference/type#наследование-extends)):

```ts
defineType({
  extends: type('Flight'),
  fields: {
    stand: field(String),
    handlingAgent: field(String),
  },
})
```

## Схема инспектора в Configuration

```ts
defineConfig({
  title: value(String, 'Инспектор рейса').label('Заголовок'),
  sections: value(arrayOf(type('InspectorSection')), [/* секции АФЛ */]).label('Секции инспектора'),
})
```

Документ фасета `tenant/kzn` заменяет `sections` своими секциями. Путь каждого поля — [путь чтения](/reference/value-expressions#синтаксис-путеи) в объекте рейса: `crew[role="PIC"].name` у АФЛ, `crew[role="FO"].name` у КЗН.

## Query по супермножеству

Operation одна, тенант выбирает фрагмент и contract output:

```ts
defineQuery({
  kind: 'graphql',
  props: defineProps({ id: field(String) }),
  request: {
    endpoint: 'https://flights.example.test/graphql',
    document: gql`query Flight($id: ID!) { flight(id: $id) { ...FlightFields } }`,
    fragments: {
      FlightFields: contextSwitch({
        default: gql`fragment FlightFields on Flight { id number status departure gate crew { role name } }`,
        cases: [{
          when: { tenant: 'kzn' },
          use: gql`fragment FlightFields on Flight { id number status departure stand handlingAgent crew { role name } }`,
        }],
      }),
    },
    variables: variables(({ prop }) => ({ id: prop('id') })),
    headers: { 'X-Tenant': facet('tenant') },
  },
  outputs: {
    flight: output().from(response('flight')).contract(field(contextSwitch({
      default: type('Flight'),
      cases: [{ when: { tenant: 'kzn' }, use: type('FlightKzn') }],
    }))),
    inspector: output().from(response('flight')).dataView('inspector-model'),
  },
})
```

## Модель инспектора

DataView соединяет рейс со схемой текущего тенанта. Значение поля читается по пути из настройки:

```ts
defineDataView({
  mode: 'projection',
  output: {
    tenant: facet('tenant'),
    title: concat(config('inspector.title'), ' ', path('number')),
    sections: config('inspector.sections').map({
      title: get('title'),
      fields: get('fields').map({
        label: get('label'),
        format: get('format'),
        value: get(path(''), get('path')),
      }),
    }),
  },
})
```

## Компонент и Composition

Компонент `flight-inspector` не знает о тенантах: он перебирает секции и поля модели и показывает `Badge` для формата `badge`.

```vue
<template>
  <Flex col gap="3">
    <Flex row gap="2" align="center">
      <Text weight="600">{{ model.title }}</Text>
      <Badge tone="info">{{ model.tenant }}</Badge>
    </Flex>
    <Flex col gap="2" for="section in model.sections" :key="section.title">
      <Text weight="600">{{ section.title }}</Text>
      <Flex row gap="2" align="center" for="item in section.fields" :key="item.label">
        <Text>{{ item.label }}</Text>
        <Badge if="item.format === 'badge'" tone="warning">{{ item.value }}</Badge>
        <Text else>{{ item.value }}</Text>
      </Flex>
    </Flex>
  </Flex>
</template>
```

Компонент КЗН попадает в сборку только для этого тенанта ([`enabledWhen`](/reference/composition#enabledwhen-элемент-только-для-фасета)):

```ts
defineComposition({
  runtimes: {
    flight: query('flight').withProps({ id: 'SU1402' }),
    inspector: component('flight-inspector').withProps({ model: fromOutput('flight', 'inspector') }),
    handling: component('kzn-handling')
      .enabledWhen(context({ tenant: 'kzn' }))
      .withProps({ flight: fromOutput('flight', 'flight') }),
  },
  hooks: [onMount().run('flight')],
})
```

## Что получается

| | АФЛ | КЗН |
| --- | --- | --- |
| Заголовок `X-Tenant` | `afl` | `kzn` |
| Фрагмент | `gate` | `stand handlingAgent` |
| Contract `flight` | `Flight` | `FlightKzn` |
| Секции | «Рейс», «Перрон» (выход, КВС) | «Рейс», «Наземное обслуживание» (стоянка, агент, второй пилот) |
| `kzn-handling` | нет в сборке | получает рейс |

Сценарий проверяет интеграционный тест `@endge/core` (`tenant-inspector.integration.test.ts`): обе сборки из этого workspace, запрос к поддельному GraphQL-серверу и модель инспектора. Отдельный тест сверяет файл примера с fixture теста байт в байт.

## Импорт примера

Файл [`tenant-inspector.json`](/examples/tenant-inspector.json){target="_blank"} — снимок workspace в формате `GET /api/v1/domain/export` (`kind: 'workspace-snapshot'`, `schemaVersion: 10`).

1. Создайте пустой Workspace (нужна роль Admin).
2. Отправьте содержимое файла в `POST /api/v1/domain/import/plan`. Ответ содержит `planId` и предупреждения; ожидаемое — identity входящего workspace не заменит identity целевого.
3. Подтвердите план через `POST /api/v1/domain/import` с `planId` — так же, как это делает экран импорта Configurator.
4. Выберите тенант переключателем фасетов или переменной `VITE_ENDGE_FACETS='{"tenant":"kzn"}'` (см. [Выбор тенанта](/configurator/tenant-selection)).

Workspace импортируется в режиме данных `development`. Адрес `https://flights.example.test/graphql` не существует, поэтому без Mock или Simulation ответа `flight` инспектор в UI не получит данных.
