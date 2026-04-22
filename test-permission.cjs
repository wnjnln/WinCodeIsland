const net = require('net')
const os = require('os')

// Windows Named Pipe path: \\.\pipe\winclaude-island-<username>
// In JS string, each \ needs to be escaped as \
const pipeName = `\\\\.\\pipe\\winclaude-island-${os.userInfo().username}`

const event = {
  hookEventName: 'PermissionRequest',
  session_id: 'test-session-001',
  tool_name: 'Bash',
  tool_input: {
    command: 'npm install && npm run build',
    file_path: 'C:/Projects/my-app/package.json'
  },
  message: '请求执行 Bash 命令'
}

const client = net.connect(pipeName, () => {
  console.log('Connected to WinClaudeIsland')
  console.log('Pipe:', pipeName)
  client.write(JSON.stringify(event))
})

let response = ''
client.on('data', (chunk) => {
  response += chunk.toString()
})

client.on('end', () => {
  console.log('Response:', response)
  process.exit(0)
})

client.on('error', (err) => {
  console.error('Error:', err.message)
  console.log('Pipe tried:', pipeName)
  console.log('请先启动 WinClaudeIsland 再运行此脚本')
  process.exit(1)
})

setTimeout(() => {
  console.log('Timeout - no response received')
  process.exit(1)
}, 10000)
