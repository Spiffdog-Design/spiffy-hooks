import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

declare module 'vitest' {
  // biome-ignore lint/suspicious/noExplicitAny: Assertion default type for matcher extension
  interface Assertion<T = any> extends TestingLibraryMatchers<T, void> {}
}
expect.extend(matchers);
