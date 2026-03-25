// src/components/ui/RatingWidget.tsx
import { useState } from 'react'
import { Star } from 'lucide-react'
import { investmentsAPI } from '@/lib/api'

interface RatingWidgetProps {
  investmentId: string
  currentScore?: number
  currentComment?: string
  onRated?: (score: number) => void
}

export function RatingWidget({ investmentId, currentScore = 0, currentComment = '', onRated }: RatingWidgetProps) {
  const [hover, setHover]     = useState(0)
  const [score, setScore]     = useState(currentScore)
  const [comment, setComment] = useState(currentComment)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  const handleRate = async (s: number) => {
    setScore(s)
    setSaving(true)
    try {
      await investmentsAPI.rate(investmentId, { score: s, comment })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      onRated?.(s)
    } catch {
      // silently fail
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ padding: '16px 0' }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>
        Votre évaluation
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {[1,2,3,4,5].map(s => (
          <button
            key={s}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            onClick={() => handleRate(s)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
          >
            <Star
              size={20}
              strokeWidth={1.5}
              fill={(hover || score) >= s ? 'var(--gold)' : 'none'}
              color={(hover || score) >= s ? 'var(--gold)' : 'var(--text-dim)'}
            />
          </button>
        ))}
        {saved && <span style={{ fontSize: 11, color: '#4ade80', marginLeft: 8, alignSelf: 'center' }}>Enregistré ✓</span>}
        {saving && <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8, alignSelf: 'center' }}>...</span>}
      </div>
      {score > 0 && (
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          onBlur={() => score > 0 && handleRate(score)}
          placeholder="Commentaire optionnel..."
          rows={2}
          style={{
            width: '100%', padding: '8px 12px',
            background: 'var(--dark-3)', border: '1px solid var(--border)',
            color: 'var(--text)', fontSize: 12, outline: 'none',
            fontFamily: 'inherit', resize: 'none',
          }}
        />
      )}
    </div>
  )
}

interface RatingSummaryProps {
  ratings: { score: number }[]
}

export function RatingSummary({ ratings }: RatingSummaryProps) {
  if (ratings.length === 0) return null
  const avg = ratings.reduce((s, r) => s + r.score, 0) / ratings.length

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ display: 'flex', gap: 3 }}>
        {[1,2,3,4,5].map(s => (
          <Star
            key={s}
            size={14}
            strokeWidth={1.5}
            fill={avg >= s ? 'var(--gold)' : 'none'}
            color={avg >= s ? 'var(--gold)' : 'var(--text-dim)'}
          />
        ))}
      </div>
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
        {avg.toFixed(1)} / 5 ({ratings.length} avis)
      </span>
    </div>
  )
}
