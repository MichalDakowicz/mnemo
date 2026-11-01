import { ArrowLeftRight, Check, Plus } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Pill } from '@/components/ui/Pill';
import { Text } from '@/components/ui/Text';
import { titleSize } from '@/lib/discoverReel';
import type { MediaMetadata } from '@/lib/tmdb';
import type { DiscoverItem } from '@/lib/toDiscoveryMovie';
import { colors } from '@/theme/colors';

import type { CardActions } from './useCardActions';

type Props = { item: DiscoverItem; details: MediaMetadata | null; actions: CardActions; onOpen: () => void };

/** Phone title size: the web's 34-72px steps, halved and kept between 26 and 36. */
const phoneTitleSize = (title: string) => Math.min(36, Math.max(26, Math.round(titleSize(title) * 0.5 + 6)));

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.dt}>{label}</Text>
      <Text numberOfLines={1} style={styles.dd}>{value}</Text>
    </View>
  );
}

/** Under the reel: the centred title, who made it, and add / details. */
export function HeroMeta({ item, details, actions, onOpen }: Props) {
  const added = actions.isAdded(item);
  const byLabel = item.type === 'movie' ? 'Directed by' : 'Created by';
  const people = details?.director.map((d) => d.name).join(', ');
  const year = item.releaseDate?.slice(0, 4);
  const genres = (details?.genres.map((g) => g.name) ?? item.genres).slice(0, 2).join(' · ');
  const glyph = added ? <Check size={16} strokeWidth={2.2} color={colors.onPrimary} /> : <Plus size={16} strokeWidth={2.2} color={colors.onPrimary} />;
  return (
    <View style={styles.box}>
      <Text accessibilityRole="header" tracking={-0.045} numberOfLines={3} style={[styles.title, { fontSize: phoneTitleSize(item.title), lineHeight: phoneTitleSize(item.title) }]}>
        {item.title}
      </Text>
      <View style={styles.list}>
        <MetaRow label={byLabel} value={people || (details ? '—' : '')} />
        <MetaRow label="Year" value={year || '—'} />
        <MetaRow label="Genre" value={genres || '—'} />
      </View>
      <View style={styles.actions}>
        <Pill
          variant="primary"
          height={44}
          icon={glyph}
          label={added ? 'On your watchlist' : 'Add to watchlist'}
          disabled={actions.isPending(item)}
          onPress={() => void actions.toggle({ tmdbId: item.tmdbId, type: item.type, title: item.title })}
        />
        <Pill height={44} label="Details" onPress={onOpen} />
      </View>
      <View style={styles.hint}>
        <ArrowLeftRight size={14} color={colors.dim} />
        <Text style={styles.hintText}>Swipe sideways to browse</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { marginTop: 18 },
  title: { fontWeight: '600', color: colors.textBright, marginBottom: 18 },
  list: { borderTopWidth: 1, borderTopColor: colors.lineStrong },
  metaRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, paddingVertical: 7 },
  dt: { fontSize: 13, color: colors.dim },
  dd: { flexShrink: 1, fontSize: 14, textAlign: 'right' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 },
  hintText: { fontSize: 12, color: colors.dim },
});
