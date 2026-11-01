import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme/colors';

import { Text } from './Text';

type Props = { title: string; meta?: string; right?: ReactNode };

/** Section heading (web `.head`): 18px semibold, tracking -.035em, dim meta on the right. */
export function SectionHead({ title, meta, right }: Props) {
  return (
    <View style={styles.head}>
      <Text accessibilityRole="header" tracking={-0.035} style={styles.title}>{title}</Text>
      {meta ? <Text style={styles.meta}>{meta}</Text> : null}
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 12 },
  title: { flex: 1, fontSize: 18, fontWeight: '600' },
  meta: { fontSize: 12, color: colors.dim },
});
