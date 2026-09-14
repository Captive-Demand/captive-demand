'use client';

import { useCallback, useSyncExternalStore } from 'react';

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
