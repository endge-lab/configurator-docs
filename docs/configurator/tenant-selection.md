# Выбор тенанта

Тенант — это документ фасета, например `tenant/variant-a` или `tenant/variant-b`. Выбранные документы фасетов фиксируются при запуске Endge: от них зависят effective Configuration и значения `facet`, `config`, `context` и `contextSwitch` в Source (см. [Контекст сборки](/reference/value-expressions#контекст-сборки)). Чтобы сменить тенант, Endge запускается заново с другим выбором.

Есть два способа выбрать тенант: явно при запуске или по claim пользователя после входа.

## При запуске

Приложение передаёт выбор в `Endge.boot`:

```ts
await Endge.boot({ ...ctx, context: { facets: { tenant: 'variant-b' } } })
```

В Configurator то же задаёт переменная сборки:

```dotenv
VITE_ENDGE_FACETS={"tenant":"variant-b"}
```

Значение — JSON-объект «фасет → документ». Если это не JSON-объект, инициализация Configurator завершается ошибкой. Во время работы выбор меняет переключатель фасетов (`switchContext({ facets })`), он перезапускает Endge.

## По claim пользователя

Выбор можно взять из claims auth-сессии:

```ts
await Endge.boot({
  ...ctx,
  auth: {
    facetClaims: {
      tenant: { claim: '/org/tenant', map: { 'VARIANT-A-01': 'variant-a', 'VARIANT-B-01': 'variant-b' }, missing: 'default' },
    },
  },
})
```

| Поле | Значение |
| --- | --- |
| `claim` | JSON Pointer (RFC 6901: `~0`, `~1`, индексы массивов) или имя claim верхнего уровня |
| `map` | значение claim → identity документа фасета; без `map` значение claim и есть identity. Для claim-массива (например, групп) берётся первый элемент, найденный в `map` |
| `missing` | `'default'` (по умолчанию) или `'error'` — что делать, если claim нет, он не строка или его значения нет в `map` |

Claims берутся из id/access token default-профиля и дополняются OIDC userinfo; значения токена приоритетнее.

- Выбор по claim фиксирует фасет сессией: он сильнее `context.facets` и сохранённых настроек пользователя.
- Без авторизованной сессии claims ничего не фиксируют, действует выбор при запуске.
- `missing: 'default'`: фасет выбирается как при запуске, а в diagnostics пишется warning `endge.auth.facet-claim`.
- `missing: 'error'`: запуск завершается ошибкой.
- Claim указывает на документ, которого нет в Domain, — ошибка запуска.
- Некорректная настройка (пустой `claim`, неизвестное значение `missing`, пустой документ в `map`) — `TypeError` при настройке auth.

`Endge.auth.facetClaimResolution()` возвращает `{ selections, issues }`: выбранные по claims документы и найденные проблемы.

В Configurator настройку задаёт переменная `VITE_ENDGE_FACET_CLAIMS` — JSON той же формы, что `facetClaims`:

```dotenv
VITE_ENDGE_FACET_CLAIMS={"tenant":{"claim":"/org/tenant","map":{"VARIANT-A-01":"variant-a","VARIANT-B-01":"variant-b"}}}
```

Если переменная задана, Configurator следит за auth-сессией. Когда после входа или смены пользователя выбор по claims меняется, Configurator перезапускает контекст с новым тенантом. Обновление токена с теми же claims перезапуска не вызывает. Фасет, выбранный по claims, закреплён сессией: его переключатель в шапке неактивен с подсказкой «выбор задан сессией».

## Тенант в редакторе

Редактор Source и предпросмотры Configurator компилируют документы в контексте текущего запуска (`Endge.source.currentSourceContext()`): маркеры показывают выбранную ветку, а неизвестный фасет даёт warning `source-expression-facet-unknown`. До разрешения Configuration функция возвращает `null`.

Визуальный редактор Type, графы зависимостей и редактор портов SFC работают без контекста: им нужны все ветки `contextSwitch`.

Выбор документа фасета применяется к [Composition](/reference/composition) и [Configuration](/reference/configuration).
