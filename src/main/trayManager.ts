import { Tray, Menu, nativeImage } from 'electron'
import { join } from 'path'

let tray: Tray | null = null
let clickHandler: (() => void) | null = null

export interface TrayCallbacks {
  onShow: () => void
  onHide: () => void
  onExit: () => void
  onInstallHooks?: () => void
  onUninstallHooks?: () => void
  isHooksInstalled?: () => boolean
}

export function createTray(callbacks: TrayCallbacks): Tray {
  const icon = nativeImage.createFromPath(join(__dirname, '../../resources/icon.png'))
  tray = new Tray(icon.resize({ width: 16, height: 16 }))
  tray.setToolTip('WinClaudeIsland')
  clickHandler = callbacks.onShow

  const updateMenu = () => {
    const template: Electron.MenuItemConstructorOptions[] = [
      { label: 'Show', click: callbacks.onShow },
      { label: 'Hide', click: callbacks.onHide },
      { type: 'separator' },
    ]

    if (callbacks.onInstallHooks && callbacks.isHooksInstalled) {
      template.push({
        label: '安装 Claude Hook',
        type: 'checkbox',
        checked: callbacks.isHooksInstalled(),
        click: () => {
          callbacks.onInstallHooks!()
          updateMenu()
        },
      })
    }

    if (callbacks.onUninstallHooks) {
      template.push({
        label: '卸载 Claude Hook',
        click: () => {
          callbacks.onUninstallHooks!()
          updateMenu()
        },
      })
    }

    if (callbacks.onInstallHooks || callbacks.onUninstallHooks) {
      template.push({ type: 'separator' })
    }

    template.push({ label: 'Exit', click: callbacks.onExit })

    const contextMenu = Menu.buildFromTemplate(template)
    tray?.setContextMenu(contextMenu)
  }

  tray.on('click', callbacks.onShow)
  updateMenu()
  return tray
}

export function destroyTray(): void {
  if (tray && clickHandler) {
    tray.removeListener('click', clickHandler)
    clickHandler = null
  }
  if (tray) {
    tray.destroy()
    tray = null
  }
}
