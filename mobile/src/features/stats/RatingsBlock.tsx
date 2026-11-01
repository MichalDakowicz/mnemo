import { formatScore } from '@/lib/profileFormat';
import type { RatingCurve } from '@/lib/ratingCurve';

import { RatingCurveChart } from './RatingCurveChart';
import { StatsBlock, StatsNote } from './StatsBlock';

type Props = { curve: RatingCurve | null; rated: number; average: number | null };

/** How the period's titles were rated, as the same curve the Profile draws. */
export function RatingsBlock({ curve, rated, average }: Props) {
  return (
    <StatsBlock title="Ratings" meta={rated === 0 ? 'Nothing rated yet' : `${rated} rated · avg ★ ${formatScore(average)}`}>
      {curve ? <RatingCurveChart curve={curve} rated={rated} /> : <StatsNote>Rate a title and the curve appears.</StatsNote>}
    </StatsBlock>
  );
}
