import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type UseDataExecuteFn = (controller: AbortController) => Promise<Response>;
export type UseDataRequestor = (fn: UseDataExecuteFn) => Promise<void>;
export type UseDataReturn<T> = [UseDataResponse<T>, UseDataRequestor];
export type UseDataStatuses = 'IDLE' | 'FETCHING' | 'RESPONDING';
export type UseDataOptions = {
  debug?: boolean;
};
export type UseDataResponse<T> = {
  data: T | null;
  raw: Response | null;
  status: UseDataStatuses;
};

const defaultResponse = { raw: null, data: null, status: 'IDLE' };

/**
 * @description A custom hook to fetch data from an API.
 * @param {boolean} options Options settings for the hook.
 * @returns {T} An object or array of type T.
 */
export function useData<T>({ debug }: UseDataOptions = { debug: false }): UseDataReturn<T> {
  const [response, setResponse] = useState<UseDataResponse<T> | null>(null);
  const [status, setStatus] = useState<UseDataStatuses>('IDLE');
  const cancelRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (debug === true) console.log('Fetch Response: ', response);
  }, [debug, response]);

  useEffect(() => {
    if (debug === true) console.log('Fetch Status: ', status);
  }, [debug, status]);

  const resp = useMemo(() => {
    return {
      ...(response ?? defaultResponse),
      status,
    };
  }, [response, status]);

  const requestor: UseDataRequestor = useCallback(async (fn: UseDataExecuteFn) => {
    async function go() {
      if (cancelRef.current != null) {
        cancelRef.current.abort('Canceled');
      }
      cancelRef.current = new AbortController();

      setStatus('FETCHING');
      const res = await fn(cancelRef.current);
      const data = (await res.json()) as T;
      setResponse({
        raw: res,
        data,
        status: 'RESPONDING',
      });
      setStatus('IDLE');
    }
    await go();
  }, []);

  return [resp, requestor] as UseDataReturn<T>;
}
