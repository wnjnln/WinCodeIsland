import { BrowserWindow } from 'electron'
import { join } from 'path'
import { existsSync } from 'fs'

let settingsWindow: BrowserWindow | null = null

function getPreloadPath(): string {
  const base = join(__dirname, '../preload/index')
  for (const ext of ['.js', '.cjs', '.mjs']) {
    const p = base + ext
    if (existsSync(p)) return p
  }
  return join(__dirname, '../../src/preload/index.ts')
}

export function showSettingsWindow(): void {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.focus()
    return
  }

  settingsWindow = new BrowserWindow({
    width: 660,
    height: 540,
    minWidth: 560,
    minHeight: 420,
    frame: true,
    transparent: false,
    alwaysOnTop: false,
    skipTaskbar: false,
    hasShadow: true,
    resizable: true,
    movable: true,
    focusable: true,
    show: false,
    title: 'WinClaudeIsland Settings',
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    const base = process.env.VITE_DEV_SERVER_URL.replace(/\/$/, '')
    // Try both possible dev server paths for the secondary HTML entry
    settingsWindow.loadURL(`${base}/settings.html`).catch(() => {
      settingsWindow?.loadURL(`${base}/src/renderer/settings.html`)
    })
  } else {
    settingsWindow.loadFile(join(__dirname, '../renderer/settings.html'))
  }

  settingsWindow.once('ready-to-show', () => {
    settingsWindow?.show()
  })

  settingsWindow.on('closed', () => {
    settingsWindow = null
  })
}

export function closeSettingsWindow(): void {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.close()
    settingsWindow = null
  }
}
