import { ROWS, SECTIONS_META, type CodeKind, type GeoRow } from "./geo";

/** Everything on the review page is computed from ROWS, so a data fix in geo-raw.ts updates it too. */

export interface CodeEntry {
  row: GeoRow;
  code: string;
}

export const KIND_ORDER: CodeKind[] = ["g", "b", "o", "p"];

export const KIND_INFO: Record<CodeKind, { title: string; rule: string; trick: string; examples: string[] }> = {
  g: {
    title: "Green: spelled from the city name",
    rule: "The code is made from letters in the city name, usually the first letters or the main consonants.",
    trick: "Say the city, then picture its letters with the vowels dropped. These mostly guess themselves, so spend the least time here.",
    examples: ["Manila", "Dublin", "Lisbon", "Bangkok"],
  },
  b: {
    title: "Blue: metro code for the whole city",
    rule: "One code that stands for every airport in a big city. The airports then have their own codes after it.",
    trick: "When a city lists two or more codes, the first one is usually the metro code. Learn the short blue list as one group.",
    examples: ["New York", "Tokyo", "Seoul", "Rome"],
  },
  o: {
    title: "Orange: named after the airport",
    rule: "The code comes from the airport’s own name, not the city’s. Think of a person, a district, or an old site.",
    trick: "Link each code to the airport name: JFK is John F. Kennedy, CDG is Charles de Gaulle, NRT is Narita.",
    examples: ["Paris", "Tokyo", "Chicago", "Istanbul"],
  },
  p: {
    title: "Purple: old or local name, or an odd code",
    rule: "The code does not match the English city name. It usually comes from an older name or a local-language name.",
    trick: "Learn the story behind each one. Bombay gives BOM, Peking gives PEK, Saigon gives SGN, and Canadian codes start with Y.",
    examples: ["Mumbai", "Beijing", "Ho Chi Minh", "Toronto"],
  },
};

/** Finds a row by city name so examples always show the real code from the data. */
export function exampleRow(city: string): GeoRow | undefined {
  return ROWS.find((r) => r.city === city || r.city.startsWith(`${city}-`));
}

/** Every code of one color, one entry per code (so London’s LON appears once). */
export function codesOfKind(kind: CodeKind): CodeEntry[] {
  const seen = new Set<string>();
  const out: CodeEntry[] = [];
  for (const row of ROWS) {
    for (const c of row.codes) {
      if (c.kind !== kind || seen.has(c.c)) continue;
      seen.add(c.c);
      out.push({ row, code: c.c });
    }
  }
  return out;
}

export function countByKind(): Record<CodeKind, number> {
  const out: Record<CodeKind, number> = { g: 0, b: 0, o: 0, p: 0 };
  for (const row of ROWS) for (const c of row.codes) out[c.kind] += 1;
  return out;
}

/** A 7-day plan. Each day lists the section numbers to study (see SECTIONS_META for names). */
export const STUDY_DAYS: { day: string; focus: string; sections: number[] }[] = [
  { day: "Day 1", focus: "North America and the Caribbean", sections: [0, 1] },
  { day: "Day 2", focus: "South America and North Europe", sections: [2, 3] },
  { day: "Day 3", focus: "Central, Eastern and Southern Europe", sections: [4, 5] },
  { day: "Day 4", focus: "France, Africa, Indian Ocean, Middle East", sections: [6, 7, 8, 9] },
  { day: "Day 5", focus: "Asia, Australia and the Pacific", sections: [10, 11] },
  { day: "Day 6", focus: "Everything you marked ✗ so far", sections: [] },
  { day: "Day 7", focus: "Full test: every row, all columns hidden", sections: [] },
];

export const sectionName = (si: number) => SECTIONS_META[si]?.name ?? "";
