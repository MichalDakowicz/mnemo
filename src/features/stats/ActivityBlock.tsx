import { activityVerb } from '@/lib/activityLabel';
import { whenLabel } from '@/lib/statsSummary';
import type { ActivityEvent } from '@/types/movie';

// Radar's "Recent activity" rail. The artboard has no history block, so this is a plain list.
export function ActivityBlock({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) return null;
  return (
    <section className="block stats-section" aria-label="Recent activity">
      <div className="block-head">
        <h2>Recent activity</h2>
      </div>
      <ul className="activity">
        {events.map((e) => (
          <li key={e.id}>
            <span className="what">
              {activityVerb(e)} <b>{e.movieTitle}</b>
            </span>
            <time dateTime={e.createdAt}>{whenLabel(e.createdAt)}</time>
          </li>
        ))}
      </ul>
    </section>
  );
}
