import { createFileRoute } from "@tanstack/react-router";
import { Eye, Keyboard } from "lucide-react";
import { useState } from "react";

import { AnswerDetails, PromptView } from "@/components/geo/QuizPrompt";
import { QuizShell, type QuestionProps } from "@/components/geo/QuizShell";
import { Button } from "@/components/ui/button";
import { answerText, checkAnswer, type Direction } from "@/lib/geo";
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
  "city-code": "Code",
  "code-city": "City",
  "city-country": "Country",
  "city-area": "1, 2 or 3",
};

function TypeItPage() {
  return (
    <QuizShell
      title="Typing"
      description=""
      icon={Keyboard}
      renderQuestion={(p) => <TypeQuestion {...p} />}
    />
  );
}

function TypeQuestion({ row, direction, onAnswer }: QuestionProps) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "right" | "gaveup">("idle");
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
    else setStatus("gaveup");
  };

  return (
    <div className="grid gap-5">
      <div className="rounded-lg bg-board px-6 py-10 shadow-[var(--shadow-board)]">
        <PromptView row={row} direction={direction} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="answer-area grid gap-3"
      >
        <input
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
            status === "right" && "border-success bg-success/10",
            status === "gaveup" && "border-destructive bg-destructive/5",
            status === "idle" && "border-border",
          )}
        />
        {!done ? (
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <Button type="submit" variant="hero" size="xl">
              Check
            </Button>
            <Button type="button" variant="pill" size="xl" onClick={() => setStatus("gaveup")}>
              <Eye /> Reveal
            </Button>
          </div>
        ) : (
          <Button type="submit" variant="hero" size="xl">
            Next
          </Button>
        )}
      </form>

      {done && (
        <div className="pop-in grid gap-4">
          <div
            className={cn(
              "text-center font-display text-xl font-bold",
              status === "right" ? "text-success" : "text-destructive",
            )}
          >
            {status === "right" ? "Correct!" : `Answer: ${answerText(row, direction)}`}
          </div>
          <AnswerDetails row={row} />
        </div>
      )}

    </div>
  );
}
