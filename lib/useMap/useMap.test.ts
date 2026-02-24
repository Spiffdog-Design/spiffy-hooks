import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useMap } from './useMap';

describe('useMap', () => {
  it('returns empty map and actions when no initial state', () => {
    const { result } = renderHook(() => useMap());

    const [map, actions] = result.current;
    expect(map.size).toBe(0);
    expect(map.get('a')).toBeUndefined();
    expect(map.has('a')).toBe(false);
    expect(typeof actions.set).toBe('function');
    expect(typeof actions.remove).toBe('function');
    expect(typeof actions.clear).toBe('function');
    expect(typeof actions.setAll).toBe('function');
  });

  it('accepts initial state as Map', () => {
    const initial = new Map([
      ['x', 1],
      ['y', 2],
    ]);
    const { result } = renderHook(() => useMap(initial));

    const [map] = result.current;
    expect(map.size).toBe(2);
    expect(map.get('x')).toBe(1);
    expect(map.get('y')).toBe(2);
    expect(map.has('x')).toBe(true);
  });

  it('accepts initial state as array of entries', () => {
    const initial: [string, number][] = [
      ['a', 10],
      ['b', 20],
    ];
    const { result } = renderHook(() => useMap(initial));

    const [map] = result.current;
    expect(map.size).toBe(2);
    expect(map.get('a')).toBe(10);
    expect(map.get('b')).toBe(20);
  });

  it('set adds and updates entries', () => {
    const { result } = renderHook(() => useMap<string, number>());

    act(() => result.current[1].set('foo', 1));
    expect(result.current[0].get('foo')).toBe(1);
    expect(result.current[0].size).toBe(1);

    act(() => result.current[1].set('bar', 2));
    expect(result.current[0].get('foo')).toBe(1);
    expect(result.current[0].get('bar')).toBe(2);
    expect(result.current[0].size).toBe(2);

    act(() => result.current[1].set('foo', 99));
    expect(result.current[0].get('foo')).toBe(99);
    expect(result.current[0].size).toBe(2);
  });

  it('remove deletes a key', () => {
    const initial = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
    const { result } = renderHook(() => useMap(initial));

    act(() => result.current[1].remove('b'));
    expect(result.current[0].size).toBe(2);
    expect(result.current[0].has('b')).toBe(false);
    expect(result.current[0].get('a')).toBe(1);
    expect(result.current[0].get('c')).toBe(3);

    act(() => result.current[1].remove('a'));
    expect(result.current[0].size).toBe(1);
    expect(result.current[0].get('c')).toBe(3);
  });

  it('remove is a no-op when key does not exist', () => {
    const { result } = renderHook(() => useMap([['k', 1]]));

    act(() => result.current[1].remove('missing'));
    expect(result.current[0].size).toBe(1);
    expect(result.current[0].get('k')).toBe(1);
  });

  it('clear empties the map', () => {
    const initial = new Map([
      ['a', 1],
      ['b', 2],
    ]);
    const { result } = renderHook(() => useMap(initial));

    act(() => result.current[1].clear());
    expect(result.current[0].size).toBe(0);
    expect(result.current[0].get('a')).toBeUndefined();
    expect(result.current[0].get('b')).toBeUndefined();
  });

  it('setAll replaces the entire map with a Map', () => {
    const { result } = renderHook(() => useMap([['old', 1]]));

    const replacement = new Map([
      ['p', 10],
      ['q', 20],
    ]);
    act(() => result.current[1].setAll(replacement));

    expect(result.current[0].size).toBe(2);
    expect(result.current[0].get('old')).toBeUndefined();
    expect(result.current[0].get('p')).toBe(10);
    expect(result.current[0].get('q')).toBe(20);
  });

  it('setAll replaces the entire map with array of entries', () => {
    const { result } = renderHook(() => useMap([['x', 1]]));

    act(() =>
      result.current[1].setAll([
        ['m', 100],
        ['n', 200],
      ]),
    );

    expect(result.current[0].size).toBe(2);
    expect(result.current[0].get('x')).toBeUndefined();
    expect(result.current[0].get('m')).toBe(100);
    expect(result.current[0].get('n')).toBe(200);
  });

  it('map is iterable (entries, keys, values)', () => {
    const initial = new Map([
      ['a', 1],
      ['b', 2],
    ]);
    const { result } = renderHook(() => useMap(initial));

    const [map] = result.current;
    expect([...map.entries()]).toEqual([
      ['a', 1],
      ['b', 2],
    ]);
    expect([...map.keys()]).toEqual(['a', 'b']);
    expect([...map.values()]).toEqual([1, 2]);
  });

  it('does not mutate previous state (set creates new Map)', () => {
    const initial = new Map([['k', 1]]);
    const { result } = renderHook(() => useMap(initial));

    act(() => result.current[1].set('k', 2));
    expect(initial.get('k')).toBe(1);
    expect(result.current[0].get('k')).toBe(2);
  });
});
