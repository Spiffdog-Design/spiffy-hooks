import { useEffect } from 'react';

interface DebugConfig {
  basic?: boolean;
  collapsed?: boolean;
  enabled?: boolean;
  trace?: boolean;
}

/**
 * @description A custom hook to fetch data from an API.
 * @param {any} value value to show.
 * @param {string} label Log label. Defaults to 'DEBUG:'.
 * @param {DebugConfig} config Options settings for the hook. Optional.
 */
export function useDebug(value: unknown = null, label: string = 'DEBUG:', config?: DebugConfig): void {
  const { basic = true, collapsed = true, enabled = true, trace = false } = config ?? {};

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
