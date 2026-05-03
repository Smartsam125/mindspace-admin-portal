import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Video, MessageCircle, CalendarCheck, ShieldCheck, BookOpen, Sparkles,
  ArrowRight, Menu, X, Heart, Smartphone, Send, Star, BarChart3,
  PenLine, Calendar, Users, Mail, Instagram, Twitter, Facebook, Linkedin
} from 'lucide-react'
import toast from 'react-hot-toast'
import logoSplash from '/assets/logo_splash.png'

const t = {
  white:      '#FFFFFF',
  snow:       '#F5FAFB',
  ink:        '#043D41',
  gray:       '#707070',
  lightGray:  '#E5E7EB',
  cyan:       '#4CCCDD',
  cyanDark:   '#2AA8B8',
  cyanLight:  '#CAF0F5',
  cyanMuted:  '#E8F8FA',
  charcoal:   '#0C2426',
}

const serif = "'Fraunces', Georgia, serif"
const sans = "'Inter', system-ui, sans-serif"

const APP_STORE_URL = '#'
const PLAY_STORE_URL = '#'

/* ── Hooks ─────────────────────────────────────────── */

function useReveal(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

/* ── Phone Mockup ──────────────────────────────────── */

function PhoneMockup({ children, className = '', style = {} }) {
  return (
    <div
      className={`flex-shrink-0 ${className}`}
      style={{
        width: 270, borderRadius: 38,
        background: '#1a1a1a',
        padding: '10px 10px 14px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.18), 0 10px 30px rgba(0,0,0,0.1)',
        ...style,
      }}
    >
      <div style={{
        width: '100%', borderRadius: 28, overflow: 'hidden',
        background: '#fff', height: 540, position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
          width: 80, height: 22, background: '#1a1a1a', borderRadius: 12, zIndex: 10,
        }} />
        <div style={{ paddingTop: 42, height: '100%', overflow: 'hidden' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

function ScreenHome() {
  const moods = [
    { emoji: '😊', label: 'Happy', bg: '#DCFCE7' },
    { emoji: '😐', label: 'Okay', bg: '#FEF3C7' },
    { emoji: '😔', label: 'Sad', bg: '#DBEAFE' },
    { emoji: '😰', label: 'Anxious', bg: '#FCE7F3' },
    { emoji: '😤', label: 'Angry', bg: '#FEE2E2' },
  ]
  return (
    <div style={{ padding: '16px 18px', fontFamily: sans, background: '#FBFBFB' }}>
      <div style={{ fontSize: 11, color: t.gray, marginBottom: 2 }}>Good morning,</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: t.ink, marginBottom: 20 }}>Sarah ☀️</div>

      <div style={{
        background: '#fff', borderRadius: 16, padding: 16,
        border: '1px solid #F0F0F0', marginBottom: 14,
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: t.ink, marginBottom: 12 }}>
          How are you feeling today?
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
          {moods.map(m => (
            <div key={m.label} style={{ textAlign: 'center' }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12, background: m.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, marginBottom: 4,
              }}>{m.emoji}</div>
              <div style={{ fontSize: 9, color: t.gray }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: `linear-gradient(135deg, ${t.cyan}18, ${t.cyanLight})`,
        borderRadius: 16, padding: 16, marginBottom: 14,
        borderLeft: `3px solid ${t.cyan}`,
      }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: t.cyanDark, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Today's Affirmation
        </div>
        <div style={{ fontSize: 13, color: t.ink, fontStyle: 'italic', lineHeight: 1.5 }}>
          "You are allowed to take up space and feel what you feel."
        </div>
      </div>

      <div style={{
        background: t.cyan, borderRadius: 14, padding: '12px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <Video size={14} color="#fff" />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Book a Session</span>
      </div>
    </div>
  )
}

function ScreenTherapist() {
  return (
    <div style={{ padding: '16px 18px', fontFamily: sans, background: '#FBFBFB' }}>
      <div style={{ fontSize: 12, color: t.gray, marginBottom: 14 }}>Recommended for you</div>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 16,
        border: '1px solid #F0F0F0', marginBottom: 12,
      }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 16,
            background: `linear-gradient(135deg, ${t.cyanLight}, ${t.cyan}30)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20,
          }}>👩‍⚕️</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.ink }}>Dr. Amara N.</div>
            <div style={{ fontSize: 11, color: t.gray }}>Clinical Psychologist</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 3 }}>
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={10} fill="#F59E0B" color="#F59E0B" />
              ))}
              <span style={{ fontSize: 10, color: t.gray, marginLeft: 2 }}>4.9</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {['Anxiety', 'Depression', 'Relationships'].map(tag => (
            <span key={tag} style={{
              fontSize: 10, padding: '3px 8px', borderRadius: 8,
              background: t.cyanLight, color: t.cyanDark, fontWeight: 500,
            }}>{tag}</span>
          ))}
        </div>
        <div style={{
          background: t.cyan, borderRadius: 10, padding: '9px 14px',
          textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#fff',
        }}>Book Session</div>
      </div>

      <div style={{
        background: '#fff', borderRadius: 16, padding: 16,
        border: '1px solid #F0F0F0',
      }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 16,
            background: `linear-gradient(135deg, ${t.cyanMuted}, ${t.cyan}25)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>👨‍⚕️</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.ink }}>Dr. James K.</div>
            <div style={{ fontSize: 11, color: t.gray }}>Counselling Therapist</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 3 }}>
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={10} fill="#F59E0B" color="#F59E0B" />
              ))}
              <span style={{ fontSize: 10, color: t.gray, marginLeft: 2 }}>4.8</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Stress', 'Self-esteem', 'Grief'].map(tag => (
            <span key={tag} style={{
              fontSize: 10, padding: '3px 8px', borderRadius: 8,
              background: t.cyanMuted, color: t.cyan, fontWeight: 500,
            }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function ScreenMoodTracker() {
  const days = ['M','T','W','T','F','S','S']
  const heights = [60, 75, 45, 80, 55, 90, 70]
  const colors = [t.cyan, t.cyan, '#F59E0B', t.cyan, '#F59E0B', t.cyan, t.cyan]
  return (
    <div style={{ padding: '16px 18px', fontFamily: sans, background: '#FBFBFB' }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: t.ink, marginBottom: 4 }}>Your Week</div>
      <div style={{ fontSize: 11, color: t.gray, marginBottom: 20 }}>Mood overview</div>

      <div style={{
        background: '#fff', borderRadius: 16, padding: '20px 16px 12px',
        border: '1px solid #F0F0F0', marginBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 100, marginBottom: 10 }}>
          {days.map((d, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 24, height: heights[i], borderRadius: 8,
                background: `${colors[i]}30`,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', bottom: 0, width: '100%',
                  height: `${heights[i] * 0.7}%`, borderRadius: 8,
                  background: colors[i],
                }} />
              </div>
              <span style={{ fontSize: 10, color: t.gray }}>{d}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: '#fff', borderRadius: 16, padding: 14,
        border: '1px solid #F0F0F0', marginBottom: 14,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: `${t.cyan}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 20 }}>🔥</span>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.ink }}>5-day streak!</div>
          <div style={{ fontSize: 11, color: t.gray }}>Keep checking in daily</div>
        </div>
      </div>

      <div style={{
        background: `linear-gradient(135deg, ${t.cyan}12, ${t.cyan}06)`,
        borderRadius: 16, padding: 14, border: `1px solid ${t.cyan}20`,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: t.cyan, marginBottom: 4 }}>Weekly Insight</div>
        <div style={{ fontSize: 12, color: t.ink, lineHeight: 1.5 }}>
          You felt most positive on Saturday. Weekday stress seems to affect your mood midweek.
        </div>
      </div>
    </div>
  )
}

function ScreenJournal() {
  return (
    <div style={{ padding: '16px 18px', fontFamily: sans, background: '#FBFBFB' }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: t.ink, marginBottom: 4 }}>Journal</div>
      <div style={{ fontSize: 11, color: t.gray, marginBottom: 16 }}>Your reflections</div>

      <div style={{
        background: '#fff', borderRadius: 16, padding: 16,
        border: '1px solid #F0F0F0', marginBottom: 12,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 10, color: t.gray }}>Today, 3 May</span>
          <span style={{ fontSize: 14 }}>😊</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: t.ink, marginBottom: 6 }}>
          A good day to begin
        </div>
        <div style={{ fontSize: 12, color: t.gray, lineHeight: 1.6 }}>
          I finally had that conversation I'd been putting off. It wasn't as scary as I thought it would be. Feeling lighter...
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 8, background: '#DCFCE7', color: '#166534', fontWeight: 500 }}>Grateful</span>
          <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 8, background: t.cyanLight, color: t.cyanDark, fontWeight: 500 }}>Growth</span>
        </div>
      </div>

      <div style={{
        background: '#fff', borderRadius: 16, padding: 16,
        border: '1px solid #F0F0F0', marginBottom: 12,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 10, color: t.gray }}>2 May</span>
          <span style={{ fontSize: 14 }}>😐</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: t.ink, marginBottom: 6 }}>
          Processing feelings
        </div>
        <div style={{ fontSize: 12, color: t.gray, lineHeight: 1.6 }}>
          Therapy session helped me see patterns I hadn't noticed before. Writing helps me process...
        </div>
      </div>

      <div style={{
        background: t.cyan, borderRadius: 14, padding: '11px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <PenLine size={14} color="#fff" />
        <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>New Entry</span>
      </div>
    </div>
  )
}

/* ── Store Badge ───────────────────────────────────── */

function StoreBadge({ store, href }) {
  const isApple = store === 'apple'
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 no-underline transition-all duration-200"
      style={{
        background: t.ink, color: t.white,
        padding: '14px 24px', borderRadius: 14,
        border: `1.5px solid ${t.ink}`,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = t.charcoal; e.currentTarget.style.borderColor = t.gray }}
      onMouseLeave={e => { e.currentTarget.style.background = t.ink; e.currentTarget.style.borderColor = t.ink }}
    >
      {isApple ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.38l2.302 1.306-2.302 1.306L15.73 12l1.968-1.673zM5.864 2.658L16.8 8.99l-2.302 2.302-8.635-8.635z"/>
        </svg>
      )}
      <div>
        <div style={{ fontFamily: sans, fontSize: 10, opacity: 0.7, lineHeight: 1 }}>
          {isApple ? 'Download on the' : 'Get it on'}
        </div>
        <div style={{ fontFamily: sans, fontSize: 16, fontWeight: 600, lineHeight: 1.3 }}>
          {isApple ? 'App Store' : 'Google Play'}
        </div>
      </div>
    </a>
  )
}

/* ── Nav ───────────────────────────────────────────── */

function Nav({ onSignIn }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const scrollTo = useCallback((id) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const links = [
    ['about', 'About'],
    ['how', 'How It Works'],
    ['features', 'Features'],
    ['contact', 'Contact'],
  ]

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${t.lightGray}` : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 cursor-pointer bg-transparent border-none"
        >
          <img src={logoSplash} alt="MindSpace" style={{ height: 34, objectFit: 'contain' }} />
          <span style={{ fontFamily: serif, fontSize: 21, fontWeight: 600, color: t.ink }}>
            MindSpace
          </span>
        </button>

        <div className="hidden lg:flex items-center gap-9">
          {links.map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="bg-transparent border-none cursor-pointer transition-colors duration-200"
              style={{ fontFamily: sans, fontSize: 14, fontWeight: 500, color: t.gray }}
              onMouseEnter={e => e.target.style.color = t.ink}
              onMouseLeave={e => e.target.style.color = t.gray}
            >
              {label}
            </button>
          ))}
          <button
            onClick={onSignIn}
            className="cursor-pointer border-none transition-all duration-200"
            style={{
              fontFamily: sans, fontSize: 13, fontWeight: 500, color: t.gray,
              background: 'transparent', padding: '8px 0',
            }}
            onMouseEnter={e => e.target.style.color = t.ink}
            onMouseLeave={e => e.target.style.color = t.gray}
          >
            Admin
          </button>
          <button
            onClick={() => scrollTo('download')}
            className="cursor-pointer border-none transition-all duration-200"
            style={{
              fontFamily: sans, fontSize: 14, fontWeight: 600,
              background: t.cyan, color: '#fff',
              padding: '10px 24px', borderRadius: 100,
            }}
            onMouseEnter={e => e.target.style.background = t.cyanDark}
            onMouseLeave={e => e.target.style.background = t.cyan}
          >
            Download App
          </button>
        </div>

        <button
          className="lg:hidden bg-transparent border-none cursor-pointer"
          onClick={() => setMenuOpen(o => !o)}
        >
          {menuOpen ? <X size={24} color={t.ink} /> : <Menu size={24} color={t.ink} />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden px-6 pb-6 flex flex-col gap-4" style={{ background: '#fff' }}>
          {links.map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)}
              className="bg-transparent border-none cursor-pointer text-left"
              style={{ fontFamily: sans, fontSize: 16, color: t.ink, padding: '8px 0' }}>
              {label}
            </button>
          ))}
          <button onClick={() => { setMenuOpen(false); scrollTo('download') }}
            className="cursor-pointer border-none"
            style={{ fontFamily: sans, fontSize: 15, fontWeight: 600, background: t.cyan, color: '#fff', padding: '14px 28px', borderRadius: 100, marginTop: 8 }}>
            Download App
          </button>
        </div>
      )}
    </nav>
  )
}

