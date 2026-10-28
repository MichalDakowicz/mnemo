import { useId } from 'react';

import { CURVE_HEIGHT, CURVE_WIDTH, type RatingCurve } from '@/lib/ratingCurve';

import './ratingCurveChart.css';

type Props = { curve: RatingCurve; rated: number; label?: string };

/** The shape of how titles are rated, 0 to 5 stars, drawn as a smooth curve (lib/ratingDistribution): one star under its left end, five under its right. */
export function RatingCurveChart({ curve, rated, label }: Props) {
  const gradient = useId();
  return (
    <div className="rating-curve" role="img" aria-label={label ?? `How ${rated} ratings spread from 0 to 5 stars`}>
      <svg viewBox={`0 0 ${CURVE_WIDTH} ${CURVE_HEIGHT}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ece9e4" stopOpacity=".16" />
            <stop offset="1" stopColor="#ece9e4" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={curve.area} fill={`url(#${gradient})`} />
        <path d={curve.line} fill="none" stroke="#ece9e4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="rating-curve-axis" aria-hidden="true">
        <span>★</span>
        <span>★★★★★</span>
      </div>
    </div>
  );
}
