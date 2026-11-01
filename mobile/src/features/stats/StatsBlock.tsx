import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';

type Props = { title: string; meta?: string; children: ReactNode; label?: string };

/** The web's `.block`: hairline on top, 20px heading with a dim note on the right. Shared by every Stats block. */
export function StatsBlock({ title, meta, children }: Props) {
  return (
    <View style={styles.block}>
      <View style={styles.head}>
        <Text accessibilityRole="header" tracking={-0.035} style={styles.title}>{title}</Text>
        {meta ? <Text numberOfLines={1} style={styles.meta}>{meta}</Text> : null}
      </View>
      {children}
    </View>
  );
}

/** The dim one-line note blocks fall back to (web `.stats-mix`). */
export function StatsNote({ children }: { children: ReactNode }) {
  return <Text style={styles.note}>{children}</Text>;
}

const styles = StyleSheet.create({
  block: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 16, marginBottom: 32 },
  head: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 16 },
  title: { fontSize: 19, fontWeight: '600' },
  meta: { flexShrink: 1, fontSize: 12, color: colors.dim },
  note: { marginTop: 14, fontSize: 13, color: colors.dim },
});
