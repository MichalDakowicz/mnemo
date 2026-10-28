import { Link } from 'react-router-dom';

import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/features/auth/AuthProvider';
import { useProfile } from '@/hooks/useProfile';

import { SettingsSection } from './SettingsSection';

export function ProfileSection() {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const name = profile?.displayName || profile?.username || 'You';
  return (
    <SettingsSection id="profile" title="Profile" hint="How friends see you">
      <div className="row">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Avatar name={name} pfp={profile?.pfp} size={56} />
          <div>
            <p className="label">{name}</p>
            {profile ? <p className="hint mono">@{profile.username}</p> : null}
          </div>
        </div>
        <Link className="pill" to="/profile">Edit profile</Link>
      </div>
    </SettingsSection>
  );
}
