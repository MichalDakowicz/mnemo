import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Poster } from '@/components/media/Poster';
import { Chip } from '@/components/ui/Chip';
import { IconButton } from '@/components/ui/IconButton';
import { Pill } from '@/components/ui/Pill';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';
import { PAGE_GUTTER } from '@/theme/layout';

import type { CalendarPanelModel } from './useCalendarPanel';
import type { CardActions } from './useCardActions';

const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const CELL_GAP = 4;

/** A month grid with thumbnails per day and the picked day's titles listed underneath. */
export function CalendarPanel({ panel, actions }: { panel: CalendarPanelModel; actions: CardActions }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cellW = Math.floor((width - PAGE_GUTTER * 2 - CELL_GAP * 6) / 7);

  return (
    <View style={styles.panel}>
      <Text accessibilityRole="header" tracking={-0.035} style={styles.title}>
        {panel.title}
      </Text>
      <Text style={styles.sub}>{panel.sub}</Text>
      <View style={styles.nav}>
        <Chip label="On my watchlist" active={panel.onlyOwned} onPress={panel.toggleOwned} />
        <View style={styles.month}>
          <IconButton label="Previous month" size={34} disabled={panel.prevOff} onPress={() => panel.shift(-1)}>
            <ChevronLeft size={16} strokeWidth={2} color={colors.text} />
          </IconButton>
          <Text accessibilityLiveRegion="polite" style={styles.monthLabel}>
            {panel.monthLabel}
          </Text>
          <IconButton label="Next month" size={34} disabled={panel.nextOff} onPress={() => panel.shift(1)}>
            <ChevronRight size={16} strokeWidth={2} color={colors.text} />
          </IconButton>
        </View>
      </View>

      <View style={styles.row} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {WEEK.map((d) => (
          <Text key={d} style={[styles.week, { width: cellW }]}>
            {d}
          </Text>
        ))}
      </View>
      <View style={styles.row}>
        {panel.cells.map((cell, i) => {
          if (!cell) return <View key={`blank-${i}`} style={{ width: cellW, height: 54 }} />;
          const n = cell.events.length;
          const warn = panel.which === 'leaving' && cell.events.some((e) => e.warning);
          const selected = panel.selected === cell.key;
          return (
            <Pressable
              key={cell.key}
              disabled={n === 0}
              accessibilityRole="button"
              accessibilityState={{ selected, disabled: n === 0 }}
              accessibilityLabel={`${cell.day} ${panel.monthName}${n ? `, ${n} ${n === 1 ? 'title' : 'titles'}` : ''}`}
              onPress={() => panel.pick(cell.key)}
              style={[styles.day, { width: cellW }, selected && styles.daySelected, n === 0 && styles.dayEmpty, cell.past && { opacity: 0.4 }]}>
              <Text mono style={[styles.dayN, cell.today && styles.today]}>
                {cell.day}
              </Text>
              <View style={styles.thumbs}>
                {cell.events.slice(0, 3).map((e) => (
                  <View key={e.id} style={styles.thumb}>
                    <Poster title={e.movie.title} coverUrl={e.movie.coverUrl} width={12} radius={2} />
                  </View>
                ))}
              </View>
              {warn ? <View style={styles.warn} /> : null}
            </Pressable>
          );
        })}
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={styles.dayLabel}>{panel.loading ? 'Loading…' : panel.dayLabel}</Text>
        {panel.items.map((e) => {
          const target = { tmdbId: e.movie.tmdbId as number, type: e.movie.type, title: e.movie.title };
          const added = actions.isAdded(target);
          return (
            <View style={styles.item} key={e.id}>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel={e.movie.title}
                onPress={() => router.push(`/title/${target.type}/${target.tmdbId}`)}
                style={styles.itemLink}>
                <Poster title={e.movie.title} coverUrl={e.movie.coverUrl} width={40} radius={4} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text numberOfLines={2} style={styles.itemTitle}>{e.movie.title}</Text>
                  <Text numberOfLines={2} style={styles.itemMeta}>{e.meta}</Text>
                  {e.warning && added ? <Text style={[styles.itemMeta, { color: colors.warn }]}>{e.warning}</Text> : null}
                </View>
              </Pressable>
              <Pill
                label={added ? 'On watchlist' : '+ Watchlist'}
                variant={added ? 'primary' : 'default'}
                height={32}
                disabled={actions.isPending(target)}
                onPress={() => void actions.toggle(target)}
              />
            </View>
          );
        })}
        {!panel.loading && panel.items.length === 0 ? <Text style={styles.empty}>{panel.emptyText}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { marginBottom: 36, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.line },
  title: { fontSize: 20, fontWeight: '600' },
  sub: { marginTop: 4, fontSize: 13, color: colors.dim },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, marginBottom: 14 },
  month: { flexDirection: 'row', alignItems: 'center' },
  monthLabel: { minWidth: 104, textAlign: 'center', fontSize: 14, fontWeight: '500' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: CELL_GAP },
  week: { marginBottom: 2, paddingLeft: 4, fontSize: 11, color: colors.dim },
  day: {
    height: 54,
    padding: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.wash,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  daySelected: { borderColor: colors.lineStrong, backgroundColor: colors.hover },
  dayEmpty: { backgroundColor: 'transparent' },
  dayN: { fontSize: 11, lineHeight: 12, color: colors.soft },
  today: { backgroundColor: colors.primary, color: colors.onPrimary, borderRadius: 999, paddingHorizontal: 5, paddingVertical: 2, overflow: 'hidden' },
  thumbs: { flexDirection: 'row', alignItems: 'flex-end' },
  thumb: { marginRight: -4, borderRadius: 2, borderWidth: 1, borderColor: colors.ground, overflow: 'hidden' },
  warn: { position: 'absolute', top: 7, right: 7, width: 6, height: 6, borderRadius: 3, backgroundColor: colors.warn },
  dayLabel: { marginBottom: 6, fontSize: 13, color: colors.dim },
  item: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.hairline },
  itemLink: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemTitle: { fontSize: 14, fontWeight: '600' },
  itemMeta: { marginTop: 2, fontSize: 12, color: colors.dim },
  empty: { paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.hairline, fontSize: 13, color: colors.muted },
});
