import { describe, expect, it } from "vitest";

import { ROWS, buildOptions, checkAnswer, answerText, filterRows, codeLetterIndices, CODE_ORIGINS, DIFFICULTIES } from "@/lib/geo";

const row = (city: string, code?: string) => {
  const found = ROWS.find((r) => r.city === city && (!code || r.codeRaw.includes(code)));
  if (!found) throw new Error(`Missing row: ${city}`);
  return found;
};

describe("memory aids", () => {
  it("highlights S-I-N in Singapore", () => {
    expect(codeLetterIndices("Singapore", "SIN")).toEqual([0, 1, 2]);
  });
  it("explains Mumbai BOM using the former name Bombay", () => {
    expect(CODE_ORIGINS["BOM"]?.name).toBe("Bombay");
    expect(codeLetterIndices(CODE_ORIGINS["BOM"]?.name ?? "", "BOM")).toEqual([0, 1, 2]);
    expect(codeLetterIndices("Mumbai", "BOM")).toEqual([]);
  });
  it("does not highlight incomplete matches", () => {
    expect(codeLetterIndices("Los Angeles", "LAX")).toEqual([]);
  });
});

describe("difficulty", () => {
  for (const difficulty of DIFFICULTIES) {
    it(`${difficulty.value} has ${difficulty.choices} distinct choices`, () => {
      const opts = buildOptions(row("Singapore"), "city-code", () => .5, difficulty.choices, difficulty.value);
      expect(opts).toHaveLength(difficulty.choices);
      expect(new Set(opts).size).toBe(difficulty.choices);
      expect(opts).toContain("SIN");
    });
  }
  it("easy provides hints, medium and hard do not", () => {
    expect(DIFFICULTIES.map((d) => d.hint)).toEqual([true, false, false]);
  });
  it("hard permits only one typing attempt", () => {
    expect(DIFFICULTIES.find((d) => d.value === "hard")?.attempts).toBe(1);
  });
  it("area questions keep the three real areas even on hard", () => {
    expect(buildOptions(row("Singapore"), "city-area", Math.random, 6, "hard")).toEqual(["TC1", "TC2", "TC3"]);
  });
});

describe("answer checking", () => {
  it("accepts any one of a city's codes, case-insensitive", () => {
    const ny = row("New York");
    expect(checkAnswer(ny, "city-code", "jfk")).toBe(true);
    expect(checkAnswer(ny, "city-code", "NYC")).toBe(true);
    expect(checkAnswer(ny, "city-code", "EWR")).toBe(false);
  });

  it("ignores accents when typing a city", () => {
    expect(checkAnswer(row("São Paulo"), "code-city", "sao paulo")).toBe(true);
  });

  it("accepts Turkey for Türkiye", () => {
    expect(checkAnswer(row("Istanbul"), "city-country", "Turkey")).toBe(true);
  });

  it("puts Maldives in TC3 even though it's listed under the Indian Ocean (TC2) section", () => {
    expect(answerText(row("Male"), "city-area")).toBe("TC3");
  });
});

describe("multiple choice options", () => {
  it("gives 4 unique options including the right one", () => {
    const r = row("Los Angeles");
    const opts = buildOptions(r, "city-code");
    expect(opts).toHaveLength(4);
    expect(new Set(opts).size).toBe(4);
    expect(opts).toContain("LAX");
  });

  it("never offers Chicago's other airport as a wrong choice for Chicago", () => {
    const ord = row("Chicago", "ORD");
    for (let i = 0; i < 30; i++) expect(buildOptions(ord, "city-code")).not.toContain("MDW");
  });
});

describe("filters", () => {
  it("'missed only' returns just rows marked missed", () => {
    const id = row("Manila").id;
    const out = filterRows({ section: "all", area: "all", rows: "missed" }, { [id]: "m" });
    expect(out.map((r) => r.id)).toEqual([id]);
  });
});
