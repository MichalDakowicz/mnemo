import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme/colors';

import { Text } from './Text';

type Props = { title?: string; children?: ReactNode; style?: StyleProp<ViewStyle> };

/** Quiet wash panel (web `.panel`): 14px radius, #ece9e409 fill, faint border. Phone padding is tighter than desktop. */
export function Panel({ title, children, style }: Props) {
  return (
    <View style={[styles.panel, style]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { padding: 16, borderRadius: 14, backgroundColor: colors.wash, borderWidth: 1, borderColor: '#ece9e414', gap: 12 },
  title: { fontSize: 13, fontWeight: '600', letterSpacing: -0.13 },
});
