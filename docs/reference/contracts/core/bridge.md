---
description: "TypeScript-декларации @endge/core 1.0.0-dev.11, группа bridge; исходных модулей: 6."
---

# @endge/core: bridge

Версия source: 1.0.0-dev.11. [Каталог package](./). [Repository](https://github.com/endge-lab/core).

## src/features/core/modules/bridge/config/bridge.config.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/bridge/config/bridge.config.ts)

```ts
export declare const BRIDGE_CONFIG: {
    readonly protocol: 1;
    readonly registrationTimeoutMs: 10000;
    readonly serverSilenceTimeoutMs: 75000;
    readonly requestTimeoutMs: 60000;
    readonly reconnectMaxMs: 30000;
    readonly maxMessageBytes: number;
    readonly maxPendingRequests: 16;
    readonly maxBufferedEvents: 256;
    readonly maxBufferedBytes: number;
    readonly maxInspectionBytes: number;
    readonly minInspectionIntervalMs: 1000;
    readonly maxInspectionIntervalMs: 60000;
};
export declare const BRIDGE_SNAPSHOT_OPTIONS: {
    readonly includeTelemetry: true;
    readonly includeProblems: true;
    readonly includeConfiguration: true;
    readonly includeEffectiveConfiguration: true;
    readonly includeDomain: true;
    readonly includeProgram: true;
    readonly includeRuntime: true;
    readonly includeRaphData: true;
    readonly includeRaphGraph: true;
};
export declare const BRIDGE_STRUCTURE_SNAPSHOT_OPTIONS: {
    readonly includeTelemetry: false;
    readonly includeProblems: false;
    readonly includeProgram: false;
    readonly includeRaphData: false;
    readonly includeRaphGraph: false;
    readonly includeConfiguration: true;
    readonly includeEffectiveConfiguration: true;
    readonly includeDomain: true;
    readonly includeRuntime: true;
};
export declare function normalizeBridgeServer(raw: string): string;
export declare function parseBridgeAllowedServers(value: string | undefined): string[];
```

## src/features/core/modules/bridge/configurator/EndgeBridgeConfigurator_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/bridge/configurator/EndgeBridgeConfigurator_Module.ts)

```ts
import type { ConfiguratorConnection, ConfiguratorParticipant } from '@/features/core/modules/bridge/domain/bridge.type';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeBridgeConfigurator_Module extends EndgeModule {
    update(serverUrl: string, connections: readonly Omit<ConfiguratorConnection, 'serverUrl'>[]): void;
    disconnect(serverUrl: string): void;
    reset(): void;
    get connections(): readonly ConfiguratorConnection[];
    get participants(): readonly ConfiguratorParticipant[];
}
```

## src/features/core/modules/bridge/debug/EndgeBridgeDebug_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/bridge/debug/EndgeBridgeDebug_Module.ts)

```ts
import type { EndgeBundle } from '@/features/core/kernel/types/endge-bundle.types';
import type { BrowserBridge_Adapter } from '@/features/core/modules/bridge/adapters/BrowserBridge_Adapter';
import type { BridgeCommands, BridgeDebugClient, BridgeDebugSession, BridgeMessage, DebugConnectionRequest, SimulationRunResult } from '@/features/core/modules/bridge/domain/bridge.type';
import type { EndgeCommand } from '@/features/core/modules/commands/domain/commands.types';
import type { DiagnosticsSnapshot } from '@/features/core/modules/diagnostics/domain/types/diagnostics.types';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeBridgeDebug_Module extends EndgeModule {
    constructor(_commands: BridgeCommands, _adapter: BrowserBridge_Adapter);
    configure(role: 'client' | 'configurator', enabled: boolean): void;
    requestSession(input: {
        serverUrl: string;
        instanceId: string;
    }): Promise<BridgeDebugSession>;
    respondToConsent(request: Pick<DebugConnectionRequest, 'serverUrl' | 'sessionId'>, accepted: boolean): boolean;
    endSession(sessionId: string): Promise<void>;
    getSnapshot(sessionId: string): Promise<DiagnosticsSnapshot>;
    startContextSync(sessionId: string, options?: {
        includeData: boolean;
    }): Promise<EndgeBundle>;
    activateContextSync(sessionId: string, sequence: number): void;
    refreshInspection(sessionId: string): Promise<void>;
    setInspectionInterval(sessionId: string, intervalMs: number): Promise<void>;
    executeCommand(sessionId: string, command: EndgeCommand): Promise<void>;
    runSimulation(sessionId: string, input: {
        identity: string;
        expectedHash: string;
    }): Promise<SimulationRunResult>;
    getSimulationHash(identity: string): Promise<string>;
    receive(serverUrl: string, message: BridgeMessage): Promise<void>;
    disconnect(serverUrl: string): void;
    reset(): void;
    setInspectionData(sessionId: string, includeData: boolean): Promise<void>;
    get pendingConsent(): Readonly<DebugConnectionRequest> | null;
    get clients(): readonly BridgeDebugClient[];
    get sessions(): readonly BridgeDebugSession[];
}
```

## src/features/core/modules/bridge/domain/bridge-sync.type.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/bridge/domain/bridge-sync.type.ts)

```ts
import type { DiagnosticsSnapshot } from '@/features/core/modules/diagnostics/domain/types/diagnostics.types';
import type { EndgePublishedEvent } from '@/features/core/modules/events/domain/events.types';
import type { RuntimeInspectionSnapshot } from '@/features/core/modules/runtime/domain/runtime-inspection.types';
export interface BridgeInspectionSnapshot {
    readonly snapshot: DiagnosticsSnapshot;
    readonly sequence: number;
}
export interface BridgeStreamEvent {
    readonly sequence: number;
    readonly event: EndgePublishedEvent;
}
export interface BridgeInspectionUpdate {
    readonly sequence: number;
    readonly update: {
        kind: 'runtime';
        snapshot: RuntimeInspectionSnapshot;
    } | {
        kind: 'data';
        data: unknown;
        render?: RuntimeInspectionSnapshot['render'];
        generatedAt: number;
    } | {
        kind: 'data-error';
        message: string;
    };
}
export type BridgeInspectionMessage = BridgeStreamEvent | BridgeInspectionUpdate;
```

## src/features/core/modules/bridge/domain/bridge.type.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/bridge/domain/bridge.type.ts)

```ts
export type EndgeBridgeBootOptions = {
    role: 'client';
    allowedServers: readonly string[];
    debug?: boolean;
    label?: string;
} | {
    role: 'configurator';
    serverUrl: string;
    debug?: boolean;
    label?: string;
    allWorkspaces?: boolean;
};
export interface BridgeConnectionState {
    serverUrl: string;
    status: 'connecting' | 'connected' | 'reconnecting' | 'disconnected';
    instanceId?: string;
    error?: string;
}
export interface ConfiguratorConnection {
    workspaceDisplayName?: string;
    serverUrl: string;
    instanceId: string;
    userId: string;
    displayName: string;
    label: string;
}
export interface ConfiguratorParticipant {
    serverUrl: string;
    userId: string;
    displayName: string;
    connectionCount: number;
}
export interface BridgeDebugClient {
    workspaceIdentity?: string;
    workspaceDisplayName?: string;
    serverUrl: string;
    instanceId: string;
    label: string;
}
export interface BridgeDebugSession {
    serverUrl: string;
    sessionId: string;
    clientId: string;
    configuratorId: string;
}
export interface DebugConnectionRequest {
    serverUrl: string;
    sessionId: string;
    workspaceIdentity: string;
    displayName: string;
    expiresAt: number;
}
export type SimulationRunResult = {
    status: 'mocked';
    identity: string;
    hash: string;
} | {
    status: 'rejected';
    reason: 'not-found' | 'hash-mismatch';
};
export interface BridgeMessage {
    type: string;
    id?: string;
    sessionId?: string;
    targetId?: string;
    identity?: string;
    expectedHash?: string;
    accepted?: boolean;
    data?: unknown;
    error?: string;
}
export interface BridgeCommands {
    request: (serverUrl: string, message: BridgeMessage) => Promise<unknown>;
    send: (serverUrl: string, message: BridgeMessage) => void;
}
```

## src/features/core/modules/bridge/EndgeBridge_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/bridge/EndgeBridge_Module.ts)

```ts
import type { EndgeBootContext } from '@/features/core/kernel/types/bootstrap.types';
import type { BridgeConnectionState } from '@/features/core/modules/bridge/domain/bridge.type';
import { BrowserBridge_Adapter } from '@/features/core/modules/bridge/adapters/BrowserBridge_Adapter';
import { EndgeBridgeConfigurator_Module } from '@/features/core/modules/bridge/configurator/EndgeBridgeConfigurator_Module';
import { EndgeBridgeDebug_Module } from '@/features/core/modules/bridge/debug/EndgeBridgeDebug_Module';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare class EndgeBridge_Module extends EndgeModule<EndgeBootContext> {
    readonly debug: EndgeBridgeDebug_Module;
    readonly configurator: EndgeBridgeConfigurator_Module;
    constructor(_adapter?: BrowserBridge_Adapter);
    setup(ctx: EndgeBootContext): void;
    start(): void;
    connect(rawServerUrl: string): void;
    disconnect(rawServerUrl: string): void;
    reset(): void;
    createDiagnosticsSnapshot(): unknown;
    get connections(): readonly BridgeConnectionState[];
}
```
