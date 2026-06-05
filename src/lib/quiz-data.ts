export type QuestionType = 'single' | 'scale' | 'number' | 'time';

export interface Option {
  id: string;
  label: string;
  value: number; // for scoring
}

export interface Question {
  id: string;
  category: 'pattern' | 'fagerstrom' | 'health' | 'psychological' | 'readiness';
  type: QuestionType;
  question: string;
  subtitle?: string;
  options?: Option[];
  min?: number;
  max?: number;
  unit?: string;
  fagerstromKey?: string; // maps to Fagerstrom scoring
}

export const questions: Question[] = [
  // ─── OBRAZAC PUŠENJA (3 pitanja) ───
  {
    id: 'q1',
    category: 'pattern',
    type: 'single',
    question: 'Koliko cigareta pušiš dnevno?',
    subtitle: 'Uključi i one uz kafu, piće ili na pauzi.',
    options: [
      { id: 'a', label: '1–5', value: 0 },
      { id: 'b', label: '6–10', value: 1 },
      { id: 'c', label: '11–20', value: 2 },
      { id: 'd', label: 'Više od 20', value: 3 },
    ],
  },
  {
    id: 'q2',
    category: 'pattern',
    type: 'single',
    question: 'Koliko dugo pušiš?',
    options: [
      { id: 'a', label: 'Manje od 2 godine', value: 0 },
      { id: 'b', label: '2–5 godina', value: 1 },
      { id: 'c', label: '6–15 godina', value: 2 },
      { id: 'd', label: 'Više od 15 godina', value: 3 },
    ],
  },
  {
    id: 'q3',
    category: 'pattern',
    type: 'single',
    question: 'Kada najčešće zapališ prvu cigaretu u toku dana?',
    options: [
      { id: 'a', label: 'Uz jutarnju kafu', value: 3 },
      { id: 'b', label: 'Na poslu ili pauzi', value: 2 },
      { id: 'c', label: 'U društvu', value: 1 },
      { id: 'd', label: 'Uveče', value: 0 },
    ],
  },

  // ─── FAGERSTROM TEST (4 pitanja) ───
  {
    id: 'f1',
    category: 'fagerstrom',
    type: 'single',
    fagerstromKey: 'first_cigarette',
    question: 'Koliko brzo nakon buđenja zapališ prvu cigaretu?',
    subtitle: 'Ovo je jedan od najvažnijih pokazatelja zavisnosti.',
    options: [
      { id: 'a', label: 'U prvih 5 minuta', value: 3 },
      { id: 'b', label: '6–30 minuta', value: 2 },
      { id: 'c', label: '31–60 minuta', value: 1 },
      { id: 'd', label: 'Posle sat vremena', value: 0 },
    ],
  },
  {
    id: 'f2',
    category: 'fagerstrom',
    type: 'single',
    fagerstromKey: 'no_smoking_zone',
    question: 'Da li ti je teško da ne pušiš tamo gde je zabranjeno?',
    options: [
      { id: 'a', label: 'Da', value: 1 },
      { id: 'b', label: 'Ne', value: 0 },
    ],
  },
  {
    id: 'f3',
    category: 'fagerstrom',
    type: 'single',
    fagerstromKey: 'morning_most',
    question: 'Koje cigarete bi ti bilo najteže da se odrekneš?',
    options: [
      { id: 'a', label: 'Prve ujutru', value: 1 },
      { id: 'b', label: 'Neke druge', value: 0 },
    ],
  },
  {
    id: 'f4',
    category: 'fagerstrom',
    type: 'single',
    fagerstromKey: 'sick_smoking',
    // Male form stored; female override in QuestionScreen
    question: 'Da li pušiš čak i kada si bolestan i ležiš u krevetu?',
    options: [
      { id: 'a', label: 'Da', value: 1 },
      { id: 'b', label: 'Ne', value: 0 },
    ],
  },

  // ─── ZDRAVSTVENI SIMPTOMI (3 pitanja) ───
  {
    id: 'h1',
    category: 'health',
    type: 'single',
    question: 'Da li primećuješ kašalj ili nedostatak vazduha?',
    options: [
      { id: 'a', label: 'Retko ili nikad', value: 0 },
      { id: 'b', label: 'Povremeno', value: 1 },
      { id: 'c', label: 'Često', value: 2 },
      { id: 'd', label: 'Svakodnevno', value: 3 },
    ],
  },
  {
    id: 'h2',
    category: 'health',
    type: 'single',
    question: 'Kako ocenjuješ svoje fizičke kapacitete danas u odnosu na ranije?',
    options: [
      { id: 'a', label: 'Isti su', value: 0 },
      { id: 'b', label: 'Malo slabiji', value: 1 },
      { id: 'c', label: 'Primetno slabiji', value: 2 },
      { id: 'd', label: 'Znatno slabiji', value: 3 },
    ],
  },
  {
    id: 'h3',
    category: 'health',
    type: 'single',
    question: 'Da li imaš nekoga bliskog ko je imao ozbiljne zdravstvene probleme zbog pušenja?',
    options: [
      { id: 'a', label: 'Ne', value: 0 },
      { id: 'b', label: 'Jednu osobu', value: 1 },
      { id: 'c', label: 'Više osoba', value: 2 },
    ],
  },

  // ─── PSIHOLOŠKI PROFIL (4 pitanja) ───
  {
    id: 'p1',
    category: 'psychological',
    type: 'single',
    question: 'Šta te najčešće navede da zapališ?',
    // Male form stored; female override in QuestionScreen (subtitle only)
    subtitle: 'Budi iskren — nema pogrešnog odgovora.',
    options: [
      { id: 'a', label: 'Stres ili briga', value: 10 },
      { id: 'b', label: 'Kafa ili obrok', value: 20 },
      { id: 'c', label: 'Dosada ili pauza', value: 30 },
      { id: 'd', label: 'Društvo i alkohol', value: 40 },
    ],
  },
  {
    id: 'p2',
    category: 'psychological',
    type: 'single',
    // Male form stored; female override in QuestionScreen
    question: 'Da li si ranije pokušao da prestaneš?',
    options: [
      { id: 'a', label: 'Nikad nisam ni pokušao', value: 0 },
      { id: 'b', label: 'Jednom, nisam izdržao', value: 1 },
      { id: 'c', label: 'Više puta', value: 2 },
      { id: 'd', label: 'Jesam, ali sam se vratio', value: 3 },
    ],
  },
  {
    id: 'p3',
    category: 'psychological',
    type: 'single',
    question: 'Šta te je do sada najčešće zaustavljalo?',
    options: [
      { id: 'a', label: 'Apstinencijalna kriza', value: 1 },
      { id: 'b', label: 'Stres', value: 2 },
      { id: 'c', label: 'Nisam imao podršku', value: 3 },
      { id: 'd', label: 'Nisam ozbiljno pokušao', value: 4 },
    ],
  },
  {
    id: 'p4',
    category: 'psychological',
    type: 'single',
    question: 'Kako se osećaš kada pomisliš da prestaneš?',
    options: [
      { id: 'a', label: 'Spreman sam', value: 3 },
      { id: 'b', label: 'I hoću i neću', value: 2 },
      { id: 'c', label: 'Pomalo sam zabrinut', value: 1 },
      { id: 'd', label: 'Nisam siguran da mogu', value: 0 },
    ],
  },

  // ─── READINESS (3 pitanja) ───
  {
    id: 'r1',
    category: 'readiness',
    type: 'single',
    question: 'Kada planiraš da prestaneš?',
    options: [
      { id: 'a', label: 'Danas ili ove nedelje', value: 3 },
      { id: 'b', label: 'U narednom mesecu', value: 2 },
      { id: 'c', label: 'Kada budem spreman', value: 1 },
      { id: 'd', label: 'Nisam siguran', value: 0 },
    ],
  },
  {
    id: 'r2',
    category: 'readiness',
    type: 'single',
    question: 'Na skali 1–10, koliko ti je važno da prestaneš?',
    subtitle: '1 = uopšte nije važno, 10 = najvažnija stvar',
    options: [
      { id: 'a', label: '1–3 (nije prioritet)', value: 0 },
      { id: 'b', label: '4–6 (razmišljam o tome)', value: 1 },
      { id: 'c', label: '7–8 (važno mi je)', value: 2 },
      { id: 'd', label: '9–10 (ovo je moj prioritet)', value: 3 },
    ],
  },
  {
    id: 'r3',
    category: 'readiness',
    type: 'single',
    question: 'Koliko cigareta dnevno troši tvoje domaćinstvo ukupno?',
    subtitle: 'Uključi sve koji pušite kod kuće.',
    options: [
      { id: 'a', label: 'Samo ja', value: 0 },
      { id: 'b', label: 'Ja i još jedna osoba', value: 1 },
      { id: 'c', label: 'Više ljudi', value: 2 },
    ],
  },
];

