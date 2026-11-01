import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme/colors';

import { Text } from './Text';

type Props = { title?: string; body?: string; tone?: 'dim' | 'warn' };

/** Honest empty / error / loading state (web `.lib-state`, `.empty`). Never fictional titles. */
export function EmptyState({ title, body, tone = 'dim' }: Props) {
  return (
    <View style={styles.box} accessibilityRole={tone === 'warn' ? 'alert' : undefined}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {body ? <Text style={[styles.body, tone === 'warn' && { color: colors.warn }]}>{body}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 16, gap: 8 },
  title: { fontSize: 15, fontWeight: '600', letterSpacing: -0.3, textAlign: 'center' },
  body: { fontSize: 13, color: colors.muted, textAlign: 'center' },
});
