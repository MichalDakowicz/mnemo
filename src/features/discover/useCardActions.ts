import { useCallback, useEffect, useRef, useState } from 'react';

import { isInProgress, isWatched } from '@/lib/movieStatus';

import { useQuickAdd, type CardTarget } from './useQuickAdd';

/** Add or remove from any Discover card, with a short status line (the page shows it as a toast). */
export function useCardActions(country: string) {
  const quick = useQuickAdd(country);
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const say = useCallback((text: string) => {
    setMessage(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), 2800);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);

  const toggle = async (target: CardTarget) => {
    if (quick.isPending(target)) return;
    try {
      const owned = quick.find(target);
      if (!owned) {
        await quick.add(target);
        say(`Added ${target.title} to your watchlist`);
        return;
      }
      // Radar removes straight away. A title you have watched or rated carries history,
      // so that one is confirmed first.
      const hasHistory = isWatched(owned) || isInProgress(owned) || (owned.ratings.overall ?? 0) > 0;
      if (hasHistory && !window.confirm(`Remove ${owned.title} from your library? Its watch history and ratings go with it.`)) return;
      await quick.remove(target);
      say(`Removed ${target.title} from your library`);
    } catch {
      say('Could not update your library. Try again.');
    }
  };

  return { ...quick, country, toggle, message };
}

export type CardActions = ReturnType<typeof useCardActions>;
