import { useCallback, useRef, useState } from 'react';

type execFn = (token: AbortController) => Promise<unknown>;

/**
 * @description A custom hook to fetch data from an API.
 * @param {unknown} defaultValue The default value to return if no data is fetched.
 * @returns {Array} An array containing the fetched data and the request function.
 */
export const useData = (defaultValue = null) => {
  const [response, setResponse] = useState<unknown>(defaultValue);
  const [status, setStatus] = useState('IDLE');
  const cancelRef = useRef<AbortController | null>(null);

  const requestor = useCallback(async (fn: execFn) => {
    async function go() {
      if (cancelRef.current != null) {
        cancelRef.current.abort();
      }
      cancelRef.current = new AbortController();

      setStatus('LOADING');
      setResponse(await fn(cancelRef.current));
      setStatus('IDLE');
    }
    await go();
  }, []);

  return [{ ...(response ?? {}), status }, requestor];
};
