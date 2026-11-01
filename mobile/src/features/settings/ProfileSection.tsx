import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Pill } from '@/components/ui/Pill';
import { Text } from '@/components/ui/Text';
import { useAuth } from '@/features/auth/AuthProvider';
import { useProfile } from '@/hooks/useProfile';
import { colors } from '@/theme/colors';

import { SettingsSection } from './SettingsSection';

export function ProfileSection() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const name = profile?.displayName || profile?.username || 'You';
  return (
    <SettingsSection title="Profile" hint="How friends see you">
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 }}>
        <Avatar name={name} pfp={profile?.pfp} size={52} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '500' }}>
            {name}
          </Text>
          {profile ? (
            <Text mono numberOfLines={1} style={{ fontSize: 12, color: colors.dim }}>
              @{profile.username}
            </Text>
          ) : null}
        </View>
        <Pill label="Edit profile" onPress={() => router.push('/profile')} />
      </View>
    </SettingsSection>
  );
}
