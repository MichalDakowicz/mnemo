import { Screen } from '@/components/layout/Screen';
import { Text } from '@/components/ui/Text';
import { StatsBody } from '@/features/stats/StatsBody';
import { StatsHeader } from '@/features/stats/StatsHeader';
import { useStatsPage } from '@/features/stats/useStatsPage';
import { colors } from '@/theme/colors';

// No title header: the period chips lead the page. A friend's stats keep a one-line name so it is clear whose they are.
export default function StatsScreen() {
  const s = useStatsPage();
  return (
    <Screen>
      {s.viewing && s.friendName ? <Text style={{ marginBottom: 8, fontSize: 14, color: colors.dim }}>{`${s.friendName}'s stats`}</Text> : null}
      <StatsHeader options={s.options} period={s.period} onPeriod={s.setPeriod} />
      <StatsBody s={s} />
    </Screen>
  );
}
