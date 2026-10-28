import { ArrowLeft } from 'lucide-react';

import type { MediaType } from '@/types/movie';

import { DiscoverCard } from './DiscoverCard';
import type { CardActions } from './useCardActions';
import { useGenreView } from './useGenreView';
import { useNearEnd } from './useNearEnd';

type Props = { type: MediaType; genre: { id: number; name: string }; actions: CardActions; onBack: () => void };

/** Stopgap genre page (the design has none): a genre's titles as an infinite grid, in place on Discover. */
export function GenreView({ type, genre, actions, onBack }: Props) {
  const view = useGenreView(type, genre.id);
  const sentinel = useNearEnd(view.loadMore, !!view.hasMore && !view.loadingMore);
  return (
    <section className="disc-section" aria-label={`${genre.name} ${type === 'tv' ? 'shows' : 'films'}`}>
      <div className="row-head">
        <h2>
          {genre.name} {type === 'tv' ? 'shows' : 'films'}
        </h2>
        <button type="button" className="text-button" onClick={onBack}>
          <ArrowLeft size={14} aria-hidden="true" style={{ verticalAlign: -2, marginRight: 6 }} />
          Back to Discover
        </button>
      </div>
      {view.loading ? <div className="empty" role="status">{'Loading…'}</div> : null}
      {view.error ? <div className="empty" role="alert">Could not load this genre.</div> : null}
      <div className="grid">
        {view.items.map((item) => (
          <DiscoverCard key={`${item.type}-${item.tmdbId}`} item={item} actions={actions} />
        ))}
      </div>
      <div className="more" ref={sentinel}>
        {view.hasMore ? (
          <button type="button" className="pill" disabled={view.loadingMore} onClick={view.loadMore}>
            {view.loadingMore ? 'Loading…' : 'Load more'}
          </button>
        ) : null}
      </div>
    </section>
  );
}
