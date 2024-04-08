import { RefObject, useEffect } from 'react';

/**
 * @description A custom hook to detect clicks outside a React component.
 * @param {RefObject<HTMLElement>} ref The reference to the component to detect clicks outside of.
 * @param {function} fn The function to call when a click is detected outside the component.
 * @returns {Array} An array containing the URL parameter value and the detected click event handler function.
 */
export const useOutsideClick = (
  ref: RefObject<HTMLElement>,
  fn: () => void,
) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        event.target instanceof Element &&
        ref.current &&
        !ref.current.contains(event.target)
      ) {
        if (fn != null) fn();
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, fn]);
};
