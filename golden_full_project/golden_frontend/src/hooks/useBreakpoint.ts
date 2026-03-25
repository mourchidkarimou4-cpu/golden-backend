// src/hooks/useBreakpoint.ts
import { useMediaQuery } from 'react-responsive'

export function useIsMobile() {
  return useMediaQuery({ maxWidth: 768 })
}

export function useIsTablet() {
  return useMediaQuery({ minWidth: 769, maxWidth: 1024 })
}

export function useIsDesktop() {
  return useMediaQuery({ minWidth: 1025 })
}

export function useBreakpoint() {
  const isMobile  = useMediaQuery({ maxWidth: 768 })
  const isTablet  = useMediaQuery({ minWidth: 769, maxWidth: 1024 })
  const isDesktop = useMediaQuery({ minWidth: 1025 })

  if (isMobile)  return 'mobile'
  if (isTablet)  return 'tablet'
  if (isDesktop) return 'desktop'
  return 'desktop'
}
