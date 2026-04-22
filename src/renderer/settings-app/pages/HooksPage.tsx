import { useState, useEffect } from 'react'
import { SettingRow } from '../components/SettingRow'

interface CLIItem {
  source: string
  name: string
  configPath: string
}

const CLI_LIST: CLIItem[] = [
  { source: 'claude', name: 'Claude Code', configPath: '~/.claude/settings.json' },
  { source: 'codex', name: 'Codex', configPath: '~/.codex/hooks.json' },
  { source: 'kimi', name: 'Kimi Code CLI', configPath: '~/.kimi/config.toml' },
]

function CLIStatusCard({
  cli,
  installed,
  busy,
  onInstall,
  onUninstall,
}: {
  cli: CLIItem
  installed: boolean | null
  busy: boolean
  onInstall: () => void
  onUninstall: () => void
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[13px] font-medium text-white/90">{cli.name}</span>
        <span className="text-[11px] text-white/40 truncate">{cli.configPath}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-[12px] font-medium px-2 py-1 rounded ${
            installed === true
              ? 'bg-[#66FF80]/15 text-[#66FF80]'
              : installed === false
                ? 'bg-white/10 text-white/60'
                : 'text-white/30'
          }`}
        >
          {installed === true ? 'Installed / 已安装' : installed === false ? 'Not Installed / 未安装' : 'Checking...'}
        </span>
        <button
          onClick={installed ? onUninstall : onInstall}
          disabled={busy || installed === null}
          className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
            installed
              ? 'bg-white/5 text-white/70 hover:bg-white/10'
              : 'bg-[#66FF80]/15 text-[#66FF80] hover:bg-[#66FF80]/25'
          }`}
        >
          {busy ? 'Working...' : installed ? 'Uninstall / 卸载' : 'Install / 安装'}
        </button>
      </div>
    </div>
  )
}

export function HooksPage() {
  const [statuses, setStatuses] = useState<Record<string, boolean | null>>({})
  const [busyMap, setBusyMap] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function checkAll() {
      const results: Record<string, boolean | null> = {}
      for (const cli of CLI_LIST) {
        try {
          results[cli.source] = await window.ipcAPI.isCLIInstalled(cli.source)
        } catch {
          results[cli.source] = false
        }
      }
      setStatuses(results)
    }
    checkAll()
  }, [])

  const handleInstall = async (source: string) => {
    setBusyMap((prev) => ({ ...prev, [source]: true }))
    try {
      const ok = await window.ipcAPI.installCLI(source)
      setStatuses((prev) => ({ ...prev, [source]: ok }))
    } catch {
      setStatuses((prev) => ({ ...prev, [source]: false }))
    }
    setBusyMap((prev) => ({ ...prev, [source]: false }))
  }

  const handleUninstall = async (source: string) => {
    setBusyMap((prev) => ({ ...prev, [source]: true }))
    try {
      const ok = await window.ipcAPI.uninstallCLI(source)
      setStatuses((prev) => ({ ...prev, [source]: !ok }))
    } catch {
      setStatuses((prev) => ({ ...prev, [source]: false }))
    }
    setBusyMap((prev) => ({ ...prev, [source]: false }))
  }

  return (
    <div>
      <h2 className="text-[16px] font-semibold mb-1">Hooks / CLI Hooks</h2>
      <p className="text-[11px] text-white/40 mb-5">管理各 CLI 工具的 Hook 安装状态</p>

      {CLI_LIST.map((cli) => (
        <CLIStatusCard
          key={cli.source}
          cli={cli}
          installed={statuses[cli.source] ?? null}
          busy={busyMap[cli.source] ?? false}
          onInstall={() => handleInstall(cli.source)}
          onUninstall={() => handleUninstall(cli.source)}
        />
      ))}

      <div className="mt-6 text-[11px] text-white/30 leading-relaxed">
        <p>Hooks 会自动将事件发送到 WinClaudeIsland 面板。</p>
        <p>每个 CLI 独立管理，互不影响。</p>
      </div>
    </div>
  )
}
