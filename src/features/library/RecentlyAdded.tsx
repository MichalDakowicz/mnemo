import { MovieCard } from '@/components/media/MovieCard';
import type { QuickStatus } from '@/lib/quickStatus';
import type { Movie } from '@/types/movie';

type Props = { movies: Movie[]; onQuickStatus: (m: Movie, t: QuickStatus) => void };

export function RecentlyAdded({ movies, onQuickStatus }: Props) {
  if (movies.length === 0) return null;
  return (
    <section className="lib-section" aria-labelledby="lib-recent">
      <div className="lib-head"><h2 id="lib-recent">Recently added</h2><span>{movies.length}</span></div>
      <div className="lib-grid" data-size="normal">{movies.map((m) => <MovieCard key={m.id} movie={m} onQuickStatus={onQuickStatus} />)}</div>
    </section>
  );
}
