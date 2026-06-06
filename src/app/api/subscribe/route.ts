import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { email, results, committed } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // 1. Store in Supabase (upsert — duplicate emails overwrite with latest results)
    const { error: dbError } = await supabase
      .from('quiz_submissions')
      .upsert({
        email,
        smoking_profile:    results?.smokingProfile    ?? null,
        fagerstrom_score:   results?.fagerstromScore   ?? null,
        fagerstrom_level:   results?.fagerstromLevel   ?? null,
        annual_cost_rsd:    results?.annualCostRSD     ?? null,
        five_year_cost_rsd: results?.fiveYearCostRSD   ?? null,
        cigarettes_per_day: results?.cigarettesPerDay  ?? null,
        readiness_score:    results?.readinessScore    ?? null,
        committed:          committed                  ?? null,
        answers:            results?.answers           ?? null,
      }, { onConflict: 'email' });

    if (dbError) {
      console.error('Supabase error:', dbError);
      // Don't block — still send email
    }

    // 2. Send confirmation email via Resend
    const profile = results?.smokingProfile ?? 'pušač';
    const fagerstromText = results?.fagerstromLevel
      ? `${results.fagerstromScore}/6 — ${results.fagerstromLevel} zavisnost`
      : '';
    const annualCost = results?.annualCostRSD
      ? results.annualCostRSD.toLocaleString('sr-RS') + ' RSD'
      : '';

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'iskra@iskraclub.com',
      to: email,
      subject: 'Tvoj Iskra izveštaj',
      html: `
<!DOCTYPE html>
<html lang="sr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tvoj Iskra izveštaj</title>
</head>
<body style="margin:0;padding:0;background:#FDFCFA;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-block;background:#E8621A;border-radius:14px;padding:10px 20px;">
        <span style="color:white;font-weight:800;font-size:18px;letter-spacing:-0.02em;">iskra</span>
      </div>
    </div>

    <h1 style="font-size:26px;font-weight:800;color:#1A1A1A;letter-spacing:-0.025em;margin:0 0 8px;text-align:center;">
      Tvoj kompletan izveštaj
    </h1>
    <p style="font-size:15px;color:#999;text-align:center;margin:0 0 36px;">
      Evo svega što smo izračunali za tebe.
    </p>

    <div style="background:#FEF0E8;border-radius:16px;padding:20px 24px;margin-bottom:16px;border-left:4px solid #E8621A;">
      <div style="font-size:11px;font-weight:800;color:#E8621A;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:6px;">Profil pušača</div>
      <div style="font-size:20px;font-weight:800;color:#1A1A1A;">${profile}</div>
    </div>

    ${fagerstromText ? `
    <div style="background:#F5F5F5;border-radius:16px;padding:20px 24px;margin-bottom:16px;">
      <div style="font-size:11px;font-weight:800;color:#999;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:6px;">Fagerstrom skor</div>
      <div style="font-size:18px;font-weight:800;color:#1A1A1A;">${fagerstromText}</div>
    </div>
    ` : ''}

    ${annualCost ? `
    <div style="background:#F5F5F5;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
      <div style="font-size:11px;font-weight:800;color:#999;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:6px;">Godišnji trošak</div>
      <div style="font-size:18px;font-weight:800;color:#1A1A1A;">${annualCost}</div>
    </div>
    ` : ''}

    <hr style="border:none;border-top:1px solid #ECE9E3;margin:32px 0;">

    <div style="background:#1A1A1A;border-radius:20px;padding:28px 24px;text-align:center;margin-bottom:32px;">
      <h2 style="color:white;font-size:20px;font-weight:800;letter-spacing:-0.02em;margin:0 0 10px;">
        Iskra dolazi uskoro
      </h2>
      <p style="color:rgba(255,255,255,0.7);font-size:14px;line-height:1.6;margin:0 0 20px;">
        Na Early Access listi si. Bićeš prvi koji dobija pristup i po početnoj ceni koja neće biti dostupna posle lansiranja.
      </p>
      <div style="background:rgba(255,255,255,0.12);border-radius:10px;padding:10px 16px;display:inline-block;color:white;font-weight:700;font-size:13px;">
        Na listi si — čekaj obaveštenje
      </div>
    </div>

    <p style="font-size:12px;color:#BBBBBB;text-align:center;line-height:1.7;margin:0;">
      Dobio si ovaj email jer si završio Iskra quiz na quiz.iskraclub.com.<br>
      Nećemo te spamovati — samo obaveštenje kad app izađe.
    </p>

  </div>
</body>
</html>
      `.trim(),
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('Subscribe error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
