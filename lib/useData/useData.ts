import { useCallback, useMemo, useRef, useState } from 'react';
import { useDebug } from '../useDebug/useDebug';

export type Statuses = 'IDLE' | 'FETCHING' | 'RESPONDING' | 'ERROR' | 'SUCCESS';

interface DataResponse<T> {
  raw: never | null;
  data: T | null;
  status: Statuses;
  success: boolean;
}

const defaultResponse: DataResponse<null> = { raw: null, data: null, status: 'IDLE', success: false };

const validateStatus = (status: number) => status < 500; // Only throw errors for server exceptions.

interface UseDataOptions<T> {
  initialValue?: T;
  debug?: boolean;
}

/**
 * @description A custom hook to fetch data from an API.
 * @param {UseDataOptions<T>} options Options settings for the hook.
 * @returns {[DataResponse<T>, (fn: (params: { signal: AbortSignal, validateStatus: (status: number) => boolean }) => Promise<any>) => Promise<void>]} An object or array of type T.
 */
export function useData<T>(
  options?: UseDataOptions<T>,
): [
  DataResponse<T>,
  (
    fn: (params: { signal: AbortSignal; validateStatus: (status: number) => boolean }) => Promise<Response>,
  ) => Promise<void>,
] {
  const { initialValue = null, debug = false } = options ?? {};

  const cancelRef = useRef<AbortController | null>(null);
  const [response, setResponse] = useState<DataResponse<T>>({
    ...defaultResponse,
    data: initialValue,
  });

  const resp = useMemo(() => {
    return response ?? defaultResponse;
  }, [response]);

  const requestor = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (fn: (params: { signal: AbortSignal; validateStatus: (status: number) => boolean }) => Promise<any>) => {
      if (cancelRef.current != null) {
        cancelRef.current.abort('Canceled');
      }
      cancelRef.current = new AbortController();

      setResponse((resp) => ({ ...resp, status: 'FETCHING' }));
      try {
        const res = await fn({ signal: cancelRef.current.signal, validateStatus });
        const data = res?.json != null ? await res.json() : res?.data;
        setResponse({
          raw: res,
          data,
          status: 'SUCCESS',
          success: true,
        });
      } catch (err) {
        console.log('ERROR', err);
        setResponse((resp) => ({ ...resp, status: 'ERROR', success: false }));
      }
    },
    [],
  );

  useDebug(response, 'Fetch Response: ', { enabled: debug });

  return [resp, requestor];
}
