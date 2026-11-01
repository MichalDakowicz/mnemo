import { Link } from 'expo-router';

import { EmptyState } from '@/components/ui/EmptyState';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';

import { ActivityBlock } from './ActivityBlock';
import { DecadesBlock } from './DecadesBlock';
import { DirectorsBlock } from './DirectorsBlock';
import { GenresBlock } from './GenresBlock';
import { HallOfFame } from './HallOfFame';
import { QuickStats } from './QuickStats';
import { RatingsBlock } from './RatingsBlock';
import { StatusBlock } from './StatusBlock';
import { StreakSection } from './StreakSection';
import type { useStatsPage } from './useStatsPage';

/** Loading, private, empty and full states of the Stats page, in the web's block order. */
export function StatsBody({ s }: { s: ReturnType<typeof useStatsPage> }) {
  if (s.loading) return <EmptyState body="Loading stats..." />;
  if (s.blocked) return <EmptyState body="This shelf is private, so there are no stats to show." />;
  if (s.empty) {
    return (
      <>
        <EmptyState body="Nothing logged yet. Your stats start here." />
        <FindSomething />
      </>
    );
  }
  if (!s.model) return <EmptyState body="Nothing finished in this period yet." />;
  const { stats, quick, streaks, mix, averages, fame, ratings } = s.model;
  return (
    <>
      <QuickStats items={quick} />
      <StreakSection streaks={streaks} ownGoals={s.ownGoals} />
      <StatusBlock rows={stats.sortedStatus} total={stats.totalMovies} mix={mix} />
      <GenresBlock genres={stats.topGenres} />
      <RatingsBlock curve={ratings.curve} rated={ratings.rated} average={ratings.average} />
      <DecadesBlock decades={stats.sortedDecades} />
      <DirectorsBlock directors={stats.topDirectors} averages={averages} />
      <HallOfFame titles={fame} />
      <ActivityBlock events={s.activity} />
    </>
  );
}

export function FindSomething() {
  return (
    <Link href="/discover" style={{ alignSelf: 'center', paddingVertical: 8 }}>
      <Text style={{ fontSize: 13, color: colors.text, textDecorationLine: 'underline' }}>Find something to watch</Text>
    </Link>
  );
}
