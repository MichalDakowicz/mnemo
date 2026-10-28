import { useEffect, useRef } from 'react';

/** Calls `onNear` whenever the returned sentinel scrolls within 600px of the viewport (infinite loading). */
export function useNearEnd(onNear: () => void, enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const latest = useRef(onNear);
  useEffect(() => {
    latest.current = onNear;
  });
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver((entries) => entries[0]?.isIntersecting && latest.current(), { rootMargin: '600px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);
  return ref;
}
