import { Bookmark, Check, Ellipsis, Play, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';

import { cardMeta, cardStatus, cardSubtitleLine, kindTag, STATUS_LABEL, userRating } from '@/lib/cardInfo';
import { hueFromTitle } from '@/lib/hue';
import { watchProgressPercent } from '@/lib/movieStatus';
import { QUICK_STATUS_LABEL, quickStatusOptions, type QuickStatus } from '@/lib/quickStatus';
import type { Movie } from '@/types/movie';

import { Art } from './Art';
import './movieCard.css';

type Props = {
  movie: Movie;
  /** 'poster' = grid tile, 'row' = list line. */
  variant?: 'poster' | 'row';
  /** Shows a quick-status menu on the card when given. */
  onQuickStatus?: (movie: Movie, target: QuickStatus) => void;
  highlighted?: boolean;
};

/** /title/<movie|tv>/<tmdbId>, or null for a manually added title that has no TMDB id. */
export function titleHref(movie: Pick<Movie, 'type' | 'tmdbId'>): string | null {
  return movie.tmdbId ? `/title/${movie.type === 'tv' ? 'tv' : 'movie'}/${movie.tmdbId}` : null;
}

function StatusBadge({ movie }: { movie: Movie }) {
  const status = cardStatus(movie);
  const label = STATUS_LABEL[status];
  const icon =
    status === 'completed' ? <Check size={12} strokeWidth={3} color="var(--good)" />
    : status === 'watching' ? <Play size={11} strokeWidth={2.6} fill="currentColor" />
    : status === 'rewatch' ? <RotateCcw size={12} strokeWidth={2.4} />
    : <Bookmark size={12} strokeWidth={2.6} />;
  return <span className="mc-badge" role="img" aria-label={label} title={label}>{icon}</span>;
}

function QuickMenu({ movie, onPick }: { movie: Movie; onPick: (t: QuickStatus) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return (
    <div className="mc-quick" ref={ref} data-open={open}>
      <button type="button" className="mc-quick-btn glass" aria-label={`Change status of ${movie.title}`} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Ellipsis size={16} />
      </button>
      {open ? (
        <div className="mc-menu glass" role="menu">
          {quickStatusOptions(movie).map((opt) => (
            <button key={opt} type="button" role="menuitem" onClick={() => { setOpen(false); onPick(opt); }}>
              {QUICK_STATUS_LABEL[opt]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// Matro card: 2:3 cover that lifts and tilts, status badge, progress hairline, title + meta below.
export function MovieCard({ movie, variant = 'poster', onQuickStatus, highlighted }: Props) {
  const href = titleHref(movie);
  const status = cardStatus(movie);
  const pct = status === 'watching' ? watchProgressPercent(movie) : 0;
  const rating = userRating(movie);
  const cover = (
    <span className="mc-cover" style={{ '--h': hueFromTitle(movie.title) } as CSSProperties}>
      {movie.coverUrl ? <img src={movie.coverUrl} alt="" loading="lazy" /> : <Art title={movie.title} />}
      <span className="mc-kind">{kindTag(movie)}</span>
      {pct > 0 ? <span className="mc-progress" role="img" aria-label={`${pct}% watched`}><span style={{ width: `${pct}%` }} /></span> : null}
    </span>
  );
  const body = variant === 'poster'
    ? <><span className="mc-title">{movie.title}</span><span className="mc-meta">{cardMeta(movie)}</span></>
    : (
      <span className="mc-row-text">
        <span className="mc-title">{movie.title}</span>
        <span className="mc-meta">{cardSubtitleLine(movie) || ' '}</span>
      </span>
    );
  const main = href
    ? <Link to={href} className="mc-link">{cover}{body}</Link>
    : <span className="mc-link">{cover}{body}</span>;
  return (
    <div className={`mc mc-${variant}`} data-highlighted={highlighted || undefined}>
      {main}
      {variant === 'poster' ? <StatusBadge movie={movie} /> : null}
      {variant === 'row' ? (
        <span className="mc-row-end">
          {rating ? <span className="mc-rating mono">★ {Number.isInteger(rating) ? rating : rating.toFixed(1)}</span> : null}
          <span className="mc-status">{STATUS_LABEL[status]}</span>
        </span>
      ) : null}
      {onQuickStatus ? <QuickMenu movie={movie} onPick={(t) => onQuickStatus(movie, t)} /> : null}
    </div>
  );
}
