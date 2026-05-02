import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Video, MessageCircle, CalendarCheck, ShieldCheck, Wallet, TrendingUp,
  ArrowRight, Menu, X, Heart, Smartphone, Download
} from 'lucide-react'
import logoSplash from '/assets/logo_splash.png'

const t = {
  cream:      '#FBF8F3',
  ink:        '#2D2A26',
  warmGray:   '#8A8279',
  lightWarm:  '#EDE8E0',
  sage:       '#7A8B6F',
  sageMuted:  '#F2F5EF',
  terracotta: '#C4724E',
  terraMuted: '#FDF5F0',
  cyan:       '#4CCCDD',
  cyanDark:   '#2aa8b8',
  cyanLight:  '#e0f7fa',
  charcoal:   '#1E1C19',
}

const serif = "'Fraunces', Georgia, serif"
const sans = "'Inter', system-ui, sans-serif"

const APP_STORE_URL = '#'
const PLAY_STORE_URL = '#'

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

function StoreBadge({ store, href }) {
  const isApple = store === 'apple'
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 no-underline transition-all duration-200"
      style={{
        background: t.ink, color: t.cream,
        padding: '14px 24px', borderRadius: 14,
        border: `1.5px solid ${t.ink}`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = t.terracotta
        e.currentTarget.style.borderColor = t.terracotta
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = t.ink
        e.currentTarget.style.borderColor = t.ink
      }}
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

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(251,248,243,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${t.lightWarm}` : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 cursor-pointer bg-transparent border-none"
        >
          <img src={logoSplash} alt="MindSpace" style={{ height: 36, objectFit: 'contain' }} />
          <span style={{ fontFamily: serif, fontSize: 22, fontWeight: 600, color: t.ink }}>
            MindSpace
          </span>
        </button>

        <div className="hidden md:flex items-center gap-10">
          {[
            ['how', 'How It Works'],
            ['features', 'Features'],
            ['download', 'Download'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="bg-transparent border-none cursor-pointer transition-colors duration-200"
              style={{
                fontFamily: sans, fontSize: 14, fontWeight: 500, color: t.warmGray,
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => e.target.style.color = t.ink}
              onMouseLeave={e => e.target.style.color = t.warmGray}
            >
              {label}
            </button>
          ))}
          <button
            onClick={onSignIn}
            className="cursor-pointer border-none transition-all duration-200"
            style={{
              fontFamily: sans, fontSize: 14, fontWeight: 600,
              background: t.ink, color: t.cream,
              padding: '10px 26px', borderRadius: 100,
              letterSpacing: '0.01em',
            }}
            onMouseEnter={e => { e.target.style.background = t.terracotta }}
            onMouseLeave={e => { e.target.style.background = t.ink }}
          >
            Login
          </button>
        </div>

        <button
          className="md:hidden bg-transparent border-none cursor-pointer"
          onClick={() => setMenuOpen(o => !o)}
        >
          {menuOpen ? <X size={24} color={t.ink} /> : <Menu size={24} color={t.ink} />}
        </button>
      </div>

      {menuOpen && (
        <div
          className="md:hidden px-6 pb-6 flex flex-col gap-4"
          style={{ background: t.cream }}
        >
          {[
            ['how', 'How It Works'],
            ['features', 'Features'],
            ['download', 'Download'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="bg-transparent border-none cursor-pointer text-left"
              style={{ fontFamily: sans, fontSize: 16, color: t.ink, padding: '8px 0' }}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => { setMenuOpen(false); onSignIn() }}
            className="cursor-pointer border-none"
            style={{
              fontFamily: sans, fontSize: 15, fontWeight: 600,
              background: t.ink, color: t.cream,
              padding: '14px 28px', borderRadius: 100, marginTop: 8,
            }}
          >
            Admin Portal
          </button>
        </div>
      )}
    </nav>
  )
}

function OrganicBlobs() {
  return (
    <div className="relative w-full h-full" aria-hidden="true">
      <div
        className="landing-blob absolute"
        style={{
          width: 340, height: 340,
          background: `linear-gradient(135deg, ${t.cyan}44, ${t.cyan}22)`,
          top: '10%', right: '5%',
          animationDelay: '0s',
        }}
      />
      <div
        className="landing-blob absolute"
        style={{
          width: 200, height: 200,
          background: `linear-gradient(135deg, ${t.terracotta}33, ${t.terracotta}18)`,
          top: '45%', right: '35%',
          animationDelay: '-3s',
        }}
      />
      <div
        className="landing-blob absolute"
        style={{
          width: 160, height: 160,
          background: `linear-gradient(135deg, ${t.sage}33, ${t.sage}18)`,
          top: '15%', right: '40%',
          animationDelay: '-6s',
        }}
      />
      <div
        className="absolute"
        style={{
          width: 80, height: 80, borderRadius: '50%',
          border: `2px solid ${t.lightWarm}`,
          top: '60%', right: '15%',
          animation: 'landing-float 6s ease-in-out infinite',
          animationDelay: '-2s',
        }}
      />
      <div
        className="absolute"
        style={{
          width: 12, height: 12, borderRadius: '50%',
          background: t.terracotta,
          top: '25%', right: '50%',
          animation: 'landing-float 5s ease-in-out infinite',
          animationDelay: '-1s',
        }}
      />
      <div
        className="absolute"
        style={{
          width: 8, height: 8, borderRadius: '50%',
          background: t.sage,
          top: '70%', right: '45%',
          animation: 'landing-float 7s ease-in-out infinite',
          animationDelay: '-4s',
        }}
      />
    </div>
  )
}

function Hero() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { requestAnimationFrame(() => setLoaded(true)) }, [])

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: t.cream }}
    >
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative z-10">
          <div
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full"
            style={{
              background: t.sageMuted, border: `1px solid ${t.sage}33`,
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(15px)',
              transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}
          >
            <Heart size={14} color={t.sage} fill={t.sage} />
            <span style={{ fontFamily: sans, fontSize: 13, fontWeight: 500, color: t.sage }}>
              Therapy that fits in your pocket
            </span>
          </div>

          <h1
            style={{
              fontFamily: serif, fontWeight: 400, color: t.ink,
              fontSize: 'clamp(40px, 5.5vw, 72px)',
              lineHeight: 1.08, letterSpacing: '-0.02em',
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.35s',
              margin: 0,
            }}
          >
            Your mind{' '}
            <span style={{ fontStyle: 'italic', color: t.terracotta }}>deserves</span>
            <br />
            space to breathe
          </h1>

          <p
            style={{
              fontFamily: sans, fontSize: 18, lineHeight: 1.7,
              color: t.warmGray, maxWidth: 460,
              marginTop: 28, marginBottom: 40,
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(25px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.55s',
            }}
          >
            Connect with licensed therapists right from your phone.
            Affordable, confidential, and on your schedule.
          </p>

          <div
            className="flex flex-wrap gap-3"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s',
            }}
          >
            <StoreBadge store="apple" href={APP_STORE_URL} />
            <StoreBadge store="google" href={PLAY_STORE_URL} />
          </div>
        </div>

        <div className="hidden lg:block relative" style={{ minHeight: 480 }}>
          <OrganicBlobs />
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${t.lightWarm}, transparent)` }}
      />
    </section>
  )
}

