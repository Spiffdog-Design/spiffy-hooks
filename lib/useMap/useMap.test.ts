import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useMap } from './useMap';

describe('useMap()', () => {
  it('should be ok when initiated with a map', () => {
    const initialMap = new Map([[1, 'test data']]);
    const { result } = renderHook(() => useMap(initialMap));

    expect(result.current[0].get(1)).toBe('test data');
  });

  it('should be ok when initiated with an array', () => {
    const { result } = renderHook(() => useMap([[1, 'test data']]));

    expect(result.current[0].get(1)).toBe('test data');
  });

  it('should be ok when initiated with nothing', () => {
    const { result } = renderHook(() => useMap());

    expect(result.current[0].size).toBe(0);
  });

  it('should add new value', () => {
    const { result } = renderHook(() => useMap<number, string>());
    const [, actions] = result.current;

    expect(result.current[0].get(1)).toBeUndefined();

    act(() => {
      actions.set(1, 'added');
    });

    expect(result.current[0].get(1)).toBe('added');
  });

  it('should update existing value', () => {
    const initialMap = new Map([[1, 'initial']]);
    const { result } = renderHook(() => useMap(initialMap));
    const [, actions] = result.current;

    act(() => {
      actions.set(1, 'edited');
    });

    expect(result.current[0].get(1)).toBe('edited');
  });

  it('should setAll replaces all existing values', () => {
    const initialMap = new Map([
      [1, 'initial'],
      [2, 'example'],
    ]);
    const { result } = renderHook(() => useMap(initialMap));
    const [, actions] = result.current;

    expect(result.current[0].get(1)).toBe('initial');
    expect(result.current[0].get(2)).toBe('example');
    expect(result.current[0].size).toBe(2);

    act(() => {
      actions.setAll([[1, 'edited']]);
    });

    expect(result.current[0].get(1)).toBe('edited');
    expect(result.current[0].size).toBe(1);
  });

  it('should remove existing value', () => {
    const initialMap = new Map([[1, 'initial']]);
    const { result } = renderHook(() => useMap(initialMap));
    const [, actions] = result.current;

    act(() => {
      actions.remove(1);
    });

    expect(result.current[0].get(1)).toBeUndefined();
  });

  it('should reset the map state', () => {
    const initialMap = new Map([[1, 'initial']]);
    const { result } = renderHook(() => useMap(initialMap));
    const [, actions] = result.current;

    act(() => {
      actions.clear();
    });

    expect(result.current[0].get(1)).toBeUndefined();
    expect(result.current[0].size).toBe(0);
  });

  it('should change value reference equality after change', () => {
    const initialMap = new Map<number, number>();
    const { result } = renderHook(() => useMap(initialMap));
    const [originalMapRef, actions] = result.current;

    act(() => {
      actions.set(1, 1);
    });

    expect(originalMapRef).not.toStrictEqual(result.current[0]);
    expect(originalMapRef.get(1)).toBeUndefined();
    expect(result.current[0].get(1)).toBe(1);
  });
  it('should keep actions reference equality after value change', () => {
    const initialMap = new Map<number, number>();
    const { result } = renderHook(() => useMap(initialMap));
    const [, originalActionsRef] = result.current;

    expect(result.current[1]).toStrictEqual(originalActionsRef);

    act(() => {
      originalActionsRef.set(1, 1);
    });

    expect(originalActionsRef).toStrictEqual(result.current[1]);
  });
});
