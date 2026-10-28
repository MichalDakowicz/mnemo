import type { CreditItem } from '@/lib/tmdb';
import { yearOf } from '@/lib/titleFacts';

import { CreditCard } from './CreditCard';
import { useAddToLibrary } from '@/features/title/useAddToLibrary';
import { useLibraryIndex } from './useLibraryIndex';

type Props = {
  title: string;
  count: number;
  logoUrl?: string | null;
  items: CreditItem[];
  loading: boolean;
  error: boolean;
  hasMore: boolean;
  fetchingMore: boolean;
  onMore: () => void;
  onRetry: () => void;
};

/** Genre and studio pages: a heading and the person-style grid of titles, loaded a page at a time. */
export function TitleGridView({ title, count, logoUrl, items, loading, error, hasMore, fetchingMore, onMore, onRetry }: Props) {
  const library = useLibraryIndex();
  const adder = useAddToLibrary();

  if (loading) return <p className="pe-state" role="status">Loading…</p>;
  if (error) {
    return (
      <div className="pe-state" role="alert">
        Could not load these titles.
        <div><button type="button" className="pill" onClick={onRetry}>Try again</button></div>
      </div>
    );
  }

  return (
    <>
      <div className="page-head">
        <div>
          {logoUrl ? <img src={logoUrl} alt="" style={{ height: 36, marginBottom: 12, display: 'block', filter: 'grayscale(1) brightness(1.6)' }} /> : null}
          <h1 className="page-title">{title}</h1>
          <p className="page-sub">{count.toLocaleString('en-US')} {count === 1 ? 'title' : 'titles'}, best rated first</p>
        </div>
      </div>
      {items.length === 0 ? <p className="empty">TMDB has nothing listed here.</p> : null}
      <div className="pe-grid">
        {items.map((c) => (
          <CreditCard
            key={`${c.type}:${c.tmdbId}`}
            item={{ tmdbId: c.tmdbId, type: c.type, title: c.title, coverUrl: c.coverUrl, meta: yearOf(c.releaseDate) }}
            entry={library[`${c.type}:${c.tmdbId}`]}
            tag={false}
            adding={adder.pending === `${c.type}:${c.tmdbId}`}
            onAdd={() => void adder.add(c.tmdbId, c.type)}
          />
        ))}
      </div>
      {adder.error ? <p className="pe-empty" role="alert">{adder.error}</p> : null}
      {hasMore ? (
        <div className="pe-more-row">
          <button type="button" className="pill" onClick={onMore} disabled={fetchingMore}>{fetchingMore ? 'Loading…' : 'Show more'}</button>
        </div>
      ) : null}
    </>
  );
}
