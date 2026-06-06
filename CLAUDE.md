# Iskra App — Claude Code Context

## What this is
A Next.js 14 (App Router) quiz app for **Iskra Club**, a smoking cessation product targeting Serbian-speaking markets. The quiz is a lead-gen and waitlist tool — users complete it, gate their full results behind an email, and get added to the Iskra Club early access list. Live at **quiz.iskraclub.com**.

## Stack
- **Framework**: Next.js 14 (App Router, `src/` directory)
- **Language**: TypeScript
- **Styling**: Custom CSS variables in `globals.css` + Tailwind (utility classes available but used sparingly)
- **Font**: Manrope (Google Fonts, weights 300–800)
- **Deployment**: Vercel (project: `iskra-app`, team: `pavle-zenith-s-projects`)
- **Database**: Supabase — `quiz_submissions` table (project: `aaknvhlirztdglxsnbho`)
- **Email**: Resend — sends confirmation on submit from `iskra@iskraclub.com`
- **Analytics**: PostHog (project 457365, org: ZENITH DIGITAL) — client + server side

## Key files
| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Full quiz UI — all stages in one component file |
| `src/lib/quiz-data.ts` | All 15 questions, scoring logic, profile descriptions, `calculateDriverBreakdown`, `calculateReadinessScore` |
| `src/app/api/subscribe/route.ts` | Email capture — writes to Supabase, sends Resend email, fires PostHog server-side event |
| `src/lib/posthog-server.ts` | PostHog Node client for server-side capture |
| `instrumentation-client.ts` | PostHog browser SDK init (via `/ingest` proxy) |
| `src/app/globals.css` | Design system: CSS variables, component classes, animations |
| `src/app/layout.tsx` | Root layout, metadata, OG tags, `<link rel="preload">` for all images + mockup HTML |

## Environment variables (Vercel + .env.local)
```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY        # use this, not anon key — bypasses RLS
SUPABASE_ANON_KEY
RESEND_API_KEY
RESEND_FROM_EMAIL=iskra@iskraclub.com
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

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

## Quiz flow (fully implemented)
```
intro → onboarding (gender + pack price) → quiz → [feedback after Q3] → quiz → [feedback after Q7] → quiz → [health reflection after Q10] → quiz → loading (sequential bars + commitment modal) → partial → email → promo (Iskra app teaser) → results
```

Stage type: `'intro' | 'onboarding' | 'quiz' | 'feedback' | 'health' | 'loading' | 'partial' | 'email' | 'promo' | 'results'`

**Fixed-height stages** (no scroll): `onboarding`, `quiz`, `feedback`, `health`, `loading` — `<main>` gets `height: 100dvh; overflow: hidden` on these. The intro uses `minHeight: 100dvh`. Scrollable stages: `partial`, `email`, `promo`, `results`.

### IntroScreen
- White base + canyon texture overlay (`opacity: 0.06, mixBlendMode: 'luminosity', saturate(0)`)
- Logo: `iskra-logo.png` in 52×52 square card (`objectFit: 'cover'`, `overflow: hidden`)
- Short paragraph instead of bullet list
- Social proof: full-width option-card-style pill with green verified checkmark, count auto-increments by 6–7 after random 2–6s delay
- `SOCIAL_PROOF` config object — update `completionCount` to change the number (stored as string with dot separator e.g. `'2.341'`)
- Nav wordmark: **ISKRA** (all caps) in all nav bars throughout the quiz

### OnboardingScreen (2 steps)
- Step 1: Gender — two large image cards (`iskra-man.png` / `iskra-woman.png`), advances on tap
- Step 2: Pack price — stepper counter + quick-select chips (300/400/450/500/600 RSD)
- On complete: fires `posthog.identify` + `quiz_started` event

### Mid-quiz feedback screens
Ember gradient bg with canyon texture — white text on orange. Not blockers, feel like rewards.

**Feedback 1** (after Q3 — pattern block): cigarettes/year stat from Q1 answer, sharp fact about morning smokers.

**Feedback 2** (after Q7 — Fagerstrom block): partial Fagerstrom tier reveal (Niska/Umerena/Visoka) with clinical note.

**Health reflection** (after Q10): white bg, IcoHeart icon, transitions to psychological questions.

### LoadingScreen (after Q15)
- Sequential progress bars (4 total, fill one at a time)
- Rotating facts every 2.5s
- Mid-load commitment modal (blur overlay) when bar 3 completes — "Da, spreman/na sam" vs "Još nisam siguran/na"
- Both choices continue (Cialdini micro-commitment). `committed` boolean stored in state, sent to Supabase + PostHog.

### PartialReveal
- Driver breakdown chart (animated horizontal bars, sorted by %)
- Fagerstrom score card
- Cigarettes/year stat
- Personalized insight (rules engine: stress≥40%, habit≥35%, social≥35%, fagerstrom≥5, fallback)
- Locked card (blurred) with CTA to unlock via email

### EmailGate
- Gender-aware headline (M/F Serbian grammar)
- Name + email fields
- Social proof line from `SOCIAL_PROOF` config

### PromoScreen ("Future You")
- Animated mockup iframe (`/iskra-animated-mockup.html`) — preloaded via `<link rel="preload" as="document">`
- iframe `onLoad` injects CSS to hide `#ui`/`#hint`, applies ember gradient + canyon texture to body
- Feature cards, stats strip, social proof block, CTA to results

