import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme/colors';

import { Text } from './Text';

type Props = { title: string; subtitle?: string; right?: ReactNode };

/** Page title block: big light title with tight tracking, dim subtitle (web `.page-head`). 34px on a phone. */
export function PageHeader({ title, subtitle, right }: Props) {
  return (
    <View style={styles.head}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text accessibilityRole="header" tracking={-0.04} style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, marginBottom: 20 },
  title: { fontSize: 34, fontWeight: '600', lineHeight: 36, color: colors.text },
  sub: { marginTop: 6, fontSize: 13, color: colors.dim },
});
