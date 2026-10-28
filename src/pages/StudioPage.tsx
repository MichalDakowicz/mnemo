import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import '@/features/person/person.css';
import { TitleGridView } from '@/features/person/TitleGridView';
import { useCompanyDetails, useCompanyMoviesInfinite } from '@/hooks/useTmdb';

// /studio/<tmdbCompanyId>: Radar's studio landing page (films, best rated first).
export function StudioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const companyId = Number(id) || null;
  const company = useCompanyDetails(companyId);
  const q = useCompanyMoviesInfinite(companyId);

  return (
    <>
      <button type="button" className="pe-back glass" onClick={() => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/'))} aria-label="Back">
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
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
    </>
  );
}
