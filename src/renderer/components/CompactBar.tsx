import { useState } from 'react'
import { Mascot } from './mascot/Mascot'
import { AppLogo } from './AppLogo'
import type { Session } from '../../shared/events'

interface CompactBarProps {
  sessions: Session[]
  status?: 'idle' | 'processing' | 'waiting'
  activeCount?: number
  totalCount?: number
  showToolStatus: boolean
  onClick?: () => void
  expanded?: boolean
  onQuit?: () => void
  grouping?: 'all' | 'status' | 'cli'
  onGroupingChange?: (g: 'all' | 'status' | 'cli') => void
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18 16v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-6 6c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z" />
    </svg>
  )
}

function SpeakerOnIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  )
}

function SpeakerOffIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    </svg>
  )
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84a.484.484 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.488.488 0 0 0-.59.22L2.74 8.87a.49.49 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.27.41.48.41h3.84c.24 0 .44-.17.48-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
    </svg>
  )
}

function PowerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 3c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1zM17.14 5.86a.996.996 0 0 0-1.41 0 1 1 0 0 0 0 1.41C17.5 8.05 18.5 9.95 18.5 12c0 3.59-2.91 6.5-6.5 6.5S5.5 15.59 5.5 12c0-2.05 1-3.95 2.57-5.23a1 1 0 0 0 .15-1.41.995.995 0 0 0-1.41-.15C4.61 6.85 3.25 9.28 3.25 12c0 4.83 3.92 8.75 8.75 8.75s8.75-3.92 8.75-8.75c0-2.72-1.36-5.15-3.61-6.89z" />
    </svg>
  )
}

function TypingIndicator() {
  return (
    <span className="inline-flex items-center gap-[2px] px-[3px]">
      <span className="w-[3px] h-[3px] rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-[3px] h-[3px] rounded-full bg-current animate-bounce" style={{ animationDelay: '120ms' }} />
      <span className="w-[3px] h-[3px] rounded-full bg-current animate-bounce" style={{ animationDelay: '240ms' }} />
    </span>
  )
}

function toolStatusColor(tool: string): string {
  const t = tool.toLowerCase()
  if (t === 'bash') return '#66FF80'
  if (t === 'edit' || t === 'write') return '#80B3FF'
  if (t === 'read') return '#E6CC66'
  if (t === 'grep' || t === 'glob') return '#CC99FF'
  if (t === 'agent') return '#FF9966'
  return 'rgba(255,255,255,0.85)'
}

function basename(p?: string): string | undefined {
  if (!p) return undefined
  const sep = p.includes('/') ? '/' : '\\'
  const parts = p.split(sep)
  return parts[parts.length - 1] || p
}

