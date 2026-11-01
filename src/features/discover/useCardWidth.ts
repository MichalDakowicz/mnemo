import { useEffect, useState } from 'react';

/** Card width: a little narrower on small screens. */
export function useCardWidth() {
  const [w, setW] = useState(() => (window.innerWidth <= 820 ? 148 : 188));
  useEffect(() => {
    const onResize = () => setW(window.innerWidth <= 820 ? 148 : 188);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return w;
}
