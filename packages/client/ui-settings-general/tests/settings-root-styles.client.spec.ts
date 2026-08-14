import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(
  fileURLToPath(new URL('../src/client/SettingsRoot.module.css', import.meta.url)),
  'utf8',
)

describe('SettingsRoot responsive styles', () => {
  it('gives narrow dialogs a full-width content column and compact top navigation', () => {
    const mobile = css.slice(css.indexOf('@media (max-width: 600px)'))
    expect(mobile).toContain('.panel {\n    flex-direction: column;')
    expect(mobile).toContain('grid-template-columns: repeat(2, minmax(0, 1fr));')
    expect(mobile).toContain('.nav {\n    width: 100%;')
    expect(mobile).toContain('.options {\n    padding: 16px 16px 24px;')
  })
})