export type SmokingProfile = 'Stresni pušač' | 'Socijalni pušač' | 'Pušač iz navike' | 'Mešoviti profil';

export interface DriverBreakdown {
  stress: number;    // 0–100
  habit: number;     // 0–100
  social: number;    // 0–100
  nicotine: number;  // 0–100
  // all four always sum to 100
}

export function calculateDriverBreakdown(answers: Record<string, string>): DriverBreakdown {
  let stress = 5, habit = 5, social = 5, nicotine = 5;

  const a = answers;

  // Stress signals
  if (a['p1'] === 'a') stress += 40;
  if (a['q3'] === 'a') stress += 10;
  if (a['h1'] === 'c' || a['h1'] === 'd') stress += 10;
  if (a['p3'] === 'b') stress += 20;
  if (a['p4'] === 'c' || a['p4'] === 'd') stress += 10;

  // Habit signals
  if (a['p1'] === 'b' || a['p1'] === 'c') habit += 35;
  if (a['q3'] === 'a') habit += 15;
  if (a['q2'] === 'c' || a['q2'] === 'd') habit += 15;
  if (a['r3'] === 'b' || a['r3'] === 'c') habit += 10;

  // Social signals
  if (a['p1'] === 'd') social += 50;
  if (a['q3'] === 'c') social += 30;
  if (a['h3'] === 'b' || a['h3'] === 'c') social += 10;

  // Nicotine signals
  if (a['f1'] === 'a' || a['f1'] === 'b') nicotine += 30;
  if (a['f2'] === 'a') nicotine += 20;
  if (a['f3'] === 'a') nicotine += 15;
  if (a['f4'] === 'a') nicotine += 15;
  if (a['q1'] === 'c' || a['q1'] === 'd') nicotine += 10;

  const total = stress + habit + social + nicotine;
  return {
    stress:   Math.round((stress / total) * 100),
    habit:    Math.round((habit / total) * 100),
    social:   Math.round((social / total) * 100),
    nicotine: Math.round((nicotine / total) * 100),
  };
}

