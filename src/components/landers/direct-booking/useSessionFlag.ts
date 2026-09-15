'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';

/**
 * A one-way sticky flag kept in sessionStorage so a refresh after booking does
 * not replay the conversion or re-ask the prep questions.
 *
 * sessionStorage is an external store shared by several components on this
 * page, so it is read through useSyncExternalStore rather than mirrored into
 * component state. That also keeps the server snapshot (`false`) authoritative
 * during hydration.
 */
export function useSessionFlag(key: string, eventName: string): [boolean, () => void] {
  const subscribe = useCallback(
    (onChange: () => void) => {
      window.addEventListener(eventName, onChange);
      return () => window.removeEventListener(eventName, onChange);
    },
    [eventName],
  );

  const getSnapshot = useCallback(() => {
    try {
      return window.sessionStorage.getItem(key) === '1';
    } catch {
      return false;
    }
  }, [key]);

  const value = useSyncExternalStore(subscribe, getSnapshot, () => false);

  const set = useCallback(() => {
    try {
      window.sessionStorage.setItem(key, '1');
    } catch {
      /* private mode — the flag degrades to this page life only */
    }
    window.dispatchEvent(new CustomEvent(eventName));
  }, [key, eventName]);

  return [value, set];
}

/**
 * A JSON record kept in sessionStorage, read the same way. The parsed value is
 * cached per raw string so the snapshot stays referentially stable.
 */
export function useSessionRecord<T>(key: string, eventName: string): [T | null, (next: T | null) => void] {
  const subscribe = useCallback(
    (onChange: () => void) => {
      window.addEventListener(eventName, onChange);
      return () => window.removeEventListener(eventName, onChange);
    },
    [eventName],
  );

  const getSnapshot = useCallback(() => {
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }, [key]);

  const raw = useSyncExternalStore(subscribe, getSnapshot, () => null);

  const value = useMemo<T | null>(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }, [raw]);

  const set = useCallback(
    (next: T | null) => {
      try {
        if (next === null) window.sessionStorage.removeItem(key);
        else window.sessionStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* private mode — the record degrades to this page life only */
      }
      window.dispatchEvent(new CustomEvent(eventName));
    },
    [key, eventName],
  );

  return [value, set];
}
