import { createFileRoute } from "@tanstack/react-router";
import { Layers, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";

import { AnswerDetails, PromptView } from "@/components/geo/QuizPrompt";
import { QuizShell, type QuestionProps } from "@/components/geo/QuizShell";
import { Button } from "@/components/ui/button";
import { answerText } from "@/lib/geo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/flashcards")({
  head: () => ({
    meta: [
      { title: "Flashcards · World Geography Codes" },
      { name: "description", content: "Flip flashcards for IATA city and airport codes, countries and TC areas." },
      { property: "og:title", content: "Flashcards · World Geography Codes" },
      { property: "og:description", content: "Flip flashcards for IATA city and airport codes, countries and TC areas." },
    ],
  }),
  component: FlashcardsPage,
});

function FlashcardsPage() {
  return (
    <QuizShell
      title="Flashcards"
      description="See the question, think of the answer, flip the card, then mark yourself."
      icon={Layers}
      renderQuestion={(p) => <Flashcard {...p} />}
    />
  );
}

function Flashcard({ row, direction, onAnswer }: QuestionProps) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target;
      if (t instanceof HTMLInputElement || t instanceof HTMLSelectElement) return;
      // Buttons (and the card itself) handle Space/Enter as clicks already.
      if ((e.key === " " || e.key === "Enter") && t instanceof HTMLElement && t.closest("button,[role=button]"))
        return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (flipped && (e.key === "ArrowRight" || e.key.toLowerCase() === "k")) onAnswer(true);
      else if (flipped && (e.key === "ArrowLeft" || e.key.toLowerCase() === "j")) onAnswer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped, onAnswer]);

  return (
    <div className="grid gap-5">
      <div className="flip-scene">
        <div
          role="button"
          tabIndex={0}
          aria-label={flipped ? "Show question" : "Flip to see the answer"}
          onClick={() => setFlipped((f) => !f)}
          className={cn("flip-inner h-[26rem] cursor-pointer select-none", flipped && "is-flipped")}
        >
          <div className="flip-face flex flex-col items-center justify-center rounded-3xl bg-board p-6 shadow-[var(--shadow-board)]">
            <PromptView row={row} direction={direction} />
            <span className="absolute bottom-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-board-muted">
              <RotateCw className="size-3.5" /> Tap to flip
            </span>
          </div>
          <div className="flip-face flip-back flex flex-col justify-center gap-4 overflow-y-auto rounded-3xl border-2 border-primary bg-card p-5 shadow-[var(--shadow-ticket)] sm:p-6">
            <div className="text-center">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Answer</div>
              <div className="font-display text-3xl font-extrabold sm:text-4xl">{answerText(row, direction)}</div>
            </div>
            <AnswerDetails row={row} className="border-0 bg-muted/60" />
          </div>
        </div>
      </div>

      {flipped ? (
        <div className="grid grid-cols-2 gap-3">
          <Button variant="miss" size="xl" onClick={() => onAnswer(false)}>
            Still learning
          </Button>
          <Button variant="success" size="xl" onClick={() => onAnswer(true)}>
            Knew it
          </Button>
        </div>
      ) : (
        <Button variant="hero" size="xl" onClick={() => setFlipped(true)}>
          Flip card
        </Button>
      )}
      <p className="text-center text-xs text-muted-foreground">
        Keyboard: Space to flip · → knew it · ← still learning
      </p>
    </div>
  );
}
