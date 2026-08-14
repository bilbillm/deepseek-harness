# Agent Note: Built-in Angelina light and dark themes

Status: implemented

English | [中文](2026-08-14-angelina-themes.zh.md)

## Problem

The Codex Dream Skin Switcher carries two coordinated Angelina presentations: Gravity Field for light mode and Midnight Gravity for dark mode. They are not only wallpapers. Each pairs a hero image, a softened active-conversation image, readable surfaces, semantic colors, code syntax, scrollbars, and responsive subject positioning. DeepSeek Harness exposed only Light, Dark, and System as durable product preferences, so copying a wallpaper into one feature stylesheet would leave most surfaces on the stock palette, flash the neutral palette before plugins loaded, and provide no paired selection or persistence contract.

## Decision

The fork ships `angelina-light` and `angelina-dark` as first-class built-in preferences beside Light, Dark, and System. This is intentionally different from a third-party theme package: both ids enter the Host settings schema, appear in the existing Appearance row, persist through `ui-theme.preference`, and participate in the synchronous index bootstrap. The existing `ThemeRuntime.register()` extension remains unchanged for external themes.

Each Angelina definition overrides exactly the semantic CSS-variable vocabulary declared or consumed by the assembled Web client. A repository-scanning test derives that vocabulary from package styles, requires both definitions to cover the same complete set, and rejects stale or unused entries. The definitions are frozen and retain their own `colorScheme`, so native controls and the stock dark-palette attribute never infer scheme from an id string.

The global `angelina.css` sheet owns the image presentation. ui-layout and ui-conversation expose theme-neutral state markers for the app frame, conversation column, and composer mode; feature styles do not branch on Angelina ids. Empty conversations use the sharp hero image with a left-side composer safe area, active conversations use the softened thread image, and narrow viewports move the focal point and return the composer to centered flow. Four raster assets live under the theme package and are copied with the published style artifact.

At 600px and below, the shared Settings shell stacks its fixed rail into a compact two-by-two top navigation. This preserves a readable options column and lets the five Appearance previews remain selectable without horizontal overflow.

The Host bootstrap applies the selected Angelina tokens and resolved theme attribute before the shell paints. It also records the exact inline token names in a transient handoff attribute. ThemePresenter retracts that set atomically on its first apply before writing the client snapshot, preventing an Angelina-to-neutral startup transition from retaining old variables while still preserving unrelated inline styles.

## Reference implementations

[orxz/deepseek-harness-themes](https://github.com/orxz/deepseek-harness-themes) confirmed the native `ThemeDefinition` and registry shape, the semantic-token-only boundary, complete-token testing, and the rule that ordinary third-party ids require their own persistence namespace. [TQSY114514/dsh-ui-appearance](https://github.com/TQSY114514/dsh-ui-appearance) confirmed explicit ownership and cleanup for token overrides, image layers, and glass effects. [xiaoloveying/deepseek_harness_theme](https://github.com/xiaoloveying/deepseek_harness_theme) demonstrated a self-contained wallpaper plugin and profile installation path, but its single forced-dark presentation does not satisfy a paired built-in preference or first-paint bootstrap. The image compositions come from [bilbillm/Codex-Dream-Skin-Switcher](https://github.com/bilbillm/Codex-Dream-Skin-Switcher).

## Alternatives considered

**Ship a standalone third-party plugin.** Rejected for this fork: it would load after the shell, use a second settings row or settings namespace, and could not make the selected wallpaper palette authoritative during the pre-plugin interval. The registry path remains the right answer for independently distributed themes.

**Inject one fixed background layer and leave stock tokens in place.** Rejected: the Codex themes coordinate background art with every major semantic surface. Stock blue-gray panels over the Angelina imagery reduce contrast and make the result a wallpaper overlay rather than a theme.

**Branch inside individual feature stylesheets.** Rejected: feature packages should expose state, not know theme ids. One theme-owned global sheet keeps removal, responsive behavior, and future theme additions bounded to the theme package.

## Consequences

The Appearance row now presents five responsive previews and persists either Angelina variant through the same Host-backed path as the neutral preferences. First paint, the loading shell, empty conversations, active conversations, settings surfaces, code blocks, and native browser chrome share one resolved scheme and token authority. The Web bundle grows by four images and one stylesheet; the asset-copy contract and CSS references are tested. Changing the Web semantic-token vocabulary now requires updating both Angelina palettes deliberately.

## Testing

Unit coverage pins the five-value settings schema, bootstrap theme id and token handoff, ThemeRuntime persistence, five-preview settings row, ThemePresenter cleanup, complete token vocabulary, stylesheet imports, and all four published image references. Type checking and full package builds cover the Host/client boundary and emitted assets. Browser acceptance covers both themes on desktop and mobile across empty conversation, active conversation, and Settings states.
