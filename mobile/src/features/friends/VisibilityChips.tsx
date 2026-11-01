import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { Text } from '@/components/ui/Text';
import { useUserSettings } from '@/hooks/useUserSettings';
import { VISIBILITY_OPTIONS, visibilityNote } from '@/lib/shelfVisibility';
import { colors } from '@/theme/colors';

/** Who can open your shelf: three chips over user_settings.friends_visibility. */
export function VisibilityChips({ showNote = true }: { showNote?: boolean }) {
  const { settings, updateSettings } = useUserSettings();
  const current = settings.friendsVisibility;
  return (
    <>
      <View style={styles.group} accessibilityLabel="Who can see your shelf">
        {VISIBILITY_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            active={current === option.value}
            onPress={() => void updateSettings({ friendsVisibility: option.value })}
          />
        ))}
      </View>
      {showNote ? <Text style={styles.note}>{visibilityNote(current)}</Text> : null}
    </>
  );
}

const styles = StyleSheet.create({
  group: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  note: { fontSize: 12, color: colors.dim },
});
