interface ChatMessageRowProps {
  role: 'user' | 'assistant'
  content: string
  maxLength?: number
  lineLimit?: number
}

// CodeIsland colors
const USER_PREFIX_COLOR = '#4CD964' // green >
const AI_PREFIX_COLOR = '#D97757'   // orange/brown $
const USER_TEXT_COLOR = 'rgba(255,255,255,0.9)'
const AI_TEXT_COLOR = 'rgba(255,255,255,0.85)'

/**
 * Strip ::directive-name{...} patterns (may span multiple lines).
 * Removes lines that start with ::word{ or are continuation of a directive.
 */
function stripDirectives(text: string): string {
  const lines = text.split('\n')
  const result: string[] = []
  let inDirective = false
  let braceDepth = 0

  for (const line of lines) {
    if (inDirective) {
      for (const ch of line) {
        if (ch === '{') braceDepth++
        if (ch === '}') braceDepth--
      }
      if (braceDepth <= 0) {
        inDirective = false
        braceDepth = 0
      }
      continue
    }
    const trimmed = line.trim()
    if (trimmed.startsWith('::') && trimmed.includes('{')) {
      braceDepth = 0
      for (const ch of line) {
        if (ch === '{') braceDepth++
        if (ch === '}') braceDepth--
      }
      if (braceDepth > 0) {
        inDirective = true
      }
      continue
    }
    result.push(line)
  }
  return result.join('\n')
}

/**
 * Compact consecutive empty lines into a single empty line.
 */
function compactText(text: string): string {
  const lines = text.split('\n').map(l => l.trim())
  const result: string[] = []
  for (const line of lines) {
    if (line === '' && result.length > 0 && result[result.length - 1] === '') {
      continue
    }
    result.push(line)
  }
  // Trim trailing empty lines
  while (result.length > 0 && result[result.length - 1] === '') {
    result.pop()
  }
  return result.join('\n').trim()
}

// Simple inline markdown parser (bold, italic, code, strikethrough)
function parseInlineMarkdown(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let remaining = text
  let key = 0

  const patterns = [
    { regex: /\*\*\*(.+?)\*\*\*/g, type: 'bold-italic' as const },
    { regex: /\*\*(.+?)\*\*/g, type: 'bold' as const },
    { regex: /\*(.+?)\*/g, type: 'italic' as const },
    { regex: /`(.+?)`/g, type: 'code' as const },
    { regex: /~~(.+?)~~/g, type: 'strike' as const },
  ]

  while (remaining.length > 0) {
    let earliest: { index: number; match: RegExpMatchArray; type: string } | null = null

    for (const p of patterns) {
      p.regex.lastIndex = 0
      const m = p.regex.exec(remaining)
      if (m && (earliest === null || m.index < earliest.index)) {
        earliest = { index: m.index, match: m, type: p.type }
      }
    }

    if (!earliest) {
      nodes.push(remaining)
      break
    }

    if (earliest.index > 0) {
      nodes.push(remaining.slice(0, earliest.index))
    }

    const inner = earliest.match[1]
    switch (earliest.type) {
      case 'bold-italic':
        nodes.push(
          <strong key={key++} className="font-bold italic" style={{ color: AI_TEXT_COLOR }}>
            {inner}
          </strong>
        )
        break
      case 'bold':
        nodes.push(
          <strong key={key++} className="font-bold" style={{ color: AI_TEXT_COLOR }}>
            {inner}
          </strong>
        )
        break
      case 'italic':
        nodes.push(
          <em key={key++} className="italic" style={{ color: AI_TEXT_COLOR }}>
            {inner}
          </em>
        )
        break
      case 'code':
        nodes.push(
          <code
            key={key++}
            className="px-1 py-[1px] rounded text-[10px] font-mono"
            style={{ backgroundColor: 'rgba(255,255,255,0.10)', color: AI_TEXT_COLOR }}
          >
            {inner}
          </code>
        )
        break
      case 'strike':
        nodes.push(
          <s key={key++} className="line-through" style={{ color: 'rgba(255,255,255,0.40)' }}>
            {inner}
          </s>
        )
        break
    }

    remaining = remaining.slice(earliest.index + earliest.match[0].length)
  }

  return nodes
}

export function ChatMessageRow({ role, content, maxLength = 70, lineLimit }: ChatMessageRowProps) {
  const isUser = role === 'user'

  // Process AI messages: strip directives, compact text, then truncate
  let displayText = content
  if (!isUser) {
    displayText = compactText(stripDirectives(content))
  }
  const truncated = displayText.length > maxLength ? displayText.slice(0, maxLength) + '…' : displayText

  return (
    <div className="flex items-start gap-1 text-[11px] leading-tight font-mono">
      {/* Prefix: > for user (green), $ for AI (orange) */}
      <span
        className="shrink-0 font-bold select-none"
        style={{ color: isUser ? USER_PREFIX_COLOR : AI_PREFIX_COLOR }}
      >
        {isUser ? '>' : '$'}
      </span>
      {/* Message text */}
      <span
        className={lineLimit ? 'line-clamp-1' : 'truncate'}
        style={{ color: isUser ? USER_TEXT_COLOR : AI_TEXT_COLOR }}
      >
        {isUser ? truncated : parseInlineMarkdown(truncated)}
      </span>
    </div>
  )
}
