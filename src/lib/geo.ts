import { CODE_ORIGINS, HINTS_RAW, LANGS_RAW, SECTIONS } from "./geo-raw";

export type CodeKind = "g" | "b" | "o" | "p";
export type Area = 1 | 2 | 3;

export interface GeoCode {
  c: string;
  kind: CodeKind;
}

export interface GeoRow {
  /** Same id format as the original study page, so saved progress carries over. */
  id: string;
  si: number;
  section: string;
  area: Area;
  country: string;
  state: string;
  /** City label exactly as in the handout (may contain footnote asterisks). */
  cityRaw: string;
  /** City label without footnote asterisks. */
  city: string;
  codeRaw: string;
  codes: GeoCode[];
}

const KIND: Record<string, CodeKind> = { "~": "b", "*": "o", "^": "p" };

export const CODE_KIND_LABEL: Record<CodeKind, string> = {
  g: "From city name",
  b: "Metro code",
  o: "Airport-name code",
  p: "Old/local name or odd",
};

export const AREA_LABEL: Record<Area, string> = {
  1: "TC1 Americas",
  2: "TC2 Europe / Middle East / Africa",
  3: "TC3 Asia-Pacific",
};

export const SECTION_NAMES = SECTIONS.map((s) => s[0]);
export const SECTIONS_META = SECTIONS.map(([name, area], si) => ({ si, name, area: area as Area }));

export function parseCodes(raw: string): GeoCode[] {
  return raw.split("/").map((c) => {
    const k = KIND[c.slice(-1)];
    return { c: k ? c.slice(0, -1) : c, kind: k ?? "g" };
  });
}

function buildRows(): GeoRow[] {
  const rows: GeoRow[] = [];
  SECTIONS.forEach(([name, a, txt], si) => {
    for (const line of txt.split("\n")) {
      const i = line.indexOf(": ");
      const country = line.slice(0, i);
      line
        .slice(i + 2)
        .split("; ")
        .forEach((e) => {
          const k = e.lastIndexOf(" ");
          const [cityRaw = "", state = ""] = e.slice(0, k).split("@");
          const codeRaw = e.slice(k + 1);
          rows.push({
            id: `${si}|${cityRaw}|${codeRaw}`,
            si,
            section: name,
            area: (country === "Maldives" ? 3 : a) as Area,
            country,
            state,
            cityRaw,
            city: cityRaw.replace(/\*/g, "").replace(/\s+/g, " ").trim(),
            codeRaw,
            codes: parseCodes(codeRaw),
          });
        });
    }
  });
  return rows;
}

export const ROWS: GeoRow[] = buildRows();

export { CODE_ORIGINS, QUIZ_CODE_ORIGINS } from "./geo-raw";

/** Highlight only when every code letter appears in order; never show a partial match. */
export function codeLetterIndices(name: string, code: string): number[] {
  const letters = Array.from(name);
  const indices: number[] = [];
  let cursor = 0;
  for (const letter of code.toLowerCase()) {
    const index = letters.findIndex((c, i) => i >= cursor && normalize(c) === letter);
    if (index < 0) return [];
    indices.push(index);
    cursor = index + 1;
  }
  return indices;
}

export type Difficulty = "easy" | "medium" | "hard";
export const DIFFICULTIES = [
  { value: "easy", label: "Easy", choices: 3, hint: true, attempts: Infinity, note: "First-letter hint · 3 choices from anywhere · retry typing" },
  { value: "medium", label: "Medium", choices: 4, hint: false, attempts: Infinity, note: "No hints · 4 choices, preferably from the same TC area · retry typing" },
  { value: "hard", label: "Hard", choices: 6, hint: false, attempts: 1, note: "No hints or location clues · 6 choices, preferably from the same section · one typing attempt" },
] as const;

/* ---------- Pronunciation hints & languages ---------- */

export const HINTS: Record<string, string> = {};
HINTS_RAW.split(";").forEach((s) => {
  const i = s.indexOf("=");
  HINTS[s.slice(0, i)] = s.slice(i + 1);
});

const LANG_BY_COUNTRY: Record<string, string> = {};
LANGS_RAW.split(";").forEach((s) => {
  const [l = "en-US", c = ""] = s.split(":");
  c.split(",").forEach((x) => (LANG_BY_COUNTRY[x] = l));
});
const LANG_OVERRIDE: Record<string, string> = {
  Montreal: "fr-CA",
  Brussels: "fr-BE",
  Geneva: "fr-CH",
};

