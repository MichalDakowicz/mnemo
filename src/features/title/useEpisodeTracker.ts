import { useMemo, useState } from 'react';

import { useSeasonDetails } from '@/hooks/useSeasonDetails';
import type { EditForm } from '@/lib/editForm';
import { episodeWatchCount, episodeWatchLog, type EpisodeWatchLog } from '@/lib/episodes';
import { currentEpisodeSeason } from '@/lib/seasonPreload';
import { nextUnwatched, seasonProgress } from '@/lib/titleStatus';

type Source = { episodeWatchDates: EpisodeWatchLog; episodesWatched: Record<string, boolean> };

/** The episode list of one season plus the owner's watch counts for it. */
export function useEpisodeTracker(tmdbId: number | null, seasonCount: number, form: EditForm | null) {
  const [picked, setPicked] = useState<number | null>(null);
  const source: Source = { episodeWatchDates: form?.episodeWatchDates ?? {}, episodesWatched: form?.episodesWatched ?? {} };
  // Opens where the user left off, the same season Radar's tracker opens on.
  const season = picked ?? currentEpisodeSeason(source, seasonCount);
  const details = useSeasonDetails(tmdbId, season);
  const episodes = useMemo(() => details.data?.episodes ?? [], [details.data]);

  const counts = useMemo(() => {
    const out: Record<number, number> = {};
    for (const e of episodes) out[e.episode_number] = episodeWatchCount(source, `s${season}e${e.episode_number}`);
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodes, season, form?.episodeWatchDates, form?.episodesWatched]);

  /** Latest watched day of one episode, ISO, for "Watched 5 Oct". */
  const lastWatch = (n: number): string | null => {
    const log = episodeWatchLog(source, `s${season}e${n}`);
    return log.length ? log[log.length - 1] : null;
  };

  /** Episodes of any season with a watch, for the season chips. */
  const watchedIn = (s: number): number =>
    Object.keys(source.episodesWatched).filter((k) => k.startsWith(`s${s}e`) && episodeWatchCount(source, k) > 0).length;

  return {
    season,
    setSeason: setPicked,
    episodes,
    counts,
    loading: details.isLoading,
    progress: seasonProgress(episodes, counts),
    next: nextUnwatched(episodes, counts),
    lastWatch,
    watchedIn,
  };
}

export type EpisodeTracker = ReturnType<typeof useEpisodeTracker>;