function Stats() {
  const [ref, visible] = useReveal()
  const stats = [
    { value: '200+', label: 'Licensed Therapists' },
    { value: '15K+', label: 'Sessions Completed' },
    { value: '4.9', label: 'Average Rating' },
    { value: '24/7', label: 'Available Support' },
  ]

  return (
    <section ref={ref} style={{ background: '#fff' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className="text-center lg:text-left"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`,
              }}
            >
              <div style={{ fontFamily: serif, fontSize: 42, fontWeight: 300, color: t.ink, lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontFamily: sans, fontSize: 14, color: t.warmGray, marginTop: 8, letterSpacing: '0.02em' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const [ref, visible] = useReveal()
  const steps = [
    {
      num: '01',
      title: 'Download the app',
      desc: 'Get MindSpace from the App Store or Google Play. Create your account in under two minutes — no referrals needed.',
      accent: t.cyan,
    },
    {
      num: '02',
      title: 'Get matched with a therapist',
      desc: 'Tell us what you\'re going through. We\'ll connect you with a licensed professional who specializes in exactly what you need.',
      accent: t.terracotta,
    },
    {
      num: '03',
      title: 'Start your sessions',
      desc: 'Book video or audio sessions right from the app. Chat with your therapist between sessions. Your schedule, your pace, your space.',
      accent: t.sage,
    },
  ]

  return (
    <section id="how" ref={ref} style={{ background: t.cream }} className="relative">
      <div className="max-w-7xl mx-auto px-6 py-28">
        <div className="max-w-xl mb-20">
          <span
            style={{
              fontFamily: sans, fontSize: 13, fontWeight: 600,
              color: t.sage, textTransform: 'uppercase', letterSpacing: '0.08em',
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.6s ease 0.1s',
            }}
          >
            How It Works
          </span>
          <h2
            style={{
              fontFamily: serif, fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 400, color: t.ink,
              lineHeight: 1.12, letterSpacing: '-0.01em',
              marginTop: 16, marginBottom: 0,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}
          >
            Your path to wellness,{' '}
            <span style={{ fontStyle: 'italic', color: t.terracotta }}>simplified</span>
          </h2>
        </div>

        <div className="flex flex-col gap-0">
          {steps.map((step, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 py-12 relative"
              style={{
                borderTop: `1px solid ${t.lightWarm}`,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(25px)',
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.15}s`,
              }}
            >
              <div className="md:col-span-2">
                <span
                  style={{
                    fontFamily: serif, fontSize: 64, fontWeight: 300,
                    color: `${step.accent}30`, lineHeight: 1,
                  }}
                >
                  {step.num}
                </span>
              </div>
              <div className="md:col-span-4">
                <h3 style={{
                  fontFamily: serif, fontSize: 26, fontWeight: 400,
                  color: t.ink, lineHeight: 1.3, margin: 0,
                }}>
                  {step.title}
                </h3>
              </div>
              <div className="md:col-span-5 md:col-start-8">
                <p style={{
                  fontFamily: sans, fontSize: 16, lineHeight: 1.75,
                  color: t.warmGray, margin: 0,
                }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  const [ref, visible] = useReveal()
  const features = [
    {
      Icon: Video, title: 'Video & Audio Sessions',
      desc: 'Face-to-face therapy from wherever you feel safe. HD video with end-to-end encryption.',
      span: 'md:col-span-2', bg: t.cyanLight + '66',
      iconBg: `${t.cyan}20`, iconColor: t.cyanDark,
    },
    {
      Icon: MessageCircle, title: 'Secure Messaging',
      desc: 'Reach your therapist between sessions. Sometimes the thoughts that matter most come at 2am.',
      span: 'md:col-span-1', bg: t.terraMuted,
      iconBg: `${t.terracotta}18`, iconColor: t.terracotta,
    },
    {
      Icon: CalendarCheck, title: 'Flexible Scheduling',
      desc: 'Book sessions that fit your life — mornings, evenings, weekends. Reschedule anytime.',
      span: 'md:col-span-1', bg: t.sageMuted,
      iconBg: `${t.sage}20`, iconColor: t.sage,
    },
    {
      Icon: ShieldCheck, title: 'Licensed Professionals',
      desc: 'Every therapist is verified, licensed, and has at least 3 years of clinical experience. Your care is in qualified hands.',
      span: 'md:col-span-2', bg: '#fff',
      iconBg: `${t.ink}08`, iconColor: t.ink,
      border: true,
    },
    {
      Icon: Wallet, title: 'Affordable Care',
      desc: 'Quality therapy shouldn\'t break the bank. Transparent pricing, no hidden fees.',
      span: 'md:col-span-1', bg: '#fff',
      iconBg: `${t.terracotta}15`, iconColor: t.terracotta,
      border: true,
    },
    {
      Icon: TrendingUp, title: 'Track Your Growth',
      desc: 'See your progress over time with mood tracking and session summaries.',
      span: 'md:col-span-2', bg: t.cream,
      iconBg: `${t.sage}18`, iconColor: t.sage,
      border: true,
    },
  ]

  return (
    <section id="features" ref={ref} style={{ background: '#fff' }}>
      <div className="max-w-7xl mx-auto px-6 py-28">
        <div className="max-w-xl mb-16">
          <span
            style={{
              fontFamily: sans, fontSize: 13, fontWeight: 600,
              color: t.terracotta, textTransform: 'uppercase', letterSpacing: '0.08em',
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.6s ease 0.1s',
            }}
          >
            Features
          </span>
          <h2
            style={{
              fontFamily: serif, fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 400, color: t.ink,
              lineHeight: 1.12, letterSpacing: '-0.01em',
              marginTop: 16, marginBottom: 0,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}
          >
            Everything you need,{' '}
            <span style={{ fontStyle: 'italic', color: t.sage }}>nothing you don't</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className={`${f.span} rounded-2xl p-8 transition-all duration-300 group`}
              style={{
                background: f.bg,
                border: f.border ? `1px solid ${t.lightWarm}` : 'none',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(25px)',
                transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.08}s`,
                cursor: 'default',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: f.iconBg }}
              >
                <f.Icon size={22} color={f.iconColor} strokeWidth={1.8} />
              </div>
              <h3 style={{
                fontFamily: serif, fontSize: 22, fontWeight: 400,
                color: t.ink, margin: '0 0 10px 0',
              }}>
                {f.title}
              </h3>
              <p style={{
                fontFamily: sans, fontSize: 15, lineHeight: 1.7,
                color: t.warmGray, margin: 0,
              }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DownloadApp() {
  const [ref, visible] = useReveal()

  return (
    <section
      id="download"
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: t.cream }}
    >
      <div className="max-w-7xl mx-auto px-6 py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div
            className="relative hidden lg:flex items-center justify-center"
            style={{ minHeight: 420 }}
          >
            <div
              className="absolute w-80 h-80 rounded-full"
              style={{ background: `${t.cyan}10`, top: '5%', left: '0%' }}
            />
            <div
              className="absolute w-48 h-48 rounded-full"
              style={{ background: `${t.terracotta}08`, bottom: '10%', right: '20%' }}
            />

            <div
              className="relative z-10"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
              }}
            >
              <div
                className="rounded-3xl p-1 mx-auto"
                style={{
                  width: 220,
                  background: `linear-gradient(145deg, ${t.ink}, ${t.charcoal})`,
                  boxShadow: '0 30px 80px rgba(0,0,0,0.18), 0 10px 30px rgba(0,0,0,0.12)',
                }}
              >
                <div
                  className="rounded-2xl flex flex-col items-center justify-center"
                  style={{
                    background: `linear-gradient(180deg, #1a1917 0%, ${t.charcoal} 100%)`,
                    height: 420,
                    padding: 24,
                  }}
                >
                  <img
                    src={logoSplash}
                    alt="MindSpace"
                    className="mb-6"
                    style={{ width: 64, height: 64, objectFit: 'contain' }}
                  />
                  <div style={{ fontFamily: serif, fontSize: 22, color: t.cream, marginBottom: 6 }}>
                    MindSpace
                  </div>
                  <div style={{ fontFamily: sans, fontSize: 12, color: '#9B958E', marginBottom: 28 }}>
                    Your therapy companion
                  </div>

                  <div className="w-full flex flex-col gap-3">
                    {[
                      { icon: Video, label: 'Video Sessions', color: t.cyan },
                      { icon: MessageCircle, label: 'Chat', color: t.terracotta },
                      { icon: CalendarCheck, label: 'Schedule', color: t.sage },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.06)' }}
                      >
                        <item.icon size={16} color={item.color} strokeWidth={1.8} />
                        <span style={{ fontFamily: sans, fontSize: 13, color: '#ccc' }}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <span
              style={{
                fontFamily: sans, fontSize: 13, fontWeight: 600,
                color: t.cyan, textTransform: 'uppercase', letterSpacing: '0.08em',
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.6s ease 0.1s',
              }}
            >
              Download the App
            </span>
            <h2
              style={{
                fontFamily: serif, fontSize: 'clamp(30px, 3.5vw, 46px)',
                fontWeight: 400, color: t.ink,
                lineHeight: 1.15, letterSpacing: '-0.01em',
                marginTop: 16, marginBottom: 24,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
              }}
            >
              Therapy in your pocket,{' '}
              <span style={{ fontStyle: 'italic', color: t.terracotta }}>whenever you need it</span>
            </h2>
            <p
              style={{
                fontFamily: sans, fontSize: 16, lineHeight: 1.75,
                color: t.warmGray, marginBottom: 32, maxWidth: 480,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(15px)',
                transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.35s',
              }}
            >
              Whether you're a client seeking support or a therapist managing your practice,
              everything happens in one app. Book sessions, chat with your therapist,
              track your progress — all from your phone.
            </p>

            <div className="flex flex-col gap-4 mb-10">
              {[
                { icon: Smartphone, text: 'Available on iOS and Android' },
                { icon: ShieldCheck, text: 'End-to-end encrypted conversations' },
                { icon: Download, text: 'Free to download, pay per session' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateX(0)' : 'translateX(-15px)',
                    transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + i * 0.08}s`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${t.cyan}14` }}
                  >
                    <item.icon size={15} color={t.cyanDark} strokeWidth={2} />
                  </div>
                  <span style={{ fontFamily: sans, fontSize: 15, color: t.ink }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="flex flex-wrap gap-3"
              style={{
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.6s ease 0.7s',
              }}
            >
              <StoreBadge store="apple" href={APP_STORE_URL} />
              <StoreBadge store="google" href={PLAY_STORE_URL} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  const [ref, visible] = useReveal()

  return (
    <section ref={ref} style={{ background: '#fff' }}>
      <div className="max-w-3xl mx-auto px-6 py-28 text-center">
        <h2
          style={{
            fontFamily: serif, fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 400, color: t.ink,
            lineHeight: 1.15, letterSpacing: '-0.01em',
            margin: '0 0 20px 0',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
          }}
        >
          Ready to take the{' '}
          <span style={{ fontStyle: 'italic', color: t.cyan }}>first step</span>?
        </h2>
        <p
          style={{
            fontFamily: sans, fontSize: 18, lineHeight: 1.7,
            color: t.warmGray, maxWidth: 460, margin: '0 auto 40px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(15px)',
            transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
          }}
        >
          Download MindSpace and connect with a therapist today.
          No commitments, no pressure — just a conversation.
        </p>
        <div
          className="flex flex-wrap gap-3 justify-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.97)',
            transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.45s',
          }}
        >
          <StoreBadge store="apple" href={APP_STORE_URL} />
          <StoreBadge store="google" href={PLAY_STORE_URL} />
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const links = {
    'App': ['Download iOS', 'Download Android', 'How It Works', 'Features'],
    'Company': ['About', 'Blog', 'Careers', 'Press'],
    'Support': ['Help Center', 'Contact Us', 'Privacy', 'Terms'],
  }

  return (
    <footer style={{ background: t.charcoal }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-5">
              <img src={logoSplash} alt="MindSpace" style={{ height: 32, objectFit: 'contain' }} />
              <span style={{ fontFamily: serif, fontSize: 20, fontWeight: 600, color: t.cream }}>
                MindSpace
              </span>
            </div>
            <p style={{
              fontFamily: sans, fontSize: 14, lineHeight: 1.7,
              color: '#9B958E', maxWidth: 280, margin: '0 0 20px 0',
            }}>
              Making quality mental health care accessible to everyone.
              Download the app and start your journey today.
            </p>
            <div className="flex gap-2">
              <StoreBadge store="apple" href={APP_STORE_URL} />
              <StoreBadge store="google" href={PLAY_STORE_URL} />
            </div>
          </div>

          {Object.entries(links).map(([heading, items]) => (
            <div key={heading} className="md:col-span-2">
              <h4 style={{
                fontFamily: sans, fontSize: 13, fontWeight: 600,
                color: t.cream, textTransform: 'uppercase',
                letterSpacing: '0.06em', marginBottom: 20, marginTop: 0,
              }}>
                {heading}
              </h4>
              <ul className="list-none p-0 m-0 flex flex-col gap-3">
                {items.map(item => (
                  <li key={item}>
                    <a
                      href="#"
                      onClick={e => e.preventDefault()}
                      className="no-underline transition-colors duration-200"
                      style={{ fontFamily: sans, fontSize: 14, color: '#8A8279' }}
                      onMouseEnter={e => e.target.style.color = t.cream}
                      onMouseLeave={e => e.target.style.color = '#8A8279'}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: `1px solid ${t.warmGray}22` }}
        >
          <span style={{ fontFamily: sans, fontSize: 13, color: '#6B6560' }}>
            &copy; 2026 MindSpace. All rights reserved.
          </span>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map(link => (
              <a
                key={link}
                href="#"
                onClick={e => e.preventDefault()}
                className="no-underline"
                style={{ fontFamily: sans, fontSize: 13, color: '#6B6560' }}
                onMouseEnter={e => e.target.style.color = t.cream}
                onMouseLeave={e => e.target.style.color = '#6B6560'}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage({ onSignIn }) {
  useEffect(() => {
    document.body.style.background = t.cream
    return () => { document.body.style.background = '' }
  }, [])

  return (
    <div style={{ background: t.cream, minHeight: '100vh' }}>
      <Nav onSignIn={onSignIn} />
      <Hero />
      <Stats />
      <HowItWorks />
      <Features />
      <DownloadApp />
      <FinalCTA />
      <Footer />
    </div>
  )
}
