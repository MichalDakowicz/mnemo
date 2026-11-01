import { useCallback, useState } from 'react';

import type { Movie } from '@/types/movie';

/** Posters on the reel: enough to look full, few enough to stay cheap for a big library. */
const REEL_SIZE = 24;

type Spin = { items: Movie[]; winner: number; run: number };

/** A shuffled slice of the pool for the reel, plus which of them it will land on. */
export function useRandomPick(pool: Movie[]) {
  const [spin, setSpin] = useState<Spin | null>(null);

  const pick = useCallback(() => {
    if (pool.length === 0) return;
    const items = [...pool].sort(() => Math.random() - 0.5).slice(0, REEL_SIZE);
    setSpin((prev) => {
      // "Another" avoids landing on the title that was just picked when it can.
      const last = prev ? prev.items[prev.winner].id : null;
      const choices = items.map((_, i) => i).filter((i) => items.length < 2 || items[i].id !== last);
      return { items, winner: choices[Math.floor(Math.random() * choices.length)], run: (prev?.run ?? 0) + 1 };
    });
  }, [pool]);

  return { spin, pick, close: () => setSpin(null), empty: pool.length === 0 };
}
