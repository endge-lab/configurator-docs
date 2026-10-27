---
description: "TypeScript-декларации @endge/core 1.0.0-dev.12, группа auth; исходных модулей: 7."
---

# @endge/core: auth

Версия source: 1.0.0-dev.12. [Каталог package](./). [Repository](https://github.com/endge-lab/core).

## src/features/core/modules/auth/adapters/OidcBrowserSession_Adapter.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/auth/adapters/OidcBrowserSession_Adapter.ts)

```ts
import type { AuthSessionSource, AuthSessionSourceResolveOptions, AuthTokenSet, OidcBrowserSessionOptions } from '@/features/core/modules/auth/domain/types/auth-profile.types';
export declare class OidcBrowserSession_Adapter implements AuthSessionSource {
    readonly options: OidcBrowserSessionOptions;
    constructor(options: OidcBrowserSessionOptions);
    hasSession(): Promise<boolean>;
    loginPopup(): Promise<AuthTokenSet>;
    static completeStoredPopupCallback(url?: string): Promise<void>;
    loginRedirect(): Promise<never>;
    completeRedirectCallback(url?: string): Promise<AuthTokenSet>;
    completePopupCallback(url?: string): Promise<void>;
    resolveToken(options: AuthSessionSourceResolveOptions): Promise<AuthTokenSet | null>;
    loadUserInfo(): Promise<Record<string, unknown> | null>;
    logout(): Promise<void>;
}
export { OidcBrowserSession_Adapter as OidcBrowserSession_Service };
```

## src/features/core/modules/auth/domain/AuthInteractionRequiredError.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/auth/domain/AuthInteractionRequiredError.ts)

```ts
export declare class AuthInteractionRequiredError extends Error {
    readonly profileIdentity: string;
    readonly code = "auth_interaction_required";
    constructor(profileIdentity: string);
}
```

## src/features/core/modules/auth/domain/types/auth-profile.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/auth/domain/types/auth-profile.types.ts)

```ts
export type AuthProfileAdapterId = 'oidc' | 'oauth2-client-credentials' | 'oauth2-password' | 'basic' | 'bearer' | (string & {});
export type AuthSessionStorage = 'localStorage' | 'sessionStorage' | 'memory';
export interface AuthSessionPolicy {
    storage: AuthSessionStorage;
    persistRefreshToken: boolean;
}
export interface AuthProfileConfig {
    [key: string]: unknown;
}
export interface AuthProfileCredentials {
    [key: string]: string;
}
export interface AuthProfileBase {
    id: string;
    identity: string;
    name: string;
    description?: string;
    active: boolean;
    adapterId: string;
    config: Record<string, unknown>;
    credentials: Record<string, string>;
}
export interface OidcAuthProfile extends AuthProfileBase {
    adapterId: 'oidc';
    config: {
        issuer: string;
        clientId: string;
        scopes: string[];
    };
    credentials: Record<string, never>;
    session: AuthSessionPolicy;
}
export interface OAuth2ClientCredentialsProfile extends AuthProfileBase {
    adapterId: 'oauth2-client-credentials';
    config: {
        tokenEndpoint: string;
        clientId: string;
        scopes: string[];
        clientAuthentication: 'client_secret_basic' | 'client_secret_post';
    };
    credentials: {
        clientSecret: string;
    };
    session: AuthSessionPolicy;
}
export interface OAuth2PasswordProfile extends AuthProfileBase {
    adapterId: 'oauth2-password';
    config: {
        tokenEndpoint: string;
        clientId: string;
        scopes: string[];
    };
    credentials: {
        username: string;
        password: string;
    };
    session: AuthSessionPolicy;
}
export interface BasicAuthProfile extends AuthProfileBase {
    adapterId: 'basic';
    config: Record<string, never>;
    credentials: {
        username: string;
        password: string;
    };
    session?: never;
}
export interface BearerAuthProfile extends AuthProfileBase {
    adapterId: 'bearer';
    config: Record<string, never>;
    credentials: {
        token: string;
    };
    session?: never;
}
export type AuthProfile = OidcAuthProfile | OAuth2ClientCredentialsProfile | OAuth2PasswordProfile | BasicAuthProfile | BearerAuthProfile;
export interface AuthProfileSchema {
    id: string | number;
    identity: string;
    name: string;
    displayName: string;
    description?: string | null;
    adapterId: AuthProfileAdapterId;
    config: AuthProfileConfig;
    credentials: AuthProfileCredentials;
    session?: AuthSessionPolicy;
    folderId?: string | number | null;
    active: boolean;
    deletedAt?: string | null;
    meta?: Record<string, unknown>;
}
export interface AuthTokenSet {
    accessToken: string;
    refreshToken?: string;
    idToken?: string;
    sessionState?: string;
    accessExpiresAt: number | null;
    refreshExpiresAt?: number | null;
    headers?: Record<string, string>;
}
export interface AuthResolvedSession {
    profileIdentity: string | null;
    accessToken?: string;
    headers: Record<string, string>;
    expiresAt: number | null;
    subject?: string;
    sessionId?: string;
}
export type AuthRequestPolicy = {
    mode: 'none';
} | {
    mode: 'inherit';
} | {
    mode: 'profile';
    profile: string;
};
export interface AuthResolveOptions {
    forceRefresh?: boolean;
}
export interface AuthEnsureOptions {
    forceRefresh?: boolean;
}
export interface AuthSessionSourceResolveOptions {
    forceRefresh: boolean;
    minValiditySeconds: number;
}
export interface AuthSessionSource {
    resolveToken: (options: AuthSessionSourceResolveOptions) => Promise<AuthTokenSet | null>;
    logout?: () => Promise<void>;
    loadUserInfo?: () => Promise<Record<string, unknown> | null>;
}
export interface EndgeAuthContext {
    authenticated: boolean;
    subject?: string;
    sessionId?: string;
    profileIdentity?: string;
}
export interface EndgeAuthBootOptions {
    storageNamespace?: string;
    facetClaims?: Readonly<Record<string, EndgeFacetClaimMapping>>;
}
export interface EndgeFacetClaimMapping {
    claim: string;
    map?: Readonly<Record<string, string>>;
    missing?: 'default' | 'error';
}
export type EndgeFacetClaimIssueReason = 'missing' | 'unmapped' | 'invalid';
export interface EndgeFacetClaimResolution {
    selections: Readonly<Record<string, string>>;
    issues: readonly EndgeFacetClaimIssue[];
}
export interface EndgeFacetClaimIssue {
    facet: string;
    claim: string;
    reason: EndgeFacetClaimIssueReason;
    missing: 'default' | 'error';
}
export interface AuthAdapterContext {
    profile: AuthProfileSchema;
    token?: AuthTokenSet;
    signal?: AbortSignal;
    resolveValue: (value: unknown) => string;
    resolveCredential: (credential: string) => Promise<string>;
}
export interface AuthProfileAdapter {
    id: AuthProfileAdapterId;
    label: string;
    validate: (profile: AuthProfileSchema) => void;
    authenticate: (context: AuthAdapterContext) => Promise<AuthTokenSet>;
    refresh?: (context: AuthAdapterContext) => Promise<AuthTokenSet>;
    logout?: (context: AuthAdapterContext) => Promise<void>;
    loadUserInfo?: (context: AuthAdapterContext) => Promise<Record<string, unknown> | null>;
}
export interface AuthProfileTestResult {
    authenticated: boolean;
    profileIdentity: string;
    expiresAt: number | null;
    context: EndgeAuthContext;
    userInfo: Record<string, unknown> | null;
}
export interface OidcBrowserSessionOptions {
    issuer: string;
    clientId: string;
    scopes: string[];
    redirectUri: string;
    popupRedirectUri?: string;
    postLogoutRedirectUri?: string;
    session: AuthSessionPolicy;
    storageNamespace: string;
    profileIdentity: string;
    flow: 'popup' | 'redirect';
}
```

## src/features/core/modules/auth/domain/types/auth-runtime.types.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/auth/domain/types/auth-runtime.types.ts)

```ts
import type { AuthProfileAdapterId, AuthTokenSet } from '@/features/core/modules/auth/domain/types/auth-profile.types';
export interface AuthSessionSnapshot {
    version: 1;
    profileIdentity: string;
    adapterId: AuthProfileAdapterId;
    token: AuthTokenSet;
    updatedAt: string;
}
export interface AuthSessionState {
    token: AuthTokenSet;
    userInfo: Record<string, unknown> | null;
}
```

## src/features/core/modules/auth/EndgeAuth_Module.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/auth/EndgeAuth_Module.ts)

```ts
import type { EndgeBootContext } from '@/features/core/kernel/types/bootstrap.types';
import type { AuthInteractionRequiredError } from '@/features/core/modules/auth/domain/AuthInteractionRequiredError';
import type { AuthProfileSchema, EndgeAuthContext, EndgeFacetClaimResolution, OidcBrowserSessionOptions } from '@/features/core/modules/auth/domain/types/auth-profile.types';
import { OidcBrowserSession_Adapter } from '@/features/core/modules/auth/adapters/OidcBrowserSession_Adapter';
import { AuthAdapterRegistry } from '@/features/core/modules/auth/services/AuthAdapterRegistry';
import { AuthProfileRegistry } from '@/features/core/modules/auth/services/AuthProfileRegistry';
import { AuthRequestResolver } from '@/features/core/modules/auth/services/AuthRequestResolver';
import { AuthSessionManager } from '@/features/core/modules/auth/services/AuthSessionManager';
import { EndgeModule } from '@/features/federation/EndgeModule';
export type AuthInteractionRequiredListener = (error: AuthInteractionRequiredError) => void;
export declare class EndgeAuth_Module extends EndgeModule<EndgeBootContext> {
    readonly adapters: AuthAdapterRegistry;
    readonly profiles: AuthProfileRegistry;
    readonly session: AuthSessionManager;
    readonly requests: AuthRequestResolver;
    constructor();
    onInteractionRequired(listener: AuthInteractionRequiredListener): () => void;
    createDiagnosticsSnapshot(): EndgeAuthContext;
    setup(ctx: EndgeBootContext): void;
    facetClaimResolution(): EndgeFacetClaimResolution;
    build(): void;
    reset(): void;
    createOidcSessionSource(profileInput: AuthProfileSchema | string, options: Pick<OidcBrowserSessionOptions, 'redirectUri' | 'popupRedirectUri' | 'postLogoutRedirectUri' | 'flow'>): OidcBrowserSession_Adapter;
}
```

## src/features/core/modules/auth/services/auth-context.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/auth/services/auth-context.ts)

```ts
import type { EndgeAuthContext } from '@/features/core/modules/auth/domain/types/auth-profile.types';
export interface EndgeAuthContextSource {
    authenticated: boolean;
    accessToken?: string;
    idToken?: string;
    sessionState?: string;
    profileIdentity?: string;
    userInfo?: unknown;
}
export declare function decodeJwtClaims(token: string | null | undefined): Record<string, unknown> | null;
export declare function createEndgeAuthContext(source: EndgeAuthContextSource): EndgeAuthContext;
```

## src/features/core/modules/auth/services/auth-facet-claims.ts

[Исходный модуль](https://github.com/endge-lab/core/blob/main/src/features/core/modules/auth/services/auth-facet-claims.ts)

```ts
import type { EndgeFacetClaimIssue, EndgeFacetClaimMapping, EndgeFacetClaimResolution } from '@/features/core/modules/auth/domain/types/auth-profile.types';
export declare function normalizeFacetClaimMappings(input: Readonly<Record<string, EndgeFacetClaimMapping>> | null | undefined): Readonly<Record<string, Required<Pick<EndgeFacetClaimMapping, 'claim' | 'missing'>> & Pick<EndgeFacetClaimMapping, 'map'>>>;
export declare function resolveFacetSelectionsFromClaims(mappings: ReturnType<typeof normalizeFacetClaimMappings>, claims: Readonly<Record<string, unknown>>, authenticated: boolean): EndgeFacetClaimResolution;
export declare function readClaim(claims: Readonly<Record<string, unknown>>, claim: string): unknown;
export declare function describeFacetClaimIssue(issue: EndgeFacetClaimIssue): string;
```
