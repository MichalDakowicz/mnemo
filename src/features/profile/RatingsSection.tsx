import { CURVE_HEIGHT, CURVE_WIDTH, type RatingCurve } from '@/lib/ratingCurve';
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
      {curve ? (
        <div className="curve" role="img" aria-label={`How your ${rated} ratings spread from 0 to 5 stars`}>
          <span>★</span>
          <svg viewBox={`0 0 ${CURVE_WIDTH} ${CURVE_HEIGHT}`} preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ece9e4" stopOpacity=".16" />
                <stop offset="1" stopColor="#ece9e4" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={curve.area} fill="url(#curveFill)" />
            <path d={curve.line} fill="none" stroke="#ece9e4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </svg>
          <span style={{ letterSpacing: '.08em' }}>★★★★★</span>
        </div>
      ) : (
        <p className="note">Rate a title and the curve appears.</p>
      )}
    </section>
  );
}
