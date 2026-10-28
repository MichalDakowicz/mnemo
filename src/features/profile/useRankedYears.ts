import { useMemo, useState } from 'react';

import { personalScore } from '@/lib/personalScore';
import { rankedYears, type RankedYear } from '@/lib/rankedYears';
import type { Movie } from '@/types/movie';

// Your library re-cut as one ranking per release year; `selected` is the year the card shows
// (newest by default).
export function useRankedYears(movies: Movie[]) {
  const years = useMemo<RankedYear[]>(() => rankedYears(movies, (m) => personalScore(m.ratings)), [movies]);
  const [year, setYear] = useState<number | null>(null);
  const selected = years.find((y) => y.year === year) ?? years[0] ?? null;
  return { years, selected, select: setYear };
}
