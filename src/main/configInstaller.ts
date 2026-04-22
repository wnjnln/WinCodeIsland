import { join } from 'path'
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'fs'
import os from 'os'
import { appStore } from './store'

const WINCLAUDE_ISLAND_DIR = join(os.homedir(), '.winclaude-island')
const BRIDGE_TARGET_PATH = join(WINCLAUDE_ISLAND_DIR, 'winclaude-island-bridge.js')

// In built app: out/main/ -> ../../bridge/winclaude-island-bridge.js
const BRIDGE_SOURCE_PATH = join(__dirname, '../../bridge/winclaude-island-bridge.js')

// ─── CLI Configurations ────────────────────────────────────────────────────

interface CLIEvent {
  name: string
  timeout: number
}

interface CLIConfig {
  name: string
  source: string
  configPath: string
  configKey: string
  format: 'claude' | 'nested' | 'kimi'
  events: CLIEvent[]
}

const CLAUDE_EVENTS: CLIEvent[] = [
  { name: 'UserPromptSubmit', timeout: 60 },
  { name: 'PreToolUse', timeout: 60 },
  { name: 'PostToolUse', timeout: 60 },
  { name: 'PermissionRequest', timeout: 86400 },
  { name: 'Stop', timeout: 60 },
  { name: 'SessionStart', timeout: 60 },
  { name: 'SessionEnd', timeout: 60 },
  { name: 'Notification', timeout: 86400 },
]

const CODEX_EVENTS: CLIEvent[] = [
  { name: 'SessionStart', timeout: 30 },
  { name: 'SessionEnd', timeout: 30 },
  { name: 'UserPromptSubmit', timeout: 30 },
  { name: 'PreToolUse', timeout: 30 },
  { name: 'PostToolUse', timeout: 30 },
  { name: 'Stop', timeout: 30 },
]

const KIMI_EVENTS: CLIEvent[] = [
  { name: 'PreToolUse', timeout: 30 },
  { name: 'PostToolUse', timeout: 30 },
  { name: 'Notification', timeout: 30 },
  { name: 'Stop', timeout: 30 },
]

const CLI_CONFIGS: CLIConfig[] = [
  {
    name: 'Claude Code',
    source: 'claude',
    configPath: join(os.homedir(), '.claude', 'settings.json'),
    configKey: 'hooks',
    format: 'claude',
    events: CLAUDE_EVENTS,
  },
  {
    name: 'Codex',
    source: 'codex',
    configPath: join(os.homedir(), '.codex', 'hooks.json'),
    configKey: 'hooks',
    format: 'nested',
    events: CODEX_EVENTS,
  },
  {
    name: 'Kimi Code CLI',
    source: 'kimi',
    configPath: join(os.homedir(), '.kimi', 'config.toml'),
    configKey: 'hooks',
    format: 'kimi',
    events: KIMI_EVENTS,
  },
]

// ─── Helpers ───────────────────────────────────────────────────────────────

function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
}

function readJSONFile(path: string): Record<string, unknown> | null {
  if (!existsSync(path)) return null
  try {
    const data = readFileSync(path, 'utf-8')
    return JSON.parse(data) as Record<string, unknown>
  } catch {
    return null
  }
}

function writeJSONFile(path: string, data: unknown): boolean {
  try {
    writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf-8')
    return true
  } catch {
    return false
  }
}

function containsOurHook(entry: Record<string, unknown>): boolean {
  const hooks = entry.hooks
  if (Array.isArray(hooks)) {
    return hooks.some(
      (h) =>
        typeof h === 'object' &&
        h !== null &&
        typeof (h as Record<string, unknown>).command === 'string' &&
        ((h as Record<string, unknown>).command as string).includes('winclaude-island-bridge.js')
    )
  }
  if (typeof entry.command === 'string') {
    return (entry.command as string).includes('winclaude-island-bridge.js')
  }
  return false
}

// ─── Bridge ────────────────────────────────────────────────────────────────

