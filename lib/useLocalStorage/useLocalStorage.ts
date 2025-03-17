import { useCallback, useEffect, useState } from 'react';

const eventName = 'local-storage-change';

export function useLocalStorage(key: string, initialValue: unknown) {
  const [item, setItem] = useState<unknown>(null);

  const setValue = useCallback(
    (value: unknown) => {
      localStorage.setItem(key, JSON.stringify(parse(value)));
      window.dispatchEvent(new StorageEvent(eventName, { bubbles: true }));
    },
    [key],
  );

  const handleLocalStorageChange = useCallback(() => {
    setItem(getSnapshot(key));
  }, [key]);

  useEffect(() => {
    const snapshot = getSnapshot(key);
    setValue(snapshot != null ? snapshot : initialValue);
  }, [key, initialValue, setValue]);

  useEffect(() => {
    window.addEventListener(eventName, handleLocalStorageChange);
    return () => {
      window.removeEventListener(eventName, handleLocalStorageChange);
    };
  }, [handleLocalStorageChange]);

  return [item, setValue];
}

function getSnapshot(key: string) {
  return parse(localStorage.getItem(key));
}

function parse(value: unknown) {
  const v = typeof value === 'function' ? value() : value;
  return typeof value === 'string' ? JSON.parse(v) : v;
}
