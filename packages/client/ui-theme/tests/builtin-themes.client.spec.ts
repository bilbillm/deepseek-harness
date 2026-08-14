import { globSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { BUILTIN_THEMES } from '../src/builtin-themes.ts'

const REPOSITORY_ROOT = fileURLToPath(new URL('../../../../', import.meta.url))
const THEME_TOKEN_NAME = '--(?:dsw-(?:alias|specific|linear|shadow)[\\w-]*|shiki-token-[\\w-]+)'
const THEME_TOKEN_DECLARATION = new RegExp(`^\\s*(${THEME_TOKEN_NAME})\\s*:`, 'gm')
const THEME_TOKEN_USE = new RegExp(`var\\(\\s*(${THEME_TOKEN_NAME})\\s*(?:,|\\))`, 'g')

/** Semantic CSS variables declared or consumed by the assembled Web client. */
function clientThemeVocabulary(): string[] {
  const names = new Set<string>()
  for (const relative of globSync('packages/client/**/src/**/*.css', { cwd: REPOSITORY_ROOT })) {
    const css = readFileSync(resolve(REPOSITORY_ROOT, relative), 'utf8')
    for (const [, name] of css.matchAll(THEME_TOKEN_DECLARATION)) {
      if (name !== undefined) names.add(name)
    }
    for (const [, name] of css.matchAll(THEME_TOKEN_USE)) {
      if (name !== undefined) names.add(name)
    }
  }
  return [...names].sort()
}

const angelinaThemes = BUILTIN_THEMES.filter(theme => theme.id.startsWith('angelina-'))

describe('Angelina built-in themes', () => {
  it('ships one frozen definition for each color scheme', () => {
    expect(angelinaThemes.map(theme => [theme.id, theme.colorScheme])).toEqual([
      ['angelina-light', 'light'],
      ['angelina-dark', 'dark'],
    ])
    for (const theme of angelinaThemes) {
      expect(Object.isFrozen(theme)).toBe(true)
      expect(Object.isFrozen(theme.tokens)).toBe(true)
    }
  })

  it('covers exactly the semantic token vocabulary used by the Web client', () => {
    const vocabulary = clientThemeVocabulary()
    expect(vocabulary.length).toBeGreaterThan(0)
    for (const theme of angelinaThemes) {
      expect(Object.keys(theme.tokens).sort(), theme.id).toEqual(vocabulary)
      for (const [name, value] of Object.entries(theme.tokens)) {
        expect(value.trim(), `${theme.id} ${name}`).not.toBe('')
      }
    }
  })
})
