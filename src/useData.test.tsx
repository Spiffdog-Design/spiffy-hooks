import { describe, expect, it } from 'vitest';
import { useData } from './useData';
import { renderHook, waitFor } from '@testing-library/react';

describe('useData', () => {
  it('useData should fetch and set statuses', async () => {
    const { result } = renderHook(() => useData(null));
    const [response, requestor] = result.current;

    const load = () => {
      requestor(async (_) => {
        return Promise.resolve({ test: 'test' });
      });
    };

    await waitFor(async () => {
      expect(response.status).toBe('IDLE');
    });

    await waitFor(async () => {
      load();
    });

    await waitFor(async () => {
      const data = result.current[0];
      expect(data.status).toBe('IDLE');
      expect(data.test).toBe('test');
    });
  });
});
