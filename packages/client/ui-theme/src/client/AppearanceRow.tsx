/**
 * Appearance preference row registered into the General section item slot
 * (figma 501:30012 'Frame 2117131228'): title + preference previews.
 * Registered by this package — the theme feature owns its own settings
 * surface. Selection follows the persisted preference, never the resolved
 * active theme.
 */
import clsx from 'clsx'
import {
  IconDarkOutline16, IconFollowsystemOutline16, IconLightOutline16,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import type { ThemePreference } from '../theme-settings.ts'
import type { ThemeKey } from './locales.ts'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type { createAppearanceRowStore } from './settings-store.ts'
import css from './AppearanceRow.module.css'

/** Injected business face: the preference write (t rides the standard locale seat). */
export interface AppearanceRowInjected {
  /** Switch the theme preference. */
  setTheme: (id: ThemePreference) => void
}

/** Full component props: runtime share + store share + locale seat + injected face. */
export type AppearanceRowComponentProps =
  PropsRuntime<'settings.general.item'> & PropsStore<ReturnType<typeof createAppearanceRowStore>>
  & PropsLocale<'settings.theme'> & AppearanceRowInjected

/** Preference order and preview treatments. */
const CUBES: readonly {
  id: ThemePreference
  labelKey: ThemeKey
  Icon: typeof IconLightOutline16
  preview: 'light' | 'dark' | 'system' | 'angelina-light' | 'angelina-dark'
}[] = [
  { id: 'light', labelKey: 'appearance.light', Icon: IconLightOutline16, preview: 'light' },
  { id: 'dark', labelKey: 'appearance.dark', Icon: IconDarkOutline16, preview: 'dark' },
  { id: 'system', labelKey: 'appearance.system', Icon: IconFollowsystemOutline16, preview: 'system' },
  { id: 'angelina-light', labelKey: 'appearance.angelinaLight', Icon: IconLightOutline16, preview: 'angelina-light' },
  { id: 'angelina-dark', labelKey: 'appearance.angelinaDark', Icon: IconDarkOutline16, preview: 'angelina-dark' },
]

/**
 * Render the Appearance row.
 * @param props - composed slot props.
 * @returns the row element tree.
 */
export function AppearanceRow({ t, setTheme, useStore }: AppearanceRowComponentProps) {
  const preference = useStore(s => s.preference)
  return (
    <div className={css.group}>
      <div className={css.title}>{t('appearance.title')}</div>
      <div className={css.cubeRow}>
        {CUBES.map(({ id, labelKey, Icon, preview }) => (
          <button
            key={id}
            type="button"
            className={clsx(css.themeCube, preference === id && css.selected)}
            aria-pressed={preference === id}
            onClick={() => { setTheme(id) }}
          >
            <span className={css.preview} data-preview={preview} aria-hidden="true">
              <span className={css.previewRail} />
              <span className={css.previewPanel} />
            </span>
            <span className={css.label}><Icon />{t(labelKey)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
