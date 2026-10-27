---
description: "TypeScript-декларации @endge/utils 1.0.0-dev.6, группа events; исходных модулей: 1."
---

# @endge/utils: events

Версия source: 1.0.0-dev.6. [Каталог package](./). [Repository](https://github.com/endge-lab/utils).

## src/events/EventBus.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/events/EventBus.ts)

```ts
import type { OneOrMany } from '@/tools/tools.types';
export type EventCallback<T = any> = (payload: T) => void;
export type EventList = Record<string, any>;
export interface EventBusOptions {
    onListenerError?: (error: unknown, event: string) => void;
}
export declare class EventBus<StaticEvents extends Record<string, any>, CustomEventMap extends Record<string, any> = Record<string, any>> {
    constructor(predefinedEvents?: Array<keyof StaticEvents>, _options?: EventBusOptions);
    on<K extends keyof StaticEvents>(events: OneOrMany<K>, callback: EventCallback<StaticEvents[K]>): void;
    once<K extends keyof StaticEvents>(events: OneOrMany<K>, callback: EventCallback<StaticEvents[K]>): void;
    off<K extends keyof StaticEvents>(events: OneOrMany<K>, callback: EventCallback<StaticEvents[K]>): void;
    offAll(): void;
    emit<K extends keyof StaticEvents>(event: K, payload: StaticEvents[K]): void;
    onCustom<K extends keyof CustomEventMap>(events: OneOrMany<K>, callback: EventCallback<CustomEventMap[K]>): void;
    onceCustom<K extends keyof CustomEventMap>(events: OneOrMany<K>, callback: EventCallback<CustomEventMap[K]>): void;
    offCustom<K extends keyof CustomEventMap>(events: OneOrMany<K>, callback: EventCallback<CustomEventMap[K]>): void;
    emitCustom<K extends keyof CustomEventMap>(event: K, payload: CustomEventMap[K]): void;
    hasListeners(event: string): boolean;
    eventNames(): Array<string>;
    clear(event?: string): void;
}
export interface GlobalEvents {
    notify: {
        severity: 'success' | 'error' | 'info' | 'warn';
        summary: string;
        detail?: string;
        life?: number;
    };
}
export declare const AppBus: EventBus<GlobalEvents, Record<string, any>>;
```
