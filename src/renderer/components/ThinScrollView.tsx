interface ThinScrollViewProps {
  children: React.ReactNode
  className?: string
  maxHeight?: number
  style?: React.CSSProperties
}

export function ThinScrollView({ children, className = '', maxHeight, style }: ThinScrollViewProps) {
  return (
    <div
      className={`overflow-y-auto scrollbar-thin ${className}`}
      style={maxHeight !== undefined ? { maxHeight, ...style } : style}
    >
      {children}
    </div>
  )
}
