import { buildDigests, commonLabel, digestStat, type DigestRow } from './friendDigest';

function row(over: Partial<DigestRow>): DigestRow {
  return {
    user_id: 'u1',
    tmdb_id: 1,
    type: 'movie',
    title: 'A',
    cover_url: null,
    watched: true,
    completed_at: '2026-01-01T00:00:00Z',
    added_at: '2025-01-01T00:00:00Z',
    ratings: null,
    ...over,
  };
}

describe('buildDigests', () => {
  it('counts watched, averages scores and finds shared titles', () => {
    const rows = [
      row({ tmdb_id: 1, ratings: { overall: 4 } }),
      row({ tmdb_id: 2, title: 'B', ratings: { overall: 3 } }),
      row({ tmdb_id: 3, title: 'C', watched: false }),
    ];
    const digest = buildDigests(rows, new Set(['movie:1', 'movie:3'])).get('u1')!;
    expect(digest.watched).toBe(2);
    expect(digest.average).toBe(3.5);
    expect(digest.common).toBe(2);
  });

  it('has no average when nothing is rated', () => {
    expect(buildDigests([row({})], new Set()).get('u1')!.average).toBeNull();
  });

  it('puts the newest finished titles first and caps the minis', () => {
    const rows = [
      row({ tmdb_id: 1, title: 'Old', completed_at: '2020-01-01T00:00:00Z' }),
      row({ tmdb_id: 2, title: 'New', completed_at: '2026-01-01T00:00:00Z' }),
      row({ tmdb_id: 3, title: 'Queued', watched: false }),
    ];
    const minis = buildDigests(rows, new Set(), 2).get('u1')!.minis;
    expect(minis.map((m) => m.title)).toEqual(['New', 'Old']);
  });

  it('keeps friends apart', () => {
    const map = buildDigests([row({}), row({ user_id: 'u2' })], new Set());
    expect(map.size).toBe(2);
  });
});

describe('labels', () => {
  it('formats the stat line', () => {
    expect(digestStat({ userId: 'u', watched: 12, average: 3.84, common: 0, minis: [] })).toBe('12 watched · avg ★ 3.8');
    expect(digestStat({ userId: 'u', watched: 0, average: null, common: 0, minis: [] })).toBe('0 watched');
  });
  it('pluralises in common', () => {
    expect(commonLabel(1)).toBe('1 in common');
    expect(commonLabel(0)).toBe('0 in common');
  });
});
