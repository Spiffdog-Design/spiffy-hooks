import { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

/**
 * @description A custom hook to get and set URL parameters with React Router.
 * @param {String} param The URL parameter to get or set.
 * @param {string | number | null} defaultValue The default value to set if the URL parameter is not found.
 * @returns {Array} An array containing the URL parameter value and a setter function.
 */
export const useUrlParamReactRouter = (
  param: string,
  defaultValue: string | number | null = null,
) => {
  const history = useHistory();
  const { search, pathname } = useLocation();
  const url = new URLSearchParams(search);

  const paramVal = url.get(param);
  const [value, setValue] = useState<string>(
    paramVal !== null ? paramVal : String(defaultValue),
  );

  function setter(val: string | ((value: string) => string)) {
    if (typeof val === 'function') {
      val = val(value);
    }

    url.set(param, val);
    history.replace({ pathname, search: url.toString() });
    setValue(val);
  }

  return [value, setter];
};
