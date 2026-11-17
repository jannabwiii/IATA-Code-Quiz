import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, RotateCcw, X, type LucideIcon } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Progress as ProgressBar } from "@/components/ui/progress";
import {
  AREA_LABEL,
  DEFAULT_SETTINGS,
  DIRECTIONS,
  DIFFICULTIES,
  type Difficulty,
  SECTION_NAMES,
  answerText,
  filterRows,
  pickQuestions,
  type Direction,
  type GeoRow,
  type QuizSettings,
} from "@/lib/geo";
import { setMark, useProgress } from "@/lib/progress";

import { CodeChips, MultiPillGroup, PillGroup } from "./bits";

export interface QuestionProps {
  row: GeoRow;
  direction: Direction;
  difficulty: Difficulty;
  index: number;
  total: number;
  onAnswer: (correct: boolean) => void;
}

interface Result {
  row: GeoRow;
  correct: boolean;
}

export function QuizShell({
  title,
  description,
  icon: Icon,
  directions = DIRECTIONS.map((d) => d.id),
  directionLabels,
  setupExtra,
  playExtra,
  renderQuestion,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  directions?: Direction[];
  directionLabels?: Partial<Record<Direction, string>>;
  setupExtra?: ReactNode;
  playExtra?: ReactNode;
  renderQuestion: (p: QuestionProps) => ReactNode;
}) {
  const progress = useProgress();
  const [settings, setSettings] = useState<QuizSettings>({ ...DEFAULT_SETTINGS, direction: directions[0] ?? "city-code" });
  const [phase, setPhase] = useState<"setup" | "play" | "done">("setup");
  const [queue, setQueue] = useState<GeoRow[]>([]);
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [round, setRound] = useState(0);

  const available = useMemo(() => filterRows(settings, progress).length, [settings, progress]);
  const update = (p: Partial<QuizSettings>) => setSettings((s) => ({ ...s, ...p }));

  const start = (rows: GeoRow[]) => {
    if (!rows.length) return;
    setQueue(rows);
    setIdx(0);
    setResults([]);
    setRound((r) => r + 1);
    setPhase("play");
    window.scrollTo({ top: 0 });
  };

  const onAnswer = (correct: boolean) => {
    const row = queue[idx];
    if (!row) return;
    setMark(row.id, correct ? "k" : "m");
    setResults((r) => [...r, { row, correct }]);
    if (idx + 1 >= queue.length) setPhase("done");
    else setIdx(idx + 1);
  };

  const label = (d: Direction) => directionLabels?.[d] ?? (DIRECTIONS.find((x) => x.id === d)?.label ?? d);

  return (
    <main className={phase === "play" ? "mx-auto max-w-6xl px-4 pb-20 pt-6" : "mx-auto max-w-3xl px-4 pb-20 pt-6"}>
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All quiz types
      </Link>

      {phase === "setup" && (
        <div className="pop-in">
          <div className="mb-6 flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground ring-1 ring-foreground/15">
              <Icon className="size-6" />
            </span>
            <div>
              <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
              <p className="mt-1 text-muted-foreground">{description}</p>
            </div>
          </div>

          <div className="grid gap-6 border-t border-border pt-6">
            <div className="grid gap-2">
              <PillGroup label="Difficulty" value={settings.difficulty} onChange={(difficulty) => update({ difficulty })} options={DIFFICULTIES.map(({ value, label }) => ({ value, label }))} />
              <p className="help">{DIFFICULTIES.find((d) => d.value === settings.difficulty)?.note}. TC-area questions always have 3 choices.</p>
            </div>
            <PillGroup
              label="1 · What to practice"
              value={settings.direction}
              onChange={(direction) => update({ direction })}
              options={directions.map((d) => ({ value: d, label: label(d) }))}
            />
            <div className="grid gap-4">
              <MultiPillGroup
                label="2 · Sections (pick one or more)"
                values={settings.sections}
                onChange={(sections) => update({ sections })}
                options={SECTION_NAMES.map((n, i) => ({ value: i, label: n }))}
              />
              <MultiPillGroup
                label="TC areas (pick one or more)"
                values={settings.areas}
                onChange={(areas) => update({ areas })}
                options={([1, 2, 3] as const).map((a) => ({ value: a, label: AREA_LABEL[a] }))}
              />
            </div>
            <PillGroup
              label="Which cards"
              value={settings.rows}
              onChange={(rows) => update({ rows })}
              options={[
                { value: "all", label: "All" },
                { value: "unknown", label: "Not yet known" },
                { value: "missed", label: "Missed only ✗" },
              ]}
            />
            <PillGroup
              label="How many"
              value={settings.count}
              onChange={(count) => update({ count })}
              options={[
                { value: 10, label: "10" },
                { value: 20, label: "20" },
                { value: 50, label: "50" },
                { value: "all", label: "All" },
              ]}
            />
            {setupExtra}
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-border pt-5">
              <span className="text-sm text-muted-foreground">
                {available
                  ? `${settings.count === "all" ? available : Math.min(available, settings.count)} of ${available} matching cards, shuffled`
                  : "No cards match. Try “All” or another section."}
              </span>
              <Button variant="hero" size="lg" disabled={!available} onClick={() => start(pickQuestions(settings, progress))}>
                Start
              </Button>
            </div>
          </div>
        </div>
      )}

      {phase === "play" && queue[idx] && (
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span className="font-mono text-sm font-bold">
              {idx + 1}/{queue.length}
            </span>
            <ProgressBar value={(idx / queue.length) * 100} className="h-2 flex-1" />
            <span className="inline-flex items-center gap-1 font-mono text-sm font-bold text-success">
              <Check className="size-4" />
              {results.filter((r) => r.correct).length}
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-sm font-bold text-destructive">
              <X className="size-4" />
              {results.filter((r) => !r.correct).length}
            </span>
            <Button variant="pill" size="sm" onClick={() => setPhase(results.length ? "done" : "setup")}>
              {results.length ? "Finish" : "Quit"}
            </Button>
          </div>
          {playExtra}
          <div key={`${round}-${idx}`} className="pop-in">
            {renderQuestion({
              row: queue[idx],
              direction: settings.direction,
              difficulty: settings.difficulty,
              index: idx,
              total: queue.length,
              onAnswer,
            })}
          </div>
        </div>
      )}

      {phase === "done" && (
        <Results
          results={results}
          direction={settings.direction}
          onRetryMissed={() => start(results.filter((r) => !r.correct).map((r) => r.row))}
          onAgain={() => start(pickQuestions(settings, progress))}
          onSetup={() => setPhase("setup")}
        />
      )}
    </main>
  );
}

