import { Calculator } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { Text } from '@/components/ui/Text';
import type { EditForm } from '@/lib/editForm';
import { colors } from '@/theme/colors';

import { PreciseSlider } from './PreciseSlider';
import { TickRating } from './TickRating';
import type { TitleForm } from './useTitleForm';

const CATS = [
  ['story', 'Story'],
  ['acting', 'Acting'],
  ['ending', 'Ending'],
  ['enjoyment', 'Enjoyment'],
] as const;
const EMPTY = { overall: 0, story: 0, acting: 0, ending: 0, enjoyment: 0 };

type Props = { form: EditForm; title: string; tf: TitleForm };

function AutoButton({ onPress, children }: { onPress: () => void; children: string }) {
  return (
    <Pressable accessibilityRole="button" hitSlop={8} onPress={onPress} style={styles.auto}>
      <Calculator size={13} color={colors.muted} />
      <Text style={styles.autoLabel}>{children}</Text>
    </Pressable>
  );
}

function RateRow({ label, value, tools }: { label: string; value: number; tools?: ReactNode }) {
  return (
    <View style={styles.rateRow}>
      <Text style={styles.rateLabel}>{label.toUpperCase()}</Text>
      <View style={styles.tools}>
        {tools}
        <Text mono style={styles.rateVal}>{value.toFixed(1)} / 5</Text>
      </View>
    </View>
  );
}

/** The rating drawer under the strip: overall slider, per-season (series) and category ticks. */
export function ReviewPanel({ form, title, tf }: Props) {
  const [season, setSeason] = useState(1);
  const isTv = form.type === 'tv';
  const seasons = Array.from({ length: Math.max(1, form.numberOfSeasons) }, (_, i) => i + 1);
  const s = form.seasonRatings[season] ?? EMPTY;

  return (
    <View style={styles.review}>
      <View>
        <RateRow
          label="Overall"
          value={form.overallRating}
          tools={<AutoButton onPress={tf.autoOverall}>{isTv ? 'Auto from seasons' : 'Auto from categories'}</AutoButton>}
        />
        <PreciseSlider value={form.overallRating} label={`Overall rating for ${title}`} onChange={tf.setOverall} />
      </View>

      {isTv ? (
        <>
          <View style={styles.split}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {seasons.map((n) => {
                const v = form.seasonRatings[n]?.overall ?? 0;
                return <Chip key={n} label={`Season ${n}`} count={v > 0 ? v.toFixed(1) : '—'} active={season === n} onPress={() => setSeason(n)} />;
              })}
            </ScrollView>
            <AutoButton onPress={() => tf.autoSeason(season)}>Auto-calc season</AutoButton>
          </View>
          <View>
            <RateRow label={`Season ${season} overall`} value={s.overall} />
            <PreciseSlider value={s.overall} label={`Season ${season} overall rating`} onChange={(v) => tf.setSeasonRating(season, 'overall', v)} />
          </View>
          <View style={styles.cats}>
            {CATS.map(([key, label]) => (
              <TickRating key={`${season}${key}`} label={label} value={s[key]} onChange={(v) => tf.setSeasonRating(season, key, v)} />
            ))}
          </View>
        </>
      ) : (
        <View style={styles.cats}>
          {CATS.map(([key, label]) => (
            <TickRating key={key} label={label} value={form.ratings[key]} onChange={(v) => tf.setCategory(key, v)} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  review: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.line, gap: 18 },
  rateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  rateLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 1.1, color: colors.dim },
  rateVal: { fontSize: 13, fontWeight: '500' },
  tools: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  auto: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  autoLabel: { fontSize: 12, color: colors.muted },
  split: { gap: 10 },
  chips: { gap: 6 },
  cats: { gap: 8 },
});
