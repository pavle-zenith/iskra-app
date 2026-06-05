'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { questions, calculateResults, profileDescriptions, type QuizResults } from '@/lib/quiz-data';

type Stage = 'intro' | 'onboarding' | 'quiz' | 'feedback' | 'loading' | 'partial' | 'email' | 'promo' | 'results';
type Gender = 'muško' | 'žensko' | 'drugo';

// ── Inline SVG icon primitives (24×24, stroke-based, no emoji) ────────────────
function Ico({ size = 24, stroke = 'currentColor', sw = 1.9, children }: {
  size?: number; stroke?: string; sw?: number; children: React.ReactNode;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

const IcoFlame    = (p: { size?: number; stroke?: string; sw?: number }) => <Ico {...p}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z" /></Ico>;
const IcoTarget   = (p: { size?: number; stroke?: string; sw?: number }) => <Ico {...p}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></Ico>;
const IcoActivity = (p: { size?: number; stroke?: string; sw?: number }) => <Ico {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></Ico>;
const IcoCoin     = (p: { size?: number; stroke?: string; sw?: number }) => <Ico {...p}><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /></Ico>;
const IcoWrench   = (p: { size?: number; stroke?: string; sw?: number }) => <Ico {...p}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" /></Ico>;
const IcoHeart    = (p: { size?: number; stroke?: string; sw?: number }) => <Ico {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></Ico>;
const IcoMsg      = (p: { size?: number; stroke?: string; sw?: number }) => <Ico {...p}><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></Ico>;
const IcoCigOff   = (p: { size?: number; stroke?: string; sw?: number }) => <Ico {...p}><rect x="2.5" y="13" width="13.5" height="4" rx="1.4" /><line x1="11.5" y1="13" x2="11.5" y2="17" /><path d="M18 8.5c.9.7.9 1.8 0 2.5" /><line x1="3" y1="4" x2="21" y2="20.5" /></Ico>;
const IcoMail     = (p: { size?: number; stroke?: string; sw?: number }) => <Ico {...p}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></Ico>;
const IcoLock     = (p: { size?: number; stroke?: string; sw?: number }) => <Ico {...p}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></Ico>;
const IcoCalendar = (p: { size?: number; stroke?: string; sw?: number }) => <Ico {...p}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></Ico>;
const IcoCheck    = (p: { size?: number; stroke?: string; sw?: number }) => <Ico {...p}><path d="M20 6 9 17l-5-5" /></Ico>;
const IcoInfo     = (p: { size?: number; stroke?: string; sw?: number }) => <Ico {...p}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></Ico>;
const IcoShare    = (p: { size?: number; stroke?: string; sw?: number }) => <Ico {...p}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></Ico>;
const IcoUser     = (p: { size?: number; stroke?: string; sw?: number }) => <Ico {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Ico>;
const IcoMinus    = (p: { size?: number; stroke?: string; sw?: number }) => <Ico {...p}><line x1="5" y1="12" x2="19" y2="12" /></Ico>;
const IcoPlus     = (p: { size?: number; stroke?: string; sw?: number }) => <Ico {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Ico>;

// ── Category metadata ─────────────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  pattern:       'Obrazac pušenja',
  fagerstrom:    'Test zavisnosti',
  health:        'Zdravlje',
  psychological: 'Psihološki profil',
  readiness:     'Spremnost',
};

type IcoComponent = (p: { size?: number; stroke?: string; sw?: number }) => React.JSX.Element;

const CATEGORY_ICONS: Record<string, IcoComponent> = {
  pattern:       IcoCigOff,
  fagerstrom:    IcoActivity,
  health:        IcoHeart,
  psychological: IcoMsg,
  readiness:     IcoFlame,
};

// ── Reusable icon chip ────────────────────────────────────────────────────────
function IconChip({ icon, bg, size = 44, radius = 12 }: {
  icon: React.ReactNode; bg: string; size?: number; radius?: number;
}) {
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: bg, display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0,
    }}>{icon}</div>
  );
}

// ─── DRIVER BREAKDOWN CHART ───────────────────────────────────────────────────
function DriverBreakdownChart({ breakdown, animate = true }: {
  breakdown: { stress: number; habit: number; social: number; nicotine: number };
  animate?: boolean;
}) {
  const [rendered, setRendered] = useState(false);
  useEffect(() => { const t = setTimeout(() => setRendered(true), 80); return () => clearTimeout(t); }, []);

  const drivers = [
    { key: 'stress',   label: 'Stres i pritisak',      color: '#E8621A', pct: breakdown.stress },
    { key: 'habit',    label: 'Navika i rutina',        color: '#4A8AC4', pct: breakdown.habit },
    { key: 'social',   label: 'Društvene situacije',    color: '#2D8A4E', pct: breakdown.social },
    { key: 'nicotine', label: 'Nikotinska zavisnost',   color: '#BA7517', pct: breakdown.nicotine },
  ].sort((a, b) => b.pct - a.pct);

  const dominant = drivers[0];

  const interpretations: Record<string, string> = {
    stress:   'Tvoj najveći okidač nije nikotin. Stres i svakodnevni pritisak imaju daleko veći uticaj na pušenje nego sama hemijska zavisnost.',
    habit:    'Tvoje pušenje je uglavnom automatsko. Mozak je vezao cigaretu za svakodnevne rituale — i sad ih je teško razdvojiti.',
    social:   'Kod tebe cigareta živi u društvenom kontekstu. Kafane, piće, pauze — to su tvoji pravi okidači, ne nikotin sam po sebi.',
    nicotine: 'Kod tebe hemijska zavisnost igra centralnu ulogu. Telo traži nikotin — i to je medicinski problem, ne stvar volje.',
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
        {drivers.map(d => (
          <div key={d.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{d.label}</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: d.color, letterSpacing: '-0.01em' }}>{d.pct}%</span>
            </div>
            <div style={{ height: 8, background: 'var(--faint)', borderRadius: 'var(--r-pill)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 'var(--r-pill)',
                background: d.color,
                width: animate ? (rendered ? `${d.pct}%` : '0%') : `${d.pct}%`,
                transition: animate ? 'width 0.9s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
                transitionDelay: animate ? `${drivers.indexOf(d) * 0.12}s` : '0s',
              }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{
        background: 'var(--ember-tint)', borderRadius: 12, padding: '12px 14px',
        borderLeft: '3px solid var(--ember)',
      }}>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--body-text)', fontWeight: 500 }}>
          {interpretations[dominant.key]}
        </p>
      </div>
    </div>
  );
}

// ─── INTRO ────────────────────────────────────────────────────────────────────
function IntroScreen({ onStart }: { onStart: () => void }) {
  const benefits = [
    { Icon: IcoTarget,   bg: '#FEF0E8', stroke: '#E8621A', text: 'Profil pušača i glavni okidači' },
    { Icon: IcoActivity, bg: '#EEF4FF', stroke: '#4A8AC4', text: 'Fagerstrom skor zavisnosti' },
    { Icon: IcoCoin,     bg: '#E1F1E1', stroke: '#3A7A3A', text: 'Procena godišnjeg troška' },
    { Icon: IcoWrench,   bg: '#FEF0E8', stroke: '#E8621A', text: 'Personalizovana strategija prestanka' },
  ];

  const listItems = [
    'koliko si zapravo zavisan od nikotina',
    'šta te najčešće vraća cigareti',
    'koliko te pušenje košta godišnje',
    'koji pristup ima najviše smisla za tvoj slučaj',
  ];

  return (
    // Layer 1 — warm white base
    <div className="animate-fade-in" style={{
      position: 'relative', overflow: 'hidden',
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      background: '#ffffff',
    }}>
      {/* Layer 2 — canyon texture: luminosity blend preserves white base, adds only light/shadow structure */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: "url('/canyon-bg.png')",
        backgroundSize: 'cover', backgroundPosition: 'center 40%',
        opacity: 0.06, mixBlendMode: 'luminosity',
        filter: 'saturate(0)', pointerEvents: 'none',
      }} />

      {/* Layer 3 — content */}
      <div style={{
        position: 'relative', maxWidth: 480, margin: '0 auto',
        padding: '0 20px', flex: 1, display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 24, paddingBottom: 8, textAlign: 'center' }}>

          <div className="animate-scale-in" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--card)', borderRadius: 14, padding: '8px 16px',
            border: '1px solid var(--border)', marginBottom: 20,
            boxShadow: 'var(--shadow-card)', alignSelf: 'center',
          }}>
            <img src="/iskra-flame-ember.png" alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em', color: 'var(--text)' }}>iskra</span>
          </div>

          <div className="animate-slide-up delay-100">
            <h1 style={{
              fontSize: 28, fontWeight: 800, lineHeight: 1.2,
              letterSpacing: '-0.03em', marginBottom: 10,
            }}>
              Šta je razlog zbog kog i dalje pališ — čak i kad znaš da ne bi trebalo?
            </h1>
            <p style={{ color: 'var(--text-sub)', fontSize: 14, lineHeight: 1.55, marginBottom: 10 }}>
              Za 3 minuta saznaćeš:
            </p>
            <div style={{ textAlign: 'left', marginBottom: 20 }}>
              {listItems.map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                  <span style={{ color: 'var(--ember)', flexShrink: 0, marginTop: 2 }}>
                    <IcoCheck size={10} stroke="var(--ember)" sw={3} />
                  </span>
                  <span style={{ fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-slide-up delay-200" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            gap: 8, marginBottom: 16,
          }}>
            {[
              { num: '15',   label: 'pitanja' },
              { num: '3min', label: 'trajanje' },
              { num: '100%', label: 'besplatno' },
            ].map(item => (
              <div key={item.label} style={{
                background: 'var(--card)', borderRadius: 14, padding: '12px 8px',
                border: '1px solid var(--border)', textAlign: 'center',
                boxShadow: 'var(--shadow-card)',
              }}>
                <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--ember)', letterSpacing: '-0.02em' }}>{item.num}</div>
                <div style={{ fontSize: 11, color: 'var(--text-sub)', fontWeight: 600, marginTop: 2 }}>{item.label}</div>
              </div>
            ))}
          </div>

          <div className="animate-slide-up delay-300" style={{
            background: 'var(--card)', borderRadius: 18, padding: '16px 18px',
            border: '1px solid var(--border)', marginBottom: 20, textAlign: 'left',
            boxShadow: 'var(--shadow-card)',
          }}>
            <p className="isk-eyebrow" style={{ marginBottom: 12 }}>Šta dobijaš</p>
            {benefits.map(({ Icon, bg, stroke, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <IconChip icon={<Icon size={13} stroke={stroke} />} bg={bg} size={28} radius={7} />
                <span style={{ fontSize: 14, lineHeight: 1.35 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-slide-up delay-400" style={{ paddingBottom: 28 }}>
          <button className="btn-primary" onClick={onStart}>
            Počni →
          </button>
          <p style={{ fontSize: 12, color: 'var(--text-sub)', marginTop: 10, textAlign: 'center' }}>
            Bez registracije. Bez osuđivanja. Samo jasan odgovor gde se trenutno nalaziš.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── ONBOARDING (2-step: gender → pack price) ────────────────────────────────
function OnboardingScreen({ onComplete }: {
  onComplete: (gender: Gender, packPrice: number) => void;
}) {
  const [step, setStep]           = useState<1 | 2>(1);
  const [gender, setGender]       = useState<Gender | null>(null);
  const [packPrice, setPackPrice] = useState(450);

  const adjustPrice = (delta: number) => {
    setPackPrice(p => Math.max(100, Math.min(1000, p + delta)));
  };

  const progress = ((step - 1) / 2) * 100;

  // Liven-style gender card: large clickable card, advances immediately on click
  const GenderCard = ({ value, label, imgSrc }: { value: Gender; label: string; imgSrc: string }) => (
    <button
      onClick={() => { setGender(value); setTimeout(() => setStep(2), 160); }}
      style={{
        flex: 1, border: 'none', padding: 0, cursor: 'pointer', borderRadius: 20,
        overflow: 'hidden', position: 'relative', aspectRatio: '1 / 1.15',
        background: '#ddd', transition: 'transform 0.13s ease',
        boxShadow: gender === value ? 'var(--shadow-ember)' : 'var(--shadow-card)',
        outline: gender === value ? '2.5px solid var(--ember)' : 'none',
        outlineOffset: 2,
      }}
    >
      <img src={imgSrc} alt={label} style={{
        width: '100%', height: '100%', objectFit: 'cover', display: 'block',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'rgba(255,255,255,0.96)',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        padding: '14px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--text)' }}>{label}</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7 10L10 13L13 7" stroke="var(--ember)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </button>
  );

  return (
    <div style={{
      maxWidth: 480, margin: '0 auto', padding: '0 20px',
      height: '100dvh', display: 'flex', flexDirection: 'column',
    }}>
      {/* Nav */}
      <div style={{ paddingTop: 14, paddingBottom: 16, flexShrink: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', marginBottom: 12 }}>
          <button className="btn-back" onClick={() => step > 1 ? setStep(1) : undefined}
            style={{ visibility: step > 1 ? 'visible' : 'hidden', justifySelf: 'start' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Nazad
          </button>
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.01em', color: 'var(--text)' }}>iskra</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-sub)', justifySelf: 'end' }}>{step} / 2</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Step 1 — Gender (Liven style) */}
      {step === 1 && (
        <div key="step1" className="animate-slide-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 8 }}>
            Koji je tvoj pol?
          </h2>
          <p style={{ color: 'var(--text-sub)', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
            Nikotinska zavisnost se razlikuje po polu — ovo nam pomaže da prilagodimo strategiju.
          </p>

          {/* Two large image cards side by side */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <GenderCard value="muško"  label="Muško"  imgSrc="/iskra-man.png" />
            <GenderCard value="žensko" label="Žensko" imgSrc="/iskra-woman.png" />
          </div>

          {/* Prefer not to say — small text link below */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => { setGender('drugo'); setTimeout(() => setStep(2), 100); }}
              style={{
                background: 'none', border: 'none', color: 'var(--text-sub)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline',
                textDecorationColor: 'var(--border)', padding: '8px 0',
              }}
            >
              Preferiram ne da kažem
            </button>
          </div>
          <div style={{ flex: 1 }} />
        </div>
      )}

      {/* Step 2 — Pack price */}
      {step === 2 && (
        <div key="step2" className="animate-slide-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 8 }}>
            Koliko košta tvoja pakla?
          </h2>
          <p style={{ color: 'var(--text-sub)', fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
            Koristimo ovo da izračunamo tačan godišnji trošak za tebe.
          </p>

          {/* Counter card */}
          <div style={{
            background: 'var(--card)', borderRadius: 'var(--r-card-lg)',
            border: '1.5px solid var(--border)', padding: '32px 24px',
            textAlign: 'center', marginBottom: 12,
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
              <button
                onClick={() => adjustPrice(-10)}
                style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'var(--faint)', border: '1.5px solid var(--border)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.13s ease', flexShrink: 0,
                }}
              >
                <IcoMinus size={20} stroke="var(--text)" sw={2} />
              </button>

              <div style={{ minWidth: 130, textAlign: 'center' }}>
                <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--ember)', lineHeight: 1 }}>
                  {packPrice}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-sub)', marginTop: 6 }}>RSD / pakla</div>
              </div>

              <button
                onClick={() => adjustPrice(10)}
                style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'var(--ember-grad)', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: 'var(--shadow-ember)', transition: 'all 0.13s ease', flexShrink: 0,
                }}
              >
                <IcoPlus size={20} stroke="white" sw={2} />
              </button>
            </div>
          </div>

          {/* Quick-select chips — own row, card-style */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[300, 400, 450, 500, 600].map(p => (
              <button
                key={p}
                onClick={() => setPackPrice(p)}
                style={{
                  flex: '1 1 0',
                  background: packPrice === p ? 'var(--ember-grad)' : 'var(--card)',
                  color: packPrice === p ? 'white' : 'var(--text-sub)',
                  border: packPrice === p ? 'none' : '1.5px solid var(--border)',
                  borderRadius: 'var(--r-card)',
                  padding: '12px 8px', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.13s ease',
                  boxShadow: packPrice === p ? 'var(--shadow-ember)' : 'var(--shadow-card)',
                  textAlign: 'center',
                }}
              >
                {p}
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
        </div>
      )}

      {/* CTA — only shown on step 2 */}
      {step === 2 && (
        <div style={{ paddingBottom: 32, paddingTop: 16 }}>
          <button className="btn-primary" onClick={() => onComplete(gender!, packPrice)}>
            Počni quiz →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── QUESTION ─────────────────────────────────────────────────────────────────
function QuestionScreen({
  questionIndex, total, answers, onAnswer, onBack, gender,
}: {
  questionIndex: number; total: number;
  answers: Record<string, string>;
  onAnswer: (qId: string, optionId: string) => void;
  onBack: () => void;
  gender: Gender;
}) {
  const question = questions[questionIndex];
  const selected = answers[question.id];
  const progress = (questionIndex / total) * 100;
  const letters = ['A', 'B', 'C', 'D'];
  const CatIcon = CATEGORY_ICONS[question.category];

  const isMale = gender !== 'žensko';

  let displayQuestion = question.question;
  let displaySubtitle = question.subtitle;
  let displayOptions = question.options ?? [];

  if (!isMale) {
    if (question.id === 'f4') displayQuestion = 'Da li pušiš čak i kada si bolesna i ležiš u krevetu?';
    if (question.id === 'p1') displaySubtitle = 'Budi iskrena — nema pogrešnog odgovora.';
    if (question.id === 'p2') {
      displayQuestion = 'Da li si ranije pokušala da prestaneš?';
      displayOptions = [
        { id: 'a', label: 'Nikad nisam ni pokušala', value: 0 },
        { id: 'b', label: 'Jednom, nisam izdržala', value: 1 },
        { id: 'c', label: 'Više puta', value: 2 },
        { id: 'd', label: 'Jesam, ali sam se vratila', value: 3 },
      ];
    }
    if (question.id === 'p3') {
      displayOptions = [
        { id: 'a', label: 'Apstinencijalna kriza', value: 1 },
        { id: 'b', label: 'Stres', value: 2 },
        { id: 'c', label: 'Nisam imala podršku', value: 3 },
        { id: 'd', label: 'Nisam ozbiljno pokušala', value: 4 },
      ];
    }
    if (question.id === 'p4') {
      displayOptions = [
        { id: 'a', label: 'Spremna sam', value: 3 },
        { id: 'b', label: 'I hoću i neću', value: 2 },
        { id: 'c', label: 'Pomalo sam zabrinuta', value: 1 },
        { id: 'd', label: 'Nisam sigurna da mogu', value: 0 },
      ];
    }
    if (question.id === 'r1') {
      displayOptions = [
        { id: 'a', label: 'Danas ili ove nedelje', value: 3 },
        { id: 'b', label: 'U narednom mesecu', value: 2 },
        { id: 'c', label: 'Kada budem spremna', value: 1 },
        { id: 'd', label: 'Nisam sigurna', value: 0 },
      ];
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 20px', height: '100dvh', display: 'flex', flexDirection: 'column' }}>

      <div style={{ paddingTop: 14, paddingBottom: 16, flexShrink: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', marginBottom: 12 }}>
          <button className="btn-back" onClick={onBack} style={{ justifySelf: 'start' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Nazad
          </button>
          <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.01em', color: 'var(--text)' }}>iskra</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-sub)', justifySelf: 'end' }}>
            {questionIndex + 1} / {total}
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div key={questionIndex} className="animate-slide-in" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 6 }}>
          <span className="category-pill">
            <CatIcon size={11} stroke="var(--ember)" sw={2} />
            {CATEGORY_LABELS[question.category]}
          </span>
        </div>

        <h2 style={{
          fontSize: 22, fontWeight: 800, lineHeight: 1.22,
          letterSpacing: '-0.025em', marginTop: 12, marginBottom: displaySubtitle ? 6 : 18,
        }}>
          {displayQuestion}
        </h2>

        {displaySubtitle && (
          <p style={{ color: 'var(--text-sub)', fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
            {displaySubtitle}
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {displayOptions.map((opt, i) => (
            <button
              key={opt.id}
              className={`option-card ${selected === opt.id ? 'selected' : ''}`}
              onClick={() => onAnswer(question.id, opt.id)}
            >
              <div className="option-letter">{letters[i]}</div>
              <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.35 }}>{opt.label}</span>
              {selected === opt.id && (
                <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="10" fill="rgba(255,255,255,0.25)" />
                  <path d="M6 10L8.5 12.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ paddingBottom: 24, paddingTop: 12, flexShrink: 0 }}>
        <button
          className="btn-primary"
          disabled={!selected}
          onClick={() => selected && onAnswer(question.id, selected)}
        >
          {questionIndex === total - 1 ? 'Vidi rezultate →' : 'Nastavi →'}
        </button>
      </div>
    </div>
  );
}

// ─── FEEDBACK ────────────────────────────────────────────────────────────────
function FeedbackScreen({ feedbackIndex, answers, onContinue, gender }: {
  feedbackIndex: 1 | 2;
  answers: Record<string, string>;
  onContinue: () => void;
  gender: Gender;
}) {
  const isMale = gender !== 'žensko';

  const q1CigsMap: Record<string, number> = { a: 3, b: 8, c: 15, d: 25 };
  const cigarettesPerDay = q1CigsMap[answers['q1']] ?? 15;
  const cigarettesPerYear = cigarettesPerDay * 365;

  let partialScore = 0;
  ['f1', 'f2', 'f3', 'f4'].forEach(key => {
    const q = questions.find(q => q.id === key);
    const opt = q?.options?.find(o => o.id === answers[key]);
    if (opt) partialScore += opt.value;
  });
  const partialLevel = partialScore <= 2 ? 'Niska' : partialScore <= 4 ? 'Umerena' : 'Visoka';

  const dependencyBodyMap: Record<string, string> = {
    Niska: 'Hemija nije glavni problem. Kod tebe su navike i okidači verovatno važniji od samog nikotina.',
    Umerena: 'Telo se naviklo na nikotin, ali najveća bitka i dalje nije fizička — već svakodnevne rutine.',
    Visoka: "Tvoja zavisnost je ozbiljna, ali nije neobična. To samo znači da plan mora biti pametniji od pukog 'prestani od sutra'.",
  };

  const eyebrow: React.CSSProperties = {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: 'var(--r-pill)',
    padding: '5px 14px',
    fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
    color: 'white', marginBottom: 28,
    textTransform: 'uppercase',
  };

  const glass: React.CSSProperties = {
    background: 'rgba(255,255,255,0.18)',
    borderRadius: 'var(--r-card-lg)',
    padding: '28px 24px',
    marginBottom: 24,
  };

  const whiteBtn: React.CSSProperties = {
    background: 'white', color: 'var(--ember)',
    border: 'none', borderRadius: 'var(--r-btn)',
    padding: '18px 32px', fontFamily: 'var(--font)',
    fontSize: 16, fontWeight: 700,
    cursor: 'pointer', width: '100%',
  };

  return (
    // Layer 1 — base ember gradient
    <div className="animate-fade-in" style={{
      height: '100dvh', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(158deg, #F0701F 0%, #E8621A 58%, #D2581A 100%)',
      display: 'flex', flexDirection: 'column',
      padding: '0 20px',
    }}>
      {/* Layer 2 — photo texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: "url('/canyon-bg.png')",
        backgroundSize: 'cover', backgroundPosition: 'center 55%',
        opacity: 0.42,
        mixBlendMode: 'soft-light',
        filter: 'saturate(0.65)',
        pointerEvents: 'none',
      }} />
      {/* Layer 3 — depth sheen */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(80,40,10,0.06) 45%, rgba(120,60,16,0.20) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Layer 4 — content */}
      <div style={{ position: 'relative', maxWidth: 480, margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Content — flex-grows to push button to bottom */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 32, paddingBottom: 12, textAlign: 'center' }}>
          {feedbackIndex === 1 ? (
            <>
              <div className="animate-slide-up" style={eyebrow}>TVOJ OBRAZAC PUŠENJA</div>
              <div className="animate-slide-up delay-100" style={glass}>
                <div style={{ fontSize: 44, fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1, textShadow: '0 1px 8px rgba(120,50,10,0.35)' }}>
                  {cigarettesPerYear.toLocaleString('sr-RS')}
                </div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 6, fontWeight: 600 }}>
                  cigareta ove godine
                </div>
              </div>
              <p className="animate-slide-up delay-200" style={{
                color: 'rgba(255,255,255,0.92)', fontSize: 16, lineHeight: 1.6,
                fontWeight: 500, textShadow: '0 1px 6px rgba(120,50,10,0.25)',
                marginBottom: 8,
              }}>
                To nije kritika.
              </p>
              <p className="animate-slide-up delay-200" style={{
                color: 'rgba(255,255,255,0.92)', fontSize: 16, lineHeight: 1.6,
                fontWeight: 500, textShadow: '0 1px 6px rgba(120,50,10,0.25)',
                marginBottom: 8,
              }}>
                To je samo broj koji većina pušača nikada ne vidi crno na belo.
              </p>
              <p className="animate-slide-up delay-300" style={{
                color: 'rgba(255,255,255,0.80)', fontSize: 14, lineHeight: 1.6,
                fontWeight: 500, textShadow: '0 1px 6px rgba(120,50,10,0.25)',
              }}>
                Jutarnja cigareta je jedan od najjačih pokazatelja nikotinske zavisnosti.
              </p>
            </>
          ) : (
            <>
              <div className="animate-slide-up" style={eyebrow}>TVOJA ZAVISNOST OD NIKOTINA</div>
              <div className="animate-slide-up delay-100" style={glass}>
                <div style={{ fontSize: 26, fontWeight: 800, color: 'white', letterSpacing: '-0.02em', textShadow: '0 1px 8px rgba(120,50,10,0.35)' }}>
                  Rezultat pokazuje: {partialLevel} zavisnost
                </div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 6, fontWeight: 500 }}>
                  Fagerstrom skor: {partialScore} / 6
                </div>
              </div>
              <p className="animate-slide-up delay-200" style={{
                color: 'rgba(255,255,255,0.92)', fontSize: 16, lineHeight: 1.6,
                fontWeight: 500, textShadow: '0 1px 6px rgba(120,50,10,0.25)',
                marginBottom: 16,
              }}>
                {dependencyBodyMap[partialLevel]}
              </p>
              <p className="animate-slide-up delay-300" style={{
                color: 'rgba(255,255,255,0.80)', fontSize: 14, lineHeight: 1.6,
                fontWeight: 500, textShadow: '0 1px 6px rgba(120,50,10,0.25)',
              }}>
                Sada prelazimo na deo koji većina pušača potcenjuje — psihološke okidače.
              </p>
            </>
          )}
        </div>

        {/* Button — same position as quiz CTA */}
        <div style={{ paddingBottom: 24, paddingTop: 12, flexShrink: 0 }}>
          <button className="animate-slide-up delay-300" onClick={onContinue} style={whiteBtn}>
            Nastavi →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── LOADING ─────────────────────────────────────────────────────────────────
const LOADING_FACTS = [
  'Većina pušača ne pada zbog nikotina. Padnu zbog iste situacije koja ih svaki put vrati.',
  'Prva tri dana su fizički najteža. Posle toga psihologija postaje važnija od hemije.',
  'Ljudi koji imaju konkretan plan imaju znatno veće šanse da istraju.',
];

const LOADING_BARS = [
  'Analiza obrasca pušenja',
  'Analiza nikotinske zavisnosti',
  'Psihološki okidači',
  'Generisanje preporuka',
];

function LoadingScreen({ results, onComplete, gender }: {
  results: QuizResults;
  onComplete: (committed: boolean) => void;
  gender: Gender;
}) {
  const isMale = gender !== 'žensko';

  const [barProgress, setBarProgress]   = useState([0, 0, 0, 0]);
  const [factIndex, setFactIndex]       = useState(0);
  const [showModal, setShowModal]       = useState(false);
  const [modalAnswered, setModalAnswered] = useState(false);
  const committedRef   = useRef(false);
  const onCompleteRef  = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Animate a single bar from 0→100 over `duration` ms using 60ms ticks.
    // Returns a cleanup that cancels the interval.
    const animateBar = (barIndex: number, duration: number, onDone?: () => void) => {
      const tickMs = 60;
      const stepPct = (tickMs / duration) * 100;
      let current = 0;
      const id = setInterval(() => {
        current = Math.min(100, current + stepPct);
        setBarProgress(p => { const n = [...p]; n[barIndex] = Math.round(current); return n; });
        if (current >= 100) {
          clearInterval(id);
          onDone?.();
        }
      }, tickMs);
      return id;
    };

    // Bar 0: starts immediately, fills over 1.8s
    const id0 = animateBar(0, 1800);

    // Bar 1: starts at 2.2s, fills over 3s
    const t1 = setTimeout(() => { animateBar(1, 3000); }, 2200);

    // Bar 2: starts at 5.5s, fills over 3.5s; modal opens when bar 2 finishes
    const t2 = setTimeout(() => { animateBar(2, 3500, () => setTimeout(() => setShowModal(true), 300)); }, 5500);

    return () => {
      clearInterval(id0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Once modal is answered, fill bar 3 over 2s then advance
  useEffect(() => {
    if (!modalAnswered) return;
    const tickMs = 60;
    const duration = 2000;
    const stepPct = (tickMs / duration) * 100;
    let current = 0;
    const id = setInterval(() => {
      current = Math.min(100, current + stepPct);
      setBarProgress(p => { const n = [...p]; n[3] = Math.round(current); return n; });
      if (current >= 100) clearInterval(id);
    }, tickMs);
    const tDone = setTimeout(() => onCompleteRef.current(committedRef.current), 2800);
    return () => { clearInterval(id); clearTimeout(tDone); };
  }, [modalAnswered]);

  useEffect(() => {
    const interval = setInterval(() => setFactIndex(i => (i + 1) % LOADING_FACTS.length), 2500);
    return () => clearInterval(interval);
  }, []);

  const handleChoice = (choice: boolean) => {
    committedRef.current = choice;
    setShowModal(false);
    setModalAnswered(true);
  };

  return (
    <div style={{
      height: '100dvh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 20px', position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ maxWidth: 420, width: '100%' }}>
        {/* Headline */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'var(--card)', borderRadius: 16, padding: '10px 20px',
            border: '1px solid var(--border)', marginBottom: 28,
            boxShadow: 'var(--shadow-card)',
          }}>
            <img src="/iskra-flame-ember.png" alt="" style={{ width: 22, height: 22, objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em', color: 'var(--text)' }}>iskra</span>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 8, color: 'var(--text)' }}>
            Analiziramo tvoje odgovore...
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-sub)' }}>
            Tražimo obrasce zbog kojih ti je najteže da ostaviš cigarete.
          </p>
        </div>

        {/* Progress bars */}
        <div style={{
          background: 'var(--card)', borderRadius: 'var(--r-card-lg)',
          padding: 24, border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)', marginBottom: 28,
        }}>
          {LOADING_BARS.map((label, i) => (
            <div key={label} style={{ marginBottom: i < 3 ? 20 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{
                  fontSize: 14, fontWeight: 600,
                  color: barProgress[i] === 100 ? 'var(--text)' : 'var(--text-sub)',
                  transition: 'color 0.3s ease',
                }}>
                  {label}
                </span>
                {barProgress[i] === 100 && (
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ember)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <IcoCheck size={12} stroke="var(--ember)" sw={2.5} /> Gotovo
                  </span>
                )}
              </div>
              <div className="progress-bar" style={{ height: 6 }}>
                <div className="progress-fill" style={{ width: `${barProgress[i]}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Rotating fact */}
        <div style={{ textAlign: 'center', minHeight: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p key={factIndex} className="animate-fade-in" style={{
            fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.65, fontStyle: 'italic',
          }}>
            &ldquo;{LOADING_FACTS[factIndex]}&rdquo;
          </p>
        </div>
      </div>

      {/* Commitment modal — only dismissable via buttons, no auto-close */}
      {showModal && (
        <div className="animate-fade-in" style={{
          position: 'fixed', inset: 0,
          backdropFilter: 'blur(6px)',
          background: 'rgba(26,22,15,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20, zIndex: 50,
        }}>
          <div className="animate-scale-in" style={{
            background: 'var(--card)', borderRadius: 'var(--r-card-lg)',
            padding: '36px 28px', maxWidth: 380, width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'var(--ember-tint)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <IcoFlame size={28} stroke="var(--ember)" sw={1.7} />
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-sub)', marginBottom: 10 }}>
              Pre nego što pokažemo rezultat:
            </p>
            <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 10 }}>
              {isMale
                ? 'Ako dobiješ plan koji ima smisla za tebe, da li si spreman da ga ozbiljno razmotriš?'
                : 'Ako dobiješ plan koji ima smisla za tebe, da li si spremna da ga ozbiljno razmotriš?'}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.6, marginBottom: 28 }}>
              Tvoj plan je gotovo spreman. Pre nego što ga vidiš — jedno pitanje.
            </p>
            <button className="btn-primary" style={{ marginBottom: 12 }} onClick={() => handleChoice(true)}>
              {isMale ? 'Da, spreman sam' : 'Da, spremna sam'}
            </button>
            <button
              onClick={() => handleChoice(false)}
              style={{
                background: 'transparent', border: 'none',
                color: 'var(--text-sub)', fontFamily: 'var(--font)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                padding: 10, width: '100%',
              }}
            >
              {isMale ? 'Još nisam siguran' : 'Još nisam sigurna'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PARTIAL REVEAL ──────────────────────────────────────────────────────────
function PartialReveal({ results, onContinue, gender }: { results: QuizResults; onContinue: () => void; gender: Gender }) {
  const levelColors: Record<string, string> = {
    'Niska': '#2D8A4E', 'Umerena': '#BA7517', 'Visoka': '#E8621A', 'Vrlo visoka': '#C0392B',
  };
  const color = levelColors[results.fagerstromLevel];
  const pct = (results.fagerstromScore / 6) * 100;
  const partialBd = results.driverBreakdown ?? { stress: 25, habit: 25, social: 25, nicotine: 25 };
  const partialRs100 = results.readinessScore100 ?? 0;

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 20px 40px' }}>
      <div style={{ paddingTop: 48, textAlign: 'center' }}>
        <div className="animate-scale-in" style={{
          width: 72, height: 72, borderRadius: 20,
          background: 'var(--ember-tint)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <IcoTarget size={32} stroke="var(--ember)" sw={1.8} />
        </div>
        <h2 className="animate-slide-up" style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 8 }}>
          Tvoj rezultat je spreman
        </h2>
        <p className="animate-slide-up delay-100" style={{ color: 'var(--text-sub)', fontSize: 15, marginBottom: 36 }}>
          Već vidimo obrazac koji te najčešće vraća cigareti.
        </p>
      </div>

      {/* Card 1 — Driver Breakdown */}
      <div className="animate-slide-up delay-100 result-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <IconChip icon={<IcoTarget size={20} stroke="var(--ember)" sw={1.9} />} bg="var(--ember-tint)" />
          <div>
            <div className="isk-eyebrow" style={{ marginBottom: 3 }}>Dominantni okidači</div>
          </div>
        </div>
        <DriverBreakdownChart breakdown={partialBd} />
      </div>

      {/* Card 2 — Fagerstrom */}
      <div className="animate-slide-up delay-200 result-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <IconChip icon={<IcoActivity size={20} stroke="#4A8AC4" sw={1.9} />} bg="#EEF4FF" />
          <div>
            <div className="isk-eyebrow" style={{ marginBottom: 3 }}>Fagerstrom skor</div>
            <div style={{ fontWeight: 800, fontSize: 18, color }}>{results.fagerstromScore} / 6 — {results.fagerstromLevel} zavisnost</div>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>

      {/* Emotional stat block */}
      <div className="animate-slide-up delay-300" style={{ paddingTop: 24, paddingBottom: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 44, fontWeight: 800, color: 'var(--ember)', letterSpacing: '-0.03em', lineHeight: 1 }}>
          {results.cigarettesPerYear.toLocaleString('sr-RS')}
        </div>
        <div style={{ fontSize: 15, color: 'var(--text-sub)', marginTop: 6 }}>cigareta ove godine</div>
        <div style={{ fontSize: 13, color: 'var(--text-sub)', marginTop: 6 }}>
          To je broj koji većina pušača nikada ne vidi crno na belo.
        </div>
      </div>

      {/* Locked card */}
      <div className="animate-slide-up delay-300" style={{
        background: 'var(--card)', borderRadius: 20, padding: 24,
        border: '1.5px dashed var(--border)', marginBottom: 28,
        position: 'relative', overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
      }}>
        {/* Background content — blurred by overlay */}
        <div style={{ padding: '16px 0' }}>
          {[
            { label: 'Godišnji trošak', value: `${results.annualCostRSD.toLocaleString('sr-RS')} RSD` },
            { label: 'Readiness Score', value: `${partialRs100} / 100` },
            { label: 'Strategija', value: results.smokingProfile },
          ].map((row, i) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{row.label}</span>
              <span style={{ fontSize: 14, fontWeight: 800 }}>{row.value}</span>
            </div>
          ))}
        </div>
        {/* Blur overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backdropFilter: 'blur(5px)',
          background: 'rgba(253,252,250,0.72)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          zIndex: 2, gap: 8,
        }}>
          <IcoLock size={24} stroke="var(--ember)" sw={1.8} />
          <div style={{ fontWeight: 800, fontSize: 15 }}>Otključaj preostale rezultate</div>
          <div style={{ fontSize: 13, color: 'var(--text-sub)' }}>Ostavi email ispod</div>
        </div>
      </div>

      <div className="animate-slide-up delay-400">
        <button className="btn-primary" onClick={onContinue}>
          Otključaj kompletan izveštaj →
        </button>
      </div>
    </div>
  );
}

// ─── EMAIL GATE ───────────────────────────────────────────────────────────────
function EmailGate({ onSubmit, loading, prefillName, gender }: {
  onSubmit: (email: string, name: string) => void;
  loading: boolean;
  prefillName: string;
  gender: Gender;
}) {
  const [email, setEmail] = useState('');
  const [name, setName]   = useState(prefillName);
  const isValid = name.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = () => isValid && !loading && onSubmit(email, name.trim());

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 20px' }}>
      <div style={{ paddingTop: 64, textAlign: 'center', marginBottom: 40 }}>
        <div className="animate-scale-in" style={{
          width: 80, height: 80, borderRadius: 24,
          background: 'var(--ember-tint)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <IcoMail size={36} stroke="var(--ember)" sw={1.7} />
        </div>
        <h2 className="animate-slide-up" style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 12 }}>
          Tvoj kompletan izveštaj je spreman.
        </h2>
        <p className="animate-slide-up delay-100" style={{ color: 'var(--text-sub)', fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>
          Otključaj preostale rezultate i sačuvaj kopiju za kasnije.
        </p>
      </div>

      <div className="animate-slide-up delay-100" style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Ime"
          value={name}
          autoFocus
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && document.querySelector<HTMLInputElement>('input[type="email"]')?.focus()}
        />
      </div>

      <div className="animate-slide-up delay-200" style={{ marginBottom: 16 }}>
        <input
          type="email"
          placeholder="tvoj@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
      </div>

      <div className="animate-slide-up delay-300" style={{ marginBottom: 24 }}>
        <button className="btn-primary" disabled={!isValid || loading} onClick={handleSubmit}>
          {loading ? 'Šaljem...' : 'Pošalji izveštaj →'}
        </button>
      </div>

      <div className="animate-fade-in delay-400" style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'var(--text-sub)', lineHeight: 1.7 }}>
          Nikad spam. Samo tvoji rezultati i obaveštenje kada Iskra bude dostupna.
        </p>
      </div>

      <div className="animate-slide-up delay-400" style={{
        display: 'flex', justifyContent: 'center', gap: 24, marginTop: 32,
        paddingTop: 24, borderTop: '1px solid var(--border)',
      }}>
        {[
          { Icon: IcoCheck, text: 'Besplatno', stroke: '#2D8A4E' },
          { Icon: IcoLock,  text: 'Privatno',  stroke: 'var(--text-sub)' },
        ].map(({ Icon, text, stroke }) => (
          <span key={text} style={{
            fontSize: 13, color: 'var(--text-sub)', fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
            <Icon size={13} stroke={stroke} sw={2.1} />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: 'Šta je tačno Iskra?',
    a: 'Iskra je aplikacija koja prati tvoj profil zavisnosti — ne generički plan koji dobijaš svuda. Na osnovu tvojih odgovora, app zna da li te drži hemija, stres ili navika, i prilagođava dnevni program tome. Check-in svaki dan, praćenje okidača, i AI coach koji razume zašto si zapalio/la — ne samo kada.',
  },
  {
    q: 'Čime se Iskra razlikuje od "samo prestani" saveta?',
    a: 'Većina pristupa tretira sve pušače isto. Iskra polazi od toga da Stresni pušač i Socijalni pušač imaju potpuno različite okidače i potrebuju potpuno različite strategije. Tvoj Fagerstrom skor određuje koliko hemijske podrške ti treba, a tvoj psihološki profil određuje kako app komunicira s tobom tokom teških dana.',
  },
  {
    q: 'Kada izlazi Iskra?',
    a: 'Radimo na tome. Ako si ostavio/la email, na Early Access listi si — što znači da dobijaš pristup pre svih ostalih, i po početnoj ceni koja neće biti dostupna posle javnog lansiranja. Obaveštenje stiže direktno na tvoj inbox.',
  },
  {
    q: 'Šta ako pokušam sam/a pre nego što Iskra izađe?',
    a: 'Odlično — kreni. Tvoja strategija iz ovog izveštaja je polazna tačka. Iskra je tu da te drži na kursu kada postane teško, jer istraživanja pokazuju da većina pušača uspeva tek na 8–10. pokušaju. Razlika između pokušaja koji ne uspe i onog koji uspe najčešće nije volja — nego podrška u pravom trenutku.',
  },
];

function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ marginBottom: 24 }}>
      <p className="isk-eyebrow" style={{ marginBottom: 16 }}>Česta pitanja</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={i}
            style={{
              background: 'var(--card)', border: '1.5px solid var(--border)',
              borderRadius: 'var(--r-card)', overflow: 'hidden',
              boxShadow: 'var(--shadow-card)',
              transition: 'border-color 0.13s ease',
              borderColor: open === i ? 'var(--ember)' : 'var(--border)',
            }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: '100%', background: 'none', border: 'none',
                padding: '16px 18px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                textAlign: 'left',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', lineHeight: 1.4 }}>
                {item.q}
              </span>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: open === i ? 'var(--ember-grad)' : 'var(--faint)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s ease, transform 0.2s ease',
                transform: open === i ? 'rotate(45deg)' : 'none',
              }}>
                <IcoPlus size={14} stroke={open === i ? 'white' : 'var(--text-sub)'} sw={2.2} />
              </div>
            </button>
            {open === i && (
              <div className="animate-fade-in" style={{ padding: '0 18px 16px' }}>
                <div style={{ height: 1, background: 'var(--border)', marginBottom: 14 }} />
                <p style={{ fontSize: 14, color: 'var(--body-text)', lineHeight: 1.7 }}>{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FUTURE YOU PROMO ────────────────────────────────────────────────────────
function PromoScreen({ onContinue, gender }: { onContinue: () => void; gender: Gender }) {
  const isMale = gender !== 'žensko';

  const features = [
    {
      icon: <IcoMsg size={20} stroke="var(--ember)" sw={1.9} />,
      title: 'Prepoznaj okidače',
      body: 'Iskra prati situacije koje najčešće prethode cigareti i pomaže ti da ih prepoznaš pre nego što postanu automatska reakcija.',
    },
    {
      icon: <IcoFlame size={20} stroke="var(--ember)" sw={1.9} />,
      title: 'Održi niz',
      body: 'Dnevni check-in i mali koraci pomažu da ostaneš na putu čak i kada motivacija padne.',
    },
    {
      icon: <IcoActivity size={20} stroke="var(--ember)" sw={1.9} />,
      title: 'Vidi napredak',
      body: 'Prati dane bez cigarete, novac koji ostaje kod tebe i male pobede koje se lako zaborave.',
    },
  ];

  const handleMockupLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    try {
      const doc = (e.target as HTMLIFrameElement).contentDocument;
      if (!doc) return;
      const style = doc.createElement('style');
      style.textContent = `
        #ui, #hint { display: none !important; }
        body {
          background: linear-gradient(158deg, #F0701F 0%, #E8621A 58%, #D2581A 100%) !important;
        }
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url('/canyon-bg.png');
          background-size: cover;
          background-position: center 40%;
          opacity: 0.42;
          mix-blend-mode: soft-light;
          filter: saturate(0.65);
          pointer-events: none;
          z-index: 0;
        }
      `;
      doc.head.appendChild(style);
    } catch { /* cross-origin guard */ }
  };

  return (
    <div style={{ paddingBottom: 60 }}>

      {/* Text header — constrained */}
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ paddingTop: 48, textAlign: 'center', marginBottom: 8 }}>
          <div className="animate-scale-in" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--ember-tint)', borderRadius: 'var(--r-pill)',
            padding: '5px 14px', marginBottom: 20,
          }}>
            <IcoFlame size={12} stroke="var(--ember)" sw={2} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ember)' }}>
              ZAMISLI SEBE ZA 104 DANA
            </span>
          </div>

          <h2 className="animate-slide-up" style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.25, marginBottom: 12 }}>
            Već znaš šta te vraća cigareti.<br />
            <span style={{ color: 'var(--ember)' }}>Iskra ti pomaže da prekineš taj obrazac.</span>
          </h2>
          <p className="animate-slide-up delay-100" style={{ color: 'var(--text-sub)', fontSize: 14, lineHeight: 1.65, marginBottom: 28 }}>
            Ovo nije još jedan motivacioni program. Iskra koristi rezultate koje {isMale ? 'si upravo dobio' : 'si upravo dobila'} da bi prilagodila podršku tvom profilu, tvojim okidačima i tvom tempu. Dan po dan.
          </p>
        </div>
      </div>

      {/* Constrained content — mockup inside container */}
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 20px' }}>

      {/* Mockup — inside container, textured rounded card */}
      <div className="animate-slide-up delay-200" style={{
        position: 'relative', overflow: 'hidden',
        borderRadius: 24,
        background: 'linear-gradient(158deg, #F0701F 0%, #E8621A 58%, #D2581A 100%)',
        marginBottom: 24,
        boxShadow: '0 16px 48px rgba(232,98,26,0.22), 0 4px 16px rgba(0,0,0,0.08)',
      }}>
        {/* canyon texture layer */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: "url('/canyon-bg.png')",
          backgroundSize: 'cover', backgroundPosition: 'center 40%',
          opacity: 0.42, mixBlendMode: 'soft-light', filter: 'saturate(0.65)',
          borderRadius: 24,
        }} />
        {/* sheen */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(80,40,10,0.06) 45%, rgba(120,60,16,0.20) 100%)',
          borderRadius: 24,
        }} />
        <iframe
          src="/iskra-animated-mockup.html"
          onLoad={handleMockupLoad}
          style={{
            width: '100%',
            height: 600,
            border: 'none', display: 'block',
            position: 'relative', zIndex: 2,
            background: 'transparent',
          }}
          loading="lazy"
          title="Iskra app preview"
          scrolling="no"
        />
      </div>

      {/* Stats strip */}
      <div className="animate-slide-up delay-200" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: 8, marginBottom: 28, marginTop: 24,
      }}>
        {[
          { num: '104', label: 'dana slobodan' },
          { num: '41.600', label: 'RSD ušteđeno' },
          { num: '2.080', label: 'cigareta iza tebe' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--card)', borderRadius: 'var(--r-card)',
            border: '1px solid var(--border)', padding: '14px 10px',
            textAlign: 'center', boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--ember)', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.num}</div>
            <div style={{ fontSize: 11, color: 'var(--text-sub)', fontWeight: 600, marginTop: 4, lineHeight: 1.3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {features.map(({ icon, title, body }) => (
          <div key={title} style={{
            display: 'flex', alignItems: 'flex-start', gap: 14,
            background: 'var(--card)', border: '1.5px solid var(--border)',
            borderRadius: 'var(--r-card)', padding: '14px 16px',
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: 'var(--ember-tint)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{icon}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.55 }}>{body}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Social proof */}
      <div style={{
        background: 'var(--faint)', borderRadius: 'var(--r-card-lg)',
        padding: '20px 20px', marginBottom: 28,
        borderLeft: '3px solid var(--ember)',
      }}>
        <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)', marginBottom: 10 }}>
          Nisi jedini kome je dosta počinjanja ispočetka.
        </div>
        <p style={{ fontSize: 13, color: 'var(--body-text)', lineHeight: 1.7 }}>
          Većina pušača zna da bi trebalo da prestane. Problem nije znanje. Problem je šta se dešava u trenutku kada dođe stres, navika ili društveni pritisak. Tu Iskra pomaže.
        </p>
      </div>

      {/* Transition to results */}
      <div style={{
        textAlign: 'center', padding: '28px 20px',
        background: 'var(--card)', borderRadius: 'var(--r-card-lg)',
        border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'var(--ember-tint)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IcoTarget size={28} stroke="var(--ember)" sw={1.8} />
          </div>
        </div>
        <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Tvoj kompletan izveštaj je spreman.
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.6, marginBottom: 20 }}>
          Pogledaj svoje rezultate i strategiju prilagođenu tvom profilu.
        </p>
        <button className="btn-primary" onClick={onContinue}>
          Pogledaj rezultate →
        </button>
      </div>

      </div> {/* end constrained */}
    </div>
  );
}

// ─── RESULTS ──────────────────────────────────────────────────────────────────
function ResultsScreen({ results, email, name, gender }: { results: QuizResults; email: string; name: string; gender: Gender }) {
  const isMale = gender !== 'žensko';

  const profile = profileDescriptions[results.smokingProfile];
  const levelColors: Record<string, string> = {
    'Niska': '#2D8A4E', 'Umerena': '#BA7517', 'Visoka': '#E8621A', 'Vrlo visoka': '#C0392B',
  };
  const color = levelColors[results.fagerstromLevel];
  const pct = (results.fagerstromScore / 6) * 100;

  const equivalents = [
    { label: 'letovanja u Grčkoj', calc: Math.floor(results.annualCostRSD / 80000) },
    { label: 'obroka u kafani',    calc: Math.floor(results.annualCostRSD / 1200) },
    { label: 'meseci Netflix-a',   calc: Math.floor(results.annualCostRSD / 800) },
  ].filter(e => e.calc > 0);

  const daysUntil = results.readinessScore >= 4 ? 7 : 30;
  const quitDate = new Date();
  quitDate.setDate(quitDate.getDate() + daysUntil);
  const quitDateStr = quitDate.toLocaleDateString('sr-RS', { day: 'numeric', month: 'long', year: 'numeric' });

  const bd = results.driverBreakdown ?? { stress: 25, habit: 25, social: 25, nicotine: 25 };
  const rs100 = results.readinessScore100 ?? 0;
  const driverEntries = [
    { key: 'stress',   label: 'Stres i pritisak',    pct: bd.stress },
    { key: 'habit',    label: 'Navika i rutina',      pct: bd.habit },
    { key: 'social',   label: 'Društvene situacije',  pct: bd.social },
    { key: 'nicotine', label: 'Nikotinska zavisnost', pct: bd.nicotine },
  ].sort((a, b) => b.pct - a.pct);
  const dominantDriver = driverEntries[0];

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 20px 60px' }}>
      <div style={{ paddingTop: 48, textAlign: 'center', marginBottom: 36 }}>
        <div className="animate-scale-in" style={{
          width: 80, height: 80, borderRadius: 24,
          background: 'var(--ember-tint)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <IcoFlame size={36} stroke="var(--ember)" sw={1.7} />
        </div>
        <h2 className="animate-slide-up" style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 8 }}>
          {name ? `${name}, evo tvog izveštaja` : 'Tvoj kompletan izveštaj'}
        </h2>
        <p className="animate-slide-up delay-100" style={{ color: 'var(--text-sub)', fontSize: 14 }}>
          Poslali smo kopiju na {email}
        </p>
      </div>

      {/* App positioning sentence */}
      <div className="animate-slide-up delay-100" style={{
        background: 'var(--faint)', borderRadius: 12, padding: '10px 14px',
        marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <IcoFlame size={14} stroke="var(--ember)" sw={2} />
        <p style={{ fontSize: 12, color: 'var(--text-sub)', lineHeight: 1.5 }}>
          Ovo je isti dijagnostički sistem koji Iskra koristi za personalizaciju programa.
        </p>
      </div>

      {/* Card 1 — Dominant Driver Breakdown */}
      <div className="animate-slide-up delay-100 result-card" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <IconChip icon={<IcoTarget size={22} stroke="var(--ember)" sw={1.9} />} bg="var(--ember-tint)" size={48} radius={14} />
          <div>
            <div className="isk-eyebrow" style={{ marginBottom: 3 }}>Dominantni okidači</div>
            <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--text)' }}>
              {dominantDriver.pct}% — {dominantDriver.label}
            </div>
          </div>
        </div>
        <DriverBreakdownChart breakdown={results.driverBreakdown ?? { stress: 25, habit: 25, social: 25, nicotine: 25 }} />
      </div>

      {/* Card 2 — Fagerstrom */}
      <div className="animate-slide-up delay-200 result-card" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <IconChip icon={<IcoActivity size={22} stroke="#4A8AC4" sw={1.9} />} bg="#EEF4FF" size={48} radius={14} />
            <div>
              <div className="isk-eyebrow" style={{ marginBottom: 3 }}>Fagerstrom skor</div>
              <div style={{ fontWeight: 800, fontSize: 24, color, letterSpacing: '-0.02em' }}>{results.fagerstromScore} / 6</div>
            </div>
          </div>
          <div style={{
            background: color + '18', borderRadius: 12, padding: '8px 14px',
            color, fontWeight: 800, fontSize: 14,
          }}>
            {results.fagerstromLevel} zavisnost
          </div>
        </div>
        <div className="progress-bar" style={{ marginBottom: 10 }}>
          <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.6 }}>
          Klinički validiran test. Skor 0–2: niska, 3–4: umerena, 5–6: visoka nikotinska zavisnost.
        </p>
      </div>

      {/* Card 3 — Financial */}
      <div className="animate-slide-up delay-300 result-card" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <IconChip icon={<IcoCoin size={22} stroke="#2D8A4E" sw={1.9} />} bg="#E1F1E1" size={48} radius={14} />
          <div className="isk-eyebrow">Finansijski trošak</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div style={{ background: '#F0FFF4', borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 12, color: '#2D8A4E', fontWeight: 700, marginBottom: 6 }}>Godišnje</div>
            <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em' }}>{results.annualCostRSD.toLocaleString('sr-RS')}</div>
            <div style={{ fontSize: 13, color: 'var(--text-sub)', fontWeight: 600 }}>RSD</div>
          </div>
          <div style={{ background: 'var(--ember-tint)', borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--ember)', fontWeight: 700, marginBottom: 6 }}>Za 5 godina</div>
            <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em' }}>{results.fiveYearCostRSD.toLocaleString('sr-RS')}</div>
            <div style={{ fontSize: 13, color: 'var(--text-sub)', fontWeight: 600 }}>RSD</div>
          </div>
        </div>
        {equivalents.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
            <p style={{ fontSize: 12, color: 'var(--text-sub)', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>To je ekvivalent</p>
            {equivalents.map(eq => (
              <div key={eq.label} style={{ fontSize: 14, marginBottom: 4, fontWeight: 500 }}>
                → <strong>{eq.calc}</strong> {eq.label} godišnje
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card 4 — Readiness Score */}
      <div className="animate-slide-up result-card" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <IconChip icon={<IcoFlame size={22} stroke="#D4547E" sw={1.9} />} bg="#FFF0F6" size={48} radius={14} />
          <div>
            <div className="isk-eyebrow" style={{ marginBottom: 3 }}>Readiness Score</div>
            <div style={{ fontWeight: 800, fontSize: 28, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>
              {rs100} <span style={{ fontSize: 16, color: 'var(--text-sub)', fontWeight: 600 }}>/ 100</span>
            </div>
          </div>
        </div>
        <div className="progress-bar" style={{ marginBottom: 14 }}>
          <div className="progress-fill" style={{
            width: `${rs100}%`,
            background: rs100 >= 60 ? '#2D8A4E' : rs100 >= 35 ? '#BA7517' : '#E8621A',
          }} />
        </div>
        {(() => {
          const readinessColor = rs100 >= 60 ? '#2D8A4E' : rs100 >= 35 ? '#BA7517' : '#E8621A';
          const readinessBg    = rs100 >= 60 ? '#F0FFF4' : rs100 >= 35 ? '#FFF8EC' : 'var(--ember-tint)';
          const readinessText  = rs100 >= 70
            ? 'Motivacija i plan su na dobrom nivou — potrebna je samo prava podrška.'
            : rs100 >= 40
            ? 'Plan još nije dovoljno jasan. Tu najčešće pokušaji zastanu.'
            : 'Razumeti zašto pušiš je već prvi korak.';
          return (
            <div style={{
              display: 'inline-flex', alignItems: 'flex-start', gap: 8,
              background: readinessBg, borderRadius: 'var(--r-pill)',
              padding: '8px 12px',
            }}>
              <span style={{ flexShrink: 0, marginTop: 1, display: 'flex' }}><IcoInfo size={14} stroke={readinessColor} sw={2} /></span>
              <span style={{ fontSize: 13, color: readinessColor, fontWeight: 600, lineHeight: 1.5 }}>{readinessText}</span>
            </div>
          );
        })()}
      </div>

      {/* Card 5 — Smoking Profile */}
      <div className="animate-slide-up result-card" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <IconChip icon={<IcoMsg size={22} stroke="var(--ember)" sw={1.9} />} bg="var(--ember-tint)" size={48} radius={14} />
          <div>
            <div className="isk-eyebrow" style={{ marginBottom: 3 }}>Profil pušača</div>
            <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--text)' }}>{results.smokingProfile}</div>
          </div>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.65, marginBottom: 14, color: 'var(--body-text)' }}>{profile.description}</p>
        <p style={{ fontSize: 12, color: 'var(--text-sub)', marginBottom: 8, fontWeight: 600 }}>Strategija za tvoj profil:</p>
        <div style={{
          background: 'var(--ember-tint)', borderRadius: 12, padding: '14px 16px',
          borderLeft: '3px solid var(--ember)',
        }}>
          <p style={{ fontSize: 14, lineHeight: 1.65, fontWeight: 500 }}>{profile.strategy}</p>
        </div>
      </div>

      {/* Card 6 — Quit date */}
      <div className="animate-slide-up delay-400 result-card" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <IconChip icon={<IcoCalendar size={22} stroke="#D4547E" sw={1.9} />} bg="#FFF0F6" size={48} radius={14} />
          <div>
            <div className="isk-eyebrow" style={{ marginBottom: 3 }}>Preporučeni datum prestanka</div>
            <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em' }}>{quitDateStr}</div>
            <div style={{ fontSize: 13, color: 'var(--text-sub)', marginTop: 2 }}>Za {daysUntil} dana — daj sebi vreme da se pripremiš</div>
          </div>
        </div>
      </div>

      {/* Card 7 — Iskra app teaser */}
      <div className="animate-slide-up result-card" style={{ marginBottom: 14 }}>
        <div className="isk-eyebrow" style={{ marginBottom: 4 }}>Šta Iskra radi za tvoj profil</div>
        <p style={{ fontSize: 13, color: 'var(--text-sub)', marginBottom: 16, lineHeight: 1.5 }}>
          Iskra prepoznaje {results.smokingProfile} i prilagođava program svakog dana.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: <IcoActivity size={18} stroke="var(--ember)" sw={2} />, label: 'Dnevni check-in', sub: 'Praćenje raspoloženja i okidača svakog dana' },
            { icon: <IcoTarget size={18} stroke="var(--ember)" sw={2} />,   label: 'Trigger tracker',  sub: 'App uči šta tebe konkretno pokreće na paljenje' },
            { icon: <IcoMsg size={18} stroke="var(--ember)" sw={2} />,      label: 'Quit coach AI',    sub: 'Personalizovani odgovori na teške trenutke' },
            { icon: <IcoHeart size={18} stroke="var(--ember)" sw={2} />,    label: 'Progress milestones', sub: 'Zdravstveni benefiti u realnom vremenu' },
          ].map(({ icon, label, sub }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: 'var(--card)', border: '1.5px solid var(--border)',
              borderRadius: 'var(--r-card)', padding: '14px 16px',
              boxShadow: 'var(--shadow-card)',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: 'var(--ember-tint)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.4 }}>{sub}</div>
              </div>
              <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
                <IcoLock size={14} stroke="var(--text-faint)" sw={2} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--ember-tint)', borderRadius: 'var(--r-pill)',
            padding: '5px 14px', fontSize: 12, fontWeight: 700, color: 'var(--ember)',
          }}>
            Dolazi uskoro
          </div>
        </div>
      </div>

      {/* Waitlist confirmation — textured brand surface */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        borderRadius: 'var(--r-card-lg)',
        background: 'linear-gradient(158deg, #F0701F 0%, #E8621A 58%, #D2581A 100%)',
        boxShadow: 'var(--shadow-ember)',
        marginBottom: 24,
      }}>
        {/* texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url('/canyon-bg.png')",
          backgroundSize: 'cover', backgroundPosition: 'center 55%',
          opacity: 0.42, mixBlendMode: 'soft-light',
          filter: 'saturate(0.65)', pointerEvents: 'none',
        }} />
        {/* sheen */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(80,40,10,0.06) 45%, rgba(120,60,16,0.20) 100%)',
          pointerEvents: 'none',
        }} />
        {/* content */}
        <div style={{ position: 'relative', padding: '36px 24px', textAlign: 'center' }}>
          {/* Styled checkmark chip */}
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(255,255,255,0.22)',
            border: '2px solid rgba(255,255,255,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 18px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          }}>
            <IcoCheck size={26} stroke="white" sw={2.5} />
          </div>
          <div style={{ fontWeight: 800, fontSize: 22, color: 'white', marginBottom: 8, textShadow: '0 1px 8px rgba(120,50,10,0.35)', letterSpacing: '-0.02em' }}>
            {isMale ? 'Prijavljen si na Iskra Club listu.' : 'Prijavljena si na Iskra Club listu.'}
          </div>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.88)', lineHeight: 1.6 }}>
            {isMale ? 'Bićeš među prvima koji dobijaju pristup.' : 'Bićeš među prvima koje dobijaju pristup.'}
          </p>
        </div>
      </div>

      {/* FAQ accordion */}
      <FaqSection />

      {/* Socials */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 13, color: 'var(--text-sub)', marginBottom: 14, fontWeight: 600 }}>Prati nas</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          {[
            {
              label: 'TikTok',
              href: 'https://tiktok.com/@iskraclub',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.77a4.85 4.85 0 0 1-1.01-.08Z"/>
                </svg>
              ),
            },
            {
              label: 'Instagram',
              href: 'https://instagram.com/iskraclub',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              ),
            },
          ].map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'var(--card)', border: '1.5px solid var(--border)',
                borderRadius: 'var(--r-btn)', padding: '12px 20px',
                color: 'var(--text)', fontWeight: 700, fontSize: 14,
                textDecoration: 'none', boxShadow: 'var(--shadow-card)',
                transition: 'border-color 0.13s ease',
              }}
            >
              {icon}
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Share */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: 'var(--text-sub)', marginBottom: 12 }}>Podeli sa nekim ko bi trebalo da vidi ovo</p>
        <button
          className="btn-primary"
          style={{ width: 'auto', padding: '14px 28px', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8 }}
          onClick={() => {
            const text = isMale
              ? 'Upravo sam uradio Iskra kviz o pušenju. Iznenađujuće tačno. Probaj: quiz.iskraclub.com'
              : 'Upravo sam uradila Iskra kviz o pušenju. Iznenađujuće tačno. Probaj: quiz.iskraclub.com';
            if (navigator.share) {
              navigator.share({ text, url: window.location.href });
            } else {
              navigator.clipboard.writeText(text).then(() => alert('Link kopiran!'));
            }
          }}
        >
          <IcoShare size={16} stroke="white" sw={2} />
          Podeli rezultate
        </button>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [stage, setStage] = useState<Stage>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<QuizResults | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName]   = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [packPrice, setPackPrice] = useState(450);
  const [emailLoading, setEmailLoading] = useState(false);
  const [feedbackIndex, setFeedbackIndex] = useState<1 | 2>(1);
  const [, setCommitted] = useState(false);

  const total = questions.length;

  const handleOnboardingComplete = useCallback((g: Gender, price: number) => {
    setGender(g);
    setPackPrice(price);
    setStage('quiz');
  }, []);

  const handleAnswer = useCallback((qId: string, optionId: string) => {
    const newAnswers = { ...answers, [qId]: optionId };
    setAnswers(newAnswers);

    if (questionIndex === 2) {
      setFeedbackIndex(1);
      setTimeout(() => setStage('feedback'), 200);
    } else if (questionIndex === 6) {
      setFeedbackIndex(2);
      setTimeout(() => setStage('feedback'), 200);
    } else if (questionIndex < total - 1) {
      setTimeout(() => setQuestionIndex(i => i + 1), 200);
    } else {
      const calc = calculateResults(newAnswers, packPrice);
      setResults(calc);
      setTimeout(() => setStage('loading'), 200);
    }
  }, [answers, questionIndex, total, packPrice]);

  const handleBack = useCallback(() => {
    if (questionIndex > 0) setQuestionIndex(i => i - 1);
    else setStage('intro');
  }, [questionIndex]);

  const handleContinueFeedback = useCallback(() => {
    setStage('quiz');
    setQuestionIndex(i => i + 1);
  }, []);

  const handleLoadingComplete = useCallback((didCommit: boolean) => {
    setCommitted(didCommit);
    setStage('partial');
  }, []);

  const handleEmailSubmit = async (emailVal: string, nameVal: string) => {
    setEmail(emailVal);
    setName(nameVal);
    setEmailLoading(true);
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailVal, name: nameVal, results }),
      });
    } catch { /* continue */ }
    setEmailLoading(false);
    setStage('promo');
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stage, questionIndex]);

  const resolvedGender: Gender = gender ?? 'muško';

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ height: 3, background: 'var(--ember-grad)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }} />

      {stage === 'intro' && <IntroScreen onStart={() => setStage('onboarding')} />}
      {stage === 'onboarding' && <OnboardingScreen onComplete={handleOnboardingComplete} />}
      {stage === 'quiz' && (
        <QuestionScreen
          questionIndex={questionIndex}
          total={total}
          answers={answers}
          onAnswer={handleAnswer}
          onBack={handleBack}
          gender={resolvedGender}
        />
      )}
      {stage === 'feedback' && (
        <FeedbackScreen
          feedbackIndex={feedbackIndex}
          answers={answers}
          onContinue={handleContinueFeedback}
          gender={resolvedGender}
        />
      )}
      {stage === 'loading' && results && (
        <LoadingScreen
          results={results}
          onComplete={handleLoadingComplete}
          gender={resolvedGender}
        />
      )}
      {stage === 'partial' && results && (
        <PartialReveal
          results={results}
          onContinue={() => setStage('email')}
          gender={resolvedGender}
        />
      )}
      {stage === 'email' && (
        <EmailGate
          onSubmit={handleEmailSubmit}
          loading={emailLoading}
          prefillName={name}
          gender={resolvedGender}
        />
      )}
      {stage === 'promo' && (
        <PromoScreen
          onContinue={() => setStage('results')}
          gender={resolvedGender}
        />
      )}
      {stage === 'results' && results && (
        <ResultsScreen
          results={results}
          email={email}
          name={name}
          gender={resolvedGender}
        />
      )}
    </main>
  );
}
