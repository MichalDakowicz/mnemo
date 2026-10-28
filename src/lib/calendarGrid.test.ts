import { dayKey, defaultDay, longDayLabel, monthCells, monthPrefix, monthsBetween, shiftMonth } from './calendarGrid';

describe('calendarGrid', () => {
  it('shifts months across years', () => {
    expect(shiftMonth({ year: 2026, month: 10 }, 3)).toEqual({ year: 2027, month: 1 });
    expect(shiftMonth({ year: 2026, month: 0 }, -1)).toEqual({ year: 2025, month: 11 });
    expect(monthsBetween({ year: 2026, month: 9 }, { year: 2027, month: 0 })).toBe(3);
  });

  it('pads to Monday-first weeks', () => {
    // 1 Oct 2026 is a Thursday -> three blanks.
    const cells = monthCells({ year: 2026, month: 9 });
    expect(cells.slice(0, 4)).toEqual([null, null, null, 1]);
    expect(cells.length % 7).toBe(0);
    expect(cells.filter((c) => c !== null)).toHaveLength(31);
  });

  it('builds keys and labels', () => {
    expect(monthPrefix({ year: 2026, month: 0 })).toBe('2026-01');
    expect(dayKey({ year: 2026, month: 9 }, 5)).toBe('2026-10-05');
    expect(longDayLabel('2026-10-28')).toBe('Wednesday, 28 October');
  });

  it('picks the default day', () => {
    const keys = ['2026-10-10', '2026-10-30', '2026-11-02'];
    expect(defaultDay(null, keys, '2026-10', '2026-10-28')).toBe('2026-10-30');
    expect(defaultDay('2026-10-10', keys, '2026-10', '2026-10-28')).toBe('2026-10-10');
    expect(defaultDay('2026-09-01', keys, '2026-10', '2026-11-20')).toBe('2026-10-10');
    expect(defaultDay(null, [], '2026-10', '2026-10-28')).toBeNull();
  });
});
