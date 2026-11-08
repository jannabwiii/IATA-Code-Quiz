import { Headphones, Keyboard, Layers, ListChecks, Table2, type LucideIcon } from "lucide-react";

export interface QuizMode {
  to: "/flashcards" | "/multiple-choice" | "/type-it" | "/listen" | "/tables";
  title: string;
  blurb: string;
  tag: string;
  icon: LucideIcon;
}

export const QUIZ_MODES: QuizMode[] = [
  {
    to: "/flashcards",
    title: "Flashcards",
    blurb: "Flip a card, then tell it honestly if you knew it.",
    tag: "Self-check",
    icon: Layers,
  },
  {
    to: "/multiple-choice",
    title: "Multiple choice",
    blurb: "Pick the right answer out of four look-alikes.",
    tag: "Quick round",
    icon: ListChecks,
  },
  {
    to: "/type-it",
    title: "Type the answer",
    blurb: "Spell it out yourself. Caps and accents don't matter.",
    tag: "Hardest",
    icon: Keyboard,
  },
  {
    to: "/listen",
    title: "Listen & pick",
    blurb: "Hear a city or a spelled-out code, then choose the match.",
    tag: "Audio",
    icon: Headphones,
  },
  {
    to: "/tables",
    title: "Table drill",
    blurb: "The full handout tables. Hide any column and fill it in.",
    tag: "Classic",
    icon: Table2,
  },
];
