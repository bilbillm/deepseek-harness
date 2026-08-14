import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const angelinaCss = readFileSync(
  fileURLToPath(new URL('../src/styles/angelina.css', import.meta.url)),
  'utf8',
)

describe('Angelina hero composition', () => {
  it('keeps hero, settling, and active conversations on one artwork coordinate system', () => {
    expect(angelinaCss).toContain(`body[data-ds-theme^='angelina-'] [data-ds-conversation-column] [data-phase='hero'],
body[data-ds-theme^='angelina-'] [data-ds-conversation-column] [data-phase='settling'],
body[data-ds-theme^='angelina-'] [data-ds-conversation-column] [data-phase='active'] {
  background-image: var(--dsh-angelina-app-scrim), var(--dsh-angelina-hero-image);
}`)
    expect(angelinaCss).toContain(`body[data-dsh-angelina-parallax] [data-ds-conversation-column] [data-phase='hero'],
body[data-dsh-angelina-parallax] [data-ds-conversation-column] [data-phase='settling'],
body[data-dsh-angelina-parallax] [data-ds-conversation-column] [data-phase='active'] {
  background-image: var(--dsh-angelina-app-scrim);
}`)
    expect(angelinaCss).not.toContain('--dsh-angelina-thread-')
  })

  it('leaves composer placement and interface copy motion to the host', () => {
    expect(angelinaCss).not.toContain("[data-ds-composer-mode='hero']")
    expect(angelinaCss).not.toContain('--dsh-angelina-copy-parallax-')
  })
})
