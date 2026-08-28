"use client";

import { useCallback, useSyncExternalStore } from "react";
import { FALLBACK_API_KEY } from "./youtube";

const STORAGE_KEY = "srdtube.apiKey";

/**
 * The user's own API key, remembered across visits and shared by both tools.
 *
 * It lives in `localStorage` rather than React state so that both tabs of the
 * app agree without a provider, and `useSyncExternalStore` is what reads it:
 * the server snapshot is empty (there is no storage at build time) and the
 * client subscribes, so hydration matches and later writes still repaint.
 */

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);

  // Another tab changing the key should update this one too — and the cached
  // snapshot has to be dropped first, or React re-reads the stale value.
  const onStorage = () => {
    cached = null;
    listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function readStored(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    // Private mode, or storage disabled. The fallback key still works.
    return "";
  }
}

function write(value: string) {
  try {
    if (value) window.localStorage.setItem(STORAGE_KEY, value);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Not remembering it is survivable; losing the keystroke is not, so the
    // cached snapshot below is updated either way.
  }
  cached = value;
  for (const listener of listeners) listener();
}

/** `getSnapshot` must return a stable string, so the read is cached. */
let cached: string | null = null;

function getSnapshot(): string {
  if (cached === null) cached = readStored();
  return cached;
}

function getServerSnapshot(): string {
  return "";
}

export function useApiKey() {
  const apiKey = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setApiKey = useCallback((value: string) => write(value), []);

  /** What the API layer should actually send. */
  const effectiveKey = apiKey.trim() || FALLBACK_API_KEY;

  return { apiKey, setApiKey, effectiveKey, usingFallback: !apiKey.trim() };
}
