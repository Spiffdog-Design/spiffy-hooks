import { useCallback, useRef, useState } from 'react';

type execFn = (token: AbortController) => Promise<any>;

export const useData = (defaultValue = null) => {
  const [response, setResponse] = useState<any>(defaultValue);
  const [status, setStatus] = useState('IDLE');
  const cancelRef = useRef<AbortController | null>(null);

  const requestor = useCallback((fn: execFn) => {
    async function go() {
      if (cancelRef.current != null) {
        cancelRef.current.abort();
      }
      cancelRef.current = new AbortController();

      setStatus('LOADING');
      const res = await fn(cancelRef.current);
      setResponse(res);
      setStatus('IDLE');
    }
    go();
  }, []);

  return [{ ...response, status }, requestor];
};
