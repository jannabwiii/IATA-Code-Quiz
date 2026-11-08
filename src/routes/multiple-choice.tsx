import { createFileRoute } from "@tanstack/react-router";
import { ListChecks } from "lucide-react";

import { ChoiceQuestion } from "@/components/geo/ChoiceQuestion";
import { PromptView } from "@/components/geo/QuizPrompt";
import { QuizShell } from "@/components/geo/QuizShell";

export const Route = createFileRoute("/multiple-choice")({
  head: () => ({
    meta: [
      { title: "Multiple choice · World Geography Codes" },
      { name: "description", content: "Pick the right airport code, city, country or TC area from four choices." },
      { property: "og:title", content: "Multiple choice · World Geography Codes" },
      { property: "og:description", content: "Pick the right airport code, city, country or TC area from four choices." },
    ],
  }),
  component: MultipleChoicePage,
});

function MultipleChoicePage() {
  return (
    <QuizShell
      title="Multiple choice"
      description="Four options, one right answer. Wrong picks are saved so you can drill them later."
      icon={ListChecks}
      renderQuestion={(p) => <ChoiceQuestion {...p} prompt={<PromptView row={p.row} direction={p.direction} />} />}
    />
  );
}
