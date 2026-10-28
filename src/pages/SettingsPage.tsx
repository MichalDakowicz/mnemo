import '@/features/friends/friends.css';
import '@/features/settings/settings.css';
import { AccountSection } from '@/features/settings/AccountSection';
import { DataSection } from '@/features/settings/DataSection';
import { LibrarySection } from '@/features/settings/LibrarySection';
import { PrivacySection } from '@/features/settings/PrivacySection';
import { ProfileSection } from '@/features/settings/ProfileSection';
import { StatsGoalsSection } from '@/features/settings/StatsGoalsSection';
import { useUserSettings } from '@/hooks/useUserSettings';

export function SettingsPage() {
  const { error } = useUserSettings();
  return (
    <div className="settings-page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-sub">Changes save as you make them and sync to your other devices</p>
        </div>
      </div>
      {error ? <p className="notice" role="alert">Could not load your settings. Showing defaults.</p> : null}
      <ProfileSection />
      <LibrarySection />
      <PrivacySection />
      <StatsGoalsSection />
      <DataSection />
      <AccountSection />
      <footer className="settings-foot">
        <span><span className="dot" aria-hidden="true" />Mnemo</span>
        <span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
      </footer>
    </div>
  );
}
