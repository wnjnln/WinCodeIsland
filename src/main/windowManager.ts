import { BrowserWindow, Display } from 'electron'
import { join } from 'path'
import { existsSync } from 'fs'
import { appStore } from './store'
import type { IslandSurface } from '../shared/events'
import {
  getPreferredDisplay,
  notchWidthFor,
  topBarHeight,
  getScreenSignature,
} from './screenManager'

function getPreloadPath(): string {
  const base = join(__dirname, '../preload/index')
  for (const ext of ['.js', '.cjs', '.mjs']) {
    const p = base + ext
    if (existsSync(p)) return p
  }
  return join(__dirname, '../../src/preload/index.ts')
}

let sessionMeta = { totalCount: 0, activeCount: 0 }
let activeAnimation: { stop(): void } | null = null

export function setSessionMeta(totalCount: number, activeCount: number): void {
  sessionMeta = { totalCount, activeCount }
}

export function createWindow(): BrowserWindow {
  const display = getPreferredDisplay(appStore.get('displayChoice'))
  return buildWindowForDisplay(display)
}

function buildWindowForDisplay(display: Display): BrowserWindow {
  const bounds = computeWindowBounds('collapsed', display)

  const win = new BrowserWindow({
    ...bounds,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    resizable: false,
    movable: false,
    focusable: false,
    show: false,
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
  win.setIgnoreMouseEvents(false)

  if (process.env.VITE_DEV_SERVER_URL) {
    win.webContents.openDevTools({ mode: 'detach' })
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  win.once('ready-to-show', () => {
    win.show()
    win.setAlwaysOnTop(true, 'pop-up-menu')
  })

  return win
}

export function computeWindowBounds(
  surface: IslandSurface,
  display: Display
): { x: number; y: number; width: number; height: number } {
  const screenW = display.bounds.width
  const notchH = topBarHeight(
    appStore.get('notchHeightMode') as any,
    appStore.get('customNotchHeight')
  )
  const notchW = notchWidthFor(display, appStore.get('collapsedWidthScale'))
  const maxWidth = Math.min(620, screenW - 40)
  const offset = appStore.get('panelHorizontalOffset') || 0

  const isExpanded = surface !== 'collapsed'

  let width: number
  if (isExpanded) {
    width = maxWidth
  } else {
    if (sessionMeta.activeCount === 0) {
      width = notchW
    } else {
      const wing = Math.min(27, notchH - 6) + 14
      const extra = 20
      const toolExtra = appStore.get('showToolStatus') ? Math.min(Math.round(screenW * 0.03), 40) : 0
      width = Math.min(notchW + wing * 2 + extra + toolExtra, screenW - 20)
    }
  }

  let height: number
  if (isExpanded) {
    const maxSessions = Math.max(2, appStore.get('maxVisibleSessions'))
    const contentH = maxSessions * 90 + 60
    height = Math.min(contentH, appStore.get('maxPanelHeight'))
  } else {
    height = notchH
  }

  const centeredX = display.bounds.x + Math.round((screenW - width) / 2)
  const x = Math.max(display.bounds.x, Math.min(centeredX + offset, display.bounds.x + screenW - width))
  const y = display.bounds.y

  return { x, y, width, height }
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function animateWindowBounds(
  win: BrowserWindow,
  target: { x: number; y: number; width: number; height: number },
  duration = 320
): void {
  if (win.isDestroyed()) return

  activeAnimation?.stop()

  const start = win.getBounds()
  const startTime = Date.now()
  let stopped = false

  activeAnimation = {
    stop() {
      stopped = true
      activeAnimation = null
    },
  }

  const step = () => {
    if (stopped || win.isDestroyed()) {
      activeAnimation = null
      return
    }

    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = easeOutCubic(progress)

    const x = Math.round(start.x + (target.x - start.x) * eased)
    const y = Math.round(start.y + (target.y - start.y) * eased)
    const width = Math.round(start.width + (target.width - start.width) * eased)
    const height = Math.round(start.height + (target.height - start.height) * eased)

    win.setBounds({ x, y, width, height }, false)

    if (progress < 1) {
      setTimeout(step, 16)
    } else {
      activeAnimation = null
    }
  }

  setTimeout(step, 16)
}

export function setWindowExpanded(
  win: BrowserWindow,
  surface: IslandSurface
): void {
  const display = getPreferredDisplay(appStore.get('displayChoice'))
  const bounds = computeWindowBounds(surface, display)
  animateWindowBounds(win, bounds)
}

export function refreshWindowForDisplay(win: BrowserWindow | null, surface: IslandSurface): void {
  if (!win || win.isDestroyed()) return
  const display = getPreferredDisplay(appStore.get('displayChoice'))
  const bounds = computeWindowBounds(surface, display)
  animateWindowBounds(win, bounds)
}

export function getCurrentDisplay(): Display {
  return getPreferredDisplay(appStore.get('displayChoice'))
}

export function getCurrentScreenSignature(): string {
  return getScreenSignature(getCurrentDisplay())
}
