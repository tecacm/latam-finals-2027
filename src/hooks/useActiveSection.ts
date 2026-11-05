import { useEffect, useState } from 'react';
import { HEADER_HEIGHT } from '../theme/layout';

const THRESHOLDS = Array.from({ length: 11 }, (_, i) => i / 10);

/**
 * Scroll spy: returns the id of the section with the most visible height
 * below the sticky header. Any array of ids works; the effect re-subscribes only when the joined ids change.
 */
export function useActiveSection(ids: readonly string[]): string | undefined {
  const key = ids.join('|');
  const [active, setActive] = useState<string | undefined>(ids[0]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const list = key.split('|');
    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRect.height : 0);
        }
        let best: string | undefined;
        let bestHeight = 0;
        for (const id of list) {
          const height = visible.get(id) ?? 0;
          if (height > bestHeight) {
            best = id;
            bestHeight = height;
          }
        }
        if (best !== undefined) setActive(best);
      },
      { rootMargin: `-${HEADER_HEIGHT}px 0px 0px 0px`, threshold: THRESHOLDS },
    );

    for (const id of list) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [key]);

  return active;
}
