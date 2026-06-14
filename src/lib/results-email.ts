/**
 * Iskra quiz results email.
 *
 * Email-safe (table layout, inline styles, MSO conditionals) rendering of the
 * full quiz report. Adapted from the Iskra brand email design — images are
 * hosted absolute URLs (email clients can't use blob/relative paths) and every
 * value is templated from the real QuizResults so each recipient sees their own
 * dominant driver, profile, Fagerstrom level, cost and Early Access position.
 *
 * Keep all colours on the brand tokens documented in CLAUDE.md / globals.css.
 */

import type { QuizResults, DriverBreakdown } from './quiz-data';

const BASE_URL = 'https://quiz.iskraclub.com';
const IMG = `${BASE_URL}/email`;

type Gender = string | null | undefined;

interface EmailInput {
  name?: string | null;
  gender: Gender;
  results: QuizResults;
  committed?: boolean | null;
  /** Early Access waitlist position, e.g. 2597. Falls back to a copy-only line. */
  waitlistPosition?: number | null;
}

/** Serbian label + accent for each driver key, in the design's voice. */
const DRIVER_META: Record<keyof DriverBreakdown, { label: string }> = {
  stress:   { label: 'STRES I PRITISAK' },
  habit:    { label: 'NAVIKA I RUTINA' },
  social:   { label: 'DRUŠTVO I SITUACIJE' },
  nicotine: { label: 'FIZIČKA ZAVISNOST' },
};

/** Short, lowercase profile name used in the mini-report card. */
const PROFILE_SHORT: Record<string, string> = {
  'Stresni pušač':   'Stres pušač',
  'Socijalni pušač': 'Socijalni pušač',
  'Pušač iz navike': 'Pušač iz navike',
  'Mešoviti profil': 'Mešoviti profil',
};

/** One-line insight tuned to the dominant driver — mirrors the quiz copy voice. */
const DRIVER_INSIGHT: Record<keyof DriverBreakdown, string> = {
  stress:
    'Kod tebe problem nije samo potreba za nikotinom. Cigareta je postala brz odgovor na pritisak, nervozu i trenutak kada želiš kratku pauzu.',
  habit:
    'Kod tebe cigareta je vezana za rutinu. Pališ je na automatskom — uz kafu, posle jela, u pauzi — pre nego što uopšte odlučiš da ti treba.',
  social:
    'Kod tebe cigareta je deo društvenog rituala. Najteže je u društvu, uz piće i u situacijama kada svi oko tebe pale.',
  nicotine:
    'Kod tebe telo je naviklo na nikotin. Razmak između cigareta stvara fizičku nelagodu, pa je poriv jači i dolazi brže.',
};

const rsd = (n: number) => n.toLocaleString('sr-RS');

function topTwoDrivers(bd: DriverBreakdown) {
  const entries = (Object.keys(bd) as (keyof DriverBreakdown)[])
    .map((key) => ({ key, value: bd[key] }))
    .sort((a, b) => b.value - a.value);
  return { primary: entries[0], secondary: entries[1] };
}

