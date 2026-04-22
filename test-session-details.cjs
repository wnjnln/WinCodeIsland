const net = require('net')
const os = require('os')

const pipeName = `\\\\.\\pipe\\winclaude-island-${os.userInfo().username}`

function sendEvent(event) {
  return new Promise((resolve, reject) => {
    const client = net.connect(pipeName, () => {
      client.write(JSON.stringify(event), () => {
        client.end()
      })
    })

    let response = ''
    client.on('data', (chunk) => {
      response += chunk.toString()
    })

    client.on('end', () => {
      resolve(response)
    })

    client.on('error', (err) => {
      reject(err)
    })

    setTimeout(() => {
      client.destroy()
      resolve('')
    }, 2000)
  })
}

async function main() {
  const sessionId = `test-${Date.now().toString(36)}`
  const cwd = process.cwd()

  console.log('=== Testing Session Card Features ===')
  console.log('Session ID:', sessionId)
  console.log('CWD:', cwd)
  console.log('Pipe:', pipeName)
  console.log('')

  // 1. Create a session with UserPromptSubmit (includes cwd for folder click test)
  console.log('1. Sending UserPromptSubmit (creates session with cwd)...')
  await sendEvent({
    hook_event_name: 'UserPromptSubmit',
    session_id: sessionId,
    cwd: cwd,
    input: 'Help me optimize this React component performance',
    _source: 'claude',
  })
  console.log('   -> Session created. Click the project name to open folder.')
  console.log('')

  // 2. Send PreToolUse + PostToolUse with agent tool (description contains Markdown)
  console.log('2. Sending PreToolUse + PostToolUse (agent tool with Markdown)...')
  await sendEvent({
    hook_event_name: 'PreToolUse',
    session_id: sessionId,
    tool_name: 'agent',
    tool_input: { description: 'Analyzing **performance** bottlenecks in `List.tsx`' },
    _source: 'claude',
  })

  await new Promise(r => setTimeout(r, 500))

  await sendEvent({
    hook_event_name: 'PostToolUse',
    session_id: sessionId,
    tool_name: 'agent',
    tool_input: { description: 'Analyzing **performance** bottlenecks in `List.tsx`' },
    _source: 'claude',
  })
  console.log('   -> AI message should show: bold "performance" + code "List.tsx"')
  console.log('')

  // 3. Send another UserPromptSubmit + PostToolUse with more markdown
  console.log('3. Sending another interaction with italic and strikethrough...')
  await sendEvent({
    hook_event_name: 'UserPromptSubmit',
    session_id: sessionId,
    cwd: cwd,
    input: 'Show me *italic* and ~~strikethrough~~ formatting',
    _source: 'claude',
  })

  await new Promise(r => setTimeout(r, 500))

  await sendEvent({
    hook_event_name: 'PostToolUse',
    session_id: sessionId,
    tool_name: 'agent',
    tool_input: { description: 'Here is *italic* text and ~~removed~~ content with `code`' },
    _source: 'claude',
  })
  console.log('   -> Check if AI messages show italic and strikethrough formatting.')
  console.log('')

  // 4. Send Stop with stop_reason = "user" to show INT tag
  console.log('4. Sending Stop with stop_reason="user" (shows INT tag)...')
  await sendEvent({
    hook_event_name: 'Stop',
    session_id: sessionId,
    stop_reason: 'user',
    _source: 'claude',
  })
  console.log('   -> Session should show "INT" tag and orange project name.')
  console.log('')

  console.log('=== Test Complete ===')
  console.log('')
  console.log('Now check WinClaudeIsland panel:')
  console.log('  - Click project name -> should open folder in Explorer')
  console.log('  - INT tag should be visible (orange)')
  console.log('  - AI messages should show formatted Markdown')
  console.log('  - Go to Settings > Appearance > AI Reply Lines to test line limits')
  console.log('')
  console.log('Press Ctrl+C to exit.')
}

main().catch(err => {
  console.error('Error:', err.message)
  console.log('Make sure WinClaudeIsland is running.')
  process.exit(1)
})
