---
description: "TypeScript-декларации @endge/core 1.3.0-dev.17, группа workspace; исходных модулей: 2."
---

# @endge/core: workspace

Версия source: 1.3.0-dev.17. [Каталог package](./). [Repository — навигация](https://github.com/endge-lab/core); сама ссылка не подтверждает snapshot этого контракта. Source snapshot не является проверкой текущих npm tags или развёрнутого приложения. Проверенный опубликованный source snapshot: [5013d6272b427b472eb5c38a698d3608cf8f4ceb](https://github.com/endge-lab/core/tree/5013d6272b427b472eb5c38a698d3608cf8f4ceb).

## src/features/core/modules/workspace/domain/workspace.types.ts

Исходный модуль: [src/features/core/modules/workspace/domain/workspace.types.ts](https://github.com/endge-lab/core/blob/5013d6272b427b472eb5c38a698d3608cf8f4ceb/src/features/core/modules/workspace/domain/workspace.types.ts)

```ts
import type { EndgeConfiguration, EndgeLocaleDefinition, EndgeThemeDefinition, EndgeTimezoneDefinition, EndgeVariableDefinition } from '@/features/core/modules/configuration/domain/types/configuration.type';
import type { EntityManagement } from '@/features/core/modules/domain/types/document/entity-management.type';
export type EndgeWorkspaceLocale = EndgeLocaleDefinition;
export type EndgeDataMode = 'live' | 'mock';
export type EndgeWorkspaceDocumentStructure = 'frontend' | 'custom';
export type EndgeWorkspaceLocaleLabelMode = keyof Pick<EndgeWorkspaceLocale, 'displayName' | 'shortLabel'>;
export type EndgeWorkspaceTheme = EndgeThemeDefinition;
export type EndgeWorkspaceTimezone = EndgeTimezoneDefinition;
export type EndgeWorkspaceVar = EndgeVariableDefinition;
export interface EndgeResolvedWorkspaceVariable {
    name: string;
    defaultValue: string;
    currentValue: string;
}
export interface WorkspaceIntegrationReference {
    integrationId: string | number;
    integrationIdentity: string;
    version: string;
}
export interface EndgeWorkspaceDefinition extends EntityManagement {
    identity: string;
    displayName: string;
    dataMode: EndgeDataMode;
    documentStructure?: EndgeWorkspaceDocumentStructure;
    startupCompositionIdentity: string | null;
    meta?: Record<string, unknown>;
    installedIntegrations: WorkspaceIntegrationReference[];
    configuration: EndgeConfiguration;
}
export type EndgeWorkspaceDefinitionInput = Partial<EndgeWorkspaceDefinition> & Record<string, unknown>;
```

## src/features/core/modules/workspace/EndgeWorkspace_Module.ts

Исходный модуль: [src/features/core/modules/workspace/EndgeWorkspace_Module.ts](https://github.com/endge-lab/core/blob/5013d6272b427b472eb5c38a698d3608cf8f4ceb/src/features/core/modules/workspace/EndgeWorkspace_Module.ts)

```ts
import type { EndgeBootContext } from '@/features/core/kernel/types/bootstrap.types';
import type { EndgeDataMode, EndgeWorkspaceDefinition, EndgeWorkspaceLocale, EndgeWorkspaceLocaleLabelMode, EndgeWorkspaceTheme, EndgeWorkspaceTimezone, EndgeWorkspaceVar } from '@/features/core/modules/workspace/domain/workspace.types';
import { WorkspaceVariables } from '@/features/core/modules/context/endge-vars';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeWorkspace_Module extends EndgeModule<EndgeBootContext> {
    readonly variables: WorkspaceVariables;
    setup(ctx: EndgeBootContext): void;
    build(ctx: EndgeBootContext): void;
    reset(): void;
    supportsLocale(locale: string | null | undefined): boolean;
    normalizeLocale(locale: string | null | undefined): string;
    getLocaleLabel(locale: string, mode?: EndgeWorkspaceLocaleLabelMode): string;
    supportsTheme(theme: string | null | undefined): boolean;
    normalizeTheme(theme: string | null | undefined): string;
    getThemeLabel(theme: string): string;
    supportsTimezone(timezone: string | null | undefined): boolean;
    normalizeTimezone(timezone: string | null | undefined): string;
    getTimezoneLabel(timezone: string): string;
    apply(input: unknown): void;
    applyInspection(input: EndgeWorkspaceDefinition): void;
    serialize(): EndgeWorkspaceDefinition;
    get isLoaded(): boolean;
    get current(): EndgeWorkspaceDefinition;
    get dataMode(): EndgeDataMode;
    get isMockEnabled(): boolean;
    get locales(): EndgeWorkspaceLocale[];
    get vars(): EndgeWorkspaceVar[];
    get variableDefinitions(): EndgeWorkspaceVar[];
    get defaultLocale(): string;
    get fallbackLocale(): string;
    get themes(): EndgeWorkspaceTheme[];
    get defaultTheme(): string;
    get timezones(): EndgeWorkspaceTimezone[];
    get defaultTimezone(): string;
    get defaultAuthProfileIdentity(): string | null;
    get sfcAdapterIds(): string[];
    get defaultSfcAdapterId(): string;
}
```
