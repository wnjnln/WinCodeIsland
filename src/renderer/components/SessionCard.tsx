import { useState, useCallback, useEffect } from 'react'
import { Mascot } from './mascot/Mascot'
import { TerminalBadgeFromEvent } from './TerminalBadge'
import { ChatMessageRow } from './ChatMessageRow'
import { MorphText } from './MorphText'
import type { Session } from '../../shared/events'

interface SessionCardProps {
  session: Session
}

function useAiMessageLines(): number {
  const [lines, setLines] = useState(1)
  useEffect(() => {
    window.ipcAPI.getSetting('aiMessageLines').then((v) => {
      if (typeof v === 'number') setLines(v)
    }).catch(() => {})
  }, [])
  return lines
}

function TypingIndicator({ fontSize }: { fontSize: number }) {
  return (
    <span className="inline-flex items-center gap-[2px] px-[3px]" style={{ fontSize }}>
      <span className="w-[3px] h-[3px] rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-[3px] h-[3px] rounded-full bg-current animate-bounce" style={{ animationDelay: '120ms' }} />
      <span className="w-[3px] h-[3px] rounded-full bg-current animate-bounce" style={{ animationDelay: '240ms' }} />
    </span>
  )
}

function timeAgo(timestamp?: number): string {
  if (!timestamp) return ''
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return '<1m'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  return `${Math.floor(seconds / 86400)}d`
}

function shortSessionId(sessionId: string): string {
  if (sessionId.length <= 8) return sessionId
  return sessionId.slice(-6)
}

function sessionLabel(sessionTitle?: string): string | undefined {
  if (!sessionTitle) return undefined
  const trimmed = sessionTitle.trim()
  return trimmed || undefined
}

