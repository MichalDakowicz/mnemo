import { Link } from 'react-router-dom';

import { ActivityBlock } from '@/features/stats/ActivityBlock';
import { DecadesBlock } from '@/features/stats/DecadesBlock';
import { DirectorsBlock } from '@/features/stats/DirectorsBlock';
import { GenresBlock } from '@/features/stats/GenresBlock';
import { HallOfFame } from '@/features/stats/HallOfFame';
import { RatingsBlock } from '@/features/stats/RatingsBlock';
import { QuickStats } from '@/features/stats/QuickStats';
import { StatsHeader } from '@/features/stats/StatsHeader';
import { StatusBlock } from '@/features/stats/StatusBlock';
import { StreakSection } from '@/features/stats/StreakSection';
import { useStatsPage } from '@/features/stats/useStatsPage';
import { periodPhrase } from '@/lib/statsView';
import '@/features/stats/stats.css';

function joinedLabel(iso: string | null): string {
  const d = iso ? new Date(iso) : null;
  return d && !Number.isNaN(d.getTime()) ? ` · ${d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : '';
}

export function StatsPage() {
  const s = useStatsPage();
  const who = s.friendName ? `${s.friendName}'s stats` : null;
  const sub =
    s.period === 'all'
      ? `${s.viewing ? 'Everything they logged' : 'Everything since you joined'}${joinedLabel(s.joined)}`
      : `${s.viewing ? 'Everything they finished' : 'Everything you finished'} ${periodPhrase(s.period, s.options.find((o) => o.key === s.period)?.label ?? '')}`;

  let body;
  if (s.loading) body = <p className="empty">Loading stats...</p>;
  else if (s.blocked) body = <p className="empty">This shelf is private, so there are no stats to show.</p>;
  else if (s.empty) {
    body = (
      <p className="empty">
        Nothing logged yet. <Link to="/discover">Find something to watch</Link> and your stats start here.
      </p>
    );
  } else if (!s.model) body = <p className="empty">Nothing finished in this period yet.</p>;
  else {
    const { stats, quick, streaks, mix, averages, fame, ratings } = s.model;
    body = (
      <>
        <QuickStats items={quick} />
        <StreakSection streaks={streaks} ownGoals={s.ownGoals} />
        <div className="stats-cols">
          <StatusBlock rows={stats.sortedStatus} total={stats.totalMovies} mix={mix} />
          <GenresBlock genres={stats.topGenres} />
          <RatingsBlock curve={ratings.curve} rated={ratings.rated} average={ratings.average} />
          <DecadesBlock decades={stats.sortedDecades} />
          <DirectorsBlock directors={stats.topDirectors} averages={averages} />
        </div>
        <div className="stats-section">
          <HallOfFame titles={fame} />
        </div>
        <ActivityBlock events={s.activity} />
      </>
    );
  }

  return (
    <div className="stats-page">
      {s.viewing && who ? <p className="stats-sub" style={{ margin: '0 0 8px' }}>{who}</p> : null}
      <StatsHeader sub={sub} options={s.options} period={s.period} onPeriod={s.setPeriod} />
      {body}
    </div>
  );
}
