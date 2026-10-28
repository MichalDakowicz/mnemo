import { useState } from 'react';

import { DiscoverCard } from './DiscoverCard';
import type { DiscoverRow as Row } from './useDiscoveryFeed';
import type { CardActions } from './useCardActions';

type Props = { row: Row; actions: CardActions; onOpenGenre: (genre: { id: number; name: string }) => void };

/** One discovery row: a scrolling strip, "See all" opens it as a wrapped grid, genre rows can open the genre. */
export function DiscoverRow({ row, actions, onOpenGenre }: Props) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="disc-section" aria-label={row.title}>
      <div className="row-head">
        <h2>
          {row.title}
          {row.badge ? <span className="badge">{row.badge}</span> : null}
        </h2>
        <span>
          {row.genre ? (
            <button type="button" className="text-button" onClick={() => onOpenGenre(row.genre!)}>
              Explore genre
            </button>
          ) : null}
          <button type="button" className="text-button" aria-expanded={expanded} onClick={() => setExpanded((v) => !v)}>
            {expanded ? 'Show less' : 'See all'}
          </button>
        </span>
      </div>
      <div className={expanded ? 'row wrap' : 'row'}>
        {row.items.map((item) => (
          <DiscoverCard key={`${item.type}-${item.tmdbId}`} item={item} actions={actions} />
        ))}
      </div>
    </section>
  );
}