export function calculateReadinessScore(answers: Record<string, string>): number {
  let score = 0;

  // r1: quit timeline
  const r1Map: Record<string,number> = { a: 30, b: 22, c: 12, d: 5 };
  score += r1Map[answers['r1']] ?? 0;

  // r2: importance
  const r2Map: Record<string,number> = { a: 5, b: 15, c: 22, d: 30 };
  score += r2Map[answers['r2']] ?? 0;

  // p2: prior attempts show intent
  const p2Map: Record<string,number> = { a: 5, b: 12, c: 20, d: 16 };
  score += p2Map[answers['p2']] ?? 0;

  // p4: how they feel about quitting
  const p4Map: Record<string,number> = { a: 20, b: 12, c: 8, d: 3 };
  score += p4Map[answers['p4']] ?? 0;

  return Math.min(100, score);
}

export interface QuizResults {
  fagerstromScore: number;
  fagerstromLevel: 'Niska' | 'Umerena' | 'Visoka' | 'Vrlo visoka';
  smokingProfile: SmokingProfile;
  annualCostRSD: number;
  fiveYearCostRSD: number;
  cigarettesPerDay: number;
  cigarettesPerYear: number;
  readinessScore: number; // 0-9
  driverBreakdown: DriverBreakdown;
  readinessScore100: number; // 0–100
  answers: Record<string, string>;
}

