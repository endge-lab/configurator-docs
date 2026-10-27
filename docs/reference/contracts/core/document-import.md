---
description: "TypeScript-декларации @endge/core 1.0.0-dev.11, группа document-import; исходных модулей: 2."
---

# @endge/core: document-import

Версия source: 1.0.0-dev.11. [Каталог package](./). [Repository](https://github.com/endge-lab/core).

## src/features/core/modules/document-import/domain/types/document-import.type.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/document-import/domain/types/document-import.type.ts)

```ts
export type DocumentImportFormat = 'graphql' | 'openapi';
export type DocumentImportCandidateStatus = 'ready' | 'conflict' | 'invalid';
export interface DocumentImportDiagnostic {
    severity: 'info' | 'warning' | 'error';
    code: string;
    message: string;
    candidateId?: string;
    line?: number;
    column?: number;
}
export interface DocumentImportSkippedItem {
    kind: string;
    identity?: string;
    reason: string;
}
export interface DocumentImportCandidate {
    id: string;
    documentType: 'type';
    identity: string;
    displayName: string;
    description?: string;
    status: DocumentImportCandidateStatus;
    sourcePreview: string;
    summary: {
        fields: number;
        requiredFields: number;
    };
    diagnostics: DocumentImportDiagnostic[];
}
export interface DocumentImportPlan {
    id: string;
    format: DocumentImportFormat;
    sourceName?: string;
    createdAt: string;
    candidates: DocumentImportCandidate[];
    diagnostics: DocumentImportDiagnostic[];
    skipped: DocumentImportSkippedItem[];
}
export interface DocumentImportPrepareRequest {
    format: DocumentImportFormat;
    source: string;
    sourceName?: string;
}
export interface DocumentImportDestination {
    folderId: string | number | null;
}
export interface DocumentImportApplyRequest {
    planId: string;
    selectedCandidateIds: readonly string[];
    destination: DocumentImportDestination;
    conflictPolicy?: 'skip';
}
export interface DocumentImportApplyItemResult {
    candidateId: string;
    identity: string;
    status: 'imported' | 'skipped' | 'failed';
    message?: string;
}
export interface DocumentImportApplyResult {
    planId: string;
    imported: number;
    skipped: number;
    failed: number;
    items: DocumentImportApplyItemResult[];
}
```

## src/features/core/modules/document-import/EndgeDocumentImport_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/document-import/EndgeDocumentImport_Module.ts)

```ts
import type { DocumentImportApplyRequest, DocumentImportApplyResult, DocumentImportPlan, DocumentImportPrepareRequest } from '@/features/core/modules/document-import/domain/types/document-import.type';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeDocumentImport_Module extends EndgeModule {
    prepare(request: DocumentImportPrepareRequest): DocumentImportPlan;
    apply(request: DocumentImportApplyRequest): Promise<DocumentImportApplyResult>;
    reset(): void;
}
```
