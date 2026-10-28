import { useCallback, useEffect, useRef, useState } from 'react';

import { useMovies } from '@/hooks/useMovies';
import {
  absorbUndatedWatches,
  buildMoviePayload,
  fromMovie,
  recalcOverall,
  recalcSeasonsAverage,
  type EditForm,
  type SeasonRating,
} from '@/lib/editForm';
import {
  clearEpisodeWatches,
  episodeWatchCount,
  logEpisodeWatch,
  showWatchCount,
  unlogEpisodeWatch,
  type EpisodeWatchLog,
} from '@/lib/episodes';
import { pickStatus, type StatusKey } from '@/lib/titleStatus';
import type { Movie } from '@/types/movie';

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';
type RatingKey = 'overall' | 'story' | 'acting' | 'ending' | 'enjoyment';

const SAVE_DELAY_MS = 700;
const episodeKey = (season: number, n: number) => `s${season}e${n}`;
const EMPTY_SEASON: SeasonRating = { overall: 0, story: 0, acting: 0, ending: 0, enjoyment: 0 };

/**
 * The edit form of Radar's detail screen (useEditMovieForm), minus the save button:
 * every change updates the form at once and is written, debounced, with the same
 * payload Radar's Save writes (lib/editForm.buildMoviePayload).
 */
