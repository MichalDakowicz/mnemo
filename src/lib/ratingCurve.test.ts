import { ratingCurve } from '@/lib/ratingCurve';
import type { RatingPoint } from '@/lib/ratingDistribution';

const pt = (value: number, density: number): RatingPoint => ({ value, count: 0, density });

describe('ratingCurve', () => {
  it('is null with nothing rated', () => {
    expect(ratingCurve([pt(1, 0), pt(2, 0)])).toBeNull();
    expect(ratingCurve([])).toBeNull();
  });

  it('closes the area along the baseline', () => {
    const curve = ratingCurve([pt(1, 0), pt(2, 4), pt(3, 0)]);
    expect(curve?.line.startsWith('M 0 87')).toBe(true);
    expect(curve?.area.endsWith('L 400 87 L 0 87 Z')).toBe(true);
  });
});
