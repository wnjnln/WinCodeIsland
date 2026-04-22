export interface HookEvent {
  hook_event_name?: string
  hookEventName?: string
  event_name?: string
  eventName?: string
  session_id?: string
  sessionId?: string
  tool_name?: string
  toolName?: string
  tool?: string
  name?: string
  agent_id?: string
  agentId?: string
  tool_input?: Record<string, unknown>
  toolInput?: Record<string, unknown>
  input?: Record<string, unknown>
  arguments?: Record<string, unknown>
  args?: Record<string, unknown>
  params?: Record<string, unknown>
  message?: string
  text?: string
  summary?: string
  status?: string
  detail?: string
  content?: string
  question?: string
  options?: string[]
  descriptions?: string[]
  header?: string
  agent_type?: string
  prompt?: string
  _source?: string
  [key: string]: unknown
}

export type PermissionDecision = { behavior: 'allow'; always?: boolean; toolName?: string } | { behavior: 'deny' }

export interface PermissionResponse {
  hookSpecificOutput: {
    hookEventName: 'PermissionRequest'
    decision: PermissionDecision
  }
}

export interface QuestionResponse {
  hookSpecificOutput: {
    hookEventName: 'Notification'
    answer: string
  }
}

export function normalizeEventName(event: HookEvent): string {
  return event.hookEventName ?? event.hook_event_name ?? event.eventName ?? event.event_name ?? ''
}

export function getSessionId(event: HookEvent): string | undefined {
  return event.session_id ?? event.sessionId
}

export function getToolName(event: HookEvent): string | undefined {
  return event.tool_name ?? event.toolName ?? event.tool ?? event.name
}

export function getToolInput(event: HookEvent): Record<string, unknown> | undefined {
  return event.tool_input ?? event.toolInput ?? event.input ?? event.arguments ?? event.args ?? event.params
}

export function extractQuestion(event: HookEvent): { question: string; options?: string[] } | null {
  if (typeof event.question === 'string') {
    return { question: event.question, options: Array.isArray(event.options) ? event.options : undefined }
  }
  return null
}

export type IslandSurface =
  | 'collapsed'
  | 'sessionList'
  | 'approvalCard'
  | 'questionCard'
  | 'completionCard'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface Session {
  sessionId: string
  toolName?: string
  status: 'idle' | 'processing' | 'waiting'
  currentTool?: string
  cwd?: string
  toolDescription?: string
  projectName?: string
  firstPrompt?: string
  recentMessages?: ChatMessage[]
  cliSource?: 'claude' | 'codex' | 'kimi' | 'other'
  terminalType?: string
  tags?: string[]
  durationSeconds?: number
  startedAt?: number
  subagentIcons?: string[]
  interrupted?: boolean
  wtSession?: string
  wtPid?: number
  wtHwnd?: number
  weztermPane?: string
  alacrittyWindow?: string
  kittyWindow?: string
  tabbyPane?: string
  tmux?: string
  tmuxPane?: string
  completed?: boolean
  isYoloMode?: boolean
  sessionTitle?: string
}

export interface DiscoveredSessionInfo {
  sessionId: string
  cwd?: string
  projectName?: string
  cliSource: 'claude' | 'codex' | 'kimi' | 'other'
  pid?: number
  model?: string
  recentMessages?: ChatMessage[]
  modifiedAt: number
  sessionTitle?: string
}

export type QuestionAnswer = string | { answers: Record<string, string> }
