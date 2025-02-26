import { useEffect, useSyncExternalStore } from 'react';

const eventName = 'local-storage';

export function useLocalStorage(key: string, initialValue: unknown) {
  const item = useSyncExternalStore(
    subscribe,
    () => getSnapshot,
    () => undefined,
  );

  const getSnapshot = (): unknown => parse(localStorage.getItem(key));

  const setValue = (value: unknown) => {
    const v = parse(value);
    localStorage.setItem(key, JSON.stringify(v));
    window.dispatchEvent(new Event(eventName));
  };

  useEffect(() => {
    if (initialValue !== undefined) {
      setValue(initialValue);
    }
  });

  return [item, setValue];
}

function parse(value: unknown) {
  return typeof value === 'string' ? JSON.parse(value) : value;
}

function subscribe(callback: () => void) {
  window.addEventListener(eventName, () => {
    console.log('event');
    callback();
  });
  return () => window.removeEventListener(eventName, callback);
}
