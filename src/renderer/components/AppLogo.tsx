interface AppLogoProps {
  size?: number
  showBackground?: boolean
}

export function AppLogo({ size = 36, showBackground = false }: AppLogoProps) {
  const bg = showBackground ? '#FFFFFF' : 'transparent'
  const pillColor = showBackground ? '#1A1A1A' : '#808080'
  const orange = '#DE886D'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      className="block"
      style={{ flexShrink: 0 }}
    >
      {showBackground && (
        <rect x="2" y="2" width="32" height="32" rx="7" ry="7" fill={bg} />
      )}
      {/* Pill / notch body */}
      <rect x="8" y="14" width="20" height="10" rx="5" ry="5" fill={pillColor} />
      {/* Left eye */}
      <rect x="12" y="16" width="3" height="3" rx="0.5" ry="0.5" fill={orange} />
      {/* Right eye */}
      <rect x="21" y="16" width="3" height="3" rx="0.5" ry="0.5" fill={orange} />
      {/* Left pupil */}
      <rect x="13" y="17" width="1" height="1" fill="#FFFFFF" />
      {/* Right pupil */}
      <rect x="22" y="17" width="1" height="1" fill="#FFFFFF" />
    </svg>
  )
}
