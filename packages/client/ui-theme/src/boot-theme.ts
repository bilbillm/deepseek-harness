/**
 * Host-rendered theme bootstrap for the browser's pre-plugin interval. Each
 * index response embeds the current durable built-in preference; the browser
 * resolves only `system`, then writes the same DOM fields ui-layout's
 * ThemePresenter owns after the client plugin tree activates.
 */

import {
  DEFAULT_PREFERENCE, THEME_BOOTSTRAP_PREFERENCE_ATTRIBUTE,
  THEME_BOOTSTRAP_TOKENS_ATTRIBUTE, type ThemePreference,
} from './theme-settings.ts'
import { BUILTIN_THEMES } from './builtin-themes.ts'

/** Build the inline script for one schema-validated built-in preference. */
function bootThemeScript(preference: ThemePreference): string {
  const tokens = preference === 'system'
    ? {}
    : BUILTIN_THEMES.find(theme => theme.id === preference)?.tokens ?? {}
  return `<script>(() => {
  const preference = ${JSON.stringify(preference)}
  const tokens = ${JSON.stringify(tokens)}
  const systemDark = preference === 'system'
    && typeof matchMedia !== 'undefined'
    && matchMedia('(prefers-color-scheme: dark)').matches
  const themeId = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference
  const dark = themeId === 'dark' || themeId === 'angelina-dark'
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
  document.body.toggleAttribute('data-ds-dark-theme', dark)
  document.body.setAttribute('data-ds-theme', themeId)
  document.body.setAttribute(${JSON.stringify(THEME_BOOTSTRAP_PREFERENCE_ATTRIBUTE)}, preference)
  document.body.setAttribute(${JSON.stringify(THEME_BOOTSTRAP_TOKENS_ATTRIBUTE)}, Object.keys(tokens).join(' '))
  for (const [name, value] of Object.entries(tokens)) {
    document.body.style.setProperty(name, value)
  }
})()</script>`
}

/**
 * Insert the theme bootstrap immediately after the opening body tag, before
 * the shell mount and module script. Body-less fragments receive it at the
 * end, where the HTML parser has already synthesized a body.
 * @param html - Raw application index HTML.
 * @param preference - Current Host-backed built-in preference.
 * @returns HTML containing the theme bootstrap.
 */
export function injectBootTheme(
  html: string,
  preference: ThemePreference = DEFAULT_PREFERENCE,
): string {
  const script = bootThemeScript(preference)
  const body = /<body(?:\s[^>]*)?>/i.exec(html)
  if (body === null) return `${html}${script}`
  const at = body.index + body[0].length
  return `${html.slice(0, at)}${script}${html.slice(at)}`
}
