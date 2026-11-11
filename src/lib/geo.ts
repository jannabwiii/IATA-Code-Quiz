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

export { CODE_ORIGINS };

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

export interface QuizSettings {
  direction: Direction;
  section: number | "all";
  area: Area | "all";
  rows: RowFilter;
  count: number | "all";
}

export const DEFAULT_SETTINGS: QuizSettings = {
  direction: "city-code",
  section: "all",
  area: "all",
  rows: "all",
  count: 20,
};

export function filterRows(settings: Pick<QuizSettings, "section" | "area" | "rows">, progress: Progress): GeoRow[] {
  return ROWS.filter(
    (r) =>
      (settings.section === "all" || r.si === settings.section) &&
      (settings.area === "all" || r.area === settings.area) &&
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

/** Code distractors are deliberate near-misses, not necessarily real airport codes. */
export function buildOptions(row: GeoRow, d: Direction, rand: () => number = Math.random): string[] {
  const correct = answerText(row, d);
  if (d === "city-area") return ["TC1", "TC2", "TC3"];
  const seen = new Set([correct]);
  const out: string[] = [];
  if (d === "city-code") {
    const base = row.codes[0]?.c ?? "";
    const candidates: string[] = [];
    for (let i = 0; i < base.length; i++) {
      for (const letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
        if (letter !== base[i]) candidates.push(base.slice(0, i) + letter + base.slice(i + 1));
      }
      if (i + 1 < base.length) {
        const letters = Array.from(base);
        const left = letters[i];
        const right = letters[i + 1];
        if (left && right) {
          letters[i] = right;
          letters[i + 1] = left;
          candidates.push(letters.join(""));
        }
      }
    }
    // Exclude every valid code for this city, including separate airport rows.
    const valid = new Set(ROWS.filter((r) => r.city === row.city && r.country === row.country).flatMap((r) => r.codes.map((c) => c.c)));
    for (const candidate of shuffle(candidates, rand)) {
      if (seen.has(candidate) || valid.has(candidate)) continue;
      seen.add(candidate);
      out.push(candidate);
      if (out.length === 3) break;
    }
  } else {
    const key = promptKey(row, d);
    const near = shuffle(ROWS.filter((r) => r.area === row.area), rand);
    const far = shuffle(ROWS.filter((r) => r.area !== row.area), rand);
    for (const r of [...near, ...far]) {
      const text = answerText(r, d);
      if (seen.has(text) || promptKey(r, d) === key || checkAnswer(row, d, text)) continue;
      seen.add(text);
      out.push(text);
      if (out.length === 3) break;
    }
  }
  return shuffle([correct, ...out], rand);
}

/** Only complete code matches are emphasized, and never while a table code is hidden. */
export function memoryLetterIndices(name: string, codes: string[], visible = true): number[] {
  return visible ? [...new Set(codes.flatMap((code) => codeLetterIndices(name, code)))].sort((a, b) => a - b) : [];
}