export function cityLang(row: GeoRow, voice: "local" | "en"): string {
  if (voice === "en") return "en-US";
  return LANG_OVERRIDE[row.city] ?? LANG_BY_COUNTRY[row.country] ?? "en-US";
}

const SPOKEN: Record<string, string> = { UAE: "United Arab Emirates", "Hong Kong SAR": "Hong Kong" };
export function spokenName(s: string): string {
  return (SPOKEN[s] ?? s)
    .replace(/\*/g, "")
    .replace(/\(.*?\)/g, "")
    .replace("Rep.", "Republic")
    .replace("D.C.", "D C")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ---------- Answer checking ---------- */

export type Field = "area" | "country" | "state" | "city" | "code";

const COUNTRY_ALIASES: Record<string, string[]> = {
  "United States": ["usa", "us", "america", "unitedstatesofamerica"],
  UAE: ["unitedarabemirates"],
  "Dominican Rep.": ["dominicanrepublic"],
  "Central African Rep.": ["centralafricanrepublic"],
  "Hong Kong SAR": ["hongkong", "hongkongchina"],
  "Congo Brazzaville": ["congo", "republicofthecongo"],
  Türkiye: ["turkey"],
  "Czech Republic": ["czechia"],
  "Côte d’Ivoire": ["ivorycoast"],
  "Sint Maarten": ["stmaarten", "saintmaarten"],
};

export const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

/** Same rules as the original study page: any listed code counts, names ignore accents/punctuation. */
export function checkField(field: Field, row: GeoRow, value: string): boolean {
  if (field === "code") {
    const cs = row.codes.map((c) => c.c.toLowerCase());
    const t = value.toLowerCase().split(/[\s,/]+/).filter(Boolean);
    return t.length > 0 && t.every((x) => cs.includes(x));
  }
  const x = normalize(value);
  if (!x) return false;
  if (field === "area") return [String(row.area), `tc${row.area}`, `area${row.area}`].includes(x);
  const base = field === "country" ? row.country : field === "state" ? row.state : row.city;
  let list = [base];
  if (field === "state") list = list.concat(base.split(" – "));
  if (field === "city") list.push(base.replace(/\(.*?\)/g, ""), base.split("-")[0] ?? base, base.split("/")[0] ?? base);
  if (field === "country") list = list.concat(COUNTRY_ALIASES[base] ?? []);
  return list.map(normalize).includes(x);
}

/* ---------- Quiz directions ---------- */

export type Direction = "city-code" | "code-city" | "city-country" | "city-area";

export const DIRECTIONS: { id: Direction; label: string; short: string }[] = [
  { id: "city-code", label: "City → code", short: "Guess the code" },
  { id: "code-city", label: "Code → city", short: "Guess the city" },
  { id: "city-country", label: "City → country", short: "Guess the country" },
  { id: "city-area", label: "City → TC area", short: "Guess the area" },
];

export const answerField = (d: Direction): Field =>
  d === "city-code" ? "code" : d === "code-city" ? "city" : d === "city-country" ? "country" : "area";

export function answerText(row: GeoRow, d: Direction): string {
  switch (d) {
    case "city-code":
      return row.codes.map((c) => c.c).join(" / ");
    case "code-city":
      return row.city;
    case "city-country":
      return row.country;
    case "city-area":
      return `TC${row.area}`;
  }
}

/** Text that identifies the question, used so two choices never look like the same prompt. */
export function promptKey(row: GeoRow, d: Direction): string {
  return d === "code-city" ? row.codeRaw : `${row.city}|${row.country}`;
}

export function checkAnswer(row: GeoRow, d: Direction, value: string): boolean {
  return checkField(answerField(d), row, value);
}

/* ---------- Filters & question building ---------- */

export type Progress = Record<string, "k" | "m">;
export type RowFilter = "all" | "unknown" | "missed";

/** Empty array (or "all") means no filtering on that dimension. */
export type SectionFilter = number | "all" | number[];
export type AreaFilter = Area | "all" | Area[];

export interface QuizSettings {
  difficulty: Difficulty;
  direction: Direction;
  /** Selected section indexes; empty = all sections. */
  sections: number[];
  /** Selected TC areas; empty = all areas. */
  areas: Area[];
  rows: RowFilter;
  count: number | "all";
}

export const DEFAULT_SETTINGS: QuizSettings = {
  difficulty: "medium",
  direction: "city-code",
  sections: [],
  areas: [],
  rows: "all",
  count: 20,
};

function toSet<T extends number>(v: T | "all" | T[]): Set<T> | null {
  if (v === "all" || (Array.isArray(v) && v.length === 0)) return null;
  return new Set(Array.isArray(v) ? v : [v]);
}

export function filterRows(settings: { section?: SectionFilter; sections?: number[]; area?: AreaFilter; areas?: Area[]; rows: RowFilter }, progress: Progress): GeoRow[] {
  const sections = toSet(settings.sections ?? settings.section ?? "all");
  const areas = toSet(settings.areas ?? settings.area ?? "all");
  return ROWS.filter(
    (r) =>
      (!sections || sections.has(r.si)) &&
      (!areas || areas.has(r.area)) &&
      (settings.rows === "all" ||
        (settings.rows === "missed" && progress[r.id] === "m") ||
        (settings.rows === "unknown" && progress[r.id] !== "k")),
  );
}

export function shuffle<T>(arr: T[], rand: () => number = Math.random): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const t = a[i] as T;
    a[i] = a[j] as T;
    a[j] = t;
  }
  return a;
}

