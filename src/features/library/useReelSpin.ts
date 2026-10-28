import { useEffect, useRef, useState } from 'react';

import type { useReel } from '@/features/discover/useReel';
import { mod } from '@/lib/discoverReel';

/** However close the winner is, the reel travels at least this many posters, so the spin reads as a spin. */
const MIN_TRAVEL = 30;

/** Throws the reel so it coasts to rest on `winner` (index into its items); `landed` once it has stopped. */
export function useReelSpin(reel: ReturnType<typeof useReel>, count: number, winner: number, run: number) {
  const [started, setStarted] = useState(0);
  const live = useRef(reel);
  useEffect(() => {
    live.current = reel;
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const r = live.current;
      const delta = mod(winner - r.at(), count);
      r.launch(delta + count * Math.max(0, Math.ceil((MIN_TRAVEL - delta) / count)));
      setStarted(run);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [run, winner, count]);

  return { landed: started === run && !reel.moving };
}
