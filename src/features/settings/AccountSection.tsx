import { useState } from 'react';

import { useAuth } from '@/features/auth/AuthProvider';
import { signOut } from '@/features/auth/authActions';

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
    <SettingsSection id="account" title="Account" hint="Signing out ends this device's session only">
      <SettingRow
        label={user?.email ?? 'Signed in'}
        mono
        hint={error ? <span role="alert" style={{ color: 'var(--warn)' }}>{error}</span> : undefined}
      >
        <button type="button" className="pill" onClick={() => void out()}>Sign out</button>
      </SettingRow>
    </SettingsSection>
  );
}
