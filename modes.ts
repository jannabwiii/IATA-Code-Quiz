import { Headphones, Keyboard, Layers, ListChecks, Table2, type LucideIcon } from "lucide-react";

export interface QuizMode {
  to: "/flashcards" | "/multiple-choice" | "/type-it" | "/listen" | "/tables";
  title: string;
  /** One plain sentence: what this quiz is. */
  blurb: string;
  /** What appears on screen. */
  youSee: string;
  /** What you do about it. */
  youDo: string;
  /** Who it suits. Shown as a short note on the card. */
  bestFor: string;
  icon: LucideIcon;
}

export const QUIZ_MODES: QuizMode[] = [
  {
    to: "/flashcards",
    title: "Flashcards",
    blurb: "Flip a card, then tell it honestly if you knew the answer.",
    youSee: "A city, for example Manila",
    youDo: "Think of the code, flip the card, then tap Knew it or Still learning",
    bestFor: "Best for starting out",
    icon: Layers,
  },
  {
    to: "/multiple-choice",
    title: "Multiple choice",
    blurb: "Pick the right answer out of four look-alikes.",
    youSee: "A city and four possible codes",
    youDo: "Tap the code you think is right",
    bestFor: "Best for a quick round",
    icon: ListChecks,
  },
  {
    to: "/type-it",
    title: "Type the answer",
    blurb: "Spell the answer yourself. Capital letters and accents don’t matter.",
    youSee: "A city and an empty box",
    youDo: "Type the code and press Enter",
    bestFor: "Hardest. Best before a test",
    icon: Keyboard,
  },
  {
    to: "/listen",
    title: "Listen & pick",
    blurb: "Hear a city or a spelled-out code, then choose the match.",
    youSee: "A speaker button and four choices",
    youDo: "Press play, listen, then tap the match (turn your sound on)",
    bestFor: "Best for learning how names sound",
    icon: Headphones,
  },
  {
    to: "/tables",
    title: "Table drill",
    blurb: "The full handout tables with columns you choose to hide.",
    youSee: "The handout tables with some columns hidden",
    youDo: "Type into the grey boxes and press Enter",
    bestFor: "Best for the whole handout at once",
    icon: Table2,
  },
];
