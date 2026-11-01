import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

import { Text } from './Text';

type Props = { open: boolean; onClose: () => void; title?: string; children: ReactNode };

/**
 * Bottom sheet on the near-opaque glass panel. Stands in for every web popover and menu
 * (sort, filters, status): a phone has no hover, so those open from the bottom edge.
 */
export function Sheet({ open, onClose, title, children }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.handle} />
        {title ? <Text tracking={-0.02} style={styles.title}>{title}</Text> : null}
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: 4 }}>
          {children}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: '#0008' },
  sheet: {
    maxHeight: '82%',
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: '#161618',
    borderTopWidth: 1,
    borderColor: colors.hairline,
  },
  handle: { alignSelf: 'center', width: 36, height: 4, borderRadius: 2, backgroundColor: colors.lineStrong, marginBottom: 10 },
  title: { paddingHorizontal: 8, paddingBottom: 8, fontSize: 15, fontWeight: '600' },
});