### ResultsScreen
7 cards in order:
1. Driver Breakdown (animated bars)
2. Fagerstrom score
3. Financial cost (annual + 5-year, equivalents)
4. Readiness Score (0–100, color-coded)
5. Smoking Profile + strategy
6. Recommended quit date
7. Iskra app teaser (feature list with lock icons)

Then: ember waitlist confirmation card → FAQ accordion → social links (TikTok: `@iskraclub`, Instagram: `@iskraclub_`) → share button (gendered copy, `navigator.share` with clipboard fallback)

## Scoring
- **Fagerstrom score**: sum of f1–f4 option values (0–6). Levels: 0–2 Niska, 3–4 Umerena, 5–6 Visoka
- **Smoking profile**: derived from p1 answer → Stresni pušač / Socijalni pušač / Pušač iz navike / Mešoviti profil
- **Driver breakdown**: `calculateDriverBreakdown(answers)` — stress/habit/social/nicotine signals, all sum to 100%
- **Readiness score**: `calculateReadinessScore(answers)` — 0–100 from r1, r2, p2, p4
- **Financial**: from Q1 answer map (a=3, b=8, c=15, d=25 cigs/day) × onboarding pack price

## Supabase (`quiz_submissions` table)
Columns: `id`, `email` (unique), `name`, `smoking_profile`, `fagerstrom_score`, `fagerstrom_level`, `annual_cost_rsd`, `five_year_cost_rsd`, `cigarettes_per_day`, `readiness_score`, `committed`, `answers` (jsonb), `gender`, `created_at`

Upsert on `email` conflict. Uses `SUPABASE_SERVICE_ROLE_KEY` (not anon key) to bypass RLS. RLS enabled with insert + update policies (`with check (true)`).

## PostHog analytics
**Client-side events** (fired in `page.tsx`):

| Event | When | Key properties |
|-------|------|----------------|
| `quiz_intro_cta_clicked` | Intro CTA tapped | — |
| `quiz_started` | Onboarding submit | `gender`, `pack_price` |
| `quiz_question_answered` | Each answer | `question_id`, `question_index`, `category`, `answer_value` (numeric) |
| `quiz_feedback_1_seen` | After Q3 | `cigs_per_day` |
| `quiz_feedback_2_seen` | After Q7 | `fagerstrom_score`, `fagerstrom_level` |
| `quiz_loading_started` | After Q15 | — |
| `quiz_commitment_yes` | Modal "Da" | — |
| `quiz_commitment_no` | Modal "Još nisam" | — |
| `quiz_partial_revealed` | Partial stage mount | `smoking_profile`, `fagerstrom_level`, `readiness_score` |
| `quiz_email_gate_seen` | Email stage mount | — |
| `quiz_email_submitted` | Submit clicked | profile, fagerstrom, readiness, committed, gender |
| `quiz_promo_seen` | Promo stage mount | — |
| `quiz_results_seen` | Results stage mount | profile, fagerstrom, annual_cost, readiness, committed |
| `quiz_results_shared` | Share button | `method`, `smoking_profile` |

**Server-side** (fired in `/api/subscribe`):
- `posthog.identify(distinctId, { email, name, gender })`
- `posthog.capture('waitlist_signup_completed', { ...full results })`
- `distinct_id` passed in POST body from client for accurate session merge

Anonymous profile enriched on `quiz_started`: `posthog.identify(posthog.get_distinct_id(), { gender, pack_price })`.

PostHog SDK initialized via `/ingest` proxy (configured in `next.config.ts` rewrites) to avoid ad-blocker interference.

## Preloading
`layout.tsx` preloads all critical assets on page load:
- `/iskra-logo.png`, `/iskra-flame-ember.png`, `/iskra-man.png`, `/iskra-woman.png`, `/canyon-bg.png` — as `image`
- `/iskra-animated-mockup.html` — as `document`

## Gender system
`isMale = gender !== 'žensko'` — null/`'drugo'` default to male forms. Applied throughout all copy. Gender passed to API and stored in Supabase. QuestionScreen has display overrides for f4/p1/p2/p3/p4/r1 questions.

## Conventions
- All inline styles use CSS variables (`var(--ember)`, etc.) — do not introduce raw hex values
- Component structure: each quiz stage is a separate function component in `page.tsx`
- No external UI library — everything is hand-rolled with the design system
- Animations trigger on mount via CSS classes, not JS
- Nav wordmark is always **ISKRA** (all caps)
- No emoji in UI — use SVG icon primitives (`Ico*` components at top of `page.tsx`)
- Supabase and Resend clients must be initialized **inside** the handler function, not at module level (causes build errors when env vars missing at build time)
