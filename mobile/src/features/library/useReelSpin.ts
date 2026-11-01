import { useEffect, useState } from 'react';
import { cancelAnimation, Easing, runOnJS, useSharedValue, withTiming } from 'react-native-reanimated';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { mod } from '@/lib/discoverReel';

/** However close the winner is, the reel travels at least this many posters, so the spin reads as a spin. */
const MIN_TRAVEL = 30;
const SPIN_MS = 3400;

/**
 * Throws the coverflow so it coasts to rest on `winner` (index into its items). `pos` is the continuous
 * index under the centre; `landed` once it has stopped. Reduced motion skips the travel.
 */
export function useReelSpin(count: number, winner: number, run: number) {
  const pos = useSharedValue(0);
  const reduced = usePrefersReducedMotion();
  const [landedRun, setLanded] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (reduced) {
        pos.value = winner;
        setLanded(run);
        return;
      }
      const delta = mod(winner - pos.value, count);
      const target = pos.value + delta + count * Math.max(0, Math.ceil((MIN_TRAVEL - delta) / count));
      pos.value = withTiming(target, { duration: SPIN_MS, easing: Easing.out(Easing.cubic) }, (finished) => {
        if (finished) runOnJS(setLanded)(run);
      });
    }, 350);
    return () => {
      clearTimeout(timer);
      cancelAnimation(pos);
    };
  }, [run, winner, count, reduced, pos]);

  return { pos, landed: landedRun === run };
}
