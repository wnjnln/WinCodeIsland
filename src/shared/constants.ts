import { userInfo } from 'os'

export function getPipeName(): string {
  if (process.env.WINCLAUDE_ISLAND_PIPE) {
    return process.env.WINCLAUDE_ISLAND_PIPE
  }
  try {
    return `\\\\.\\pipe\\winclaude-island-${userInfo().username}`
  } catch {
    return '\\\\.\\pipe\\winclaude-island-default'
  }
}

export const SUPPORTED_EVENTS = [
  'SessionStart',
  'SessionEnd',
  'UserPromptSubmit',
  'PreToolUse',
  'PostToolUse',
  'PostToolUseFailure',
  'PermissionRequest',
  'PermissionDenied',
  'Stop',
  'SubagentStart',
  'SubagentStop',
  'Notification',
  'PreCompact'
] as const
