import { useEffect, useState } from 'react';

type SetValue<T> = (value: T | ((prev: T) => T)) => void;

/**
 * Generic localStorage-backed state.
 * Reads once on mount, writes on every change, and fails safely
 * (corrupt reads fall back to initialValue; write errors are ignored).
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore write errors (e.g. storage quota exceeded)
    }
  }, [key, value]);

  return [value, setValue];
}