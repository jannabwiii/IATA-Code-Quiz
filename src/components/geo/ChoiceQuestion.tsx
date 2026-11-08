import { Check, X } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { answerText, buildOptions } from "@/lib/geo";
import { cn } from "@/lib/utils";

import { AnswerDetails } from "./QuizPrompt";
import type { QuestionProps } from "./QuizShell";

/** Multiple-choice question. `prompt` is what the player sees (or hears) before answering. */
export function ChoiceQuestion({ row, direction, onAnswer, prompt }: QuestionProps & { prompt: ReactNode }) {
  const options = useMemo(() => buildOptions(row, direction), [row, direction]);
  const correct = answerText(row, direction);
  const [picked, setPicked] = useState<string | null>(null);
  const isCode = direction === "city-code";

  const choose = (o: string) => {
    if (picked) return;
    setPicked(o);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (!picked && n >= 1 && n <= options.length) choose(options[n - 1]);
      else if (picked && e.key === "Enter" && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault();
        onAnswer(picked === correct);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="grid gap-5">
      <div className="rounded-3xl bg-board px-6 py-10 shadow-[var(--shadow-board)]">{prompt}</div>

      <div className={cn("grid gap-3", options.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
        {options.map((o, i) => {
          const state = !picked ? "idle" : o === correct ? "right" : o === picked ? "wrong" : "dim";
          return (
            <button
              key={o}
              type="button"
              disabled={!!picked}
              onClick={() => choose(o)}
              className={cn(
                "group flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border-2 bg-card px-4 py-3 text-left transition active:scale-[0.99] disabled:cursor-default",
                state === "idle" && "border-border hover:-translate-y-0.5 hover:border-foreground/50",
                state === "right" && "border-success bg-success/15",
                state === "wrong" && "shake border-destructive bg-destructive/10",
                state === "dim" && "border-border opacity-50",
              )}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border border-border font-mono text-xs font-bold",
                  state === "right" && "border-success bg-success text-success-foreground",
                  state === "wrong" && "border-destructive bg-destructive text-destructive-foreground",
                )}
              >
                {state === "right" ? <Check className="size-4" /> : state === "wrong" ? <X className="size-4" /> : i + 1}
              </span>
              <span className={cn("text-lg font-semibold", isCode && "font-mono tracking-wider")}>{o}</span>
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="pop-in grid gap-4">
          <div
            className={cn(
              "text-center font-display text-xl font-bold",
              picked === correct ? "text-success" : "text-destructive",
            )}
          >
            {picked === correct ? "Correct!" : `Not quite. It's ${correct}.`}
          </div>
          <AnswerDetails row={row} />
          <Button variant="hero" size="xl" autoFocus onClick={() => onAnswer(picked === correct)}>
            Next
          </Button>
        </div>
      )}
      {!picked && <p className="text-center text-xs text-muted-foreground">Keyboard: press 1–{options.length} to answer, Enter for next</p>}
    </div>
  );
}
