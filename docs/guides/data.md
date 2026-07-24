# Работа с данными

Базовый поток начинается с Query и заканчивается потребителем данных.

## Получение данных

Query описывает transport, авторизацию, тело запроса и именованные outputs. Он не выбирает Store и не пишет в произвольный путь состояния.

```ts
defineQuery({
  kind: 'rest',
  request: {
    endpoint: env('ENDPOINT_API'),
    path: '/items',
    method: 'GET',
  },
  outputs: {
    raw: output().from(response()),
  },
})
```

Внешние справочники объявляются отдельно через Vocab. Приложение может загрузить обязательный справочник вручную built-in Action после авторизации, а Composition — активировать только зависимости своего root или lifecycle scope:

```ts
data: {
  airlines: vocab('airlines'),
  stations: vocab('stations').policy({
    strategy: 'stale-while-revalidate',
    maxAgeMs: 300_000,
    onError: 'use-cache',
  }),
}
```

Значения остаются в общем Raph-кеше и не копируются в Composition. Подробно: [Справочники (Vocab)](/reference/vocab).

## Подготовка данных

Если форма ответа не подходит компоненту, добавьте DataView. Преобразование должно быть отдельным, повторяемым этапом, а не скрытой логикой визуального компонента.

## Материализация

Composition связывает output с конкретным Store или передаёт его следующему потребителю. Так один Query можно использовать в нескольких сценариях хранения и отображения.

## Проверка

- Проверьте окружение и endpoint.
- Проверьте входные props и сформированное тело запроса.
- Посмотрите сырой response до преобразования.
- Затем проверьте каждый output и DataView по отдельности.

Подробный контракт: [Query](/reference/query), [DataView](/reference/data-view) и [Справочники (Vocab)](/reference/vocab).
