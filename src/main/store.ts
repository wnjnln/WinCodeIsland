import Store from 'electron-store'
import type { Schema } from 'electron-store'

export interface AppStore {
  language: string
  launchAtLogin: boolean
  autoHideDelay: number
  panelHeight: number
  expandedWidth: number
  soundEnabled: boolean
  smartSuppress: boolean
  mascotAnimation: boolean
  pipeName: string | null
  displayChoice: string
  panelHorizontalOffset: number
  hideWhenNoSession: boolean
  hideInFullscreen: boolean
  collapseOnMouseLeave: boolean
  maxVisibleSessions: number
  maxPanelHeight: number
  contentFontSize: number
  showToolStatus: boolean
  collapsedWidthScale: number
  notchHeightMode: string
  customNotchHeight: number
  hooksInstalled: boolean
  codexHooksInstalled: boolean
  kimiHooksInstalled: boolean
  allowHorizontalDrag: boolean
  idleSessionCleanup: number
  sessionRotationInterval: number
  volume: number
  soundEventStart: boolean
  soundEventComplete: boolean
  soundEventError: boolean
  soundEventApproval: boolean
  soundEventSubmit: boolean
  soundEventBoot: boolean
  aiMessageLines: number
  showAgentDetails: boolean
}

const schema: Schema<AppStore> = {
  language: { type: 'string', default: 'zh-CN' },
  launchAtLogin: { type: 'boolean', default: false },
  autoHideDelay: { type: 'number', default: 3000 },
  panelHeight: { type: 'number', default: 48 },
  expandedWidth: { type: 'number', default: 560 },
  soundEnabled: { type: 'boolean', default: true },
  smartSuppress: { type: 'boolean', default: true },
  mascotAnimation: { type: 'boolean', default: true },
  pipeName: { type: ['string', 'null'], default: null },
  displayChoice: { type: 'string', default: 'auto' },
  panelHorizontalOffset: { type: 'number', default: 0 },
  hideWhenNoSession: { type: 'boolean', default: false },
  hideInFullscreen: { type: 'boolean', default: true },
  collapseOnMouseLeave: { type: 'boolean', default: true },
  maxVisibleSessions: { type: 'number', default: 5 },
  maxPanelHeight: { type: 'number', default: 560 },
  contentFontSize: { type: 'number', default: 11 },
  showToolStatus: { type: 'boolean', default: true },
  collapsedWidthScale: { type: 'number', default: 100 },
  notchHeightMode: { type: 'string', default: 'matchNotch' },
  customNotchHeight: { type: 'number', default: 37 },
  hooksInstalled: { type: 'boolean', default: false },
  codexHooksInstalled: { type: 'boolean', default: false },
  kimiHooksInstalled: { type: 'boolean', default: false },
  allowHorizontalDrag: { type: 'boolean', default: false },
  idleSessionCleanup: { type: 'number', default: 30 },
  sessionRotationInterval: { type: 'number', default: 5 },
  volume: { type: 'number', default: 50 },
  soundEventStart: { type: 'boolean', default: true },
  soundEventComplete: { type: 'boolean', default: true },
  soundEventError: { type: 'boolean', default: true },
  soundEventApproval: { type: 'boolean', default: true },
  soundEventSubmit: { type: 'boolean', default: false },
  soundEventBoot: { type: 'boolean', default: true },
  aiMessageLines: { type: 'number', default: 1 },
  showAgentDetails: { type: 'boolean', default: false },
}

export const appStore = new Store<AppStore>({ schema })
