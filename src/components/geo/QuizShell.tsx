import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, RotateCcw, X, type LucideIcon } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Progress as ProgressBar } from "@/components/ui/progress";
import {
  AREA_LABEL,
  DEFAULT_SETTINGS,
  DIRECTIONS,
  SECTION_NAMES,
  answerText,
  filterRows,
  pickQuestions,
  type Direction,
  type GeoRow,
  type QuizSettings,
} from "@/lib/geo";
import { setMark, useProgress } from "@/lib/progress";

import { CodeChips, FieldSelect, PillGroup } from "./bits";

export interface QuestionProps {
  row: GeoRow;
  direction: Direction;
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
    <main className={`quiz-page mx-auto max-w-3xl px-4 pb-20 pt-6 ${phase === "play" ? "quiz-playing" : ""}`}>
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Home
      </Link>

      {phase === "setup" && (
        <div className="pop-in">
          <div className="mb-6 grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground ring-1 ring-foreground/15">
              <Icon className="size-6" />
            </span>
            <div className="min-w-0">
              <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
              {description && <p className="mt-1 text-muted-foreground">{description}</p>}
            </div>
          </div>

          <div className="grid gap-6 border-t border-border pt-6">
            <PillGroup
              label="Practice"
              value={settings.direction}
              onChange={(direction) => update({ direction })}
              options={directions.map((d) => ({ value: d, label: label(d) }))}
            />
            <details className="quiz-filters">
              <summary className="min-h-12 cursor-pointer py-3 font-semibold">Filters</summary>
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldSelect
                label="Section"
                value={String(settings.section)}
                onChange={(v) => update({ section: v === "all" ? "all" : Number(v) })}
              >
                <option value="all">All sections</option>
                {SECTION_NAMES.map((n, i) => (
                  <option key={n} value={i}>
                    {n}
                  </option>
                ))}
              </FieldSelect>
              <FieldSelect
                label="TC area"
                value={String(settings.area)}
                onChange={(v) => update({ area: v === "all" ? "all" : (Number(v) as 1 | 2 | 3) })}
              >
                <option value="all">All TC areas</option>
                {([1, 2, 3] as const).map((a) => (
                  <option key={a} value={a}>
                    {AREA_LABEL[a]}
                  </option>
                ))}
              </FieldSelect>
            </div>
            <PillGroup
              label="Cards"
              value={settings.rows}
              onChange={(rows) => update({ rows })}
              options={[
                { value: "all", label: "All" },
                { value: "unknown", label: "New" },
                { value: "missed", label: "Missed" },
              ]}
            />
            </details>
            <PillGroup
              label="Questions"
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
                  ? `${settings.count === "all" ? available : Math.min(available, settings.count)} questions`
                  : "No matches"}
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
          <div className="quiz-status mb-5 flex items-center gap-3">
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
  const verdict = pct === 100 ? "Perfect round!" : pct >= 80 ? "Great!" : pct >= 50 ? "Keep going" : "Keep going";

  return (
    <div className="pop-in grid gap-6">
      <div className="overflow-hidden rounded-lg bg-board p-6 text-center shadow-[var(--shadow-board)] sm:p-8">
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-board-muted">Results</div>
        <div className="mt-3 flex justify-center gap-2">
          <span className="flap px-4 py-2 text-5xl">{right}</span>
          <span className="self-center font-mono text-3xl text-board-muted">/</span>
          <span className="flap px-4 py-2 text-5xl">{results.length}</span>
        </div>
        <div className="mt-4 font-display text-2xl font-bold text-board-foreground">{verdict}</div>
        <div className="text-sm text-board-muted">{pct}% correct</div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {missed.length > 0 && (
          <Button variant="hero" size="lg" onClick={onRetryMissed}>
            <RotateCcw /> Retry {missed.length}
          </Button>
        )}
        <Button variant="ink" size="lg" onClick={onAgain}>
          New round
        </Button>
        <Button variant="pill" size="lg" onClick={onSetup}>
          Settings
        </Button>
      </div>

      {missed.length > 0 && (
        <div className="ticket p-5">
          <h2 className="mb-3 text-lg font-bold">Missed</h2>
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
