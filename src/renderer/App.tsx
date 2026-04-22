import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { NotchShell } from './components/NotchShell'
import { CompactBar } from './components/CompactBar'
import { IslandPanel } from './components/IslandPanel'
import { useHookEvent, usePermissionRequest, useQuestionRequest, useSurfaceChanged, useIpc } from './hooks/useIpc'
import type { IslandSurface, Session, ChatMessage } from '../shared/events'

const COLLAPSE_ON_LEAVE = true

function basename(p?: string): string | undefined {
  if (!p) return undefined
  const sep = p.includes('/') ? '/' : '\\'
  const parts = p.split(sep)
  return parts[parts.length - 1] || p
}
const SMART_SUPPRESS = false // enable later when terminal detection is ready

/** Read first non-empty string from event using prioritized key list */
function firstString(e: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const v = e[key]
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  // Check nested payload/data
  for (const container of ['payload', 'data']) {
    const nested = e[container]
    if (nested && typeof nested === 'object') {
      for (const key of keys) {
        const v = (nested as Record<string, unknown>)[key]
        if (typeof v === 'string' && v.trim()) return v.trim()
      }
    }
  }
  return undefined
}

/** Extract human-readable tool description from toolInput (matches CodeIsland) */
function extractToolDescription(toolName: string, toolInput?: Record<string, unknown>): string | undefined {
  if (!toolInput) return undefined
  switch (toolName) {
    case 'Bash':
      if (typeof toolInput.description === 'string' && toolInput.description) return toolInput.description
      if (typeof toolInput.command === 'string') {
        const line = toolInput.command.split('\n')[0] ?? toolInput.command
        return line.slice(0, 60)
      }
      break
    case 'Read':
      if (typeof toolInput.file_path === 'string') {
        const fp = toolInput.file_path
        const name = fp.includes('/') ? fp.split('/').pop() : fp.split('\\').pop()
        if (typeof toolInput.offset === 'number') return `${name}:${toolInput.offset}`
        return name
      }
      break
    case 'Edit':
    case 'Write':
      if (typeof toolInput.file_path === 'string') {
        const fp = toolInput.file_path
        return fp.includes('/') ? fp.split('/').pop() : fp.split('\\').pop()
      }
      break
    case 'Grep':
      if (typeof toolInput.pattern === 'string') {
        const path = typeof toolInput.path === 'string'
          ? ` in ${toolInput.path.includes('/') ? toolInput.path.split('/').pop() : toolInput.path.split('\\').pop()}`
          : ''
        return `${toolInput.pattern}${path}`
      }
      break
    case 'Glob':
      if (typeof toolInput.pattern === 'string') return toolInput.pattern
      break
    case 'WebSearch':
      if (typeof toolInput.query === 'string') return toolInput.query
      break
    case 'WebFetch':
      if (typeof toolInput.url === 'string') {
        try { return new URL(toolInput.url).host } catch { return toolInput.url.slice(0, 40) }
      }
      break
    case 'Task':
    case 'Agent':
      if (typeof toolInput.description === 'string' && toolInput.description) return toolInput.description
      if (typeof toolInput.prompt === 'string') return toolInput.prompt.slice(0, 40)
      break
    case 'TodoWrite':
      return 'Updating tasks'
    default:
      if (typeof toolInput.file_path === 'string') {
        const fp = toolInput.file_path
        return fp.includes('/') ? fp.split('/').pop() : fp.split('\\').pop()
      }
      if (typeof toolInput.pattern === 'string') return toolInput.pattern
      if (typeof toolInput.command === 'string') return toolInput.command.slice(0, 60)
      if (typeof toolInput.prompt === 'string') return toolInput.prompt.slice(0, 40)
  }
  return undefined
}

/** Get top-level fallback description from event */
function fallbackDescription(e: Record<string, unknown>): string | undefined {
  return firstString(e, ['message', 'text', 'summary', 'status', 'detail', 'content'])
}

