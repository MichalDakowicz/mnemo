import { RatingCurveChart } from '@/components/ui/RatingCurveChart';
import type { RatingCurve } from '@/lib/ratingCurve';
import { formatScore } from '@/lib/profileFormat';

type Props = { rated: number; average: number | null; curve: RatingCurve | null };

export function RatingsSection({ rated, average, curve }: Props) {
  const note = rated === 0 ? 'Nothing rated yet' : `${rated} rated · avg ★ ${formatScore(average)}`;
  return (
    <section aria-labelledby="h-ratings">
      <div className="sect-head" style={{ marginBottom: 18 }}>
        <h2 id="h-ratings">Ratings</h2>
        <span className="note">{note}</span>
      </div>
      {curve ? <RatingCurveChart curve={curve} rated={rated} label={`How your ${rated} ratings spread from 0 to 5 stars`} /> : <p className="note">Rate a title and the curve appears.</p>}
    </section>
  );
}
