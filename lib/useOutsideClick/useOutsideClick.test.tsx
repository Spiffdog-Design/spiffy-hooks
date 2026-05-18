import { fireEvent, render, screen } from '@testing-library/react';
import type { RefObject } from 'react';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useOutsideClick } from './useOutsideClick';

function TestComponent({
  onOutsideClick,
  doc = document,
}: {
  onOutsideClick: () => void;
  doc?: Document;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, onOutsideClick, doc);
  return (
    <div>
      <div ref={ref} data-testid="inside">
        Inside
      </div>
      <div data-testid="outside">Outside</div>
    </div>
  );
}

describe('useOutsideClick', () => {
  it('calls callback when click is outside the ref element', () => {
    const onOutsideClick = vi.fn();
    render(<TestComponent onOutsideClick={onOutsideClick} />);

    fireEvent.click(screen.getByTestId('outside'));

    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('does not call callback when click is inside the ref element', () => {
    const onOutsideClick = vi.fn();
    render(<TestComponent onOutsideClick={onOutsideClick} />);

    fireEvent.click(screen.getByTestId('inside'));

    expect(onOutsideClick).not.toHaveBeenCalled();
  });

  it('calls callback when clicking on document body (outside)', () => {
    const onOutsideClick = vi.fn();
    render(<TestComponent onOutsideClick={onOutsideClick} />);

    fireEvent.click(document.body);

    expect(onOutsideClick).toHaveBeenCalled();
  });

  it('does not call callback when ref.current is null', () => {
    const onOutsideClick = vi.fn();
    const ref: RefObject<HTMLDivElement> = { current: null };

    function Runner() {
      useOutsideClick(ref, onOutsideClick);
      return null;
    }
    render(<Runner />);

    fireEvent.click(document.body);

    expect(onOutsideClick).not.toHaveBeenCalled();
  });

  it('cleans up event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const { unmount } = render(<TestComponent onOutsideClick={() => {}} />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
});
