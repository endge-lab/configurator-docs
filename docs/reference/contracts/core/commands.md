---
description: "TypeScript-декларации @endge/core 1.8.0-dev.25, группа commands; исходных модулей: 6."
---

# @endge/core: commands

Версия source: 1.8.0-dev.25. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/core); сама ссылка не подтверждает snapshot этого контракта. Source snapshot не является проверкой текущих npm tags или развёрнутого приложения. Проверенный опубликованный source snapshot: [ef69ac170d1982c3df93d1bfc4be5a03893c5226](https://github.com/endge-lab/core/tree/ef69ac170d1982c3df93d1bfc4be5a03893c5226).

## src/features/core/modules/commands/config/commands.config.ts

Исходный модуль: [src/features/core/modules/commands/config/commands.config.ts](https://github.com/endge-lab/core/blob/ef69ac170d1982c3df93d1bfc4be5a03893c5226/src/features/core/modules/commands/config/commands.config.ts)

```ts
import type { EndgeCommandExecutor, EndgeCommandHandler } from '@/features/core/modules/commands/types/command-executor.type';
import type { EndgeContextCommandTarget } from '@/features/core/modules/commands/types/context-command-target.type';
import type { EndgeRuntimeCommandTarget } from '@/features/core/modules/commands/types/runtime-command-target.type';
export declare function createContextCommandHandlers(context: EndgeContextCommandTarget): readonly EndgeCommandHandler[];
export declare function createContextCommandExecutor(context: EndgeContextCommandTarget): EndgeCommandExecutor;
export declare function createRuntimeCommandHandlers(runtime: EndgeRuntimeCommandTarget): readonly EndgeCommandHandler[];
```

## src/features/core/modules/commands/domain/commands.types.ts

Исходный модуль: [src/features/core/modules/commands/domain/commands.types.ts](https://github.com/endge-lab/core/blob/ef69ac170d1982c3df93d1bfc4be5a03893c5226/src/features/core/modules/commands/domain/commands.types.ts)

```ts
import type { RuntimeControlTarget } from '@/features/core/modules/runtime/domain/runtime-inspection.types';
import type { EndgeDataMode } from '@/features/core/modules/workspace/domain/workspace.types';
export interface EndgeCommandMap {
    'runtime:pause': RuntimeControlTarget;
    'runtime:resume': RuntimeControlTarget;
    'runtime:stop': RuntimeControlTarget;
    'context:set-workspace': {
        workspace: string | null;
    };
    'context:set-facet': {
        facet: string;
        document: string;
    };
    'context:set-user': {
        user: string;
    };
    'context:set-locale': {
        locale: string | null;
    };
    'context:set-theme': {
        theme: string | null;
    };
    'context:set-timezone': {
        timezone: string | null;
    };
    'context:set-data-mode': {
        dataMode: EndgeDataMode | null;
    };
}
export type EndgeCommandType = keyof EndgeCommandMap;
export type EndgeCommand = {
    [K in EndgeCommandType]: {
        readonly type: K;
        readonly payload: Readonly<EndgeCommandMap[K]>;
    };
}[EndgeCommandType];
```

## src/features/core/modules/commands/EndgeCommands_Module.ts

Исходный модуль: [src/features/core/modules/commands/EndgeCommands_Module.ts](https://github.com/endge-lab/core/blob/ef69ac170d1982c3df93d1bfc4be5a03893c5226/src/features/core/modules/commands/EndgeCommands_Module.ts)

```ts
import type { EndgeBootContext } from '@/features/core/kernel/types/bootstrap.types';
import type { EndgeCommand } from '@/features/core/modules/commands/domain/commands.types';
import type { EndgeCommandExecutor } from '@/features/core/modules/commands/types/command-executor.type';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeCommands_Module extends EndgeModule<EndgeBootContext> {
    constructor(localExecutor: EndgeCommandExecutor);
    setup(ctx: EndgeBootContext): void;
    execute(command: EndgeCommand): Promise<void>;
    reset(): void;
}
```

## src/features/core/modules/commands/types/command-executor.type.ts

Исходный модуль: [src/features/core/modules/commands/types/command-executor.type.ts](https://github.com/endge-lab/core/blob/ef69ac170d1982c3df93d1bfc4be5a03893c5226/src/features/core/modules/commands/types/command-executor.type.ts)

```ts
import type { EndgeCommand, EndgeCommandType } from '@/features/core/modules/commands/domain/commands.types';
export interface EndgeCommandExecutor {
    execute: (command: EndgeCommand) => Promise<void>;
}
export interface EndgeRemoteCommandTransport {
    send: (command: EndgeCommand) => Promise<void>;
}
export interface EndgeCommandsBootOptions {
    local?: EndgeCommandExecutor;
    remote?: EndgeRemoteCommandTransport;
}
export interface EndgeCommandHandler {
    readonly type: EndgeCommandType;
    execute: (payload: unknown) => void | Promise<void>;
}
```

## src/features/core/modules/commands/types/context-command-target.type.ts

Исходный модуль: [src/features/core/modules/commands/types/context-command-target.type.ts](https://github.com/endge-lab/core/blob/ef69ac170d1982c3df93d1bfc4be5a03893c5226/src/features/core/modules/commands/types/context-command-target.type.ts)

```ts
import type { EndgeDataMode } from '@/features/core/modules/workspace/domain/workspace.types';
export interface EndgeContextCommandTarget {
    setCurrentWorkspace: (workspace: string | null) => void | Promise<void>;
    setFacetSelection: (facet: string, document: string) => void | Promise<void>;
    setCurrentUser: (user: string) => void | Promise<void>;
    setCurrentLocale: (locale: string | null) => void | Promise<void>;
    setCurrentTheme: (theme: string | null) => void | Promise<void>;
    setCurrentTimezone: (timezone: string | null) => void | Promise<void>;
    setDataMode: (dataMode: EndgeDataMode) => void | Promise<void>;
    clearDataModeOverride: () => void | Promise<void>;
}
```

## src/features/core/modules/commands/types/runtime-command-target.type.ts

Исходный модуль: [src/features/core/modules/commands/types/runtime-command-target.type.ts](https://github.com/endge-lab/core/blob/ef69ac170d1982c3df93d1bfc4be5a03893c5226/src/features/core/modules/commands/types/runtime-command-target.type.ts)

```ts
import type { RuntimeControlOperation, RuntimeControlTarget } from '@/features/core/modules/runtime/domain/runtime-inspection.types';
export interface EndgeRuntimeCommandTarget {
    control: (operation: RuntimeControlOperation, target: RuntimeControlTarget) => Promise<void>;
}
```
