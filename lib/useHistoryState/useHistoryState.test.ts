import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useHistoryState } from './useHistoryState';

describe('useHistoryState', () => {
  it('returns initial value and actions', () => {
    const { result } = renderHook(() => useHistoryState(0));
    expect(result.current.data).toBe(0);
    expect(result.current.history).toEqual({ past: [], future: [], length: 1 });
    expect(typeof result.current.actions.set).toBe('function');
    expect(typeof result.current.actions.undo).toBe('function');
    expect(typeof result.current.actions.redo).toBe('function');
  });

  it('updates value via set and supports undo/redo', () => {
    const { result } = renderHook(() => useHistoryState(0));

    act(() => result.current.actions.set(1));
    expect(result.current.data).toBe(1);

    act(() => result.current.actions.set(2));
    expect(result.current.data).toBe(2);

    act(() => result.current.actions.undo());
    expect(result.current.data).toBe(1);

    act(() => result.current.actions.undo());
    expect(result.current.data).toBe(0);

    act(() => result.current.actions.redo());
    expect(result.current.data).toBe(1);
  });

  it('undo when past is empty is a no-op', () => {
    const { result } = renderHook(() => useHistoryState(10));

    act(() => result.current.actions.undo());
    expect(result.current.data).toBe(10);
    expect(result.current.history).toEqual({ past: [], future: [], length: 1 });
  });

  it('redo when future is empty is a no-op', () => {
    const { result } = renderHook(() => useHistoryState(10));

    act(() => result.current.actions.redo());
    expect(result.current.data).toBe(10);
    expect(result.current.history).toEqual({ past: [], future: [], length: 1 });
  });

  it('exposes past and future correctly after set and undo', () => {
    const { result } = renderHook(() => useHistoryState(0));

    act(() => result.current.actions.set(1));
    act(() => result.current.actions.set(2));
    expect(result.current.data).toBe(2);
    expect(result.current.history.past).toEqual([0, 1]);
    expect(result.current.history.future).toEqual([]);
    expect(result.current.history.length).toBe(3);

    act(() => result.current.actions.undo());
    expect(result.current.data).toBe(1);
    expect(result.current.history.past).toEqual([0]);
    expect(result.current.history.future).toEqual([2]);
    expect(result.current.history.length).toBe(3);

    act(() => result.current.actions.undo());
    expect(result.current.data).toBe(0);
    expect(result.current.history.past).toEqual([]);
    expect(result.current.history.future).toEqual([1, 2]);
    expect(result.current.history.length).toBe(3);
  });

  it('supports multiple redos after multiple undos', () => {
    const { result } = renderHook(() => useHistoryState('a'));

    act(() => result.current.actions.set('b'));
    act(() => result.current.actions.set('c'));
    act(() => result.current.actions.undo());
    act(() => result.current.actions.undo());
    expect(result.current.data).toBe('a');

    act(() => result.current.actions.redo());
    expect(result.current.data).toBe('b');
    act(() => result.current.actions.redo());
    expect(result.current.data).toBe('c');
  });

  it('set after undo clears future and branches history', () => {
    const { result } = renderHook(() => useHistoryState(0));

    act(() => result.current.actions.set(1));
    act(() => result.current.actions.set(2));
    act(() => result.current.actions.undo());
    expect(result.current.data).toBe(1);
    expect(result.current.history.future).toEqual([2]);

    act(() => result.current.actions.set(99));
    expect(result.current.data).toBe(99);
    expect(result.current.history.past).toEqual([0, 1]);
    expect(result.current.history.future).toEqual([]);

    act(() => result.current.actions.undo());
    expect(result.current.data).toBe(1);
    act(() => result.current.actions.undo());
    expect(result.current.data).toBe(0);
    act(() => result.current.actions.redo());
    expect(result.current.data).toBe(1);
    act(() => result.current.actions.redo());
    expect(result.current.data).toBe(99);
  });

  it('works with object values', () => {
    const initial = { count: 0 };
    const { result } = renderHook(() => useHistoryState(initial));

    expect(result.current.data).toEqual({ count: 0 });

    act(() => result.current.actions.set({ count: 1 }));
    expect(result.current.data).toEqual({ count: 1 });

    act(() => result.current.actions.undo());
    expect(result.current.data).toEqual({ count: 0 });
  });

  it('history.length is 1 when initial and increases with each set', () => {
    const { result } = renderHook(() => useHistoryState(0));

    expect(result.current.history.length).toBe(1);

    act(() => result.current.actions.set(1));
    expect(result.current.history.length).toBe(2);

    act(() => result.current.actions.set(2));
    act(() => result.current.actions.set(3));
    expect(result.current.history.length).toBe(4);
  });

  it('history.length stays constant during undo and redo', () => {
    const { result } = renderHook(() => useHistoryState(0));

    act(() => result.current.actions.set(1));
    act(() => result.current.actions.set(2));
    const expectedLength = 3;

    act(() => result.current.actions.undo());
    expect(result.current.history.length).toBe(expectedLength);
    act(() => result.current.actions.undo());
    expect(result.current.history.length).toBe(expectedLength);
    act(() => result.current.actions.redo());
    expect(result.current.history.length).toBe(expectedLength);
    act(() => result.current.actions.redo());
    expect(result.current.history.length).toBe(expectedLength);
  });

  it('history.length decreases when set after undo (future is discarded)', () => {
    const { result } = renderHook(() => useHistoryState(0));

    act(() => result.current.actions.set(1));
    act(() => result.current.actions.set(2));
    act(() => result.current.actions.undo());
    expect(result.current.history.length).toBe(3);

    act(() => result.current.actions.set(99));
    expect(result.current.history.length).toBe(3);
    expect(result.current.history.past).toHaveLength(2);
    expect(result.current.history.future).toHaveLength(0);
  });

  it('works with array values', () => {
    const { result } = renderHook(() => useHistoryState<number[]>([]));

    act(() => result.current.actions.set([1]));
    act(() => result.current.actions.set([1, 2]));
    expect(result.current.data).toEqual([1, 2]);

    act(() => result.current.actions.undo());
    expect(result.current.data).toEqual([1]);
    act(() => result.current.actions.undo());
    expect(result.current.data).toEqual([]);
  });
});
