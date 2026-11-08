import { useSyncExternalStore } from "react";

/** Tiny localStorage-backed store. Server render and first client paint use `initial`. */
export function createPersistedStore<T>(key: string, initial: T) {
  let state = initial;
  let loaded = false;
  const listeners = new Set<() => void>();

  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) state = { ...initial, ...JSON.parse(raw) };
    } catch {
      /* ignore broken storage */
    }
  };

  const get = () => {
    load();
    return state;
  };

  const set = (next: T) => {
    load();
    state = next;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* storage may be unavailable */
    }
    listeners.forEach((l) => l());
  };

  const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  };

  const useStore = () => useSyncExternalStore(subscribe, get, () => initial);

  return { get, set, subscribe, useStore };
}
