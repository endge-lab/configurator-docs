---
description: "TypeScript-декларации @endge/ui-vue 1.0.0-dev.10, группа reactive; исходных модулей: 6."
---

# @endge/ui-vue: reactive

Версия source: 1.0.0-dev.10. [Каталог package](./). [Repository](https://github.com/endge-lab/ui-vue).

## src/reactive/use-current-facet.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/reactive/use-current-facet.ts)

```ts
export declare function useCurrentFacet(facetIdentity: string): {
    current: import("vue").Ref<string | null, string | null>;
    locked: () => boolean;
    setCurrent: (document: string) => Promise<void>;
};
```

## src/reactive/use-current-locale.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/reactive/use-current-locale.ts)

```ts
export declare function useCurrentLocale(): {
    current: import("vue").Ref<string, string>;
    setCurrent: (locale: string | null) => Promise<void>;
};
```

## src/reactive/use-current-theme.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/reactive/use-current-theme.ts)

```ts
export declare function useCurrentTheme(): {
    current: import("vue").Ref<string, string>;
    setCurrent: (theme: string | null) => Promise<void>;
};
```

## src/reactive/use-current-timezone.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/reactive/use-current-timezone.ts)

```ts
export declare function useCurrentTimezone(): {
    current: import("vue").Ref<string, string>;
    setCurrent: (timezone: string | null) => Promise<void>;
};
```

## src/reactive/use-subscribable-ref.ts

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/reactive/use-subscribable-ref.ts)

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

[Исходный модуль](https://github.com/endge-lab/ui-vue/blob/main/src/reactive/use-ui.ts)

```ts
import type { EndgeUI_Module } from '@endge/core';
import type { Ref } from 'vue';
export declare const useUI: () => Ref<EndgeUI_Module>;
```
