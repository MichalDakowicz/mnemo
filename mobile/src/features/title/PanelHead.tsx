import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';

/** Section heading (web `.ti-panel-head h2`): 13px semibold, optional control on the right. */
export function PanelHead({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <View style={styles.head}>
      <Text accessibilityRole="header" tracking={-0.01} style={styles.title}>{title}</Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 },
  title: { fontSize: 13, fontWeight: '600' },
});
