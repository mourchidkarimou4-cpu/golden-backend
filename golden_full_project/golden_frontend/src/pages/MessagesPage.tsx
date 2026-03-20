// src/pages/MessagesPage.tsx
import { useState } from 'react'
import { useThreads, useMessages } from '@/hooks/useMessages'
import { useAuth } from '@/lib/auth'
import { GoldenSpinner } from '@/components/ui'

export default function MessagesPage() {
  const { user }                          = useAuth()
  const { threads, loading: tLoading }    = useThreads()
  const [activeThread, setActiveThread]   = useState<string | null>(null)
  const { messages, loading: mLoading, sending, sendMessage, bottomRef } = useMessages(activeThread)
  const [draft, setDraft]                 = useState('')

  const currentThread = threads.find(t => t.id === activeThread)

  const handleSend = async () => {
    if (!draft.trim()) return
    await sendMessage(draft)
    setDraft('')
  }

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '320px 1fr',
      height: 'calc(100vh - 64px)',
      border: '1px solid var(--border)',
    }}>

      {/* ── Liste des threads ────────────────────── */}
      <div style={{ borderRight: '1px solid var(--border)', overflowY: 'auto' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Messages
          </span>
        </div>

        {tLoading ? <GoldenSpinner /> : threads.length === 0 ? (
          <p style={{ padding: 24, fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
            Aucun message pour le moment.
          </p>
        ) : threads.map(thread => {
          const other = thread.participants?.find((p: any) => p.id !== user?.id)
          const isActive = activeThread === thread.id
          return (
            <div
              key={thread.id}
              onClick={() => setActiveThread(thread.id)}
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border)',
                cursor: 'none',
                background: isActive ? 'rgba(201,168,76,0.06)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--gold)' : '2px solid transparent',
                transition: 'all .2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
                  {other?.full_name ?? 'Interlocuteur'}
                </span>
                {thread.unread_count > 0 && (
                  <span style={{
                    fontSize: 10, padding: '2px 6px',
                    background: 'rgba(201,168,76,0.2)', color: 'var(--gold)',
                    borderRadius: 10,
                  }}>{thread.unread_count}</span>
                )}
              </div>
              {thread.project_title && (
                <div style={{ fontSize: 11, color: 'var(--gold)', marginBottom: 4 }}>
                  {thread.project_title}
                </div>
              )}
              <p style={{
                fontSize: 12, color: 'var(--text-muted)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {thread.last_message_body ?? 'Aucun message'}
              </p>
              {thread.last_message_at && (
                <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 4 }}>
                  {new Date(thread.last_message_at).toLocaleDateString('fr-FR')}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Zone de conversation ─────────────────── */}
      {activeThread ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Header conversation */}
          <div style={{
            padding: '16px 24px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, border: '1px solid var(--border-bright)',
              display: 'grid', placeItems: 'center', fontSize: 14, color: 'var(--gold)',
            }}>
              {currentThread?.participants?.find((p: any) => p.id !== user?.id)?.full_name?.[0] ?? '?'}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
                {currentThread?.participants?.find((p: any) => p.id !== user?.id)?.full_name ?? 'Interlocuteur'}
              </div>
              {currentThread?.project_title && (
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {currentThread.project_title}
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mLoading ? <GoldenSpinner /> : messages.map(msg => {
              const isMine = msg.sender?.id === user?.id
              return (
                <div key={msg.id} style={{
                  display: 'flex',
                  justifyContent: isMine ? 'flex-end' : 'flex-start',
                }}>
                  <div style={{
                    maxWidth: '70%',
                    padding: '12px 16px',
                    background: isMine ? 'rgba(201,168,76,0.12)' : 'var(--dark-3)',
                    border: `1px solid ${isMine ? 'var(--border-bright)' : 'var(--border)'}`,
                    fontSize: 13, lineHeight: 1.6, color: 'var(--text)',
                  }}>
                    {!isMine && (
                      <div style={{ fontSize: 10, color: 'var(--gold)', marginBottom: 6, letterSpacing: '0.08em' }}>
                        {msg.sender?.full_name}
                      </div>
                    )}
                    <p>{msg.body}</p>
                    <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 6, textAlign: isMine ? 'right' : 'left' }}>
                      {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      {isMine && <span style={{ marginLeft: 6 }}>{msg.is_read ? '✓✓' : '✓'}</span>}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>

          {/* Zone de saisie */}
          <div style={{
            padding: '16px 24px', borderTop: '1px solid var(--border)',
            display: 'flex', gap: 12, alignItems: 'flex-end',
          }}>
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder="Votre message... (Entrée pour envoyer)"
              rows={3}
              style={{
                flex: 1, padding: '12px 14px',
                background: 'var(--dark-3)',
                border: '1px solid var(--border)',
                color: 'var(--text)', fontSize: 13,
                outline: 'none', resize: 'none',
                fontFamily: 'inherit', lineHeight: 1.5,
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--border-bright)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
            />
            <button
              onClick={handleSend}
              disabled={sending || !draft.trim()}
              className="btn-gold-sm"
              style={{ padding: '12px 20px', opacity: sending || !draft.trim() ? 0.5 : 1 }}
            >
              {sending ? '...' : '→'}
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)', fontSize: 14,
          flexDirection: 'column', gap: 12,
        }}>
          <div style={{ fontSize: 32, opacity: 0.3 }}>✉</div>
          <p>Sélectionnez une conversation</p>
        </div>
      )}
    </div>
  )
}
