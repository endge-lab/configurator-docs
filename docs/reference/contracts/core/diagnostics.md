---
description: "TypeScript-декларации @endge/core 1.0.0-dev.11, группа diagnostics; исходных модулей: 16."
---

# @endge/core: diagnostics

Версия source: 1.0.0-dev.11. [Каталог package](./). [Repository](https://github.com/endge-lab/core).

## src/features/core/modules/diagnostics/adapters/BrowserDiagnosticsSnapshot_Adapter.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/diagnostics/adapters/BrowserDiagnosticsSnapshot_Adapter.ts)

```ts
import type { DiagnosticsSnapshotRuntimeAdapter, DiagnosticsSnapshotShortcutEvent } from '@/features/core/modules/diagnostics/domain/types/diagnostics-snapshot-runtime-adapter.type';
import type { DiagnosticsSnapshot } from '@/features/core/modules/diagnostics/domain/types/diagnostics.types';
export declare class BrowserDiagnosticsSnapshot_Adapter implements DiagnosticsSnapshotRuntimeAdapter {
    subscribeShortcut(listener: (event: DiagnosticsSnapshotShortcutEvent) => void): () => void;
    downloadJson(snapshot: DiagnosticsSnapshot): void;
}
```

## src/features/core/modules/diagnostics/adapters/ConsoleDiagnosticsAdapter.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/diagnostics/adapters/ConsoleDiagnosticsAdapter.ts)

```ts
import type { DiagnosticsAdapter, DiagnosticsAdapterFactory, DiagnosticsAdapterRecordContext, DiagnosticsAdapterSnapshotContext } from '@/features/core/modules/diagnostics/domain/types/diagnostics-adapter.type';
import type { DiagnosticsRecord, DiagnosticsSnapshot, EndgeDiagnosticsOutputConfiguration } from '@/features/core/modules/diagnostics/domain/types/diagnostics.types';
export declare class ConsoleDiagnosticsAdapter implements DiagnosticsAdapter {
    readonly id: string;
    constructor(output: EndgeDiagnosticsOutputConfiguration);
    acceptRecord(record: DiagnosticsRecord, context: DiagnosticsAdapterRecordContext): void;
    acceptSnapshot(snapshot: DiagnosticsSnapshot, context: DiagnosticsAdapterSnapshotContext): void;
    test(): void;
}
export declare const CONSOLE_DIAGNOSTICS_ADAPTER_FACTORY: DiagnosticsAdapterFactory;
```

## src/features/core/modules/diagnostics/adapters/DiagnosticsAdapterRegistry.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/diagnostics/adapters/DiagnosticsAdapterRegistry.ts)

```ts
import type { DiagnosticsAdapter, DiagnosticsAdapterCreateContext, DiagnosticsAdapterFactory } from '@/features/core/modules/diagnostics/domain/types/diagnostics-adapter.type';
import type { EndgeDiagnosticsOutputConfiguration } from '@/features/core/modules/diagnostics/domain/types/diagnostics.types';
export declare class DiagnosticsAdapterRegistry {
    register(factory: DiagnosticsAdapterFactory): () => void;
    get(type: string): DiagnosticsAdapterFactory | undefined;
    list(): readonly DiagnosticsAdapterFactory[];
    create(output: EndgeDiagnosticsOutputConfiguration, context: DiagnosticsAdapterCreateContext): DiagnosticsAdapter | null;
    subscribe(listener: () => void): () => void;
}
```

## src/features/core/modules/diagnostics/adapters/SentryDiagnosticsAdapter.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/diagnostics/adapters/SentryDiagnosticsAdapter.ts)

```ts
import type { DiagnosticsAdapter, DiagnosticsAdapterCreateContext, DiagnosticsAdapterFactory, DiagnosticsAdapterRecordContext, DiagnosticsAdapterSnapshotContext } from '@/features/core/modules/diagnostics/domain/types/diagnostics-adapter.type';
import type { DiagnosticsRecord, DiagnosticsSnapshot, EndgeDiagnosticsOutputConfiguration } from '@/features/core/modules/diagnostics/domain/types/diagnostics.types';
export declare class SentryDiagnosticsAdapter implements DiagnosticsAdapter {
    readonly id: string;
    constructor(output: EndgeDiagnosticsOutputConfiguration, context: DiagnosticsAdapterCreateContext);
    acceptRecord(record: DiagnosticsRecord, context: DiagnosticsAdapterRecordContext): Promise<void>;
    acceptSnapshot(snapshot: DiagnosticsSnapshot, context: DiagnosticsAdapterSnapshotContext): Promise<void> | void;
    test(): Promise<void>;
    flush(): Promise<void>;
    dispose(): Promise<void>;
}
export declare const SENTRY_DIAGNOSTICS_ADAPTER_FACTORY: DiagnosticsAdapterFactory;
```

## src/features/core/modules/diagnostics/adapters/SentryDiagnosticsAdapter.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/diagnostics/adapters/SentryDiagnosticsAdapter.types.ts)

```ts
import type { DiagnosticsAttributeScalar } from '@/features/core/modules/diagnostics/domain/types/diagnostics.types';
export interface SentryDiagnosticsAdapterOptions {
    dsn: string;
    environment?: string;
    release?: string;
    serverName?: string;
    tunnel?: string;
    sendSnapshots?: boolean;
    requestTimeoutMs?: number;
    tags?: Record<string, DiagnosticsAttributeScalar>;
}
```

## src/features/core/modules/diagnostics/config/diagnostics.config.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/diagnostics/config/diagnostics.config.ts)

```ts
import type { DiagnosticsSeverityNumber, EndgeDiagnosticsConfiguration } from '@/features/core/modules/diagnostics/domain/types/diagnostics.types';
export declare const DEFAULT_ENDGE_DIAGNOSTICS_CONFIGURATION: Readonly<EndgeDiagnosticsConfiguration>;
export declare const DIAGNOSTICS_SEVERITY_TEXT: Record<DiagnosticsSeverityNumber, 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL'>;
```

## src/features/core/modules/diagnostics/domain/diagnostics-snapshot.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/diagnostics/domain/diagnostics-snapshot.ts)

```ts
import type { DiagnosticsJsonValue } from '@/features/core/modules/diagnostics/domain/types/diagnostics.types';
export interface DiagnosticsJsonSerializationResult {
    value: DiagnosticsJsonValue;
    redactedFields: number;
}
export declare function serializeDiagnosticsJson(input: unknown): DiagnosticsJsonSerializationResult;
```

## src/features/core/modules/diagnostics/domain/entities/DiagnosticsRecordStore.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/diagnostics/domain/entities/DiagnosticsRecordStore.ts)

```ts
import type { DiagnosticsRecord, DiagnosticsSignal } from '@/features/core/modules/diagnostics/domain/types/diagnostics.types';
export declare class DiagnosticsRecordStore {
    constructor(capacity: number);
    get size(): number;
    setCapacity(nextCapacity: number): void;
    append(record: DiagnosticsRecord): DiagnosticsRecord | null;
    clear(): void;
    toArray(limit?: number): DiagnosticsRecord[];
    getByTraceId(traceId: string, limit?: number): DiagnosticsRecord[];
    getBySpanId(spanId: string, limit?: number): DiagnosticsRecord[];
    getByScope(scopeName: string, limit?: number): DiagnosticsRecord[];
    getRecordsBySignal(): Partial<Record<DiagnosticsSignal, number>>;
    getRecordsByScope(): Record<string, number>;
}
```

## src/features/core/modules/diagnostics/domain/entities/DiagnosticsSpan.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/diagnostics/domain/entities/DiagnosticsSpan.ts)

```ts
import type { DiagnosticsAttributes, DiagnosticsExceptionOptions, DiagnosticsInstrumentationScope, DiagnosticsLogInput, DiagnosticsLogRecord, DiagnosticsSpanEndOptions, DiagnosticsSpanHandle, DiagnosticsSpanOptions, DiagnosticsSpanOwner, DiagnosticsSpanRecord } from '@/features/core/modules/diagnostics/domain/types/diagnostics.types';
export declare class DiagnosticsSpan implements DiagnosticsSpanHandle {
    readonly traceId: string;
    readonly spanId: string;
    readonly parentSpanId: string | undefined;
    constructor(_owner: DiagnosticsSpanOwner, traceId: string, spanId: string, parentSpanId: string | undefined, _traceFlags: number | undefined, _name: string, _scope: DiagnosticsInstrumentationScope, _startTimestamp: number, attributes: DiagnosticsAttributes, _phase: DiagnosticsSpanOptions['phase']);
    get isEnded(): boolean;
    setAttributes(attributes: DiagnosticsAttributes): void;
    startChild(name: string, options?: Omit<DiagnosticsSpanOptions, 'traceId' | 'parentSpanId'>): DiagnosticsSpanHandle;
    log(input: Omit<DiagnosticsLogInput, 'traceId' | 'spanId'>): DiagnosticsLogRecord | null;
    recordException(error: unknown, options?: DiagnosticsExceptionOptions): DiagnosticsLogRecord | null;
    end(options?: DiagnosticsSpanEndOptions): DiagnosticsSpanRecord | null;
}
```

## src/features/core/modules/diagnostics/domain/types/diagnostics-adapter.type.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/diagnostics/domain/types/diagnostics-adapter.type.ts)

```ts
import type { DiagnosticsRecord, DiagnosticsResource, DiagnosticsSnapshot, EndgeDiagnosticsOutputConfiguration } from './diagnostics.types';
export interface DiagnosticsAdapterCapabilities {
    records: boolean;
    snapshots: boolean;
    test: boolean;
}
export interface DiagnosticsAdapterCreateContext {
    sessionId: string;
    resource: DiagnosticsResource;
    resolveVariable?: (value: string) => string | undefined;
}
export interface DiagnosticsAdapterRecordContext extends DiagnosticsAdapterCreateContext {
    routeIds: string[];
    output: EndgeDiagnosticsOutputConfiguration;
}
export interface DiagnosticsAdapterSnapshotContext extends DiagnosticsAdapterCreateContext {
    output: EndgeDiagnosticsOutputConfiguration;
    trigger: DiagnosticsSnapshot['trigger'];
}
export interface DiagnosticsAdapter {
    readonly id: string;
    acceptRecord: (record: DiagnosticsRecord, context: DiagnosticsAdapterRecordContext) => void | Promise<void>;
    acceptSnapshot?: (snapshot: DiagnosticsSnapshot, context: DiagnosticsAdapterSnapshotContext) => void | Promise<void>;
    test?: () => void | Promise<void>;
    flush?: () => void | Promise<void>;
    dispose?: () => void | Promise<void>;
}
export interface DiagnosticsAdapterFactory {
    readonly type: string;
    readonly capabilities: DiagnosticsAdapterCapabilities;
    create: (output: EndgeDiagnosticsOutputConfiguration, context: DiagnosticsAdapterCreateContext) => DiagnosticsAdapter;
}
export interface DiagnosticsFlushResult {
    succeeded: string[];
    failed: Array<{
        outputId: string;
        error: unknown;
    }>;
}
```

## src/features/core/modules/diagnostics/domain/types/diagnostics-snapshot-runtime-adapter.type.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/diagnostics/domain/types/diagnostics-snapshot-runtime-adapter.type.ts)

```ts
import type { DiagnosticsSnapshot } from '@/features/core/modules/diagnostics/domain/types/diagnostics.types';
import type { ComponentSFCInteractionTriggerEvent, ComponentSFCInteractionTriggerPlatform } from '@/features/core/modules/domain/types/component/sfc/ir.types';
export interface DiagnosticsSnapshotShortcutEvent {
    type: 'keydown' | 'keyup';
    occurrence: ComponentSFCInteractionTriggerEvent;
    platform: ComponentSFCInteractionTriggerPlatform;
    preventDefault: () => void;
    stopPropagation: () => void;
}
export interface DiagnosticsSnapshotRuntimeAdapter {
    subscribeShortcut: (listener: (event: DiagnosticsSnapshotShortcutEvent) => void) => () => void;
    downloadJson: (snapshot: DiagnosticsSnapshot) => void;
}
```

## src/features/core/modules/diagnostics/domain/types/diagnostics.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/diagnostics/domain/types/diagnostics.types.ts)

```ts
import type { ComponentSFCInteractionTriggerActivation } from '@/features/core/modules/domain/types/component/sfc/ir.types';
export type DiagnosticsSignal = 'log' | 'span';
export type DiagnosticsPhase = 'authoring' | 'build' | 'runtime';
export type DiagnosticsSeverityNumber = 1 | 5 | 9 | 13 | 17 | 21;
export type DiagnosticsAttributeScalar = string | number | boolean;
export type DiagnosticsAttributeValue = DiagnosticsAttributeScalar | DiagnosticsAttributeScalar[];
export type DiagnosticsAttributes = Record<string, DiagnosticsAttributeValue>;
export type DiagnosticsContextProvider = () => DiagnosticsAttributes;
export type DiagnosticsProblemPhase = DiagnosticsPhase;
export type DiagnosticsProblemSeverity = 'info' | 'warning' | 'error' | 'fatal';
export interface DiagnosticsEntityRef {
    entityType: string;
    id: string | number;
    identity: string;
}
export interface DiagnosticsProblemOwner {
    key: string;
    phase: DiagnosticsProblemPhase;
    entityRef?: DiagnosticsEntityRef;
    runtimeId?: string;
}
export interface DiagnosticsProblemInput {
    key?: string;
    severity: DiagnosticsProblemSeverity;
    code: string;
    message: string;
    sourcePath?: string;
    start?: number;
    end?: number;
    attributes?: DiagnosticsAttributes;
    traceId?: string;
    recordId?: number;
}
export interface DiagnosticsProblem extends Omit<DiagnosticsProblemInput, 'key'> {
    id: string;
    key: string;
    owner: DiagnosticsProblemOwner;
    updatedAt: number;
}
export interface DiagnosticsProblemFilter {
    ownerKeys?: string[];
    phases?: DiagnosticsProblemPhase[];
    severities?: DiagnosticsProblemSeverity[];
    entityTypes?: string[];
    entityId?: string | number;
    entityIdentity?: string;
    runtimeId?: string;
    codes?: string[];
}
export interface DiagnosticsProblemsSnapshot {
    revision: number;
    total: number;
    problems: readonly DiagnosticsProblem[];
}
export interface DiagnosticsInstrumentationScope {
    name: string;
    version?: string;
}
export interface DiagnosticsResource {
    attributes: DiagnosticsAttributes;
}
export interface DiagnosticsSpanStatus {
    code: 'unset' | 'ok' | 'error';
    message?: string;
}
export interface DiagnosticsRecordBase {
    id: number;
    signal: DiagnosticsSignal;
    scope: DiagnosticsInstrumentationScope;
    attributes: DiagnosticsAttributes;
    traceId?: string;
    spanId?: string;
    traceFlags?: number;
    phase?: DiagnosticsPhase;
}
export interface DiagnosticsLogRecord extends DiagnosticsRecordBase {
    signal: 'log';
    timestamp: number;
    observedTimestamp?: number;
    severityNumber: DiagnosticsSeverityNumber;
    severityText: 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
    body: string;
    eventName?: string;
}
export interface DiagnosticsSpanRecord extends DiagnosticsRecordBase {
    signal: 'span';
    traceId: string;
    spanId: string;
    parentSpanId?: string;
    name: string;
    startTimestamp: number;
    endTimestamp: number;
    durationMs: number;
    status: DiagnosticsSpanStatus;
}
export type DiagnosticsRecord = DiagnosticsLogRecord | DiagnosticsSpanRecord;
export interface EndgeDiagnosticsCollectionConfiguration {
    enabled: boolean;
    signals: DiagnosticsSignal[];
    minSeverity: DiagnosticsSeverityNumber;
    maxRecords: number;
}
export type DiagnosticsAdapterOptionValue = string | number | boolean | null | DiagnosticsAdapterOptionValue[] | {
    [key: string]: DiagnosticsAdapterOptionValue;
};
export type DiagnosticsJsonValue = string | number | boolean | null | DiagnosticsJsonValue[] | {
    [key: string]: DiagnosticsJsonValue;
};
export interface EndgeDiagnosticsOutputConfiguration {
    id: string;
    name: string;
    enabled: boolean;
    adapterType: string;
    options: Record<string, DiagnosticsAdapterOptionValue>;
}
export interface DiagnosticsFilter {
    signals?: DiagnosticsSignal[];
    phases?: DiagnosticsPhase[];
    minSeverity?: DiagnosticsSeverityNumber;
    spanStatuses?: DiagnosticsSpanStatus['code'][];
    minDurationMs?: number;
    scopes?: string[];
    eventNames?: string[];
    traceId?: string;
    spanId?: string;
    attributes?: DiagnosticsAttributes;
    limit?: number;
}
export interface EndgeDiagnosticsRoute {
    id: string;
    name: string;
    enabled: boolean;
    match: DiagnosticsFilter;
    outputId: string;
}
export interface EndgeDiagnosticsTelemetryConfiguration {
    collection: EndgeDiagnosticsCollectionConfiguration;
    outputs: EndgeDiagnosticsOutputConfiguration[];
    routes: EndgeDiagnosticsRoute[];
}
export interface EndgeDiagnosticsSnapshotContentConfiguration {
    telemetry: boolean;
    problems: boolean;
    configuration: boolean;
    effectiveConfiguration?: boolean;
    domain?: boolean;
    program?: boolean;
    runtime?: boolean;
    raphData?: boolean;
    raphGraph?: boolean;
}
export interface EndgeDiagnosticsAutomaticSnapshotConfiguration {
    enabled: boolean;
    errorCount: number;
    windowSeconds: number;
    cooldownSeconds: number;
    outputIds: string[];
}
export interface EndgeDiagnosticsShortcutSnapshotConfiguration {
    triggerSet: ComponentSFCInteractionTriggerActivation;
    content: EndgeDiagnosticsSnapshotContentConfiguration;
}
export interface EndgeDiagnosticsSnapshotsConfiguration {
    content: EndgeDiagnosticsSnapshotContentConfiguration;
    shortcut: EndgeDiagnosticsShortcutSnapshotConfiguration;
    automatic: EndgeDiagnosticsAutomaticSnapshotConfiguration;
}
export interface EndgeDiagnosticsConfiguration {
    telemetry: EndgeDiagnosticsTelemetryConfiguration;
    snapshots: EndgeDiagnosticsSnapshotsConfiguration;
}
export interface DiagnosticsLogOptions {
    timestamp?: number;
    observedTimestamp?: number;
    scope?: DiagnosticsInstrumentationScope;
    eventName?: string;
    attributes?: DiagnosticsAttributes;
    traceId?: string;
    spanId?: string;
    traceFlags?: number;
    phase?: DiagnosticsPhase;
}
export interface DiagnosticsLogInput extends DiagnosticsLogOptions {
    body: string;
    severityNumber: DiagnosticsSeverityNumber;
}
export interface DiagnosticsExceptionOptions extends DiagnosticsLogOptions {
    severityNumber?: 17 | 21;
}
export interface DiagnosticsSpanOptions {
    scope?: DiagnosticsInstrumentationScope;
    attributes?: DiagnosticsAttributes;
    traceId?: string;
    parentSpanId?: string;
    traceFlags?: number;
    startTimestamp?: number;
    phase?: DiagnosticsPhase;
}
export interface DiagnosticsSpanEndOptions {
    status?: DiagnosticsSpanStatus['code'];
    message?: string;
    attributes?: DiagnosticsAttributes;
    endTimestamp?: number;
}
export interface DiagnosticsSpanHandle {
    readonly traceId: string;
    readonly spanId: string;
    readonly parentSpanId?: string;
    readonly isEnded: boolean;
    setAttributes: (attributes: DiagnosticsAttributes) => void;
    startChild: (name: string, options?: Omit<DiagnosticsSpanOptions, 'traceId' | 'parentSpanId'>) => DiagnosticsSpanHandle;
    log: (input: Omit<DiagnosticsLogInput, 'traceId' | 'spanId'>) => DiagnosticsLogRecord | null;
    recordException: (error: unknown, options?: DiagnosticsExceptionOptions) => DiagnosticsLogRecord | null;
    end: (options?: DiagnosticsSpanEndOptions) => DiagnosticsSpanRecord | null;
}
export interface DiagnosticsCounters {
    totalRecords: number;
    droppedByPolicy: number;
    droppedByCapacity: number;
    adapterFailures: number;
    listenerFailures: number;
    contextProviderFailures: number;
    activeAdapters: number;
    activeContextProviders: number;
    activeSpans: number;
    recordsBySignal: Partial<Record<DiagnosticsSignal, number>>;
    recordsByScope: Record<string, number>;
}
export interface DiagnosticsSnapshotOptions {
    trigger?: 'manual' | 'shortcut' | 'automatic';
    includeTelemetry?: boolean;
    includeProblems?: boolean;
    includeConfiguration?: boolean;
    includeEffectiveConfiguration?: boolean;
    includeDomain?: boolean;
    includeProgram?: boolean;
    includeRuntime?: boolean;
    includeRaphData?: boolean;
    includeRaphGraph?: boolean;
    filter?: DiagnosticsFilter;
}
export interface DiagnosticsRaphSnapshotOptions {
    includeData: boolean;
    includeGraph: boolean;
}
export interface DiagnosticsSnapshotCaptureError {
    section: 'federation' | 'effectiveConfiguration' | 'domain' | 'program' | 'runtime' | 'raph';
    message: string;
}
export interface DiagnosticsTelemetrySnapshot {
    sessionId: string;
    resource: DiagnosticsResource;
    counters: DiagnosticsCounters;
    records: readonly DiagnosticsRecord[];
}
export interface DiagnosticsSnapshot {
    format?: 'endge-diagnostics-snapshot';
    version?: 1 | 2;
    generatedAt: number;
    trigger: 'manual' | 'shortcut' | 'automatic';
    telemetry?: DiagnosticsTelemetrySnapshot;
    problems?: DiagnosticsProblemsSnapshot;
    configuration?: EndgeDiagnosticsConfiguration;
    effectiveConfiguration?: DiagnosticsJsonValue;
    domain?: DiagnosticsJsonValue;
    program?: DiagnosticsJsonValue;
    runtime?: DiagnosticsJsonValue;
    raph?: DiagnosticsJsonValue;
    federation?: DiagnosticsJsonValue;
    captureErrors?: DiagnosticsSnapshotCaptureError[];
    redaction?: {
        applied: true;
        fields: number;
    };
}
export type DiagnosticsListener = (record: DiagnosticsRecord) => void;
export interface DiagnosticsSubscribeOptions {
    replayStored?: boolean;
}
export interface DiagnosticsSpanOwner {
    startSpan: (name: string, options?: DiagnosticsSpanOptions) => DiagnosticsSpanHandle;
    log: (input: DiagnosticsLogInput) => DiagnosticsLogRecord | null;
    recordException: (error: unknown, options?: DiagnosticsExceptionOptions) => DiagnosticsLogRecord | null;
    finishSpan: (input: {
        traceId: string;
        spanId: string;
        parentSpanId?: string;
        traceFlags?: number;
        phase?: DiagnosticsPhase;
        name: string;
        scope: DiagnosticsInstrumentationScope;
        startTimestamp: number;
        attributes: DiagnosticsAttributes;
        options?: DiagnosticsSpanEndOptions;
    }) => DiagnosticsSpanRecord | null;
}
```

## src/features/core/modules/diagnostics/EndgeDiagnostics_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/diagnostics/EndgeDiagnostics_Module.ts)

```ts
import type { EndgeBootContext } from '@/features/core/kernel/types/bootstrap.types';
import type { DiagnosticsAdapter, DiagnosticsAdapterFactory, DiagnosticsFlushResult } from '@/features/core/modules/diagnostics/domain/types/diagnostics-adapter.type';
import type { DiagnosticsContextProvider, DiagnosticsExceptionOptions, DiagnosticsFilter, DiagnosticsListener, DiagnosticsLogInput, DiagnosticsLogOptions, DiagnosticsLogRecord, DiagnosticsRecord, DiagnosticsResource, DiagnosticsSnapshot, DiagnosticsSnapshotOptions, DiagnosticsSpanHandle, DiagnosticsSpanOptions, DiagnosticsSpanRecord, DiagnosticsSubscribeOptions, EndgeDiagnosticsConfiguration } from '@/features/core/modules/diagnostics/domain/types/diagnostics.types';
import { DiagnosticsAdapterRegistry } from '@/features/core/modules/diagnostics/adapters/DiagnosticsAdapterRegistry';
import { EndgeDiagnosticsSnapshots_Module } from '@/features/core/modules/diagnostics/EndgeDiagnosticsSnapshots_Module';
import { EndgeProblems_Module } from '@/features/core/modules/diagnostics/EndgeProblems_Module';
import { EndgeTelemetry_Module } from '@/features/core/modules/diagnostics/EndgeTelemetry_Module';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeDiagnostics_Module extends EndgeModule<EndgeBootContext> {
    readonly adapters: DiagnosticsAdapterRegistry;
    readonly telemetry: EndgeTelemetry_Module;
    readonly problems: EndgeProblems_Module;
    readonly snapshots: EndgeDiagnosticsSnapshots_Module;
    constructor();
    setup(ctx: EndgeBootContext): Promise<void>;
    load(ctx: EndgeBootContext): Promise<void>;
    build(ctx: EndgeBootContext): Promise<void>;
    start(ctx: EndgeBootContext): Promise<void>;
    reset(): Promise<void>;
    configure(configuration: EndgeDiagnosticsConfiguration, resource?: DiagnosticsResource): void;
    log(input: DiagnosticsLogInput): DiagnosticsLogRecord | null;
    trace(body: string, options?: DiagnosticsLogOptions): DiagnosticsLogRecord | null;
    debug(body: string, options?: DiagnosticsLogOptions): DiagnosticsLogRecord | null;
    info(body: string, options?: DiagnosticsLogOptions): DiagnosticsLogRecord | null;
    warn(body: string, options?: DiagnosticsLogOptions): DiagnosticsLogRecord | null;
    error(body: string, options?: DiagnosticsLogOptions): DiagnosticsLogRecord | null;
    fatal(body: string, options?: DiagnosticsLogOptions): DiagnosticsLogRecord | null;
    recordException(error: unknown, options?: DiagnosticsExceptionOptions): DiagnosticsLogRecord | null;
    startSpan(name: string, options?: DiagnosticsSpanOptions): DiagnosticsSpanHandle;
    finishSpan(input: Parameters<EndgeTelemetry_Module['finishSpan']>[0]): DiagnosticsSpanRecord | null;
    subscribe(listener: () => void): () => void;
    subscribe(filter: DiagnosticsFilter, listener: DiagnosticsListener, options?: DiagnosticsSubscribeOptions): () => void;
    query(filter?: DiagnosticsFilter): readonly DiagnosticsRecord[];
    snapshot(options?: DiagnosticsSnapshotOptions): DiagnosticsSnapshot;
    createDiagnosticsSnapshot(): unknown;
    sendSnapshot(outputIds?: readonly string[], options?: DiagnosticsSnapshotOptions): DiagnosticsSnapshot;
    downloadSnapshot(options?: DiagnosticsSnapshotOptions): DiagnosticsSnapshot;
    getCounters(): ReturnType<EndgeTelemetry_Module['getCounters']>;
    clear(): void;
    registerContextProvider(id: string, provider: DiagnosticsContextProvider): () => void;
    registerAdapter(adapter: DiagnosticsAdapter): () => void;
    registerAdapterFactory(factory: DiagnosticsAdapterFactory): () => void;
    testOutput(outputId: string): Promise<boolean>;
    unregisterAdapter(adapterId: string): Promise<void>;
    flush(): Promise<DiagnosticsFlushResult>;
    get sessionId(): string;
    get configuration(): EndgeDiagnosticsConfiguration;
    get resource(): DiagnosticsResource;
}
```

## src/features/core/modules/diagnostics/EndgeDiagnosticsSnapshots_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/diagnostics/EndgeDiagnosticsSnapshots_Module.ts)

```ts
import type { EndgeBootContext } from '@/features/core/kernel/types/bootstrap.types';
import type { DiagnosticsSnapshotRuntimeAdapter } from '@/features/core/modules/diagnostics/domain/types/diagnostics-snapshot-runtime-adapter.type';
import type { DiagnosticsSnapshot, DiagnosticsSnapshotOptions } from '@/features/core/modules/diagnostics/domain/types/diagnostics.types';
import type { EndgeProblems_Module } from '@/features/core/modules/diagnostics/EndgeProblems_Module';
import type { EndgeTelemetry_Module } from '@/features/core/modules/diagnostics/EndgeTelemetry_Module';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeDiagnosticsSnapshots_Module extends EndgeModule<EndgeBootContext> {
    constructor(_telemetry: EndgeTelemetry_Module, _problems: EndgeProblems_Module, _runtimeAdapter?: DiagnosticsSnapshotRuntimeAdapter);
    build(_ctx: EndgeBootContext): void;
    start(_ctx: EndgeBootContext): void;
    reset(): void;
    configure(): void;
    snapshot(options?: DiagnosticsSnapshotOptions): DiagnosticsSnapshot;
    sendSnapshot(outputIds?: readonly string[], options?: DiagnosticsSnapshotOptions): DiagnosticsSnapshot;
    downloadSnapshot(options?: DiagnosticsSnapshotOptions): DiagnosticsSnapshot;
}
```

## src/features/core/modules/diagnostics/EndgeProblems_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/diagnostics/EndgeProblems_Module.ts)

```ts
import type { DiagnosticsEntityRef, DiagnosticsProblem, DiagnosticsProblemFilter, DiagnosticsProblemInput, DiagnosticsProblemOwner, DiagnosticsProblemsSnapshot } from '@/features/core/modules/diagnostics/domain/types/diagnostics.types';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare function createDiagnosticsEntityOwner(entityRef: DiagnosticsEntityRef, phase?: DiagnosticsProblemOwner['phase']): DiagnosticsProblemOwner;
export declare class EndgeProblems_Module extends EndgeModule {
    get revision(): number;
    replace(owner: DiagnosticsProblemOwner, inputs: readonly DiagnosticsProblemInput[]): readonly DiagnosticsProblem[];
    upsert(owner: DiagnosticsProblemOwner, input: DiagnosticsProblemInput): DiagnosticsProblem;
    resolve(ownerKey: string, problemKey: string): boolean;
    query(filter?: DiagnosticsProblemFilter): readonly DiagnosticsProblem[];
    clear(filter?: DiagnosticsProblemFilter): void;
    snapshot(filter?: DiagnosticsProblemFilter): DiagnosticsProblemsSnapshot;
    reset(): void;
}
```

## src/features/core/modules/diagnostics/EndgeTelemetry_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/diagnostics/EndgeTelemetry_Module.ts)

```ts
import type { EndgeBootContext } from '@/features/core/kernel/types/bootstrap.types';
import type { DiagnosticsAdapterRegistry } from '@/features/core/modules/diagnostics/adapters/DiagnosticsAdapterRegistry';
import type { DiagnosticsAdapter, DiagnosticsFlushResult } from '@/features/core/modules/diagnostics/domain/types/diagnostics-adapter.type';
import type { DiagnosticsAttributes, DiagnosticsContextProvider, DiagnosticsCounters, DiagnosticsExceptionOptions, DiagnosticsFilter, DiagnosticsInstrumentationScope, DiagnosticsListener, DiagnosticsLogInput, DiagnosticsLogOptions, DiagnosticsLogRecord, DiagnosticsRecord, DiagnosticsResource, DiagnosticsSnapshot, DiagnosticsSpanEndOptions, DiagnosticsSpanHandle, DiagnosticsSpanOptions, DiagnosticsSpanOwner, DiagnosticsSpanRecord, DiagnosticsSubscribeOptions, DiagnosticsTelemetrySnapshot, EndgeDiagnosticsConfiguration } from '@/features/core/modules/diagnostics/domain/types/diagnostics.types';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeTelemetry_Module extends EndgeModule implements DiagnosticsSpanOwner {
    constructor(_adapterRegistry: DiagnosticsAdapterRegistry);
    get sessionId(): string;
    get configuration(): EndgeDiagnosticsConfiguration;
    get resource(): DiagnosticsResource;
    build(_ctx: EndgeBootContext): void;
    reset(): Promise<void>;
    configure(configuration: EndgeDiagnosticsConfiguration, resource?: DiagnosticsResource): void;
    log(input: DiagnosticsLogInput): DiagnosticsLogRecord | null;
    trace(body: string, options?: DiagnosticsLogOptions): DiagnosticsLogRecord | null;
    debug(body: string, options?: DiagnosticsLogOptions): DiagnosticsLogRecord | null;
    info(body: string, options?: DiagnosticsLogOptions): DiagnosticsLogRecord | null;
    warn(body: string, options?: DiagnosticsLogOptions): DiagnosticsLogRecord | null;
    error(body: string, options?: DiagnosticsLogOptions): DiagnosticsLogRecord | null;
    fatal(body: string, options?: DiagnosticsLogOptions): DiagnosticsLogRecord | null;
    recordException(error: unknown, options?: DiagnosticsExceptionOptions): DiagnosticsLogRecord | null;
    startSpan(name: string, options?: DiagnosticsSpanOptions): DiagnosticsSpanHandle;
    finishSpan(input: {
        traceId: string;
        spanId: string;
        parentSpanId?: string;
        traceFlags?: number;
        phase?: 'authoring' | 'build' | 'runtime';
        name: string;
        scope: DiagnosticsInstrumentationScope;
        startTimestamp: number;
        attributes: DiagnosticsAttributes;
        options?: DiagnosticsSpanEndOptions;
    }): DiagnosticsSpanRecord | null;
    subscribe(listener: () => void): () => void;
    subscribe(filter: DiagnosticsFilter, listener: DiagnosticsListener, options?: DiagnosticsSubscribeOptions): () => void;
    query(filter?: DiagnosticsFilter): readonly DiagnosticsRecord[];
    snapshot(filter?: DiagnosticsFilter): DiagnosticsTelemetrySnapshot;
    getCounters(): DiagnosticsCounters;
    clear(): void;
    registerContextProvider(id: string, provider: DiagnosticsContextProvider): () => void;
    registerAdapter(adapter: DiagnosticsAdapter): () => void;
    unregisterAdapter(adapterId: string): Promise<void>;
    testOutput(outputId: string): Promise<boolean>;
    deliverSnapshot(snapshot: DiagnosticsSnapshot, outputIds: readonly string[]): void;
    flush(): Promise<DiagnosticsFlushResult>;
}
```
