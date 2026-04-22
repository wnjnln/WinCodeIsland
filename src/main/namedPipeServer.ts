import { createServer, Server, Socket } from 'net'
import type { HookEvent, PermissionDecision } from '../shared/events'

export { HookEvent, PermissionDecision }

export function parseEvent(raw: string): HookEvent | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }
  if (!parsed || typeof parsed !== 'object') return null
  const obj = parsed as Record<string, unknown>
  const hasName = typeof (obj.hook_event_name ?? obj.hookEventName ?? obj.event_name ?? obj.eventName) === 'string'
  if (!hasName) return null
  return obj as HookEvent
}

export function buildPermissionResponse(decision: PermissionDecision): string {
  if (decision.behavior === 'allow' && (decision as any).always) {
    const toolName = (decision as any).toolName || ''
    const response = {
      hookSpecificOutput: {
        hookEventName: 'PermissionRequest',
        decision: {
          behavior: 'allow',
          updatedPermissions: [
            {
              type: 'addRules',
              rules: [{ toolName, ruleContent: '*' }],
              behavior: 'allow',
              destination: 'session',
            },
          ],
        },
      },
    }
    return JSON.stringify(response)
  }
  return JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PermissionRequest', decision }
  })
}

export function buildQuestionResponse(answer: string | { answers: Record<string, string> }): string {
  if (typeof answer === 'object' && answer.answers) {
    return JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PermissionRequest',
        decision: {
          behavior: 'allow',
          updatedInput: {
            answers: answer.answers,
          },
        },
      },
    })
  }
  return JSON.stringify({
    hookSpecificOutput: { hookEventName: 'Notification', answer }
  })
}

export type EventHandler = (event: HookEvent) => void
export type PermissionHandler = (event: HookEvent) => Promise<PermissionDecision>
export type QuestionHandler = (event: HookEvent) => Promise<string | { answers: Record<string, string> }>

export class NamedPipeServer {
  private server: Server | null = null
  private sockets = new Set<Socket>()
  static readonly maxPayloadSize = 1_048_576 // 1MB

  constructor(
    private pipeName: string,
    private onEvent: EventHandler,
    private onPermission: PermissionHandler,
    private onQuestion: QuestionHandler
  ) {}

  start(): void {
    this.server = createServer((socket) => {
      this.sockets.add(socket)
      const chunks: Buffer[] = []
      let size = 0
      let responded = false

      const handleEvent = async () => {
        if (responded) return
        responded = true
        this.sockets.delete(socket)
        const buffer = Buffer.concat(chunks)
        const event = parseEvent(buffer.toString('utf-8'))
        if (!event) {
          socket.end('{}')
          return
        }

        const name = String(event.hook_event_name ?? event.hookEventName ?? '')

        if (name === 'PermissionRequest') {
          try {
            const decision = await this.onPermission(event)
            socket.end(buildPermissionResponse(decision))
          } catch {
            socket.end(buildPermissionResponse({ behavior: 'deny' }))
          }
          return
        }

        if (name === 'Notification' && event.question) {
          try {
            const answer = await this.onQuestion(event)
            socket.end(buildQuestionResponse(answer))
          } catch {
            socket.end('{}')
          }
          return
        }

        this.onEvent(event)
        socket.end('{}')
      }

      socket.on('data', (data) => {
        size += data.length
        if (size > NamedPipeServer.maxPayloadSize) {
          responded = true
          socket.end('{}')
          return
        }
        chunks.push(data)
        // Attempt to parse immediately; if it succeeds we have the full payload.
        try {
          const raw = Buffer.concat(chunks).toString('utf-8')
          const event = parseEvent(raw)
          if (event) {
            handleEvent()
          }
        } catch {
          // ignore incomplete JSON
        }
      })

      socket.on('end', () => {
        handleEvent()
      })

      socket.on('error', () => {
        this.sockets.delete(socket)
        socket.destroy()
      })
    })

    this.server.on('error', () => {
      /* ignore */
    })

    this.server.listen(this.pipeName)
  }

  stop(): Promise<void> {
    return new Promise((resolve) => {
      for (const s of this.sockets) {
        s.destroy()
      }
      this.sockets.clear()
      this.server?.close(() => {
        this.server = null
        resolve()
      })
      if (!this.server) resolve()
    })
  }
}
