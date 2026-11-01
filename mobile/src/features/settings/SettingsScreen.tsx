import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { PageHeader } from '@/components/ui/PageHeader';
import { Text } from '@/components/ui/Text';
import { useUserSettings } from '@/hooks/useUserSettings';
import { colors } from '@/theme/colors';

import { AccountSection } from './AccountSection';
import { DataSection } from './DataSection';
import { LibrarySection } from './LibrarySection';
import { PrivacySection } from './PrivacySection';
import { ProfileSection } from './ProfileSection';
import { StatsGoalsSection } from './StatsGoalsSection';

export function SettingsScreen() {
  const { error } = useUserSettings();
  return (
    <Screen contentStyle={{ gap: 28 }}>
      <PageHeader title="Settings" subtitle="Changes save as you make them and sync to your other devices" />
      {error ? (
        <Text accessibilityRole="alert" style={styles.notice}>
          Could not load your settings. Showing defaults.
        </Text>
      ) : null}
      <ProfileSection />
      <LibrarySection />
      <PrivacySection />
      <StatsGoalsSection />
      <DataSection />
      <AccountSection />
      <View style={styles.foot}>
        <Text style={styles.footText}>Mnemo</Text>
        <Text style={styles.footText}>This product uses the TMDB API but is not endorsed or certified by TMDB.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  notice: { fontSize: 13, color: colors.warn },
  foot: { gap: 4, paddingTop: 8 },
  footText: { fontSize: 11, color: colors.dim },
});
