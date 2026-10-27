---
description: "TypeScript-декларации @endge/core 1.0.0-dev.11, группа EndgeVocabs_Module; исходных модулей: 1."
---

# @endge/core: EndgeVocabs_Module

Версия source: 1.0.0-dev.11. [Каталог package](./). [Repository](https://github.com/endge-lab/core).

## src/features/core/modules/EndgeVocabs_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/EndgeVocabs_Module.ts)

```ts
import type { VocabCacheOperationResult, VocabLoadPolicy, VocabReference } from '@/features/core/modules/runtime/domain/vocab-cache.types';
import { EndgeModule } from '@/features/federation/EndgeModule';
export interface VocabAcquireOptions {
    dataMode?: 'live' | 'mock';
    signal?: AbortSignal;
}
export declare class EndgeVocabs_Module extends EndgeModule {
    loading: boolean;
    reset(): void;
    getPath(identity: string, options?: Pick<VocabAcquireOptions, 'dataMode'>): string;
    init(): void;
    loadNamespace(namespace: string): Promise<void>;
    getNamespaceValues(namespace: string, vocabs?: string | null): Array<any>;
    getVocabsValues(namespace: string, vocabs: string): Array<any>;
    getValues(vocabs: string, options?: Pick<VocabAcquireOptions, 'dataMode'>): Array<any>;
    getSample(vocabIdentity: string, collectionSlug: string, limit?: number): Promise<any[]>;
    getValuesById(vocabId: string | number): Array<any>;
    hasCacheById(vocabId: string | number): boolean;
    clearCacheById(vocabId: string | number): void;
    acquire(vocabs: readonly VocabReference[], policy?: Partial<VocabLoadPolicy>, options?: VocabAcquireOptions): Promise<VocabCacheOperationResult[]>;
    refresh(vocabs: readonly VocabReference[]): Promise<VocabCacheOperationResult[]>;
    invalidate(vocabs: readonly VocabReference[]): VocabCacheOperationResult[];
    loadById(vocabId: string | number, limit?: number): Promise<void>;
    getSampleById(vocabId: string | number, limit?: number): Promise<any[]>;
    loadVocab(idOrIdentity: string | number, options?: {
        throwOnError?: boolean;
        dataMode?: 'live' | 'mock';
    }): Promise<any[]>;
    loadRawVocab(idOrIdentity: string | number, options?: {
        limit?: number;
        throwOnError?: boolean;
    }): Promise<unknown>;
}
```