export function installBridge(): boolean {
  ensureDir(WINCLAUDE_ISLAND_DIR)
  if (!existsSync(BRIDGE_SOURCE_PATH)) {
    console.error('Bridge source not found at:', BRIDGE_SOURCE_PATH)
    return false
  }
  try {
    copyFileSync(BRIDGE_SOURCE_PATH, BRIDGE_TARGET_PATH)
    return true
  } catch (err) {
    console.error('Failed to copy bridge:', err)
    return false
  }
}

// ─── Per-CLI Install / Uninstall / Detect ──────────────────────────────────

function getCommand(source: string): string {
  return `node "${BRIDGE_TARGET_PATH}" --source ${source}`
}

// Enable codex_hooks = true in ~/.codex/config.toml
function enableCodexHooks(): boolean {
  const configPath = join(os.homedir(), '.codex', 'config.toml')
  let contents = ''
  if (existsSync(configPath)) {
    try {
      contents = readFileSync(configPath, 'utf-8')
    } catch {
      contents = ''
    }
  }

  // Already set to true (non-commented)
  if (/^\s*codex_hooks\s*=\s*true/m.test(contents)) {
    return true
  }

  // Set false -> true
  if (/^\s*codex_hooks\s*=\s*false/m.test(contents)) {
    contents = contents.replace(/^\s*codex_hooks\s*=\s*false/m, 'codex_hooks = true')
    try {
      writeFileSync(configPath, contents, 'utf-8')
      return true
    } catch {
      return false
    }
  }

  // Not present — insert into [features] section or create it
  const lines = contents.split('\n')
  const featIdx = lines.findIndex((l) => l.trim() === '[features]')
  if (featIdx >= 0) {
    lines.splice(featIdx + 1, 0, 'codex_hooks = true')
  } else {
    if (lines.length > 0 && lines[lines.length - 1] !== '') lines.push('')
    lines.push('[features]')
    lines.push('codex_hooks = true')
  }
  try {
    writeFileSync(configPath, lines.join('\n') + '\n', 'utf-8')
    return true
  } catch {
    return false
  }
}

function installClaude(cli: CLIConfig): boolean {
  const settings = readJSONFile(cli.configPath) ?? {}
  let hooks = (settings[cli.configKey] as Record<string, unknown[]>) ?? {}

  // Remove old entries
  for (const [eventName, entries] of Object.entries(hooks)) {
    if (!Array.isArray(entries)) continue
    const cleaned = entries.filter((entry) => {
      if (typeof entry !== 'object' || entry === null) return true
      return !containsOurHook(entry as Record<string, unknown>)
    })
    if (cleaned.length > 0) {
      hooks[eventName] = cleaned
    } else {
      delete hooks[eventName]
    }
  }

  const command = getCommand(cli.source)

  // Install fresh entries
  for (const { name, timeout } of cli.events) {
    const eventHooks = hooks[name] ?? []
    if (!Array.isArray(eventHooks)) {
      hooks[name] = []
    }
    const hookEntry: Record<string, unknown> = {
      type: 'command',
      command,
      timeout,
    }
    const newEntry: Record<string, unknown> = {
      matcher: '*',
      hooks: [hookEntry],
    }
    hooks[name] = [...(hooks[name] ?? []), newEntry]
  }

  settings[cli.configKey] = hooks
  return writeJSONFile(cli.configPath, settings)
}

