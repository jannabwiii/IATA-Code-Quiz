import { Link } from "@tanstack/react-router";
import { Plane } from "lucide-react";

import { ROWS } from "@/lib/geo";
import { useProgress } from "@/lib/progress";

const NAV = [
  { to: "/", label: "Quiz menu" },
  { to: "/tables", label: "Tables" },
  { to: "/pronounce", label: "Pronounce" },
] as const;

export function SiteHeader() {
  const progress = useProgress();
  const known = Object.values(progress).filter((v) => v === "k").length;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground ring-1 ring-foreground/15">
            <Plane className="size-4 -rotate-45" />
          </span>
          <span className="hidden sm:inline">Geo Codes</span>
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: true }}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-secondary-foreground"
            >
              {n.label}
            </Link>
          ))}
          <span
            className="ml-1 hidden whitespace-nowrap rounded-full border border-border bg-card px-3 py-1 font-mono text-xs font-bold md:inline"
            title="Rows you've marked as known"
          >
            ✓ {known}/{ROWS.length}
          </span>
        </nav>
      </div>
    </header>
  );
}
