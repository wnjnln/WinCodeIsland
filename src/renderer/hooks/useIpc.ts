import { useEffect, useCallback } from 'react'
import type { IslandSurface } from '../../shared/events'

export function useHookEvent(callback: (event: unknown) => void) {
  useEffect(() => {
    const unsubscribe = window.ipcAPI.onHookEvent(callback)
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [callback])
}

export function usePermissionRequest(callback: (event: unknown) => void) {
  useEffect(() => {
    const unsubscribe = window.ipcAPI.onPermissionRequest(callback)
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [callback])
}

export function useQuestionRequest(callback: (event: unknown) => void) {
  useEffect(() => {
    const unsubscribe = window.ipcAPI.onQuestionRequest(callback)
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [callback])
}

export function useSurfaceChanged(callback: (surface: IslandSurface) => void) {
  useEffect(() => {
    const unsubscribe = window.ipcAPI.onSurfaceChanged(callback)
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [callback])
}

export function useSessionEnded(callback: (sessionId: string) => void) {
  useEffect(() => {
    const unsubscribe = window.ipcAPI.onSessionEnded(callback)
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [callback])
}

export function useIpc() {
  const sendPermissionDecision = useCallback((behavior: 'allow' | 'deny', always?: boolean, toolName?: string) => {
    window.ipcAPI.sendPermissionDecision({ behavior, always, toolName })
  }, [])

  const sendQuestionAnswer = useCallback((answer: string | { answers: Record<string, string> }) => {
    window.ipcAPI.sendQuestionAnswer(answer)
  }, [])

  const toggleExpand = useCallback(() => {
    window.ipcAPI.toggleExpand()
  }, [])

  const setSurface = useCallback((surface: IslandSurface) => {
    window.ipcAPI.setSurface(surface)
  }, [])

  const quitApp = useCallback(() => {
    window.ipcAPI.quitApp()
  }, [])

  const openSettings = useCallback(() => {
    window.ipcAPI.openSettings()
  }, [])

  const installCLI = useCallback((source: string) => {
    return window.ipcAPI.installCLI(source)
  }, [])

  const uninstallCLI = useCallback((source: string) => {
    return window.ipcAPI.uninstallCLI(source)
  }, [])

  const isCLIInstalled = useCallback((source: string) => {
    return window.ipcAPI.isCLIInstalled(source)
  }, [])

  return { sendPermissionDecision, sendQuestionAnswer, toggleExpand, setSurface, quitApp, openSettings, installCLI, uninstallCLI, isCLIInstalled }
}
