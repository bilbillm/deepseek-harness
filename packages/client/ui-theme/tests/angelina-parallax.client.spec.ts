// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AngelinaParallaxController } from '../src/client/angelina-parallax.ts'

type MediaListener = () => void

const frames: FrameRequestCallback[] = []
let mediaMatches = false
let mediaListeners = new Set<MediaListener>()

const flushFrame = (): void => {
  const pending = frames.splice(0)
  pending.forEach(callback => callback(0))
}

const pointer = (clientX: number, clientY: number, pointerType = 'mouse'): void => {
  const event = new Event('pointermove') as PointerEvent
  Object.defineProperties(event, {
    clientX: { value: clientX },
    clientY: { value: clientY },
    pointerType: { value: pointerType },
  })
  window.dispatchEvent(event)
}

describe('AngelinaParallaxController', () => {
  beforeEach(() => {
    document.body.innerHTML = '<main data-ds-app-frame=""></main>'
    mediaMatches = false
    mediaListeners = new Set()
    frames.length = 0
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback): number => {
      frames.push(callback)
      return frames.length
    })
    vi.stubGlobal('cancelAnimationFrame', (): void => {})
    vi.stubGlobal('matchMedia', (): MediaQueryList => ({
      get matches() { return mediaMatches },
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: (_type: string, listener: EventListenerOrEventListenerObject): void => {
        mediaListeners.add(listener as MediaListener)
      },
      removeEventListener: (_type: string, listener: EventListenerOrEventListenerObject): void => {
        mediaListeners.delete(listener as MediaListener)
      },
      addListener: (): void => {},
      removeListener: (): void => {},
      dispatchEvent: (): boolean => true,
    } as MediaQueryList))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  it('creates both light layers and follows normalized pointer movement', () => {
    const controller = new AngelinaParallaxController()
    controller.sync('angelina-light')

    expect(document.body.getAttribute('data-dsh-angelina-parallax')).toBe('light')
    expect(document.querySelectorAll('#dsh-angelina-parallax > div')).toHaveLength(2)
    pointer(window.innerWidth, window.innerHeight)
    flushFrame()

    expect(document.querySelector('[data-dsh-angelina-layer="background"]')?.getAttribute('style'))
      .toContain('translate3d(-5px, -3px, 0)')
    expect(document.querySelector('[data-dsh-angelina-layer="foreground"]')?.getAttribute('style'))
      .toContain('translate3d(10px, 6px, 0)')
    expect(document.body.style.getPropertyValue('--dsh-angelina-copy-parallax-x')).toBe('4px')
    expect(document.body.style.getPropertyValue('--dsh-angelina-copy-parallax-y')).toBe('2.5px')
    controller.dispose()
  })

  it('ignores touch input and resets pointer state on blur and visibility changes', () => {
    const controller = new AngelinaParallaxController()
    controller.sync('angelina-light')
    pointer(window.innerWidth, window.innerHeight, 'touch')
    expect(frames).toHaveLength(0)
    pointer(window.innerWidth, window.innerHeight)
    window.dispatchEvent(new Event('blur'))
    flushFrame()
    expect(document.body.style.getPropertyValue('--dsh-angelina-copy-parallax-x')).toBe('0px')
    document.dispatchEvent(new Event('visibilitychange'))
    controller.dispose()
  })

  it('keeps the dark theme to one restrained background layer and honors reduced motion', () => {
    mediaMatches = true
    const controller = new AngelinaParallaxController()
    controller.sync('angelina-dark')
    pointer(window.innerWidth, window.innerHeight)
    expect(frames).toHaveLength(0)
    expect(document.querySelector('[data-dsh-angelina-layer="background"]')?.getAttribute('style'))
      .toContain('translate3d(0px, 0px, 0)')

    mediaMatches = false
    mediaListeners.forEach(listener => listener())
    pointer(window.innerWidth, window.innerHeight)
    flushFrame()
    expect(document.querySelector('[data-dsh-angelina-layer="background"]')?.getAttribute('style'))
      .toContain('translate3d(0.5px, 0.25px, 0)')
    controller.dispose()
  })

  it('restores pre-existing body state when disabled or disposed', () => {
    document.body.setAttribute('data-dsh-angelina-parallax', 'owned-by-test')
    document.body.style.setProperty('--dsh-angelina-copy-parallax-x', '9px')
    document.body.style.setProperty('--dsh-angelina-copy-parallax-y', '7px')
    const controller = new AngelinaParallaxController()
    controller.sync('angelina-light')
    controller.sync('system')

    expect(document.body.getAttribute('data-dsh-angelina-parallax')).toBe('owned-by-test')
    expect(document.body.style.getPropertyValue('--dsh-angelina-copy-parallax-x')).toBe('9px')
    expect(document.body.style.getPropertyValue('--dsh-angelina-copy-parallax-y')).toBe('7px')
    expect(document.getElementById('dsh-angelina-parallax')).toBeNull()
    controller.dispose()
  })

  it('writes immediately when requestAnimationFrame is unavailable', () => {
    vi.stubGlobal('requestAnimationFrame', undefined)
    const controller = new AngelinaParallaxController()
    controller.sync('angelina-light')
    pointer(window.innerWidth, window.innerHeight)
    expect(document.body.style.getPropertyValue('--dsh-angelina-copy-parallax-x')).toBe('4px')
    controller.dispose()
  })
})
