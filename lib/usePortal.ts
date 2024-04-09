import type { ReactPortal, ReactNode } from 'react';

import { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

/**
 * @description A custom hook that allows you to use a React portal.
 * @returns {Function} A function that will allow you to use the portal.
 */
export const usePortal = (el: Element) => {
  // Creates only one instance of div.
  const wrapper = useMemo(() => {
    return el != null ? el : document.createElement('div');
  }, [el]);

  useEffect(() => {
    // Adds div tag to body.
    document.body.appendChild(wrapper);

    return () => {
      // After unmounting the component - removes the div created earlier.
      document.body.removeChild(wrapper);
    };
  }, [wrapper]);

  return (children: ReactNode): ReactPortal | null => {
    return createPortal(children, wrapper);
  };
};
