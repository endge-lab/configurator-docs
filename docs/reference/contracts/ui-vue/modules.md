---
description: "TypeScript-декларации @endge/ui-vue 2.0.0-dev.14, группа modules; исходных модулей: 1."
---

# @endge/ui-vue: modules

Версия source: 2.0.0-dev.14. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/ui-vue); сама ссылка не подтверждает snapshot этого контракта. Source snapshot не является проверкой текущих npm tags или развёрнутого приложения. Проверенный опубликованный source snapshot: [b28dfe275ef2d08431082b412644d6fe561a6027](https://github.com/endge-lab/ui-vue/tree/b28dfe275ef2d08431082b412644d6fe561a6027).

## src/modules/EndgeVue_Module.ts

Исходный модуль: [src/modules/EndgeVue_Module.ts](https://github.com/endge-lab/ui-vue/blob/b28dfe275ef2d08431082b412644d6fe561a6027/src/modules/EndgeVue_Module.ts)

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
