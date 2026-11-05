import type { CSSProperties, ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export type AnimateVariant = 'fade' | 'rise' | 'slide-from-left' | 'slide-from-right';

const HIDDEN_TRANSFORM: Record<AnimateVariant, string> = {
  fade: 'none',
  rise: 'translateY(32px)',
  'slide-from-left': 'translateX(-56px)',
  'slide-from-right': 'translateX(56px)',
};

type AnimateOnViewProps = {
  children: ReactNode;
  variant?: AnimateVariant;
  timeout?: number;
  threshold?: number;
};

/**
 * Reveals children the first time they scroll into view (HackMTY pattern).
 * Uses a short CSS translate instead of MUI Slide, which moves content by the
 * full window width and causes horizontal overflow.
 */
export default function AnimateOnView({ children, variant = 'fade', timeout = 700, threshold = 0.15 }: AnimateOnViewProps) {
  const reducedMotion = usePrefersReducedMotion();
  const { ref, inView } = useInView({ triggerOnce: true, threshold, fallbackInView: true });

  if (reducedMotion) {
    return <div data-testid="animate-on-view">{children}</div>;
  }

  const style: CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? 'none' : HIDDEN_TRANSFORM[variant],
    transition: `opacity ${timeout}ms ease-out, transform ${timeout}ms ease-out`,
  };
  return (
    <div ref={ref} data-testid="animate-on-view" style={style}>
      {children}
    </div>
  );
}
