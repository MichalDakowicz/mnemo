import { MovieCard } from '@/components/media/MovieCard';
import type { QuickStatus } from '@/lib/quickStatus';
import type { GridSize, ViewMode } from '@/store/libraryPrefs';
import type { Movie } from '@/types/movie';

type Props = { movies: Movie[]; viewMode: ViewMode; gridSize: GridSize; onQuickStatus: (m: Movie, t: QuickStatus) => void };

export function LibraryGrid({ movies, viewMode, gridSize, onQuickStatus }: Props) {
  if (viewMode === 'list') {
    return <div className="lib-list">{movies.map((m) => <MovieCard key={m.id} movie={m} variant="row" onQuickStatus={onQuickStatus} />)}</div>;
  }
  return <div className="lib-grid" data-size={gridSize}>{movies.map((m) => <MovieCard key={m.id} movie={m} onQuickStatus={onQuickStatus} />)}</div>;
}
