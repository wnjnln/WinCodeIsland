import type { IpcAPI } from '../preload/index'

declare global {
  interface Window {
    ipcAPI: IpcAPI
  }
}
