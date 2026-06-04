# Iskra App — Claude Code Context

## What this is
A Next.js 14 (App Router) quiz app for **Iskra Club**, a smoking cessation product targeting Serbian-speaking markets. The quiz is a lead-gen and waitlist tool — users complete it, gate their full results behind an email, and get added to the Iskra Club early access list.

## Stack
- **Framework**: Next.js 14 (App Router, `src/` directory)
- **Language**: TypeScript
- **Styling**: Custom CSS variables in `globals.css` + Tailwind (utility classes available but used sparingly)
- **Font**: Manrope (Google Fonts, weights 300–800)
- **Deployment**: Vercel

## Key files
| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Full quiz UI — all stages in one file (Intro, Questions, Partial reveal, Email gate, Results) |
| `src/lib/quiz-data.ts` | All 15 questions, scoring logic, profile descriptions |
| `src/app/api/subscribe/route.ts` | Email capture endpoint (currently logs to console — email provider not wired yet) |
| `src/app/globals.css` | Design system: CSS variables, component classes, animations |
| `src/app/layout.tsx` | Root layout, metadata, OG tags |

## Design system (globals.css)
All styling uses CSS custom properties. Key tokens:

**Brand colour — "ember"**
- `--ember: #E8621A` — primary CTA, selected states, accents
- `--ember-grad: linear-gradient(180deg, #F0701F 0%, #E8621A 100%)` — buttons, selected option cards
- `--ember-tint: #FEF0E8` — pale backgrounds, category pills
- `--ember-soft: #FBEAE0`
- `--shadow-ember: 0 8px 20px rgba(232,98,26,0.28)` — button shadow

**Surfaces**
- `--bg: #FDFCFA` — page background
- `--card: #FFFFFF` — card backgrounds
- `--border: #ECE9E3` — default borders
- `--faint: #F1EDE6` — option letter chips, subtle fills

**Text**
- `--text: #1A1A1A` — primary
- `--text-sub / --muted: #999999` — secondary
- `--body-text: #555555`

**Radii**
- `--r-btn: 16px`, `--r-card: 18px`, `--r-card-lg: 20px`, `--r-pill: 999px`

**Component classes**
- `.btn-primary` — ember gradient button, full-width, with hover lift and ember shadow
- `.btn-back` — ghost back button
- `.option-card` — answer option; `.selected` state inverts to ember gradient with white text
- `.option-letter` — A/B/C/D chip inside option cards; inverts to white/ember when selected
- `.progress-bar` / `.progress-fill` — 3px thin progress indicator
- `.category-pill` — uppercase eyebrow label with ember tint background
- `.result-card` — white card with border and shadow for results sections
- `.isk-eyebrow` — 11px uppercase label, ember colour

**Animations**
- `.animate-slide-up`, `.animate-slide-in`, `.animate-fade-in`, `.animate-scale-in`
- Delays: `.delay-100` through `.delay-500` (0.08s increments)

## Quiz flow (updated — richer engagement pattern)
```
intro → quiz (15 questions, with 2 mid-quiz feedback screens) → loading screen → partial (shows profile + Fagerstrom, locks rest) → email gate → results (full unlock + Iskra app teaser)
```

Stage type: `'intro' | 'quiz' | 'feedback' | 'loading' | 'partial' | 'email' | 'results'`

### Mid-quiz feedback screens
Two interstitial feedback screens appear during the quiz on an ember gradient background (`var(--ember-grad)`) — white text on orange, contrasting with the white question cards. They are NOT blockers — they feel like rewards. Trigger them by question index, not category.

**Feedback 1** — after Q3 (pattern block complete):
- Eyebrow: "TVOJ OBRAZAC"
- Show cigarettes/year stat calculated from their Q1 answer
- One sharp fact, e.g. "Jutarnji pušači imaju duplo veću hemijsku zavisnost od večernjih."
- CTA: "Nastavi →"

**Feedback 2** — after Q7 (Fagerstrom block complete):
- Eyebrow: "ZAVISNOST OD NIKOTINA"
- Reveal partial Fagerstrom tier (Niska / Umerena / Visoka) with one-line clinical note
- Tease: "Sledeći blok otkriva psihološku stranu — zašto te cigareta drži, ne samo hemija."
- CTA: "Nastavi →"