/* ── Hero ──────────────────────────────────────────── */

function Hero() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { requestAnimationFrame(() => setLoaded(true)) }, [])

  return (
    <section className="relative overflow-hidden" style={{ background: t.snow, minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative z-10">
          <div
            className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full"
            style={{
              background: t.cyanMuted, border: `1px solid ${t.cyan}33`,
              opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(15px)',
              transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}
          >
            <Heart size={14} color={t.cyan} fill={t.cyan} />
            <span style={{ fontFamily: sans, fontSize: 13, fontWeight: 500, color: t.cyan }}>
              Your wellbeing companion
            </span>
          </div>

          <h1 style={{
            fontFamily: serif, fontWeight: 400, color: t.ink,
            fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.1, letterSpacing: '-0.02em',
            margin: 0,
            opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.35s',
          }}>
            Your mind deserves a{' '}
            <span style={{ fontStyle: 'italic', color: t.cyan }}>safe space</span> too.
          </h1>

          <p style={{
            fontFamily: sans, fontSize: 17, lineHeight: 1.7, color: t.gray, maxWidth: 460,
            marginTop: 24, marginBottom: 36,
            opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(25px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.55s',
          }}>
            Connect with the right therapist, reflect, track how you feel and take care of your
            wellbeing everyday — all in one place.
          </p>

          <div className="flex flex-wrap gap-3" style={{
            opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s',
          }}>
            <StoreBadge store="apple" href={APP_STORE_URL} />
            <StoreBadge store="google" href={PLAY_STORE_URL} />
          </div>
        </div>

        <div
          className="hidden lg:flex items-end justify-center gap-5"
          style={{
            minHeight: 560,
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
          }}
        >
          <PhoneMockup style={{ transform: 'rotate(-4deg) translateY(-20px)' }}>
            <ScreenHome />
          </PhoneMockup>
          <PhoneMockup style={{ transform: 'rotate(3deg) translateY(10px)' }}>
            <ScreenTherapist />
          </PhoneMockup>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${t.lightGray}, transparent)` }} />
    </section>
  )
}

/* ── About ─────────────────────────────────────────── */

function About() {
  const [ref, visible] = useReveal()
  return (
    <section id="about" ref={ref} style={{ background: '#fff' }}>
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <span style={{
            fontFamily: sans, fontSize: 13, fontWeight: 600, color: t.cyan,
            textTransform: 'uppercase', letterSpacing: '0.08em',
            opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.1s',
          }}>About MindSpace</span>

          <h2 style={{
            fontFamily: serif, fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 400,
            color: t.ink, lineHeight: 1.3, marginTop: 16, marginBottom: 24,
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          }}>
            A digital mental health platform designed to make support{' '}
            <span style={{ fontStyle: 'italic', color: t.cyan }}>more accessible</span>
          </h2>

          <p style={{
            fontFamily: sans, fontSize: 16, lineHeight: 1.8, color: t.gray,
            marginBottom: 16,
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(15px)',
            transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.35s',
          }}>
            Through a network of qualified therapists and thoughtfully designed tools,
            MindSpace helps you navigate your thoughts, emotions, and experiences in a way
            that feels natural and supportive.
          </p>

          <p style={{
            fontFamily: sans, fontSize: 16, lineHeight: 1.8, color: t.gray,
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(15px)',
            transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.45s',
          }}>
            Whether you're looking to speak to a therapist, track how you feel, or explore helpful
            resources — MindSpace brings everything together into one seamless experience so
            you're never navigating life alone.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── How It Works ──────────────────────────────────── */

function HowItWorks() {
  const [ref, visible] = useReveal()
  const steps = [
    { num: '01', title: 'Download the App', desc: 'Get started by downloading the MindSpace App and creating your account in just a few simple steps.', accent: t.cyan },
    { num: '02', title: 'Tell Us About You', desc: 'Complete a quick assessment to help us understand your needs and preferences.', accent: t.cyan },
    { num: '03', title: 'Get Matched', desc: 'We connect you with a therapist who aligns with what you\'re looking for.', accent: t.cyan },
    { num: '04', title: 'Start Your Journey', desc: 'Book sessions, reflect, track your mood, and access support anytime, anywhere.', accent: t.cyan },
  ]

  return (
    <section id="how" ref={ref} style={{ background: t.snow }}>
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7">
            <span style={{
              fontFamily: sans, fontSize: 13, fontWeight: 600, color: t.cyan,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.1s',
            }}>How It Works</span>

            <h2 style={{
              fontFamily: serif, fontSize: 'clamp(30px, 3.5vw, 46px)', fontWeight: 400,
              color: t.ink, lineHeight: 1.15, marginTop: 16, marginBottom: 32,
              opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}>
              Your path to wellness,{' '}
              <span style={{ fontStyle: 'italic', color: t.cyan }}>simplified</span>
            </h2>

            <div className="flex flex-col gap-0">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-6 py-6" style={{
                  borderTop: `1px solid ${t.lightGray}`,
                  opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.1}s`,
                }}>
                  <span style={{ fontFamily: serif, fontSize: 48, fontWeight: 300, color: `${step.accent}28`, lineHeight: 1, flexShrink: 0, width: 52 }}>
                    {step.num}
                  </span>
                  <div>
                    <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 400, color: t.ink, margin: '0 0 6px 0' }}>
                      {step.title}
                    </h3>
                    <p style={{ fontFamily: sans, fontSize: 14, lineHeight: 1.7, color: t.gray, margin: 0 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex lg:col-span-5 justify-center" style={{
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
          }}>
            <PhoneMockup style={{ transform: 'rotate(2deg)' }}>
              <ScreenMoodTracker />
            </PhoneMockup>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Features ──────────────────────────────────────── */

