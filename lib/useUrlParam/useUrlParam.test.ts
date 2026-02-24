import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useUrlParam } from './useUrlParam';

describe('useUrlParam', () => {
  const replaceStateSpy = vi.fn();

  beforeEach(() => {
    replaceStateSpy.mockClear();
    Object.defineProperty(window, 'history', {
      value: { replaceState: replaceStateSpy },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns default value when param is not in URL', () => {
    Object.defineProperty(window, 'location', {
      value: { search: '', pathname: '/page' },
      writable: true,
    });

    const { result } = renderHook(() => useUrlParam('q', 'default'));

    expect(result.current[0]).toBe('default');
  });

  it('returns URL param value when present', () => {
    Object.defineProperty(window, 'location', {
      value: { search: '?q=hello', pathname: '/search' },
      writable: true,
    });

    const { result } = renderHook(() => useUrlParam('q'));

    expect(result.current[0]).toBe('hello');
  });

  it('returns first value when param appears multiple times', () => {
    Object.defineProperty(window, 'location', {
      value: { search: '?q=first&q=second', pathname: '/' },
      writable: true,
    });

    const { result } = renderHook(() => useUrlParam('q'));

    expect(result.current[0]).toBe('first');
  });

  it('setter updates value and calls replaceState', () => {
    Object.defineProperty(window, 'location', {
      value: { search: '?q=old', pathname: '/p' },
      writable: true,
    });

    const { result } = renderHook(() => useUrlParam('q', 'default'));

    act(() => result.current[1]('new'));

    expect(result.current[0]).toBe('new');
    expect(replaceStateSpy).toHaveBeenCalledTimes(1);
    expect(replaceStateSpy).toHaveBeenCalledWith({ q: 'new' }, '/p');
  });

  it('setter with function updater receives current value and updates', () => {
    Object.defineProperty(window, 'location', {
      value: { search: '?count=5', pathname: '/app' },
      writable: true,
    });

    const { result } = renderHook(() => useUrlParam('count', '0'));

    act(() => result.current[1]((prev) => String(Number(prev) + 1)));

    expect(result.current[0]).toBe('6');
  });

  it('setter appends param when not in URL and calls replaceState', () => {
    Object.defineProperty(window, 'location', {
      value: { search: '', pathname: '/page' },
      writable: true,
    });

    const { result } = renderHook(() => useUrlParam('newParam', null));

    act(() => result.current[1]('added'));

    expect(result.current[0]).toBe('added');
    expect(replaceStateSpy).toHaveBeenCalledWith({ newParam: 'added' }, '/page');
  });

  it('default value of null yields string "null" when param missing', () => {
    Object.defineProperty(window, 'location', {
      value: { search: '', pathname: '/' },
      writable: true,
    });

    const { result } = renderHook(() => useUrlParam('x', null));

    expect(result.current[0]).toBe('null');
  });

  it('default value number is stringified', () => {
    Object.defineProperty(window, 'location', {
      value: { search: '', pathname: '/' },
      writable: true,
    });

    const { result } = renderHook(() => useUrlParam('n', 42));

    expect(result.current[0]).toBe('42');
  });
});
