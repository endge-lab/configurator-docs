---
description: "TypeScript-декларации @endge/ui-vue 1.0.0-dev.11, группа store; исходных модулей: 1."
---

# @endge/ui-vue: store

Версия source: 1.0.0-dev.11. [Каталог package](./). [Repository](https://github.com/endge-lab/ui-vue).

## src/store/domain.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/store/domain.ts)

```ts
import { Endge } from '@endge/core';
export interface DomainView {
    readonly domain: typeof Endge.domain;
    readonly facets: ReturnType<typeof Endge.domain.getFacets>;
    readonly facetDocuments: ReturnType<typeof Endge.domain.getFacetDocuments>;
    readonly types: ReturnType<typeof Endge.domain.getTypes>;
    readonly typesPrimitives: ReturnType<typeof Endge.domain.getTypes>;
    readonly typesComplex: ReturnType<typeof Endge.domain.getTypes>;
    readonly typeCatalog: ReturnType<typeof Endge.program.getTypeCatalog>;
    readonly queries: ReturnType<typeof Endge.domain.getQueries>;
    readonly components: ReturnType<typeof Endge.domain.getComponents>;
    readonly componentSFCs: ReturnType<typeof Endge.domain.getComponentSFCs>;
    readonly actions: ReturnType<typeof Endge.domain.getActions>;
    readonly converters: ReturnType<typeof Endge.domain.getConverters>;
    readonly integrations: ReturnType<typeof Endge.domain.getIntegrations>;
    readonly pageTemplates: ReturnType<typeof Endge.domain.getPageTemplates>;
    readonly pages: ReturnType<typeof Endge.domain.getPages>;
    readonly navigations: ReturnType<typeof Endge.domain.getNavigations>;
    readonly folders: ReturnType<typeof Endge.domain.getFolders>;
    readonly queriesNames: readonly string[];
    readonly filters: ReturnType<typeof Endge.domain.getFilters>;
    readonly compositions: ReturnType<typeof Endge.domain.getCompositions>;
    readonly policies: ReturnType<typeof Endge.domain.getPolicies>;
    readonly styles: ReturnType<typeof Endge.domain.getStyles>;
    readonly vocabs: ReturnType<typeof Endge.domain.getVocabs>;
    readonly i18nBundles: ReturnType<typeof Endge.domain.getI18nBundles>;
    readonly mocks: ReturnType<typeof Endge.domain.getMocks>;
    readonly authProfiles: ReturnType<typeof Endge.domain.getAuthProfiles>;
}
export declare function useDomainStore(): DomainView;
```