### Loading screen (after Q15, before partial reveal)
Inspired by Liven's "Creating your Neurobalance Protocol" pattern. Key elements:
- Personalised headline using their answers: **"Kreiramo tvoj plan prestanka"** with a subline using profile data e.g. "za [Stresnog pušača] · [X] cigareta dnevno"
- 3–4 named progress bars that fill sequentially (not simultaneously):
  1. "Obrazac pušenja" → completes instantly ✓
  2. "Fagerstrom analiza" → fills to 100% ✓  
  3. "Psihološki profil" → fills to 100% ✓
  4. "Personalizovana strategija" → fills last
- Below the bars: rotating quick facts (swap every ~2s) instead of testimonials:
  - "Pušači u proseku pokušaju 8–10 puta pre nego što uspešno prestanu."
  - "Prva 3 dana su najteža — nikotin napušta telo za 72h."
  - "Personalizovani planovi povećavaju šanse za uspeh za 3×."
  - "Iskra prepoznaje tvoj tip i prilagođava strategiju automatski."
- **Mid-load commitment modal** — appears when bar 3 completes (~2.5s in):
  - Modal over blur: "Jesi li spreman/na da ozbiljno kreneš?"
  - Two buttons: **"Da, spreman/na sam"** / "Još razmišljam"
  - Both buttons continue — this is not a blocker, it's a micro-commitment trigger (Cialdini principle). Store the answer in state for potential use in results copy.
- Total loading duration: ~4–5 seconds

### Results screen (after email gate)
Four result cards (same as before), then:

**Iskra app teaser — section woven into results (not bolted at end):**

*After the quit date card:*
- Section titled "Šta Iskra radi za tvoj profil" 
- 3 feature pills with lock icons: "Dnevni check-in" · "Trigger tracker" · "Quit coach AI"
- One sentence: "Iskra prepoznaje [SmokingProfile] i prilagođava program svakog dana."
- Badge: "Dolazi uskoro 🔥"

*Bottom of page (after share button):*
- Ember-background waitlist confirmation card
- "Na listi si. Bićeš prvi/a koji dobija pristup."

## Quiz content (Serbian)
All copy is in Serbian (Latin script). Categories:
- `pattern` — smoking pattern (3 questions)
- `fagerstrom` — Fagerström nicotine dependence test (4 questions, clinically validated)
- `health` — health symptoms (3 questions)
- `psychological` — psychological profile (4 questions)
- `readiness` — quit readiness (3 questions... wait, only r1–r3 = 3 questions but q1+q2 pattern + f1–f4 fagerstrom + h1–h3 health + p1–p4 psychological + r1–r3 readiness = 3+4+3+4+3 = 17 total IDs, displayed as 15)

## Scoring
- **Fagerstrom score**: sum of f1–f4 option values (0–6). Levels: 0–2 Niska, 3–4 Umerena, 5–6 Visoka
- **Smoking profile**: derived from p1 answer → Stresni pušač / Socijalni pušač / Pušač iz navike / Mešoviti profil
- **Financial**: hardcoded 15 cigs/day, 450 RSD/pack, 20 cigs/pack (not yet personalised from q1)
- **Readiness score**: sum of r1+r2 values (0–6)

## Email API (`/api/subscribe`)
Currently logs to console only. TODOs in the file:
- Wire up Resend (or other provider) for transactional email
- Wire up Supabase/Airtable for waitlist storage
- `RESEND_API_KEY` env var expected when Resend is added

## Known gaps / TODOs
- **[P0] Financial calculation** uses hardcoded 15 cigs/day — must use Q1 answer value (q1 option values: a=3, b=8, c=15, d=25 cigarettes — map these in calculateResults)
- **[P0] New stages to implement**: `'feedback'` and `'loading'` stages — see "Quiz flow" section above for full spec
- **[P0] Commitment modal** — mid-loading screen popup, store result in state as `committed: boolean`
- Email provider not integrated (Resend recommended)
- Waitlist DB not integrated (Supabase recommended)
- No analytics/tracking yet
- Share text references `quiz.iskraclub.rs` (hardcoded URL)
- Fagerstrom max is scored as /6 but actual Fagerström scale is 0–10 (simplified version used here)

## Conventions
- All inline styles use CSS variables (`var(--ember)`, etc.) — do not introduce raw hex values
- Component structure: each quiz stage is a separate function component in `page.tsx`
- No external UI library — everything is hand-rolled with the design system
- Animations trigger on mount via CSS classes, not JS
