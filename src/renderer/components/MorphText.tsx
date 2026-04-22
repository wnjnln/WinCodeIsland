import type { CSSProperties } from 'react'

interface MorphTextProps {
  text?: string
  className?: string
  style?: CSSProperties
}

export function MorphText({ text = '', className = '', style }: MorphTextProps) {
  // Use key to trigger re-mount/animation when text changes
  return (
    <span key={text} className={`inline-block animate-morph-in ${className}`} style={style}>
      {text}
    </span>
  )
}