export function calculateResults(answers: Record<string, string>, packPrice = 450, cigsPerPack = 20): QuizResults {
  const q1CigsMap: Record<string, number> = { a: 3, b: 8, c: 15, d: 25 };
  const cigarettesPerDay = q1CigsMap[answers['q1']] ?? 15;

  // Fagerstrom
  const fagerstromKeys = ['f1', 'f2', 'f3', 'f4'];
  let fagerstromScore = 0;
  fagerstromKeys.forEach(key => {
    const q = questions.find(q => q.id === key);
    const ans = answers[key];
    const opt = q?.options?.find(o => o.id === ans);
    if (opt) fagerstromScore += opt.value;
  });

  let fagerstromLevel: QuizResults['fagerstromLevel'];
  if (fagerstromScore <= 2) fagerstromLevel = 'Niska';
  else if (fagerstromScore <= 4) fagerstromLevel = 'Umerena';
  else if (fagerstromScore <= 6) fagerstromLevel = 'Visoka';
  else fagerstromLevel = 'Vrlo visoka';

  // Profile from p1
  const profileMap: Record<string, SmokingProfile> = {
    a: 'Stresni pušač',
    b: 'Pušač iz navike',
    c: 'Pušač iz navike',
    d: 'Socijalni pušač',
  };
  const smokingProfile: SmokingProfile = profileMap[answers['p1']] ?? 'Mešoviti profil';

  // Financial
  const packsPerDay = cigarettesPerDay / cigsPerPack;
  const annualCostRSD = Math.round(packsPerDay * packPrice * 365);
  const fiveYearCostRSD = annualCostRSD * 5;
  const cigarettesPerYear = cigarettesPerDay * 365;

  // Readiness
  let readinessScore = 0;
  ['r1', 'r2'].forEach(key => {
    const q = questions.find(q => q.id === key);
    const ans = answers[key];
    const opt = q?.options?.find(o => o.id === ans);
    if (opt) readinessScore += opt.value;
  });

  const driverBreakdown = calculateDriverBreakdown(answers);
  const readinessScore100 = calculateReadinessScore(answers);

  return {
    fagerstromScore,
    fagerstromLevel,
    smokingProfile,
    annualCostRSD,
    fiveYearCostRSD,
    cigarettesPerDay,
    cigarettesPerYear,
    readinessScore,
    driverBreakdown,
    readinessScore100,
    answers,
  };
}

export const profileDescriptions: Record<SmokingProfile, { title: string; description: string; strategy: string }> = {
  'Stresni pušač': {
    title: 'Stresni pušač',
    description: 'Cigareta ti je mehanizam za rasterećenje. Nije slabost — to je naučena reakcija na pritisak koja traje godinama.',
    strategy: 'Zameni ritual, ne samo cigaretu. Box breathing i kratke šetnje daju isti fiziološki efekat za 3–5 minuta.',
  },
  'Socijalni pušač': {
    title: 'Socijalni pušač',
    description: 'Cigareta ti je deo društvenog rituala. Kafana, piće, dobro društvo — sve se oseti nepotpuno bez nje.',
    strategy: 'Identifikuj 2–3 okidača u društvu i pripremi izlaz unapred. Nije o volji — o je o pripremi.',
  },
  'Pušač iz navike': {
    title: 'Pušač iz navike',
    description: 'Kod tebe je cigareta čisto automatska — uz kafu, posle jela, na pauzi. Mozak je vezao signale bez tvog pristanka.',
    strategy: 'Prekini jedan ritual odjednom. Zameni jutarnju cigaretu uz kafu čajem nedelju dana. Mozak se brzo prilagođava.',
  },
  'Mešoviti profil': {
    title: 'Mešoviti profil',
    description: 'Pušiš iz više razloga — stres, navika, društvo. To je čest profil i ne znači da je teže prestati.',
    strategy: 'Trodnevno mapiranje — beleži svaku cigaretu i situaciju. Videćeš jasan obrazac za 72 sata.',
  },
};
