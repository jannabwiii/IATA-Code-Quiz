import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Volume2 } from "lucide-react";

import { ROWS } from "@/lib/geo";
import { QUIZ_MODES } from "@/lib/modes";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "World Geography Codes · Pick a quiz" },
      {
        name: "description",
        content: "Study IATA city and airport codes with flashcards, multiple choice, typing, listening and table drills.",
      },
      { property: "og:title", content: "World Geography Codes · Pick a quiz" },
      {
        property: "og:description",
        content: "Study IATA city and airport codes with flashcards, multiple choice, typing, listening and table drills.",
      },
    ],
  }),
  component: Index,
});

const BOARD = [
  { code: "MNL", city: "Manila", area: "TC3" },
  { code: "CDG", city: "Paris", area: "TC2" },
  { code: "NRT", city: "Tokyo", area: "TC3" },
  { code: "JFK", city: "New York", area: "TC1" },
  { code: "DXB", city: "Dubai", area: "TC2" },
];

function Index() {
  const progress = useProgress();
  const known = Object.values(progress).filter((v) => v === "k").length;
  const missed = Object.values(progress).filter((v) => v === "m").length;
  const pct = Math.round((known / ROWS.length) * 100);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-20">
      <section className="grid items-center gap-8 py-10 md:grid-cols-[1.1fr_1fr] md:py-14">
        <div>
          <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary-foreground ring-1 ring-foreground/15">
            {ROWS.length} cities · 3 TC areas
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] sm:text-6xl">
            How do you want to study today?
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">
            Pick a quiz type below. Every answer is saved, so “missed only” rounds always target your weak spots.
          </p>
          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            <div>
              <div className="font-mono text-2xl font-bold">{pct}%</div>
              <div className="text-muted-foreground">known</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-success">{known}</div>
              <div className="text-muted-foreground">✓ marked known</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-destructive">{missed}</div>
              <div className="text-muted-foreground">✗ to review</div>
            </div>
          </div>
        </div>

        <div aria-hidden className="rounded-3xl bg-board p-5 shadow-[var(--shadow-board)]">
          <div className="mb-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.25em] text-board-muted">
            <span>Departures</span>
            <span>Code · City · Area</span>
          </div>
          <div className="grid gap-2">
            {BOARD.map((b, i) => (
              <div key={b.code} className="flex items-center gap-3">
                <span className="flap px-2.5 py-1 text-xl">{b.code}</span>
                <span className="flex-1 truncate font-mono text-sm uppercase tracking-wider text-board-foreground">
                  {b.city}
                </span>
                <span className="font-mono text-xs text-board-muted">{i === 0 ? "BOARDING" : b.area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">Choose a quiz type</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUIZ_MODES.map((m, i) => (
            <Link
              key={m.to}
              to={m.to}
              className="ticket group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:border-foreground/30"
            >
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-start justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <m.icon className="size-6" />
                  </span>
                  <span className="font-mono text-xs font-bold text-muted-foreground">0{i + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{m.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{m.blurb}</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t-2 border-dashed border-border bg-muted/50 px-5 py-3 text-sm font-semibold">
                <span className="text-muted-foreground">{m.tag}</span>
                <span className="inline-flex items-center gap-1">
                  Start <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
          <div className="grid gap-4">
            <Link
              to="/pronounce"
              className="ticket group flex items-center gap-4 p-5 transition hover:-translate-y-1 hover:border-foreground/30"
            >
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground ring-1 ring-foreground/15">
                <Volume2 className="size-5" />
              </span>
              <span>
                <span className="block font-bold">Pronunciation guide</span>
                <span className="text-sm text-muted-foreground">Hear every name and code</span>
              </span>
            </Link>
            <Link
              to="/tables"
              className="ticket group flex items-center gap-4 p-5 transition hover:-translate-y-1 hover:border-foreground/30"
            >
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground ring-1 ring-foreground/15">
                <BookOpen className="size-5" />
              </span>
              <span>
                <span className="block font-bold">Browse the tables</span>
                <span className="text-sm text-muted-foreground">Schengen list &amp; study tips too</span>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
