import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Glass } from '@/components/ui/Glass';
import { Pill } from '@/components/ui/Pill';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** A centred glass card over a scrim (web `.ti-dialog`). The back gesture cancels. */
export function ConfirmDialog({ open, title, description, confirmLabel, destructive, busy, onConfirm, onCancel }: Props) {
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onCancel} statusBarTranslucent navigationBarTranslucent>
      <View style={styles.center}>
        <Pressable style={styles.scrim} onPress={onCancel} accessibilityLabel="Cancel" />
        <Glass solid radius={18} style={styles.card}>
          <View accessibilityRole="alert" style={styles.body}>
            <Text accessibilityRole="header" tracking={-0.02} style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          <View style={styles.buttons}>
            <Pill label="Cancel" onPress={onCancel} />
            <Pill
              label={confirmLabel}
              variant={destructive ? 'default' : 'primary'}
              onPress={onConfirm}
              disabled={busy}
              style={destructive ? styles.danger : undefined}
            />
          </View>
        </Glass>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  scrim: { ...StyleSheet.absoluteFill, backgroundColor: colors.scrim },
  card: { width: '100%', maxWidth: 400, padding: 22 },
  body: { gap: 8, marginBottom: 20 },
  title: { fontSize: 18, fontWeight: '600' },
  description: { fontSize: 14, lineHeight: 21, color: colors.muted },
  buttons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  danger: { borderColor: colors.warn },
});
