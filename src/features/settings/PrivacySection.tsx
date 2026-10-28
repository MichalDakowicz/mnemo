import { VisibilityChips } from '@/features/friends/VisibilityChips';
import { useUserSettings } from '@/hooks/useUserSettings';
import { visibilityNote } from '@/lib/shelfVisibility';

import { SettingRow, SettingsSection } from './SettingsSection';

export function PrivacySection() {
  const { settings } = useUserSettings();
  return (
    <SettingsSection id="privacy" title="Privacy" hint="Notes are always private">
      <SettingRow label="Who can see your shelf" hint={visibilityNote(settings.friendsVisibility)}>
        <VisibilityChips showNote={false} />
      </SettingRow>
    </SettingsSection>
  );
}
