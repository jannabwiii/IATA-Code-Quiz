import { Keyboard, ListChecks, type LucideIcon } from "lucide-react";

export interface QuizMode {
  to: "/type-it" | "/multiple-choice";
  title: string;
  bestFor: string;
  icon: LucideIcon;
}

export const QUIZ_MODES: QuizMode[] = [
  { to: "/multiple-choice", title: "Multiple Choice", bestFor: "Easier", icon: ListChecks },
  { to: "/type-it", title: "Typing", bestFor: "Harder", icon: Keyboard },
];
