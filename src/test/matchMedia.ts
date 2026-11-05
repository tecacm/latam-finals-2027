/** Installs a window.matchMedia stub (jsdom has none). Returns a restore function. */
export function mockMatchMedia(matches: (query: string) => boolean): () => void {
  const stub = (query: string): MediaQueryList => ({
    matches: matches(query),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
  Object.defineProperty(window, 'matchMedia', { configurable: true, writable: true, value: stub });
  return () => {
    delete (window as { matchMedia?: unknown }).matchMedia;
  };
}
