import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { Belt } from './Belt';
import { DiscoverCard } from './DiscoverCard';
import type { DiscoverRow as Row } from './useDiscoveryFeed';
import type { CardActions } from './useCardActions';
import { useBelt, useCardWidth } from './useBelt';

type Props = { row: Row; actions: CardActions; onOpenGenre: (genre: { id: number; name: string }) => void };

/** One discovery section: a conveyor belt of titles. "See all" lays them out as a wrapped grid instead; genre rows can open the genre. */
export function DiscoverRow({ row, actions, onOpenGenre }: Props) {
  const [expanded, setExpanded] = useState(false);
  const cardWidth = useCardWidth();
  const belt = useBelt(row.items.length, cardWidth);
  return (
    <section className="disc-section" aria-label={row.title}>
      <div className="row-head">
        <h2>
          {row.title}
          {row.badge ? <span className="badge">{row.badge}</span> : null}
        </h2>
        <span className="row-tools">
          {row.genre ? (
            <button type="button" className="text-button" onClick={() => onOpenGenre(row.genre!)}>
              Explore genre
            </button>
          ) : null}
          <button type="button" className="text-button" aria-expanded={expanded} onClick={() => setExpanded((v) => !v)}>
            {expanded ? 'Show less' : 'See all'}
          </button>
          {expanded ? null : (
            <span className="belt-nav">
              <button type="button" className="icon-button" aria-label={`Previous in ${row.title}`} onClick={belt.prev}><ChevronLeft size={18} /></button>
              <button type="button" className="icon-button" aria-label={`Next in ${row.title}`} onClick={belt.next}><ChevronRight size={18} /></button>
            </span>
          )}
        </span>
      </div>
      {expanded ? (
        <div className="row wrap">
          {row.items.map((item) => (
            <DiscoverCard key={`${item.type}-${item.tmdbId}`} item={item} actions={actions} />
          ))}
        </div>
      ) : (
        <Belt
          belt={belt}
          items={row.items}
          keyOf={(item) => `${item.type}-${item.tmdbId}`}
          render={(item) => <DiscoverCard item={item} actions={actions} />}
          cardWidth={cardWidth}
          label={`${row.title}. Scroll sideways, drag, or use the arrow buttons.`}
        />
      )}
    </section>
  );
}
