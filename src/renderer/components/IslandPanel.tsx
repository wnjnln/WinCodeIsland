import { SessionCard } from './SessionCard'
import { PermissionCard } from './PermissionCard'
import { QuestionCard } from './QuestionCard'
import { CompactBar } from './CompactBar'
import { ThinScrollView } from './ThinScrollView'
import type { CSSProperties } from 'react'
import type { Session } from '../../shared/events'

interface IslandPanelProps {
  sessions: Session[]
  onlySessionId?: string | null
  permission?: { toolName?: string; description?: string; toolInput?: Record<string, unknown> } | null
  question?: {
    question?: string
    options?: string[]
    descriptions?: string[]
    allQuestions?: {
      payload: { question: string; options?: string[]; descriptions?: string[]; header?: string }
      answerKey: string
      multiSelect: boolean
    }[]
  } | null
  status?: 'idle' | 'processing' | 'waiting'
  activeCount?: number
  totalCount?: number
  showToolStatus?: boolean
  grouping?: 'all' | 'status' | 'cli'
  onGroupingChange?: (g: 'all' | 'status' | 'cli') => void
  onAllow: () => void
  onAlwaysAllow: () => void
  onDeny: () => void
  onAnswer: (answer: string) => void
  onSkip: () => void
  onMultiAnswer: (answers: Record<string, string>) => void
  onToggleCollapse?: () => void
  onQuit?: () => void
}

// ═══════════════════════════════════════════
// CLI brand icons (from original CodeIsland project)
// ═══════════════════════════════════════════

function KimiIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style}>
      <path d="M12 3c.55 0 1.08.06 1.6.17a8 8 0 0 0 5.23 14.83A9 9 0 1 1 12 3z" fill="#4A6CF7" />
    </svg>
  )
}

function CliIcon({ source, className, style }: { source: string; className?: string; style?: CSSProperties }) {
  switch (source) {
    case 'claude':
    case 'codex': {
      const src = source === 'claude' ? './claude.png' : './codex.png'
      const alt = source === 'claude' ? 'Claude' : 'Codex'
      return (
        <div className={`shrink-0 overflow-hidden ${className || ''}`} style={style}>
          <img src={src} alt={alt} className="w-full h-full object-contain block" />
        </div>
      )
    }
    case 'kimi':
      return <KimiIcon className={className} style={style} />
    default: return null
  }
}

type GroupDef = { key: string; label: string; sessions: Session[] }

function groupByStatus(sessions: Session[]): GroupDef[] {
  const running = sessions.filter((s) => s.status === 'processing')
  const waiting = sessions.filter((s) => s.status === 'waiting')
  const idle = sessions.filter((s) => s.status === 'idle')
  const groups: GroupDef[] = []
  if (running.length) groups.push({ key: 'running', label: 'Running', sessions: running })
  if (waiting.length) groups.push({ key: 'waiting', label: 'Waiting', sessions: waiting })
  if (idle.length) groups.push({ key: 'idle', label: 'Idle', sessions: idle })
  return groups
}

function groupByCli(sessions: Session[]): GroupDef[] {
  const claude = sessions.filter((s) => s.cliSource === 'claude')
  const codex = sessions.filter((s) => s.cliSource === 'codex')
  const kimi = sessions.filter((s) => s.cliSource === 'kimi')
  const other = sessions.filter((s) => s.cliSource === 'other' || !s.cliSource)
  const groups: GroupDef[] = []
  if (claude.length) groups.push({ key: 'claude', label: 'Claude', sessions: claude })
  if (codex.length) groups.push({ key: 'codex', label: 'Codex', sessions: codex })
  if (kimi.length) groups.push({ key: 'kimi', label: 'Kimi', sessions: kimi })
  if (other.length) groups.push({ key: 'other', label: 'Other', sessions: other })
  return groups
}

function GroupHeader({ label, count, groupKey }: { label: string; count: number; groupKey: string }) {
  const isCli = ['claude', 'codex', 'kimi'].includes(groupKey)
  return (
    <div className="flex items-center gap-2 px-1 py-1.5 text-[10px] font-medium text-white/50">
      {isCli && <CliIcon source={groupKey} className="w-[14px] h-[14px]" />}
      <span>{label}</span>
      <span className="text-white/30">({count})</span>
    </div>
  )
}

export function IslandPanel({
  sessions,
  onlySessionId,
  permission,
  question,
  status: statusProp,
  activeCount = 0,
  totalCount = 0,
  showToolStatus = true,
  grouping = 'all',
  onGroupingChange,
  onAllow,
  onAlwaysAllow,
  onDeny,
  onAnswer,
  onSkip,
  onMultiAnswer,
  onToggleCollapse,
  onQuit,
}: IslandPanelProps) {
  const displaySessions = onlySessionId
    ? sessions.filter((s) => s.sessionId === onlySessionId)
    : sessions

  const headerStatus = statusProp ?? (permission || question
    ? 'waiting'
    : sessions.some((s) => s.status === 'processing')
      ? 'processing'
      : 'idle')

  // Build groups based on grouping mode
  let groups: GroupDef[] = []
  if (onlySessionId || grouping === 'all') {
    groups = [{ key: 'all', label: 'All Sessions', sessions: displaySessions }]
  } else if (grouping === 'status') {
    groups = groupByStatus(displaySessions)
  } else if (grouping === 'cli') {
    groups = groupByCli(displaySessions)
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="shrink-0">
        <CompactBar
          sessions={sessions}
          status={headerStatus}
          activeCount={activeCount}
          totalCount={totalCount}
          showToolStatus={showToolStatus}
          onClick={onToggleCollapse}
          expanded
          onQuit={onQuit}
          grouping={grouping}
          onGroupingChange={onGroupingChange}
        />
      </div>

      <div
        className="shrink-0"
        style={{
          height: '0.5px',
          backgroundImage: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.25) 20%, rgba(255,255,255,0.25) 80%, transparent 100%)',
          backgroundSize: '8px 0.5px',
          backgroundRepeat: 'repeat-x',
        }}
      />

      <ThinScrollView className="flex-1 min-h-0 p-4 pt-3">
        <div className="flex flex-col gap-3">
          {permission && (
            <PermissionCard
              toolName={permission.toolName}
              description={permission.description}
              toolInput={permission.toolInput}
              onAllow={onAllow}
              onAlwaysAllow={onAlwaysAllow}
              onDeny={onDeny}
            />
          )}

          {question && (
            <QuestionCard
              question={question.question}
              options={question.options}
              descriptions={question.descriptions}
              allQuestions={question.allQuestions}
              onAnswer={onAnswer}
              onSkip={onSkip}
              onMultiAnswer={onMultiAnswer}
            />
          )}

          {groups.map((group) => (
            <div key={group.key} className="flex flex-col gap-1">
              {(onlySessionId ? false : grouping !== 'all') && (
                <GroupHeader label={group.label} count={group.sessions.length} groupKey={group.key} />
              )}
              <div className="flex flex-col gap-2">
                {group.sessions.map((s) => (
                  <SessionCard key={s.sessionId} session={s} isCompletion={!!onlySessionId} />
                ))}
              </div>
            </div>
          ))}

          {displaySessions.length === 0 && !permission && !question && (
            <div className="text-center text-white/40 text-xs py-4">暂无活跃会话</div>
          )}
        </div>
      </ThinScrollView>
    </div>
  )
}
