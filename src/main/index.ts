import { app, ipcMain, dialog, BrowserWindow, shell } from 'electron'
import {
  createWindow,
  setWindowExpanded,
  refreshWindowForDisplay,
  getCurrentScreenSignature,
  setSessionMeta,
} from './windowManager'
import { createTray, destroyTray } from './trayManager'
import { showSettingsWindow } from './settingsWindow'
import { install, uninstall, isInstalled, installCLI, uninstallCLI, isCLIInstalled } from './configInstaller'
import { appStore } from './store'
import { NamedPipeServer } from './namedPipeServer'
import { getPipeName } from '../shared/constants'
import type { HookEvent, PermissionDecision, IslandSurface } from '../shared/events'
import { screen } from 'electron'

let mainWindow: BrowserWindow | null = null
let pipeServer: NamedPipeServer | null = null
let currentSurface: IslandSurface = 'collapsed'
let pendingPermission: { event: HookEvent; resolve: (d: PermissionDecision) => void } | null = null
let pendingQuestion: { event: HookEvent; resolve: (a: string) => void } | null = null
let lastScreenSignature = ''
const sessions = new Map<string, { active: boolean }>()

function getEventName(event: HookEvent): string {
  return event.hook_event_name ?? event.hookEventName ?? event.event_name ?? event.eventName ?? ''
}

function getSessionId(event: HookEvent): string {
  return event.session_id ?? event.sessionId ?? 'default'
}

function refreshSessionMeta(): void {
  const total = sessions.size
  const active = Array.from(sessions.values()).filter((s) => s.active).length
  setSessionMeta(total, active)
  if (currentSurface === 'collapsed' && mainWindow && !mainWindow.isDestroyed()) {
    refreshWindowForDisplay(mainWindow, 'collapsed')
  }
}

function safeSetSurface(surface: IslandSurface): void {
  currentSurface = surface
  if (mainWindow && !mainWindow.isDestroyed()) {
    setWindowExpanded(mainWindow, surface)
  }
}

function sendToRenderer(channel: string, ...args: unknown[]): void {
  if (mainWindow && !mainWindow.webContents.isDestroyed()) {
    mainWindow.webContents.send(channel, ...args)
  }
}

function handleEvent(event: HookEvent): void {
  const sid = getSessionId(event)
  const name = getEventName(event)

  if (name === 'SessionEnd' || name === 'Stop') {
    sessions.delete(sid)
  } else {
    const isActive = name === 'PreToolUse' || name === 'UserPromptSubmit' || name === 'PostToolUse'
    sessions.set(sid, { active: isActive })
  }
  refreshSessionMeta()

  sendToRenderer('hook-event', event)
}

async function handlePermission(event: HookEvent): Promise<PermissionDecision> {
  const sid = getSessionId(event)
  sessions.set(sid, { active: true })
  refreshSessionMeta()

  safeSetSurface('approvalCard')
  sendToRenderer('surface-changed', 'approvalCard')
  sendToRenderer('permission-request', event)
  return new Promise((resolve) => {
    pendingPermission = { event, resolve }
  })
}

async function handleQuestion(event: HookEvent): Promise<string> {
  const sid = getSessionId(event)
  sessions.set(sid, { active: true })
  refreshSessionMeta()

  safeSetSurface('questionCard')
  sendToRenderer('surface-changed', 'questionCard')
  sendToRenderer('question-request', event)
  return new Promise((resolve) => {
    pendingQuestion = { event, resolve }
  })
}

function checkScreenChange(): void {
  const sig = getCurrentScreenSignature()
  if (sig !== lastScreenSignature) {
    lastScreenSignature = sig
    if (mainWindow && !mainWindow.isDestroyed()) {
      refreshWindowForDisplay(mainWindow, currentSurface)
    }
  }
}

