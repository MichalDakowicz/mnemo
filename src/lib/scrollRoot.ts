/**
 * The app scrolls inside #root, not the window (as in Matro), so the film grain overlay
 * covers the scrollbar too and the track has no visible background.
 */
export function scrollRoot(): HTMLElement | null {
  return document.getElementById('root');
}

export function scrollToTop() {
  scrollRoot()?.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}
