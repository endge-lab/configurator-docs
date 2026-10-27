---
description: "TypeScript-декларации @endge/core 1.0.0-dev.12, группа configuration; исходных модулей: 6."
---

# @endge/core: configuration

Версия source: 1.0.0-dev.12. [Каталог package](./). [Repository](https://github.com/endge-lab/core).

## src/features/core/modules/configuration/domain/configuration-value.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/configuration/domain/configuration-value.ts)

```ts
import type { ProgramDiagnostic } from '@/features/core/modules/program/domain/types/program.types';
import type { EndgeJSONValue } from '@/features/core/modules/source/domain/types/configuration-source.types';
import type { TypeProgramCatalogEntry, TypeSourceExpression } from '@/features/core/modules/source/domain/types/type-source.types';
type DiagnosticDraft = Omit<ProgramDiagnostic, 'entityRef'>;
export interface ConfigurationValueResult {
    ok: boolean;
    diagnostics: DiagnosticDraft[];
}
export declare function validateConfigurationValue(expression: TypeSourceExpression, value: unknown, catalog: readonly TypeProgramCatalogEntry[], sourcePath?: string): ConfigurationValueResult;
export declare function inferConfigurationDefault(expression: TypeSourceExpression, catalog: readonly TypeProgramCatalogEntry[], visiting?: Set<string>): {
    ok: true;
    value: EndgeJSONValue;
} | {
    ok: false;
    reason: string;
};
export declare function isEndgeJSONValue(value: unknown): value is EndgeJSONValue;
export {};
```

## src/features/core/modules/configuration/domain/endge-configuration.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/configuration/domain/endge-configuration.ts)

```ts
import type { EndgeConfiguration, EndgeConfigurationContribution, EndgePublicConfigurationSnapshot } from '@/features/core/modules/configuration/domain/types/configuration.type';
export declare const DEFAULT_ENDGE_CONFIGURATION: Readonly<EndgeConfiguration>;
export declare function createDefaultEndgeConfiguration(): EndgeConfiguration;
export declare function normalizeEndgeConfiguration(input: unknown): EndgeConfiguration;
export declare function normalizeEndgeConfigurationContribution(input: unknown): EndgeConfigurationContribution;
export declare function applyEndgeConfigurationContribution(upstream: EndgeConfiguration, contribution: EndgeConfigurationContribution): EndgeConfiguration;
export declare function createEndgeContextHash(input: unknown): string;
export declare function createEndgePublicConfigurationSnapshot(configuration: EndgeConfiguration): EndgePublicConfigurationSnapshot;
```

## src/features/core/modules/configuration/domain/tooltip.config.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/configuration/domain/tooltip.config.ts)

```ts
import type { EndgeTooltipConfiguration } from '@/features/core/modules/configuration/domain/types/configuration.type';
export declare const DEFAULT_ENDGE_TOOLTIP_CONFIGURATION: Readonly<EndgeTooltipConfiguration>;
```

## src/features/core/modules/configuration/domain/types/configuration.type.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/configuration/domain/types/configuration.type.ts)

```ts
import type { DiagnosticsSeverityNumber, DiagnosticsSignal, EndgeDiagnosticsConfiguration, EndgeDiagnosticsOutputConfiguration, EndgeDiagnosticsRoute } from '@/features/core/modules/diagnostics/domain/types/diagnostics.types';
import type { ComponentSFCInteractionKeyboardCondition, ComponentSFCInteractionTrigger, ComponentSFCInteractionTriggerActivation } from '@/features/core/modules/domain/types/component/sfc/ir.types';
import type { EndgeExecutionContext } from '@/features/core/modules/runtime/domain/execution-context.types';
import type { EndgeJSONValue } from '@/features/core/modules/source/domain/types/configuration-source.types';
export type EndgeConfigurationValues = Record<string, Record<string, EndgeJSONValue>>;
export type EndgeConfigurationValuePatch = Record<string, Record<string, EndgeValueOverride<EndgeJSONValue>>>;
export interface EndgeLocaleDefinition {
    code: string;
    displayName: string;
    shortLabel: string;
    direction?: 'ltr' | 'rtl';
}
export interface EndgeThemeDefinition {
    identity: string;
    displayName: string;
}
export interface EndgeTimezoneDefinition {
    identity: string;
    displayName: string;
}
export interface EndgeVariableDefinition {
    name: string;
    defaultValue: string;
}
export interface EndgeSFCEditingConfiguration {
    cancelOn: ComponentSFCInteractionTrigger[];
    commitOn: ComponentSFCInteractionTrigger[];
}
export type EndgeTooltipSide = 'top' | 'right' | 'bottom' | 'left';
export type EndgeTooltipAlign = 'start' | 'center' | 'end';
export interface EndgeTooltipConfiguration {
    side: EndgeTooltipSide;
    align: EndgeTooltipAlign;
    openDelay: number;
    closeDelay: number;
    keyboard?: ComponentSFCInteractionKeyboardCondition;
}
export interface EndgeConfiguration {
    vars: EndgeVariableDefinition[];
    locales: EndgeLocaleDefinition[];
    defaultLocale: string;
    fallbackLocale: string;
    themes: EndgeThemeDefinition[];
    defaultTheme: string;
    timezones: EndgeTimezoneDefinition[];
    defaultTimezone: string;
    defaultAuthProfileIdentity: string | null;
    sfcAdapterIds: string[];
    defaultSfcAdapterId: string;
    sfcEditing: EndgeSFCEditingConfiguration;
    tooltips: EndgeTooltipConfiguration;
    diagnostics: EndgeDiagnosticsConfiguration;
    values: EndgeConfigurationValues;
}
export type EndgePublicConfigurationSnapshot = Readonly<Omit<EndgeConfiguration, 'vars' | 'diagnostics' | 'values'> & Record<string, unknown>>;
export type EndgeValueOverride<T> = {
    op: 'set';
    value: T;
} | {
    op: 'remove';
};
export interface EndgeSFCEditingConfigurationPatch {
    cancelOn?: EndgeValueOverride<ComponentSFCInteractionTrigger[]>;
    commitOn?: EndgeValueOverride<ComponentSFCInteractionTrigger[]>;
}
export interface EndgeTooltipConfigurationPatch {
    side?: EndgeValueOverride<EndgeTooltipSide>;
    align?: EndgeValueOverride<EndgeTooltipAlign>;
    openDelay?: EndgeValueOverride<number>;
    closeDelay?: EndgeValueOverride<number>;
    keyboard?: EndgeValueOverride<ComponentSFCInteractionKeyboardCondition>;
}
export type EndgeCollectionPatchEntry<T> = {
    key: string;
    op: 'upsert';
    value: T;
} | {
    key: string;
    op: 'remove';
};
export interface EndgeCollectionPatch<T> {
    entries: EndgeCollectionPatchEntry<T>[];
}
export interface EndgeConfigurationPatch {
    vars?: EndgeCollectionPatch<EndgeVariableDefinition>;
    locales?: EndgeCollectionPatch<EndgeLocaleDefinition>;
    defaultLocale?: EndgeValueOverride<string>;
    fallbackLocale?: EndgeValueOverride<string>;
    themes?: EndgeCollectionPatch<EndgeThemeDefinition>;
    defaultTheme?: EndgeValueOverride<string>;
    timezones?: EndgeCollectionPatch<EndgeTimezoneDefinition>;
    defaultTimezone?: EndgeValueOverride<string>;
    defaultAuthProfileIdentity?: EndgeValueOverride<string>;
    sfcAdapterIds?: EndgeCollectionPatch<string>;
    defaultSfcAdapterId?: EndgeValueOverride<string>;
    sfcEditing?: EndgeSFCEditingConfigurationPatch;
    tooltips?: EndgeTooltipConfigurationPatch;
    diagnostics?: EndgeDiagnosticsConfigurationPatch;
    values?: EndgeConfigurationValuePatch;
}
export interface EndgeDiagnosticsCollectionPatch {
    enabled?: EndgeValueOverride<boolean>;
    signals?: EndgeCollectionPatch<DiagnosticsSignal>;
    minSeverity?: EndgeValueOverride<DiagnosticsSeverityNumber>;
    maxRecords?: EndgeValueOverride<number>;
}
export interface EndgeDiagnosticsTelemetryPatch {
    collection?: EndgeDiagnosticsCollectionPatch;
    outputs?: EndgeCollectionPatch<EndgeDiagnosticsOutputConfiguration>;
    routes?: EndgeCollectionPatch<EndgeDiagnosticsRoute>;
}
export interface EndgeDiagnosticsSnapshotContentPatch {
    telemetry?: EndgeValueOverride<boolean>;
    problems?: EndgeValueOverride<boolean>;
    configuration?: EndgeValueOverride<boolean>;
    effectiveConfiguration?: EndgeValueOverride<boolean>;
    domain?: EndgeValueOverride<boolean>;
    program?: EndgeValueOverride<boolean>;
    runtime?: EndgeValueOverride<boolean>;
    raphData?: EndgeValueOverride<boolean>;
    raphGraph?: EndgeValueOverride<boolean>;
}
export interface EndgeDiagnosticsAutomaticSnapshotPatch {
    enabled?: EndgeValueOverride<boolean>;
    errorCount?: EndgeValueOverride<number>;
    windowSeconds?: EndgeValueOverride<number>;
    cooldownSeconds?: EndgeValueOverride<number>;
    outputIds?: EndgeCollectionPatch<string>;
}
export interface EndgeDiagnosticsShortcutSnapshotPatch {
    triggerSet?: EndgeValueOverride<ComponentSFCInteractionTriggerActivation>;
    content?: EndgeDiagnosticsSnapshotContentPatch;
}
export interface EndgeDiagnosticsSnapshotsPatch {
    content?: EndgeDiagnosticsSnapshotContentPatch;
    shortcut?: EndgeDiagnosticsShortcutSnapshotPatch;
    automatic?: EndgeDiagnosticsAutomaticSnapshotPatch;
}
export interface EndgeDiagnosticsConfigurationPatch {
    telemetry?: EndgeDiagnosticsTelemetryPatch;
    snapshots?: EndgeDiagnosticsSnapshotsPatch;
}
export type EndgeConfigurationContribution = {
    mode: 'inherit';
    patch: EndgeConfigurationPatch;
} | {
    mode: 'replace';
    value: EndgeConfiguration;
};
export type EndgeConfigurationLayer = 'workspace' | {
    facetIdentity: string;
};
export interface EndgeBuildContext {
    workspaceIdentity: string;
    execution: EndgeExecutionContext;
    configuration: EndgeConfiguration;
    contextHash: string;
}
```

## src/features/core/modules/configuration/EndgeConfiguration_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/configuration/EndgeConfiguration_Module.ts)

```ts
import type { EndgeBootContext } from '@/features/core/kernel/types/bootstrap.types';
import type { EndgeBuildContext, EndgeConfiguration, EndgeConfigurationContribution, EndgeConfigurationLayer } from '@/features/core/modules/configuration/domain/types/configuration.type';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeConfiguration_Module extends EndgeModule<EndgeBootContext> {
    build(ctx: EndgeBootContext): void;
    reset(): void;
    applyInspection(configuration: EndgeConfiguration): void;
    createDiagnosticsSnapshot(): EndgeConfiguration;
    get current(): EndgeConfiguration;
    get buildContext(): EndgeBuildContext;
    get isResolved(): boolean;
    normalizeLocale(locale: string | null | undefined): string;
    normalizeTheme(theme: string | null | undefined): string;
    normalizeTimezone(timezone: string | null | undefined): string;
    resolveUpstream(layer: EndgeConfigurationLayer): EndgeConfiguration;
    preview(upstream: EndgeConfiguration, contribution: EndgeConfigurationContribution): EndgeConfiguration;
}
```

## src/features/core/modules/configuration/EndgeConfigurationSchema_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/configuration/EndgeConfigurationSchema_Module.ts)

```ts
import type { EndgeBootContext } from '@/features/core/kernel/types/bootstrap.types';
import type { EndgeConfigurationValues } from '@/features/core/modules/configuration/domain/types/configuration.type';
import type { ProgramDiagnostic } from '@/features/core/modules/program/domain/types/program.types';
import type { EndgeConfigurationSchemaEntry } from '@/features/core/modules/source/domain/types/configuration-source.types';
import type { TypeProgramCatalogEntry } from '@/features/core/modules/source/domain/types/type-source.types';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeConfigurationSchema_Module extends EndgeModule<EndgeBootContext> {
    build(_ctx: EndgeBootContext): void;
    reset(): void;
    list(): EndgeConfigurationSchemaEntry[];
    get(identity: string): EndgeConfigurationSchemaEntry | null;
    get typeCatalog(): TypeProgramCatalogEntry[];
    get errors(): Array<{
        identity: string;
        diagnostic: Omit<ProgramDiagnostic, 'entityRef'>;
    }>;
    resolveValues(input: EndgeConfigurationValues): EndgeConfigurationValues;
}
```