function Results({
  results,
  direction,
  onRetryMissed,
  onAgain,
  onSetup,
}: {
  results: Result[];
  direction: Direction;
  onRetryMissed: () => void;
  onAgain: () => void;
  onSetup: () => void;
}) {
  const right = results.filter((r) => r.correct).length;
  const missed = results.filter((r) => !r.correct);
  const pct = results.length ? Math.round((right / results.length) * 100) : 0;
  const verdict = pct === 100 ? "Perfect round!" : pct >= 80 ? "Great flying." : pct >= 50 ? "Getting there." : "Keep drilling.";

  return (
    <div className="pop-in grid gap-6">
      <div className="overflow-hidden rounded-lg bg-board p-6 text-center shadow-[var(--shadow-board)] sm:p-8">
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-board-muted">Round complete</div>
        <div className="mt-3 flex justify-center gap-2">
          <span className="flap px-4 py-2 text-5xl">{right}</span>
          <span className="self-center font-mono text-3xl text-board-muted">/</span>
          <span className="flap px-4 py-2 text-5xl">{results.length}</span>
        </div>
        <div className="mt-4 font-display text-2xl font-bold text-board-foreground">{verdict}</div>
        <div className="text-sm text-board-muted">{pct}% correct · saved to your progress</div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {missed.length > 0 && (
          <Button variant="hero" size="lg" onClick={onRetryMissed}>
            <RotateCcw /> Retry the {missed.length} missed
          </Button>
        )}
        <Button variant="ink" size="lg" onClick={onAgain}>
          New round
        </Button>
        <Button variant="pill" size="lg" onClick={onSetup}>
          Change settings
        </Button>
      </div>

      {missed.length > 0 && (
        <div className="ticket p-5">
          <h2 className="mb-3 text-lg font-bold">To review</h2>
          <ul className="divide-y divide-border">
            {missed.map(({ row }) => (
              <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span>
                  <span className="font-semibold">{row.city}</span>
                  <span className="text-muted-foreground"> · {row.country}</span>
                </span>
                {direction === "city-code" || direction === "code-city" ? (
                  <CodeChips codes={row.codes} />
                ) : (
                  <span className="font-semibold">{answerText(row, direction)}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