export function App() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [surface, setSurfaceState] = useState<IslandSurface>('collapsed')
  const [permission, setPermission] = useState<{ toolName?: string; description?: string; toolInput?: Record<string, unknown> } | null>(null)
  const [question, setQuestion] = useState<{
    question?: string
    options?: string[]
    descriptions?: string[]
    allQuestions?: {
      payload: { question: string; options?: string[]; descriptions?: string[]; header?: string }
      answerKey: string
      multiSelect: boolean
    }[]
  } | null>(null)
  const [completionSessionId, setCompletionSessionId] = useState<string | null>(null)
  const [completionEntered, setCompletionEntered] = useState(false)
  const [grouping, setGrouping] = useState<'all' | 'status' | 'cli'>('all')
  const hoverTimerRef = useRef<number | null>(null)
  const isHoveredRef = useRef(false)

  const { sendPermissionDecision, sendQuestionAnswer, toggleExpand, setSurface, quitApp } = useIpc()

  useSurfaceChanged((s) => {
    setSurfaceState(s)
  })

  const overallStatus = useMemo(() => {
    if (permission || question) return 'waiting'
    if (sessions.some((s) => s.status === 'processing')) return 'processing'
    return 'idle'
  }, [sessions, permission, question])

  useHookEvent((event: unknown) => {
    const e = event as Record<string, unknown>
    const sid = String(e.session_id ?? e.sessionId ?? 'default')
    const name = String(e.hook_event_name ?? e.hookEventName ?? '')
    const tname = String(e.tool_name ?? e.toolName ?? e.tool ?? e.name ?? '')
    const toolInput = (e.tool_input ?? e.toolInput ?? e.input ?? e.arguments) as Record<string, unknown> | undefined
    const currentTool = tname || (toolInput ? Object.keys(toolInput)[0] : undefined)
    const cwd = String(e.cwd ?? '') || undefined
    const projectName = basename(cwd)
    const cliSource = (e.cliSource ?? e.cli_source ?? e._source ?? '') as Session['cliSource'] || undefined
    const sessionTitle = String(e.sessionTitle ?? e.session_title ?? '') || undefined

    // CodeIsland-style description extraction
    const toolDesc = extractToolDescription(tname, toolInput)
    const description = toolDesc || fallbackDescription(e) || ''

    // Build message content with full field priority (matches CodeIsland)
    let msgContent: string | undefined
    let newMessage: ChatMessage | undefined

    if (name === 'UserPromptSubmit') {
      msgContent = firstString(e, ['prompt', 'user_prompt', 'message', 'input', 'content'])
      if (msgContent) newMessage = { role: 'user', content: msgContent }
    } else if (name === 'Stop') {
      // Stop may carry the final assistant reply
      msgContent = firstString(e, ['last_assistant_message', 'text', 'message', 'summary'])
      if (msgContent) newMessage = { role: 'assistant', content: msgContent }
      // Also try to capture last user message if prompt wasn't set
      const lastUserMsg = firstString(e, ['last_user_message', 'prompt', 'user_prompt', 'message', 'input', 'content'])
      if (lastUserMsg && !msgContent) msgContent = lastUserMsg
    } else if (name === 'AfterAgentResponse') {
      // Cursor-specific: AI reply arrives here
      msgContent = firstString(e, ['text', 'message', 'content'])
      if (msgContent) newMessage = { role: 'assistant', content: msgContent }
    } else if (!['SessionStart', 'SessionEnd', 'PreToolUse', 'PostToolUse', 'PermissionRequest'].includes(name)) {
      msgContent = firstString(e, ['content', 'message', 'text', 'summary', 'detail'])
      if (msgContent) newMessage = { role: 'assistant', content: msgContent }
    }

    setSessions((prev) => {
      const existing = prev.find((s) => s.sessionId === sid)
      const next = prev.filter((s) => s.sessionId !== sid)
      let status: Session['status'] = 'idle'
      if (name === 'PreToolUse' || name === 'UserPromptSubmit') status = 'processing'
      if (name === 'PostToolUse' || name === 'SessionEnd' || name === 'Stop') status = 'idle'

      const prevMessages = existing?.recentMessages ?? []
      const recentMessages = newMessage
        ? [...prevMessages, newMessage].slice(-4)
        : prevMessages

      // firstPrompt: set on UserPromptSubmit, or fallback from Stop's last_user_message
      let firstPrompt = existing?.firstPrompt
      if (!firstPrompt && name === 'UserPromptSubmit' && msgContent) {
        firstPrompt = msgContent
      }
      if (!firstPrompt && name === 'Stop') {
        const lastUserMsg = firstString(e, ['last_user_message', 'prompt', 'user_prompt', 'message', 'input', 'content'])
        if (lastUserMsg) firstPrompt = lastUserMsg
      }

      const updated: Session = {
        ...existing,
        sessionId: sid,
        toolName: tname || existing?.toolName || undefined,
        status,
        currentTool: currentTool || existing?.currentTool || undefined,
        toolDescription: description || existing?.toolDescription || undefined,
        projectName: projectName ?? existing?.projectName ?? undefined,
        cwd: cwd ?? existing?.cwd ?? undefined,
        cliSource: cliSource ?? existing?.cliSource ?? undefined,
        sessionTitle: sessionTitle ?? existing?.sessionTitle ?? undefined,
        firstPrompt,
        recentMessages,
        startedAt: existing?.startedAt ?? Date.now(),
        completed: name === 'SessionEnd' ? true : existing?.completed,
        interrupted: (() => {
          if (name === 'UserPromptSubmit' || name === 'SessionStart') return false
          if (name === 'Stop') {
            const stopReason = String(e.stop_reason ?? e.stopReason ?? '')
            return stopReason === 'user' || stopReason === 'interrupted'
          }
          return existing?.interrupted
        })(),
      }
      next.unshift(updated)
      return next.slice(0, 10)
    })

    if (name === 'SessionEnd' || name === 'Stop') {
      setCompletionSessionId((prev) => prev || sid)
      setSurface('completionCard')
    }
  })

  usePermissionRequest((event: unknown) => {
    const e = event as Record<string, unknown>
    const tname = String(e.tool_name ?? e.toolName ?? e.tool ?? e.name ?? '')
    const desc = String(e.message ?? e.text ?? e.summary ?? e.detail ?? e.content ?? '')
    const tinput = (e.tool_input ?? e.toolInput ?? e.input ?? e.arguments) as Record<string, unknown> | undefined
    setPermission({ toolName: tname || undefined, description: desc || undefined, toolInput: tinput })
  })

  useQuestionRequest((event: unknown) => {
    const e = event as Record<string, unknown>
    const q = String(e.question ?? e.message ?? '')
    const opts = Array.isArray(e.options) ? (e.options as string[]) : undefined
    const descs = Array.isArray(e.descriptions) ? (e.descriptions as string[]) : undefined
    const allQuestions = Array.isArray(e.allQuestions)
      ? (e.allQuestions as {
          payload: { question: string; options?: string[]; descriptions?: string[]; header?: string }
          answerKey: string
          multiSelect: boolean
        }[])
      : undefined
    setQuestion({ question: q || undefined, options: opts, descriptions: descs, allQuestions })
  })

  const handleAllow = () => {
    sendPermissionDecision('allow')
    setPermission(null)
  }

  const handleAlwaysAllow = () => {
    sendPermissionDecision('allow', true, permission?.toolName)
    setPermission(null)
  }

  const handleDeny = () => {
    sendPermissionDecision('deny')
    setPermission(null)
  }

  const handleAnswer = (answer: string) => {
    sendQuestionAnswer(answer)
    setQuestion(null)
  }

  const handleSkip = () => {
    sendQuestionAnswer('')
    setQuestion(null)
  }

  const handleMultiAnswer = (answers: Record<string, string>) => {
    sendQuestionAnswer({ answers })
    setQuestion(null)
  }

  const clearHoverTimer = useCallback(() => {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
  }, [])

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true
    clearHoverTimer()

    if (surface === 'approvalCard' || surface === 'questionCard') return
    if (surface === 'completionCard') {
      setCompletionEntered(true)
      return
    }

    if (SMART_SUPPRESS) {
      // placeholder
    }

    hoverTimerRef.current = window.setTimeout(() => {
      if (!isHoveredRef.current) return
      setSurface('sessionList')
      setSurfaceState('sessionList')
      setCompletionSessionId(null)
    }, 500)
  }, [surface, clearHoverTimer, setSurface])

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false
    clearHoverTimer()

    if (surface === 'approvalCard' || surface === 'questionCard') return
    if (surface === 'completionCard') {
      if (completionEntered) {
        setSurface('collapsed')
        setSurfaceState('collapsed')
        setCompletionSessionId(null)
        setCompletionEntered(false)
      }
      return
    }

    if (!COLLAPSE_ON_LEAVE) return

    hoverTimerRef.current = window.setTimeout(() => {
      if (isHoveredRef.current) return
      setSurface('collapsed')
      setSurfaceState('collapsed')
    }, 150)
  }, [surface, completionEntered, clearHoverTimer, setSurface])

  useEffect(() => {
    if (surface !== 'completionCard') return
    if (completionEntered) return
    const t = window.setTimeout(() => {
      setSurface('collapsed')
      setSurfaceState('collapsed')
      setCompletionSessionId(null)
    }, 5000)
    return () => window.clearTimeout(t)
  }, [surface, completionEntered, setSurface])

  const expanded = surface !== 'collapsed'
  const notchHeight = 40

  return (
    <div
      className="w-full h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <NotchShell expanded={expanded} notchHeight={notchHeight}>
        {!expanded ? (
          <CompactBar
            sessions={sessions}
            status={overallStatus}
            activeCount={sessions.filter((s) => s.status !== 'idle').length}
            totalCount={sessions.length}
            showToolStatus={true}
            onClick={() => {
              toggleExpand()
            }}
          />
        ) : (
          <IslandPanel
            sessions={sessions}
            onlySessionId={surface === 'completionCard' ? completionSessionId : null}
            permission={surface === 'approvalCard' ? permission : null}
            question={surface === 'questionCard' ? question : null}
            status={overallStatus}
            activeCount={sessions.filter((s) => s.status !== 'idle').length}
            totalCount={sessions.length}
            showToolStatus={true}
            grouping={grouping}
            onGroupingChange={setGrouping}
            onAllow={handleAllow}
            onAlwaysAllow={handleAlwaysAllow}
            onDeny={handleDeny}
            onAnswer={handleAnswer}
            onSkip={handleSkip}
            onMultiAnswer={handleMultiAnswer}
            onToggleCollapse={() => toggleExpand()}
            onQuit={() => quitApp()}
          />
        )}
      </NotchShell>
    </div>
  )
}
