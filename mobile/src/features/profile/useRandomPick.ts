import { useMemo, useState } from 'react';

import { isInWatchlist } from '@/lib/movieStatus';
import { pickWinner } from '@/lib/randomPick';
import { MY_SERVICES_KEY, matchesServiceFilter } from '@/lib/serviceFilter';
import type { Movie } from '@/types/movie';

export type PickScope = 'services' | 'library';

// "Don't know what to watch?": a random watchlist title, either on the services you said you
// subscribe to or from the whole watchlist (the pools Radar's picker uses). No spin reel on the web.
export function useRandomPick(movies: Movie[], ownedServices: string[]) {
  const [scope, setScope] = useState<PickScope | null>(null);
  const [picked, setPicked] = useState<Movie | null>(null);

  const library = useMemo(() => movies.filter((m) => isInWatchlist(m)), [movies]);
  const onServices = useMemo(
    () => (ownedServices.length === 0 ? [] : library.filter((m) => matchesServiceFilter(m, [MY_SERVICES_KEY], ownedServices))),
    [library, ownedServices],
  );

  const poolFor = (s: PickScope) => (s === 'services' ? onServices : library);

  const draw = (s: PickScope) => {
    const pool = poolFor(s);
    // "Another" should not hand back the same title unless it is the only one.
    const others = pool.length > 1 && picked ? pool.filter((m) => m.id !== picked.id) : pool;
    setScope(s);
    setPicked(pickWinner(others));
  };

  return {
    picked,
    scope,
    pick: draw,
    again: () => scope && draw(scope),
    counts: { services: onServices.length, library: library.length },
    hasServices: ownedServices.length > 0,
  };
}
