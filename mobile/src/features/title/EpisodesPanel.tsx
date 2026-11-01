import { CheckCheck, ChevronDown, Eraser, RotateCcw } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { Text } from '@/components/ui/Text';
import type { SeasonInfo } from '@/lib/tmdbExtra';
import { colors } from '@/theme/colors';

import { Collapse } from './Collapse';
import { ConfirmDialog } from './ConfirmDialog';
import { EpisodeRow } from './EpisodeRow';
import type { EpisodeTracker } from './useEpisodeTracker';
import type { TitleForm } from './useTitleForm';

type Props = { tracker: EpisodeTracker; seasonCount: number; seasons: SeasonInfo[]; tf: TitleForm | null };

function Bar({ pct }: { pct: number }) {
  return (
    <View style={styles.bar}>
      <View style={[styles.barFill, { width: `${pct}%` }]} />
    </View>
  );
}

function Action({ label, icon, onPress }: { label: string; icon: ReactNode; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} hitSlop={8} onPress={onPress} style={styles.act}>
      {icon}
      <Text style={styles.actLabel}>{label}</Text>
    </Pressable>
  );
}

/** Season chips, progress bar and the episode checklist (episode_watch_dates is the source of truth). */
export function EpisodesPanel({ tracker: t, seasonCount, seasons, tf }: Props) {
  const [confirmRewatch, setConfirmRewatch] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [folded, setFolded] = useState(false);
  const numbers = t.episodes.map((e) => e.episode_number);
  const complete = t.progress.total > 0 && t.progress.watched === t.progress.total;
  const chips = Array.from({ length: Math.max(1, seasonCount) }, (_, i) => i + 1);
  // Whole-series progress, shown in the header while the card is folded.
  const total = chips.reduce((sum, n) => sum + (seasons.find((x) => x.number === n)?.episodeCount ?? 0), 0);
  const watchedAll = tf ? chips.reduce((sum, n) => sum + t.watchedIn(n), 0) : null;

  return (
    <View style={[styles.card, folded && { paddingBottom: 12 }]}>
      <View style={styles.head}>
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: !folded }} hitSlop={8} onPress={() => setFolded((f) => !f)} style={styles.fold}>
          <Text tracking={-0.01} style={styles.title}>Episodes</Text>
          <ChevronDown size={14} color={colors.text} style={folded ? undefined : styles.flip} />
        </Pressable>
        {folded ? (
          <View style={styles.headProg} accessibilityLabel="Progress across all seasons">
            <Text style={styles.prog}>{watchedAll !== null ? `${watchedAll} / ${total} watched` : `${total} episodes`}</Text>
            {watchedAll !== null ? <Bar pct={total ? (watchedAll / total) * 100 : 0} /> : null}
          </View>
        ) : null}
      </View>

      <Collapse open={!folded}>
        <View style={styles.body}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            {chips.map((n) => {
              const count = seasons.find((s) => s.number === n)?.episodeCount;
              return (
                <Chip
                  key={n}
                  label={`Season ${n}`}
                  count={count ? `${tf ? `${t.watchedIn(n)}/` : ''}${count}` : undefined}
                  active={t.season === n}
                  onPress={() => t.setSeason(n)}
                />
              );
            })}
          </ScrollView>
          {tf && t.episodes.length > 0 ? (
            <View style={styles.acts}>
              <Action
                label={complete ? 'Clear season' : 'Mark season watched'}
                icon={complete ? <Eraser size={13} color={colors.muted} /> : <CheckCheck size={13} color={colors.muted} />}
                onPress={() => (complete ? setConfirmClear(true) : tf.completeSeason(t.season, numbers))}
              />
              <Action label="Rewatch season" icon={<RotateCcw size={13} color={colors.muted} />} onPress={() => setConfirmRewatch(true)} />
            </View>
          ) : null}

          {t.loading ? <Text style={styles.note}>Loading episodes…</Text> : null}
          {!t.loading && t.episodes.length === 0 ? <Text style={styles.note}>TMDB has no episodes for this season yet.</Text> : null}
          {t.episodes.length > 0 ? (
            <>
              <View style={styles.progRow}>
                <Text style={styles.prog}>Season {t.season} · {t.progress.total} episodes{tf ? ` · ${t.progress.watched} watched` : ''}</Text>
                {tf ? <Bar pct={t.progress.pct} /> : null}
              </View>
              {t.episodes.map((e) => (
                <EpisodeRow
                  key={e.id}
                  season={t.season}
                  episode={e}
                  count={t.counts[e.episode_number] ?? 0}
                  lastWatch={t.lastWatch(e.episode_number)}
                  onToggle={tf ? () => tf.toggleEpisode(t.season, e.episode_number) : null}
                  onBump={(d) => tf?.bumpEpisode(t.season, e.episode_number, d)}
                />
              ))}
            </>
          ) : null}
        </View>
      </Collapse>

      <ConfirmDialog
        open={confirmClear}
        title={`Clear season ${t.season}?`}
        description={`Removes every watch logged for all ${t.episodes.length} episodes of season ${t.season}, dates included. This cannot be undone.`}
        confirmLabel="Clear season"
        destructive
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          setConfirmClear(false);
          tf?.clearSeason(t.season, numbers);
        }}
      />
      <ConfirmDialog
        open={confirmRewatch}
        title={`Rewatch season ${t.season}?`}
        description={`Logs another watch of all ${t.episodes.length} episodes, dated now. Use the minus and plus on an episode to correct a single one.`}
        confirmLabel="Log rewatch"
        onCancel={() => setConfirmRewatch(false)}
        onConfirm={() => {
          setConfirmRewatch(false);
          tf?.rewatchSeason(t.season, numbers);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 14, backgroundColor: colors.wash, borderWidth: 1, borderColor: colors.hairline },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  fold: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { fontSize: 13, fontWeight: '600' },
  flip: { transform: [{ rotate: '180deg' }] },
  headProg: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 10, minWidth: 0 },
  body: { paddingTop: 12 },
  chips: { gap: 6 },
  acts: { flexDirection: 'row', gap: 18, marginTop: 12 },
  act: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 28 },
  actLabel: { fontSize: 12, color: colors.muted },
  progRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 12 },
  prog: { fontSize: 12, color: colors.dim },
  bar: { flex: 1, maxWidth: 160, minWidth: 40, height: 4, borderRadius: 2, backgroundColor: colors.sheen, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 2, backgroundColor: colors.primary },
  note: { paddingVertical: 24, fontSize: 13, color: colors.muted, textAlign: 'center' },
});
