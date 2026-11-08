import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Eye, EyeOff, GraduationCap, Shuffle, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";

import { AreaBadge, CodeChips, FieldSelect, Legend } from "@/components/geo/bits";
import { Button } from "@/components/ui/button";
import {
  AREA_LABEL,
  ROWS,
  SECTIONS_META,
  checkField,
  filterRows,
  shuffle,
  type Area,
  type Field,
  type GeoRow,
  type Progress,
  type RowFilter,
} from "@/lib/geo";
import { getProgress, resetProgress, setMark, useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tables")({
  head: () => ({
    meta: [
      { title: "Table drill · World Geography Codes" },
      {
        name: "description",
        content: "Every handout table of IATA city and airport codes, with columns you can hide and fill in.",
      },
      { property: "og:title", content: "Table drill · World Geography Codes" },
      {
        property: "og:description",
        content: "Every handout table of IATA city and airport codes, with columns you can hide and fill in.",
      },
    ],
  }),
  component: TablesPage,
});

const FIELDS: { k: Field; label: string; ph: string }[] = [
  { k: "area", label: "TC area", ph: "1, 2 or 3" },
  { k: "country", label: "Country", ph: "country" },
  { k: "state", label: "State/Province", ph: "state/province" },
  { k: "city", label: "City", ph: "city" },
  { k: "code", label: "Code", ph: "code" },
];

const PRESETS: { label: string; hide: Field[] }[] = [
  { label: "City → guess code", hide: ["code"] },
  { label: "Code → guess city", hide: ["city", "country", "state"] },
  { label: "Guess area & country", hide: ["area", "country", "state"] },
  { label: "Hide everything", hide: ["area", "country", "state", "city", "code"] },
  { label: "Show all", hide: [] },
];

type CellState = "ok" | "gu" | "show";

const fieldValue = (r: GeoRow, k: Field) =>
  k === "area" ? String(r.area) : k === "country" ? r.country : k === "state" ? r.state : k === "city" ? r.cityRaw : r.codeRaw;

const EU =
  "Austria,Belgium,Bulgaria,Croatia,Czech Republic,Denmark,Estonia,Finland,France,Germany,Greece,Hungary,Italy,Latvia,Lithuania,Luxembourg,Malta,Netherlands,Poland,Portugal,Romania,Slovakia,Slovenia,Spain,Sweden".split(
    ",",
  );
const NON_EU = ["Iceland", "Liechtenstein", "Norway", "Switzerland"];

