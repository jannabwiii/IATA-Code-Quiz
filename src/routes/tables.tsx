import { createFileRoute } from "@tanstack/react-router";
import { Check, ChevronDown, Eye, EyeOff, RotateCcw, Shuffle, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";

import { MemoryName } from "@/components/geo/CodeMemory";
import { AreaBadge, CodeChips, FieldSelect, Legend } from "@/components/geo/bits";
import { Button } from "@/components/ui/button";
import {
  AREA_LABEL,
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
  { k: "state", label: "State", ph: "state/province" },
  { k: "city", label: "City", ph: "city" },
  { k: "code", label: "Code", ph: "code" },
];

const PRESETS: { label: string; hide: Field[] }[] = [
  { label: "Code quiz", hide: ["code"] },
  { label: "City quiz", hide: ["city", "country", "state"] },
  { label: "Location quiz", hide: ["area", "country", "state"] },
  { label: "Hide all", hide: ["area", "country", "state", "city", "code"] },
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


  return (
    <main className="page pt-6">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Tables</h1>
      <div className="table-controls" role="region" aria-label="Table controls">
        <div className="column-controls grid gap-2">
          <span className="field-label shrink-0">Hide</span>
          <div className="column-buttons flex flex-wrap gap-2">
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
        <div className="table-actions flex flex-wrap items-center gap-2">
          <select
            aria-label="Quick setup"
            value=""
            onChange={(e) => {
              const p = PRESETS.find((x) => x.label === e.target.value);
              if (p) setHide(p.hide);
            }}
            className="h-8 cursor-pointer rounded-full border border-border bg-card px-3 text-xs hover:border-foreground/40"
          >
            <option value="">Preset</option>
            {PRESETS.map((p) => (
              <option key={p.label} value={p.label}>
                {p.label}
              </option>
            ))}
          </select>
          <Button variant="ink" size="sm" onClick={revealAll}>
            <Eye /> Reveal
          </Button>
          <Button variant="pill" size="sm" onClick={rehide}>
            <RotateCcw /> Rehide
          </Button>
          <Button
            variant={shuffled ? "pill-active" : "pill"}
            size="sm"
            aria-pressed={shuffled}
            onClick={() => setShuffled((x) => !x)}
          >
            <Shuffle /> Shuffle
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
            {visible.length} rows
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
                {confirmReset ? "Confirm reset" : "Reset progress"}
              </Button>
            </div>
          </div>
        )}
      </div>

      <details className="mt-4"><summary className="min-h-11 cursor-pointer py-2 font-semibold">Code colors</summary><Legend /></details>

      <div ref={tableRef} className="mt-6 grid gap-6">
        {groups.length === 0 && <p className="text-muted-foreground">No rows match these filters.</p>}
        {groups.map(([si, rows]) => {
          const meta = SECTIONS_META[si];
          if (!meta) return null;
          return (
            <details key={si} className="table-section group overflow-hidden rounded-lg border border-border bg-card">
              <summary className="grid min-h-14 cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4">
                <span className="min-w-0 font-bold">{meta.name}<span className="ml-2 text-xs font-normal text-muted-foreground">{rows.length}</span></span>
                <ChevronDown className="size-5 shrink-0 transition group-open:rotate-180" />
              </summary>
              <div className="table-scroll overflow-x-auto border-t border-border">
              <table className="study-table w-full min-w-[640px] border-separate border-spacing-0 text-sm">
                <thead>
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
                              <span className="mobile-table-label">{f.label}</span>
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
                                  <Button variant="ghost" size="icon"
                                    type="button"
                                    tabIndex={-1}
                                    title="Give up and reveal"
                                    aria-label="Give up and reveal"
                                    onClick={() => resolve(r, f.k, "gu")}
                                    className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                                  >
                                    <Eye className="size-4" />
                                  </Button>
                                </span>
                              ) : f.k === "area" ? (
                                <AreaBadge area={r.area} />
                              ) : f.k === "code" ? (
                                <><CodeChips codes={r.codes} /></>
                              ) : (
                                f.k === "city" ? <MemoryName name={r.cityRaw} codes={r.codes.map((code) => code.c)} visible={!isHidden(r, "code")} /> : fieldValue(r, f.k)
                              )}
                            </td>
                          );
                        })}
                        <td className="w-px whitespace-nowrap border-b border-border px-2 py-2">
                          <span className="flex gap-1">
                            <Button variant="ghost" size="icon"
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
                            </Button>
                            <Button variant="ghost" size="icon"
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
                            </Button>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>
            </details>
          );
        })}
      </div>

      <details className="mt-6 group border-y border-border py-3">
        <summary className="grid min-h-12 cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center font-bold"><span>Schengen · 29</span><ChevronDown className="size-5 transition group-open:rotate-180" /></summary>
        <div className="mt-3 flex flex-wrap gap-2">{EU.map((country) => <span key={country} className="text-sm">{country}</span>)}{NON_EU.map((country) => <span key={country} className="text-sm font-semibold text-code-o">{country}</span>)}</div>
        <p className="mt-3 text-sm text-muted-foreground">Orange: non-EU. Ireland and Cyprus: EU, not Schengen.</p>
      </details>
      <details className="mt-3"><summary className="min-h-11 cursor-pointer py-2 font-semibold">TC areas</summary><div className="grid gap-2">{([1, 2, 3] as const).map((a) => <p key={a}>{AREA_LABEL[a]}</p>)}</div></details>
    </main>
  );
}
