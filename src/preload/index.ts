import { contextBridge, ipcRenderer } from 'electron'
import type { IslandSurface } from '../shared/events'

export interface IpcAPI {
  onHookEvent: (callback: (event: unknown) => void) => () => void
  onPermissionRequest: (callback: (event: unknown) => void) => () => void
  onQuestionRequest: (callback: (event: unknown) => void) => () => void
  onSurfaceChanged: (callback: (surface: IslandSurface) => void) => () => void
  onSessionEnded: (callback: (sessionId: string) => void) => () => void
  sendPermissionDecision: (decision: { behavior: 'allow' | 'deny'; always?: boolean; toolName?: string }) => void
  sendQuestionAnswer: (answer: string | { answers: Record<string, string> }) => void
  toggleExpand: () => void
  setSurface: (surface: IslandSurface) => void
  installHooks: () => Promise<boolean>
  uninstallHooks: () => Promise<boolean>
  isHooksInstalled: () => Promise<boolean>
  installCLI: (source: string) => Promise<boolean>
  uninstallCLI: (source: string) => Promise<boolean>
  isCLIInstalled: (source: string) => Promise<boolean>
  quitApp: () => void
  getSetting: (key: string) => Promise<unknown>
  setSetting: (key: string, value: unknown) => Promise<void>
  getAllSettings: () => Promise<Record<string, unknown>>
  openSettings: () => Promise<void>
  openPath: (path: string) => Promise<void>
  activateTerminal: (terminalType: string, pid?: number, hwnd?: number) => Promise<boolean>
  readSessionTitle: (sessionId: string, provider: string, cwd?: string) => Promise<string | null>
  getForegroundProcess: () => Promise<string>
  setWindowTitle: (title: string) => Promise<void>
}

const api: IpcAPI = {
  onHookEvent: (cb) => {
    const handler = (_: Electron.IpcRendererEvent, data: unknown) => cb(data)
    ipcRenderer.on('hook-event', handler)
    return () => ipcRenderer.off('hook-event', handler)
  },
  onPermissionRequest: (cb) => {
    const handler = (_: Electron.IpcRendererEvent, data: unknown) => cb(data)
    ipcRenderer.on('permission-request', handler)
    return () => ipcRenderer.off('permission-request', handler)
  },
  onQuestionRequest: (cb) => {
    const handler = (_: Electron.IpcRendererEvent, data: unknown) => cb(data)
    ipcRenderer.on('question-request', handler)
    return () => ipcRenderer.off('question-request', handler)
  },
  onSurfaceChanged: (cb) => {
    const handler = (_: Electron.IpcRendererEvent, data: unknown) => cb(data as IslandSurface)
    ipcRenderer.on('surface-changed', handler)
    return () => ipcRenderer.off('surface-changed', handler)
  },
  onSessionEnded: (cb) => {
    const handler = (_: Electron.IpcRendererEvent, data: unknown) => cb(data as string)
    ipcRenderer.on('session-ended', handler)
    return () => ipcRenderer.off('session-ended', handler)
  },
  sendPermissionDecision: (decision) => ipcRenderer.send('permission-decision', decision),
  sendQuestionAnswer: (answer) => ipcRenderer.send('question-answer', answer),
  toggleExpand: () => ipcRenderer.send('toggle-expand'),
  setSurface: (surface) => ipcRenderer.send('set-surface', surface),
  installHooks: () => ipcRenderer.invoke('install-hooks'),
  uninstallHooks: () => ipcRenderer.invoke('uninstall-hooks'),
  isHooksInstalled: () => ipcRenderer.invoke('is-hooks-installed'),
  installCLI: (source: string) => ipcRenderer.invoke('install-cli', source),
  uninstallCLI: (source: string) => ipcRenderer.invoke('uninstall-cli', source),
  isCLIInstalled: (source: string) => ipcRenderer.invoke('is-cli-installed', source),
  quitApp: () => ipcRenderer.send('quit-app'),
  getSetting: (key) => ipcRenderer.invoke('get-setting', key),
  setSetting: (key, value) => ipcRenderer.invoke('set-setting', key, value),
  getAllSettings: () => ipcRenderer.invoke('get-all-settings'),
  openSettings: () => ipcRenderer.invoke('open-settings'),
  openPath: (path: string) => ipcRenderer.invoke('open-path', path),
  activateTerminal: (terminalType: string, pid?: number, hwnd?: number) => ipcRenderer.invoke('activate-terminal', terminalType, pid, hwnd),
  readSessionTitle: (sessionId: string, provider: string, cwd?: string) => ipcRenderer.invoke('read-session-title', sessionId, provider, cwd),
  getForegroundProcess: () => ipcRenderer.invoke('get-foreground-process'),
  setWindowTitle: (title: string) => ipcRenderer.invoke('set-window-title', title),
}

contextBridge.exposeInMainWorld('ipcAPI', api)

declare global {
  interface Window {
    ipcAPI: IpcAPI
  }
}
