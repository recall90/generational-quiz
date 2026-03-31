export type Generation = 'genZ' | 'millennials' | 'genX' | 'boomers';

export interface Answer {
  text: string;
  generation: Generation;
  points: number;
}

export interface Question {
  id: number;
  emoji: string;
  text: string;
  answers: Answer[];
}

export interface QuizResult {
  name: string;
  birthYear: number;
  scores: Record<Generation, number>;
  result: Generation;
  timestamp: number;
}

export const GENERATIONS: Record<Generation, { label: string; years: string; color: string; emoji: string }> = {
  genZ: { label: 'Gen Z', years: '1997–2012', color: '#7C3AED', emoji: '⚡' },
  millennials: { label: 'Millennials', years: '1981–1996', color: '#059669', emoji: '🌐' },
  genX: { label: 'Gen X', years: '1965–1980', color: '#D97706', emoji: '📼' },
  boomers: { label: 'Boomers', years: '1946–1964', color: '#DC2626', emoji: '📻' },
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    emoji: '🎂',
    text: 'V katero generacijo meniš, da spadaš?',
    answers: [
      { text: 'Gen Z (1997–2012)', generation: 'genZ', points: 3 },
      { text: 'Millennials (1981–1996)', generation: 'millennials', points: 3 },
      { text: 'Gen X (1965–1980)', generation: 'genX', points: 3 },
      { text: 'Boomers (1946–1964)', generation: 'boomers', points: 3 },
    ],
  },
  {
    id: 2,
    emoji: '💬',
    text: 'Kako najraje komuniciraš?',
    answers: [
      { text: 'TikTok / DM / voice', generation: 'genZ', points: 2 },
      { text: 'WhatsApp / Messenger', generation: 'millennials', points: 2 },
      { text: 'SMS / klic', generation: 'genX', points: 2 },
      { text: 'Telefonski klic', generation: 'boomers', points: 2 },
    ],
  },
  {
    id: 3,
    emoji: '🎵',
    text: 'Tvoj najljubši način poslušanja glasbe?',
    answers: [
      { text: 'Streaming (Spotify ipd.)', generation: 'genZ', points: 2 },
      { text: 'YouTube', generation: 'millennials', points: 2 },
      { text: 'MP3 / download', generation: 'genX', points: 2 },
      { text: 'Radio / CD', generation: 'boomers', points: 2 },
    ],
  },
  {
    id: 4,
    emoji: '📰',
    text: 'Kako spremljaš novice?',
    answers: [
      { text: 'TikTok / Instagram', generation: 'genZ', points: 2 },
      { text: 'Spletni portali', generation: 'millennials', points: 2 },
      { text: 'TV + splet', generation: 'genX', points: 2 },
      { text: 'TV dnevnik / časopis', generation: 'boomers', points: 2 },
    ],
  },
  {
    id: 5,
    emoji: '☁️',
    text: 'Kaj ti pomeni "cloud"?',
    answers: [
      { text: 'Nekaj samoumevnega', generation: 'genZ', points: 2 },
      { text: 'Uporabno orodje', generation: 'millennials', points: 2 },
      { text: 'Malo zmedeno', generation: 'genX', points: 2 },
      { text: 'Ne uporabljam', generation: 'boomers', points: 2 },
    ],
  },
  {
    id: 6,
    emoji: '🎬',
    text: 'Kako gledaš filme/serije?',
    answers: [
      { text: 'Streaming platforme', generation: 'genZ', points: 2 },
      { text: 'Netflix / binge', generation: 'millennials', points: 2 },
      { text: 'TV + download', generation: 'genX', points: 2 },
      { text: 'TV program', generation: 'boomers', points: 2 },
    ],
  },
  {
    id: 7,
    emoji: '📱',
    text: 'Tvoj odnos do družbenih omrežij?',
    answers: [
      { text: 'Sem skoraj stalno gor', generation: 'genZ', points: 2 },
      { text: 'Pogosto, ampak zmerno', generation: 'millennials', points: 2 },
      { text: 'Občasno', generation: 'genX', points: 2 },
      { text: 'Redko', generation: 'boomers', points: 2 },
    ],
  },
  {
    id: 8,
    emoji: '🤖',
    text: 'Kako se odzoveš na novo tehnologijo?',
    answers: [
      { text: 'Takoj preizkusim', generation: 'genZ', points: 2 },
      { text: 'Zanimivo, ampak počakam', generation: 'millennials', points: 2 },
      { text: 'Skeptično', generation: 'genX', points: 2 },
      { text: 'Ne zanima me', generation: 'boomers', points: 2 },
    ],
  },
  {
    id: 9,
    emoji: '🌐',
    text: 'Tvoj prvi stik z internetom?',
    answers: [
      { text: 'Od malega', generation: 'genZ', points: 2 },
      { text: 'V šoli', generation: 'millennials', points: 2 },
      { text: 'Kasneje v življenju', generation: 'genX', points: 2 },
      { text: 'Zelo pozno', generation: 'boomers', points: 2 },
    ],
  },
  {
    id: 10,
    emoji: '💼',
    text: 'Kaj ti pomeni delo?',
    answers: [
      { text: 'Fleksibilnost > stabilnost', generation: 'genZ', points: 2 },
      { text: 'Ravnotežje', generation: 'millennials', points: 2 },
      { text: 'Stabilnost', generation: 'genX', points: 2 },
      { text: 'Dolžnost', generation: 'boomers', points: 2 },
    ],
  },
  {
    id: 11,
    emoji: '🛒',
    text: 'Kako kupuješ stvari?',
    answers: [
      { text: 'Online vedno', generation: 'genZ', points: 2 },
      { text: 'Večinoma online', generation: 'millennials', points: 2 },
      { text: 'Kombinacija', generation: 'genX', points: 2 },
      { text: 'Fizične trgovine', generation: 'boomers', points: 2 },
    ],
  },
  {
    id: 12,
    emoji: '😂',
    text: 'Humor, ki ti je najbližji?',
    answers: [
      { text: 'Memi / absurd', generation: 'genZ', points: 2 },
      { text: 'Ironija', generation: 'millennials', points: 2 },
      { text: 'Situacijski humor', generation: 'genX', points: 2 },
      { text: 'Klasičen humor', generation: 'boomers', points: 2 },
    ],
  },
  {
    id: 13,
    emoji: '📅',
    text: 'Kako organiziraš svoj čas?',
    answers: [
      { text: 'Aplikacije', generation: 'genZ', points: 2 },
      { text: 'Koledar (digitalni)', generation: 'millennials', points: 2 },
      { text: 'Kombinacija', generation: 'genX', points: 2 },
      { text: 'Papir / rutina', generation: 'boomers', points: 2 },
    ],
  },
  {
    id: 14,
    emoji: '📚',
    text: 'Kako se učiš novih stvari?',
    answers: [
      { text: 'YouTube / TikTok', generation: 'genZ', points: 2 },
      { text: 'Online tečaji', generation: 'millennials', points: 2 },
      { text: 'Knjige + splet', generation: 'genX', points: 2 },
      { text: 'Knjige', generation: 'boomers', points: 2 },
    ],
  },
  {
    id: 15,
    emoji: '🌟',
    text: 'Kaj te najbolj opisuje?',
    answers: [
      { text: 'Hitrost & spremembe', generation: 'genZ', points: 2 },
      { text: 'Ambicija & razvoj', generation: 'millennials', points: 2 },
      { text: 'Stabilnost & odgovornost', generation: 'genX', points: 2 },
      { text: 'Tradicija & izkušnje', generation: 'boomers', points: 2 },
    ],
  },
];

export function calculateResult(scores: Record<Generation, number>): Generation {
  return (Object.entries(scores) as [Generation, number][]).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0];
}
