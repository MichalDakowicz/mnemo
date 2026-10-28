import { RatingCurveChart } from '@/components/ui/RatingCurveChart';
import { formatScore } from '@/lib/profileFormat';
import type { RatingCurve } from '@/lib/ratingCurve';

type Props = { curve: RatingCurve | null; rated: number; average: number | null };

/** How the period's titles were rated, as the same curve the Profile draws. */
export function RatingsBlock({ curve, rated, average }: Props) {
  return (
    <section className="block" aria-label="Ratings">
      <div className="block-head">
        <h2>Ratings</h2>
        <span>{rated === 0 ? 'Nothing rated yet' : `${rated} rated · avg ★ ${formatScore(average)}`}</span>
      </div>
      {curve ? <RatingCurveChart curve={curve} rated={rated} /> : <p className="stats-mix">Rate a title and the curve appears.</p>}
    </section>
  );
}
