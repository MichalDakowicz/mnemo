import { discoverMeta } from './discoverCardMeta';

describe('discoverMeta', () => {
  it('joins year, first genre and kind', () => {
    expect(discoverMeta({ type: 'movie', releaseDate: '2024-05-01', genres: ['Drama', 'Crime'] })).toBe('2024 · Drama · Film');
  });
  it('skips what is missing', () => {
    expect(discoverMeta({ type: 'tv', releaseDate: null, genres: [] })).toBe('Series');
  });
});
