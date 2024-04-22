import { act, fireEvent, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useOutsideClick } from './useOutsideClick';

describe('useOnClickOutside(', () => {
  it('should call the handler when a clicking outside the element (single ref)', () => {
    const containerRef = { current: document.createElement('div') };
    const handler = vi.fn();

    renderHook(() => {
      useOutsideClick(containerRef, handler, document);
    });

    expect(handler).toHaveBeenCalledTimes(0);

    // Simulate click outside the container
    act(() => {
      fireEvent.click(document);
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should NOT call the handler when a clicking inside the element', () => {
    const containerRef = { current: document.createElement('div') };
    const handler = vi.fn();

    renderHook(() => {
      useOutsideClick(containerRef, handler);
    });

    // Simulate click inside the container
    act(() => {
      fireEvent.click(containerRef.current);
    });

    expect(handler).toHaveBeenCalledTimes(0);
  });
});
