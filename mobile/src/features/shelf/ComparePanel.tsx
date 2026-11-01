import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Panel } from '@/components/ui/Panel';
import { SectionHead } from '@/components/ui/SectionHead';
import { Text } from '@/components/ui/Text';
import type { CompareRow, TasteComparison } from '@/lib/compareTaste';
import { formatScore } from '@/lib/socialFeed';
import { colors } from '@/theme/colors';

const RADIUS = 36;
const CIRC = 2 * Math.PI * RADIUS;

type RowData = Omit<CompareRow, 'yours' | 'gap'> & { yours?: number };

function Rows({ title, rows, empty, both = true }: { title: string; rows: RowData[]; empty: string; both?: boolean }) {
  const router = useRouter();
  return (
    <View>
      <Text style={styles.listTitle}>{title}</Text>
      {rows.length === 0 ? <Text style={styles.empty}>{empty}</Text> : null}
      {rows.map((row, i) => {
        const open = row.tmdbId != null ? () => router.push(`/title/${row.type}/${row.tmdbId}`) : undefined;
        return (
          <Pressable
            key={row.key}
            disabled={!open}
            accessibilityRole={open ? 'link' : undefined}
            onPress={open}
            style={[styles.row, i === 0 && { borderTopWidth: 0 }]}>
            <Text numberOfLines={1} style={styles.rowTitle}>{row.title}</Text>
            <Text mono style={styles.scores}>
              {both && row.yours != null ? `You ★ ${formatScore(row.yours)} · ` : ''}Them ★ {formatScore(row.theirs)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

type Props = { comparison: TasteComparison; headline: string; subtitle: string };

/** Overlap ring, then where you agree, where you split, and what they love that you have not rated. */
export function ComparePanel({ comparison, headline, subtitle }: Props) {
  const filled = (comparison.overlapPct / 100) * CIRC;
  return (
    <View style={styles.wrap} accessibilityLabel="Compare taste">
      <Panel style={{ gap: 0 }}>
        <SectionHead title="Compare taste" />
        <View style={styles.compare}>
          <View style={styles.ring}>
            <Svg width={84} height={84} style={{ transform: [{ rotate: '-90deg' }] }}>
              <Circle cx={42} cy={42} r={RADIUS} fill="none" stroke={colors.hairline} strokeWidth={7} />
              <Circle cx={42} cy={42} r={RADIUS} fill="none" stroke={colors.primary} strokeWidth={7} strokeLinecap="round" strokeDasharray={`${filled} ${CIRC}`} />
            </Svg>
            <View style={styles.pct}>
              <Text tracking={-0.04} style={{ fontSize: 21, fontWeight: '600' }}>{`${comparison.overlapPct}%`}</Text>
            </View>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ fontSize: 15, fontWeight: '600' }}>{headline}</Text>
            <Text style={{ marginTop: 4, fontSize: 13, color: colors.dim }}>{subtitle}</Text>
          </View>
        </View>
        <View style={styles.lists}>
          <Rows title="You agree on" rows={comparison.agree} empty="Nothing yet." />
          <Rows title="You split on" rows={comparison.split} empty="No big disagreements." />
          <Rows title="They love, you have not rated" rows={comparison.gaps} empty="Nothing waiting for you." both={false} />
        </View>
      </Panel>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 32 },
  compare: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 20 },
  ring: { width: 84, height: 84 },
  pct: { ...StyleSheet.absoluteFill as object, alignItems: 'center', justifyContent: 'center' },
  lists: { gap: 24 },
  listTitle: { marginBottom: 8, fontSize: 13, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9, borderTopWidth: 1, borderTopColor: colors.hairline },
  rowTitle: { flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: '500' },
  scores: { fontSize: 12, color: colors.muted },
  empty: { fontSize: 13, color: colors.dim },
});
