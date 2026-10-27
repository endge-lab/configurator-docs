---
description: "TypeScript-декларации @endge/core 1.0.0-dev.12, группа converters; исходных модулей: 3."
---

# @endge/core: converters

Версия source: 1.0.0-dev.12. [Каталог package](./). [Repository](https://github.com/endge-lab/core).

## src/features/core/modules/converters/EndgeConverters_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/converters/EndgeConverters_Module.ts)

```ts
import type { ImplementationBindingScope } from '@/features/core/modules/actions/domain/action.types';
import type { EntityOrigin } from '@/features/core/modules/domain/types/document/entity-management.type';
import type { EndgeImplementations_Module } from '@/features/core/modules/implementations/EndgeImplementations_Module';
import { EndgeModule } from '@/features/federation/EndgeModule';
type ConverterProvider = (value: unknown, options?: Record<string, unknown>) => unknown;
export declare class EndgeConverters_Module extends EndgeModule {
    constructor(_implementations: EndgeImplementations_Module);
    has(identity: string): boolean;
    define(definition: {
        identity: string;
        origin: EntityOrigin;
        defaultProviderKey?: string;
    }): VoidFunction;
    provide(provider: {
        identity: string;
        key: string;
        origin: EntityOrigin;
        convert: ConverterProvider;
    }): VoidFunction;
    override(binding: {
        identity: string;
        providerKey: string;
        scope?: Exclude<ImplementationBindingScope, 'default' | 'invocation'>;
        scopeIdentity?: string;
        priority?: number;
    }): VoidFunction;
    execute(identity: string, value: unknown, options?: Record<string, unknown>): unknown;
    start(): void;
    reset(): void;
}
export {};
```

## src/features/core/modules/converters/tools/date/string-to-date.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/converters/tools/date/string-to-date.ts)

```ts
export declare function stringToDate(input: string | Date | null | undefined): Date | null;
```

## src/features/core/modules/converters/tools/date/weekdays-range.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/converters/tools/date/weekdays-range.ts)

```ts
export declare function weekdaysRange(str: any): boolean[];
```
