import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChevronDown, X } from "lucide-react";
import { useMemo, useState } from "react";

import { CodeMemory, MemoryName } from "@/components/geo/CodeMemory";
import { AreaBadge, CodeChip, CodeChips, Legend } from "@/components/geo/bits";
import { Button } from "@/components/ui/button";
import { ROWS, SECTIONS_META, filterRows, type RowFilter } from "@/lib/geo";
import { useProgress } from "@/lib/progress";
import { KIND_INFO, KIND_ORDER, STUDY_DAYS, codesOfKind, countByKind, exampleRow, sectionName } from "@/lib/review";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Review guide · World Geography Codes" },
      {
        name: "description",
        content: "How to memorize the city and airport codes: a step-by-step method, cheat lists and a 7-day plan.",
      },
      { property: "og:title", content: "Review guide · World Geography Codes" },
      {
        property: "og:description",
        content: "How to memorize the city and airport codes: a step-by-step method, cheat lists and a 7-day plan.",
      },
    ],
  }),
  component: ReviewPage,
});

const STEPS = [
  {
    title: "Read one section out loud",
    body: "Open a section in the review sheet below and read each city and code aloud. Use the Pronounce page if you are unsure how a name sounds. Do one section at a time, not the whole handout.",
    to: "/pronounce",
    cta: "Open Pronounce",
  },
  {
    title: "Pick a code",
    body: "Practice one section with Multiple Choice, then test recall with Typing.",
    to: "/multiple-choice",
    cta: "Quiz",
  },
  {
    title: "Pick, then type",
    body: "Multiple choice checks that you recognize the code. Typing checks that you can produce it from nothing, which is the real test. Do both on the same section.",
    to: "/multiple-choice",
    cta: "Try multiple choice",
  },
  {
    title: "Repeat only what you missed",
    body: "In any quiz, set the rows option to “Missed”. A short round of your weak spots beats another long round of things you already know.",
    to: "/type-it",
    cta: "Open Type the answer",
  },
  {
    title: "Test the whole handout",
    body: "In the Table drill, hide every column and fill in the full tables. Repeat on later days until the ✗ count stops growing.",
    to: "/tables",
    cta: "Open Table drill",
  },
] as const;

