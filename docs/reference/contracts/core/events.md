---
description: "TypeScript-декларации @endge/core 1.0.0-dev.12, группа events; исходных модулей: 2."
---

# @endge/core: events

Версия source: 1.0.0-dev.12. [Каталог package](./). [Repository](https://github.com/endge-lab/core).

## src/features/core/modules/events/domain/events.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/events/domain/events.types.ts)

```ts
import type { RuntimeHostStatus } from '@/features/core/modules/runtime/domain/runtime-host.types';
import type { EndgeDataMode } from '@/features/core/modules/workspace/domain/workspace.types';
export interface EndgeEventBinding {
    event: string;
    actionId: string | null;
}
export interface ContextValueChange<T> {
    readonly previous: T;
    readonly value: T;
}
export interface EndgeCoreEventMap {
    'context:workspace-changed': ContextValueChange<string | null>;
    'context:facets-changed': ContextValueChange<Readonly<Record<string, string>>>;
    'context:user-changed': ContextValueChange<string>;
    'context:locale-changed': ContextValueChange<string>;
    'context:theme-changed': ContextValueChange<string>;
    'context:timezone-changed': ContextValueChange<string>;
    'context:data-mode-changed': ContextValueChange<EndgeDataMode>;
    'runtime:data-changed': {
        readonly revision: number;
    };
    'runtime:registry-changed': Record<string, never>;
    'runtime:scopes-changed': Record<string, never>;
    'runtime:host-status-changed': {
        readonly id: string;
        readonly previous: RuntimeHostStatus;
        readonly value: RuntimeHostStatus;
    };
    'updates:message': {
        type: string;
        message: unknown;
    };
    'updates:applied': {
        identity: string;
        count: number;
    };
}
export interface EndgeCustomEventMap {
    [event: string]: unknown;
}
export interface EndgeEvent<T> {
    readonly payload: T;
}
export interface EndgePublishedEvent<T = unknown> extends EndgeEvent<T> {
    readonly name: string;
    readonly at: number;
    readonly sequence: number;
}
```

## src/features/core/modules/events/EndgeEvents_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/events/EndgeEvents_Module.ts)

```ts
import type { EventCallback, OneOrMany } from '@endge/utils';
import type { EndgeCoreEventMap, EndgeCustomEventMap, EndgeEvent, EndgePublishedEvent } from '@/features/core/modules/events/domain/events.types';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeEvents_Module extends EndgeModule {
    onAny(callback: (event: EndgePublishedEvent) => void): () => void;
    onEvent<K extends keyof EndgeCoreEventMap & string>(events: OneOrMany<K>, callback: (event: EndgeEvent<EndgeCoreEventMap[K]>) => void): () => void;
    emitEvent<K extends keyof EndgeCoreEventMap & string>(name: K, payload: EndgeCoreEventMap[K]): EndgePublishedEvent<EndgeCoreEventMap[K]>;
    onDynamic<K extends keyof EndgeCustomEventMap & string>(events: OneOrMany<K>, callback: (event: EndgeEvent<EndgeCustomEventMap[K]>) => void): () => void;
    emitDynamic<K extends keyof EndgeCustomEventMap & string>(name: K, payload: EndgeCustomEventMap[K]): EndgePublishedEvent<EndgeCustomEventMap[K]>;
    on<K extends keyof EndgeCoreEventMap & string>(events: OneOrMany<K>, callback: EventCallback<EndgeCoreEventMap[K]>): void;
    off<K extends keyof EndgeCoreEventMap & string>(events: OneOrMany<K>, callback: EventCallback<EndgeCoreEventMap[K]>): void;
    onCustom<K extends keyof EndgeCustomEventMap & string>(events: OneOrMany<K>, callback: EventCallback<EndgeCustomEventMap[K]>): void;
    offCustom<K extends keyof EndgeCustomEventMap & string>(events: OneOrMany<K>, callback: EventCallback<EndgeCustomEventMap[K]>): void;
    reset(): void;
}
```
