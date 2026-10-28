import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Belt } from '@/features/discover/Belt';
import { useBelt } from '@/features/discover/useBelt';
import { titleMeta } from '@/lib/statsSummary';
import type { Movie } from '@/types/movie';

import { TitleCard } from './TitleCard';

/** Beyond this many five-star titles the hall rides a conveyor belt, like Discover's rows; fewer sit in a plain grid. */
const BELT_FROM = 5;
const CARD = 188;

function card(m: Movie) {
  return <TitleCard title={m.title} coverUrl={m.coverUrl} meta={titleMeta(m)} to={m.tmdbId != null ? `/title/${m.type}/${m.tmdbId}` : null} />;
}

export function HallOfFame({ titles }: { titles: Movie[] }) {
  const belt = useBelt(titles.length, CARD);
  const riding = titles.length >= BELT_FROM;
  return (
    <section className="block" aria-label="Hall of fame">
      <div className="block-head">
        <h2>Hall of fame</h2>
        <span className="fame-tools">
          Every title with five stars
          {riding ? (
            <span className="belt-nav">
              <button type="button" className="icon-button" aria-label="Previous in the hall of fame" onClick={belt.prev}><ChevronLeft size={18} /></button>
              <button type="button" className="icon-button" aria-label="Next in the hall of fame" onClick={belt.next}><ChevronRight size={18} /></button>
            </span>
          ) : null}
        </span>
      </div>
      {titles.length === 0 ? (
        <p className="stats-mix">No five-star titles yet.</p>
      ) : riding ? (
        <Belt belt={belt} items={titles} keyOf={(m) => m.id} render={card} cardWidth={CARD} label="Your five-star titles. Scroll sideways, drag, or use the arrow buttons." />
      ) : (
        <div className="fame">{titles.map((m) => <div key={m.id}>{card(m)}</div>)}</div>
      )}
    </section>
  );
}
