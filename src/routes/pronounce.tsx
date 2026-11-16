import { createFileRoute } from "@tanstack/react-router";
import { Play, Square, Volume2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { MemoryName } from "@/components/geo/CodeMemory";
import { FieldSelect, SpeakButton } from "@/components/geo/bits";
import { Button } from "@/components/ui/button";
import { HINTS, ROWS, SECTIONS_META, cityLang, spokenName, type CodeKind, type GeoRow } from "@/lib/geo";
import { speak, speakCity, speakCode, speakCountry, speechPrefs, speechSupported, stopSpeaking } from "@/lib/speech";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pronounce")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Pronunciation guide · World Geography Codes" },
      { name: "description", content: "Hear every country, city and airport code from the handout, spoken aloud." },
      { property: "og:title", content: "Pronunciation guide · World Geography Codes" },
      { property: "og:description", content: "Hear every country, city and airport code from the handout, spoken aloud." },
    ],
  }),
  component: PronouncePage,
});

const KIND_BG: Record<CodeKind, string> = { g: "bg-code-g", b: "bg-code-b", o: "bg-code-o", p: "bg-code-p" };

function PronouncePage() {
  const prefs = speechPrefs.useStore();
  const [q, setQ] = useState("");
  const [section, setSection] = useState<string>("all");
  const [supported, setSupported] = useState(true);
  const [now, setNow] = useState<{ text: string; voice: string } | null>(null);
  const [playingRow, setPlayingRow] = useState<string | null>(null);
  const token = useRef(0);

  useEffect(() => setSupported(speechSupported()), []);
  useEffect(() => () => stopSpeaking(), []);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return ROWS.filter((r) => {
      if (section !== "all" && r.si !== Number(section)) return false;
      if (!s) return true;
      return `${r.country} ${r.city} ${r.codes.map((c) => c.c).join(" ")} ${HINTS[r.city] ?? ""} ${HINTS[r.country] ?? ""}`
        .toLowerCase()
        .includes(s);
    });
  }, [q, section]);

  const groups = useMemo(() => {
    const m = new Map<number, GeoRow[]>();
    rows.forEach((r) => m.set(r.si, [...(m.get(r.si) ?? []), r]));
    return [...m.entries()];
  }, [rows]);

  const stop = () => {
    token.current++;
    stopSpeaking();
    setNow(null);
    setPlayingRow(null);
  };

  const once = (text: string, voice: string) => {
    token.current++;
    setPlayingRow(null);
    setNow({ text, voice });
  };

  const playTable = (list: GeoRow[]) => {
    stopSpeaking();
    const my = ++token.current;
    const queue: { text: string; lang: string; row: GeoRow }[] = [];
    let prev = "";
    list.forEach((r) => {
      if (r.country !== prev) {
        queue.push({ text: spokenName(r.country), lang: "en-US", row: r });
        prev = r.country;
      }
      queue.push({ text: spokenName(r.city), lang: cityLang(r, prefs.voice), row: r });
    });
    let n = 0;
    const next = () => {
      if (my !== token.current) return;
      if (n >= queue.length) {
        stop();
        return;
      }
      const item = queue[n++];
      if (!item) return;
      setPlayingRow(item.row.id);
      document.getElementById(`p-${item.row.id}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
      const voice = speak(item.text, item.lang, () => setTimeout(next, 300));
      setNow({ text: item.text, voice });
    };
    next();
  };

  return (
    <main className="mx-auto max-w-5xl px-4 pb-32 pt-6">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Hear every country, city and code</h1>
      <p className="mt-1 max-w-2xl text-muted-foreground">
        Tap the speaker to hear a name. Tap a code to hear it spelled letter by letter. Grey text is an approximate
        respelling, with the stressed part in CAPS.
      </p>

      {!supported && (
        <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          Your browser doesn't support spoken audio here. Try Chrome, Edge or Safari.
        </p>
      )}

      <div className="ticket mt-6 grid gap-4 p-5 sm:grid-cols-4">
        <label className="grid gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Search</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="city, country or code"
            className="h-10 rounded-full border border-border bg-card px-4 text-sm outline-none focus:border-ring"
          />
        </label>
        <FieldSelect label="Section" value={section} onChange={setSection}>
          <option value="all">All sections</option>
          {SECTIONS_META.map((s) => (
            <option key={s.si} value={s.si}>
              {s.name}
            </option>
          ))}
        </FieldSelect>
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
        <p className="text-xs text-muted-foreground sm:col-span-4">
          Voices come from your device, so quality and accent vary. Countries are always spoken in English.
        </p>
      </div>

      <div className="mt-6 grid gap-6">
        {groups.length === 0 && <p className="text-muted-foreground">No matches.</p>}
        {groups.map(([si, list]) => {
          const meta = SECTIONS_META[si];
          if (!meta) return null;
          return (
            <details key={si} className="min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-ticket)]">
              <summary className={cn("cursor-pointer px-4 py-3 font-display font-bold text-area-foreground", meta.area === 1 ? "bg-area-1" : meta.area === 2 ? "bg-area-2" : "bg-area-3")}>{meta.name} · {list.length} rows</summary>
              <div className="overflow-x-auto">
                <Button variant="ghost" size="sm" className="m-2" onClick={() => playTable(list)}><Play /> Play table</Button>
              <table className="study-table w-full min-w-[560px] border-separate border-spacing-0 text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                    {["Country", "City", "Code (tap to spell)"].map((h) => (
                      <th key={h} className="border-b border-border bg-muted px-3 py-2 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {list.map((r) => (
                    <tr
                      key={r.id}
                      id={`p-${r.id}`}
                      className={cn("transition", playingRow === r.id ? "bg-success/20" : "hover:bg-muted/50")}
                    >
                      <td className="border-b border-border px-3 py-2 align-top">
                        <span className="mobile-table-label">Country</span>
                        <span className="flex items-start gap-2">
                          <SpeakButton
                            label={`Hear ${r.country}`}
                            onClick={() => once(r.country, speakCountry(r))}
                          />
                          <span>
                            <span className="font-semibold">{r.country}</span>
                            {HINTS[r.country] && (
                              <span className="block text-xs text-muted-foreground">{HINTS[r.country]}</span>
                            )}
                          </span>
                        </span>
                      </td>
                      <td className="border-b border-border px-3 py-2 align-top">
                        <span className="flex items-start gap-2">
                          <SpeakButton label={`Hear ${r.city}`} onClick={() => once(r.city, speakCity(r))} />
                          <span>
                            <span className="mobile-table-label">City</span><MemoryName name={r.cityRaw} code={r.codes[0]?.c ?? ""} />
                            {HINTS[r.city] && (
                              <span className="block text-xs text-muted-foreground">{HINTS[r.city]}</span>
                            )}
                          </span>
                        </span>
                      </td>
                      <td className="border-b border-border px-3 py-2 align-top">
                        <span className="mobile-table-label">Code</span><span className="flex flex-wrap gap-1.5">
                          {r.codes.map((c) => (
                            <Button variant="ghost"
                              key={c.c}
                              type="button"
                              onClick={() => once(c.c.split("").join(" "), speakCode(c.c))}
                              className={cn(
                                "inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg px-2.5 font-mono font-bold tracking-wider transition hover:brightness-95 active:scale-95",
                                KIND_BG[c.kind],
                              )}
                            >
                              <Volume2 className="size-3.5" /> {c.c}
                            </Button>
                          ))}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </details>
          );
        })}
      </div>

      {now && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-board px-4 py-3 text-board-foreground">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
            <span className="truncate text-sm">
              <Volume2 className="mr-1 inline size-4" />
              <b>{now.text}</b> <span className="text-board-muted">· {now.voice}</span>
            </span>
            <Button variant="hero" size="sm" onClick={stop}>
              <Square /> Stop
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
