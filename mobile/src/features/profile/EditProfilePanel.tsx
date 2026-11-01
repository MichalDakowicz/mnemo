import { StyleSheet, TextInput, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Pill } from '@/components/ui/Pill';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/fonts';

import type { useProfileEdit } from './useProfileEdit';

type Props = { edit: ReturnType<typeof useProfileEdit>; fallbackName: string };

/** Edit profile: photo, display name, username. Opens as a bottom sheet over the profile. */
export function EditProfilePanel({ edit, fallbackName }: Props) {
  const shown = edit.name.trim() || edit.username || fallbackName;
  return (
    <Sheet open={edit.open} onClose={edit.close} title="Edit profile">
      <View style={styles.body}>
        <View style={styles.photo}>
          <Avatar name={shown} pfp={edit.pfp || null} size={64} />
          <View style={{ flex: 1, gap: 8 }}>
            <View style={styles.buttons}>
              <Pill label="Upload photo" height={32} onPress={() => void edit.upload()} />
              {edit.pfp ? <Pill label="Remove" height={32} onPress={edit.clearPfp} /> : null}
            </View>
            <Text style={styles.note}>Square crop, saved at 256 px</Text>
          </View>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Display name</Text>
          <TextInput
            value={edit.name}
            onChangeText={edit.setName}
            accessibilityLabel="Display name"
            selectionColor={colors.primary}
            placeholderTextColor={colors.dim}
            style={styles.input}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Username</Text>
          <TextInput
            value={edit.username}
            onChangeText={edit.setUsername}
            accessibilityLabel="Username"
            autoCapitalize="none"
            autoCorrect={false}
            selectionColor={colors.primary}
            placeholderTextColor={colors.dim}
            style={[styles.input, { fontFamily: fonts.mono }]}
          />
        </View>
        <View style={styles.buttons}>
          <Pill
            variant="primary"
            label={edit.saving ? 'Saving...' : 'Save'}
            disabled={edit.saving}
            onPress={() => void edit.save()}
          />
          <Pill label="Cancel" disabled={edit.saving} onPress={edit.close} />
        </View>
        {edit.error ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {edit.error}
          </Text>
        ) : null}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 8, paddingBottom: 8, gap: 16 },
  photo: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  note: { fontSize: 12, color: colors.dim },
  field: { gap: 6 },
  fieldLabel: { fontSize: 12, color: colors.muted },
  input: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: colors.inputFill,
    borderWidth: 1,
    borderColor: colors.chipBorder,
    color: colors.text,
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  error: { fontSize: 13, color: colors.warn },
});