export function buildResultsEmail(input: EmailInput): { subject: string; html: string; text: string } {
  const { name, gender, results, committed, waitlistPosition } = input;
  const isMale = gender !== 'žensko';

  const firstName = (name ?? '').trim().split(/\s+/)[0] || '';
  const greeting = firstName ? `ZDRAVO, ${firstName.toUpperCase()}` : 'ZDRAVO';

  const bd = results.driverBreakdown ?? { stress: 25, habit: 25, social: 25, nicotine: 25 };
  const { primary, secondary } = topTwoDrivers(bd);

  const profileShort = PROFILE_SHORT[results.smokingProfile] ?? results.smokingProfile;
  const insight = DRIVER_INSIGHT[primary.key];

  const fagerstromMax = 6; // Fagerstrom skor je 0–6 (f1–f4) — vidi quiz-data.ts
  const annualCost = rsd(results.annualCostRSD);
  const cigsPerYear = rsd(results.cigarettesPerYear);

  // "Future you" projection — 104 days illustrative, savings derived from real daily cost.
  const dailyCost = results.annualCostRSD / 365;
  const demoDays = 104;
  const demoSaved = rsd(Math.round(dailyCost * demoDays));
  const demoCigs = rsd(results.cigarettesPerDay * demoDays);

  // Gender-aware verbs.
  const finishedQuiz = isMale ? 'završio' : 'završila';
  const litVerb = isMale ? 'zapalio' : 'zapalila';
  const firstVerb = isMale ? 'Bićeš prvi koji dobija' : 'Bićeš prva koja dobija';

  const positionLine = waitlistPosition
    ? `<tr>
        <td valign="middle" class="body-font" style="padding-top:16px;font-size:14px;font-weight:600;color:#6B5A4E;">Tvoja pozicija</td>
        <td valign="middle" align="right" class="body-font" style="padding-top:16px;font-size:18px;font-weight:800;color:#E8621A;">#${rsd(waitlistPosition)}</td>
      </tr>`
    : '';

  const resultsUrl = BASE_URL;

  const subject = firstName
    ? `${firstName}, tvoj Iskra izveštaj je spreman`
    : 'Tvoj Iskra izveštaj je spreman';

  // ---- bar widths (clamped so a single-driver result still reads well) ----
  const primaryW = Math.max(8, Math.min(100, primary.value));
  const secondaryW = Math.max(6, Math.min(100, secondary.value));

  const html = `<!DOCTYPE html>
<html lang="sr" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${subject}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
</style>
<!--[if mso]>
<style type="text/css">
  body, table, td, p, a, span, h1, h2, h3 { font-family: Arial, sans-serif !important; }
</style>
<![endif]-->
<style>
  body { margin:0; padding:0; width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; background:#EFE9E1; }
  table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
  img { border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; display:block; }
  a { text-decoration:none; }
  .body-font { font-family:'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
  @media only screen and (max-width:620px){
    .container { width:100% !important; }
    .px { padding-left:24px !important; padding-right:24px !important; }
    .hero-h1 { font-size:27px !important; line-height:1.18 !important; }
    .driver-val { font-size:18px !important; }
    .stat-num { font-size:20px !important; }
    .cta-a { display:block !important; width:100% !important; box-sizing:border-box !important; text-align:center !important; }
    .stack { display:block !important; width:100% !important; }
    .gridcell { display:inline-block !important; width:50% !important; box-sizing:border-box !important; }
  }
</style>
</head>

<body class="body-font" style="margin:0;padding:0;background:#EFE9E1;">

  <!-- Preheader (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#EFE9E1;opacity:0;">
    Tvoj profil, nivo zavisnosti, trošak i prvi konkretan korak nalaze se unutra.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EFE9E1;">
    <tbody><tr>
      <td align="center" style="padding:28px 12px 40px;">

        <!-- ===== EMAIL CONTAINER ===== -->
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;">

          <!-- 1. LOGO + STATUS -->
          <tbody><tr>
            <td class="px" style="padding:8px 40px 22px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tbody><tr>
                  <td align="left" valign="middle">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tbody><tr>
                        <td valign="middle" style="padding-right:10px;">
                          <img src="${IMG}/logo.png" width="30" height="30" alt="Iskra logo" style="border-radius:8px;width:30px;height:30px;">
                        </td>
                        <td valign="middle" class="body-font" style="font-size:16px;font-weight:800;letter-spacing:3px;color:#1A1A1A;">ISKRA</td>
                      </tr>
                    </tbody></table>
                  </td>
                  <td align="right" valign="middle">
                    <span class="body-font" style="display:inline-block;background:#FCE7D6;color:#C9530F;font-size:11px;font-weight:700;letter-spacing:1.4px;padding:7px 13px;border-radius:999px;">TVOJ REZULTAT JE SPREMAN</span>
                  </td>
                </tr>
              </tbody></table>
            </td>
          </tr>

          <!-- MAIN CARD -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:24px;">

                <!-- 2. HERO -->
                <tbody><tr>
                  <td class="px" style="padding:40px 44px 8px;">
                    <p class="body-font" style="margin:0 0 16px;font-size:13px;font-weight:700;letter-spacing:1.6px;color:#C9530F;">${greeting}</p>
                    <h1 class="body-font hero-h1" style="margin:0;font-size:33px;line-height:1.16;font-weight:600;letter-spacing:-0.5px;color:#1A1A1A;">
                      Tvoj rezultat nije samo broj. Pokazuje šta te najčešće vraća cigareti.
                    </h1>
                    <p class="body-font" style="margin:20px 0 0;font-size:16px;line-height:1.6;color:#6B6660;">
                      Na osnovu tvojih odgovora izdvojili smo obrazac koji najviše utiče na to kada i zašto zapališ. Ispod je kratak pregled — kompletan izveštaj smo sačuvali za tebe.
                    </p>
                  </td>
                </tr>

                <!-- 3. MAIN INSIGHT -->
                <tr>
                  <td class="px" style="padding:30px 44px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBF6F1;border:1px solid #F2E4D8;border-radius:18px;">
                      <tbody><tr>
                        <td style="padding:24px 24px 26px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 14px;"><tbody><tr><td valign="middle" style="padding-right:8px;"><img src="${IMG}/flame.png" width="10" height="18" alt="" style="display:block;width:10px;height:18px;"></td><td valign="middle" class="body-font" style="font-size:12px;font-weight:700;letter-spacing:1.6px;color:#C9530F;">TVOJ GLAVNI OKIDAČ</td></tr></tbody></table>

                          <!-- Dominant driver -->
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tbody><tr>
                              <td valign="bottom" style="padding-bottom:8px;">
                                <span class="body-font driver-val" style="font-size:21px;font-weight:800;letter-spacing:0.3px;color:#1A1A1A;">${DRIVER_META[primary.key].label}</span>
                              </td>
                              <td valign="bottom" align="right" style="padding-bottom:8px;">
                                <span class="body-font" style="font-size:22px;font-weight:800;color:#E8621A;">${primary.value}%</span>
                              </td>
                            </tr>
                          </tbody></table>
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EFE4DA;border-radius:99px;">
                            <tbody><tr><td style="line-height:0;font-size:0;">
                              <table role="presentation" width="${primaryW}%" cellpadding="0" cellspacing="0" style="width:${primaryW}%;"><tbody><tr>
                                <td height="10" style="height:10px;background:#E8621A;border-radius:99px;line-height:0;font-size:0;">&nbsp;</td>
                              </tr></tbody></table>
                            </td></tr>
                          </tbody></table>

                          <!-- Secondary driver -->
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                            <tbody><tr>
                              <td valign="bottom" style="padding:16px 0 8px;">
                                <span class="body-font" style="font-size:15px;font-weight:700;letter-spacing:0.3px;color:#6B6660;">${DRIVER_META[secondary.key].label}</span>
                              </td>
                              <td valign="bottom" align="right" style="padding:16px 0 8px;">
                                <span class="body-font" style="font-size:16px;font-weight:700;color:#A8A199;">${secondary.value}%</span>
                              </td>
                            </tr>
                          </tbody></table>
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EFE4DA;border-radius:99px;">
                            <tbody><tr><td style="line-height:0;font-size:0;">
                              <table role="presentation" width="${secondaryW}%" cellpadding="0" cellspacing="0" style="width:${secondaryW}%;"><tbody><tr>
                                <td height="8" style="height:8px;background:#C9B6A6;border-radius:99px;line-height:0;font-size:0;">&nbsp;</td>
                              </tr></tbody></table>
                            </td></tr>
                          </tbody></table>

                          <p class="body-font" style="margin:22px 0 0;font-size:15.5px;line-height:1.62;color:#3D3833;">
                            ${insight}
                          </p>
                        </td>
                      </tr>
                    </tbody></table>
                  </td>
                </tr>

                <!-- 4. MINI REPORT 2x2 -->
                <tr>
                  <td class="px" style="padding:26px 44px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tbody><tr>
                        <td class="gridcell stack" width="50%" valign="top" style="padding:0 7px 14px 0;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBFAF8;border:1px solid #EFEAE3;border-radius:16px;">
                            <tbody><tr><td style="padding:18px 18px 16px;">
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tbody><tr><td valign="top">
                              <p class="body-font" style="margin:0 0 9px;font-size:11px;font-weight:700;letter-spacing:1.2px;color:#9A938B;">PROFIL</p>
                              <p class="body-font stat-num" style="margin:0 0 6px;font-size:21px;font-weight:700;color:#1A1A1A;">${profileShort}</p>
                              <p class="body-font" style="margin:0;font-size:13px;line-height:1.45;color:#8A847D;">Tvoj najčešći obrazac pušenja.</p>
                              </td><td valign="top" align="right" width="46" style="padding-left:8px;"><img src="${IMG}/ic-profile.png" width="38" height="38" alt="" style="width:38px;height:38px;display:block;"></td></tr></tbody></table>
                            </td></tr>
                          </tbody></table>
                        </td>
                        <td class="gridcell stack" width="50%" valign="top" style="padding:0 0 14px 7px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBFAF8;border:1px solid #EFEAE3;border-radius:16px;">
                            <tbody><tr><td style="padding:18px 18px 16px;">
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tbody><tr><td valign="top">
                              <p class="body-font" style="margin:0 0 9px;font-size:11px;font-weight:700;letter-spacing:1.2px;color:#9A938B;">ZAVISNOST OD NIKOTINA</p>
                              <p class="body-font stat-num" style="margin:0 0 6px;font-size:21px;font-weight:700;color:#1A1A1A;">${results.fagerstromLevel}</p>
                              <p class="body-font" style="margin:0;font-size:13px;line-height:1.45;color:#8A847D;">Fagerstrom skor: ${results.fagerstromScore} / ${fagerstromMax}</p>
                              </td><td valign="top" align="right" width="46" style="padding-left:8px;"><img src="${IMG}/ic-nicotine.png" width="38" height="38" alt="" style="width:38px;height:38px;display:block;"></td></tr></tbody></table>
                            </td></tr>
                          </tbody></table>
                        </td>
                      </tr>
                      <tr>
                        <td class="gridcell stack" width="50%" valign="top" style="padding:0 7px 0 0;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBFAF8;border:1px solid #EFEAE3;border-radius:16px;">
                            <tbody><tr><td style="padding:18px 18px 16px;">
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tbody><tr><td valign="top">
                              <p class="body-font" style="margin:0 0 9px;font-size:11px;font-weight:700;letter-spacing:1.2px;color:#9A938B;">GODIŠNJE</p>
                              <p class="body-font stat-num" style="margin:0 0 6px;font-size:21px;font-weight:700;color:#1A1A1A;">${cigsPerYear} <span style="font-size:14px;font-weight:600;color:#8A847D;">cigareta</span></p>
                              <p class="body-font" style="margin:0;font-size:13px;line-height:1.45;color:#8A847D;">Procena na osnovu tvojih odgovora.</p>
                              </td><td valign="top" align="right" width="46" style="padding-left:8px;"><img src="${IMG}/ic-cigarette.png" width="38" height="38" alt="" style="width:38px;height:38px;display:block;"></td></tr></tbody></table>
                            </td></tr>
                          </tbody></table>
                        </td>
                        <td class="gridcell stack" width="50%" valign="top" style="padding:0 0 0 7px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBFAF8;border:1px solid #EFEAE3;border-radius:16px;">
                            <tbody><tr><td style="padding:18px 18px 16px;">
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tbody><tr><td valign="top">
                              <p class="body-font" style="margin:0 0 9px;font-size:11px;font-weight:700;letter-spacing:1.2px;color:#9A938B;">GODIŠNJI TROŠAK</p>
                              <p class="body-font stat-num" style="margin:0 0 6px;font-size:21px;font-weight:700;color:#3A7A3A;">${annualCost} <span style="font-size:14px;font-weight:600;color:#8A847D;">RSD</span></p>
                              <p class="body-font" style="margin:0;font-size:13px;line-height:1.45;color:#8A847D;">Novac koji može da ostane kod tebe.</p>
                              </td><td valign="top" align="right" width="46" style="padding-left:8px;"><img src="${IMG}/ic-money.png" width="38" height="38" alt="" style="width:38px;height:38px;display:block;"></td></tr></tbody></table>
                            </td></tr>
                          </tbody></table>
                        </td>
                      </tr>
                    </tbody></table>
                  </td>
                </tr>

                <!-- 5. MAIN CTA -->
                <tr>
                  <td class="px" style="padding:30px 44px 4px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #F0EBE4;">
                      <tbody><tr><td style="padding-top:28px;">
                        <h2 class="body-font" style="margin:0 0 12px;font-size:22px;font-weight:700;letter-spacing:-0.3px;color:#1A1A1A;">Kompletan izveštaj je sačuvan.</h2>
                        <p class="body-font" style="margin:0 0 14px;font-size:15.5px;line-height:1.6;color:#6B6660;">Otvori ga da vidiš:</p>
                        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                          <tbody><tr><td valign="top" width="30" style="padding:1px 11px 11px 0;"><img src="${IMG}/ic-check.png" width="19" height="19" alt="" style="width:19px;height:19px;display:block;"></td><td valign="top" class="body-font" style="padding:0 0 11px;font-size:15.5px;line-height:1.5;color:#3D3833;">detaljan pregled okidača</td></tr>
                          <tr><td valign="top" width="30" style="padding:1px 11px 11px 0;"><img src="${IMG}/ic-check.png" width="19" height="19" alt="" style="width:19px;height:19px;display:block;"></td><td valign="top" class="body-font" style="padding:0 0 11px;font-size:15.5px;line-height:1.5;color:#3D3833;">godišnji i petogodišnji trošak</td></tr>
                          <tr><td valign="top" width="30" style="padding:1px 11px 11px 0;"><img src="${IMG}/ic-check.png" width="19" height="19" alt="" style="width:19px;height:19px;display:block;"></td><td valign="top" class="body-font" style="padding:0 0 11px;font-size:15.5px;line-height:1.5;color:#3D3833;">preporučeni datum prestanka</td></tr>
                          <tr><td valign="top" width="30" style="padding:1px 11px 0 0;"><img src="${IMG}/ic-check.png" width="19" height="19" alt="" style="width:19px;height:19px;display:block;"></td><td valign="top" class="body-font" style="padding:0;font-size:15.5px;line-height:1.5;color:#3D3833;">prvi plan prilagođen tvom profilu</td></tr>
                        </tbody></table>

                        <!-- Button (VML for Outlook + ember gradient) -->
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                          <tbody><tr><td align="center">
                            <!--[if mso]>
                            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${resultsUrl}" style="height:54px;v-text-anchor:middle;width:520px;" arcsize="26%" fillcolor="#E8621A" stroke="f">
                              <w:anchorlock/>
                              <center style="color:#FFFFFF;font-family:Arial,sans-serif;font-size:17px;font-weight:bold;">Pogledaj kompletan izveštaj</center>
                            </v:roundrect>
                            <![endif]-->
                            <!--[if !mso]><!-->
                            <a href="${resultsUrl}" class="body-font cta-a" style="display:inline-block;padding:17px 34px;font-size:17px;font-weight:700;color:#FFFFFF;letter-spacing:0.2px;border-radius:14px;background:#E8621A;background:linear-gradient(180deg,#F0701F 0%,#E8621A 100%);box-shadow:0 8px 20px rgba(232,98,26,0.28);">Pogledaj kompletan izveštaj</a>
                            <!--<![endif]-->
                          </td></tr>
                        </tbody></table>
                        <p class="body-font" style="margin:14px 0 0;font-size:13px;line-height:1.5;color:#9A938B;text-align:center;">Link vodi direktno do tvog sačuvanog rezultata.</p>
                      </td></tr>
                    </tbody></table>
                  </td>
                </tr>

                <!-- 6. APP BRIDGE -->
                <tr>
                  <td class="px" style="padding:34px 44px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #F0EBE4;">
                      <tbody><tr><td style="padding-top:30px;">
                        <p class="body-font" style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:1.5px;color:#C9530F;">PROCENA JE SAMO PRVI KORAK</p>
                        <h2 class="body-font" style="margin:0 0 18px;font-size:22px;font-weight:700;line-height:1.34;letter-spacing:-0.3px;color:#1A1A1A;">Iskra nastavlja tamo gde se<br>ovaj izveštaj završava.</h2>
                        <p class="body-font" style="margin:0 0 18px;font-size:15.5px;line-height:1.62;color:#6B6660;">Kada ti se sledeći put zapali, nećeš morati da se oslanjaš samo na volju. Iskra će ti pomoći da:</p>
                        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                          <tbody><tr><td valign="top" width="30" style="padding:1px 11px 11px 0;"><img src="${IMG}/ic-check.png" width="19" height="19" alt="" style="width:19px;height:19px;display:block;"></td><td valign="top" class="body-font" style="padding:0 0 11px;font-size:15.5px;line-height:1.5;color:#3D3833;">prepoznaš okidač pre nego što automatski zapališ</td></tr>
                          <tr><td valign="top" width="30" style="padding:1px 11px 11px 0;"><img src="${IMG}/ic-check.png" width="19" height="19" alt="" style="width:19px;height:19px;display:block;"></td><td valign="top" class="body-font" style="padding:0 0 11px;font-size:15.5px;line-height:1.5;color:#3D3833;">preguraš najtežih nekoliko minuta poriva</td></tr>
                          <tr><td valign="top" width="30" style="padding:1px 11px 11px 0;"><img src="${IMG}/ic-check.png" width="19" height="19" alt="" style="width:19px;height:19px;display:block;"></td><td valign="top" class="body-font" style="padding:0 0 11px;font-size:15.5px;line-height:1.5;color:#3D3833;">vidiš dane, novac i cigarete koje ostavljaš iza sebe</td></tr>
                          <tr><td valign="top" width="30" style="padding:1px 11px 0 0;"><img src="${IMG}/ic-check.png" width="19" height="19" alt="" style="width:19px;height:19px;display:block;"></td><td valign="top" class="body-font" style="padding:0;font-size:15.5px;line-height:1.5;color:#3D3833;">nastaviš dalje čak i kada ti dan ne ide po planu</td></tr>
                        </tbody></table>

                        <!-- Mini app card -->
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1F1813;border-radius:20px;">
                          <tbody><tr><td style="padding:22px 22px 20px;">
                            <p class="body-font" style="margin:0 0 16px;font-size:11px;font-weight:700;letter-spacing:1.6px;color:#E8924A;text-align:center;">● SLOBODAN SI</p>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                              <tbody><tr>
                                <td width="33.33%" align="center" valign="top" style="padding:0 6px;">
                                  <p class="body-font" style="margin:0 0 4px;font-size:26px;font-weight:800;color:#FFFFFF;">${demoDays}</p>
                                  <p class="body-font" style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.5px;color:#9A8E82;">DANA</p>
                                </td>
                                <td width="33.33%" align="center" valign="top" style="padding:0 6px;border-left:1px solid #36281E;border-right:1px solid #36281E;">
                                  <p class="body-font" style="margin:0 0 4px;font-size:26px;font-weight:800;color:#FFFFFF;">${demoSaved}</p>
                                  <p class="body-font" style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.5px;color:#9A8E82;">RSD UŠTEĐENO</p>
                                </td>
                                <td width="33.33%" align="center" valign="top" style="padding:0 6px;">
                                  <p class="body-font" style="margin:0 0 4px;font-size:26px;font-weight:800;color:#FFFFFF;">${demoCigs}</p>
                                  <p class="body-font" style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.5px;color:#9A8E82;">CIGARETA IZA</p>
                                </td>
                              </tr>
                            </tbody></table>
                          </td></tr>
                        </tbody></table>
                        <p class="body-font" style="margin:13px 0 0;font-size:13px;line-height:1.5;color:#9A938B;text-align:center;">Primer kako Iskra prati tvoj napredak. Bez osuđivanja i bez generičkih saveta.</p>
                      </td></tr>
                    </tbody></table>
                  </td>
                </tr>

                <!-- 7. EARLY ACCESS -->
                <tr>
                  <td class="px" style="padding:30px 44px 8px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FEF0E8;border:1px solid #F8DCC9;border-radius:20px;">
                      <tbody><tr><td style="padding:26px 26px 24px;">
                        <table role="presentation" cellpadding="0" cellspacing="0">
                          <tbody><tr>
                            <td valign="top" width="44" style="padding-right:14px;">
                              <img src="${IMG}/flame.png" width="18" height="34" alt="Iskra" style="width:18px;height:34px;">
                            </td>
                            <td valign="top">
                              <h3 class="body-font" style="margin:0 0 8px;font-size:19px;font-weight:700;color:#1A1A1A;">Tvoje mesto je sačuvano.</h3>
                              <p class="body-font" style="margin:0;font-size:15px;line-height:1.6;color:#6B5A4E;">Na Early Access listi si i među prvima dobijaš obaveštenje kada Iskra bude spremna za prve korisnike u Srbiji. ${firstVerb} pristup i po početnoj ceni.</p>
                            </td>
                          </tr>
                        </tbody></table>
                        ${positionLine ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;border-top:1px solid #F6D9C6;"><tbody>${positionLine}</tbody></table>` : ''}
                        <p class="body-font" style="margin:14px 0 0;font-size:13px;line-height:1.5;color:#9C8576;">Bez spama i bez plaćanja unapred. Javljamo se samo kada imamo nešto važno.</p>
                      </td></tr>
                    </tbody></table>
                  </td>
                </tr>

                <!-- 8. NEXT STEP -->
                <tr>
                  <td class="px" style="padding:24px 44px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tbody><tr><td style="padding-top:8px;">
                        <p class="body-font" style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:1.5px;color:#9A938B;">DOK ČEKAŠ</p>
                        <h3 class="body-font" style="margin:0 0 14px;font-size:21px;font-weight:700;letter-spacing:-0.3px;color:#1A1A1A;">Danas samo primeti jednu cigaretu.</h3>
                        <p class="body-font" style="margin:0 0 12px;font-size:15.5px;line-height:1.62;color:#6B6660;">Ne moraš odmah da je preskočiš. Samo obrati pažnju šta se dogodilo nekoliko minuta pre nego što si ${litVerb}:</p>
                        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;"><tbody><tr>
                          <td style="padding:0 8px 0 0;"><span class="body-font" style="display:inline-block;white-space:nowrap;background:#F3EEE7;border-radius:8px;padding:6px 13px;font-size:14px;font-weight:600;color:#3D3833;">stres</span></td>
                          <td style="padding:0 8px 0 0;"><span class="body-font" style="display:inline-block;white-space:nowrap;background:#F3EEE7;border-radius:8px;padding:6px 13px;font-size:14px;font-weight:600;color:#3D3833;">kafa</span></td>
                          <td style="padding:0 8px 0 0;"><span class="body-font" style="display:inline-block;white-space:nowrap;background:#F3EEE7;border-radius:8px;padding:6px 13px;font-size:14px;font-weight:600;color:#3D3833;">dosada</span></td>
                          <td style="padding:0 8px 0 0;"><span class="body-font" style="display:inline-block;white-space:nowrap;background:#F3EEE7;border-radius:8px;padding:6px 13px;font-size:14px;font-weight:600;color:#3D3833;">društvo</span></td>
                          <td><span class="body-font" style="display:inline-block;white-space:nowrap;background:#F3EEE7;border-radius:8px;padding:6px 13px;font-size:14px;font-weight:600;color:#3D3833;">automatska pauza</span></td>
                        </tr></tbody></table>
                        <p class="body-font" style="margin:0;font-size:15.5px;line-height:1.62;color:#6B6660;">Prvi korak nije savršenstvo. Prvi korak je da vidiš obrazac dok se dešava.</p>
                      </td></tr>
                    </tbody></table>
                  </td>
                </tr>

              </tbody></table>
            </td>
          </tr>

          <!-- 9. DISCLAIMER -->
          <tr>
            <td class="px" style="padding:26px 44px 6px;">
              <p class="body-font" style="margin:0;font-size:12.5px;line-height:1.6;color:#9A938B;">
                Iskra je aplikacija za podršku pri odvikavanju od pušenja, praćenje navika i edukaciju. Nije zamena za lekara, terapiju ili medicinski tretman. Ako imaš ozbiljne zdravstvene tegobe ili ti je potrebna stručna pomoć pri odvikavanju, obrati se lekaru.
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td class="px" style="padding:22px 44px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #DDD4C8;">
                <tbody><tr><td style="padding-top:22px;">
                  <p class="body-font" style="margin:0 0 5px;font-size:15px;font-weight:800;letter-spacing:2px;color:#6B6660;">ISKRA</p>
                  <p class="body-font" style="margin:0 0 18px;font-size:13.5px;line-height:1.55;color:#9A938B;">Napravljeno u Srbiji, za ljude koji žele drugačiji pokušaj.</p>
                  <p class="body-font" style="margin:0 0 18px;font-size:13.5px;line-height:1.55;">
                    <a href="${resultsUrl}" style="color:#C9530F;font-weight:600;">Pogledaj rezultate</a>
                  </p>
                  <p class="body-font" style="margin:0;font-size:12px;line-height:1.55;color:#B0A89C;">
                    Dobio/la si ovaj email jer si ${finishedQuiz} Iskra procenu na quiz.iskraclub.com i zatražen je kompletan izveštaj. Nećemo te spamovati — javljamo se samo kada app bude spremna.
                  </p>
                </td></tr>
              </tbody></table>
            </td>
          </tr>

        </tbody></table>
        <!-- ===== /EMAIL CONTAINER ===== -->

      </td>
    </tr>
  </tbody></table>

</body>
</html>`;

  // Plain-text fallback for clients that prefer it / better deliverability.
  const text = [
    `${greeting}`,
    '',
    'Tvoj Iskra izveštaj je spreman.',
    '',
    `Glavni okidač: ${DRIVER_META[primary.key].label} (${primary.value}%)`,
    `Drugi okidač: ${DRIVER_META[secondary.key].label} (${secondary.value}%)`,
    '',
    `Profil: ${profileShort}`,
    `Zavisnost od nikotina: ${results.fagerstromLevel} (Fagerstrom ${results.fagerstromScore}/${fagerstromMax})`,
    `Godišnje: ${cigsPerYear} cigareta`,
    `Godišnji trošak: ${annualCost} RSD`,
    '',
    `Pogledaj kompletan izveštaj: ${resultsUrl}`,
    '',
    'Na Early Access listi si — javljamo se samo kada Iskra bude spremna.',
  ].join('\n');

  return { subject, html, text };
}
