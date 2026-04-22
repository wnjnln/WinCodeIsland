const net = require('net')
const os = require('os')

const pipeName = process.env.WINCLAUDE_ISLAND_PIPE
  || `\\\\.\\pipe\\winclaude-island-${os.userInfo().username}`

const DEBUG = process.env.WCI_DEBUG === '1'
function log(...args) { if (DEBUG) process.stderr.write(args.join(' ') + '\n') }

async function main() {
  const inputChunks = []
  process.stdin.on('data', chunk => inputChunks.push(chunk))
  await new Promise(resolve => process.stdin.once('end', resolve))
  const input = Buffer.concat(inputChunks).toString('utf-8').trim()
  if (!input) {
    process.exit(0)
  }

  let payload
  try {
    payload = JSON.parse(input)
  } catch {
    payload = { hook_event_name: 'Message', message: input }
  }

  if (typeof payload !== 'object' || payload === null) {
    payload = { hook_event_name: 'Message', message: input }
  }

  // Normalize event name
  const eventName = payload.hookEventName || payload.hook_event_name || payload.eventName || payload.event_name || ''
  // DEBUG: log full payload keys to diagnose session routing
  log(`[WCI-BRIDGE] event=${eventName} keys=${Object.keys(payload).join(',')}\n`)

  // Parse --source argument from CLI hook command
  const args = process.argv.slice(2)
  const sourceIndex = args.indexOf('--source')
  const source = sourceIndex >= 0 ? args[sourceIndex + 1] : ''

  // Enrich with terminal context
  // Detect terminal PROGRAM (not shell) first — this is what getForegroundProcess returns
  let termApp = process.env.TERM_PROGRAM || ''

  // Windows terminal detection via environment variables (terminal program, not shell)
  if (!termApp && process.platform === 'win32') {
    if (process.env.WT_SESSION) termApp = 'windows-terminal'
    else if (process.env.WEZTERM_PANE) termApp = 'wezterm'
    else if (process.env.ALACRITTY_WINDOW_ID) termApp = 'alacritty'
    else if (process.env.KITTY_WINDOW_ID) termApp = 'kitty'
    else if (process.env.TABBY_PANE) termApp = 'tabby'
    else if (process.env.TMUX) termApp = 'tmux'
  }

  // Fallback to shell detection only if no terminal program detected
  if (!termApp) {
    const isPowerShell = !!(
      process.env.PSModulePath ||
      process.env.PSExecutionPolicyPreference ||
      process.env.PSHOME ||
      process.env.PSReadLineVersion ||
      (process.title && /powershell|pwsh/i.test(process.title))
    )
    if (isPowerShell) termApp = 'powershell'
  }

  payload._term_app = termApp
  // DEBUG: log terminal detection for troubleshooting
  log(`[WCI-BRIDGE] termApp="${termApp}" isPowerShell=${isPowerShell} TERM_PROGRAM="${process.env.TERM_PROGRAM || ''}" PSModulePath=${process.env.PSModulePath ? 'yes' : 'no'} title="${process.title || ''}"\n`)
  payload._tty = process.env.TTY || ''
  payload._ppid = process.ppid
  if (source) {
    payload._source = source
  }
  if (!payload.cwd) {
    payload.cwd = process.cwd()
  }

  // Terminal detection env vars (Windows + cross-platform)
  if (process.env.WT_SESSION) payload._wt_session = process.env.WT_SESSION
  if (process.env.WEZTERM_PANE) payload._wezterm_pane = process.env.WEZTERM_PANE
  if (process.env.ALACRITTY_WINDOW_ID) payload._alacritty_window = process.env.ALACRITTY_WINDOW_ID
  if (process.env.KITTY_WINDOW_ID) payload._kitty_window = process.env.KITTY_WINDOW_ID
  if (process.env.TABBY_PANE) payload._tabby_pane = process.env.TABBY_PANE
  if (process.env.TMUX) {
    payload._tmux = process.env.TMUX
    if (process.env.TMUX_PANE) payload._tmux_pane = process.env.TMUX_PANE
  }

  // Detect Cursor YOLO mode from settings.json
  if (source && /cursor/i.test(source)) {
    try {
      const fs = require('fs')
      const path = require('path')
      const settingsPath = path.join(os.homedir(), 'AppData', 'Roaming', 'Cursor', 'User', 'settings.json')
      if (fs.existsSync(settingsPath)) {
        const raw = fs.readFileSync(settingsPath, 'utf-8')
        // Strip JSON comments (// and /* */)
        const stripped = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
        const json = JSON.parse(stripped)
        if (json['cursor.general.yoloMode'] === true || json['cursor.agent.enableYoloMode'] === true) {
          payload._yolo_mode = true
  log('[WCI-BRIDGE] Cursor YOLO mode detected\n')
        }
      }
    } catch (err) {
  log(`[WCI-BRIDGE] YOLO detection error: ${err?.message || err}\n`)
    }
  }

  // Try to find the Windows Terminal process ID and HWND by walking up the parent chain
  if (process.platform === 'win32') {
    try {
      const { execSync } = require('child_process')
      const fs = require('fs')
      const path = require('path')
      const psScript = `
Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class C { [DllImport("kernel32.dll")] public static extern IntPtr GetConsoleWindow(); [DllImport("user32.dll")] public static extern IntPtr GetWindow(IntPtr hWnd, uint uCmd); }'
$targetPid = ${process.pid}
$wtPid = $null
for ($i = 0; $i -lt 10; $i++) {
    $proc = Get-CimInstance Win32_Process -Filter "ProcessId = $targetPid" -ErrorAction SilentlyContinue
    if (-not $proc) { break }
    if ($proc.Name -match 'WindowsTerminal') { $wtPid = $targetPid; break }
    $targetPid = $proc.ParentProcessId
    if ($targetPid -le 4) { break }
}
$consoleHwnd = [C]::GetConsoleWindow()
$ownerHwnd = if ($consoleHwnd -ne 0) { [C]::GetWindow($consoleHwnd, 4) } else { 0 } # GW_OWNER = 4
# Fallback to MainWindowHandle if GW_OWNER fails
if ($ownerHwnd -eq 0 -and $wtPid) {
    $p = Get-Process -Id $wtPid -ErrorAction SilentlyContinue
    if ($p) { $ownerHwnd = $p.MainWindowHandle }
}
"$wtPid,$ownerHwnd"
`
      const tmpFile = path.join(os.tmpdir(), `wci-bridge-wt-${Date.now()}.ps1`)
      fs.writeFileSync(tmpFile, psScript, 'utf-8')
      const result = execSync(`powershell -WindowStyle Hidden -NoProfile -ExecutionPolicy Bypass -File "${tmpFile}"`, { encoding: 'utf-8', timeout: 10000 }).trim()
      try { fs.unlinkSync(tmpFile) } catch {}
      const [pidStr, hwndStr] = result.split(',')
      const n = parseInt(pidStr, 10)
      if (!isNaN(n) && n > 0) {
        payload._wt_pid = n
  log(`[WCI-BRIDGE] detected WT PID=${n}\n`)
      }
      const hwnd = parseInt(hwndStr, 10)
      if (!isNaN(hwnd) && hwnd > 0) {
        payload._wt_hwnd = hwnd
  log(`[WCI-BRIDGE] detected WT HWND=${hwnd}\n`)
      } else {
  log(`[WCI-BRIDGE] HWND detection got invalid result: pid=${pidStr} hwnd=${hwndStr}\n`)
      }
    } catch (err) {
  log(`[WCI-BRIDGE] WT detection error: ${err?.message || err}\n`)
    }
  }

  const isBlocking = eventName === 'PermissionRequest' || eventName === 'Notification'

  let timeoutId = null
  let finished = false

  function finish(exitCode, responseBody) {
    if (finished) return
    finished = true
    if (timeoutId) clearTimeout(timeoutId)
    if (responseBody) process.stdout.write(responseBody)
    process.exit(exitCode)
  }

  if (isBlocking) {
    timeoutId = setTimeout(() => {
      finish(0, '{}')
    }, 30000)
  }

  const client = net.connect(pipeName)
  const responseChunks = []

  client.on('connect', () => {
    client.write(JSON.stringify(payload), () => {
      if (!isBlocking) {
        client.end(() => finish(0))
      }
    })
  })

  client.on('data', chunk => {
    responseChunks.push(chunk)
  })

  client.on('end', () => {
    const response = Buffer.concat(responseChunks).toString('utf-8')
    finish(0, response)
  })

  client.on('error', (err) => {
    process.stderr.write(`winclaude-island-bridge: ${err.message}\n`)
    if (isBlocking) {
      if (eventName === 'PermissionRequest') {
        // Default to allow when the island is not running so the user isn't blocked
        finish(0, JSON.stringify({
          hookSpecificOutput: { hookEventName: 'PermissionRequest', decision: { behavior: 'allow' } }
        }))
      } else {
        finish(1, '{}')
      }
    } else {
      finish(0)
    }
  })
}

main()
