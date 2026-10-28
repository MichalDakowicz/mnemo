import { formatDate, formatMoney, formatRuntime, pickCrew, splitNames, yearOf } from './titleFacts';

describe('titleFacts', () => {
  it('picks crew by job, de-duplicated, case-insensitive', () => {
    const crew = [
      { id: 1, name: 'A', jobs: ['Writer', 'Director'], department: 'Writing' },
      { id: 2, name: 'B', jobs: ['Director'], department: 'Directing' },
      { id: 3, name: 'C', jobs: ['Editor'], department: 'Editing' },
    ];
    expect(pickCrew(crew, ['director'])).toEqual([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ]);
    expect(pickCrew(crew, ['Producer'])).toEqual([]);
  });

  it('formats runtime', () => {
    expect(formatRuntime(128)).toBe('2h 8m');
    expect(formatRuntime(46)).toBe('46m');
    expect(formatRuntime(120)).toBe('2h');
    expect(formatRuntime(0)).toBeNull();
  });

  it('formats money', () => {
    expect(formatMoney(165_000_000)).toBe('$165M');
    expect(formatMoney(2_500_000)).toBe('$2.5M');
    expect(formatMoney(1_200_000_000)).toBe('$1.2B');
    expect(formatMoney(0)).toBeNull();
  });

  it('formats dates and years', () => {
    expect(formatDate('2025-09-14')).toBe('14 Sep 2025');
    expect(formatDate('nope')).toBeNull();
    expect(formatDate(null)).toBeNull();
    expect(yearOf('2025-09-14')).toBe('2025');
    expect(yearOf(null)).toBe('');
  });

  it('splits names', () => {
    expect(splitNames(['a', 'b', 'c'])).toEqual({ head: 'a, b', tail: 'c' });
    expect(splitNames(['a', 'b', 'c', 'd', 'e'])).toEqual({ head: 'a, b', tail: '3 more' });
    expect(splitNames([])).toEqual({ head: '', tail: '' });
  });
});
