import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Pill } from '@/components/ui/Pill';
import { Text } from '@/components/ui/Text';
import type { ThresholdScope } from '@/lib/streakThresholds';
import { colors } from '@/theme/colors';

import { SettingRow, SettingsSection } from './SettingsSection';
import { Stepper } from './Stepper';
import { useStreakThresholds } from './useStreakThresholds';

export function StatsGoalsSection() {
  const t = useStreakThresholds();
  const [error, setError] = useState<string | null>(null);

  const apply = async (scope: ThresholdScope) => {
    setError(null);
    try {
      await t.apply(scope);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save');
    }
  };

  return (
    <SettingsSection title="Stats goals" hint="A week counts toward your streak when you reach these">
      <SettingRow label="Films a week">
        <Stepper value={t.movie} min={1} max={50} noun="films" onChange={t.setMovie} />
      </SettingRow>
      <SettingRow label="Episodes a week">
        <Stepper value={t.tv} min={1} max={100} noun="episodes" onChange={t.setTv} />
      </SettingRow>
      {t.dirty ? (
        <SettingRow
          stacked
          label="Apply the new goal"
          hint="Weeks you already watched through were measured against the old number. How far back should the new one reach?">
          <Pill variant="primary" label="From this week on" onPress={() => void apply('from-now')} />
          <Pill label="Whole history" onPress={() => void apply('whole-history')} />
          <Pressable accessibilityRole="button" onPress={t.discard} hitSlop={8}>
            <Text style={{ fontSize: 13, color: colors.muted }}>Undo</Text>
          </Pressable>
          {error ? (
            <View style={{ width: '100%' }}>
              <Text accessibilityRole="alert" style={{ fontSize: 12, color: colors.warn }}>
                {error}
              </Text>
            </View>
          ) : null}
        </SettingRow>
      ) : null}
    </SettingsSection>
  );
}
