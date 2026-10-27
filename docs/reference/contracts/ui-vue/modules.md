---
description: "TypeScript-декларации @endge/ui-vue 1.0.0-dev.10, группа modules; исходных модулей: 1."
---

# @endge/ui-vue: modules

Версия source: 1.0.0-dev.10. [Каталог package](./). [Repository](https://github.com/endge-lab/ui-vue).

## src/modules/EndgeVue_Module.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/modules/EndgeVue_Module.ts)

```ts
import type { EndgeContextStateTransform, EndgeFederationContext, EndgePlugin } from '@endge/core';
import type { Ref } from 'vue';
import { EndgeModule } from '@endge/core';
export declare class EndgeVue_Module extends EndgeModule {
    readonly debuggerCompatible = true;
    setup(ctx?: EndgeFederationContext): void;
    build(): void;
    start(): void;
    reset(): void;
    useContextState<T>(key: string, defaultFactory: () => T, transform?: EndgeContextStateTransform<T>): Ref<T>;
    makeRaphRef<T>(path: string): Ref<T>;
    makeVocabRef<T>(vocab: string): Ref<T>;
}
declare module '@endge/core' {
    interface EndgeExtensions {
        readonly vue: EndgeVue_Module;
    }
}
export declare const EndgeVuePlugin: EndgePlugin;
```
