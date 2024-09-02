import { useEffect } from 'react';

/**
 * @description A custom hook to fetch data from an API.
 * @param {boolean} options Options settings for the hook.
 * @returns {T} An object or array of type T.
 */
export type DebugOptions = {
  basic: boolean;
  collapsed: boolean;
  enabled: boolean;
  label: string;
  trace: boolean;
  value: unknown;
};
export function useDebug({
  basic = true,
  collapsed = true,
  enabled = true,
  label = 'DEBUG: ',
  trace = false,
  value = null,
}: DebugOptions) {
  useEffect(() => {
    if (enabled) {
      if (basic) {
        console.log(label, value);
      } else {
        if (collapsed) {
          console.groupCollapsed(label);
        } else {
          console.group(label);
        }
        console.log(value);
        if (trace) console.trace();
        console.groupEnd();
      }
    }
  }, [basic, collapsed, enabled, label, trace, value]);
}
