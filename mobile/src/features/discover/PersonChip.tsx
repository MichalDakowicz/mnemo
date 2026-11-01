import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';

type Props = { id: number; name: string; role: string; photo: string | null };

/** A person from search; opens /person/<id>. */
export function PersonChip({ id, name, role, photo }: Props) {
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${name}, ${role}`}
      onPress={() => router.push(`/person/${id}`)}
      style={({ pressed }) => [styles.chip, pressed && { backgroundColor: colors.hover }]}>
      <Avatar name={name} pfp={photo} size={36} />
      <View style={{ flexShrink: 1 }}>
        <Text numberOfLines={1} style={styles.name}>{name}</Text>
        <Text numberOfLines={1} style={styles.role}>{role}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    maxWidth: '100%',
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
  },
  name: { fontSize: 13, fontWeight: '600' },
  role: { marginTop: 1, fontSize: 11, color: colors.dim },
});
