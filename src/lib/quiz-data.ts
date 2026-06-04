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
    subtitle: 'Uključi i one koje popiješ u kafani ili na pauzama.',
    options: [
      { id: 'a', label: '1–5 cigareta', value: 0 },
      { id: 'b', label: '6–10 cigareta', value: 1 },
      { id: 'c', label: '11–20 cigareta', value: 2 },
      { id: 'd', label: 'Više od 20', value: 3 },
    ],
  },
  {
    id: 'q2',
    category: 'pattern',
    type: 'single',
    question: 'Koliko godina pušiš?',
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
    question: 'Kada najčešće pušiš?',
    subtitle: 'Izaberi situaciju koja te prvi put prikaže ujutru.',
    options: [
      { id: 'a', label: 'Uz jutarnju kafu', value: 3 },
      { id: 'b', label: 'Na pauzama na poslu', value: 2 },
      { id: 'c', label: 'U društvu, uz piće', value: 1 },
      { id: 'd', label: 'Uveče, kad se odmorim', value: 0 },
    ],
  },

  // ─── FAGERSTROM TEST (4 pitanja) ───
  {
    id: 'f1',
    category: 'fagerstrom',
    type: 'single',
    fagerstromKey: 'first_cigarette',
    question: 'Koliko brzo po buđenju pušiš prvu cigaretu?',
    subtitle: 'Ovo je jedan od najvažnijih pokazatelja zavisnosti.',
    options: [
      { id: 'a', label: 'U prvih 5 minuta', value: 3 },
      { id: 'b', label: '6–30 minuta', value: 2 },
      { id: 'c', label: '31–60 minuta', value: 1 },
      { id: 'd', label: 'Nakon sat vremena', value: 0 },
    ],
  },
  {
    id: 'f2',
    category: 'fagerstrom',
    type: 'single',
    fagerstromKey: 'no_smoking_zone',
    question: 'Da li ti je teško da ne pušiš na mestima gde je zabranjeno?',
    subtitle: 'Na primer u bolnici, avionu, bioskopu.',
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
    question: 'Koja ti je cigareta najteža da izostaviš?',
    options: [
      { id: 'a', label: 'Prva ujutru', value: 1 },
      { id: 'b', label: 'Neka druga', value: 0 },
    ],
  },
  {
    id: 'f4',
    category: 'fagerstrom',
    type: 'single',
    fagerstromKey: 'sick_smoking',
    question: 'Da li pušiš čak i kada si bolestan/a i ležiš u krevetu?',
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
    question: 'Da li primetiš kašalj ili nedostatak vazduha?',
    options: [
      { id: 'a', label: 'Retko ili nikad', value: 0 },
      { id: 'b', label: 'Povremeno', value: 1 },
      { id: 'c', label: 'Često, posebno ujutru', value: 2 },
      { id: 'd', label: 'Svakodnevno', value: 3 },
    ],
  },
  {
    id: 'h2',
    category: 'health',
    type: 'single',
    question: 'Kako ocenjuješ svoje fizičke kapacitete u poređenju sa pre?',
    options: [
      { id: 'a', label: 'Isti su', value: 0 },
      { id: 'b', label: 'Malo manji', value: 1 },
      { id: 'c', label: 'Primetno manji', value: 2 },
      { id: 'd', label: 'Znatno ograničeni', value: 3 },
    ],
  },
  {
    id: 'h3',
    category: 'health',
    type: 'single',
    question: 'Da li imaš nekog bliskog ko je oboleo zbog pušenja?',
    subtitle: 'Roditelj, baka/deda, prijatelj.',
    options: [
      { id: 'a', label: 'Ne', value: 0 },
      { id: 'b', label: 'Da, jednog', value: 1 },
      { id: 'c', label: 'Da, više', value: 2 },
    ],
  },

  // ─── PSIHOLOŠKI PROFIL (4 pitanja) ───
  {
    id: 'p1',
    category: 'psychological',
    type: 'single',
    question: 'Šta te najčešće tera da zapališ?',
    subtitle: 'Budi iskren/a — nema pogrešnog odgovora.',
    options: [
      { id: 'a', label: 'Stres ili briga', value: 10 },
      { id: 'b', label: 'Navika uz kafu ili jelo', value: 20 },
      { id: 'c', label: 'Dosada ili pauza', value: 30 },
      { id: 'd', label: 'Društvo i alkohol', value: 40 },
    ],
  },
  {
    id: 'p2',
    category: 'psychological',
    type: 'single',
    question: 'Da li si pokušao/la da prestaneš ranije?',
    options: [
      { id: 'a', label: 'Nikad nisam ni pokušao/la', value: 0 },
      { id: 'b', label: 'Jednom, nisam izdržao/la', value: 1 },
      { id: 'c', label: 'Više puta', value: 2 },
      { id: 'd', label: 'Da, uspeo/la sam ali sam se vratio/la', value: 3 },
    ],
  },
  {
    id: 'p3',
    category: 'psychological',
    type: 'single',
    question: 'Šta te je do sada zaustavljalo?',
    options: [
      { id: 'a', label: 'Apstinencijalna kriza', value: 1 },
      { id: 'b', label: 'Stres i pritisak', value: 2 },
      { id: 'c', label: 'Nisam imao/la podršku', value: 3 },
      { id: 'd', label: 'Zapravo nisam ni pokušao/la ozbiljno', value: 4 },
    ],
  },
  {
    id: 'p4',
    category: 'psychological',
    type: 'single',
    question: 'Kako se osećaš kada pomisliš da prestaneš?',
    options: [
      { id: 'a', label: 'Spreman/na i motivisan/a', value: 3 },
      { id: 'b', label: 'Ambivalentan/na — i hoću i ne', value: 2 },
      { id: 'c', label: 'Malo uplašen/a', value: 1 },
      { id: 'd', label: 'Nisam siguran/a da mogu', value: 0 },
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
      { id: 'c', label: 'Jednog dana, kad budem spreman/na', value: 1 },
      { id: 'd', label: 'Nisam siguran/a', value: 0 },
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

export interface QuizResults {
  fagerstromScore: number;
  fagerstromLevel: 'Niska' | 'Umerena' | 'Visoka' | 'Vrlo visoka';
  smokingProfile: SmokingProfile;
  annualCostRSD: number;
  fiveYearCostRSD: number;
  cigarettesPerDay: number;
  cigarettesPerYear: number;
  readinessScore: number; // 0-9
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

  return {
    fagerstromScore,
    fagerstromLevel,
    smokingProfile,
    annualCostRSD,
    fiveYearCostRSD,
    cigarettesPerDay,
    cigarettesPerYear,
    readinessScore,
    answers,
  };
}

export const profileDescriptions: Record<SmokingProfile, { title: string; description: string; strategy: string }> = {
  'Stresni pušač': {
    title: 'Stresni pušač',
    description: 'Cigareta ti je mehanizam za rasterećenje. Nije slabost — to je naučena reakcija na pritisak koja traje godinama.',
    strategy: 'Tvoja strategija: zameni ritual, ne samo cigaretu. Box breathing i kratke šetnje daju isti fiziološki efekat za 3–5 minuta.',
  },
  'Socijalni pušač': {
    title: 'Socijalni pušač',
    description: 'Cigareta ti je deo društvenog rituala. Kafana, piće, dobro društvo — sve se oseti nepotpuno bez nje.',
    strategy: 'Tvoja strategija: identifikuj 2-3 okidača u društvu i pripremi "izlaz" unapred. Nije o volji — o je o pripremi.',
  },
  'Pušač iz navike': {
    title: 'Pušač iz navike',
    description: 'Kod tebe je cigareta čisto automatska — uz kafu, posle jela, na pauzi. Mozak je vezao signale bez tvog pristanka.',
    strategy: 'Tvoja strategija: prekini jedan ritual odjednom. Zameni jutarnju kafu sa cigaretom čajem nedelju dana. Mozak se brzo prilagođava.',
  },
  'Mešoviti profil': {
    title: 'Mešoviti profil',
    description: 'Pušiš iz više razloga — stres, navika, društvo. To je čest profil i ne znači da je teže prestati.',
    strategy: 'Tvoja strategija: trodnevni "mapiranje" — beleži svaku cigaretu i situaciju. Videćeš jasan obrazac za 72h.',
  },
};
