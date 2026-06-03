'use client';

import { useState, useEffect, useCallback } from 'react';
import { questions, calculateResults, profileDescriptions, type QuizResults } from '@/lib/quiz-data';

type Stage = 'intro' | 'quiz' | 'partial' | 'email' | 'results';

const CATEGORY_LABELS: Record<string, string> = {
  pattern: 'Obrazac pušenja',
  fagerstrom: 'Test zavisnosti',
  health: 'Zdravlje',
  psychological: 'Psihološki profil',
  readiness: 'Spremnost',
};

const CATEGORY_ICONS: Record<string, string> = {
  pattern: '🚬',
  fagerstrom: '🧠',
  health: '❤️',
  psychological: '💭',
  readiness: '🔥',
};

// ─── INTRO ───────────────────────────────────────────────────────────────────
function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="animate-fade-in" style={{ maxWidth: 480, margin: '0 auto', padding: '0 20px' }}>
      <div style={{ paddingTop: 48, paddingBottom: 40, textAlign: 'center' }}>
        <div className="animate-scale-in" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: 'var(--card)', borderRadius: 16, padding: '10px 20px',
          border: '1px solid var(--border)', marginBottom: 40,
        }}>
          <span style={{ fontSize: 22 }}>🔥</span>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>iskra</span>
        </div>

        <div className="animate-slide-up delay-100">
          <h1 style={{
            fontSize: 32, fontWeight: 800, lineHeight: 1.2,
            letterSpacing: '-0.03em', marginBottom: 16,
          }}>
            Šta te stvarno<br />drži uz cigaretu?
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
            15 pitanja. Dobićeš tačan profil zavisnosti,<br />
            koliko trojiš i strategiju koja funkcioniše za tebe.
          </p>
        </div>

        <div className="animate-slide-up delay-200" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: 12, marginBottom: 40,
        }}>
          {[
            { num: '15', label: 'pitanja' },
            { num: '3min', label: 'trajanje' },
            { num: '100%', label: 'besplatno' },
          ].map(item => (
            <div key={item.label} style={{
              background: 'var(--card)', borderRadius: 16, padding: '16px 12px',
              border: '1px solid var(--border)', textAlign: 'center',
            }}>
              <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--orange)', letterSpacing: '-0.02em' }}>{item.num}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>

        <div className="animate-slide-up delay-300" style={{
          background: 'var(--card)', borderRadius: 20, padding: 24,
          border: '1px solid var(--border)', marginBottom: 32, textAlign: 'left',
        }}>
          <p style={{ fontWeight: 700, fontSize: 11, color: 'var(--muted)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 16 }}>Šta dobijaš</p>
          {[
            '🎯  Tip pušača i psihološki profil',
            '📊  Fagerstrom skor zavisnosti (klinički)',
            '💰  Koliko trojiš godišnje — do dinara',
            '🛠️  Personalizovana strategija za prestanak',
          ].map(item => (
            <div key={item} style={{ fontSize: 15, lineHeight: 1.5, marginBottom: 10 }}>
              {item}
            </div>
          ))}
        </div>

        <div className="animate-slide-up delay-400">
          <button className="btn-primary" onClick={onStart}>
            Počni quiz →
          </button>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12, textAlign: 'center' }}>
            Nema registracije. Rezultati za 3 minuta.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── QUESTION ────────────────────────────────────────────────────────────────
function QuestionScreen({
  questionIndex,
  total,
  answers,
  onAnswer,
  onBack,
}: {
  questionIndex: number;
  total: number;
  answers: Record<string, string>;
  onAnswer: (qId: string, optionId: string) => void;
  onBack: () => void;
}) {
  const question = questions[questionIndex];
  const selected = answers[question.id];
  const progress = (questionIndex / total) * 100;
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 20px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ paddingTop: 20, paddingBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button className="btn-back" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Nazad
          </button>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)' }}>
            {questionIndex + 1} / {total}
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div key={questionIndex} className="animate-slide-in" style={{ flex: 1 }}>
        <div style={{ marginBottom: 8 }}>
          <span className="category-pill">
            {CATEGORY_ICONS[question.category]} {CATEGORY_LABELS[question.category]}
          </span>
        </div>

        <h2 style={{
          fontSize: 26, fontWeight: 800, lineHeight: 1.25,
          letterSpacing: '-0.025em', marginTop: 16, marginBottom: question.subtitle ? 8 : 28,
        }}>
          {question.question}
        </h2>

        {question.subtitle && (
          <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
            {question.subtitle}
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {question.options?.map((opt, i) => (
            <button
              key={opt.id}
              className={`option-card ${selected === opt.id ? 'selected' : ''}`}
              onClick={() => onAnswer(question.id, opt.id)}
            >
              <div className="option-letter">{letters[i]}</div>
              <span style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.4 }}>{opt.label}</span>
              {selected === opt.id && (
                <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="10" fill="var(--orange)"/>
                  <path d="M6 10L8.5 12.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ paddingBottom: 32, paddingTop: 24 }}>
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

// ─── PARTIAL REVEAL ───────────────────────────────────────────────────────────
function PartialReveal({ results, onContinue }: { results: QuizResults; onContinue: () => void }) {
  const profile = profileDescriptions[results.smokingProfile];
  const levelColors: Record<string, string> = {
    'Niska': '#2D8A4E', 'Umerena': '#BA7517', 'Visoka': '#E8621A', 'Vrlo visoka': '#C0392B',
  };
  const color = levelColors[results.fagerstromLevel];
  const pct = (results.fagerstromScore / 6) * 100;

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 20px 40px' }}>
      <div style={{ paddingTop: 48, textAlign: 'center' }}>
        <div className="animate-scale-in" style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
        <h2 className="animate-slide-up" style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 8 }}>
          Evo deo rezultata
        </h2>
        <p className="animate-slide-up delay-100" style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 36 }}>
          Kompletan izveštaj čeka — odmah.
        </p>
      </div>

      <div className="animate-slide-up delay-100 result-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--orange-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>💭</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Tvoj profil</div>
            <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--orange)' }}>{results.smokingProfile}</div>
          </div>
        </div>
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65 }}>{profile.description}</p>
      </div>

      <div className="animate-slide-up delay-200 result-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F0F7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🧠</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Fagerstrom skor</div>
            <div style={{ fontWeight: 800, fontSize: 18, color }}>{results.fagerstromScore} / 6 — {results.fagerstromLevel} zavisnost</div>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>

      {/* Locked teaser */}
      <div className="animate-slide-up delay-300" style={{
        background: 'var(--card)', borderRadius: 20, padding: 24,
        border: '2px dashed var(--border)', marginBottom: 28, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, backdropFilter: 'blur(4px)',
          background: 'rgba(247,246,243,0.7)', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          zIndex: 2, borderRadius: 18,
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>Još 3 rezultata čekaju</div>
          <div style={{ fontSize: 14, color: 'var(--muted)' }}>Ostavi email da odblokiraš</div>
        </div>
        <div style={{ opacity: 0.2 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>💰 Godišnji trošak</div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>?????? RSD</div>
          <div style={{ marginTop: 12, fontWeight: 700 }}>🛠️ Tvoja strategija</div>
          <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4 }}>Personalizovani plan za tvoj profil...</div>
          <div style={{ marginTop: 12, fontWeight: 700 }}>📅 Datum prestanka</div>
        </div>
      </div>

      <div className="animate-slide-up delay-400">
        <button className="btn-primary" onClick={onContinue}>
          Odblokirati kompletan izveštaj →
        </button>
      </div>
    </div>
  );
}

// ─── EMAIL GATE ───────────────────────────────────────────────────────────────
function EmailGate({ onSubmit, loading }: { onSubmit: (email: string) => void; loading: boolean }) {
  const [email, setEmail] = useState('');
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 20px' }}>
      <div style={{ paddingTop: 64, textAlign: 'center', marginBottom: 40 }}>
        <div className="animate-scale-in" style={{ fontSize: 52, marginBottom: 20 }}>📩</div>
        <h2 className="animate-slide-up" style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 12 }}>
          Pošalji mi kompletan<br />izveštaj
        </h2>
        <p className="animate-slide-up delay-100" style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.6 }}>
          Dobićeš: tačan trošak u RSD, strategiju za tvoj profil, preporučeni datum prestanka i poziciju na Iskra Club listi.
        </p>
      </div>

      <div className="animate-slide-up delay-200" style={{ marginBottom: 16 }}>
        <input
          type="email"
          placeholder="tvoj@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && isValid && !loading && onSubmit(email)}
          autoFocus
        />
      </div>

      <div className="animate-slide-up delay-300" style={{ marginBottom: 24 }}>
        <button className="btn-primary" disabled={!isValid || loading} onClick={() => onSubmit(email)}>
          {loading ? 'Šaljem...' : 'Vidi kompletan izveštaj →'}
        </button>
      </div>

      <div className="animate-fade-in delay-400" style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
          🔒 Nikad spam. Samo tvoji rezultati i obaveštenje kad Iskra izađe.
        </p>
      </div>

      <div className="animate-slide-up delay-400" style={{
        display: 'flex', justifyContent: 'center', gap: 24, marginTop: 32,
        paddingTop: 24, borderTop: '1px solid var(--border)',
      }}>
        {['✅ Besplatno', '🚫 Bez spama', '🔒 Privatno'].map(item => (
          <span key={item} style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

// ─── RESULTS ─────────────────────────────────────────────────────────────────
function ResultsScreen({ results, email }: { results: QuizResults; email: string }) {
  const profile = profileDescriptions[results.smokingProfile];
  const levelColors: Record<string, string> = {
    'Niska': '#2D8A4E', 'Umerena': '#BA7517', 'Visoka': '#E8621A', 'Vrlo visoka': '#C0392B',
  };
  const color = levelColors[results.fagerstromLevel];
  const pct = (results.fagerstromScore / 6) * 100;

  const equivalents = [
    { label: 'letovanja u Grčkoj', calc: Math.floor(results.annualCostRSD / 80000) },
    { label: 'obroka u kafani', calc: Math.floor(results.annualCostRSD / 1200) },
    { label: 'meseci Netflix-a', calc: Math.floor(results.annualCostRSD / 800) },
  ].filter(e => e.calc > 0);

  const daysUntil = results.readinessScore >= 4 ? 7 : 30;
  const quitDate = new Date();
  quitDate.setDate(quitDate.getDate() + daysUntil);
  const quitDateStr = quitDate.toLocaleDateString('sr-RS', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 20px 60px' }}>
      <div style={{ paddingTop: 48, textAlign: 'center', marginBottom: 36 }}>
        <div className="animate-scale-in" style={{ fontSize: 52, marginBottom: 16 }}>🔥</div>
        <h2 className="animate-slide-up" style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 8 }}>
          Tvoj kompletan izveštaj
        </h2>
        <p className="animate-slide-up delay-100" style={{ color: 'var(--muted)', fontSize: 14 }}>
          Poslali smo kopiju na {email}
        </p>
      </div>

      {/* Profile */}
      <div className="animate-slide-up delay-100 result-card" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--orange-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>💭</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Profil pušača</div>
            <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--orange)' }}>{results.smokingProfile}</div>
          </div>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.65, marginBottom: 14 }}>{profile.description}</p>
        <div style={{ background: 'var(--orange-pale)', borderRadius: 12, padding: '14px 16px', borderLeft: '3px solid var(--orange)' }}>
          <p style={{ fontSize: 14, lineHeight: 1.65, fontWeight: 500 }}>{profile.strategy}</p>
        </div>
      </div>

      {/* Fagerstrom */}
      <div className="animate-slide-up delay-200 result-card" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>Fagerstrom skor</div>
            <div style={{ fontWeight: 800, fontSize: 24, color, letterSpacing: '-0.02em' }}>{results.fagerstromScore} / 6</div>
          </div>
          <div style={{ background: color + '18', borderRadius: 12, padding: '8px 14px', color, fontWeight: 800, fontSize: 14 }}>
            {results.fagerstromLevel} zavisnost
          </div>
        </div>
        <div className="progress-bar" style={{ marginBottom: 10 }}>
          <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
          Klinički validiran test. Skor 0–2: niska, 3–4: umerena, 5–6: visoka nikotinska zavisnost.
        </p>
      </div>

      {/* Financial */}
      <div className="animate-slide-up delay-300 result-card" style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 16 }}>Finansijski trošak</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div style={{ background: '#F0FFF4', borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 12, color: '#2D8A4E', fontWeight: 700, marginBottom: 6 }}>Godišnje</div>
            <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em' }}>{results.annualCostRSD.toLocaleString('sr-RS')}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>RSD</div>
          </div>
          <div style={{ background: '#FFF8F0', borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 700, marginBottom: 6 }}>Za 5 godina</div>
            <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em' }}>{results.fiveYearCostRSD.toLocaleString('sr-RS')}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>RSD</div>
          </div>
        </div>
        {equivalents.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
            <p style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>To je ekvivalent</p>
            {equivalents.map(eq => (
              <div key={eq.label} style={{ fontSize: 14, marginBottom: 4, fontWeight: 500 }}>
                → <strong>{eq.calc}</strong> {eq.label} godišnje
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quit date */}
      <div className="animate-slide-up delay-400 result-card" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#FFF0F3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📅</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>Preporučeni datum prestanka</div>
            <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em' }}>{quitDateStr}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>Za {daysUntil} dana — daj sebi vreme da se pripremiš</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="animate-slide-up" style={{ background: 'var(--orange)', borderRadius: 20, padding: 28, textAlign: 'center', marginTop: 8, marginBottom: 24 }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🔥</div>
        <h3 style={{ color: 'white', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', marginBottom: 10 }}>
          Iskra dolazi uskoro
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>
          Prijavljen/a si na Iskra Club listu. Bićeš prvi/a koji dobija pristup kada app izađe.
        </p>
        <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: '12px 20px', display: 'inline-block', color: 'white', fontWeight: 700, fontSize: 14 }}>
          ✅ Na listi si — čekaj obaveštenje
        </div>
      </div>

      {/* Share */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>Podeli sa nekim ko bi trebalo da vidi ovo</p>
        <button
          className="btn-primary"
          style={{ width: 'auto', padding: '14px 28px', fontSize: 14 }}
          onClick={() => {
            const text = `Upravo sam uradio/la Iskra quiz o pušenju. Fascinantno tačno. Probaj: quiz.iskraclub.rs`;
            if (navigator.share) {
              navigator.share({ text, url: window.location.href });
            } else {
              navigator.clipboard.writeText(text).then(() => alert('Link kopiran!'));
            }
          }}
        >
          Podeli rezultate 🔥
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
  const [emailLoading, setEmailLoading] = useState(false);

  const total = questions.length;

  const handleAnswer = useCallback((qId: string, optionId: string) => {
    const newAnswers = { ...answers, [qId]: optionId };
    setAnswers(newAnswers);

    if (questionIndex < total - 1) {
      setTimeout(() => setQuestionIndex(i => i + 1), 200);
    } else {
      const calc = calculateResults(newAnswers);
      setResults(calc);
      setTimeout(() => setStage('partial'), 200);
    }
  }, [answers, questionIndex, total]);

  const handleBack = useCallback(() => {
    if (questionIndex > 0) setQuestionIndex(i => i - 1);
    else setStage('intro');
  }, [questionIndex]);

  const handleEmailSubmit = async (emailVal: string) => {
    setEmail(emailVal);
    setEmailLoading(true);
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailVal, results }),
      });
    } catch { /* continue */ }
    setEmailLoading(false);
    setStage('results');
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stage, questionIndex]);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ height: 3, background: 'var(--orange)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }} />

      {stage === 'intro' && <IntroScreen onStart={() => setStage('quiz')} />}
      {stage === 'quiz' && (
        <QuestionScreen
          questionIndex={questionIndex}
          total={total}
          answers={answers}
          onAnswer={handleAnswer}
          onBack={handleBack}
        />
      )}
      {stage === 'partial' && results && <PartialReveal results={results} onContinue={() => setStage('email')} />}
      {stage === 'email' && <EmailGate onSubmit={handleEmailSubmit} loading={emailLoading} />}
      {stage === 'results' && results && <ResultsScreen results={results} email={email} />}
    </main>
  );
}
