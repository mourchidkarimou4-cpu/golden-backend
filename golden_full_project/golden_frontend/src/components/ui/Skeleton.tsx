// src/components/ui/Skeleton.tsx

function SkeletonBox({ width = '100%', height = 16, style = {} }: { width?: string | number, height?: number, style?: React.CSSProperties }) {
  return (
    <div style={{
      width, height,
      background: 'var(--dark-3)',
      borderRadius: 2,
      animation: 'skeleton-pulse 1.5s ease-in-out infinite',
      ...style,
    }} />
  )
}

export function SkeletonKpiGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 48 }}>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="kpi-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SkeletonBox width="60%" height={10} />
          <SkeletonBox width="40%" height={32} />
          <SkeletonBox width="80%" height={10} />
        </div>
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 16, padding: '10px 16px' }}>
        {[...Array(4)].map((_, i) => <SkeletonBox key={i} height={10} width="70%" />)}
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: 16, padding: '14px 16px',
          background: 'var(--dark-4)', border: '1px solid var(--border)',
        }}>
          <SkeletonBox height={12} width="80%" />
          <SkeletonBox height={12} width="60%" />
          <SkeletonBox height={12} width="50%" />
          <SkeletonBox height={12} width="40%" />
        </div>
      ))}
    </div>
  )
}
