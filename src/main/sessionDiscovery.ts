import path from 'path'
import os from 'os'
import fs from 'fs'
export function claudeProjectDirEncoded(dir: string): string {
  let result = ''
  for (const c of dir) {
    const code = c.charCodeAt(0)
    if (c === '/' || c === ' ' || c === '\\' || code > 127) {
      result += '-'
    } else {
      result += c
    }
  }
  return result
}

export function readCodexTitle(sessionId: string): string | null {
  try {
    const indexPath = path.join(os.homedir(), '.codex', 'session_index.jsonl')
    if (!fs.existsSync(indexPath)) return null
    const contents = fs.readFileSync(indexPath, 'utf-8')
    let latestTitle: string | null = null
    let latestTime = ''
    for (const line of contents.split(/\r?\n/)) {
      if (!line.trim()) continue
      try {
        const entry = JSON.parse(line) as { id?: string; thread_name?: string; updated_at?: string }
        if (entry.id === sessionId && entry.thread_name) {
          const rawTitle = String(entry.thread_name).trim()
          if (rawTitle && (!latestTime || (entry.updated_at && entry.updated_at > latestTime))) {
            latestTitle = rawTitle
            latestTime = entry.updated_at || ''
          }
        }
      } catch { /* ignore malformed line */ }
    }
    return latestTitle
  } catch {
    return null
  }
}

export function startSessionDiscovery(
  _sendToRenderer: (sessions: unknown[]) => void,
  _sendRemovedToRenderer: (sessionIds: string[]) => void
): { stop: () => void } {
  // Scanning disabled — sessions are discovered exclusively via hook events.
  return { stop: () => {} }
}
