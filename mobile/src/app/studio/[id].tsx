import { useLocalSearchParams } from 'expo-router';

import { TitleGridView } from '@/features/person/TitleGridView';
import { useCompanyDetails, useCompanyMoviesInfinite } from '@/hooks/useTmdb';

// /studio/<tmdbCompanyId>: the studio landing page (films, best rated first).
export default function StudioScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const companyId = Number(id) || null;
  const company = useCompanyDetails(companyId);
  const q = useCompanyMoviesInfinite(companyId);

  return (
    <TitleGridView
      title={company.data?.name ?? 'Studio'}
      logoUrl={company.data?.logoUrl}
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
