import { describe, expect, it } from "vitest";

import { ROWS, buildOptions, checkAnswer, answerText, filterRows } from "@/lib/geo";

const row = (city: string, code?: string) => ROWS.find((r) => r.city === city && (!code || r.codeRaw.includes(code)))!;

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
