import type { Progress } from "./geo";
import { createPersistedStore } from "./store";

// "wgp" is the key the original study page used, so earlier progress is kept.
const store = createPersistedStore<Progress>("wgp", {});

export const useProgress = store.useStore;
export const getProgress = store.get;

export function setMark(id: string, mark: "k" | "m" | null) {
  const next = { ...store.get() };
  if (mark) next[id] = mark;
  else delete next[id];
  store.set(next);
}

export function resetProgress() {
  store.set({});
}
