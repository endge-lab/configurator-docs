---
description: "TypeScript-декларации @endge/core 1.8.0-dev.25, группа mock; исходных модулей: 2."
---

# @endge/core: mock

Версия source: 1.8.0-dev.25. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/core); сама ссылка не подтверждает snapshot этого контракта. Source snapshot не является проверкой текущих npm tags или развёрнутого приложения. Проверенный опубликованный source snapshot: [ef69ac170d1982c3df93d1bfc4be5a03893c5226](https://github.com/endge-lab/core/tree/ef69ac170d1982c3df93d1bfc4be5a03893c5226).

## src/features/core/modules/mock/domain/types/mock-data.type.ts

Исходный модуль: [src/features/core/modules/mock/domain/types/mock-data.type.ts](https://github.com/endge-lab/core/blob/ef69ac170d1982c3df93d1bfc4be5a03893c5226/src/features/core/modules/mock/domain/types/mock-data.type.ts)

```ts
import type { RMock } from '@/features/core/modules/domain/entities/RMock';
export type RMockContentSource = 'document' | 'code-provider';
export type RMockContentType = 'application/json' | 'text/plain';
export interface EndgeMockProviderContext {
    mock: RMock;
}
export interface EndgeMockProvider {
    ref: string;
    description?: string;
    provide: (context: EndgeMockProviderContext) => unknown;
}
export interface EndgeMockRegistration {
    identity: string;
    data: unknown;
    description?: string;
}
export interface EndgeMockDescriptor {
    ref: string;
    description?: string;
}
export type EndgeMockBindingStatus = 'document' | 'connected' | 'missing-document' | 'missing-provider' | 'invalid-content';
export interface EndgeMockSnapshot {
    providers: EndgeMockDescriptor[];
}
export interface EndgeMockReference {
    kind: 'mock';
    identity: string;
}
```

## src/features/core/modules/mock/EndgeMock_Module.ts

Исходный модуль: [src/features/core/modules/mock/EndgeMock_Module.ts](https://github.com/endge-lab/core/blob/ef69ac170d1982c3df93d1bfc4be5a03893c5226/src/features/core/modules/mock/EndgeMock_Module.ts)

```ts
import type { EndgeMockBindingStatus, EndgeMockDescriptor, EndgeMockProvider, EndgeMockRegistration, EndgeMockSnapshot } from '@/features/core/modules/mock/domain/types/mock-data.type';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeMock_Module extends EndgeModule {
    constructor();
    registerProvider(provider: EndgeMockProvider): void;
    register(registration: EndgeMockRegistration): void;
    getBindingStatus(identity: string): EndgeMockBindingStatus;
    has(identity: string): boolean;
    get<T = unknown>(identity: string): T;
    listProviders(): EndgeMockDescriptor[];
    list(): EndgeMockDescriptor[];
    reset(): void;
    serialize(): EndgeMockSnapshot;
}
```
