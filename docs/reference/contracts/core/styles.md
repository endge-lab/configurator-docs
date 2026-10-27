---
description: "TypeScript-декларации @endge/core 1.0.0-dev.11, группа styles; исходных модулей: 4."
---

# @endge/core: styles

Версия source: 1.0.0-dev.11. [Каталог package](./). [Repository](https://github.com/endge-lab/core).

## src/features/core/modules/styles/domain/types/style.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/styles/domain/types/style.types.ts)

```ts
export interface EndgeStyleSourceRange {
    start: number;
    end: number;
    line: number;
    column: number;
}
export interface EndgeStyleDiagnostic {
    severity: 'info' | 'warning' | 'error';
    code: string;
    message: string;
    range?: EndgeStyleSourceRange;
}
export interface EndgeStyleSpecificity {
    ids: number;
    classes: number;
    types: number;
}
export type EndgeStyleCombinator = 'descendant' | 'child' | 'adjacent' | 'sibling';
export type EndgeStyleAttributeOperator = 'exists' | '=' | '~=' | '|=' | '^=' | '$=' | '*=';
export interface EndgeStyleAttributeSelector {
    name: string;
    operator: EndgeStyleAttributeOperator;
    value?: string;
    insensitive?: boolean;
}
export type EndgeStylePseudoSelector = {
    name: 'first-child' | 'last-child';
} | {
    name: 'nth-child';
    expression: string;
} | {
    name: 'component' | 'identity' | 'state';
    value: string;
} | {
    name: 'not' | 'is' | 'where';
    selectors: EndgeStyleSelector[];
} | {
    name: 'part';
    value: string;
    element: true;
};
export interface EndgeStyleCompoundSelector {
    tag?: string;
    universal?: boolean;
    ids: string[];
    classes: string[];
    attributes: EndgeStyleAttributeSelector[];
    pseudos: EndgeStylePseudoSelector[];
}
export interface EndgeStyleSelectorSegment {
    combinator: EndgeStyleCombinator | null;
    compound: EndgeStyleCompoundSelector;
}
export interface EndgeStyleSelector {
    source: string;
    segments: EndgeStyleSelectorSegment[];
    specificity: EndgeStyleSpecificity;
}
export interface EndgeStyleValueToken {
    type: 'word' | 'string' | 'space' | 'divider' | 'function' | 'comment';
    value: string;
    nodes?: EndgeStyleValueToken[];
}
export interface EndgeStyleDeclaration {
    property: string;
    value: string;
    valueTokens: EndgeStyleValueToken[];
    important: boolean;
    range?: EndgeStyleSourceRange;
}
export type EndgeStyleSupportCondition = {
    type: 'renderer';
    renderer: string;
} | {
    type: 'capability';
    capability: string;
} | {
    type: 'not';
    operand: EndgeStyleSupportCondition;
} | {
    type: 'and' | 'or';
    operands: EndgeStyleSupportCondition[];
};
export interface EndgeStyleScope {
    root: EndgeStyleSelector[];
    limit?: EndgeStyleSelector[];
}
export interface EndgeStyleRule {
    id: string;
    selectors: EndgeStyleSelector[];
    declarations: EndgeStyleDeclaration[];
    theme?: string;
    scope?: EndgeStyleScope;
    supports?: EndgeStyleSupportCondition;
    sourceOrder: number;
    range?: EndgeStyleSourceRange;
}
export interface EndgeStyleTheme {
    id: string;
    declarations: EndgeStyleDeclaration[];
    range?: EndgeStyleSourceRange;
}
export interface EndgeStyleRuleIndex {
    universal: string[];
    tags: Record<string, string[]>;
    classes: Record<string, string[]>;
    ids: Record<string, string[]>;
    components: Record<string, string[]>;
    identities: Record<string, string[]>;
    states: Record<string, string[]>;
    parts: Record<string, string[]>;
}
export interface EndgeStyleSheetArtifact {
    language: 'endgecss';
    version: 1;
    identity: string;
    sourceHash: string;
    scope: 'global' | 'component';
    scopeId?: string;
    rules: EndgeStyleRule[];
    themes: EndgeStyleTheme[];
    indexes: EndgeStyleRuleIndex;
}
export interface EndgeStyleAst {
    type: 'stylesheet';
    source: string;
    nodes: unknown[];
}
export interface CompileEndgeCSSOptions {
    identity?: string;
    scope?: 'global' | 'component';
    scopeId?: string;
    maxNestedSelectors?: number;
}
export interface CompileEndgeCSSResult {
    ast: EndgeStyleAst | null;
    artifact: EndgeStyleSheetArtifact | null;
    diagnostics: EndgeStyleDiagnostic[];
}
export interface EndgeStyleTargetProfile {
    renderer: string;
    capabilities?: Iterable<string>;
}
export interface EndgeStyleMatchNode {
    tag: string;
    id?: string;
    classes: ReadonlySet<string>;
    attributes: Readonly<Record<string, unknown>>;
    states: ReadonlySet<string>;
    parts: ReadonlySet<string>;
    component?: string;
    identity?: string;
    ownerScopeId?: string;
    runtimeScopeIds?: ReadonlySet<string>;
    parent?: EndgeStyleMatchNode;
    previousSibling?: EndgeStyleMatchNode;
    index: number;
    siblingCount: number;
}
export interface EndgeStyleResolvedDeclaration extends EndgeStyleDeclaration {
    ruleId: string;
    specificity: EndgeStyleSpecificity;
    sourceOrder: number;
}
export interface EndgeStylePlacement {
    id: string;
    artifactIdentity: string;
    artifact: EndgeStyleSheetArtifact;
    ownerScopeIds: readonly string[];
    boundaryId: string;
    orderKey: string;
    state: 'active' | 'suspended';
    referenceCount: number;
}
export interface AcquireEndgeStyleOptions {
    artifactIdentity?: string;
    artifact?: EndgeStyleSheetArtifact;
    ownerScopeId: string;
    boundaryId: string;
    orderKey?: string;
}
export interface EndgeStyleLease {
    readonly id: string;
    readonly kind: 'style';
    readonly artifactIdentity: string;
    readonly ownerScopeId: string;
    readonly boundaryId: string;
    readonly orderKey: string;
    readonly suspended: boolean;
    suspend: () => void;
    resume: () => void;
    release: () => void;
    pause: () => void;
    dispose: () => void;
}
```

## src/features/core/modules/styles/EndgeStyles_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/styles/EndgeStyles_Module.ts)

```ts
import type { AcquireEndgeStyleOptions, EndgeStyleLease, EndgeStyleMatchNode, EndgeStylePlacement, EndgeStyleResolvedDeclaration, EndgeStyleSheetArtifact, EndgeStyleTargetProfile } from '@/features/core/modules/styles/domain/types/style.types';
import { EndgeModule } from '@/features/federation/EndgeModule';
export interface EndgeStyleResolver {
    readonly target: EndgeStyleTargetProfile;
    resolve: (node: EndgeStyleMatchNode, theme?: string) => Record<string, EndgeStyleResolvedDeclaration>;
}
export declare class EndgeStyles_Module extends EndgeModule {
    start(): void;
    getAvailableArtifacts(): EndgeStyleSheetArtifact[];
    getActivePlacements(): EndgeStylePlacement[];
    getActiveArtifacts(): EndgeStyleSheetArtifact[];
    acquireStyle(options: AcquireEndgeStyleOptions): EndgeStyleLease;
    transaction<T>(operation: () => T): T;
    createResolver(target: EndgeStyleTargetProfile): EndgeStyleResolver;
    reset(): void;
}
```

## src/features/core/modules/styles/services/endgecss-compile.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/styles/services/endgecss-compile.ts)

```ts
import type { CompileEndgeCSSOptions, CompileEndgeCSSResult, EndgeStyleSelector, EndgeStyleSupportCondition } from '@/features/core/modules/styles/domain/types/style.types';
export declare function parseEndgeStyleSelectorList(source: string): EndgeStyleSelector[];
export declare function parseEndgeStyleSupportCondition(source: string): EndgeStyleSupportCondition;
export declare function compileEndgeCSS(source: string, options?: CompileEndgeCSSOptions): CompileEndgeCSSResult;
```

## src/features/core/modules/styles/services/endgecss-match.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/styles/services/endgecss-match.ts)

```ts
import type { EndgeStyleMatchNode, EndgeStyleResolvedDeclaration, EndgeStyleRule, EndgeStyleSelector, EndgeStyleSheetArtifact, EndgeStyleSupportCondition, EndgeStyleTargetProfile } from '@/features/core/modules/styles/domain/types/style.types';
export declare function matchEndgeStyleSelector(selector: EndgeStyleSelector, node: EndgeStyleMatchNode): boolean;
export declare function evaluateEndgeStyleSupport(condition: EndgeStyleSupportCondition | undefined, target: EndgeStyleTargetProfile): boolean;
export declare function matchEndgeStyleRule(artifact: EndgeStyleSheetArtifact, rule: EndgeStyleRule, node: EndgeStyleMatchNode, target: EndgeStyleTargetProfile, theme?: string): EndgeStyleSelector[];
export declare function resolveEndgeStyleDeclarations(artifacts: readonly EndgeStyleSheetArtifact[], node: EndgeStyleMatchNode, target: EndgeStyleTargetProfile, theme?: string): Record<string, EndgeStyleResolvedDeclaration>;
```
