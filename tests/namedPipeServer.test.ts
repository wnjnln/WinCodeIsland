import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { parseEvent, buildPermissionResponse, buildQuestionResponse, NamedPipeServer } from '../src/main/namedPipeServer'
import { connect } from 'net'
import { userInfo } from 'os'

const testPipe = `\\\\.\\pipe\\winclaude-island-test-${Date.now()}`

describe('parseEvent', () => {
  it('parses a basic SessionStart event', () => {
    const raw = JSON.stringify({ hook_event_name: 'SessionStart', session_id: 'abc123' })
    const event = parseEvent(raw)
    expect(event!.hook_event_name).toBe('SessionStart')
    expect(getSessionId(event)).toBe('abc123')
  })

  it('parses camelCase fields', () => {
    const raw = JSON.stringify({ hookEventName: 'PreToolUse', sessionId: 's1', toolName: 'Bash' })
    const event = parseEvent(raw)
    expect(event!.hookEventName).toBe('PreToolUse')
    expect(getSessionId(event)).toBe('s1')
    expect(getToolName(event)).toBe('Bash')
  })

  it('returns null for invalid JSON', () => {
    expect(parseEvent('not json')).toBeNull()
  })

  it('returns null when no event name is present', () => {
    expect(parseEvent(JSON.stringify({ session_id: 'x' }))).toBeNull()
  })
})

describe('buildPermissionResponse', () => {
  it('builds allow response', () => {
    const resp = buildPermissionResponse({ behavior: 'allow' })
    expect(JSON.parse(resp)).toEqual({
      hookSpecificOutput: { hookEventName: 'PermissionRequest', decision: { behavior: 'allow' } }
    })
  })
})

describe('buildQuestionResponse', () => {
  it('builds answer response', () => {
    const resp = buildQuestionResponse('yes')
    expect(JSON.parse(resp)).toEqual({
      hookSpecificOutput: { hookEventName: 'Notification', answer: 'yes' }
    })
  })
})

describe('NamedPipeServer integration', () => {
  let server: NamedPipeServer
  const events: unknown[] = []

  beforeEach(() => {
    events.length = 0
    server = new NamedPipeServer(
      testPipe,
      (e) => events.push(e),
      async () => ({ behavior: 'allow' as const }),
      async () => 'yes'
    )
    server.start()
  })

  afterEach(async () => {
    await server.stop()
  })

  it('receives a SessionStart event and responds with {}', async () => {
    const response = await sendToPipe(testPipe, JSON.stringify({ hook_event_name: 'SessionStart', session_id: 's1' }))
    expect(response).toBe('{}')
    expect(events).toHaveLength(1)
    expect((events[0] as any).hook_event_name).toBe('SessionStart')
  })

  it('handles PermissionRequest and responds with decision', async () => {
    const response = await sendToPipe(testPipe, JSON.stringify({ hook_event_name: 'PermissionRequest', session_id: 's1' }))
    expect(JSON.parse(response)).toEqual({
      hookSpecificOutput: { hookEventName: 'PermissionRequest', decision: { behavior: 'allow' } }
    })
  })

  it('rejects oversized payload', async () => {
    const huge = 'x'.repeat(NamedPipeServer.maxPayloadSize + 10)
    const response = await sendToPipe(testPipe, JSON.stringify({ hook_event_name: 'SessionStart', data: huge }))
    expect(response).toBe('{}')
    expect(events).toHaveLength(0)
  })
})

function sendToPipe(pipe: string, data: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = connect(pipe)
    const chunks: Buffer[] = []
    client.on('data', chunk => chunks.push(chunk))
    client.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
    client.on('error', reject)
    client.write(data, () => client.end())
  })
}

function getSessionId(event: ReturnType<typeof parseEvent>) {
  if (!event) return null
  return event.session_id ?? event.sessionId
}

function getToolName(event: ReturnType<typeof parseEvent>) {
  if (!event) return null
  return event.tool_name ?? event.toolName ?? event.tool ?? event.name
}
