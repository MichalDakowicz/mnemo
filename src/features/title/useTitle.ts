import { useQuery } from '@tanstack/react-query';

import { useMovies } from '@/hooks/useMovies';
import { useMediaMetadata, useSimilarMedia } from '@/hooks/useTmdb';
import { fetchTitleExtras, type TitleExtras } from '@/lib/tmdbExtra';
import type { MediaType, Movie } from '@/types/movie';

/** Everything the page reads about one title: the TMDB side, and your row if you own it. */
export function useTitle(type: MediaType, tmdbId: number) {
  const { movies, loading: libraryLoading } = useMovies();
  const owned: Movie | null = movies.find((m) => m.tmdbId === tmdbId && m.type === type) ?? null;

  const ownedIds = new Set(movies.filter((m) => m.type === type && m.tmdbId).map((m) => m.tmdbId as number));

  const metadata = useMediaMetadata(tmdbId || null, type);
  const extras = useQuery<TitleExtras | null>({
    queryKey: ['tmdb', 'extras', type, tmdbId],
    queryFn: () => fetchTitleExtras(tmdbId, type),
    enabled: !!tmdbId,
    staleTime: 10 * 60 * 1000,
  });
  const similar = useSimilarMedia(tmdbId || null, type);

  const meta = metadata.data ?? null;
  // TMDB wins where both have an answer; the stored row fills in when TMDB is down.
  const display = {
    title: meta?.title || owned?.title || '',
    tagline: meta?.tagline || owned?.tagline || '',
    coverUrl: meta?.coverUrl || owned?.coverUrl || null,
    releaseDate: meta?.releaseDate || owned?.releaseDate || null,
    overview: meta?.overview || owned?.overview || '',
    runtime: meta?.runtime || owned?.runtime || 0,
    director: meta?.director?.length ? meta.director : (owned?.director ?? []),
    genres: meta?.genres?.length ? meta.genres : (owned?.genres ?? []),
    cast: meta?.cast?.length ? meta.cast : (owned?.cast ?? []),
    availability: meta?.availability?.length ? meta.availability : (owned?.availability ?? []),
    productionCompanies: meta?.productionCompanies?.length ? meta.productionCompanies : (owned?.productionCompanies ?? []),
    voteAverage: meta?.voteAverage || owned?.voteAverage || 0,
    voteCount: meta?.voteCount || owned?.voteCount || 0,
    budget: meta?.budget || owned?.budget || 0,
    revenue: meta?.revenue || owned?.revenue || 0,
    imdbId: meta?.imdbId || owned?.imdbId || extras.data?.imdbId || null,
    tmdbStatus: meta?.tmdbStatus || owned?.tmdbStatus || extras.data?.tmdbStatus || null,
    numberOfSeasons: meta?.number_of_seasons ?? owned?.numberOfSeasons ?? null,
    numberOfEpisodes: meta?.number_of_episodes ?? owned?.numberOfEpisodes ?? null,
  };

  return {
    owned,
    ownedIds,
    libraryLoading,
    display,
    extras: extras.data ?? null,
    extrasLoading: extras.isLoading,
    similar: similar.data ?? [],
    // Only a title with nothing stored has to wait on the network.
    loading: !owned && (libraryLoading || metadata.isLoading),
    error: !owned && !libraryLoading && !metadata.isLoading && (metadata.isError || !meta),
    refetch: () => void metadata.refetch(),
  };
}
