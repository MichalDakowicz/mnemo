import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import type { MediaType } from '@/types/movie';

const subscribe = () => () => {};

/** The title's TMDB and IMDb pages as quiet marks beside the brand, rendered into the shell's slot. */
export function TitleLinks({ type, tmdbId, imdbId }: { type: MediaType; tmdbId: number; imdbId?: string | null }) {
  // The slot belongs to the shell, which commits with the page; the store re-reads it right after mount.
  const slot = useSyncExternalStore(subscribe, () => document.getElementById('title-links'), () => null);
  if (!slot) return null;
  return createPortal(
    <>
      <a className="tl tl-tmdb" href={`https://www.themoviedb.org/${type}/${tmdbId}`} target="_blank" rel="noopener noreferrer" title="Open on TMDB" aria-label="Open on TMDB">
        <span aria-hidden="true" />
      </a>
      {imdbId ? (
        <a className="tl tl-imdb" href={`https://www.imdb.com/title/${imdbId}`} target="_blank" rel="noopener noreferrer" title="Open on IMDb" aria-label="Open on IMDb">
          <span aria-hidden="true" />
        </a>
      ) : null}
    </>,
    slot,
  );
}
