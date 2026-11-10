import { createFileRoute } from "@tanstack/react-router";
import { ListChecks } from "lucide-react";

import { ChoiceQuestion } from "@/components/geo/ChoiceQuestion";
import { PromptView } from "@/components/geo/QuizPrompt";
import { QuizShell } from "@/components/geo/QuizShell";

export const Route = createFileRoute("/multiple-choice")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Multiple choice · World Geography Codes" },
      { name: "description", content: "Pick the right airport code, city, country or TC area at your chosen difficulty." },
      { property: "og:title", content: "Multiple choice · World Geography Codes" },
      { property: "og:description", content: "Pick the right airport code, city, country or TC area at your chosen difficulty." },
    ],
  }),
  component: MultipleChoicePage,
});

function MultipleChoicePage() {
  return (
    <QuizShell
      title="Multiple choice"
      description="Choose Easy, Medium or Hard. Wrong picks are saved so you can drill them later."
      icon={ListChecks}
      renderQuestion={(p) => <ChoiceQuestion {...p} prompt={<PromptView row={p.row} direction={p.direction} difficulty={p.difficulty} />} />}
    />
  );
}
