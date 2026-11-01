import { ScrollView, StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { PAGE_GUTTER } from '@/theme/layout';
import type { PeriodKey, PeriodOption } from '@/lib/statsView';

type Props = {
  options: PeriodOption[];
  period: PeriodKey;
  onPeriod: (key: PeriodKey) => void;
};

export function StatsHeader({ options, period, onPeriod }: Props) {
  return (
    <View style={styles.wrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} accessibilityLabel="Period" style={styles.bleed} contentContainerStyle={styles.row}>
        {options.map((o) => (
          <Chip key={o.key} label={o.label} active={period === o.key} onPress={() => onPeriod(o.key)} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
  bleed: { marginHorizontal: -PAGE_GUTTER },
  row: { paddingHorizontal: PAGE_GUTTER, gap: 6 },
});
