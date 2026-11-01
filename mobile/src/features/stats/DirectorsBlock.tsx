import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Text } from '@/components/ui/Text';
import type { DirectorSlice } from '@/lib/stats';
import { plural } from '@/lib/statsView';
import { colors } from '@/theme/colors';

import { StatsBlock, StatsNote } from './StatsBlock';
import { usePersonImages } from './usePersonImages';

type Props = { directors: DirectorSlice[]; averages: Map<string, number> };

export function DirectorsBlock({ directors, averages }: Props) {
  const router = useRouter();
  const photos = usePersonImages(directors.map((d) => d.id));
  return (
    <StatsBlock title="Most watched directors">
      {directors.length === 0 ? (
        <StatsNote>No directors on these titles yet.</StatsNote>
      ) : (
        <View>
          {directors.map((d, i) => {
            const avg = averages.get(d.name);
            const id = d.id;
            return (
              <Pressable
                key={d.name}
                accessibilityRole={id != null ? 'button' : undefined}
                disabled={id == null}
                onPress={id != null ? () => router.push(`/person/${id}`) : undefined}
                style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.wash }]}>
                <Text mono style={styles.rank}>{i + 1}</Text>
                <Avatar name={d.name} pfp={id != null ? photos[id] : null} size={44} />
                <View style={styles.text}>
                  <Text numberOfLines={1} style={styles.name}>{d.name}</Text>
                  <Text numberOfLines={1} style={styles.meta}>
                    {plural(d.count, 'title')}
                    {avg ? ` · avg ★ ${avg.toFixed(1)}` : ''}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </StatsBlock>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, borderRadius: 10 },
  rank: { width: 16, fontSize: 12, color: colors.dim },
  text: { flex: 1, minWidth: 0, gap: 2 },
  name: { fontSize: 14, fontWeight: '600' },
  meta: { fontSize: 12, color: colors.dim },
});
