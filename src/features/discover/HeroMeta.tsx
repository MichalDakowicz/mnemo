import { ArrowLeftRight, Check, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import { titleSize } from '@/lib/discoverReel';
import type { MediaMetadata } from '@/lib/tmdb';
import type { DiscoverItem } from '@/lib/toDiscoveryMovie';

import type { CardActions } from './useCardActions';

type Props = { item: DiscoverItem; details: MediaMetadata | null; actions: CardActions; kicker: string };

/** Left-hand panel next to the reel: the centred title, who made it, and add / details. */
export function HeroMeta({ item, details, actions, kicker }: Props) {
  const added = actions.isAdded(item);
  const byLabel = item.type === 'movie' ? 'Directed by' : 'Created by';
  const people = details?.director.map((d) => d.name).join(', ');
  const year = item.releaseDate?.slice(0, 4);
  const genres = (details?.genres.map((g) => g.name) ?? item.genres).slice(0, 2).join(' · ');
  return (
    <div className="show-meta">
      <p className="show-kicker">{kicker}</p>
      <h1 className="show-title" style={{ fontSize: titleSize(item.title) }}>
        {item.title}
      </h1>
      <dl className="meta-list">
        <div>
          <dt>{byLabel}</dt>
          <dd>{people || (details ? '—' : '')}</dd>
        </div>
        <div>
          <dt>Year</dt>
          <dd>{year || '—'}</dd>
        </div>
        <div>
          <dt>Genre</dt>
          <dd>{genres || '—'}</dd>
        </div>
      </dl>
      <div className="show-actions">
        <button
          type="button"
          className="pill primary"
          aria-pressed={added}
          disabled={actions.isPending(item)}
          onClick={() => void actions.toggle({ tmdbId: item.tmdbId, type: item.type, title: item.title })}
        >
          {added ? <Check size={16} strokeWidth={2.2} aria-hidden="true" /> : <Plus size={16} strokeWidth={2.2} aria-hidden="true" />}
          {added ? 'On your watchlist' : 'Add to watchlist'}
        </button>
        <Link className="pill" to={`/title/${item.type}/${item.tmdbId}`}>
          Details
        </Link>
      </div>
      <p className="show-hint">
        <ArrowLeftRight size={16} aria-hidden="true" />
        Scroll sideways or drag to browse
      </p>
    </div>
  );
}
