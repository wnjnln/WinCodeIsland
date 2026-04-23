import { useState } from 'react'

interface PermissionCardProps {
  toolName?: string
  description?: string
  toolInput?: Record<string, unknown>
  onAllow: () => void
  onAlwaysAllow: () => void
  onDeny: () => void
}

function PixelButton({
  label,
  onClick,
  bg,
  border,
  fg = 'rgba(255,255,255,0.95)',
}: {
  label: string
  onClick: () => void
  bg: string
  border: string
  fg?: string
}) {
  const [hovering, setHovering] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="flex-1 px-2 py-[7px] rounded-[4px] text-[10px] font-semibold tracking-wide transition-all duration-150"
      style={{
        color: fg,
        backgroundColor: hovering ? bg : `${bg}cc`,
        border: `1px solid ${hovering ? border : `${border}66`}`,
      }}
    >
      {label}
    </button>
  )
}

function ToolDetailView({ tool, toolInput }: { tool?: string; toolInput?: Record<string, unknown> }) {
  if (!toolInput) return null
  const t = tool?.toLowerCase() || ''
  const filePath = String(toolInput.file_path ?? toolInput.path ?? toolInput.filePath ?? '')

  switch (t) {
    case 'bash':
    case 'command': {
      const cmd = String(toolInput.command ?? toolInput.input ?? '')
      if (!cmd) return null
      return (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-start gap-1.5">
            <span className="text-[10px] font-bold shrink-0" style={{ color: '#4CD964' }}>$</span>
            <span className="text-[10px] leading-relaxed break-all" style={{ color: 'rgba(255,255,255,0.85)' }}>{cmd}</span>
          </div>
        </div>
      )
    }

    case 'edit': {
      const oldStr = String(toolInput.old_string ?? toolInput.oldString ?? '')
      const newStr = String(toolInput.new_string ?? toolInput.newString ?? '')
      return (
        <div className="flex flex-col gap-1">
          {filePath && (
            <span className="text-[9px] truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{filePath}</span>
          )}
          {oldStr && (
            <div className="flex items-start gap-1.5">
              <span className="text-[10px] font-bold shrink-0" style={{ color: '#FF6B6B' }}>−</span>
              <span className="text-[9.5px] leading-relaxed line-clamp-2 break-all" style={{ color: 'rgba(255,107,107,0.7)' }}>{oldStr.slice(0, 120)}</span>
            </div>
          )}
          {newStr && (
            <div className="flex items-start gap-1.5">
              <span className="text-[10px] font-bold shrink-0" style={{ color: '#4CD964' }}>+</span>
              <span className="text-[9.5px] leading-relaxed line-clamp-2 break-all" style={{ color: 'rgba(76,217,100,0.7)' }}>{newStr.slice(0, 120)}</span>
            </div>
          )}
        </div>
      )
    }

    case 'write': {
      const content = String(toolInput.content ?? '')
      return (
        <div className="flex flex-col gap-1">
          {filePath && (
            <span className="text-[9px] truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{filePath}</span>
          )}
          {content && (
            <span className="text-[9.5px] leading-relaxed line-clamp-4 break-all" style={{ color: 'rgba(255,255,255,0.6)' }}>{content.slice(0, 200)}</span>
          )}
        </div>
      )
    }

    case 'read': {
      return (
        <div className="flex flex-col gap-0.5">
          {filePath && (
            <span className="text-[9.5px] truncate" style={{ color: 'rgba(255,255,255,0.7)' }}>{filePath}</span>
          )}
        </div>
      )
    }

    case 'grep': {
      const pattern = String(toolInput.pattern ?? toolInput.query ?? '')
      const path = String(toolInput.path ?? toolInput.file_path ?? '')
      return (
        <div className="flex flex-col gap-0.5">
          {pattern && (
            <div className="flex items-start gap-1.5">
              <span className="text-[10px] font-bold shrink-0" style={{ color: '#E880E8' }}>/</span>
              <span className="text-[10px] leading-relaxed break-all" style={{ color: 'rgba(232,128,232,0.8)' }}>{pattern}</span>
            </div>
          )}
          {path && (
            <span className="text-[9px] truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{path}</span>
          )}
        </div>
      )
    }

    case 'glob': {
      const pattern = String(toolInput.pattern ?? '')
      const path = String(toolInput.path ?? '')
      return (
        <div className="flex flex-col gap-0.5">
          {pattern && (
            <span className="text-[10px] leading-relaxed break-all" style={{ color: 'rgba(153,204,255,1)' }}>{pattern}</span>
          )}
          {path && (
            <span className="text-[9px] truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{path}</span>
          )}
        </div>
      )
    }

    default:
      return (
        <div className="flex flex-col gap-1">
          {Object.entries(toolInput).slice(0, 4).map(([key, val]) => (
            <div key={key} className="flex items-start gap-1.5">
              <span className="text-[9px] font-semibold shrink-0" style={{ color: 'rgba(153,179,230,1)' }}>{key}</span>
              <span className="text-[9.5px] leading-relaxed line-clamp-2 break-all" style={{ color: 'rgba(255,255,255,0.6)' }}>{String(val).slice(0, 100)}</span>
            </div>
          ))}
        </div>
      )
  }
}

export function PermissionCard({
  toolName,
  description,
  toolInput,
  onAllow,
  onAlwaysAllow,
  onDeny,
}: PermissionCardProps) {
  const serverName = toolInput?.server_name as string | undefined
  const fileName = toolInput?.file_path
    ? String(toolInput.file_path).split(/[\/]/).pop()
    : undefined

  return (
    <div className="flex flex-col gap-2 py-2.5" style={{ fontFamily: '"Cascadia Code", "Microsoft YaHei", monospace' }}>
      {/* Header: tool name + context */}
      <div className="flex items-center gap-1.5 px-3.5">
        <span className="text-[11px] font-bold" style={{ color: '#FFB347' }}>!</span>
        <span className="text-[11px] font-bold" style={{ color: '#FFB347' }}>{toolName || 'Permission'}</span>
        {serverName && (
          <span className="text-[9px]" style={{ color: 'rgba(153,179,230,1)' }}>({serverName})</span>
        )}
        {fileName && (
          <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>{fileName}</span>
        )}
      </div>

      {description && (
        <div className="px-3.5 text-[11px]" style={{ color: 'rgba(255,255,255,0.6)' }}>{description}</div>
      )}

      {/* Tool-specific detail preview */}
      {toolInput && (
        <div className="mx-3 px-3 py-1.5 rounded-md" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
          <ToolDetailView tool={toolName} toolInput={toolInput} />
        </div>
      )}

      {/* Pixel-style buttons: Deny / Allow Once / Always Allow */}
      <div className="flex gap-1.5 px-3.5 pt-1">
        <PixelButton
          label="拒绝"
          onClick={onDeny}
          bg="#731E1E"
          border="#B44141"
        />
        <PixelButton
          label="允许一次"
          onClick={onAllow}
          bg="#28612D"
          border="#469E50"
        />
        <PixelButton
          label="始终允许"
          onClick={onAlwaysAllow}
          bg="#234684"
          border="#4678D2"
        />
      </div>
    </div>
  )
}
