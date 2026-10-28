import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import '@/features/person/person.css';
import { TitleGridView } from '@/features/person/TitleGridView';
import { useGenreMoviesInfinite, useGenres } from '@/hooks/useTmdb';

// /genre/<tmdbGenreId>: Radar's genre landing page (films, best rated first).
export function GenrePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const genreId = Number(id) || null;
  const genres = useGenres('movie');
  const q = useGenreMoviesInfinite(genreId);
  const name = genres.data?.find((g) => g.id === genreId)?.name ?? 'Genre';

  return (
    <>
      <button type="button" className="pe-back glass" onClick={() => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/'))} aria-label="Back">
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      <TitleGridView
        title={name}
        count={q.data?.pages[0]?.totalCount ?? 0}
        items={q.data?.pages.flatMap((p) => p.movies) ?? []}
        loading={q.isLoading}
        error={q.isError}
        hasMore={!!q.hasNextPage}
        fetchingMore={q.isFetchingNextPage}
        onMore={() => void q.fetchNextPage()}
        onRetry={() => void q.refetch()}
      />
    </>
  );
}
