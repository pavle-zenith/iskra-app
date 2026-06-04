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

## Active TODOs (priority order)
- **[P0]** Add `'feedback'` and `'loading'` stages to quiz flow — full spec in CLAUDE.md
- **[P0]** Fix financial calc to use Q1 answer (map option IDs → cigarette counts: a=3, b=8, c=15, d=25)
- **[P0]** Commitment modal mid-loading screen — stores `committed: boolean` in state
- Wire Resend for transactional email in `/api/subscribe`
- Wire Supabase (or Airtable) for waitlist persistence
- Add analytics (no tracking currently)

## New quiz flow
```
intro → quiz → [feedback after Q3] → quiz → [feedback after Q7] → quiz → loading (4–5s, named bars, commitment modal) → partial → email → results (+ Iskra teaser sections)
```
See CLAUDE.md "Quiz flow" section for full copy, timing, and component spec.

## Cowork context
This repo is also open in Cowork (Claude desktop). Cowork handles design, context docs, and planning. Claude Code handles implementation. Coordinate via CLAUDE.md — keep it updated when architecture changes.
