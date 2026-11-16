import { CODE_ORIGINS, codeLetterIndices, type GeoRow } from "@/lib/geo";
import { CodeChip } from "./bits";

export function MemoryName({ name, code }: { name: string; code: string }) {
  const indices = codeLetterIndices(name, code);
  return <span>{Array.from(name).map((letter, i) => indices.includes(i)
    ? <mark key={i} className="memory-letter">{letter}</mark>
    : <span key={i}>{letter}</span>)}</span>;
}

export function CodeMemory({ row }: { row: GeoRow }) {
  const codes = row.codes.filter((code) => needsCodeMemory(row, code.c));
  if (!codes.length) return null;
  return <div className="grid gap-3">
    {codes.map((code) => {
      const origin = CODE_ORIGINS[code.c];
      const name = origin?.name ?? row.city;
      const matches = codeLetterIndices(name, code.c).length > 0;
      return <div key={code.c} className="border-l-2 border-primary pl-3">
        <div className="flex flex-wrap items-center gap-2 font-semibold">
          <MemoryName name={name} code={code.c} /><span aria-hidden>→</span><CodeChip code={code} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{origin?.note ?? (
          code.kind === "b" ? "A metro code for the whole city, not just one airport." :
          matches ? `Follow the highlighted letters in order: ${code.c.split("").join(" – ")}.` :
          "Use this as a separate city–code pair; the letters do not all appear in order in this city name."
        )}</p>
      </div>;
    })}
  </div>;
}

export function needsCodeMemory(row: GeoRow, code?: string) {
  return row.codes.some((c) => (!code || c.c === code) &&
    (c.kind !== "g" || codeLetterIndices(row.city, c.c).length === 0) && !!CODE_ORIGINS[c.c]);
}