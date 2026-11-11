import { Link } from "@tanstack/react-router";
import { Plane, Home, BookOpen, Table2, Volume2 } from "lucide-react";

import { ROWS } from "@/lib/geo";
import { useProgress } from "@/lib/progress";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/review", label: "Review", icon: BookOpen },
  { to: "/tables", label: "Tables", icon: Table2 },
  { to: "/pronounce", label: "Audio", icon: Volume2 },
] as const;

export function SiteHeader() {
  const progress = useProgress();
  const known = Object.values(progress).filter((v) => v === "k").length;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="site-header-inner mx-auto max-w-5xl px-4">
        <Link to="/" className="flex min-w-0 items-center gap-2 font-display text-lg font-extrabold tracking-tight">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground ring-1 ring-foreground/15">
            <Plane className="size-4 -rotate-45" />
          </span>
          <span className="truncate">Geography Codes</span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 overflow-x-auto">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: true }}
              className="inline-flex min-h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-secondary-foreground"
            >
              <n.icon className="size-4 shrink-0" /> {n.label}
            </Link>
          ))}
          <span
            className="ml-1 hidden whitespace-nowrap rounded-lg border border-border bg-card px-3 py-1 text-sm font-semibold md:inline"
            title="Rows you have marked as known"
          >
            {known}/{ROWS.length} known
          </span>
        </nav>
      </div>
    </header>
  );
}
