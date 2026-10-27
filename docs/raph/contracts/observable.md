---
description: "TypeScript-декларации @raphy-js/raph 1.0.1-dev.54, группа observable; исходных модулей: 4."
---

# @raphy-js/raph: observable

Версия source: 1.0.1-dev.54. [Каталог package](./). Repository: https://gitlab.com/raphyjs/raphy-js-raph (закрыт, canonical). Публичные declarations — [@raphy-js/raph@1.0.1-dev.54 в npm](https://unpkg.com/@raphy-js/raph@1.0.1-dev.54/).

## src/observable/buffer.ts

Исходный модуль: `src/observable/buffer.ts`

```ts
import type { RaphRuntime } from '../runtime/RaphRuntime';
import type { ObservableBuffer, ObservableBufferValue } from './types';
export declare function observableBuffer<T extends ObservableBufferValue>(runtime: RaphRuntime, value: T): ObservableBuffer<T>;
```

## src/observable/classes.ts

Исходный модуль: `src/observable/classes.ts`

```ts
import type { RaphRuntime } from '../runtime/RaphRuntime';
import type { ObservableAnnotations, ObservableClassOptions } from './types';
export declare function makeObservable<T extends object, AdditionalKeys extends PropertyKey = never>(runtime: RaphRuntime, target: T, annotations: ObservableAnnotations<T, NoInfer<AdditionalKeys>>, options?: ObservableClassOptions): T;
export declare function makeAutoObservable<T extends object, AdditionalKeys extends PropertyKey = never>(runtime: RaphRuntime, target: T, overrides?: ObservableAnnotations<T, NoInfer<AdditionalKeys>>, options?: ObservableClassOptions): T;
```

## src/observable/observable.ts

Исходный модуль: `src/observable/observable.ts`

```ts
import type { RaphRuntime } from '../runtime/RaphRuntime';
import type { ObservableAdapter, ObservableOptions } from './types';
export declare function observable<T extends object, View>(runtime: RaphRuntime, value: T, options: ObservableOptions & {
    readonly adapter: ObservableAdapter<T, View>;
}): View;
export declare function observable<T extends object>(runtime: RaphRuntime, value: T, options?: ObservableOptions): T;
export declare function defineObservableAdapter<T extends object, View>(adapter: ObservableAdapter<T, View>): ObservableAdapter<T, View>;
```

## src/observable/types.ts

Исходный модуль: `src/observable/types.ts`

```ts
import type { Disposer } from '../reactivity/types';
export interface ObservableOptions {
    readonly deep?: boolean;
}
export type ObservableAnnotation = 'observable' | 'shallow' | 'ref' | 'computed' | 'action' | 'action.bound' | 'override' | false;
export type ObservableAnnotations<T extends object, AdditionalKeys extends PropertyKey = never> = {
    [Key in Exclude<keyof T, 'constructor'>]?: ObservableAnnotation;
} & Record<AdditionalKeys, ObservableAnnotation>;
export interface ObservableClassOptions extends ObservableOptions {
    readonly autoBind?: boolean;
}
export interface ObservableAdapterContext {
    track: (key: PropertyKey) => void;
    notify: (key: PropertyKey) => void;
    mutate: <T>(key: PropertyKey, operation: () => T) => T;
    onObserved: (key: PropertyKey, subscribe: () => void | Disposer) => void;
    onDispose: (cleanup: Disposer) => void;
}
export interface ObservableAdapter<T extends object, View> {
    readonly create: (value: T, context: ObservableAdapterContext) => View;
}
export interface ObservableBufferRange {
    readonly offset: number;
    readonly length: number;
}
export type ObservableBufferValue = ArrayBufferLike | ArrayBufferView;
export interface ObservableBuffer<T extends ObservableBufferValue> {
    readonly value: T;
    read: <Result>(range: ObservableBufferRange, operation: (value: T) => Result) => Result;
    mutate: <Result>(range: ObservableBufferRange, operation: (value: T) => Result) => Result;
    notify: (range: ObservableBufferRange) => void;
}
```
