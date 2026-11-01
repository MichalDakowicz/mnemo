import { Chip } from '@/components/ui/Chip';
import { useUserSettings } from '@/hooks/useUserSettings';
import { VISIBILITY_OPTIONS, visibilityNote } from '@/lib/shelfVisibility';

import { SettingRow, SettingsSection } from './SettingsSection';

export function PrivacySection() {
  const { settings, updateSettings } = useUserSettings();
  return (
    <SettingsSection title="Privacy" hint="Notes are always private">
      <SettingRow stacked label="Who can see your shelf" hint={visibilityNote(settings.friendsVisibility)}>
        {VISIBILITY_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            active={settings.friendsVisibility === option.value}
            onPress={() => void updateSettings({ friendsVisibility: option.value })}
          />
        ))}
      </SettingRow>
    </SettingsSection>
  );
}
