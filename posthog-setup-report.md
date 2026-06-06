<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Iskra quiz app. Here is a summary of all changes made:

**New files created:**
- `instrumentation-client.ts` — Client-side PostHog initialization using Next.js 15.3+ instrumentation pattern. Enables autocapture, session replay, and exception tracking via `capture_exceptions: true`. Routes all events through the `/ingest` reverse proxy.
- `src/lib/posthog-server.ts` — Singleton `posthog-node` client for server-side event capture in API routes.
- `next.config.ts` — Added reverse proxy rewrites for `/ingest/*` and `/ingest/static/*` + `/ingest/array/*` (assets) to avoid adblocker interference.
- `.env.local` — `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` set securely.

**Files edited:**
- `src/app/page.tsx` — Added `import posthog from 'posthog-js'` and 10 `posthog.capture()` calls covering every stage of the quiz flow, plus `posthog.identify()` on email submission.
- `src/app/api/subscribe/route.ts` — Added `posthog-node` server-side capture for `waitlist_signup_completed` and server-side `identify()` using the distinct ID passed from the client via `X-POSTHOG-DISTINCT-ID` header.

**User identification:** When a user submits their email, `posthog.identify(email, { name, email, gender })` is called client-side, and the same identify + capture is made server-side using the client's distinct ID — ensuring all anonymous quiz events are linked to the known user in PostHog.

---

## Event tracking table

| Event | Description | File |
|-------|-------------|------|
| `quiz_started` | User clicks the main CTA on the intro screen | `src/app/page.tsx` |
| `onboarding_completed` | User completes gender + pack price onboarding | `src/app/page.tsx` |
| `quiz_question_answered` | User answers a quiz question (includes question_id, category, option) | `src/app/page.tsx` |
| `quiz_feedback_viewed` | Mid-quiz interstitial shown (after Q3: pattern, after Q7: Fagerstrom) | `src/app/page.tsx` |
| `quiz_commitment_responded` | User responds to the loading screen commitment modal | `src/app/page.tsx` |
| `quiz_partial_results_viewed` | User reaches the partial results reveal screen | `src/app/page.tsx` |
| `quiz_email_gate_viewed` | User clicks through to the email gate | `src/app/page.tsx` |
| `quiz_email_submitted` | User submits name + email (triggers identify) | `src/app/page.tsx` |
| `quiz_results_viewed` | User reaches the full results screen | `src/app/page.tsx` |
| `quiz_results_shared` | User clicks the share button | `src/app/page.tsx` |
| `waitlist_signup_completed` | Server-side: email + results stored in Supabase | `src/app/api/subscribe/route.ts` |

---

## Next steps

We've built a dashboard and 5 insights to track user behavior:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/457365/dashboard/1678479)
- [Quiz Conversion Funnel](https://us.posthog.com/project/457365/insights/RT69THuq) — Full 4-step funnel: quiz start → onboarding → email gate → results
- [Daily Quiz Starters](https://us.posthog.com/project/457365/insights/0e6hyPJp) — Unique users beginning the quiz per day
- [Email Capture Rate](https://us.posthog.com/project/457365/insights/KcJrvsdp) — % of starters who submit their email (A/B formula)
- [Waitlist Signups Over Time](https://us.posthog.com/project/457365/insights/7XPU9gal) — Server-confirmed Supabase waitlist entries
- [Commitment & Share Engagement](https://us.posthog.com/project/457365/insights/Lyz8kQHf) — Commitment modal responses vs result shares

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
