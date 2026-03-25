// src/components/ui/ThemeToggle.tsx
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggle, isDark } = useTheme()

  return (
    <button
      onClick={toggle}
      title={isDark ? 'Passer en mode jour' : 'Passer en mode nuit'}
      style={{
        width: 44, height: 24,
        background: isDark ? 'rgba(184,115,51,.15)' : 'rgba(45,55,72,.1)',
        border: `1px solid ${isDark ? 'rgba(184,115,51,.3)' : 'rgba(45,55,72,.2)'}`,
        borderRadius: 12,
        position: 'relative',
        cursor: 'pointer',
        transition: 'all .3s ease',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        padding: '0 3px',
      }}
    >
      {/* Track icons */}
      <span style={{
        position: 'absolute', left: 6, fontSize: 10,
        opacity: isDark ? .8 : .3, transition: 'opacity .3s',
      }}>🌙</span>
      <span style={{
        position: 'absolute', right: 6, fontSize: 10,
        opacity: isDark ? .3 : .8, transition: 'opacity .3s',
      }}>☀️</span>

      {/* Thumb */}
      <div style={{
        width: 16, height: 16, borderRadius: '50%',
        background: isDark ? '#B87333' : '#2D3748',
        position: 'absolute',
        left: isDark ? 4 : 24,
        transition: 'left .3s ease, background .3s ease',
        boxShadow: isDark
          ? '0 0 6px rgba(184,115,51,.5)'
          : '0 0 6px rgba(45,55,72,.3)',
      }} />
    </button>
  )
}
