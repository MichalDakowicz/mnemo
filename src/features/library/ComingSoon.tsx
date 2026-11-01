import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';

import { Art } from '@/components/media/Art';
import { titleHref } from '@/components/media/MovieCard';
import { Belt } from '@/features/discover/Belt';
import { useBelt } from '@/features/discover/useBelt';
import { useCardWidth } from '@/features/discover/useCardWidth';
import { releaseBadge } from '@/lib/cardInfo';
import { hueFromTitle } from '@/lib/hue';
import type { Movie } from '@/types/movie';

type Props = { movies: Movie[]; collapsed: boolean; onToggle: () => void };

function SoonCard({ movie }: { movie: Movie }) {
  const href = titleHref(movie);
  const inner = (
    <>
      <span className="mc-cover" style={{ '--h': hueFromTitle(movie.title) } as CSSProperties}>
        {movie.coverUrl ? <img src={movie.coverUrl} alt="" loading="lazy" /> : <Art title={movie.title} />}
        <span className="soon-date">{releaseBadge(movie.releaseDate)}</span>
      </span>
      <span className="mc-title">{movie.title}</span>
      <span className="mc-meta">{movie.type === 'tv' ? 'Series' : 'Film'}</span>
    </>
  );
  return href ? <Link className="mc-link" to={href}>{inner}</Link> : <span className="mc-link">{inner}</span>;
}

/** Poster, title and type under it, plus the sink either side. */
const BELT_HEIGHT = 372;

export function ComingSoon({ movies, collapsed, onToggle }: Props) {
  const cardWidth = useCardWidth();
  const belt = useBelt(movies.length, cardWidth, 22, { loop: false });
  if (movies.length === 0) return null;
  return (
    <section className="lib-section" aria-labelledby="lib-soon">
      <div className="lib-head">
        <h2 id="lib-soon">Coming soon</h2>
        <span className="row-tools">
          <button type="button" className="text-button lib-collapse" aria-expanded={!collapsed} onClick={onToggle}>
            From your watchlist · {movies.length}
            <ChevronDown size={14} style={{ transform: collapsed ? 'rotate(-90deg)' : undefined }} aria-hidden="true" />
          </button>
          {collapsed || belt.still ? null : (
            <span className="belt-nav">
              <button type="button" className="icon-button" aria-label="Previous in coming soon" disabled={!belt.canPrev} onClick={belt.prev}><ChevronLeft size={18} /></button>
              <button type="button" className="icon-button" aria-label="Next in coming soon" disabled={!belt.canNext} onClick={belt.next}><ChevronRight size={18} /></button>
            </span>
          )}
        </span>
      </div>
      {collapsed ? null : (
        <Belt belt={belt} items={movies} keyOf={(m) => m.id} render={(m) => <SoonCard movie={m} />} cardWidth={cardWidth} height={BELT_HEIGHT} label="Coming soon from your watchlist. Scroll sideways, drag, or use the arrow buttons." />
      )}
    </section>
  );
}
