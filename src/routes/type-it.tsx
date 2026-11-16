import { createFileRoute } from "@tanstack/react-router";
import { Eye, Keyboard } from "lucide-react";
import { useRef, useState } from "react";

import { AnswerDetails, PromptView } from "@/components/geo/QuizPrompt";
import { QuizShell, type QuestionProps } from "@/components/geo/QuizShell";
import { Button } from "@/components/ui/button";
import { answerText, checkAnswer, DIFFICULTIES, type Direction } from "@/lib/geo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/type-it")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Type the answer · World Geography Codes" },
      { name: "description", content: "Type airport codes, cities, countries and TC areas from memory." },
      { property: "og:title", content: "Type the answer · World Geography Codes" },
      { property: "og:description", content: "Type airport codes, cities, countries and TC areas from memory." },
    ],
  }),
  component: TypeItPage,
});

const PLACEHOLDER: Record<Direction, string> = {
  "city-code": "Type a code, e.g. LAX",
  "code-city": "Type the city",
  "city-country": "Type the country",
  "city-area": "1, 2 or 3",
};

function TypeItPage() {
  return (
    <QuizShell
      title="Type the answer"
      description="Type it from memory and press Enter. Wrong guesses shake so you can try again."
      icon={Keyboard}
      renderQuestion={(p) => <TypeQuestion {...p} />}
    />
  );
}

function TypeQuestion({ row, direction, difficulty, onAnswer }: QuestionProps) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "right" | "gaveup">("idle");
  const [wrong, setWrong] = useState(0);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const done = status !== "idle";

  const submit = () => {
    if (done) {
      onAnswer(status === "right");
      return;
    }
    if (!value.trim()) {
      setStatus("gaveup");
      return;
    }
    if (checkAnswer(row, direction, value)) setStatus("right");
    else {
      setWrong((w) => w + 1);
      if (wrong + 1 >= (DIFFICULTIES.find((d) => d.value === difficulty)?.attempts ?? Infinity)) setStatus("gaveup");
      setShake(true);
      setTimeout(() => setShake(false), 450);
      inputRef.current?.select();
    }
  };

  return (
    <div className="quiz-layout">
      <div className="quiz-main">
      <div className="rounded-lg bg-board px-6 py-10 shadow-[var(--shadow-board)]">
        <PromptView row={row} direction={direction} difficulty={difficulty} />
      </div>

      {difficulty === "easy" && !done && <p className="text-center text-sm text-primary">First-letter hint: {answerText(row, direction).charAt(0)}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="grid gap-3"
      >
        <input
          ref={inputRef}
          autoFocus
          value={value}
          readOnly={done}
          onChange={(e) => setValue(e.target.value)}
          placeholder={PLACEHOLDER[direction]}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Your answer"
          className={cn(
            "min-w-0 w-full h-16 rounded-lg border-2 bg-card px-5 text-center text-2xl font-semibold outline-none transition focus:border-ring",
            direction === "city-code" && "font-mono uppercase tracking-widest",
            shake && "shake border-destructive",
            status === "right" && "border-success bg-success/10",
            status === "gaveup" && "border-destructive bg-destructive/5",
            !shake && status === "idle" && "border-border",
          )}
        />
        {!done ? (
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <Button type="submit" variant="hero" size="xl">
              Check
            </Button>
            <Button type="button" variant="pill" size="xl" onClick={() => setStatus("gaveup")}>
              <Eye /> Show me
            </Button>
          </div>
        ) : (
          <Button type="submit" variant="hero" size="xl">
            Next
          </Button>
        )}
      </form>

      {wrong > 0 && !done && (
        <p className="text-center text-sm text-destructive">
          Not that one{wrong > 1 ? ` (${wrong} tries)` : ""}. Try again, or press Enter on an empty box to see it.
        </p>
      )}

      {done && (
        <div className="pop-in grid gap-4">
          <div
            className={cn(
              "text-center font-display text-xl font-bold",
              status === "right" ? "text-success" : "text-destructive",
            )}
          >
            {status === "right" ? "Correct!" : `The answer is ${answerText(row, direction)}`}
          </div>
        </div>
      )}
      <p className="text-center text-xs text-muted-foreground">
        Capitals, accents and spaces don't matter. For cities with several codes, any one counts.
      </p>
      </div>
      {done && <aside className="quiz-details pop-in"><AnswerDetails row={row} /></aside>}
    </div>
  );
}
