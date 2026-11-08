import { cityLang, spokenName, type GeoRow } from "./geo";
import { createPersistedStore } from "./store";

export interface SpeechPrefs {
  voice: "local" | "en";
  slow: boolean;
}

export const speechPrefs = createPersistedStore<SpeechPrefs>("wg-voice", { voice: "local", slow: false });

export const speechSupported = () => typeof window !== "undefined" && "speechSynthesis" in window;

let voices: SpeechSynthesisVoice[] = [];
let inited = false;

function init() {
  if (inited || !speechSupported()) return;
  inited = true;
  const load = () => {
    voices = window.speechSynthesis.getVoices();
  };
  load();
  window.speechSynthesis.addEventListener?.("voiceschanged", load);
}

function pickVoice(lang: string) {
  const x = lang.toLowerCase();
  return (
    voices.find((v) => v.lang.toLowerCase().replace("_", "-") === x) ??
    voices.find((v) => v.lang.toLowerCase().slice(0, 2) === x.slice(0, 2)) ??
    null
  );
}

/** Queue an utterance. Returns a short description of the voice used. */
export function speak(text: string, lang: string, onEnd?: () => void): string {
  if (!speechSupported()) {
    onEnd?.();
    return "";
  }
  init();
  const u = new SpeechSynthesisUtterance(text);
  const v = pickVoice(lang);
  if (v) {
    u.voice = v;
    u.lang = v.lang;
  } else u.lang = lang;
  u.rate = speechPrefs.get().slow ? 0.6 : 0.95;
  u.onend = u.onerror = () => onEnd?.();
  window.speechSynthesis.speak(u);
  return v ? `${v.name} (${v.lang})` : `default voice (no ${lang} voice found)`;
}

export function stopSpeaking() {
  if (speechSupported()) window.speechSynthesis.cancel();
}

export function speakNow(text: string, lang: string, onEnd?: () => void) {
  stopSpeaking();
  return speak(text, lang, onEnd);
}

export const spell = (code: string) => code.split("").join(", ");

export const speakCity = (row: GeoRow) => speakNow(spokenName(row.city), cityLang(row, speechPrefs.get().voice));
export const speakCountry = (row: GeoRow) => speakNow(spokenName(row.country), "en-US");
export const speakCode = (code: string) => speakNow(spell(code), "en-US");
export const speakCodes = (row: GeoRow) => speakNow(row.codes.map((c) => spell(c.c)).join(". "), "en-US");
