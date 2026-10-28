import { episodeLabel, formatScore } from '@/lib/profileFormat';

describe('profileFormat', () => {
  it('formats scores', () => {
    expect(formatScore(4.5)).toBe('4.5');
    expect(formatScore(4)).toBe('4');
    expect(formatScore(3.9499)).toBe('3.9');
    expect(formatScore(null)).toBe('-');
    expect(formatScore(0)).toBe('-');
  });

  it('labels the next episode', () => {
    expect(episodeLabel([2, 5])).toBe('S2 E5');
    expect(episodeLabel(null)).toBeNull();
  });
});
