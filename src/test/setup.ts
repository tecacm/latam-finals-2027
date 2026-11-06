import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest globals are off, so Testing Library cannot register cleanup itself.
afterEach(() => {
  cleanup();
});

// jsdom does not implement scrolling: scrollIntoView is missing and scrollTo
// logs "Not implemented". Install silent no-ops; tests spy on them as needed.
// Guarded because node-environment tests (e.g. content.test.ts) have no DOM.
if (typeof window !== 'undefined') {
  window.scrollTo = (() => {}) as typeof window.scrollTo;
  Element.prototype.scrollIntoView = function scrollIntoView() {};
}