const TRICKS = [
  {
    title: "Test yourself instead of rereading",
    body: "Trying to remember an answer builds memory better than looking at it again. That is why the quizzes hide the answer first.",
  },
  {
    title: "Short sessions, most days",
    body: "10 to 15 minutes a day usually works better than one long session. Spreading practice over several days is what makes codes stick.",
  },
  {
    title: "Work in small groups",
    body: "Learn 10 to 15 rows at a time. Use the Section filter so each round covers one region.",
  },
  {
    title: "Practice both directions",
    body: "Knowing city → code does not guarantee code → city. Run each section both ways.",
  },
  {
    title: "Make a story for the odd ones",
    body: "For purple codes, say the old name first: Bombay → BOM, Peking → PEK, Saigon → SGN, Canton → CAN, Leningrad → LED.",
  },
  {
    title: "Say the code letter by letter",
    body: "On the Pronounce page, tap a code chip to hear it spelled. Hearing “M, N, L” helps when you will say codes on a call.",
  },
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
      <h1 className="text-3xl font-extrabold sm:text-4xl">Review</h1>
      <details id="origins" className="review-section group mt-5 border-t border-border pt-3"><summary className="grid min-h-14 cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-3 font-display text-xl font-bold"><span>Code stories</span><ChevronDown className="size-5 shrink-0 transition group-open:rotate-180" /></summary>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {["Mumbai", "Beijing", "Ho Chi Minh", "Guangzhou", "Saint Petersburg", "Chicago", "Tokyo", "Paris", "Toronto"].map((city) => {
            const row = exampleRow(city);
            return row ? <article key={city} className="panel grid content-start gap-3"><h3 className="text-lg font-bold">{row.city}</h3><CodeMemory row={row} /></article> : null;
          })}
        </div>
      </details>

      {/* 1. Method */}
      <details id="method" className="review-section group mt-5 border-t border-border pt-3"><summary className="grid min-h-14 cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-3 font-display text-xl font-bold"><span>Study method</span><ChevronDown className="size-5 shrink-0 transition group-open:rotate-180" /></summary>
        <p className="help mt-1">Do these in order. Each step has a button that opens the right quiz.</p>
        <ol className="mt-4 grid gap-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="panel flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-4">
                <span
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary font-mono font-bold text-secondary-foreground"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-bold">{s.title}</h3>
                  <p className="help mt-0.5 max-w-xl">{s.body}</p>
                </div>
              </div>
              <Button asChild variant="ink" size="lg" className="shrink-0">
                <Link to={s.to}>{s.cta}</Link>
              </Button>
            </li>
          ))}
        </ol>
      </details>

      {/* 2. Code colors */}
      <details id="types" className="review-section group mt-5 border-t border-border pt-3"><summary className="grid min-h-14 cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-3 font-display text-xl font-bold"><span>Code colors</span><ChevronDown className="size-5 shrink-0 transition group-open:rotate-180" /></summary>
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
                        <span className="min-w-28 font-semibold"><MemoryName name={r.city} codes={r.codes.map((code) => code.c)} /></span>
                        <CodeChips codes={r.codes} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </details>

      {/* 3. Cheat lists */}
      <details id="cheat" className="review-section group mt-5 border-t border-border pt-3"><summary className="grid min-h-14 cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-3 font-display text-xl font-bold"><span>Tricky codes</span><ChevronDown className="size-5 shrink-0 transition group-open:rotate-180" /></summary>
        <p className="help mt-1 max-w-2xl">
          Green codes mostly guess themselves, so these three lists hold the codes worth extra time. Learn one list at a
          time.
        </p>
        <div className="mt-4 grid gap-3">
          {(["b", "p", "o"] as const).map((k) => {
            const entries = codesOfKind(k);
            return (
              <details key={k} className="panel group">
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
      </details>

      {/* 4. Plan */}
      <details id="plan" className="review-section group mt-5 border-t border-border pt-3"><summary className="grid min-h-14 cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-3 font-display text-xl font-bold"><span>7-day plan</span><ChevronDown className="size-5 shrink-0 transition group-open:rotate-180" /></summary>
        <p className="help mt-1 max-w-2xl">
          About 15 minutes a day. On each day run the 5-step method on the sections listed. If you miss a day, pick up
          where you stopped.
        </p>
        <ul className="mt-4 grid gap-2">
          {STUDY_DAYS.map((d) => (
            <li key={d.day} className="panel flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-5">
              <span className="w-16 shrink-0 font-display text-lg font-extrabold">{d.day}</span>
              <div>
                <div className="font-semibold">{d.focus}</div>
                {d.sections.length > 0 && (
                  <div className="help">{d.sections.map((si) => sectionName(si)).join(" · ")}</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </details>

      {/* 5. Tricks */}
      <details id="tricks" className="review-section group mt-5 border-t border-border pt-3"><summary className="grid min-h-14 cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-3 font-display text-xl font-bold"><span>Study tips</span><ChevronDown className="size-5 shrink-0 transition group-open:rotate-180" /></summary>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {TRICKS.map((t) => (
            <div key={t.title} className="panel">
              <h3 className="font-bold">{t.title}</h3>
              <p className="help mt-1">{t.body}</p>
            </div>
          ))}
        </div>
        <div className="panel mt-3">
          <h3 className="font-bold">Schengen countries</h3>
          <p className="help mt-1 max-w-2xl">
            Remember it as 25 EU countries plus 4 that are not in the EU: Iceland, Liechtenstein, Norway and
            Switzerland. Ireland and Cyprus are in the EU but not in Schengen. The full list is on the{" "}
            <Link to="/tables" className="font-semibold text-foreground underline underline-offset-4">
              Table drill page
            </Link>
            .
          </p>
        </div>
      </details>

      {/* 6. Full sheet */}
      <details id="sheet" className="review-section group mt-5 border-t border-border pt-3"><summary className="grid min-h-14 cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-3 font-display text-xl font-bold"><span>Review tables</span><ChevronDown className="size-5 shrink-0 transition group-open:rotate-180" /></summary>
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
                ["unknown", "New"],
                ["missed", "Missed"],
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
              Expand all
            </Button>
            <Button variant="pill" onClick={() => setAll(false)}>
              Collapse all
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
                    <tr className="hidden sm:table-row text-left text-muted-foreground">
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
                            <MemoryName name={r.city} codes={r.codes.map((code) => code.c)} />
                            {r.state && <span className="text-muted-foreground"> · {r.state}</span>}
                          </td>
                          <td className="border-b border-border px-4 py-2">
                            <span className="mobile-table-label">Code</span><CodeChips codes={r.codes} />
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
      </details>
    </main>
  );
}
