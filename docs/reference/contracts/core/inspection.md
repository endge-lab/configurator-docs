---
description: "TypeScript-декларации @endge/core 1.0.0-dev.12, группа inspection; исходных модулей: 2."
---

# @endge/core: inspection

Версия source: 1.0.0-dev.12. [Каталог package](./). [Repository](https://github.com/endge-lab/core).

## src/features/core/modules/inspection/EndgeInspection_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/inspection/EndgeInspection_Module.ts)

```ts
import type { InspectionCapture, InspectionChunk, InspectionRecord, InspectionRecording } from './types/inspection.types';
import type { EndgeContext_Module } from '@/features/core/modules/context/EndgeContext_Module';
import type { EndgeEvents_Module } from '@/features/core/modules/events/EndgeEvents_Module';
import type { EndgeProgram_Module } from '@/features/core/modules/program/EndgeProgram_Module';
import type { EndgeRuntime_Module } from '@/features/core/modules/runtime/EndgeRuntime_Module';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeInspection_Module extends EndgeModule {
    constructor(_context: EndgeContext_Module, _runtime: EndgeRuntime_Module, _events: EndgeEvents_Module, _program: EndgeProgram_Module);
    get status(): 'idle' | 'recording' | 'stopped' | 'ready' | 'error';
    get availableRange(): {
        first: number;
        last: number;
    } | null;
    get dataAvailable(): boolean;
    get records(): readonly InspectionRecord[];
    get appliedSequence(): number | null;
    get receivedSequence(): number | null;
    get followLive(): boolean;
    get error(): string | null;
    get bytes(): number;
    get isRecording(): boolean;
    get recordingId(): string | null;
    get archives(): ReadonlyArray<{
        recordingId: string;
        programId: string;
        runId: string;
        records: number;
    }>;
    get gaps(): ReadonlyArray<{
        from: number;
        to: number;
        resumedAt: number;
    }>;
    archiveCurrent(): void;
    exportArchived(recordingId: string): InspectionRecording;
    removeArchived(recordingId: string): void;
    prepare(recording: unknown): InspectionRecording;
    open(recording: InspectionRecording): void;
    appendRecording(input: InspectionRecording): void;
    append(chunk: InspectionChunk): void;
    seek(sequence: number): void;
    stepForward(): void;
    stepBackward(): void;
    setFollowLive(value: boolean): void;
    exportRecording(): InspectionRecording;
    startRecording(options?: {
        includeData?: boolean;
    }): void;
    stopRecording(): void;
    createCapture(options: {
        includeData?: boolean;
    }, onChunk?: (chunk: InspectionChunk) => void): InspectionCapture;
    clear(): void;
    reset(): void;
}
```

## src/features/core/modules/inspection/types/inspection.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/inspection/types/inspection.types.ts)

```ts
import type { BundleJsonValue } from '@/features/core/kernel/types/endge-bundle.types';
import type { EndgeContextSnapshot } from '@/features/core/modules/context/domain/context-persistence.types';
import type { RuntimeInspectionSnapshot } from '@/features/core/modules/runtime/domain/runtime-inspection.types';
export interface InspectionState {
    context: EndgeContextSnapshot & {
        dataMode?: 'live' | 'mock';
    };
    runtime: RuntimeInspectionSnapshot;
    data: BundleJsonValue | null;
    dataAvailable: boolean;
}
export type InspectionChange = {
    op: 'set';
    path: string[];
    value: BundleJsonValue;
} | {
    op: 'remove';
    path: string[];
};
interface InspectionRecordHeader {
    sequence: number;
    at: number;
}
export type InspectionRecord = InspectionRecordHeader & ({
    kind: 'snapshot';
    scope: 'inspection';
    revision: number;
    reason: 'initial' | 'manual' | 'resync' | 'checkpoint';
    value: InspectionState;
} | {
    kind: 'snapshot';
    scope: 'data';
    revision: number;
    reason: 'manual' | 'checkpoint';
    value: {
        data: BundleJsonValue | null;
        render?: BundleJsonValue;
        dataAvailable: boolean;
    };
} | {
    kind: 'delta';
    baseRevision: number;
    revision: number;
    changes: InspectionChange[];
} | {
    kind: 'event';
    name: string;
    payload: BundleJsonValue;
} | {
    kind: 'marker';
    name: 'data-enabled' | 'data-disabled' | 'gap' | 'error' | 'stopped';
    message: string;
});
export interface InspectionChunk {
    firstSequence: number;
    lastSequence: number;
    records: InspectionRecord[];
}
export interface InspectionRecording {
    version: 1;
    programId: string;
    runId: string;
    recordingId: string;
    chunks: InspectionChunk[];
}
export interface InspectionCapture {
    readonly recording: InspectionRecording;
    setIncludeData: (value: boolean) => void;
    snapshot: (reason?: 'manual' | 'resync') => void;
    stop: () => void;
}
export {};
```
