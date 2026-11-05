import { vi } from 'vitest';

type ObserverRecord = { callback: IntersectionObserverCallback; elements: Set<Element> };

/**
 * Replaces IntersectionObserver with a controllable fake.
 * Call vi.unstubAllGlobals() in afterEach to remove it.
 */
export function installIntersectionObserverMock() {
  const records: ObserverRecord[] = [];

  class MockIntersectionObserver {
    readonly root = null;
    readonly rootMargin = '0px';
    readonly thresholds: number[] = [0];
    private readonly record: ObserverRecord;

    constructor(callback: IntersectionObserverCallback) {
      this.record = { callback, elements: new Set() };
      records.push(this.record);
    }
    observe(element: Element) {
      this.record.elements.add(element);
    }
    unobserve(element: Element) {
      this.record.elements.delete(element);
    }
    disconnect() {
      this.record.elements.clear();
    }
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

  return {
    /** Reports the visible height (px) of observed elements, keyed by element id. */
    setVisibleHeights(heights: Record<string, number>) {
      for (const record of records) {
        const entries = [...record.elements]
          .filter((element) => element.id in heights)
          .map((element) => {
            const height = heights[element.id];
            return {
              target: element,
              isIntersecting: height > 0,
              intersectionRatio: height > 0 ? 1 : 0,
              intersectionRect: { height } as DOMRectReadOnly,
              boundingClientRect: {} as DOMRectReadOnly,
              rootBounds: null,
              time: 0,
            } as IntersectionObserverEntry;
          });
        if (entries.length > 0) record.callback(entries, {} as IntersectionObserver);
      }
    },
  };
}
