import { useCallback, useEffect, useState } from 'react';

const eventName = 'local-storage-change';

export function useLocalStorage(key: string, initialValue: unknown) {
  const [item, setItem] = useState<unknown>(getSnapshot(key));

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
    if (initialValue != null) {
      setValue(initialValue);
    }
  }, [initialValue, setValue]);

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
  return typeof value === 'string' ? JSON.parse(value) : value;
}