app.whenReady().then(() => {
  mainWindow = createWindow()
  lastScreenSignature = getCurrentScreenSignature()

  createTray({
    onShow: () => {
      mainWindow?.show()
      mainWindow?.focus()
    },
    onHide: () => mainWindow?.hide(),
    onExit: () => app.quit(),
    onInstallHooks: () => install(),
    onUninstallHooks: () => uninstall(),
    isHooksInstalled: () => isInstalled(),
  })

  pipeServer = new NamedPipeServer(getPipeName(), handleEvent, handlePermission, handleQuestion)
  pipeServer.start()

  // Blur-to-collapse for sessionList/completionCard
  mainWindow.on('blur', () => {
    if (currentSurface === 'approvalCard' || currentSurface === 'questionCard') return
    if (currentSurface !== 'collapsed') {
      safeSetSurface('collapsed')
      sendToRenderer('surface-changed', 'collapsed')
    }
  })

  setInterval(checkScreenChange, 1000)

  screen.on('display-added', checkScreenChange)
  screen.on('display-removed', checkScreenChange)
  screen.on('display-metrics-changed', checkScreenChange)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    if (details.reason === 'clean-exit' || details.reason === 'abnormal-exit') {
      mainWindow?.reload()
    } else {
      console.error('Renderer process gone:', details.reason)
    }
  })

  app.on('activate', () => {
    if (mainWindow === null) mainWindow = createWindow()
  })
})

app.on('window-all-closed', async () => {
  pipeServer?.stop()
  destroyTray()
  if (process.platform !== 'darwin') app.quit()
})

// IPC handlers from renderer
ipcMain.on('permission-decision', (_event, decision: PermissionDecision) => {
  pendingPermission?.resolve(decision)
  pendingPermission = null
  if (currentSurface === 'approvalCard') {
    safeSetSurface('collapsed')
    sendToRenderer('surface-changed', 'collapsed')
  }
})

ipcMain.on('question-answer', (_event, answer: string) => {
  pendingQuestion?.resolve(answer)
  pendingQuestion = null
  if (currentSurface === 'questionCard') {
    safeSetSurface('collapsed')
    sendToRenderer('surface-changed', 'collapsed')
  }
})

ipcMain.on('toggle-expand', () => {
  const next = currentSurface === 'collapsed' ? 'sessionList' : 'collapsed'
  safeSetSurface(next)
  sendToRenderer('surface-changed', next)
})

ipcMain.on('set-surface', (_event, surface: IslandSurface) => {
  safeSetSurface(surface)
  sendToRenderer('surface-changed', surface)
})

ipcMain.on('set-auto-hide', (_event, enabled: boolean) => {
  sendToRenderer('auto-hide-changed', enabled)
})

// Install / uninstall / detect hooks (legacy single-CLI)
ipcMain.handle('install-hooks', () => install())
ipcMain.handle('uninstall-hooks', () => uninstall())
ipcMain.handle('is-hooks-installed', () => isInstalled())

// Per-CLI install / uninstall / detect
ipcMain.handle('install-cli', (_event, source: string) => installCLI(source))
ipcMain.handle('uninstall-cli', (_event, source: string) => uninstallCLI(source))
ipcMain.handle('is-cli-installed', (_event, source: string) => isCLIInstalled(source))

// App control
ipcMain.on('quit-app', () => app.quit())

// Settings
ipcMain.handle('get-setting', (_event, key: string) => appStore.get(key as any))
ipcMain.handle('set-setting', (_event, key: string, value: unknown) => appStore.set(key as any, value as any))
ipcMain.handle('get-all-settings', () => appStore.store)
ipcMain.handle('open-settings', () => { showSettingsWindow(); return undefined })

// Path / terminal / session helpers
ipcMain.handle('open-path', (_event, path: string) => shell.openPath(path))
ipcMain.handle('activate-terminal', () => Promise.resolve(false))
ipcMain.handle('read-session-title', () => Promise.resolve(null))
ipcMain.handle('get-foreground-process', () => Promise.resolve(''))

// Handle pipe bind errors gracefully
process.on('uncaughtException', (err) => {
  if (String(err.message).includes('EACCES') || String(err.message).includes('EADDRINUSE')) {
    dialog.showErrorBox(
      'WinClaudeIsland 启动失败',
      `无法监听 Named Pipe：${getPipeName()}\n请检查是否已有其他实例在运行。`
    )
    app.quit()
    return
  }
  throw err
})
