import { useCallback, useState } from 'react';

type MapOrEntries<K, V> = Map<K, V> | [K, V][];
type UseMapActions<K, V> = {
  /** Clear the map to an empty state. */
  clear: Map<K, V>['clear'];
  /** Remove a key-value pair from the map. */
  remove: (key: K) => void;
  /** Set a key-value pair in the map. */
  set: (key: K, value: V) => void;
  /** Set all key-value pairs in the map. */
  setAll: (entries: MapOrEntries<K, V>) => void;
};
type UseMapReturn<K, V> = [Omit<Map<K, V>, 'set' | 'clear' | 'delete'>, UseMapActions<K, V>];

/**
 * Custom hook that manages a key-value [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) state with setter actions.
 * @template K - The type of keys in the map.
 * @template V - The type of values in the map.
 * @param {MapOrEntries<K, V>} [initialState] - The initial state of the map as a Map or an array of key-value pairs (optional).
 * @returns {UseMapReturn<K, V>} A tuple containing the map state and actions to interact with the map.
 * @public
 * @example
 * ```tsx
 * const [map, actions] = useMap();
 * // Access the `map` state and use `actions` to set, remove, or reset entries.
 * ```
 */
export function useMap<K, V>(initialState: MapOrEntries<K, V> = new Map()): UseMapReturn<K, V> {
  const [map, setMap] = useState(new Map(initialState));

  const actions: UseMapActions<K, V> = {
    clear: useCallback(() => {
      setMap(() => new Map());
    }, []),

    remove: useCallback((key) => {
      setMap((prev) => {
        const copy = new Map(prev);
        copy.delete(key);
        return copy;
      });
    }, []),

    set: useCallback((key, value) => {
      setMap((prev) => {
        const copy = new Map(prev);
        copy.set(key, value);
        return copy;
      });
    }, []),

    setAll: useCallback((entries) => {
      setMap(() => new Map(entries));
    }, []),
  };

  return [map, actions];
}
