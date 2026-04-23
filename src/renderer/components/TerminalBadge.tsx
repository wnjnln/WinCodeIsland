import type { CSSProperties } from 'react'

interface TerminalBadgeProps {
  terminalType?: string
  size?: number
  onClick?: () => void
}

// ═══════════════════════════════════════════
// Terminal SVG Icons (10px default to match macOS icon safe-area feel)
// ═══════════════════════════════════════════

function WindowsTerminalIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style}>
      <rect x="1" y="1" width="10" height="10" rx="1" fill="#4D4D4D" />
      <rect x="13" y="1" width="10" height="10" rx="1" fill="#4D4D4D" />
      <rect x="1" y="13" width="10" height="10" rx="1" fill="#4D4D4D" />
      <rect x="13" y="13" width="10" height="10" rx="1" fill="#0078D4" />
    </svg>
  )
}

function PowerShellIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style}>
      <rect x="2" y="2" width="20" height="20" rx="3" fill="#012456" />
      <path d="M6 6l5 3.5v1L7 12.5v1.5l6-3.5V9L6 6z" fill="#fff" />
      <rect x="6" y="15" width="8" height="1.5" rx="0.5" fill="#fff" />
    </svg>
  )
}

function VSCodeIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style}>
      <path d="M17.583.063a1.5 1.5 0 011.342.891l.063.146 4 17a1.5 1.5 0 01-2.7 1.18l-.06-.116L15.587 15l-3.98 4.313a1.5 1.5 0 01-1.906.172l-.123-.09-3.92-3.133a1.5 1.5 0 01-.11-2.217l.11-.11 2.98-2.386L6.648 9.34a1.5 1.5 0 01.103-2.228l.11-.11 3.92-3.133a1.5 1.5 0 011.906-.172l.123.09L15.587 6l4.641-5.063a1.5 1.5 0 011.355-.874z" fill="#007ACC" />
    </svg>
  )
}

function CursorIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style}>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#1e1e1e" stroke="#333" strokeWidth="0.5" />
      <path d="M7 6l8 5.5-8 5.5V6z" fill="#fff" />
      <path d="M16 16l3 3" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function WarpIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style}>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#01A4FF" />
      <path d="M8 7l5 5-5 5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="14" y="15" width="3" height="2" rx="1" fill="#fff" />
    </svg>
  )
}

function WezTermIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style}>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#4B4F51" />
      <path d="M7 7l5 5-5 5" stroke="#7EE787" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 17h4" stroke="#7EE787" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function AlacrittyIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style}>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#FDB913" />
      <path d="M7 8h10M7 12h8M7 16h6" stroke="#1D1D1D" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function KittyIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style}>
      <ellipse cx="12" cy="14" rx="7" ry="6" fill="#D3A8E0" />
      <path d="M6 8L4 3l4 3" fill="#D3A8E0" />
      <path d="M18 8l2-5-4 3" fill="#D3A8E0" />
      <circle cx="9.5" cy="13" r="1" fill="#333" />
      <circle cx="14.5" cy="13" r="1" fill="#333" />
      <ellipse cx="12" cy="15.5" rx="1.5" ry="1" fill="#FFB6C1" />
    </svg>
  )
}

function ItermIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style}>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#1C1C1C" />
      <path d="M7 7l4 3.5L7 14" stroke="#0F0" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="13" y="13" width="4" height="2" rx="1" fill="#0F0" />
    </svg>
  )
}

function HyperIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style}>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#000" />
      <path d="M7 7l5 5-5 5" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 17h4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function TabbyIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style}>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#29335C" />
      <path d="M7 8l4 4-4 4" stroke="#FFC107" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="14" y="14" width="4" height="2" rx="1" fill="#FFC107" />
    </svg>
  )
}

function GhosttyIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style}>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#282A36" />
      <path d="M12 5c-3 0-5.5 2-5.5 5.5 0 2 1 3.5 2.5 4.5v2h6v-2c1.5-1 2.5-2.5 2.5-4.5C17.5 7 15 5 12 5z" fill="#F8F8F2" />
      <circle cx="10" cy="11" r="1" fill="#282A36" />
      <circle cx="14" cy="11" r="1" fill="#282A36" />
      <path d="M11 13.5c.5.5 1.5.5 2 0" stroke="#282A36" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function RioIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style}>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#1A1A1A" />
      <path d="M7 7l4 4-4 4" stroke="#E8A87C" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="14" y="14" width="4" height="2" rx="1" fill="#E8A87C" />
    </svg>
  )
}

function CmderIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style}>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#1B1D1E" />
      <path d="M7 7l4 3.5L7 14" stroke="#4AF626" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="13" y="13" width="4" height="2" rx="1" fill="#4AF626" />
    </svg>
  )
}

function JetBrainsIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style}>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#000" />
      <path d="M6 18l4-12 4 8 4-4v8H6z" fill="#fff" opacity="0.9" />
      <rect x="8" y="8" width="4" height="4" rx="1" fill="#07C3F2" />
    </svg>
  )
}

function ZedIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style}>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#0B0F19" />
      <path d="M7 7h10l-8 10h8" stroke="#E5E7EB" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GenericTerminalIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  const cyan = '#73B8FF'
  return (
    <svg viewBox="0 0 24 24" className={className} style={style}>
      <rect x="2" y="3" width="20" height="18" rx="3" fill="none" stroke={cyan} strokeWidth="1.5" />
      <path d="M6 8l4 3.5L6 15" stroke={cyan} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="11" y="14" width="6" height="1.5" rx="0.5" fill={cyan} />
    </svg>
  )
}

// ═══════════════════════════════════════════
// Terminal detection
// ═══════════════════════════════════════════

interface TerminalInfo {
  name: string
  Icon: React.FC<{ className?: string; style?: CSSProperties }>
}

function detectTerminal(event: Record<string, unknown>): TerminalInfo {
  const termApp = String(event._term_app ?? '').toLowerCase()
  const hasWtSession = !!event._wt_session
  const hasWezterm = !!event._wezterm_pane
  const hasAlacritty = !!event._alacritty_window
  const hasKitty = !!event._kitty_window
  const hasTabby = !!event._tabby_pane
  const hasTmux = !!event._tmux

  // Windows Terminal
  if (hasWtSession) return { name: 'Windows Terminal', Icon: WindowsTerminalIcon }

  // WezTerm
  if (hasWezterm) return { name: 'WezTerm', Icon: WezTermIcon }

  // Alacritty
  if (hasAlacritty) return { name: 'Alacritty', Icon: AlacrittyIcon }

  // Kitty
  if (hasKitty) return { name: 'Kitty', Icon: KittyIcon }

  // Tabby
  if (hasTabby) return { name: 'Tabby', Icon: TabbyIcon }

  // TERM_PROGRAM based detection
  if (termApp.includes('warp')) return { name: 'Warp', Icon: WarpIcon }
  if (termApp.includes('iterm')) return { name: 'iTerm2', Icon: ItermIcon }
  if (termApp.includes('ghostty')) return { name: 'Ghostty', Icon: GhosttyIcon }
  if (termApp.includes('hyper')) return { name: 'Hyper', Icon: HyperIcon }
  if (termApp.includes('rio')) return { name: 'Rio', Icon: RioIcon }
  if (termApp.includes('vscode') || termApp.includes('vscodium')) return { name: 'VS Code', Icon: VSCodeIcon }
  if (termApp.includes('cursor')) return { name: 'Cursor', Icon: CursorIcon }
  if (termApp.includes('jetbrains')) return { name: 'JetBrains', Icon: JetBrainsIcon }
  if (termApp.includes('zed')) return { name: 'Zed', Icon: ZedIcon }
  if (termApp.includes('cmder') || termApp.includes('conemu')) return { name: 'Cmder', Icon: CmderIcon }

  // PowerShell must be checked BEFORE generic 'terminal' because 'powershell' contains 'terminal'
  if (termApp.includes('powershell') || termApp.includes('pwsh')) return { name: 'PowerShell', Icon: PowerShellIcon }

  // Terminal.app and generic
  if (termApp.includes('terminal') || termApp.includes('apple_terminal')) return { name: 'Terminal', Icon: GenericTerminalIcon }

  // tmux (when running inside any terminal)
  if (hasTmux) return { name: 'tmux', Icon: GenericTerminalIcon }

  return { name: termApp || 'Terminal', Icon: GenericTerminalIcon }
}

// ═══════════════════════════════════════════
// Component
// ═══════════════════════════════════════════

function ArrowIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export function TerminalBadge({ terminalType, size = 20, onClick }: TerminalBadgeProps) {
  if (!terminalType) return null

  const { name, Icon } = detectTerminal({ _term_app: terminalType })

  return (
    <div
      className={`inline-flex items-center gap-[1px] px-[0.2px] py-[0.1px] rounded-[1px] ${onClick ? 'cursor-pointer' : ''}`}
      title={name}
      onClick={onClick}
    >
      {/* macOS-style icon safe-area: 13px container, 10px content, 1.5px padding */}
      <div
        className="shrink-0 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <Icon style={{ width: Math.max(8, size - 3), height: Math.max(8, size - 3) }} />
      </div>
      <span className="text-[9.5px] font-medium text-[#4ADE80] whitespace-nowrap font-mono leading-none">
        {name}
      </span>
      <ArrowIcon className="w-[9px] h-[9px] text-[#4ADE80] shrink-0" />
    </div>
  )
}

// Exported for SessionCard to pass full event data
export function TerminalBadgeFromEvent({ event, size = 20, onClick }: { event: Record<string, unknown>; size?: number; onClick?: () => void }) {
  const { name, Icon } = detectTerminal(event)

  return (
    <div
      className={`inline-flex items-center gap-[3px] px-[1px] py-[0.5px] rounded-[3px] ${onClick ? 'cursor-pointer' : ''}`}
      title={name}
      onClick={onClick}
    >
      {/* macOS-style icon safe-area: 13px container, 10px content, 1.5px padding */}
      <div
        className="shrink-0 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <Icon style={{ width: Math.max(8, size - 3), height: Math.max(8, size - 3) }} />
      </div>
      <span className="text-[9.5px] font-medium text-[#4ADE80] whitespace-nowrap font-mono leading-none">
        {name}
      </span>
      <ArrowIcon className="w-[9px] h-[9px] text-[#4ADE80] shrink-0" />
    </div>
  )
}
