import { createFileRoute } from "@tanstack/react-router";
import { Check, ChevronDown, X } from "lucide-react";
import { useMemo, useState } from "react";

import { CodeMemory, MemoryName, needsCodeMemory } from "@/components/geo/CodeMemory";
import { AreaBadge, CodeChip, CodeChips, Legend } from "@/components/geo/bits";
import { Button } from "@/components/ui/button";
import { ROWS, SECTIONS_META, filterRows, type RowFilter } from "@/lib/geo";
import { useProgress } from "@/lib/progress";
import { KIND_INFO, KIND_ORDER, codesOfKind, countByKind, exampleRow } from "@/lib/review";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Review guide · World Geography Codes" },
      {
        name: "description",
        content: "Review city and airport codes, code origins, and the complete geography handout.",
      },
      { property: "og:title", content: "Review guide · World Geography Codes" },
      {
        property: "og:description",
        content: "Review city and airport codes, code origins, and the complete geography handout.",
      },
    ],
  }),
  component: ReviewPage,
});

const LINKS = [
  { href: "#origins", label: "Why these codes?" },
  { href: "#types", label: "Code colors" },
  { href: "#cheat", label: "Tricky codes" },
  { href: "#sheet", label: "Full review sheet" },
] as const;

function ReviewPage() {
  const progress = useProgress();
  const counts = useMemo(countByKind, []);
  const [rowsFilter, setRowsFilter] = useState<RowFilter>("all");
  const [open, setOpen] = useState<Record<number, boolean>>({});

  const rows = useMemo(
    () => filterRows({ section: "all", area: "all", rows: rowsFilter }, progress),
    [rowsFilter, progress],
  );
  const groups = useMemo(
    () =>
      SECTIONS_META.map((s) => ({ ...s, rows: rows.filter((r) => r.si === s.si) })).filter((g) => g.rows.length > 0),
    [rows],
  );
  const setAll = (value: boolean) => setOpen(Object.fromEntries(SECTIONS_META.map((s) => [s.si, value])));

  return (
    <main className="page">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Review guide</h1>
      <p className="help mt-2 max-w-2xl">
        {ROWS.length} cities from the handout, with code origins and a full review sheet.
      </p>

      <nav aria-label="On this page" className="mt-5 flex flex-wrap gap-2">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium hover:border-foreground/40 hover:bg-muted"
          >
            {l.label}
          </a>
        ))}
      </nav>

      <section id="origins" className="mt-10 scroll-mt-32">
        <h2 className="section-title">Why these codes?</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {["Mumbai", "Beijing", "Ho Chi Minh", "Guangzhou", "Saint Petersburg", "Chicago", "Tokyo", "Paris", "Toronto"].map((city) => {
            const row = exampleRow(city);
            return row ? <article key={city} className="panel grid content-start gap-3"><h3 className="text-lg font-bold">{row.city}</h3><CodeMemory row={row} /></article> : null;
          })}
        </div>
      </section>

      {/* 2. Code colors */}
      <section id="types" className="mt-12 scroll-mt-20">
        <h2 className="section-title">What the code colors mean</h2>
        <p className="help mt-1 max-w-2xl">
          Every code in the tables has a color. The color tells you where the code comes from, and that tells you how to
          remember it.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {KIND_ORDER.map((k) => {
            const info = KIND_INFO[k];
            return (
              <div key={k} className="panel grid content-start gap-3">
                <div>
                  <h3 className="text-lg font-bold">{info.title}</h3>
                  <p className="help mt-0.5">{counts[k]} codes in the handout</p>
                </div>
                <p>{info.rule}</p>
                <p>
                  <b>How to remember:</b> {info.trick}
                </p>
                <div className="grid gap-1.5">
                  <span className="field-label">Examples</span>
                  {info.examples.map((city) => {
                    const r = exampleRow(city);
                    if (!r) return null;
                    return (
                      <div key={city} className="flex flex-wrap items-center gap-2">
                        <span className="min-w-28 font-semibold"><MemoryName name={r.city} code={r.codes[0]?.c ?? ""} /></span>
                        <CodeChips codes={r.codes} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Cheat lists */}
      <section id="cheat" className="mt-12 scroll-mt-20">
        <h2 className="section-title">Tricky codes in one place</h2>
        <p className="help mt-1 max-w-2xl">
          Green codes mostly guess themselves, so these three lists hold the codes worth extra time. Learn one list at a
          time.
        </p>
        <div className="mt-4 grid gap-3">
          {(["b", "p", "o"] as const).map((k) => {
            const entries = codesOfKind(k);
            return (
              <details key={k} className="panel group" >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-bold">
                  <span>
                    {KIND_INFO[k].title} <span className="font-normal text-muted-foreground">({entries.length})</span>
                  </span>
                  <ChevronDown className="size-5 shrink-0 transition group-open:rotate-180" />
                </summary>
                <div className="mt-4 flex flex-wrap gap-2">
                  {entries.map(({ row, code }) => (
                    <span
                      key={`${row.id}-${code}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-card py-1 pl-3 pr-1 text-sm"
                    >
                      {row.city}
                      <CodeChip code={{ c: code, kind: k }} />
                    </span>
                  ))}
                </div>
              </details>
            );
          })}
        </div>
      </section>

      {/* 6. Full sheet */}
      <section id="sheet" className="mt-12 scroll-mt-20">
        <h2 className="section-title">Full review sheet</h2>
        <p className="help mt-1 max-w-2xl">
          Every row from the handout, grouped by section. Nothing is hidden here, so use it to read and learn first,
          then quiz yourself.
        </p>
        <div className="mt-4 grid gap-4">
          <Legend />
          <div className="flex flex-wrap items-center gap-2">
            <span className="field-label">Show:</span>
            {(
              [
                ["all", "All rows"],
                ["unknown", "Not yet known"],
                ["missed", "Only rows I missed"],
              ] as const
            ).map(([v, label]) => (
              <Button
                key={v}
                variant={rowsFilter === v ? "pill-active" : "pill"}
                aria-pressed={rowsFilter === v}
                onClick={() => setRowsFilter(v)}
              >
                {label}
              </Button>
            ))}
            <span className="mx-1 hidden h-6 w-px bg-border sm:block" />
            <Button variant="pill" onClick={() => setAll(true)}>
              Open all sections
            </Button>
            <Button variant="pill" onClick={() => setAll(false)}>
              Close all sections
            </Button>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          {groups.length === 0 && (
            <p className="panel help">No rows match. Mark rows ✗ in a quiz and they will show up here.</p>
          )}
          {groups.map((g) => (
            <details
              key={g.si}
              className="panel group overflow-hidden p-0"
              open={open[g.si] ?? false}
              onToggle={(e) => {
                const isOpen = e.currentTarget.open;
                setOpen((o) => (o[g.si] === isOpen ? o : { ...o, [g.si]: isOpen }));
              }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
                <span className="flex min-w-0 flex-wrap items-center gap-2">
                  <AreaBadge area={g.area} />
                  <span className="font-bold">{g.name}</span>
                  <span className="text-sm text-muted-foreground">{g.rows.length} rows</span>
                </span>
                <ChevronDown className="size-5 shrink-0 transition group-open:rotate-180" />
              </summary>
              <div className="overflow-x-auto border-t border-border">
                <table className="study-table review-table w-full min-w-[480px] border-separate border-spacing-0 text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="bg-muted px-4 py-2 font-semibold">Country</th>
                      <th className="bg-muted px-4 py-2 font-semibold">City</th>
                      <th className="bg-muted px-4 py-2 font-semibold">Code</th>
                      <th className="bg-muted px-4 py-2 font-semibold">Your mark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.rows.map((r) => {
                      const mark = progress[r.id];
                      return (
                        <tr key={r.id} className={cn(mark === "m" && "bg-destructive/10")}>
                          <td className="border-b border-border px-4 py-2 font-semibold"><span className="mobile-table-label">Country</span>{r.country}</td>
                          <td className="border-b border-border px-4 py-2">
                            <span className="mobile-table-label">City</span>
                            <MemoryName name={r.city} code={r.codes[0]?.c ?? ""} />
                            {r.state && <span className="text-muted-foreground"> · {r.state}</span>}
                          </td>
                          <td className="border-b border-border px-4 py-2">
                            <span className="mobile-table-label">Code</span><CodeChips codes={r.codes} />
                            {needsCodeMemory(r) && <details className="mt-2"><summary className="cursor-pointer text-xs text-primary">Code origin</summary><div className="mt-2"><CodeMemory row={r} /></div></details>}
                          </td>
                          <td className="border-b border-border px-4 py-2">
                            <span className="mobile-table-label">Your mark</span>
                            {mark === "k" ? (
                              <span className="inline-flex items-center gap-1 text-success">
                                <Check className="size-4" /> Known
                              </span>
                            ) : mark === "m" ? (
                              <span className="inline-flex items-center gap-1 text-destructive">
                                <X className="size-4" /> Missed
                              </span>
                            ) : (
                              <span className="text-muted-foreground">Not marked</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
