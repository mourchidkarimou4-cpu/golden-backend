// src/pages/LandingPage.tsx
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { GoldenLogo, SectionLabel, Slideshow, ThemeToggle } from '@/components/ui'
import { useIsMobile } from '@/hooks/useBreakpoint'
import { useScrollReveal } from '@/hooks/useCountUp'

const HERO_SLIDES = [
  { url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&q=90&auto=format&fit=crop', label: 'Entrepreneurs africains', position: 'center' },
  { url: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=1600&q=90&auto=format&fit=crop', label: 'Équipes qui innovent', position: 'center' },
  { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=90&auto=format&fit=crop', label: 'Vision & Leadership', position: 'center' },
  { url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1600&q=90&auto=format&fit=crop', label: 'Investisseurs de confiance', position: 'center' },
  { url: 'https://images.unsplash.com/photo-1556761175-4b46d72b3c5b?w=1600&q=90&auto=format&fit=crop', label: 'Partenariats solides', position: 'center' },
]

const HOW_SLIDES = [
  { url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80&auto=format&fit=crop', label: 'Présentation de projet' },
  { url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80&auto=format&fit=crop', label: 'Analyse & due diligence' },
  { url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80&auto=format&fit=crop', label: 'Négociation & accord' },
  { url: 'https://images.unsplash.com/photo-1560250097-0dc05329d0ea?w=800&q=80&auto=format&fit=crop', label: 'Signature & financement' },
]

const PORTEUR_SLIDES = [
  { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80&auto=format&fit=crop', label: 'Porteur de projet', position: 'center top' },
  { url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80&auto=format&fit=crop', label: 'Entrepreneur africain', position: 'center top' },
  { url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80&auto=format&fit=crop', label: 'Vision & projet', position: 'center top' },
]

const INVEST_SLIDES = [
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop', label: 'Investisseur', position: 'center top' },
  { url: 'https://images.unsplash.com/photo-1556761175-4b46d72b3c5b?w=600&q=80&auto=format&fit=crop', label: 'Analyse de portefeuille', position: 'center' },
  { url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80&auto=format&fit=crop', label: 'Partenariat stratégique', position: 'center' },
]

const STEPS = [
  { num: '01', title: 'Créez votre profil vérifié', desc: "Inscription sécurisée avec vérification d'identité KYC. Porteur ou investisseur — chaque profil est validé par notre équipe." },
  { num: '02', title: 'Déposez ou explorez les projets', desc: 'Porteurs : soumettez votre pitch et documents financiers. Investisseurs : parcourez des projets filtrés selon vos critères.' },
  { num: '03', title: 'Notre algorithme crée le lien', desc: 'Notre moteur de matching analyse secteur, montant, zone géographique et profil de risque pour proposer les meilleures correspondances.' },
  { num: '04', title: 'Négociez et finalisez', desc: 'Messagerie sécurisée, due diligence intégrée, signature électronique et versement via Mobile Money ou virement bancaire.' },
]

const STATS = [
  { num: '240+', label: 'Projets financés' },
  { num: '₣4.2Mrd', label: 'Capital mobilisé' },
  { num: '98%', label: 'Satisfaction' },
  { num: '6', label: "Pays d'Afrique" },
]

export default function LandingPage() {
  const navRef = useRef<HTMLElement>(null)
  const isMobile = useIsMobile()

  const [menuOpen, setMenuOpen] = useState(false)
  useScrollReveal()

  useEffect(() => {
    const onScroll = () => {
      if (navRef.current) {
        navRef.current.classList.toggle('scrolled', window.scrollY > 60)
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80)
          observer.unobserve(e.target)
        }
      })
    }, { threshold: 0.1 })
    reveals.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh' }}>
      {/* ── Bandeau d'annonce ─────────────────────────────── */}
      <div style={{
        background: 'var(--gold)',
        color: 'var(--dark)',
        padding: '10px 24px',
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: '.04em',
        lineHeight: 1.6,
        position: 'relative',
        zIndex: 110,
      }}>
        Nous disposons de plusieurs investisseurs prêts à vous confier de{' '}
        <strong>100 000 €</strong> à <strong>345 000 000 €</strong> pour investir dans tout projet lucratif.{' '}
        <a href="/register" style={{ color: 'var(--dark)', textDecoration: 'underline', fontWeight: 600 }}>
          Rejoindre la plateforme →
        </a>
      </div>

      {/* ── Navbar ──────────────────────────────────── */}
      <nav ref={navRef} className="navbar" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: isMobile ? '16px 20px' : '24px 60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid transparent',
        transition: 'all .4s',
      }}>
        <GoldenLogo />

        {/* Desktop nav */}
        {!isMobile && (
          <ul style={{ display: 'flex', alignItems: 'center', gap: 40, listStyle: 'none' }}>
            {[['#comment','Comment ça marche'],['#profils','Profils'],['/projets','Projets']].map(([href, label]) => (
              <li key={href}>
                <a href={href} style={{
                  color: 'var(--text-muted)', textDecoration: 'none',
                  fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
                  transition: 'color .3s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >{label}</a>
              </li>
            ))}
          </ul>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThemeToggle />
          <Link to="/login" style={{
            padding: isMobile ? '6px 12px' : '8px 20px',
            border: '1px solid var(--gold)',
            color: 'var(--gold)', textDecoration: 'none',
            fontSize: isMobile ? 10 : 11,
            letterSpacing: '.08em', textTransform: 'uppercase',
            transition: 'all .2s', whiteSpace: 'nowrap',
          }}>{isMobile ? 'Connexion' : 'Connexion →'}</Link>

          {isMobile && (
            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              background: 'none', border: 'none', color: 'var(--text-muted)',
              fontSize: 22, cursor: 'pointer', padding: 4,
            }}>☰</button>
          )}
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMobile && menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 150,
          }} />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: '75%',
            background: 'var(--dark-2)', zIndex: 200, padding: '80px 32px 40px',
            borderLeft: '1px solid var(--border)',
            animation: 'slideUp .3s ease',
          }}>
            <button onClick={() => setMenuOpen(false)} style={{
              position: 'absolute', top: 20, right: 20,
              background: 'none', border: 'none', color: 'var(--text-muted)',
              fontSize: 24, cursor: 'pointer',
            }}>✕</button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[['#comment','Comment ça marche'],['#profils','Profils'],['/projets','Projets']].map(([href, label]) => (
                <a key={href} href={href} onClick={() => setMenuOpen(false)} style={{
                  color: 'var(--text)', textDecoration: 'none',
                  fontSize: 18, fontFamily: '"Cormorant Garamond", serif',
                  padding: '20px 0', borderBottom: '1px solid var(--border)',
                  letterSpacing: '0.05em',
                }}>{label}</a>
              ))}
            </div>

          </div>
        </>
      )}

      {/* ── Hero ────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: isMobile ? '100px 24px 60px' : '140px 60px 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Hero Slideshow background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Slideshow
            images={HERO_SLIDES}
            height="100%"
            interval={5000}
            overlay="linear-gradient(135deg, rgba(6,6,4,.92) 0%, rgba(6,6,4,.75) 50%, rgba(201,168,76,.05) 100%)"
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        {/* BG circles - hidden on mobile for perf */}
        {!isMobile && [600,900,400].map((s,i) => (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%',
            width: s, height: s,
            border: `1px solid rgba(201,168,76,${[.08,.05,.06][i]})`,
            top: [-200,-350,-150][i], right: [-100,-250,undefined][i] as any,
            left: i === 2 ? -100 : undefined,
            animation: `rotate ${[40,60,30][i]}s linear infinite${i===1?' reverse':''}`,
            pointerEvents: 'none',
          }}/>
        ))}

        <div style={{ position: 'relative', zIndex: 1, maxWidth: isMobile ? '100%' : 680 }}>
          <div className="section-label" style={{ animation: 'fadeUp .8s ease both' }}>
            <div className="section-label-line" />
            <span className="section-label-text">Plateforme de mise en relation</span>
          </div>
          <h1 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: isMobile ? '48px' : 'clamp(52px, 7vw, 88px)',
            fontWeight: 300, lineHeight: 1.05, marginBottom: isMobile ? 20 : 32,
            animation: 'fadeUp .8s .1s ease both',
          }}>
            <em style={{ fontStyle: 'italic', color: 'var(--gold-light)', display: 'block' }}>Connecter</em>
            <strong style={{ fontWeight: 600, display: 'block' }}>les visionnaires</strong>
            aux capitaux
          </h1>
          <p style={{
            fontSize: isMobile ? 14 : 16, lineHeight: 1.8, color: 'var(--text-muted)',
            maxWidth: 480, marginBottom: isMobile ? 32 : 56,
            animation: 'fadeUp .8s .2s ease both',
          }}>
            GOLDEN Investissement rapproche porteurs de projets ambitieux et investisseurs éclairés.
            Une plateforme sécurisée, transparente et pensée pour l'Afrique.
          </p>
          <div style={{
            display: 'flex', flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 12 : 24, alignItems: isMobile ? 'stretch' : 'center',
            animation: 'fadeUp .8s .3s ease both',
          }}>
            <Link to="/register" className="btn-primary">Rejoindre la plateforme</Link>
            <Link to="/login" style={{
              display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'center' : 'flex-start',
              gap: 10, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13,
              transition: 'color .3s', padding: isMobile ? '12px 0' : '0',
            }}>Se connecter →</Link>
          </div>
        </div>

        {/* Stats - inline on mobile, absolute on desktop */}
        <div style={{
          marginTop: isMobile ? 48 : 0,
          position: isMobile ? 'relative' : 'absolute',
          right: isMobile ? 'auto' : 60,
          bottom: isMobile ? 'auto' : 80,
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : '1fr',
          gap: isMobile ? 16 : 0,
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              padding: isMobile ? '16px' : '0',
              background: isMobile ? 'var(--dark-3)' : 'transparent',
              border: isMobile ? '1px solid var(--border)' : 'none',
              marginBottom: isMobile ? 0 : i > 0 ? 32 : 0,
              textAlign: isMobile ? 'center' : 'right',
            }}>
              {!isMobile && i > 0 && <div style={{ width: '100%', height: 1, background: 'var(--border)', marginBottom: 32 }}/>}
              <span style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: isMobile ? 32 : 42,
                fontWeight: 300, color: 'var(--gold-light)',
                display: 'block', lineHeight: 1,
              }}>{s.num}</span>
              <div style={{
                fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--text-muted)', marginTop: 4,
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ────────────────────────────── */}
      <section id="comment" style={{
        padding: isMobile ? '60px 24px' : '120px 60px',
        background: 'var(--dark-2)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        {/* Photo banner */}
        <div style={{
          marginBottom: isMobile ? 40 : 60,
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)',
          gap: 12, height: isMobile ? 180 : 220,
        }}>
          {[
            { url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80&auto=format&fit=crop', label: 'Présentation de projet' },
            { url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80&auto=format&fit=crop', label: 'Négociation' },
            { url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&q=80&auto=format&fit=crop', label: 'Signature & accord' },
          ].map((img, i) => (
            <div key={i} style={{ position: 'relative', overflow: 'hidden', display: isMobile && i > 0 ? 'none' : 'block' }}>
              <img src={img.url} alt={img.label} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .55, transition: 'opacity .3s', display: 'block' }}
                onMouseEnter={e => (e.target as HTMLImageElement).style.opacity='.75'}
                onMouseLeave={e => (e.target as HTMLImageElement).style.opacity='.55'}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,6,4,.8) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: 12, left: 14, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(201,168,76,.8)' }}>{img.label}</div>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,.4), transparent)' }} />
            </div>
          ))}
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr',
          gap: isMobile ? 40 : 80,
          alignItems: 'start',
        }}>
          <div>
            <SectionLabel>Le processus</SectionLabel>
            <h2 className="section-title reveal">
              Simple,<br/><em>transparent</em><br/>et sécurisé
            </h2>
            <p className="reveal" style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-muted)' }}>
              De la soumission de votre projet à la signature du contrat, chaque étape est guidée et protégée.
            </p>
          </div>
          <div>
            {STEPS.map(step => (
              <div key={step.num} className="reveal" style={{
                padding: isMobile ? '20px 0' : '32px 0',
                borderBottom: '1px solid var(--border)',
                display: 'grid',
                gridTemplateColumns: '40px 1fr',
                gap: 16, alignItems: 'start',
              }}>
                <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 13, color: 'var(--gold)', paddingTop: 2 }}>{step.num}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{step.title}</div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-muted)' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Profils ────────────────────────────────── */}
      <section id="profils" style={{ padding: isMobile ? '60px 24px' : '120px 60px' }}>
        <div style={{ marginBottom: isMobile ? 32 : 60 }}>
          <SectionLabel>Deux profils</SectionLabel>
          <h2 className="section-title reveal">Fait pour <em>vous</em></h2>
          <p className="reveal" style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-muted)', maxWidth: 500 }}>
            Que vous ayez un projet à financer ou des capitaux à faire fructifier, GOLDEN est votre partenaire de confiance.
          </p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 16 : 2,
        }}>
          {[
            { num: '01', tag: 'Porteur de projet', title: 'Vous avez une vision. Trouvez le capital.', desc: "Soumettez votre projet, pitchez votre vision et connectez-vous aux investisseurs qui croient en votre potentiel.", features: ['Dépôt de dossier simplifié','Matching intelligent','Messagerie intégrée','Accompagnement personnalisé','Contrats sécurisés'], link: '/register', linkLabel: 'Déposer mon projet →' },
            { num: '02', tag: 'Investisseur', title: 'Vous avez le capital. Trouvez les opportunités.', desc: "Accédez à un portefeuille de projets vérifiés et diversifiez vos investissements dans l'économie africaine.", features: ['Projets vérifiés et évalués','Filtres avancés','Due diligence assistée','Tableau de bord temps réel','Reporting automatisé'], link: '/register', linkLabel: 'Explorer les projets →' },
          ].map(card => (
            <div key={card.num} className="reveal" style={{
              background: 'var(--dark-2)',
              padding: isMobile ? '32px 24px' : '60px 48px',
              border: '1px solid var(--border)',
              transition: 'border-color .4s',
            }}>
              {/* Slideshow card */}
              <div style={{ marginBottom: 20, height: 160, overflow: 'hidden' }}>
                <Slideshow
                  images={card.num === '01' ? PORTEUR_SLIDES : INVEST_SLIDES}
                  height={160}
                  interval={card.num === '01' ? 4000 : 4500}
                  overlay="linear-gradient(to bottom, rgba(6,6,4,.1) 0%, rgba(6,6,4,.5) 100%)"
                />
              </div>
              <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: isMobile ? 48 : 80, fontWeight: 300, color: 'var(--text-dim)', lineHeight: 1, display: 'block', marginBottom: 20 }}>{card.num}</span>
              <div style={{ display: 'inline-block', padding: '4px 12px', border: '1px solid var(--border-bright)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>{card.tag}</div>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: isMobile ? 22 : 28, fontWeight: 400, marginBottom: 12, lineHeight: 1.3 }}>{card.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: 24 }}>{card.desc}</p>
              <ul style={{ listStyle: 'none', marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {card.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--text-muted)' }}>
                    <div style={{ width: 16, height: 1, background: 'var(--gold)', flexShrink: 0 }}/>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to={card.link} style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {card.linkLabel}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats band ─────────────────────────────── */}
      <div className="reveal" style={{
        padding: isMobile ? '40px 24px' : '80px 60px',
        background: 'var(--dark-3)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: isMobile ? 24 : 0,
      }}>
        {STATS.map((s, i) => (
          <div key={i} style={{
            padding: isMobile ? '16px' : '0 40px',
            textAlign: 'center',
            borderRight: !isMobile && i < 3 ? '1px solid var(--border)' : 'none',
          }}>
            <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: isMobile ? 40 : 56, fontWeight: 300, color: 'var(--gold-light)', display: 'block', lineHeight: 1, marginBottom: 8 }}>{s.num}</span>
            <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── CTA ────────────────────────────────────── */}
      <section style={{
        padding: isMobile ? '80px 24px' : '160px 60px',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)', pointerEvents: 'none' }}/>
        <h2 className="reveal" style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: isMobile ? '40px' : 'clamp(48px,6vw,80px)',
          fontWeight: 300, lineHeight: 1.1, marginBottom: 20, position: 'relative',
        }}>
          Prêt à faire <em style={{ fontStyle: 'italic', color: 'var(--gold-light)' }}>croître</em> votre avenir ?
        </h2>
        <p className="reveal" style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto 40px', lineHeight: 1.8 }}>
          Rejoignez des centaines d'entrepreneurs et d'investisseurs qui font confiance à GOLDEN.
        </p>
        <div className="reveal" style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center', justifyContent: 'center',
          gap: isMobile ? 12 : 20,
          position: 'relative',
        }}>
          <Link to="/register?role=porteur" className="btn-primary">Je suis porteur de projet</Link>
          <Link to="/register?role=investisseur" className="btn-outline">Je suis investisseur</Link>
        </div>
      </section>

      {/* ── Footer Premium ──────────────────────────── */}
      <footer style={{ background: 'var(--dark)', borderTop: '1px solid rgba(201,168,76,.15)', position: 'relative', overflow: 'hidden' }}>

        {/* Top gold line */}
        <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #C9A84C 30%, #E8C97A 50%, #C9A84C 70%, transparent)' }} />

        {/* Main footer body */}
        <div style={{ padding: isMobile ? '48px 24px 32px' : '72px 60px 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr', gap: isMobile ? 40 : 60 }}>

            {/* Brand column */}
            <div>
              {/* Logo mark */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{ width: 42, height: 42, border: '1px solid #C9A84C', transform: 'rotate(45deg)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <span style={{ transform: 'rotate(-45deg)', fontFamily: '"Cormorant Garamond",serif', fontSize: 20, fontWeight: 600, color: 'var(--gold)' }}>G</span>
                </div>
                <div>
                  <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 20, fontWeight: 600, letterSpacing: '.08em', color: 'var(--text)' }}>GOLDEN</div>
                  <div style={{ fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--gold)', marginTop: 1 }}>Investissement</div>
                </div>
              </div>

              {/* Tagline */}
              <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 16, fontStyle: 'italic', fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 24, maxWidth: 280 }}>
                "Là où les visionnaires rencontrent les capitaux qui transforment l'Afrique."
              </p>

              {/* Location badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', border: '1px solid rgba(201,168,76,.2)', background: 'var(--primary-pale)' }}>
                <div style={{ width: 6, height: 6, background: '#3DD68C', borderRadius: '50%', animation: 'pulse-dot 2s infinite' }} />
                <span style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Cotonou, Bénin · Afrique de l'Ouest</span>
              </div>

              {/* Social links */}
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                {[
                  { label: 'Li', title: 'LinkedIn' },
                  { label: 'Tw', title: 'Twitter / X' },
                  { label: 'Fb', title: 'Facebook' },
                  { label: 'Ig', title: 'Instagram' },
                ].map(s => (
                  <div key={s.label} title={s.title} style={{
                    width: 34, height: 34, border: '1px solid rgba(201,168,76,.2)',
                    display: 'grid', placeItems: 'center', cursor: 'pointer',
                    fontSize: 10, color: 'var(--text-muted)', letterSpacing: '.05em',
                    transition: 'all .2s',
                    fontFamily: 'sans-serif',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='var(--gold)'; (e.currentTarget as HTMLElement).style.color='var(--gold)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='var(--border)'; (e.currentTarget as HTMLElement).style.color='var(--text-muted)' }}
                  >{s.label}</div>
                ))}
              </div>
            </div>

            {/* Plateforme */}
            <div>
              <div style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid rgba(201,168,76,.1)' }}>
                Plateforme
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Comment ça marche',
                  'Porteurs de projets',
                  'Investisseurs',
                  'Secteurs couverts',
                  'Nos partenaires',
                  'Témoignages',
                ].map(l => (
                  <li key={l}>
                    <a href="#" style={{
                      fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none',
                      letterSpacing: '.04em', transition: 'color .2s',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color='var(--gold)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color='var(--text-muted)'}
                    >
                      <span style={{ width: 12, height: 1, background: 'currentColor', display: 'inline-block', flexShrink: 0 }} />
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ressources */}
            <div>
              <div style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid rgba(201,168,76,.1)' }}>
                Ressources
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  "Centre d'aide",
                  'Documentation API',
                  'Blog et Actualites',
                  'Guide investisseur',
                  'Rapport annuel',
                  'Presse & Médias',
                ].map(l => (
                  <li key={l}>
                    <a href="#" style={{
                      fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none',
                      letterSpacing: '.04em', transition: 'color .2s',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color='var(--gold)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color='var(--text-muted)'}
                    >
                      <span style={{ width: 12, height: 1, background: 'currentColor', display: 'inline-block', flexShrink: 0 }} />
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <div style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid rgba(201,168,76,.1)' }}>
                Newsletter
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 16 }}>
                Recevez les meilleures opportunités d'investissement chaque semaine.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  style={{
                    background: 'rgba(255,255,255,.03)',
                    border: '1px solid rgba(201,168,76,.2)',
                    padding: '10px 14px', color: 'var(--text)',
                    fontSize: 12, outline: 'none', fontFamily: 'inherit',
                    width: '100%',
                  }}
                  onFocus={e => (e.target as HTMLElement).style.borderColor='rgba(201,168,76,.5)'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor='var(--border)'}
                />
                <button style={{
                  background: 'var(--gold)', color: 'var(--dark)',
                  border: 'none', padding: '10px', width: '100%',
                  fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase',
                  fontFamily: 'inherit', cursor: 'pointer', fontWeight: 500,
                  transition: 'background .2s',
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background='var(--gold-light)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background='var(--gold)'}
                >
                  S'abonner →
                </button>
              </div>

              {/* Stats rapides */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 24 }}>
                {[
                  { val: '240+', label: 'Projets' },
                  { val: '6', label: 'Pays' },
                  { val: '98%', label: 'Satisfaction' },
                  { val: '4.2Mrd', label: 'Capital ₣' },
                ].map(s => (
                  <div key={s.label} style={{ padding: '10px', background: 'var(--primary-pale)', border: '1px solid rgba(201,168,76,.1)', textAlign: 'center' }}>
                    <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 18, color: 'var(--gold)', fontWeight: 300 }}>{s.val}</div>
                    <div style={{ fontSize: 8, color: 'var(--text-muted)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(201,168,76,.08)',
          padding: isMobile ? '16px 24px' : '20px 60px',
          display: 'flex', flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center', justifyContent: 'space-between',
          gap: isMobile ? 12 : 0,
        }}>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '.06em' }}>
            © 2026 GOLDEN Investissement. Tous droits réservés. · Plateforme réglementée BCEAO/UEMOA
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[{l:'Mentions légales',h:'/about'},{l:'Confidentialité',h:'/about'},{l:'CGU',h:'/about'},{l:'Cookies',h:'/about'}].map(({l,h}) => (
              <a key={l} href={h} style={{
                fontSize: 10, color: 'var(--text-dim)', textDecoration: 'none',
                letterSpacing: '.08em', textTransform: 'uppercase',
                transition: 'color .2s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color='var(--gold)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color='var(--text-dim)'}
              >{l}</a>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.7)} }
        `}</style>
      </footer>

      <style>{`
        .navbar.scrolled {
          background: var(--nav-bg) !important;
          backdrop-filter: blur(20px);
          border-color: var(--border) !important;
          padding-top: 12px !important;
          padding-bottom: 12px !important;
        }
      `}</style>
    </div>
  )
}
