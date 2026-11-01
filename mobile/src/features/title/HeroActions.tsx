import { Check, Plus, Trash2 } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { Pill } from '@/components/ui/Pill';
import { Text } from '@/components/ui/Text';
import { statusKeyOf } from '@/lib/titleStatus';
import { colors } from '@/theme/colors';
import type { MediaType } from '@/types/movie';

import { StatusMenu } from './StatusMenu';
import type { EpisodeTracker } from './useEpisodeTracker';
import type { useAddToLibrary } from './useAddToLibrary';
import type { TitleForm } from './useTitleForm';

type Props = {
  tmdbId: number;
  type: MediaType;
  owned: boolean;
  tf: TitleForm;
  tracker: EpisodeTracker;
  adder: ReturnType<typeof useAddToLibrary>;
  onRemove: () => void;
};

/** Primary action, status pill and remove: what changes with ownership and with film vs series. */
export function HeroActions({ tmdbId, type, owned, tf, tracker, adder, onRemove }: Props) {
  const form = tf.form;
  const busy = adder.pending === `${type}:${tmdbId}`;

  if (!owned || !form) {
    return (
      <View style={styles.wrap}>
        <View style={styles.row}>
          <Pill
            variant="primary"
            height={44}
            disabled={busy}
            icon={<Plus size={16} color={colors.onPrimary} />}
            label={busy ? 'Adding…' : 'Add to watchlist'}
            onPress={() => void adder.add(tmdbId, type)}
          />
        </View>
        {adder.error ? <Text accessibilityRole="alert" style={[styles.save, { color: colors.warn }]}>{adder.error}</Text> : null}
      </View>
    );
  }

  const isTv = form.type === 'tv';
  const watchAgain = () =>
    tf.commit((f) => ({ ...f, status: { ...f.status, timesWatched: (f.status.timesWatched || 1) + 1 } }));

  let primary: { label: string; run: () => void; disabled?: boolean };
  if (isTv) {
    primary = tracker.next
      ? { label: `Mark E${tracker.next} watched`, run: () => tf.toggleEpisode(tracker.season, tracker.next as number) }
      : { label: tracker.episodes.length ? 'Season complete' : 'Mark next episode', run: () => {}, disabled: true };
  } else {
    primary = form.status.watched
      ? { label: 'Log another watch', run: watchAgain }
      : { label: 'Mark watched', run: () => tf.setStatus('watched') };
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Pill
          variant="primary"
          height={44}
          label={primary.label}
          disabled={primary.disabled}
          onPress={primary.run}
          icon={<Check size={16} strokeWidth={2.2} color={colors.onPrimary} />}
        />
        <StatusMenu value={statusKeyOf(form.status)} isTv={isTv} onPick={tf.setStatus} />
        <Pressable accessibilityRole="button" accessibilityLabel="Remove from library" hitSlop={8} onPress={onRemove} style={styles.remove}>
          <Trash2 size={14} color={colors.muted} />
          <Text style={styles.removeLabel}>Remove</Text>
        </Pressable>
      </View>
      <View style={styles.saveRow} accessibilityLiveRegion="polite">
        {tf.saveState === 'saving' ? <Text style={styles.save}>Saving…</Text> : null}
        {tf.saveState === 'saved' ? <Text style={styles.save}>Saved</Text> : null}
        {tf.saveState === 'error' ? (
          <Text style={[styles.save, { color: colors.warn }]}>
            Could not save.{' '}
            <Text accessibilityRole="button" onPress={tf.retrySave} style={[styles.save, styles.retry]}>Retry</Text>
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 24 },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10 },
  remove: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 6, height: 44 },
  removeLabel: { fontSize: 12, color: colors.muted },
  saveRow: { minHeight: 16, marginTop: 10 },
  save: { fontSize: 12, color: colors.dim },
  retry: { color: colors.textBright, textDecorationLine: 'underline' },
});
