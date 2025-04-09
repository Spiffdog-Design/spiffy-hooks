import { useCallback, useEffect, useState } from 'react';

const eventName = 'local-storage-change';

export function useLocalStorage(key: string, initialValue: unknown) {
  const [item, setItem] = useState<unknown>();

  const setValue = useCallback(
    (value: unknown) => {
      const oldValue = window.localStorage.getItem(key);
      const newValue = value == null ? null : JSON.stringify(parse(value));

      if (newValue == null) {
        localStorage.removeItem(key);
      } else if (oldValue !== newValue) {
        localStorage.setItem(key, newValue);
        window.dispatchEvent(
          new StorageEvent(eventName, {
            key,
            oldValue,
            newValue,
          }),
        );
      }
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
  return v != null && typeof v === 'string' ? JSON.parse(v) : v;
}
