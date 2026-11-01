import { Chip } from '@/components/ui/Chip';
import { useUserSettings } from '@/hooks/useUserSettings';
import { COUNTRIES } from '@/lib/countries';
import { ALL_SERVICES } from '@/lib/services';
import { useLibraryPrefs, type GridSize } from '@/store/libraryPrefs';

import { Segmented } from './Segmented';
import { SelectPill } from './SelectPill';
import { SettingRow, SettingsSection } from './SettingsSection';
import { Switch } from './Switch';

const DAY_OPTIONS = [7, 14, 30, 90];
const SIZE_OPTIONS: { value: GridSize; label: string }[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'normal', label: 'Normal' },
  { value: 'large', label: 'Large' },
];

export function LibrarySection() {
  const { settings, updateSettings } = useUserSettings();
  const { gridSize, setGridSize } = useLibraryPrefs();
  const owned = settings.ownedServices;
  const toggleService = (service: string) =>
    void updateSettings({ ownedServices: owned.includes(service) ? owned.filter((s) => s !== service) : [...owned, service] });

  const days = [...new Set([...DAY_OPTIONS, settings.recentlyAddedDays])].sort((a, b) => a - b);
  const region = settings.watchProviderCountry;
  const countries = COUNTRIES.some((c) => c.code === region) ? COUNTRIES : [...COUNTRIES, { code: region, name: region }];

  return (
    <SettingsSection title="Library" hint="What sits above your titles and where they stream">
      <SettingRow label="Recently added" hint="Titles you added lately, above the grid">
        <SelectPill
          label="Days to count as recent"
          title="Days to count as recent"
          value={String(settings.recentlyAddedDays)}
          disabled={!settings.showRecentlyAdded}
          options={days.map((d) => ({ value: String(d), label: `Last ${d} days` }))}
          onChange={(v) => void updateSettings({ recentlyAddedDays: Number(v) })}
        />
        <Switch checked={settings.showRecentlyAdded} label="Show Recently added" onChange={(v) => void updateSettings({ showRecentlyAdded: v })} />
      </SettingRow>
      <SettingRow stacked label="Poster size" hint="How big titles are in the Library grid">
        <Segmented options={SIZE_OPTIONS} value={gridSize} label="Poster size" onChange={setGridSize} />
      </SettingRow>
      <SettingRow label="Streaming region" hint="Which country's services show on title pages">
        <SelectPill
          label="Streaming region"
          title="Streaming region"
          value={region}
          options={countries.map((c) => ({ value: c.code, label: c.name }))}
          onChange={(v) => void updateSettings({ watchProviderCountry: v })}
        />
      </SettingRow>
      <SettingRow stacked label="My services" hint="Pick what you subscribe to, then filter your library down to it">
        {ALL_SERVICES.map((service) => (
          <Chip key={service} label={service} active={owned.includes(service)} onPress={() => toggleService(service)} />
        ))}
      </SettingRow>
    </SettingsSection>
  );
}
