import { cn } from "@/lib/utils";
import { HINTS, type Direction, type GeoRow } from "@/lib/geo";
import { speakCity, speakCodes, speakCountry } from "@/lib/speech";

import { AreaBadge, CodeChips, SpeakButton } from "./bits";

const QUESTION: Record<Direction, string> = {
  "city-code": "What's the code for",
  "code-city": "Which city has the code",
  "city-country": "Which country is this city in?",
  "city-area": "Which TC area is this?",
};

/** The question side. `tone="board"` renders it like an airport departure board. */
export function PromptView({
  row,
  direction,
  tone = "board",
}: {
  row: GeoRow;
  direction: Direction;
  tone?: "board" | "paper";
}) {
  const board = tone === "board";
  const sub = board ? "text-board-muted" : "text-muted-foreground";
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span className={cn("text-xs font-bold uppercase tracking-[0.2em]", sub)}>{QUESTION[direction]}</span>
      {direction === "code-city" ? (
        <div className="flex flex-wrap justify-center gap-2">
          {row.codes.map((c) => (
            <span
              key={c.c}
              className={cn(
                "flap px-4 py-2 text-4xl sm:text-5xl",
                !board && "shadow-[var(--shadow-board)]",
              )}
            >
              {c.c}
            </span>
          ))}
        </div>
      ) : (
        <span
          className={cn(
            "font-display text-4xl font-extrabold leading-tight sm:text-5xl",
            board ? "text-board-foreground" : "text-foreground",
          )}
        >
          {row.city}
        </span>
      )}
      <span className={cn("text-sm", sub)}>
        {direction === "city-code" && [row.state, row.country].filter(Boolean).join(" · ")}
        {direction === "city-area" && row.country}
        {direction === "city-country" && row.state}
        {direction === "code-city" && row.codes.length > 1 && "Any code in the group"}
      </span>
    </div>
  );
}

/** Full facts about a row, shown after an answer. */
export function AnswerDetails({ row, className }: { row: GeoRow; className?: string }) {
  const hint = HINTS[row.city];
  const coHint = HINTS[row.country];
  return (
    <div className={cn("grid gap-3 rounded-xl border border-border bg-card p-4 text-left", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <AreaBadge area={row.area} />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{row.section}</span>
      </div>
      <div className="flex items-center gap-2">
        <SpeakButton label={`Hear ${row.city}`} onClick={() => speakCity(row)} />
        <div>
          <div className="font-display text-xl font-bold leading-tight">{row.cityRaw}</div>
          {hint && <div className="text-sm text-muted-foreground">{hint}</div>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <SpeakButton label={`Hear ${row.country}`} onClick={() => speakCountry(row)} />
        <div>
          <div className="font-semibold">
            {row.country}
            {row.state && <span className="font-normal text-muted-foreground"> · {row.state}</span>}
          </div>
          {coHint && <div className="text-sm text-muted-foreground">{coHint}</div>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <SpeakButton label="Hear the code spelled" onClick={() => speakCodes(row)} />
        <CodeChips codes={row.codes} className="text-base" />
      </div>
    </div>
  );
}
