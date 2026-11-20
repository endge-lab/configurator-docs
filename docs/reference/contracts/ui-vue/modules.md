---
description: "TypeScript-декларации @endge/ui-vue 2.4.1-dev.24, группа modules; исходных модулей: 1."
---

# @endge/ui-vue: modules

Версия source: 2.4.1-dev.24. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/ui-vue); сама ссылка не подтверждает snapshot этого контракта. Source snapshot не является проверкой текущих npm tags или развёрнутого приложения. Проверенный опубликованный source snapshot: [3e2e86a56e6b69243302b632d6e35106293ab8b4](https://github.com/endge-lab/ui-vue/tree/3e2e86a56e6b69243302b632d6e35106293ab8b4).

## src/modules/EndgeVue_Module.ts

Исходный модуль: [src/modules/EndgeVue_Module.ts](https://github.com/endge-lab/ui-vue/blob/3e2e86a56e6b69243302b632d6e35106293ab8b4/src/modules/EndgeVue_Module.ts)

```ts
import type { EndgeContextStateTransform, EndgeFederationContext, EndgePlugin, EndgeSFCRendererTag } from '@endge/core';
import type { Ref } from 'vue';
import type { SFCVueRenderAdapter, SFCVueRenderFunction } from '@/services/render/sfc/sfc-vue-render.type';
import { EndgeModule } from '@endge/core';
export declare class EndgeVue_Module extends EndgeModule {
    readonly debuggerCompatible = true;
    constructor(_adapter?: SFCVueRenderAdapter);
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
export interface EndgeVuePluginOptions {
    defaultRenderers?: Readonly<Partial<Record<EndgeSFCRendererTag, SFCVueRenderFunction>>>;
}
export declare function createEndgeVuePlugin(options?: EndgeVuePluginOptions): EndgePlugin;
export declare const EndgeVuePlugin: EndgePlugin<import("@typedworks/federation").EndgeModuleDefinitions, import("@typedworks/federation").EndgeChildFederationDefinitions>;
```
