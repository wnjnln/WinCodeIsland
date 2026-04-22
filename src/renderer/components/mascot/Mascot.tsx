import { ClawdMascot } from './ClawdMascot'
import { DexMascot } from './DexMascot'
import { KimiMascot } from './KimiMascot'

interface MascotProps {
  size?: number
  status?: 'idle' | 'processing' | 'waiting'
  source?: string
}

export function Mascot({ size = 28, status = 'idle', source }: MascotProps) {
  switch (source) {
    case 'codex':
      return <DexMascot size={size} status={status} />
    case 'kimi':
      return <KimiMascot size={size} status={status} />
    case 'claude':
    default:
      return <ClawdMascot size={size} status={status} />
  }
}
