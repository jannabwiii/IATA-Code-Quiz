import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { Area, CodeKind, GeoCode } from "@/lib/geo";

const KIND_CLASS: Record<CodeKind, string> = {
  g: "bg-code-g",
  b: "bg-code-b",
  o: "bg-code-o",
  p: "bg-code-p",
};

export function CodeChip({ code, className }: { code: GeoCode; className?: string | undefined }) {
  return (
    <span
      className={cn(
        "inline-block rounded-md px-2 py-0.5 font-mono text-sm font-bold tracking-wider text-foreground",
        KIND_CLASS[code.kind],
        className,
      )}
    >
      {code.c}
    </span>
  );
}

export function CodeChips({ codes, className }: { codes: GeoCode[]; className?: string | undefined }) {
  return (
    <span className="inline-flex flex-wrap gap-1">
      {codes.map((c) => (
        <CodeChip key={c.c} code={c} className={className} />
      ))}
    </span>
  );
}

const AREA_CLASS: Record<Area, string> = { 1: "bg-area-1", 2: "bg-area-2", 3: "bg-area-3" };

export function AreaBadge({ area, className }: { area: Area; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block min-w-11 rounded-md px-2 py-0.5 text-center text-xs font-bold text-area-foreground",
        AREA_CLASS[area],
        className,
      )}
    >
      TC{area}
    </span>
  );
}

export const areaBg = (a: Area) => AREA_CLASS[a];

export function SpeakButton({
  onClick,
  label,
  className,
}: {
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <Button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={label}
      aria-label={label}
      variant="ghost"
      size="icon"
      className={cn(
        "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border bg-card text-foreground transition hover:border-foreground/40 hover:bg-muted",
        className,
      )}
    >
      <Volume2 className="size-4" />
    </Button>
  );
}

export function Legend() {
  return (
    <div className="grid gap-1.5 text-sm sm:grid-cols-2" aria-label="What the code colors mean">
      <span className="rounded-md bg-code-g px-2.5 py-1.5">
        <b>Green</b>: spelled from the city name (Manila → MNL)
      </span>
      <span className="rounded-md bg-code-b px-2.5 py-1.5">
        <b>Blue</b>: metro code for the whole city (London → LON)
      </span>
      <span className="rounded-md bg-code-o px-2.5 py-1.5">
        <b>Orange</b>: named after the airport (Paris → CDG)
      </span>
      <span className="rounded-md bg-code-p px-2.5 py-1.5">
        <b>Purple</b>: old or local name (Mumbai → BOM)
      </span>
    </div>
  );
}

export function PillGroup<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: ReactNode }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid gap-2">
      <span className="field-label">{label}</span>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <Button
              key={String(o.value)}
              type="button"
              variant="ghost"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className={cn(
                "min-h-11 h-auto whitespace-normal cursor-pointer rounded-lg border px-4 text-sm transition active:scale-[0.98]",
                active
                  ? "border-secondary bg-secondary font-semibold text-secondary-foreground"
                  : "border-border bg-card hover:border-foreground/40 hover:bg-muted",
              )}
            >
              {o.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export function MultiPillGroup<T extends string | number>({
  label,
  values,
  options,
  onChange,
}: {
  label: string;
  /** Selected values; empty means "all". */
  values: T[];
  options: { value: T; label: ReactNode }[];
  onChange: (v: T[]) => void;
}) {
  const toggle = (v: T) => onChange(values.includes(v) ? values.filter((x) => x !== v) : [...values, v]);
  return (
    <div className="grid gap-2">
      <span className="field-label">{label}</span>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        <Button
          type="button"
          variant="ghost"
          aria-pressed={values.length === 0}
          onClick={() => onChange([])}
          className={cn(
            "min-h-11 h-auto whitespace-normal cursor-pointer rounded-lg border px-4 text-sm transition active:scale-[0.98]",
            values.length === 0
              ? "border-secondary bg-secondary font-semibold text-secondary-foreground"
              : "border-border bg-card hover:border-foreground/40 hover:bg-muted",
          )}
        >
          All
        </Button>
        {options.map((o) => {
          const active = values.includes(o.value);
          return (
            <Button
              key={String(o.value)}
              type="button"
              variant="ghost"
              aria-pressed={active}
              onClick={() => toggle(o.value)}
              className={cn(
                "min-h-11 h-auto whitespace-normal cursor-pointer rounded-lg border px-4 text-sm transition active:scale-[0.98]",
                active
                  ? "border-secondary bg-secondary font-semibold text-secondary-foreground"
                  : "border-border bg-card hover:border-foreground/40 hover:bg-muted",
              )}
            >
              {o.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export function FieldSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="field-label">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full min-w-0 cursor-pointer rounded-lg border border-border bg-card px-4 text-sm hover:border-foreground/40 focus-visible:outline-2 focus-visible:outline-ring"
      >
        {children}
      </select>
    </label>
  );
}
