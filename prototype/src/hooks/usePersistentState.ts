import { useEffect, useRef, useState } from 'react';

/**
 * Drop-in replacement for `useState` that syncs the value to localStorage under `key`.
 * On first mount, tries to load from localStorage; if nothing is stored, uses `initial`
 * (which may be a value or a lazy initializer).
 */
export function usePersistentState<T>(key: string, initial: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return typeof initial === 'function' ? (initial as () => T)() : initial;
    }
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        return JSON.parse(raw) as T;
      }
    } catch {
      /* ignore */
    }
    return typeof initial === 'function' ? (initial as () => T)() : initial;
  });

  const firstRun = useRef(true);
  useEffect(() => {
    // Persist on every change after the initial load.
    if (firstRun.current) {
      firstRun.current = false;
      // Also write the initial value so subsequent loads have it, even if user never edits.
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* ignore */
      }
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value]);

  return [value, setValue] as const;
}
