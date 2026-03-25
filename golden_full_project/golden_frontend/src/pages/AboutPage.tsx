// src/pages/AboutPage.tsx
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GoldenLogo, SectionLabel, Slideshow } from '@/components/ui'
import { useIsMobile } from '@/hooks/useBreakpoint'
import { useScrollReveal } from '@/hooks/useCountUp'

const TEAM_SLIDES = [
  { url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80&auto=format&fit=crop', label: 'Notre équipe au travail' },
  { url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80&auto=format&fit=crop', label: 'Sessions de travail' },
  { url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80&auto=format&fit=crop', label: 'Rencontres investisseurs' },
  { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80&auto=format&fit=crop', label: 'Innovation & croissance' },
]

const AFRICA_SLIDES = [
  { url: 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=1200&q=80&auto=format&fit=crop', label: "Afrique de l'Ouest" },
  { url: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=1200&q=80&auto=format&fit=crop', label: 'Cotonou, Bénin' },
  { url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1200&q=80&auto=format&fit=crop', label: 'Marchés africains' },
]

const VALUES = [
  { Icon: 'diamond', title: 'Transparence', desc: 'Chaque transaction, chaque décision est traçable et vérifiable. Nous croyons que la confiance se construit dans la clarté.' },
  { title: 'Impact', desc: "Nous finançons des projets qui créent de la valeur réelle — emplois, innovation, développement local en Afrique." },
  { title: 'Excellence', desc: 'Nos standards sont ceux des meilleures plateformes mondiales, adaptés aux réalités et aux opportunités africaines.' },
  { title: 'Inclusion', desc: "Nous ouvrons l'investissement à tous — petits porteurs comme grands fonds — pour démocratiser la finance africaine." },
]

const TEAM = [
  { name: 'Équipe Technique', role: 'Développement & Infrastructure', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80&auto=format&fit=crop&crop=face' },
  { name: 'Équipe Finance', role: 'Analyse & Due Diligence', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&auto=format&fit=crop&crop=face' },
  { name: 'Équipe Produit', role: 'Design & Expérience', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80&auto=format&fit=crop&crop=face' },
  { name: 'Équipe Juridique', role: 'Conformité & Contrats', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&crop=face' },
]

const STATS = [
  { val: '2024', label: 'Année de création' },
  { val: '240+', label: 'Projets financés' },
  { val: '6', label: "Pays d'Afrique" },
  { val: '4.2Mrd ₣', label: 'Capital mobilisé' },
  { val: '98%', label: 'Taux de satisfaction' },
  { val: '500+', label: 'Membres actifs' },
]

export default function AboutPage() {
  const isMobile = useIsMobile()
  useScrollReveal()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div style={{ background: '#060604', minHeight: '100vh', color: '#F0EDE6' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: isMobile ? '16px 20px' : '20px 60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--nav-bg)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(201,168,76,.12)',
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}><GoldenLogo /></Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 28 }}>
          {!isMobile && (
            <Link to="/" style={{ fontSize: 11, color: '#8A8070', textDecoration: 'none', letterSpacing: '.08em', textTransform: 'uppercase' }}>
              Accueil
            </Link>
          )}
          <Link to="/register" style={{
            padding: '8px 20px', border: '1px solid #C9A84C',
            color: '#C9A84C', textDecoration: 'none',
            fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase',
            transition: 'all .2s',
          }}>Rejoindre</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', minHeight: isMobile ? 360 : 480, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Slideshow
            images={TEAM_SLIDES}
            height="100%"
            interval={5000}
            overlay="linear-gradient(135deg, rgba(6,6,4,.92) 0%, rgba(6,6,4,.75) 60%, rgba(201,168,76,.06) 100%)"
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <div style={{ position: 'relative', zIndex: 1, padding: isMobile ? '100px 24px 60px' : '140px 60px 80px', maxWidth: 720 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 24, animation: 'fadeUp .8s ease both' }}>
            <div style={{ width: 32, height: 1, background: '#C9A84C' }} />
            <span style={{ fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: '#C9A84C' }}>Notre histoire</span>
          </div>
          <h1 style={{
            fontFamily: '"Cormorant Garamond",serif',
            fontSize: isMobile ? '44px' : 'clamp(48px,6vw,76px)',
            fontWeight: 300, lineHeight: 1.08, marginBottom: 24,
            animation: 'fadeUp .8s .1s ease both',
          }}>
            <em style={{ fontStyle: 'italic', color: '#E8C97A', display: 'block' }}>Connecter</em>
            l'Afrique à ses<br />
            <strong style={{ fontWeight: 600 }}>capitaux d'avenir</strong>
          </h1>
          <p style={{
            fontSize: isMobile ? 14 : 16, lineHeight: 1.8, color: '#8A8070',
            maxWidth: 520, animation: 'fadeUp .8s .2s ease both',
          }}>
            GOLDEN Investissement est né d'une conviction simple : l'Afrique regorge de talents et de projets visionnaires qui manquent de financement. Nous sommes le pont entre ces deux mondes.
          </p>
        </div>
      </section>

      {/* ── Mission ── */}
      <section style={{ padding: isMobile ? '60px 24px' : '100px 60px', background: '#0A0A08', borderTop: '1px solid rgba(201,168,76,.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 80, alignItems: 'center' }}>
          <div>
            <SectionLabel>Notre mission</SectionLabel>
            <h2 className="reveal" style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: isMobile ? 32 : 48, fontWeight: 300, lineHeight: 1.15, marginBottom: 24 }}>
              Démocratiser<br /><em style={{ fontStyle: 'italic', color: '#E8C97A' }}>l'investissement</em><br />en Afrique
            </h2>
            <p className="reveal" style={{ fontSize: 14, lineHeight: 1.85, color: '#8A8070', marginBottom: 20 }}>
              Nous croyons que chaque entrepreneur africain mérite d'avoir accès aux capitaux dont il a besoin pour réaliser sa vision. Et que chaque investisseur mérite d'accéder aux meilleures opportunités du continent.
            </p>
            <p className="reveal" style={{ fontSize: 14, lineHeight: 1.85, color: '#8A8070', marginBottom: 32 }}>
              GOLDEN Investissement utilise la technologie, l'intelligence artificielle et un réseau de confiance pour créer ces connexions — de manière sécurisée, transparente et efficace.
            </p>
            <div className="reveal" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/register?role=porteur" style={{
                padding: '12px 28px', background: '#C9A84C', color: '#060604',
                textDecoration: 'none', fontSize: 11, letterSpacing: '.1em',
                textTransform: 'uppercase', fontWeight: 500, transition: 'background .2s',
              }}>Je suis porteur →</Link>
              <Link to="/register?role=investisseur" style={{
                padding: '12px 28px', border: '1px solid rgba(201,168,76,.4)',
                color: '#C9A84C', textDecoration: 'none', fontSize: 11,
                letterSpacing: '.1em', textTransform: 'uppercase', transition: 'all .2s',
              }}>Je suis investisseur →</Link>
            </div>
          </div>
          <div className="reveal">
            <Slideshow
              images={AFRICA_SLIDES}
              height={isMobile ? 240 : 420}
              interval={4000}
              overlay="linear-gradient(to bottom, rgba(6,6,4,.1) 0%, rgba(6,6,4,.5) 100%)"
            />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{
        padding: isMobile ? '48px 24px' : '80px 60px',
        background: '#070705',
        borderTop: '1px solid rgba(201,168,76,.08)',
        borderBottom: '1px solid rgba(201,168,76,.08)',
      }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
          <SectionLabel>GOLDEN en chiffres</SectionLabel>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(6,1fr)',
          gap: isMobile ? 16 : 0,
        }}>
          {STATS.map((s, i) => (
            <div key={i} className="reveal" style={{
              padding: isMobile ? '20px 12px' : '32px 20px',
              textAlign: 'center',
              borderRight: !isMobile && i < STATS.length-1 ? '1px solid rgba(201,168,76,.08)' : 'none',
              animationDelay: `${i * .08}s`,
            }}>
              <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: isMobile ? 32 : 42, fontWeight: 300, color: '#C9A84C', lineHeight: 1, marginBottom: 8 }}>{s.val}</div>
              <div style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: '#6A5F48' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Valeurs ── */}
      <section style={{ padding: isMobile ? '60px 24px' : '100px 60px', background: '#0A0A08' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 60 }}>
          <SectionLabel>Ce en quoi nous croyons</SectionLabel>
          <h2 className="reveal" style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: isMobile ? 32 : 48, fontWeight: 300, lineHeight: 1.15 }}>
            Nos <em style={{ fontStyle: 'italic', color: '#E8C97A' }}>valeurs</em>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4,1fr)', gap: 16 }}>
          {VALUES.map((v, i) => (
            <div key={i} className="reveal card-hover" style={{
              padding: '32px 28px',
              background: '#070705',
              border: '1px solid rgba(201,168,76,.12)',
              animationDelay: `${i*.08}s`,
            }}>
              <div style={{ fontSize: 28, color: '#C9A84C', marginBottom: 20, opacity: .7 }}></div>
              <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 22, fontWeight: 400, marginBottom: 12, color: '#F0EDE6' }}>{v.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.75, color: '#6A5F48' }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comment ça marche ── */}
      <section style={{ padding: isMobile ? '60px 24px' : '100px 60px', background: '#060604', borderTop: '1px solid rgba(201,168,76,.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 60 }}>
          <SectionLabel>La plateforme</SectionLabel>
          <h2 className="reveal" style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: isMobile ? 32 : 48, fontWeight: 300 }}>
            Comment <em style={{ fontStyle: 'italic', color: '#E8C97A' }}>fonctionne</em> GOLDEN ?
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: isMobile ? 24 : 40 }}>
          {[
            {
              title: 'Pour les porteurs de projets',
              color: '#C9A84C',
              steps: [
                { n:'01', t:'Créez votre profil', d:'Inscription gratuite avec vérification KYC pour garantir la confiance.' },
                { n:'02', t:'Soumettez votre projet', d:'Business plan, projections financières, vision — tout en quelques clics.' },
                { n:'03', t:'Soyez mis en relation', d:"Notre algorithme vous connecte aux investisseurs les plus compatibles avec votre projet." },
                { n:'04', t:'Négociez & signez', d:'Messagerie sécurisée, contrats électroniques, versements via Mobile Money.' },
              ]
            },
            {
              title: 'Pour les investisseurs',
              color: '#E8C97A',
              steps: [
                { n:'01', t:'Créez votre profil', d:'Définissez vos critères : secteurs, montants, zones géographiques, profil de risque.' },
                { n:'02', t:'Explorez les projets', d:'Accédez à des projets vérifiés et filtrés selon vos préférences.' },
                { n:'03', t:'Analysez & décidez', d:'Due diligence assistée par IA, rapports détaillés, score de compatibilité.' },
                { n:'04', t:'Investissez en sécurité', d:'Transactions sécurisées, suivi en temps réel, reporting automatisé.' },
              ]
            }
          ].map((col, ci) => (
            <div key={ci} className="reveal" style={{ padding: isMobile ? '28px 20px' : '40px 36px', background: '#0A0A08', border: '1px solid rgba(201,168,76,.1)' }}>
              <div style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: col.color, marginBottom: 28, paddingBottom: 16, borderBottom: '1px solid rgba(201,168,76,.1)' }}>
                {col.title}
              </div>
              {col.steps.map((s, si) => (
                <div key={si} style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: 14, marginBottom: 24 }}>
                  <span style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 13, color: col.color, paddingTop: 2 }}>{s.n}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#F0EDE6', marginBottom: 4 }}>{s.t}</div>
                    <p style={{ fontSize: 12, lineHeight: 1.7, color: '#6A5F48' }}>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── Équipe ── */}
      <section style={{ padding: isMobile ? '60px 24px' : '100px 60px', background: '#0A0A08', borderTop: '1px solid rgba(201,168,76,.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 60 }}>
          <SectionLabel>Les gens derrière GOLDEN</SectionLabel>
          <h2 className="reveal" style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: isMobile ? 32 : 48, fontWeight: 300 }}>
            Notre <em style={{ fontStyle: 'italic', color: '#E8C97A' }}>équipe</em>
          </h2>
          <p className="reveal" style={{ fontSize: 14, color: '#6A5F48', maxWidth: 500, margin: '16px auto 0', lineHeight: 1.8 }}>
            Une équipe multidisciplinaire passionnée par la finance, la technologie et le développement de l'Afrique.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 16 }}>
          {TEAM.map((m, i) => (
            <div key={i} className="reveal card-hover" style={{
              border: '1px solid rgba(201,168,76,.12)',
              overflow: 'hidden',
              background: '#070705',
              animationDelay: `${i*.08}s`,
            }}>
              <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                <img src={m.img} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', opacity: .6, transition: 'opacity .3s, transform .4s' }}
                  onMouseEnter={e => { (e.target as HTMLImageElement).style.opacity='.8'; (e.target as HTMLImageElement).style.transform='scale(1.04)' }}
                  onMouseLeave={e => { (e.target as HTMLImageElement).style.opacity='.6'; (e.target as HTMLImageElement).style.transform='scale(1)' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(7,7,5,.9))' }} />
              </div>
              <div style={{ padding: '16px 18px' }}>
                <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 17, fontWeight: 400, color: '#F0EDE6', marginBottom: 4 }}>{m.name}</div>
                <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: '#C9A84C' }}>{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: isMobile ? '80px 24px' : '120px 60px', textAlign: 'center', background: '#060604', borderTop: '1px solid rgba(201,168,76,.08)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(201,168,76,.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <h2 className="reveal" style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: isMobile ? 36 : 64, fontWeight: 300, lineHeight: 1.1, marginBottom: 20, position: 'relative' }}>
          Rejoignez<br /><em style={{ fontStyle: 'italic', color: '#E8C97A' }}>l'aventure</em> GOLDEN
        </h2>
        <p className="reveal" style={{ fontSize: 14, color: '#6A5F48', maxWidth: 420, margin: '0 auto 40px', lineHeight: 1.8 }}>
          Ensemble, construisons la finance africaine de demain.
        </p>
        <div className="reveal" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center' }}>
          <Link to="/register" style={{ padding: '14px 36px', background: '#C9A84C', color: '#060604', textDecoration: 'none', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 500 }}>
            Créer mon compte →
          </Link>
          <Link to="/" style={{ padding: '14px 36px', border: '1px solid rgba(201,168,76,.3)', color: '#C9A84C', textDecoration: 'none', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase' }}>
            Retour à l'accueil
          </Link>
        </div>
      </section>

      {/* ── Footer mini ── */}
      <div style={{ padding: '20px 60px', borderTop: '1px solid rgba(201,168,76,.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: '#3A3530' }}>© 2026 GOLDEN Investissement</div>
        <div style={{ fontSize: 11, color: '#3A3530', letterSpacing: '.06em' }}>Cotonou, Bénin · BCEAO/UEMOA</div>
      </div>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}
