import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Table2, Volume2, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROWS } from "@/lib/geo";
import { QUIZ_MODES } from "@/lib/modes";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "World Geography Codes · Pick a quiz" },
      {
        name: "description",
        content: "Study IATA city and airport codes with typing, multiple choice and collapsible study tables.",
      },
      { property: "og:title", content: "World Geography Codes · Pick a quiz" },
      {
        property: "og:description",
        content: "Study IATA city and airport codes with typing, multiple choice and collapsible study tables.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const progress = useProgress();
  const known = ROWS.filter((r) => progress[r.id] === "k").length;
  const missed = ROWS.filter((r) => progress[r.id] === "m").length;
  return <main className="page home-page">
    <header className="grid gap-3 border-b border-border pb-6">
      <p className="text-sm font-semibold text-primary">City & airport codes</p>
      <h1 className="text-3xl font-extrabold sm:text-5xl">World Geography</h1>
      <div className="flex items-center gap-5 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Check className="size-4 text-success" />{known}/{ROWS.length} known</span>
        <span className="inline-flex items-center gap-1"><RotateCcw className="size-4" />{missed} missed</span>
      </div>
    </header>
    <section className="py-7" aria-labelledby="practice">
      <h2 id="practice" className="section-title">Quiz</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {QUIZ_MODES.map((mode) => <Button key={mode.to} asChild variant="outline" className="mode-card h-auto min-h-36 whitespace-normal p-5">
          <Link to={mode.to} className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground"><mode.icon className="size-6" /></span>
            <span className="min-w-0 text-left"><span className="block text-xl font-bold">{mode.title}</span><span className="mt-1 block text-sm text-muted-foreground">{mode.bestFor}</span></span>
            <ArrowRight className="size-5 shrink-0" />
          </Link>
        </Button>)}
      </div>
    </section>
    <section className="border-t border-border py-6" aria-labelledby="study">
      <h2 id="study" className="section-title">Study</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {([{ to: "/tables", label: "Tables", icon: Table2 }, { to: "/review", label: "Review", icon: BookOpen }, { to: "/pronounce", label: "Audio", icon: Volume2 }] as const).map((item) =>
          <Button key={item.to} asChild variant="pill" size="xl" className="justify-start"><Link to={item.to}><item.icon />{item.label}<ArrowRight className="ml-auto" /></Link></Button>)}
      </div>
    </section>
  </main>;
}
