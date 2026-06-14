import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getPostHogClient } from '@/lib/posthog-server';
import { buildResultsEmail } from '@/lib/results-email';

// Base offset so the Early Access position reads in line with the social-proof
// count shown in the quiz (SOCIAL_PROOF.completionCount in page.tsx).
const WAITLIST_BASE = 2341;

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const resend = new Resend(process.env.RESEND_API_KEY);
  const posthog = getPostHogClient();
  try {
    const body = await req.json();
    const { email, name, results, committed, gender, distinct_id } = body;
    const distinctId = distinct_id || email;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // 1. Store in Supabase (upsert — duplicate emails overwrite with latest results)
    const { error: dbError } = await supabase
      .from('quiz_submissions')
      .upsert({
        email,
        name:               name                       ?? null,
        smoking_profile:    results?.smokingProfile    ?? null,
        fagerstrom_score:   results?.fagerstromScore   ?? null,
        fagerstrom_level:   results?.fagerstromLevel   ?? null,
        annual_cost_rsd:    results?.annualCostRSD     ?? null,
        five_year_cost_rsd: results?.fiveYearCostRSD   ?? null,
        cigarettes_per_day: results?.cigarettesPerDay  ?? null,
        readiness_score:    results?.readinessScore    ?? null,
        committed:          committed                  ?? null,
        answers:            results?.answers           ?? null,
        gender:             gender                     ?? null,
      }, { onConflict: 'email' });

    if (dbError) {
      console.error('Supabase error:', dbError);
      // Don't block — still send email
    } else {
      posthog.identify({
        distinctId,
        properties: { email, name, gender },
      });
      posthog.capture({
        distinctId,
        event: 'waitlist_signup_completed',
        properties: {
          email,
          name,
          gender,
          smoking_profile: results?.smokingProfile ?? null,
          fagerstrom_score: results?.fagerstromScore ?? null,
          fagerstrom_level: results?.fagerstromLevel ?? null,
          annual_cost_rsd: results?.annualCostRSD ?? null,
          readiness_score: results?.readinessScore ?? null,
          committed: committed ?? null,
        },
      });
    }

    // 2. Send confirmation email via Resend — full branded results report.
    if (results) {
      // Derive Early Access position from the waitlist size (best-effort).
      let waitlistPosition: number | null = null;
      try {
        const { count } = await supabase
          .from('quiz_submissions')
          .select('*', { count: 'exact', head: true });
        if (typeof count === 'number') waitlistPosition = WAITLIST_BASE + count;
      } catch {
        /* non-fatal — email still sends without a position line */
      }

      const { subject, html, text } = buildResultsEmail({
        name,
        gender,
        results,
        committed,
        waitlistPosition,
      });

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'iskra@iskraclub.com',
        to: email,
        subject,
        html,
        text,
      });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('Subscribe error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
