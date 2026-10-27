---
description: "TypeScript-декларации @endge/utils 1.0.0-dev.6, группа tools; исходных модулей: 10."
---

# @endge/utils: tools

Версия source: 1.0.0-dev.6. [Каталог package](./). [Repository](https://github.com/endge-lab/utils).

## src/tools/console.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/tools/console.ts)

```ts
export declare function consoleValueSummary(value: unknown): string;
export declare function consoleErrorSummary(error: unknown): string;
```

## src/tools/debug.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/tools/debug.ts)

```ts
export declare const IS_DEBUG: boolean;
export declare function profile<T>(label: string, fn: () => T): T;
```

## src/tools/geometry.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/tools/geometry.ts)

```ts
export interface DataRect {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface DataSize {
    width: number;
    height: number;
}
export interface DataPoint {
    x: number;
    y: number;
}
export type Side = 'left' | 'right' | 'top' | 'bottom';
```

## src/tools/hotkeys.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/tools/hotkeys.ts)

```ts
type HotkeyHandler = (event: KeyboardEvent) => void;
interface HotkeyManagerOptions {
    ignoreInput?: boolean;
    target?: EventTarget;
}
export declare class HotkeyManager {
    constructor(options?: HotkeyManagerOptions);
    on(keys: string | Array<string>, handler: HotkeyHandler): void;
    off(keys: string | Array<string>, handler: HotkeyHandler): void;
    clear(key?: string): void;
    enable(): void;
    disable(): void;
    destroy(): void;
}
export {};
```

## src/tools/keyboard.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/tools/keyboard.ts)

```ts
export { isAnyKeyComboActive, type KeyCombo, type KeyComboArray } from '@/shared/utils/keyboard';
export type KeyboardStatePlatform = 'macos' | 'windows' | 'linux' | 'unknown';
export interface KeyboardStateSnapshot {
    platform: KeyboardStatePlatform;
    modifiers: {
        ctrl: boolean;
        shift: boolean;
        alt: boolean;
        meta: boolean;
        mod: boolean;
        altGraph: boolean;
    };
    held: {
        key: string[];
        code: string[];
    };
}
export declare function getKeyboardStateSnapshot(target: Document): KeyboardStateSnapshot;
export declare function subscribeKeyboardState(target: Document, listener: (snapshot: KeyboardStateSnapshot) => void): () => void;
```

## src/tools/logs.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/tools/logs.ts)

```ts
import { Subscribable } from '@/events/Subscribable';
export interface StructuredLogEntry {
    timestamp: number;
    level: 'debug' | 'info' | 'warn' | 'error' | 'success';
    message: string;
    context: Array<string>;
    actions?: Array<{
        icon: string;
        tooltip?: string;
        handler?: () => void;
    }>;
}
export declare class StructuredLogger extends Subscribable {
    context(...context: Array<string>): this;
    start(context: string): this;
    end(level?: 'debug' | 'info' | 'warn' | 'error' | 'success', message?: string, actions?: StructuredLogEntry['actions']): this;
    action(icon: string, tooltip?: string, handler?: () => void): this;
    debug(message: string, actions?: StructuredLogEntry['actions']): void;
    info(message: string, actions?: StructuredLogEntry['actions']): void;
    warn(message: string, actions?: StructuredLogEntry['actions']): void;
    error(message: string, actions?: StructuredLogEntry['actions']): void;
    success(message: string, actions?: StructuredLogEntry['actions']): void;
    getLogs(): Array<StructuredLogEntry>;
    clear(): void;
}
```

## src/tools/reflect.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/tools/reflect.ts)

```ts
export declare function isConstructor<T extends new (...args: Array<any>) => any>(fn: any): fn is T;
export type ConstructorOrFactory<T, Args extends Array<any> = Array<any>> = (new (...args: Args) => T) | ((...args: Args) => T);
export declare function createInstance<T, Args extends Array<any>>(source: ConstructorOrFactory<T, Args>, ...args: Args): T;
```

## src/tools/state.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/tools/state.ts)

```ts
export declare function globalState<T>(factory: () => T): () => T;
```

## src/tools/system-clock.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/tools/system-clock.ts)

```ts
import { DateTime } from 'ts-luxon';
export declare const SystemClock: {
    DateTime: typeof DateTime;
    toDateTime(jsDate: Date): DateTime;
    fromFormat(text: string, format: string, opts: any): DateTime;
    fromISO(text: string, opts?: any): DateTime | null;
    getNow(): DateTime;
    getNowUTC(): DateTime;
    getToday(): DateTime;
    getTime(format?: string): string;
    getUTCTime(format?: string): string;
    getZone(): import("ts-luxon").Zone;
};
export declare const dt: (date: Date) => DateTime;
```

## src/tools/tools.types.ts

[Исходный модуль](https://github.com/endge-lab/utils/blob/main/src/tools/tools.types.ts)

```ts
export type Maybe<T> = T | null | undefined;
export type Nullable<T> = T | null;
export type Undefinable<T> = T | undefined;
export type Constructor<T = any> = new (...args: Array<any>) => T;
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type NonNullableStrict<T> = T extends null | undefined ? never : T;
export type Override<Base, Overrides> = Omit<Base, keyof Overrides> & Overrides;
export type AsyncFn<Args extends Array<any> = Array<any>, R = any> = (...args: Args) => Promise<R>;
export type Awaitable<T> = T | Promise<T>;
export type VoidFn = () => void;
export type VoidFunction = VoidFn;
export type Dictionary<T = any> = Record<string, T>;
export type AnyRecord = Record<string, any>;
export type Callback<T = void> = (arg: T) => void;
export type Falsy = false | '' | 0 | null | undefined;
export type Truthy<T> = T extends Falsy ? never : T;
export type MaybeArray<T> = T | Array<T>;
export type KeysWithType<T, U> = {
    [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];
export type Ignored = never | void;
export type OneOrMany<T> = T | Array<T>;
export interface ActiveState<T> {
    value: T;
    computed: T;
}
export type PartialDeep<T> = T extends (...args: Array<any>) => any ? T : T extends Array<infer U> ? Array<PartialDeep<U>> : T extends object ? {
    [K in keyof T]?: PartialDeep<T[K]>;
} : T;
```