function installNested(cli: CLIConfig): boolean {
  const settings = readJSONFile(cli.configPath) ?? {}
  let hooks = (settings[cli.configKey] as Record<string, unknown[]>) ?? {}

  // Remove old entries
  for (const [eventName, entries] of Object.entries(hooks)) {
    if (!Array.isArray(entries)) continue
    const cleaned = entries.filter((entry) => {
      if (typeof entry !== 'object' || entry === null) return true
      return !containsOurHook(entry as Record<string, unknown>)
    })
    if (cleaned.length > 0) {
      hooks[eventName] = cleaned
    } else {
      delete hooks[eventName]
    }
  }

  const command = getCommand(cli.source)

  // Install fresh entries (nested format: [{ hooks: [{ type, command, timeout }] }])
  for (const { name, timeout } of cli.events) {
    const eventHooks = hooks[name] ?? []
    if (!Array.isArray(eventHooks)) {
      hooks[name] = []
    }
    const entry: Record<string, unknown> = {
      hooks: [{ type: 'command', command, timeout }],
    }
    hooks[name] = [...(hooks[name] ?? []), entry]
  }

  settings[cli.configKey] = hooks
  return writeJSONFile(cli.configPath, settings)
}

function installKimi(cli: CLIConfig): boolean {
  const configPath = cli.configPath
  const configDir = join(os.homedir(), '.kimi')
  ensureDir(configDir)

  // Kimi uses TOML. We read as text, modify, and write back.
  let contents = ''
  if (existsSync(configPath)) {
    try {
      contents = readFileSync(configPath, 'utf-8')
    } catch {
      contents = ''
    }
  }

  const command = getCommand(cli.source)

  // Remove existing hooks that contain our bridge
  // Pattern: [[hooks]] block followed by lines until next [[ or EOF
  const hookBlockRegex = /(\[\[hooks\]\]\n)([\s\S]*?)(?=\n\[\[|\n\[|\z)/g
  contents = contents.replace(hookBlockRegex, (match, header, body) => {
    if (body.includes('winclaude-island-bridge.js')) {
      return ''
    }
    return match
  })

  // Also handle single-line [[hooks]] at end of file
  const singleHookRegex = /\[\[hooks\]\]\n(?:(?!\[\[).)*winclaude-island-bridge\.js(?:(?!\[\[).)*/gs
  contents = contents.replace(singleHookRegex, '')

  // Clean up multiple blank lines
  contents = contents.replace(/\n{3,}/g, '\n\n')

  // Append new hooks
  const newHooks = cli.events
    .map(
      ({ name, timeout }) =>
        `[[hooks]]\nevent = "${name}"\ncommand = "${command.replace(/"/g, '\\"')}"\ntimeout = ${timeout}\n`
    )
    .join('\n')

  if (!contents.endsWith('\n') && contents.length > 0) {
    contents += '\n'
  }
  contents += newHooks

  try {
    writeFileSync(configPath, contents, 'utf-8')
    return true
  } catch {
    return false
  }
}

function uninstallClaude(cli: CLIConfig): boolean {
  const settings = readJSONFile(cli.configPath)
  if (!settings) return true

  let hooks = settings[cli.configKey] as Record<string, unknown[]>
  if (!hooks || typeof hooks !== 'object') return true

  for (const [eventName, entries] of Object.entries(hooks)) {
    if (!Array.isArray(entries)) continue
    const cleaned = entries.filter((entry) => {
      if (typeof entry !== 'object' || entry === null) return true
      return !containsOurHook(entry as Record<string, unknown>)
    })
    if (cleaned.length > 0) {
      hooks[eventName] = cleaned
    } else {
      delete hooks[eventName]
    }
  }

  if (Object.keys(hooks).length === 0) {
    delete settings[cli.configKey]
  } else {
    settings[cli.configKey] = hooks
  }

  return writeJSONFile(cli.configPath, settings)
}

function uninstallNested(cli: CLIConfig): boolean {
  // Same structure as claude for nested format
  return uninstallClaude(cli)
}

function uninstallKimi(cli: CLIConfig): boolean {
  if (!existsSync(cli.configPath)) return true

  let contents = ''
  try {
    contents = readFileSync(cli.configPath, 'utf-8')
  } catch {
    return true
  }

  // Remove hooks blocks containing our bridge
  const hookBlockRegex = /(\[\[hooks\]\]\n)([\s\S]*?)(?=\n\[\[|\n\[|\z)/g
  contents = contents.replace(hookBlockRegex, (match, header, body) => {
    if (body.includes('winclaude-island-bridge.js')) {
      return ''
    }
    return match
  })

  const singleHookRegex = /\[\[hooks\]\]\n(?:(?!\[\[).)*winclaude-island-bridge\.js(?:(?!\[\[).)*/gs
  contents = contents.replace(singleHookRegex, '')

  contents = contents.replace(/\n{3,}/g, '\n\n')

  try {
    writeFileSync(cli.configPath, contents, 'utf-8')
    return true
  } catch {
    return false
  }
}

function isInstalledClaude(cli: CLIConfig): boolean {
  const settings = readJSONFile(cli.configPath)
  if (!settings) return false

  const hooks = settings[cli.configKey] as Record<string, unknown[]>
  if (!hooks || typeof hooks !== 'object') return false

  return cli.events.every(({ name }) => {
    const entries = hooks[name]
    if (!Array.isArray(entries)) return false
    return entries.some((entry) => {
      if (typeof entry !== 'object' || entry === null) return false
      return containsOurHook(entry as Record<string, unknown>)
    })
  })
}

function isInstalledNested(cli: CLIConfig): boolean {
  return isInstalledClaude(cli)
}

function isInstalledKimi(cli: CLIConfig): boolean {
  if (!existsSync(cli.configPath)) return false

  let contents = ''
  try {
    contents = readFileSync(cli.configPath, 'utf-8')
  } catch {
    return false
  }

  return cli.events.every(({ name }) => {
    // Check if there's a [[hooks]] block with this event and our bridge
    const eventRegex = new RegExp(
      `\\[\\[hooks\\]\\]\\s*\\n.*?event\\s*=\\s*"${name}"[\\s\\S]*?winclaude-island-bridge\\.js`,
      's'
    )
    return eventRegex.test(contents)
  })
}

// ─── Public API ────────────────────────────────────────────────────────────

export function installCLI(source: string): boolean {
  if (!installBridge()) return false

  const cli = CLI_CONFIGS.find((c) => c.source === source)
  if (!cli) return false

  // Special handling for Codex: enable hooks in config.toml first
  if (source === 'codex') {
    enableCodexHooks()
  }

  switch (cli.format) {
    case 'claude':
      return installClaude(cli)
    case 'nested':
      return installNested(cli)
    case 'kimi':
      return installKimi(cli)
    default:
      return false
  }
}

export function uninstallCLI(source: string): boolean {
  const cli = CLI_CONFIGS.find((c) => c.source === source)
  if (!cli) return false

  switch (cli.format) {
    case 'claude':
      return uninstallClaude(cli)
    case 'nested':
      return uninstallNested(cli)
    case 'kimi':
      return uninstallKimi(cli)
    default:
      return false
  }
}

export function isCLIInstalled(source: string): boolean {
  const cli = CLI_CONFIGS.find((c) => c.source === source)
  if (!cli) return false

  switch (cli.format) {
    case 'claude':
      return isInstalledClaude(cli)
    case 'nested':
      return isInstalledNested(cli)
    case 'kimi':
      return isInstalledKimi(cli)
    default:
      return false
  }
}

export function getCLIConfig(source: string): CLIConfig | undefined {
  return CLI_CONFIGS.find((c) => c.source === source)
}

export function getAllCLIs(): CLIConfig[] {
  return [...CLI_CONFIGS]
}

// ─── Legacy exports (Claude-only, for backward compat) ─────────────────────

export function install(): boolean {
  return installCLI('claude')
}

export function uninstall(): boolean {
  return uninstallCLI('claude')
}

export function isInstalled(): boolean {
  return isCLIInstalled('claude')
}

export function verifyAndRepair(): void {
  const sources = ['claude', 'codex', 'kimi']
  for (const source of sources) {
    const storeKey = `${source}HooksInstalled` as const
    if (!appStore.get(storeKey as any)) continue
    if (isCLIInstalled(source)) continue
    installCLI(source)
  }
}
