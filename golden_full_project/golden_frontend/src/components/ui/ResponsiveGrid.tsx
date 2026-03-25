// src/components/ui/ResponsiveGrid.tsx
import { ReactNode } from 'react'
import { useIsMobile, useIsTablet } from '@/hooks/useBreakpoint'

interface ResponsiveGridProps {
  children: ReactNode
  cols?: { mobile?: number; tablet?: number; desktop?: number }
  gap?: number
  style?: React.CSSProperties
}

export function ResponsiveGrid({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 4 },
  gap = 16,
  style,
}: ResponsiveGridProps) {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const columns = isMobile ? (cols.mobile ?? 1) : isTablet ? (cols.tablet ?? 2) : (cols.desktop ?? 4)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap, ...style }}>
      {children}
    </div>
  )
}

interface ResponsiveSidebarLayoutProps {
  children: ReactNode
  sidebar: ReactNode
  sidebarWidth?: number
  gap?: number
}

export function ResponsiveSidebarLayout({
  children, sidebar, sidebarWidth = 320, gap = 24,
}: ResponsiveSidebarLayoutProps) {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()

  if (isMobile || isTablet) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap }}>
        {children}
        {sidebar}
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `1fr ${sidebarWidth}px`, gap }}>
      {children}
      {sidebar}
    </div>
  )
}
