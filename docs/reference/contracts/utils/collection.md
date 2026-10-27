---
description: "TypeScript-декларации @endge/utils 1.0.0-dev.6, группа collection; исходных модулей: 4."
---

# @endge/utils: collection

Версия source: 1.0.0-dev.6. [Каталог package](./). [Repository](https://github.com/endge-lab/utils).

## src/collection/collection.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/collection/collection.ts)

```ts
import type { CollectionEntity, CollectionEvents } from '@/collection/collection.types';
import { Subscribable } from '@/events/Subscribable';
export declare class Collection<T extends CollectionEntity> extends Subscribable {
    constructor(initialItems?: Array<T>);
    add(items: T | Array<T>): void;
    remove(arg: string | T | Array<string | T>): void;
    update(itemOrItems: T | Array<T>): void;
    get(arg: string | Partial<T>): T | undefined;
    get all(): Array<T>;
    get allRoot(): Array<T>;
    on<K extends keyof CollectionEvents<T>>(event: K, cb: (payload: CollectionEvents<T>[K]) => void): void;
    off<K extends keyof CollectionEvents<T>>(event: K, cb: (payload: CollectionEvents<T>[K]) => void): void;
}
```

## src/collection/collection.types.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/collection/collection.types.ts)

```ts
export interface CollectionEntity {
    id: string;
    parentId?: string | null;
}
export declare enum Events {
    Add = "add",
    Remove = "remove",
    Update = "update",
    IndexCreate = "indexCreate"
}
export interface CollectionEvents<T extends CollectionEntity> {
    [Events.Add]: Array<T>;
    [Events.Remove]: Array<T>;
    [Events.Update]: Array<T>;
    [Events.IndexCreate]: keyof T;
}
export interface IndexCollectionEntity<ID = string | null> {
    id: ID;
    index: number;
    filteredIndex: number;
}
export interface CollectionOptions<T extends IndexCollectionEntity<ID>, ID = string | null> {
    sortFn: (a: T, b: T) => number;
    filterFn: (item: T) => boolean;
    indexEnabled: boolean;
    filterIndexEnabled: boolean;
}
export interface ReadonlyIndexCollection<T extends IndexCollectionEntity<ID>, ID = string | null> {
    get: (id: ID) => T | undefined;
    all: () => ReadonlyArray<T>;
    size: () => number;
    unfiltered: () => ReadonlyArray<T>;
    has: (id: ID) => boolean;
    forEach: (callback: (item: T) => void) => void;
}
```

## src/collection/indexed-collection.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/collection/indexed-collection.ts)

```ts
import type { CollectionOptions, IndexCollectionEntity } from '@/collection/collection.types';
import type { OneOrMany } from '@/tools/tools.types';
export declare class IndexedCollection<T extends IndexCollectionEntity<ID>, ID = string | null> {
    constructor(opts?: Partial<CollectionOptions<T, ID>> | null);
    options(opts: Partial<CollectionOptions<T, ID>>): this;
    markDirty(opts: {
        filter?: boolean;
        sort?: boolean;
    }): void;
    ensure(): void;
    ensureSorted(): void;
    ensureFiltered(): void;
    add(items: OneOrMany<T>): void;
    remove(ids: OneOrMany<ID>): void;
    touch(id: ID, opts?: {
        mayAffectFilter?: boolean;
        mayAffectSort?: boolean;
    }): void;
    forEach(callback: (item: T, index: number) => void): void;
    all(): Array<T>;
    unfiltered(): Array<T>;
    filtered(): Array<T>;
    pos(index: number): T | null;
    first(): T | null;
    last(): T | null;
    has(id: ID): boolean;
    get(id: ID): T | undefined;
    size(): number;
    clear(): void;
}
```

## src/collection/RingBuffer.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/collection/RingBuffer.ts)

```ts
export declare class RingBuffer<T> {
    constructor(capacity: number);
    get capacity(): number;
    get length(): number;
    push(value: T): void;
    clear(): void;
    toArray(): Array<T>;
}
```
