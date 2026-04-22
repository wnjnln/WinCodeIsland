import type { ReactNode } from 'react'

interface NotchShellProps {
  children: ReactNode
  expanded: boolean
  notchHeight: number
}

export function NotchShell({ children, expanded, notchHeight }: NotchShellProps) {
  return (
    <div
      className="relative overflow-hidden bg-black"
      style={{
        width: '100%',
        height: '100%',
        borderBottomLeftRadius: expanded ? 24 : 12,
        borderBottomRightRadius: expanded ? 24 : 12,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        transition: expanded
          ? 'all 0.42s cubic-bezier(0.25, 1, 0.5, 1)'
          : 'all 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  )
}
