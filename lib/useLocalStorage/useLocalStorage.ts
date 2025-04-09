import { useCallback, useEffect, useState } from 'react';

const eventName = 'local-storage-change';

export function useLocalStorage(key: string, initialValue: unknown) {
  const [item, setItem] = useState<unknown>();

  const setValue = useCallback(
    (value: unknown) => {
      const oldV = window.localStorage.getItem(key);
      const newV = value == null ? null : JSON.stringify(parse(value));

      if (newV == null) {
        localStorage.removeItem(key);
      } else if (oldV !== newV) {
        localStorage.setItem(key, newV);
        window.dispatchEvent(
          new StorageEvent(eventName, {
            key,
            oldValue: oldV,
            newValue: newV,
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
  return isJsonString(v) ? JSON.parse(v) : v;
}

function isJsonString(value: string): boolean {
  try {
    JSON.parse(value);
  } catch (e) {
    return false;
  }
  return true;
}
