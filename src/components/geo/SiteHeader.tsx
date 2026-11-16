import { Link } from "@tanstack/react-router";
import { Moon, Plane, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { ROWS } from "@/lib/geo";
import { useProgress } from "@/lib/progress";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/review", label: "Review guide" },
  { to: "/tables", label: "Tables" },
  { to: "/pronounce", label: "Pronounce" },
] as const;

export function SiteHeader() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem("wgc-theme"); } catch { /* storage unavailable */ }
    const enabled = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(enabled);
    document.documentElement.classList.toggle("dark", enabled);
  }, []);
  const toggleTheme = () => {
    const enabled = !dark;
    setDark(enabled);
    document.documentElement.classList.toggle("dark", enabled);
    try { localStorage.setItem("wgc-theme", enabled ? "dark" : "light"); } catch { /* storage unavailable */ }
  };
  const progress = useProgress();
  const known = Object.values(progress).filter((v) => v === "k").length;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="site-header-inner mx-auto max-w-5xl px-4">
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <Link to="/" className="flex min-w-0 items-center gap-2 font-display text-lg font-extrabold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground ring-1 ring-foreground/15">
            <Plane className="size-4 -rotate-45" />
          </span>
          <span className="truncate">Geography Codes</span>
        </Link>
        <Button variant="ghost" size="icon" className="shrink-0" onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} title={dark ? "Light mode" : "Dark mode"}>
          {dark ? <Sun /> : <Moon />}
        </Button>
        </div>
        <nav aria-label="Main" className="flex items-center gap-1 overflow-x-auto">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: true }}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-secondary-foreground"
            >
              {n.label}
            </Link>
          ))}
          <span
            className="ml-1 hidden whitespace-nowrap rounded-lg border border-border bg-card px-3 py-1 text-sm font-semibold md:inline"
            title="Rows you have marked as known"
          >
            Known {known} of {ROWS.length}
          </span>
        </nav>
      </div>
    </header>
  );
}
