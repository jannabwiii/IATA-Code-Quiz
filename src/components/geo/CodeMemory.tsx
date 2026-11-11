import { CODE_ORIGINS, memoryLetterIndices, type GeoRow } from "@/lib/geo";

export function MemoryName({ name, code, codes, visible = true }: { name: string; code?: string; codes?: string[]; visible?: boolean }) {
  const indices = memoryLetterIndices(name, codes ?? (code ? [code] : []), visible);
  return <span>{Array.from(name).map((letter, i) => <span key={i} className={indices.includes(i) ? "memory-letter" : undefined}>{letter}</span>)}</span>;
}

/** Keep genuine origins; omit obvious city-to-code explanations. */
export function CodeMemory({ row }: { row: GeoRow }) {
  const origins = row.codes.flatMap((code) => {
    const origin = CODE_ORIGINS[code.c];
    return origin ? [{ code: code.c, ...origin }] : [];
  });
  if (!origins.length) return null;
  return <div className="grid gap-3">{origins.map((origin) => <div key={origin.code} className="border-l-2 border-primary pl-3">
    <p className="font-semibold">{origin.code} · {origin.name}</p>
    <p className="text-sm text-muted-foreground">{origin.note}</p>
  </div>)}</div>;
}