export function SessionCard({ session }: SessionCardProps) {
  const [hovering, setHovering] = useState(false)
  const aiMessageLines = useAiMessageLines()
  const aiLineLimit = aiMessageLines > 0 ? aiMessageLines : undefined

  const {
    sessionId,
    status,
    projectName,
    firstPrompt,
    recentMessages = [],
    terminalType,
    toolDescription,
    currentTool,
    cliSource,
    subagentIcons,
    cwd,
    interrupted,
    isYoloMode,
    wtSession,
    wtPid,
    wtHwnd,
    weztermPane,
    alacrittyWindow,
    kittyWindow,
    tabbyPane,
    tmux,
    tmuxPane,
    sessionTitle,
    startedAt,
  } = session

  const fontSize = 11

  // Status-based project color (matches CodeIsland)
  const projectColor = (() => {
    if (status === 'idle' && interrupted) return 'rgb(255, 115, 90)'
    if (status === 'processing') return 'rgb(76, 217, 100)'
    if (status === 'waiting') return 'rgb(255, 153, 51)'
    return '#FFFFFF'
  })()

  const displaySessionId = sessionId
  const sLabel = sessionLabel(sessionTitle)
  const sId = shortSessionId(displaySessionId)
  const tAgo = timeAgo(startedAt)

  const handleOpenFolder = useCallback(() => {
    if (cwd) {
      window.ipcAPI.openPath?.(cwd)
    }
  }, [cwd])

  const handleActivateTerminal = useCallback(async () => {
    const { name, pid, hwnd } = (() => {
      const termApp = String(terminalType ?? '').toLowerCase()
      if (wtSession) return { name: 'Windows Terminal', pid: wtPid, hwnd: wtHwnd }
      if (weztermPane) return { name: 'WezTerm', pid: undefined, hwnd: undefined }
      if (alacrittyWindow) return { name: 'Alacritty', pid: undefined, hwnd: undefined }
      if (kittyWindow) return { name: 'Kitty', pid: undefined, hwnd: undefined }
      if (tabbyPane) return { name: 'Tabby', pid: undefined, hwnd: undefined }
      if (termApp.includes('warp')) return { name: 'Warp', pid: undefined, hwnd: undefined }
      if (termApp.includes('iterm')) return { name: 'iTerm2', pid: undefined, hwnd: undefined }
      if (termApp.includes('ghostty')) return { name: 'Ghostty', pid: undefined, hwnd: undefined }
      if (termApp.includes('hyper')) return { name: 'Hyper', pid: undefined, hwnd: undefined }
      if (termApp.includes('rio')) return { name: 'Rio', pid: undefined, hwnd: undefined }
      if (termApp.includes('vscode') || termApp.includes('vscodium')) return { name: 'VS Code', pid: undefined, hwnd: undefined }
      if (termApp.includes('cursor')) return { name: 'Cursor', pid: undefined, hwnd: undefined }
      if (termApp.includes('jetbrains')) return { name: 'JetBrains', pid: undefined, hwnd: undefined }
      if (termApp.includes('zed')) return { name: 'Zed', pid: undefined, hwnd: undefined }
      if (termApp.includes('cmder') || termApp.includes('conemu')) return { name: 'Cmder', pid: undefined, hwnd: undefined }
      if (termApp.includes('powershell') || termApp.includes('pwsh')) return { name: 'PowerShell', pid: wtPid, hwnd: wtHwnd }
      return { name: terminalType || 'Terminal', pid: undefined, hwnd: undefined }
    })()
    try {
      await window.ipcAPI.activateTerminal?.(name, pid, hwnd)
    } catch {
      // ignore
    }
  }, [terminalType, wtSession, wtPid, wtHwnd, weztermPane, alacrittyWindow, kittyWindow, tabbyPane])

  // Recent messages: show last 2 when processing, otherwise show all
  const visibleMessages = status !== 'idle'
    ? recentMessages.slice(-2)
    : recentMessages

  // Hover background
  const bgClass = hovering ? 'bg-white/[0.10]' : 'bg-white/[0.05]'

  return (
    <button
      className={`w-full text-left rounded-[10px] ${bgClass} anim-micro`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={handleActivateTerminal}
    >
      <div className="flex items-center gap-2 px-4 py-3">
        {/* Column 1: Mascot + subagent icons */}
        <div className="flex flex-col items-center gap-[3px] shrink-0" style={{ width: 36 }}>
          <Mascot size={32} status={status} source={cliSource} />
          {subagentIcons && subagentIcons.length > 0 && (
            <div className="flex flex-wrap justify-center gap-[1px]" style={{ width: 34 }}>
              {subagentIcons.slice(0, 8).map((icon, i) => (
                <div
                  key={i}
                  className="rounded-[1px] bg-white/30"
                  style={{ width: 8, height: 8 }}
                  title={icon}
                />
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Content */}
        <div className="flex-1 min-w-0 flex flex-col" style={{ gap: 6 }}>
          {/* Header: project name + session label + short ID + tags */}
          <div className="flex items-center gap-2 min-w-0">
            {/* SessionIdentityLine */}
            <div className="flex items-center gap-1 min-w-0">
              <span
                className="font-bold font-mono truncate cursor-pointer hover:opacity-80"
                style={{ fontSize: fontSize + 2, color: projectColor }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpenFolder()
                }}
                title={cwd ? `Open: ${cwd}` : undefined}
              >
                {projectName || 'Session'}
              </span>
              {sLabel && (
                <>
                  <span
                    className="font-medium font-mono truncate shrink"
                    style={{ fontSize, color: 'rgba(255,255,255,0.76)' }}
                  >
                    #{sLabel}
                  </span>
                  <span
                    className="font-semibold font-mono shrink-0"
                    style={{ fontSize, color: 'rgba(255,255,255,0.28)' }}
                  >
                    ·
                  </span>
                </>
              )}
              <span
                className="font-medium font-mono shrink-0"
                style={{ fontSize, color: 'rgba(255,255,255,0.36)' }}
              >
                #{sId}
              </span>
            </div>

            {/* Spacer */}
            <span className="flex-1 min-w-[8px]" />

            {/* Tags */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Remote tag */}
              {cliSource === 'other' && (
                <span
                  className="px-[6px] py-[3px] rounded-[5px] font-medium font-mono whitespace-nowrap"
                  style={{
                    fontSize: 9.5,
                    color: 'rgb(115, 184, 255)',
                    backgroundColor: 'rgba(115, 184, 255, 0.08)',
                  }}
                >
                  @remote
                </span>
              )}

              {/* INT tag */}
              {interrupted && (
                <span
                  className="px-[6px] py-[3px] rounded-[5px] font-medium font-mono whitespace-nowrap"
                  style={{
                    fontSize: 9.5,
                    color: 'rgb(255, 153, 51)',
                    backgroundColor: 'rgba(255, 153, 51, 0.08)',
                  }}
                >
                  INT
                </span>
              )}

              {/* YOLO tag */}
              {isYoloMode && (
                <span
                  className="px-[6px] py-[3px] rounded-[5px] font-medium font-mono whitespace-nowrap"
                  style={{
                    fontSize: 9.5,
                    color: 'rgb(255, 89, 89)',
                    backgroundColor: 'rgba(255, 89, 89, 0.08)',
                  }}
                >
                  YOLO
                </span>
              )}

              {/* Time ago */}
              {tAgo && (
                <span
                  className="px-[6px] py-[3px] rounded-[5px] font-medium font-mono whitespace-nowrap"
                  style={{
                    fontSize: 9.5,
                    color: 'rgba(255,255,255,0.7)',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                  }}
                >
                  {tAgo}
                </span>
              )}

              {/* Terminal badge */}
              <TerminalBadgeFromEvent
                event={{
                  _term_app: terminalType,
                  _wt_session: wtSession,
                  _wezterm_pane: weztermPane,
                  _alacritty_window: alacrittyWindow,
                  _kitty_window: kittyWindow,
                  _tabby_pane: tabbyPane,
                  _tmux: tmux,
                  _tmux_pane: tmuxPane,
                }}
                onClick={() => {
                  handleActivateTerminal()
                }}
              />
            </div>
          </div>

          {/* Session title / last user prompt (only when no recent messages) */}
          {firstPrompt && recentMessages.length === 0 && (
            <div
              className="font-mono truncate"
              style={{
                fontSize,
                color: 'rgba(255,255,255,0.45)',
              }}
            >
              {firstPrompt}
            </div>
          )}

          {/* Chat history + live status */}
          {(recentMessages.length > 0 || status !== 'idle') && (
            <div className="flex flex-col" style={{ gap: 3, paddingLeft: 4 }}>
              {/* Chat messages */}
              {visibleMessages.map((msg, i) => (
                <ChatMessageRow
                  key={i}
                  role={msg.role}
                  content={msg.content}
                  maxLength={70}
                  lineLimit={msg.role === 'assistant' ? aiLineLimit : 1}
                />
              ))}

              {/* Working indicator */}
              {status !== 'idle' && (
                <div className="flex items-center gap-1">
                  <span
                    className="font-bold font-mono shrink-0"
                    style={{ fontSize, color: 'rgb(217, 119, 87)' }}
                  >
                    $
                  </span>
                  {currentTool ? (
                    <div className="min-w-0 truncate">
                      <MorphText
                        text={toolDescription || currentTool}
                        className="font-mono"
                        style={{ fontSize, color: 'rgba(255,255,255,0.75)' }}
                      />
                    </div>
                  ) : (
                    <span
                      className="flex items-center gap-1 font-mono"
                      style={{ fontSize, color: 'rgba(255,255,255,0.75)' }}
                    >
                      thinking
                      <TypingIndicator fontSize={fontSize} />
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </button>
  )
}
