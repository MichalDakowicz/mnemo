import { ChevronDown } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { averageRating, ratingText } from '@/lib/titleStatus';
import { colors } from '@/theme/colors';

import type { FriendTake } from './useTitleFriends';

type Props = {
  voteAverage: number;
  voteCount: number;
  /** null when the title is not in the library: nothing to rate yet. */
  mine: number | null;
  open: boolean;
  onToggle: () => void;
  friends: FriendTake[];
};

const thousands = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** TMDB score, your rating (opens the drawer) and your friends' average. */
export function RatingsStrip({ voteAverage, voteCount, mine, open, onToggle, friends }: Props) {
  const rated = friends.filter((f) => f.rating > 0);
  const friendAvg = averageRating(rated.map((f) => f.rating));
  const mineText = ratingText(mine);

  return (
    <View style={styles.strip}>
      <View style={[styles.cell, styles.first]}>
        <Text style={[styles.k, styles.caps]}>TMDB</Text>
        {voteAverage > 0 ? (
          <>
            <Text tracking={-0.03} style={styles.big}>{voteAverage.toFixed(1)}</Text>
            <Text style={styles.small}>/10{voteCount > 0 ? ` · ${thousands(voteCount)} votes` : ''}</Text>
          </>
        ) : (
          <Text tracking={-0.03} style={styles.big}>—</Text>
        )}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Your rating ${mineText ?? 'none'}`}
        accessibilityState={{ expanded: open, disabled: mine === null }}
        disabled={mine === null}
        onPress={onToggle}
        style={({ pressed }) => [styles.cell, pressed && { backgroundColor: colors.wash }]}>
        <Text style={styles.k}>Your rating</Text>
        <View style={styles.row}>
          <Text tracking={-0.03} style={styles.big}>{mineText ?? '—'}</Text>
          {mine !== null ? <ChevronDown size={14} color={colors.dim} style={open ? styles.flip : undefined} /> : null}
        </View>
        <Text style={styles.small}>{mineText ? '/5' : ' '}</Text>
      </Pressable>
      <View style={[styles.cell, styles.last]}>
        <Text style={styles.k}>Friends</Text>
        <Text tracking={-0.03} style={styles.big}>{friendAvg ? friendAvg.toFixed(1) : '—'}</Text>
        <Text style={styles.small}>{rated.length ? `${rated.length} rated` : ' '}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { flexDirection: 'row', marginTop: 28, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.line },
  cell: { flex: 1, minWidth: 0, paddingHorizontal: 14, borderLeftWidth: 1, borderLeftColor: colors.line },
  first: { paddingLeft: 0, borderLeftWidth: 0 },
  last: { paddingRight: 0 },
  k: { fontSize: 12, color: colors.dim, marginBottom: 6 },
  caps: { fontSize: 11, fontWeight: '600', letterSpacing: 1.5 },
  big: { fontSize: 24, fontWeight: '600' },
  small: { fontSize: 11, color: colors.dim, marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  flip: { transform: [{ rotate: '180deg' }] },
});