function TablesPage() {
  const progress = useProgress();
  const [hidden, setHidden] = useState<Set<Field>>(new Set(["code"]));
  const [section, setSection] = useState<number | "all">("all");
  const [area, setArea] = useState<Area | "all">("all");
  const [rowsFilter, setRowsFilter] = useState<RowFilter>("all");
  const [shuffled, setShuffled] = useState(false);
  const [cells, setCells] = useState<Record<string, CellState>>({});
  const [round, setRound] = useState(0);
  const [frozen, setFrozen] = useState<Progress>({});
  const [confirmReset, setConfirmReset] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Rows are picked when filters change, so marking a row doesn't make it vanish mid-drill.
  useEffect(() => setFrozen(getProgress()), [section, area, rowsFilter, round]);

  const visible = useMemo(() => {
    let rows = filterRows({ section, area, rows: rowsFilter }, frozen);
    if (shuffled) rows = shuffle(rows);
    return rows;
    // round re-shuffles too
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, area, rowsFilter, frozen, shuffled, round]);

  const groups = useMemo(() => {
    const m = new Map<number, GeoRow[]>();
    visible.forEach((r) => m.set(r.si, [...(m.get(r.si) ?? []), r]));
    return [...m.entries()].sort((a, b) => a[0] - b[0]);
  }, [visible]);

  const rehide = () => {
    setCells({});
    setRound((r) => r + 1);
  };
  const setHide = (fields: Field[]) => {
    setHidden(new Set(fields));
    rehide();
  };
  const toggleHide = (k: Field) => {
    const n = new Set(hidden);
    if (n.has(k)) n.delete(k);
    else n.add(k);
    setHide([...n]);
  };
  const revealAll = () => {
    const next: Record<string, CellState> = { ...cells };
    visible.forEach((r) => hidden.forEach((k) => (next[`${r.id}:${k}`] ??= "show")));
    setCells(next);
  };

  const isHidden = (r: GeoRow, k: Field) => hidden.has(k) && fieldValue(r, k) !== "" && !cells[`${r.id}:${k}`];

  const autoMark = (r: GeoRow, next: Record<string, CellState>) => {
    const ks = [...hidden].filter((k) => fieldValue(r, k) !== "");
    if (!ks.length) return;
    const st = ks.map((k) => next[`${r.id}:${k}`]);
    if (st.includes("gu")) setMark(r.id, "m");
    else if (st.every((s) => s === "ok")) setMark(r.id, "k");
  };

  const resolve = (r: GeoRow, k: Field, s: CellState) => {
    const next = { ...cells, [`${r.id}:${k}`]: s };
    setCells(next);
    if (s !== "show") autoMark(r, next);
  };

  const tableRef = useRef<HTMLDivElement>(null);
  const focusNext = (from: HTMLInputElement) => {
    const all = [...(tableRef.current?.querySelectorAll<HTMLInputElement>("input[data-ans]") ?? [])];
    const next = all[all.indexOf(from) + 1];
    requestAnimationFrame(() => next?.focus());
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>, r: GeoRow, k: Field) => {
    if (e.key !== "Enter") return;
    const input = e.currentTarget;
    const v = input.value.trim();
    if (!v) {
      resolve(r, k, "gu");
      return;
    }
    if (checkField(k, r, v)) {
      focusNext(input);
      resolve(r, k, "ok");
    } else {
      input.classList.remove("shake");
      void input.offsetWidth;
      input.classList.add("shake");
    }
  };

  const markRow = (r: GeoRow, s: "k" | "m") => {
    setMark(r.id, progress[r.id] === s ? null : s);
    const next = { ...cells };
    hidden.forEach((k) => (next[`${r.id}:${k}`] ??= "show"));
    setCells(next);
  };

  const shownKnown = visible.filter((r) => progress[r.id] === "k").length;
  const shownMissed = visible.filter((r) => progress[r.id] === "m").length;

  return (
    <main className="page pt-6">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Table drill</h1>
      <p className="help mt-1 max-w-2xl">
        Choose which columns to hide. Then type the answer into each grey box and press Enter. A correct answer turns
        green. Press Enter on an empty box to see the answer. The toolbar below stays on screen while you scroll.
      </p>

      <details className="panel mt-4 py-3">
        <summary className="cursor-pointer font-semibold">What are TC areas?</summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {([1, 2, 3] as const).map((a) => (
            <div key={a} className="overflow-hidden rounded-xl border border-border">
              <div className={cn("h-1.5", a === 1 ? "bg-area-1" : a === 2 ? "bg-area-2" : "bg-area-3")} />
              <div className="p-3">
                <h3 className="font-bold">{AREA_LABEL[a]}</h3>
                <p className="help text-sm">
                  {a === 1 && "North and South America, the Caribbean, Greenland, Hawaii."}
                  {a === 2 && "Europe, Africa, and Asia up to and including Iran."}
                  {a === 3 && "Asia east of Iran, Australia, New Zealand, the Pacific. Manila is here."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </details>

      <div className="table-controls" role="region" aria-label="Table controls">
        <div className="flex items-center gap-2">
          <span className="field-label shrink-0">Hide columns:</span>
          <div className="flex gap-2 overflow-x-auto py-0.5">
            {FIELDS.map((f) => (
              <Button
                key={f.k}
                variant={hidden.has(f.k) ? "pill-active" : "pill"}
                size="sm"
                aria-pressed={hidden.has(f.k)}
                title={hidden.has(f.k) ? `${f.label} is hidden. Tap to show it.` : `Tap to hide ${f.label}`}
                onClick={() => toggleHide(f.k)}
              >
                {hidden.has(f.k) ? <EyeOff /> : null}
                {f.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Quick setup"
            value=""
            onChange={(e) => {
              const p = PRESETS.find((x) => x.label === e.target.value);
              if (p) setHide(p.hide);
            }}
            className="h-8 cursor-pointer rounded-full border border-border bg-card px-3 text-xs hover:border-foreground/40"
          >
            <option value="">Quick setup…</option>
            {PRESETS.map((p) => (
              <option key={p.label} value={p.label}>
                {p.label}
              </option>
            ))}
          </select>
          <Button variant="ink" size="sm" onClick={revealAll}>
            <Eye /> Show answers
          </Button>
          <Button variant="pill" size="sm" onClick={rehide}>
            Hide answers again
          </Button>
          <Button
            variant={shuffled ? "pill-active" : "pill"}
            size="sm"
            aria-pressed={shuffled}
            onClick={() => setShuffled((x) => !x)}
          >
            <Shuffle /> Shuffle {shuffled ? "on" : "off"}
          </Button>
          <Button
            variant={showFilters ? "pill-active" : "pill"}
            size="sm"
            aria-expanded={showFilters}
            onClick={() => setShowFilters((x) => !x)}
          >
            <SlidersHorizontal /> Filters
          </Button>
          <span className="ml-auto rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold">
            {visible.length} rows · ✓ {shownKnown} known · ✗ {shownMissed} missed
          </span>
        </div>
        {showFilters && (
          <div className="grid max-h-[50vh] gap-4 overflow-y-auto border-t border-border pt-3">
            <div className="grid gap-4 sm:grid-cols-3">
              <FieldSelect
                label="Section"
                value={String(section)}
                onChange={(v) => setSection(v === "all" ? "all" : Number(v))}
              >
                <option value="all">All sections</option>
                {SECTIONS_META.map((s) => (
                  <option key={s.si} value={s.si}>
                    {s.name}
                  </option>
                ))}
              </FieldSelect>
              <FieldSelect
                label="TC area"
                value={String(area)}
                onChange={(v) => setArea(v === "all" ? "all" : (Number(v) as Area))}
              >
                <option value="all">All TC areas</option>
                <option value="1">TC1 only</option>
                <option value="2">TC2 only</option>
                <option value="3">TC3 only</option>
              </FieldSelect>
              <FieldSelect label="Rows" value={rowsFilter} onChange={(v) => setRowsFilter(v as RowFilter)}>
                <option value="all">All rows</option>
                <option value="unknown">Not yet known</option>
                <option value="missed">Only rows I missed ✗</option>
              </FieldSelect>
            </div>
            <div>
              <Button
                variant="pill"
                size="sm"
                onClick={() => {
                  if (!confirmReset) {
                    setConfirmReset(true);
                    setTimeout(() => setConfirmReset(false), 3000);
                    return;
                  }
                  resetProgress();
                  setConfirmReset(false);
                  rehide();
                }}
              >
                {confirmReset ? "Tap again to erase all ✓ and ✗ marks" : "Reset all progress"}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <Legend />
      </div>

      <div ref={tableRef} className="mt-6 grid gap-6">
        {groups.length === 0 && <p className="text-muted-foreground">No rows match these filters.</p>}
        {groups.map(([si, rows]) => {
          const meta = SECTIONS_META[si];
          if (!meta) return null;
          return (
            <div key={si} className="overflow-x-auto rounded-2xl border border-border bg-card shadow-[var(--shadow-ticket)]">
              <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
                <thead>
                  <tr>
                    <th
                      colSpan={6}
                      className={cn(
                        "px-4 py-3 text-left font-display text-base font-bold tracking-wide text-area-foreground",
                        meta.area === 1 ? "bg-area-1" : meta.area === 2 ? "bg-area-2" : "bg-area-3",
                      )}
                    >
                      {meta.name}
                    </th>
                  </tr>
                  <tr className="text-left text-xs text-muted-foreground">
                    {["TC area", "Country", "State / Province", "City", "City / Airport code", ""].map((h, i) => (
                      <th key={i} className="border-b border-border bg-muted px-3 py-2 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const mark = progress[r.id];
                    return (
                      <tr
                        key={`${round}-${r.id}`}
                        className={cn(
                          "transition hover:bg-muted/50",
                          mark === "k" && "opacity-50",
                          mark === "m" && "bg-destructive/10",
                        )}
                      >
                        {FIELDS.map((f) => {
                          const key = `${r.id}:${f.k}`;
                          const st = cells[key];
                          const hid = isHidden(r, f.k);
                          return (
                            <td
                              key={f.k}
                              className={cn(
                                "border-b border-border px-3 py-2 align-middle",
                                f.k === "country" && "font-semibold",
                                st === "ok" && "shadow-[inset_0_0_0_2px_var(--color-success)]",
                                st === "gu" && "shadow-[inset_0_0_0_2px_var(--color-destructive)]",
                              )}
                            >
                              {hid ? (
                                <span className="flex items-center gap-1">
                                  <input
                                    data-ans
                                    placeholder={f.ph}
                                    autoComplete="off"
                                    autoCapitalize="off"
                                    spellCheck={false}
                                    onKeyDown={(e) => onKey(e, r, f.k)}
                                    className="h-9 w-full min-w-20 rounded-lg border border-border bg-muted px-2 outline-none focus:border-ring focus:bg-card"
                                  />
                                  <button
                                    type="button"
                                    tabIndex={-1}
                                    title="Give up and reveal"
                                    aria-label="Give up and reveal"
                                    onClick={() => resolve(r, f.k, "gu")}
                                    className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                                  >
                                    <Eye className="size-4" />
                                  </button>
                                </span>
                              ) : f.k === "area" ? (
                                <AreaBadge area={r.area} />
                              ) : f.k === "code" ? (
                                <CodeChips codes={r.codes} />
                              ) : (
                                fieldValue(r, f.k)
                              )}
                            </td>
                          );
                        })}
                        <td className="w-px whitespace-nowrap border-b border-border px-2 py-2">
                          <span className="flex gap-1">
                            <button
                              type="button"
                              title="I know this"
                              aria-label="Mark as known"
                              onClick={() => markRow(r, "k")}
                              className={cn(
                                "flex size-8 cursor-pointer items-center justify-center rounded-full border border-border hover:bg-success/20",
                                mark === "k" && "border-success bg-success text-success-foreground",
                              )}
                            >
                              <Check className="size-4" />
                            </button>
                            <button
                              type="button"
                              title="I missed this"
                              aria-label="Mark as missed"
                              onClick={() => markRow(r, "m")}
                              className={cn(
                                "flex size-8 cursor-pointer items-center justify-center rounded-full border border-border hover:bg-destructive/20",
                                mark === "m" && "border-destructive bg-destructive text-destructive-foreground",
                              )}
                            >
                              <X className="size-4" />
                            </button>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="ticket p-5">
          <h2 className="text-xl font-bold">Schengen countries (29)</h2>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {EU.map((c) => (
              <span key={c} className="rounded-full border border-border px-2.5 py-0.5 text-sm">
                {c}
              </span>
            ))}
            {NON_EU.map((c) => (
              <span key={c} className="rounded-full border border-border bg-code-o px-2.5 py-0.5 text-sm font-bold">
                {c}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Orange = not in the EU. Ireland and Cyprus are EU but not Schengen.
          </p>
        </div>
        <div className="ticket p-5">
          <h2 className="text-xl font-bold">Need a plan to memorize these?</h2>
          <p className="help mt-2">
            The review guide has a step-by-step method, lists of the tricky codes and a 7-day plan.
          </p>
          <Link
            to="/review"
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-secondary px-6 font-semibold text-secondary-foreground hover:bg-secondary/90"
          >
            <GraduationCap className="size-4" /> Open the review guide
          </Link>
        </div>
      </section>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        {ROWS.length} cities from the Cygnific Manila World Geography handout (internal use). Always confirm current
        rules for real bookings.
      </p>
    </main>
  );
}
