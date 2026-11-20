---
description: "TypeScript-декларации @endge/core 1.8.0-dev.25, группа domain-repository; исходных модулей: 2."
---

# @endge/core: domain-repository

Версия source: 1.8.0-dev.25. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/core); сама ссылка не подтверждает snapshot этого контракта. Source snapshot не является проверкой текущих npm tags или развёрнутого приложения. Проверенный опубликованный source snapshot: [ef69ac170d1982c3df93d1bfc4be5a03893c5226](https://github.com/endge-lab/core/tree/ef69ac170d1982c3df93d1bfc4be5a03893c5226).

## src/features/core/modules/domain-repository/EndgeDomainRepository_Module.ts

Исходный модуль: [src/features/core/modules/domain-repository/EndgeDomainRepository_Module.ts](https://github.com/endge-lab/core/blob/ef69ac170d1982c3df93d1bfc4be5a03893c5226/src/features/core/modules/domain-repository/EndgeDomainRepository_Module.ts)

```ts
import type { EndgeBootContext } from '@/features/core/kernel/types/bootstrap.types';
import type { DocumentCreateRequest, DocumentCreateResult } from '@/features/core/modules/domain/types/document/document-create.type';
import type { EndgeDomainDocumentMove } from '@/features/core/modules/domain/types/document/document-move.type';
import type { DomainDocumentType } from '@/features/core/modules/domain/types/document/document.types';
import type { EndgeArchivedDocument, EndgeArchivePage, EndgeDomainRepositoryCapabilities } from '@/features/core/modules/domain/types/document/domain-provider.type';
import type { EndgeDocumentServerState, EndgeLiveDomainDocument, EndgeLiveDomainSnapshot } from '@/features/core/modules/domain/types/document/domain-snapshot.type';
import { RFacet } from '@/features/core/modules/domain/entities/RFacet';
import { RFacetDocument } from '@/features/core/modules/domain/entities/RFacetDocument';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeDomainRepositoryReadOnlyError extends Error {
    readonly code = "provider_read_only";
    constructor(provider: string);
}
export declare class EndgeDomainRepository_Module extends EndgeModule<EndgeBootContext> {
    get generation(): number;
    get capabilities(): EndgeDomainRepositoryCapabilities;
    get domainETag(): string | null;
    get isHealthy(): boolean;
    get hasErrors(): boolean;
    setup(ctx: EndgeBootContext): Promise<void>;
    loadSnapshot(ctx: EndgeBootContext): Promise<EndgeLiveDomainSnapshot>;
    refreshSnapshot(signal?: AbortSignal): Promise<EndgeLiveDomainSnapshot | null>;
    getLoadedSnapshot(): EndgeLiveDomainSnapshot | null;
    getDocumentServerState(documentType: string, identity: string): EndgeDocumentServerState | null;
    getFacetDocumentServerState(facetIdentity: string, documentIdentity: string): EndgeDocumentServerState | null;
    reset(): void;
    isDocumentIdentityAvailable(documentType: DomainDocumentType, identity: string): Promise<boolean>;
    createDocument(request: DocumentCreateRequest): Promise<DocumentCreateResult>;
    saveDocument(documentId: string | number, documentType: DomainDocumentType, opts?: {
        model?: unknown;
        previousIdentity?: string;
    }): Promise<void>;
    deleteDocument(documentIdOrIdentity: string, documentType: DomainDocumentType): Promise<void>;
    restoreDocument(documentIdOrIdentity: string, documentType: DomainDocumentType): Promise<void>;
    listArchivedDocuments(cursor?: string, limit?: number): Promise<EndgeArchivePage>;
    restoreArchivedDocument(item: EndgeArchivedDocument): Promise<EndgeLiveDomainDocument>;
    changeDocumentFolder(documentId: string | number, documentType: DomainDocumentType, folderIdOrIdentity: string | number | null, placement?: 'frontend' | 'workspace'): Promise<void>;
    changeDocumentsFolder(documents: readonly EndgeDomainDocumentMove[], folderIdOrIdentity: string | number, placement?: 'frontend' | 'workspace'): Promise<number>;
    saveFolder(folderId: string): Promise<void>;
    deleteFolder(folderIdentity: string): Promise<void>;
    restoreFolder(folderIdentity: string): Promise<void>;
    listFacets(includeDeleted?: boolean): Promise<RFacet[]>;
    createFacet(document: Record<string, unknown>): Promise<RFacet>;
    updateFacet(identity: string, document: Record<string, unknown>): Promise<RFacet>;
    deleteFacet(identity: string): Promise<RFacet>;
    restoreFacet(identity: string): Promise<RFacet>;
    reorderFacets(identities: readonly string[]): Promise<RFacet[]>;
    listFacetDocuments(facetIdentity: string, includeDeleted?: boolean): Promise<RFacetDocument[]>;
    createFacetDocument(facetIdentity: string, document: Record<string, unknown>): Promise<RFacetDocument>;
    updateFacetDocument(facetIdentity: string, identity: string, document: Record<string, unknown>): Promise<RFacetDocument>;
    deleteFacetDocument(facetIdentity: string, identity: string): Promise<RFacetDocument>;
    restoreFacetDocument(facetIdentity: string, identity: string): Promise<RFacetDocument>;
    toJSON(): Record<string, unknown>;
}
```

## src/features/core/modules/domain-repository/services/resolve-endge-domain-load-options.ts

Исходный модуль: [src/features/core/modules/domain-repository/services/resolve-endge-domain-load-options.ts](https://github.com/endge-lab/core/blob/ef69ac170d1982c3df93d1bfc4be5a03893c5226/src/features/core/modules/domain-repository/services/resolve-endge-domain-load-options.ts)

```ts
import type { EndgeDomainBundle } from '../../domain/types/document/domain-export.type';
import type { EndgeDomainProvider } from '../../domain/types/document/domain-provider.type';
export type EndgeDomainSource = {
    kind: 'live';
    workspaceIdentity: string;
    backendURL: string;
} | {
    kind: 'release';
    workspaceIdentity: string;
    backendURL: string;
    releaseIdentity: string;
} | {
    kind: 'bundle';
    workspaceIdentity: string;
    bundleURL: string;
};
export type EndgeDomainLoadOptions = {
    dataProvider: 'default';
    domainProvider: EndgeDomainProvider;
} | {
    dataProvider: 'bundle';
    bundleSource: EndgeDomainBundle;
};
export interface EndgeDomainLoadRequestOptions {
    resolveBootstrapToken?: () => Promise<string | null>;
    signal?: AbortSignal;
}
export declare function resolveEndgeDomainLoadOptions(source: EndgeDomainSource, options?: EndgeDomainLoadRequestOptions): Promise<EndgeDomainLoadOptions>;
```
