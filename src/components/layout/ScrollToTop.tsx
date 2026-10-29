import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

import { scrollRoot, scrollToTop } from '@/lib/scrollRoot';

const positions = new Map<string, number>();

/**
 * A new page opens at its top. The scroller keeps its position across route changes, so a
 * title opened from far down a list used to open scrolled. Going back (POP) gets the old
 * position handed back.
 */
export function ScrollToTop() {
  const { pathname, key } = useLocation();
  const type = useNavigationType();
  useLayoutEffect(() => {
    if (type === 'POP') scrollRoot()?.scrollTo({ top: positions.get(key) ?? 0, behavior: 'instant' });
    else scrollToTop();
    return () => {
      positions.set(key, scrollRoot()?.scrollTop ?? 0);
    };
  }, [pathname, key, type]);
  return null;
}
