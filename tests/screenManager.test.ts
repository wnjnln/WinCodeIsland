import { describe, it, expect } from 'vitest'
import { fakeNotchWidth, topBarHeight } from '../src/main/screenManager'

describe('screenManager', () => {
  it('fakeNotchWidth clamps to 160-240', () => {
    expect(fakeNotchWidth(1000)).toBe(160)
    expect(fakeNotchWidth(2000)).toBe(240)
    expect(fakeNotchWidth(1500)).toBeCloseTo(210, 0)
  })

  it('topBarHeight uses custom when mode is custom', () => {
    expect(topBarHeight('custom', 50)).toBe(50)
  })

  it('topBarHeight clamps custom height', () => {
    expect(topBarHeight('custom', 5)).toBe(15)
    expect(topBarHeight('custom', 80)).toBe(60)
  })
})
