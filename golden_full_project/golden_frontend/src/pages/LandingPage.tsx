// src/pages/LandingPage.tsx
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { GoldenLogo, SectionLabel } from '@/components/ui'

const STEPS = [
  { num: '01', title: 'Créez votre profil vérifié', desc: 'Inscription sécurisée avec vérification d\'identité KYC. Porteur ou investisseur — chaque profil est validé par notre équipe.' },
  { num: '02', title: 'Déposez ou explorez les projets', desc: 'Porteurs : soumettez votre pitch et documents financiers. Investisseurs : parcourez des projets filtrés selon vos critères.' },
  { num: '03', title: 'Notre algorithme crée le lien', desc: 'Notre moteur de matching analyse secteur, montant, zone géographique et profil de risque pour proposer les meilleures correspondances.' },
  { num: '04', title: 'Négociez et finalisez', desc: 'Messagerie sécurisée, due diligence intégrée, signature électronique et versement via Mobile Money ou virement bancaire.' },
]

const STATS_BAND = [
  { num: '12',    label: 'Secteurs\ncouverts' },
  { num: '240+',  label: 'Projets\nfinancés' },
  { num: '₣4.2M', label: 'Capital\nmobilisé' },
  { num: '6',     label: 'Pays\nd\'Afrique' },
]

