import { latestByUser, sortFriendsByActivity } from './friendSort';

const f = (id: string, username: string, displayName: string | null = null) => ({ id, username, displayName });

describe('sortFriendsByActivity', () => {
  it('puts recent activity first and the quiet ones alphabetically after', () => {
    const latest = new Map([['b', '2026-01-02T00:00:00Z'], ['c', '2026-01-03T00:00:00Z']]);
    const sorted = sortFriendsByActivity([f('a', 'zed'), f('b', 'bob'), f('c', 'cat'), f('d', 'amy')], latest);
    expect(sorted.map((x) => x.id)).toEqual(['c', 'b', 'd', 'a']);
  });
});

describe('latestByUser', () => {
  it('keeps the newest stamp per user', () => {
    const map = latestByUser([
      { userId: 'a', createdAt: '2026-01-01T00:00:00Z' },
      { userId: 'a', createdAt: '2026-01-05T00:00:00Z' },
    ]);
    expect(map.get('a')).toBe('2026-01-05T00:00:00Z');
  });
});