export function pickQuestions(settings: QuizSettings, progress: Progress, rand: () => number = Math.random): GeoRow[] {
  const rows = shuffle(filterRows(settings, progress), rand);
  return settings.count === "all" ? rows : rows.slice(0, settings.count);
}

/**
 * Multiple-choice options: the correct answer plus distinct distractors.
 * Distractors never share the correct answer text or the same prompt (e.g. Chicago ORD vs MDW).
 * Code distractors resemble the answer or a plausible city abbreviation, but never
 * accept another listed code for that city as a wrong answer.
 */
export function buildOptions(row: GeoRow, d: Direction, rand: () => number = Math.random, n = 4, difficulty: Difficulty = "medium"): string[] {
  const correct = answerText(row, d);
  if (d === "city-area") return ["TC1", "TC2", "TC3"];
  const key = promptKey(row, d);
  const seen = new Set([correct]);
  const out: string[] = [];
  if (d === "city-code") {
    const valid = new Set(ROWS.filter((r) => r.city === row.city).flatMap((r) => r.codes.map((c) => c.c)));
    const add = (text: string) => {
      if (out.length >= n - 1 || text.length !== 3 || valid.has(text) || seen.has(text)) return;
      seen.add(text);
      out.push(text);
    };
    const cityLetters = normalize(row.city).toUpperCase();
    add(cityLetters.slice(0, 3));
    const base = row.codes[0]?.c ?? "";
    // Single-letter changes are deliberate quiz decoys, not additions to the handout.
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const candidates = shuffle(Array.from(alphabet).flatMap((letter) =>
      [0, 1, 2].map((i) => base.slice(0, i) + letter + base.slice(i + 1))), rand);
    for (const candidate of candidates) add(candidate);
    return shuffle([correct, ...out], rand);
  }
  const near = shuffle(
    ROWS.filter((r) => difficulty === "easy" || (difficulty === "hard" ? r.si === row.si : r.area === row.area)),
    rand,
  );
  const far = shuffle(
    ROWS.filter((r) => difficulty !== "easy" && (difficulty === "hard" ? r.si !== row.si : r.area !== row.area)),
    rand,
  );
  const similarity = (text: string) => {
    const a = normalize(correct), b = normalize(text);
    return Array.from(a).reduce((score, letter, i) => score + (b[i] === letter ? 3 : b.includes(letter) ? 1 : 0), 0);
  };
  const candidates = [...near, ...far].sort((a, b) => similarity(answerText(b, d)) - similarity(answerText(a, d)));
  for (const r of candidates) {
    if (out.length >= n - 1) break;
    const t = answerText(r, d);
    if (seen.has(t) || promptKey(r, d) === key || checkAnswer(row, d, t)) continue;
    if (d === "code-city" && r.city === row.city) continue;
    seen.add(t);
    out.push(t);
  }
  return shuffle([correct, ...out], rand);
}
