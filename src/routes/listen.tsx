import { createFileRoute } from "@tanstack/react-router";
import { Headphones, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { FieldSelect } from "@/components/geo/bits";
import { ChoiceQuestion } from "@/components/geo/ChoiceQuestion";
import { QuizShell, type QuestionProps } from "@/components/geo/QuizShell";
import { speakCity, speakCodes, speechPrefs, speechSupported } from "@/lib/speech";

export const Route = createFileRoute("/listen")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Listen & pick · World Geography Codes" },
      { name: "description", content: "Hear a city name or a spelled-out airport code, then pick the right match." },
      { property: "og:title", content: "Listen & pick · World Geography Codes" },
      { property: "og:description", content: "Hear a city name or a spelled-out airport code, then pick the right match." },
    ],
  }),
  component: ListenPage,
});

function VoiceSettings() {
  const prefs = speechPrefs.useStore();
  const [supported, setSupported] = useState(true);
  useEffect(() => setSupported(speechSupported()), []);
  return (
    <div className="grid gap-3">
      {!supported && (
        <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          This browser can't speak out loud. Try Chrome, Edge or Safari.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldSelect
          label="City voice"
          value={prefs.voice}
          onChange={(v) => speechPrefs.set({ ...prefs, voice: v as "local" | "en" })}
        >
          <option value="local">Local language</option>
          <option value="en">English</option>
        </FieldSelect>
        <FieldSelect
          label="Speed"
          value={prefs.slow ? "slow" : "normal"}
          onChange={(v) => speechPrefs.set({ ...prefs, slow: v === "slow" })}
        >
          <option value="normal">Normal</option>
          <option value="slow">Slow</option>
        </FieldSelect>
      </div>
      <p className="text-xs text-muted-foreground">
        Voices come from your device, so accents vary. Turn your sound on.
      </p>
    </div>
  );
}

function ListenPage() {
  return (
    <QuizShell
      title="Listen & pick"
      description="Your device reads out a city (or spells a code letter by letter). Pick what matches."
      icon={Headphones}
      directionLabels={{
        "city-code": "Hear city → pick code",
        "code-city": "Hear code → pick city",
        "city-country": "Hear city → pick country",
        "city-area": "Hear city → pick TC area",
      }}
      setupExtra={<VoiceSettings />}
      renderQuestion={(p) => <ListenQuestion {...p} />}
    />
  );
}

function ListenQuestion(p: QuestionProps) {
  const play = () => (p.direction === "code-city" ? speakCodes(p.row) : speakCity(p.row));

  useEffect(() => {
    const t = setTimeout(play, 250);
    return () => clearTimeout(t);
    // Play once when the question appears.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ChoiceQuestion
      {...p}
      prompt={
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-board-muted">
            {p.direction === "code-city" ? "Listen to the code" : "Listen to the city"}
          </span>
          <Button variant="ghost"
            type="button"
            onClick={play}
            aria-label="Play again"
            className="flex size-24 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground ring-4 ring-primary/30 transition hover:scale-105 active:scale-95"
          >
            <Volume2 className="size-10" />
          </Button>
          <span className="text-sm text-board-muted">Tap to hear it again</span>
        </div>
      }
    />
  );
}
