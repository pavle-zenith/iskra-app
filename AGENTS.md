# Iskra App — Agent Context

This file mirrors CLAUDE.md for agents that read AGENTS.md instead of CLAUDE.md. See CLAUDE.md for full context.

## TL;DR
- **Product**: Iskra Club — smoking cessation quiz app, Serbian market
- **Stack**: Next.js 14 App Router, TypeScript, custom CSS design system, Vercel deployment
- **Purpose**: Lead-gen quiz that gates full results behind email capture → builds waitlist

## Critical design rules
1. All colours via CSS variables — never hardcode hex. Variables live in `src/app/globals.css`.
2. Primary brand colour is **ember** (`--ember: #E8621A`). Buttons and selected states use `--ember-grad`.
3. Component classes (`.btn-primary`, `.option-card`, `.result-card`, etc.) are defined in `globals.css` — use them, don't reinvent.
4. All copy is in **Serbian (Latin script)** — keep it that way.
5. The app is mobile-first, max-width 480px containers.

## File map
- `src/app/page.tsx` — all UI (5 stage components + main orchestrator)
- `src/lib/quiz-data.ts` — questions array, `calculateResults()`, `profileDescriptions`
- `src/app/api/subscribe/route.ts` — POST endpoint for email capture
- `src/app/globals.css` — full design system (tokens, components, animations)
- `src/app/layout.tsx` — metadata + root layout

## Implemented (all done)
- Gender + pack price onboarding before quiz
- FeedbackScreen (ember gradient) after Q3 and Q7
- LoadingScreen: sequential bars, rotating facts, commitment modal
- `committed` state tracked and sent to API
- Financial calc uses Q1 answer (a=3, b=8, c=15, d=25 cigs) + onboarding pack price
- PromoScreen (Iskra app teaser + animated mockup iframe)
- ResultsScreen: 6 result cards, Iskra teaser card, waitlist card, FAQ accordion, socials, share
- Gender-aware copy throughout (isMale = gender !== 'žensko')
- Supabase integration: `quiz_submissions` table, upsert on email, uses SERVICE_ROLE_KEY
- Resend integration: confirmation email sent on quiz completion, includes profile + Fagerstrom + annual cost
- Copy rewrite: human tone, proper M/F Serbian grammar variants

## Active TODOs
- Add analytics/tracking (none currently)
- Email confirmation copy is male-only ("Dobio si", "završio") — gender not passed to API yet
- Consider passing `gender` in the subscribe POST body so email footer can be gender-aware

## Current quiz flow
```
intro → onboarding (gender + pack price) → quiz → [feedback Q3] → quiz → [feedback Q7] → quiz → loading → partial → email → promo → results
```

## Cowork context
This repo is also open in Cowork (Claude desktop). Cowork handles design, context docs, and planning. Claude Code handles implementation. Coordinate via CLAUDE.md — keep it updated when architecture changes.
