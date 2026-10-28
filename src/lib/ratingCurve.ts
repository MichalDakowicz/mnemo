// Turns ratingDistribution() into the two SVG paths the Profile ratings curve draws (400 x 88 box).

import { smoothPath } from '@/lib/curvePath';
import type { RatingPoint } from '@/lib/ratingDistribution';

export const CURVE_WIDTH = 400;
export const CURVE_HEIGHT = 88;
const BASE = CURVE_HEIGHT - 1;
const PEAK = 82;

export type RatingCurve = { line: string; area: string };

export function ratingCurve(points: RatingPoint[]): RatingCurve | null {
  if (points.length < 2) return null;
  const max = Math.max(...points.map((p) => p.density));
  if (max <= 0) return null;
  const last = points.length - 1;
  const xy = points.map((p, i) => ({ x: (i / last) * CURVE_WIDTH, y: BASE - (p.density / max) * PEAK }));
  const line = smoothPath(xy, [BASE - PEAK, BASE]);
  return { line, area: `${line} L ${CURVE_WIDTH} ${BASE} L 0 ${BASE} Z` };
}
