import { useLocalSearchParams } from 'expo-router';

import { TitleGridView } from '@/features/person/TitleGridView';
import { useGenreMoviesInfinite, useGenres } from '@/hooks/useTmdb';

// /genre/<tmdbGenreId>: the genre landing page (films, best rated first).
export default function GenreScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const genreId = Number(id) || null;
  const genres = useGenres('movie');
  const q = useGenreMoviesInfinite(genreId);
  const name = genres.data?.find((g) => g.id === genreId)?.name ?? 'Genre';

  return (
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
  );
}
