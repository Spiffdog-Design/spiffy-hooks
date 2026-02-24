import * as matchers from '@testing-library/jest-dom/matchers';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';
declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // biome-ignore lint/suspicious/noExplicitAny: Assertion default type for matcher extension
  interface Assertion<T = any> extends TestingLibraryMatchers<T, void> {}
}
expect.extend(matchers);
