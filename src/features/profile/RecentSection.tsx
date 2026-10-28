import { TitleCard } from '@/features/stats/TitleCard';
import { personalScore } from '@/lib/personalScore';
import { formatScore } from '@/lib/profileFormat';
import { whenLabel } from '@/lib/statsSummary';
import type { Movie } from '@/types/movie';

export function RecentSection({ recent }: { recent: Movie[] }) {
  return (
    <section aria-labelledby="h-recent">
      <div className="sect-head">
        <h2 id="h-recent">Recently logged</h2>
        {recent.length > 0 ? <span className="note">Last {recent.length}</span> : null}
      </div>
      {recent.length === 0 ? (
        <p className="note">Nothing finished yet. Titles you complete land here.</p>
      ) : (
        <div className="strip">
          {recent.map((m) => (
            <TitleCard
              key={m.id}
              title={m.title}
              coverUrl={m.coverUrl}
              to={m.tmdbId != null ? `/title/${m.type}/${m.tmdbId}` : null}
              meta={
                <>
                  <span className="mono">{formatScore(personalScore(m.ratings))}</span> · {whenLabel(m.completedAt || m.updatedAt)}
                </>
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
