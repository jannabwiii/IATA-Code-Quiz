import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, GraduationCap, Volume2 } from "lucide-react";

import { CodeChip, Legend } from "@/components/geo/bits";
import { buttonVariants } from "@/components/ui/button";
import { AREA_LABEL, ROWS, type Area } from "@/lib/geo";
import { QUIZ_MODES } from "@/lib/modes";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

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

const AREAS: Area[] = [1, 2, 3];
const AREA_NOTE: Record<Area, string> = {
  1: "North and South America, the Caribbean, Greenland, Hawaii",
  2: "Europe, Africa, and Asia up to and including Iran",
  3: "Asia east of Iran, Australia, New Zealand, the Pacific (Manila is here)",
};
const AREA_BAR: Record<Area, string> = { 1: "bg-area-1", 2: "bg-area-2", 3: "bg-area-3" };

const STUDY_LINKS = [
  { to: "/review", icon: GraduationCap, title: "Review guide", body: "How to memorize everything: method, tricky codes and a 7-day plan" },
  { to: "/pronounce", icon: Volume2, title: "Pronunciation", body: "Hear every country, city and spelled-out code" },
  { to: "/tables", icon: BookOpen, title: "Browse the tables", body: "All handout tables, plus the Schengen country list" },
] as const;

function Index() {
  const progress = useProgress();
  const total = ROWS.length;
  const known = ROWS.filter((r) => progress[r.id] === "k").length;
  const missed = ROWS.filter((r) => progress[r.id] === "m").length;
  const pct = Math.round((known / total) * 100);

  return (
    <main className="page">
      <section className="pt-4 sm:pt-8">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.1] sm:text-5xl">
          Learn the city and airport codes
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Every city in the World Geography handout has a short code. For example, Manila is{" "}
          <CodeChip code={{ c: "MNL", kind: "g" }} />. Choose a way to practice below. The ✓ and ✗ marks you give
          yourself are saved on this device.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/flashcards" className={cn(buttonVariants({ variant: "hero", size: "xl" }))}>
            Start flashcards <ArrowRight />
          </Link>
          <Link to="/review" className={cn(buttonVariants({ variant: "pill", size: "xl" }))}>
            How to memorize everything
          </Link>
        </div>
      </section>

      <section aria-labelledby="progress" className="mt-10">
        <div className="panel grid gap-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="progress" className="section-title">
                Your progress
              </h2>
              <p className="help mt-0.5">
                {known} of {total} cities marked as known ({pct}%)
                {missed > 0 && `. ${missed} marked to review.`}
              </p>
            </div>
            {missed > 0 && (
              <p className="help max-w-xs sm:text-right">
                Tip: in any quiz, choose “Only rows I missed” to practice just those.
              </p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {AREAS.map((a) => {
              const rows = ROWS.filter((r) => r.area === a);
              const k = rows.filter((r) => progress[r.id] === "k").length;
              return (
                <div key={a}>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-bold">{AREA_LABEL[a]}</h3>
                    <span className="text-sm font-semibold">
                      {k} of {rows.length}
                    </span>
                  </div>
                  <div
                    className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-muted"
                    role="progressbar"
                    aria-label={`${AREA_LABEL[a]} known`}
                    aria-valuemin={0}
                    aria-valuemax={rows.length}
                    aria-valuenow={k}
                  >
                    <div className={cn("h-full rounded-full", AREA_BAR[a])} style={{ width: `${(k / rows.length) * 100}%` }} />
                  </div>
                  <p className="help mt-1.5 text-sm">{AREA_NOTE[a]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section aria-labelledby="practice" className="mt-12">
        <h2 id="practice" className="section-title">
          Choose how to practice
        </h2>
        <p className="help mt-1">Each quiz lets you pick the section, the TC area and how many questions before you start.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {QUIZ_MODES.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="panel group flex flex-col gap-4 transition hover:border-foreground/40"
            >
              <div className="flex items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <m.icon className="size-6" />
                </span>
                <div>
                  <h3 className="text-xl font-bold">{m.title}</h3>
                  <p className="help mt-0.5">{m.blurb}</p>
                </div>
              </div>
              <dl className="grid gap-1 text-sm">
                <div className="flex gap-2">
                  <dt className="w-14 shrink-0 font-semibold">You see</dt>
                  <dd className="text-muted-foreground">{m.youSee}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-14 shrink-0 font-semibold">You do</dt>
                  <dd className="text-muted-foreground">{m.youDo}</dd>
                </div>
              </dl>
              <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-sm">
                <span className="font-medium text-muted-foreground">{m.bestFor}</span>
                <span className="inline-flex items-center gap-1 font-semibold">
                  Open <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="study" className="mt-12">
        <h2 id="study" className="section-title">
          Study first, then practice
        </h2>
        <p className="help mt-1">New to the handout? Start here before you quiz yourself.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {STUDY_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="panel flex gap-3 transition hover:border-foreground/40">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground ring-1 ring-foreground/15">
                <l.icon className="size-5" />
              </span>
              <span>
                <span className="block font-bold">{l.title}</span>
                <span className="help block text-sm">{l.body}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="colors" className="mt-12">
        <h2 id="colors" className="section-title">
          What the code colors mean
        </h2>
        <p className="help mt-1">Codes are colored by where they come from. This helps you remember them.</p>
        <div className="mt-4">
          <Legend />
        </div>
      </section>
    </main>
  );
}
