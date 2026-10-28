import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAuth } from '@/features/auth/AuthProvider';
import { useActivity } from '@/hooks/useActivity';
import { useMovies } from '@/hooks/useMovies';
import { useProfile } from '@/hooks/useProfile';
import { useCanViewUser, usePublicActivity, usePublicMovies } from '@/hooks/usePublicMovies';
import { useToday } from '@/hooks/useToday';
import { useUserSettings } from '@/hooks/useUserSettings';
import { EMPTY_THRESHOLD_HISTORY } from '@/lib/streakThresholds';
import { computeStats, DEFAULT_STREAK_THRESHOLD, DEFAULT_TV_STREAK_THRESHOLD } from '@/lib/stats';
import { scopeMoviesToPeriod } from '@/lib/statsPeriod';
import { rewatchCount, selectHallOfFame, sumDaily } from '@/lib/statsSummary';
import { buildStreakGrid } from '@/lib/streakGrid';
import {
  deltaNote,
  directorAverages,
  hoursPerWeekNote,
  periodDays,
  periodOptions,
  plural,
  resolvePeriod,
  type PeriodKey,
} from '@/lib/statsView';

export type QuickStat = { label: string; value: string; note: string | null; good?: boolean };

// Everything the Stats screen shows. Own library by default; ?user=<id> reads a friend's
// (usePublicMovies) with default streak goals, since user_settings is owner-only.
export function useStatsPage() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const requested = params.get('user');
  const viewing = requested && requested !== user?.id ? requested : null;

  const own = useMovies();
  const pub = usePublicMovies(viewing ?? undefined);
  const access = useCanViewUser(viewing ?? undefined);
  const { profile } = useProfile(viewing ?? user?.id);
  const { settings } = useUserSettings();
  const ownActivity = useActivity(8);
  const pubActivity = usePublicActivity(viewing ?? undefined, 8);

  const today = useToday();
  const options = useMemo(() => periodOptions(), []);
  const [period, setPeriod] = useState<PeriodKey>(options[0].key);

  const movies = viewing ? pub.movies : own.movies;
  const loading = viewing ? pub.loading || access.loading : own.loading;
  const blocked = !!viewing && access.canView === false;

  const movieGoal = viewing ? DEFAULT_STREAK_THRESHOLD : settings.streakThreshold;
  const tvGoal = viewing ? DEFAULT_TV_STREAK_THRESHOLD : settings.tvStreakThreshold;
  const steps = viewing ? EMPTY_THRESHOLD_HISTORY : settings.streakThresholdHistory;

  const model = useMemo(() => {
    void today; // streaks are measured as of today
    const now = new Date();
    const range = resolvePeriod(period, now);
    const scoped = scopeMoviesToPeriod(movies, range.start, range.end);
    const stats = computeStats(scoped);
    // Streaks and calendars always read the whole library: the grid is 53 weeks whatever the period.
    const overall = computeStats(movies, {
      streakThreshold: movieGoal,
      tvStreakThreshold: tvGoal,
      thresholdHistory: steps,
      now,
    });
    if (!stats || !overall) return null;

    const shows = scoped.filter((m) => m.type === 'tv' && Object.keys(m.episodeWatchDates ?? {}).length > 0).length;
    const previous =
      range.year == null ? null : scopeMoviesToPeriod(movies, new Date(range.year - 1, 0, 1), new Date(range.year, 0, 1));
    const prevCount = previous ? (computeStats(previous)?.watchedCount ?? 0) : 0;
    const rated = stats.avgRating !== '0';
    const days = overall.currentStreak;

    const quick: QuickStat[] = [
      {
        label: 'Titles watched',
        value: String(stats.watchedCount),
        note: previous ? deltaNote(stats.watchedCount, prevCount, String((range.year ?? 0) - 1)) : null,
        good: !!previous && stats.watchedCount > prevCount,
      },
      { label: 'Hours', value: String(stats.totalHours), note: hoursPerWeekNote(stats.totalHours, periodDays(period, now)) },
      {
        label: 'Episodes',
        value: String(sumDaily(stats.dailyEpisodes)),
        note: shows > 0 ? `Across ${plural(shows, 'show')}` : null,
      },
      { label: 'Average rating', value: rated ? stats.avgRating : '-', note: rated ? 'Out of 5' : 'Nothing rated yet' },
      { label: 'Current streak', value: plural(days, 'day'), note: `Best: ${plural(overall.longestStreak, 'day')}` },
    ];

    const streaks = [
      {
        key: 'films',
        title: 'Films',
        note: `${plural(days, 'day')} streak · best ${overall.longestStreak}`,
        goal: `Goal · ${plural(movieGoal, 'film')} a week`,
        aria: 'Films watched each day over the last 53 weeks',
        unit: 'film',
        grid: buildStreakGrid(overall.dailyCompletions, { threshold: movieGoal, steps: steps.movie, unit: 'movie', now }),
      },
      {
        key: 'episodes',
        title: 'Episodes',
        note: `${plural(overall.currentTVStreak, 'day')} streak · best ${overall.longestTVStreak}`,
        goal: `Goal · ${plural(tvGoal, 'episode')} a week`,
        aria: 'Episodes watched each day over the last 53 weeks',
        unit: 'episode',
        grid: buildStreakGrid(overall.dailyEpisodes, { threshold: tvGoal, steps: steps.tv, unit: 'episode', now }),
      },
    ];

    return {
      stats,
      quick,
      streaks,
      mix: `${plural(stats.typeCounts.movie, 'film')} · ${plural(stats.typeCounts.tv, 'show')} · ${plural(rewatchCount(scoped), 'rewatch', 'rewatches')}`,
      averages: directorAverages(scoped),
      fame: selectHallOfFame(scoped),
    };
  }, [movies, period, today, movieGoal, tvGoal, steps]);

  const name = profile?.displayName || profile?.username || null;

  return {
    viewing,
    friendName: viewing ? name : null,
    joined: profile?.createdAt ?? null,
    period,
    setPeriod,
    options,
    loading,
    blocked,
    empty: !loading && !blocked && movies.length === 0,
    model,
    activity: viewing ? pubActivity.activities : ownActivity.activities,
    ownGoals: !viewing,
  };
}
