import { screen, Display } from 'electron'

export type NotchHeightMode = 'matchNotch' | 'matchMenuBar' | 'custom'

export function fakeNotchWidth(screenWidth: number): number {
  return Math.min(Math.max(screenWidth * 0.14, 160), 240)
}

export function topBarHeight(mode: NotchHeightMode, customHeight: number): number {
  switch (mode) {
    case 'matchMenuBar':
      return 40
    case 'custom':
      return Math.max(15, Math.min(customHeight > 0 ? customHeight : 37, 60))
    case 'matchNotch':
    default:
      return 40
  }
}

export function notchWidthFor(display: Display, collapsedWidthScale: number): number {
  const base = fakeNotchWidth(display.bounds.width)
  const scale = Math.max(collapsedWidthScale, 50) / 100
  return Math.round(base * scale)
}

export function getScreenSignature(display: Display): string {
  const { x, y, width, height } = display.bounds
  return `${Math.round(x)}:${Math.round(y)}:${Math.round(width)}:${Math.round(height)}`
}

export function getPreferredDisplay(choice: string): Display {
  const displays = screen.getAllDisplays()
  if (choice.startsWith('screen_')) {
    const index = parseInt(choice.replace('screen_', ''), 10)
    if (!isNaN(index) && index < displays.length) {
      return displays[index]
    }
  }
  const primary = screen.getPrimaryDisplay()
  const cursor = screen.getCursorScreenPoint()
  const active = displays.find((d) => {
    const b = d.bounds
    return cursor.x >= b.x && cursor.x <= b.x + b.width && cursor.y >= b.y && cursor.y <= b.y + b.height
  })
  return active || primary || displays[0]
}
