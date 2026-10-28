import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { buildLeavingTitles, type Expiration, type LeavingTitle } from '@/lib/leaving';
import { supabase } from '@/lib/supabase';
import type { MediaType, Movie } from '@/types/movie';

// Reads public.streaming_expirations, the shared catalogue the sync-expirations edge
// function fills. Read-only here: nothing in Mnemo writes to it or calls the upstream API.

type ExpirationRow = {
  service_name: string;
  tmdb_id: number;
  media_type: MediaType;
  expires_on: string;
  title: string;
  poster_url: string | null;
  release_year: number | null;
  link: string | null;
};

const HORIZON_DAYS = 90;
/** A whole country's catalogue is ~170 (PL) to ~800 (US) rows in a month; well above both. */
const ROW_CAP = 3000;

function addDays(date: string, days: number): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * 86_400_000).toISOString().slice(0, 10);
}

async function fetchExpirations(country: string, today: string): Promise<Expiration[]> {
  const { data, error } = await supabase
    .from('streaming_expirations')
    .select('service_name,tmdb_id,media_type,expires_on,title,poster_url,release_year,link')
    .eq('country', country)
    .gte('expires_on', today)
    .lte('expires_on', addDays(today, HORIZON_DAYS))
    .order('expires_on', { ascending: true })
    .limit(ROW_CAP);
  // A project without the table answers 42P01 / PGRST205: "not set up", which shows as an empty state.
  if (error && (error.code === '42P01' || error.code === 'PGRST205')) return [];
  if (error) throw error;
  return (data as ExpirationRow[]).map((r) => ({
    serviceName: r.service_name,
    tmdbId: r.tmdb_id,
    mediaType: r.media_type,
    expiresOn: r.expires_on,
    title: r.title,
    posterUrl: r.poster_url,
    releaseYear: r.release_year,
    link: r.link,
  }));
}

export type LeavingSoon = { titles: LeavingTitle[]; loading: boolean; error: boolean; hasCatalogue: boolean };

/** Titles leaving streaming services in the viewer's country, collapsed per title (lib/leaving). */
export function useLeavingSoon(country: string, owned: string[], movies: Movie[], today: string): LeavingSoon {
  const query = useQuery({
    queryKey: ['leaving-soon', country, today],
    queryFn: () => fetchExpirations(country, today),
    staleTime: 6 * 60 * 60 * 1000,
  });
  const titles = useMemo(() => buildLeavingTitles(query.data ?? [], movies, owned, today), [query.data, movies, owned, today]);
  return { titles, loading: query.isLoading, error: query.isError, hasCatalogue: (query.data?.length ?? 0) > 0 };
}
