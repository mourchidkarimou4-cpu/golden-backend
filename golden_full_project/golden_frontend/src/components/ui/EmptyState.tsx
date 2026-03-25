// src/components/ui/EmptyState.tsx
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '60px 24px', textAlign: 'center',
    }}>
      {Icon && (
        <div style={{
          width: 56, height: 56, border: '1px solid var(--border)',
          display: 'grid', placeItems: 'center',
          color: 'var(--text-dim)', marginBottom: 20,
        }}>
          <Icon size={22} strokeWidth={1.5} />
        </div>
      )}
      <div style={{
        fontSize: 15, fontFamily: '"Cormorant Garamond", serif',
        color: 'var(--text)', fontWeight: 400, marginBottom: 8,
      }}>{title}</div>
      {description && (
        <div style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 320, lineHeight: 1.7 }}>
          {description}
        </div>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="btn-gold-sm"
          style={{ marginTop: 24 }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
