import { useParams } from 'react-router-dom';

import '@/features/person/person.css';
import { TitleGridView } from '@/features/person/TitleGridView';
import { useGenreMoviesInfinite, useGenres } from '@/hooks/useTmdb';

// /genre/<tmdbGenreId>: Radar's genre landing page (films, best rated first).
export function GenrePage() {
  const { id } = useParams();
  const genreId = Number(id) || null;
  const genres = useGenres('movie');
  const q = useGenreMoviesInfinite(genreId);
  const name = genres.data?.find((g) => g.id === genreId)?.name ?? 'Genre';

  return (
    <>
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
