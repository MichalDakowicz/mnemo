import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';

import { Art } from '@/components/media/Art';
import { titleHref } from '@/components/media/MovieCard';
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

export function ComingSoon({ movies, collapsed, onToggle }: Props) {
  if (movies.length === 0) return null;
  return (
    <section className="lib-section" aria-labelledby="lib-soon">
      <div className="lib-head">
        <h2 id="lib-soon">Coming soon</h2>
        <button type="button" className="text-button lib-collapse" aria-expanded={!collapsed} onClick={onToggle}>
          From your watchlist · {movies.length}
          <ChevronDown size={14} style={{ transform: collapsed ? 'rotate(-90deg)' : undefined }} aria-hidden="true" />
        </button>
      </div>
      {collapsed ? null : <div className="lib-grid" data-size="normal">{movies.map((m) => <SoonCard key={m.id} movie={m} />)}</div>}
    </section>
  );
}