function NotchIconButton({
  children,
  onClick,
  tint = 'text-white/85',
  title,
}: {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  tint?: string
  title?: string
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-[34px] h-[34px] rounded-full flex items-center justify-center transition-transform duration-150 hover:scale-110 ${tint} hover:bg-current/15`}
      style={{ backgroundColor: 'transparent' }}
    >
      {children}
    </button>
  )
}

export function CompactBar({
  sessions,
  status: statusProp,
  activeCount = 0,
  totalCount = 0,
  showToolStatus,
  onClick,
  expanded = false,
  onQuit,
  grouping = 'all',
  onGroupingChange,
}: CompactBarProps) {
  const activeSession = sessions.find((s) => s.status !== 'idle') || sessions[0]
  const status = statusProp ?? activeSession?.status ?? 'idle'
  const tool = activeSession?.currentTool
  const projectName = basename(activeSession?.cwd)
  const description = activeSession?.toolDescription

  const [soundEnabled, setSoundEnabled] = useState(true)

  const statusDot = {
    idle: 'bg-white/30',
    processing: 'bg-orange-400 animate-pulse',
    waiting: 'hidden',
  }[status]

  const countSizeClass = showToolStatus
    ? 'text-[12px] font-semibold'
    : 'text-[13px] font-bold'

  const showThinking = status === 'processing' && !tool
  const showTool = !!tool

  if (expanded) {
    return (
      <div
        onClick={onClick}
        className={`w-full flex items-center justify-between px-3 ${onClick ? 'cursor-pointer' : ''}`}
        style={{ height: 36 }}
      >
        {/* Left: Logo + grouping tabs */}
        <div className="flex items-center gap-2 overflow-hidden shrink-0">
          <AppLogo size={36} showBackground={false} />
          {sessions.length > 1 && (
            <div className="flex items-center bg-white/5 border border-white/10">
              {([
                ['all', 'ALL'],
                ['status', 'STA'],
                ['cli', 'CLI'],
              ] as const).map(([tag, label]) => {
                const selected = grouping === tag
                return (
                  <button
                    key={tag}
                    onClick={(e) => {
                      e.stopPropagation()
                      onGroupingChange?.(tag)
                    }}
                    className={`px-[5px] py-1 text-[10px] font-medium transition-colors ${
                      selected ? 'bg-white/10 text-[#66FF80]' : 'text-white/40 hover:text-white/70'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Center: tool status on non-notch, empty on notch */}
        {showToolStatus ? (
          <div className="flex-1" />
        ) : (
          <div className="flex-1 min-w-0 px-3 flex flex-col items-center justify-center">
            {projectName && (
              <span className="text-[11px] font-semibold text-white/90 truncate max-w-full">
                {projectName}
              </span>
            )}
            {description && (
              <span className="text-[10px] text-white/60 truncate max-w-full">
                {description}
              </span>
            )}
          </div>
        )}

        {/* Right: sound, settings, exit */}
        <div className="flex items-center gap-1 shrink-0">
          <NotchIconButton
            onClick={(e) => {
              e.stopPropagation()
              setSoundEnabled((v) => !v)
            }}
            title={soundEnabled ? 'Mute' : 'Enable sound'}
          >
            {soundEnabled ? (
              <SpeakerOnIcon className="w-[14px] h-[14px]" />
            ) : (
              <SpeakerOffIcon className="w-[14px] h-[14px]" />
            )}
          </NotchIconButton>

          <NotchIconButton
            onClick={(e) => {
              e.stopPropagation()
              window.ipcAPI.openSettings()
            }}
            title="Settings"
          >
            <SettingsIcon className="w-[14px] h-[14px]" />
          </NotchIconButton>

          <NotchIconButton onClick={onQuit} tint="text-[#FF6666]" title="Quit">
            <PowerIcon className="w-[14px] h-[14px]" />
          </NotchIconButton>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 ${onClick ? 'cursor-pointer' : ''}`}
      style={{ height: '100%' }}
    >
      <div className="flex items-center gap-2 overflow-hidden shrink-0">
        <Mascot size={24} status={status} source={activeSession?.cliSource} />
        {showToolStatus && showTool && (
          <span
            className="text-[10px] font-medium whitespace-nowrap"
            style={{ color: toolStatusColor(tool) }}
          >
            {tool}
          </span>
        )}
        {showToolStatus && showThinking && (
          <span className="text-[10px] font-medium text-white/80 whitespace-nowrap flex items-center gap-1">
            thinking
            <TypingIndicator />
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0 px-3 flex flex-col items-center justify-center">
        {projectName && (
          <span className="text-[11px] font-semibold text-white/90 truncate max-w-full">
            {projectName}
          </span>
        )}
        {description && (
          <span className="text-[10px] text-white/60 truncate max-w-full">
            {description}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {totalCount > 0 && (
          <span className={`font-mono ${countSizeClass}`}>
            {activeCount > 0 && (
              <>
                <span style={{ color: '#66FF80' }}>{activeCount}</span>
                <span className="text-white/40">/</span>
              </>
            )}
            <span className="text-white/90">{totalCount}</span>
          </span>
        )}

        {status === 'waiting' ? (
          <BellIcon className="w-[11px] h-[11px] text-amber-400 animate-pulse" />
        ) : (
          <span className={`w-2 h-2 rounded-full ${statusDot}`} />
        )}
      </div>
    </div>
  )
}
