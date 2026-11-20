---
description: "TypeScript-декларации @endge/ui-vue 2.4.1-dev.24, группа reactive; исходных модулей: 6."
---

# @endge/ui-vue: reactive

Версия source: 2.4.1-dev.24. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/ui-vue); сама ссылка не подтверждает snapshot этого контракта. Source snapshot не является проверкой текущих npm tags или развёрнутого приложения. Проверенный опубликованный source snapshot: [3e2e86a56e6b69243302b632d6e35106293ab8b4](https://github.com/endge-lab/ui-vue/tree/3e2e86a56e6b69243302b632d6e35106293ab8b4).

## src/reactive/use-current-facet.ts

Исходный модуль: [src/reactive/use-current-facet.ts](https://github.com/endge-lab/ui-vue/blob/3e2e86a56e6b69243302b632d6e35106293ab8b4/src/reactive/use-current-facet.ts)

```ts
export declare function useCurrentFacet(facetIdentity: string): {
    current: import("vue").Ref<string | null, string | null>;
    locked: () => boolean;
    setCurrent: (document: string) => Promise<void>;
};
```

## src/reactive/use-current-locale.ts

Исходный модуль: [src/reactive/use-current-locale.ts](https://github.com/endge-lab/ui-vue/blob/3e2e86a56e6b69243302b632d6e35106293ab8b4/src/reactive/use-current-locale.ts)

```ts
export declare function useCurrentLocale(): {
    current: import("vue").Ref<string, string>;
    setCurrent: (locale: string | null) => Promise<void>;
};
```

## src/reactive/use-current-theme.ts

Исходный модуль: [src/reactive/use-current-theme.ts](https://github.com/endge-lab/ui-vue/blob/3e2e86a56e6b69243302b632d6e35106293ab8b4/src/reactive/use-current-theme.ts)

```ts
export declare function useCurrentTheme(): {
    current: import("vue").Ref<string, string>;
    setCurrent: (theme: string | null) => Promise<void>;
};
```

## src/reactive/use-current-timezone.ts

Исходный модуль: [src/reactive/use-current-timezone.ts](https://github.com/endge-lab/ui-vue/blob/3e2e86a56e6b69243302b632d6e35106293ab8b4/src/reactive/use-current-timezone.ts)

```ts
export declare function useCurrentTimezone(): {
    current: import("vue").Ref<string, string>;
    setCurrent: (timezone: string | null) => Promise<void>;
};
```

## src/reactive/use-subscribable-ref.ts

Исходный модуль: [src/reactive/use-subscribable-ref.ts](https://github.com/endge-lab/ui-vue/blob/3e2e86a56e6b69243302b632d6e35106293ab8b4/src/reactive/use-subscribable-ref.ts)

```ts
import type { SubscribableLike } from '@endge/utils';
import type { ShallowRef } from 'vue';
export declare function useSubscribableRef<T extends SubscribableLike>(owner: T): {
    refObj: ShallowRef<T>;
    unsubscribe: () => void;
};
export declare function useSubscribableRefAuto<T extends SubscribableLike>(owner: T): ShallowRef<T>;
```

## src/reactive/use-ui.ts

Исходный модуль: [src/reactive/use-ui.ts](https://github.com/endge-lab/ui-vue/blob/3e2e86a56e6b69243302b632d6e35106293ab8b4/src/reactive/use-ui.ts)

```ts
import type { EndgeUI_Module } from '@endge/core';
import type { Ref } from 'vue';
export declare const useUI: () => Ref<EndgeUI_Module>;
```
