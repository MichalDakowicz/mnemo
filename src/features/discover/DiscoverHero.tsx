import type { CSSProperties } from 'react';

import { useMediaMetadata } from '@/hooks/useTmdb';
import { useOpenTitle } from '@/hooks/useOpenTitle';
import type { MediaType } from '@/types/movie';

import { HeroMeta } from './HeroMeta';
import { ReelStage } from './ReelStage';
import type { CardActions } from './useCardActions';
import { useDiscoverHero } from './useDiscoverHero';
import { useReel } from './useReel';

/** This week's trending titles as a coverflow reel with the centred title's details beside it. */
export function DiscoverHero({ type, actions }: { type: MediaType; actions: CardActions }) {
  const hero = useDiscoverHero(type);
  const reel = useReel(hero.items);
  const openTitle = useOpenTitle();
  const current = hero.items[reel.centre] ?? null;
  const details = useMediaMetadata(current?.tmdbId ?? null, type);
  const kicker = `Trending this week · ${type === 'movie' ? 'films' : 'shows'}`;

  if (!current) {
    return (
      <section className="showcase" style={{ height: 'auto', minHeight: 220 }} aria-label={kicker}>
        <div className="empty" role="status">
          {hero.loading ? 'Loading what is trending…' : 'Trending titles are not available right now.'}
        </div>
      </section>
    );
  }

  const style = { '--cx': `${reel.frame.cx.toFixed(1)}px` } as CSSProperties;
  return (
    <section className="showcase" aria-label={kicker} style={style}>
      <ReelStage
        items={hero.items}
        reel={reel}
        label="Trending titles. Scroll sideways, drag, or use the arrow keys."
        onOpen={(item) => openTitle(item.tmdbId, item.type)}
      />
      <HeroMeta item={current} details={details.data ?? null} actions={actions} kicker={kicker} />
      {current.voteAverage > 0 ? (
        <div className="reel-ratings">
          <strong>{current.voteAverage.toFixed(1)}</strong>
          <span>TMDB</span>
        </div>
      ) : null}
      <p className="reel-count">
        {reel.centre + 1} / {hero.items.length}
      </p>
    </section>
  );
}
