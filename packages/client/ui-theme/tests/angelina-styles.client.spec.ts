import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const angelinaCss = readFileSync(
  fileURLToPath(new URL('../src/styles/angelina.css', import.meta.url)),
  'utf8',
)

describe('Angelina hero composition', () => {
  it('leaves composer placement and interface copy motion to the host', () => {
    expect(angelinaCss).not.toContain("[data-ds-composer-mode='hero']")
    expect(angelinaCss).not.toContain('--dsh-angelina-copy-parallax-')
  })
})
