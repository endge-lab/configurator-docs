---
description: "TypeScript-декларации @endge/ui-vue 2.1.0-dev.16, группа modules; исходных модулей: 1."
---

# @endge/ui-vue: modules

Версия source: 2.1.0-dev.16. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/ui-vue); сама ссылка не подтверждает snapshot этого контракта. Source snapshot не является проверкой текущих npm tags или развёрнутого приложения. Проверенный опубликованный source snapshot: [c04ff37288b65db89bc2d828c9e1339ada37fda8](https://github.com/endge-lab/ui-vue/tree/c04ff37288b65db89bc2d828c9e1339ada37fda8).

## src/modules/EndgeVue_Module.ts

Исходный модуль: [src/modules/EndgeVue_Module.ts](https://github.com/endge-lab/ui-vue/blob/c04ff37288b65db89bc2d828c9e1339ada37fda8/src/modules/EndgeVue_Module.ts)

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
