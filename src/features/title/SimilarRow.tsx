import { Poster } from '@/components/media/Poster';
import type { MediaSummary } from '@/lib/tmdb';
import { yearOf } from '@/lib/titleFacts';
import type { MediaType } from '@/types/movie';

type Props = { type: MediaType; items: MediaSummary[]; owned: Set<number> };

export function SimilarRow({ type, items, owned }: Props) {
  if (items.length === 0) return null;
  return (
    <section className="panel" aria-labelledby="h-similar">
      <div className="ti-panel-head"><h2 id="h-similar">{type === 'tv' ? 'Similar shows' : 'Similar movies'}</h2></div>
      <div className="ti-row">
        {items.map((s) => (
          <div key={s.tmdbId} className="ti-card">
            <Poster title={s.title} coverUrl={s.coverUrl} to={`/title/${s.type}/${s.tmdbId}`} />
            <span className="n">{s.title}</span>
            <span className="r">{[yearOf(s.releaseDate), owned.has(s.tmdbId) ? 'In your library' : ''].filter(Boolean).join(' · ')}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
