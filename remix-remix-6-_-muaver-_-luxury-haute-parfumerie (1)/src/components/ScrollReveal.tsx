import React, { useEffect, useRef, ReactNode, ElementType } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delayIndex?: number;
  as?: ElementType;
}

/**
 * Lightweight, high-performance scroll reveal container.
 * - Subtle 450ms fade-up (16px translateY, no layout shift)
 * - Above-the-fold content is revealed immediately with 0 animation
 * - Disconnects observer once revealed (runs once, zero CPU/memory overhead)
 * - Strictly respects prefers-reduced-motion
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delayIndex = 0,
  as: Component = 'div',
}) => {
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // 1. Respect prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-revealed');
      return;
    }

    // 2. Do not animate anything above the fold on initial load
    const rect = el.getBoundingClientRect();
    if (rect.top <= window.innerHeight) {
      el.classList.add('is-revealed');
      return;
    }

    // 3. Fallback for environments without IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-revealed');
      return;
    }

    // 4. Subtle, efficient IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.05,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  const delayClass = delayIndex > 0 ? `scroll-reveal-delay-${Math.min(delayIndex, 4)}` : '';

  return (
    <Component
      ref={elementRef}
      className={`scroll-reveal ${delayClass} ${className}`.trim()}
    >
      {children}
    </Component>
  );
};
