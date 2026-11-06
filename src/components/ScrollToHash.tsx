import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

function hashToId(hash: string): string {
  const raw = hash.slice(1);
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function focusWithoutScrolling(element: HTMLElement) {
  if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '-1');
  element.focus({ preventScroll: true });
}

/**
 * After each navigation: scroll the `#hash` target into view, or jump to the
 * top when the page changed without a hash (router-aware take on HackMTY's
 * ScrollToElement). Focus follows the scroll because router links cancel the
 * native anchor behavior. Renders nothing.
 */
export default function ScrollToHash() {
  const { pathname, hash, key } = useLocation();
  const reducedMotion = usePrefersReducedMotion();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (hash) {
      const id = hashToId(hash);
      // Defer one tick so the destination page has rendered and laid out.
      const timer = setTimeout(() => {
        const target = document.getElementById(id);
        if (target && typeof target.scrollIntoView === 'function') {
          target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
        }
        if (target) focusWithoutScrolling(target);
      }, 0);
      return () => clearTimeout(timer);
    }

    // POP (initial load, back/forward) keeps the browser's scroll restoration.
    if (navigationType !== 'POP') {
      // Instant: the global smooth scroll-behavior would glide from the old page's position.
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      const main = document.getElementById('main');
      if (main) focusWithoutScrolling(main);
    }
  }, [pathname, hash, key, navigationType, reducedMotion]);

  return null;
}
