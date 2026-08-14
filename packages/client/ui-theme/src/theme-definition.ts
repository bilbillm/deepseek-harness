/** Shared theme definition types used by the Host bootstrap and browser runtime. */

/** Theme token dictionary keyed by CSS custom-property name. */
export type ThemeTokens = Record<string, string>

/** One selectable theme: id, native color-scheme semantics, and token overrides. */
export interface ThemeDefinition {
  /** Theme id used by the registry and persisted preference. */
  id: string
  /** Native light or dark palette semantics for browser controls. */
  colorScheme: 'light' | 'dark'
  /** Token overrides applied over the base palette. */
  tokens: ThemeTokens
}
