import { Link } from 'react-router-dom';

import { StreakCalendar } from './StreakCalendar';
import type { useStatsPage } from './useStatsPage';

type Model = NonNullable<ReturnType<typeof useStatsPage>['model']>;

export function StreakSection({ streaks, ownGoals }: { streaks: Model['streaks']; ownGoals: boolean }) {
  return (
    <section className="streaks" aria-label="Streaks">
      <div className="streak-grid">
        {streaks.map(({ key, ...s }) => (
          <StreakCalendar key={key} {...s} />
        ))}
      </div>
      <p className="legend">
        Less
        <i style={{ background: '#ffffff0f' }} />
        <i style={{ background: '#ece9e44d' }} />
        <i style={{ background: '#ece9e499' }} />
        <i style={{ background: '#ece9e4' }} />
        More
        <i style={{ marginLeft: 14, background: 'var(--good)' }} />
        Busy day in a week that met the goal
        {ownGoals ? (
          <>
            {' · goals live in '}
            <Link className="text-button" to="/settings">
              Settings
            </Link>
          </>
        ) : (
          ' · default goals, theirs are private'
        )}
      </p>
    </section>
  );
}
