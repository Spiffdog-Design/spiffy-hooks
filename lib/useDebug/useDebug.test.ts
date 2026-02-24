import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebug } from './useDebug';

describe('useDebug', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  let groupSpy: ReturnType<typeof vi.spyOn>;
  let groupCollapsedSpy: ReturnType<typeof vi.spyOn>;
  let groupEndSpy: ReturnType<typeof vi.spyOn>;
  let traceSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    groupSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
    groupCollapsedSpy = vi.spyOn(console, 'groupCollapsed').mockImplementation(() => {});
    groupEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
    traceSpy = vi.spyOn(console, 'trace').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs with default label and basic mode when no config is passed', () => {
    const value = { foo: 'bar' };
    renderHook(() => useDebug(value));

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith('DEBUG:', value);
    expect(groupSpy).not.toHaveBeenCalled();
    expect(groupCollapsedSpy).not.toHaveBeenCalled();
    expect(groupEndSpy).not.toHaveBeenCalled();
  });

  it('logs with custom label when provided', () => {
    renderHook(() => useDebug(42, 'Count:'));

    expect(logSpy).toHaveBeenCalledWith('Count:', 42);
  });

  it('does not log when enabled is false', () => {
    renderHook(() => useDebug('hidden', 'Label', { enabled: false }));

    expect(logSpy).not.toHaveBeenCalled();
    expect(groupSpy).not.toHaveBeenCalled();
    expect(groupCollapsedSpy).not.toHaveBeenCalled();
  });

  it('uses console.groupCollapsed when basic is false and collapsed is true', () => {
    const value = { a: 1 };
    renderHook(() => useDebug(value, 'Grouped', { basic: false, collapsed: true }));

    expect(logSpy).toHaveBeenCalledWith(value);
    expect(groupCollapsedSpy).toHaveBeenCalledWith('Grouped');
    expect(groupSpy).not.toHaveBeenCalled();
    expect(groupEndSpy).toHaveBeenCalledTimes(1);
  });

  it('uses console.group when basic is false and collapsed is false', () => {
    const value = [1, 2, 3];
    renderHook(() => useDebug(value, 'Expanded', { basic: false, collapsed: false }));

    expect(logSpy).toHaveBeenCalledWith(value);
    expect(groupSpy).toHaveBeenCalledWith('Expanded');
    expect(groupCollapsedSpy).not.toHaveBeenCalled();
    expect(groupEndSpy).toHaveBeenCalledTimes(1);
  });

  it('calls console.trace when trace is true and basic is false', () => {
    renderHook(() => useDebug('traced', 'Trace', { basic: false, collapsed: true, trace: true }));

    expect(traceSpy).toHaveBeenCalledTimes(1);
    expect(groupEndSpy).toHaveBeenCalledTimes(1);
  });

  it('does not call console.trace when trace is true but basic is true', () => {
    renderHook(() => useDebug('basic', 'Label', { basic: true, trace: true }));

    expect(logSpy).toHaveBeenCalledWith('Label', 'basic');
    expect(traceSpy).not.toHaveBeenCalled();
  });

  it('handles null value with default label', () => {
    renderHook(() => useDebug(null));

    expect(logSpy).toHaveBeenCalledWith('DEBUG:', null);
  });
});
