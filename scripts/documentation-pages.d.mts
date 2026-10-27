/** Типы для `documentation-pages.mjs`: модуль используют конфигурация VitePress и тема. */
export declare const EXCLUDED_ROOTS: readonly string[]
export declare const DESCRIPTION_LIMIT: number
export declare function isPublicDocumentationPage(relativePath: string | undefined): boolean
export declare function splitFrontmatter(source: string): { frontmatter: string, body: string }
export declare function normalizeDescription(value: unknown): string
export declare function autoDescription(markdown: string): string
export declare function withoutStraightQuotes(value: string): string
