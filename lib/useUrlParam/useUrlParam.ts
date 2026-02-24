import { useState } from 'react';

/**
 * @description A custom hook to get and set URL parameters in Vanilla Javascript.
 * @param {String} param The URL parameter to get or set.
 * @param {string | number | null} defaultValue The default value to set if the URL parameter is not found.
 * @returns {Array} An array containing the URL parameter value and a setter function.
 */
export const useUrlParam = (param: string, defaultValue: string | number | null = null) => {
  const { search, pathname } = window.location;
  const url = new URLSearchParams(search);

  const paramVal = url.get(param);
  const [value, setValue] = useState<string>(paramVal !== null ? paramVal : String(defaultValue));

  function setter(val: string | ((value: string) => string)) {
    const next = typeof val === 'function' ? val(value) : val;
    setValue(next);

    if (url.has(param)) {
      url.set(param, next);
    } else {
      url.append(param, next);
    }

    window.history.replaceState(Object.fromEntries(url), pathname);
  }

  return [value, setter];
};
