import { RefObject, useEffect } from 'react';

/**
 * @description A custom hook to detect clicks outside a React component.
 * @param {RefObject<HTMLElement>} ref The reference to the component to detect clicks outside of.
 * @param {function} fn The function to call when a click is detected outside the component.
 * @param {object} doc The document object to use for event listeners.
 * @returns {Array} An array containing the URL parameter value and the detected click event handler function.
 */
export const useOutsideClick = (
  ref: RefObject<HTMLElement>,
  fn: () => void,
  doc: Document = document,
) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        ref.current != null &&
        !ref.current.contains(event.target as Element)
      ) {
        if (fn != null) fn();
      }
    }
    // Bind the event listener
    doc.addEventListener('click', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      doc.removeEventListener('click', handleClickOutside);
    };
  }, [ref, fn, doc]);
};
