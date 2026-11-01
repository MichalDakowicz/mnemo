import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';

type Props = { title: string; hint: string; children: ReactNode };

export function SettingsSection({ title, hint, children }: Props) {
  return (
    <View style={styles.section}>
      <View style={{ gap: 4 }}>
        <Text accessibilityRole="header" tracking={-0.035} style={styles.title}>
          {title}
        </Text>
        <Text style={styles.hint}>{hint}</Text>
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

type RowProps = {
  label: string;
  hint?: ReactNode;
  mono?: boolean;
  /** Controls sit under the label (wide controls: chips, segmented) instead of beside it. */
  stacked?: boolean;
  last?: boolean;
  children?: ReactNode;
};

export function SettingRow({ label, hint, mono, stacked, children }: RowProps) {
  return (
    <View style={[styles.row, stacked && styles.stacked]}>
      <View style={{ flex: stacked ? undefined : 1, minWidth: 0, gap: 3 }}>
        <Text mono={mono} numberOfLines={mono ? 1 : undefined} style={styles.label}>
          {label}
        </Text>
        {typeof hint === 'string' ? <Text style={styles.rowHint}>{hint}</Text> : hint}
      </View>
      {children ? <View style={stacked ? styles.controlsStacked : styles.controls}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  title: { fontSize: 18, fontWeight: '600' },
  hint: { fontSize: 12, color: colors.dim },
  body: {
    borderRadius: 14,
    backgroundColor: colors.wash,
    borderWidth: 1,
    borderColor: colors.hairline,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  stacked: { flexDirection: 'column', alignItems: 'stretch', gap: 12 },
  label: { fontSize: 14, fontWeight: '500', letterSpacing: -0.14 },
  rowHint: { fontSize: 12, lineHeight: 16, color: colors.dim },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 0 },
  controlsStacked: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
});