export default function LandingPage() {
  const navRef = useRef<HTMLElement>(null)

  // Navbar scroll effect
  useEffect(() => {
    const onScroll = () => {
      if (navRef.current) {
        navRef.current.classList.toggle('scrolled', window.scrollY > 60)
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Reveal on scroll
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80)
          observer.unobserve(e.target)
        }
      })
    }, { threshold: 0.15 })
    reveals.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh' }}>

      {/* ── Navbar ──────────────────────────────────── */}
      <nav ref={navRef} style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '24px 60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid transparent',
        transition: 'all .4s',
      }}
        className="navbar"
      >
        <GoldenLogo />
        <ul style={{ display: 'flex', alignItems: 'center', gap: 40, listStyle: 'none' }}>
          {[['#comment','Comment ça marche'],['#profils','Profils'],['#projets','Projets']].map(([href, label]) => (
            <li key={href}>
              <a href={href} style={{
                color: 'var(--text-muted)', textDecoration: 'none',
                fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase',
                transition: 'color .3s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >{label}</a>
            </li>
          ))}
        </ul>
        <Link to="/register" className="btn-gold-sm">Commencer</Link>
      </nav>

      {/* ── Hero ────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '140px 60px 80px', position: 'relative', overflow: 'hidden' }}>
        {/* BG circles */}
        {[600,900,400].map((s,i) => (
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
        <div style={{
          position: 'absolute', top: -200, right: 200,
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680 }}>
          <div className="section-label" style={{ animation: 'fadeUp .8s ease both' }}>
            <div className="section-label-line" />
            <span className="section-label-text">Plateforme de mise en relation</span>
          </div>
          <h1 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 'clamp(52px, 7vw, 88px)',
            fontWeight: 300, lineHeight: 1.05, marginBottom: 32,
            animation: 'fadeUp .8s .1s ease both',
          }}>
            <em style={{ fontStyle: 'italic', color: 'var(--gold-light)', display: 'block' }}>Connecter</em>
            <strong style={{ fontWeight: 600, display: 'block' }}>les visionnaires</strong>
            aux capitaux
          </h1>
          <p style={{
            fontSize: 16, lineHeight: 1.8, color: 'var(--text-muted)',
            maxWidth: 480, marginBottom: 56,
            animation: 'fadeUp .8s .2s ease both',
          }}>
            GOLDEN Investissement rapproche porteurs de projets ambitieux et investisseurs éclairés.
            Une plateforme sécurisée, transparente et pensée pour l'Afrique.
          </p>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', animation: 'fadeUp .8s .3s ease both' }}>
            <Link to="/register" className="btn-primary">Rejoindre la plateforme</Link>
            <a href="#comment" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13,
              transition: 'color .3s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <div style={{ width: 36, height: 1, background: 'currentColor', position: 'relative' }}>
                <div style={{ position: 'absolute', right: 0, top: -3, width: 7, height: 7, borderRight: '1px solid currentColor', borderTop: '1px solid currentColor', transform: 'rotate(45deg)' }}/>
              </div>
              Découvrir
            </a>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          position: 'absolute', right: 60, bottom: 80, zIndex: 1,
          display: 'flex', flexDirection: 'column', gap: 32,
          animation: 'fadeLeft .8s .4s ease both',
        }}>
          {[
            { num: '240+', label: 'Projets financés' },
            { num: '₣4.2Mrd', label: 'Capital mobilisé' },
            { num: '98%', label: 'Taux de satisfaction' },
          ].map((s, i) => (
            <div key={i}>
              {i > 0 && <div style={{ width: '100%', height: 1, background: 'var(--border)', marginBottom: 32 }}/>}
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 42, fontWeight: 300, color: 'var(--gold-light)', display: 'block', lineHeight: 1 }}>{s.num}</span>
                <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ────────────────────────────── */}
      <section id="comment" style={{ padding: '120px 60px', background: 'var(--dark-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start' }}>
          <div>
            <SectionLabel>Le processus</SectionLabel>
            <h2 className="section-title reveal">Simple,<br/><em>transparent</em><br/>et sécurisé</h2>
            <p className="reveal" style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-muted)' }}>
              De la soumission de votre projet à la signature du contrat, chaque étape est guidée et protégée.
            </p>
          </div>
          <div>
            {STEPS.map(step => (
              <div key={step.num} className="reveal" style={{
                padding: '32px 0', borderBottom: '1px solid var(--border)',
                display: 'grid', gridTemplateColumns: '48px 1fr', gap: 24, alignItems: 'start',
                transition: 'padding-left .3s',
              }}
                onMouseEnter={e => (e.currentTarget.style.paddingLeft = '12px')}
                onMouseLeave={e => (e.currentTarget.style.paddingLeft = '0')}
              >
                <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 13, color: 'var(--gold)', paddingTop: 4 }}>{step.num}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>{step.title}</div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-muted)' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Profils ────────────────────────────────── */}
      <section id="profils" style={{ padding: '120px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 80, alignItems: 'end' }}>
          <div>
            <SectionLabel>Deux profils</SectionLabel>
            <h2 className="section-title reveal">Fait pour<br/><em>vous</em></h2>
          </div>
          <p className="reveal" style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-muted)' }}>
            Que vous ayez un projet à financer ou des capitaux à faire fructifier, GOLDEN Investissement est votre partenaire de confiance.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {[
            { num: '01', tag: 'Porteur de projet', title: 'Vous avez une vision. Trouvez le capital.', desc: 'Soumettez votre projet, pitchez votre vision et connectez-vous aux investisseurs qui croient en votre potentiel.', features: ['Dépôt de dossier simplifié','Matching intelligent avec investisseurs','Messagerie et négociation intégrées','Accompagnement et coaching','Contrats sécurisés et conformes'], link: '/register', linkLabel: 'Déposer mon projet →' },
            { num: '02', tag: 'Investisseur', title: 'Vous avez le capital. Trouvez les opportunités.', desc: 'Accédez à un portefeuille de projets vérifiés et diversifiez vos investissements dans l\'économie africaine en croissance.', features: ['Projets vérifiés et évalués','Filtres avancés par secteur et risque','Due diligence assistée par IA','Tableau de bord de suivi en temps réel','Reporting financier automatisé'], link: '/register', linkLabel: 'Explorer les projets →' },
          ].map(card => (
            <div key={card.num} className="reveal" style={{
              background: 'var(--dark-2)', padding: '60px 48px',
              border: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
              transition: 'border-color .4s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-bright)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 80, fontWeight: 300, color: 'var(--text-dim)', lineHeight: 1, display: 'block', marginBottom: 32 }}>{card.num}</span>
              <div style={{ display: 'inline-block', padding: '4px 14px', border: '1px solid var(--border-bright)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20 }}>{card.tag}</div>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 32, fontWeight: 400, marginBottom: 16, lineHeight: 1.2 }}>{card.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: 36 }}>{card.desc}</p>
              <ul style={{ listStyle: 'none', marginBottom: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {card.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--text-muted)' }}>
                    <div style={{ width: 18, height: 1, background: 'var(--gold)', flexShrink: 0 }}/>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to={card.link} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: 'var(--gold)', textDecoration: 'none', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {card.linkLabel}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats band ─────────────────────────────── */}
      <div className="reveal" style={{
        padding: '80px 60px', background: 'var(--dark-3)',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
      }}>
        {STATS_BAND.map((s, i) => (
          <div key={i} style={{
            padding: '0 40px', textAlign: 'center',
            borderRight: i < 3 ? '1px solid var(--border)' : 'none',
          }}>
            <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 56, fontWeight: 300, color: 'var(--gold-light)', display: 'block', lineHeight: 1, marginBottom: 12 }}>{s.num}</span>
            <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── CTA ────────────────────────────────────── */}
      <section id="inscription" style={{ padding: '160px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)', pointerEvents: 'none' }}/>
        <h2 className="reveal" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(48px,6vw,80px)', fontWeight: 300, lineHeight: 1.1, marginBottom: 24, position: 'relative' }}>
          Prêt à faire<br/><em style={{ fontStyle: 'italic', color: 'var(--gold-light)' }}>croître</em> votre avenir ?
        </h2>
        <p className="reveal" style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 460, margin: '0 auto 56px', lineHeight: 1.8, position: 'relative' }}>
          Rejoignez des centaines d'entrepreneurs et d'investisseurs qui font confiance à GOLDEN.
        </p>
        <div className="reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, position: 'relative' }}>
          <Link to="/register?role=porteur" className="btn-primary">Je suis porteur de projet</Link>
          <Link to="/register?role=investisseur" className="btn-outline">Je suis investisseur</Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────── */}
      <footer style={{ padding: '60px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 14, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          GOLDEN <span style={{ color: 'var(--gold)' }}>Investissement</span> &nbsp;·&nbsp; Cotonou, Bénin
        </div>
        <ul style={{ display: 'flex', gap: 32, listStyle: 'none' }}>
          {['À propos','Légal','Confidentialité','Contact'].map(l => (
            <li key={l}>
              <a href="#" style={{ fontSize: 12, color: 'var(--text-dim)', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'color .3s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
              >{l}</a>
            </li>
          ))}
        </ul>
        <div style={{ fontSize: 12, color: 'var(--text-dim)', letterSpacing: '0.06em' }}>© 2026 GOLDEN Investissement</div>
      </footer>

      {/* Navbar scrolled style */}
      <style>{`
        .navbar.scrolled {
          background: rgba(10,10,10,0.95) !important;
          backdrop-filter: blur(20px);
          border-color: var(--border) !important;
          padding-top: 16px !important;
          padding-bottom: 16px !important;
        }
      `}</style>
    </div>
  )
}
