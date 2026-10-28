import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * A new page opens at its top. The window keeps its scroll position across route changes, so a
 * title opened from far down a list used to open scrolled. Going back (POP) is left alone, so the
 * browser can hand the old position back.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();
  const type = useNavigationType();
  useLayoutEffect(() => {
    if (type !== 'POP') window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, type]);
  return null;
}
