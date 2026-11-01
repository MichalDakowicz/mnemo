import { decadeHeight, deltaNote, directorAverages, hoursPerWeekNote, periodDays, periodOptions, resolvePeriod, statusLabel } from '@/lib/statsView';
import type { Movie } from '@/types/movie';

const NOW = new Date(2026, 9, 28);

describe('statsView', () => {
  it('offers this year, last year and all time', () => {
    const keys = periodOptions(NOW).map((p) => p.key);
    expect(keys).toEqual(['y2026', 'y2025', '30d', '90d', 'all']);
  });

  it('bounds a calendar year half-open', () => {
    const p = resolvePeriod('y2025', NOW);
    expect(p.start).toEqual(new Date(2025, 0, 1));
    expect(p.end).toEqual(new Date(2026, 0, 1));
    expect(resolvePeriod('all', NOW)).toEqual({ start: null, end: null, year: null });
  });

  it('counts days of a finished and a running year', () => {
    expect(periodDays('y2025', NOW)).toBe(365);
    expect(periodDays('y2026', NOW)).toBe(300);
    expect(periodDays('all', NOW)).toBeNull();
  });

  it('words the weekly pace and the delta', () => {
    expect(hoursPerWeekNote(212, 300)).toBe('About 5 h a week');
    expect(hoursPerWeekNote(0, 30)).toBeNull();
    expect(deltaNote(64, 52, '2025')).toBe('+12 on 2025');
    expect(deltaNote(3, 5, '2025')).toBe('2 fewer than 2025');
    expect(deltaNote(0, 0, '2025')).toBeNull();
  });

  it('relabels Completed and floors decade bars', () => {
    expect(statusLabel('Completed')).toBe('Watched');
    expect(statusLabel('Watching')).toBe('Watching');
    expect(decadeHeight(1, 100)).toBe(4);
    expect(decadeHeight(50, 50)).toBe(82);
  });

  it('averages your score per director, ignoring unrated titles', () => {
    const m = (score: number | undefined, name: string) =>
      ({ director: [{ name }], ratings: score ? { overall: score } : {} }) as unknown as Movie;
    const avg = directorAverages([m(5, 'A'), m(4, 'A'), m(undefined, 'A'), m(undefined, 'B')]);
    expect(avg.get('A')).toBe(4.5);
    expect(avg.has('B')).toBe(false);
  });
});
