import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, results } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Log for now — wire up your email provider here (Resend, Mailchimp, etc.)
    console.log('New quiz submission:', {
      email,
      profile: results?.smokingProfile,
      fagerstrom: results?.fagerstromScore,
      annualCost: results?.annualCostRSD,
      timestamp: new Date().toISOString(),
    });

    // TODO: Add your email provider integration here
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({ from: 'iskra@iskraclub.rs', to: email, ... });

    // TODO: Add to waitlist (Supabase, Airtable, etc.)
    // const supabase = createClient(...);
    // await supabase.from('waitlist').insert({ email, quiz_results: results });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
