# Кодогенерация: обзор

Кодогенерация в Endge разделена на два слоя:

1. Базовые строковые типы в `@endge/core`.
2. Сгенерированные union-типы и реестры по фактически открытому Domain.

## Базовые типы в Core

До первой генерации consumer может использовать широкие fallback-типы:

```ts
import type {
  EndgeComponentId,
  EndgeFacetDocumentId,
  EndgeFacetId,
} from '@endge/core'

interface Selection {
  facet: EndgeFacetId
  document: EndgeFacetDocumentId
  component: EndgeComponentId
}
```

Core не объявляет известные имена или количество фасетов. Их определения и
документы принадлежат текущему Workspace.

## Сгенерированные типы

После запуска codegen в целевом приложении появляется `src/gen/types.ts` с
namespace `EndgeGen`. Определения фасетов читаются из `domain.facets`, а документы
группируются по `facetIdentity` из `domain.facetDocuments`:

```ts
import { EndgeGen } from '@/gen'

const facet = EndgeGen.FacetId.region
const document = EndgeGen.FacetDocumentId.region.north_west

type FacetId = EndgeGen.FacetId
type FacetDocumentId = EndgeGen.FacetDocumentId
```

Если автор добавляет или переименовывает фасет, следующий запуск codegen меняет
generated API по данным Domain. В утилите нет списка специальных фасетов.

Для обычных коллекций также генерируются узкие identity-типы, например:

```ts
EndgeGen.CompositionId.main
EndgeGen.QueryId.flight_list
EndgeGen.ComponentId.text
EndgeGen.ActionId.refresh
```

Для каждого типа доступны объект-константа, type alias и массив `all...Ids`.
Для фасетов дополнительно доступны `allFacetIds` и `allFacetDocumentIds`.
Ключи объектов нормализуются для TypeScript: identity `north-west` становится
ключом `north_west`, но значением остаётся исходная строка `north-west`.

Если в snapshot нет сущностей нужной коллекции, generated type откатывается к
соответствующему строковому типу из `@endge/core`.

## Граница ответственности

Generated-слой отражает снимок открытого Domain и помогает ловить опечатки в
consumer-коде. Он не выбирает контекст, не изменяет документы и не заменяет
runtime-проверку доступности identity после смены Workspace.