function Features() {
  const [ref, visible] = useReveal()
  const features = [
    { Icon: Users, title: 'Therapist Matching', desc: 'Get connected to therapists based on your needs, book and have sessions online via video conferencing.', iconBg: `${t.cyan}14`, iconColor: t.cyanDark },
    { Icon: BarChart3, title: 'Mood Tracking', desc: 'Check in with yourself daily and track how you feel over time to better understand your emotional patterns.', iconBg: `${t.cyan}14`, iconColor: t.cyan },
    { Icon: PenLine, title: 'Journal & Reflection', desc: 'Capture your thoughts, reflect on your experiences, and build self-awareness at your own pace.', iconBg: `${t.cyan}18`, iconColor: t.cyan },
    { Icon: Sparkles, title: 'Affirmations & Daily Support', desc: 'Receive encouraging messages and reminders to support your mental wellbeing.', iconBg: `${t.cyan}14`, iconColor: t.cyanDark },
    { Icon: Calendar, title: 'Events & Workshops', desc: 'Discover and join wellbeing events, workshops, and sessions designed to support your growth and wellbeing.', iconBg: `${t.cyan}14`, iconColor: t.cyan },
    { Icon: BookOpen, title: 'Resource Center', desc: 'Access curated content, tools, and support resources across different mental health topics.', iconBg: `${t.cyan}18`, iconColor: t.cyan },
  ]

  return (
    <section id="features" ref={ref} style={{ background: '#fff' }}>
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          <div className="lg:col-span-7">
            <span style={{
              fontFamily: sans, fontSize: 13, fontWeight: 600, color: t.cyan,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.1s',
            }}>Features</span>

            <h2 style={{
              fontFamily: serif, fontSize: 'clamp(30px, 3.5vw, 46px)', fontWeight: 400,
              color: t.ink, lineHeight: 1.15, marginTop: 16, marginBottom: 32,
              opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}>
              Everything you need,{' '}
              <span style={{ fontStyle: 'italic', color: t.cyan }}>all in one place</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map((f, i) => (
                <div key={i} className="rounded-2xl p-6 transition-all duration-300"
                  style={{
                    background: t.snow, border: `1px solid ${t.lightGray}`,
                    opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
                    transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.07}s`,
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: f.iconBg }}>
                    <f.Icon size={20} color={f.iconColor} strokeWidth={1.8} />
                  </div>
                  <h3 style={{ fontFamily: serif, fontSize: 18, fontWeight: 400, color: t.ink, margin: '0 0 6px 0' }}>
                    {f.title}
                  </h3>
                  <p style={{ fontFamily: sans, fontSize: 13, lineHeight: 1.7, color: t.gray, margin: 0 }}>
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex lg:col-span-5 justify-center sticky top-32" style={{
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
          }}>
            <PhoneMockup style={{ transform: 'rotate(-2deg)' }}>
              <ScreenJournal />
            </PhoneMockup>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Download ──────────────────────────────────────── */

function DownloadApp() {
  const [ref, visible] = useReveal()
  return (
    <section id="download" ref={ref} style={{ background: t.snow }}>
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="hidden lg:flex justify-center" style={{
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
          }}>
            <PhoneMockup>
              <ScreenHome />
            </PhoneMockup>
          </div>

          <div>
            <span style={{
              fontFamily: sans, fontSize: 13, fontWeight: 600, color: t.cyan,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.1s',
            }}>Download the App</span>

            <h2 style={{
              fontFamily: serif, fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 400,
              color: t.ink, lineHeight: 1.2, marginTop: 16, marginBottom: 20,
              opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}>
              Your space. Your pace.{' '}
              <span style={{ fontStyle: 'italic', color: t.cyan }}>Your wellbeing companion.</span>
            </h2>

            <p style={{
              fontFamily: sans, fontSize: 16, lineHeight: 1.75, color: t.gray,
              marginBottom: 16, maxWidth: 480,
              opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(15px)',
              transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.35s',
            }}>
              MindSpace is a safe space for your mind — whether you need someone to talk to,
              a moment to reflect, or tools to help you navigate your day. Everything you need
              to support your mental wellbeing is right at your fingertips.
            </p>

            <p style={{
              fontFamily: sans, fontSize: 15, fontWeight: 600, color: t.ink, marginBottom: 28,
              opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.5s',
            }}>
              Download MindSpace today and take that first step.
            </p>

            <div className="flex flex-wrap gap-3" style={{
              opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.6s',
            }}>
              <StoreBadge store="apple" href={APP_STORE_URL} />
              <StoreBadge store="google" href={PLAY_STORE_URL} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Contact Form ──────────────────────────────────── */

function ContactSection() {
  const [ref, visible] = useReveal()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSending(true)
    setTimeout(() => {
      setSending(false)
      toast.success('Message sent! We\'ll get back to you soon.')
      setForm({ name: '', email: '', subject: '', message: '' })
    }, 1200)
  }

  const inputStyle = {
    width: '100%', padding: '13px 16px', borderRadius: 12, fontSize: 14,
    border: `1.5px solid ${t.lightGray}`, background: '#fff', color: t.ink,
    outline: 'none', fontFamily: sans, transition: 'border-color 0.2s, box-shadow 0.2s',
  }

  return (
    <section id="contact" ref={ref} style={{ background: '#fff' }}>
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <span style={{
              fontFamily: sans, fontSize: 13, fontWeight: 600, color: t.cyan,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.1s',
            }}>Get In Touch</span>

            <h2 style={{
              fontFamily: serif, fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 400,
              color: t.ink, lineHeight: 1.2, marginTop: 16, marginBottom: 12,
              opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}>
              We'd love to{' '}
              <span style={{ fontStyle: 'italic', color: t.cyan }}>hear from you</span>
            </h2>

            <p style={{
              fontFamily: sans, fontSize: 15, color: t.gray,
              opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.3s',
            }}>
              Have a question, want to partner, or need support? Reach out.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" style={{
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
          }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: 12, fontWeight: 500, color: t.gray, fontFamily: sans }}>Name</label>
                <input required value={form.name} onChange={update('name')} placeholder="Your name" style={inputStyle} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: 12, fontWeight: 500, color: t.gray, fontFamily: sans }}>Email</label>
                <input required type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" style={inputStyle} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 12, fontWeight: 500, color: t.gray, fontFamily: sans }}>Subject</label>
              <select required value={form.subject} onChange={update('subject')} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', color: form.subject ? t.ink : t.gray }}>
                <option value="" disabled>Select a subject</option>
                <option value="partnerships">Partnerships</option>
                <option value="become-therapist">Become a Therapist</option>
                <option value="app-support">App Support</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 12, fontWeight: 500, color: t.gray, fontFamily: sans }}>Message</label>
              <textarea required value={form.message} onChange={update('message')} rows={5} placeholder="Tell us more..." style={{ ...inputStyle, resize: 'none' }} />
            </div>

            <button type="submit" disabled={sending}
              className="flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
              style={{
                fontFamily: sans, fontSize: 15, fontWeight: 600,
                background: sending ? t.cyanDark : t.cyan, color: '#fff',
                padding: '15px 32px', borderRadius: 12, border: 'none',
                opacity: sending ? 0.8 : 1,
                boxShadow: '0 2px 8px rgba(76,204,221,0.25)',
              }}
              onMouseEnter={e => { if (!sending) e.currentTarget.style.background = t.cyanDark }}
              onMouseLeave={e => { if (!sending) e.currentTarget.style.background = t.cyan }}
            >
              {sending ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : <Send size={16} />}
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

/* ── Final CTA ─────────────────────────────────────── */

function FinalCTA() {
  const [ref, visible] = useReveal()
  return (
    <section ref={ref} style={{ background: t.snow }}>
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 style={{
          fontFamily: serif, fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 400,
          color: t.ink, lineHeight: 1.15, margin: '0 0 20px 0',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
        }}>
          Ready to take the{' '}
          <span style={{ fontStyle: 'italic', color: t.cyan }}>first step</span>?
        </h2>
        <p style={{
          fontFamily: sans, fontSize: 17, lineHeight: 1.7, color: t.gray,
          maxWidth: 520, margin: '0 auto 36px',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(15px)',
          transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
        }}>
          You don't need to have everything figured out to begin. Whether you're feeling
          overwhelmed, curious, or simply ready for something different — MindSpace is here
          to meet you where you are.
        </p>
        <div className="flex flex-wrap gap-3 justify-center" style={{
          opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.5s',
        }}>
          <StoreBadge store="apple" href={APP_STORE_URL} />
          <StoreBadge store="google" href={PLAY_STORE_URL} />
        </div>
      </div>
    </section>
  )
}

/* ── Footer ────────────────────────────────────────── */

function Footer() {
  return (
    <footer style={{ background: t.charcoal }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-14">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5 mb-5">
              <img src={logoSplash} alt="MindSpace" style={{ height: 30, objectFit: 'contain' }} />
              <span style={{ fontFamily: serif, fontSize: 20, fontWeight: 600, color: t.white }}>
                MindSpace
              </span>
            </div>
            <p style={{ fontFamily: sans, fontSize: 14, lineHeight: 1.7, color: '#9CA3AF', maxWidth: 280, margin: '0 0 16px 0' }}>
              Your wellbeing companion. Making quality mental health care accessible to everyone.
            </p>
            <div className="flex gap-3 mb-5">
              <StoreBadge store="apple" href={APP_STORE_URL} />
              <StoreBadge store="google" href={PLAY_STORE_URL} />
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: t.white, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20, marginTop: 0 }}>
              Quick Links
            </h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {['About', 'How It Works', 'Features', 'Download'].map(item => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(/ /g, '-').replace('how-it-works', 'how')}`}
                    className="no-underline transition-colors duration-200"
                    style={{ fontFamily: sans, fontSize: 14, color: '#9CA3AF' }}
                    onMouseEnter={e => e.target.style.color = t.white}
                    onMouseLeave={e => e.target.style.color = '#9CA3AF'}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: t.white, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20, marginTop: 0 }}>
              Legal
            </h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {['Terms of Service', 'Privacy Policy'].map(item => (
                <li key={item}>
                  <a href="#" onClick={e => e.preventDefault()}
                    className="no-underline transition-colors duration-200"
                    style={{ fontFamily: sans, fontSize: 14, color: '#9CA3AF' }}
                    onMouseEnter={e => e.target.style.color = t.white}
                    onMouseLeave={e => e.target.style.color = '#9CA3AF'}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: t.white, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20, marginTop: 0 }}>
              Connect
            </h4>
            <a href="mailto:hello@mindspace.app" className="no-underline flex items-center gap-2 mb-5 transition-colors duration-200"
              style={{ fontFamily: sans, fontSize: 14, color: '#9CA3AF' }}
              onMouseEnter={e => e.currentTarget.style.color = t.white}
              onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
              <Mail size={14} />
              hello@mindspace.app
            </a>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, href: 'https://www.instagram.com/mindspace__app' },
                { Icon: Facebook, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Linkedin, href: '#' },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 no-underline"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#9CA3AF' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = t.white }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#9CA3AF' }}>
                  <s.Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: `1px solid ${t.gray}22` }}>
          <span style={{ fontFamily: sans, fontSize: 13, color: '#6B7280' }}>
            &copy; 2026 MindSpace. All rights reserved.
          </span>
          <span style={{ fontFamily: sans, fontSize: 13, color: '#6B7280' }}>
            MindSpace is a product of{' '}
            <a href="https://livemoreco.com" target="_blank" rel="noopener noreferrer"
              className="no-underline transition-colors duration-200"
              style={{ color: t.cyan, fontWeight: 500 }}
              onMouseEnter={e => e.target.style.color = t.cyanDark}
              onMouseLeave={e => e.target.style.color = t.cyan}>
              LIVE MORE
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}

/* ── Main Export ────────────────────────────────────── */

export default function LandingPage({ onSignIn }) {
  useEffect(() => {
    document.body.style.background = t.snow
    return () => { document.body.style.background = '' }
  }, [])

  return (
    <div style={{ background: t.snow, minHeight: '100vh' }}>
      <Nav onSignIn={onSignIn} />
      <Hero />
      <About />
      <HowItWorks />
      <Features />
      <DownloadApp />
      <ContactSection />
      <FinalCTA />
      <Footer />
    </div>
  )
}
