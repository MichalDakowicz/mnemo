import { useState } from 'react';

import { Pill } from '@/components/ui/Pill';
import { Text } from '@/components/ui/Text';
import { useAuth } from '@/features/auth/AuthProvider';
import { signOut } from '@/features/auth/authActions';
import { colors } from '@/theme/colors';

import { SettingRow, SettingsSection } from './SettingsSection';

export function AccountSection() {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const out = async () => {
    setError(null);
    try {
      await signOut();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not sign out');
    }
  };
  return (
    <SettingsSection title="Account" hint="Signing out ends this device's session only">
      <SettingRow
        label={user?.email ?? 'Signed in'}
        mono
        hint={
          error ? (
            <Text accessibilityRole="alert" style={{ fontSize: 12, color: colors.warn }}>
              {error}
            </Text>
          ) : undefined
        }>
        <Pill label="Sign out" onPress={() => void out()} />
      </SettingRow>
    </SettingsSection>
  );
}
