import { useEffect, useRef, useState } from 'react';

/**
 * Flips to 'true' (once) when the element scrolls into view.
 * Reduced-motion users are handled in styles/motion.css, which keeps content visible.
 */
export default function useInView(threshold = 0.18) {
  const ref = useRef(null);
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -6% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView ? 'true' : undefined];
}
