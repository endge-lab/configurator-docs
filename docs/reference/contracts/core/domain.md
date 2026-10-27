---
description: "TypeScript-декларации @endge/core 1.0.0-dev.12, группа domain; исходных модулей: 80."
---

# @endge/core: domain

Версия source: 1.0.0-dev.12. [Каталог package](./). [Repository](https://github.com/endge-lab/core).

## src/features/core/modules/domain/component/component-sfc-edit-trigger.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/component/component-sfc-edit-trigger.ts)

```ts
import type { ComponentSFCInteractionKeyboardCondition, ComponentSFCInteractionTrigger, ComponentSFCInteractionTriggerActivation, ComponentSFCInteractionTriggerEvent, ComponentSFCInteractionTriggerHeldKeys, ComponentSFCInteractionTriggerModifiers, ComponentSFCInteractionTriggerPlatform } from '@/features/core/modules/domain/types/component/sfc/ir.types';
export declare const DEFAULT_COMPONENT_SFC_INTERACTION_SEQUENCE_INTERVAL_MS = 1000;
export type ComponentSFCInteractionTriggerActivationMatch = {
    status: 'none';
} | {
    status: 'progress' | 'complete';
    trigger: ComponentSFCInteractionTrigger;
    stepIndex: number;
    triggerIndex: number;
};
export declare function normalizeComponentSFCInteractionTriggers(value: unknown): ComponentSFCInteractionTrigger[];
export declare function normalizeComponentSFCInteractionTriggerActivation(value: unknown): ComponentSFCInteractionTriggerActivation;
export declare function hasComponentSFCInteractionTriggerActivation(activation: ComponentSFCInteractionTriggerActivation): boolean;
export declare class ComponentSFCInteractionTriggerActivationMatcher {
    constructor(value: unknown);
    match(eventName: string, event: ComponentSFCInteractionTriggerEvent, platform: ComponentSFCInteractionTriggerPlatform, occurredAt?: number): ComponentSFCInteractionTriggerActivationMatch;
    reset(): void;
}
export declare function matchesComponentSFCInteractionTrigger(trigger: ComponentSFCInteractionTrigger, event: ComponentSFCInteractionTriggerEvent, platform: ComponentSFCInteractionTriggerPlatform): boolean;
export declare function resolveComponentSFCInteractionTriggerPlatform(value: unknown): ComponentSFCInteractionTriggerPlatform;
export declare function normalizeComponentSFCInteractionHeldKeys(value: unknown): ComponentSFCInteractionTriggerHeldKeys | undefined;
export declare function normalizeComponentSFCInteractionKeyboardCondition(value: unknown): ComponentSFCInteractionKeyboardCondition | undefined;
export declare function normalizeComponentSFCInteractionModifiers(value: unknown): ComponentSFCInteractionTriggerModifiers | undefined;
export declare function matchesComponentSFCInteractionHeldKeys(expected: ComponentSFCInteractionTriggerHeldKeys | undefined, actual: ComponentSFCInteractionTriggerEvent['held']): boolean;
export declare function matchesComponentSFCInteractionKeyboardCondition(expected: ComponentSFCInteractionKeyboardCondition | undefined, actual: Pick<ComponentSFCInteractionTriggerEvent, 'held' | 'modifiers'>, platform: ComponentSFCInteractionTriggerPlatform): boolean;
export declare function matchesComponentSFCInteractionModifiers(expected: ComponentSFCInteractionTriggerModifiers | undefined, actual: ComponentSFCInteractionTriggerEvent['modifiers'], platform: ComponentSFCInteractionTriggerPlatform): boolean;
export declare const normalizeComponentSFCEditTriggers: typeof normalizeComponentSFCInteractionTriggers;
export declare const matchesComponentSFCEditTrigger: typeof matchesComponentSFCInteractionTrigger;
export declare const resolveComponentSFCEditTriggerPlatform: typeof resolveComponentSFCInteractionTriggerPlatform;
```

## src/features/core/modules/domain/component/sfc-editing.config.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/component/sfc-editing.config.ts)

```ts
import type { EndgeSFCEditingConfiguration } from '@/features/core/modules/configuration/domain/types/configuration.type';
export declare const DEFAULT_ENDGE_SFC_EDITING_CONFIGURATION: Readonly<EndgeSFCEditingConfiguration>;
```

## src/features/core/modules/domain/component/sfc/component-sfc-source-parts.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/component/sfc/component-sfc-source-parts.ts)

```ts
import type { RComponentSFCSource_Parts } from '@/features/core/modules/domain/types/component/sfc/source.types';
export declare function createEmptySFCSourceParts(): RComponentSFCSource_Parts;
export declare function cloneSFCSourceParts(parts: RComponentSFCSource_Parts): RComponentSFCSource_Parts;
export declare function serializeSFCSourceParts(parts: RComponentSFCSource_Parts): string;
export declare function parseSFCSourceParts(source: string): RComponentSFCSource_Parts;
```

## src/features/core/modules/domain/component/table.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/component/table.ts)

```ts
import type { ColumnSortConfig } from '@/features/core/modules/runtime/domain/table.types';
export declare function normalizeSortType(v: unknown): string;
export declare function normalizeSortBy(v: unknown): string;
export declare function normalizeSortConfig(raw: unknown): ColumnSortConfig | null;
```

## src/features/core/modules/domain/documents/domain-document-descriptors.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/documents/domain-document-descriptors.ts)

```ts
import type { DocumentSerializationContext } from '@/features/core/modules/domain/documents/service-document-serializer';
import type { DocumentDraftOptions } from '@/features/core/modules/domain/types/document/document-draft.type';
import type { DocumentMetadataBacking } from '@/features/core/modules/domain/types/document/document-metadata.types';
import type { DomainDocumentType } from '@/features/core/modules/domain/types/document/document.types';
import type { EndgeDomainCollection } from '@/features/core/modules/domain/types/document/domain-provider.type';
import type { ProgramEntityType } from '@/features/core/modules/program/domain/types/program.types';
import type { RuntimeEntityType } from '@/features/core/modules/runtime/domain/runtime-entity-map.types';
import type { SourceKind } from '@/features/core/modules/source/domain/types/source-engine.types';
import { RAction } from '@/features/core/modules/domain/entities/RAction';
import { RAuthProfile } from '@/features/core/modules/domain/entities/RAuthProfile';
import { RComponentDSL } from '@/features/core/modules/domain/entities/RComponentDSL';
import { RComponentSFC } from '@/features/core/modules/domain/entities/RComponentSFC';
import { RComponentTable } from '@/features/core/modules/domain/entities/RComponentTable';
import { RComposition } from '@/features/core/modules/domain/entities/RComposition';
import { RComputation } from '@/features/core/modules/domain/entities/RComputation';
import { RConfiguration } from '@/features/core/modules/domain/entities/RConfiguration';
import { RConverter } from '@/features/core/modules/domain/entities/RConverter';
import { RDataView } from '@/features/core/modules/domain/entities/RDataView';
import { RFilter } from '@/features/core/modules/domain/entities/RFilter';
import { RI18nBundle } from '@/features/core/modules/domain/entities/RI18nBundle';
import { RIntegration } from '@/features/core/modules/domain/entities/RIntegration';
import { RMock } from '@/features/core/modules/domain/entities/RMock';
import { RNavigation } from '@/features/core/modules/domain/entities/RNavigation';
import { RPage } from '@/features/core/modules/domain/entities/RPage';
import { RPageTemplate } from '@/features/core/modules/domain/entities/RPageTemplate';
import { RPolicy } from '@/features/core/modules/domain/entities/RPolicy';
import { RQuery } from '@/features/core/modules/domain/entities/RQuery';
import { RSimulation } from '@/features/core/modules/domain/entities/RSimulation';
import { RStore } from '@/features/core/modules/domain/entities/RStore';
import { RStream } from '@/features/core/modules/domain/entities/RStream';
import { RStyle } from '@/features/core/modules/domain/entities/RStyle';
import { RType } from '@/features/core/modules/domain/entities/RType';
import { RUpdate } from '@/features/core/modules/domain/entities/RUpdate';
import { RVocabs } from '@/features/core/modules/domain/entities/RVocabs';
import { RWorkspace } from '@/features/core/modules/domain/entities/RWorkspace';
import { ComponentType, DomainSectionType, FilterType, QueryType } from '@/features/core/modules/domain/types/document/document.types';
export type DomainCollectionKey = 'types' | 'queries' | 'dataViews' | 'compositions' | 'stores' | 'streams' | 'simulations' | 'updates' | 'mocks' | 'componentSFCs' | 'actions' | 'filters' | 'converters' | 'computations' | 'styles' | 'configurations' | 'vocabs' | 'authProfiles' | 'i18nBundles' | 'navigations';
export interface DomainDocumentModelMap {
    'primitive': RType;
    'type': RType;
    'action': RAction;
    'converter': RConverter;
    'computation': RComputation;
    'data-view': RDataView;
    'composition': RComposition;
    'store': RStore;
    'stream': RStream;
    'simulation': RSimulation;
    'update': RUpdate;
    'mock': RMock;
    'integration': RIntegration;
    'page-template': RPageTemplate;
    'page': RPage;
    'navigation': RNavigation;
    'policy': RPolicy;
    'style': RStyle;
    'configuration': RConfiguration;
    'vocabs': RVocabs;
    'i18n-bundles': RI18nBundle;
    'auth-profile': RAuthProfile;
    'workspace': RWorkspace;
    [ComponentType.DSL]: RComponentDSL;
    [ComponentType.Table]: RComponentTable;
    [ComponentType.SFC]: RComponentSFC;
    [QueryType.Custom]: RQuery;
    [QueryType.GraphQL]: RQuery;
    [QueryType.REST]: RQuery;
    [FilterType.DefaultFilter]: RFilter;
}
export interface DomainDocumentCapabilityMetadata {
    source: SourceKind | 'component-sfc' | null;
    program: ProgramEntityType | null;
    runtime: RuntimeEntityType | null;
    metadata: DocumentMetadataBacking | null;
}
export interface DomainDocumentPersistenceDescriptor {
    collection: EndgeDomainCollection;
    serialize: (source: unknown, context: DocumentSerializationContext) => Record<string, unknown>;
}
export interface DomainDocumentDescriptor<TType extends DomainDocumentType = DomainDocumentType> {
    type: TType;
    section: DomainSectionType;
    domainCollection: DomainCollectionKey | null;
    materialize: (source: Record<string, unknown>) => DomainDocumentModelMap[TType];
    createNew: ((options: DocumentDraftOptions) => DomainDocumentModelMap[TType]) | null;
    structuralValidationOwner: 'entity';
    persistence: DomainDocumentPersistenceDescriptor | null;
    capabilities: DomainDocumentCapabilityMetadata;
}
type DescriptorMap = {
    [TType in DomainDocumentType]: DomainDocumentDescriptor<TType>;
};
export declare const DOMAIN_DOCUMENT_DESCRIPTORS: DescriptorMap;
export declare function getDomainDocumentDescriptor<TType extends DomainDocumentType>(type: TType): DomainDocumentDescriptor<TType>;
export declare function createNewDomainDocument<TType extends DomainDocumentType>(type: TType, options: DocumentDraftOptions): DomainDocumentModelMap[TType];
export {};
```

## src/features/core/modules/domain/documents/service-document-serializer.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/documents/service-document-serializer.ts)

```ts
import type { DomainDocumentType } from '@/features/core/modules/domain/types/document/document.types';
export interface DocumentSerializationContext {
    resolveFolderIdentity: (value: string | number) => string | null;
}
export declare function serializeServiceDocument(documentType: DomainDocumentType, source: unknown, context: DocumentSerializationContext): Record<string, unknown>;
export declare function serializeServiceFolder(source: unknown, context: Pick<DocumentSerializationContext, 'resolveFolderIdentity'>): Record<string, unknown>;
```

## src/features/core/modules/domain/EndgeDomain_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/EndgeDomain_Module.ts)

```ts
import type { EndgeBootContext } from '@/features/core/kernel/types/bootstrap.types';
import type { RAction } from '@/features/core/modules/domain/entities/RAction';
import type { RAuthProfile } from '@/features/core/modules/domain/entities/RAuthProfile';
import type { RComponentSFC } from '@/features/core/modules/domain/entities/RComponentSFC';
import type { RComposition } from '@/features/core/modules/domain/entities/RComposition';
import type { RComputation } from '@/features/core/modules/domain/entities/RComputation';
import type { RConfiguration } from '@/features/core/modules/domain/entities/RConfiguration';
import type { RConverter } from '@/features/core/modules/domain/entities/RConverter';
import type { RDataView } from '@/features/core/modules/domain/entities/RDataView';
import type { RFacet } from '@/features/core/modules/domain/entities/RFacet';
import type { RFacetDocument } from '@/features/core/modules/domain/entities/RFacetDocument';
import type { RFilter } from '@/features/core/modules/domain/entities/RFilter';
import type { RI18nBundle } from '@/features/core/modules/domain/entities/RI18nBundle';
import type { RIntegration } from '@/features/core/modules/domain/entities/RIntegration';
import type { RMock } from '@/features/core/modules/domain/entities/RMock';
import type { RNavigation } from '@/features/core/modules/domain/entities/RNavigation';
import type { RPage } from '@/features/core/modules/domain/entities/RPage';
import type { RPageTemplate } from '@/features/core/modules/domain/entities/RPageTemplate';
import type { RPolicy } from '@/features/core/modules/domain/entities/RPolicy';
import type { RQuery } from '@/features/core/modules/domain/entities/RQuery';
import type { RSimulation } from '@/features/core/modules/domain/entities/RSimulation';
import type { RStore } from '@/features/core/modules/domain/entities/RStore';
import type { RStream } from '@/features/core/modules/domain/entities/RStream';
import type { RStyle } from '@/features/core/modules/domain/entities/RStyle';
import type { RType } from '@/features/core/modules/domain/entities/RType';
import type { RUpdate } from '@/features/core/modules/domain/entities/RUpdate';
import type { RVersion } from '@/features/core/modules/domain/entities/RVersion';
import type { RVocabs } from '@/features/core/modules/domain/entities/RVocabs';
import type { RComponent } from '@/features/core/modules/domain/types/component/component.types';
import type { EndgeDomainBundle, EndgeDomainPlain } from '@/features/core/modules/domain/types/document/domain-export.type';
import type { EndgeLiveDomainDocument, EndgeLiveDomainSnapshot } from '@/features/core/modules/domain/types/document/domain-snapshot.type';
import { RFolder } from '@/features/core/modules/domain/entities/RFolder';
import { ResolvedEntityIndex } from '@/features/core/modules/domain/resolved/resolved-entity-index';
import { EndgeModule } from '@/features/federation/EndgeModule';
export declare function normalizeSnapshotDocuments(documents: readonly EndgeLiveDomainDocument[], folderIds: ReadonlyMap<string, string>): Record<string, unknown>[];
export declare function normalizeSnapshotFolders(folders: readonly EndgeLiveDomainDocument[], folderIds: ReadonlyMap<string, string>): Record<string, unknown>[];
export interface EndgeDomainParsed {
    facets: RFacet[];
    facetDocuments: RFacetDocument[];
    filters: RFilter[];
    types: RType[];
    queries: RQuery[];
    dataViews: RDataView[];
    compositions: RComposition[];
    stores: RStore[];
    streams: RStream[];
    simulations: RSimulation[];
    updates: RUpdate[];
    mocks: RMock[];
    computations: RComputation[];
    actions: RAction[];
    converters: RConverter[];
    integrations: RIntegration[];
    policies: RPolicy[];
    styles: RStyle[];
    configurations: RConfiguration[];
    vocabs: RVocabs[];
    i18nBundles: RI18nBundle[];
    authProfiles: RAuthProfile[];
    pageTemplates: RPageTemplate[];
    pages: RPage[];
    navigations: RNavigation[];
    components: RComponent[];
    componentSFCs: RComponentSFC[];
    folders: RFolder[];
}
export declare class EndgeDomain_Module extends EndgeModule<EndgeBootContext> {
    readonly resolved: ResolvedEntityIndex;
    constructor();
    load(ctx: EndgeBootContext): Promise<void>;
    build(): void;
    reset(): void;
    merge(json: any): void;
    replaceFromPlain(json: unknown): void;
    replacePersistedEntity(currentEntity: object, nextEntity: object): void;
    mergeFromSnapshot(snapshot: EndgeLiveDomainSnapshot): void;
    mergeFromBundle(bundle: EndgeDomainBundle): void;
    getTypes(): RType[];
    getTypeById(id: string | number): RType | null;
    getTypeByIdentity(identity: string): RType | null;
    getType(idOrIdentity: string | number): RType | null;
    addType(type: RType): void;
    removeTypeById(id: string | number): void;
    removeTypeByIdentity(identity: string): void;
    removeType(identity: string): void;
    hasTypeById(id: string | number): boolean;
    hasTypeByIdentity(identity: string): boolean;
    hasType(identity: string): boolean;
    getQueries(): RQuery[];
    getQueryById(id: number): RQuery | null;
    getQueryByIdentity(identity: string): RQuery | null;
    getQuery(idOrIdentity: string | number): RQuery | null;
    addQuery(query: RQuery): void;
    removeQueryById(id: number): void;
    removeQueryByIdentity(identity: string): void;
    removeQuery(identity: string): void;
    hasQueryById(id: number): boolean;
    hasQueryByIdentity(identity: string): boolean;
    hasQuery(identity: string): boolean;
    getDataViews(): RDataView[];
    getDataViewById(id: string | number): RDataView | null;
    getDataViewByIdentity(identity: string): RDataView | null;
    getDataView(idOrIdentity: string | number): RDataView | null;
    addDataView(dataView: RDataView): void;
    removeDataViewById(id: string | number): void;
    removeDataViewByIdentity(identity: string): void;
    removeDataView(idOrIdentity: string | number): void;
    hasDataView(identity: string): boolean;
    getCompositions(): RComposition[];
    getCompositionById(id: string | number): RComposition | null;
    getCompositionByIdentity(identity: string): RComposition | null;
    getComposition(idOrIdentity: string | number): RComposition | null;
    addComposition(composition: RComposition): void;
    removeCompositionById(id: string | number): void;
    removeCompositionByIdentity(identity: string): void;
    removeComposition(idOrIdentity: string | number): void;
    getStores(): RStore[];
    getStoreById(id: string | number): RStore | null;
    getStoreByIdentity(identity: string): RStore | null;
    getStore(idOrIdentity: string | number): RStore | null;
    addStore(store: RStore): void;
    removeStoreById(id: string | number): void;
    removeStoreByIdentity(identity: string): void;
    removeStore(idOrIdentity: string | number): void;
    getStreams(): RStream[];
    getStreamById(id: string | number): RStream | null;
    getStreamByIdentity(identity: string): RStream | null;
    getStream(idOrIdentity: string | number): RStream | null;
    addStream(stream: RStream): void;
    removeStreamById(id: string | number): void;
    removeStreamByIdentity(identity: string): void;
    removeStream(idOrIdentity: string | number): void;
    getSimulations(): RSimulation[];
    getSimulationById(id: string | number): RSimulation | null;
    getSimulationByIdentity(identity: string): RSimulation | null;
    getSimulation(idOrIdentity: string | number): RSimulation | null;
    addSimulation(simulation: RSimulation): void;
    removeSimulationById(id: string | number): void;
    removeSimulationByIdentity(identity: string): void;
    removeSimulation(idOrIdentity: string | number): void;
    getUpdates(): RUpdate[];
    getUpdatesByStoreIdentity(storeIdentity: string): RUpdate[];
    getUpdateById(id: string | number): RUpdate | null;
    getUpdateByIdentity(identity: string): RUpdate | null;
    getUpdate(idOrIdentity: string | number): RUpdate | null;
    addUpdate(update: RUpdate): void;
    removeUpdateById(id: string | number): void;
    removeUpdateByIdentity(identity: string): void;
    removeUpdate(idOrIdentity: string | number): void;
    getMocks(): RMock[];
    getMockById(id: string | number): RMock | null;
    getMockByIdentity(identity: string): RMock | null;
    getMock(idOrIdentity: string | number): RMock | null;
    addMock(mock: RMock): void;
    removeMockById(id: string | number): void;
    removeMockByIdentity(identity: string): void;
    removeMock(idOrIdentity: string | number): void;
    getComputations(): RComputation[];
    getComputationById(id: string | number): RComputation | null;
    getComputationByIdentity(identity: string): RComputation | null;
    getComputation(idOrIdentity: string | number): RComputation | null;
    addComputation(computation: RComputation): void;
    removeComputationById(id: string | number): void;
    removeComputationByIdentity(identity: string): void;
    removeComputation(idOrIdentity: string | number): void;
    getComponents(): RComponent[];
    getComponentById(id: string | number): RComponent | null;
    getComponentByIdentity(identity: string): RComponent | null;
    getComponent(idOrIdentity: string | number): RComponent | null;
    addComponent(component: RComponent): void;
    removeComponentById(id: string | number): void;
    removeComponentByIdentity(identity: string): void;
    removeComponent(identity: string): void;
    hasComponentById(id: string | number): boolean;
    hasComponentByIdentity(identity: string): boolean;
    hasComponent(identity: string): boolean;
    getComponentSFCs(): RComponentSFC[];
    getComponentSFCById(id: string | number): RComponentSFC | null;
    getComponentSFCByIdentity(identity: string): RComponentSFC | null;
    getComponentSFC(idOrIdentity: string | number): RComponentSFC | null;
    addComponentSFC(component: RComponentSFC): void;
    removeComponentSFCById(id: string | number): void;
    removeComponentSFCByIdentity(identity: string): void;
    removeComponentSFC(idOrIdentity: string | number): void;
    hasComponentSFCById(id: string | number): boolean;
    hasComponentSFCByIdentity(identity: string): boolean;
    hasComponentSFC(identity: string): boolean;
    getActions(): RAction[];
    getActionById(id: string | number): RAction | null;
    getActionByIdentity(identity: string): RAction | null;
    getAction(idOrIdentity: string | number): RAction | null;
    addAction(action: RAction): void;
    removeActionById(id: string | number): void;
    removeActionByIdentity(identity: string): void;
    removeAction(identity: string): void;
    hasActionById(id: string | number): boolean;
    hasActionByIdentity(identity: string): boolean;
    hasAction(identity: string): boolean;
    getConverters(): RConverter[];
    getConverterById(id: string | number): RConverter | null;
    getConverterByIdentity(identity: string): RConverter | null;
    getConverter(idOrIdentity: string | number): RConverter | null;
    addConverter(converter: RConverter): void;
    removeConverterById(id: string | number): void;
    removeConverterByIdentity(identity: string): void;
    removeConverter(identity: string): void;
    hasConverterById(id: string | number): boolean;
    hasConverterByIdentity(identity: string): boolean;
    hasConverter(identity: string): boolean;
    getIntegrations(): RIntegration[];
    getIntegrationById(id: string | number): RIntegration | null;
    getIntegrationByIdentity(identity: string): RIntegration | null;
    getIntegration(idOrIdentity: string | number): RIntegration | null;
    addIntegration(integration: RIntegration): void;
    removeIntegrationById(id: string | number): void;
    removeIntegrationByIdentity(identity: string): void;
    removeIntegration(identity: string): void;
    hasIntegrationById(id: string | number): boolean;
    hasIntegrationByIdentity(identity: string): boolean;
    hasIntegration(identity: string): boolean;
    getPolicies(): RPolicy[];
    getPolicyById(id: string | number): RPolicy | null;
    getPolicyByIdentity(identity: string): RPolicy | null;
    getPolicy(idOrIdentity: string | number): RPolicy | null;
    addPolicy(policy: RPolicy): void;
    removePolicyById(id: string | number): void;
    removePolicyByIdentity(identity: string): void;
    removePolicy(identity: string): void;
    hasPolicyById(id: string | number): boolean;
    hasPolicyByIdentity(identity: string): boolean;
    hasPolicy(identity: string): boolean;
    getStyles(): RStyle[];
    getStyleById(id: string | number): RStyle | null;
    getStyleByIdentity(identity: string): RStyle | null;
    getStyle(idOrIdentity: string | number): RStyle | null;
    addStyle(style: RStyle): void;
    removeStyleById(id: string | number): void;
    removeStyleByIdentity(identity: string): void;
    removeStyle(identity: string): void;
    hasStyleById(id: string | number): boolean;
    hasStyleByIdentity(identity: string): boolean;
    hasStyle(identity: string): boolean;
    getConfigurations(): RConfiguration[];
    getConfigurationById(id: string | number): RConfiguration | null;
    getConfigurationByIdentity(identity: string): RConfiguration | null;
    getConfiguration(idOrIdentity: string | number): RConfiguration | null;
    addConfiguration(configuration: RConfiguration): void;
    removeConfigurationById(id: string | number): void;
    removeConfigurationByIdentity(identity: string): void;
    removeConfiguration(identity: string): void;
    hasConfigurationById(id: string | number): boolean;
    hasConfigurationByIdentity(identity: string): boolean;
    hasConfiguration(identity: string): boolean;
    getVocabs(): RVocabs[];
    getVocabById(id: string | number): RVocabs | null;
    getVocabByIdentity(identity: string): RVocabs | null;
    getVocab(idOrIdentity: string | number): RVocabs | null;
    addVocab(vocab: RVocabs): void;
    addVocabs(vocab: RVocabs): void;
    removeVocabsById(id: string | number): void;
    removeVocabsByIdentity(identity: string): void;
    removeVocabs(identity: string): void;
    removeVocab(identity: string): void;
    hasVocabById(id: string | number): boolean;
    hasVocabByIdentity(identity: string): boolean;
    getAuthProfiles(): RAuthProfile[];
    getAuthProfileById(id: string | number): RAuthProfile | null;
    getAuthProfileByIdentity(identity: string): RAuthProfile | null;
    getAuthProfile(idOrIdentity: string | number): RAuthProfile | null;
    addAuthProfile(profile: RAuthProfile): void;
    removeAuthProfileById(id: string | number): void;
    removeAuthProfileByIdentity(identity: string): void;
    removeAuthProfile(identity: string): void;
    hasVocab(identity: string): boolean;
    getI18nBundles(): RI18nBundle[];
    getI18nBundleById(id: string | number): RI18nBundle | null;
    getI18nBundleByIdentity(identity: string): RI18nBundle | null;
    getI18nBundle(idOrIdentity: string | number): RI18nBundle | null;
    addI18nBundle(bundle: RI18nBundle): void;
    addI18nBundles(bundle: RI18nBundle): void;
    removeI18nBundlesById(id: string | number): void;
    removeI18nBundlesByIdentity(identity: string): void;
    removeI18nBundles(identity: string): void;
    hasI18nBundleById(id: string | number): boolean;
    hasI18nBundleByIdentity(identity: string): boolean;
    getPageTemplates(): RPageTemplate[];
    getPageTemplateById(id: string | number): RPageTemplate | null;
    getPageTemplateByIdentity(identity: string): RPageTemplate | null;
    getPageTemplate(idOrIdentity: string | number): RPageTemplate | null;
    addPageTemplate(tpl: RPageTemplate): void;
    removePageTemplateById(id: string | number): void;
    removePageTemplateByIdentity(identity: string): void;
    removePageTemplate(identity: string): void;
    hasPageTemplateById(id: string | number): boolean;
    hasPageTemplateByIdentity(identity: string): boolean;
    hasPageTemplate(identity: string): boolean;
    getPages(): RPage[];
    getPageById(id: string | number): RPage | null;
    getPageByIdentity(identity: string): RPage | null;
    getPage(idOrIdentity: string | number): RPage | null;
    addPage(page: RPage): void;
    removePageById(id: string | number): void;
    removePageByIdentity(identity: string): void;
    removePage(identity: string): void;
    hasPageById(id: string | number): boolean;
    hasPageByIdentity(identity: string): boolean;
    hasPage(identity: string): boolean;
    getNavigations(): RNavigation[];
    getNavigationById(id: string | number): RNavigation | null;
    getNavigationByIdentity(identity: string): RNavigation | null;
    getNavigation(idOrIdentity: string | number): RNavigation | null;
    addNavigation(nav: RNavigation): void;
    removeNavigationById(id: string | number): void;
    removeNavigationByIdentity(identity: string): void;
    removeNavigation(identity: string): void;
    hasNavigationById(id: string | number): boolean;
    hasNavigationByIdentity(identity: string): boolean;
    hasNavigation(identity: string): boolean;
    getFolders(): RFolder[];
    getFolderById(id: string | number): RFolder | null;
    getFolderByIdentity(identity: string): RFolder | null;
    getFolder(idOrIdentity: string | number): RFolder | null;
    addFolder(folder: RFolder): void;
    removeFolderById(id: string | number): void;
    removeFolderByIdentity(identity: string): void;
    removeFolder(identity: string): void;
    hasFolderById(id: string | number): boolean;
    hasFolderByIdentity(identity: string): boolean;
    hasFolder(identity: string): boolean;
    getFilters(): RFilter[];
    getFilterById(id: string | number): RFilter | null;
    getFilterByIdentity(identity: string): RFilter | null;
    getFilter(idOrIdentity: string | number): RFilter | null;
    addFilter(filter: RFilter): void;
    removeFilterById(id: string | number): void;
    removeFilterByIdentity(identity: string): void;
    removeFilter(identity: string): void;
    hasFilterById(id: string | number): boolean;
    hasFilterByIdentity(identity: string): boolean;
    hasFilter(identity: string): boolean;
    setVersions(list: RVersion[]): void;
    getVersions(): RVersion[];
    getVersionById(id: string | number): RVersion | null;
    getVersionByIdentity(identity: string): RVersion | null;
    getVersion(idOrIdentity: string | number): RVersion | null;
    addVersion(version: RVersion): void;
    removeVersionById(id: string | number): void;
    removeVersionByIdentity(identity: string): void;
    removeVersion(identity: string): void;
    hasVersionById(id: string | number): boolean;
    hasVersionByIdentity(identity: string): boolean;
    hasVersion(identity: string): boolean;
    getFacets(): RFacet[];
    getFacet(idOrIdentity: string | number): RFacet | null;
    addFacet(facet: RFacet): void;
    removeFacet(idOrIdentity: string | number): void;
    getFacetDocuments(facetIdentity: string): RFacetDocument[];
    getFacetDocument(facetIdentity: string, identityOrId: string | number): RFacetDocument | null;
    addFacetDocument(document: RFacetDocument): void;
    removeFacetDocument(facetIdentity: string, identityOrId: string | number): void;
    createDiagnosticsSnapshot(): EndgeDomainPlain;
    toPlain(): EndgeDomainPlain;
    static parsePlain(json: any): EndgeDomainParsed;
    importFromSchema(parsed: EndgeDomainParsed): void;
    static fromPlain(json: any): EndgeDomain_Module;
    materializeSnapshot(snapshot: EndgeDomainPlain): EndgeDomain_Module;
    isPrimitiveName(name: string): boolean;
}
```

## src/features/core/modules/domain/entities/RAction.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RAction.ts)

```ts
import type { ActionImplementation, ActionTargetSelector } from '@/features/core/modules/actions/domain/action.types';
import type { DuplicateOptions } from '@/features/core/modules/domain/entities/REntity';
import type { EntityRef } from '@/features/core/modules/domain/types/document/entity-management.type';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export declare class RAction extends REntity {
    displayName: string;
    description: string | null;
    source: string;
    sourceVersion: number;
    target: ActionTargetSelector[] | null;
    contract: {
        input: unknown | null;
        output: unknown | null;
    };
    defaultImplementation: ActionImplementation;
    owner?: EntityRef;
    static fromPlain(json: any, storageMeta?: any): RAction;
    toPlain(): Record<string, unknown>;
    duplicate(options: DuplicateOptions): RAction;
}
```

## src/features/core/modules/domain/entities/RAuthProfile.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RAuthProfile.ts)

```ts
import type { AuthProfileAdapterId, AuthProfileConfig, AuthProfileCredentials, AuthSessionPolicy } from '@/features/core/modules/auth/domain/types/auth-profile.types';
import type { DuplicateOptions } from '@/features/core/modules/domain/entities/REntity';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export declare class RAuthProfile extends REntity {
    displayName: string;
    description: string | null;
    adapterId: AuthProfileAdapterId;
    config: AuthProfileConfig;
    credentials: AuthProfileCredentials;
    session: AuthSessionPolicy | undefined;
    active: boolean;
    static fromPlain(raw: any): RAuthProfile;
    toPlain(): Record<string, unknown>;
    duplicate(options: DuplicateOptions): RAuthProfile;
}
```

## src/features/core/modules/domain/entities/RComponent.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RComponent.ts)

```ts
import type { DuplicateOptions } from '@/features/core/modules/domain/entities/REntity';
import type { RComponent } from '@/features/core/modules/domain/types/component/component.types';
export declare function ReflectComponentFromPlain(json: Record<string, any>): RComponent | null;
export declare function ReflectComponentToPlain(component: RComponent): Record<string, any> | null;
export declare function duplicateComponent(component: RComponent, options: DuplicateOptions): RComponent;
export declare function ReflectComponentToPayloadData(component: RComponent, componentIdentityToId: Map<string, number>, converterIdentityToId: Map<string, number>): Record<string, any>;
```

## src/features/core/modules/domain/entities/RComponentBase.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RComponentBase.ts)

```ts
import type { ComponentType } from '@/features/core/modules/domain/types/document/document.types';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
import { RField } from '@/features/core/modules/domain/entities/RField';
import { ComponentKind } from '@/features/core/modules/domain/types/component/component.types';
export declare class RComponentBase extends REntity {
    kind: ComponentKind;
    type: ComponentType;
    inputFields: Record<string, RField>;
    setupScript: string;
}
```

## src/features/core/modules/domain/entities/RComponentCore.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RComponentCore.ts)

```ts
import type { DuplicateOptions } from '@/features/core/modules/domain/entities/REntity';
import type { RComponentRenderTarget, RComponentSourceKind } from '@/features/core/modules/domain/types/component/component-core.types';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export declare abstract class RComponentCore extends REntity {
    kind: string;
    sourceKind: RComponentSourceKind;
    modelVersion: number;
    supportedTargets: RComponentRenderTarget[];
    abstract getSource(): string;
    supportsTarget(target: RComponentRenderTarget): boolean;
    protected copyCoreFieldsTo(target: RComponentCore): void;
    duplicate(_options: DuplicateOptions): RComponentCore;
}
```

## src/features/core/modules/domain/entities/RComponentDSL.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RComponentDSL.ts)

```ts
import { RComponentBase } from '@/features/core/modules/domain/entities/RComponentBase';
export declare class RComponentDSL extends RComponentBase {
    jsxScript: string;
}
```

## src/features/core/modules/domain/entities/RComponentSFC.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RComponentSFC.ts)

```ts
import type { DuplicateOptions } from '@/features/core/modules/domain/entities/REntity';
import type { RComponentSFCSource_Parts } from '@/features/core/modules/domain/types/component/sfc/source.types';
import { RComponentCore } from '@/features/core/modules/domain/entities/RComponentCore';
import { ComponentType } from '@/features/core/modules/domain/types/document/document.types';
export declare class RComponentSFC extends RComponentCore {
    kind: string;
    type: ComponentType.SFC;
    source: string;
    tag: string | null;
    constructor();
    getSource(): string;
    setSource(source: string): void;
    setSourceParts(parts: RComponentSFCSource_Parts): void;
    duplicate(options: DuplicateOptions): RComponentSFC;
    toPlain(): Record<string, unknown>;
    static fromPlain(raw: any): RComponentSFC;
}
```

## src/features/core/modules/domain/entities/RComponentTable.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RComponentTable.ts)

```ts
import type { RComponentTableColumn } from '@/features/core/modules/domain/entities/RComponentTableColumn';
import type { TableBinding } from '@/features/core/modules/runtime/domain/table-binding.types';
import { RComponentBase } from '@/features/core/modules/domain/entities/RComponentBase';
export declare class RComponentTable extends RComponentBase {
    columns: RComponentTableColumn[];
    sourceIndex: string;
    bindings: TableBinding;
    rowSize: string | number | 'zoom';
}
```

## src/features/core/modules/domain/entities/RComponentTableColumn.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RComponentTableColumn.ts)

```ts
import type { Constructor } from '@endge/utils';
import type { ColumnComponentType } from '@/features/core/modules/domain/types/component/component.types';
import type { EndgeEventBinding } from '@/features/core/modules/events/domain/events.types';
import type { ColumnSortConfig } from '@/features/core/modules/runtime/domain/table.types';
export declare class ReflectComponentTableColumnBase {
    id: string;
    isActive: boolean;
    title: string;
    type: ColumnComponentType;
    dataPaths: Record<string, string>;
    dataConverters: Record<string, string>;
    width: number;
    pin: 'left' | 'right' | 'none';
    sort: ColumnSortConfig | null;
    reports: Record<string, {
        enabled?: boolean;
        formatter?: {
            type?: string;
            format?: string;
        };
    }> | null;
    eventBindings: EndgeEventBinding[];
    toPlain(): Record<string, any>;
    fromPlain(json: Record<string, any>): void;
}
export declare class ReflectComponentTableColumnHtml extends ReflectComponentTableColumnBase {
    template: string | null;
    toPlain(): Record<string, any>;
    fromPlain(json: Record<string, any>): void;
}
export declare class ReflectComponentTableColumnComponent extends ReflectComponentTableColumnBase {
    componentId: number | null;
    toPlain(): Record<string, any>;
    fromPlain(json: Record<string, any>): void;
}
export type RComponentTableColumn = ReflectComponentTableColumnHtml | ReflectComponentTableColumnComponent;
export declare const ColumnTypeMap: Record<ColumnComponentType, Constructor<RComponentTableColumn>>;
export declare function RComponentTableColumn_TypeCtor(type: ColumnComponentType): Constructor<RComponentTableColumn> | null;
export declare function RComponentTableColumn_isComponent(column: RComponentTableColumn): column is ReflectComponentTableColumnComponent;
export declare function RComponentTableColumn_isHtml(column: RComponentTableColumn): column is ReflectComponentTableColumnHtml;
```

## src/features/core/modules/domain/entities/RComposition.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RComposition.ts)

```ts
import type { DuplicateOptions } from '@/features/core/modules/domain/entities/REntity';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export declare const R_COMPOSITION_KINDS: readonly [
    "library",
    "query",
    "workspace"
];
export type RCompositionKind = typeof R_COMPOSITION_KINDS[number];
export declare function normalizeRCompositionKind(value: unknown): RCompositionKind;
export declare function normalizeRCompositionKindIdentity(value: unknown): string | null;
export declare class RComposition extends REntity {
    readonly type: "composition";
    description: string | null;
    kind: RCompositionKind;
    kindIdentity: string | null;
    source: string;
    sourceVersion: number;
    static fromPlain(input: Record<string, unknown>): RComposition;
    duplicate(options: DuplicateOptions): RComposition;
}
```

## src/features/core/modules/domain/entities/RComputation.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RComputation.ts)

```ts
import type { DiagnosticsProblemInput } from '@/features/core/modules/diagnostics/domain/types/diagnostics.types';
import type { DuplicateOptions } from '@/features/core/modules/domain/entities/REntity';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export declare class RComputation extends REntity {
    displayName: string;
    description: string | null;
    source: string;
    sourceVersion: number;
    contractVersion: number;
    static fromPlain(json: any, storageMeta?: any): RComputation;
    toPlain(): Record<string, unknown>;
    getDiagnosticProblems(): DiagnosticsProblemInput[];
    duplicate(options: DuplicateOptions): RComputation;
}
```

## src/features/core/modules/domain/entities/RConfiguration.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RConfiguration.ts)

```ts
import type { DuplicateOptions } from '@/features/core/modules/domain/entities/REntity';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export declare class RConfiguration extends REntity {
    readonly type: "configuration";
    description: string | null;
    source: string;
    sourceVersion: number;
    static fromPlain(json: any, storageMeta?: any): RConfiguration;
    toPlain(): Record<string, unknown>;
    duplicate(options: DuplicateOptions): RConfiguration;
}
```

## src/features/core/modules/domain/entities/RConverter.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RConverter.ts)

```ts
import type { EntityManagement } from '@/features/core/modules/domain/types/document/entity-management.type';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export interface RConverterSchema extends EntityManagement {
    id: number;
    name: string;
    description?: string | null;
    meta: Record<string, unknown>;
}
export declare class RConverter extends REntity {
    description: string | null;
    customHandler: ((v: any, options?: Record<string, unknown>) => any) | undefined;
    setCustom(fn: ((v: any, options?: Record<string, unknown>) => any) | undefined): void;
    convert(v: any, options?: Record<string, unknown>): any;
    toPlain(): RConverterSchema;
}
```

## src/features/core/modules/domain/entities/RDataView.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RDataView.ts)

```ts
import type { DuplicateOptions } from '@/features/core/modules/domain/entities/REntity';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export declare class RDataView extends REntity {
    source: string;
    sourceVersion: number;
    duplicate(options: DuplicateOptions): RDataView;
}
```

## src/features/core/modules/domain/entities/REntity.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/REntity.ts)

```ts
import type { DiagnosticsProblemInput } from '@/features/core/modules/diagnostics/domain/types/diagnostics.types';
import type { EntityManagement, EntityOrigin, ManagedBy } from '@/features/core/modules/domain/types/document/entity-management.type';
export interface DuplicateOptions {
    identity: string;
    name?: string;
}
export declare function normalizeEntityMeta(value: unknown): Record<string, unknown>;
export declare class REntity<TId extends string | number = number> {
    id: TId;
    identity: string;
    displayName: string;
    name: string;
    description: string | null;
    folderId?: string | number | null;
    workspaceFolderId?: string | number | null;
    managedBy: ManagedBy;
    origin: EntityOrigin;
    managedById: string | null;
    isTemporary: boolean;
    meta: Record<string, unknown>;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    author?: string | null;
    active?: boolean | null;
    applyEntityMeta(raw: unknown): void;
    applyStorageMeta(raw: any): void;
    applyManagement(raw: EntityManagement | Record<string, unknown> | null | undefined): void;
    getDiagnosticProblems(): DiagnosticsProblemInput[];
    compile(): void;
    duplicate(_options: DuplicateOptions): REntity;
}
```

## src/features/core/modules/domain/entities/RFacet.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RFacet.ts)

```ts
import type { EndgeDocumentServerState } from '@/features/core/modules/domain/types/document/domain-snapshot.type';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export declare class RFacet extends REntity<string | number> {
    serverState: EndgeDocumentServerState | null;
    icon: string;
    color: string;
    position: number;
    documentCount: number;
    static fromPlain(input: Record<string, unknown>): RFacet;
    toPlain(): Record<string, unknown>;
}
```

## src/features/core/modules/domain/entities/RFacetDocument.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RFacetDocument.ts)

```ts
import type { EndgeConfigurationContribution } from '@/features/core/modules/configuration/domain/types/configuration.type';
import type { EndgeDocumentServerState } from '@/features/core/modules/domain/types/document/domain-snapshot.type';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export declare class RFacetDocument extends REntity<string | number> {
    serverState: EndgeDocumentServerState | null;
    facetIdentity: string;
    configuration: EndgeConfigurationContribution;
    static fromPlain(input: Record<string, unknown>): RFacetDocument;
    toPlain(): Record<string, unknown>;
}
```

## src/features/core/modules/domain/entities/RField.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RField.ts)

```ts
export declare class RField {
    name: string;
    type: string;
    isArray: boolean;
    optional: boolean;
    params?: Map<string, RField>;
    constructor(name: string, type: string, isArray?: boolean, optional?: boolean, params?: Map<string, RField>);
    isMethod(): boolean;
}
```

## src/features/core/modules/domain/entities/RFilter.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RFilter.ts)

```ts
import type { DomainDocumentType } from '@/features/core/modules/domain/types/document/document.types';
import type { FilterFieldItemSchema, RFilterSchema } from '@/features/core/modules/domain/types/document/filter.types';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export declare class RFilter extends REntity {
    fields: FilterFieldItemSchema[];
    source: string;
    sourceVersion: number;
    get type(): DomainDocumentType;
    static fromPlain(json: RFilterSchema): RFilter;
    toPlain(): RFilterSchema;
}
```

## src/features/core/modules/domain/entities/RFolder.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RFolder.ts)

```ts
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export declare class RFolder extends REntity {
    scope: 'collection' | 'workspace';
    entityType: string | null;
    parent: string | number | null;
    icon: string | null;
    color: string | null;
    static fromPlain(json: any): RFolder;
    toPlain(): any;
    compile(): void;
}
```

## src/features/core/modules/domain/entities/RI18nBundle.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RI18nBundle.ts)

```ts
import type { DiagnosticsProblemInput } from '@/features/core/modules/diagnostics/domain/types/diagnostics.types';
import type { DuplicateOptions } from '@/features/core/modules/domain/entities/REntity';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export type RI18nBundleLocales = Record<string, Record<string, unknown>>;
export declare class RI18nBundle extends REntity {
    description: string | null;
    locales: RI18nBundleLocales;
    active: boolean;
    static fromPlain(json: any): RI18nBundle;
    toPlain(): Record<string, unknown>;
    getDiagnosticProblems(): DiagnosticsProblemInput[];
    duplicate(options: DuplicateOptions): RI18nBundle;
}
```

## src/features/core/modules/domain/entities/RIntegration.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RIntegration.ts)

```ts
import type { DuplicateOptions } from '@/features/core/modules/domain/entities/REntity';
import type { EntityManagement } from '@/features/core/modules/domain/types/document/entity-management.type';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export interface RIntegrationSchema extends EntityManagement {
    id: string | number;
    identity: string;
    name: string;
    description?: string | null;
    meta: Record<string, unknown>;
}
export declare class RIntegration extends REntity {
    description: string | null;
    toPlain(): RIntegrationSchema;
    duplicate(options: DuplicateOptions): RIntegration;
}
```

## src/features/core/modules/domain/entities/RMock.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RMock.ts)

```ts
import type { DiagnosticsProblemInput } from '@/features/core/modules/diagnostics/domain/types/diagnostics.types';
import type { DuplicateOptions } from '@/features/core/modules/domain/entities/REntity';
import type { RMockContentSource, RMockContentType } from '@/features/core/modules/mock/domain/types/mock-data.type';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export declare class RMock extends REntity {
    displayName: string;
    description: string | null;
    contentSource: RMockContentSource;
    contentType: RMockContentType;
    source: string;
    codeRef: string | null;
    static fromPlain(json: any, storageMeta?: any): RMock;
    toPlain(): Record<string, unknown>;
    getDiagnosticProblems(): DiagnosticsProblemInput[];
    duplicate(options: DuplicateOptions): RMock;
}
```

## src/features/core/modules/domain/entities/RNavigation.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RNavigation.ts)

```ts
import type { DuplicateOptions } from '@/features/core/modules/domain/entities/REntity';
import type { DomainDocumentType } from '@/features/core/modules/domain/types/document/document.types';
import type { EntityManagement } from '@/features/core/modules/domain/types/document/entity-management.type';
import type { NavigationTreeNodeDoc } from '@/features/core/modules/domain/types/document/navigation.types';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export interface RNavigationSchema extends EntityManagement {
    id: string | number;
    identity: string;
    name: string;
    displayName?: string;
    description?: string | null;
    folderId?: string | number | null;
    tree?: NavigationTreeNodeDoc[];
    meta?: Record<string, unknown>;
}
export declare class RNavigation extends REntity {
    description: string | null;
    tree: NavigationTreeNodeDoc[];
    get type(): DomainDocumentType;
    toPlain(): RNavigationSchema;
    duplicate(options: DuplicateOptions): RNavigation;
}
```

## src/features/core/modules/domain/entities/RPage.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RPage.ts)

```ts
import type { DuplicateOptions } from '@/features/core/modules/domain/entities/REntity';
import type { DomainDocumentType } from '@/features/core/modules/domain/types/document/document.types';
import type { EntityManagement } from '@/features/core/modules/domain/types/document/entity-management.type';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export interface RPageAreaBlockSchema {
    key: string;
    entityType?: string | null;
    entityId?: number | null;
    entityIdentity?: string | null;
    titleOverride?: string | null;
    visibleWhen?: string | null;
    props?: Record<string, unknown> | null;
}
export interface RPageAreaSchema {
    slotId: string;
    blocks?: RPageAreaBlockSchema[];
}
export interface RPageSchema extends EntityManagement {
    id: number;
    identity: string;
    name: string;
    description?: string | null;
    routeName?: string | null;
    routePath?: string | null;
    templateId?: number | null;
    enabled?: boolean;
    areas?: RPageAreaSchema[];
    meta?: Record<string, unknown>;
}
export declare class RPage extends REntity {
    description: string | null;
    routeName: string | null;
    routePath: string | null;
    templateId: number | null;
    enabled: boolean;
    areas: RPageAreaSchema[];
    get type(): DomainDocumentType;
    toPlain(): RPageSchema;
    duplicate(options: DuplicateOptions): RPage;
}
```

## src/features/core/modules/domain/entities/RPageTemplate.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RPageTemplate.ts)

```ts
import type { DuplicateOptions } from '@/features/core/modules/domain/entities/REntity';
import type { DomainDocumentType } from '@/features/core/modules/domain/types/document/document.types';
import type { EntityManagement } from '@/features/core/modules/domain/types/document/entity-management.type';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export interface RPageTemplateAreaSchema {
    identity: string;
    title?: string | null;
    description?: string | null;
}
export type RPageTemplatePreviewRowHeight = 'short' | 'normal' | 'tall';
export interface RPageTemplatePreviewSchema {
    rows: string[][];
    rowHeights?: RPageTemplatePreviewRowHeight[];
}
export interface RPageTemplateSchema extends EntityManagement {
    id: string | number;
    name: string;
    description?: string | null;
    areas?: RPageTemplateAreaSchema[];
    preview?: RPageTemplatePreviewSchema | null;
    meta?: Record<string, unknown>;
}
export declare class RPageTemplate extends REntity {
    description: string | null;
    areas: RPageTemplateAreaSchema[];
    preview: RPageTemplatePreviewSchema | null;
    get type(): DomainDocumentType;
    toPlain(): RPageTemplateSchema;
    duplicate(options: DuplicateOptions): RPageTemplate;
}
```

## src/features/core/modules/domain/entities/RPolicy.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RPolicy.ts)

```ts
import type { DuplicateOptions } from '@/features/core/modules/domain/entities/REntity';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export declare class RPolicy extends REntity {
    description: string | null;
    toPlain(): Record<string, unknown>;
    duplicate(options: DuplicateOptions): RPolicy;
}
```

## src/features/core/modules/domain/entities/RQuery.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RQuery.ts)

```ts
import { REntity } from '@/features/core/modules/domain/entities/REntity';
import { QueryType } from '@/features/core/modules/domain/types/document/document.types';
export declare class RQuery extends REntity {
    type: QueryType;
    source: string;
    sourceVersion: number;
}
```

## src/features/core/modules/domain/entities/RSimulation.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RSimulation.ts)

```ts
import type { DuplicateOptions } from '@/features/core/modules/domain/entities/REntity';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export declare class RSimulation extends REntity {
    readonly type: "simulation";
    source: string;
    sourceVersion: number;
    duplicate(options: DuplicateOptions): RSimulation;
}
```

## src/features/core/modules/domain/entities/RStore.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RStore.ts)

```ts
import type { DuplicateOptions } from '@/features/core/modules/domain/entities/REntity';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export declare class RStore extends REntity {
    description: string | null;
    source: string;
    sourceVersion: number;
    duplicate(options: DuplicateOptions): RStore;
}
```

## src/features/core/modules/domain/entities/RStream.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RStream.ts)

```ts
import type { DuplicateOptions } from '@/features/core/modules/domain/entities/REntity';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export declare class RStream extends REntity {
    readonly type: "stream";
    source: string;
    sourceVersion: number;
    duplicate(options: DuplicateOptions): RStream;
}
```

## src/features/core/modules/domain/entities/RStyle.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RStyle.ts)

```ts
import type { DuplicateOptions } from '@/features/core/modules/domain/entities/REntity';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export declare const ENDGE_STYLE_DEFAULT_SOURCE = "/* EndgeCSS is renderer-neutral. */\n* {\n  --surface: #ffffff;\n  --text: #111827;\n}\n\n@theme dark {\n  --surface: #111827;\n  --text: #f9fafb;\n}\n";
export declare class RStyle extends REntity {
    readonly type: "style";
    description: string | null;
    source: string;
    sourceVersion: number;
    static fromPlain(json: any, storageMeta?: any): RStyle;
    toPlain(): Record<string, unknown>;
    duplicate(options: DuplicateOptions): RStyle;
}
```

## src/features/core/modules/domain/entities/RType.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RType.ts)

```ts
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export declare class RType extends REntity<string> {
    id: string;
    name: string;
    isPrimitive: boolean;
    source: string;
    sourceVersion: number;
    constructor(name?: string);
}
```

## src/features/core/modules/domain/entities/RUpdate.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RUpdate.ts)

```ts
import type { DuplicateOptions } from '@/features/core/modules/domain/entities/REntity';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export declare class RUpdate extends REntity {
    readonly type: "update";
    storeIdentity: string;
    source: string;
    sourceVersion: number;
    duplicate(options: DuplicateOptions): RUpdate;
}
```

## src/features/core/modules/domain/entities/RVersion.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RVersion.ts)

```ts
export declare class RVersion {
    id: number;
    identity: string;
    description: string;
    data?: any;
    createdAt?: string;
    updatedAt?: string;
    static fromPlain(doc: {
        id: number;
        identity?: string;
        description?: string;
        data?: any;
        createdAt?: string;
        updatedAt?: string;
    }): RVersion;
    toPlain(): {
        id: string | number;
        identity: string;
        description: string;
        data?: any;
    };
}
```

## src/features/core/modules/domain/entities/RVocabs.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RVocabs.ts)

```ts
import type { DiagnosticsProblemInput } from '@/features/core/modules/diagnostics/domain/types/diagnostics.types';
import type { DuplicateOptions } from '@/features/core/modules/domain/entities/REntity';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export type RVocabMode = 'external_payload' | 'internal';
export declare class RVocabs extends REntity {
    sourceVersion: number;
    source: string;
    description: string | null;
    mode: RVocabMode;
    baseApiUrl?: string | null;
    collectionSlug?: string | null;
    active: boolean;
    authMode: 'inherit' | 'profile' | 'none';
    authProfileIdentity?: string | null;
    static fromPlain(json: any): RVocabs;
    toPlain(): Record<string, unknown>;
    getDiagnosticProblems(): DiagnosticsProblemInput[];
    duplicate(options: DuplicateOptions): RVocabs;
}
export declare function createLegacyVocabSource(input: {
    mode: RVocabMode;
    baseApiUrl?: string | null;
    collectionSlug?: string | null;
    authMode?: 'inherit' | 'profile' | 'none';
    authProfileIdentity?: string | null;
}): string;
```

## src/features/core/modules/domain/entities/RWorkspace.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/entities/RWorkspace.ts)

```ts
import type { EndgeConfiguration } from '@/features/core/modules/configuration/domain/types/configuration.type';
import type { EndgeDataMode, EndgeWorkspaceDefinition, EndgeWorkspaceDocumentStructure, WorkspaceIntegrationReference } from '@/features/core/modules/workspace/domain/workspace.types';
import { REntity } from '@/features/core/modules/domain/entities/REntity';
export declare class RWorkspace extends REntity implements EndgeWorkspaceDefinition {
    displayName: string;
    dataMode: EndgeDataMode;
    documentStructure: EndgeWorkspaceDocumentStructure;
    startupCompositionIdentity: string | null;
    configuration: EndgeConfiguration;
    installedIntegrations: WorkspaceIntegrationReference[];
    static fromPlain(input: unknown): RWorkspace;
    toPlain(): EndgeWorkspaceDefinition;
}
export declare function normalizeEndgeWorkspaceDefinition(input: unknown): EndgeWorkspaceDefinition;
```

## src/features/core/modules/domain/resolved/resolved-entity-index.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/resolved/resolved-entity-index.ts)

```ts
import type { REntity } from '@/features/core/modules/domain/entities/REntity';
export declare class ResolvedEntityIndex {
    set<TEntity extends REntity>(type: string, entity: TEntity): void;
    get<TEntity extends REntity>(type: string, identity: string): TEntity | null;
    list<TEntity extends REntity>(type: string): TEntity[];
    delete(type: string, identity: string): void;
    clearDerived(type?: string): void;
    clear(): void;
}
```

## src/features/core/modules/domain/types/component/component-core.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/component/component-core.types.ts)

```ts
export type RComponentRenderTarget = 'dom' | 'canvas';
export type RComponentSourceKind = 'component-sfc';
export type RComponentDiagnosticSeverity = 'info' | 'warning' | 'error';
export interface RComponentRef {
    source: 'component-sfc';
    id: string | number;
    role?: 'child-component' | 'port-default-component' | 'port-override-component';
}
export interface RComputationRef {
    source: 'computation';
    id: string | number;
    role: 'port-default-computation' | 'port-override-computation';
}
export interface RComponentDiagnostic {
    severity: RComponentDiagnosticSeverity;
    code: string;
    message: string;
    sourcePath?: string;
    start?: number;
    end?: number;
}
export interface RComponentContractInput {
    name: string;
    type: string;
    isArray?: boolean;
    optional?: boolean;
}
export interface RComponentContractEvent {
    name: string;
    payloadType?: string;
}
export interface RComponentContractSlot {
    name: string;
    scope?: string[];
}
export interface RComponentContract {
    inputs: RComponentContractInput[];
    events: RComponentContractEvent[];
    slots: RComponentContractSlot[];
}
export interface RComponentDependencies {
    components: RComponentRef[];
    computations: RComputationRef[];
    actions: string[];
    queries: string[];
    dataSources: string[];
    renderers: string[];
}
export declare function createEmptyComponentContract(): RComponentContract;
export declare function createEmptyComponentDependencies(): RComponentDependencies;
```

## src/features/core/modules/domain/types/component/component.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/component/component.types.ts)

```ts
import type { RComponentDSL } from '@/features/core/modules/domain/entities/RComponentDSL';
import type { RComponentSFC } from '@/features/core/modules/domain/entities/RComponentSFC';
import type { RComponentTable } from '@/features/core/modules/domain/entities/RComponentTable';
import type { ComponentType } from '@/features/core/modules/domain/types/document/document.types';
export declare enum ComponentKind {
    JSX = "jsx",
    Vue = "vue"
}
export type RComponent = RComponentDSL | RComponentTable;
export type RAnyComponent = RComponent | RComponentSFC;
export type ColumnComponentType = ComponentType.Html | ComponentType.Component;
```

## src/features/core/modules/domain/types/component/sfc/ast.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/component/sfc/ast.types.ts)

```ts
import type { File } from '@babel/types';
import type { RComponentSFC_SourceRange } from './location.types';
export interface RComponentSFC_AST {
    version: 1;
    script: RComponentSFC_AST_Script | null;
    template: RComponentSFC_AST_Template | null;
    style: RComponentSFC_AST_Style | null;
}
export interface RComponentSFC_AST_Script {
    syntax?: File | null;
    lang: string | null;
    setup: boolean;
    content: string;
    props: RComponentSFC_AST_PropsDeclaration | null;
    previewProps: RComponentSFC_AST_PreviewPropsDeclaration | null;
    metadata: RComponentSFC_AST_MetadataDeclaration[];
    bindings: RComponentSFC_AST_ScriptBinding[];
    range: RComponentSFC_SourceRange;
}
export interface RComponentSFC_AST_PropsDeclaration {
    source: string;
    mode: 'type' | 'runtime';
    range: RComponentSFC_SourceRange;
}
export interface RComponentSFC_AST_PreviewPropsDeclaration {
    source: string;
    optionsSource?: string | null;
    range: RComponentSFC_SourceRange;
}
export interface RComponentSFC_AST_MetadataDeclaration {
    source: string;
    range: RComponentSFC_SourceRange;
}
export interface RComponentSFC_AST_ScriptBinding {
    name: string;
    kind: 'prop' | 'const' | 'let' | 'function' | 'import' | 'store' | 'unknown';
    range: RComponentSFC_SourceRange;
}
export interface RComponentSFC_AST_Template {
    roots: RComponentSFC_AST_TemplateNode[];
    range: RComponentSFC_SourceRange;
}
export type RComponentSFC_AST_TemplateNode = {
    kind: 'comment';
    content: string;
    range: RComponentSFC_SourceRange;
} | RComponentSFC_AST_ElementNode | RComponentSFC_AST_TextNode | RComponentSFC_AST_InterpolationNode;
export interface RComponentSFC_AST_ElementNode {
    kind: 'element';
    tag: string;
    attributes: RComponentSFC_AST_Attribute[];
    directives: RComponentSFC_AST_Directive[];
    children: RComponentSFC_AST_TemplateNode[];
    selfClosing: boolean;
    range: RComponentSFC_SourceRange;
}
export interface RComponentSFC_AST_TextNode {
    kind: 'text';
    content: string;
    range: RComponentSFC_SourceRange;
}
export interface RComponentSFC_AST_InterpolationNode {
    kind: 'interpolation';
    expression: string;
    range: RComponentSFC_SourceRange;
}
export interface RComponentSFC_AST_Attribute {
    name: string;
    value: string | null;
    dynamic: boolean;
    modifiers: string[];
    range: RComponentSFC_SourceRange;
}
export interface RComponentSFC_AST_Directive {
    name: string;
    argument?: string;
    expression?: string;
    modifiers: string[];
    range: RComponentSFC_SourceRange;
}
export interface RComponentSFC_AST_Style {
    lang: string | null;
    scoped: boolean;
    content: string;
    range: RComponentSFC_SourceRange;
}
```

## src/features/core/modules/domain/types/component/sfc/dependencies.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/component/sfc/dependencies.types.ts)

```ts
import type { RComponentSFC_IR_DataMetaReference, RComponentSFC_IR_Read } from './ir.types';
export type RComponentSFC_RuntimeDependencySource = 'props' | 'context';
export interface RComponentSFC_RuntimeDependency {
    source: 'props';
    prop: string;
    path: string[];
    raw: string;
    read: RComponentSFC_IR_Read;
}
export interface RComponentSFC_RuntimeContextDependency {
    source: 'context';
    path: string[];
    raw: string;
    read: RComponentSFC_IR_Read;
}
export type RComponentSFC_RuntimeBoundaryKind = 'table';
export interface RComponentSFC_RuntimeTableColumnDependency {
    id: string;
    key: string;
    index: number;
    rowReads: string[];
}
export interface RComponentSFC_RuntimeBoundaryDependency {
    id: string;
    kind: RComponentSFC_RuntimeBoundaryKind;
    sourceProp: string;
    sourcePath: string[];
    rowKey: string | null;
    contextReads: string[][];
    columns: RComponentSFC_RuntimeTableColumnDependency[];
}
export interface RComponentSFC_RuntimeVocabDependency {
    alias: string;
    valuePath: string;
    labelPath: string;
    raw: string;
}
export interface RComponentSFC_RuntimeMetaDependency {
    reference: RComponentSFC_IR_DataMetaReference;
    boundaryId: string | null;
    namespace: string | null;
    raw: string;
}
export interface RComponentSFC_RuntimeDependencies {
    props: RComponentSFC_RuntimeDependency[];
    context: RComponentSFC_RuntimeContextDependency[];
    boundaries: RComponentSFC_RuntimeBoundaryDependency[];
    vocabs?: RComponentSFC_RuntimeVocabDependency[];
    meta?: RComponentSFC_RuntimeMetaDependency[];
}
export declare function createEmptyComponentSFCRuntimeDependencies(): RComponentSFC_RuntimeDependencies;
```

## src/features/core/modules/domain/types/component/sfc/expression-ir.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/component/sfc/expression-ir.types.ts)

```ts
export type ComponentSFCExpressionIR = {
    kind: 'literal';
    value: string | number | boolean | null;
} | {
    kind: 'read';
    name: string;
} | {
    kind: 'unary';
    operator: string;
    argument: ComponentSFCExpressionIR;
} | {
    kind: 'binary' | 'logical';
    operator: string;
    left: ComponentSFCExpressionIR;
    right: ComponentSFCExpressionIR;
} | {
    kind: 'conditional';
    test: ComponentSFCExpressionIR;
    consequent: ComponentSFCExpressionIR;
    alternate: ComponentSFCExpressionIR;
} | {
    kind: 'member';
    object: ComponentSFCExpressionIR;
    property: ComponentSFCExpressionIR;
    computed: boolean;
} | {
    kind: 'select';
    object: ComponentSFCExpressionIR;
    key: string;
    value: ComponentSFCExpressionIR;
} | {
    kind: 'call';
    callee: ComponentSFCExpressionIR;
    arguments: ComponentSFCExpressionIR[];
} | {
    kind: 'array';
    items: ComponentSFCExpressionIR[];
} | {
    kind: 'object';
    entries: Array<{
        key: string;
        value: ComponentSFCExpressionIR;
    }>;
} | {
    kind: 'template';
    parts: string[];
    expressions: ComponentSFCExpressionIR[];
} | {
    kind: 'unsupported';
    reason?: 'object-property';
};
```

## src/features/core/modules/domain/types/component/sfc/intrinsic-events.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/component/sfc/intrinsic-events.types.ts)

```ts
import type { RComponentSFC_IR_Tag } from './ir.types';
export interface ComponentSFCEventModifiersState {
    alt: boolean;
    altGraph: boolean;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
}
export interface ComponentSFCInteractionEventPayload {
    type: string;
    occurredAt: string;
    modifiers: ComponentSFCEventModifiersState;
    held: {
        key: string[];
        code: string[];
    };
}
export interface ComponentSFCPointerEventPayload extends ComponentSFCInteractionEventPayload {
    x: number;
    y: number;
    button: number;
    buttons: number;
    pointerType: 'mouse' | 'touch' | 'pen' | 'unknown';
}
export interface ComponentSFCKeyboardEventPayload extends ComponentSFCInteractionEventPayload {
    key: string;
    code: string;
    repeat: boolean;
    composing: boolean;
}
export interface ComponentSFCInputEventPayload extends ComponentSFCInteractionEventPayload {
    value: unknown;
    checked?: boolean;
}
export interface ComponentSFCIntrinsicEventDefinition {
    name: string;
    displayName: string;
    payloadType: string;
    description: string;
}
export declare const COMPONENT_SFC_INTERACTION_EVENT_DEFINITIONS: readonly ComponentSFCIntrinsicEventDefinition[];
export declare const COMPONENT_SFC_FORM_EVENT_DEFINITIONS: readonly [
    ComponentSFCIntrinsicEventDefinition,
    ComponentSFCIntrinsicEventDefinition
];
export declare function listComponentSFCEventCapableTags(): readonly RComponentSFC_IR_Tag[];
export declare function getComponentSFCIntrinsicEventDefinitions(tag: RComponentSFC_IR_Tag): readonly ComponentSFCIntrinsicEventDefinition[];
```

## src/features/core/modules/domain/types/component/sfc/ir.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/component/sfc/ir.types.ts)

```ts
import type { RComponentDiagnostic } from '../component-core.types';
import type { ComponentSFCExpressionIR } from './expression-ir.types';
import type { RComponentSFC_SourceRange } from './location.types';
import type { ComponentSFCEventAction, ComponentSFCPortForwardOrigin, ComponentSFCPortManifest, ComponentSFCRequiredPortBinding, RComponentSFC_IR_ComponentPortMarker, RComponentSFC_IR_PortCall } from './ports.types';
import type { EndgeStyleSheetArtifact } from '@/features/core/modules/styles/domain/types/style.types';
export interface RComponentSFC_IR {
    version: 2;
    script: RComponentSFC_IR_Script;
    template: RComponentSFC_IR_Template;
    style: RComponentSFC_IR_Style | null;
}
export interface RComponentSFC_IR_Script {
    props: RComponentSFC_IR_Prop[];
    locals: RComponentSFC_IR_LocalBinding[];
    ports: ComponentSFCPortManifest;
    portCalls: RComponentSFC_IR_PortCall[];
}
export interface RComponentSFC_IR_Prop {
    name: string;
    type: string;
    isArray?: boolean;
    optional?: boolean;
    sourceRange?: RComponentSFC_SourceRange;
}
export interface RComponentSFC_IR_LocalBinding {
    name: string;
    type?: string;
    sourceRange?: RComponentSFC_SourceRange;
}
export interface RComponentSFC_IR_Template {
    roots: RComponentSFC_IR_Node[];
    variants?: ComponentSFCVariant[];
}
export interface ComponentSFCVariant {
    name: string;
    nodeId: string;
}
export interface ComponentSFCInteractionTriggerModifiers {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
    mod?: boolean;
    altGraph?: boolean;
    exact?: boolean;
}
export interface ComponentSFCInteractionTriggerHeldKeys {
    key?: string[];
    code?: string[];
    match?: 'all' | 'any';
    exact?: boolean;
}
export interface ComponentSFCInteractionKeyboardCondition {
    modifiers?: ComponentSFCInteractionTriggerModifiers;
    held?: ComponentSFCInteractionTriggerHeldKeys;
}
export interface ComponentSFCInteractionTrigger extends ComponentSFCInteractionKeyboardCondition {
    event: string;
    key?: string[];
    code?: string[];
    repeat?: boolean;
    composing?: boolean;
    button?: number;
    stop?: boolean;
    prevent?: boolean;
    self?: boolean;
    once?: boolean;
    capture?: boolean;
    passive?: boolean;
}
export type ComponentSFCInteractionTriggerSet = ComponentSFCInteractionTrigger[];
export interface ComponentSFCInteractionTriggerSequenceStep {
    triggerSet: ComponentSFCInteractionTriggerSet;
    maxIntervalMs?: number;
}
export interface ComponentSFCInteractionTriggerSequence {
    mode: 'sequence';
    steps: ComponentSFCInteractionTriggerSequenceStep[];
}
export type ComponentSFCInteractionTriggerActivation = ComponentSFCInteractionTriggerSet | ComponentSFCInteractionTriggerSequence;
export type ComponentSFCInteractionTriggerPlatform = 'macos' | 'windows' | 'linux' | 'unknown';
export interface ComponentSFCInteractionTriggerEvent {
    key?: string;
    code?: string;
    repeat?: boolean;
    composing?: boolean;
    button?: number;
    targetIsCurrentTarget: boolean;
    held?: {
        key: string[];
        code: string[];
    };
    modifiers: {
        ctrl: boolean;
        shift: boolean;
        alt: boolean;
        meta: boolean;
        altGraph: boolean;
    };
}
export type ComponentSFCEditTriggerModifiers = ComponentSFCInteractionTriggerModifiers;
export type ComponentSFCEditTriggerHeldKeys = ComponentSFCInteractionTriggerHeldKeys;
export type ComponentSFCEditTrigger = ComponentSFCInteractionTrigger;
export type ComponentSFCEditTriggerPlatform = ComponentSFCInteractionTriggerPlatform;
export type ComponentSFCEditTriggerEvent = ComponentSFCInteractionTriggerEvent;
export interface ComponentSFCEditableBehavior {
    value: RComponentSFC_IR_Value;
    triggers: RComponentSFC_IR_Value;
    cancelTriggers: RComponentSFC_IR_Value;
    commitTriggers: RComponentSFC_IR_Value;
    modifiers?: RComponentSFC_IR_EventModifier[];
    cancelModifiers?: RComponentSFC_IR_EventModifier[];
    commitModifiers?: RComponentSFC_IR_EventModifier[];
}
export interface ComponentSFCEditedEventPayload<T = unknown> {
    value: T;
    previousValue: T;
}
export type RComponentSFC_IR_Node = RComponentSFC_IR_ElementNode | RComponentSFC_IR_TextNode | RComponentSFC_IR_ExpressionNode;
export type RComponentSFC_IR_Tag = 'Text' | 'DateTime' | 'Number' | 'Icon' | 'Badge' | 'Dot' | 'Box' | 'Flex' | 'Grid' | 'Divider' | 'Input' | 'Textarea' | 'Checkbox' | 'Select' | 'Tooltip' | 'TooltipTrigger' | 'TooltipContent' | 'Component' | 'Table' | 'Column' | 'Cell' | 'ColumnMenu' | 'CellMenu' | 'RowMenu' | 'MenuItem' | 'MenuSeparator' | 'Editable' | 'Variant';
export interface RComponentSFC_IR_ElementNode {
    id: string;
    kind: 'element';
    tag: RComponentSFC_IR_Tag;
    componentTag?: string;
    props: Record<string, RComponentSFC_IR_Value>;
    directives: RComponentSFC_IR_Directives;
    events?: RComponentSFC_IR_EventBinding[];
    interactions?: RComponentSFC_IR_InteractionGroup[];
    editable?: ComponentSFCEditableBehavior;
    children: RComponentSFC_IR_Node[];
    port?: RComponentSFC_IR_ComponentPortMarker;
    portBindings?: ComponentSFCRequiredPortBinding[];
    tableMenus?: RComponentSFC_IR_TableMenus;
    cellMenu?: ComponentSFCTableCellMenuDescriptor;
    sourceRange?: RComponentSFC_SourceRange;
}
export interface RComponentSFC_IR_TableMenus {
    column: ComponentSFCTableColumnMenuDescriptor;
    row: ComponentSFCTableCellMenuDescriptor;
}
export type ComponentSFCTableColumnMenuMode = 'default' | 'disabled' | 'inline';
export type ComponentSFCTableRowMenuMode = 'none' | 'inline';
export type ComponentSFCTableCellMenuMode = 'none' | 'inline';
export interface ComponentSFCTableMenuDescriptor {
    kind: 'sfc-table-menu';
    items: ComponentSFCTableMenuNodeDescriptor[];
}
export type ComponentSFCTableMenuNodeDescriptor = ComponentSFCTableMenuItemDescriptor | ComponentSFCTableMenuSeparatorDescriptor;
export interface ComponentSFCTableMenuItemDescriptor {
    kind: 'item';
    id: string;
    label: RComponentSFC_IR_Value;
    visible?: RComponentSFC_IR_Value;
    disabled?: RComponentSFC_IR_Value;
    action: string;
    requiredPort?: string;
    input?: RComponentSFC_IR_Value;
    icon?: string;
    forwardedFrom?: ComponentSFCPortForwardOrigin;
}
export interface ComponentSFCTableMenuSeparatorDescriptor {
    kind: 'separator';
    id: string;
}
export interface ComponentSFCTableColumnMenuDescriptor {
    mode: ComponentSFCTableColumnMenuMode;
    menu: ComponentSFCTableMenuDescriptor | null;
    diagnostics: RComponentDiagnostic[];
}
export interface ComponentSFCTableRowMenuDescriptor {
    mode: ComponentSFCTableRowMenuMode;
    menu: ComponentSFCTableMenuDescriptor | null;
    diagnostics: RComponentDiagnostic[];
}
export type ComponentSFCTableCellMenuDescriptor = ComponentSFCTableRowMenuDescriptor;
export type RComponentSFC_IR_EventModifier = 'stop' | 'prevent' | 'self' | 'once' | 'capture' | 'passive';
export interface RComponentSFC_IR_EventBinding {
    name: string;
    modifiers: RComponentSFC_IR_EventModifier[];
    action: ComponentSFCEventAction;
    actions?: ComponentSFCEventAction[];
    sourceRange?: RComponentSFC_SourceRange;
}
export interface RComponentSFC_IR_InteractionRule {
    event: string;
    trigger: RComponentSFC_IR_Value;
    modifiers: RComponentSFC_IR_EventModifier[];
    listener: {
        capture: boolean;
        passive: boolean;
    };
    reactions: ComponentSFCEventAction[];
    sourceRange?: RComponentSFC_SourceRange;
}
export interface RComponentSFC_IR_InteractionTriggerSet {
    triggers: RComponentSFC_IR_Value;
    events: string[];
    modifiers: RComponentSFC_IR_EventModifier[];
    reactions: ComponentSFCEventAction[];
    sourceRange?: RComponentSFC_SourceRange;
}
export interface RComponentSFC_IR_InteractionGroup {
    rules: RComponentSFC_IR_InteractionRule[];
    triggerSet?: RComponentSFC_IR_InteractionTriggerSet;
    sourceRange?: RComponentSFC_SourceRange;
}
export interface RComponentSFC_IR_TextNode {
    id: string;
    kind: 'text';
    value: string;
    sourceRange?: RComponentSFC_SourceRange;
}
export interface RComponentSFC_IR_ExpressionNode {
    id: string;
    kind: 'expression';
    value: RComponentSFC_IR_Value;
    sourceRange?: RComponentSFC_SourceRange;
}
export type RComponentSFC_IR_Value = RComponentSFC_IR_LiteralValue | RComponentSFC_IR_ExpressionValue;
export interface RComponentSFC_IR_LiteralValue {
    kind: 'literal';
    value: unknown;
}
export interface RComponentSFC_IR_ExpressionValue {
    expression: ComponentSFCExpressionIR;
    kind: 'expression';
    source: string;
    reads: RComponentSFC_IR_Read[];
    vocabReads?: RComponentSFC_IR_VocabRead[];
    dataMetaReads?: RComponentSFC_IR_DataMetaRead[];
}
export type RComponentSFC_IR_DataMetaReference = {
    kind: 'prop';
    prop: string;
    path: string[];
} | {
    kind: 'table-row';
    path: string[];
};
export interface RComponentSFC_IR_DataMetaRead {
    reference: RComponentSFC_IR_DataMetaReference;
    namespace: string | null;
    raw: string;
}
export interface RComponentSFC_IR_VocabRead {
    alias: string;
    valuePath: string;
    labelPath: string;
    raw: string;
}
export interface RComponentSFC_IR_Read {
    source: 'props' | 'raph' | 'context' | 'local';
    path: string[];
    raw: string;
}
export interface RComponentSFC_IR_Directives {
    if?: RComponentSFC_IR_Value;
    elseIf?: RComponentSFC_IR_Value;
    else?: boolean;
    for?: RComponentSFC_IR_ForDirective;
    key?: RComponentSFC_IR_Value;
}
export interface RComponentSFC_IR_ForDirective {
    item: string;
    index?: string;
    source: RComponentSFC_IR_Value;
}
export type RComponentSFC_IR_Style = EndgeStyleSheetArtifact;
```

## src/features/core/modules/domain/types/component/sfc/location.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/component/sfc/location.types.ts)

```ts
export interface RComponentSFC_SourceRange {
    start: number;
    end: number;
    startLine?: number;
    startColumn?: number;
    endLine?: number;
    endColumn?: number;
}
```

## src/features/core/modules/domain/types/component/sfc/metadata-visual.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/component/sfc/metadata-visual.types.ts)

```ts
import type { RComponentSFC_SourceRange } from './location.types';
import type { RComponentDiagnostic } from '@/features/core/modules/domain/types/component/component-core.types';
import type { ProgramMetadataMap } from '@/features/core/modules/program/domain/types/program-metadata.types';
export interface ComponentSFCMetadataVisualProjection {
    mode: 'missing' | 'static' | 'invalid' | 'duplicate';
    editable: boolean;
    metadata: ProgramMetadataMap;
    json: string;
    sourceRange: RComponentSFC_SourceRange | null;
    message?: string;
}
export interface ComponentSFCMetadataSourcePatchResult {
    ok: boolean;
    source: string;
    changed: boolean;
    projection: ComponentSFCMetadataVisualProjection;
    diagnostics: RComponentDiagnostic[];
    message?: string;
}
```

## src/features/core/modules/domain/types/component/sfc/ports-source.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/component/sfc/ports-source.types.ts)

```ts
import type { RComponentSFC_SourceRange } from './location.types';
import type { ComponentSFCEventSource, ComponentSFCPortManifest, ComponentSFCPortRole } from './ports.types';
import type { RComponentDiagnostic } from '@/features/core/modules/domain/types/component/component-core.types';
export interface ComponentSFCPortsSourceProjection {
    editable: boolean;
    message?: string;
    bindingName: string | null;
    manifest: ComponentSFCPortManifest;
    sourceRange?: RComponentSFC_SourceRange;
    diagnostics: RComponentDiagnostic[];
}
export type ComponentSFCPortsSourcePatch = {
    type: 'upsert-port';
    role: ComponentSFCPortRole;
    name: string;
    declaration: string;
} | {
    type: 'remove-port';
    role: ComponentSFCPortRole;
    name: string;
} | {
    type: 'set-event';
    name: string;
    payloadType: string;
    from?: ComponentSFCEventSource | null;
    actionSource?: string | null;
} | {
    type: 'remove-event-action';
    name: string;
} | {
    type: 'set-forward';
    declaration: string | null;
};
export interface ComponentSFCPortsSourcePatchResult {
    ok: boolean;
    changed: boolean;
    source: string;
    projection: ComponentSFCPortsSourceProjection;
    message?: string;
}
```

## src/features/core/modules/domain/types/component/sfc/ports.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/component/sfc/ports.types.ts)

```ts
import type { RComponentSFC_IR_Value } from './ir.types';
import type { RComponentSFC_SourceRange } from './location.types';
import type { RComponentContractInput } from '@/features/core/modules/domain/types/component/component-core.types';
export type ComponentSFCPortRole = 'require' | 'provides' | 'emits';
export type ComponentSFCPortKind = 'computation' | 'component' | 'action' | 'query' | 'event';
export type ComponentSFCRequiredPortKind = Exclude<ComponentSFCPortKind, 'event'>;
export interface ComponentSFCPortForwardOrigin {
    nodeId: string;
    ref?: string;
    componentIdentity?: string;
    componentTag: string;
    portName: string;
}
export interface ComponentSFCPortForwardSelector {
    include: '*' | string[];
    exclude: string[];
    rename: Record<string, string>;
    namespace?: 'none' | 'ref' | string;
}
export interface ComponentSFCPortForwardRule {
    from: '*' | string[];
    ports: Partial<Record<ComponentSFCPortRole, ComponentSFCPortForwardSelector>>;
    namespace: 'none' | 'ref' | string;
    sourceRange?: RComponentSFC_SourceRange;
}
export type ComponentSFCPortProviderDescriptor = {
    kind: 'computation';
    identity: string;
    active: boolean;
    input: {
        type: string;
        isArray?: boolean;
        optional?: boolean;
    } | null;
    output: {
        type: string;
        isArray?: boolean;
        optional?: boolean;
    } | null;
} | {
    kind: 'component';
    identity: string;
    active: boolean;
    inputs: RComponentContractInput[];
} | {
    kind: 'action';
    identity: string;
    active: boolean;
    input: {
        type: string;
        isArray?: boolean;
        optional?: boolean;
    } | null;
    output: {
        type: string;
        isArray?: boolean;
        optional?: boolean;
    } | null;
} | {
    kind: 'query';
    identity: string;
    active: boolean;
    inputs: RComponentContractInput[];
    outputs: RComponentContractInput[];
};
export interface ComponentSFCComputationPort {
    kind: 'computation';
    name: string;
    defaultIdentity: string;
    inputType: string;
    outputType: string;
    forwardedFrom?: ComponentSFCPortForwardOrigin;
    sourceRange?: RComponentSFC_SourceRange;
}
export interface ComponentSFCComponentPort {
    kind: 'component';
    name: string;
    tag: string;
    defaultIdentity: string;
    propsType: string;
    inputs: RComponentContractInput[];
    forwardedFrom?: ComponentSFCPortForwardOrigin;
    sourceRange?: RComponentSFC_SourceRange;
}
export interface ComponentSFCActionPort {
    kind: 'action';
    role: 'require' | 'provides';
    name: string;
    inputType: string;
    outputType: string;
    defaultIdentity?: string;
    forwardedFrom?: ComponentSFCPortForwardOrigin;
    sourceRange?: RComponentSFC_SourceRange;
}
export interface ComponentSFCQueryPort {
    kind: 'query';
    name: string;
    defaultIdentity: string;
    inputType: string;
    outputType: string;
    inputs: RComponentContractInput[];
    outputs: RComponentContractInput[];
    forwardedFrom?: ComponentSFCPortForwardOrigin;
    sourceRange?: RComponentSFC_SourceRange;
}
export interface ComponentSFCRequiredPortBinding {
    port: string;
    kind: ComponentSFCRequiredPortKind;
    identity: string;
    sourceRange?: RComponentSFC_SourceRange;
}
export interface ComponentSFCEventPort {
    kind: 'event';
    role: 'emits';
    name: string;
    displayName?: string;
    payloadType: string;
    from?: ComponentSFCEventSource;
    action?: ComponentSFCEventAction;
    forwardedFrom?: ComponentSFCPortForwardOrigin;
    sourceRange?: RComponentSFC_SourceRange;
}
export interface ComponentSFCEventSource {
    ref: string;
    event: string;
}
export type ComponentSFCEventInputValue = {
    kind: 'event';
    path: string | null;
} | {
    kind: 'operation-input';
    path: string | null;
} | {
    kind: 'now';
} | {
    kind: 'scope';
    path: string;
} | {
    kind: 'literal';
    value: unknown;
} | {
    kind: 'coalesce';
    left: ComponentSFCEventInputValue;
    right: ComponentSFCEventInputValue;
} | {
    kind: 'array';
    items: ComponentSFCEventInputValue[];
} | {
    kind: 'object';
    entries: ComponentSFCEventInputEntry[];
};
export interface ComponentSFCEventInputEntry {
    key: string | ComponentSFCEventInputValue;
    value: ComponentSFCEventInputValue;
}
export interface ComponentSFCEventDirectAction {
    kind: 'action';
    identity: string;
    input?: ComponentSFCEventInputValue;
}
export interface ComponentSFCEventDirectQuery {
    kind: 'query';
    identity: string;
    input?: ComponentSFCEventInputValue;
}
export interface ComponentSFCEventTypescriptAction {
    kind: 'typescript';
    inputs: Record<string, {
        kind: 'event';
        path: string | null;
    }>;
    definitionSource?: string;
    source: string;
    emittedEvents: string[];
}
export interface ComponentSFCEventEmitAction {
    kind: 'emit';
    event: string;
    payload?: ComponentSFCEventInputValue;
}
export interface ComponentSFCEventOperationBlockStep {
    name: string;
    action: ComponentSFCEventAction;
}
export interface ComponentSFCEventOperationBlock {
    steps: ComponentSFCEventOperationBlockStep[];
    output: string | null;
}
export interface ComponentSFCEventOperationAction {
    kind: 'operation';
    input?: ComponentSFCEventInputValue;
    run: ComponentSFCEventOperationBlock;
    undo: ComponentSFCEventOperationBlock;
    redo: ComponentSFCEventOperationBlock | null;
}
export interface ComponentSFCEventRequiredPortAction {
    kind: 'required-port';
    portKind: 'action' | 'query';
    port: string;
    input?: ComponentSFCEventInputValue;
}
export type ComponentSFCEventAction = ComponentSFCEventDirectAction | ComponentSFCEventDirectQuery | ComponentSFCEventOperationAction | ComponentSFCEventTypescriptAction | ComponentSFCEventEmitAction | ComponentSFCEventRequiredPortAction;
export interface ComponentSFCEventRuntimeSource {
    nodeId: string;
    ref?: string;
    componentIdentity?: string;
    componentTag: string;
    target?: {
        type: string;
        identity: string;
        value: unknown;
    };
}
export interface ComponentSFCEventOccurrence<TPayload = unknown> {
    componentIdentity: string;
    event: string;
    payload: TPayload;
    source?: ComponentSFCEventRuntimeSource;
}
export interface ComponentSFCRequiredPorts {
    computations: ComponentSFCComputationPort[];
    components: ComponentSFCComponentPort[];
    actions: ComponentSFCActionPort[];
    queries: ComponentSFCQueryPort[];
}
export interface ComponentSFCProvidedPorts {
    actions: ComponentSFCActionPort[];
}
export interface ComponentSFCEmittedPorts {
    events: ComponentSFCEventPort[];
}
export interface ComponentSFCPortManifest {
    require: ComponentSFCRequiredPorts;
    provides: ComponentSFCProvidedPorts;
    emits: ComponentSFCEmittedPorts;
    forward: {
        rules: ComponentSFCPortForwardRule[];
    };
}
export interface RComponentSFC_IR_PortCall {
    kind: 'computation';
    local: string;
    port: string;
    defaultIdentity: string;
    input: RComponentSFC_IR_Value;
    sourceRange?: RComponentSFC_SourceRange;
}
export interface RComponentSFC_IR_ComponentPortMarker {
    kind: 'component';
    port: string;
    defaultIdentity: string;
}
export declare function createEmptyComponentSFCPortManifest(): ComponentSFCPortManifest;
```

## src/features/core/modules/domain/types/component/sfc/props-visual.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/component/sfc/props-visual.types.ts)

```ts
import type { RComponentSFC_IR_Prop } from './ir.types';
import type { RComponentSFC_SourceRange } from './location.types';
import type { RComponentDiagnostic } from '@/features/core/modules/domain/types/component/component-core.types';
export interface ComponentSFCPropsVisualProjection {
    mode: 'missing' | 'inline-type' | 'named-type' | 'runtime';
    editable: boolean;
    props: RComponentSFC_IR_Prop[];
    sourceRange: RComponentSFC_SourceRange | null;
    message?: string;
}
export interface ComponentSFCPropsSourcePatchResult {
    ok: boolean;
    source: string;
    changed: boolean;
    projection: ComponentSFCPropsVisualProjection;
    diagnostics: RComponentDiagnostic[];
    message?: string;
}
```

## src/features/core/modules/domain/types/component/sfc/source.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/component/sfc/source.types.ts)

```ts
export interface RComponentSFCSource_Script {
    content: string;
}
export interface RComponentSFCSource_Template {
    content: string;
}
export interface RComponentSFCSource_Style {
    content: string;
    scoped: boolean;
}
export interface RComponentSFCSource_Parts {
    script: RComponentSFCSource_Script;
    template: RComponentSFCSource_Template;
    style: RComponentSFCSource_Style;
}
```

## src/features/core/modules/domain/types/component/sfc/table-events.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/component/sfc/table-events.types.ts)

```ts
export type TableSelectionMode = 'none' | 'single' | 'multiple';
export type TableCellSelectionMode = 'none' | 'single';
export type TableSelectionTrigger = 'auto' | 'control' | 'row' | 'both';
export type TableRowActivationKind = 'pointer' | 'keyboard';
export interface TableEventBase {
    tableId: string;
}
export interface TableRowActivatedEvent<TRow extends Record<string, unknown> = Record<string, unknown>> extends TableEventBase {
    rowId: string;
    rowIndex: number;
    row: TRow;
    columnKey: string | null;
    activation: TableRowActivationKind;
}
export interface TableRowContextMenuRequestedEvent<TRow extends Record<string, unknown> = Record<string, unknown>> extends TableEventBase {
    rowId: string;
    rowIndex: number;
    row: TRow;
    columnKey: string | null;
    anchor: {
        x: number;
        y: number;
    };
}
export interface TableSelectionChangedEvent<TRow extends Record<string, unknown> = Record<string, unknown>> extends TableEventBase {
    mode: Exclude<TableSelectionMode, 'none'>;
    selectedRowIds: string[];
    selectedRows: TRow[];
    addedRowIds: string[];
    removedRowIds: string[];
}
export interface TableSelectedCell<TRow extends Record<string, unknown> = Record<string, unknown>> {
    rowId: string;
    rowIndex: number;
    row: TRow;
    columnKey: string;
    value: unknown;
}
export interface TableCellSelectionChangedEvent<TRow extends Record<string, unknown> = Record<string, unknown>> extends TableEventBase {
    selectedCell: TableSelectedCell<TRow> | null;
    previousCell: TableSelectedCell<TRow> | null;
}
export interface TableSortChangedEvent extends TableEventBase {
    sort: Array<{
        columnKey: string;
        direction: 'asc' | 'desc';
    }>;
}
export interface TableColumnVisibilityChangedEvent extends TableEventBase {
    visibility: Record<string, boolean>;
    hiddenColumnKeys: string[];
}
export interface TableColumnPinChangedEvent extends TableEventBase {
    left: string[];
    right: string[];
}
export interface TableColumnOrderChangedEvent extends TableEventBase {
    columnKeys: string[];
}
export interface TableColumnSizeChangedEvent extends TableEventBase {
    sizes: Record<string, number>;
    changedColumnKey: string | null;
}
export interface TablePageChangedEvent extends TableEventBase {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
}
export interface TableEventMap {
    rowActivated: TableRowActivatedEvent;
    rowContextMenuRequested: TableRowContextMenuRequestedEvent;
    selectionChanged: TableSelectionChangedEvent;
    cellSelectionChanged: TableCellSelectionChangedEvent;
    sortChanged: TableSortChangedEvent;
    columnVisibilityChanged: TableColumnVisibilityChangedEvent;
    columnPinChanged: TableColumnPinChangedEvent;
    columnOrderChanged: TableColumnOrderChangedEvent;
    columnSizeChanged: TableColumnSizeChangedEvent;
    pageChanged: TablePageChangedEvent;
}
export type TableEventName = keyof TableEventMap;
export interface TableEventDefinition {
    name: TableEventName;
    displayName: string;
    payloadType: string;
    description: string;
}
export declare const TABLE_EVENT_DEFINITIONS: readonly TableEventDefinition[];
```

## src/features/core/modules/domain/types/component/sfc/table-visibility.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/component/sfc/table-visibility.types.ts)

```ts
import type { RComponentDiagnostic } from '@/features/core/modules/domain/types/component/component-core.types';
export interface ComponentSFCTableColumnVisibilityDescriptor {
    defaultHidden: string[];
    diagnostics: RComponentDiagnostic[];
}
```

## src/features/core/modules/domain/types/component/sfc/tag-attribute-contract.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/component/sfc/tag-attribute-contract.types.ts)

```ts
export type ComponentSFCTagAttributeLiteral = string | number | boolean;
export interface ComponentSFCTagAttributeContract {
    name: string;
    aliases?: readonly string[];
    values: readonly ComponentSFCTagAttributeLiteral[];
    defaultValue?: ComponentSFCTagAttributeLiteral;
    description: string;
    validate?: boolean;
}
export interface ComponentSFCAttributeAnalysisOptions {
    resolveTagAttributeContracts?: (tag: string) => readonly ComponentSFCTagAttributeContract[] | null | undefined;
}
export declare const ENDGE_SFC_TABLE_SELECTION_MODES: readonly [
    "none",
    "single",
    "multiple"
];
export declare const ENDGE_SFC_TABLE_CELL_SELECTION_MODES: readonly [
    "none",
    "single"
];
export declare const ENDGE_SFC_TABLE_SELECTION_TRIGGERS: readonly [
    "auto",
    "control",
    "row",
    "both"
];
export declare const ENDGE_SFC_TABLE_PAGING_MODES: readonly [
    "pages",
    "virtual"
];
export declare const ENDGE_SFC_TABLE_SORT_MODES: readonly [
    "multiple",
    "single",
    "fixed",
    "disabled"
];
export declare const ENDGE_SFC_TABLE_SORT_COMPARATORS: readonly [
    "natural",
    "text",
    "number",
    "date",
    "time",
    "boolean"
];
export declare const ENDGE_SFC_TABLE_COLUMN_PIN_MODES: readonly [
    "enabled",
    "disabled"
];
export declare const ENDGE_SFC_TABLE_COLUMN_MENU_MODES: readonly [
    "default",
    "disabled"
];
export declare const ENDGE_SFC_TABLE_CELL_ALIGNMENTS: readonly [
    "left",
    "center",
    "right"
];
export declare const ENDGE_SFC_TABLE_CELL_VERTICAL_ALIGNMENTS: readonly [
    "top",
    "middle",
    "bottom"
];
export declare const ENDGE_SFC_GRID_AUTO_FLOWS: readonly [
    "row",
    "column",
    "row dense",
    "column dense"
];
export declare const ENDGE_SFC_GRID_ALIGNMENTS: readonly [
    "start",
    "center",
    "end",
    "stretch"
];
export declare const ENDGE_SFC_FLEX_DIRECTIONS: readonly [
    "row",
    "column"
];
export declare const ENDGE_SFC_DIVIDER_ORIENTATIONS: readonly [
    "horizontal",
    "vertical"
];
export declare const ENDGE_SFC_INPUT_TYPES: readonly [
    "String",
    "Number",
    "Date",
    "Time",
    "DateTime"
];
export declare const ENDGE_SFC_TOOLTIP_SIDES: readonly [
    "top",
    "right",
    "bottom",
    "left"
];
export declare const ENDGE_SFC_TOOLTIP_ALIGNS: readonly [
    "start",
    "center",
    "end"
];
export declare const ENDGE_SFC_TAG_ATTRIBUTE_CONTRACTS: {
    readonly Table: readonly [
        {
            readonly name: "selection-mode";
            readonly aliases: readonly [
                "selectionMode"
            ];
            readonly values: readonly [
                "none",
                "single",
                "multiple"
            ];
            readonly defaultValue: "none";
            readonly description: "Допустимое количество выбранных строк.";
        },
        {
            readonly name: "selection-trigger";
            readonly aliases: readonly [
                "selectionTrigger"
            ];
            readonly values: readonly [
                "auto",
                "control",
                "row",
                "both"
            ];
            readonly defaultValue: "auto";
            readonly description: "Действие, которое меняет состояние выбора строки.";
        },
        {
            readonly name: "cell-selection-mode";
            readonly aliases: readonly [
                "cellSelectionMode"
            ];
            readonly values: readonly [
                "none",
                "single"
            ];
            readonly defaultValue: "none";
            readonly description: "Режим выбора одной конкретной ячейки, независимый от выбора строк.";
        },
        {
            readonly name: "paging";
            readonly values: readonly [
                "pages",
                "virtual"
            ];
            readonly defaultValue: "pages";
            readonly description: "Страничное или виртуализированное отображение строк.";
        },
        {
            readonly name: "sort-mode";
            readonly aliases: readonly [
                "sortMode"
            ];
            readonly values: readonly [
                "multiple",
                "single",
                "fixed",
                "disabled"
            ];
            readonly defaultValue: "multiple";
            readonly description: "Режим пользовательской сортировки Table.";
            readonly validate: false;
        },
        {
            readonly name: "column-pin";
            readonly aliases: readonly [
                "columnPin"
            ];
            readonly values: readonly [
                "enabled",
                "disabled"
            ];
            readonly defaultValue: "enabled";
            readonly description: "Разрешает или запрещает runtime-закрепление колонок.";
            readonly validate: false;
        },
        {
            readonly name: "column-menu";
            readonly aliases: readonly [
                "columnMenu"
            ];
            readonly values: readonly [
                "default",
                "disabled"
            ];
            readonly defaultValue: "default";
            readonly description: "Стандартное или отключённое меню заголовка колонки.";
            readonly validate: false;
        },
        {
            readonly name: "cell-align";
            readonly aliases: readonly [
                "cellAlign"
            ];
            readonly values: readonly [
                "left",
                "center",
                "right"
            ];
            readonly defaultValue: "left";
            readonly description: "Горизонтальное выравнивание содержимого ячеек.";
        },
        {
            readonly name: "cell-vertical-align";
            readonly aliases: readonly [
                "cellVerticalAlign"
            ];
            readonly values: readonly [
                "top",
                "middle",
                "bottom"
            ];
            readonly defaultValue: "middle";
            readonly description: "Вертикальное выравнивание содержимого ячеек.";
        }
    ];
    readonly Column: readonly [
        {
            readonly name: "sort";
            readonly values: readonly [
                "natural",
                "text",
                "number",
                "date",
                "time",
                "boolean"
            ];
            readonly defaultValue: "natural";
            readonly description: "Comparator для значений колонки.";
            readonly validate: false;
        }
    ];
    readonly Grid: readonly [
        {
            readonly name: "autoFlow";
            readonly values: readonly [
                "row",
                "column",
                "row dense",
                "column dense"
            ];
            readonly defaultValue: "row";
            readonly description: "Направление автоматического размещения CSS Grid.";
        },
        {
            readonly name: "align";
            readonly values: readonly [
                "start",
                "center",
                "end",
                "stretch"
            ];
            readonly defaultValue: "stretch";
            readonly description: "Выравнивание элементов по вертикальной оси Grid.";
        },
        {
            readonly name: "justify";
            readonly values: readonly [
                "start",
                "center",
                "end",
                "stretch"
            ];
            readonly defaultValue: "stretch";
            readonly description: "Выравнивание элементов по горизонтальной оси Grid.";
        }
    ];
    readonly Flex: readonly [
        {
            readonly name: "direction";
            readonly values: readonly [
                "row",
                "column"
            ];
            readonly defaultValue: "row";
            readonly description: "Направление основной оси Flex.";
        }
    ];
    readonly Divider: readonly [
        {
            readonly name: "orientation";
            readonly values: readonly [
                "horizontal",
                "vertical"
            ];
            readonly defaultValue: "horizontal";
            readonly description: "Ориентация разделителя.";
        }
    ];
    readonly Input: readonly [
        {
            readonly name: "type";
            readonly values: readonly [
                "String",
                "Number",
                "Date",
                "Time",
                "DateTime"
            ];
            readonly defaultValue: "String";
            readonly description: "Семантический тип значения Input.";
        }
    ];
    readonly Tooltip: readonly [
        {
            readonly name: "side";
            readonly values: readonly [
                "top",
                "right",
                "bottom",
                "left"
            ];
            readonly description: "Предпочтительная сторона; adapter может перевернуть её при collision с viewport.";
        },
        {
            readonly name: "align";
            readonly values: readonly [
                "start",
                "center",
                "end"
            ];
            readonly description: "Выравнивание tooltip относительно trigger.";
        }
    ];
};
export declare function getComponentSFCTagAttributeContracts(tag: string): readonly ComponentSFCTagAttributeContract[];
export declare function getComponentSFCTagAttributeContract(tag: string, attributeName: string): ComponentSFCTagAttributeContract | null;
```

## src/features/core/modules/domain/types/component/sfc/tag-input-contract.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/component/sfc/tag-input-contract.types.ts)

```ts
import type { RComponentSFC_IR_Tag } from './ir.types';
import type { RComponentContractInput } from '@/features/core/modules/domain/types/component/component-core.types';
export type ComponentSFCTagInputContract = Readonly<RComponentContractInput> & {
    aliases?: readonly string[];
};
export declare const ENDGE_SFC_TAG_INPUT_CONTRACTS: {
    readonly Text: readonly [
        {
            readonly name: "value";
            readonly type: "string";
            readonly optional: true;
        },
        {
            readonly name: "editorVariant";
            readonly aliases: readonly [
                "editor-variant"
            ];
            readonly type: "'default' | 'compact'";
            readonly optional: true;
        }
    ];
    readonly DateTime: readonly [
        {
            readonly name: "value";
            readonly type: "Date | string";
            readonly optional: false;
        },
        {
            readonly name: "format";
            readonly type: "string";
            readonly optional: true;
        },
        {
            readonly name: "timezone";
            readonly type: "string";
            readonly optional: true;
        },
        {
            readonly name: "editMode";
            readonly aliases: readonly [
                "edit-mode"
            ];
            readonly type: "'datetime' | 'time'";
            readonly optional: true;
        },
        {
            readonly name: "editorVariant";
            readonly aliases: readonly [
                "editor-variant"
            ];
            readonly type: "'default' | 'compact'";
            readonly optional: true;
        },
        {
            readonly name: "empty";
            readonly type: "string";
            readonly optional: true;
        }
    ];
    readonly Number: readonly [
        {
            readonly name: "value";
            readonly type: "number";
            readonly optional: false;
        },
        {
            readonly name: "editorVariant";
            readonly aliases: readonly [
                "editor-variant"
            ];
            readonly type: "'default' | 'compact'";
            readonly optional: true;
        },
        {
            readonly name: "decimals";
            readonly type: "number";
            readonly optional: true;
        },
        {
            readonly name: "prefix";
            readonly type: "string";
            readonly optional: true;
        },
        {
            readonly name: "suffix";
            readonly type: "string";
            readonly optional: true;
        },
        {
            readonly name: "empty";
            readonly type: "string";
            readonly optional: true;
        }
    ];
    readonly Icon: readonly [
        {
            readonly name: "name";
            readonly type: "string";
            readonly optional: false;
        }
    ];
    readonly Badge: readonly [
        {
            readonly name: "value";
            readonly type: "string";
            readonly optional: true;
        },
        {
            readonly name: "tone";
            readonly type: "string";
            readonly optional: true;
        }
    ];
    readonly Dot: readonly [
        {
            readonly name: "tone";
            readonly type: "string";
            readonly optional: true;
        }
    ];
    readonly Box: readonly [
    ];
    readonly Flex: readonly [
    ];
    readonly Grid: readonly [
    ];
    readonly Divider: readonly [
        {
            readonly name: "orientation";
            readonly type: "'horizontal' | 'vertical'";
            readonly optional: true;
        }
    ];
    readonly Input: readonly [
        {
            readonly name: "value";
            readonly type: "unknown";
            readonly optional: true;
        },
        {
            readonly name: "type";
            readonly type: "'String' | 'Number' | 'Date' | 'Time' | 'DateTime'";
            readonly optional: true;
        },
        {
            readonly name: "placeholder";
            readonly type: "string";
            readonly optional: true;
        },
        {
            readonly name: "min";
            readonly type: "string | number";
            readonly optional: true;
        },
        {
            readonly name: "max";
            readonly type: "string | number";
            readonly optional: true;
        },
        {
            readonly name: "step";
            readonly type: "string | number";
            readonly optional: true;
        },
        {
            readonly name: "readonly";
            readonly type: "boolean";
            readonly optional: true;
        },
        {
            readonly name: "disabled";
            readonly type: "boolean";
            readonly optional: true;
        }
    ];
    readonly Textarea: readonly [
        {
            readonly name: "value";
            readonly type: "string";
            readonly optional: true;
        },
        {
            readonly name: "rows";
            readonly type: "number";
            readonly optional: true;
        },
        {
            readonly name: "placeholder";
            readonly type: "string";
            readonly optional: true;
        },
        {
            readonly name: "readonly";
            readonly type: "boolean";
            readonly optional: true;
        },
        {
            readonly name: "disabled";
            readonly type: "boolean";
            readonly optional: true;
        }
    ];
    readonly Checkbox: readonly [
        {
            readonly name: "checked";
            readonly type: "boolean";
            readonly optional: true;
        },
        {
            readonly name: "label";
            readonly type: "string";
            readonly optional: true;
        },
        {
            readonly name: "readonly";
            readonly type: "boolean";
            readonly optional: true;
        },
        {
            readonly name: "disabled";
            readonly type: "boolean";
            readonly optional: true;
        }
    ];
    readonly Select: readonly [
        {
            readonly name: "value";
            readonly type: "unknown | unknown[]";
            readonly optional: true;
        },
        {
            readonly name: "options";
            readonly type: "SourceFieldOption[]";
            readonly optional: false;
        },
        {
            readonly name: "multiple";
            readonly type: "boolean";
            readonly optional: true;
        },
        {
            readonly name: "placeholder";
            readonly type: "string";
            readonly optional: true;
        },
        {
            readonly name: "readonly";
            readonly type: "boolean";
            readonly optional: true;
        },
        {
            readonly name: "disabled";
            readonly type: "boolean";
            readonly optional: true;
        }
    ];
    readonly Tooltip: readonly [
        {
            readonly name: "text";
            readonly type: "string";
            readonly optional: true;
        },
        {
            readonly name: "markdown";
            readonly type: "string";
            readonly optional: true;
        },
        {
            readonly name: "openDelay";
            readonly type: "number";
            readonly optional: true;
        },
        {
            readonly name: "closeDelay";
            readonly type: "number";
            readonly optional: true;
        }
    ];
};
export declare function getComponentSFCTagInputContract(tag: RComponentSFC_IR_Tag): readonly ComponentSFCTagInputContract[];
```

## src/features/core/modules/domain/types/component/sfc/visual-projection.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/component/sfc/visual-projection.types.ts)

```ts
import type { RComponentSFC_IR_Tag } from './ir.types';
import type { RComponentSFC_SourceRange } from './location.types';
import type { EndgeSFCEditingConfiguration } from '@/features/core/modules/configuration/domain/types/configuration.type';
import type { RComponentDiagnostic } from '@/features/core/modules/domain/types/component/component-core.types';
import type { TypeSourceDefinition } from '@/features/core/modules/source/domain/types/type-source.types';
export type ComponentSFCVisualSourceValue = {
    kind: 'boolean';
    value: boolean;
} | {
    kind: 'literal';
    value: unknown;
} | {
    kind: 'expression';
    source: string;
};
export interface ComponentSFCVisualAttribute {
    name: string;
    value: ComponentSFCVisualSourceValue;
    sourceRange?: RComponentSFC_SourceRange;
}
export type ComponentSFCTableCellBindingProjection = ComponentSFCVisualAttribute;
export type ComponentSFCTableCellInteractionModifier = 'ctrl' | 'shift' | 'alt' | 'meta' | 'mod' | 'altGraph' | 'exact';
export type ComponentSFCTableCellInteractionFlag = 'stop' | 'prevent' | 'self' | 'once' | 'capture' | 'passive';
export interface ComponentSFCInteractionTriggerProjection {
    event: string;
    key: string[];
    code: string[];
    held: {
        key: string[];
        code: string[];
        match: 'all' | 'any';
        exact: boolean;
    } | null;
    modifiers: Partial<Record<ComponentSFCTableCellInteractionModifier, boolean>>;
    repeat: boolean | null;
    composing: boolean | null;
    button: number | null;
    flags: Partial<Record<ComponentSFCTableCellInteractionFlag, boolean>>;
}
export interface ComponentSFCTableCellInteractionRuleProjection extends ComponentSFCInteractionTriggerProjection {
    reactionSource: string;
}
export interface ComponentSFCTableCellInteractionsProjection {
    editable: boolean;
    rules: ComponentSFCTableCellInteractionRuleProjection[];
    suffixes: ComponentSFCTableCellInteractionFlag[];
    sourceRange?: RComponentSFC_SourceRange;
    message?: string;
}
export interface ComponentSFCEventReactionProjection {
    editable: boolean;
    source: string | null;
    suffixes: ComponentSFCTableCellInteractionFlag[];
    sourceRange?: RComponentSFC_SourceRange;
    message?: string;
}
export interface ComponentSFCEditOutcomeProjection {
    editable: boolean;
    triggers: ComponentSFCInteractionTriggerProjection[];
    usesDefault: boolean;
    suffixes: ComponentSFCTableCellInteractionFlag[];
    message?: string;
}
export type ComponentSFCTableVisualCellSyntax = 'cell' | 'direct' | 'editable-default' | 'editable-edit';
export type ComponentSFCTableEditableElementProjection = {
    kind: 'component';
    identity: string | null;
    syntax: ComponentSFCTableVisualCellSyntax;
    bindings: ComponentSFCTableCellBindingProjection[];
} | {
    kind: 'tag';
    tag: ComponentSFCTableVisualCellTag;
    syntax: ComponentSFCTableVisualCellSyntax;
    bindings: ComponentSFCTableCellBindingProjection[];
} | {
    kind: 'source';
};
export interface ComponentSFCTableCellEditingProjection {
    editable: boolean;
    enabled: boolean;
    mode: 'primitive' | 'custom' | 'component' | 'source' | 'unavailable';
    tag: string | null;
    triggers: ComponentSFCInteractionTriggerProjection[];
    usesDefaultTrigger: boolean;
    suffixes: ComponentSFCTableCellInteractionFlag[];
    reaction: ComponentSFCEventReactionProjection;
    cancel: ComponentSFCEditOutcomeProjection;
    commit: ComponentSFCEditOutcomeProjection;
    editor: ComponentSFCTableEditableElementProjection | null;
    editorImplicit: boolean;
    sourceRange?: RComponentSFC_SourceRange;
    message?: string;
}
export type ComponentSFCTableVisualCellTag = Exclude<RComponentSFC_IR_Tag, 'Component' | 'Table' | 'Column' | 'Cell' | 'ColumnMenu' | 'CellMenu' | 'RowMenu' | 'MenuItem' | 'MenuSeparator' | 'Editable' | 'Variant'>;
export type ComponentSFCTableCellProjection = {
    kind: 'default';
} | {
    kind: 'component';
    identity: string | null;
    syntax: ComponentSFCTableVisualCellSyntax;
    bindings: ComponentSFCTableCellBindingProjection[];
} | {
    kind: 'tag';
    tag: ComponentSFCTableVisualCellTag;
    syntax: ComponentSFCTableVisualCellSyntax;
    bindings: ComponentSFCTableCellBindingProjection[];
} | {
    kind: 'source';
};
export interface ComponentSFCVisualInspectionOptions {
    resolveComponentTag?: (tag: string) => string | null;
    resolveTypeDefinition?: (identity: string) => TypeSourceDefinition | null;
    actionIdentities?: Iterable<string>;
    sfcEditing?: EndgeSFCEditingConfiguration;
}
export interface ComponentSFCTableColumnProjection {
    id: string;
    index: number;
    key: ComponentSFCVisualSourceValue | null;
    title: ComponentSFCVisualSourceValue | null;
    width: ComponentSFCVisualSourceValue | null;
    sortable: ComponentSFCVisualSourceValue | null;
    sort: ComponentSFCVisualSourceValue | null;
    sortBy: ComponentSFCVisualSourceValue | null;
    pinnable: ComponentSFCVisualSourceValue | null;
    attributes: ComponentSFCVisualAttribute[];
    cell: ComponentSFCTableCellProjection;
    editing: ComponentSFCTableCellEditingProjection;
    interactions: ComponentSFCTableCellInteractionsProjection;
    cellMenu: ComponentSFCTableMenuProjection;
    hasCustomCell: boolean;
    cellSource: string | null;
    sourceRange: RComponentSFC_SourceRange;
}
export type ComponentSFCTableVisualMenuKind = 'column' | 'row';
export type ComponentSFCTableVisualMenuMode = 'default' | 'disabled' | 'none' | 'custom' | 'source';
export interface ComponentSFCTableMenuActionOption {
    identity: string;
    source: 'intrinsic' | 'built-in' | 'external' | 'required' | 'provided' | 'forwarded';
}
export type ComponentSFCTableMenuNodeProjection = {
    kind: 'separator';
    id: string;
    sourceRange: RComponentSFC_SourceRange;
} | {
    kind: 'item';
    id: string;
    label: ComponentSFCVisualSourceValue | null;
    action: ComponentSFCVisualSourceValue | null;
    input: ComponentSFCVisualSourceValue | null;
    icon: ComponentSFCVisualSourceValue | null;
    visible: ComponentSFCVisualSourceValue | null;
    disabled: ComponentSFCVisualSourceValue | null;
    sourceOwned: boolean;
    sourceRange: RComponentSFC_SourceRange;
};
export interface ComponentSFCTableMenuProjection {
    kind: ComponentSFCTableVisualMenuKind;
    mode: ComponentSFCTableVisualMenuMode;
    sourceOwned: boolean;
    items: ComponentSFCTableMenuNodeProjection[];
    sourceRange?: RComponentSFC_SourceRange;
}
export type ComponentSFCTableSourcePatch = {
    type: 'add-column';
    title?: string;
    key?: string;
} | {
    type: 'remove-column';
    columnIndex: number;
} | {
    type: 'move-column';
    fromIndex: number;
    toIndex: number;
} | {
    type: 'set-column-attribute';
    columnIndex: number;
    name: 'key' | 'title' | 'width' | 'sortable' | 'sort' | 'sort-by';
    value: string | null;
} | {
    type: 'set-table-attribute';
    name: 'ref' | 'selection-mode' | 'selection-trigger' | 'cell-selection-mode' | 'paging' | 'page-size' | 'page-sizes' | 'default-pin' | 'default-sort' | 'default-hidden';
    value: string | null;
} | {
    type: 'set-column-component';
    columnIndex: number;
    identity: string | null;
    syntax?: ComponentSFCTableVisualCellSyntax;
} | {
    type: 'set-column-tag';
    columnIndex: number;
    tag: ComponentSFCTableVisualCellTag | null;
    syntax?: ComponentSFCTableVisualCellSyntax;
} | {
    type: 'set-column-cell-attribute';
    columnIndex: number;
    name: string;
    value: string | null;
    valueKind: 'expression' | 'literal';
} | {
    type: 'set-column-cell-on';
    columnIndex: number;
    value: string | null;
} | {
    type: 'set-column-cell-editable';
    columnIndex: number;
    enabled: boolean;
} | {
    type: 'set-column-cell-edit-triggers';
    columnIndex: number;
    triggers: ComponentSFCInteractionTriggerProjection[];
} | {
    type: 'set-column-cell-edited-reaction';
    columnIndex: number;
    value: string | null;
} | {
    type: 'set-column-cell-cancel-triggers';
    columnIndex: number;
    triggers: ComponentSFCInteractionTriggerProjection[] | null;
} | {
    type: 'set-column-cell-commit-triggers';
    columnIndex: number;
    triggers: ComponentSFCInteractionTriggerProjection[] | null;
} | {
    type: 'set-column-cell-editor-component';
    columnIndex: number;
    identity: string;
} | {
    type: 'set-column-cell-editor-tag';
    columnIndex: number;
    tag: ComponentSFCTableVisualCellTag;
} | {
    type: 'set-column-cell-editor-attribute';
    columnIndex: number;
    name: string;
    value: string | null;
    valueKind: 'expression' | 'literal';
} | {
    type: 'set-menu-mode';
    menu: ComponentSFCTableVisualMenuKind;
    columnIndex?: number;
    mode: 'default' | 'disabled' | 'none' | 'custom';
} | {
    type: 'add-menu-node';
    menu: ComponentSFCTableVisualMenuKind;
    columnIndex?: number;
    node: 'item' | 'separator';
} | {
    type: 'remove-menu-node';
    menu: ComponentSFCTableVisualMenuKind;
    columnIndex?: number;
    nodeIndex: number;
} | {
    type: 'move-menu-node';
    menu: ComponentSFCTableVisualMenuKind;
    columnIndex?: number;
    fromIndex: number;
    toIndex: number;
} | {
    type: 'set-menu-item-attribute';
    menu: ComponentSFCTableVisualMenuKind;
    columnIndex?: number;
    nodeIndex: number;
    name: 'label' | 'action' | 'input' | 'icon' | 'visible' | 'disabled';
    value: string | null;
    valueKind: 'expression' | 'literal';
};
export interface ComponentSFCTableSourcePatchResult {
    ok: boolean;
    source: string;
    changed: boolean;
    projection: ComponentSFCTableVisualProjection | null;
    diagnostics: RComponentDiagnostic[];
    message?: string;
}
export interface ComponentSFCTableVisualProjection {
    kind: 'table';
    ref: ComponentSFCVisualSourceValue | null;
    selectionMode: ComponentSFCVisualSourceValue | null;
    selectionTrigger: ComponentSFCVisualSourceValue | null;
    cellSelectionMode: ComponentSFCVisualSourceValue | null;
    rows: ComponentSFCVisualSourceValue | null;
    rowKey: ComponentSFCVisualSourceValue | null;
    paging: ComponentSFCVisualSourceValue | null;
    pageSize: ComponentSFCVisualSourceValue | null;
    pageSizes: ComponentSFCVisualSourceValue | null;
    sortMode: ComponentSFCVisualSourceValue | null;
    defaultSort: ComponentSFCVisualSourceValue | null;
    columnPin: ComponentSFCVisualSourceValue | null;
    defaultPin: ComponentSFCVisualSourceValue | null;
    defaultHidden: ComponentSFCVisualSourceValue | null;
    columnMenu: ComponentSFCVisualSourceValue | null;
    menus: {
        column: ComponentSFCTableMenuProjection;
        row: ComponentSFCTableMenuProjection;
    };
    menuActions: ComponentSFCTableMenuActionOption[];
    attributes: ComponentSFCVisualAttribute[];
    columns: ComponentSFCTableColumnProjection[];
    sourceRange: RComponentSFC_SourceRange;
}
export interface ComponentSFCVisualInspection {
    support: {
        kind: 'table';
    } | {
        kind: 'none';
        reason: 'source-empty' | 'template-missing' | 'root-count' | 'root-not-table';
    };
    projection: ComponentSFCTableVisualProjection | null;
    diagnostics: RComponentDiagnostic[];
}
```

## src/features/core/modules/domain/types/computation/computation-program.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/computation/computation-program.types.ts)

```ts
import type { ComputationSourceDocument } from './computation-source.types';
import type { SourceExpressionIR } from '@/features/core/modules/source/domain/types/source-expression.types';
export interface ComputationContractField {
    type: string;
    isArray?: boolean;
    optional?: boolean;
}
export type ComputationProgramNode = {
    kind: 'expression';
    name: string;
    dependencies: string[];
    expression: SourceExpressionIR;
} | {
    kind: 'typescript';
    name: string;
    dependencies: string[];
    inputs: Record<string, SourceExpressionIR>;
    moduleKey: string;
    source: string;
} | {
    kind: 'computation';
    name: string;
    dependencies: string[];
    identity: string;
    input: SourceExpressionIR;
};
export interface ComputationProgramPayload {
    ast?: unknown;
    input: ComputationContractField | null;
    output: ComputationContractField | null;
    sourceDocument: ComputationSourceDocument | null;
    nodes: ComputationProgramNode[];
    result: SourceExpressionIR | null;
    execution: 'sync' | 'async';
}
```

## src/features/core/modules/domain/types/computation/computation-runtime.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/computation/computation-runtime.types.ts)

```ts
import type { SourceExpressionIR } from '@/features/core/modules/source/domain/types/source-expression.types';
export type ComputationResourceStatus = 'idle' | 'pending' | 'success' | 'error';
export interface ComputationRuntimeErrorShape {
    name: 'ComputationRuntimeError';
    message: string;
    computationIdentity: string;
    outputName?: string;
    kind: string;
}
export interface ComputationResource<T = unknown> {
    readonly status: ComputationResourceStatus;
    readonly loading: boolean;
    readonly value: T | undefined;
    readonly error: ComputationRuntimeErrorShape | null;
    refresh: () => Promise<void>;
    subscribe: (listener: VoidFunction) => VoidFunction;
    dispose: () => void;
}
export interface ComputationSandboxRequest {
    computationIdentity: string;
    outputName: string;
    moduleKey: string;
    source: string;
    inputs: Record<string, unknown>;
}
export interface ComputationSandboxAdapter {
    execute: (request: ComputationSandboxRequest) => Promise<unknown>;
    dispose?: () => void | Promise<void>;
}
export interface ComputationExecutionScope {
    readonly stack: readonly string[];
    readonly budget: {
        calls: number;
    };
}
export interface ComputationDependencyRunner {
    run: (identity: string, input: unknown, scope: ComputationExecutionScope) => Promise<unknown>;
    runSync: (identity: string, input: unknown, scope: ComputationExecutionScope) => unknown;
}
export interface ComputationExecutionApi {
    evaluate: (expression: SourceExpressionIR, scope?: unknown) => unknown;
}
export interface ComputationOverride {
    execution: 'sync' | 'async';
    run: (input: unknown, api: ComputationExecutionApi) => unknown | Promise<unknown>;
}
```

## src/features/core/modules/domain/types/computation/computation-source.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/computation/computation-source.types.ts)

```ts
import type { ComputationContractField } from './computation-program.types';
import type { SourceExpressionIR } from '@/features/core/modules/source/domain/types/source-expression.types';
export interface ComputationSourceRange {
    start: number;
    end: number;
}
export type ComputationSourceNode = {
    kind: 'expression';
    name: string;
    expression: SourceExpressionIR;
    sourceRange?: ComputationSourceRange;
} | {
    kind: 'typescript';
    name: string;
    inputs: Record<string, SourceExpressionIR>;
    source: string;
    sourceRange?: ComputationSourceRange;
} | {
    kind: 'computation';
    name: string;
    identity: string;
    input: SourceExpressionIR;
    sourceRange?: ComputationSourceRange;
};
export interface ComputationSourceDocument {
    input: ComputationContractField | null;
    output: ComputationContractField | null;
    outputs: ComputationSourceNode[];
    result: SourceExpressionIR;
}
```

## src/features/core/modules/domain/types/computation/computation.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/computation/computation.types.ts)

```ts
export * from './computation-program.types';
export * from './computation-runtime.types';
export * from './computation-source.types';
```

## src/features/core/modules/domain/types/document/document-create.type.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/document/document-create.type.ts)

```ts
import type { DomainDocumentType } from './document.types';
export type DocumentCreateRequest = {
    documentType: DomainDocumentType;
    identity: string;
    mode: 'model';
    model: unknown;
} | {
    documentType: DomainDocumentType;
    identity: string;
    mode: 'portable';
    document: Record<string, unknown>;
};
export interface DocumentCreateResult {
    documentType: DomainDocumentType;
    identity: string;
}
```

## src/features/core/modules/domain/types/document/document-draft.type.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/document/document-draft.type.ts)

```ts
export interface DocumentDraftOptions {
    identity: string;
    name?: string;
    folderId?: string | number | null;
}
```

## src/features/core/modules/domain/types/document/document-identity.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/document/document-identity.types.ts)

```ts
export type EndgeFacetId = string;
export type EndgeFacetDocumentId = string;
export type EndgeFolderId = string;
export type EndgeTypeId = string;
export type EndgeQueryId = string;
export type EndgeDataViewId = string;
export type EndgeCompositionId = string;
export type EndgeStoreId = string;
export type EndgeStreamId = string;
export type EndgeSimulationId = string;
export type EndgeUpdateId = string;
export type EndgeMockId = string;
export type EndgeComponentId = string;
export type EndgeComponentSFCId = string;
export type EndgeActionId = string;
export type EndgeConverterId = string;
export type EndgeComputationId = string;
export type EndgeIntegrationId = string;
export type EndgePageTemplateId = string;
export type EndgePageId = string;
export type EndgeNavigationId = string;
export type EndgeFilterId = string;
export type EndgePolicyId = string;
export type EndgeStyleId = string;
export type EndgeConfigurationId = string;
export type EndgeVocabId = string;
export type EndgeAuthProfileId = string;
export type EndgeI18nBundleId = string;
```

## src/features/core/modules/domain/types/document/document-metadata.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/document/document-metadata.types.ts)

```ts
import type { ProgramMetadataMap } from '@/features/core/modules/program/domain/types/program-metadata.types';
export type DocumentMetadataBacking = 'definition-property' | 'definition-declaration' | 'entity-meta';
export interface DocumentMetadataInput {
    source?: string | null;
    meta?: Record<string, unknown> | null;
}
export interface DocumentMetadataDiagnostic {
    severity: 'info' | 'warning' | 'error';
    code: string;
    message: string;
    sourcePath?: string;
    start?: number;
    end?: number;
}
export interface DocumentMetadataProjection {
    backing: DocumentMetadataBacking | null;
    mode: 'missing' | 'static' | 'invalid' | 'duplicate';
    editable: boolean;
    metadata: ProgramMetadataMap;
    json: string;
    sourceRange: {
        start: number;
        end: number;
    } | null;
    diagnostics: DocumentMetadataDiagnostic[];
    message?: string;
}
export interface DocumentMetadataPatchResult {
    ok: boolean;
    source: string;
    meta: Record<string, unknown>;
    changed: boolean;
    projection: DocumentMetadataProjection;
    diagnostics: DocumentMetadataDiagnostic[];
    message?: string;
}
```

## src/features/core/modules/domain/types/document/document-move.type.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/document/document-move.type.ts)

```ts
import type { DomainDocumentType } from './document.types';
export interface EndgeDomainDocumentMove {
    documentId: string | number;
    documentType: DomainDocumentType;
}
```

## src/features/core/modules/domain/types/document/document.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/document/document.types.ts)

```ts
import type { RAction } from '@/features/core/modules/domain/entities/RAction';
import type { RAuthProfile } from '@/features/core/modules/domain/entities/RAuthProfile';
import type { RComponentSFC } from '@/features/core/modules/domain/entities/RComponentSFC';
import type { RComposition } from '@/features/core/modules/domain/entities/RComposition';
import type { RComputation } from '@/features/core/modules/domain/entities/RComputation';
import type { RConfiguration } from '@/features/core/modules/domain/entities/RConfiguration';
import type { RConverter } from '@/features/core/modules/domain/entities/RConverter';
import type { RDataView } from '@/features/core/modules/domain/entities/RDataView';
import type { RFilter } from '@/features/core/modules/domain/entities/RFilter';
import type { RI18nBundle } from '@/features/core/modules/domain/entities/RI18nBundle';
import type { RIntegration } from '@/features/core/modules/domain/entities/RIntegration';
import type { RMock } from '@/features/core/modules/domain/entities/RMock';
import type { RNavigation } from '@/features/core/modules/domain/entities/RNavigation';
import type { RPage } from '@/features/core/modules/domain/entities/RPage';
import type { RPageTemplate } from '@/features/core/modules/domain/entities/RPageTemplate';
import type { RPolicy } from '@/features/core/modules/domain/entities/RPolicy';
import type { RQuery } from '@/features/core/modules/domain/entities/RQuery';
import type { RSimulation } from '@/features/core/modules/domain/entities/RSimulation';
import type { RStore } from '@/features/core/modules/domain/entities/RStore';
import type { RStream } from '@/features/core/modules/domain/entities/RStream';
import type { RStyle } from '@/features/core/modules/domain/entities/RStyle';
import type { RType } from '@/features/core/modules/domain/entities/RType';
import type { RUpdate } from '@/features/core/modules/domain/entities/RUpdate';
import type { RVocabs } from '@/features/core/modules/domain/entities/RVocabs';
import type { RWorkspace } from '@/features/core/modules/domain/entities/RWorkspace';
import type { RComponent } from '@/features/core/modules/domain/types/component/component.types';
export declare enum ComponentType {
    Component = "component",
    Html = "html",
    DSL = "component-dsl",
    Table = "component-table",
    SFC = "component-sfc"
}
export declare enum FilterType {
    DefaultFilter = "default-filter"
}
export declare enum QueryType {
    Custom = "query-custom",
    GraphQL = "query-gql",
    REST = "query-rest"
}
export declare enum DomainSectionType {
    Workspace = "workspace",
    Primitive = "primitive",
    Type = "type",
    Component = "component",
    Query = "query",
    DataView = "data-view",
    Composition = "composition",
    Simulation = "simulation",
    Store = "store",
    Mock = "mock",
    Action = "action",
    Event = "event",
    Converter = "converter",
    Computation = "computation",
    Integration = "integration",
    Filters = "filters",
    Policy = "policy",
    Style = "style",
    Configuration = "configuration",
    PageTemplate = "page-template",
    Page = "page",
    Navigation = "navigation",
    Vocabs = "vocabs",
    I18nBundles = "i18n-bundles",
    AuthProfile = "auth-profile"
}
export declare const DOMAIN_DOCUMENT_TYPES: readonly [
    "primitive",
    "type",
    "action",
    "converter",
    "computation",
    "data-view",
    "composition",
    "store",
    "stream",
    "simulation",
    "update",
    "mock",
    "integration",
    "page-template",
    "page",
    "navigation",
    "policy",
    "style",
    "configuration",
    "vocabs",
    "i18n-bundles",
    "auth-profile",
    "workspace",
    ComponentType.DSL,
    ComponentType.Table,
    ComponentType.SFC,
    QueryType.Custom,
    QueryType.GraphQL,
    QueryType.REST,
    FilterType
];
export type DomainDocumentType = (typeof DOMAIN_DOCUMENT_TYPES)[number];
export interface Document {
    type: DomainDocumentType;
    sectionType: DomainSectionType;
    id: string;
}
export type RDocument = RComponent | RComponentSFC | RQuery | RDataView | RComposition | RStore | RStream | RSimulation | RUpdate | RMock | RAction | RConverter | RComputation | RIntegration | RFilter | RPolicy | RStyle | RConfiguration | RType | RVocabs | RI18nBundle | RAuthProfile | RWorkspace | RPageTemplate | RPage | RNavigation;
```

## src/features/core/modules/domain/types/document/domain-export.type.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/document/domain-export.type.ts)

```ts
import type { EndgeWorkspaceDefinition } from '@/features/core/modules/workspace/domain/workspace.types';
export type EndgeWorkspaceExport = EndgeWorkspaceDefinition;
export interface EndgeDomainPlain {
    facets: unknown[];
    facetDocuments: unknown[];
    types: unknown[];
    queries: unknown[];
    dataViews: unknown[];
    compositions: unknown[];
    stores: unknown[];
    streams: unknown[];
    simulations: unknown[];
    updates: unknown[];
    mocks: unknown[];
    components: unknown[];
    componentSFCs: unknown[];
    actions: unknown[];
    converters: unknown[];
    computations: unknown[];
    integrations: unknown[];
    folders: unknown[];
    filters: unknown[];
    policies: unknown[];
    styles: unknown[];
    configurations: unknown[];
    vocabs: unknown[];
    authProfiles: unknown[];
    i18nBundles: unknown[];
    pageTemplates: unknown[];
    pages: unknown[];
    navigations: unknown[];
}
export interface EndgePortableDocuments {
    'facets': unknown[];
    'facet-documents': unknown[];
    'folders': unknown[];
    'types': unknown[];
    'queries': unknown[];
    'data-views': unknown[];
    'compositions': unknown[];
    'stores': unknown[];
    'streams': unknown[];
    'simulations': unknown[];
    'updates': unknown[];
    'mocks': unknown[];
    'components': unknown[];
    'actions': unknown[];
    'filters': unknown[];
    'converters': unknown[];
    'computations': unknown[];
    'vocabs': unknown[];
    'i18n-bundles': unknown[];
    'auth-profiles': unknown[];
    'navigations': unknown[];
    'styles': unknown[];
    'configurations': unknown[];
}
export interface EndgeInstalledIntegrationExport {
    identity: string;
    version: string;
    configuration: Record<string, unknown>;
}
export type EndgePortableWorkspace = Omit<EndgeWorkspaceExport, 'installedIntegrations' | 'dataMode'> & {
    dataMode: 'development' | 'production';
};
export interface EndgeDomainBundle {
    schemaVersion: number;
    kind: 'workspace-snapshot';
    domainVersion?: string;
    workspace: EndgePortableWorkspace;
    installedIntegrations: EndgeInstalledIntegrationExport[];
    documents: EndgePortableDocuments;
}
```

## src/features/core/modules/domain/types/document/domain-provider.type.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/document/domain-provider.type.ts)

```ts
import type { EndgeLiveDomainDocument, EndgeLiveDomainSnapshot, EndgeWorkspaceServerState } from '@/features/core/modules/domain/types/document/domain-snapshot.type';
export type EndgeDomainCollection = 'facets' | 'facet-documents' | 'folders' | 'types' | 'queries' | 'data-views' | 'compositions' | 'stores' | 'streams' | 'simulations' | 'updates' | 'mocks' | 'components' | 'actions' | 'filters' | 'converters' | 'computations' | 'vocabs' | 'i18n-bundles' | 'auth-profiles' | 'navigations' | 'styles' | 'configurations';
export interface EndgeDomainProviderCapabilities {
    snapshot: true;
    mutations: boolean;
    softDelete: boolean;
    restore: boolean;
}
export interface EndgeDomainLoadRequest {
    workspaceIdentity: string;
    signal?: AbortSignal;
}
export interface EndgeDocumentMutationRequest {
    workspaceIdentity: string;
    collection: EndgeDomainCollection;
    identity: string;
    document?: Record<string, unknown>;
    expectedRevision?: number;
    signal?: AbortSignal;
}
export interface EndgeDocumentMutationResult {
    document: EndgeLiveDomainDocument;
    etag: string | null;
}
export interface EndgeArchivedDocument {
    type: EndgeDomainCollection;
    identity: string;
    displayName: string;
    description?: string;
    deletedAt: string;
    revision: number;
}
export interface EndgeArchiveListRequest {
    workspaceIdentity: string;
    limit?: number;
    cursor?: string;
    signal?: AbortSignal;
}
export interface EndgeArchivePage {
    items: EndgeArchivedDocument[];
    nextCursor?: string;
}
export interface EndgeDocumentMoveRequestItem {
    collection: EndgeDomainCollection;
    identity: string;
    expectedRevision: number;
}
export interface EndgeDocumentsMoveRequest {
    workspaceIdentity: string;
    documents: EndgeDocumentMoveRequestItem[];
    folderIdentity: string;
    placement: 'frontend' | 'workspace';
    signal?: AbortSignal;
}
export interface EndgeMovedDocument {
    collection: EndgeDomainCollection;
    document: EndgeLiveDomainDocument;
}
export interface EndgeDocumentsMoveResult {
    documents: EndgeMovedDocument[];
    moved: number;
}
export interface EndgeWorkspaceMutationRequest {
    workspaceIdentity: string;
    document: Record<string, unknown>;
    expectedRevision: number;
    signal?: AbortSignal;
}
export interface EndgeWorkspaceMutationResult {
    workspace: Record<string, unknown> & {
        state: EndgeWorkspaceServerState;
    };
    etag: string | null;
}
export interface EndgeFacetListRequest {
    workspaceIdentity: string;
    includeDeleted?: boolean;
    signal?: AbortSignal;
}
export interface EndgeFacetDocumentListRequest extends EndgeFacetListRequest {
    facetIdentity: string;
}
export interface EndgeFacetMutationRequest {
    workspaceIdentity: string;
    identity: string;
    document?: Record<string, unknown>;
    expectedRevision?: number;
    signal?: AbortSignal;
}
export interface EndgeFacetDocumentMutationRequest extends EndgeFacetMutationRequest {
    facetIdentity: string;
}
export interface EndgeFacetReorderItem {
    identity: string;
    expectedRevision: number;
}
export interface EndgeFacetReorderRequest {
    workspaceIdentity: string;
    items: EndgeFacetReorderItem[];
    signal?: AbortSignal;
}
export interface EndgeFacetMutationResult {
    document: EndgeLiveDomainDocument;
    etag: string | null;
}
export interface EndgeFacetReorderResult {
    documents: EndgeLiveDomainDocument[];
    etag: string | null;
}
export interface EndgeDomainProvider {
    readonly id: string;
    readonly capabilities: EndgeDomainProviderCapabilities;
    readonly etag: string | null;
    loadWorkspace: (request: EndgeDomainLoadRequest) => Promise<EndgeLiveDomainSnapshot>;
    createDocument: (request: EndgeDocumentMutationRequest) => Promise<EndgeDocumentMutationResult>;
    updateDocument: (request: EndgeDocumentMutationRequest) => Promise<EndgeDocumentMutationResult>;
    softDeleteDocument: (request: EndgeDocumentMutationRequest) => Promise<EndgeDocumentMutationResult>;
    restoreDocument: (request: EndgeDocumentMutationRequest) => Promise<EndgeDocumentMutationResult>;
    listArchivedDocuments?: (request: EndgeArchiveListRequest) => Promise<EndgeArchivePage>;
    moveDocuments?: (request: EndgeDocumentsMoveRequest) => Promise<EndgeDocumentsMoveResult>;
    updateWorkspace: (request: EndgeWorkspaceMutationRequest) => Promise<EndgeWorkspaceMutationResult>;
    listFacets?: (request: EndgeFacetListRequest) => Promise<EndgeLiveDomainDocument[]>;
    createFacet?: (request: EndgeFacetMutationRequest) => Promise<EndgeFacetMutationResult>;
    updateFacet?: (request: EndgeFacetMutationRequest) => Promise<EndgeFacetMutationResult>;
    softDeleteFacet?: (request: EndgeFacetMutationRequest) => Promise<EndgeFacetMutationResult>;
    restoreFacet?: (request: EndgeFacetMutationRequest) => Promise<EndgeFacetMutationResult>;
    reorderFacets?: (request: EndgeFacetReorderRequest) => Promise<EndgeFacetReorderResult>;
    listFacetDocuments?: (request: EndgeFacetDocumentListRequest) => Promise<EndgeLiveDomainDocument[]>;
    createFacetDocument?: (request: EndgeFacetDocumentMutationRequest) => Promise<EndgeFacetMutationResult>;
    updateFacetDocument?: (request: EndgeFacetDocumentMutationRequest) => Promise<EndgeFacetMutationResult>;
    softDeleteFacetDocument?: (request: EndgeFacetDocumentMutationRequest) => Promise<EndgeFacetMutationResult>;
    restoreFacetDocument?: (request: EndgeFacetDocumentMutationRequest) => Promise<EndgeFacetMutationResult>;
}
export type EndgeDomainRepositoryProviderId = 'service-backend' | 'bundle' | 'plain';
export interface EndgeDomainRepositoryCapabilities {
    provider: EndgeDomainRepositoryProviderId;
    mutations: boolean;
    softDelete: boolean;
    restore: boolean;
}
```

## src/features/core/modules/domain/types/document/domain-snapshot.type.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/document/domain-snapshot.type.ts)

```ts
import type { EndgeDomainBundle, EndgePortableDocuments } from '@/features/core/modules/domain/types/document/domain-export.type';
export interface EndgeSnapshotActor {
    id: string;
    username?: string;
    displayName?: string;
}
export interface EndgeDocumentServerState {
    id: string;
    revision: number;
    deletedAt?: string;
    createdBy?: EndgeSnapshotActor;
    updatedBy?: EndgeSnapshotActor;
    createdAt?: string;
    updatedAt?: string;
}
export interface EndgeWorkspaceServerState extends EndgeDocumentServerState {
    generation: string;
    headSequence: number;
}
export type EndgeLiveDomainDocument = Record<string, unknown> & {
    state: EndgeDocumentServerState;
};
export type EndgeLivePortableDocuments = {
    [K in Exclude<keyof EndgePortableDocuments, 'facets' | 'facet-documents'>]: EndgeLiveDomainDocument[];
} & {
    'facets'?: EndgeLiveDomainDocument[];
    'facet-documents'?: EndgeLiveDomainDocument[];
};
export type EndgeLiveDomainSnapshot = Omit<EndgeDomainBundle, 'documents' | 'workspace'> & {
    workspace: EndgeDomainBundle['workspace'] & {
        state: EndgeWorkspaceServerState;
    };
    documents: EndgeLivePortableDocuments;
};
```

## src/features/core/modules/domain/types/document/entity-management.type.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/document/entity-management.type.ts)

```ts
export type ManagedBy = 'system' | 'integration' | 'user';
export interface EntityRef {
    type: string;
    identity: string;
}
export type EntityOrigin = {
    kind: 'storage';
} | {
    kind: 'builtin';
    owner: string;
} | {
    kind: 'local';
    owner: string;
} | {
    kind: 'derived';
    source: EntityRef;
};
export declare function isPersistedEntityOrigin(origin: EntityOrigin | null | undefined): boolean;
export interface EntityManagement {
    managedBy: ManagedBy;
    managedById: string | null;
}
export type EntityManagementLike = Partial<EntityManagement> | null | undefined;
export declare function normalizeEntityManagement(value: EntityManagementLike): EntityManagement;
export declare function isSystemManaged(value: EntityManagementLike): boolean;
export declare function isIntegrationManaged(value: EntityManagementLike): boolean;
export declare function isUserManaged(value: EntityManagementLike): boolean;
export declare function isExternallyManaged(value: EntityManagementLike): boolean;
```

## src/features/core/modules/domain/types/document/filter.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/document/filter.types.ts)

```ts
export interface FilterStaticOptionSchema {
    value: string;
    label?: string;
}
export type FilterFieldMode = 'static' | 'vocab' | 'date' | 'time' | 'datetime' | 'boolean' | 'string' | 'number';
export interface FilterFieldItemSchema {
    key: string;
    label?: string;
    mode: FilterFieldMode;
    staticOptions?: FilterStaticOptionSchema[];
    vocabIdentity?: string;
    vocabCollection?: string;
    valuePath?: string;
    displayNamePath?: string;
    multiple?: boolean;
    converterIdentities?: string[];
    defaultValue?: string;
    active?: boolean;
}
export interface RFilterSchema {
    identity: string;
    displayName: string;
    fields?: FilterFieldItemSchema[];
    source?: string;
    sourceVersion?: number;
    folder?: string | null;
    folderId?: number | string | null;
    author?: string | null;
    active?: boolean;
    deletedAt?: string | null;
    meta?: Record<string, unknown>;
}
```

## src/features/core/modules/domain/types/document/navigation.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/document/navigation.types.ts)

```ts
import type { EntityManagement } from './entity-management.type';
interface NavigationTreeNodeBaseDoc {
    id?: string | null;
    title: string;
    icon?: string | null;
    hidden?: boolean;
    disabled?: boolean;
    collapsedTitle?: string | null;
    path?: string | null;
    routeName?: string | null;
    external?: boolean;
}
export interface NavigationSectionNodeDoc extends NavigationTreeNodeBaseDoc {
    type: 'section';
    children?: NavigationTreeNodeDoc[];
}
export interface NavigationGroupNodeDoc extends NavigationTreeNodeBaseDoc {
    type: 'group';
    children?: NavigationTreeNodeDoc[];
}
export interface NavigationLinkNodeDoc extends NavigationTreeNodeBaseDoc {
    type: 'link';
}
export type NavigationTreeNodeDoc = NavigationSectionNodeDoc | NavigationGroupNodeDoc | NavigationLinkNodeDoc;
export interface NavigationDoc extends EntityManagement {
    id: number | string;
    identity: string;
    displayName: string;
    description?: string | null;
    folder?: number | string;
    tree?: NavigationTreeNodeDoc[];
    meta?: Record<string, unknown>;
}
export {};
```

## src/features/core/modules/domain/types/document/query.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/domain/types/document/query.types.ts)

```ts
export type RQueryAuthMode = 'none' | 'inherit' | 'profile';
export interface RQueryAuth {
    mode: RQueryAuthMode;
    profile?: string;
    scheme?: string;
    headerName?: string;
    sendAs?: 'header' | 'query';
    queryParamName?: string;
}
```
