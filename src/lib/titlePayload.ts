// Pure shaping of a TMDB title into the row Radar writes when a title is added.
// Mirrors Radar's useQuickAdd (metadataToPayload): same fields, same defaults, so a
// title added from Mnemo reads back identically in Radar.
import { normalizeAvailability } from '@/lib/services';
import type { MediaMetadata } from '@/lib/tmdb';
import type { StatusFlags } from '@/lib/movieStatus';
import { addedDatedWatches } from '@/lib/watchCounts';
import type { MediaType, Movie, Ratings } from '@/types/movie';

export type QuickAddStatus = StatusFlags & {
  timesWatched: number;
  /** Of those watches, how many carry no date - invisible to every streak. */
  undatedWatches: number;
};

export const DEFAULT_QUICK_ADD_STATUS: QuickAddStatus = {
  inWatchlist: true,
  inProgress: false,
  watched: false,
  timesWatched: 0,
  undatedWatches: 0,
};

export function statusLabel(status: StatusFlags): string {
  return status.watched ? 'Completed' : status.inProgress ? 'Watching' : 'Watchlist';
}

/** True when at least one of the watches being added happened now. */
function datedNow(status: QuickAddStatus): boolean {
  return status.watched && status.undatedWatches < (status.timesWatched || 1);
}

function datedStamps(status: QuickAddStatus, nowIso: string): string[] {
  return Array.from({ length: addedDatedWatches(status) }, () => nowIso);
}

export function metadataToPayload(
  meta: MediaMetadata,
  status: QuickAddStatus = DEFAULT_QUICK_ADD_STATUS,
  ratings: Ratings = {},
  nowIso = new Date().toISOString(),
): Partial<Movie> & { title: string; type: MediaType } {
  return {
    tmdbId: meta.tmdbId,
    imdbId: meta.imdbId,
    type: meta.type,
    title: meta.title,
    director: meta.director,
    cast: meta.cast,
    genres: meta.genres,
    releaseDate: meta.releaseDate,
    coverUrl: meta.coverUrl,
    overview: meta.overview,
    runtime: meta.runtime,
    voteAverage: meta.voteAverage,
    voteCount: meta.voteCount,
    tagline: meta.tagline,
    budget: meta.budget,
    revenue: meta.revenue,
    productionCompanies: meta.productionCompanies,
    numberOfSeasons: meta.number_of_seasons,
    numberOfEpisodes: meta.number_of_episodes,
    tmdbStatus: meta.tmdbStatus,
    availability: normalizeAvailability(meta.availability),
    status: statusLabel(status),
    inWatchlist: status.inWatchlist,
    inProgress: status.inProgress,
    watched: status.watched,
    timesWatched: status.watched ? status.timesWatched || 1 : 0,
    completedAt: datedNow(status) ? nowIso : null,
    watchDates: meta.type === 'tv' || !datedNow(status) ? [] : datedStamps(status, nowIso),
    ratings,
  };
}
