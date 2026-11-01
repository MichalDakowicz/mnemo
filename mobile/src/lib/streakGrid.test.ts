import { buildStreakGrid, dayLevel } from './streakGrid';

const NOW = new Date(2026, 9, 28, 12); // Wed 28 Oct 2026

describe('dayLevel', () => {
  it('scales films and episodes differently', () => {
    expect(dayLevel(0, 'movie')).toBe(0);
    expect(dayLevel(1, 'movie')).toBe(1);
    expect(dayLevel(2, 'movie')).toBe(2);
    expect(dayLevel(3, 'movie')).toBe(3);
    expect(dayLevel(2, 'episode')).toBe(1);
    expect(dayLevel(5, 'episode')).toBe(3);
  });
});

describe('buildStreakGrid', () => {
  it('returns 53 weeks of 7 days ending in the current week', () => {
    const grid = buildStreakGrid({}, { threshold: 2, unit: 'movie', now: NOW });
    expect(grid.weeks).toHaveLength(53);
    expect(grid.weeks.every((w) => w.length === 7)).toBe(true);
    const last = grid.weeks[52];
    expect(last[0].key).toBe('2026-10-26');
    expect(last[2].key).toBe('2026-10-28');
    expect(last[3].future).toBe(true);
    expect(last[2].future).toBe(false);
    expect(grid.lastLabel).toBe('Oct 2026');
  });

  it('marks busy days in goal-met weeks only', () => {
    const met = buildStreakGrid({ '2026-10-26': 3, '2026-10-27': 1 }, { threshold: 2, unit: 'movie', now: NOW });
    expect(met.weeks[52][0]).toMatchObject({ level: 3, goalMet: true });
    const missed = buildStreakGrid({ '2026-10-26': 3 }, { threshold: 5, unit: 'movie', now: NOW });
    expect(missed.weeks[52][0]).toMatchObject({ level: 3, goalMet: false });
  });

  it('measures older weeks against threshold history', () => {
    const steps = [{ before: '2026-10-26', threshold: 1 }];
    const grid = buildStreakGrid({ '2026-10-19': 3 }, { threshold: 9, steps, unit: 'movie', now: NOW });
    expect(grid.weeks[51][0].goalMet).toBe(true);
  });
});
