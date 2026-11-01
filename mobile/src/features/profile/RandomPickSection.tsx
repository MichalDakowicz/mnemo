import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Poster } from '@/components/media/Poster';
import { Pill } from '@/components/ui/Pill';
import { Text } from '@/components/ui/Text';
import { formatRuntime } from '@/lib/cardInfo';
import { titleMeta } from '@/lib/statsSummary';
import { colors } from '@/theme/colors';

import type { useRandomPick } from './useRandomPick';

export function RandomPickSection({ pick }: { pick: ReturnType<typeof useRandomPick> }) {
  const router = useRouter();
  const { picked, counts } = pick;
  const meta = picked ? [titleMeta(picked), formatRuntime(picked.runtime)].filter(Boolean).join(' · ') : '';
  return (
    <View>
      <Text accessibilityRole="header" tracking={-0.035} style={styles.title}>
        Don&apos;t know what to watch?
      </Text>
      <Text style={styles.note}>Let me pick something off your watchlist</Text>
      <View style={styles.scopes}>
        <Pill
          label={`On my services  ${counts.services}`}
          disabled={!pick.hasServices || counts.services === 0}
          onPress={() => pick.pick('services')}
        />
        <Pill label={`Whole watchlist  ${counts.library}`} disabled={counts.library === 0} onPress={() => pick.pick('library')} />
      </View>
      {!pick.hasServices ? <Text style={styles.hint}>Choose your streaming services in Settings first.</Text> : null}
      {counts.library === 0 ? <Text style={styles.hint}>Your watchlist is empty.</Text> : null}
      {picked ? (
        <View style={styles.result} accessibilityLiveRegion="polite">
          <View style={{ width: 76 }}>
            <Poster title={picked.title} coverUrl={picked.coverUrl} />
          </View>
          <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
            <Text numberOfLines={2} style={styles.pickTitle}>
              {picked.title}
            </Text>
            <Text numberOfLines={1} style={styles.meta}>
              {meta}
            </Text>
            <View style={styles.btns}>
              {picked.tmdbId != null ? (
                <Pill
                  variant="primary"
                  height={32}
                  label="Details"
                  onPress={() => router.push(`/title/${picked.type}/${picked.tmdbId}` as never)}
                />
              ) : null}
              <Pill height={32} label="Another" onPress={pick.again} />
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '600' },
  note: { marginTop: 6, marginBottom: 16, fontSize: 12, color: colors.dim },
  scopes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  hint: { marginTop: 12, fontSize: 12, color: colors.dim },
  result: { flexDirection: 'row', gap: 14, marginTop: 16, alignItems: 'center' },
  pickTitle: { fontSize: 16, fontWeight: '600', letterSpacing: -0.3 },
  meta: { fontSize: 12, color: colors.dim },
  btns: { flexDirection: 'row', gap: 8, marginTop: 8 },
});
