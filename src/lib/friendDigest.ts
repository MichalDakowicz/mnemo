// What a friend card shows about a shelf without opening it: how much they have
// watched, their average score, how many titles you share, and a few posters.
// Pure over the minimal columns the friends page selects, so it is testable
// without a network.

import { personalScore } from '@/lib/personalScore';
import { titleKey } from '@/lib/compareTaste';
import type { MediaType, Ratings } from '@/types/movie';

export type DigestRow = {
  user_id: string;
  tmdb_id: number | null;
  type: MediaType;
  title: string;
  cover_url: string | null;
  watched: boolean;
  completed_at: string | null;
  added_at: string;
  ratings: Ratings | null;
};

export type DigestMini = { title: string; coverUrl: string | null };

export type FriendDigest = {
  userId: string;
  watched: number;
  average: number | null;
  /** Titles on both shelves, whatever their status. */
  common: number;
  minis: DigestMini[];
};

function stamp(row: DigestRow): number {
  const parsed = Date.parse(row.completed_at || row.added_at || '');
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function buildDigests(rows: DigestRow[], myKeys: Set<string>, miniCount = 4): Map<string, FriendDigest> {
  const byUser = new Map<string, DigestRow[]>();
  for (const row of rows) {
    const list = byUser.get(row.user_id);
    if (list) list.push(row);
    else byUser.set(row.user_id, [row]);
  }

  const out = new Map<string, FriendDigest>();
  for (const [userId, list] of byUser) {
    let watched = 0;
    let common = 0;
    let total = 0;
    let scored = 0;
    for (const row of list) {
      if (row.watched) watched += 1;
      if (myKeys.has(titleKey(row.tmdb_id, row.type, row.title))) common += 1;
      const score = personalScore(row.ratings);
      if (score != null && score > 0) {
        total += score;
        scored += 1;
      }
    }
    // Finished titles lead; a shelf with nothing finished still shows what is on it.
    const ranked = [...list].sort((a, b) => Number(b.watched) - Number(a.watched) || stamp(b) - stamp(a));
    out.set(userId, {
      userId,
      watched,
      average: scored === 0 ? null : Math.round((total / scored) * 10) / 10,
      common,
      minis: ranked.slice(0, miniCount).map((row) => ({ title: row.title, coverUrl: row.cover_url })),
    });
  }
  return out;
}

export function digestStat(digest: FriendDigest | undefined): string {
  if (!digest) return '';
  const parts = [`${digest.watched} watched`];
  if (digest.average != null) parts.push(`avg ★ ${digest.average.toFixed(1)}`);
  return parts.join(' · ');
}

export function commonLabel(common: number): string {
  return common === 1 ? '1 in common' : `${common} in common`;
}
