import { useUserSettings } from '@/hooks/useUserSettings';
import { COUNTRIES } from '@/lib/countries';
import { ALL_SERVICES } from '@/lib/services';

import { useLibraryPrefs, type GridSize } from '@/store/libraryPrefs';

import { Segmented } from './Segmented';
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
    <SettingsSection id="library" title="Library" hint="What sits above your titles and where they stream">
      <SettingRow label="Recently added" hint="Titles you added lately, above the grid">
        <label>
          <span className="sr">Days to count as recent</span>
          <select
            className="select"
            value={settings.recentlyAddedDays}
            disabled={!settings.showRecentlyAdded}
            onChange={(e) => void updateSettings({ recentlyAddedDays: Number(e.target.value) })}
          >
            {days.map((d) => (
              <option key={d} value={d}>Last {d} days</option>
            ))}
          </select>
        </label>
        <Switch checked={settings.showRecentlyAdded} label="Show Recently added" onChange={(v) => void updateSettings({ showRecentlyAdded: v })} />
      </SettingRow>
      <SettingRow label="Poster size" hint="How big titles are in the Library grid">
        <Segmented options={SIZE_OPTIONS} value={gridSize} label="Poster size" onChange={setGridSize} />
      </SettingRow>
      <SettingRow label="Streaming region" hint="Which country's services show on title pages">
        <label>
          <span className="sr">Streaming region</span>
          <select className="select" value={region} onChange={(e) => void updateSettings({ watchProviderCountry: e.target.value })}>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </label>
      </SettingRow>
      <SettingRow label="My services" hint="Pick what you subscribe to, then filter your library down to it">
        <div className="chip-group" role="group" aria-label="My services">
          {ALL_SERVICES.map((service) => (
            <button key={service} type="button" className="chip" aria-pressed={owned.includes(service)} onClick={() => toggleService(service)}>
              {service}
            </button>
          ))}
        </div>
      </SettingRow>
    </SettingsSection>
  );
}
