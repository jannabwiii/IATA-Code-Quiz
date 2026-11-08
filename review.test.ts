import { describe, expect, it } from "vitest";

import { ROWS, SECTIONS_META } from "@/lib/geo";
import { STUDY_DAYS, codesOfKind, countByKind, exampleRow } from "@/lib/review";

describe("review data", () => {
  it("lists each blue metro code once", () => {
    const codes = codesOfKind("b").map((e) => e.code);
    expect(new Set(codes).size).toBe(codes.length);
    expect(codes).toContain("NYC");
    expect(codes).toContain("LON");
  });

  it("counts every code exactly once across the four colors", () => {
    const c = countByKind();
    const total = ROWS.reduce((n, r) => n + r.codes.length, 0);
    expect(c.g + c.b + c.o + c.p).toBe(total);
  });

  it("finds the rows used as examples", () => {
    for (const city of ["Manila", "Dublin", "New York", "Paris", "Mumbai", "Toronto"]) {
      expect(exampleRow(city), city).toBeDefined();
    }
  });

  it("the 7-day plan covers every section exactly once", () => {
    const planned = STUDY_DAYS.flatMap((d) => d.sections).sort((a, b) => a - b);
    expect(planned).toEqual(SECTIONS_META.map((s) => s.si));
  });
});
