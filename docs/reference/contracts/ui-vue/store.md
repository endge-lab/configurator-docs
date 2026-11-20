---
description: "TypeScript-декларации @endge/ui-vue 2.4.1-dev.24, группа store; исходных модулей: 1."
---

# @endge/ui-vue: store

Версия source: 2.4.1-dev.24. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/ui-vue); сама ссылка не подтверждает snapshot этого контракта. Source snapshot не является проверкой текущих npm tags или развёрнутого приложения. Проверенный опубликованный source snapshot: [3e2e86a56e6b69243302b632d6e35106293ab8b4](https://github.com/endge-lab/ui-vue/tree/3e2e86a56e6b69243302b632d6e35106293ab8b4).

## src/store/domain.ts

Исходный модуль: [src/store/domain.ts](https://github.com/endge-lab/ui-vue/blob/3e2e86a56e6b69243302b632d6e35106293ab8b4/src/store/domain.ts)

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
