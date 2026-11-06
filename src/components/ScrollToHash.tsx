import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

function hashToId(hash: string): string {
  const raw = hash.slice(1);
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/**
 * After each navigation: scroll the `#hash` target into view, or jump to the
 * top when the page changed without a hash (router-aware take on HackMTY's
 * ScrollToElement). Renders nothing.
 */
export default function ScrollToHash() {
  const { pathname, hash, key } = useLocation();
  const reducedMotion = usePrefersReducedMotion();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    const pathnameChanged = previousPathname.current !== pathname;
    previousPathname.current = pathname;

    if (hash) {
      const id = hashToId(hash);
      // Defer one tick so the destination page has rendered and laid out.
      const timer = setTimeout(() => {
        const target = document.getElementById(id);
        if (target && typeof target.scrollIntoView === 'function') {
          target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
        }
      }, 0);
      return () => clearTimeout(timer);
    }

    if (pathnameChanged) window.scrollTo(0, 0);
  }, [pathname, hash, key, reducedMotion]);

  return null;
}