export function useTitleForm(movie: Movie | null) {
  const { updateMovie, removeMovie } = useMovies();
  const [form, setForm] = useState<EditForm | null>(null);
  const [initFor, setInitFor] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const [saveState, setSaveState] = useState<SaveState>('idle');

  // Initialise once per title: later cache refreshes (realtime, our own writes) must not
  // clobber what is being typed.
  if (movie && initFor !== movie.id) {
    setInitFor(movie.id);
    setForm(fromMovie(movie));
  } else if (!movie && initFor) {
    setInitFor(null);
    setForm(null);
  }

  const formRef = useRef(form);
  const movieRef = useRef(movie);
  const updateRef = useRef(updateMovie);
  const pending = useRef(false);
  useEffect(() => {
    formRef.current = form;
    movieRef.current = movie;
    updateRef.current = updateMovie;
  });

  const flush = useCallback(async () => {
    const f = formRef.current;
    const m = movieRef.current;
    if (!f || !m || !pending.current) return;
    pending.current = false;
    const result = buildMoviePayload(f, m);
    // Radar's Save deletes a film left with no status; a click-to-save page must never do that.
    if (result.remove) return;
    const u = result.updates;
    // Only moves that mean something to friends go to the activity feed, as one entry each.
    const meaningful =
      u.watched !== m.watched ||
      u.inProgress !== m.inProgress ||
      u.inWatchlist !== m.inWatchlist ||
      (u.ratings?.overall ?? 0) !== (m.ratings.overall ?? 0);
    setSaveState('saving');
    try {
      await updateRef.current(m.id, u, { silent: !meaningful });
      setSaveState('saved');
    } catch {
      pending.current = true;
      setSaveState('error');
    }
  }, []);

  useEffect(() => {
    if (revision === 0) return;
    const t = window.setTimeout(() => void flush(), SAVE_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [revision, flush]);
  // Leaving the page writes whatever is still waiting.
  useEffect(() => () => void flush(), [flush]);

  const commit = useCallback((fn: (f: EditForm) => EditForm) => {
    setForm((f) => (f ? fn(f) : f));
    pending.current = true;
    setRevision((r) => r + 1);
  }, []);
  const update = (patch: Partial<EditForm>) => commit((f) => ({ ...f, ...patch }));

  const setStatus = (key: StatusKey) => commit((f) => ({ ...f, status: pickStatus(f.status, key) }));

  const setOverall = (overallRating: number) => update({ overallRating });
  const setCategory = (key: 'story' | 'acting' | 'ending' | 'enjoyment', value: number) =>
    commit((f) => ({ ...f, ratings: { ...f.ratings, [key]: value } }));
  const setSeasonRating = (season: number, key: RatingKey, value: number) =>
    commit((f) => ({
      ...f,
      seasonRatings: { ...f.seasonRatings, [season]: { ...(f.seasonRatings[season] ?? EMPTY_SEASON), [key]: value } },
    }));
  const autoOverall = () =>
    commit((f) => {
      const avg = f.type === 'tv' ? recalcSeasonsAverage(f.seasonRatings) : recalcOverall(f.ratings);
      return avg == null ? f : { ...f, overallRating: avg };
    });
  const autoSeason = (season: number) =>
    commit((f) => {
      const s = f.seasonRatings[season];
      const avg = s ? recalcOverall({ story: s.story, acting: s.acting, ending: s.ending, enjoyment: s.enjoyment }) : null;
      return avg == null || !s ? f : { ...f, seasonRatings: { ...f.seasonRatings, [season]: { ...s, overall: avg } } };
    });

  // The log carries the watches and `episodesWatched` mirrors it; both are written together.
  const applyLog = (f: EditForm, log: EpisodeWatchLog, opts: { unwatched?: string[]; absorb?: boolean } = {}): EditForm => {
    const episodesWatched = { ...f.episodesWatched };
    for (const key of opts.unwatched ?? []) delete episodesWatched[key];
    for (const key of Object.keys(log)) episodesWatched[key] = true;
    const undatedWatches =
      opts.absorb === false
        ? f.status.undatedWatches
        : absorbUndatedWatches(
            f.status.undatedWatches,
            showWatchCount(f),
            showWatchCount({ ...f, episodeWatchDates: log, episodesWatched }),
          );
    return { ...f, episodeWatchDates: log, episodesWatched, status: { ...f.status, undatedWatches } };
  };
  const toggleEpisode = (season: number, n: number) =>
    commit((f) => {
      const key = episodeKey(season, n);
      return episodeWatchCount(f, key) > 0
        ? applyLog(f, clearEpisodeWatches(f.episodeWatchDates, key), { unwatched: [key] })
        : applyLog(f, logEpisodeWatch(f.episodeWatchDates, key, new Date().toISOString()));
    });
  const bumpEpisode = (season: number, n: number, delta: number) =>
    commit((f) => {
      const key = episodeKey(season, n);
      if (delta > 0) return applyLog(f, logEpisodeWatch(f.episodeWatchDates, key, new Date().toISOString()));
      return episodeWatchCount(f, key) <= 1
        ? applyLog(f, clearEpisodeWatches(f.episodeWatchDates, key), { unwatched: [key] })
        : applyLog(f, unlogEpisodeWatch(f.episodeWatchDates, key));
    });
  /** Fills the gaps: episodes never watched get one stamp, counts are untouched. */
  const completeSeason = (season: number, numbers: number[]) =>
    commit((f) => {
      const now = new Date().toISOString();
      let log = f.episodeWatchDates;
      for (const n of numbers) {
        if (episodeWatchCount(f, episodeKey(season, n)) === 0) log = logEpisodeWatch(log, episodeKey(season, n), now);
      }
      return applyLog(f, log);
    });
  /** Clears every episode of the season (the design's "Clear season"). */
  const clearSeason = (season: number, numbers: number[]) =>
    commit((f) => {
      let log = f.episodeWatchDates;
      const keys = numbers.map((n) => episodeKey(season, n));
      for (const key of keys) log = clearEpisodeWatches(log, key);
      return applyLog(f, log, { unwatched: keys });
    });
  /** "I watched the season again": +1 on every episode, an extra watch, so it absorbs nothing. */
  const rewatchSeason = (season: number, numbers: number[]) =>
    commit((f) => {
      const now = new Date().toISOString();
      let log = f.episodeWatchDates;
      for (const n of numbers) log = logEpisodeWatch(log, episodeKey(season, n), now);
      return applyLog(f, log, { absorb: false });
    });

  const remove = async () => {
    if (!movieRef.current) return;
    pending.current = false;
    await removeMovie(movieRef.current.id);
  };

  return {
    form,
    saveState,
    update,
    commit,
    setStatus,
    setOverall,
    setCategory,
    setSeasonRating,
    autoOverall,
    autoSeason,
    toggleEpisode,
    bumpEpisode,
    completeSeason,
    clearSeason,
    rewatchSeason,
    remove,
    retrySave: () => {
      pending.current = true;
      void flush();
    },
  };
}

export type TitleForm = ReturnType<typeof useTitleForm>;
