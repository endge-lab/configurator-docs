# Утилита Codegen

Локальная утилита codegen работает как listener на `127.0.0.1:3210`.

Она нужна для ручного сценария без постоянного демона:

1. пользователь запускает listener;
2. расширение находит открытую вкладку платформы;
3. по кнопке `Сгенерировать` расширение отправляет bundle в listener;
4. listener создаёт или обновляет `src/gen`.

## Запуск

Из корня frontend workspace:

```bash
pnpm codegen:listen
```

Ожидаемое поведение в консоли:

```text
[endge-codegen] Listening on http://127.0.0.1:3210
[endge-codegen] Waiting for Chrome extension connection...
[endge-codegen] Connection not established yet. Retrying in 5 seconds...
```

Когда вкладка найдена и heartbeat пошёл, listener пишет подключение к вкладке.

## Что генерируется

В целевом приложении создаётся каталог `src/gen`:

- `domain.json` — переданный readonly bundle;
- `domain.meta.ts` — версия, время, URL и текущая map выбранных фасетов;
- `catalog.ts` — runtime-каталоги основных сущностей;
- `identifiers.ts` — часто используемые identity-константы;
- `types.ts` — `EndgeGen` с типами фасетов, их документов и обычных коллекций;
- `index.ts` — единая точка экспорта.

Пример generated API для фактических фасетов Workspace:

```ts
import { EndgeGen } from '@/gen'

const facet = EndgeGen.FacetId.region
const region = EndgeGen.FacetDocumentId.region.north_west

type CompositionId = EndgeGen.CompositionId
```

Список фасетов не встроен в утилиту. Codegen строит `FacetId` из
`domain.facets`, а вложенные `FacetDocumentId` — из `domain.facetDocuments`.

## Что нужно для корректной работы

- расширение Chrome установлено и обновлено;
- открыта поддерживаемая вкладка платформы;
- listener запущен локально;
- в popup указан абсолютный путь до целевого приложения.

После генерации IDE подхватывает новые типы и константы. Если структура Domain
изменилась, codegen нужно запустить повторно.
