import { Alert } from 'react-native';

import { useToast } from '@/components/ui/Toast';
import { isInProgress, isWatched } from '@/lib/movieStatus';

import { useQuickAdd, type CardTarget } from './useQuickAdd';

/** Resolves true when the viewer confirms removing a title that carries history. */
function confirmRemove(title: string): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      `Remove ${title}?`,
      'Its watch history and ratings go with it.',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Remove', style: 'destructive', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}

/** Add or remove from any Discover card, with a short status line (shown as a toast). */
export function useCardActions(country: string) {
  const quick = useQuickAdd(country);
  const toast = useToast();

  const toggle = async (target: CardTarget) => {
    if (quick.isPending(target)) return;
    try {
      const owned = quick.find(target);
      if (!owned) {
        await quick.add(target);
        toast.show(`Added ${target.title} to your watchlist`);
        return;
      }
      // Radar removes straight away. A title you have watched or rated carries history,
      // so that one is confirmed first.
      const hasHistory = isWatched(owned) || isInProgress(owned) || (owned.ratings.overall ?? 0) > 0;
      if (hasHistory && !(await confirmRemove(owned.title))) return;
      await quick.remove(target);
      toast.show(`Removed ${target.title} from your library`);
    } catch {
      toast.show('Could not update your library. Try again.');
    }
  };

  return { ...quick, country, toggle };
}

export type CardActions = ReturnType<typeof useCardActions>;
