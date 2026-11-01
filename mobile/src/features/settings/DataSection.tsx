import { StyleSheet, View } from 'react-native';

import { Pill } from '@/components/ui/Pill';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';

import { SettingRow, SettingsSection } from './SettingsSection';
import { useDataTools } from './useDataTools';
import { useMetadataRefresh } from './useMetadataRefresh';

export function DataSection() {
  const refresh = useMetadataRefresh();
  const data = useDataTools();
  const { progress } = refresh;
  const pct = progress && progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  let note = refresh.note ?? `Posters, cast and episode lists for all ${refresh.withTmdb} titles`;
  if (progress) note = `Updating ${progress.done} of ${progress.total} titles from TMDB. You can keep using Mnemo.`;

  return (
    <SettingsSection title="Data" hint="Metadata comes from TMDB; your data is yours">
      <SettingRow
        label="Refresh metadata"
        hint={
          <View style={{ gap: 8 }}>
            <Text style={styles.hint}>{note}</Text>
            {progress ? (
              <View
                accessibilityRole="progressbar"
                accessibilityLabel="Refresh progress"
                accessibilityValue={{ min: 0, max: 100, now: pct }}
                style={styles.bar}>
                <View style={[styles.fill, { width: `${pct}%` }]} />
              </View>
            ) : null}
          </View>
        }>
        {refresh.refreshing ? (
          <Pill label="Stop" onPress={refresh.stop} />
        ) : (
          <Pill label="Refresh all" disabled={refresh.withTmdb === 0} onPress={() => void refresh.start()} />
        )}
      </SettingRow>
      <SettingRow
        stacked
        label="Import and export"
        hint={data.message ?? 'Library, episodes, ratings and notes as one JSON file. Export shares the JSON; to import, copy a backup first.'}>
        <Pill label={data.busy ? 'Importing…' : 'Import from clipboard'} disabled={data.busy} onPress={() => void data.importClipboard()} />
        <Pill label="Export JSON" onPress={() => void data.exportJson()} />
      </SettingRow>
    </SettingsSection>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 12, lineHeight: 16, color: colors.dim },
  bar: { height: 3, borderRadius: 2, backgroundColor: colors.hover, overflow: 'hidden' },
  fill: { height: 3, borderRadius: 2, backgroundColor: colors.primary },
});
