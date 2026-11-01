import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';

import { StreakCalendar } from './StreakCalendar';
import type { useStatsPage } from './useStatsPage';

type Model = NonNullable<ReturnType<typeof useStatsPage>['model']>;

const LEVELS = [0.06, 0.3, 0.6, 1] as const;

function Swatch({ color, opacity }: { color: string; opacity: number }) {
  return <View style={[styles.swatch, { backgroundColor: color, opacity }]} />;
}

export function StreakSection({ streaks, ownGoals }: { streaks: Model['streaks']; ownGoals: boolean }) {
  const router = useRouter();
  return (
    <View accessibilityLabel="Streaks" style={{ marginBottom: 20 }}>
      {streaks.map(({ key, ...s }) => (
        <StreakCalendar key={key} {...s} />
      ))}
      <View style={styles.legend}>
        <Text style={styles.small}>Less</Text>
        {LEVELS.map((o, i) => <Swatch key={i} color={i === 0 ? colors.white : colors.text} opacity={o} />)}
        <Text style={styles.small}>More</Text>
        <View style={{ width: 10 }} />
        <Swatch color={colors.good} opacity={1} />
        <Text style={styles.small}>Busy day in a week that met the goal</Text>
      </View>
      {ownGoals ? (
        <Text style={[styles.small, { marginTop: 8 }]}>
          Goals live in{' '}
          <Text accessibilityRole="link" onPress={() => router.push('/settings')} style={[styles.small, styles.link]}>Settings</Text>
        </Text>
      ) : (
        <Text style={[styles.small, { marginTop: 8 }]}>Default goals, theirs are private</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  legend: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 5 },
  swatch: { width: 11, height: 11, borderRadius: 2 },
  small: { fontSize: 12, color: colors.dim },
  link: { color: colors.text, textDecorationLine: 'underline' },
});
