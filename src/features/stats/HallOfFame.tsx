import { titleMeta } from '@/lib/statsSummary';
import type { Movie } from '@/types/movie';

import { TitleCard } from './TitleCard';

export function HallOfFame({ titles }: { titles: Movie[] }) {
  return (
    <section className="block" aria-label="Hall of fame">
      <div className="block-head">
        <h2>Hall of fame</h2>
        <span>Every title with five stars</span>
      </div>
      {titles.length === 0 ? (
        <p className="stats-mix">No five-star titles yet.</p>
      ) : (
        <div className="fame">
          {titles.map((m) => (
            <TitleCard
              key={m.id}
              title={m.title}
              coverUrl={m.coverUrl}
              meta={titleMeta(m)}
              to={m.tmdbId != null ? `/title/${m.type}/${m.tmdbId}` : null}
            />
          ))}
        </div>
      )}
    </section>
  );
}
